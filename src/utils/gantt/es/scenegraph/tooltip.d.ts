import type { IRectGraphicAttribute, IGraphic, Group } from '@visactor/vtable/es/vrender';
import type { Scenegraph } from './scenegraph';
export declare class ToolTip {
    _scene: Scenegraph;
    group: Group;
    constructor(scene: Scenegraph);
    show(graphic: IGraphic<Partial<IRectGraphicAttribute>>): void;
    hide(): void;
}
