import type { Gantt } from '../Gantt';
import { EventHandler } from '../event/EventHandler';
import { Inertia } from '../tools/inertia';
export declare class EventManager {
    _gantt: Gantt;
    _eventHandler: EventHandler;
    isDown: boolean;
    isDraging: boolean;
    lastDragPointerXYOnWindow: {
        x: number;
        y: number;
    };
    globalEventListeners: {
        name: string;
        env: 'document' | 'body' | 'window' | 'vglobal';
        callback: (e?: any) => void;
    }[];
    poniterState: 'down' | 'draging' | 'up';
    isTouchdown: boolean;
    isTouchMove: boolean;
    isLongTouch: boolean;
    touchMovePoints: {
        x: number;
        y: number;
        timestamp: number;
    }[];
    touchSetTimeout: any;
    touchEnd: boolean;
    _enableTableScroll: boolean;
    inertiaScroll: Inertia;
    constructor(gantt: Gantt);
    release(): void;
    bindEvent(): void;
}
