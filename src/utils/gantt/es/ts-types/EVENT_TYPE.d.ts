export interface EVENT_TYPES {
    SCROLL: 'scroll';
    CHANGE_DATE_RANGE: 'change_date_range';
    CLICK_TASK_BAR: 'click_task_bar';
    CONTEXTMENU_TASK_BAR: 'contextmenu_task_bar';
    MOUSEENTER_TASK_BAR: 'mouseenter_task_bar';
    MOUSELEAVE_TASK_BAR: 'mouseleave_task_bar';
    CREATE_TASK_SCHEDULE: 'create_task_schedule';
    CREATE_DEPENDENCY_LINK: 'create_dependency_link';
    DELETE_DEPENDENCY_LINK: 'delete_dependency_link';
    CLICK_DEPENDENCY_LINK_POINT: 'click_dependency_link_point';
    CONTEXTMENU_DEPENDENCY_LINK: 'contextmenu_dependency_link';
    CLICK_MARKLINE_CREATE: 'click_markline_create';
    CLICK_MARKLINE_CONTENT: 'click_markline_content';
    MOVE_END_TASK_BAR: 'move_end_task_bar';
    PROGRESS_UPDATE: 'progress_update';
    ZOOM: 'zoom';
}
export declare const GANTT_EVENT_TYPE: EVENT_TYPES;
