import type { IRect, IText, IGroupGraphicAttribute } from '@visactor/vtable/es/vrender';
import type { ITaskBarLabelTextStyle } from '../ts-types';
import { Group } from '@visactor/vtable/es/vrender';
export declare class GanttTaskBarNode extends Group {
    milestoneTextLabel?: IText;
    milestoneTextContainer?: Group;
    clipGroupBox: Group;
    barRect?: IRect;
    progressRect?: IRect;
    textLabel?: IText;
    name: string;
    task_index: number;
    sub_task_index?: number;
    record?: any;
    labelStyle?: ITaskBarLabelTextStyle;
    _lastWidth?: number;
    _lastHeight?: number;
    _lastX?: number;
    _lastY?: number;
    constructor(attrs: IGroupGraphicAttribute);
    updateTextPosition(): void;
}
