export class EdbError extends Error {
    public readonly code: string

    public constructor(
        message: string,
        code = "EDB_ERROR"
    ) {
        super(message)

        this.name = "EdbError"
        this.code = code

        Object.setPrototypeOf(this, new.target.prototype)
    }
}

export class CommandError extends EdbError {
    public constructor(message: string) {
        super(message, "COMMAND_ERROR")
        this.name = "CommandError"
    }
}

export class EventError extends EdbError {
    public constructor(message: string) {
        super(message, "EVENT_ERROR")
        this.name = "EventError"
    }
}

export class LoaderError extends EdbError {
    public constructor(message: string) {
        super(message, "LOADER_ERROR")
        this.name = "LoaderError"
    }
}