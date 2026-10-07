import { describe, expect, it } from "vitest"

import { CommandManager } from "../../src/commands/CommandManager.js"

describe("CommandManager", () => {
    it("registers and retrieves a command", () => {
        const manager = new CommandManager()

        const command = manager.register("ping", () => "Pong!")

        expect(command.name).toBe("ping")
        expect(manager.get("ping")).toBe(command)
        expect(manager.has("ping")).toBe(true)
    })

    it("normalizes command names", () => {
        const manager = new CommandManager()

        manager.register("PiNg", () => "Pong!")

        expect(manager.get("ping")).toBeDefined()
        expect(manager.get("PING")).toBeDefined()
    })

    it("supports aliases", () => {
        const manager = new CommandManager()

        const command = manager.register("ping", {
            aliases: ["p", "pong"],
            handler: () => "Pong!"
        })

        expect(manager.get("ping")).toBe(command)
        expect(manager.get("p")).toBe(command)
        expect(manager.get("pong")).toBe(command)
    })

    it("rejects duplicate commands", () => {
        const manager = new CommandManager()

        manager.register("ping", () => "Pong!")

        expect(() => {
            manager.register("ping", () => "Another response")
        }).toThrow('Command "ping" is already registered.')
    })

    it("rejects command names that conflict with aliases", () => {
        const manager = new CommandManager()

        manager.register("ping", {
            aliases: ["p"],
            handler: () => "Pong!"
        })

        expect(() => {
            manager.register("p", () => "Another response")
        }).toThrow('Command name "p" conflicts with an existing alias.')
    })

    it("rejects conflicting aliases", () => {
        const manager = new CommandManager()

        manager.register("ping", {
            aliases: ["p"],
            handler: () => "Pong!"
        })

        expect(() => {
            manager.register("pong", {
                aliases: ["p"],
                handler: () => "Pong!"
            })
        }).toThrow(
            'Command alias "p" conflicts with an existing command or alias.'
        )
    })

    it("removes commands", () => {
        const manager = new CommandManager()

        manager.register("ping", {
            aliases: ["p"],
            handler: () => "Pong!"
        })

        expect(manager.remove("ping")).toBe(true)
        expect(manager.get("ping")).toBeUndefined()
        expect(manager.get("p")).toBeUndefined()
        expect(manager.size()).toBe(0)
    })

    it("can remove a command through an alias", () => {
        const manager = new CommandManager()

        manager.register("ping", {
            aliases: ["p"],
            handler: () => "Pong!"
        })

        expect(manager.remove("p")).toBe(true)
        expect(manager.get("ping")).toBeUndefined()
    })

    it("returns all commands", () => {
        const manager = new CommandManager()

        manager.register("ping", () => "Pong!")
        manager.register("hello", () => "Hello!")

        expect(manager.all()).toHaveLength(2)
    })

    it("can clear all commands", () => {
        const manager = new CommandManager()

        manager.register("ping", () => "Pong!")
        manager.register("hello", () => "Hello!")

        manager.clear()

        expect(manager.size()).toBe(0)
        expect(manager.all()).toHaveLength(0)
    })
})