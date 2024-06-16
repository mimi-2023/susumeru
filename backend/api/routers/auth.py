from datetime import timedelta
from typing import Annotated
import os
from fastapi import APIRouter, status, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession
from api.cruds import auth as auth_cruds
from api.schemas import auth as auth_schemas
from api.database import get_db

ACCESS_TOKEN_EXPIRE_MINUTES = os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES")

router = APIRouter(prefix="/auth", tags=["Auth"])

DbDependency = Annotated[AsyncSession, Depends(get_db)]
FormDependency = Annotated[OAuth2PasswordRequestForm, Depends()]


@router.post(
    "/signup", response_model=auth_schemas.SignupResponse, status_code=status.HTTP_201_CREATED
)
async def signup(db: DbDependency, request: auth_schemas.SignupRequest):
    return await auth_cruds.create_user(db, request)


@router.post("/signin", status_code=status.HTTP_200_OK, response_model=auth_schemas.Token)
async def signin(db: DbDependency, form_data: FormDependency):
    # authenticate_userはemailとpasswordで認証する関数だが、OAuth2PasswordRequestFormはemail属性がない
    # →認証時はusernameとしてemailを入力する
    user = await auth_cruds.authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(status_code=401, detail="Incorrect email or password")
    
    token = auth_cruds.create_access_token(user.id, timedelta(minutes=int(ACCESS_TOKEN_EXPIRE_MINUTES)))

    return auth_schemas.Token(access_token=token, token_type="bearer")
