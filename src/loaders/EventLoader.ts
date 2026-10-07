import { readdir } from "node:fs/promises"
import { join, extname } from "node:path"

import { EventManager } from "../events/EventManager.js"
import { LoaderError } from "../utils/errors.js"
import type { EventDefinition } from "../types/event.js"

export interface EventModule extends EventDefinition {
    name: string
}

export class EventLoader {
    public constructor(
        private readonly events: EventManager
    ) { }

    public async load(directory: string): Promise<number> {
        let files: string[]

        try {
            files = await readdir(directory)
        } catch (error) {
            throw new LoaderError(
                `Failed to read event directory "${directory}": ${error instanceof Error ? error.message : String(error)
                }`
            )
        }

        const supportedExtensions = new Set([
            ".js",
            ".mjs",
            ".cjs",
            ".ts"
        ])

        let loaded = 0

        for (const file of files) {
            const extension = extname(file)

            if (!supportedExtensions.has(extension)) {
                continue
            }

            const path = join(directory, file)
            const module = await import(path)
            const event = module.default as EventModule | undefined

            if (!event || typeof event.name !== "string") {
                throw new LoaderError(
                    `Event file "${file}" does not export a valid event.`
                )
            }

            this.events.register(event.name, event)

            loaded++
        }

        return loaded
    }
}