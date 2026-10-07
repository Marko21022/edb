import type {
    CommandDefinition,
    CommandHandler,
    CommandMode,
    CommandOptions
} from "../types/command.js"

export class Command {
    public readonly name: string
    public readonly description: string
    public readonly mode: CommandMode
    public readonly aliases: string[]
    public readonly handler: CommandHandler

    public constructor(
        name: string,
        options: CommandOptions | CommandHandler
    ) {
        this.name = name.toLowerCase()

        if (typeof options === "function") {
            this.description = ""
            this.mode = "both"
            this.aliases = []
            this.handler = options
            return
        }

        this.description = options.description ?? ""
        this.mode = options.mode ?? "both"
        this.aliases = (options.aliases ?? []).map(alias => alias.toLowerCase())
        this.handler = options.handler
    }

    public toDefinition(): CommandDefinition {
        return {
            name: this.name,
            description: this.description,
            mode: this.mode,
            aliases: this.aliases,
            handler: this.handler
        }
    }
}