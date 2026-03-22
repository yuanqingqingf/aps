import type { FederatedPointerEvent } from '@visactor/vtable/es/vrender';
import type { IMarkLine, ITaskLink, ITimelineDateInfo } from './gantt-engine';
import type { IPosition } from './common';
import type { IZoomEventArgs } from './zoom-scale';
export type TableEventListener<TYPE extends keyof TableEventHandlersEventArgumentMap> = (args: TableEventHandlersEventArgumentMap[TYPE]) => TableEventHandlersReturnMap[TYPE];
export type EventListenerId = number;
export interface TableEventHandlersEventArgumentMap {
    scroll: {
        scrollLeft: number;
        scrollTop: number;
        scrollDirection: 'horizontal' | 'vertical';
        scrollRatioX?: number;
        scrollRatioY?: number;
    };
    mouseenter_task_bar: {
        index: number;
        sub_task_index?: number;
        record: any;
        event: Event;
        federatedEvent: FederatedPointerEvent;
    };
    mouseleave_task_bar: {
        index: number;
        sub_task_index?: number;
        record: any;
        event: Event;
        federatedEvent: FederatedPointerEvent;
    };
    click_task_bar: {
        index: number;
        sub_task_index?: number;
        record: any;
        event: Event;
        federatedEvent: FederatedPointerEvent;
    };
    contextmenu_task_bar: {
        index: number;
        sub_task_index?: number;
        record: any;
        event: Event;
        federatedEvent: FederatedPointerEvent;
    };
    change_date_range: {
        index: number;
        sub_task_index?: number;
        startDate: Date;
        endDate: Date;
        oldStartDate: Date;
        oldEndDate: Date;
        record: any;
    };
    move_end_task_bar: {
        index: number;
        sub_task_index?: number;
        startDate: Date;
        endDate: Date;
        oldStartDate: Date;
        oldEndDate: Date;
        record: any;
        oldRowIndex: number;
        newRowIndex: number;
    };
    create_task_schedule: {
        federatedEvent: FederatedPointerEvent;
        event: Event;
        index: number;
        sub_task_index?: number;
        startDate: string;
        endDate: string;
        record: any;
        parentRecord?: any;
    };
    create_dependency_link: {
        federatedEvent: FederatedPointerEvent;
        event: Event;
        link: ITaskLink;
    };
    delete_dependency_link: {
        event: KeyboardEvent;
        link: ITaskLink;
    };
    click_dependency_link_point: {
        event: Event;
        point: 'start' | 'end';
        index: number;
        sub_task_index?: number;
        record: any;
    };
    contextmenu_dependency_link: {
        federatedEvent: FederatedPointerEvent;
        event: Event;
        link: ITaskLink;
    };
    click_markline_create: {
        event: Event;
        data: ITimelineDateInfo;
        position: IPosition;
    };
    click_markline_content: {
        event: Event;
        data: IMarkLine;
        position: IPosition;
    };
    progress_update: {
        federatedEvent: FederatedPointerEvent;
        event: Event;
        index: number;
        sub_task_index?: number;
        progress: number;
        oldProgress: number;
        record: any;
    };
    zoom: IZoomEventArgs;
}
export interface TableEventHandlersReturnMap {
    scroll: void;
    mouseenter_task_bar: void;
    mouseleave_task_bar: void;
    click_task_bar: void;
    contextmenu_task_bar: void;
    change_date_range: void;
    create_task_schedule: void;
    create_dependency_link: void;
    delete_dependency_link: void;
    contextmenu_dependency_link: void;
    click_markline_create: void;
    click_markline_content: void;
    move_end_task_bar: void;
    progress_update: void;
    click_dependency_link_point: void;
    zoom: void;
}
