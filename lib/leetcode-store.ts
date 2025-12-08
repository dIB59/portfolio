"use client"

import type { LeetCodeProblem } from "./leetcode-types"

const STORAGE_KEY = "leetcode-journey"
const AUTH_KEY = "leetcode-admin-auth"

// Default sample problems
const defaultProblems: LeetCodeProblem[] = [
  {
    id: "1",
    problemName: "Two Sum",
    problemNumber: 1,
    problemType: "Array",
    confidence: "green",
    solvedAt: "2024-01-15",
    notes: "Classic hash map solution, O(n) time complexity",
  },
  {
    id: "2",
    problemName: "Valid Parentheses",
    problemNumber: 20,
    problemType: "Stack",
    stuckOn: "Initially forgot to check if stack is empty at the end",
    confidence: "green",
    solvedAt: "2024-01-20",
  },
  {
    id: "3",
    problemName: "Merge Intervals",
    problemNumber: 56,
    problemType: "Array",
    stuckOn: "Sorting step was the key insight",
    confidence: "yellow",
    solvedAt: "2024-02-05",
  },
  {
    id: "4",
    problemName: "LRU Cache",
    problemNumber: 146,
    problemType: "Hash Table",
    stuckOn: "Doubly linked list implementation was tricky",
    confidence: "red",
    solvedAt: "2024-02-15",
    notes: "Need to review this one again",
  },
]

export function getProblems(): LeetCodeProblem[] {
  if (typeof window === "undefined") return defaultProblems

  const stored = localStorage.getItem(STORAGE_KEY)
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultProblems))
    return defaultProblems
  }

  return JSON.parse(stored)
}

export function saveProblems(problems: LeetCodeProblem[]) {
  if (typeof window === "undefined") return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(problems))
}

export function addProblem(problem: Omit<LeetCodeProblem, "id">): LeetCodeProblem {
  const problems = getProblems()
  const newProblem: LeetCodeProblem = {
    ...problem,
    id: Date.now().toString(),
  }
  problems.unshift(newProblem)
  saveProblems(problems)
  return newProblem
}

export function updateProblem(id: string, updates: Partial<LeetCodeProblem>) {
  const problems = getProblems()
  const index = problems.findIndex((p) => p.id === id)
  if (index !== -1) {
    problems[index] = { ...problems[index], ...updates }
    saveProblems(problems)
  }
}

export function deleteProblem(id: string) {
  const problems = getProblems()
  const filtered = problems.filter((p) => p.id !== id)
  saveProblems(filtered)
}

export function isAuthenticated(): boolean {
  if (typeof window === "undefined") return false
  return localStorage.getItem(AUTH_KEY) === "true"
}

export function authenticate(password: string): boolean {
  const correctPassword = "leetcode123"
  if (password === correctPassword) {
    localStorage.setItem(AUTH_KEY, "true")
    return true
  }
  return false
}

export function logout() {
  if (typeof window === "undefined") return
  localStorage.removeItem(AUTH_KEY)
}
