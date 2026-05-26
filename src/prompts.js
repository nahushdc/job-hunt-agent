export const RESEARCH_SECTIONS = [
  {
    id: 'products',
    tab: 'research',
    title: 'Products & Strategy',
    icon: '🚀',
    needsSearch: true,
    buildPrompt: (company, jd) => `You are a senior product strategist with deep expertise in SaaS and tech companies. Research ${company} comprehensively.

Role context: The candidate is applying for the following role — "${jd.slice(0, 450)}"

Research and report on:
1. Core product(s) — what exactly do they build, what problem it solves, who the users are
2. Recent product launches or major feature releases in the last 12 months
3. Their stated product strategy and where they are investing
4. How the role described in the JD fits into their current product bets and roadmap

Be specific: name actual products, features, and strategic initiatives. Cite signals like blog posts, product announcements, or press coverage where possible. Avoid generic statements — every claim should be backed by a specific observation.

Write in clear, direct prose. Use headers to structure sections, but avoid bullet dumps. Be concise and insightful.`,
  },
  {
    id: 'business',
    tab: 'research',
    title: 'Business & Funding',
    icon: '💰',
    needsSearch: true,
    buildPrompt: (company, jd) => `You are a venture capital analyst specializing in growth-stage companies. Research ${company}'s funding and business fundamentals.

Role context: The candidate is applying for — "${jd.slice(0, 450)}"

Research and report on:
1. Total funding raised, funding rounds with dates and amounts, key investors
2. Latest round details — lead investor, valuation if known, stated use of funds
3. Business model — how they make money, pricing structure, key revenue drivers
4. Growth signals — headcount trends, geographic expansion, enterprise vs. SMB focus
5. Any IPO plans, acquisition activity, or significant pivots

Be specific: cite dollar amounts, investor names, and dates. Avoid vague statements like "well-funded" — show the actual numbers where possible.`,
  },
  {
    id: 'competitive',
    tab: 'research',
    title: 'Competitive Gaps',
    icon: '⚔️',
    needsSearch: true,
    buildPrompt: (company, jd) => `You are a senior competitive intelligence analyst. Your job is to map ${company}'s competitive landscape with precision.

Role context: The candidate is applying for — "${jd.slice(0, 450)}"

Research and report on:
1. The top 3–5 direct competitors (name them specifically)
2. Where ${company} clearly leads — specific differentiators that matter to customers
3. Where ${company} lags — honest assessment of weaknesses or gaps
4. How competitors are attacking ${company}'s position right now
5. Strategic implications for someone in the role described in the JD

Don't be diplomatic — give an honest picture of where this company sits in the market. Cite specific product features, customer reviews, or analyst commentary.`,
  },
  {
    id: 'financials',
    tab: 'research',
    title: 'Revenue & Financials',
    icon: '📊',
    needsSearch: true,
    buildPrompt: (company, jd) => `You are a financial analyst specializing in private tech companies. Research ${company}'s financial profile.

Role context: The candidate is applying for — "${jd.slice(0, 450)}"

Research and report on:
1. Estimated ARR or GMV — cite sources and methodology for estimates
2. Margin profile — gross margins, operating leverage if known
3. Estimated burn rate and runway (for startups) or profitability (for later-stage)
4. Key unit economics estimates — CAC, LTV, payback period
5. Path to profitability or next financial milestones

Use every available signal: funding multiples, job posting density, pricing pages, investor commentary, industry benchmarks. Be clear about confidence levels — distinguish estimates from confirmed facts.`,
  },
  {
    id: 'culture',
    tab: 'research',
    title: 'Culture & Reviews',
    icon: '🏢',
    needsSearch: true,
    buildPrompt: (company, jd) => `You are an organizational psychologist and talent advisor. Research ${company}'s culture, employee sentiment, and work environment.

Role context: The candidate is applying for — "${jd.slice(0, 450)}"

Research and report on:
1. Glassdoor/AmbitionBox rating synthesis — overall score, trend over time, response rates
2. Top recurring pros mentioned by employees
3. Top recurring cons and complaints — be direct and specific
4. Leadership approval rating and specific feedback about management style
5. Why people leave — main themes from exit sentiment
6. Cultural red flags or green flags specific to the role in the JD

Synthesize across sources. Look for patterns, outliers, and anything that would matter specifically to someone in this role. Be honest, not promotional.`,
  },
  {
    id: 'team',
    tab: 'research',
    title: 'Product Team & PMs',
    icon: '👥',
    needsSearch: true,
    buildPrompt: (company, jd) => `You are a headhunter with deep knowledge of product teams at tech companies. Research ${company}'s product organization.

Role context: The candidate is applying for — "${jd.slice(0, 450)}"

Research and report on:
1. Head of Product / CPO — full name, background, where they came from, notable work
2. Current PMs — names, focus areas, tenure (search LinkedIn, team pages, conference talks)
3. Reporting structure — does product report to CEO, CTO, or elsewhere?
4. Team size and growth trajectory of the product org
5. Who the candidate would likely report to and their background
6. Who to reach out to on LinkedIn before or after the interview — and what to say

Be specific: name actual people. If you can't find names, explain why and suggest where to look.`,
  },
];

export const INTERVIEW_SECTIONS = [
  {
    id: 'founders',
    tab: 'interview',
    title: 'Founder Profiles',
    icon: '🧑‍💼',
    needsSearch: true,
    buildPrompt: (company, jd) => `You are an executive coach who has worked with hundreds of founders. Research the founder(s) of ${company} in depth.

Role context: The candidate is interviewing for — "${jd.slice(0, 450)}"

Research and report on each founder:
1. Full background — education, career trajectory, previous companies
2. Origin story — why they started ${company}, the insight or pain point they saw
3. Stated values and management philosophy (from interviews, essays, talks)
4. Notable failures or pivots in their journey and how they talk about them
5. How their personality and style would affect someone in this role day-to-day

Go beyond the standard bio. Find interviews, podcasts, essays, talks. What do they care about? What do they fight for? What annoys them? What gets them excited?`,
  },
  {
    id: 'social',
    tab: 'interview',
    title: 'Social & Thought Leadership',
    icon: '📱',
    needsSearch: true,
    buildPrompt: (company, jd) => `You are a communications strategist who studies founder voices and personal brands. Research the founders and key leaders of ${company}.

Role context: The candidate is interviewing for — "${jd.slice(0, 450)}"

Research and report on:
1. What the founders post about on LinkedIn and Twitter/X — themes, frequency, tone
2. Their contrarian or non-obvious beliefs about their industry
3. Specific language, frameworks, or mental models they use repeatedly
4. What excites them right now — what problems or opportunities they keep referencing
5. Any recent controversies, bold takes, or notable public moments

The goal is to help the candidate "speak the same language" in the interview — not to flatter, but to have a genuine conversation using shared vocabulary and frameworks.`,
  },
  {
    id: 'strategy',
    tab: 'interview',
    title: 'Interview Strategy',
    icon: '🎯',
    needsSearch: false,
    buildPrompt: (company, jd) => `You are a seasoned interview coach who has helped hundreds of candidates land PM and product roles at top tech companies. The candidate is interviewing at ${company}.

Role context: Full job description — "${jd.slice(0, 500)}"

Provide:
1. The 5 most likely interview questions for this specific role at this company — based on the JD, company stage, and product challenges
2. For each question: a strong suggested answer approach and what the interviewer is really evaluating underneath the question
3. How this candidate should position themselves — what narrative arc works for this role
4. One memorable, specific thing the candidate can say that will stick with the interviewer
5. What to avoid saying — common mistakes candidates make for this type of role at this stage of company

Be specific to ${company} and this JD — not generic interview advice. Every suggestion should be grounded in what you know about this company.`,
  },
  {
    id: 'questions',
    tab: 'interview',
    title: 'Questions to Ask Them',
    icon: '❓',
    needsSearch: false,
    buildPrompt: (company, jd) => `You are a senior PM and hiring manager who has been on both sides of hundreds of interviews. The candidate is interviewing at ${company} for the following role — "${jd.slice(0, 450)}"

Generate a set of 9 sharp, specific questions the candidate should ask:
- 3 product strategy questions (show you think about the product deeply)
- 2 role-scoping questions (clarify what success looks like and what is broken)
- 2 founder-directed questions (if meeting a founder — show you've done your homework)
- 1 culture question (reveal the real culture, not the polished version)
- 1 failure/expectation question (shows maturity and self-awareness)

For each question:
- Write the question exactly as they should ask it
- Add a one-line note on why this question is sharp — what it signals about the candidate or what it reveals about the company

These should feel curious and specific, not formulaic. A bad question is one that sounds like it came from an interview prep template.`,
  },
];

export const ALL_SECTIONS = [...RESEARCH_SECTIONS, ...INTERVIEW_SECTIONS];
