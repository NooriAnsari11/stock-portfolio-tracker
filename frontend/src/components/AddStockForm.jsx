import { useState } from 'react'
import { addStock } from '../services/api'


function AddStockForm({token,onStockAdded})
{
    const[ticker,setTicker] = useState('')
    const[shares,setShares] = useState('')
    const[buyPrice,setBuyPrice] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
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
    setLoading(true)
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
    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h2 className="text-lg font-semibold text-white mb-4">
            Add Stock
        </h2>

        {error && (
            <div className="bg-red-500 bg-opacity-20 border border-red-500 text-red-400 px-4 py-3 rounded-lg mb-4">
                {error}
            </div>
        )}

        <form onSubmit={handleSubmit} className="flex gap-3 items-end">
            <div className="flex-1">
                <label className="block text-gray-400 text-sm mb-1">
                    Ticker
                </label>
                <input
                    type="text"
                    value={ticker}
                    onChange={(e) => setTicker(e.target.value.toUpperCase())}
                    placeholder="AAPL"
                    required
                    className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-500"
                />
            </div>

            <div className="flex-1">
                <label className="block text-gray-400 text-sm mb-1">
                    Shares
                </label>
                <input
                    type="number"
                    value={shares}
                    onChange={(e) => setShares(e.target.value)}
                    placeholder="10"
                    required
                    className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-500"
                />
            </div>

            <div className="flex-1">
                <label className="block text-gray-400 text-sm mb-1">
                    Buy Price ($)
                </label>
                <input
                    type="number"
                    step="0.01"
                    value={buyPrice}
                    onChange={(e) => setBuyPrice(e.target.value)}
                    placeholder="182.50"
                    required
                    className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-500"
                />
            </div>

            <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2.5 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
            >
                {loading ? 'Adding...' : '+ Add Stock'}
            </button>
        </form>
    </div>
)

}
export default AddStockForm