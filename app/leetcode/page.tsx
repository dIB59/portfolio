import { ThreeBackground } from "@/components/three-background"
import { LeetCodeSection } from "@/components/leetcode/leetcode-section"

export default function LeetCodePage() {
  return (
    <main className="relative min-h-screen bg-background overflow-hidden">
      <ThreeBackground />
      <div className="relative z-10">
        <LeetCodeSection />
      </div>
    </main>
  )
}
