import { updateSplitLineAndResizeLine } from "../gantt-helper";

import { TasksShowMode, TaskType } from "../ts-types";

export function syncScrollStateToTable(gantt) {
    const {scroll: scroll} = gantt.stateManager, {verticalBarPos: verticalBarPos} = scroll;
    gantt.taskListTableInstance.stateManager.setScrollTop(verticalBarPos, void 0, !1);
}

export function syncScrollStateFromTable(gantt) {
    var _a;
    gantt.taskListTableInstance && (null === (_a = gantt.taskListTableInstance) || void 0 === _a || _a.on("scroll", (args => {
        if ("vertical" === args.scrollDirection) {
            const {scroll: scroll} = gantt.taskListTableInstance.stateManager, {verticalBarPos: verticalBarPos} = scroll;
            gantt.stateManager.scroll.verticalBarPos !== verticalBarPos && gantt.stateManager.setScrollTop(verticalBarPos, !1);
        }
    })));
}

export function syncEditCellFromTable(gantt) {
    var _a;
    null === (_a = gantt.taskListTableInstance) || void 0 === _a || _a.on("change_cell_value", (args => {
        const {col: col, row: row} = args;
        gantt.taskListTableInstance.isHeader(col, row) || gantt._refreshTaskBar(row - gantt.taskListTableInstance.columnHeaderLevelCount);
    }));
}

export function syncTreeChangeFromTable(gantt) {
    var _a;
    null === (_a = gantt.taskListTableInstance) || void 0 === _a || _a.on("tree_hierarchy_state_change", (args => {
        var _a, _b;
        const {row: row, hierarchyState: hierarchyState} = args;
        if (gantt.parsedOptions.tasksShowMode === TasksShowMode.Project_Sub_Tasks_Inline) {
            const recordIndex = row - gantt.taskListTableInstance.columnHeaderLevelCount, record = gantt.getRecordByIndex(recordIndex);
            record && record.type === TaskType.PROJECT && (null === (_a = record.children) || void 0 === _a ? void 0 : _a.length) > 0 && (record.hierarchyState = hierarchyState);
        }
        gantt._syncPropsFromTable(), gantt.scenegraph.refreshTaskBarsAndGrid(), !gantt.taskListTableInstance.checkHasColumnAutoWidth() || "auto" !== (null === (_b = gantt.options.taskListTable) || void 0 === _b ? void 0 : _b.tableWidth) && -1 !== gantt.taskTableWidth || _syncTableSize(gantt);
        const left = gantt.stateManager.scroll.horizontalBarPos, top = gantt.stateManager.scroll.verticalBarPos;
        gantt.scenegraph.setX(-left), gantt.scenegraph.setY(-top);
    }));
}

export function syncSortFromTable(gantt) {
    var _a;
    null === (_a = gantt.taskListTableInstance) || void 0 === _a || _a.on("after_sort", (args => {
        gantt.scenegraph.refreshTaskBars();
        const left = gantt.stateManager.scroll.horizontalBarPos, top = gantt.stateManager.scroll.verticalBarPos;
        gantt.scenegraph.setX(-left), gantt.scenegraph.setY(-top);
    }));
}

export function syncDragOrderFromTable(gantt) {
    var _a, _b, _c, _d;
    null === (_a = gantt.taskListTableInstance) || void 0 === _a || _a.on("change_header_position", (args => {
        gantt.parsedOptions.tasksShowMode === TasksShowMode.Sub_Tasks_Arrange || gantt.parsedOptions.tasksShowMode === TasksShowMode.Sub_Tasks_Compact || gantt.parsedOptions.tasksShowMode === TasksShowMode.Sub_Tasks_Separate || gantt.parsedOptions.tasksShowMode === TasksShowMode.Project_Sub_Tasks_Inline ? gantt.scenegraph.refreshTaskBarsAndGrid() : gantt.scenegraph.refreshTaskBars(), 
        gantt.scenegraph.dragOrderLine.hideDragLine();
        const left = gantt.stateManager.scroll.horizontalBarPos, top = gantt.stateManager.scroll.verticalBarPos;
        gantt.scenegraph.setX(-left), gantt.scenegraph.setY(-top);
    })), null === (_b = gantt.taskListTableInstance) || void 0 === _b || _b.on("change_header_position_start", (args => {
        const {col: col, row: row, x: x, y: y, backX: backX, lineX: lineX, backY: backY, lineY: lineY, event: event} = args;
        gantt.scenegraph.dragOrderLine.showDragLine(lineY), gantt.scenegraph.updateNextFrame();
    })), null === (_c = gantt.taskListTableInstance) || void 0 === _c || _c.on("changing_header_position", (args => {
        const {col: col, row: row, x: x, y: y, backX: backX, lineX: lineX, backY: backY, lineY: lineY, event: event} = args;
        gantt.scenegraph.dragOrderLine.showDragLine(lineY), gantt.scenegraph.updateNextFrame();
    })), null === (_d = gantt.taskListTableInstance) || void 0 === _d || _d.on("change_header_position_fail", (args => {
        gantt.scenegraph.dragOrderLine.hideDragLine(), gantt.scenegraph.updateNextFrame();
    }));
}

export function syncTableWidthFromTable(gantt) {
    var _a;
    null === (_a = gantt.taskListTableInstance) || void 0 === _a || _a.on("resize_column", (args => {
        _syncTableSize(gantt);
    }));
}

function _syncTableSize(gantt) {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    const oldTaskTableWidth = gantt.taskTableWidth;
    gantt.taskTableWidth = gantt.taskListTableInstance.getAllColsWidth() + gantt.parsedOptions.outerFrameStyle.borderLineWidth, 
    (null === (_b = null === (_a = gantt.options) || void 0 === _a ? void 0 : _a.taskListTable) || void 0 === _b ? void 0 : _b.maxTableWidth) && (gantt.taskTableWidth = Math.min(null === (_d = null === (_c = gantt.options) || void 0 === _c ? void 0 : _c.taskListTable) || void 0 === _d ? void 0 : _d.maxTableWidth, gantt.taskTableWidth)), 
    (null === (_f = null === (_e = gantt.options) || void 0 === _e ? void 0 : _e.taskListTable) || void 0 === _f ? void 0 : _f.minTableWidth) && (gantt.taskTableWidth = Math.max(null === (_h = null === (_g = gantt.options) || void 0 === _g ? void 0 : _g.taskListTable) || void 0 === _h ? void 0 : _h.minTableWidth, gantt.taskTableWidth)), 
    oldTaskTableWidth !== gantt.taskTableWidth && (gantt.element.style.left = gantt.taskTableWidth ? `${gantt.taskTableWidth}px` : "0px", 
    gantt.taskListTableInstance.setCanvasSize(gantt.taskTableWidth, gantt.tableNoFrameHeight + 2 * gantt.parsedOptions.outerFrameStyle.borderLineWidth), 
    gantt._updateSize(), updateSplitLineAndResizeLine(gantt), gantt.zoomScaleManager && gantt.zoomScaleManager.handleTableWidthChange());
}