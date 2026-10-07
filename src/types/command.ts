import type { ChatInputCommandInteraction, Message } from "discord.js"
import type { Context } from "./context.js"

export type CommandHandler = (ctx: Context) => unknown | Promise<unknown>

export type CommandMode = "prefix" | "slash" | "both"

export interface CommandOptions {
    description?: string
    mode?: CommandMode
    aliases?: string[]
    handler: CommandHandler
}

export interface CommandDefinition {
    name: string
    description: string
    mode: CommandMode
    aliases: string[]
    handler: CommandHandler
}

export interface CommandExecution {
    context: Context
    message?: Message
    interaction?: ChatInputCommandInteraction
}