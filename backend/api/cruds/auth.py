from datetime import datetime, timedelta
import os
import hashlib
import base64
from typing import Annotated
from uuid import uuid4
from fastapi import status, Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from api.database import get_db
from api.schemas import auth as auth_schemas
from api.models import User

ALGORITHM = os.getenv("ALGORITHM")
SECRET_KEY = os.getenv("SECRET_KEY")

oauth2_schema = OAuth2PasswordBearer(tokenUrl="/auth/signin")

DbDependency = Annotated[AsyncSession, Depends(get_db)]


# ユーザー登録
async def create_user(db: AsyncSession, request: auth_schemas.SignupRequest):
    # 既に登録されているユーザーかを確認
    DBuser = await select_by_email(db, request.email)
    if DBuser is not None:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT, detail="登録済みのメールアドレスです"
            )
    
    # ユーザーidをuuidで生成
    new_uuid = str(uuid4())
    # passwordのハッシュ化に使用するsaltを生成
    salt = base64.b64encode(os.urandom(32)).decode()
    hashed_password = get_hashed_password(salt, request.password)
    new_user = User(
        id=new_uuid, name=request.name, email=request.email, password=hashed_password, salt=salt
    )
    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)

    return auth_schemas.SignupResponse.model_validate(new_user)


# emailとpasswordでのユーザー認証
async def authenticate_user(db: AsyncSession, email: str, password: str):
    user = await select_by_email(db, email)
    if not user:
        return None
    if get_hashed_password(user.salt, password) != user.password:
        return None

    return user


# メールアドレスでユーザーを取得
async def select_by_email(db: AsyncSession, email):
    result = await db.scalars(select(User).filter(User.email == email))
    return result.first()


# passwordをsaltを用いてハッシュ化
def get_hashed_password(salt, password):
    hashed_password = hashlib.pbkdf2_hmac(
        "sha256", password.encode(), salt.encode(), 10000
    ).hex()
    return hashed_password


# ユーザーIDと期限からJWTトークンを生成
def create_access_token(user_id: int, expires_delta: timedelta):
    expires = datetime.now() + expires_delta
    payload = {"sub": user_id, "exp": expires}
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)


# JWTトークンをデコードして得たIDで、DBからユーザー情報（ID,name,password）を取得する。
async def get_current_user(db: DbDependency, token: Annotated[str, Depends(oauth2_schema)]):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="認証できません",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("sub")
        if user_id is None:
            raise credentials_exception
        
    except JWTError:
        raise credentials_exception

    result = await db.scalars(select(User).filter(User.id == user_id))
    user = result.first()
    if user is None:
        raise credentials_exception
    return auth_schemas.CurrentUser.model_validate(user)

    
