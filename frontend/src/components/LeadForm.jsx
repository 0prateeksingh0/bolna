import { useState } from 'react'

const EMPTY = { name: '', company: '', email: '', phone: '', title: '', product_interest: 'Enterprise CRM' }

export default function LeadForm({ onSubmit }) {
  const [form, setForm] = useState(EMPTY)
  const [submitting, setSubmitting] = useState(false)

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  const handle = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    await onSubmit(form)
    setForm(EMPTY)
    setSubmitting(false)
  }

  return (
    <form onSubmit={handle} className="bg-white rounded-xl shadow-sm border p-6">
      <h2 className="font-semibold text-lg mb-4">Add New Lead</h2>
      <div className="grid md:grid-cols-3 gap-4">
        <input required placeholder="Full Name *" value={form.name} onChange={set('name')}
          className="border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" />
        <input required placeholder="Company *" value={form.company} onChange={set('company')}
          className="border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" />
        <input required type="email" placeholder="Email *" value={form.email} onChange={set('email')}
          className="border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" />
        <input required placeholder="Phone * (e.g. +15551234567)" value={form.phone} onChange={set('phone')}
          className="border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" />
        <input placeholder="Job Title" value={form.title} onChange={set('title')}
          className="border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" />
        <select value={form.product_interest} onChange={set('product_interest')}
          className="border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none">
          <option>Enterprise CRM</option>
          <option>Analytics Suite</option>
          <option>Sales Automation</option>
          <option>Marketing Automation</option>
        </select>
      </div>
      <div className="mt-4 flex justify-end">
        <button type="submit" disabled={submitting}
          className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 transition">
          {submitting ? 'Adding...' : 'Add Lead'}
        </button>
      </div>
    </form>
  )
}
