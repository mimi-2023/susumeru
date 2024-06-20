from typing import Annotated
from fastapi import APIRouter, status, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from api.cruds import progresses as progresses_cruds 
from api.cruds.auth import get_current_user
from api.schemas.auth import CurrentUser
from api.schemas.progresses import AddProgressRequest, AddProgressResponse
from api.database import get_db


router = APIRouter(prefix="/progresses", tags=["Progresses"])

DbDependency = Annotated[AsyncSession, Depends(get_db)]
UserDependency = Annotated[CurrentUser, Depends(get_current_user)]


@router.post(
    "/{book_id}", response_model=AddProgressResponse, status_code=status.HTTP_200_OK
    )
async def add_progress(
    db: DbDependency, user: UserDependency, book_id: int, request: AddProgressRequest
    ):
    return await progresses_cruds.add_progress(db, user.id, book_id, request)