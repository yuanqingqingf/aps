import { container, Group, vglobal, createStage } from "@visactor/vtable/es/vrender";

import { Grid } from "./grid";

import { Env } from "../env";

import { ScrollBarComponent } from "./scroll-bar";

import { bindScrollBarListener } from "../event/scroll";

import { TimelineHeader } from "./timeline-header";

import { TaskBar } from "./task-bar";

import { MarkLine } from "./mark-line";

import { FrameBorder } from "./frame-border";

import { findRecordByTaskKey, getTaskIndexsByTaskY } from "../gantt-helper";

import graphicContribution from "./graphic";

import { TaskCreationButton } from "./task-creation-button";

import { ToolTip } from "./tooltip";

import { DependencyLink, updateLinkLinePoints } from "./dependency-link";

import { DragOrderLine } from "./drag-order-line";

import { TasksShowMode, TaskType } from "../ts-types";

container.load(graphicContribution);

export class Scenegraph {
    constructor(gantt) {
        let width, height;
        this._gantt = gantt, this.tableGroupWidth = gantt.tableNoFrameWidth, this.tableGroupHeight = Math.min(gantt.tableNoFrameHeight, gantt.drawHeight), 
        "node" === Env.mode || (vglobal.setEnv("browser"), width = gantt.canvas.width, height = gantt.canvas.height), 
        this.stage = createStage({
            canvas: gantt.canvas,
            width: width,
            height: height,
            disableDirtyBounds: !1,
            background: gantt.parsedOptions.underlayBackgroundColor,
            enableLayout: !0,
            autoRender: !1,
            context: {
                appName: "vtable"
            },
            pluginList: [ "poptipForText" ]
        }), this.stage.gantt = this._gantt, this.stage.table = this._gantt, this.stage.defaultLayer.setTheme({
            group: {
                boundsPadding: 0,
                strokeBoundsBuffer: 0,
                lineJoin: "round"
            },
            text: {
                ignoreBuf: !0
            }
        }), this.initSceneGraph();
    }
    initSceneGraph() {
        this.ganttGroup = new Group({
            x: this._gantt.tableX,
            y: this._gantt.tableY,
            width: this.tableGroupWidth,
            height: this.tableGroupHeight,
            clip: !0,
            pickable: !1
        }), this.stage.defaultLayer.add(this.ganttGroup), this.ganttGroup.name = "table", 
        this.timelineHeader = new TimelineHeader(this), this.grid = new Grid(this), this.taskBar = new TaskBar(this), 
        this.dependencyLink = new DependencyLink(this), this.markLine = new MarkLine(this), this.toolTip = new ToolTip(this), 
        this.frameBorder = new FrameBorder(this), this.scrollbarComponent = new ScrollBarComponent(this._gantt), 
        this.stage.defaultLayer.addChild(this.scrollbarComponent.hScrollBar), this.stage.defaultLayer.addChild(this.scrollbarComponent.vScrollBar), 
        this.dragOrderLine = new DragOrderLine(this);
    }
    updateSceneGraph() {
        const gantt = this._gantt;
        let width, height;
        this.tableGroupWidth = gantt.tableNoFrameWidth, this.tableGroupHeight = Math.min(gantt.tableNoFrameHeight, gantt.drawHeight), 
        "node" === Env.mode || (vglobal.setEnv("browser"), width = gantt.canvas.width, height = gantt.canvas.height), 
        this.stage.resize(width, height), this.refreshAll();
    }
    afterCreateSceneGraph() {
        this.scrollbarComponent.updateScrollBar(), bindScrollBarListener(this._gantt.eventManager);
    }
    refreshAll() {
        this.tableGroupHeight = Math.min(this._gantt.tableNoFrameHeight, this._gantt.drawHeight), 
        this.tableGroupWidth = this._gantt.tableNoFrameWidth, this.ganttGroup.setAttribute("height", this.tableGroupHeight), 
        this.ganttGroup.setAttribute("width", this.tableGroupWidth), this.timelineHeader.refresh(), 
        this.grid.refresh(), this.taskBar.refresh(), this.dependencyLink.refresh(), this.markLine.refresh(), 
        this.dependencyLink.refresh(), this.frameBorder.refresh(), this.scrollbarComponent.updateScrollBar(), 
        this.updateNextFrame();
    }
    refreshTaskBars() {
        this.dependencyLink.refresh(), this.taskBar.refresh(), this.updateNextFrame();
    }
    refreshTaskBarsAndGrid() {
        this._gantt.verticalSplitResizeLine.style.height = this._gantt.drawHeight + "px", 
        this.tableGroupHeight = Math.min(this._gantt.tableNoFrameHeight, this._gantt.drawHeight), 
        this.ganttGroup.setAttribute("height", this.tableGroupHeight), this.grid.refresh(), 
        this.taskBar.refresh(), this.dependencyLink.refresh(), this.markLine.refresh(), 
        this.frameBorder.resize(), this.scrollbarComponent.updateScrollBar(), this.updateNextFrame();
    }
    updateTableSize() {
        this.tableGroupHeight = Math.min(this._gantt.tableNoFrameHeight, this._gantt.drawHeight), 
        this.tableGroupWidth = this._gantt.tableNoFrameWidth, this.ganttGroup.setAttributes({
            x: this._gantt.tableX,
            y: this._gantt.tableY,
            width: this._gantt.tableNoFrameWidth,
            height: this.tableGroupHeight
        }), this.grid.resize(), this.taskBar.resize(), this.dependencyLink.resize(), this.markLine.refresh(), 
        this.frameBorder.resize();
    }
    updateStageBackground() {
        this.stage.background = this._gantt.parsedOptions.underlayBackgroundColor, this.updateNextFrame();
    }
    renderSceneGraph() {
        this.stage.render();
    }
    updateNextFrame() {
        this.stage.renderNextFrame();
    }
    get width() {
        var _a, _b;
        return null !== (_b = null === (_a = this.ganttGroup.attribute) || void 0 === _a ? void 0 : _a.width) && void 0 !== _b ? _b : 0;
    }
    get height() {
        var _a, _b;
        return null !== (_b = null === (_a = this.ganttGroup.attribute) || void 0 === _a ? void 0 : _a.height) && void 0 !== _b ? _b : 0;
    }
    get x() {
        var _a, _b;
        return null !== (_b = null === (_a = this.ganttGroup.attribute) || void 0 === _a ? void 0 : _a.x) && void 0 !== _b ? _b : 0;
    }
    get y() {
        var _a, _b;
        return null !== (_b = null === (_a = this.ganttGroup.attribute) || void 0 === _a ? void 0 : _a.y) && void 0 !== _b ? _b : 0;
    }
    setX(x, isEnd = !1) {
        this.timelineHeader.setX(x), this.grid.setX(x), this.taskBar.setX(x), this.dependencyLink.setX(x), 
        this.markLine.setX(x), this.updateNextFrame();
    }
    setY(y, isEnd = !1) {
        this.grid.setY(y), this.taskBar.setY(y), this.dependencyLink.setY(y), this.updateNextFrame();
    }
    setPixelRatio(pixelRatio) {
        this.stage.disableDirtyBounds(), this.stage.window.setDpr(pixelRatio), this.stage.render(), 
        this.stage.enableDirtyBounds();
    }
    resize() {
        this.updateTableSize(), this.scrollbarComponent.updateScrollBar(), this.updateNextFrame();
    }
    release() {
        this.stage.release();
    }
    showTaskCreationButton(x, y, dateIndex) {
        this.taskCreationButton || (this.taskCreationButton = new TaskCreationButton(this._gantt.scenegraph));
        const createButton_max_width = this._gantt.parsedOptions.taskBarCreationMaxWidth, createButton_min_width = this._gantt.parsedOptions.taskBarCreationMinWidth, col_width = this._gantt.getDateColWidth(dateIndex), button_width = createButton_max_width ? Math.min(createButton_max_width, createButton_min_width ? Math.max(createButton_min_width, col_width) : col_width) : createButton_min_width ? Math.max(createButton_min_width, col_width) : col_width, button_x = x - (button_width - col_width) / 2;
        this.taskCreationButton.show(button_x, y, button_width, this._gantt.parsedOptions.rowHeight), 
        this.updateNextFrame();
    }
    hideTaskCreationButton() {
        this.taskCreationButton && (this.taskCreationButton.hide(), this.updateNextFrame());
    }
    showToolTip(target) {
        this.toolTip || (this.toolTip = new ToolTip(this._gantt.scenegraph)), this.toolTip.show(target);
    }
    hideToolTip() {
        this.toolTip.hide();
    }
    refreshRecordLinkNodes(taskIndex, sub_task_index, target, dy = 0) {
        const gantt = this._gantt, record = gantt.getRecordByIndex(taskIndex, sub_task_index), vtable_gantt_linkedTo = record.vtable_gantt_linkedTo, vtable_gantt_linkedFrom = record.vtable_gantt_linkedFrom;
        for (let i = 0; i < (null == vtable_gantt_linkedTo ? void 0 : vtable_gantt_linkedTo.length); i++) {
            const link = vtable_gantt_linkedTo[i], linkLineNode = link.vtable_gantt_linkLineNode, lineArrowNode = link.vtable_gantt_linkArrowNode, {linkedToTaskKey: linkedToTaskKey, linkedFromTaskKey: linkedFromTaskKey, type: type} = link, {taskKeyField: taskKeyField, minDate: minDate} = gantt.parsedOptions, linkedFromTaskRecord = findRecordByTaskKey(gantt.records, taskKeyField, linkedFromTaskKey), linkedToTaskRecord = findRecordByTaskKey(gantt.records, taskKeyField, linkedToTaskKey);
            let linkedToTaskStartDate, linkedToTaskEndDate, linkedToTaskTaskDays, linkedFromTaskStartDate, linkedFromTaskEndDate, linkedFromTaskTaskDays, linkedToTaskShowIndex, linkedFromTaskShowIndex, diffY;
            const taskBarStyle = this._gantt.getTaskBarStyle(taskIndex, sub_task_index);
            if (gantt.parsedOptions.tasksShowMode === TasksShowMode.Sub_Tasks_Inline) {
                const new_indexs = getTaskIndexsByTaskY(target.attribute.y + dy, gantt);
                linkedFromTaskShowIndex = linkedFromTaskRecord.index[0];
                linkedToTaskShowIndex = gantt.getRowsHeightByIndex(0, new_indexs.task_index - 1) / gantt.parsedOptions.rowHeight, 
                ({startDate: linkedToTaskStartDate, endDate: linkedToTaskEndDate, taskDays: linkedToTaskTaskDays} = gantt.getTaskInfoByTaskListIndex(linkedToTaskRecord.index[0], linkedToTaskRecord.index[1])), 
                ({startDate: linkedFromTaskStartDate, endDate: linkedFromTaskEndDate, taskDays: linkedFromTaskTaskDays} = gantt.getTaskInfoByTaskListIndex(linkedFromTaskRecord.index[0], linkedFromTaskRecord.index[1]));
                const taskbarHeight = taskBarStyle.width;
                diffY = target.attribute.y + taskbarHeight / 2 - (linkedToTaskShowIndex + .5) * gantt.parsedOptions.rowHeight;
            } else if (gantt.parsedOptions.tasksShowMode === TasksShowMode.Project_Sub_Tasks_Inline) {
                const fromParentRecordShowIndex = gantt.getTaskShowIndexByRecordIndex(linkedFromTaskRecord.index.slice(0, -1)), toParentRecordShowIndex = gantt.getTaskShowIndexByRecordIndex(linkedToTaskRecord.index.slice(0, -1)), fromParentRecord = gantt.getRecordByIndex(fromParentRecordShowIndex), toParentRecord = gantt.getRecordByIndex(toParentRecordShowIndex);
                linkedFromTaskShowIndex = fromParentRecord.type === TaskType.PROJECT && "expand" !== fromParentRecord.hierarchyState && !1 !== gantt.parsedOptions.projectSubTasksExpandable ? fromParentRecordShowIndex : gantt.getTaskShowIndexByRecordIndex(linkedFromTaskRecord.index), 
                linkedToTaskShowIndex = toParentRecord.type === TaskType.PROJECT && "expand" !== toParentRecord.hierarchyState && !1 !== gantt.parsedOptions.projectSubTasksExpandable ? toParentRecordShowIndex : gantt.getTaskShowIndexByRecordIndex(linkedToTaskRecord.index), 
                ({startDate: linkedToTaskStartDate, endDate: linkedToTaskEndDate, taskDays: linkedToTaskTaskDays} = gantt.getTaskInfoByTaskListIndex(linkedToTaskShowIndex, linkedToTaskRecord.index)), 
                ({startDate: linkedFromTaskStartDate, endDate: linkedFromTaskEndDate, taskDays: linkedFromTaskTaskDays} = gantt.getTaskInfoByTaskListIndex(linkedFromTaskShowIndex, linkedFromTaskRecord.index));
            } else if (gantt.parsedOptions.tasksShowMode === TasksShowMode.Sub_Tasks_Separate || gantt.parsedOptions.tasksShowMode === TasksShowMode.Sub_Tasks_Arrange || gantt.parsedOptions.tasksShowMode === TasksShowMode.Sub_Tasks_Compact) {
                const new_indexs = getTaskIndexsByTaskY(target.attribute.y + dy, gantt);
                linkedFromTaskShowIndex = gantt.getRowsHeightByIndex(0, linkedFromTaskRecord.index[0] - 1) / gantt.parsedOptions.rowHeight + (gantt.parsedOptions.tasksShowMode === TasksShowMode.Sub_Tasks_Arrange || gantt.parsedOptions.tasksShowMode === TasksShowMode.Sub_Tasks_Compact ? linkedFromTaskRecord.record.vtable_gantt_showIndex : linkedFromTaskRecord.index[1]);
                linkedToTaskShowIndex = gantt.getRowsHeightByIndex(0, new_indexs.task_index - 1) / gantt.parsedOptions.rowHeight + (gantt.parsedOptions.tasksShowMode === TasksShowMode.Sub_Tasks_Arrange || gantt.parsedOptions.tasksShowMode === TasksShowMode.Sub_Tasks_Compact ? linkedToTaskRecord.record.vtable_gantt_showIndex : new_indexs.sub_task_index), 
                ({startDate: linkedToTaskStartDate, endDate: linkedToTaskEndDate, taskDays: linkedToTaskTaskDays} = gantt.getTaskInfoByTaskListIndex(linkedToTaskRecord.index[0], linkedToTaskRecord.index[1])), 
                ({startDate: linkedFromTaskStartDate, endDate: linkedFromTaskEndDate, taskDays: linkedFromTaskTaskDays} = gantt.getTaskInfoByTaskListIndex(linkedFromTaskRecord.index[0], linkedFromTaskRecord.index[1]));
                const taskbarHeight = taskBarStyle.width;
                diffY = target.attribute.y + taskbarHeight / 2 - (linkedToTaskShowIndex + .5) * gantt.parsedOptions.rowHeight;
            } else {
                if (linkedFromTaskShowIndex = gantt.getTaskShowIndexByRecordIndex(linkedFromTaskRecord.index), 
                linkedToTaskShowIndex = gantt.getTaskShowIndexByRecordIndex(linkedToTaskRecord.index), 
                -1 === linkedFromTaskShowIndex || -1 === linkedToTaskShowIndex) continue;
                ({startDate: linkedToTaskStartDate, endDate: linkedToTaskEndDate, taskDays: linkedToTaskTaskDays} = gantt.getTaskInfoByTaskListIndex(linkedToTaskShowIndex)), 
                ({startDate: linkedFromTaskStartDate, endDate: linkedFromTaskEndDate, taskDays: linkedFromTaskTaskDays} = gantt.getTaskInfoByTaskListIndex(linkedFromTaskShowIndex));
            }
            if (!(linkedFromTaskStartDate && linkedFromTaskEndDate && linkedToTaskStartDate && linkedToTaskEndDate && linkLineNode && lineArrowNode)) return;
            const {linePoints: linePoints, arrowPoints: arrowPoints} = updateLinkLinePoints(type, linkedFromTaskStartDate, linkedFromTaskEndDate, linkedFromTaskShowIndex, linkedFromTaskTaskDays, linkedFromTaskRecord.record.type === TaskType.MILESTONE, null, 0, linkedToTaskStartDate, linkedToTaskEndDate, linkedToTaskShowIndex, linkedToTaskTaskDays, linkedToTaskRecord.record.type === TaskType.MILESTONE, target, null != diffY ? diffY : 0, this._gantt);
            linkLineNode.setAttribute("points", linePoints), lineArrowNode.setAttribute("points", arrowPoints);
        }
        for (let i = 0; i < (null == vtable_gantt_linkedFrom ? void 0 : vtable_gantt_linkedFrom.length); i++) {
            const link = vtable_gantt_linkedFrom[i], linkLineNode = link.vtable_gantt_linkLineNode, lineArrowNode = link.vtable_gantt_linkArrowNode, {linkedToTaskKey: linkedToTaskKey, linkedFromTaskKey: linkedFromTaskKey, type: type} = link, {taskKeyField: taskKeyField, minDate: minDate} = gantt.parsedOptions, linkedToTaskRecord = findRecordByTaskKey(gantt.records, taskKeyField, linkedToTaskKey), linkedFromTaskRecord = findRecordByTaskKey(gantt.records, taskKeyField, linkedFromTaskKey);
            let linkedToTaskStartDate, linkedToTaskEndDate, linkedToTaskTaskDays, linkedFromTaskStartDate, linkedFromTaskEndDate, linkedFromTaskTaskDays, linkedToTaskShowIndex, linkedFromTaskShowIndex, diffY;
            const taskBarStyle = this._gantt.getTaskBarStyle(taskIndex, sub_task_index);
            if (gantt.parsedOptions.tasksShowMode === TasksShowMode.Sub_Tasks_Inline) {
                const new_indexs = getTaskIndexsByTaskY(target.attribute.y + dy, gantt);
                linkedFromTaskShowIndex = gantt.getRowsHeightByIndex(0, new_indexs.task_index - 1) / gantt.parsedOptions.rowHeight, 
                linkedToTaskShowIndex = linkedToTaskRecord.index[0], ({startDate: linkedToTaskStartDate, endDate: linkedToTaskEndDate, taskDays: linkedToTaskTaskDays} = gantt.getTaskInfoByTaskListIndex(linkedToTaskRecord.index[0], linkedToTaskRecord.index[1])), 
                ({startDate: linkedFromTaskStartDate, endDate: linkedFromTaskEndDate, taskDays: linkedFromTaskTaskDays} = gantt.getTaskInfoByTaskListIndex(linkedFromTaskRecord.index[0], linkedFromTaskRecord.index[1]));
                const taskbarHeight = taskBarStyle.width;
                diffY = target.attribute.y + taskbarHeight / 2 - (linkedFromTaskShowIndex + .5) * gantt.parsedOptions.rowHeight;
            } else if (gantt.parsedOptions.tasksShowMode === TasksShowMode.Project_Sub_Tasks_Inline) {
                const fromParentRecordShowIndex = gantt.getTaskShowIndexByRecordIndex(linkedFromTaskRecord.index.slice(0, -1)), toParentRecordShowIndex = gantt.getTaskShowIndexByRecordIndex(linkedToTaskRecord.index.slice(0, -1)), fromParentRecord = gantt.getRecordByIndex(fromParentRecordShowIndex), toParentRecord = gantt.getRecordByIndex(toParentRecordShowIndex);
                linkedFromTaskShowIndex = fromParentRecord.type === TaskType.PROJECT && "expand" !== fromParentRecord.hierarchyState && !1 !== gantt.parsedOptions.projectSubTasksExpandable ? fromParentRecordShowIndex : gantt.getTaskShowIndexByRecordIndex(linkedFromTaskRecord.index), 
                linkedToTaskShowIndex = toParentRecord.type === TaskType.PROJECT && "expand" !== toParentRecord.hierarchyState && !1 !== gantt.parsedOptions.projectSubTasksExpandable ? toParentRecordShowIndex : gantt.getTaskShowIndexByRecordIndex(linkedToTaskRecord.index), 
                ({startDate: linkedToTaskStartDate, endDate: linkedToTaskEndDate, taskDays: linkedToTaskTaskDays} = gantt.getTaskInfoByTaskListIndex(linkedToTaskShowIndex, linkedToTaskRecord.index)), 
                ({startDate: linkedFromTaskStartDate, endDate: linkedFromTaskEndDate, taskDays: linkedFromTaskTaskDays} = gantt.getTaskInfoByTaskListIndex(linkedFromTaskShowIndex, linkedFromTaskRecord.index));
            } else if (gantt.parsedOptions.tasksShowMode === TasksShowMode.Sub_Tasks_Separate || gantt.parsedOptions.tasksShowMode === TasksShowMode.Sub_Tasks_Arrange || gantt.parsedOptions.tasksShowMode === TasksShowMode.Sub_Tasks_Compact) {
                const new_indexs = getTaskIndexsByTaskY(target.attribute.y + dy, gantt);
                linkedFromTaskShowIndex = gantt.getRowsHeightByIndex(0, new_indexs.task_index - 1) / gantt.parsedOptions.rowHeight + (gantt.parsedOptions.tasksShowMode === TasksShowMode.Sub_Tasks_Arrange || gantt.parsedOptions.tasksShowMode === TasksShowMode.Sub_Tasks_Compact ? linkedFromTaskRecord.record.vtable_gantt_showIndex : new_indexs.sub_task_index);
                linkedToTaskShowIndex = gantt.getRowsHeightByIndex(0, linkedToTaskRecord.index[0] - 1) / gantt.parsedOptions.rowHeight + (gantt.parsedOptions.tasksShowMode === TasksShowMode.Sub_Tasks_Arrange || gantt.parsedOptions.tasksShowMode === TasksShowMode.Sub_Tasks_Compact ? linkedToTaskRecord.record.vtable_gantt_showIndex : linkedToTaskRecord.index[1]), 
                ({startDate: linkedToTaskStartDate, endDate: linkedToTaskEndDate, taskDays: linkedToTaskTaskDays} = gantt.getTaskInfoByTaskListIndex(linkedToTaskRecord.index[0], linkedToTaskRecord.index[1])), 
                ({startDate: linkedFromTaskStartDate, endDate: linkedFromTaskEndDate, taskDays: linkedFromTaskTaskDays} = gantt.getTaskInfoByTaskListIndex(linkedFromTaskRecord.index[0], linkedFromTaskRecord.index[1]));
                const taskbarHeight = taskBarStyle.width;
                diffY = target.attribute.y + taskbarHeight / 2 - (linkedFromTaskShowIndex + .5) * gantt.parsedOptions.rowHeight;
            } else {
                if (linkedFromTaskShowIndex = gantt.getTaskShowIndexByRecordIndex(linkedFromTaskRecord.index), 
                linkedToTaskShowIndex = gantt.getTaskShowIndexByRecordIndex(linkedToTaskRecord.index), 
                -1 === linkedFromTaskShowIndex || -1 === linkedToTaskShowIndex) continue;
                ({startDate: linkedToTaskStartDate, endDate: linkedToTaskEndDate, taskDays: linkedToTaskTaskDays} = gantt.getTaskInfoByTaskListIndex(linkedToTaskShowIndex)), 
                ({startDate: linkedFromTaskStartDate, endDate: linkedFromTaskEndDate, taskDays: linkedFromTaskTaskDays} = gantt.getTaskInfoByTaskListIndex(linkedFromTaskShowIndex));
            }
            if (!(linkedFromTaskStartDate && linkedFromTaskEndDate && linkedToTaskStartDate && linkedToTaskEndDate && linkLineNode && lineArrowNode)) return;
            const {linePoints: linePoints, arrowPoints: arrowPoints} = updateLinkLinePoints(type, linkedFromTaskStartDate, linkedFromTaskEndDate, linkedFromTaskShowIndex, linkedFromTaskTaskDays, linkedFromTaskRecord.record.type === TaskType.MILESTONE, target, null != diffY ? diffY : 0, linkedToTaskStartDate, linkedToTaskEndDate, linkedToTaskShowIndex, linkedToTaskTaskDays, linkedToTaskRecord.record.type === TaskType.MILESTONE, null, 0, this._gantt);
            linkLineNode.setAttribute("points", linePoints), lineArrowNode.setAttribute("points", arrowPoints);
        }
    }
}
//# sourceMappingURL=scenegraph.js.map