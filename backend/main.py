import os
import asyncio
import random
import time
from datetime import datetime
from typing import Optional

import httpx
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

load_dotenv(os.path.join(os.path.dirname(__file__), "..", ".env"))

app = FastAPI(title="SalesPilot AI", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

BOLNA_API_KEY = os.getenv("BOLNA_API_KEY", "")
BOLNA_AGENT_ID = os.getenv("BOLNA_AGENT_ID", "")
BOLNA_API_URL = os.getenv("BOLNA_API_URL", "https://api.bolna.dev")

# ─── Models ───────────────────────────────────────────────────────────────────


class BANT(BaseModel):
    budget: int
    authority: int
    need: int
    timeline: int


class TranscriptLine(BaseModel):
    speaker: str
    text: str


class Lead(BaseModel):
    id: str
    name: str
    company: str
    email: str
    phone: str
    title: str = ""
    product_interest: str = "General"
    status: str = "pending"  # pending | qualified | unqualified | nurture
    call_status: str = "not_started"  # not_started | scheduled | in_progress | completed
    qualification_score: Optional[int] = None
    bant: Optional[BANT] = None
    submitted_at: str = ""
    call_id: Optional[str] = None
    call_duration: Optional[int] = None
    transcript: list[TranscriptLine] = []
    notes: str = ""


class LeadCreate(BaseModel):
    name: str
    company: str
    email: str
    phone: str
    title: str = ""
    product_interest: str = "General"


# ─── In-Memory Store ──────────────────────────────────────────────────────────

leads: list[Lead] = [
    Lead(
        id="lead_001",
        name="Sarah Chen",
        company="TechFlow Inc",
        email="sarah@techflow.com",
        phone="+15550101",
        title="VP of Sales",
        product_interest="Enterprise CRM",
        status="qualified",
        call_status="completed",
        qualification_score=85,
        bant=BANT(budget=90, authority=80, need=95, timeline=75),
        submitted_at="2024-03-15T10:30:00Z",
        call_id="call_abc123",
        call_duration=187,
        transcript=[
            TranscriptLine(speaker="agent", text="Hi, this is Alex from SalesPilot. Am I speaking with Sarah Chen?"),
            TranscriptLine(speaker="lead", text="Yes, this is Sarah."),
            TranscriptLine(speaker="agent", text="Great! I understand you're interested in our Enterprise CRM. Can I ask a few questions?"),
            TranscriptLine(speaker="lead", text="Sure, go ahead."),
            TranscriptLine(speaker="agent", text="What's your current budget range for a CRM solution?"),
            TranscriptLine(speaker="lead", text="We're looking at around $50,000 to $100,000 annually."),
            TranscriptLine(speaker="agent", text="Are you the decision maker for this purchase?"),
            TranscriptLine(speaker="lead", text="Yes, I'm the VP of Sales and I have budget authority."),
            TranscriptLine(speaker="agent", text="What specific challenges are you trying to solve?"),
            TranscriptLine(speaker="lead", text="We're losing track of leads and spending too much time on manual data entry."),
            TranscriptLine(speaker="agent", text="What's your timeline for implementing a new system?"),
            TranscriptLine(speaker="lead", text="We're hoping to be up and running within Q2, so next 2 months."),
            TranscriptLine(speaker="agent", text="Excellent! You're a great fit. I'll have a senior AE reach out to schedule a demo."),
            TranscriptLine(speaker="lead", text="That works for me."),
        ],
        notes="Strong qualified lead. Budget confirmed, decision maker, clear pain point, urgent timeline.",
    ),
    Lead(
        id="lead_002",
        name="Marcus Johnson",
        company="DataBridge Co",
        email="marcus@databridge.com",
        phone="+15550102",
        title="IT Manager",
        product_interest="Analytics Suite",
        status="unqualified",
        call_status="completed",
        qualification_score=30,
        bant=BANT(budget=20, authority=30, need=50, timeline=20),
        submitted_at="2024-03-15T11:15:00Z",
        call_id="call_def456",
        call_duration=95,
        transcript=[
            TranscriptLine(speaker="agent", text="Hi Marcus, calling about your interest in our Analytics Suite."),
            TranscriptLine(speaker="lead", text="Oh yeah, I was just browsing. Not really looking to buy right now."),
            TranscriptLine(speaker="agent", text="Do you have budget allocated for analytics tools?"),
            TranscriptLine(speaker="lead", text="No, I don't have a budget. I'd need to take it to the CFO."),
            TranscriptLine(speaker="agent", text="Are you the decision maker?"),
            TranscriptLine(speaker="lead", text="Not really, I'm just in IT. The business side would need to approve."),
        ],
        notes="Not qualified. No budget, not a decision maker, no urgency.",
    ),
    Lead(
        id="lead_003",
        name="Priya Patel",
        company="NovaStar Solutions",
        email="priya@novastar.com",
        phone="+15550103",
        title="CTO",
        product_interest="Enterprise CRM",
        status="qualified",
        call_status="completed",
        qualification_score=92,
        bant=BANT(budget=95, authority=100, need=90, timeline=85),
        submitted_at="2024-03-15T13:45:00Z",
        call_id="call_ghi789",
        call_duration=234,
        transcript=[
            TranscriptLine(speaker="agent", text="Hi Priya, this is Alex from SalesPilot."),
            TranscriptLine(speaker="lead", text="Yes, I've been expecting your call! We're actively evaluating CRM solutions."),
            TranscriptLine(speaker="agent", text="What's your budget range?"),
            TranscriptLine(speaker="lead", text="We have $200k allocated for this year's tech stack upgrade."),
            TranscriptLine(speaker="agent", text="As CTO, are you the final decision maker?"),
            TranscriptLine(speaker="lead", text="Yes, along with our CEO. We're both aligned on moving forward."),
            TranscriptLine(speaker="agent", text="What's driving the urgency?"),
            TranscriptLine(speaker="lead", text="We just closed a Series B and need to scale our sales ops immediately."),
            TranscriptLine(speaker="agent", text="When are you looking to decide?"),
            TranscriptLine(speaker="lead", text="Within the next 3 weeks."),
        ],
        notes="Highly qualified. Budget ready, decision maker, urgent timeline.",
    ),
    Lead(
        id="lead_004",
        name="Derek Williams",
        company="Omega Corp",
        email="derek@omegacorp.com",
        phone="+15550104",
        title="Sales Director",
        product_interest="Sales Automation",
        status="pending",
        call_status="scheduled",
        submitted_at="2024-03-16T09:00:00Z",
    ),
    Lead(
        id="lead_005",
        name="Jennifer Kim",
        company="FutureTech Labs",
        email="jkim@futuretech.com",
        phone="+15550105",
        title="Head of Operations",
        product_interest="Enterprise CRM",
        status="pending",
        call_status="not_started",
        submitted_at="2024-03-16T10:30:00Z",
    ),
    Lead(
        id="lead_006",
        name="Robert Martinez",
        company="BlueSky Ventures",
        email="robert@bluesky.com",
        phone="+15550106",
        title="CEO",
        product_interest="Analytics Suite",
        status="nurture",
        call_status="completed",
        qualification_score=55,
        bant=BANT(budget=60, authority=100, need=70, timeline=30),
        submitted_at="2024-03-14T14:00:00Z",
        call_id="call_jkl012",
        call_duration=198,
        transcript=[
            TranscriptLine(speaker="agent", text="Hi Robert, calling about your interest in our Analytics Suite."),
            TranscriptLine(speaker="lead", text="Yes, we're interested but in early stages of evaluation."),
            TranscriptLine(speaker="agent", text="What budget have you set aside?"),
            TranscriptLine(speaker="lead", text="Around $30-40k range."),
            TranscriptLine(speaker="agent", text="Timeline for decision?"),
            TranscriptLine(speaker="lead", text="Probably end of year, we're not in a rush."),
        ],
        notes="Budget and authority confirmed, but long timeline. Add to nurture sequence.",
    ),
    Lead(
        id="lead_007",
        name="Amanda Foster",
        company="Pinnacle Digital",
        email="afoster@pinnacle.com",
        phone="+15550107",
        title="Marketing Director",
        product_interest="Marketing Automation",
        status="qualified",
        call_status="completed",
        qualification_score=78,
        bant=BANT(budget=80, authority=70, need=85, timeline=75),
        submitted_at="2024-03-16T08:15:00Z",
        call_id="call_mno345",
        call_duration=165,
        transcript=[
            TranscriptLine(speaker="agent", text="Hi Amanda, I understand you're interested in marketing automation."),
            TranscriptLine(speaker="lead", text="Yes, we're drowning in manual tasks and need automation urgently."),
            TranscriptLine(speaker="agent", text="Budget range?"),
            TranscriptLine(speaker="lead", text="We have $60k approved for marketing tools this quarter."),
            TranscriptLine(speaker="agent", text="Are you the decision maker?"),
            TranscriptLine(speaker="lead", text="I am, but I'll need sign-off from the CMO for anything over $50k."),
        ],
        notes="Good lead. Strong need and budget, shared authority.",
    ),
    Lead(
        id="lead_008",
        name="Thomas Wright",
        company="Cascade Systems",
        email="twright@cascade.com",
        phone="+15550108",
        title="COO",
        product_interest="Enterprise CRM",
        status="pending",
        call_status="in_progress",
        submitted_at="2024-03-16T11:00:00Z",
        call_id="call_pqr678",
    ),
]

next_id = 9


def _find_lead(lead_id: str) -> Lead:
    for lead in leads:
        if lead.id == lead_id:
            return lead
    raise HTTPException(status_code=404, detail="Lead not found")


def _compute_qualification(bant: BANT) -> tuple[int, str]:
    score = round((bant.budget + bant.authority + bant.need + bant.timeline) / 4)
    if score >= 70:
        return score, "qualified"
    elif score >= 45:
        return score, "nurture"
    return score, "unqualified"


def _is_bolna_configured() -> bool:
    return bool(BOLNA_API_KEY) and BOLNA_API_KEY != "your_bolna_api_key_here"


# ─── Routes ───────────────────────────────────────────────────────────────────


@app.get("/api/leads")
def get_leads():
    return sorted(leads, key=lambda l: l.submitted_at, reverse=True)


@app.get("/api/leads/{lead_id}")
def get_lead(lead_id: str):
    return _find_lead(lead_id)


@app.post("/api/leads", status_code=201)
def create_lead(body: LeadCreate):
    global next_id
    lead = Lead(
        id=f"lead_{next_id:03d}",
        name=body.name,
        company=body.company,
        email=body.email,
        phone=body.phone,
        title=body.title,
        product_interest=body.product_interest,
        submitted_at=datetime.utcnow().isoformat() + "Z",
    )
    next_id += 1
    leads.append(lead)
    return lead


@app.post("/api/leads/{lead_id}/call")
async def trigger_call(lead_id: str):
    lead = _find_lead(lead_id)

    if lead.call_status == "completed":
        raise HTTPException(status_code=400, detail="Call already completed for this lead")

    # Real Bolna call — try if configured, fall back to demo on failure
    if _is_bolna_configured():
        try:
            async with httpx.AsyncClient() as client:
                resp = await client.post(
                    f"{BOLNA_API_URL}/call",
                    headers={
                        "Content-Type": "application/json",
                        "Authorization": f"Bearer {BOLNA_API_KEY}",
                    },
                    json={
                        "agent_id": BOLNA_AGENT_ID,
                        "recipient_phone_number": lead.phone,
                        "user_data": {
                            "lead_id": lead.id,
                            "lead_name": lead.name,
                            "company": lead.company,
                            "product_interest": lead.product_interest,
                            "title": lead.title,
                        },
                    },
                )
                if resp.status_code < 400:
                    result = resp.json()
                    lead.call_status = "in_progress"
                    lead.call_id = result.get("call_id") or result.get("id") or f"call_{int(time.time())}"
                    return {"message": "Call initiated via Bolna", "lead": lead, "bolna_response": result}
                else:
                    print(f"Bolna API returned {resp.status_code}: {resp.text} — falling back to demo mode")
        except Exception as e:
            print(f"Bolna API error: {e} — falling back to demo mode")

    # Demo mode — simulate call
    lead.call_status = "in_progress"
    lead.call_id = f"call_sim_{int(time.time())}"

    async def _simulate():
        await asyncio.sleep(3)
        bant = BANT(
            budget=random.randint(40, 100),
            authority=random.randint(40, 100),
            need=random.randint(40, 100),
            timeline=random.randint(40, 100),
        )
        score, status = _compute_qualification(bant)
        budget_k = random.randint(20, 170)

        lead.call_status = "completed"
        lead.call_duration = random.randint(60, 240)
        lead.bant = bant
        lead.qualification_score = score
        lead.status = status
        lead.transcript = [
            TranscriptLine(speaker="agent", text=f"Hi, this is Alex from SalesPilot. Am I speaking with {lead.name}?"),
            TranscriptLine(speaker="lead", text="Yes, that's me."),
            TranscriptLine(speaker="agent", text=f"Great! I see you're interested in {lead.product_interest}. I'd love to ask a few quick questions."),
            TranscriptLine(speaker="lead", text="Sure, go ahead."),
            TranscriptLine(speaker="agent", text="What budget range are you working with for this type of solution?"),
            TranscriptLine(speaker="lead", text=f"We're looking at around ${budget_k}k annually."),
            TranscriptLine(speaker="agent", text="Are you the primary decision maker for this purchase?"),
            TranscriptLine(speaker="lead", text="Yes, I have the final say." if bant.authority > 60 else "I'd need to involve a few other stakeholders."),
            TranscriptLine(speaker="agent", text="What's your timeline for making a decision?"),
            TranscriptLine(speaker="lead", text="We'd like to move within the next month." if bant.timeline > 60 else "We're still early stage, probably a few months out."),
            TranscriptLine(speaker="agent", text="Thank you for your time! Our team will follow up with next steps."),
        ]
        lead.notes = f"Auto-qualified via AI. Score: {score}/100. Status: {status}."

    asyncio.create_task(_simulate())
    return {"message": "Call initiated (demo mode)", "lead": lead}


@app.get("/api/stats")
def get_stats():
    total = len(leads)
    completed = [l for l in leads if l.call_status == "completed"]
    qualified = [l for l in leads if l.status == "qualified"]
    scored = [l for l in completed if l.qualification_score is not None]

    return {
        "total_leads": total,
        "calls_made": len([l for l in leads if l.call_status in ("completed", "in_progress")]),
        "calls_completed": len(completed),
        "qualified_leads": len(qualified),
        "qualification_rate": round(len(qualified) / len(completed) * 100) if completed else 0,
        "avg_call_duration": round(sum(l.call_duration or 0 for l in completed) / len(completed)) if completed else 0,
        "avg_score": round(sum(l.qualification_score for l in scored) / len(scored)) if scored else 0,
        "time_saved_hours": round(len(completed) * 0.5, 1),
    }


# ─── Bolna Webhook ────────────────────────────────────────────────────────────


class WebhookPayload(BaseModel):
    call_id: Optional[str] = None
    status: Optional[str] = None
    transcript: Optional[list[dict]] = None
    duration: Optional[int] = None
    user_data: Optional[dict] = None
    extracted_data: Optional[dict] = None


@app.post("/api/webhooks/bolna")
def bolna_webhook(payload: WebhookPayload):
    lead = None
    if payload.user_data and "lead_id" in payload.user_data:
        lead = next((l for l in leads if l.id == payload.user_data["lead_id"]), None)
    if not lead and payload.call_id:
        lead = next((l for l in leads if l.call_id == payload.call_id), None)

    if not lead:
        return {"received": True, "warning": "lead not found"}

    if payload.status in ("completed", "ended"):
        lead.call_status = "completed"
    if payload.duration:
        lead.call_duration = payload.duration
    if payload.transcript:
        lead.transcript = [
            TranscriptLine(speaker=t.get("role", t.get("speaker", "unknown")), text=t.get("content", t.get("text", "")))
            for t in payload.transcript
        ]

    if payload.extracted_data:
        bant = BANT(
            budget=payload.extracted_data.get("budget_score", 50),
            authority=payload.extracted_data.get("authority_score", 50),
            need=payload.extracted_data.get("need_score", 50),
            timeline=payload.extracted_data.get("timeline_score", 50),
        )
        score, status = _compute_qualification(bant)
        lead.bant = bant
        lead.qualification_score = score
        lead.status = status
        lead.notes = payload.extracted_data.get("summary", f"Qualified via Bolna. Score: {score}")

    return {"received": True, "lead_id": lead.id}


# ─── Run ──────────────────────────────────────────────────────────────────────

if __name__ == "__main__":
    import uvicorn

    port = int(os.getenv("PORT", "3001"))
    print(f"SalesPilot API on http://localhost:{port}")
    print(f"Bolna: {'LIVE' if _is_bolna_configured() else 'DEMO MODE'}")
    uvicorn.run(app, host="0.0.0.0", port=port)
