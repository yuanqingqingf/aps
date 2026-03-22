export declare class Inertia {
    friction: number;
    lastTime: number;
    speedX: number;
    speedY: number;
    runingId: number;
    stopped: boolean;
    scrollHandle: (dx: number, dy: number) => void;
    constructor();
    setScrollHandle(scrollHandle: (dx: number, dy: number) => void): void;
    startInertia(speedX: number, speedY: number, friction: number): void;
    inertia(): void;
    endInertia(): void;
    isInertiaScrolling(): boolean;
}
