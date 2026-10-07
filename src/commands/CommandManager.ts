import { Command } from "./Command.js"
import type { CommandHandler, CommandOptions } from "../types/command.js"

export class CommandManager {
    private readonly commands = new Map<string, Command>()
    private readonly aliases = new Map<string, string>()

    public register(
        name: string,
        options: CommandOptions | CommandHandler
    ): Command {
        const normalizedName = name.toLowerCase()

        if (this.commands.has(normalizedName)) {
            throw new Error(`Command "${name}" is already registered.`)
        }

        if (this.aliases.has(normalizedName)) {
            throw new Error(`Command name "${name}" conflicts with an existing alias.`)
        }

        const command = new Command(normalizedName, options)

        this.commands.set(normalizedName, command)

        for (const alias of command.aliases) {
            const normalizedAlias = alias.toLowerCase()

            if (
                normalizedAlias === normalizedName ||
                this.commands.has(normalizedAlias) ||
                this.aliases.has(normalizedAlias)
            ) {
                throw new Error(
                    `Command alias "${alias}" conflicts with an existing command or alias.`
                )
            }

            this.aliases.set(normalizedAlias, normalizedName)
        }

        return command
    }

    public get(name: string): Command | undefined {
        const normalizedName = name.toLowerCase()

        const command = this.commands.get(normalizedName)

        if (command) {
            return command
        }

        const target = this.aliases.get(normalizedName)

        if (!target) {
            return undefined
        }

        return this.commands.get(target)
    }

    public has(name: string): boolean {
        return this.get(name) !== undefined
    }

    public remove(name: string): boolean {
        const command = this.get(name)

        if (!command) {
            return false
        }

        this.commands.delete(command.name)

        for (const alias of command.aliases) {
            this.aliases.delete(alias.toLowerCase())
        }

        return true
    }

    public all(): Command[] {
        return [...this.commands.values()]
    }

    public size(): number {
        return this.commands.size
    }

    public clear(): void {
        this.commands.clear()
        this.aliases.clear()
    }
}