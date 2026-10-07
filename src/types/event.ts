export type EventHandler<T extends unknown[] = unknown[]> = (
    ...args: T
) => unknown | Promise<unknown>

export interface EventDefinition<T extends unknown[] = unknown[]> {
    name: string
    handler: EventHandler<T>
    once?: boolean
}