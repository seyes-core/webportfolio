import type { Project } from "@/types/content";

/**
 * Project content.
 * Add a new object to this array to add a project — no component code
 * needs to change. Each project automatically gets a detail route at
 * /work/[slug] via generateStaticParams in app/(site)/work/[slug]/page.tsx.
 */
export const projects: Project[] = [
  {
    slug: "lagos-property-intelligence",
    title: "Lagos Property Intelligence",
    tagline: "An AI-assisted investment platform for reading a property market, not just browsing listings.",
    summary:
      "Helps buyers evaluate real estate opportunities using valuation analytics, market trend modeling, and predictive insights — built on a background in Estate Management as much as in code.",
    problem:
      "Property investment decisions in fast-moving markets like Lagos are usually made on gut feeling and word of mouth, because the data that would support a real valuation is scattered, informal, or not digitized at all.",
    approach:
      "Structured a pipeline that ingests listing and transaction data, normalizes it into a consistent valuation schema, and layers an AI analysis stage on top that explains — not just predicts — why a property is priced where it is relative to its neighborhood trend.",
    architecture: ["Frontend", "API", "AI Layer", "Database", "Cloud"],
    challenges:
      "Real estate data in this market is inconsistent by nature — addresses, currency formats, and listing quality vary wildly. Most of the actual engineering effort went into a resilient normalization layer, not the AI itself.",
    outcome:
      "A working prototype that turns fragmented listing data into a valuation view a buyer can actually reason about, with trend context instead of a bare price tag.",
    lessons:
      "The hard part of applied AI is almost never the model call — it's building data pipelines trustworthy enough that the model's output means something.",
    role: "Solo full-stack + AI engineer",
    year: "2026",
    status: "in-progress",
    featured: true,
    stack: ["Next.js", "TypeScript", "Python", "OpenAI", "PostgreSQL", "Azure"],
    metrics: [
      { label: "Listings normalized", value: "1,000+" },
      { label: "Data sources unified", value: "3" },
    ],
    links: {},
    coverImage: "/images/projects/lagos-property-cover.svg",
  },
  {
    slug: "fundraiser-payments-platform",
    title: "Fundraiser Payments Platform",
    tagline: "A production donation platform that survives real payment traffic.",
    summary:
      "A full-stack fundraising site handling live donations end-to-end: webhook-verified payments, transactional email, and a dashboard for tracking progress in real time.",
    problem:
      "Most personal fundraising pages are static and trust-poor: no receipts, no verified payment state, no visibility into whether a donation actually succeeded.",
    approach:
      "Built on Next.js 14 with a Postgres-backed Supabase layer for donation records, Flutterwave for payment processing, and signature-verified webhooks as the single source of truth for payment state — never the client. Resend handles transactional receipts. Every webhook event is idempotently reconciled against the donations table to prevent double-counting under retries.",
    architecture: ["Frontend", "API", "Webhook Handler", "Database", "Cloud"],
    challenges:
      "Payment webhooks arrive out of order and sometimes twice. The real work was making every write idempotent so a retried webhook could never double-credit a donation.",
    outcome:
      "Shipped to production and processed real donations with zero payment-state discrepancies; page load and Core Web Vitals tuned for mobile-first traffic.",
    lessons:
      "Never trust payment state from the client — treat the webhook, signature-verified, as the only source of truth, and design the schema so replays are safe by construction.",
    role: "Solo full-stack engineer",
    year: "2025",
    status: "live",
    featured: true,
    stack: ["Next.js", "TypeScript", "Supabase", "Postgres", "Flutterwave", "Resend", "Vercel"],
    metrics: [
      { label: "Payment reconciliation errors", value: "0" },
      { label: "Mobile Lighthouse score", value: "96" },
    ],
    links: {
      live: "https://fundraiser-one-inky.vercel.app",
    },
    coverImage: "/images/projects/fundraiser-cover.svg",
  },
  {
    slug: "cloud-lab-provisioner",
    title: "Cloud Lab Provisioner",
    tagline: "Infrastructure-as-code that turns a blank cloud account into a working pentest lab in minutes.",
    summary:
      "An ARM-template-driven provisioning system that stands up hardened Windows and Linux VMs for security research, entirely from a mobile device.",
    problem:
      "Setting up isolated lab environments for security research is normally desktop-bound and manual — a real constraint when your primary device is a phone.",
    approach:
      "Designed idempotent ARM templates with parameterized SKUs, region fallback logic (for SKU availability across regions), and NSG rule generation baked into the template rather than applied post-deploy. Iterated entirely through Azure Cloud Shell and the Azure Portal mobile app, closing the loop between 'what failed' and 'what changed' without a desktop in the picture.",
    architecture: ["ARM Template", "Provisioning API", "Network Layer", "Compute", "Cloud"],
    challenges:
      "SKU availability differs by region in ways the docs don't fully capture. Built region-fallback logic directly into the template so a deploy degrades gracefully instead of failing outright.",
    outcome:
      "Reduced environment setup from a manual, error-prone multi-step process to a single parameterized deployment, repeatable across regions.",
    lessons:
      "Infrastructure-as-code is only as trustworthy as its idempotency — a template that can't be re-run safely isn't finished.",
    role: "Infrastructure engineer",
    year: "2025",
    status: "in-progress",
    featured: true,
    stack: ["Azure", "ARM Templates", "PowerShell", "NSG", "Azure Cloud Shell"],
    metrics: [
      { label: "Manual setup steps removed", value: "12" },
      { label: "Deploy time", value: "~6 min" },
    ],
    links: {},
    coverImage: "/images/projects/cloud-lab-cover.svg",
  },
  {
    slug: "ai-cli-router",
    title: "Multi-Model CLI Router",
    tagline: "One coding CLI, routed across frontier models through a unified gateway.",
    summary:
      "Configured and debugged a developer environment where AI coding CLIs (Claude Code, Codex CLI) route through OpenRouter, giving model flexibility without changing workflow.",
    problem:
      "Coding agents are typically locked to a single provider; comparing frontier models mid-task means switching tools entirely.",
    approach:
      "Diagnosed environment PATH conflicts, corrected model-slug formatting mismatches between providers, and resolved gateway billing/auth errors (402s) blocking requests — treating the CLI environment itself as a system to be debugged with logs and reproducible steps rather than trial and error.",
    architecture: ["CLI", "Gateway", "Model Router", "Provider APIs"],
    challenges:
      "The failure modes were silent — a wrong model slug or a billing edge case looks identical to a network error from the CLI's side. Diagnosis meant instrumenting each layer separately.",
    outcome:
      "A single, portable CLI workflow on a cloud VM that can route the same coding task across multiple frontier models on demand.",
    lessons:
      "Developer environments are systems too — they deserve the same debugging discipline as production code.",
    role: "Systems / DevEx engineer",
    year: "2026",
    status: "in-progress",
    featured: false,
    stack: ["Windows VM (Azure)", "OpenRouter", "Claude Code", "Codex CLI", "PowerShell"],
    metrics: [{ label: "Providers unified behind one CLI", value: "2" }],
    links: {},
    coverImage: "/images/projects/cli-router-cover.svg",
  },
];

export function getFeaturedProjects(): Project[] {
  return projects.filter((p) => p.featured);
}

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function getAllProjectSlugs(): string[] {
  return projects.map((p) => p.slug);
}
