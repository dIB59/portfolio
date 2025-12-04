"use client"

import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { useKeyboardControls } from "@/hooks/use-keyboard-controls"
import { areaDetector } from "@/lib/area-detector"
import { WORLD_BOUNDS } from "./village"
import * as THREE from "three"

export const carState = {
	position: new THREE.Vector3(),
	velocity: new THREE.Vector3(),
	direction: 0,
	speed: 0,
	isMoving: false,
	isDrifting: false,
	wheelRotation: 0,
	driftIntensity: 0,
}

function Wheel({ position }: { position: [number, number, number] }) {
	const wheelRef = useRef<THREE.Group>(null)

	useFrame(() => {
		if (wheelRef.current) {
			wheelRef.current.rotation.x = carState.wheelRotation
		}
	})

	return (
		<group ref={wheelRef} position={position}>
			<mesh rotation={[0, 0, Math.PI / 2]} castShadow>
				<cylinderGeometry args={[0.25, 0.25, 0.15, 8]} />
				<meshStandardMaterial color="#4a4a4a" flatShading />
			</mesh>
			<mesh rotation={[0, 0, Math.PI / 2]} position={[0.08, 0, 0]}>
				<cylinderGeometry args={[0.12, 0.12, 0.02, 6]} />
				<meshStandardMaterial color="#silver" flatShading />
			</mesh>
		</group>
	)
}

export function Car() {
	const carRef = useRef<THREE.Group>(null)

	const velocityX = useRef(0)
	const velocityZ = useRef(0)
	const rotationVelocity = useRef(0)
	const visualRotation = useRef(0)
	const smoothCameraPos = useRef(new THREE.Vector3(40, 35, 40))
	const smoothLookAt = useRef(new THREE.Vector3(0, 0, 0))

	const keys = useKeyboardControls()

	useFrame((state, delta) => {
		if (!carRef.current) return

		const dt = Math.min(delta, 0.02)

		const enginePower = 28
		const brakePower = 1
		const maxSpeed = 22
		const friction = 0.85
		const turnSpeed = 0.9
		const driftTurnSpeed = 1.2
		const driftFriction = 0.94
		const gripRecovery = 2.5
		const minSpeedToTurn = 0.5

		const forwardX = Math.sin(carRef.current.rotation.y)
		const forwardZ = Math.cos(carRef.current.rotation.y)

		const forwardSpeed = velocityX.current * forwardX + velocityZ.current * forwardZ
		const sidewaysSpeed = velocityX.current * forwardZ - velocityZ.current * forwardX

		const isTryingToTurn = keys.left || keys.right
		const isDrifting = keys.brake && Math.abs(forwardSpeed) > 6 && isTryingToTurn
		const driftIntensity = Math.min(Math.abs(sidewaysSpeed) / 8, 1)

		if (keys.forward) {
			velocityX.current += forwardX * enginePower * dt
			velocityZ.current += forwardZ * enginePower * dt
		}
		if (keys.backward) {
			velocityX.current -= forwardX * enginePower * 0.6 * dt
			velocityZ.current -= forwardZ * enginePower * 0.6 * dt
		}

		if (keys.brake) {
			const brakeAmount = brakePower * dt
			const currentForwardVel = forwardSpeed
			const newForwardVel =
				currentForwardVel > 0
					? Math.max(0, currentForwardVel - brakeAmount)
					: Math.min(0, currentForwardVel + brakeAmount)

			const brakeFactor = isDrifting ? 0.4 : 0.8
			const forwardDiff = (newForwardVel - currentForwardVel) * brakeFactor
			velocityX.current += forwardX * forwardDiff
			velocityZ.current += forwardZ * forwardDiff
		}

		const currentSpeed = Math.sqrt(velocityX.current ** 2 + velocityZ.current ** 2)

		if (currentSpeed > minSpeedToTurn) {
			const steerInput = (keys.left ? 1 : 0) - (keys.right ? 1 : 0)
			const speedFactor = Math.min(currentSpeed / 10, 1.2)
			const direction = forwardSpeed >= 0 ? 1 : -1

			const currentTurnSpeed = isDrifting ? driftTurnSpeed : turnSpeed
			const targetRotationVel = steerInput * currentTurnSpeed * speedFactor * direction

			const lerpFactor = isDrifting ? 0.2 : 0.08
			rotationVelocity.current = THREE.MathUtils.lerp(rotationVelocity.current, targetRotationVel, lerpFactor)
		} else {
			rotationVelocity.current *= 0.9
		}

		carRef.current.rotation.y += rotationVelocity.current * dt

		const currentFriction = isDrifting ? driftFriction : friction

		if (!isDrifting && !keys.brake) {
			const targetVelX = forwardX * forwardSpeed * currentFriction
			const targetVelZ = forwardZ * forwardSpeed * currentFriction
			velocityX.current = THREE.MathUtils.lerp(velocityX.current, targetVelX, gripRecovery * dt)
			velocityZ.current = THREE.MathUtils.lerp(velocityZ.current, targetVelZ, gripRecovery * dt)
		} else {
			velocityX.current *= currentFriction
			velocityZ.current *= currentFriction

			if (isDrifting && isTryingToTurn) {
				const kickDirection = keys.left ? -1 : 1
				const kickStrength = 0.15 * forwardSpeed * dt
				velocityX.current += forwardZ * kickDirection * kickStrength
				velocityZ.current -= forwardX * kickDirection * kickStrength
			}
		}

		const speed = Math.sqrt(velocityX.current ** 2 + velocityZ.current ** 2)
		if (speed > maxSpeed) {
			const scale = maxSpeed / speed
			velocityX.current *= scale
			velocityZ.current *= scale
		}

		let newX = carRef.current.position.x + velocityX.current * dt
		let newZ = carRef.current.position.z + velocityZ.current * dt

		if (newX < WORLD_BOUNDS.minX) {
			newX = WORLD_BOUNDS.minX
			velocityX.current *= -0.5
		} else if (newX > WORLD_BOUNDS.maxX) {
			newX = WORLD_BOUNDS.maxX
			velocityX.current *= -0.5
		}

		if (newZ < WORLD_BOUNDS.minZ) {
			newZ = WORLD_BOUNDS.minZ
			velocityZ.current *= -0.5
		} else if (newZ > WORLD_BOUNDS.maxZ) {
			newZ = WORLD_BOUNDS.maxZ
			velocityZ.current *= -0.5
		}

		carRef.current.position.x = newX
		carRef.current.position.z = newZ

		const targetTilt = isDrifting ? -rotationVelocity.current * 0.25 : -rotationVelocity.current * 0.05
		visualRotation.current = THREE.MathUtils.lerp(visualRotation.current, targetTilt, 8 * dt)
		carRef.current.rotation.z = visualRotation.current

		carState.wheelRotation += forwardSpeed * dt * 3

		carState.position.copy(carRef.current.position)
		carState.velocity.set(velocityX.current, 0, velocityZ.current)
		carState.direction = carRef.current.rotation.y
		carState.speed = forwardSpeed
		carState.isMoving = currentSpeed > 0.5
		carState.isDrifting = isDrifting
		carState.driftIntensity = isDrifting ? Math.max(driftIntensity, 0.5) : driftIntensity

		areaDetector.update(carState.position)

		const cameraDistance = 30
		const cameraHeight = 35

		const targetCameraPos = new THREE.Vector3(
			carRef.current.position.x + cameraDistance * 0.7,
			cameraHeight,
			carRef.current.position.z + cameraDistance * 0.7,
		)

		const lookAtPos = new THREE.Vector3(carRef.current.position.x, 0, carRef.current.position.z)

		smoothCameraPos.current.lerp(targetCameraPos, 0.02)
		smoothLookAt.current.lerp(lookAtPos, 0.04)

		state.camera.position.copy(smoothCameraPos.current)
		state.camera.lookAt(smoothLookAt.current)
	})

	return (
		<group ref={carRef} position={[0, 0.25, 0]}>
			{/* Car body */}
			<mesh position={[0, 0.2, 0]} castShadow>
				<boxGeometry args={[1.2, 0.4, 2.2]} />
				<meshStandardMaterial color="#f8b4c4" flatShading />
			</mesh>

			{/* Cabin */}
			<mesh position={[0, 0.55, -0.1]} castShadow>
				<boxGeometry args={[1, 0.35, 1.2]} />
				<meshStandardMaterial color="#c9e4f8" flatShading />
			</mesh>

			{/* Roof */}
			<mesh position={[0, 0.8, -0.1]} castShadow>
				<boxGeometry args={[0.9, 0.1, 1]} />
				<meshStandardMaterial color="#f8b4c4" flatShading />
			</mesh>

			{/* Front bumper */}
			<mesh position={[0, 0.1, 1.15]} castShadow>
				<boxGeometry args={[1.1, 0.2, 0.15]} />
				<meshStandardMaterial color="#e8a5b8" flatShading />
			</mesh>

			{/* Rear bumper */}
			<mesh position={[0, 0.1, -1.15]} castShadow>
				<boxGeometry args={[1.1, 0.2, 0.15]} />
				<meshStandardMaterial color="#e8a5b8" flatShading />
			</mesh>

			{/* Headlights */}
			<mesh position={[0.4, 0.25, 1.12]}>
				<boxGeometry args={[0.2, 0.15, 0.05]} />
				<meshStandardMaterial color="#ffffd4" emissive="#ffffd4" emissiveIntensity={0.5} flatShading />
			</mesh>
			<mesh position={[-0.4, 0.25, 1.12]}>
				<boxGeometry args={[0.2, 0.15, 0.05]} />
				<meshStandardMaterial color="#ffffd4" emissive="#ffffd4" emissiveIntensity={0.5} flatShading />
			</mesh>

			{/* Tail lights */}
			<mesh position={[0.4, 0.25, -1.12]}>
				<boxGeometry args={[0.2, 0.1, 0.05]} />
				<meshStandardMaterial color="#ff6b6b" emissive="#ff6b6b" emissiveIntensity={0.3} flatShading />
			</mesh>
			<mesh position={[-0.4, 0.25, -1.12]}>
				<boxGeometry args={[0.2, 0.1, 0.05]} />
				<meshStandardMaterial color="#ff6b6b" emissive="#ff6b6b" emissiveIntensity={0.3} flatShading />
			</mesh>

			{/* Wheels */}
			<Wheel position={[0.65, 0, 0.7]} />
			<Wheel position={[-0.65, 0, 0.7]} />
			<Wheel position={[0.65, 0, -0.7]} />
			<Wheel position={[-0.65, 0, -0.7]} />
		</group>
	)
}
