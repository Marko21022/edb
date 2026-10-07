import type {
    APIInteractionGuildMember,
    Client,
    ChatInputCommandInteraction,
    Guild,
    GuildMember,
    Message,
    TextBasedChannel,
    User
} from "discord.js"

export type CommandSource = "prefix" | "slash"

export type ContextMember = GuildMember | APIInteractionGuildMember | null

export interface Context {
    client: Client
    source: CommandSource

    user: User
    guild: Guild | null
    member: ContextMember
    channel: TextBasedChannel | null

    message: Message | null
    interaction: ChatInputCommandInteraction | null

    args: string[]

    reply(content: string): Promise<unknown>
}