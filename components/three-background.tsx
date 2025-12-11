"use client";

import Particles, { initParticlesEngine } from "@tsparticles/react";
import { useEffect, useMemo, useState } from "react";
import { loadSlim } from "@tsparticles/slim";

import { cn } from "@/lib/utils"; // Assuming this is your class utility function
import { AnimatePresence, m } from "framer-motion"; // Using 'framer-motion' instead of 'motion/react' for standard setup

const ParticlesComponent = ({ className }: { className: string }) => {
    const [init, setInit] = useState(false);

    // 1. Initialize the tsParticles engine
    useEffect(() => {
        initParticlesEngine(async (engine) => {
            await loadSlim(engine);
        }).then(() => {
            setInit(true);
        });
    }, []);

    const baseColor = "#ffffff";

    const foregroundColor = "#1F1F1F";

    const options = useMemo(
        () => ({
            background: {
                color: {
                    value: baseColor,
                },
                opacity: 1,
            },
            fpsLimit: 120,
            interactivity: {
                events: {
                    onClick: {
                        enable: true,
                        mode: "repulse",
                    },
                    onHover: {
                        enable: true,
                        mode: "grab",
                    },
                },
                modes: {
                    repulse: {
                        distance: 200,
                        duration: 0.5,
                    },
                    grab: {
                        distance: 150,
                        links: {
                            opacity: 0.25, // This is a high opacity value, typically 0 to 1
                        },
                    },
                },
            },
            particles: {
                color: {
                    value: foregroundColor,
                },
                links: {
                    color: foregroundColor,
                    enable: true, // Enable links for the 'grab' interaction to work visually
                    distance: 150,
                    opacity: 0.15, // Set a low opacity for subtle connections
                    width: 1,
                },
                move: {
                    direction: "none" as const,
                    enable: true,
                    outModes: {
                        default: "bounce" as const,
                    },
                    random: true,
                    speed: 1,
                    straight: false,
                },
                number: {
                    density: {
                        enable: true,
                        value_area: 1200, // Adjusted density area for fewer, spread-out particles
                    },
                    value: 100, // Adjusted particle count
                },
                opacity: {
                    value: 1.0,
                },
                shape: {
                    type: "circle",
                },
                size: {
                    value: { min: 1, max: 3 },
                },
            },
            detectRetina: true,
        }),
        [],
    );

    if (!init) return null;

    return (
        <AnimatePresence>
            <m.div
                key="particles"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ type: "spring", duration: 2 }}
                exit={{ opacity: 0 }}
                // Ensure the div covers the whole screen and is behind content
                className={cn(
                    "fixed inset-0 z-0 pointer-events-none",
                    className,
                )}
            >
                <Particles className="w-full h-full" options={options} />
            </m.div>
            )
        </AnimatePresence>
    );
};

export default ParticlesComponent;
