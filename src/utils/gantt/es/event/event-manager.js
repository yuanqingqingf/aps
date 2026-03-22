import { vglobal } from "@visactor/vtable/es/vrender";

import { EventHandler } from "../event/EventHandler";

import { handleWhell } from "../event/scroll";

import { formatDate } from "../tools/util";

import { GANTT_EVENT_TYPE, InteractionState, TasksShowMode, TaskType } from "../ts-types";

import { isValid } from "@visactor/vutils";

import { getPixelRatio } from "../tools/pixel-ratio";

import { getDateIndexByX, getTaskIndexsByTaskY, _getTaskInfoByXYForCreateSchedule, getNodeClickPos, judgeIfHasMarkLine } from "../gantt-helper";

import { bindTouchListener } from "./touch";

import { Inertia } from "../tools/inertia";

export class EventManager {
    constructor(gantt) {
        this.isDown = !1, this.isDraging = !1, this.globalEventListeners = [], this._enableTableScroll = !0, 
        this._gantt = gantt, this.inertiaScroll = new Inertia, this._eventHandler = new EventHandler, 
        this.bindEvent();
    }
    release() {
        this._eventHandler.release(), this.globalEventListeners.forEach((item => {
            "document" === item.env ? document.removeEventListener(item.name, item.callback) : "body" === item.env ? document.body.removeEventListener(item.name, item.callback) : "window" === item.env && window.removeEventListener(item.name, item.callback);
        })), this.globalEventListeners = [], this.inertiaScroll.endInertia();
    }
    bindEvent() {
        bindTableGroupListener(this), bindContainerDomListener(this), bindTouchListener(this);
    }
}

function bindTableGroupListener(event) {
    const scene = event._gantt.scenegraph, gantt = event._gantt, stateManager = gantt.stateManager;
    scene.ganttGroup.addEventListener("pointerdown", (e => {
        if (0 !== e.button) return;
        let downBarNode, downCreationButtomNode, downDependencyLineNode, downLeftLinkPointNode, downRightLinkPointNode, depedencyLink;
        if (e.detailPath.find((pathNode => "task-bar" === pathNode.name ? (downBarNode = pathNode, 
        !0) : "task-creation-button" === pathNode.name ? (downCreationButtomNode = pathNode, 
        !0) : "task-bar-link-point-left" === pathNode.name ? (downLeftLinkPointNode = pathNode, 
        !0) : "task-bar-link-point-right" === pathNode.name ? (downRightLinkPointNode = pathNode, 
        !0) : !!pathNode.attribute.vtable_link && (downDependencyLineNode = pathNode, depedencyLink = pathNode.attribute.vtable_link, 
        !0))), downBarNode) {
            const taskRecord = downBarNode.record;
            if (!((null == taskRecord ? void 0 : taskRecord.type) === TaskType.PROJECT)) if ("task-bar-hover-shadow-left-icon" === e.target.name) stateManager.startResizeTaskBar(downBarNode, e.nativeEvent.x, e.nativeEvent.y, e.offset.y, "left"), 
            stateManager.updateInteractionState(InteractionState.grabing); else if ("task-bar-hover-shadow-right-icon" === e.target.name) stateManager.startResizeTaskBar(downBarNode, e.nativeEvent.x, e.nativeEvent.y, e.offset.y, "right"), 
            stateManager.updateInteractionState(InteractionState.grabing); else if ("task-bar-progress-handle" === e.target.name) stateManager.startAdjustProgressBar(downBarNode, e.nativeEvent.x, e.nativeEvent.y), 
            stateManager.updateInteractionState(InteractionState.grabing); else if (gantt.parsedOptions.taskBarMoveable) {
                const moveTaskBar = () => {
                    let moveable = !0;
                    if ("function" == typeof gantt.parsedOptions.taskBarMoveable) {
                        const {startDate: startDate, endDate: endDate, taskRecord: taskRecord} = scene._gantt.getTaskInfoByTaskListIndex(downBarNode.task_index, downBarNode.sub_task_index), args = {
                            index: downBarNode.task_index,
                            startDate: startDate,
                            endDate: endDate,
                            taskRecord: taskRecord,
                            ganttInstance: scene._gantt
                        };
                        moveable = gantt.parsedOptions.taskBarMoveable(args);
                    } else moveable = gantt.parsedOptions.taskBarMoveable;
                    moveable && (stateManager.startMoveTaskBar(downBarNode, e.nativeEvent.x, e.nativeEvent.y, e.offset.y), 
                    stateManager.updateInteractionState(InteractionState.grabing));
                };
                "touch" === e.pointerType ? (event.touchEnd = !1, event.touchSetTimeout = setTimeout((() => {
                    event.isTouchdown = !1, event.isLongTouch = !0, moveTaskBar();
                }), 100)) : moveTaskBar();
            }
        } else downLeftLinkPointNode ? (stateManager.startCreateDependencyLine(downLeftLinkPointNode, e.nativeEvent.x, e.nativeEvent.y, e.offset.y, "left"), 
        stateManager.updateInteractionState(InteractionState.grabing)) : downRightLinkPointNode && (stateManager.startCreateDependencyLine(downRightLinkPointNode, e.nativeEvent.x, e.nativeEvent.y, e.offset.y, "right"), 
        stateManager.updateInteractionState(InteractionState.grabing));
    })), scene.ganttGroup.addEventListener("pointermove", (e => {
        var _a, _b, _c, _d;
        if (event.touchSetTimeout && (clearTimeout(event.touchSetTimeout), event.touchSetTimeout = void 0), 
        stateManager.interactionState === InteractionState.default) {
            const taskBarTarget = e.detailPath.find((pathNode => "task-bar" === pathNode.name)), marklineCreateGroupTarget = e.detailPath.find((pathNode => "markline-hover-group" === pathNode.name)), marklineContentGroupTarget = e.detailPath.find((pathNode => "mark-line-content" === pathNode.name));
            if ((null === (_a = gantt.parsedOptions.markLineCreateOptions) || void 0 === _a ? void 0 : _a.markLineCreatable) && (marklineCreateGroupTarget && !judgeIfHasMarkLine(marklineCreateGroupTarget.data, gantt.parsedOptions.markLine) ? scene._gantt.stateManager.marklineIcon.target !== marklineCreateGroupTarget && (scene._gantt.stateManager.marklineIcon.target = marklineCreateGroupTarget, 
            stateManager.showMarklineIconHover()) : scene._gantt.stateManager.marklineIcon.target && stateManager.hideMarklineIconHover()), 
            taskBarTarget) {
                const taskBarNode = taskBarTarget;
                if (scene._gantt.stateManager.hoverTaskBar.target !== taskBarNode) {
                    scene._gantt.stateManager.hoverTaskBar.target = taskBarNode;
                    const taskIndex = taskBarNode.task_index, sub_task_index = taskBarNode.sub_task_index, record = taskBarNode.record;
                    record.type !== TaskType.PROJECT && stateManager.showTaskBarHover(), scene._gantt.hasListeners(GANTT_EVENT_TYPE.MOUSEENTER_TASK_BAR) && scene._gantt.fireListeners(GANTT_EVENT_TYPE.MOUSEENTER_TASK_BAR, {
                        federatedEvent: e,
                        event: e.nativeEvent,
                        index: taskIndex,
                        sub_task_index: sub_task_index,
                        record: record
                    });
                }
            } else {
                if (scene._gantt.stateManager.hoverTaskBar.target) {
                    if (scene._gantt.hasListeners(GANTT_EVENT_TYPE.MOUSELEAVE_TASK_BAR)) {
                        const taskIndex = scene._gantt.stateManager.hoverTaskBar.target.task_index, sub_task_index = scene._gantt.stateManager.hoverTaskBar.target.sub_task_index, record = scene._gantt.getRecordByIndex(taskIndex, sub_task_index);
                        scene._gantt.fireListeners(GANTT_EVENT_TYPE.MOUSELEAVE_TASK_BAR, {
                            federatedEvent: e,
                            event: e.nativeEvent,
                            index: taskIndex,
                            sub_task_index: sub_task_index,
                            record: record
                        });
                    }
                    stateManager.hideTaskBarHover(e);
                }
                if (gantt.parsedOptions.taskBarCreatable && !marklineContentGroupTarget) {
                    const taskIndex = getTaskIndexsByTaskY(e.offset.y - gantt.headerHeight + gantt.stateManager.scrollTop, gantt), recordTaskInfo = gantt.getTaskInfoByTaskListIndex(taskIndex.task_index, taskIndex.sub_task_index);
                    let taskBarCreatable = !0;
                    if ("function" == typeof gantt.parsedOptions.taskBarCreatable) {
                        const {startDate: startDate, endDate: endDate, taskRecord: taskRecord} = recordTaskInfo, args = {
                            index: taskIndex.task_index,
                            sub_task_index: taskIndex.sub_task_index,
                            startDate: startDate,
                            endDate: endDate,
                            taskRecord: taskRecord,
                            ganttInstance: gantt
                        };
                        taskBarCreatable = gantt.parsedOptions.taskBarCreatable(args);
                    } else taskBarCreatable = gantt.parsedOptions.taskBarCreatable;
                    if (taskBarCreatable) {
                        const taskInfoOnXY = _getTaskInfoByXYForCreateSchedule(e.offset.x, e.offset.y, gantt);
                        if ((gantt.parsedOptions.tasksShowMode === TasksShowMode.Sub_Tasks_Separate || gantt.parsedOptions.tasksShowMode === TasksShowMode.Tasks_Separate) && !recordTaskInfo.taskDays && recordTaskInfo.taskRecord && !recordTaskInfo.taskRecord.vtableMerge || (gantt.parsedOptions.tasksShowMode === TasksShowMode.Sub_Tasks_Inline || gantt.parsedOptions.tasksShowMode === TasksShowMode.Sub_Tasks_Arrange || gantt.parsedOptions.tasksShowMode === TasksShowMode.Sub_Tasks_Compact) && !taskInfoOnXY) {
                            const dateIndex = getDateIndexByX(e.offset.x, gantt), showX = (dateIndex >= 1 ? gantt.getDateColsWidth(0, dateIndex - 1) : 0) - gantt.stateManager.scroll.horizontalBarPos, showY = gantt.taskListTableInstance.getRowsHeight(gantt.taskListTableInstance.columnHeaderLevelCount, taskIndex.task_index + gantt.taskListTableInstance.columnHeaderLevelCount - 1) + (null !== (_b = taskIndex.sub_task_index) && void 0 !== _b ? _b : 0) * gantt.parsedOptions.rowHeight - gantt.stateManager.scroll.verticalBarPos;
                            return void gantt.scenegraph.showTaskCreationButton(showX, showY, dateIndex);
                        }
                    }
                }
            }
            gantt.scenegraph.hideTaskCreationButton();
        } else if (stateManager.interactionState === InteractionState.grabing) {
            let downBarNode, downCreationButtomNode, downDependencyLineNode, downLeftLinkPointNode, downRightLinkPointNode, depedencyLink;
            e.detailPath.find((pathNode => "task-bar" === pathNode.name ? (downBarNode = pathNode, 
            !0) : "task-creation-button" === pathNode.name ? (downCreationButtomNode = pathNode, 
            !0) : "task-bar-link-point-left" === pathNode.name ? (downLeftLinkPointNode = pathNode, 
            !0) : "task-bar-link-point-right" === pathNode.name ? (downRightLinkPointNode = pathNode, 
            !0) : !!pathNode.attribute.vtable_link && (downDependencyLineNode = pathNode, depedencyLink = pathNode.attribute.vtable_link, 
            !0))), downLeftLinkPointNode && downLeftLinkPointNode.parent && (downBarNode = null != downBarNode ? downBarNode : null === (_c = downLeftLinkPointNode.parent.attribute) || void 0 === _c ? void 0 : _c.attachedToTaskBarNode), 
            downRightLinkPointNode && downRightLinkPointNode.parent && (downBarNode = null != downBarNode ? downBarNode : null === (_d = downRightLinkPointNode.parent.attribute) || void 0 === _d ? void 0 : _d.attachedToTaskBarNode), 
            scene._gantt.stateManager.isCreatingDependencyLine() && !downBarNode ? stateManager.hideSecondTaskBarSelectedBorder() : scene._gantt.stateManager.isCreatingDependencyLine() && downLeftLinkPointNode && scene._gantt.stateManager.selectedTaskBar.target !== downBarNode ? (stateManager.highlightLinkPointNode(downLeftLinkPointNode), 
            stateManager.creatingDenpendencyLink.lastHighLightLinkPoint = downLeftLinkPointNode, 
            stateManager.creatingDenpendencyLink.secondTaskBarPosition = "left") : scene._gantt.stateManager.isCreatingDependencyLine() && downRightLinkPointNode && scene._gantt.stateManager.selectedTaskBar.target !== downBarNode ? (stateManager.highlightLinkPointNode(downRightLinkPointNode), 
            stateManager.creatingDenpendencyLink.lastHighLightLinkPoint = downRightLinkPointNode, 
            stateManager.creatingDenpendencyLink.secondTaskBarPosition = "right") : scene._gantt.stateManager.isCreatingDependencyLine() && downBarNode && scene._gantt.stateManager.selectedTaskBar.target !== downBarNode && (stateManager.unhighlightLinkPointNode(stateManager.creatingDenpendencyLink.lastHighLightLinkPoint), 
            stateManager.creatingDenpendencyLink.secondTaskBarNode && stateManager.creatingDenpendencyLink.secondTaskBarNode === downBarNode || (stateManager.creatingDenpendencyLink.secondTaskBarNode && stateManager.creatingDenpendencyLink.secondTaskBarNode !== downBarNode && stateManager.hideSecondTaskBarSelectedBorder(), 
            stateManager.creatingDenpendencyLink.secondTaskBarNode = downBarNode, stateManager.showSecondTaskBarSelectedBorder()));
        }
    })), scene.ganttGroup.addEventListener("pointerup", (e => {
        var _a, _b;
        if (event.touchSetTimeout && (clearTimeout(event.touchSetTimeout), event.touchSetTimeout = void 0), 
        0 === e.button) {
            let depedencyLink, markLineContentTarget, markLineIconTarget, isClickBar = !1, isClickCreationButtom = !1, isClickDependencyLine = !1, isClickLeftLinkPoint = !1, isClickRightLinkPoint = !1, isClickMarklineIcon = !1, isClickMarklineContent = !1;
            const taskBarTarget = e.detailPath.find((pathNode => "task-bar" === pathNode.name ? (isClickBar = !0, 
            !0) : "task-creation-button" === pathNode.name ? (isClickCreationButtom = !0, !1) : "task-bar-link-point-left" === pathNode.name ? (isClickLeftLinkPoint = !0, 
            !1) : "task-bar-link-point-right" === pathNode.name ? (isClickRightLinkPoint = !0, 
            !1) : pathNode.attribute.vtable_link ? (isClickDependencyLine = !0, depedencyLink = pathNode.attribute.vtable_link, 
            !1) : "markline-hover-group" === pathNode.name ? (isClickMarklineIcon = !0, markLineIconTarget = pathNode, 
            !1) : "mark-line-content" === pathNode.name && (isClickMarklineContent = !0, markLineContentTarget = pathNode, 
            !1)));
            if (isClickBar && scene._gantt.parsedOptions.taskBarSelectable && "down" === event.poniterState) {
                stateManager.hideDependencyLinkSelectedLine();
                const taskBarNode = taskBarTarget;
                if (stateManager.showTaskBarSelectedBorder(taskBarNode), gantt.hasListeners(GANTT_EVENT_TYPE.CLICK_TASK_BAR)) {
                    const taskIndex = taskBarNode.task_index, sub_task_index = taskBarNode.sub_task_index, record = gantt.getRecordByIndex(taskIndex, sub_task_index);
                    gantt.fireListeners(GANTT_EVENT_TYPE.CLICK_TASK_BAR, {
                        federatedEvent: e,
                        event: e.nativeEvent,
                        index: taskIndex,
                        sub_task_index: sub_task_index,
                        record: record
                    });
                }
            } else if (isClickCreationButtom && "down" === event.poniterState) {
                stateManager.hideDependencyLinkSelectedLine(), stateManager.hideTaskBarSelectedBorder();
                const taskIndex = getTaskIndexsByTaskY(e.offset.y - gantt.headerHeight + gantt.stateManager.scrollTop, gantt);
                if (gantt.parsedOptions.tasksShowMode === TasksShowMode.Sub_Tasks_Arrange || gantt.parsedOptions.tasksShowMode === TasksShowMode.Sub_Tasks_Inline || gantt.parsedOptions.tasksShowMode === TasksShowMode.Sub_Tasks_Compact) {
                    if (gantt.hasListeners(GANTT_EVENT_TYPE.CREATE_TASK_SCHEDULE)) {
                        const dateIndex = getDateIndexByX(e.offset.x, gantt), dateRange = gantt.getDateRangeByIndex(dateIndex), dateFormat = null !== (_a = gantt.parsedOptions.dateFormat) && void 0 !== _a ? _a : gantt.parsedOptions.timeScaleIncludeHour ? "yyyy-mm-dd hh:mm:ss" : "yyyy-mm-dd";
                        gantt.fireListeners(GANTT_EVENT_TYPE.CREATE_TASK_SCHEDULE, {
                            federatedEvent: e,
                            event: e.nativeEvent,
                            index: taskIndex.task_index,
                            sub_task_index: taskIndex.sub_task_index,
                            startDate: formatDate(dateRange.startDate, dateFormat),
                            endDate: formatDate(dateRange.endDate, dateFormat),
                            record: void 0,
                            parentRecord: gantt.getRecordByIndex(taskIndex.task_index)
                        });
                    }
                } else {
                    const recordTaskInfo = gantt.getTaskInfoByTaskListIndex(taskIndex.task_index, taskIndex.sub_task_index);
                    if (recordTaskInfo.taskRecord) {
                        const dateFormat = null !== (_b = gantt.parsedOptions.dateFormat) && void 0 !== _b ? _b : gantt.parsedOptions.timeScaleIncludeHour ? "yyyy-mm-dd hh:mm:ss" : "yyyy-mm-dd", dateIndex = getDateIndexByX(e.offset.x, gantt), dateRange = gantt.getDateRangeByIndex(dateIndex);
                        recordTaskInfo.taskRecord[gantt.parsedOptions.startDateField] = formatDate(dateRange.startDate, dateFormat), 
                        recordTaskInfo.taskRecord[gantt.parsedOptions.endDateField] = formatDate(dateRange.endDate, dateFormat), 
                        gantt.scenegraph.hideTaskCreationButton(), gantt.updateTaskRecord(recordTaskInfo.taskRecord, taskIndex.task_index, taskIndex.sub_task_index), 
                        gantt.hasListeners(GANTT_EVENT_TYPE.CREATE_TASK_SCHEDULE) && gantt.fireListeners(GANTT_EVENT_TYPE.CREATE_TASK_SCHEDULE, {
                            federatedEvent: e,
                            event: e.nativeEvent,
                            index: taskIndex.task_index,
                            sub_task_index: taskIndex.sub_task_index,
                            startDate: recordTaskInfo.taskRecord[gantt.parsedOptions.startDateField],
                            endDate: recordTaskInfo.taskRecord[gantt.parsedOptions.endDateField],
                            record: recordTaskInfo.taskRecord
                        });
                    }
                }
            } else if (isClickDependencyLine && scene._gantt.parsedOptions.dependencyLinkSelectable && "down" === event.poniterState) stateManager.hideDependencyLinkSelectedLine(), 
            stateManager.hideTaskBarSelectedBorder(), scene._gantt.stateManager.selectedDenpendencyLink.link = depedencyLink, 
            stateManager.showDependencyLinkSelectedLine(); else if ((isClickLeftLinkPoint || isClickRightLinkPoint) && "down" === event.poniterState) {
                if (gantt.hasListeners(GANTT_EVENT_TYPE.CLICK_DEPENDENCY_LINK_POINT)) {
                    const taskIndex = getTaskIndexsByTaskY(e.offset.y - gantt.headerHeight + gantt.stateManager.scrollTop, gantt), record = gantt.getRecordByIndex(taskIndex.task_index, taskIndex.sub_task_index);
                    gantt.fireListeners(GANTT_EVENT_TYPE.CLICK_DEPENDENCY_LINK_POINT, {
                        event: e.nativeEvent,
                        index: taskIndex.task_index,
                        sub_task_index: taskIndex.sub_task_index,
                        point: isClickLeftLinkPoint ? "start" : "end",
                        record: record
                    });
                }
                stateManager.hideTaskBarSelectedBorder();
            } else if (isClickMarklineIcon && "down" === event.poniterState) gantt.hasListeners(GANTT_EVENT_TYPE.CLICK_MARKLINE_CREATE) && gantt.fireListeners(GANTT_EVENT_TYPE.CLICK_MARKLINE_CREATE, {
                event: e.nativeEvent,
                position: getNodeClickPos(markLineIconTarget, scene._gantt),
                data: scene._gantt.stateManager.marklineIcon.target.data
            }); else if (isClickMarklineContent && "down" === event.poniterState) gantt.hasListeners(GANTT_EVENT_TYPE.CLICK_MARKLINE_CONTENT) && gantt.fireListeners(GANTT_EVENT_TYPE.CLICK_MARKLINE_CONTENT, {
                event: e.nativeEvent,
                position: getNodeClickPos(markLineContentTarget, scene._gantt),
                data: markLineContentTarget.data
            }); else if (isClickLeftLinkPoint && "draging" === event.poniterState) {
                if (stateManager.isCreatingDependencyLine()) {
                    const link = stateManager.endCreateDependencyLine(e.offset.y);
                    gantt.hasListeners(GANTT_EVENT_TYPE.CREATE_DEPENDENCY_LINK) && gantt.fireListeners(GANTT_EVENT_TYPE.CREATE_DEPENDENCY_LINK, {
                        federatedEvent: e,
                        event: e.nativeEvent,
                        link: link
                    });
                }
            } else if (isClickRightLinkPoint && "draging" === event.poniterState) {
                if (stateManager.isCreatingDependencyLine()) {
                    const link = stateManager.endCreateDependencyLine(e.offset.y);
                    gantt.hasListeners(GANTT_EVENT_TYPE.CREATE_DEPENDENCY_LINK) && gantt.fireListeners(GANTT_EVENT_TYPE.CREATE_DEPENDENCY_LINK, {
                        federatedEvent: e,
                        event: e.nativeEvent,
                        link: link
                    });
                }
            } else stateManager.hideDependencyLinkSelectedLine(), stateManager.hideTaskBarSelectedBorder();
        }
    })), scene.ganttGroup.addEventListener("rightdown", (e => {
        let depedencyLink, isClickBar = !1, isClickDependencyLine = !1;
        const taskBarTarget = e.detailPath.find((pathNode => "task-bar" === pathNode.name ? (isClickBar = !0, 
        !0) : !!pathNode.attribute.vtable_link && (isClickDependencyLine = !0, depedencyLink = pathNode.attribute.vtable_link, 
        !1)));
        if (isClickBar) {
            if (gantt.hasListeners(GANTT_EVENT_TYPE.CONTEXTMENU_TASK_BAR)) {
                const taskBarNode = taskBarTarget, taskIndex = taskBarNode.task_index, sub_task_index = taskBarNode.sub_task_index, record = gantt.getRecordByIndex(taskIndex, sub_task_index);
                gantt.fireListeners(GANTT_EVENT_TYPE.CONTEXTMENU_TASK_BAR, {
                    federatedEvent: e,
                    event: e.nativeEvent,
                    index: taskIndex,
                    sub_task_index: sub_task_index,
                    record: record
                });
            }
        } else isClickDependencyLine && gantt.hasListeners(GANTT_EVENT_TYPE.CONTEXTMENU_DEPENDENCY_LINK) && gantt.fireListeners(GANTT_EVENT_TYPE.CONTEXTMENU_DEPENDENCY_LINK, {
            federatedEvent: e,
            event: e.nativeEvent,
            link: depedencyLink
        });
    })), scene.ganttGroup.addEventListener("pointerenter", (e => {
        (gantt.parsedOptions.scrollStyle.horizontalVisible && "focus" === gantt.parsedOptions.scrollStyle.horizontalVisible || !gantt.parsedOptions.scrollStyle.horizontalVisible && "focus" === gantt.parsedOptions.scrollStyle.visible) && scene.scrollbarComponent.showHorizontalScrollBar(), 
        (gantt.parsedOptions.scrollStyle.verticalVisible && "focus" === gantt.parsedOptions.scrollStyle.verticalVisible || !gantt.parsedOptions.scrollStyle.verticalVisible && "focus" === gantt.parsedOptions.scrollStyle.visible) && scene.scrollbarComponent.showVerticalScrollBar();
    })), scene.ganttGroup.addEventListener("pointerleave", (e => {
        if ((gantt.parsedOptions.scrollStyle.horizontalVisible && "focus" === gantt.parsedOptions.scrollStyle.horizontalVisible || !gantt.parsedOptions.scrollStyle.horizontalVisible && "focus" === gantt.parsedOptions.scrollStyle.visible) && scene.scrollbarComponent.hideHorizontalScrollBar(), 
        (gantt.parsedOptions.scrollStyle.verticalVisible && "focus" === gantt.parsedOptions.scrollStyle.verticalVisible || !gantt.parsedOptions.scrollStyle.verticalVisible && "focus" === gantt.parsedOptions.scrollStyle.visible) && scene.scrollbarComponent.hideVerticalScrollBar(), 
        scene._gantt.stateManager.hoverTaskBar.target) {
            if (scene._gantt.hasListeners(GANTT_EVENT_TYPE.MOUSELEAVE_TASK_BAR)) {
                const taskIndex = scene._gantt.stateManager.hoverTaskBar.target.task_index, sub_task_index = scene._gantt.stateManager.hoverTaskBar.target.sub_task_index, record = scene._gantt.getRecordByIndex(taskIndex, sub_task_index);
                scene._gantt.fireListeners(GANTT_EVENT_TYPE.MOUSELEAVE_TASK_BAR, {
                    federatedEvent: e,
                    event: e.nativeEvent,
                    index: taskIndex,
                    sub_task_index: sub_task_index,
                    record: record
                });
            }
            stateManager.hideTaskBarHover(e);
        }
    })), scene.ganttGroup.addEventListener("wheel", (e => {
        handleWhell(e, stateManager, gantt);
    }));
}

function bindContainerDomListener(eventManager) {
    const gantt = eventManager._gantt, stateManager = (eventManager._gantt.scenegraph, 
    gantt.stateManager), handler = eventManager._eventHandler;
    handler.on(gantt.getElement(), "contextmenu", (e => {
        var _a;
        !1 !== (null === (_a = gantt.parsedOptions.eventOptions) || void 0 === _a ? void 0 : _a.preventDefaultContextMenu) && e.preventDefault();
    })), handler.on(gantt.getContainer(), "resize", (e => {
        0 === e.width && 0 === e.height || (isValid(gantt.options.pixelRatio) || gantt.setPixelRatio(getPixelRatio()), 
        e.windowSizeNotChange || gantt._resize());
    })), gantt.taskListTableInstance && gantt.parsedOptions.verticalSplitLineMoveable && handler.on(gantt.verticalSplitResizeLine, "mousedown", (e => {
        stateManager.updateInteractionState(InteractionState.grabing), stateManager.startResizeTableWidth(e);
    })), gantt.parsedOptions.verticalSplitLineHighlight && (gantt.verticalSplitResizeLine && handler.on(gantt.verticalSplitResizeLine, "mouseover", (e => {
        gantt.verticalSplitResizeLine.childNodes[1].style.opacity = "1";
    })), gantt.verticalSplitResizeLine && handler.on(gantt.verticalSplitResizeLine, "mouseout", (e => {
        gantt.verticalSplitResizeLine.childNodes[1].style.opacity = "0";
    })));
    const globalPointerdownCallback = e => {
        gantt.eventManager.lastDragPointerXYOnWindow = {
            x: e.x,
            y: e.y
        }, gantt.eventManager.poniterState = "down";
    };
    eventManager.globalEventListeners.push({
        name: "pointerdown",
        env: "document",
        callback: globalPointerdownCallback
    }), vglobal.addEventListener("pointerdown", globalPointerdownCallback);
    const globalPointermoveCallback = e => {
        var _a, _b, _c, _d, _e, _f;
        if ("down" === gantt.eventManager.poniterState) {
            const x1 = null !== (_a = gantt.eventManager.lastDragPointerXYOnWindow.x) && void 0 !== _a ? _a : e.x, dx = e.x - x1, y1 = null !== (_b = gantt.eventManager.lastDragPointerXYOnWindow.y) && void 0 !== _b ? _b : e.y, dy = e.y - y1;
            (Math.abs(dx) >= 1 || Math.abs(dy) >= 1) && (gantt.eventManager.poniterState = "draging");
        }
        if (stateManager.interactionState === InteractionState.grabing && "draging" === gantt.eventManager.poniterState) {
            const lastX = null !== (_d = null === (_c = gantt.eventManager.lastDragPointerXYOnWindow) || void 0 === _c ? void 0 : _c.x) && void 0 !== _d ? _d : e.x, lastY = null !== (_f = null === (_e = gantt.eventManager.lastDragPointerXYOnWindow) || void 0 === _e ? void 0 : _e.y) && void 0 !== _f ? _f : e.y;
            (Math.abs(lastX - e.x) >= 1 || Math.abs(lastY - e.y) >= 1) && (stateManager.isResizingTableWidth() ? (stateManager.hideDependencyLinkSelectedLine(), 
            stateManager.hideTaskBarSelectedBorder(), stateManager.dealResizeTableWidth(e)) : stateManager.isMoveingTaskBar() ? (stateManager.hideDependencyLinkSelectedLine(), 
            stateManager.hideTaskBarSelectedBorder(), stateManager.dealTaskBarMove(e)) : stateManager.isResizingTaskBar() ? (stateManager.hideDependencyLinkSelectedLine(), 
            stateManager.hideTaskBarSelectedBorder(), stateManager.dealTaskBarResize(e)) : stateManager.isAdjustingProgressBar() ? stateManager.dealAdjustProgressBar(e) : stateManager.isCreatingDependencyLine() && stateManager.dealCreateDependencyLine(e), 
            gantt.eventManager.lastDragPointerXYOnWindow = {
                x: e.x,
                y: e.y
            });
        }
    };
    eventManager.globalEventListeners.push({
        name: "pointermove",
        env: "document",
        callback: globalPointermoveCallback
    }), vglobal.addEventListener("pointermove", globalPointermoveCallback);
    const globalPointerupCallback = e => {
        "grabing" === stateManager.interactionState && (stateManager.updateInteractionState(InteractionState.default), 
        stateManager.isResizingTableWidth() ? stateManager.endResizeTableWidth() : stateManager.isMoveingTaskBar() ? stateManager.endMoveTaskBar() : stateManager.isResizingTaskBar() ? stateManager.endResizeTaskBar(e.x) : stateManager.isAdjustingProgressBar() && stateManager.endAdjustProgressBar(e.x)), 
        setTimeout((() => {
            gantt.eventManager.lastDragPointerXYOnWindow = void 0, gantt.eventManager.poniterState = "up";
        }), 0);
    };
    eventManager.globalEventListeners.push({
        name: "pointerup",
        env: "document",
        callback: globalPointerupCallback
    }), vglobal.addEventListener("pointerup", globalPointerupCallback);
    const globalKeydownCallback = e => {
        var _a, _b;
        if (gantt.parsedOptions.dependencyLinkDeletable && ("Delete" === e.key && (null === (_a = gantt.parsedOptions.keyboardOptions) || void 0 === _a ? void 0 : _a.deleteLinkOnDel) || "Backspace" === e.key && (null === (_b = gantt.parsedOptions.keyboardOptions) || void 0 === _b ? void 0 : _b.deleteLinkOnBack)) && gantt.stateManager.selectedDenpendencyLink.link) {
            const link = gantt.stateManager.selectedDenpendencyLink.link;
            gantt.deleteLink(gantt.stateManager.selectedDenpendencyLink.link), stateManager.hideDependencyLinkSelectedLine(), 
            stateManager.hideTaskBarSelectedBorder(), gantt.hasListeners(GANTT_EVENT_TYPE.DELETE_DEPENDENCY_LINK) && gantt.fireListeners(GANTT_EVENT_TYPE.DELETE_DEPENDENCY_LINK, {
                event: e,
                link: link
            });
        }
    };
    eventManager.globalEventListeners.push({
        name: "keydown",
        env: "document",
        callback: globalKeydownCallback
    }), vglobal.addEventListener("keydown", globalKeydownCallback);
}
//# sourceMappingURL=event-manager.js.map