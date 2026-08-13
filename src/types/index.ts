export interface Experience {
  id: string;
  company: string;
  role: string;
  start: string;
  end: string | "Present";
  location: string;
  kind: "Full-time" | "Internship" | "Freelance";
  summary: string;
  highlights: string[];
  stack: string[];
}

export interface Project {
  id: string;
  index: string;
  title: string;
  year: string;
  blurb: string;
  detail: string;
  stack: string[];
  /** Absent for enterprise work that has no public repository. */
  repo?: string;
  live?: string;
  /** Enterprise projects render a "private" badge instead of links. */
  isPrivate?: boolean;
  /** Optional screenshot. Falls back to a generated typographic plate. */
  image?: string;
}

export interface SkillGroup {
  label: string;
  items: string[];
}

export interface Certification {
  id: string;
  title: string;
  issuer: string;
  date: string;
  credentialId?: string;
  description: string;
  stack: string[];
}

export interface NavItem {
  label: string;
  href: string;
  index: string;
}

/** Mono annotation in the About section's left gutter. Optionally a link. */
export interface AboutNote {
  text: string;
  href?: string;
}

/**
 * A figure in the About band. `source` names the employer and year — without
 * it a bare number is ambiguous, which is exactly how the old "114" failed.
 */
export interface Metric {
  value: number;
  suffix?: string;
  label: string;
  source: string;
}
