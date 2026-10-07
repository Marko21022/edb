import type { ClientOptions } from "discord.js"

import { Client } from "./Client.js"
import { CommandHandler } from "../commands/CommandHandler.js"
import { CommandManager } from "../commands/CommandManager.js"
import { PrefixHandler } from "../commands/PrefixHandler.js"
import { SlashHandler } from "../commands/SlashHandler.js"
import type { CommandHandler as CommandHandlerFunction } from "../types/command.js"
import type { CommandOptions } from "../types/command.js"
import type { BotOptions } from "../types/bot.js"

export class Bot {
    public readonly client: Client
    public readonly commands: CommandManager

    private readonly commandHandler: CommandHandler
    private readonly prefixHandler: PrefixHandler
    private readonly slashHandler: SlashHandler

    private readonly token: string
    private readonly prefix: string

    public constructor(options: BotOptions) {
        this.token = options.token
        this.prefix = options.prefix ?? "!"

        const clientOptions: ClientOptions = options.client ?? {
            intents: []
        }

        this.client = new Client(clientOptions)

        this.commands = new CommandManager()
        this.commandHandler = new CommandHandler(this.commands)

        this.prefixHandler = new PrefixHandler(
            this.commands,
            this.commandHandler,
            this.prefix
        )

        this.slashHandler = new SlashHandler(
            this.commands,
            this.commandHandler
        )

        this.client.on("messageCreate", async message => {
            await this.prefixHandler.handle(message)
        })

        this.client.on("interactionCreate", async interaction => {
            if (interaction.isChatInputCommand()) {
                await this.slashHandler.handle(interaction)
            }
        })
    }

    public command(
        name: string,
        options: CommandOptions | CommandHandlerFunction
    ) {
        return this.commands.register(name, options)
    }

    public async start(): Promise<string> {
        return this.client.login(this.token)
    }
}