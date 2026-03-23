from pathlib import Path
from dotenv import load_dotenv
import os
from groq import Groq

# Explicitly point to .env file — works regardless of run directory
load_dotenv(dotenv_path=Path(__file__).resolve().parent.parent.parent / ".env")

client = Groq(api_key=os.getenv("GROQ_API_KEY"))


def analyse_portfolio(portfolio_data: dict) -> str:
    # Build the prompt
    prompt = _build_prompt(portfolio_data)
    
    # Call Groq
    message = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        max_tokens=500,
        messages=[{"role": "user", "content": prompt}]
    )
    
    return message.choices[0].message.content


def _build_prompt(data: dict) -> str:
    # Header
    prompt = f"""You are a financial advisor analysing a stock portfolio for {data['username']}.

Portfolio Summary:
- Total Invested: ${data['total_invested']}
- Current Value: ${data['total_current_value']}
- Overall Gain/Loss: ${data['total_gain_loss']} ({data['total_gain_loss_pct']}%)

Holdings:
"""
    # Add each stock
    for item in data['items']:
        prompt += f"""
- {item['ticker']} ({item['company_name']})
  Shares: {item['shares']}
  Invested: ${item['invested_value']} | Current: ${item['current_value']}
  Gain/Loss: ${item['gain_loss']} ({item['gain_loss_pct']}%)
  Portfolio Weight: {item['weight_pct']}%
"""

    prompt += """
Please provide:
1. Concentration risk analysis
2. Performance summary  
3. One specific actionable recommendation

Keep it concise, friendly and in plain English. Maximum 150 words.
"""
    return prompt