import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { getTicket, closeTicket,
  updateTicket,   //  add this
  reset as resetTickets
} from '../features/tickets/ticketSlice'
import { getNotes, addNote, reset as resetNotes, noteAdded } from '../features/notes/noteSlice'
import io from 'socket.io-client'

const statusColors = {
    new: '#6366f1',
    open: '#3b82f6',
    'in-progress': '#f59e0b',
    resolved: '#22c55e',
    closed: '#6b7280',
}

function Ticket() {
    const [noteText, setNoteText] = useState('')
    const { ticketId } = useParams()
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const { ticket, isLoading: ticketLoading, isError, message } = useSelector((state) => state.tickets)
    const { notes, isLoading: notesLoading } = useSelector((state) => state.notes)
    const { user } = useSelector((state) => state.auth)

    // 🟢 Connect Socket.io
    useEffect(() => {
        if (!ticketId) return;

        // Connect to your server (URL matches the backend config API / proxy)
        const socket = io('http://localhost:5000');
        
        socket.emit('join_ticket', ticketId);

        socket.on('new_note', (note) => {
            dispatch(noteAdded(note));
        });

        return () => {
            socket.disconnect();
        }
    }, [ticketId, dispatch])

    useEffect(() => {
        if (isError) { alert(message); return }
        dispatch(getTicket(ticketId))
        dispatch(getNotes(ticketId))
        return () => {
            dispatch(resetTickets())
            dispatch(resetNotes())
        }
    }, [ticketId, isError, message, dispatch])

    const onNoteSubmit = (e) => {
        e.preventDefault()
        if (!noteText.trim()) return
        dispatch(addNote({ noteText, ticketId }))
        setNoteText('')
    }

    const onCloseTicket = () => {
        if (window.confirm('Close this ticket? This action cannot be undone.')) {
            dispatch(closeTicket(ticketId))
            navigate('/tickets')
        }
    }
    const onStatusChange = (e) => {
      dispatch(updateTicket({ ticketId, status: e.target.value }))
    }

   const onPriorityChange = (e) => {
     dispatch(updateTicket({ ticketId, priority: e.target.value }))
}

    if (ticketLoading || notesLoading) return <div className="loading">Loading ticket...</div>
    if (!ticket) return null
  return (
  <div className="max-w-5xl mx-auto p-8">
    {/* Header */}
    <div className="flex justify-between items-start mb-6">
      <div>
        <h1 className="text-3xl font-bold">
          Ticket #{ticket._id?.slice(-6).toUpperCase()}
        </h1>
        <p className="text-gray-500">
          Submitted: {new Date(ticket.createdAt).toLocaleString()}
        </p>
      </div>

      {/* Customer can only close */}
{user?.role === 'customer' && ticket.status !== 'closed' && (
  <button
    onClick={onCloseTicket}
    className="bg-red-600 text-white px-4 py-2 rounded"
  >
    Close Ticket
  </button>
)}

{/* Agent Controls */}
{user?.role !== 'customer' && (
  <div className="flex gap-3">
    <select
      value={ticket.status}
      onChange={onStatusChange}
      className="border p-2 rounded"
    >
      <option value="new">new</option>
      <option value="open">open</option>
      <option value="in-progress">in-progress</option>
      <option value="resolved">resolved</option>
      <option value="closed">closed</option>
    </select>

    <select
      value={ticket.priority}
      onChange={onPriorityChange}
      className="border p-2 rounded"
    >
      <option value="low">low</option>
      <option value="medium">medium</option>
      <option value="high">high</option>
    </select>
  </div>
)}
    </div>

    {/* Status Badge */}
    <div className="mb-6">
      <span
        className="text-white px-3 py-1 rounded text-sm"
        style={{ backgroundColor: statusColors[ticket.status] }}
      >
        {ticket.status}
      </span>
    </div>

    {/* Info Grid */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div className="bg-white shadow p-4 rounded">
        <p className="text-gray-500 text-sm">Product</p>
        <p className="font-semibold">{ticket.product}</p>
      </div>

      <div className="bg-white shadow p-4 rounded">
        <p className="text-gray-500 text-sm">Priority</p>
        <p className="font-semibold capitalize">{ticket.priority}</p>
      </div>

      {user?.role !== 'customer' && ticket.user && (
        <div className="bg-white shadow p-4 rounded">
          <p className="text-gray-500 text-sm">Customer</p>
          <p className="font-semibold">
            {ticket.user.name} ({ticket.user.email})
          </p>
        </div>
      )}
    </div>

    {/* Description */}
    <div className="bg-white shadow p-6 rounded mb-8">
      <h3 className="font-semibold mb-2">Issue Description</h3>
      <p className="text-gray-700">{ticket.description}</p>
    </div>

    {/* Notes */}
    <div>
      <h2 className="text-2xl font-bold mb-4">💬 Notes ({notes.length})</h2>

      {notes.length === 0 ? (
        <p className="text-gray-500">No notes yet.</p>
      ) : (
        <div className="space-y-4 mb-6">
          {notes.map((note) => (
            <div
              key={note._id}
              className={`p-4 rounded shadow ${
                note.isStaff ? 'bg-blue-50' : 'bg-gray-50'
              }`}
            >
              <div className="flex justify-between text-sm text-gray-500 mb-2">
                <span>
                  {note.isStaff ? '👨‍💼 Support Agent' : '👤 Customer'}
                </span>
                <span>
                  {new Date(note.createdAt).toLocaleString()}
                </span>
              </div>
              <p>{note.text}</p>
            </div>
          ))}
        </div>
      )}

      {/* Add Note */}
      {ticket.status !== 'closed' && (
        <form onSubmit={onNoteSubmit} className="space-y-3">
          <textarea
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            placeholder="Add update or information..."
            className="w-full border p-3 rounded"
            rows={3}
          />
          <button className="bg-indigo-600 text-white px-4 py-2 rounded">
            Submit Note
          </button>
        </form>
      )}
    </div>
  </div>
)
}

export default Ticket
