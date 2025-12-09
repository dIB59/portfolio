"use client";

import { useEffect, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Text, Html } from "@react-three/drei";
import * as THREE from "three";
import { areaDetector, type AreaZone } from "@/lib/area-detector";

interface ProjectZone extends AreaZone {
    stayDuration: number;
    project: {
        title: string;
        description: string;
        link: string;
        color: string;
    };
}

interface AreaZonesProps {
    onZoneComplete?: (zoneId: string) => void;
}

const zones: ProjectZone[] = [
    {
        id: "zone-1",
        position: new THREE.Vector3(25, 0, 25),
        radius: 5,
        stayDuration: 3,
        project: {
            title: "Portfolio",
            description: "My personal portfolio website",
            link: "https://portfolio.example.com",
            color: "#f8b4c4",
        },
    },
    {
        id: "zone-2",
        position: new THREE.Vector3(-25, 0, -25),
        radius: 5,
        stayDuration: 3,
        project: {
            title: "E-Commerce",
            description: "Full-stack shopping platform",
            link: "https://shop.example.com",
            color: "#b4d4f8",
        },
    },
    {
        id: "zone-3",
        position: new THREE.Vector3(30, 0, 0),
        radius: 5,
        stayDuration: 3,
        project: {
            title: "Dashboard",
            description: "Analytics dashboard app",
            link: "https://dashboard.example.com",
            color: "#d4f8b4",
        },
    },
    {
        id: "zone-4",
        position: new THREE.Vector3(-30, 0, 0),
        radius: 5,
        stayDuration: 3,
        project: {
            title: "Game",
            description: "Multiplayer browser game",
            link: "https://game.example.com",
            color: "#f8d4b4",
        },
    },
];

export function AreaZones({ onZoneComplete }: AreaZonesProps) {
    const [zoneProgress, setZoneProgress] = useState<Record<string, number>>(
        {},
    );
    const [completedZones, setCompletedZones] = useState<Set<string>>(
        new Set(),
    );
    const markerRefs = useRef<Map<string, THREE.Mesh>>(new Map());

    const onZoneCompleteRef = useRef(onZoneComplete);
    useEffect(() => {
        onZoneCompleteRef.current = onZoneComplete;
    }, [onZoneComplete]);

    useEffect(() => {
        zones.forEach((zone) => {
            areaDetector.addZone({
                id: zone.id,
                position: zone.position,
                radius: zone.radius,
                onStay: (id, time) => {
                    setZoneProgress((prev) => ({
                        ...prev,
                        [id]: Math.min(time / zone.stayDuration, 1),
                    }));
                },
                onExit: (id) => {
                    setZoneProgress((prev) => ({ ...prev, [id]: 0 }));
                },
            });

            areaDetector.onStayForDuration(zone.id, zone.stayDuration, () => {
                setCompletedZones((prev) => new Set([...prev, zone.id]));
                onZoneCompleteRef.current?.(zone.id);
            });
        });

        return () => {
            zones.forEach((zone) => areaDetector.removeZone(zone.id));
        };
    }, []); // Safe to keep empty deps now that zones is constant and callback is in ref

    useFrame((state) => {
        const time = state.clock.elapsedTime;

        markerRefs.current.forEach((mesh, id) => {
            if (mesh) {
                mesh.rotation.y = time * 2;
                const progress = zoneProgress[id] || 0;
                const bounce = Math.sin(time * 3) * 0.1;
                mesh.position.y = 0.8 + bounce + progress * 0.3;
            }
        });
    });

    return (
        <group>
            {zones.map((zone) => {
                const isCompleted = completedZones.has(zone.id);
                const progress = zoneProgress[zone.id] || 0;
                const timeRemaining = zone.stayDuration * (1 - progress);
                const isActive = progress > 0 && !isCompleted;

                return (
                    <group key={zone.id} position={zone.position.toArray()}>
                        {/* Base platform */}
                        <mesh
                            rotation={[-Math.PI / 2, 0, 0]}
                            position={[0, 0.02, 0]}
                        >
                            <circleGeometry args={[zone.radius, 24]} />
                            <meshStandardMaterial
                                color={
                                    isCompleted ? "#98d4a0" : zone.project.color
                                }
                                transparent
                                opacity={0.5}
                                flatShading
                            />
                        </mesh>

                        {/* Outer ring */}
                        <mesh
                            rotation={[-Math.PI / 2, 0, 0]}
                            position={[0, 0.03, 0]}
                        >
                            <ringGeometry
                                args={[zone.radius - 0.3, zone.radius, 32]}
                            />
                            <meshStandardMaterial
                                color={isCompleted ? "#65bf70" : "#e8a5c8"}
                                transparent
                                opacity={0.8}
                                flatShading
                            />
                        </mesh>

                        {/* Progress ring */}
                        {isActive && (
                            <mesh
                                rotation={[-Math.PI / 2, 0, 0]}
                                position={[0, 0.04, 0]}
                            >
                                <ringGeometry
                                    args={[
                                        zone.radius - 0.15,
                                        zone.radius + 0.15,
                                        48,
                                        1,
                                        0,
                                        Math.PI * 2 * progress,
                                    ]}
                                />
                                <meshStandardMaterial
                                    color="#ffaa44"
                                    emissive="#ff8800"
                                    emissiveIntensity={0.5}
                                    flatShading
                                />
                            </mesh>
                        )}

                        {/* Center marker */}
                        <mesh
                            position={[0, 0.8, 0]}
                            castShadow
                            ref={(ref) => {
                                if (ref) markerRefs.current.set(zone.id, ref);
                            }}
                        >
                            <octahedronGeometry args={[0.7, 0]} />
                            <meshStandardMaterial
                                color={
                                    isCompleted
                                        ? "#65bf70"
                                        : isActive
                                          ? "#ffaa55"
                                          : zone.project.color
                                }
                                flatShading
                                emissive={
                                    isCompleted
                                        ? "#65bf70"
                                        : isActive
                                          ? "#ff8800"
                                          : zone.project.color
                                }
                                emissiveIntensity={
                                    isCompleted ? 0.5 : isActive ? 0.6 : 0.2
                                }
                            />
                        </mesh>

                        {/* Project title */}
                        <Text
                            position={[0, 2.5, 0]}
                            fontSize={1.4}
                            color={isCompleted ? "#65bf70" : "#ffffff"}
                            anchorX="center"
                            anchorY="middle"
                            outlineWidth={0.08}
                            outlineColor="#333333"
                        >
                            {zone.project.title}
                        </Text>

                        {/* Time remaining countdown */}
                        {isActive && (
                            <>
                                <Text
                                    position={[0, 4.5, 0]}
                                    fontSize={2.2}
                                    color="#ffcc66"
                                    anchorX="center"
                                    anchorY="middle"
                                    outlineWidth={0.1}
                                    outlineColor="#333333"
                                >
                                    {timeRemaining.toFixed(1)}s
                                </Text>

                                <mesh position={[0, 1.8, 0]}>
                                    <boxGeometry args={[5, 0.6, 0.1]} />
                                    <meshStandardMaterial
                                        color="#444444"
                                        flatShading
                                    />
                                </mesh>

                                <mesh
                                    position={[
                                        -2.5 + progress * 2.5,
                                        1.8,
                                        0.06,
                                    ]}
                                >
                                    <boxGeometry
                                        args={[5 * progress, 0.55, 0.1]}
                                    />
                                    <meshStandardMaterial
                                        color="#ffaa44"
                                        emissive="#ff8800"
                                        emissiveIntensity={0.4}
                                        flatShading
                                    />
                                </mesh>
                            </>
                        )}

                        {/* Completed project billboard on ground */}
                        {isCompleted && (
                            <group
                                position={[0, 0.15, 0]}
                                rotation={[-Math.PI / 2, 0, 0]}
                            >
                                <mesh>
                                    <planeGeometry args={[14, 10]} />
                                    <meshStandardMaterial
                                        color="#ffffff"
                                        flatShading
                                    />
                                </mesh>

                                <mesh position={[0, 0, -0.01]}>
                                    <planeGeometry args={[14.6, 10.6]} />
                                    <meshStandardMaterial
                                        color={zone.project.color}
                                        flatShading
                                    />
                                </mesh>

                                <Text
                                    position={[0, 2.5, 0.02]}
                                    fontSize={1.8}
                                    color="#333333"
                                    anchorX="center"
                                    anchorY="middle"
                                    fontWeight="bold"
                                    maxWidth={12}
                                >
                                    {zone.project.title}
                                </Text>

                                <Text
                                    position={[0, 0.2, 0.02]}
                                    fontSize={1.0}
                                    color="#666666"
                                    anchorX="center"
                                    anchorY="middle"
                                    maxWidth={12}
                                >
                                    {zone.project.description}
                                </Text>

                                <mesh position={[0, -2.8, 0.01]}>
                                    <planeGeometry args={[8, 2]} />
                                    <meshStandardMaterial
                                        color={zone.project.color}
                                        flatShading
                                    />
                                </mesh>

                                <Text
                                    position={[0, -2.8, 0.02]}
                                    fontSize={1.0}
                                    color="#333333"
                                    anchorX="center"
                                    anchorY="middle"
                                    fontWeight="bold"
                                >
                                    Visit Project →
                                </Text>

                                <Html
                                    position={[0, 0, 0.1]}
                                    center
                                    style={{ pointerEvents: "auto" }}
                                >
                                    <a
                                        href={zone.project.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="block w-[350px] h-[250px] cursor-pointer opacity-0 hover:opacity-10 bg-white transition-opacity"
                                    />
                                </Html>
                            </group>
                        )}

                        {isCompleted && (
                            <pointLight
                                position={[0, 2, 0]}
                                color="#65bf70"
                                intensity={2}
                                distance={10}
                            />
                        )}
                    </group>
                );
            })}
        </group>
    );
}
