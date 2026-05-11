"use client";

import nextDynamic from "next/dynamic";

const TriangleInterlude = nextDynamic(
    () => import("./triangle-interlude").then((m) => m.TriangleInterlude),
    { ssr: false, loading: () => <div className="h-[80vh] md:h-screen bg-background" /> },
);
const ParticleInterlude = nextDynamic(
    () => import("./particle-interlude").then((m) => m.ParticleInterlude),
    { ssr: false, loading: () => <div className="h-[85vh] md:h-screen bg-background" /> },
);

interface InterludeProps {
    kind: "triangle" | "particles";
}

export function Interlude({ kind }: InterludeProps) {
    if (kind === "triangle") return <TriangleInterlude />;
    if (kind === "particles") return <ParticleInterlude />;
    return null;
}
