"use client";

import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { m, useReducedMotion } from "framer-motion";
import * as THREE from "three";

interface ParticlesProps {
    count: number;
    reduced: boolean;
}

function Particles({ count, reduced }: ParticlesProps) {
    const ref = useRef<THREE.Points>(null);

    // Static positions, computed once. No per-frame CPU writes — the whole
    // group just rotates, so the GPU does all the work.
    const positions = useMemo(() => {
        const arr = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            const r = Math.pow(Math.random(), 0.55) * 4.2;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
            arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
            arr[i * 3 + 2] = r * Math.cos(phi);
        }
        return arr;
    }, [count]);

    useFrame((_, delta) => {
        if (reduced || !ref.current) return;
        ref.current.rotation.y += delta * 0.08;
        ref.current.rotation.x += delta * 0.025;
    });

    return (
        <points ref={ref}>
            <bufferGeometry>
                <bufferAttribute attach="attributes-position" args={[positions, 3]} />
            </bufferGeometry>
            <pointsMaterial
                size={0.045}
                color="#d9c79a"
                transparent
                opacity={0.85}
                sizeAttenuation
                depthWrite={false}
                blending={THREE.AdditiveBlending}
            />
        </points>
    );
}

export function ParticleInterlude() {
    const reduced = useReducedMotion() ?? false;
    // 800 reads as "many" without burning CPU. Compared to 25k in the real
    // project: a hint, not a recreation.
    const count = 800;

    return (
        <section
            aria-label="Interlude: a particle cloud"
            className="relative w-full h-[70vh] md:h-[85vh] border-t border-border/60 overflow-hidden"
        >
            <div className="absolute inset-0">
                <Canvas
                    dpr={[1, 1.5]}
                    camera={{ position: [0, 0, 9], fov: 38 }}
                    gl={{ antialias: true, powerPreference: "high-performance" }}
                >
                    <color attach="background" args={["#0a0807"]} />
                    <Suspense fallback={null}>
                        <Particles count={count} reduced={reduced} />
                    </Suspense>
                </Canvas>
            </div>

            <m.div
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2, delay: 0.2 }}
                viewport={{ once: true, margin: "-15%" }}
                className="absolute bottom-10 md:bottom-16 left-6 md:left-12 lg:left-20 right-6 max-w-md pointer-events-none"
            >
                <p className="text-[11px] font-mono uppercase tracking-[0.28em] text-accent/80 mb-3">
                    <span className="inline-block w-6 h-px bg-accent align-middle mr-2" />
                    Interlude
                </p>
                <p
                    className="font-display text-foreground/90 leading-[1.05] tracking-[-0.02em]"
                    style={{ fontSize: "clamp(1.25rem, 2.6vw, 2rem)" }}
                >
                    Half a million of these,
                    <br />
                    each with their own gravity, on the GPU, in Rust.
                </p>
            </m.div>
        </section>
    );
}
