from pydantic import BaseModel, Field, ConfigDict


class SignupRequest(BaseModel):
    name: str = Field(examples=["user1"])
    email: str = Field(examples=["user1@example.com"])
    password: str = Field(examples=["user1"])


class SignupResponse(BaseModel):
    name: str = Field(examples=["user1"])
    email: str = Field(examples=["user1@example.com"])

    model_config = ConfigDict(from_attributes=True)


class Token(BaseModel):
    access_token: str
    token_type: str


class CurrentUser(BaseModel):
    id: str
    name: str
    email: str

    model_config = ConfigDict(from_attributes=True)
