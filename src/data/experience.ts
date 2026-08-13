import type { Experience } from "@/types";

export const experiences: Experience[] = [
  {
    id: "cognizant",
    company: "Cognizant",
    role: "Programmer Analyst",
    start: "Aug 2025",
    end: "Present",
    location: "Kolkata, India",
    kind: "Full-time",
    summary:
      "Designing and shipping a full-stack Learning Management System end to end — Angular front end, .NET services, SQL data layer.",
    highlights: [
      "Modelled the relational schema in SQL with a focus on data integrity and query optimisation.",
      "Built a modular Angular front end with a component architecture that scales past the initial feature set.",
      "Implemented business logic, data-access layers and API integrations in .NET (C#) with Entity Framework Core.",
      "Owned the data flow across all three layers, so the front end, services and database stay in step.",
    ],
    stack: ["Angular", ".NET", "C#", "EF Core", "SQL Server", "TypeScript"],
  },
  {
    id: "virtual-cybertrons",
    company: "Virtual Cybertrons",
    role: "Back End Developer",
    start: "Mar 2025",
    end: "May 2025",
    location: "Remote",
    kind: "Internship",
    summary:
      "Built and optimised backend systems, focused on API design, database efficiency and clean integration boundaries.",
    highlights: [
      "Developed REST APIs across a Node.js and Laravel stack.",
      "Modelled and queried MySQL through Sequelize, tightening slow paths.",
      "Integrated services so the client and backend shared one predictable contract.",
    ],
    stack: ["Node.js", "Laravel", "Sequelize", "MySQL", "PHP", "REST"],
  },
  {
    id: "cloudbird",
    company: "CloudBird Digital",
    role: "Senior Subject Matter Expert",
    start: "Oct 2023",
    end: "Nov 2023",
    location: "Noida, India · Remote",
    kind: "Internship",
    summary:
      "Solved advanced Physics and Computer Science problems on a live student-facing portal.",
    highlights: [
      "Delivered expert solutions to 50+ challenging problems under live conditions.",
      "Applied algorithmic reasoning to keep answers both correct and efficient.",
      "Contributed to a 15% lift in overall service quality.",
    ],
    stack: ["Algorithms", "Data Structures", "Physics", "Computer Science"],
  },
  {
    id: "maa-chakreshwari",
    company: "Maa Chakreshwari Sheetgrah Pvt. Ltd.",
    role: "Web Developer",
    start: "Aug 2023",
    end: "Nov 2023",
    location: "Haryana, India · Remote",
    kind: "Internship",
    summary:
      "Designed and built five web solutions in React and Node, then tuned them until they were measurably faster.",
    highlights: [
      "Shipped 5 web solutions across front end and back end.",
      "Cut page load times by 25% through targeted optimisation.",
      "Raised system efficiency by 20% and drove a 30% increase in site traffic.",
    ],
    stack: ["React", "Node.js", "JavaScript", "HTML", "CSS"],
  },
];
