import type { AboutNote, Metric, NavItem } from "@/types";

/**
 * The three figures in the About band. Each is a number Mihir personally
 * caused, with its provenance attached — the previous set led with "114
 * colleges", which describes the size of GGSIPU rather than anything he did.
 *
 * All three trace to `experience.ts`: the LMS was delivered across exactly
 * three layers (Angular, .NET/EF Core, SQL), ten functionalities went into the
 * GGSIPU site, and five web solutions shipped at Maa Chakreshwari.
 */
const metrics: Metric[] = [
  {
    value: 3,
    label: "Layers owned on one system — interface, services, schema",
    source: "Cognizant · 2025",
  },
  {
    value: 10,
    label: "Features shipped into a live university system",
    source: "GGSIPU · 2022",
  },
  {
    value: 5,
    label: "Client web products designed and delivered",
    source: "Maa Chakreshwari · 2023",
  },
];

/**
 * Declared out here so the annotation survives the `as const` on `profile` —
 * inlined, each entry would narrow to its own literal type and the optional
 * `href` would vanish from the union.
 */
const aboutNotes: AboutNote[] = [
  { text: "Aug 2025 —\nKolkata" },
  { text: "2022 — 2025" },
  { text: "Off the clock" },
  { text: "↓ Say hello", href: "#contact" },
];

export const profile = {
  name: "Mihir Jha",
  firstName: "Mihir",
  lastName: "Jha",
  pronouns: "He/Him",
  role: "Programmer Analyst",
  company: "Cognizant",
  location: "New Delhi, India",
  timezone: "Asia/Kolkata",
  timezoneLabel: "IST",
  availableForWork: true,

  /** Headline, split for per-word mask reveal. The italic word is the accent. */
  headline: [
    { text: "Building", italic: false },
    { text: "software", italic: true },
    { text: "that", italic: false },
    { text: "ships.", italic: false },
  ],

  intro:
    "Full-stack engineer shipping enterprise systems at Cognizant — Angular and .NET on the front, SQL and Entity Framework underneath. Before that, backend APIs in Node and Laravel, and a university site serving 114 colleges.",

  /** The scroll-lit statement that opens the About section. */
  aboutLead:
    "I write code the way I'd want to inherit it — clear, boring in the right places, and honest about what it does.",

  /**
   * Body copy, paired 1:1 with `aboutNotes` below — each paragraph gets a mono
   * annotation in the left margin, so the two arrays must stay the same length.
   */
  /** `*asterisks*` render as italic emphasis in the body serif. Use sparingly. */
  about: [
    "Right now I'm at Cognizant, building a Learning Management System from the schema up — Angular in front, .NET and Entity Framework behind, SQL underneath. My favourite part isn't any single layer. It's the seams: getting three technologies to agree on what a piece of data *means*, so nobody downstream has to guess.",
    "I got here the *scenic route*. Node and Laravel APIs at Virtual Cybertrons. React builds I kept tuning until pages loaded a quarter faster. Ten features on the GGSIPU university site, which quietly serves 114 colleges and every student who's ever checked a result at 2am. Different stacks, same lesson — the interesting problems are never the ones in the tutorial.",
    "Away from the keyboard I'm probably gaming. It's how I switch off, and it's also where I learned to keep circling a problem long after it stopped being fun. Which, most weeks, *is* the job.",
    "I'm at my best on teams that argue about the right things and ship anyway. If you're building something where the hard part is making it hold up in production, I'd like to hear about it.",
  ],

  aboutNotes,
  metrics,

  /** Live status panel. Any row with an empty value hides itself. */
  currently: {
    building: "Enterprise LMS — Cognizant",
    learning: "System design, .NET internals",
    // TODO(mihir): drop in whatever you're actually playing and this row appears.
    playing: "",
  },

  links: {
    github: "https://github.com/M-J-7",
    linkedin: "https://www.linkedin.com/in/mihirjha7/",
    x: "https://x.com/MihirJha007",
    resume:
      "https://drive.google.com/file/d/1-cR8FWnk0H7ZNBGsS015VAF2CbipBgP1/view",
  },

  // TODO(mihir): set your public contact address, then flip `hasEmail` to true.
  // Until then the contact section leads with the form and LinkedIn.
  email: "",
  hasEmail: false,

  education: {
    school: "Guru Gobind Singh Indraprastha University",
    faculty: "USICT",
    degree: "B.Tech, Electronics & Communication Engineering",
    start: "Dec 2021",
    end: "May 2025",
    roles: [
      "Lead Web Developer — ACM USICT",
      "Lead Web Developer — SDC USICT",
      "Organiser — Lord of the Line",
      "Coordinator — Hash Tech",
    ],
  },
} as const;

export const navItems: NavItem[] = [
  { label: "Work", href: "#work", index: "01" },
  { label: "Experience", href: "#experience", index: "02" },
  { label: "About", href: "#about", index: "03" },
  { label: "Stack", href: "#stack", index: "04" },
  { label: "Contact", href: "#contact", index: "05" },
];
