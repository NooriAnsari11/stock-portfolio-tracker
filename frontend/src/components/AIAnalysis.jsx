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
        <div>
            <h3>AI Portfolio Analysis</h3>
            <button onClick={handleAnalyse} disabled={loading}>
                {loading ? 'Analysing...' : 'Analyse My Portfolio'}
            </button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {analysis && (
                <div>
                    <h4>Analysis:</h4>
                    <p>{analysis}</p>
                </div>
            )}
        </div>
    )
}

export default AIAnalysis