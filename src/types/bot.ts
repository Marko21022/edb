import type { ClientOptions } from "discord.js"

export interface BotOptions {
    token: string
    prefix?: string
    client?: ClientOptions
}