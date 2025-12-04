// Utility to detect if cart stays in a specified area for x seconds
import type * as THREE from "three"

export interface AreaZone {
  id: string
  position: THREE.Vector3
  radius: number
  onEnter?: (id: string) => void
  onStay?: (id: string, timeInArea: number) => void
  onExit?: (id: string) => void
}

export class AreaDetector {
  private zones: Map<string, AreaZone> = new Map()
  private entryTimes: Map<string, number> = new Map()
  private currentlyInside: Set<string> = new Set()
  private stayCallbacks: Map<string, { duration: number; callback: () => void; triggered: boolean }> = new Map()

  addZone(zone: AreaZone) {
    this.zones.set(zone.id, zone)
  }

  removeZone(id: string) {
    this.zones.delete(id)
    this.entryTimes.delete(id)
    this.currentlyInside.delete(id)
    this.stayCallbacks.delete(id)
  }

  // Register a callback when cart stays in zone for specified duration
  onStayForDuration(zoneId: string, durationSeconds: number, callback: () => void) {
    this.stayCallbacks.set(zoneId, { duration: durationSeconds, callback, triggered: false })
  }

  // Check if cart is in a specific zone
  isInZone(zoneId: string): boolean {
    return this.currentlyInside.has(zoneId)
  }

  // Get time spent in zone (0 if not inside)
  getTimeInZone(zoneId: string): number {
    const entryTime = this.entryTimes.get(zoneId)
    if (!entryTime || !this.currentlyInside.has(zoneId)) return 0
    return (Date.now() - entryTime) / 1000
  }

  // Call this every frame with cart position
  update(cartPosition: THREE.Vector3) {
    for (const [id, zone] of this.zones) {
      const distance = cartPosition.distanceTo(zone.position)
      const isInside = distance <= zone.radius

      if (isInside && !this.currentlyInside.has(id)) {
        // Just entered
        this.currentlyInside.add(id)
        this.entryTimes.set(id, Date.now())
        zone.onEnter?.(id)

        // Reset triggered state for stay callbacks
        const stayCallback = this.stayCallbacks.get(id)
        if (stayCallback) {
          stayCallback.triggered = false
        }
      } else if (!isInside && this.currentlyInside.has(id)) {
        // Just exited
        this.currentlyInside.delete(id)
        this.entryTimes.delete(id)
        zone.onExit?.(id)
      }

      // Check stay duration
      if (isInside) {
        const timeInArea = this.getTimeInZone(id)
        zone.onStay?.(id, timeInArea)

        const stayCallback = this.stayCallbacks.get(id)
        if (stayCallback && !stayCallback.triggered && timeInArea >= stayCallback.duration) {
          stayCallback.triggered = true
          stayCallback.callback()
        }
      }
    }
  }

  // Get all zones the cart is currently inside
  getActiveZones(): string[] {
    return Array.from(this.currentlyInside)
  }

  // Reset all tracking
  reset() {
    this.entryTimes.clear()
    this.currentlyInside.clear()
    for (const callback of this.stayCallbacks.values()) {
      callback.triggered = false
    }
  }
}

// Singleton instance
export const areaDetector = new AreaDetector()
