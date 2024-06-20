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

