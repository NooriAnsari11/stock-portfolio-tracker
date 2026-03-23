import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { loginUser } from '../services/api'

function Login({ setToken }) {
    // State for form fields
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    // useNavigate lets us redirect programmatically
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()  // stops page from refreshing on submit
        setLoading(true)
        setError('')

        try {
            const data = await loginUser(email, password)
            setToken(data.access_token)  // save token in App state
            navigate('/dashboard')        // redirect to dashboard
        } catch (err) {
            setError('Invalid email or password')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div>
            <h1>Stock Portfolio Tracker</h1>
            <h2>Login</h2>

            {/* Show error if login fails */}
            {error && <p style={{ color: 'red' }}>{error}</p>}

            <form onSubmit={handleSubmit}>
                <div>
                    <label>Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label>Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                <button type="submit" disabled={loading}>
                    {loading ? 'Logging in...' : 'Login'}
                </button>
            </form>

            <p>
                Don't have an account? <Link to="/register">Register</Link>
            </p>
        </div>
    )
}

export default Login
