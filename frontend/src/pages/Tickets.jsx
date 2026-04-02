import { useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { getTickets, reset } from '../features/tickets/ticketSlice'

// Badge color by status
const statusColors = {
    new: '#6366f1',
    open: '#3b82f6',
    'in-progress': '#f59e0b',
    resolved: '#22c55e',
    closed: '#6b7280',
}

// Badge color by priority
const priorityColors = {
    low: '#22c55e',
    medium: '#f59e0b',
    high: '#ef4444',
}

function Tickets() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { user } = useSelector((state) => state.auth)
    const { tickets, isLoading, isError, message } = useSelector((state) => state.tickets)

    useEffect(() => {
        if (isError) console.error(message)
        if (!user) { navigate('/login'); return }
        dispatch(getTickets())
        return () => dispatch(reset())
    }, [user, navigate, isError, message, dispatch])

    if (isLoading)
  return (
    <div className="flex justify-center items-center h-60 text-gray-500">
      Loading tickets...
    </div>
  )

return (
  <div className="p-8 max-w-6xl mx-auto">
    {/* Header */}
    <div className="flex justify-between items-center mb-8">
      <h1 className="text-3xl font-bold text-slate-800">
        🎫 {user?.role === 'customer' ? 'My Tickets' : 'All Tickets'}
      </h1>

      {user?.role === 'customer' && (
        <Link
          to="/new-ticket"
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md shadow"
        >
          + New Ticket
        </Link>
      )}
    </div>

    {/* Empty State */}
    {tickets.length === 0 ? (
      <div className="bg-white shadow rounded-lg p-10 text-center">
        <p className="text-gray-500 mb-4">No tickets found.</p>
        {user?.role === 'customer' && (
          <Link
            to="/new-ticket"
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md"
          >
            Create your first ticket
          </Link>
        )}
      </div>
    ) : (
      /* Table Card */
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <table className="min-w-full text-left">
          <thead className="bg-slate-100 border-b text-sm text-gray-600">
            <tr>
              <th className="p-4">Date</th>
              <th className="p-4">Product</th>
              <th className="p-4">Priority</th>
              <th className="p-4">Status</th>
              {user?.role !== 'customer' && <th className="p-4">Customer</th>}
              <th className="p-4">Action</th>
            </tr>
          </thead>

          <tbody className="text-sm">
            {tickets.map((ticket) => (
              <tr key={ticket._id} className="border-b hover:bg-slate-50">
                <td className="p-4">
                  {new Date(ticket.createdAt).toLocaleDateString()}
                </td>

                <td className="p-4 font-medium text-slate-700">
                  {ticket.product}
                </td>

                <td className="p-4">
                  <span
                    className={`px-3 py-1 rounded-full text-white text-xs
                      ${
                        ticket.priority === 'low'
                          ? 'bg-green-500'
                          : ticket.priority === 'medium'
                          ? 'bg-yellow-500'
                          : 'bg-red-500'
                      }`}
                  >
                    {ticket.priority}
                  </span>
                </td>

                <td className="p-4">
                  <span
                    className={`px-3 py-1 rounded-full text-white text-xs
                      ${
                        ticket.status === 'new'
                          ? 'bg-indigo-500'
                          : ticket.status === 'open'
                          ? 'bg-blue-500'
                          : ticket.status === 'in-progress'
                          ? 'bg-yellow-500'
                          : ticket.status === 'resolved'
                          ? 'bg-green-500'
                          : 'bg-gray-500'
                      }`}
                  >
                    {ticket.status}
                  </span>
                </td>

                {user?.role !== 'customer' && (
                  <td className="p-4">{ticket.user?.name || 'N/A'}</td>
                )}

                <td className="p-4">
                  <Link
                    to={`/ticket/${ticket._id}`}
                    className="text-indigo-600 font-semibold hover:underline"
                  >
                    View →
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </div>
)
}

export default Tickets
