import { Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { logout, reset } from '../features/auth/authSlice'

function Header() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)

  const onLogout = () => {
    dispatch(logout())
    dispatch(reset())
    navigate('/')
  }

  return (
    <header className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between shadow-md">
  <Link to="/" className="text-2xl font-bold text-indigo-400">
    🎫 SupportDesk
  </Link>

  <nav className="flex items-center gap-4">
    {user ? (
      <>
        <span className="text-sm text-gray-300">
          {user?.role?.toUpperCase() || 'USER'} • {user?.name || 'Guest'}
        </span>

        <Link
          to="/tickets"
          className="bg-indigo-600 hover:bg-indigo-700 px-3 py-1 rounded text-sm"
        >
          My Tickets
        </Link>

        <Link
          to="/new-ticket"
          className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded text-sm"
        >
          New Ticket
        </Link>

        <button
          onClick={onLogout}
          className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm"
        >
          Logout
        </button>
      </>
    ) : (
      <>
        <Link
          to="/login"
          className="bg-indigo-600 hover:bg-indigo-700 px-3 py-1 rounded text-sm"
        >
          Login
        </Link>
        <Link
          to="/register"
          className="border border-indigo-400 px-3 py-1 rounded text-sm"
        >
          Register
        </Link>
      </>
    )}
  </nav>
</header>
  )
}

export default Header