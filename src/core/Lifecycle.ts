export type LifecycleState =
    | "idle"
    | "starting"
    | "ready"
    | "stopping"
    | "stopped"

export class Lifecycle {
    private state: LifecycleState = "idle"

    public getState(): LifecycleState {
        return this.state
    }

    public setState(state: LifecycleState): void {
        this.state = state
    }

    public is(state: LifecycleState): boolean {
        return this.state === state
    }
}