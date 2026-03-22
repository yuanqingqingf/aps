import type { Group } from '@visactor/vtable/es/vrender';
import type { Gantt } from './Gantt';
import { type IMarkLine, type IPosition, type IScrollStyle, type ITimelineDateInfo, type ITimelineScale } from './ts-types';
export declare const defaultTaskBarStyle: {
    barColor: string;
    completedBarColor: string;
    width: number;
    cornerRadius: number;
    borderWidth: number;
    fontFamily: string;
    fontSize: number;
};
export declare const defaultBaselineStyle: {
    barColor: string;
    completedBarColor: string;
    width: number;
    cornerRadius: number;
    borderWidth: number;
};
declare const isNode: boolean;
export declare const DayTimes: number;
export declare function getDateIndexByX(x: number, gantt: Gantt): number;
export declare function generateMarkLine(markLine?: boolean | IMarkLine | IMarkLine[]): IMarkLine[];
export declare function getHorizontalScrollBarSize(scrollStyle?: IScrollStyle): number;
export declare function getVerticalScrollBarSize(scrollStyle?: IScrollStyle): number;
export { isNode };
export declare function initOptions(gantt: Gantt): void;
export declare function updateOptionsWhenScaleChanged(gantt: Gantt): void;
export declare function generateTimeLineDate(currentDate: Date, endDate: Date, scale: ITimelineScale): ITimelineDateInfo[];
export declare function getTextPos(padding: number[], textAlign: CanvasTextAlign, textBaseline: CanvasTextBaseline, width: number, height: number): {
    x: number;
    y: number;
};
export declare function convertProgress(progress: number | string): number;
export declare function createSplitLineAndResizeLine(gantt: Gantt): void;
export declare function updateSplitLineAndResizeLine(gantt: Gantt): void;
export declare function findRecordByTaskKey(records: any[], taskKeyField: string, taskKey: string | number | (string | number)[], childrenField?: string): {
    record: any;
    index: number[];
} | undefined;
export declare function clearRecordLinkInfos(records: any[], childrenField?: string): void;
export declare function clearRecordShowIndex(records: any[], childrenField?: string): void;
export declare function getTaskIndexsByTaskY(y: number, gantt: Gantt): {
    task_index: number;
    sub_task_index: number;
};
export declare function computeRowsCountByRecordDateForCompact(gantt: Gantt, record: any): number;
export declare function computeRowsCountByRecordDate(gantt: Gantt, record: any): number;
export declare function getSubTaskRowIndexByRecordDate(record: any, childIndex: number, startDateField: string, endDateField: string): number;
export declare function formatRecordDateConsiderHasHour(gantt: Gantt, record: any): {
    startDate: Date;
    endDate: Date;
};
export declare function updateOptionsWhenRecordChanged(gantt: Gantt): void;
export declare function updateOptionsWhenDateRangeChanged(gantt: Gantt): void;
export declare function updateOptionsWhenMarkLineChanged(gantt: Gantt): void;
export declare function _getTaskInfoByXYForCreateSchedule(eventX: number, eventY: number, gantt: Gantt): {
    startDate: Date;
    endDate: Date;
    taskDays: number;
    progress: number;
    taskRecord: any;
};
export declare function getNodeClickPos(marklineIconNode: Group, gantt: Gantt): IPosition;
export declare function judgeIfHasMarkLine(data: {
    startDate: Date;
    endDate: Date;
}, markLine: IMarkLine[]): boolean;
export declare function checkHasChildTasks(gantt: Gantt, taskIndex: number, subTaskIndex?: number): boolean;
export declare function initProjectTaskTimes(gantt: Gantt): void;
