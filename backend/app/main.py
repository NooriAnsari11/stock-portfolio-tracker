from fastapi import FastAPI
from app.database import engine, Base
from app.routers import auth
from fastapi.middleware.cors import CORSMiddleware
from app.routers import auth, portfolio



app = FastAPI(title="Stock Portfolio Tracker")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # React dev server
    allow_credentials=True,
    allow_methods=["*"],   # allows GET, POST, DELETE etc
    allow_headers=["*"],   # allows Authorization header
)

# Create tables on startup
Base.metadata.create_all(bind=engine)

# Register routers
app.include_router(auth.router)
app.include_router(portfolio.router)

@app.get("/")
def root():
    return {"message": "Stock Portfolio Tracker API is running"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}