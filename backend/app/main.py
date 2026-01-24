from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
import time

# Create tables
from app.db.session import engine, Base
from app.api.endpoints import auth, chat
from app.core.config import settings

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

@app.middleware("http")
async def log_requests(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = (time.time() - start_time) * 1000
    print(f"DEBUG: {request.method} {request.url.path} - {response.status_code} ({process_time:.2f}ms)")
    return response

# Set CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(auth.router, prefix=f"{settings.API_V1_STR}/auth", tags=["Authentication"])
app.include_router(chat.router, prefix=f"{settings.API_V1_STR}/chat", tags=["Chat"])

@app.get("/")
async def root():
    return {"message": "Welcome to AI Tutor 2.0 API - Beast Mode Active 🚀"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}
