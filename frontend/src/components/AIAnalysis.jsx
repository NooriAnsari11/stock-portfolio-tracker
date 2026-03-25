import { useState } from 'react'
import { analysePortfolio } from '../services/api'

function AIAnalysis({ token }) {
    const [analysis, setAnalysis] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleAnalyse = async () => {
        setLoading(true)
        setError('')
        try {
            const data = await analysePortfolio(token)
            setAnalysis(data.analysis)
        } catch (err) {
            setError(err.response?.data?.detail || 'Failed to analyse portfolio')
        } finally {
            setLoading(false)
        }
    }

    return (
    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">

        {/* Header row */}
        <div className="flex justify-between items-center mb-4">
            <div>
                <h3 className="text-lg font-semibold text-white">
                    🤖 AI Portfolio Analysis
                </h3>
                <p className="text-gray-400 text-sm mt-1">
                    Get a personalised analysis of your holdings
                </p>
            </div>
            <button
                onClick={handleAnalyse}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2.5 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
            >
                {loading ? '⏳ Analysing...' : '✨ Analyse My Portfolio'}
            </button>
        </div>

        {/* Error */}
        {error && (
            <div className="bg-red-500 bg-opacity-20 border border-red-500 text-red-400 px-4 py-3 rounded-lg">
                {error}
            </div>
        )}

        {/* Analysis result */}
        {analysis && (
            <div className="bg-gray-700 rounded-xl p-5 border border-gray-600 mt-4">
                <h4 className="text-blue-400 font-semibold mb-3">
                    Analysis Result
                </h4>
                <p className="text-gray-300 leading-relaxed whitespace-pre-line">
                    {analysis}
                </p>
            </div>
        )}

        {/* Empty state — before user clicks */}
        {!analysis && !error && !loading && (
            <div className="text-center py-6">
                <p className="text-gray-500 text-sm">
                    Click the button above to get AI-powered insights on your portfolio
                </p>
            </div>
        )}
    </div>
)
}

export default AIAnalysis