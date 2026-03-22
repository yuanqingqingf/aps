import type { IRect } from '@visactor/vtable/es/vrender';
import type { Scenegraph } from './scenegraph';
export declare class FrameBorder {
    _scene: Scenegraph;
    border: IRect;
    constructor(scene: Scenegraph);
    createFrameBorder(): void;
    refresh(): void;
    resize(): void;
}
