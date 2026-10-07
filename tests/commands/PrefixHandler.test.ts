import { describe, expect, it, vi } from "vitest"

import { CommandHandler } from "../../src/commands/CommandHandler.js"
import { CommandManager } from "../../src/commands/CommandManager.js"
import { PrefixHandler } from "../../src/commands/PrefixHandler.js"

describe("PrefixHandler", () => {
    const createMessage = (
        content: string,
        bot = false
    ) =>
        ({
            content,
            author: {
                bot
            },
            client: {},
            guild: null,
            member: null,
            channel: null,
            reply: vi.fn()
        }) as never

    it("ignores bot messages", async () => {
        const manager = new CommandManager()
        const executor = new CommandHandler(manager)
        const handler = new PrefixHandler(manager, executor, "!")

        const message = createMessage("!ping", true)

        expect(await handler.handle(message)).toBe(false)
    })

    it("ignores messages without the prefix", async () => {
        const manager = new CommandManager()
        const executor = new CommandHandler(manager)
        const handler = new PrefixHandler(manager, executor, "!")

        expect(await handler.handle(createMessage("ping"))).toBe(false)
    })

    it("ignores an empty prefixed message", async () => {
        const manager = new CommandManager()
        const executor = new CommandHandler(manager)
        const handler = new PrefixHandler(manager, executor, "!")

        expect(await handler.handle(createMessage("!"))).toBe(false)
    })

    it("executes a prefixed command", async () => {
        const manager = new CommandManager()
        const executor = new CommandHandler(manager)
        const handler = new PrefixHandler(manager, executor, "!")

        const commandHandler = vi.fn()

        manager.register("ping", commandHandler)

        expect(await handler.handle(createMessage("!ping"))).toBe(true)
        expect(commandHandler).toHaveBeenCalledOnce()
    })

    it("passes arguments to the command context", async () => {
        const manager = new CommandManager()
        const executor = new CommandHandler(manager)
        const handler = new PrefixHandler(manager, executor, "!")

        const commandHandler = vi.fn()

        manager.register("say", commandHandler)

        await handler.handle(createMessage("!say hello world"))

        const context = commandHandler.mock.calls[0][0]

        expect(context.args).toEqual(["hello", "world"])
        expect(context.source).toBe("prefix")
    })

    it("supports aliases", async () => {
        const manager = new CommandManager()
        const executor = new CommandHandler(manager)
        const handler = new PrefixHandler(manager, executor, "!")

        const commandHandler = vi.fn()

        manager.register("ping", {
            aliases: ["p"],
            handler: commandHandler
        })

        expect(await handler.handle(createMessage("!p"))).toBe(true)
        expect(commandHandler).toHaveBeenCalledOnce()
    })

    it("does not execute slash-only commands", async () => {
        const manager = new CommandManager()
        const executor = new CommandHandler(manager)
        const handler = new PrefixHandler(manager, executor, "!")

        const commandHandler = vi.fn()

        manager.register("ping", {
            mode: "slash",
            handler: commandHandler
        })

        expect(await handler.handle(createMessage("!ping"))).toBe(false)
        expect(commandHandler).not.toHaveBeenCalled()
    })

    it("executes both-mode commands", async () => {
        const manager = new CommandManager()
        const executor = new CommandHandler(manager)
        const handler = new PrefixHandler(manager, executor, "!")

        const commandHandler = vi.fn()

        manager.register("ping", {
            mode: "both",
            handler: commandHandler
        })

        expect(await handler.handle(createMessage("!ping"))).toBe(true)
        expect(commandHandler).toHaveBeenCalledOnce()
    })

    it("returns false for unknown commands", async () => {
        const manager = new CommandManager()
        const executor = new CommandHandler(manager)
        const handler = new PrefixHandler(manager, executor, "!")

        expect(await handler.handle(createMessage("!unknown"))).toBe(false)
    })
})