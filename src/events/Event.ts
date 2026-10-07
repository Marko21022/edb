import type { EventDefinition, EventHandler } from "../types/event.js"

export class Event<T extends unknown[] = unknown[]> {
    public readonly name: string
    public readonly handler: EventHandler<T>
    public readonly once: boolean

    public constructor(
        name: string,
        options: EventDefinition<T> | EventHandler<T>
    ) {
        this.name = name

        if (typeof options === "function") {
            this.handler = options
            this.once = false
            return
        }

        this.handler = options.handler
        this.once = options.once ?? false
    }

    public toDefinition(): EventDefinition<T> {
        return {
            name: this.name,
            handler: this.handler,
            once: this.once
        }
    }
}