import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { getTicketStats } from '../features/tickets/ticketSlice'

function AgentDashboard() {
  const dispatch = useDispatch()
  const { stats, isLoading, isError, message } = useSelector((state) => state.tickets)

  useEffect(() => {
    dispatch(getTicketStats())
  }, [dispatch])

  if (isLoading) return <div className="p-8 text-center text-gray-500 animate-pulse">Loading Analytics Dashboard...</div>

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-black mb-6 text-slate-800 tracking-tight">🛠️ Executive Dashboard</h1>

      {/* Analytics Module */}
      <div className="grid md:grid-cols-2 gap-6 mb-10">
         
         <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="font-bold text-gray-400 mb-4 uppercase tracking-wider text-sm flex items-center gap-2">
              📊 Global Ticket Status
            </h2>
            <div className="flex flex-wrap gap-4">
              {stats?.statusStats?.map(s => (
                <div key={s._id} className="bg-slate-50 px-5 py-4 rounded-xl border border-slate-200 flex flex-col items-center flex-1 min-w-[100px]">
                  <span className="text-4xl font-black text-slate-700">{s.count}</span>
                  <span className="text-xs font-bold text-slate-500 uppercase mt-2 tracking-wide">{s._id}</span>
                </div>
              ))}
              {(!stats?.statusStats || stats.statusStats.length === 0) && <p className="text-gray-400">No data flowing yet</p>}
            </div>
         </div>

         <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="font-bold text-gray-400 mb-4 uppercase tracking-wider text-sm flex items-center gap-2">
              🚨 Activity by Priority
            </h2>
            <div className="flex flex-wrap gap-4">
              {stats?.priorityStats?.map(s => {
                let colorClass = 'text-indigo-600 bg-indigo-50 border-indigo-100';
                if (s._id === 'high') colorClass = 'text-red-600 bg-red-50 border-red-100';
                if (s._id === 'low') colorClass = 'text-green-600 bg-green-50 border-green-100';

                return (
                  <div key={s._id} className={`px-5 py-4 rounded-xl border flex flex-col items-center flex-1 min-w-[100px] ${colorClass}`}>
                    <span className="text-4xl font-black opacity-90">{s.count}</span>
                    <span className="text-xs font-bold uppercase mt-2 tracking-wide opacity-80">{s._id}</span>
                  </div>
                )
              })}
               {(!stats?.priorityStats || stats.priorityStats.length === 0) && <p className="text-gray-400">No data flowing yet</p>}
            </div>
         </div>

      </div>

      <h2 className="text-xl font-bold mb-4 text-slate-700 tracking-tight">Quick Actions</h2>
      <div className="grid md:grid-cols-3 gap-6">
        <Link to="/tickets" className="group p-6 bg-indigo-600 text-white shadow-lg rounded-2xl hover:bg-indigo-700 transition duration-300 transform hover:-translate-y-1 cursor-pointer">
          <div className="flex justify-between items-center mb-2">
             <h2 className="text-xl font-bold">📋 Support Queue</h2>
             <span className="text-indigo-200 group-hover:text-white transition group-hover:translate-x-1">→</span>
          </div>
          <p className="text-indigo-200 text-sm font-medium leading-relaxed">Jump into the active queue to view and manage customer tickets and replies.</p>
        </Link>
      </div>
    </div>
  )
}

export default AgentDashboard