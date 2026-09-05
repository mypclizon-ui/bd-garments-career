from datetime import datetime

from sqlalchemy import Column, DateTime, Integer, String, Text

from .database import Base


class GovJob(Base):
    __tablename__ = "gov_jobs"

    id = Column(Integer, primary_key=True)
    title = Column(String(255), nullable=False)
    ministry = Column(String(255), nullable=True)
    department = Column(String(255), nullable=True)
    location = Column(String(120), nullable=True)
    vacancy_count = Column(Integer, default=1)
    grade = Column(String(50), nullable=True)           # e.g. "Grade 5"
    salary_scale = Column(String(120), nullable=True)
    education = Column(Text, nullable=True)
    description = Column(Text, nullable=True)
    deadline = Column(String(20), nullable=True)
    source_url = Column(String(500), nullable=True)      # official govt. notice link
    created_at = Column(DateTime, default=datetime.utcnow)