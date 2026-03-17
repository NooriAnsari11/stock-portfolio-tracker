import yfinance as yf
def is_valid_ticker(ticker: str) -> bool:
    # Placeholder for actual ticker validation logic
    try:
        stock = yf.Ticker(ticker)
        if stock.info.get("currentPrice") is not None:
            return True
        return False
    except Exception:
        return False
    
def get_stock_data(ticker: str) -> dict:
    try:
        stock=yf.Ticker(ticker)
        info=stock.info
        return {
            "current_price" : info.get("currentPrice") or info.get("regularMarketPrice"),
            "company_name" : info.get("longName") or info.get("shortName"),
            "change_percent": info.get("regularMarketChangePercent")
        }
    except Exception as e:
        print(f"Error fetching data for {ticker}: {e}")
        return {
            "current_price": None,
            "company_name": None,
            "changePercent": None
        }