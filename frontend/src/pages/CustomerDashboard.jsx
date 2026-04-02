import { Link } from 'react-router-dom'

function CustomerDashboard() {
  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">👤 Customer Dashboard</h1>

      <div className="grid md:grid-cols-2 gap-6">
        <Link to="/new-ticket" className="p-6 bg-white shadow rounded hover:shadow-lg">
          <h2 className="text-xl font-semibold mb-2">➕ Create New Ticket</h2>
          <p className="text-gray-600">Report a new issue with your product.</p>
        </Link>

        <Link to="/tickets" className="p-6 bg-white shadow rounded hover:shadow-lg">
          <h2 className="text-xl font-semibold mb-2">🎫 My Tickets</h2>
          <p className="text-gray-600">Track all your submitted tickets.</p>
        </Link>
      </div>
    </div>
  )
}

export default CustomerDashboard