"use client";

import { useMemo } from "react";

// Low-poly house component
function House({
    position,
    rotation = 0,
    color = "#f8c4b4",
    roofColor = "#c9a87c",
    scale = 1,
}: {
    position: [number, number, number];
    rotation?: number;
    color?: string;
    roofColor?: string;
    scale?: number;
}) {
    return (
        <group position={position} rotation={[0, rotation, 0]} scale={scale}>
            {/* Base/walls */}
            <mesh position={[0, 1, 0]} castShadow>
                <boxGeometry args={[2, 2, 2]} />
                <meshStandardMaterial color={color} flatShading />
            </mesh>
            {/* Roof */}
            <mesh position={[0, 2.5, 0]} castShadow>
                <coneGeometry args={[1.8, 1.2, 4]} />
                <meshStandardMaterial color={roofColor} flatShading />
            </mesh>
            {/* Door */}
            <mesh position={[0, 0.6, 1.01]}>
                <boxGeometry args={[0.5, 1, 0.05]} />
                <meshStandardMaterial color="#8b6914" flatShading />
            </mesh>
            {/* Windows */}
            <mesh position={[0.6, 1.2, 1.01]}>
                <boxGeometry args={[0.4, 0.4, 0.05]} />
                <meshStandardMaterial color="#a8d8ea" flatShading />
            </mesh>
            <mesh position={[-0.6, 1.2, 1.01]}>
                <boxGeometry args={[0.4, 0.4, 0.05]} />
                <meshStandardMaterial color="#a8d8ea" flatShading />
            </mesh>
        </group>
    );
}

// Low-poly tree component
function Tree({
    position,
    scale = 1,
}: {
    position: [number, number, number];
    scale?: number;
}) {
    return (
        <group position={position} scale={scale}>
            {/* Trunk */}
            <mesh position={[0, 0.75, 0]} castShadow>
                <cylinderGeometry args={[0.2, 0.3, 1.5, 6]} />
                <meshStandardMaterial color="#a67c52" flatShading />
            </mesh>
            {/* Foliage layers */}
            <mesh position={[0, 2, 0]} castShadow>
                <coneGeometry args={[1.2, 1.5, 6]} />
                <meshStandardMaterial color="#7cb87c" flatShading />
            </mesh>
            <mesh position={[0, 2.8, 0]} castShadow>
                <coneGeometry args={[0.9, 1.2, 6]} />
                <meshStandardMaterial color="#8fbc8f" flatShading />
            </mesh>
            <mesh position={[0, 3.4, 0]} castShadow>
                <coneGeometry args={[0.6, 1, 6]} />
                <meshStandardMaterial color="#98d49e" flatShading />
            </mesh>
        </group>
    );
}

// Low-poly windmill
function Windmill({ position }: { position: [number, number, number] }) {
    return (
        <group position={position}>
            {/* Base */}
            <mesh position={[0, 2, 0]} castShadow>
                <cylinderGeometry args={[1.2, 1.8, 4, 6]} />
                <meshStandardMaterial color="#f5e6d3" flatShading />
            </mesh>
            {/* Roof */}
            <mesh position={[0, 4.5, 0]} castShadow>
                <coneGeometry args={[1.5, 1.5, 6]} />
                <meshStandardMaterial color="#c9a87c" flatShading />
            </mesh>
            {/* Blades hub */}
            <mesh position={[0, 3, 1.3]} castShadow>
                <cylinderGeometry args={[0.3, 0.3, 0.3, 6]} />
                <meshStandardMaterial
                    color="#8b6914"
                    flatShading
                    rotation={[Math.PI / 2, 0, 0]}
                />
            </mesh>
            {/* Blades */}
            {[0, 1, 2, 3].map((i) => (
                <mesh
                    key={i}
                    position={[0, 3, 1.5]}
                    rotation={[0, 0, (Math.PI / 2) * i]}
                    castShadow
                >
                    <boxGeometry args={[0.2, 2.5, 0.05]} />
                    <meshStandardMaterial color="#d4c4a8" flatShading />
                </mesh>
            ))}
        </group>
    );
}

// Low-poly fence
function Fence({
    position,
    rotation = 0,
    length = 6,
}: {
    position: [number, number, number];
    rotation?: number;
    length?: number;
}) {
    const posts = Math.floor(length / 1.5);
    return (
        <group position={position} rotation={[0, rotation, 0]}>
            {Array.from({ length: posts }).map((_, i) => (
                <group key={i} position={[i * 1.5 - length / 2 + 0.75, 0, 0]}>
                    {/* Post */}
                    <mesh position={[0, 0.5, 0]} castShadow>
                        <boxGeometry args={[0.15, 1, 0.15]} />
                        <meshStandardMaterial color="#a67c52" flatShading />
                    </mesh>
                    {/* Rails */}
                    {i < posts - 1 && (
                        <>
                            <mesh position={[0.75, 0.3, 0]} castShadow>
                                <boxGeometry args={[1.5, 0.1, 0.08]} />
                                <meshStandardMaterial
                                    color="#c9a87c"
                                    flatShading
                                />
                            </mesh>
                            <mesh position={[0.75, 0.6, 0]} castShadow>
                                <boxGeometry args={[1.5, 0.1, 0.08]} />
                                <meshStandardMaterial
                                    color="#c9a87c"
                                    flatShading
                                />
                            </mesh>
                        </>
                    )}
                </group>
            ))}
        </group>
    );
}

// Low-poly rock
function Rock({
    position,
    scale = 1,
}: {
    position: [number, number, number];
    scale?: number;
}) {
    return (
        <mesh position={position} scale={scale} castShadow>
            <dodecahedronGeometry args={[0.5, 0]} />
            <meshStandardMaterial color="#9e9e9e" flatShading />
        </mesh>
    );
}

// Low-poly bush
function Bush({
    position,
    scale = 1,
}: {
    position: [number, number, number];
    scale?: number;
}) {
    return (
        <group position={position} scale={scale}>
            <mesh position={[0, 0.3, 0]} castShadow>
                <dodecahedronGeometry args={[0.5, 0]} />
                <meshStandardMaterial color="#7cb87c" flatShading />
            </mesh>
            <mesh position={[0.3, 0.25, 0.2]} castShadow>
                <dodecahedronGeometry args={[0.35, 0]} />
                <meshStandardMaterial color="#8fbc8f" flatShading />
            </mesh>
            <mesh position={[-0.25, 0.2, -0.15]} castShadow>
                <dodecahedronGeometry args={[0.3, 0]} />
                <meshStandardMaterial color="#98d49e" flatShading />
            </mesh>
        </group>
    );
}

// Low-poly well
function Well({ position }: { position: [number, number, number] }) {
    return (
        <group position={position}>
            {/* Base */}
            <mesh position={[0, 0.4, 0]} castShadow>
                <cylinderGeometry args={[0.8, 0.9, 0.8, 8]} />
                <meshStandardMaterial color="#a0a0a0" flatShading />
            </mesh>
            {/* Posts */}
            <mesh position={[0.5, 1.2, 0]} castShadow>
                <boxGeometry args={[0.15, 1.6, 0.15]} />
                <meshStandardMaterial color="#a67c52" flatShading />
            </mesh>
            <mesh position={[-0.5, 1.2, 0]} castShadow>
                <boxGeometry args={[0.15, 1.6, 0.15]} />
                <meshStandardMaterial color="#a67c52" flatShading />
            </mesh>
            {/* Roof */}
            <mesh position={[0, 2.2, 0]} rotation={[0, 0, 0]} castShadow>
                <boxGeometry args={[1.4, 0.1, 0.8]} />
                <meshStandardMaterial color="#c9a87c" flatShading />
            </mesh>
            {/* Water */}
            <mesh position={[0, 0.2, 0]}>
                <cylinderGeometry args={[0.6, 0.6, 0.1, 8]} />
                <meshStandardMaterial color="#6eb5ff" flatShading />
            </mesh>
        </group>
    );
}

// Boundary walls to keep car in play area
function BoundaryWalls() {
    const wallThickness = 2;
    const wallHeight = 3;
    const areaSize = 55;

    return (
        <group>
            {/* North wall */}
            <mesh position={[0, wallHeight / 2, -areaSize]} castShadow>
                <boxGeometry
                    args={[
                        areaSize * 2 + wallThickness,
                        wallHeight,
                        wallThickness,
                    ]}
                />
                <meshStandardMaterial color="#d4b896" flatShading />
            </mesh>
            {/* South wall */}
            <mesh position={[0, wallHeight / 2, areaSize]} castShadow>
                <boxGeometry
                    args={[
                        areaSize * 2 + wallThickness,
                        wallHeight,
                        wallThickness,
                    ]}
                />
                <meshStandardMaterial color="#d4b896" flatShading />
            </mesh>
            {/* East wall */}
            <mesh position={[areaSize, wallHeight / 2, 0]} castShadow>
                <boxGeometry
                    args={[
                        wallThickness,
                        wallHeight,
                        areaSize * 2 + wallThickness,
                    ]}
                />
                <meshStandardMaterial color="#d4b896" flatShading />
            </mesh>
            {/* West wall */}
            <mesh position={[-areaSize, wallHeight / 2, 0]} castShadow>
                <boxGeometry
                    args={[
                        wallThickness,
                        wallHeight,
                        areaSize * 2 + wallThickness,
                    ]}
                />
                <meshStandardMaterial color="#d4b896" flatShading />
            </mesh>

            {/* Corner towers */}
            {[
                [areaSize, areaSize],
                [areaSize, -areaSize],
                [-areaSize, areaSize],
                [-areaSize, -areaSize],
            ].map(([x, z], i) => (
                <group key={i} position={[x, 0, z]}>
                    <mesh position={[0, 2.5, 0]} castShadow>
                        <cylinderGeometry args={[2, 2.2, 5, 6]} />
                        <meshStandardMaterial color="#c9a87c" flatShading />
                    </mesh>
                    <mesh position={[0, 5.5, 0]} castShadow>
                        <coneGeometry args={[2.5, 2, 6]} />
                        <meshStandardMaterial color="#a67c52" flatShading />
                    </mesh>
                </group>
            ))}
        </group>
    );
}

export function Village() {
    const houses = useMemo(
        () => [
            {
                position: [-20, 0, -15] as [number, number, number],
                rotation: 0.3,
                color: "#f8c4b4",
                roofColor: "#c9a87c",
            },
            {
                position: [-25, 0, -8] as [number, number, number],
                rotation: -0.2,
                color: "#ffe4c4",
                roofColor: "#a67c52",
            },
            {
                position: [20, 0, -12] as [number, number, number],
                rotation: 0.5,
                color: "#ffd8c4",
                roofColor: "#c9a87c",
            },
            {
                position: [25, 0, 8] as [number, number, number],
                rotation: -0.4,
                color: "#f8d4b4",
                roofColor: "#b8956c",
            },
            {
                position: [-18, 0, 18] as [number, number, number],
                rotation: 0.8,
                color: "#ffe8d4",
                roofColor: "#c9a87c",
            },
            {
                position: [15, 0, 20] as [number, number, number],
                rotation: -0.6,
                color: "#f8c8b8",
                roofColor: "#a67c52",
            },
            {
                position: [-30, 0, 5] as [number, number, number],
                rotation: 1.2,
                color: "#ffecd8",
                roofColor: "#c9a87c",
                scale: 1.2,
            },
            {
                position: [30, 0, -5] as [number, number, number],
                rotation: -1.0,
                color: "#f8d8c8",
                roofColor: "#b8956c",
                scale: 0.9,
            },
        ],
        [],
    );

    const trees = useMemo(
        () => [
            { position: [-35, 0, -25] as [number, number, number], scale: 1.2 },
            { position: [-40, 0, -20] as [number, number, number], scale: 0.9 },
            { position: [-38, 0, 15] as [number, number, number], scale: 1.1 },
            { position: [35, 0, -28] as [number, number, number], scale: 1.0 },
            { position: [40, 0, 20] as [number, number, number], scale: 1.3 },
            { position: [38, 0, -15] as [number, number, number], scale: 0.85 },
            { position: [-10, 0, -35] as [number, number, number], scale: 1.0 },
            { position: [12, 0, -38] as [number, number, number], scale: 1.15 },
            { position: [-15, 0, 35] as [number, number, number], scale: 0.95 },
            { position: [18, 0, 38] as [number, number, number], scale: 1.1 },
            { position: [-45, 0, 30] as [number, number, number], scale: 1.4 },
            { position: [45, 0, -30] as [number, number, number], scale: 1.25 },
        ],
        [],
    );

    const bushes = useMemo(
        () => [
            { position: [-12, 0, -10] as [number, number, number], scale: 1.0 },
            { position: [14, 0, -8] as [number, number, number], scale: 0.8 },
            { position: [-8, 0, 12] as [number, number, number], scale: 1.2 },
            { position: [10, 0, 15] as [number, number, number], scale: 0.9 },
            { position: [-32, 0, -18] as [number, number, number], scale: 1.1 },
            { position: [28, 0, 18] as [number, number, number], scale: 1.0 },
        ],
        [],
    );

    const rocks = useMemo(
        () => [
            { position: [-8, 0, -22] as [number, number, number], scale: 0.8 },
            { position: [6, 0, 25] as [number, number, number], scale: 1.2 },
            { position: [-25, 0, 28] as [number, number, number], scale: 0.6 },
            { position: [32, 0, -25] as [number, number, number], scale: 1.0 },
        ],
        [],
    );

    return (
        <group>
            {/* Houses */}
            {houses.map((props, i) => (
                <House key={`house-${i}`} {...props} />
            ))}

            {/* Trees */}
            {trees.map((props, i) => (
                <Tree key={`tree-${i}`} {...props} />
            ))}

            {/* Bushes */}
            {bushes.map((props, i) => (
                <Bush key={`bush-${i}`} {...props} />
            ))}

            {/* Rocks */}
            {rocks.map((props, i) => (
                <Rock key={`rock-${i}`} {...props} />
            ))}

            {/* Fences */}
            <Fence position={[-20, 0, -18]} rotation={0} length={8} />
            <Fence position={[20, 0, -15]} rotation={0.3} length={6} />
            <Fence position={[-22, 0, 15]} rotation={-0.2} length={7} />

            {/* Well in village center */}
            <Well position={[8, 0, -5]} />

            {/* Windmill */}
            <Windmill position={[-35, 0, -35]} />

            {/* Boundary walls with corner towers */}
            <BoundaryWalls />
        </group>
    );
}

// Export collision bounds for the car
export const WORLD_BOUNDS = {
    minX: -53,
    maxX: 53,
    minZ: -53,
    maxZ: 53,
};
