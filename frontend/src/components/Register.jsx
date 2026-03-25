import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { registerUser } from '../services/api'

function Register() {
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')
        try {
            await registerUser(email, username, password)
            navigate('/')  // redirect to login after registration
        } catch (err) {
            setError('Registration failed. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="bg-gray-800 p-8 rounded-xl shadow-lg w-full max-w-md">
           <h1 className="text-3xl font-bold text-blue-500 text-center mb-2">
    📈 Stock Portfolio Tracker
</h1>  <h2 className="text-gray-400 text-center mb-8">Register</h2>

            {error && (
                <div className="bg-red-500 bg-opacity-20 border border-red-500 text-red-400 px-4 py-3 rounded-lg mb-6">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">Username</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
                     
                    />
                </div>
                <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">Email</label>
                     <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
                        placeholder="john.doe@example.com"
                    />
                </div>
                <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
                     
                    />
                </div>

               <div className="mt-6">
    <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
    >
        {loading ? 'Registering...' : 'Register'}
    </button>
</div>
            </form>

            <p className="text-gray-400 text-center mt-6">
                Already have an account? <Link to="/" className="text-blue-400 hover:text-blue-300 font-medium">Login</Link>
            </p>
        </div>
        </div>
    )
}

export default Register