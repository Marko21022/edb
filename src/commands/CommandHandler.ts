import type { Command } from "./Command.js"
import type { CommandManager } from "./CommandManager.js"
import type { Context } from "../context/Context.js"

export class CommandHandler {
    public constructor(
        private readonly commands: CommandManager
    ) {}

    public async execute(
        command: Command,
        context: Context
    ): Promise<unknown> {
        const result = await command.handler(context)

        if (result !== undefined && result !== null) {
            await context.reply(String(result))
        }

        return result
    }

    public async executeByName(
        name: string,
        context: Context
    ): Promise<unknown> {
        const command = this.commands.get(name)

        if (!command) {
            return undefined
        }

        return this.execute(command, context)
    }
}