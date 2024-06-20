from fastapi import FastAPI
from api.routers import auth, user, books, progresses, target_settings

app = FastAPI()

app.include_router(auth.router)
app.include_router(user.router)
app.include_router(books.router)
app.include_router(progresses.router)
app.include_router(target_settings.router)