import type { Scenegraph } from './scenegraph';
import type { Line } from '@visactor/vtable/es/vrender';
import { Group } from '@visactor/vtable/es/vrender';
export declare class DragOrderLine {
    _scene: Scenegraph;
    dragLineContainer: Group;
    dragLine: Line;
    constructor(scene: Scenegraph);
    initDragLine(): void;
    showDragLine(y: number): void;
    hideDragLine(): void;
}
