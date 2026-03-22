import type { Scenegraph } from './scenegraph';
import { Group } from '@visactor/vtable/es/vrender';
export declare class MarkLine {
    _scene: Scenegraph;
    group: Group;
    markLIneContainer: Group;
    markLineContainerWidth: number;
    height: number;
    constructor(scene: Scenegraph);
    initMarkLines(): void;
    refresh(): void;
    setX(x: number): void;
}
