export type LogLevel =
    | "debug"
    | "info"
    | "warn"
    | "error"

export class Logger {
    public debug(...messages: unknown[]): void {
        console.debug("[edb]", ...messages)
    }

    public info(...messages: unknown[]): void {
        console.info("[edb]", ...messages)
    }

    public warn(...messages: unknown[]): void {
        console.warn("[edb]", ...messages)
    }

    public error(...messages: unknown[]): void {
        console.error("[edb]", ...messages)
    }

    public log(
        level: LogLevel,
        ...messages: unknown[]
    ): void {
        this[level](...messages)
    }
}