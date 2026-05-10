"use client";

import Particles, { initParticlesEngine } from "@tsparticles/react";
import { useEffect, useMemo, useState } from "react";
import { loadSlim } from "@tsparticles/slim";
import { useTheme } from "next-themes";

import { cn } from "@/lib/utils";
import { AnimatePresence, m, useReducedMotion } from "framer-motion";

const ParticlesComponent = ({ className }: { className: string }) => {
    const [init, setInit] = useState(false);
    const { resolvedTheme } = useTheme();
    const prefersReducedMotion = useReducedMotion();

    useEffect(() => {
        initParticlesEngine(async (engine) => {
            await loadSlim(engine);
        }).then(() => {
            setInit(true);
        });
    }, []);

    const particleColor = resolvedTheme === "dark" ? "#74c694" : "#7ba588";

    const options = useMemo(
        () => ({
            fpsLimit: 60,
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
                            opacity: 0.15,
                        },
                    },
                },
            },
            particles: {
                color: {
                    value: particleColor,
                },
                links: {
                    color: particleColor,
                    enable: true,
                    distance: 150,
                    opacity: 0.08,
                    width: 1,
                },
                move: {
                    direction: "none" as const,
                    enable: true,
                    outModes: {
                        default: "bounce" as const,
                    },
                    random: true,
                    speed: 0.6,
                    straight: false,
                },
                number: {
                    density: {
                        enable: true,
                        value_area: 800,
                    },
                    value: 20,
                },
                opacity: {
                    value: 0.45,
                },
                shape: {
                    type: "circle",
                },
                size: {
                    value: { min: 1, max: 2.5 },
                },
            },
            detectRetina: true,
            responsive: [
                {
                    maxWidth: 768,
                    options: {
                        particles: {
                            number: {
                                value: 12,
                            },
                            links: {
                                enable: false,
                            },
                        },
                        interactivity: {
                            events: {
                                onHover: {
                                    enable: false,
                                },
                            },
                        },
                    },
                },
            ],
        }),
        [particleColor],
    );

    if (prefersReducedMotion) return null;
    if (!init) return null;

    return (
        <AnimatePresence>
            <m.div
                key="particles"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ type: "spring", duration: 2 }}
                exit={{ opacity: 0 }}
                className={cn(
                    "fixed inset-0 z-0 pointer-events-none",
                    className,
                )}
                aria-hidden="true"
            >
                <Particles className="w-full h-full" options={options} />
            </m.div>
        </AnimatePresence>
    );
};

export default ParticlesComponent;
