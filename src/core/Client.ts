import {
    Client as DiscordClient,
    type ClientOptions
} from "discord.js"

export class Client extends DiscordClient {
    public constructor(options: ClientOptions) {
        super(options)
    }
}