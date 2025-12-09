import ParticlesComponent from "@/components/three-background";
import { LeetCodeSection } from "@/components/leetcode/leetcode-section";

export default function LeetCodePage() {
    return (
        <main className="relative min-h-screen bg-background overflow-hidden">
            <ParticlesComponent className={""} />
            <div className="relative z-10">
                <LeetCodeSection />
            </div>
        </main>
    );
}
