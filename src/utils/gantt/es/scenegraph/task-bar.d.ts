import { Group, Image, Line } from '@visactor/vtable/es/vrender';
import type { Scenegraph } from './scenegraph';
import { GanttTaskBarNode } from './gantt-node';
export declare const TASKBAR_HOVER_ICON_WIDTH = 10;
export declare class TaskBar {
    formatMilestoneText(text: string, record: any): string;
    calculateMilestoneTextPosition(position: string, milestoneWidth: number, padding?: number | number[]): {
        textX: number;
        textY: number;
        textAlignValue: CanvasTextAlign;
        textBaselineValue: CanvasTextBaseline;
    };
    group: Group;
    barContainer: Group;
    hoverBarGroup: Group;
    creatingDependencyLine: Line;
    hoverBarLeftIcon: Image;
    hoverBarRightIcon: Image;
    hoverBarProgressHandle: Group;
    _scene: Scenegraph;
    width: number;
    height: number;
    selectedBorders: Group[];
    constructor(scene: Scenegraph);
    initBars(): void;
    initBar(index: number, childIndex?: number | number[], childrenLength?: number): {
        barGroupBox: GanttTaskBarNode;
        baselineBar: any;
    };
    updateTaskBarNode(index: number, sub_task_index?: number): void;
    initHoverBarIcons(): void;
    setX(x: number): void;
    setY(y: number): void;
    refresh(): void;
    resize(): void;
    showHoverBar(x: number, y: number, width: number, height: number, target?: GanttTaskBarNode): void;
    hideHoverBar(): void;
    createSelectedBorder(x: number, y: number, width: number, height: number, attachedToTaskBarNode: GanttTaskBarNode, showLinkPoint?: boolean): void;
    removeSelectedBorder(): void;
    removeSecondSelectedBorder(): void;
    updateCreatingDependencyLine(x1: number, y1: number, x2: number, y2: number): void;
    getTaskBarNodeByIndex(index: number, sub_task_index?: number): GanttTaskBarNode;
}
