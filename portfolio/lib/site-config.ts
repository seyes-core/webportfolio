export const siteConfig = {
  name: "Seye",
  fullName: "Seye Ade",
  role: "Software Engineer — Systems, Cloud & AI Products",
  shortBio:
    "I design scalable systems, AI-powered products, and modern web experiences that turn complex ideas into tools people actually use.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://seye.dev",
  email: "hello@seye.dev",
  location: "Lagos, Nigeria — working async, open to remote & relocation",
  social: {
    github: "https://github.com/Bambillion",
    linkedin: "https://linkedin.com/in/seye-o-gungbuji",
    x: "https://x.com/seye",
  },
  nav: [
    { id: "00", label: "Index", href: "/" },
    { id: "01", label: "System", href: "/about" },
    { id: "02", label: "Work", href: "/work" },
    { id: "03", label: "Log", href: "/writing" },
    { id: "04", label: "Contact", href: "/contact" },
  ],
  domains: [
    {
      id: "ai",
      label: "AI Products",
      description: "LLM-powered features, evaluation, and applied ML pipelines.",
    },
    {
      id: "cloud",
      label: "Cloud Infrastructure",
      description: "Azure & GCP architecture, IaC, provisioning at scale.",
    },
    {
      id: "data",
      label: "Data Engineering",
      description: "Pipelines, warehousing, and analytics-ready systems.",
    },
    {
      id: "product",
      label: "Full-Stack Product",
      description: "Next.js, typed APIs, and interfaces people actually use.",
    },
  ],
} as const;

export type SiteConfig = typeof siteConfig;

/** Career path used by the animated journey timeline. */
export const journey = [
  { id: "estate", label: "Estate Management", note: "Where the obsession with real-world systems started." },
  { id: "technology", label: "Technology", note: "Discovered software as leverage, not just a career pivot." },
  { id: "programming", label: "Programming", note: "Python, SQL, then TypeScript — building to learn." },
  { id: "cloud", label: "Cloud", note: "Azure & GCP, infrastructure as a design surface." },
  { id: "ai", label: "AI", note: "LLMs, agents, and retrieval as product ingredients." },
  { id: "building", label: "Building Products", note: "Shipping full systems end to end, not demos." },
  { id: "entrepreneurship", label: "Entrepreneurship", note: "Building toward a founding-engineer future." },
] as const;

/** Engineering principles for the Philosophy section. */
export const principles = [
  { id: "long-term", title: "Think Long-Term", body: "Optimize for the system's next five years, not this sprint's demo." },
  { id: "systems", title: "Build Systems", body: "A feature is a promise the system has to keep under load. Design the system first." },
  { id: "scale", title: "Design for Scale", body: "Architecture decisions should survive ten times the users, without a rewrite." },
  { id: "automate", title: "Automate Repetition", body: "If I do it twice by hand, the third time is a script." },
  { id: "real-problems", title: "Solve Real Problems", body: "Technology that doesn't measurably improve someone's day isn't finished yet." },
  { id: "learning", title: "Keep Learning", body: "First principles over frameworks — tools change, fundamentals compound." },
] as const;

/** Homepage metrics — animated counters. */
export const metrics = [
  { id: "projects", label: "Projects Built", value: 12 },
  { id: "repos", label: "Repositories", value: 40 },
  { id: "tech", label: "Technologies", value: 25 },
  { id: "hours", label: "Hours Learning", value: 2400 },
  { id: "oss", label: "Open Source Contributions", value: 18 },
  { id: "courses", label: "Courses Completed", value: 15 },
] as const;

/** Ways AI shows up as a product ingredient, not a feature bolt-on. */
export const aiCapabilities = [
  "Document Intelligence",
  "Property Analysis",
  "Workflow Automation",
  "Knowledge Retrieval",
  "Agent Systems",
  "Semantic Search",
  "Prompt Engineering",
  "Vector Databases",
  "LLMs",
  "Fine-tuning",
  "MCP Servers",
] as const;

/** Skill architecture, rendered as an animated diagram rather than a logo wall. */
export const architecture = [
  { id: "frontend", label: "Frontend", tools: ["React", "Next.js", "TypeScript", "Tailwind"] },
  { id: "backend", label: "Backend", tools: ["Python", "Django", "FastAPI", "Node"] },
  { id: "cloud", label: "Cloud", tools: ["Azure", "Docker", "Linux", "GitHub Actions"] },
  { id: "ai", label: "AI", tools: ["OpenAI", "RAG", "Vector Search", "Prompt Engineering", "AI Agents"] },
  { id: "data", label: "Data", tools: ["PostgreSQL", "MySQL", "SQL", "Supabase"] },
] as const;

/** whoami-style terminal content. */
export const terminal = {
  interests: [
    "Artificial Intelligence",
    "Cloud",
    "Real Estate Technology",
    "Automation",
    "Agriculture",
    "Open Source",
  ],
  currentGoal: "Building software that improves life at scale.",
} as const;

export const testimonials = [
  {
    id: "t1",
    quote:
      "Seye moved from asking good questions to shipping a working system faster than anyone I've worked with at this stage of their career.",
    name: "Engineering Lead",
    context: "Collaborator, cloud infrastructure project",
  },
  {
    id: "t2",
    quote:
      "The rare engineer who can explain the architecture to a non-technical stakeholder and then go build it exactly that way.",
    name: "Product Manager",
    context: "Fundraising platform launch",
  },
  {
    id: "t3",
    quote:
      "Genuinely curious about how things work under the hood — that curiosity shows up in the reliability of what they ship.",
    name: "Mentor",
    context: "Cloud & security coursework",
  },
] as const;
