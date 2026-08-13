import type { Certification } from "@/types";

export const certifications: Certification[] = [
  {
    id: "simplilearn-prompt",
    title: "Introduction to Prompt Engineering",
    issuer: "Simplilearn",
    date: "Feb 2025",
    credentialId: "7858274",
    description:
      "Designing prompts that hold up — structuring context, controlling output shape, and knowing where model reasoning stops being reliable.",
    stack: ["Prompt Engineering", "LLMs", "ChatGPT"],
  },
  {
    id: "quantium",
    title: "Software Engineering Job Simulation",
    issuer: "Quantium",
    date: "Nov 2024",
    credentialId: "TDPJ8HzoTrmLdtRJb",
    description:
      "Data processing and interactive application work in Python — building with Dash and Pandas, then writing the test suites and automation to keep it honest.",
    stack: ["Python", "Pandas", "Plotly", "HTML", "CSS"],
  },
  {
    id: "datacom-cloud",
    title: "Introduction to Cloud Job Simulation",
    issuer: "Datacom",
    date: "2024",
    description:
      "Cloud application registration and deployment automation — building CI/CD workflows with GitHub Actions to take the manual steps out of shipping.",
    stack: ["CI/CD", "GitHub Actions", "Git"],
  },
];
