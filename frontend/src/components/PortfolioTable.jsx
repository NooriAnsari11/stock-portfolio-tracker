import { removeStock } from '../services/api'

function PortfolioTable({ items, token, onStockRemoved }) {
    const handleRemove = async (itemId) => {
        try{
            await removeStock(token,itemId)
            onStockRemoved()
        }
        catch(err)
        {
            alert('Failed to remove Stock')
        }
        // call removeStock here
        // then call onStockRemoved
    }

    return (
        <table>
            <thead>
                <tr>
                    <th>Ticker</th>
                    <th>Company</th>
                    <th>Shares</th>
                    <th>Buy Price</th>
                    <th>Current Price</th>
                    <th>Gain/Loss</th>
                    <th>Action</th>
                </tr>
            </thead>
             <tbody>
                {items.map(item => (
                    <tr key={item.id}>
                        <td>{item.ticker}</td>
                        <td>{item.company_name}</td>
                        <td>{item.shares}</td>
                        <td>${item.buy_price}</td>
                        <td>${item.current_price}</td>
                        <td style={{ color: item.gain_loss >= 0 ? 'green' : 'red' }}>
                            ${item.gain_loss}
                        </td>
                        <td style={{ color: item.gain_loss_pct >= 0 ? 'green' : 'red' }}>
                            {item.gain_loss_pct}%
                        </td>
                        <td>
                            <button onClick={() => handleRemove(item.id)}>
                                Remove
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    )
}

export default PortfolioTable