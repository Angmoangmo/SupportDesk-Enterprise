import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { register, reset } from '../features/auth/authSlice'

function Register() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        password2: '',
    })
    const { name, email, password, password2 } = formData

    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { user, isLoading, isError, isSuccess, message } = useSelector((state) => state.auth)

    useEffect(() => {
        if (isError) alert(message)
        if (isSuccess || user) navigate('/')
        dispatch(reset())
    }, [isError, isSuccess, user, message, navigate, dispatch])

    const onChange = (e) => setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))

    const onSubmit = (e) => {
        e.preventDefault()
        if (password !== password2) {
            alert('Passwords do not match')
            return
        }
        dispatch(register({ name, email, password }))
    }

    return (
  <div className="min-h-screen flex items-center justify-center bg-gray-100">
    <div className="bg-white shadow-lg rounded w-full max-w-md p-8">
      <h1 className="text-3xl font-bold mb-2 text-center">📝 Register</h1>
      <p className="text-gray-500 text-center mb-6">
        Create your SupportDesk account
      </p>

      <form onSubmit={onSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          value={name}
          onChange={onChange}
          placeholder="Full Name"
          className="w-full border p-3 rounded"
          required
        />

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
        <input
  type="password"
  name="password2"
  value={password2}
  onChange={onChange}
  placeholder="Confirm Password"
  className="w-full border p-3 rounded"
  required
/>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-indigo-600 text-white py-3 rounded"
        >
          {isLoading ? 'Creating...' : 'Register'}
        </button>
      </form>

      <p className="text-center text-sm mt-4">
        Already have an account?{' '}
        <Link to="/login" className="text-indigo-600 font-medium">
          Sign In
        </Link>
      </p>
    </div>
  </div>
)
}

export default Register
