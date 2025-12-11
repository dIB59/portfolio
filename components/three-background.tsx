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
            fpsLimit: 60, // Limit FPS to save battery/CPU on mobile
            interactivity: {
                events: {
                    onClick: {
                        enable: true,
                        mode: "repulse",
                    },
                    onHover: {
                        enable: true,
                        mode: "grab",
                        parallax: {
                            enable: false,
                            force: 60,
                            smooth: 10,
                        },
                    },
                },
                modes: {
                    repulse: {
                        distance: 200,
                        duration: 0.4,
                    },
                    grab: {
                        distance: 150,
                        links: {
                            opacity: 0.25,
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
                    enable: true,
                    distance: 150,
                    opacity: 0.15,
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
                        value_area: 800,
                    },
                    value: 40, // Reduced base value
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
            // Responsive overrides
            responsive: [
                {
                    maxWidth: 768,
                    options: {
                        particles: {
                            number: {
                                value: 25, // Much fewer particles on mobile
                            },
                            links: {
                                enable: false, // Disable links on mobile for performance
                            },
                        },
                        interactivity: {
                            events: {
                                onHover: {
                                    enable: false, // Disable hover on mobile
                                },
                            },
                        },
                    },
                },
            ],
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
