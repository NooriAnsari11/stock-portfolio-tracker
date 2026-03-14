from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv
import os

# Load variables from your .env file
load_dotenv()

# Grab the connection string
DATABASE_URL = os.getenv("DATABASE_URL")

# Create the connection pool
engine = create_engine(DATABASE_URL)

# Each instance of SessionLocal will be a database session
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class that all your table models will inherit from
Base = declarative_base()

# This function hands out database sessions to your endpoints
# and makes sure they're always closed properly when done
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()