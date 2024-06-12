from fastapi import APIRouter

router = APIRouter(prefix="/auth", tags=["Auth"])

@router.get("/hello")
async def hello():
    return {"hello": "world"}