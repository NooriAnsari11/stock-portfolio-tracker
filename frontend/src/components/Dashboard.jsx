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

return (
<div>
    <pre>{JSON.stringify(portfolio, null, 2)}</pre>
    <div>
        <h1>My Portfolio</h1>
        <button onClick={handleLogout}>Logout</button>
    </div>

    {/* Portfolio summary - only show if portfolio has data*/}
    {portfolio &&(
        <div>
            <p>Total Invested: ${portfolio.total_invested}</p>
            <p>Current Value: ${portfolio.total_current_value}</p>
            <p>Gain/Loss: ${portfolio.total_gain_loss}({portfolio.total_gain_loss_pct}%)</p>
        </div>

    )}
    <AddStockForm token={token} onStockAdded={fetchPortfolio} />
    <AIAnalysis token={token} />
    {portfolio && portfolio.items.length > 0
    ? <PortfolioTable
        items={portfolio.items}
        token={token}
        onStockRemoved={fetchPortfolio}
      />
    : <p>No stocks yet. Add one above!</p>
}
    </div>
    

)
}

export default Dashboard