# SalesPilot AI — Voice-Powered Lead Qualification

> AI-powered B2B lead qualification platform built with **Bolna Voice AI**, **FastAPI**, and **React**.

## Enterprise Use Case

**Problem:** B2B SaaS sales teams waste 40% of their time on unqualified leads. Reps spend hours on repetitive discovery calls instead of closing deals.

**Workflow:**
1. Lead submits interest form on the web app
2. Admin triggers AI qualification call (or auto-trigger)
3. Bolna Voice AI calls the lead and conducts BANT qualification
4. Lead is scored 0-100 on Budget, Authority, Need, Timeline
5. Webhook returns results → dashboard updates in real-time
6. Only qualified leads (score 70+) are routed to sales reps

**Outcome Metrics:**
- Lead qualification rate: 60%+ accuracy
- Avg call duration: <3 minutes
- Sales rep time saved: 20+ hours/week
- Conversion rate improvement: 3x

## Architecture

```
User → React Web App → FastAPI Backend → Bolna Voice AI → Phone Call
                                      ↑
                              Webhook ←┘ (call results)
```

## Tech Stack

| Layer     | Technology                     |
|-----------|--------------------------------|
| Frontend  | React 18 + Vite + Tailwind CSS |
| Backend   | FastAPI (Python)               |
| Voice AI  | Bolna API                      |
| Transport | REST API + Webhooks            |

## Quick Start

### 1. Clone & Setup

```bash
git clone <your-repo-url>
cd bolna
```

### 2. Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 3. Frontend

```bash
cd frontend
npm install
```

### 4. Configure Environment

Edit `.env` in the project root:
```
BOLNA_API_KEY=your_bolna_api_key_here
BOLNA_AGENT_ID=your_bolna_agent_id_here
BOLNA_API_URL=https://api.bolna.dev
PORT=3001
```

> Without a Bolna API key, the app runs in **demo mode** with simulated calls.

### 5. Run

Terminal 1 — Backend:
```bash
cd backend
python main.py
```

Terminal 2 — Frontend:
```bash
cd frontend
npm run dev
```

Open http://localhost:5173

## Connecting to Bolna (Step-by-Step)

1. **Sign up** at [bolna.dev](https://bolna.dev) and get your API key
2. **Create an agent** on the Bolna dashboard:
   - Use the prompt from `agent-config/bolna-agent-prompt.md`
   - Configure Deepgram transcriber + ElevenLabs synthesizer
   - Copy the Agent ID
3. **Set webhook** URL in Bolna to: `https://your-domain.com/api/webhooks/bolna`
4. **Update `.env`** with your API key and Agent ID
5. **Restart backend** — calls will now go through Bolna

## Demo Mode

When `BOLNA_API_KEY` is not set, clicking "Call" simulates:
- 3-second call delay
- Random BANT scores generated
- Simulated transcript created
- Lead status auto-updated

## API Endpoints

| Method | Endpoint                   | Description              |
|--------|----------------------------|--------------------------|
| GET    | `/api/leads`               | List all leads           |
| GET    | `/api/leads/:id`           | Get lead details         |
| POST   | `/api/leads`               | Create new lead          |
| POST   | `/api/leads/:id/call`      | Trigger AI call          |
| GET    | `/api/stats`               | Dashboard statistics     |
| POST   | `/api/webhooks/bolna`      | Bolna webhook receiver   |

## Screenshots

- **Landing Page**: Value proposition + how it works
- **Dashboard**: Stats cards + lead table with status/scores
- **Lead Detail**: BANT bars + call transcript + AI notes

## Full Flow Demo

```
1. User opens web app → Landing page
2. User clicks "Dashboard" → Sees all leads
3. User clicks "+ New Lead" → Fills form → Lead created
4. User clicks "Call" on a lead → AI call triggered
5. After 3s (demo) → Call completes → BANT scores appear
6. User clicks lead name → Full transcript + qualification breakdown
```

---

Built for FSE@Bolna Assignment
# bolna
