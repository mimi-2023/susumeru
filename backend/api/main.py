from fastapi import FastAPI
from api.routers import auth, user, books

app = FastAPI()

app.include_router(auth.router)
app.include_router(user.router)
app.include_router(books.router)