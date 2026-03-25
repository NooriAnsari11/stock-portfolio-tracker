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
    <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-700">
            <h2 className="text-lg font-semibold text-white">Your Holdings</h2>
        </div>

        <div className="overflow-x-auto">
            <table className="w-full">
                <thead>
                    <tr className="bg-gray-750 border-b border-gray-700">
                        <th className="text-left text-gray-400 text-sm font-medium px-6 py-3">Ticker</th>
                        <th className="text-left text-gray-400 text-sm font-medium px-6 py-3">Company</th>
                        <th className="text-right text-gray-400 text-sm font-medium px-6 py-3">Shares</th>
                        <th className="text-right text-gray-400 text-sm font-medium px-6 py-3">Buy Price</th>
                        <th className="text-right text-gray-400 text-sm font-medium px-6 py-3">Current Price</th>
                        <th className="text-right text-gray-400 text-sm font-medium px-6 py-3">Gain/Loss</th>
                        <th className="text-right text-gray-400 text-sm font-medium px-6 py-3">Gain/Loss %</th>
                        <th className="text-right text-gray-400 text-sm font-medium px-6 py-3">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map((item, index) => (
                        <tr
                            key={item.id}
                            className={`border-b border-gray-700 hover:bg-gray-750 transition duration-150 ${index % 2 === 0 ? 'bg-gray-800' : 'bg-gray-850'}`}
                        >
                            <td className="px-6 py-4">
                                <span className="font-bold text-blue-400">
                                    {item.ticker}
                                </span>
                            </td>
                            <td className="px-6 py-4 text-gray-300">
                                {item.company_name}
                            </td>
                            <td className="px-6 py-4 text-right text-white">
                                {item.shares}
                            </td>
                            <td className="px-6 py-4 text-right text-white">
                                ${item.buy_price.toFixed(2)}
                            </td>
                            <td className="px-6 py-4 text-right text-white">
                                ${item.current_price.toFixed(2)}
                            </td>
                            <td className={`px-6 py-4 text-right font-medium ${item.gain_loss >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                {item.gain_loss >= 0 ? '+' : ''}${item.gain_loss.toFixed(2)}
                            </td>
                            <td className={`px-6 py-4 text-right font-medium ${item.gain_loss_pct >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                {item.gain_loss_pct >= 0 ? '+' : ''}{item.gain_loss_pct.toFixed(2)}%
                            </td>
                            <td className="px-6 py-4 text-right">
                                <button
                                    onClick={() => handleRemove(item.id)}
                                    className="bg-red-500 bg-opacity-20 hover:bg-opacity-40 text-white-400 border border-red-500 border-opacity-30 px-3 py-1 rounded-lg text-sm transition duration-200"
                                >
                                    Remove
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
)
}

export default PortfolioTable