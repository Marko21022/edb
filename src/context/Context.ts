import type {
    Client,
    ChatInputCommandInteraction,
    Guild,
    Message,
    TextBasedChannel,
    User
} from "discord.js"

import type { CommandSource, ContextMember } from "../types/context.js"

export interface ContextOptions {
    client: Client
    source: CommandSource
    user: User
    guild?: Guild | null
    member?: ContextMember
    channel?: TextBasedChannel | null
    message?: Message | null
    interaction?: ChatInputCommandInteraction | null
    args?: string[]
}

export class Context {
    public readonly client: Client
    public readonly source: CommandSource

    public readonly user: User
    public readonly guild: Guild | null
    public readonly member: ContextMember
    public readonly channel: TextBasedChannel | null

    public readonly message: Message | null
    public readonly interaction: ChatInputCommandInteraction | null

    public readonly args: string[]

    public constructor(options: ContextOptions) {
        this.client = options.client
        this.source = options.source

        this.user = options.user
        this.guild = options.guild ?? null
        this.member = options.member ?? null
        this.channel = options.channel ?? null

        this.message = options.message ?? null
        this.interaction = options.interaction ?? null

        this.args = options.args ?? []
    }

    public async reply(content: string): Promise<unknown> {
        if (this.interaction) {
            if (this.interaction.replied || this.interaction.deferred) {
                return this.interaction.followUp(content)
            }

            return this.interaction.reply(content)
        }

        if (this.message) {
            return this.message.reply(content)
        }

        throw new Error("Cannot reply: context has no message or interaction.")
    }
}