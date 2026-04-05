import { Link } from 'react-router-dom'

const steps = [
  { num: '1', title: 'Lead Submits Form', desc: 'Prospect fills out interest form on your website.' },
  { num: '2', title: 'AI Calls the Lead', desc: 'Bolna voice agent calls within seconds and qualifies using BANT.' },
  { num: '3', title: 'Instant Scoring', desc: 'Budget, Authority, Need, Timeline scored 0-100 automatically.' },
  { num: '4', title: 'CRM Updated', desc: 'Qualified leads routed to your sales team with full transcript.' },
]

const features = [
  { icon: '24/7', title: 'Always On', desc: 'AI qualifies leads around the clock — no missed opportunities, even at 2 AM.' },
  { icon: 'BANT', title: 'Proven Framework', desc: 'Budget, Authority, Need, Timeline — the gold standard of B2B qualification.' },
  { icon: 'API', title: 'CRM Integration', desc: 'Webhook-powered pipeline pushes qualified leads directly into your CRM.' },
]

export default function Landing() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 text-white">
        <div className="max-w-6xl mx-auto px-6 py-24 text-center">
          <h1 className="text-5xl font-extrabold leading-tight mb-6">
            AI Qualifies Your Sales Leads<br />
            <span className="text-indigo-200">Before They Reach Your Team</span>
          </h1>
          <p className="text-xl text-indigo-100 max-w-2xl mx-auto mb-10">
            SalesPilot uses Bolna's Voice AI to automatically call, qualify, and score every
            inbound lead using the BANT framework — so your reps only talk to buyers.
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/dashboard" className="bg-white text-indigo-700 px-8 py-3 rounded-lg font-semibold text-lg hover:bg-indigo-50 transition">
              Open Dashboard
            </Link>
            <a href="#how-it-works" className="border-2 border-white/40 text-white px-8 py-3 rounded-lg font-semibold text-lg hover:bg-white/10 transition">
              How It Works
            </a>
          </div>
        </div>
      </section>

      {/* Problem / Stats */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-3 gap-8 text-center">
          <div className="bg-white p-8 rounded-xl shadow-sm border">
            <p className="text-4xl font-bold text-red-500 mb-2">40%</p>
            <p className="text-gray-600">of sales rep time wasted on unqualified leads</p>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-sm border">
            <p className="text-4xl font-bold text-amber-500 mb-2">67%</p>
            <p className="text-gray-600">of leads never get a follow-up call</p>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-sm border">
            <p className="text-4xl font-bold text-emerald-500 mb-2">3x</p>
            <p className="text-gray-600">conversion improvement with AI qualification</p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">Why SalesPilot?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map(f => (
              <div key={f.title} className="text-center p-6">
                <div className="w-16 h-16 bg-indigo-100 text-indigo-700 rounded-2xl flex items-center justify-center mx-auto mb-4 font-bold text-lg">
                  {f.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{f.title}</h3>
                <p className="text-gray-600">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
        <div className="grid md:grid-cols-4 gap-6">
          {steps.map(s => (
            <div key={s.num} className="relative bg-white p-6 rounded-xl shadow-sm border text-center">
              <div className="w-10 h-10 bg-indigo-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold">
                {s.num}
              </div>
              <h3 className="font-semibold mb-2">{s.title}</h3>
              <p className="text-gray-600 text-sm">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Enterprise Use Case */}
      <section className="bg-indigo-50 py-16">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-8">Enterprise Use Case</h2>
          <div className="bg-white rounded-xl shadow-sm border p-8 space-y-6">
            <div>
              <h3 className="font-semibold text-lg text-indigo-700 mb-2">Problem</h3>
              <p className="text-gray-700">
                B2B SaaS sales teams waste 40% of their time calling and qualifying leads that will never convert.
                Reps spend hours on repetitive discovery calls instead of closing deals.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-lg text-indigo-700 mb-2">Workflow</h3>
              <p className="text-gray-700">
                Lead submits form &rarr; Bolna Voice AI calls within 60 seconds &rarr; Conducts BANT qualification
                (Budget, Authority, Need, Timeline) &rarr; Scores lead 0-100 &rarr; Webhook updates CRM &rarr;
                Only qualified leads reach sales reps.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-lg text-indigo-700 mb-2">Outcome Metrics</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li>Lead qualification rate (target: 60%+ accuracy)</li>
                <li>Average qualification call duration (target: &lt;3 min)</li>
                <li>Sales rep time saved (target: 20+ hours/week)</li>
                <li>Conversion rate improvement (target: 3x)</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="text-center py-16">
        <h2 className="text-3xl font-bold mb-4">Ready to See It In Action?</h2>
        <p className="text-gray-600 mb-8">Open the dashboard to submit leads and watch AI qualify them in real time.</p>
        <Link to="/dashboard" className="bg-indigo-600 text-white px-10 py-4 rounded-lg font-semibold text-lg hover:bg-indigo-700 transition">
          Launch Dashboard
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 text-center text-gray-500 text-sm">
        <p>SalesPilot AI &mdash; Built with Bolna Voice AI | FSE Assignment</p>
      </footer>
    </div>
  )
}
