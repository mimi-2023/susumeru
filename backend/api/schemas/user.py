from pydantic import BaseModel, Field, ConfigDict


class UserRequest(BaseModel):
    name: str = Field(examples=["new_name"])


class UserResponse(BaseModel):
    name: str = Field(examples=["user1"])
    email: str = Field(examples=["user1@example.com"])

    model_config = ConfigDict(from_attributes=True)
