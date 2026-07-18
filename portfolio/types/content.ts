/**
 * CMS-ready content types.
 *
 * These types are the contract between content (currently local .ts/.json
 * modules under /content) and the components that render them. Because the
 * shape is decoupled from the source, swapping in a headless CMS later
 * (Sanity, Contentful, Payload, a database) only requires implementing a
 * fetch function that resolves to these types — no component changes.
 */

export type ProjectStatus = "live" | "in-progress" | "archived";

export interface ProjectMetric {
  label: string; // e.g. "Latency reduced"
  value: string; // e.g. "-63%"
}

export interface Project {
  slug: string;
  title: string;
  tagline: string; // one-line, outcome-oriented
  summary: string; // 2-3 sentences for cards
  problem: string; // the real-world problem, in plain terms
  approach: string; // system design / architecture narrative
  architecture: string[]; // ordered layers, e.g. ["Frontend", "API", "AI Layer", "Database", "Cloud"]
  challenges: string; // what was genuinely hard, and how it was resolved
  outcome: string; // measurable result
  lessons: string; // what changed in how the person builds, going forward
  role: string;
  year: string;
  status: ProjectStatus;
  featured: boolean;
  stack: string[];
  metrics: ProjectMetric[];
  links: {
    live?: string;
    repo?: string;
    caseStudy?: string;
  };
  coverImage: string;
  gallery?: string[];
}

export interface ExperienceEntry {
  id: string;
  org: string;
  role: string;
  start: string; // ISO date
  end: string | "present";
  location: string;
  summary: string;
  highlights: string[];
  stack: string[];
}

export interface WritingEntry {
  slug: string;
  title: string;
  excerpt: string;
  date: string; // ISO date
  readingMinutes: number;
  tags: string[];
  externalUrl?: string;
}

export interface SkillDomain {
  id: string;
  label: string;
  description: string;
  tools: string[];
}
