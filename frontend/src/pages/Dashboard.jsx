import { useState, useEffect, useCallback } from 'react'
import StatsCards from '../components/StatsCards'
import LeadTable from '../components/LeadTable'
import LeadForm from '../components/LeadForm'
import { fetchLeads, fetchStats, createLead, triggerCall } from '../api'

export default function Dashboard() {
  const [leads, setLeads] = useState([])
  const [stats, setStats] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(true)

  const loadData = useCallback(async () => {
    const [l, s] = await Promise.all([fetchLeads(), fetchStats()])
    setLeads(l)
    setStats(s)
    setLoading(false)
  }, [])

  useEffect(() => {
    loadData()
    const interval = setInterval(loadData, 4000)
    return () => clearInterval(interval)
  }, [loadData])

  const handleCreate = async (data) => {
    await createLead(data)
    setShowForm(false)
    loadData()
  }

  const handleCall = async (id) => {
    await triggerCall(id)
    loadData()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin h-10 w-10 border-4 border-indigo-600 border-t-transparent rounded-full"></div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Lead Dashboard</h1>
          <p className="text-gray-500 mt-1">Manage and qualify your inbound leads with AI</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-indigo-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition"
        >
          {showForm ? 'Cancel' : '+ New Lead'}
        </button>
      </div>

      {showForm && (
        <div className="mb-8">
          <LeadForm onSubmit={handleCreate} />
        </div>
      )}

      {stats && <StatsCards stats={stats} />}

      <div className="mt-8">
        <LeadTable leads={leads} onTriggerCall={handleCall} />
      </div>
    </div>
  )
}
