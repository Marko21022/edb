import { ClientOptions, Client, User, Guild, GuildMember, APIInteractionGuildMember, TextBasedChannel, Message, ChatInputCommandInteraction } from 'discord.js';

interface BotOptions {
    token: string;
    prefix?: string;
    client?: ClientOptions;
}

type CommandSource = "prefix" | "slash";
type ContextMember = GuildMember | APIInteractionGuildMember | null;
interface Context$1 {
    client: Client;
    source: CommandSource;
    user: User;
    guild: Guild | null;
    member: ContextMember;
    channel: TextBasedChannel | null;
    message: Message | null;
    interaction: ChatInputCommandInteraction | null;
    args: string[];
    reply(content: string): Promise<unknown>;
}

type CommandHandler = (ctx: Context$1) => unknown | Promise<unknown>;
type CommandMode = "prefix" | "slash" | "both";
interface CommandOptions {
    description?: string;
    mode?: CommandMode;
    aliases?: string[];
    handler: CommandHandler;
}
interface CommandDefinition {
    name: string;
    description: string;
    mode: CommandMode;
    aliases: string[];
    handler: CommandHandler;
}
interface CommandExecution {
    context: Context$1;
    message?: Message;
    interaction?: ChatInputCommandInteraction;
}

type EventHandler<T extends unknown[] = unknown[]> = (...args: T) => unknown | Promise<unknown>;
interface EventDefinition<T extends unknown[] = unknown[]> {
    name: string;
    handler: EventHandler<T>;
    once?: boolean;
}

interface ContextOptions {
    client: Client;
    source: CommandSource;
    user: User;
    guild?: Guild | null;
    member?: ContextMember;
    channel?: TextBasedChannel | null;
    message?: Message | null;
    interaction?: ChatInputCommandInteraction | null;
    args?: string[];
}
declare class Context {
    readonly client: Client;
    readonly source: CommandSource;
    readonly user: User;
    readonly guild: Guild | null;
    readonly member: ContextMember;
    readonly channel: TextBasedChannel | null;
    readonly message: Message | null;
    readonly interaction: ChatInputCommandInteraction | null;
    readonly args: string[];
    constructor(options: ContextOptions);
    reply(content: string): Promise<unknown>;
}

declare class MessageContext extends Context {
    constructor(message: Message, args: string[]);
}

declare class InteractionContext extends Context {
    constructor(interaction: ChatInputCommandInteraction);
}

export { type BotOptions, type CommandDefinition, type CommandExecution, type CommandHandler, type CommandMode, type CommandOptions, type CommandSource, Context, type ContextMember, type EventDefinition, type EventHandler, InteractionContext, MessageContext };
