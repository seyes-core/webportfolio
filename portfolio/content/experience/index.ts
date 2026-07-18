import type { ExperienceEntry, SkillDomain, WritingEntry } from "@/types/content";

export const experience: ExperienceEntry[] = [
  {
    id: "independent-2025",
    org: "Independent",
    role: "Software Engineer — Cloud, Data & AI Systems",
    start: "2025-01-01",
    end: "present",
    location: "Lagos, Nigeria (remote)",
    summary:
      "Building and shipping production systems end-to-end: cloud infrastructure, full-stack products, and AI-assisted developer tooling — while preparing for a founding-engineer role.",
    highlights: [
      "Designed and deployed a full-stack payments platform to production, including webhook-verified transaction handling.",
      "Authored idempotent ARM templates to provision hardened cloud lab environments across multiple Azure regions.",
      "Built and debugged a multi-model AI coding workflow routed through a unified API gateway.",
      "Studied applied linear algebra (Strang) and distributed systems fundamentals to ground engineering decisions in first principles.",
    ],
    stack: ["Next.js", "TypeScript", "Python", "SQL", "Azure", "GCP", "Supabase"],
  },
];

export const skillDomains: SkillDomain[] = [
  {
    id: "ai",
    label: "AI Products",
    description:
      "Applying LLMs to real product surfaces — not demos. Prompt/response evaluation, tool-use pipelines, and CLI-based agent workflows.",
    tools: ["Claude", "OpenRouter", "Prompt Engineering", "RAG fundamentals"],
  },
  {
    id: "cloud",
    label: "Cloud Infrastructure",
    description:
      "Provisioning and operating infrastructure as code, with a focus on reproducibility and least-privilege networking.",
    tools: ["Azure", "GCP", "ARM Templates", "NSG / Firewall Rules", "Cloud Shell"],
  },
  {
    id: "data",
    label: "Data Engineering",
    description:
      "Structuring data so systems and people can trust it: pipelines, schemas, and analytics-ready warehousing.",
    tools: ["SQL", "Python", "Postgres", "ETL fundamentals"],
  },
  {
    id: "product",
    label: "Full-Stack Product",
    description:
      "Shipping interfaces backed by typed APIs and real data models — from Figma-less first principles to production deploy.",
    tools: ["Next.js", "TypeScript", "Supabase", "Tailwind CSS", "Vercel"],
  },
];

export const writing: WritingEntry[] = [
  {
    slug: "debugging-arm-templates-from-a-phone",
    title: "Debugging ARM Templates From a Phone",
    excerpt:
      "Notes on provisioning Azure infrastructure entirely from Cloud Shell and the Portal app — schema errors, SKU availability, and NSG rules with no desktop in sight.",
    date: "2025-11-02",
    readingMinutes: 6,
    tags: ["Azure", "Infrastructure", "Mobile-first workflow"],
  },
  {
    slug: "webhook-verification-that-doesnt-trust-the-client",
    title: "Webhook Verification That Doesn't Trust the Client",
    excerpt:
      "Why payment state should never originate from the browser, and how idempotent webhook handling prevented double-counted donations in production.",
    date: "2025-08-14",
    readingMinutes: 7,
    tags: ["Payments", "Backend", "Reliability"],
  },
  {
    slug: "routing-one-cli-across-frontier-models",
    title: "Routing One CLI Across Frontier Models",
    excerpt:
      "Treating a broken developer environment as a systems problem: PATH conflicts, model-slug mismatches, and a 402 that turned out to be a billing edge case.",
    date: "2026-06-20",
    readingMinutes: 5,
    tags: ["DevEx", "AI Tooling"],
  },
];
