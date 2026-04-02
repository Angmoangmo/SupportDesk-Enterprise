import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import CustomerDashboard from './CustomerDashboard'
import AgentDashboard from './AgentDashboard'

function Home() {
  const { user } = useSelector((state) => state.auth)
  //  ROLE BASED DASHBOARD
if (user) {
  if (user.role === 'customer') return <CustomerDashboard />
  return <AgentDashboard />
}
  return (
    <div className="min-h-[80vh] p-10 bg-slate-100">
      {/* Hero */}
      <div className="text-center max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-slate-800 mb-4">🎫 SupportDesk</h1>
        <p className="text-gray-600 text-lg mb-8">
          Professional customer support management system. Submit tickets,
          track issues, and get help fast.
        </p>

        <div className="flex justify-center gap-4">
          {user ? (
            <>
              <Link
                to="/new-ticket"
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-md shadow"
              >
                + Create New Ticket
              </Link>
              <Link
                to="/tickets"
                className="border border-indigo-600 text-indigo-600 px-6 py-3 rounded-md"
              >
                View My Tickets
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/register"
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-md shadow"
              >
                Get Started
              </Link>
              <Link
                to="/login"
                className="border border-indigo-600 text-indigo-600 px-6 py-3 rounded-md"
              >
                Sign In
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Features */}
      <div className="grid md:grid-cols-3 gap-8 mt-16 max-w-6xl mx-auto">
        <div className="bg-white p-8 rounded-lg shadow text-center">
          <div className="text-3xl mb-4">⚡</div>
          <h3 className="font-semibold text-lg mb-2">Fast Response</h3>
          <p className="text-gray-600">
            Our agents respond to tickets quickly so you get unblocked fast.
          </p>
        </div>

        <div className="bg-white p-8 rounded-lg shadow text-center">
          <div className="text-3xl mb-4">🔒</div>
          <h3 className="font-semibold text-lg mb-2">Secure</h3>
          <p className="text-gray-600">
            JWT-protected routes ensure only you can access your tickets.
          </p>
        </div>

        <div className="bg-white p-8 rounded-lg shadow text-center">
          <div className="text-3xl mb-4">📊</div>
          <h3 className="font-semibold text-lg mb-2">Track Everything</h3>
          <p className="text-gray-600">
            Full status tracking from new → open → in-progress → resolved.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Home