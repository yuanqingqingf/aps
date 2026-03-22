import type { Scenegraph } from './scenegraph';
import { Group } from '@visactor/vtable/es/vrender';
export declare class TimelineHeader {
    group: Group;
    _scene: Scenegraph;
    constructor(scene: Scenegraph);
    initNodes(): void;
    setX(x: number): void;
    setY(y: number): void;
    resize(): void;
    refresh(): void;
    showMarklineIcon(target: any): undefined;
    hideMarklineIconHover(target: any): undefined;
}
