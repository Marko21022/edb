import type { Message } from "discord.js"

import { MessageContext } from "../context/MessageContext.js"
import type { CommandManager } from "./CommandManager.js"
import type { CommandHandler } from "./CommandHandler.js"

export class PrefixHandler {
    public constructor(
        private readonly commands: CommandManager,
        private readonly handler: CommandHandler,
        private readonly prefix: string
    ) { }

    public async handle(message: Message): Promise<boolean> {
        if (message.author.bot) {
            return false
        }

        if (!message.content.startsWith(this.prefix)) {
            return false
        }

        const content = message.content.slice(this.prefix.length).trim()

        if (!content) {
            return false
        }

        const parts = content.split(/\s+/)
        const name = parts.shift()

        if (!name) {
            return false
        }

        const command = this.commands.get(name)

        if (!command || (command.mode !== "prefix" && command.mode !== "both")) {
            return false
        }

        const context = new MessageContext(message, parts)

        await this.handler.execute(command, context)

        return true
    }
}