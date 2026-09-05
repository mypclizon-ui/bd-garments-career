from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict


class GovJobOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    title: str
    ministry: Optional[str] = None
    department: Optional[str] = None
    location: Optional[str] = None
    vacancy_count: int
    grade: Optional[str] = None
    salary_scale: Optional[str] = None
    education: Optional[str] = None
    description: Optional[str] = None
    deadline: Optional[str] = None
    source_url: Optional[str] = None
    created_at: datetime