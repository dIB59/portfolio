"use client"

const AUTH_KEY = "portfolio-admin-auth"

export function isAdminAuthenticated(): boolean {
  if (typeof window === "undefined") return false
  return localStorage.getItem(AUTH_KEY) === "true"
}

export function adminAuthenticate(password: string): boolean {
  // Change this password in production
  const correctPassword = "admin123"
  if (password === correctPassword) {
    localStorage.setItem(AUTH_KEY, "true")
    return true
  }
  return false
}

export function adminLogout() {
  if (typeof window === "undefined") return
  localStorage.removeItem(AUTH_KEY)
}
