"use client"

import type { Project } from "./projects-data"

const STORAGE_KEY = "portfolio-projects"

// Default projects data
const defaultProjects: Project[] = [
  {
    id: "1",
    title: "AI-Powered Analytics Platform",
    year: "2024",
    month: "March",
    description: "Built an enterprise analytics dashboard with real-time data processing and AI-driven insights.",
    fullDescription:
      "Led the development of a comprehensive analytics platform serving 50+ enterprise clients. The system processes millions of data points daily, providing real-time insights through an intuitive dashboard interface.",
    techStack: ["Next.js", "TypeScript", "Python", "TensorFlow", "PostgreSQL", "Redis"],
    image: "/modern-analytics-dashboard-dark-theme.png",
    achievements: [
      "Reduced data processing time by 60%",
      "Achieved 99.9% uptime SLA",
      "Onboarded 50+ enterprise clients",
    ],
    liveUrl: "https://example.com",
    githubUrl: "https://github.com",
  },
  {
    id: "2",
    title: "E-Commerce Marketplace",
    year: "2023",
    month: "September",
    description:
      "Developed a multi-vendor marketplace with advanced search, real-time inventory, and payment processing.",
    fullDescription:
      "Architected and built a scalable e-commerce platform supporting multiple vendors and thousands of products.",
    techStack: ["React", "Node.js", "MongoDB", "Elasticsearch", "Stripe", "AWS"],
    achievements: ["Scaled to 100K+ monthly active users", "Processed $2M+ in transactions"],
    liveUrl: "https://example.com",
    githubUrl: "https://github.com",
  },
  {
    id: "3",
    title: "Real-Time Collaboration Tool",
    year: "2022",
    month: "June",
    description:
      "Created a Figma-like collaboration platform with real-time sync, presence indicators, and version control.",
    techStack: ["Vue.js", "WebSockets", "Go", "PostgreSQL", "Redis", "Docker"],
    achievements: ["Achieved sub-50ms sync latency", "Supported 500+ concurrent users per session"],
    githubUrl: "https://github.com",
  },
]

export function getProjects(): Project[] {
  if (typeof window === "undefined") return defaultProjects

  const stored = localStorage.getItem(STORAGE_KEY)
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultProjects))
    return defaultProjects
  }

  return JSON.parse(stored)
}

export function saveProjects(projects: Project[]) {
  if (typeof window === "undefined") return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects))
}

export function addProject(project: Omit<Project, "id">): Project {
  const projects = getProjects()
  const newProject: Project = {
    ...project,
    id: Date.now().toString(),
  }
  projects.unshift(newProject)
  saveProjects(projects)
  return newProject
}

export function updateProject(id: string, updates: Partial<Project>) {
  const projects = getProjects()
  const index = projects.findIndex((p) => p.id === id)
  if (index !== -1) {
    projects[index] = { ...projects[index], ...updates }
    saveProjects(projects)
  }
}

export function deleteProject(id: string) {
  const projects = getProjects()
  const filtered = projects.filter((p) => p.id !== id)
  saveProjects(filtered)
}
