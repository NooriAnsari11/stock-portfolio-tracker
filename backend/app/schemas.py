from pydantic import BaseModel, EmailStr
from datetime import datetime

# What the frontend sends when registering
class UserRegister(BaseModel):
    email: str
    username: str
    password: str
    

# What the frontend sends when logging in
class UserLogin(BaseModel):
    email: str
    password: str

# What the API returns after login (never return the password)
class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"

# What the API returns when showing user info
class UserResponse(BaseModel):
    id: int
    email: str
    username: str

    class Config:
        from_attributes = True

class PortfolioItem(BaseModel):
    id: int
    ticker: str
    company_name: str
    shares: int
    buy_price: float
    added_at: datetime
    current_price: float
    current_value: float    # shares × current_price
    invested_value: float   # shares × buy_price
    gain_loss: float        # current_value - invested_value
    gain_loss_pct: float    # percentage gain or loss

    class Config:
        from_attributes = True

class PortfolioResponse(BaseModel):
    items: List[PortfolioItem]
    total_invested: float
    total_current_value: float
    total_gain_loss: float
    total_gain_loss_pct: float

class PortfolioAddRequest(BaseModel):
    ticker: str
    shares: int
    buy_price: float