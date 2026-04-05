import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { fetchLead, triggerCall } from '../api'

function Badge({ status }) {
  const colors = {
    qualified: 'bg-emerald-100 text-emerald-800',
    unqualified: 'bg-red-100 text-red-800',
    nurture: 'bg-amber-100 text-amber-800',
    pending: 'bg-gray-100 text-gray-800',
  }
  return (
    <span className={`px-3 py-1 rounded-full text-sm font-medium ${colors[status] || colors.pending}`}>
      {status}
    </span>
  )
}

function BANTBar({ label, value }) {
  const color = value >= 70 ? 'bg-emerald-500' : value >= 45 ? 'bg-amber-500' : 'bg-red-500'
  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="font-medium text-gray-700">{label}</span>
        <span className="text-gray-500">{value}/100</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-3">
        <div className={`${color} h-3 rounded-full transition-all duration-500`} style={{ width: `${value}%` }} />
      </div>
    </div>
  )
}

export default function LeadDetail() {
  const { id } = useParams()
  const [lead, setLead] = useState(null)
  const [calling, setCalling] = useState(false)

  const loadLead = async () => {
    const data = await fetchLead(id)
    setLead(data)
  }

  useEffect(() => {
    loadLead()
    const interval = setInterval(loadLead, 3000)
    return () => clearInterval(interval)
  }, [id])

  const handleCall = async () => {
    setCalling(true)
    await triggerCall(id)
    setTimeout(() => {
      loadLead()
      setCalling(false)
    }, 1000)
  }

  if (!lead) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin h-10 w-10 border-4 border-indigo-600 border-t-transparent rounded-full"></div>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      {/* Breadcrumb */}
      <div className="mb-6">
        <Link to="/dashboard" className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
          &larr; Back to Dashboard
        </Link>
      </div>

      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{lead.name}</h1>
          <p className="text-gray-500">{lead.title} at {lead.company}</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge status={lead.status} />
          {lead.call_status !== 'completed' && (
            <button
              onClick={handleCall}
              disabled={calling || lead.call_status === 'in_progress'}
              className="bg-indigo-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {calling || lead.call_status === 'in_progress' ? 'Calling...' : 'Trigger AI Call'}
            </button>
          )}
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Lead Info */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h2 className="font-semibold text-lg mb-4">Lead Info</h2>
          <dl className="space-y-3 text-sm">
            <div>
              <dt className="text-gray-500">Email</dt>
              <dd className="font-medium">{lead.email}</dd>
            </div>
            <div>
              <dt className="text-gray-500">Phone</dt>
              <dd className="font-medium">{lead.phone}</dd>
            </div>
            <div>
              <dt className="text-gray-500">Product Interest</dt>
              <dd className="font-medium">{lead.product_interest}</dd>
            </div>
            <div>
              <dt className="text-gray-500">Submitted</dt>
              <dd className="font-medium">{new Date(lead.submitted_at).toLocaleDateString()}</dd>
            </div>
            <div>
              <dt className="text-gray-500">Call Status</dt>
              <dd className="font-medium capitalize">{lead.call_status.replace('_', ' ')}</dd>
            </div>
            {lead.call_duration && (
              <div>
                <dt className="text-gray-500">Call Duration</dt>
                <dd className="font-medium">{Math.floor(lead.call_duration / 60)}m {lead.call_duration % 60}s</dd>
              </div>
            )}
          </dl>
        </div>

        {/* BANT Scores */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h2 className="font-semibold text-lg mb-4">BANT Qualification</h2>
          {lead.bant ? (
            <div className="space-y-4">
              <BANTBar label="Budget" value={lead.bant.budget} />
              <BANTBar label="Authority" value={lead.bant.authority} />
              <BANTBar label="Need" value={lead.bant.need} />
              <BANTBar label="Timeline" value={lead.bant.timeline} />
              <div className="pt-4 border-t mt-4">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-700">Overall Score</span>
                  <span className={`text-2xl font-bold ${
                    lead.qualification_score >= 70 ? 'text-emerald-600' :
                    lead.qualification_score >= 45 ? 'text-amber-600' : 'text-red-600'
                  }`}>
                    {lead.qualification_score}/100
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-gray-400 text-center py-8">
              {lead.call_status === 'in_progress' ? (
                <div>
                  <div className="animate-spin h-8 w-8 border-4 border-indigo-600 border-t-transparent rounded-full mx-auto mb-3"></div>
                  <p>Call in progress...</p>
                </div>
              ) : (
                <p>No qualification data yet.<br />Trigger a call to qualify this lead.</p>
              )}
            </div>
          )}
        </div>

        {/* Notes */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h2 className="font-semibold text-lg mb-4">AI Notes</h2>
          {lead.notes ? (
            <p className="text-gray-700 text-sm leading-relaxed">{lead.notes}</p>
          ) : (
            <p className="text-gray-400 text-sm">Notes will appear after the AI call completes.</p>
          )}
        </div>
      </div>

      {/* Transcript */}
      <div className="mt-6 bg-white rounded-xl shadow-sm border p-6">
        <h2 className="font-semibold text-lg mb-4">Call Transcript</h2>
        {lead.transcript && lead.transcript.length > 0 ? (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {lead.transcript.map((line, i) => (
              <div key={i} className={`flex gap-3 ${line.speaker === 'agent' ? '' : 'flex-row-reverse'}`}>
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                  line.speaker === 'agent' ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-700'
                }`}>
                  {line.speaker === 'agent' ? 'AI' : 'L'}
                </div>
                <div className={`max-w-[75%] px-4 py-2.5 rounded-xl text-sm ${
                  line.speaker === 'agent'
                    ? 'bg-indigo-50 text-gray-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {line.text}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400 text-center py-8">
            {lead.call_status === 'in_progress'
              ? 'Transcript will appear after the call completes...'
              : 'No transcript available. Trigger a call to generate one.'}
          </p>
        )}
      </div>
    </div>
  )
}
