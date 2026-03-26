import { getPortfolio } from '../services/api'
import { useState, useEffect } from 'react'
import AddStockForm from './AddStockForm'
import PortfolioTable from './PortfolioTable'
import AIAnalysis from './AIAnalysis'
function Dashboard({ token, setToken }) {
    const [ portfolio , setPortfolio] = useState(null)
    const [ error, setError ] = useState('')
    const [ loading, setLoading ] = useState(true)

    const fetchPortfolio = async() =>{
        setLoading(true)
        try{
            const data =   await getPortfolio(token)
            setPortfolio(data)
        }
        catch(err)
        {
            setError("Unable to load Dashboard")
        }
        finally{
            setLoading(false)
        }
    }

useEffect(() => {
    fetchPortfolio()
},[])

const handleLogout = () => {
    setToken(null)
}

if (loading) return <div>Loading Portfolio....</div>
if(error) return <div style={{color:'red'}}>{error}</div>

if (loading) return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <p className="text-gray-400 text-lg">Loading Portfolio....</p>
    </div>
)

if (error) return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <p className="text-red-400 text-lg">{error}</p>
    </div>
)

return (
    <div className="min-h-screen bg-gray-900 text-white">

        {/* Navbar */}
        <div className="bg-gray-800 border-b border-gray-700 px-6 py-4 flex justify-between items-center">
            <h1 className="text-xl font-bold text-blue-400">
                📈 Portfolio Tracker
            </h1>
            <button
                onClick={handleLogout}
                className="bg-gray-700 hover:bg-gray-600 text-gray-300 px-4 py-2 rounded-lg text-sm transition duration-200"
            >
                Logout
            </button>
        </div>

        {/* Main content */}
        <div className="max-w-6xl mx-auto px-6 py-8">

            {/* Summary cards */}
          {/* Summary cards - only show if portfolio has items */}
{portfolio && portfolio.items && portfolio.items.length > 0 && (
    <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
            <p className="text-gray-400 text-sm mb-1">Total Invested</p>
            <p className="text-2xl font-bold text-white">
                ${portfolio.total_invested.toFixed(2)}
            </p>
        </div>
        <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
            <p className="text-gray-400 text-sm mb-1">Current Value</p>
            <p className="text-2xl font-bold text-white">
                ${portfolio.total_current_value.toFixed(2)}
            </p>
        </div>
        <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
            <p className="text-gray-400 text-sm mb-1">Total Gain / Loss</p>
            <p className={`text-2xl font-bold ${portfolio.total_gain_loss >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                ${portfolio.total_gain_loss.toFixed(2)} ({portfolio.total_gain_loss_pct.toFixed(2)}%)
            </p>
        </div>
    </div>
)}

            {/* Add stock form */}
            <div className="mb-8">
                <AddStockForm token={token} onStockAdded={fetchPortfolio} />
            </div>

            {/* Portfolio table */}
            <div className="mb-8">
                {portfolio && portfolio.items.length > 0
                    ? <PortfolioTable
                        items={portfolio.items}
                        token={token}
                        onStockRemoved={fetchPortfolio}
                      />
                    : <div className="bg-gray-800 rounded-xl p-8 text-center border border-gray-700">
                        <p className="text-gray-400">
                            No stocks yet. Add one above!
                        </p>
                      </div>
                }
            </div>

            {/* AI Analysis */}
            <AIAnalysis token={token} />

        </div>
    </div>
)}

export default Dashboard