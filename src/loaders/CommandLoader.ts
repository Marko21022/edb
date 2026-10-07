import { readdir } from "node:fs/promises"
import { join, extname } from "node:path"

import type { CommandManager } from "../commands/CommandManager.js"
import { LoaderError } from "../utils/errors.js"
import type { CommandOptions } from "../types/command.js"

export interface CommandModule extends CommandOptions {
    name: string
}

export class CommandLoader {
    public constructor(
        private readonly commands: CommandManager
    ) { }

    public async load(directory: string): Promise<number> {
        let files: string[]

        try {
            files = await readdir(directory)
        } catch (error) {
            throw new LoaderError(
                `Failed to read command directory "${directory}": ${error instanceof Error ? error.message : String(error)
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
            const command = module.default as CommandModule | undefined

            if (!command || typeof command.name !== "string") {
                throw new LoaderError(
                    `Command file "${file}" does not export a valid command.`
                )
            }

            this.commands.register(command.name, command)

            loaded++
        }

        return loaded
    }
}