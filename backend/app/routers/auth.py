from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
import bcrypt
from jose import jwt
from datetime import datetime, timedelta
import os

from app.database import get_db
from app import models, schemas

router = APIRouter(prefix="/auth", tags=["Authentication"])

SECRET_KEY = os.getenv("SECRET_KEY", "changethisinsecret")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24


def hash_password(password: str) -> str:
    # bcrypt works with bytes directly — no passlib needed
    password_bytes = password.encode("utf-8")
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password_bytes, salt)
    return hashed.decode("utf-8")  # store as string in DB


def verify_password(plain: str, hashed: str) -> bool:
    return bcrypt.checkpw(
        plain.encode("utf-8"),
        hashed.encode("utf-8")
    )


def create_token(data: dict) -> str:
    payload = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    payload.update({"exp": expire})
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)


@router.post("/register", response_model=schemas.UserResponse, status_code=201)
def register(user_data: schemas.UserRegister, db: Session = Depends(get_db)):

    existing = db.query(models.User).filter(
        models.User.email == user_data.email
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    existing_username = db.query(models.User).filter(
        models.User.username == user_data.username
    ).first()
    if existing_username:
        raise HTTPException(status_code=400, detail="Username already taken")

    new_user = models.User(
        email=user_data.email,
        username=user_data.username,
        hashed_password=hash_password(user_data.password)
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user


@router.post("/login", response_model=schemas.TokenResponse)
def login(credentials: schemas.UserLogin, db: Session = Depends(get_db)):

    user = db.query(models.User).filter(
        models.User.email == credentials.email
    ).first()

    if not user or not verify_password(credentials.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    token = create_token({"sub": str(user.id), "username": user.username})
    return {"access_token": token, "token_type": "bearer"}