import type { ChatInputCommandInteraction } from "discord.js"

import { InteractionContext } from "../context/InteractionContext.js"
import type { CommandHandler } from "./CommandHandler.js"
import type { CommandManager } from "./CommandManager.js"

export class SlashHandler {
    public constructor(
        private readonly commands: CommandManager,
        private readonly handler: CommandHandler
    ) { }

    public async handle(
        interaction: ChatInputCommandInteraction
    ): Promise<boolean> {
        if (!interaction.isChatInputCommand()) {
            return false
        }

        const command = this.commands.get(interaction.commandName)

        if (!command) {
            return false
        }

        if (command.mode !== "slash" && command.mode !== "both") {
            return false
        }

        const context = new InteractionContext(interaction)

        await this.handler.execute(command, context)

        return true
    }
}