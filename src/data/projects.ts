import type { Project } from "@/types";

/**
 * The Work section renders this array in order — add, remove or reorder
 * freely and the indices below are the only thing to keep in sync.
 * `image` is optional: without one, the card renders a generated
 * typographic plate rather than a stock screenshot.
 */
export const projects: Project[] = [
  {
    id: "lms",
    index: "01",
    title: "Enterprise Learning Management System",
    year: "2025",
    blurb:
      "A full-stack LMS built at Cognizant — course management, role-based access and content delivery across three layers.",
    detail:
      "Designed and delivered end to end as part of a structured engineering engagement. The SQL layer came first: relational modelling with real attention to data integrity and query optimisation. On top of that, a .NET (C#) backend using Entity Framework Core for business logic, data access and API integration, and a modular Angular front end built to keep growing after handover. The work I'm proudest of is the seam between them — data flows through all three layers without the usual translation bugs.",
    stack: ["Angular", ".NET", "C#", "EF Core", "SQL Server", "TypeScript"],
    isPrivate: true,
  },
  {
    id: "ggsipu",
    index: "02",
    title: "GGSIPU University Website",
    year: "2022",
    blurb:
      "The main university portal for Guru Gobind Singh Indraprastha University, serving 114 affiliated colleges.",
    detail:
      "Developed and integrated ten advanced features into the primary GGSIPU website — the front door for 114 affiliated colleges and every student who deals with them. Built in HTML, CSS, JavaScript and PHP against an existing production system, which meant every change had to land without breaking what was already there. The features shipped drove a 40% improvement in user interaction.",
    stack: ["HTML", "CSS", "JavaScript", "PHP"],
    live: "https://www.ipu.ac.in/",
  },
  {
    id: "planyourday",
    index: "03",
    title: "PlanYourDay",
    year: "2024",
    blurb:
      "A zero-dependency task planner that runs entirely in the browser — no backend, no build step, no account.",
    detail:
      "A to-do and daily planning portal written in vanilla JavaScript, deliberately without a framework. State lives client-side, deployment is a static push to GitHub Pages, and the whole thing loads instantly because there is nothing to load. A useful counterweight to the enterprise stack — proof that not every problem needs a framework attached to it.",
    stack: ["JavaScript", "HTML", "CSS", "GitHub Pages"],
    repo: "https://github.com/M-J-7/PlanyourDay",
    live: "https://m-j-7.github.io/PlanyourDay/",
  },
  {
    id: "resume-builder",
    index: "04",
    title: "Resume Builder",
    year: "2022",
    blurb:
      "A browser-based résumé builder that turns a filled-in form into a clean, printable document.",
    detail:
      "A resume-building portal that takes structured input and renders a formatted, export-ready résumé in the browser. An early project, and the one where I first had to think properly about form state, layout under print media queries, and what happens when a user pastes in far more text than the design expected.",
    stack: ["HTML", "CSS", "JavaScript"],
    repo: "https://github.com/M-J-7/resume_builder.github.io",
  },
];
