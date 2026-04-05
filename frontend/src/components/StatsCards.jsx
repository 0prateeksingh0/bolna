const cards = (s) => [
  { label: 'Total Leads', value: s.total_leads, color: 'text-indigo-600', bg: 'bg-indigo-50' },
  { label: 'Calls Completed', value: s.calls_completed, color: 'text-blue-600', bg: 'bg-blue-50' },
  { label: 'Qualified', value: s.qualified_leads, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  { label: 'Qualification Rate', value: `${s.qualification_rate}%`, color: 'text-purple-600', bg: 'bg-purple-50' },
  { label: 'Avg Score', value: s.avg_score, color: 'text-amber-600', bg: 'bg-amber-50' },
  { label: 'Avg Duration', value: `${Math.floor(s.avg_call_duration / 60)}m ${s.avg_call_duration % 60}s`, color: 'text-cyan-600', bg: 'bg-cyan-50' },
  { label: 'Time Saved', value: `${s.time_saved_hours}h`, color: 'text-rose-600', bg: 'bg-rose-50' },
]

export default function StatsCards({ stats }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
      {cards(stats).map(c => (
        <div key={c.label} className="bg-white rounded-xl shadow-sm border p-4">
          <p className="text-xs text-gray-500 mb-1">{c.label}</p>
          <p className={`text-2xl font-bold ${c.color}`}>{c.value}</p>
        </div>
      ))}
    </div>
  )
}
