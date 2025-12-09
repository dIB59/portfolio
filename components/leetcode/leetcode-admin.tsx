"use client"

import type React from "react"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { authenticate, logout, addProblem } from "@/lib/leetcode-store"
import { PROBLEM_TYPES, type ProblemType, type Confidence, Difficulty } from "@/lib/leetcode-types"
import { Lock, LogOut, Plus, ChevronUp } from "lucide-react"

interface LeetCodeAdminProps {
  isAdmin: boolean
  setIsAdmin: (value: boolean) => void
  onProblemAdded: () => void
}

export function LeetCodeAdmin({ isAdmin, setIsAdmin, onProblemAdded }: LeetCodeAdminProps) {
  const [showLoginForm, setShowLoginForm] = useState(false)
  const [showAddForm, setShowAddForm] = useState(false)
  const [password, setPassword] = useState("")
  const [loginError, setLoginError] = useState("")

  const [problemName, setProblemName] = useState("")
  const [problemNumber, setProblemNumber] = useState("")
  const [problemType, setProblemType] = useState<ProblemType>("Array")
  const [stuckOn, setStuckOn] = useState("")
  const [confidence, setConfidence] = useState<Confidence>("green")
  const [problemDifficulty, setProblemDifficulty] = useState<Difficulty>("easy")

  const [solvedAt, setSolvedAt] = useState(new Date().toISOString().split("T")[0])
  const [notes, setNotes] = useState("")

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (authenticate(password)) {
      setIsAdmin(true)
      setShowLoginForm(false)
      setPassword("")
      setLoginError("")
    } else {
      setLoginError("Incorrect password")
    }
  }

  const handleLogout = () => {
    logout()
    setIsAdmin(false)
  }

  const handleAddProblem = (e: React.FormEvent) => {
    e.preventDefault()
    if (!problemName.trim()) return

    addProblem({
      name: problemName.trim(),
      problemNumber: problemNumber ? Number.parseInt(problemNumber) : undefined,
      difficulty: problemDifficulty,
      type: problemType,
      stuckOn: stuckOn.trim() || undefined,
      confidence,
      solvedDate: solvedAt,
      notes: notes.trim() || undefined,
    })

    setProblemName("")
    setProblemNumber("")
    setProblemType("Array")
    setStuckOn("")
    setConfidence("green")
    setSolvedAt(new Date().toISOString().split("T")[0])
    setNotes("")
    setShowAddForm(false)
    onProblemAdded()
  }

  return (
    <div className="mb-12">
      <AnimatePresence mode="wait">
        {!isAdmin ? (
          <motion.div
            key="login-section"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex justify-center"
          >
            {!showLoginForm ? (
              <Button variant="outline" size="sm" onClick={() => setShowLoginForm(true)} className="gap-2">
                <Lock className="w-4 h-4" />
                Admin Login
              </Button>
            ) : (
              <motion.form
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                onSubmit={handleLogin}
                className="flex flex-col sm:flex-row gap-3 items-center bg-card/80 backdrop-blur-sm p-4 rounded-xl border"
              >
                <Input
                  type="password"
                  placeholder="Enter admin password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-48"
                />
                <div className="flex gap-2">
                  <Button type="submit" size="sm">
                    Login
                  </Button>
                  <Button type="button" variant="ghost" size="sm" onClick={() => setShowLoginForm(false)}>
                    Cancel
                  </Button>
                </div>
                {loginError && <span className="text-destructive text-sm">{loginError}</span>}
              </motion.form>
            )}
          </motion.div>
        ) : (
          <motion.div key="admin-section" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="flex justify-center gap-3 mb-6">
              <Button onClick={() => setShowAddForm(!showAddForm)} className="gap-2">
                {showAddForm ? <ChevronUp className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                {showAddForm ? "Hide Form" : "Add Problem"}
              </Button>
              <Button variant="outline" onClick={handleLogout} className="gap-2 bg-transparent">
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            </div>

            <AnimatePresence>
              {showAddForm && (
                <motion.form
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  onSubmit={handleAddProblem}
                  className="bg-card/80 backdrop-blur-sm rounded-xl p-6 border shadow-lg max-w-2xl mx-auto overflow-hidden"
                >
                  <h3 className="text-lg font-semibold mb-4 text-foreground">Add New Problem</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="problemName">Problem Name *</Label>
                      <Input
                        id="problemName"
                        value={problemName}
                        onChange={(e) => setProblemName(e.target.value)}
                        placeholder="e.g., Two Sum"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="problemNumber">Problem Number</Label>
                      <Input
                        id="problemNumber"
                        type="number"
                        value={problemNumber}
                        onChange={(e) => setProblemNumber(e.target.value)}
                        placeholder="e.g., 1"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="problemType">Problem Type *</Label>
                      <Select value={problemType} onValueChange={(v) => setProblemType(v as ProblemType)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {PROBLEM_TYPES.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="problemDifficulty">Problem Difficulty *</Label>
                      <Select value={problemDifficulty} onValueChange={(v) => setProblemDifficulty(v as Difficulty)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {["easy", "medium", "hard"].map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confidence">Confidence Level *</Label>
                      <Select value={confidence} onValueChange={(v) => setConfidence(v as Confidence)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="green">
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 rounded-full bg-green-500" />
                              Confident
                            </div>
                          </SelectItem>
                          <SelectItem value="yellow">
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 rounded-full bg-yellow-500" />
                              Needs Review
                            </div>
                          </SelectItem>
                          <SelectItem value="red">
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 rounded-full bg-red-500" />
                              Struggled
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="solvedAt">Date Solved *</Label>
                      <Input
                        id="solvedAt"
                        type="date"
                        value={solvedAt}
                        onChange={(e) => setSolvedAt(e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="stuckOn">Got Stuck On</Label>
                      <Input
                        id="stuckOn"
                        value={stuckOn}
                        onChange={(e) => setStuckOn(e.target.value)}
                        placeholder="What was tricky?"
                      />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="notes">Additional Notes</Label>
                      <Input
                        id="notes"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Any additional notes..."
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 mt-6">
                    <Button type="button" variant="ghost" onClick={() => setShowAddForm(false)}>
                      Cancel
                    </Button>
                    <Button type="submit">Add Problem</Button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
