from datetime import date
from pydantic import BaseModel, Field, ConfigDict


class UpdateTargetRequest(BaseModel):
    target_pages: int = Field(gt=0, examples=[20])


class UpdateTargetResponse(BaseModel):
    book_id: int = Field(examples=[1])
    start_date: date = Field(examples=["2024-06-12"])
    target_pages: int = Field(gt=0, examples=[20])
    start_page: int = Field(gt=0, examples=[30])

    model_config = ConfigDict(from_attributes=True)