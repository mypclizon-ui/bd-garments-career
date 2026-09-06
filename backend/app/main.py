from fastapi import Depends, FastAPI, HTTPException, Header, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from . import models, schemas
from .database import Base, engine, get_db
from .config import settings

Base.metadata.create_all(bind=engine)
app = FastAPI(
    title="Bangladesh Government Job Portal",
    description="A separate website for public-sector and government jobs.",
)

# Allow the standalone gov frontend and the main portal to call this API.
# The gov portal is served at https://bdgarmentscareer.com/govt.jobs (same
# origin as the main domain), plus localhost during development.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


def require_admin(x_admin_key: str | None = Header(default=None)):
    """Simple admin gate for write operations (POST/PATCH)."""
    expected = getattr(settings, "admin_api_key", "change-me")
    if x_admin_key != expected:
        raise HTTPException(status_code=401, detail="Invalid admin key")


@app.get("/jobs", response_model=list[schemas.GovJobOut])
def list_jobs(
    q: str | None = None,
    ministry: str | None = None,
    location: str | None = None,
    db: Session = Depends(get_db),
):
    query = db.query(models.GovJob)
    if q:
        query = query.filter(models.GovJob.title.ilike(f"%{q}%"))
    if ministry:
        query = query.filter(models.GovJob.ministry.ilike(f"%{ministry}%"))
    if location:
        query = query.filter(models.GovJob.location.ilike(f"%{location}%"))
    return query.order_by(models.GovJob.created_at.desc()).all()


@app.get("/jobs/{job_id}", response_model=schemas.GovJobOut)
def get_job(job_id: int, db: Session = Depends(get_db)):
    job = db.get(models.GovJob, job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    return job


@app.post("/jobs", response_model=schemas.GovJobOut, status_code=201, dependencies=[Depends(require_admin)])
def create_job(payload: schemas.GovJobCreate, db: Session = Depends(get_db)):
    """Admin-only endpoint to publish a new govt job circular."""
    job = models.GovJob(**payload.model_dump())
    db.add(job)
    db.commit()
    db.refresh(job)
    return job


@app.get("/filters/meta")
def filter_meta(db: Session = Depends(get_db)):
    def distinct(col):
        return [r[0] for r in db.query(col).distinct().all() if r[0]]

    return {
        "ministries": distinct(models.GovJob.ministry),
        "locations": distinct(models.GovJob.location),
    }


@app.on_event("startup")
def seed_gov_jobs():
    db = next(get_db())
    try:
        if db.query(models.GovJob).count() == 0:
            samples = [
                ("Assistant Commissioner of Taxes", "Ministry of Finance", "National Board of Revenue", "Dhaka", 22, "Grade 5", "৳35,500–56,000/mo", "Bachelor's in Economics/Finance", "For NBR tax cadre recruitment.", "2026-10-15", "https://www.nbr.gov.bd"),
                ("Police Sub-Inspector (SI)", "Ministry of Home Affairs", "Bangladesh Police", "Dhaka & Chattogram", 120, "Grade 8", "৳25,000–40,000/mo", "Bachelor's degree, 27–30 years, 5'6\" height", "Physical + written exam.", "2026-09-30", "https://www.police.gov.bd"),
                ("Assistant Teacher (English)", "Ministry of Education", "Directorate of Secondary Education", "Nationwide", 350, "Grade 9", "৳24,000–38,000/mo", "B.Ed & BA (English), 21–35 years", "Secondary school teaching positions.", "2026-10-05", "https://www.moedu.gov.bd"),
                ("Sub Assistant Engineer (Civil)", "Ministry of Local Government", "LGED", "Nationwide", 40, "Grade 10", "৳16,000–28,000/mo", "Diploma in Civil Engineering", "Rural road & infrastructure works.", "2026-09-25", "https://www.lged.gov.bd"),
                ("Medical Officer (MBBS)", "Ministry of Health", "DGHS", "Dhaka", 55, "Grade 6", "৳40,000–55,000/mo", "MBBS with BMDC registration", "Public hospital posts.", "2026-10-20", "https://www.dghs.gov.bd"),
                ("Revenue Officer", "Ministry of Finance", "Land Reclamation Board", "Chattogram", 12, "Grade 8", "৳24,000–38,000/mo", "Bachelor's in any discipline", "Land and revenue management.", "2026-10-10", "https://www.land.gov.bd"),
            ]
            for row in samples:
                db.add(models.GovJob(
                    title=row[0], ministry=row[1], department=row[2], location=row[3],
                    vacancy_count=row[4], grade=row[5], salary_scale=row[6],
                    education=row[7], description=row[8], deadline=row[9], source_url=row[10],
                ))
            db.commit()
    finally:
        db.close()


@app.get("/health")
def health():
    return {"status": "ok", "service": "bdgc-gov-portal"}