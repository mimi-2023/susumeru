from datetime import date
from pydantic import BaseModel, Field, ConfigDict


# Progressがない日でも、progressed_pages=0にしてデータを作成する
class ProgressData(BaseModel):
    record_date: date = Field(examples=["2024-06-10"])
    progressed_pages: int = Field(ge=0, examples=[10])
    target_pages: int = Field(ge=0, examples=[10])


class GetProgressResponse(BaseModel):
    book_id: int = Field(gt=0, examples=[1])
    week_progresses: list[ProgressData] # = Field(examples=[
        # [{ProgressData.record_date: "2024-06-10", 
        #   ProgressData.progressed_pages: 10, 
        #   ProgressData.target_pages: 10}]
        # ])
    
    model_config = ConfigDict(from_attributes=True)


class AddProgressRequest(BaseModel):
    current_page: int = Field(gt=0, examples=[30])


class AddProgressResponse(BaseModel):
    book_id: int = Field(examples=[1])
    record_date: date = Field(examples=["2024-06-10"])
    current_page: int = Field(gt=0, examples=[30])
    progressed_pages: int = Field(gt=0, examples=[10])

    model_config = ConfigDict(from_attributes=True)