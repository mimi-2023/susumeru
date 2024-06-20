from datetime import date
from pydantic import BaseModel, Field, ConfigDict


class AddProgressRequest(BaseModel):
    record_date: date = Field(examples=["2024-06-10"])
    current_page: int = Field(gt=0, examples=[30])


class AddProgressResponse(BaseModel):
    book_id: int = Field(examples=[1])
    record_date: date = Field(examples=["2024-06-10"])
    current_page: int = Field(gt=0, examples=[30])
    progressed_pages: int = Field(gt=0, examples=[10])

    model_config = ConfigDict(from_attributes=True)