from datetime import date
from pydantic import BaseModel, Field, ConfigDict, model_validator


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


class AddProgressRequest(BaseModel):
    record_date: date = Field(examples=["2024-06-10"])
    current_page: int = Field(gt=0, examples=[30])


class AddProgressResponse(BaseModel):
    book_id: int = Field(examples=[1])
    record_date: date = Field(examples=["2024-06-10"])
    current_page: int = Field(gt=0, examples=[30])
    progressed_pages: int = Field(gt=0, examples=[10])

    model_config = ConfigDict(from_attributes=True)


class UpdateTargetRequest(BaseModel):
    target_pages: int = Field(gt=0, examples=[20])


class UpdateTargetResponse(BaseModel):
    book_id: int = Field(examples=[1])
    start_date: date = Field(examples=["2024-06-12"])
    target_pages: int = Field(gt=0, examples=[20])
    start_page: int = Field(gt=0, examples=[30])

    model_config = ConfigDict(from_attributes=True)

