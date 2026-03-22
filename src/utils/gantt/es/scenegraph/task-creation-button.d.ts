import { Group } from '@visactor/vtable/es/vrender';
import type { ILine } from '@visactor/vtable/es/vrender';
import type { Scenegraph } from './scenegraph';
export declare class TaskCreationButton {
    _scene: Scenegraph;
    group: Group;
    lineVertical: ILine;
    lineHorizontal: ILine;
    constructor(scene: Scenegraph);
    createAddButton(): void;
    show(x: number, y: number, width: number, height: number): void;
    hide(): void;
}
