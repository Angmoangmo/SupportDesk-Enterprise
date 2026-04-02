import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { createTicket, reset } from '../features/tickets/ticketSlice'

function NewTicket() {
    const [product, setProduct] = useState('iPhone')
    const [priority, setPriority] = useState('low')
    const [description, setDescription] = useState('')

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { isLoading, isError, isSuccess, message,ticket } = useSelector((state) => state.tickets)
    
    useEffect(() => {
  if (isError) alert(message)

  // Navigate ONLY after ticket is created
  if (isSuccess && ticket) {
    dispatch(reset())
    navigate('/tickets')
  }
}, [isError, isSuccess, ticket, message, navigate, dispatch])
    const onSubmit = (e) => {
        e.preventDefault()
        dispatch(createTicket({ product, description, priority }))
    }

    return (
  <div className="max-w-3xl mx-auto p-8">
    <div className="bg-white shadow rounded p-8">
      <h1 className="text-3xl font-bold mb-2">🆕 Create New Ticket</h1>
      <p className="text-gray-500 mb-6">
        Tell us what issue you are facing
      </p>

      <form onSubmit={onSubmit} className="space-y-4">
        <select
          value={product}
          onChange={(e) => setProduct(e.target.value)}
          className="w-full border p-3 rounded"
        >
          <option value="iPhone">iPhone</option>
          <option value="Macbook">Macbook</option>
          <option value="iMac">iMac</option>
          <option value="iPad">iPad</option>
        </select>

        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="w-full border p-3 rounded"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>

        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe your issue..."
          rows={5}
          className="w-full border p-3 rounded"
          required
        />

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-indigo-600 text-white py-3 rounded"
        >
          {isLoading ? 'Submitting...' : 'Submit Ticket'}
        </button>
      </form>
    </div>
  </div>
)
}

export default NewTicket
