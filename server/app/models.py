# Este arquivo contém os modelos de estudante e matérias para
# que seja feita a validação antes de enviar para o banco de dados
from typing import Dict, List, Optional

from pydantic import BaseModel, Field

class SubjectModel(BaseModel):
    subject_id: str = Field(..., min_length=2)
    grade: Optional[Dict]

class StudentModel(BaseModel):
    name: str = Field(...)
    student_id: int = Field(..., gt=0)
    subjects: Optional[List[SubjectModel]] = Field([])
