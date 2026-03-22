import type { Line } from '@visactor/vtable/es/vrender';
import { Group, Polygon } from '@visactor/vtable/es/vrender';
import type { Scenegraph } from './scenegraph';
import type { GanttTaskBarNode } from './gantt-node';
import type { ITaskLink } from '../ts-types';
import { DependencyType } from '../ts-types';
import type { Gantt } from '../Gantt';
export declare class DependencyLink {
    group: Group;
    linkLinesContainer: Group;
    _scene: Scenegraph;
    width: number;
    height: number;
    selectedEffectNodes: (Line | Polygon)[];
    constructor(scene: Scenegraph);
    initLinkLines(): void;
    initLinkLine(index: number): void;
    setX(x: number): void;
    setY(y: number): void;
    refresh(): void;
    resize(): void;
    createSelectedLinkLine(selectedLink: ITaskLink & {
        vtable_gantt_linkArrowNode: Polygon;
        vtable_gantt_linkLineNode: Line;
    }): void;
    removeSelectedLinkLine(): void;
    deleteLink(link: ITaskLink): void;
}
export declare function generateLinkLinePoints(type: DependencyType, linkedFromTaskStartDate: Date, linkedFromTaskEndDate: Date, linkedFromTaskRecordRowIndex: number, linkedFromTaskTaskDays: number, linkedFromTaskIsMilestone: boolean, linkedToTaskStartDate: Date, linkedToTaskEndDate: Date, linkedToTaskRecordRowIndex: number, linkedToTaskTaskDays: number, linkedToTaskIsMilestone: boolean, gantt: Gantt): {
    linePoints: {
        x: number;
        y: number;
    }[];
    arrowPoints: {
        x: number;
        y: number;
    }[];
};
export declare function updateLinkLinePoints(type: DependencyType, linkedFromTaskStartDate: Date, linkedFromTaskEndDate: Date, linkedFromTaskRecordRowIndex: number, linkedFromTaskTaskDays: number, linkedFromTaskIsMilestone: boolean, linkedFromMovedTaskBarNode: GanttTaskBarNode, fromNodeDiffY: number, linkedToTaskStartDate: Date, linkedToTaskEndDate: Date, linkedToTaskRecordRowIndex: number, linkedToTaskTaskDays: number, linkedToTaskIsMilestone: boolean, linkedToMovedTaskBarNode: GanttTaskBarNode, toNodeDiffY: number, gantt: Gantt): {
    linePoints: {
        x: number;
        y: number;
    }[];
    arrowPoints: {
        x: number;
        y: number;
    }[];
};
