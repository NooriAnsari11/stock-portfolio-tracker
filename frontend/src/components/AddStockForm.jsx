import { useState } from 'react'
import { addStock } from '../services/api'


function AddStockForm({token,onStockAdded})
{
    const[ticker,setTicker] = useState('')
    const[shares,setShares] = useState(' ')
    const[buyPrice,setBuyPrice] = useState(' ')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        if (!ticker.trim()) {
        setError('Please enter a ticker symbol')
        return
    }
    if (parseInt(shares) <= 0 || !shares) {
        setError('Shares must be greater than 0')
        return
    }
    if (parseFloat(buyPrice) <= 0 || !buyPrice) {
        setError('Buy price must be greater than 0')
        return
    }
        try {
    await addStock(token, ticker, parseInt(shares), parseFloat(buyPrice))
    setTicker('')
    setShares('')
    setBuyPrice('')
    onStockAdded()
        }
        catch (err) {
            setError(err.response?.data?.detail || 'Failed to add stock')
        } finally {
            setLoading(false)
        }
    }
return (
        <div>
            <h1>Stock Portfolio Tracker</h1>
            <h2>Register</h2>

            {error && <p style={{ color: 'red' }}>{error}</p>}

            <form onSubmit={handleSubmit}>
                <div>
                    <label>Ticker</label>
                    <input
                        type="text"
                        value={ticker}
                        onChange={(e) => setTicker(e.target.value.toUpperCase())}
                        required
                    />
                </div>
                <div>
                    <label>Shares</label>
                    <input
                        type="text"
                        value={shares}
                        onChange={(e) => setShares(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Buy Price</label>
                    <input
                        type="text"
                        value={buyPrice}
                        onChange={(e) => setBuyPrice(e.target.value)}
                        required
                    />
                </div>

                <button type="submit" disabled={loading}>
                {loading ? 'Adding...' : 'Add Stock'} 
</button>
            </form>

           
        </div>
    )
}
export default AddStockForm