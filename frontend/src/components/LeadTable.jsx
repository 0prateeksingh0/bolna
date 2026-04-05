import { Link } from 'react-router-dom'

function Badge({ status }) {
  const colors = {
    qualified: 'bg-emerald-100 text-emerald-800',
    unqualified: 'bg-red-100 text-red-800',
    nurture: 'bg-amber-100 text-amber-800',
    pending: 'bg-gray-100 text-gray-800',
  }
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[status] || colors.pending}`}>
      {status}
    </span>
  )
}

function CallBadge({ status }) {
  const colors = {
    completed: 'bg-emerald-100 text-emerald-700',
    in_progress: 'bg-blue-100 text-blue-700',
    scheduled: 'bg-purple-100 text-purple-700',
    not_started: 'bg-gray-100 text-gray-500',
  }
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[status] || colors.not_started}`}>
      {status.replace('_', ' ')}
    </span>
  )
}

export default function LeadTable({ leads, onTriggerCall }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
      <div className="px-6 py-4 border-b">
        <h2 className="font-semibold text-lg">Leads ({leads.length})</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
            <tr>
              <th className="px-6 py-3 text-left">Lead</th>
              <th className="px-6 py-3 text-left">Company</th>
              <th className="px-6 py-3 text-left">Product</th>
              <th className="px-6 py-3 text-center">Status</th>
              <th className="px-6 py-3 text-center">Call</th>
              <th className="px-6 py-3 text-center">Score</th>
              <th className="px-6 py-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {leads.map(lead => (
              <tr key={lead.id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4">
                  <Link to={`/lead/${lead.id}`} className="font-medium text-indigo-600 hover:text-indigo-800">
                    {lead.name}
                  </Link>
                  <p className="text-gray-500 text-xs">{lead.title}</p>
                </td>
                <td className="px-6 py-4 text-gray-700">{lead.company}</td>
                <td className="px-6 py-4 text-gray-700">{lead.product_interest}</td>
                <td className="px-6 py-4 text-center"><Badge status={lead.status} /></td>
                <td className="px-6 py-4 text-center"><CallBadge status={lead.call_status} /></td>
                <td className="px-6 py-4 text-center">
                  {lead.qualification_score != null ? (
                    <span className={`font-bold ${
                      lead.qualification_score >= 70 ? 'text-emerald-600' :
                      lead.qualification_score >= 45 ? 'text-amber-600' : 'text-red-600'
                    }`}>
                      {lead.qualification_score}
                    </span>
                  ) : (
                    <span className="text-gray-300">&mdash;</span>
                  )}
                </td>
                <td className="px-6 py-4 text-center">
                  {lead.call_status === 'completed' ? (
                    <Link to={`/lead/${lead.id}`} className="text-indigo-600 hover:text-indigo-800 text-xs font-medium">
                      View
                    </Link>
                  ) : lead.call_status === 'in_progress' ? (
                    <span className="text-blue-500 text-xs">In progress...</span>
                  ) : (
                    <button
                      onClick={() => onTriggerCall(lead.id)}
                      className="text-xs bg-indigo-600 text-white px-3 py-1 rounded-md hover:bg-indigo-700 transition"
                    >
                      Call
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
