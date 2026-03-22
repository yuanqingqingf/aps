import { isValid } from "@visactor/vutils";

import { InteractionState, GANTT_EVENT_TYPE, DependencyType, TasksShowMode, TaskType } from "../ts-types";

import { syncEditCellFromTable, syncScrollStateFromTable, syncScrollStateToTable, syncDragOrderFromTable, syncTreeChangeFromTable, syncSortFromTable, syncTableWidthFromTable } from "./gantt-table-sync";

import { clearRecordShowIndex, findRecordByTaskKey, getDateIndexByX, getTaskIndexsByTaskY, getTextPos } from "../gantt-helper";

import { debounce } from "../tools/debounce";

import { TASKBAR_HOVER_ICON_WIDTH } from "../scenegraph/task-bar";

import { Inertia } from "../tools/inertia";

import { createDateAtMidnight, getEndDateByTimeUnit, getStartDateByTimeUnit, toBoxArray, parseStringTemplate } from "../tools/util";

export class StateManager {
    constructor(gantt) {
        var _a;
        this.interactionState = InteractionState.default, this.resetInteractionState = debounce((() => {
            this.updateInteractionState(InteractionState.default);
        }), 100), this._gantt = gantt, this.scroll = {
            horizontalBarPos: 0,
            verticalBarPos: 0
        }, this.moveTaskBar = {
            targetStartX: null,
            targetStartY: null,
            deltaX: 0,
            deltaY: 0,
            startOffsetY: null,
            startX: null,
            startY: null,
            moving: !1,
            target: null,
            moveTaskBarXSpeed: 0,
            moveTaskBarXInertia: new Inertia
        }, this.hoverTaskBar = {
            targetStartX: null,
            startX: null,
            target: null
        }, this.marklineIcon = {
            target: null
        }, this.selectedTaskBar = {
            target: null
        }, this.resizeTaskBar = {
            startOffsetY: null,
            targetStartX: null,
            targetEndX: null,
            startX: null,
            startY: null,
            target: null,
            resizing: !1,
            onIconName: ""
        }, this.adjustProgressBar = {
            startX: null,
            startY: null,
            target: null,
            adjusting: !1,
            originalProgress: 0
        }, this.resizeTableWidth = {
            lastX: null,
            resizing: !1
        }, this.selectedDenpendencyLink = {
            link: null
        }, this.creatingDenpendencyLink = {
            startClickedPoint: null,
            startX: null,
            startY: null,
            startOffsetY: null,
            targetStartX: null,
            creating: !1,
            firstTaskBarPosition: "left",
            secondTaskBarPosition: "left",
            secondTaskBarNode: null,
            lastHighLightLinkPoint: null
        }, this.updateVerticalScrollBar = this.updateVerticalScrollBar.bind(this), this.updateHorizontalScrollBar = this.updateHorizontalScrollBar.bind(this), 
        syncScrollStateFromTable(this._gantt), syncEditCellFromTable(this._gantt), syncDragOrderFromTable(this._gantt), 
        syncTreeChangeFromTable(this._gantt), syncSortFromTable(this._gantt), "auto" !== (null === (_a = this._gantt.options.taskListTable) || void 0 === _a ? void 0 : _a.tableWidth) && -1 !== this._gantt.taskTableWidth || syncTableWidthFromTable(this._gantt);
    }
    setScrollTop(top, triggerEvent = !0) {
        const totalHeight = this._gantt.getAllRowsHeight();
        top = Math.max(0, Math.min(top, totalHeight - this._gantt.scenegraph.height)), top = Math.ceil(top);
        const oldVerticalBarPos = this.scroll.verticalBarPos;
        this.scroll.verticalBarPos = top, isValid(this.scroll.verticalBarPos) && !isNaN(this.scroll.verticalBarPos) || (this.scroll.verticalBarPos = 0), 
        this._gantt.scenegraph.setY(-top);
        const yRatio = top / (totalHeight - this._gantt.scenegraph.height);
        this._gantt.scenegraph.scrollbarComponent.updateVerticalScrollBarPos(yRatio), oldVerticalBarPos !== top && triggerEvent && (syncScrollStateToTable(this._gantt), 
        this._gantt.fireListeners(GANTT_EVENT_TYPE.SCROLL, {
            scrollTop: this.scroll.verticalBarPos,
            scrollLeft: this.scroll.horizontalBarPos,
            scrollDirection: "vertical",
            scrollRatioY: yRatio
        }));
    }
    get scrollLeft() {
        return this.scroll.horizontalBarPos;
    }
    get scrollTop() {
        return this.scroll.verticalBarPos;
    }
    setScrollLeft(left, triggerEvent = !0) {
        const totalWidth = this._gantt.getAllDateColsWidth();
        left = Math.max(0, Math.min(left, totalWidth - this._gantt.scenegraph.width)), left = Math.ceil(left);
        const oldHorizontalBarPos = this.scroll.horizontalBarPos;
        this.scroll.horizontalBarPos = left, isValid(this.scroll.horizontalBarPos) && !isNaN(this.scroll.horizontalBarPos) || (this.scroll.horizontalBarPos = 0), 
        this._gantt.scenegraph.setX(-left);
        const xRatio = left / (totalWidth - this._gantt.scenegraph.width);
        this._gantt.scenegraph.scrollbarComponent.updateHorizontalScrollBarPos(xRatio), 
        oldHorizontalBarPos !== left && triggerEvent && this._gantt.fireListeners(GANTT_EVENT_TYPE.SCROLL, {
            scrollTop: this.scroll.verticalBarPos,
            scrollLeft: this.scroll.horizontalBarPos,
            scrollDirection: "horizontal",
            scrollRatioX: xRatio
        });
    }
    updateInteractionState(mode) {
        if (this.interactionState === mode) return;
        const oldState = this.interactionState;
        this.interactionState = mode, oldState === InteractionState.scrolling && InteractionState.default;
    }
    updateVerticalScrollBar(yRatio) {
        const totalHeight = this._gantt.getAllRowsHeight();
        this.scroll.verticalBarPos;
        this.scroll.verticalBarPos = Math.ceil(yRatio * (totalHeight - this._gantt.scenegraph.height)), 
        isValid(this.scroll.verticalBarPos) && !isNaN(this.scroll.verticalBarPos) || (this.scroll.verticalBarPos = 0), 
        this._gantt.scenegraph.setY(-this.scroll.verticalBarPos, 1 === yRatio), syncScrollStateToTable(this._gantt), 
        this._gantt.fireListeners(GANTT_EVENT_TYPE.SCROLL, {
            scrollTop: this.scroll.verticalBarPos,
            scrollLeft: this.scroll.horizontalBarPos,
            scrollDirection: "vertical",
            scrollRatioY: yRatio
        });
    }
    updateHorizontalScrollBar(xRatio) {
        const totalWidth = this._gantt.getAllDateColsWidth();
        this.scroll.horizontalBarPos;
        this.scroll.horizontalBarPos = Math.ceil(xRatio * (totalWidth - this._gantt.scenegraph.width)), 
        isValid(this.scroll.horizontalBarPos) && !isNaN(this.scroll.horizontalBarPos) || (this.scroll.horizontalBarPos = 0), 
        this._gantt.scenegraph.setX(-this.scroll.horizontalBarPos, 1 === xRatio), this._gantt.fireListeners(GANTT_EVENT_TYPE.SCROLL, {
            scrollTop: this.scroll.verticalBarPos,
            scrollLeft: this.scroll.horizontalBarPos,
            scrollDirection: "horizontal",
            scrollRatioY: xRatio
        });
    }
    startMoveTaskBar(target, x, y, offsetY) {
        "task-bar-hover-shadow" === target.name && (target = target.parent), this.moveTaskBar.moving = !0, 
        this.moveTaskBar.target = target, this.moveTaskBar.targetStartX = target.attribute.x, 
        this.moveTaskBar.targetStartY = target.attribute.y, this.moveTaskBar.startX = x, 
        this.moveTaskBar.startY = y, this.moveTaskBar.startOffsetY = offsetY, target.setAttribute("zIndex", 1e4);
    }
    isMoveingTaskBar() {
        return this.moveTaskBar.moving;
    }
    endMoveTaskBar() {
        this.moveTaskBar.moveTaskBarXInertia.isInertiaScrolling() && this.moveTaskBar.moveTaskBarXInertia.endInertia();
        const deltaX = this.moveTaskBar.deltaX, deltaY = this.moveTaskBar.deltaY, target = this.moveTaskBar.target;
        if (Math.abs(deltaX) >= 1 || Math.abs(deltaY) >= 1) {
            const oldRowIndex = target.task_index, taskIndex = target.task_index, sub_task_index = target.sub_task_index, {startDate: oldStartDate, endDate: oldEndDate} = this._gantt.getTaskInfoByTaskListIndex(taskIndex, sub_task_index), targetEndY = this.moveTaskBar.targetStartY + this._gantt.parsedOptions.rowHeight * Math.round(deltaY / this._gantt.parsedOptions.rowHeight), milestoneTaskbarHeight = this._gantt.parsedOptions.taskBarMilestoneStyle.width, testDateX = this.moveTaskBar.target.attribute.x + (target.record.type === TaskType.MILESTONE ? milestoneTaskbarHeight / 2 : 0), startDateColIndex = getDateIndexByX(testDateX - this._gantt.stateManager.scroll.horizontalBarPos, this._gantt), timelineStartDate = this._gantt.parsedOptions.reverseSortedTimelineScales[0].timelineDates[startDateColIndex];
            if (!timelineStartDate) return;
            const newStartDate = timelineStartDate.startDate, newEndDate = new Date(newStartDate.getTime() + (createDateAtMidnight(oldEndDate).getTime() - createDateAtMidnight(oldStartDate).getTime()));
            let dateChanged;
            if (createDateAtMidnight(oldStartDate).getTime() !== newStartDate.getTime()) {
                dateChanged = createDateAtMidnight(oldStartDate).getTime() > newStartDate.getTime() ? "left" : "right", 
                this._gantt._updateStartEndDateToTaskRecord(newStartDate, newEndDate, taskIndex, sub_task_index);
                const newRecord = this._gantt.getRecordByIndex(taskIndex, sub_task_index);
                this._gantt.hasListeners(GANTT_EVENT_TYPE.CHANGE_DATE_RANGE) && this._gantt.fireListeners(GANTT_EVENT_TYPE.CHANGE_DATE_RANGE, {
                    startDate: newRecord[this._gantt.parsedOptions.startDateField],
                    endDate: newRecord[this._gantt.parsedOptions.endDateField],
                    oldStartDate: oldStartDate,
                    oldEndDate: oldEndDate,
                    index: taskIndex,
                    record: newRecord
                });
                const newRowIndex = getTaskIndexsByTaskY(targetEndY, this._gantt).task_index;
                this._gantt.hasListeners(GANTT_EVENT_TYPE.MOVE_END_TASK_BAR) && this._gantt.fireListeners(GANTT_EVENT_TYPE.MOVE_END_TASK_BAR, {
                    startDate: newRecord[this._gantt.parsedOptions.startDateField],
                    endDate: newRecord[this._gantt.parsedOptions.endDateField],
                    oldStartDate: oldStartDate,
                    oldEndDate: oldEndDate,
                    oldRowIndex: oldRowIndex,
                    newRowIndex: newRowIndex,
                    index: taskIndex,
                    record: newRecord
                });
            } else {
                const newRecord = this._gantt.getRecordByIndex(taskIndex, sub_task_index), newRowIndex = getTaskIndexsByTaskY(targetEndY, this._gantt).task_index;
                this._gantt.hasListeners(GANTT_EVENT_TYPE.MOVE_END_TASK_BAR) && this._gantt.fireListeners(GANTT_EVENT_TYPE.MOVE_END_TASK_BAR, {
                    startDate: newRecord[this._gantt.parsedOptions.startDateField],
                    endDate: newRecord[this._gantt.parsedOptions.endDateField],
                    oldStartDate: oldStartDate,
                    oldEndDate: oldEndDate,
                    oldRowIndex: oldRowIndex,
                    newRowIndex: newRowIndex,
                    index: newRowIndex,
                    record: newRecord
                });
            }
            if (this._gantt.parsedOptions.tasksShowMode === TasksShowMode.Sub_Tasks_Arrange || this._gantt.parsedOptions.tasksShowMode === TasksShowMode.Sub_Tasks_Compact) {
                const indexs = getTaskIndexsByTaskY(targetEndY, this._gantt);
                this._gantt._dragOrderTaskRecord(target.task_index, target.sub_task_index, indexs.task_index, indexs.sub_task_index), 
                clearRecordShowIndex(this._gantt.records), this._gantt.taskListTableInstance.renderWithRecreateCells(), 
                this._gantt._syncPropsFromTable(), this._gantt.scenegraph.refreshTaskBarsAndGrid();
            } else if (this._gantt.parsedOptions.tasksShowMode !== TasksShowMode.Tasks_Separate && Math.abs(Math.round(deltaY / this._gantt.parsedOptions.rowHeight)) >= 1) {
                const indexs = getTaskIndexsByTaskY(targetEndY, this._gantt);
                this._gantt._dragOrderTaskRecord(target.task_index, target.sub_task_index, indexs.task_index, indexs.sub_task_index), 
                this._gantt.parsedOptions.tasksShowMode === TasksShowMode.Sub_Tasks_Separate ? (this._gantt.taskListTableInstance.renderWithRecreateCells(), 
                this._gantt.scenegraph.refreshTaskBarsAndGrid()) : (this._gantt.scenegraph.taskBar.refresh(), 
                this._gantt.scenegraph.dependencyLink.refresh());
            } else {
                let newX = startDateColIndex >= 1 ? this._gantt.getDateColsWidth(0, startDateColIndex - 1) : 0;
                if (target.record.type === TaskType.MILESTONE) {
                    newX -= this._gantt.parsedOptions.taskBarMilestoneStyle.width / 2;
                }
                if (moveTaskBar(target, newX - target.attribute.x, targetEndY - target.attribute.y, this), 
                "right" === dateChanged) {
                    let insertAfterNode = target;
                    for (;insertAfterNode.nextSibling && insertAfterNode.nextSibling.attribute.y === target.attribute.y && insertAfterNode.nextSibling.record[this._gantt.parsedOptions.startDateField] <= target.record[this._gantt.parsedOptions.startDateField]; ) insertAfterNode = insertAfterNode.nextSibling;
                    insertAfterNode !== target && insertAfterNode.parent.insertAfter(target, insertAfterNode);
                } else if ("left" === dateChanged) {
                    let insertBeforeNode = target;
                    for (;insertBeforeNode.previousSibling && insertBeforeNode.previousSibling.attribute.y === target.attribute.y && insertBeforeNode.previousSibling.record[this._gantt.parsedOptions.startDateField] >= target.record[this._gantt.parsedOptions.startDateField]; ) insertBeforeNode = insertBeforeNode.previousSibling;
                    insertBeforeNode !== target && insertBeforeNode.parent.insertBefore(target, insertBeforeNode);
                }
            }
            this._gantt.scenegraph.updateNextFrame();
        }
        this.moveTaskBar.moving = !1, this.selectedTaskBar.target !== target && target.setAttribute("zIndex", 0), 
        target.updateTextPosition(), this.moveTaskBar.target = null, this.moveTaskBar.deltaX = 0, 
        this.moveTaskBar.deltaY = 0, this.moveTaskBar.moveTaskBarXSpeed = 0;
    }
    dealTaskBarMove(e) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
        const gantt = this._gantt;
        let target = this.moveTaskBar.target;
        target.setAttribute("zIndex", 1e4);
        const x1 = gantt.eventManager.lastDragPointerXYOnWindow.x, dx = e.x - x1, y1 = gantt.eventManager.lastDragPointerXYOnWindow.y, dy = e.y - y1;
        if (this.moveTaskBar.deltaX += dx, this.moveTaskBar.deltaY += dy, moveTaskBar(target, dx, dy, this), 
        target.attribute.x <= gantt.stateManager.scrollLeft && dx < 0) if (gantt.parsedOptions.moveTaskBarToExtendDateRange && 0 === gantt.stateManager.scrollLeft) {
            null === (_a = this.moveTaskBar.moveTaskBarXInertia) || void 0 === _a || _a.endInertia();
            const timeDiff = gantt.parsedOptions.reverseSortedTimelineScales[0].timelineDates[1].startDate.getTime() - gantt.parsedOptions.reverseSortedTimelineScales[0].timelineDates[0].startDate.getTime(), {unit: minTimeUnit, startOfWeek: startOfWeek} = gantt.parsedOptions.reverseSortedTimelineScales[0];
            gantt.parsedOptions.minDate = getStartDateByTimeUnit(new Date(gantt.parsedOptions.reverseSortedTimelineScales[0].timelineDates[0].startDate.getTime() - timeDiff / 2), minTimeUnit, startOfWeek), 
            gantt.parsedOptions._minDateTime = null === (_b = gantt.parsedOptions.minDate) || void 0 === _b ? void 0 : _b.getTime(), 
            gantt._generateTimeLineDateMap(), gantt._updateSize(), gantt.scenegraph.refreshAll(), 
            target = this.moveTaskBar.target = gantt.scenegraph.taskBar.getTaskBarNodeByIndex(this.moveTaskBar.target.task_index, this.moveTaskBar.target.sub_task_index), 
            gantt.scrollLeft = Math.max(0, gantt.getDateColWidth(0) - 1), gantt.eventManager.lastDragPointerXYOnWindow.x = e.x, 
            "milestone" === (null === (_c = target.record) || void 0 === _c ? void 0 : _c.type) ? moveTaskBar(target, gantt.scrollLeft - target.attribute.x, 0, this) : target.setAttribute("x", gantt.scrollLeft);
        } else {
            const colCount = null !== (_e = null === (_d = gantt.parsedOptions.reverseSortedTimelineScales[0].timelineDates) || void 0 === _d ? void 0 : _d.length) && void 0 !== _e ? _e : 0, avgColWidth = gantt.getAllDateColsWidth() / Math.max(1, colCount);
            this.moveTaskBar.moveTaskBarXSpeed = -avgColWidth / 100, this.moveTaskBar.moveTaskBarXInertia.startInertia(this.moveTaskBar.moveTaskBarXSpeed, 0, 1), 
            this.moveTaskBar.moveTaskBarXInertia.setScrollHandle(((dx, dy) => {
                this.moveTaskBar.deltaX += dx, this.moveTaskBar.deltaY += dy, moveTaskBar(target, dx, dy, this), 
                gantt.stateManager.setScrollLeft(target.attribute.x), 0 === gantt.stateManager.scrollLeft && this.moveTaskBar.moveTaskBarXInertia.endInertia();
            }));
        } else if (target.attribute.x + target.attribute.width >= gantt.stateManager.scrollLeft + gantt.tableNoFrameWidth && dx > 0) if (gantt.parsedOptions.moveTaskBarToExtendDateRange && gantt.stateManager.scrollLeft + gantt.tableNoFrameWidth === gantt.getAllDateColsWidth()) {
            null === (_f = this.moveTaskBar.moveTaskBarXInertia) || void 0 === _f || _f.endInertia();
            const timelineDates = gantt.parsedOptions.reverseSortedTimelineScales[0].timelineDates, timeDiff = timelineDates[1].startDate.getTime() - timelineDates[0].startDate.getTime(), {unit: minTimeUnit, startOfWeek: startOfWeek, step: step} = gantt.parsedOptions.reverseSortedTimelineScales[0];
            if (gantt.parsedOptions.maxDate = getEndDateByTimeUnit(gantt.parsedOptions.minDate, new Date(timelineDates[timelineDates.length - 1].endDate.getTime() + timeDiff / 2), minTimeUnit, step), 
            gantt.parsedOptions._maxDateTime = null === (_g = gantt.parsedOptions.maxDate) || void 0 === _g ? void 0 : _g.getTime(), 
            gantt._generateTimeLineDateMap(), gantt._updateSize(), gantt.scenegraph.refreshAll(), 
            target = this.moveTaskBar.target = gantt.scenegraph.taskBar.getTaskBarNodeByIndex(this.moveTaskBar.target.task_index, this.moveTaskBar.target.sub_task_index), 
            gantt.scrollLeft += 1, gantt.eventManager.lastDragPointerXYOnWindow.x = e.x, "milestone" === (null === (_h = target.record) || void 0 === _h ? void 0 : _h.type)) {
                const newX = gantt.scrollLeft + gantt.tableNoFrameWidth - target.attribute.width;
                moveTaskBar(target, newX - target.attribute.x, 0, this);
            } else target.setAttribute("x", gantt.scrollLeft + gantt.tableNoFrameWidth - target.attribute.width);
        } else {
            const colCount = null !== (_k = null === (_j = gantt.parsedOptions.reverseSortedTimelineScales[0].timelineDates) || void 0 === _j ? void 0 : _j.length) && void 0 !== _k ? _k : 0, avgColWidth = gantt.getAllDateColsWidth() / Math.max(1, colCount);
            this.moveTaskBar.moveTaskBarXSpeed = avgColWidth / 100, this.moveTaskBar.moveTaskBarXInertia.startInertia(this.moveTaskBar.moveTaskBarXSpeed, 0, 1), 
            this.moveTaskBar.moveTaskBarXInertia.setScrollHandle(((dx, dy) => {
                this.moveTaskBar.deltaX += dx, this.moveTaskBar.deltaY += dy, moveTaskBar(target, dx, dy, this), 
                gantt.stateManager.setScrollLeft(target.attribute.x + target.attribute.width - gantt.tableNoFrameWidth), 
                gantt.stateManager.scrollLeft === gantt.getAllDateColsWidth() - gantt.tableNoFrameWidth && this.moveTaskBar.moveTaskBarXInertia.endInertia();
            }));
        } else this.moveTaskBar.moveTaskBarXInertia.isInertiaScrolling() ? this.moveTaskBar.moveTaskBarXInertia.endInertia() : this.moveTaskBar.moveTaskBarXSpeed = 0;
        gantt.scenegraph.updateNextFrame();
    }
    startResizeTaskBar(target, x, y, startOffsetY, onIconName) {
        this.resizeTaskBar.onIconName = onIconName, this.resizeTaskBar.resizing = !0, this.resizeTaskBar.target = target, 
        this.resizeTaskBar.targetStartX = target.attribute.x, this.resizeTaskBar.targetEndX = target.attribute.x + target.attribute.width, 
        this.resizeTaskBar.startX = x, this.resizeTaskBar.startY = y, this.resizeTaskBar.startOffsetY = startOffsetY;
    }
    isResizingTaskBar() {
        return this.resizeTaskBar.resizing;
    }
    endResizeTaskBar(x) {
        const direction = this._gantt.stateManager.resizeTaskBar.onIconName, deltaX = x - this.resizeTaskBar.startX;
        if (Math.abs(deltaX) >= 1) {
            const colIndex = getDateIndexByX(("left" === direction ? this.resizeTaskBar.target.attribute.x : this.resizeTaskBar.target.attribute.x + this.resizeTaskBar.target.attribute.width) - this._gantt.stateManager.scroll.horizontalBarPos, this._gantt), timelineDate = this._gantt.parsedOptions.reverseSortedTimelineScales[0].timelineDates[colIndex];
            if (!timelineDate) return;
            const targetDate = "left" === direction ? timelineDate.startDate : timelineDate.endDate, taskBarGroup = this.resizeTaskBar.target, clipGroupBox = taskBarGroup.clipGroupBox, rect = taskBarGroup.barRect, progressRect = taskBarGroup.progressRect, textLabel = taskBarGroup.textLabel, taskIndex = taskBarGroup.task_index, sub_task_index = taskBarGroup.sub_task_index, {taskDays: taskDays, progress: progress, startDate: oldStartDate, endDate: oldEndDate} = this._gantt.getTaskInfoByTaskListIndex(taskIndex, sub_task_index);
            let dateChanged = !1;
            if ("left" === direction ? (this._gantt._updateStartDateToTaskRecord(targetDate, taskIndex, sub_task_index), 
            targetDate.getTime() !== new Date(oldStartDate).getTime() && (dateChanged = !0)) : (this._gantt._updateEndDateToTaskRecord(targetDate, taskIndex, sub_task_index), 
            targetDate.getTime() !== new Date(oldEndDate).getTime() && (dateChanged = !0)), 
            this._gantt.parsedOptions.tasksShowMode === TasksShowMode.Sub_Tasks_Arrange || this._gantt.parsedOptions.tasksShowMode === TasksShowMode.Sub_Tasks_Compact) this._gantt.taskListTableInstance.renderWithRecreateCells(), 
            this._gantt._syncPropsFromTable(), this._gantt.scenegraph.refreshTaskBarsAndGrid(); else {
                if ("left" === direction) {
                    const newX = colIndex >= 1 ? this._gantt.getDateColsWidth(0, colIndex - 1) : 0;
                    taskBarGroup.setAttribute("x", newX), taskBarGroup.setAttribute("width", this.resizeTaskBar.targetEndX - newX);
                } else if ("right" === direction) {
                    const newEndX = this._gantt.getDateColsWidth(0, colIndex);
                    taskBarGroup.setAttribute("width", newEndX - this.resizeTaskBar.targetStartX);
                }
                if (clipGroupBox.setAttribute("width", taskBarGroup.attribute.width), null == rect || rect.setAttribute("width", taskBarGroup.attribute.width), 
                null == progressRect || progressRect.setAttribute("width", progress / 100 * taskBarGroup.attribute.width), 
                textLabel) {
                    const {textAlign: textAlign, textBaseline: textBaseline, padding: padding} = this._gantt.parsedOptions.taskBarLabelStyle, position = getTextPos(toBoxArray(padding), textAlign, textBaseline, taskBarGroup.attribute.width, taskBarGroup.attribute.height);
                    textLabel.setAttribute("maxLineWidth", taskBarGroup.attribute.width - 2 * TASKBAR_HOVER_ICON_WIDTH), 
                    textLabel.setAttribute("x", position.x);
                }
                this._gantt.scenegraph.refreshRecordLinkNodes(taskIndex, sub_task_index, taskBarGroup, 0), 
                this.showTaskBarHover(), reCreateCustomNode(this._gantt, taskBarGroup, taskIndex, sub_task_index), 
                taskBarGroup.setAttribute("zIndex", 0);
            }
            if (taskBarGroup.updateTextPosition(), this.resizeTaskBar.resizing = !1, this.resizeTaskBar.target = null, 
            dateChanged && this._gantt.hasListeners(GANTT_EVENT_TYPE.CHANGE_DATE_RANGE)) {
                const newRecord = this._gantt.getRecordByIndex(taskIndex, sub_task_index);
                this._gantt.fireListeners(GANTT_EVENT_TYPE.CHANGE_DATE_RANGE, {
                    startDate: newRecord[this._gantt.parsedOptions.startDateField],
                    endDate: newRecord[this._gantt.parsedOptions.endDateField],
                    oldStartDate: oldStartDate,
                    oldEndDate: oldEndDate,
                    index: taskIndex,
                    record: newRecord
                });
            }
            this._gantt.scenegraph.updateNextFrame();
        }
    }
    dealTaskBarResize(e) {
        const x1 = this._gantt.eventManager.lastDragPointerXYOnWindow.x, dx = e.x - x1, taskBarGroup = this._gantt.stateManager.resizeTaskBar.target;
        let diffWidth = "left" === this._gantt.stateManager.resizeTaskBar.onIconName ? -dx : dx;
        const taskBarSize = Math.max(1, taskBarGroup.attribute.width + diffWidth);
        diffWidth = taskBarSize - taskBarGroup.attribute.width, resizeTaskBar(taskBarGroup, "left" === this._gantt.stateManager.resizeTaskBar.onIconName ? -diffWidth : 0, taskBarSize, this), 
        this._gantt.scenegraph.updateNextFrame();
    }
    startAdjustProgressBar(target, x, y) {
        if (!target || !target.record) return;
        const progressField = this._gantt.parsedOptions.progressField;
        if (!progressField || void 0 === target.record[progressField] || null === target.record[progressField]) return;
        const {progress: progress} = this._gantt.getTaskInfoByTaskListIndex(target.task_index, target.sub_task_index);
        this.adjustProgressBar.target = target, this.adjustProgressBar.adjusting = !0, this.adjustProgressBar.startX = x, 
        this.adjustProgressBar.startY = y, this.adjustProgressBar.originalProgress = progress;
    }
    isAdjustingProgressBar() {
        return this.adjustProgressBar.adjusting;
    }
    endAdjustProgressBar(x) {
        const target = this.adjustProgressBar.target;
        if (!target) return;
        const taskBarWidth = target.attribute.width, deltaX = x - this.adjustProgressBar.startX, newProgress = Math.max(0, Math.min(100, this.adjustProgressBar.originalProgress + deltaX / taskBarWidth * 100));
        if (Math.abs(newProgress - this.adjustProgressBar.originalProgress) >= .1) {
            const taskIndex = target.task_index, subTaskIndex = target.sub_task_index, progressField = this._gantt.parsedOptions.progressField;
            progressField && target.record && (target.record[progressField] = Math.round(10 * newProgress) / 10), 
            this.shouldSyncProgressToTable(taskIndex, subTaskIndex) && this._gantt._updateProgressToTaskRecord(Math.round(10 * newProgress) / 10, taskIndex, subTaskIndex), 
            this._gantt.scenegraph.taskBar.updateTaskBarNode(taskIndex, subTaskIndex);
            const newRecord = this._gantt.getRecordByIndex(taskIndex, subTaskIndex);
            this._gantt.hasListeners(GANTT_EVENT_TYPE.PROGRESS_UPDATE) && this._gantt.fireListeners(GANTT_EVENT_TYPE.PROGRESS_UPDATE, {
                federatedEvent: null,
                event: null,
                index: taskIndex,
                sub_task_index: subTaskIndex,
                progress: Math.round(10 * newProgress) / 10,
                oldProgress: Math.round(10 * this.adjustProgressBar.originalProgress) / 10,
                record: newRecord
            });
        }
        this.adjustProgressBar.adjusting = !1, this.adjustProgressBar.target = null, this.adjustProgressBar.startX = null, 
        this.adjustProgressBar.startY = null, this.adjustProgressBar.originalProgress = 0;
    }
    shouldSyncProgressToTable(taskIndex, subTaskIndex) {
        const tasksShowMode = this._gantt.parsedOptions.tasksShowMode;
        if (tasksShowMode === TasksShowMode.Tasks_Separate) return !0;
        if (!isValid(subTaskIndex)) return !0;
        switch (tasksShowMode) {
          case TasksShowMode.Sub_Tasks_Inline:
          case TasksShowMode.Sub_Tasks_Arrange:
          case TasksShowMode.Sub_Tasks_Compact:
            return !1;

          case TasksShowMode.Sub_Tasks_Separate:
            return !0;

          case TasksShowMode.Project_Sub_Tasks_Inline:
            const parentRecord = this._gantt.getRecordByIndex(taskIndex);
            return !(!parentRecord || parentRecord.type !== TaskType.PROJECT) && "expand" === parentRecord.hierarchyState;

          default:
            return !1;
        }
    }
    dealAdjustProgressBar(e) {
        const target = this.adjustProgressBar.target;
        if (!target || !this.adjustProgressBar.adjusting) return;
        const taskBarWidth = target.attribute.width;
        if (!taskBarWidth || taskBarWidth <= 0) return;
        const deltaX = e.x - this.adjustProgressBar.startX, newProgress = Math.max(0, Math.min(100, this.adjustProgressBar.originalProgress + deltaX / taskBarWidth * 100));
        if (target.progressRect && target.progressRect.setAttribute("width", taskBarWidth * newProgress / 100), 
        this._gantt.scenegraph.taskBar.hoverBarProgressHandle && this._gantt.scenegraph.taskBar.hoverBarProgressHandle.attribute.visibleAll && this._gantt.scenegraph.taskBar.hoverBarProgressHandle.setAttribute("x", taskBarWidth * newProgress / 100 - 6), 
        target.textLabel && target.record && this._gantt.parsedOptions.taskBarLabelText) {
            const progressField = this._gantt.parsedOptions.progressField, tempRecord = Object.assign(Object.assign({}, target.record), {
                [progressField]: Math.round(10 * newProgress) / 10
            }), newText = parseStringTemplate(this._gantt.parsedOptions.taskBarLabelText, tempRecord);
            target.textLabel.setAttribute("text", newText);
        }
        this._gantt.scenegraph && this._gantt.scenegraph.stage && this._gantt.scenegraph.stage.renderNextFrame();
    }
    startCreateDependencyLine(target, x, y, startOffsetY, position) {
        this.resizeTaskBar.resizing = !1, this.creatingDenpendencyLink.creating = !0, this.creatingDenpendencyLink.startClickedPoint = target, 
        this.creatingDenpendencyLink.startX = x, this.creatingDenpendencyLink.startY = y, 
        this.creatingDenpendencyLink.startOffsetY = startOffsetY, this.creatingDenpendencyLink.firstTaskBarPosition = position, 
        this.highlightLinkPointNode(target);
    }
    isCreatingDependencyLine() {
        return this.creatingDenpendencyLink.creating;
    }
    endCreateDependencyLine(offsetY) {
        const taskKeyField = this._gantt.parsedOptions.taskKeyField, fromTaskIndex = this.selectedTaskBar.target.task_index, from_sub_task_id = this.selectedTaskBar.target.sub_task_index, toTaskIndex = this.creatingDenpendencyLink.secondTaskBarNode.task_index, to_sub_task_id = this.creatingDenpendencyLink.secondTaskBarNode.sub_task_index, link = {
            linkedFromTaskKey: this._gantt.getRecordByIndex(fromTaskIndex, from_sub_task_id)[taskKeyField],
            linkedToTaskKey: this._gantt.getRecordByIndex(toTaskIndex, to_sub_task_id)[taskKeyField],
            type: "left" === this.creatingDenpendencyLink.firstTaskBarPosition && "left" === this.creatingDenpendencyLink.secondTaskBarPosition ? DependencyType.StartToStart : "right" === this.creatingDenpendencyLink.firstTaskBarPosition && "left" === this.creatingDenpendencyLink.secondTaskBarPosition ? DependencyType.FinishToStart : "right" === this.creatingDenpendencyLink.firstTaskBarPosition && "right" === this.creatingDenpendencyLink.secondTaskBarPosition ? DependencyType.FinishToFinish : DependencyType.StartToFinish
        };
        return this._gantt.addLink(link), this.hideTaskBarSelectedBorder(), this._gantt.scenegraph.updateNextFrame(), 
        this.creatingDenpendencyLink.creating = !1, link;
    }
    dealCreateDependencyLine(e) {
        const x1 = this.creatingDenpendencyLink.startX, y1 = this.creatingDenpendencyLink.startY, dx = e.x - x1, dy = e.y - y1, startClickedPoint = this.creatingDenpendencyLink.startClickedPoint, x = startClickedPoint.attribute.x + startClickedPoint.attribute.width / 2, y = startClickedPoint.attribute.y + startClickedPoint.attribute.height / 2;
        this._gantt.scenegraph.taskBar.updateCreatingDependencyLine(x, y, x + dx, y + dy), 
        this._gantt.scenegraph.updateNextFrame();
    }
    startResizeTableWidth(e) {
        this.resizeTableWidth.resizing = !0, this.resizeTableWidth.lastX = e.pageX;
    }
    isResizingTableWidth() {
        return this.resizeTableWidth.resizing;
    }
    endResizeTableWidth() {
        this.resizeTableWidth.resizing = !1, this._gantt.zoomScaleManager && this._gantt.zoomScaleManager.handleTableWidthChange();
    }
    dealResizeTableWidth(e) {
        var _a, _b;
        if (!this.resizeTableWidth.resizing) return;
        const deltaX = e.pageX - this.resizeTableWidth.lastX;
        if (Math.abs(deltaX) >= 1) {
            let width = this._gantt.taskTableWidth + deltaX;
            const maxWidth = Math.min(this._gantt.taskListTableInstance.getAllColsWidth() + this._gantt.parsedOptions.outerFrameStyle.borderLineWidth, null !== (_a = this._gantt.options.taskListTable.maxTableWidth) && void 0 !== _a ? _a : 1e5), minWidth = Math.max(this._gantt.parsedOptions.outerFrameStyle.borderLineWidth, null !== (_b = this._gantt.options.taskListTable.minTableWidth) && void 0 !== _b ? _b : 0);
            deltaX > 0 && width > maxWidth && (width = maxWidth), deltaX < 0 && width < minWidth && (width = minWidth), 
            this._gantt.taskTableWidth = width, this._gantt.element.style.left = this._gantt.taskTableWidth ? `${this._gantt.taskTableWidth}px` : "0px", 
            this._gantt.verticalSplitResizeLine.style.left = this._gantt.taskTableWidth ? this._gantt.taskTableWidth - 7 + "px" : "0px", 
            this._gantt._resize(), this.resizeTableWidth.lastX = e.pageX, this._gantt.zoomScaleManager && !this.resizeTableWidth.updateTimeout && (this.resizeTableWidth.updateTimeout = setTimeout((() => {
                this._gantt.zoomScaleManager && this._gantt.zoomScaleManager.handleTableWidthChange(), 
                this.resizeTableWidth.updateTimeout = null;
            }), 50));
        }
    }
    showTaskBarHover() {
        const target = this._gantt.stateManager.hoverTaskBar.target;
        if (target) {
            const x = target.attribute.x, y = target.attribute.y, width = target.attribute.width, height = target.attribute.height;
            this._gantt.scenegraph.taskBar.showHoverBar(x, y, width, height, target), this._gantt.scenegraph.updateNextFrame();
        }
    }
    hideTaskBarHover(e) {
        this._gantt.stateManager.hoverTaskBar.target = null, this._gantt.scenegraph.taskBar.hideHoverBar(), 
        this._gantt.scenegraph.updateNextFrame();
    }
    showTaskBarSelectedBorder(target) {
        var _a;
        null === (_a = this._gantt.stateManager.selectedTaskBar.target) || void 0 === _a || _a.setAttribute("zIndex", 0), 
        this._gantt.stateManager.selectedTaskBar.target = target;
        const linkCreatable = this._gantt.parsedOptions.dependencyLinkCreatable;
        target.setAttribute("zIndex", 1e4);
        const x = target.attribute.x, y = target.attribute.y, width = target.attribute.width, height = target.attribute.height;
        this._gantt.scenegraph.taskBar.createSelectedBorder(x, y, width, height, target, linkCreatable), 
        this._gantt.scenegraph.updateNextFrame();
    }
    hideTaskBarSelectedBorder() {
        var _a;
        null === (_a = this._gantt.stateManager.selectedTaskBar.target) || void 0 === _a || _a.setAttribute("zIndex", 0), 
        this._gantt.stateManager.selectedTaskBar.target = null, this._gantt.scenegraph.taskBar.removeSelectedBorder(), 
        this._gantt.scenegraph.updateNextFrame();
    }
    showSecondTaskBarSelectedBorder() {
        const target = this._gantt.stateManager.creatingDenpendencyLink.secondTaskBarNode, x = target.attribute.x, y = target.attribute.y, width = target.attribute.width, height = target.attribute.height;
        this._gantt.scenegraph.taskBar.createSelectedBorder(x, y, width, height, target, !0), 
        this._gantt.scenegraph.updateNextFrame();
    }
    hideSecondTaskBarSelectedBorder() {
        this._gantt.stateManager.creatingDenpendencyLink.secondTaskBarNode = null, this._gantt.scenegraph.taskBar.removeSecondSelectedBorder(), 
        this._gantt.scenegraph.updateNextFrame();
    }
    showDependencyLinkSelectedLine() {
        const link = this._gantt.stateManager.selectedDenpendencyLink.link;
        this._gantt.scenegraph.dependencyLink.createSelectedLinkLine(link);
        const {taskKeyField: taskKeyField, dependencyLinks: dependencyLinks} = this._gantt.parsedOptions, {linkedToTaskKey: linkedToTaskKey, linkedFromTaskKey: linkedFromTaskKey, type: type} = link;
        let linkFrom_index, linkFrom_sub_task_index, linkTo_index, linkTo_sub_task_index;
        const linkedToTaskRecord = findRecordByTaskKey(this._gantt.records, taskKeyField, linkedToTaskKey), linkedFromTaskRecord = findRecordByTaskKey(this._gantt.records, taskKeyField, linkedFromTaskKey);
        this._gantt.parsedOptions.tasksShowMode === TasksShowMode.Sub_Tasks_Inline || this._gantt.parsedOptions.tasksShowMode === TasksShowMode.Sub_Tasks_Separate || this._gantt.parsedOptions.tasksShowMode === TasksShowMode.Sub_Tasks_Arrange || this._gantt.parsedOptions.tasksShowMode === TasksShowMode.Sub_Tasks_Compact ? (linkFrom_index = linkedFromTaskRecord.index[0], 
        linkFrom_sub_task_index = linkedFromTaskRecord.index[1], linkTo_index = linkedToTaskRecord.index[0], 
        linkTo_sub_task_index = linkedToTaskRecord.index[1]) : (linkFrom_index = this._gantt.getTaskShowIndexByRecordIndex(linkedFromTaskRecord.index), 
        linkTo_index = this._gantt.getTaskShowIndexByRecordIndex(linkedToTaskRecord.index));
        const fromTaskNode = this._gantt.scenegraph.taskBar.getTaskBarNodeByIndex(linkFrom_index, linkFrom_sub_task_index);
        this._gantt.scenegraph.taskBar.createSelectedBorder(fromTaskNode.attribute.x, fromTaskNode.attribute.y, fromTaskNode.attribute.width, fromTaskNode.attribute.height, fromTaskNode, !1);
        const toTaskNode = this._gantt.scenegraph.taskBar.getTaskBarNodeByIndex(linkTo_index, linkTo_sub_task_index);
        this._gantt.scenegraph.taskBar.createSelectedBorder(toTaskNode.attribute.x, toTaskNode.attribute.y, toTaskNode.attribute.width, toTaskNode.attribute.height, toTaskNode, !1), 
        this._gantt.scenegraph.updateNextFrame();
    }
    hideDependencyLinkSelectedLine() {
        this._gantt.stateManager.selectedDenpendencyLink.link = null, this._gantt.scenegraph.dependencyLink.removeSelectedLinkLine(), 
        this._gantt.scenegraph.taskBar.removeSelectedBorder(), this._gantt.scenegraph.updateNextFrame();
    }
    highlightLinkPointNode(linkPointGroup) {
        if ((null == linkPointGroup ? void 0 : linkPointGroup.children.length) > 0) {
            const circle = linkPointGroup.children[0];
            circle.setAttribute("fill", this._gantt.parsedOptions.dependencyLinkLineCreatingPointStyle.fillColor), 
            circle.setAttribute("stroke", this._gantt.parsedOptions.dependencyLinkLineCreatingPointStyle.strokeColor), 
            circle.setAttribute("radius", this._gantt.parsedOptions.dependencyLinkLineCreatingPointStyle.radius), 
            circle.setAttribute("lineWidth", this._gantt.parsedOptions.dependencyLinkLineCreatingPointStyle.strokeWidth), 
            this._gantt.scenegraph.updateNextFrame();
        }
    }
    unhighlightLinkPointNode(linkPointGroup) {
        if ((null == linkPointGroup ? void 0 : linkPointGroup.children.length) > 0) {
            const circle = linkPointGroup.children[0];
            circle.setAttribute("fill", this._gantt.parsedOptions.dependencyLinkLineCreatePointStyle.fillColor), 
            circle.setAttribute("stroke", this._gantt.parsedOptions.dependencyLinkLineCreatePointStyle.strokeColor), 
            circle.setAttribute("radius", this._gantt.parsedOptions.dependencyLinkLineCreatePointStyle.radius), 
            circle.setAttribute("lineWidth", this._gantt.parsedOptions.dependencyLinkLineCreatePointStyle.strokeWidth), 
            this._gantt.scenegraph.updateNextFrame();
        }
    }
    showMarklineIconHover() {
        var _a, _b;
        const target = this._gantt.stateManager.marklineIcon.target;
        if (target) {
            const marklineGroup = this._gantt.scenegraph.timelineHeader.showMarklineIcon(target.parent);
            marklineGroup && (null === (_b = null === (_a = this._gantt.parsedOptions.markLineCreateOptions) || void 0 === _a ? void 0 : _a.markLineCreationHoverToolTip) || void 0 === _b ? void 0 : _b.tipContent) && this._gantt.scenegraph.showToolTip(marklineGroup), 
            this._gantt.scenegraph.updateNextFrame();
        }
    }
    hideMarklineIconHover() {
        this._gantt.scenegraph.timelineHeader.hideMarklineIconHover(this._gantt.stateManager.marklineIcon.target.parent), 
        this._gantt.scenegraph.hideToolTip(), this._gantt.stateManager.marklineIcon.target = null, 
        this._gantt.scenegraph.updateNextFrame();
    }
    updateProjectTaskTimes(taskPath) {
        var _a, _b;
        if (!taskPath || 0 === taskPath.length || !this._gantt || !this._gantt.records) return;
        const startDateField = this._gantt.parsedOptions.startDateField, endDateField = this._gantt.parsedOptions.endDateField, pathCopy = [ ...taskPath ];
        for (;pathCopy.length > 0; ) {
            const parentPath = [ ...pathCopy ], childIndex = parentPath.pop();
            let parentRecord = this._gantt.records;
            const currentPath = [];
            for (const index of parentPath) {
                if (currentPath.push(index), !parentRecord[index] || !parentRecord[index].children) return;
                parentRecord = parentRecord[index].children;
            }
            const parent = 0 === parentPath.length ? this._gantt.records[childIndex] : parentRecord[childIndex];
            if (parent && parent.type === TaskType.PROJECT && parent.children && parent.children.length > 0) {
                let earliestStart = null, latestEnd = null;
                for (const child of parent.children) if (child[startDateField] && child[endDateField]) {
                    const childStartDate = new Date(child[startDateField]), childEndDate = new Date(child[endDateField]);
                    (!earliestStart || childStartDate < earliestStart) && (earliestStart = childStartDate), 
                    (!latestEnd || childEndDate > latestEnd) && (latestEnd = childEndDate);
                }
                if (earliestStart && latestEnd) {
                    const currentStartDate = parent[startDateField] ? new Date(parent[startDateField]) : null, currentEndDate = parent[endDateField] ? new Date(parent[endDateField]) : null;
                    if (!currentStartDate || !currentEndDate || earliestStart.getTime() !== currentStartDate.getTime() || latestEnd.getTime() !== currentEndDate.getTime()) {
                        const dateFormat = null !== (_a = this._gantt.parsedOptions.dateFormat) && void 0 !== _a ? _a : this._gantt.parseTimeFormat(parent[startDateField] || parent.children[0][startDateField]), formatDateValue = date => this._gantt.formatDate ? this._gantt.formatDate(date, dateFormat) : date.toISOString().split("T")[0];
                        parent[startDateField] = formatDateValue(earliestStart), parent[endDateField] = formatDateValue(latestEnd);
                    }
                }
            }
            pathCopy.pop();
        }
        null === (_b = this._gantt.scenegraph) || void 0 === _b || _b.refreshAll();
    }
}

function reCreateCustomNode(gantt, taskBarGroup, taskIndex, sub_task_index) {
    const taskBarCustomLayout = gantt.parsedOptions.taskBarCustomLayout;
    if (taskBarCustomLayout) {
        let customLayoutObj;
        if ("function" == typeof taskBarCustomLayout) {
            const {startDate: startDate, endDate: endDate, taskDays: taskDays, progress: progress, taskRecord: taskRecord} = gantt.getTaskInfoByTaskListIndex(taskIndex, sub_task_index);
            customLayoutObj = taskBarCustomLayout({
                width: taskBarGroup.attribute.width,
                height: taskBarGroup.attribute.height,
                index: taskIndex,
                startDate: startDate,
                endDate: endDate,
                taskDays: taskDays,
                progress: progress,
                taskRecord: taskRecord,
                ganttInstance: gantt
            });
        } else customLayoutObj = taskBarCustomLayout;
        if (customLayoutObj) {
            const rootContainer = customLayoutObj.rootContainer;
            rootContainer.name = "task-bar-custom-render";
            const barGroup = taskBarGroup.children.find((node => "task-bar-group" === node.name));
            if (barGroup) {
                const oldCustomIndex = barGroup.children.findIndex((node => "task-bar-custom-render" === node.name)), oldCustomNode = barGroup.children[oldCustomIndex];
                oldCustomNode && (barGroup.removeChild(oldCustomNode), barGroup.insertInto(rootContainer, oldCustomIndex));
            }
        }
    }
}

function moveTaskBar(target, dx, dy, state) {
    const taskIndex = target.task_index, sub_task_index = target.sub_task_index, isMilestone = target.record.type === TaskType.MILESTONE, oldX = target.attribute.x, oldY = target.attribute.y;
    if (dx && target.setAttribute("x", Math.max(0, target.attribute.x + dx)), state._gantt.parsedOptions.tasksShowMode !== TasksShowMode.Tasks_Separate && state._gantt.parsedOptions.tasksShowMode !== TasksShowMode.Project_Sub_Tasks_Inline ? dy && target.setAttribute("y", target.attribute.y + dy) : dy = 0, 
    isMilestone && (target.setAttribute("anchor", [ target.attribute.x + target.attribute.width / 2, target.attribute.y + target.attribute.height / 2 ]), 
    target.milestoneTextContainer)) {
        const deltaX = target.attribute.x - oldX, deltaY = target.attribute.y - oldY, currentX = target.milestoneTextContainer.attribute.x, currentY = target.milestoneTextContainer.attribute.y;
        target.milestoneTextContainer.setAttribute("x", currentX + deltaX), target.milestoneTextContainer.setAttribute("y", currentY + deltaY);
    }
    target.updateTextPosition(), state._gantt.scenegraph.refreshRecordLinkNodes(taskIndex, sub_task_index, target, dy);
}

function resizeTaskBar(target, dx, newWidth, state) {
    const progressField = state._gantt.parsedOptions.progressField, clipGroupBox = target.clipGroupBox, rect = target.barRect, progressRect = target.progressRect, textLabel = target.textLabel, taskIndex = target.task_index, sub_task_index = target.sub_task_index, record = target.record, progress = record[progressField], isMilestone = record.type === TaskType.MILESTONE;
    if (target.setAttribute("zIndex", 1e4), dx && target.setAttribute("x", target.attribute.x + dx), 
    isMilestone && target.setAttribute("anchor", [ target.attribute.x + target.attribute.width / 2, target.attribute.y + target.attribute.height / 2 ]), 
    newWidth && target.setAttribute("width", newWidth), clipGroupBox.setAttribute("width", target.attribute.width), 
    null == rect || rect.setAttribute("width", target.attribute.width), null == progressRect || progressRect.setAttribute("width", progress / 100 * target.attribute.width), 
    textLabel) {
        const {textAlign: textAlign, textBaseline: textBaseline, padding: padding} = state._gantt.parsedOptions.taskBarLabelStyle, position = getTextPos(toBoxArray(padding), textAlign, textBaseline, newWidth, target.attribute.height);
        textLabel.setAttribute("maxLineWidth", newWidth - 2 * TASKBAR_HOVER_ICON_WIDTH), 
        textLabel.setAttribute("x", position.x);
    }
    target.updateTextPosition(), state.showTaskBarHover(), reCreateCustomNode(state._gantt, target, taskIndex, sub_task_index), 
    state._gantt.scenegraph.refreshRecordLinkNodes(taskIndex, sub_task_index, target, 0);
}
//# sourceMappingURL=state-manager.js.map