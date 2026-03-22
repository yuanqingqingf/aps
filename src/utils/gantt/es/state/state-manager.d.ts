/// <reference types="node" />
import type { Gantt } from '../Gantt';
import type { ITaskLink } from '../ts-types';
import { InteractionState, DependencyType } from '../ts-types';
import type { Group, FederatedPointerEvent, Polygon, Line } from '@visactor/vtable/es/vrender';
import type { GanttTaskBarNode } from '../scenegraph/gantt-node';
import { Inertia } from '../tools/inertia';
export declare class StateManager {
    _gantt: Gantt;
    scroll: {
        horizontalBarPos: number;
        verticalBarPos: number;
    };
    fastScrolling: boolean;
    interactionState: InteractionState;
    moveTaskBar: {
        startX: number;
        startY: number;
        deltaX: number;
        deltaY: number;
        targetStartX: number;
        targetStartY: number;
        startOffsetY: number;
        moving: boolean;
        target: GanttTaskBarNode;
        moveTaskBarXSpeed: number;
        moveTaskBarXInertia: Inertia;
    };
    hoverTaskBar: {
        startX: number;
        targetStartX: number;
        target: GanttTaskBarNode;
    };
    resizeTaskBar: {
        startX: number;
        startY: number;
        startOffsetY: number;
        targetStartX: number;
        targetEndX: number;
        target: GanttTaskBarNode;
        resizing: boolean;
        onIconName: string;
    };
    adjustProgressBar: {
        startX: number;
        startY: number;
        target: GanttTaskBarNode;
        adjusting: boolean;
        originalProgress: number;
    };
    selectedTaskBar: {
        target: GanttTaskBarNode;
    };
    resizeTableWidth: {
        lastX: number;
        resizing: boolean;
        updateTimeout?: NodeJS.Timeout | null;
    };
    selectedDenpendencyLink: {
        link: ITaskLink & {
            vtable_gantt_linkArrowNode: Polygon;
            vtable_gantt_linkLineNode: Line;
        };
    };
    creatingDenpendencyLink: {
        startX: number;
        startY: number;
        startOffsetY: number;
        targetStartX: number;
        startClickedPoint: Group;
        creating: boolean;
        firstTaskBarPosition: 'left' | 'right';
        secondTaskBarPosition: 'left' | 'right';
        secondTaskBarNode: GanttTaskBarNode;
        lastHighLightLinkPoint: Group;
    };
    marklineIcon: {
        target: any;
    };
    resetInteractionState: (this: any, ...args: any) => any;
    constructor(gantt: Gantt);
    setScrollTop(top: number, triggerEvent?: boolean): void;
    get scrollLeft(): number;
    get scrollTop(): number;
    setScrollLeft(left: number, triggerEvent?: boolean): void;
    updateInteractionState(mode: InteractionState): void;
    updateVerticalScrollBar(yRatio: number): void;
    updateHorizontalScrollBar(xRatio: number): void;
    startMoveTaskBar(target: GanttTaskBarNode, x: number, y: number, offsetY: number): void;
    isMoveingTaskBar(): boolean;
    endMoveTaskBar(): void;
    dealTaskBarMove(e: FederatedPointerEvent): void;
    startResizeTaskBar(target: Group, x: number, y: number, startOffsetY: number, onIconName: string): void;
    isResizingTaskBar(): boolean;
    endResizeTaskBar(x: number): void;
    dealTaskBarResize(e: FederatedPointerEvent): void;
    startAdjustProgressBar(target: GanttTaskBarNode, x: number, y: number): void;
    isAdjustingProgressBar(): boolean;
    endAdjustProgressBar(x: number): void;
    private shouldSyncProgressToTable;
    dealAdjustProgressBar(e: FederatedPointerEvent): void;
    startCreateDependencyLine(target: Group, x: number, y: number, startOffsetY: number, position: 'left' | 'right'): void;
    isCreatingDependencyLine(): boolean;
    endCreateDependencyLine(offsetY: number): {
        linkedFromTaskKey: any;
        linkedToTaskKey: any;
        type: DependencyType;
    };
    dealCreateDependencyLine(e: FederatedPointerEvent): void;
    startResizeTableWidth(e: MouseEvent): void;
    isResizingTableWidth(): boolean;
    endResizeTableWidth(): void;
    dealResizeTableWidth(e: MouseEvent): void;
    showTaskBarHover(): void;
    hideTaskBarHover(e: FederatedPointerEvent): void;
    showTaskBarSelectedBorder(target: GanttTaskBarNode): void;
    hideTaskBarSelectedBorder(): void;
    showSecondTaskBarSelectedBorder(): void;
    hideSecondTaskBarSelectedBorder(): void;
    showDependencyLinkSelectedLine(): void;
    hideDependencyLinkSelectedLine(): void;
    highlightLinkPointNode(linkPointGroup: Group): void;
    unhighlightLinkPointNode(linkPointGroup: Group): void;
    showMarklineIconHover(): void;
    hideMarklineIconHover(): void;
    updateProjectTaskTimes(taskPath: number[]): void;
}
