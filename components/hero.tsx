"use client";

import { m, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { ArrowDown, Settings } from "lucide-react";
import { memo, Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

type Geo = "icosahedron" | "octahedron" | "sphere" | "cube" | "tetrahedron";

interface ItemSpec {
    geo: Geo;
    position: [number, number, number];
    scale: number;
    /** Rotation rates per axis. */
    rx: number;
    ry: number;
    rz: number;
    /** Vertical drift frequency, amplitude, and phase offset. */
    fy: number;
    amp: number;
    phase: number;
}

// Hand-tuned so the cloud reads as composed, not random — a few large
// "anchors", a few small "satellites" at different depths. Negative Z sits
// further behind the headline; positive Z pops out toward the viewer.
const ITEMS: ItemSpec[] = [
    { geo: "icosahedron", position: [0.0, 0.6, 0.0], scale: 0.95, rx: 0.10, ry: 0.14, rz: 0.0, fy: 0.6, amp: 0.10, phase: 0.0 },
    { geo: "octahedron", position: [-1.7, 1.3, -1.2], scale: 0.45, rx: 0.18, ry: 0.10, rz: 0.05, fy: 0.5, amp: 0.14, phase: 1.2 },
    { geo: "sphere", position: [1.9, -0.7, 0.4], scale: 0.55, rx: 0.0, ry: 0.06, rz: 0.0, fy: 0.45, amp: 0.18, phase: 2.4 },
    { geo: "cube", position: [-1.3, -1.5, -0.5], scale: 0.40, rx: 0.22, ry: 0.18, rz: 0.10, fy: 0.55, amp: 0.10, phase: 3.6 },
    { geo: "tetrahedron", position: [1.5, 1.6, -2.0], scale: 0.55, rx: 0.14, ry: 0.20, rz: 0.0, fy: 0.4, amp: 0.16, phase: 4.8 },
    { geo: "icosahedron", position: [0.9, -0.3, 1.4], scale: 0.32, rx: 0.20, ry: 0.16, rz: 0.0, fy: 0.7, amp: 0.08, phase: 0.6 },
    { geo: "octahedron", position: [-2.4, -0.1, 0.2], scale: 0.30, rx: 0.16, ry: 0.22, rz: 0.0, fy: 0.65, amp: 0.12, phase: 5.5 },
];

function ConstellationItem({ spec, reduced }: { spec: ItemSpec; reduced: boolean }) {
    const ref = useRef<THREE.Mesh>(null);
    const baseY = spec.position[1];

    useFrame((state, delta) => {
        const mesh = ref.current;
        if (!mesh) return;
        if (reduced) return;
        mesh.rotation.x += delta * spec.rx;
        mesh.rotation.y += delta * spec.ry;
        if (spec.rz) mesh.rotation.z += delta * spec.rz;
        mesh.position.y =
            baseY + Math.sin(state.clock.elapsedTime * spec.fy + spec.phase) * spec.amp;
    });

    return (
        <mesh ref={ref} position={spec.position} scale={spec.scale}>
            {geometryFor(spec.geo)}
            <meshStandardMaterial
                color="#d9bf80"
                metalness={1}
                roughness={0.24}
                emissive="#1c1303"
                emissiveIntensity={0.35}
                flatShading
            />
        </mesh>
    );
}

function geometryFor(geo: Geo) {
    switch (geo) {
        case "icosahedron":
            return <icosahedronGeometry args={[1, 0]} />;
        case "octahedron":
            return <octahedronGeometry args={[1, 0]} />;
        case "sphere":
            return <sphereGeometry args={[1, 32, 32]} />;
        case "cube":
            return <boxGeometry args={[1.2, 1.2, 1.2]} />;
        case "tetrahedron":
            return <tetrahedronGeometry args={[1, 0]} />;
    }
}

function Constellation({ reduced }: { reduced: boolean }) {
    // Memo the spec array reference so the children don't re-mount on parent
    // re-renders (the array itself is module-level, but this keeps intent clear).
    const items = useMemo(() => ITEMS, []);
    return (
        <>
            {items.map((spec, i) => (
                <ConstellationItem key={i} spec={spec} reduced={reduced} />
            ))}
        </>
    );
}

function HeroScene() {
    const reduced = useReducedMotion() ?? false;
    return (
        <Canvas
            dpr={[1, 1.5]}
            camera={{ position: [0, 0, 6.2], fov: 38 }}
            gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        >
            <ambientLight intensity={0.35} />
            <directionalLight position={[4, 6, 5]} intensity={1.4} color="#fff0d0" />
            <directionalLight position={[-5, -3, -2]} intensity={0.4} color="#8aa190" />
            <Suspense fallback={null}>
                <Constellation reduced={reduced} />
            </Suspense>
        </Canvas>
    );
}

export const Hero = memo(function Hero() {
    return (
        <section className="relative min-h-screen flex flex-col px-6 md:px-12 lg:px-20 pt-20 pb-12 overflow-hidden">
            <Link
                href="/admin"
                aria-label="Admin"
                className="absolute top-6 right-6 z-30 p-2 rounded-full transition-colors text-muted-foreground hover:text-foreground opacity-0 animate-fade-in"
            >
                <Settings className="w-5 h-5" aria-hidden="true" />
            </Link>

            <div
                className="absolute inset-0 z-0 pointer-events-none"
                aria-hidden="true"
            >
                <div className="absolute inset-0 md:left-1/3 lg:left-2/5">
                    <HeroScene />
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-background via-background/70 to-transparent md:via-background/40" />
            </div>

            <div className="relative z-10 flex-1 flex flex-col justify-center max-w-7xl mx-auto w-full">
                <m.h1
                    className="font-display text-foreground leading-[0.86] tracking-[-0.045em] mb-8"
                    style={{ fontSize: "clamp(3.5rem, 14vw, 12rem)" }}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.95, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                >
                    Ibrahim
                    <br />
                    Iqbal.
                </m.h1>

                <m.div
                    className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mt-4 md:mt-8 max-w-5xl"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.45 }}
                >
                    <p className="text-lg md:text-xl text-foreground/80 max-w-md leading-relaxed text-pretty">
                        Full-stack developer in Stockholm. This page is the story
                        of six projects, and what each one taught me.
                    </p>

                    <nav
                        className="flex flex-wrap gap-x-7 gap-y-3 text-base md:text-lg"
                        aria-label="Primary"
                    >
                        <a
                            href="#chapter-1"
                            className="group inline-flex items-center gap-1.5 text-foreground/90 hover:text-accent transition-colors"
                        >
                            <span className="text-accent font-mono text-xs">01</span>
                            Start the story
                        </a>
                        <Link
                            href="/leetcode"
                            className="group inline-flex items-center gap-1.5 text-foreground/70 hover:text-accent transition-colors"
                        >
                            LeetCode
                        </Link>
                        <a
                            href="#contact"
                            className="group inline-flex items-center gap-1.5 text-foreground/70 hover:text-accent transition-colors"
                        >
                            Contact
                        </a>
                    </nav>
                </m.div>
            </div>

            <m.div
                className="relative z-10 flex items-center justify-between text-[11px] md:text-xs font-mono uppercase tracking-[0.24em] text-muted-foreground pt-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.0, duration: 0.6 }}
            >
                <span className="hidden md:inline">Stockholm · Available for work</span>
                <span className="md:hidden">Stockholm</span>
                <a
                    href="#chapter-1"
                    className="inline-flex items-center gap-2 hover:text-foreground transition-colors"
                >
                    Begin
                    <ArrowDown className="w-3 h-3" aria-hidden="true" />
                </a>
            </m.div>
        </section>
    );
});
