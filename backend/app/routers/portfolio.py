from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.routers.auth import get_current_user
from app import models ,schemas
from fastapi import HTTPException, status
from jose import jwt, JWTError
from app.routers.auth import SECRET_KEY, ALGORITHM
from app.services.market_data import is_valid_ticker, get_stock_data
from app.services.ai_services import analyse_portfolio

router = APIRouter(prefix="/portfolio", tags=["Portfolio"])

@router.get("/")
def get_portfolio(current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    existing_portfolio = db.query(models.Portfolio).filter(models.Portfolio.user_id == current_user.id).all()
    # Fixed — always returns same shape
    if not existing_portfolio:
        return {
        "items": [],
        "total_invested": 0.0,
        "total_current_value": 0.0,
        "total_gain_loss": 0.0,
        "total_gain_loss_pct": 0.0
        }
    
        # Build response with current stock data    
    portfolio_items = []
    total_invested = 0.0
    total_current_value = 0.0
    for item in existing_portfolio:
        stock_data = get_stock_data(item.ticker)
        current_price = stock_data["current_price"] or 0.0
        current_value = item.shares * current_price
        invested_value = item.shares * item.buy_price
        gain_loss = current_value - invested_value
        gain_loss_pct = (gain_loss / invested_value) * 100 if invested_value > 0 else 0.0

        portfolio_items.append(schemas.PortfolioItem(
            id=item.id,
            ticker=item.ticker,
            company_name=item.company_name,
            shares=item.shares,
            buy_price=item.buy_price,
            added_at=item.added_at,
            current_price=current_price,
            current_value=current_value,
            invested_value=invested_value,
            gain_loss=gain_loss,
            gain_loss_pct=gain_loss_pct
        ))
        total_invested += invested_value
        total_current_value += current_value
        total_gain_loss = total_current_value - total_invested
        total_gain_loss_pct = (total_gain_loss / total_invested) * 100 if total_invested > 0 else 0.0

    return {
        "message": f"Hello {current_user.username}",
        "items": portfolio_items,
        "total_invested": total_invested,
        "total_current_value": total_current_value,
        "total_gain_loss": round(total_gain_loss, 2),
        "total_gain_loss_pct": round(total_gain_loss_pct, 2)
    }

@router.delete("/remove/{item_id}")
def remove_stock(item_id: int, current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    existing_item=db.query(models.Portfolio).filter(
        models.Portfolio.id==item_id,
        models.Portfolio.user_id==current_user.id).first()
    if not existing_item:
        raise HTTPException(status_code=404, detail="Stock not found in your portfolio")
    db.delete(existing_item)
    db.commit()
    return {"message": f"Removed {existing_item.ticker} from your portfolio"}

@router.post("/add", status_code=201)
def add_stock(
    item: schemas.PortfolioAddRequest,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # 1. Validate ticker
    if not is_valid_ticker(item.ticker):
        raise HTTPException(status_code=400, detail="Invalid ticker symbol")

    # 2. Check duplicate
    existing = db.query(models.Portfolio).filter(
        models.Portfolio.user_id == current_user.id,
        models.Portfolio.ticker == item.ticker.upper()
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Stock already in your portfolio")

    # 3. Fetch stock data
    stock_data = get_stock_data(item.ticker)
    if stock_data["current_price"] is None:
        raise HTTPException(status_code=400, detail="Could not fetch stock data")

    # 4. Create and save
    new_entry = models.Portfolio(
        user_id=current_user.id,
        ticker=item.ticker.upper(),
        company_name=stock_data["company_name"],
        shares=item.shares,
        buy_price=item.buy_price
    )
    db.add(new_entry)
    db.commit()
    db.refresh(new_entry)

    return {"message": f"Added {item.shares} shares of {item.ticker.upper()} to your portfolio"}




@router.get("/analyse")
def analyse(
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # 1. fetch portfolio same as GET /
    existing_portfolio = db.query(models.Portfolio).filter(
        models.Portfolio.user_id == current_user.id
    ).all()

    if not existing_portfolio:
        raise HTTPException(status_code=400, detail="Your portfolio is empty")

    # 2. build portfolio_data dict with live prices
    items = []
    total_invested = 0.0
    total_current_value = 0.0

    for item in existing_portfolio:
        stock_data = get_stock_data(item.ticker)
        current_price = stock_data["current_price"] or 0.0
        current_value = round(item.shares * current_price, 2)
        invested_value = round(item.shares * item.buy_price, 2)
        gain_loss = round(current_value - invested_value, 2)
        gain_loss_pct = round(
            (gain_loss / invested_value) * 100 if invested_value > 0 else 0.0, 2
        )
        total_invested += invested_value
        total_current_value += current_value

        items.append({
            "ticker": item.ticker,
            "company_name": item.company_name,
            "shares": item.shares,
            "invested_value": invested_value,
            "current_value": current_value,
            "gain_loss": gain_loss,
            "gain_loss_pct": gain_loss_pct,
            "weight_pct": 0.0  # calculate after loop
        })

    # 3. calculate weight for each stock
    for item in items:
        item["weight_pct"] = round(
            (item["current_value"] / total_current_value) * 100 if total_current_value > 0 else 0.0, 2
        )

    total_gain_loss = round(total_current_value - total_invested, 2)
    total_gain_loss_pct = round(
        (total_gain_loss / total_invested) * 100 if total_invested > 0 else 0.0, 2
    )

    portfolio_data = {
        "username": current_user.username,
        "total_invested": round(total_invested, 2),
        "total_current_value": round(total_current_value, 2),
        "total_gain_loss": total_gain_loss,
        "total_gain_loss_pct": total_gain_loss_pct,
        "items": items
    }

    # 4. call AI service
    analysis = analyse_portfolio(portfolio_data)
    return {"analysis": analysis}