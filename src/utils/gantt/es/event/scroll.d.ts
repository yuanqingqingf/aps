import type { FederatedWheelEvent } from '@visactor/vtable/es/vrender';
import type { Gantt } from '../Gantt';
import type { EventManager } from './event-manager';
import type { StateManager } from '../state/state-manager';
export declare function handleWhell(event: FederatedWheelEvent, state: StateManager, gantt: Gantt, isWheelEvent?: boolean): void;
export declare function isVerticalScrollable(deltaY: number, state: StateManager): boolean;
export declare function isHorizontalScrollable(deltaX: number, state: StateManager): boolean;
export declare function bindScrollBarListener(eventManager: EventManager): void;
