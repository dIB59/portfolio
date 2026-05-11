import type { Metadata } from "next";
import { LeetCodeSection } from "@/components/leetcode/leetcode-section";

export const metadata: Metadata = {
    title: "LeetCode Progress",
    description: "Tracking my problem-solving journey and algorithmic progress on LeetCode.",
};

export default function LeetCodePage() {
    return (
        <main className="relative min-h-screen bg-background overflow-hidden">
            <LeetCodeSection />
        </main>
    );
}
