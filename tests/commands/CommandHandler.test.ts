import { describe, expect, it, vi } from "vitest"

import { CommandHandler } from "../../src/commands/CommandHandler.js"
import { CommandManager } from "../../src/commands/CommandManager.js"
import { Context } from "../../src/context/Context.js"

describe("CommandHandler", () => {
    const createContext = () => {
        const context = new Context({
            client: {} as never,
            source: "prefix",
            user: {} as never,
            args: []
        })

        vi.spyOn(context, "reply").mockResolvedValue("response")

        return context
    }

    it("executes a command", async () => {
        const manager = new CommandManager()
        const handler = vi.fn().mockResolvedValue("Pong!")

        const command = manager.register("ping", handler)
        const executor = new CommandHandler(manager)
        const context = createContext()

        const result = await executor.execute(command, context)

        expect(handler).toHaveBeenCalledOnce()
        expect(result).toBe("Pong!")
    })

    it("passes the context to the command", async () => {
        const manager = new CommandManager()
        const handler = vi.fn()

        const command = manager.register("ping", handler)
        const executor = new CommandHandler(manager)
        const context = createContext()

        await executor.execute(command, context)

        expect(handler).toHaveBeenCalledWith(context)
    })

    it("automatically replies with a returned value", async () => {
        const manager = new CommandManager()
        const handler = vi.fn().mockResolvedValue("Pong!")

        const command = manager.register("ping", handler)
        const executor = new CommandHandler(manager)
        const context = createContext()

        await executor.execute(command, context)

        expect(context.reply).toHaveBeenCalledWith("Pong!")
    })

    it("does not reply when the command returns undefined", async () => {
        const manager = new CommandManager()
        const handler = vi.fn().mockResolvedValue(undefined)

        const command = manager.register("ping", handler)
        const executor = new CommandHandler(manager)
        const context = createContext()

        await executor.execute(command, context)

        expect(context.reply).not.toHaveBeenCalled()
    })

    it("does not reply when the command returns null", async () => {
        const manager = new CommandManager()
        const handler = vi.fn().mockResolvedValue(null)

        const command = manager.register("ping", handler)
        const executor = new CommandHandler(manager)
        const context = createContext()

        await executor.execute(command, context)

        expect(context.reply).not.toHaveBeenCalled()
    })

    it("executes a command by name", async () => {
        const manager = new CommandManager()
        const handler = vi.fn().mockResolvedValue("Pong!")

        manager.register("ping", handler)

        const executor = new CommandHandler(manager)
        const context = createContext()

        const result = await executor.executeByName("ping", context)

        expect(handler).toHaveBeenCalledOnce()
        expect(context.reply).toHaveBeenCalledWith("Pong!")
        expect(result).toBe("Pong!")
    })

    it("supports aliases when executing by name", async () => {
        const manager = new CommandManager()
        const handler = vi.fn().mockResolvedValue("Pong!")

        manager.register("ping", {
            aliases: ["p"],
            handler
        })

        const executor = new CommandHandler(manager)
        const context = createContext()

        await executor.executeByName("p", context)

        expect(handler).toHaveBeenCalledOnce()
        expect(context.reply).toHaveBeenCalledWith("Pong!")
    })

    it("returns undefined for an unknown command", async () => {
        const manager = new CommandManager()
        const executor = new CommandHandler(manager)
        const context = createContext()

        const result = await executor.executeByName(
            "unknown",
            context
        )

        expect(result).toBeUndefined()
        expect(context.reply).not.toHaveBeenCalled()
    })
})