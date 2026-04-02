import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { login, reset } from '../features/auth/authSlice'

function Login() {
    const [formData, setFormData] = useState({ email: '', password: '' })
    const { email, password } = formData

    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { user, isLoading, isError, isSuccess, message } = useSelector((state) => state.auth)

   useEffect(() => {
  if (isError) alert(message)

  // Redirect when logged in
  if (isSuccess || user) {
    navigate('/tickets')
  }

  dispatch(reset())
}, [isError, isSuccess, user, message, navigate, dispatch])
    const onChange = (e) => setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))

    const onSubmit = (e) => {
        e.preventDefault()
        dispatch(login({ email, password }))
    }

    return (
  <div className="min-h-screen flex items-center justify-center bg-gray-100">
    <div className="bg-white shadow-lg rounded w-full max-w-md p-8">
      <h1 className="text-3xl font-bold mb-2 text-center">🔐 Sign In</h1>
      <p className="text-gray-500 text-center mb-6">
        Login to your SupportDesk account
      </p>

      <form onSubmit={onSubmit} className="space-y-4">
        <input
          type="email"
          name="email"
          value={email}
          onChange={onChange}
          placeholder="Email"
          className="w-full border p-3 rounded"
          required
        />

        <input
          type="password"
          name="password"
          value={password}
          onChange={onChange}
          placeholder="Password"
          className="w-full border p-3 rounded"
          required
        />

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-indigo-600 text-white py-3 rounded"
        >
          {isLoading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>

      <p className="text-center text-sm mt-4">
        Don’t have an account?{' '}
        <Link to="/register" className="text-indigo-600 font-medium">
          Register
        </Link>
      </p>
    </div>
  </div>
)
}

export default Login
