from datetime import date
from typing import List
from pydantic import BaseModel, Field, ConfigDict, model_validator


class GetBookResponse(BaseModel):
    book_id: int = Field(gt=0, examples=[1])
    title: str = Field(examples=["book1"])
    first_page: int = Field(gt=0, examples=[20])
    last_page: int = Field(gt=0, examples=[150])
    latest_target: int = Field(gt=0, examples=[10]) 
    latest_target_startdate: date = Field(examples=["2024-06-10"])
    latest_target_startpage: int = Field(gt=0, examples=[20]) 
    latest_current_page: int = Field(gt=0, examples=[10])

    model_config = ConfigDict(from_attributes=True)


# Progressがない日でも、progressed_pages=0にしてデータを作成する
class ProgressData(BaseModel):
    record_date: date = Field(examples=["2024-06-10"])
    progressed_pages: int = Field(ge=0, examples=[10])
    target_pages: int = Field(gt=0, examples=[10])


class GetProgressResponse(BaseModel):
    book_id: int = Field(gt=0, examples=[1])
    week_progresses: list[ProgressData] = Field()
    
    model_config = ConfigDict(from_attributes=True)


class RegisterRequest(BaseModel):
    title: str = Field(examples=["book1"])
    first_page: int = Field(gt=0, examples=[20])
    last_page: int = Field(gt=0, examples=[150])
    target_pages: int = Field(gt=0, examples=[10])

    # 開始ページと最終ページの差が、目標ページ数以上であることを確認
    @model_validator(mode="after")
    def validate_pages(self):
        if self.last_page - self.first_page < self.target_pages:
            raise ValueError("ページ指定が不正です")
        return self


class RegisterResponse(BaseModel):
    title: str = Field(examples=["book1"])
    first_page: int = Field(gt=0, examples=[20])
    last_page: int = Field(gt=0, examples=[150])

    model_config = ConfigDict(from_attributes=True)

