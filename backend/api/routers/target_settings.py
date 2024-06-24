from typing import Annotated
from fastapi import APIRouter, status, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from api.cruds import target_settings as target_settings_cruds 
from api.cruds.auth import get_current_user
from api.schemas.auth import CurrentUser
from api.schemas.target_settings import UpdateTargetRequest, UpdateTargetResponse
from api.database import get_db


router = APIRouter(prefix="/target_settings", tags=["Target_settings"])

DbDependency = Annotated[AsyncSession, Depends(get_db)]
UserDependency = Annotated[CurrentUser, Depends(get_current_user)]


@router.put(
    "/{book_id}", response_model=UpdateTargetResponse, status_code=status.HTTP_200_OK
    )
async def update_target(
    db: DbDependency, user: UserDependency, book_id: int, request: UpdateTargetRequest
    ):
    return await target_settings_cruds.update_target_setting(db, user.id, book_id, request)