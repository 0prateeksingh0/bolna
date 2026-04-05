import { Link, useLocation } from 'react-router-dom'

export default function Navbar() {
  const { pathname } = useLocation()

  const linkClass = (path) =>
    `px-4 py-2 rounded-lg text-sm font-medium transition ${
      pathname === path
        ? 'bg-indigo-100 text-indigo-700'
        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
    }`

  return (
    <nav className="bg-white border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
            SP
          </div>
          <span className="font-bold text-lg text-gray-900">SalesPilot AI</span>
        </Link>
        <div className="flex items-center gap-2">
          <Link to="/" className={linkClass('/')}>Home</Link>
          <Link to="/dashboard" className={linkClass('/dashboard')}>Dashboard</Link>
        </div>
      </div>
    </nav>
  )
}
