import type { ChatInputCommandInteraction } from "discord.js"

import { Context } from "./Context.js"

export class InteractionContext extends Context {
    public constructor(
        interaction: ChatInputCommandInteraction
    ) {
        super({
            client: interaction.client,
            source: "slash",
            user: interaction.user,
            guild: interaction.guild,
            member: interaction.member,
            channel: interaction.channel,
            message: null,
            interaction,
            args: []
        })
    }
}