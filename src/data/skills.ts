import type { SkillGroup } from "@/types";

export const skillGroups: SkillGroup[] = [
  {
    label: "Frontend",
    items: ["React", "Angular", "TypeScript", "JavaScript", "HTML5", "CSS", "Tailwind"],
  },
  {
    label: "Backend",
    items: [".NET / C#", "Node.js", "Express", "Laravel", "PHP", "Sequelize", "REST APIs"],
  },
  {
    label: "Data",
    items: ["SQL Server", "MySQL", "MongoDB", "Entity Framework Core"],
  },
  {
    label: "Tooling",
    items: ["Git", "GitHub Actions", "CI/CD", "Vite", "C++", "Python"],
  },
];

/** Marquee rows — two counter-scrolling bands in the Stack section. */
export const marqueeRows: [string[], string[]] = [
  ["React", "Angular", ".NET", "TypeScript", "Node.js", "SQL Server", "Entity Framework"],
  ["Laravel", "MySQL", "MongoDB", "Express", "C#", "Sequelize", "Tailwind", "Git"],
];
