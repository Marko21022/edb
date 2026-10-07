import { Event } from "./Event.js"
import type { EventDefinition, EventHandler } from "../types/event.js"

export class EventManager {
    private readonly events = new Map<string, Event[]>()

    public register<T extends unknown[] = unknown[]>(
        name: string,
        options: EventDefinition<T> | EventHandler<T>
    ): Event<T> {
        const event = new Event(name, options)

        const existing = this.events.get(name) ?? []

        existing.push(event as Event)

        this.events.set(name, existing)

        return event
    }

    public get(name: string): Event[] {
        return this.events.get(name) ?? []
    }

    public has(name: string): boolean {
        return this.events.has(name)
    }

    public remove(name: string): boolean {
        return this.events.delete(name)
    }

    public removeEvent(name: string, event: Event): boolean {
        const events = this.events.get(name)

        if (!events) {
            return false
        }

        const index = events.indexOf(event)

        if (index === -1) {
            return false
        }

        events.splice(index, 1)

        if (events.length === 0) {
            this.events.delete(name)
        }

        return true
    }

    public all(): Event[] {
        return [...this.events.values()].flat()
    }

    public size(): number {
        return this.all().length
    }

    public clear(): void {
        this.events.clear()
    }
}