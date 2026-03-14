from fastapi import FastAPI
from app.database import engine, Base
from app.routers import auth

app = FastAPI(title="Stock Portfolio Tracker")

# Create tables on startup
Base.metadata.create_all(bind=engine)

# Register routers
app.include_router(auth.router)

@app.get("/")
def root():
    return {"message": "Stock Portfolio Tracker API is running"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}