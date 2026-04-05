const BASE = '/api'

export async function fetchLeads() {
  const res = await fetch(`${BASE}/leads`)
  return res.json()
}

export async function fetchLead(id) {
  const res = await fetch(`${BASE}/leads/${id}`)
  return res.json()
}

export async function createLead(data) {
  const res = await fetch(`${BASE}/leads`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  return res.json()
}

export async function triggerCall(id) {
  const res = await fetch(`${BASE}/leads/${id}/call`, { method: 'POST' })
  return res.json()
}

export async function fetchStats() {
  const res = await fetch(`${BASE}/stats`)
  return res.json()
}
