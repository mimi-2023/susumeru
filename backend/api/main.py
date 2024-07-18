from fastapi import FastAPI
from api.routers import auth, user, books, progresses, target_settings
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
   CORSMiddleware,
   allow_origins = ["http://localhost:5173"],
   allow_methods = ["*"],
   allow_headers = ["*"]
)

app.include_router(auth.router)
app.include_router(user.router)
app.include_router(books.router)
app.include_router(progresses.router)
app.include_router(target_settings.router)