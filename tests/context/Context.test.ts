import { describe, expect, it, vi } from "vitest"

import { Context } from "../../src/context/Context.js"

describe("Context", () => {
    it("stores context data", () => {
        const client = {} as never
        const user = {} as never

        const context = new Context({
            client,
            source: "prefix",
            user,
            args: ["hello", "world"]
        })

        expect(context.client).toBe(client)
        expect(context.user).toBe(user)
        expect(context.source).toBe("prefix")
        expect(context.guild).toBeNull()
        expect(context.member).toBeNull()
        expect(context.channel).toBeNull()
        expect(context.message).toBeNull()
        expect(context.interaction).toBeNull()
        expect(context.args).toEqual(["hello", "world"])
    })

    it("replies through a message", async () => {
        const reply = vi.fn().mockResolvedValue("response")

        const message = {
            reply
        } as never

        const context = new Context({
            client: {} as never,
            source: "prefix",
            user: {} as never,
            message
        })

        const result = await context.reply("hello")

        expect(reply).toHaveBeenCalledWith("hello")
        expect(result).toBe("response")
    })

    it("replies through an interaction", async () => {
        const reply = vi.fn().mockResolvedValue("response")

        const interaction = {
            replied: false,
            deferred: false,
            reply,
            followUp: vi.fn()
        } as never

        const context = new Context({
            client: {} as never,
            source: "slash",
            user: {} as never,
            interaction
        })

        const result = await context.reply("hello")

        expect(reply).toHaveBeenCalledWith("hello")
        expect(result).toBe("response")
    })

    it("uses followUp when an interaction was already replied to", async () => {
        const followUp = vi.fn().mockResolvedValue("follow-up")

        const interaction = {
            replied: true,
            deferred: false,
            reply: vi.fn(),
            followUp
        } as never

        const context = new Context({
            client: {} as never,
            source: "slash",
            user: {} as never,
            interaction
        })

        const result = await context.reply("hello")

        expect(followUp).toHaveBeenCalledWith("hello")
        expect(result).toBe("follow-up")
    })

    it("throws when there is nothing to reply to", async () => {
        const context = new Context({
            client: {} as never,
            source: "prefix",
            user: {} as never
        })

        await expect(context.reply("hello")).rejects.toThrow(
            "Cannot reply: context has no message or interaction."
        )
    })
})