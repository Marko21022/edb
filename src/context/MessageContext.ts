import type { Message } from "discord.js"

import { Context } from "./Context.js"

export class MessageContext extends Context {
    public constructor(
        message: Message,
        args: string[]
    ) {
        super({
            client: message.client,
            source: "prefix",
            user: message.author,
            guild: message.guild,
            member: message.member,
            channel: message.channel,
            message,
            interaction: null,
            args
        })
    }
}