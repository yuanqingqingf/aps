import { Scenegraph } from "./scenegraph/scenegraph";

import { Env } from "./env";

import { TasksShowMode, TaskType, GANTT_EVENT_TYPE } from "./ts-types";

import { themes, ListTable } from "@visactor/vtable";

import { EventManager } from "./event/event-manager";

import { StateManager } from "./state/state-manager";

import { computeRowsCountByRecordDate, computeRowsCountByRecordDateForCompact, convertProgress, createSplitLineAndResizeLine, generateTimeLineDate, getHorizontalScrollBarSize, getVerticalScrollBarSize, initOptions, initProjectTaskTimes, updateOptionsWhenDateRangeChanged, updateOptionsWhenMarkLineChanged, updateOptionsWhenRecordChanged, updateOptionsWhenScaleChanged, updateSplitLineAndResizeLine } from "./gantt-helper";

import { EventTarget } from "./event/EventTarget";

import { createDateAtLastHour, createDateAtLastMillisecond, createDateAtMidnight, formatDate, isPropertyWritable, parseDateFormat } from "./tools/util";

import { DataSource } from "./data/DataSource";

import { isValid } from "@visactor/vutils";

import { PluginManager } from "./plugins/plugin-manager";

import { toBoxArray } from "@visactor/vtable";

import { ZoomScaleManager } from "./zoom-scale";

export function createRootElement(padding, className = "vtable-gantt") {
    var _a, _b;
    const element = document.createElement("div");
    element.setAttribute("tabindex", "0"), element.classList.add(className), element.style.outline = "none", 
    element.style.margin = `${padding.top}px ${padding.right}px ${padding.bottom}px ${padding.left}px`;
    const width = (element.offsetWidth || (null === (_a = element.parentElement) || void 0 === _a ? void 0 : _a.offsetWidth) || 1) - 1, height = (element.offsetHeight || (null === (_b = element.parentElement) || void 0 === _b ? void 0 : _b.offsetHeight) || 1) - 1;
    return element.style.width = width && width - padding.left - padding.right + "px" || "0px", 
    element.style.height = height && height - padding.top - padding.bottom + "px" || "0px", 
    element;
}

export class Gantt extends EventTarget {
    recalculateTimeScale() {
        this.zoomScaleManager && this.zoomScaleManager.recalculateTimeScale();
    }
    zoomByFactor(factor, keepCenter = !0, centerX) {
        this.zoomScaleManager && this.zoomScaleManager.zoomByFactor(factor, keepCenter, centerX);
    }
    constructor(container, options) {
        var _a, _b, _c, _d, _e, _f;
        super(), this.parsedOptions = {}, this._timelineColWidths = [], this._timelineColX = [], 
        this._timelineColStartTimes = [], this._timelineColEndTimes = [], this.container = container, 
        this.options = options, this.taskTableWidth = "number" == typeof (null === (_a = null == options ? void 0 : options.taskListTable) || void 0 === _a ? void 0 : _a.tableWidth) ? null === (_b = null == options ? void 0 : options.taskListTable) || void 0 === _b ? void 0 : _b.tableWidth : -1, 
        this.taskTableColumns = null !== (_d = null === (_c = null == options ? void 0 : options.taskListTable) || void 0 === _c ? void 0 : _c.columns) && void 0 !== _d ? _d : [], 
        this.records = null !== (_e = null == options ? void 0 : options.records) && void 0 !== _e ? _e : [], 
        (null === (_f = options.timelineHeader) || void 0 === _f ? void 0 : _f.zoomScale) && !1 !== options.timelineHeader.zoomScale.enabled && (this.zoomScaleManager = new ZoomScaleManager(this, options.timelineHeader.zoomScale)), 
        this._sortScales(), initOptions(this), this.zoomScaleManager ? this.millisecondsPerPixel = this.zoomScaleManager.getInitialMillisecondsPerPixel() : this.millisecondsPerPixel = 144e4, 
        initProjectTaskTimes(this), this.data = new DataSource(this), this._generateTimeLineDateMap(), 
        this.timeLineHeaderLevel = this.parsedOptions.sortedTimelineScales.length, this.element = createRootElement({
            top: 0,
            right: 0,
            left: 0,
            bottom: 0
        }, "vtable-gantt"), this.element.style.left = -1 !== this.taskTableWidth ? `${this.taskTableWidth}px` : "0px", 
        this.canvas = document.createElement("canvas"), this.element.appendChild(this.canvas), 
        this.context = this.canvas.getContext("2d"), container ? (container.appendChild(this.element), 
        this._updateSize()) : this._updateSize(), this._generateListTable(), this._syncPropsFromTable(), 
        createSplitLineAndResizeLine(this), this.scenegraph = new Scenegraph(this), this.stateManager = new StateManager(this), 
        this.eventManager = new EventManager(this), this.scenegraph.afterCreateSceneGraph(), 
        this._scrollToMarkLine(), this.pluginManager = new PluginManager(this, options), 
        this.recalculateTimeScale();
    }
    renderTaskBarsTable() {
        this.scenegraph.updateNextFrame();
    }
    _updateSize() {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j;
        let widthP = 0, heightP = 0;
        if ("browser" === Env.mode) {
            const element = this.getElement();
            let widthWithoutPadding = 0, heightWithoutPadding = 0;
            if (element.parentElement) {
                const computedStyle = element.parentElement.style || window.getComputedStyle(element.parentElement);
                widthWithoutPadding = element.parentElement.offsetWidth - parseInt(computedStyle.paddingLeft || "0px", 10) - parseInt(computedStyle.paddingRight || "0px", 10), 
                heightWithoutPadding = element.parentElement.offsetHeight - parseInt(computedStyle.paddingTop || "0px", 10) - parseInt(computedStyle.paddingBottom || "0px", 20);
            }
            const width1 = (null != widthWithoutPadding ? widthWithoutPadding : 1) - 1 - this.taskTableWidth, height1 = (null != heightWithoutPadding ? heightWithoutPadding : 1) - 1 - this.getDataZoomHeight();
            element.style.width = width1 && `${width1}px` || "0px", element.style.height = height1 && `${height1}px` || "0px";
            const {canvas: canvas} = this;
            widthP = null !== (_b = null === (_a = canvas.parentElement) || void 0 === _a ? void 0 : _a.offsetWidth) && void 0 !== _b ? _b : 1, 
            heightP = null !== (_d = null === (_c = canvas.parentElement) || void 0 === _c ? void 0 : _c.offsetHeight) && void 0 !== _d ? _d : 1, 
            (null === (_e = null == this ? void 0 : this.scenegraph) || void 0 === _e ? void 0 : _e.stage) ? this.scenegraph.stage.resize(widthP, heightP) : (canvas.style.width = "", 
            canvas.style.height = "", canvas.width = widthP, canvas.height = heightP, canvas.style.width = `${widthP}px`, 
            canvas.style.height = `${heightP}px`);
        } else Env.mode;
        const width = Math.floor(widthP - getVerticalScrollBarSize(this.parsedOptions.scrollStyle)), height = Math.floor(heightP - getHorizontalScrollBarSize(this.parsedOptions.scrollStyle));
        if (this.tableNoFrameWidth = widthP, this.tableNoFrameHeight = Math.floor(heightP), 
        this.parsedOptions.outerFrameStyle) {
            const [top, right, bottom, left] = toBoxArray(null !== (_g = null === (_f = this.parsedOptions.outerFrameStyle) || void 0 === _f ? void 0 : _f.borderLineWidth) && void 0 !== _g ? _g : 0);
            this.tableX = this.taskTableColumns.length >= 1 || (null === (_h = this.options) || void 0 === _h ? void 0 : _h.rowSeriesNumber) ? null !== (_j = this.parsedOptions.verticalSplitLine.lineWidth) && void 0 !== _j ? _j : 0 : left, 
            this.tableY = top, this.tableNoFrameWidth = Math.min(width - right - this.tableX, this.getAllDateColsWidth()), 
            this.tableNoFrameHeight = height - top - bottom;
        }
    }
    _updateListTableSize(taskListTableInstance) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
        if (taskListTableInstance) {
            if ("auto" === (null === (_b = null === (_a = this.options) || void 0 === _a ? void 0 : _a.taskListTable) || void 0 === _b ? void 0 : _b.tableWidth) || -1 === this.taskTableWidth) {
                const [top, right, bottom, left] = toBoxArray(null !== (_d = null === (_c = this.parsedOptions.outerFrameStyle) || void 0 === _c ? void 0 : _c.borderLineWidth) && void 0 !== _d ? _d : 0);
                this.taskTableWidth = taskListTableInstance.getAllColsWidth() + right, (null === (_f = null === (_e = this.options) || void 0 === _e ? void 0 : _e.taskListTable) || void 0 === _f ? void 0 : _f.maxTableWidth) && (this.taskTableWidth = Math.min(null === (_h = null === (_g = this.options) || void 0 === _g ? void 0 : _g.taskListTable) || void 0 === _h ? void 0 : _h.maxTableWidth, this.taskTableWidth)), 
                (null === (_k = null === (_j = this.options) || void 0 === _j ? void 0 : _j.taskListTable) || void 0 === _k ? void 0 : _k.minTableWidth) && (this.taskTableWidth = Math.max(null === (_m = null === (_l = this.options) || void 0 === _l ? void 0 : _l.taskListTable) || void 0 === _m ? void 0 : _m.minTableWidth, this.taskTableWidth)), 
                this.element.style.left = -1 !== this.taskTableWidth ? `${this.taskTableWidth}px` : "0px", 
                taskListTableInstance.setCanvasSize(this.taskTableWidth, this.tableNoFrameHeight + top + bottom), 
                this._updateSize();
            }
            if (taskListTableInstance.columnHeaderLevelCount > 1) if (taskListTableInstance.columnHeaderLevelCount === this.parsedOptions.timeLineHeaderRowHeights.length) for (let i = 0; i < taskListTableInstance.columnHeaderLevelCount; i++) taskListTableInstance.setRowHeight(i, this.parsedOptions.timeLineHeaderRowHeights[i]); else {
                const newRowHeight = this.getAllHeaderRowsHeight() / taskListTableInstance.columnHeaderLevelCount;
                for (let i = 0; i < taskListTableInstance.columnHeaderLevelCount; i++) taskListTableInstance.setRowHeight(i, newRowHeight);
            }
        }
    }
    _generateListTable() {
        var _a;
        if (this.taskTableColumns.length >= 1 || (null === (_a = this.options) || void 0 === _a ? void 0 : _a.rowSeriesNumber)) {
            const listTableOption = this._generateListTableOptions();
            this.taskListTableInstance = new ListTable(this.container, listTableOption), this._updateListTableSize(this.taskListTableInstance);
        }
    }
    _generateListTableOptions() {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7, _8, _9, _10, _11, _12, _13, _14, _15, _16, _17, _18, _19, _20, _21, _22, _23, _24, _25, _26, _27, _28, _29;
        const listTable_options = {}, needPutInListTableKeys = [ "container", "records", "rowSeriesNumber", "overscrollBehavior", "pixelRatio", "eventOptions" ];
        for (const key of needPutInListTableKeys) key in this.options && (listTable_options[key] = this.options[key]);
        if (listTable_options.defaultRowHeight = this.options.rowHeight, this.options.taskListTable) for (const key in this.options.taskListTable) {
            if (listTable_options[key] = this.options.taskListTable[key], "columns" === key && (listTable_options[key][listTable_options[key].length - 1].disableColumnResize = !0, 
            this.parsedOptions.tasksShowMode === TasksShowMode.Sub_Tasks_Inline || this.parsedOptions.tasksShowMode === TasksShowMode.Sub_Tasks_Separate || this.parsedOptions.tasksShowMode === TasksShowMode.Sub_Tasks_Arrange || this.parsedOptions.tasksShowMode === TasksShowMode.Sub_Tasks_Compact)) for (let i = 0; i < listTable_options.columns.length; i++) listTable_options.columns[i].tree && (listTable_options.columns[i].tree = !1);
            "hierarchyExpandLevel" !== key || this.parsedOptions.tasksShowMode !== TasksShowMode.Sub_Tasks_Inline && this.parsedOptions.tasksShowMode !== TasksShowMode.Sub_Tasks_Separate && this.parsedOptions.tasksShowMode !== TasksShowMode.Sub_Tasks_Arrange && this.parsedOptions.tasksShowMode !== TasksShowMode.Sub_Tasks_Compact || delete listTable_options[key];
        }
        if (null === (_a = this.options.taskListTable) || void 0 === _a ? void 0 : _a.theme) if (listTable_options.theme = null === (_b = this.options.taskListTable) || void 0 === _b ? void 0 : _b.theme, 
        listTable_options.theme.bodyStyle && !isPropertyWritable(listTable_options.theme, "bodyStyle")) {
            listTable_options.theme = (null === (_c = this.options.taskListTable) || void 0 === _c ? void 0 : _c.theme).extends((null === (_d = this.options.taskListTable) || void 0 === _d ? void 0 : _d.theme).getExtendTheme());
            const extendThemeOption = listTable_options.theme.getExtendTheme();
            listTable_options.theme.clearBodyStyleCache(), (null === (_e = listTable_options.theme.headerStyle) || void 0 === _e ? void 0 : _e.bgColor) || (extendThemeOption.headerStyle ? extendThemeOption.headerStyle.bgColor || (extendThemeOption.headerStyle.bgColor = this.parsedOptions.timelineHeaderBackgroundColor) : extendThemeOption.headerStyle = {
                bgColor: this.parsedOptions.timelineHeaderBackgroundColor
            }), extendThemeOption.bodyStyle ? extendThemeOption.bodyStyle.frameStyle = {
                borderLineWidth: [ null !== (_g = null === (_f = this.parsedOptions.horizontalSplitLine) || void 0 === _f ? void 0 : _f.lineWidth) && void 0 !== _g ? _g : 0, 0, 0, 0 ],
                borderColor: null === (_h = this.parsedOptions.horizontalSplitLine) || void 0 === _h ? void 0 : _h.lineColor
            } : extendThemeOption.bodyStyle = {
                frameStyle: {
                    borderLineWidth: [ null !== (_k = null === (_j = this.parsedOptions.horizontalSplitLine) || void 0 === _j ? void 0 : _j.lineWidth) && void 0 !== _k ? _k : 0, 0, 0, 0 ],
                    borderColor: null === (_l = this.parsedOptions.horizontalSplitLine) || void 0 === _l ? void 0 : _l.lineColor
                }
            }, extendThemeOption.cellInnerBorder = !1;
            const [top, right, bottom, left] = toBoxArray(null !== (_o = null === (_m = this.parsedOptions.outerFrameStyle) || void 0 === _m ? void 0 : _m.borderLineWidth) && void 0 !== _o ? _o : 0);
            extendThemeOption.frameStyle = Object.assign({}, this.parsedOptions.outerFrameStyle, {
                shadowBlur: 0,
                cornerRadius: [ null !== (_q = null === (_p = this.parsedOptions.outerFrameStyle) || void 0 === _p ? void 0 : _p.cornerRadius) && void 0 !== _q ? _q : 0, 0, 0, null !== (_s = null === (_r = this.parsedOptions.outerFrameStyle) || void 0 === _r ? void 0 : _r.cornerRadius) && void 0 !== _s ? _s : 0 ],
                borderLineWidth: [ top, 0, bottom, left ]
            }), extendThemeOption.scrollStyle = Object.assign({}, null === (_u = null === (_t = this.options.taskListTable) || void 0 === _t ? void 0 : _t.theme) || void 0 === _u ? void 0 : _u.scrollStyle, this.parsedOptions.scrollStyle, {
                verticalVisible: "none"
            }), extendThemeOption.columnResize = Object.assign({
                labelColor: "rgba(0,0,0,0)",
                labelBackgroundFill: "rgba(0,0,0,0)"
            }, null == extendThemeOption ? void 0 : extendThemeOption.columnResize), extendThemeOption.underlayBackgroundColor || (extendThemeOption.underlayBackgroundColor = this.parsedOptions.underlayBackgroundColor);
        } else {
            listTable_options.theme.headerStyle ? listTable_options.theme.headerStyle.bgColor || (listTable_options.theme.headerStyle.bgColor = this.parsedOptions.timelineHeaderBackgroundColor) : listTable_options.theme.headerStyle = {
                bgColor: this.parsedOptions.timelineHeaderBackgroundColor
            }, listTable_options.theme.headerStyle = Object.assign({}, themes.DEFAULT.headerStyle, {
                bgColor: this.parsedOptions.timelineHeaderBackgroundColor
            }, null === (_w = null === (_v = this.options.taskListTable) || void 0 === _v ? void 0 : _v.theme) || void 0 === _w ? void 0 : _w.headerStyle), 
            listTable_options.theme.bodyStyle = Object.assign({}, themes.DEFAULT.bodyStyle, null === (_y = null === (_x = this.options.taskListTable) || void 0 === _x ? void 0 : _x.theme) || void 0 === _y ? void 0 : _y.bodyStyle, {
                frameStyle: {
                    borderLineWidth: [ null !== (_0 = null === (_z = this.parsedOptions.horizontalSplitLine) || void 0 === _z ? void 0 : _z.lineWidth) && void 0 !== _0 ? _0 : 0, 0, 0, 0 ],
                    borderColor: null === (_1 = this.parsedOptions.horizontalSplitLine) || void 0 === _1 ? void 0 : _1.lineColor
                }
            }), listTable_options.theme.cellInnerBorder = !1;
            const [top, right, bottom, left] = toBoxArray(null !== (_3 = null === (_2 = this.parsedOptions.outerFrameStyle) || void 0 === _2 ? void 0 : _2.borderLineWidth) && void 0 !== _3 ? _3 : 0);
            listTable_options.theme.frameStyle = Object.assign({}, this.parsedOptions.outerFrameStyle, {
                cornerRadius: [ null !== (_5 = null === (_4 = this.parsedOptions.outerFrameStyle) || void 0 === _4 ? void 0 : _4.cornerRadius) && void 0 !== _5 ? _5 : 0, 0, 0, null !== (_7 = null === (_6 = this.parsedOptions.outerFrameStyle) || void 0 === _6 ? void 0 : _6.cornerRadius) && void 0 !== _7 ? _7 : 0 ],
                borderLineWidth: [ top, 0, bottom, left ]
            }), listTable_options.theme.scrollStyle = Object.assign({}, null === (_9 = null === (_8 = this.options.taskListTable) || void 0 === _8 ? void 0 : _8.theme) || void 0 === _9 ? void 0 : _9.scrollStyle, this.parsedOptions.scrollStyle, {
                verticalVisible: "none"
            }), listTable_options.theme.columnResize = Object.assign({
                labelColor: "rgba(0,0,0,0)",
                labelBackgroundFill: "rgba(0,0,0,0)"
            }, null === (_11 = null === (_10 = this.options.taskListTable) || void 0 === _10 ? void 0 : _10.theme) || void 0 === _11 ? void 0 : _11.columnResize), 
            listTable_options.theme.underlayBackgroundColor || (listTable_options.theme.underlayBackgroundColor = this.parsedOptions.underlayBackgroundColor);
        } else {
            const [top, right, bottom, left] = toBoxArray(null !== (_13 = null === (_12 = this.parsedOptions.outerFrameStyle) || void 0 === _12 ? void 0 : _12.borderLineWidth) && void 0 !== _13 ? _13 : 0);
            listTable_options.theme = {
                scrollStyle: Object.assign({}, null === (_15 = null === (_14 = this.options.taskListTable) || void 0 === _14 ? void 0 : _14.theme) || void 0 === _15 ? void 0 : _15.scrollStyle, this.parsedOptions.scrollStyle, {
                    verticalVisible: "none"
                }),
                headerStyle: Object.assign({}, themes.DEFAULT.headerStyle, {
                    bgColor: this.parsedOptions.timelineHeaderBackgroundColor
                }, null === (_17 = null === (_16 = this.options.taskListTable) || void 0 === _16 ? void 0 : _16.theme) || void 0 === _17 ? void 0 : _17.headerStyle),
                bodyStyle: Object.assign({}, themes.DEFAULT.bodyStyle, null === (_19 = null === (_18 = this.options.taskListTable) || void 0 === _18 ? void 0 : _18.theme) || void 0 === _19 ? void 0 : _19.bodyStyle, {
                    frameStyle: {
                        borderLineWidth: [ null !== (_21 = null === (_20 = this.parsedOptions.horizontalSplitLine) || void 0 === _20 ? void 0 : _20.lineWidth) && void 0 !== _21 ? _21 : 0, 0, 0, 0 ],
                        borderColor: null === (_22 = this.parsedOptions.horizontalSplitLine) || void 0 === _22 ? void 0 : _22.lineColor
                    }
                }),
                cellInnerBorder: !1,
                frameStyle: Object.assign({}, this.parsedOptions.outerFrameStyle, {
                    cornerRadius: [ null !== (_24 = null === (_23 = this.parsedOptions.outerFrameStyle) || void 0 === _23 ? void 0 : _23.cornerRadius) && void 0 !== _24 ? _24 : 0, 0, 0, null !== (_26 = null === (_25 = this.parsedOptions.outerFrameStyle) || void 0 === _25 ? void 0 : _25.cornerRadius) && void 0 !== _26 ? _26 : 0 ],
                    borderLineWidth: [ top, 0, bottom, left ]
                }),
                columnResize: Object.assign({
                    labelColor: "rgba(0,0,0,0)",
                    labelBackgroundFill: "rgba(0,0,0,0)"
                }, null === (_28 = null === (_27 = this.options.taskListTable) || void 0 === _27 ? void 0 : _27.theme) || void 0 === _28 ? void 0 : _28.columnResize),
                underlayBackgroundColor: this.parsedOptions.underlayBackgroundColor
            };
        }
        return listTable_options.canvasWidth = this.taskTableWidth, listTable_options.canvasHeight = this.canvas.height, 
        listTable_options.defaultHeaderRowHeight = this.getAllHeaderRowsHeight(), this.parsedOptions.tasksShowMode === TasksShowMode.Sub_Tasks_Separate ? (listTable_options.customComputeRowHeight = args => {
            var _a;
            const {row: row, table: table} = args, record = table.getRecordByRowCol(0, row);
            if (record) return ((null === (_a = record.children) || void 0 === _a ? void 0 : _a.length) || 1) * this.parsedOptions.rowHeight;
        }, listTable_options.defaultRowHeight = "auto", listTable_options.customConfig = {
            forceComputeAllRowHeight: !0
        }) : this.parsedOptions.tasksShowMode === TasksShowMode.Sub_Tasks_Compact ? (listTable_options.customComputeRowHeight = args => {
            const {row: row, table: table} = args, record = table.getRecordByRowCol(0, row);
            if (record) return computeRowsCountByRecordDateForCompact(this, record) * this.parsedOptions.rowHeight;
        }, listTable_options.defaultRowHeight = "auto", listTable_options.customConfig = {
            forceComputeAllRowHeight: !0
        }) : this.parsedOptions.tasksShowMode === TasksShowMode.Sub_Tasks_Arrange ? (listTable_options.customComputeRowHeight = args => {
            const {row: row, table: table} = args, record = table.getRecordByRowCol(0, row);
            if (record) return computeRowsCountByRecordDate(this, record) * this.parsedOptions.rowHeight;
        }, listTable_options.defaultRowHeight = "auto", listTable_options.customConfig = {
            forceComputeAllRowHeight: !0
        }) : listTable_options.defaultRowHeight = null !== (_29 = this.options.rowHeight) && void 0 !== _29 ? _29 : 40, 
        listTable_options.clearDOM = !1, listTable_options;
    }
    getElement() {
        return this.element;
    }
    getContainer() {
        return this.element.parentElement;
    }
    _sortScales() {
        const {timelineHeader: timelineHeader} = this.options;
        if (timelineHeader) {
            const timelineScales = timelineHeader.scales, sortOrder = [ "year", "quarter", "month", "week", "day", "hour", "minute", "second" ];
            1 === timelineScales.length && ("hour" !== timelineScales[0].unit && "minute" !== timelineScales[0].unit && "second" !== timelineScales[0].unit || (this.parsedOptions.timeScaleIncludeHour = !0));
            const orderedScales = timelineScales.slice().sort(((a, b) => {
                "hour" !== a.unit && "minute" !== a.unit && "second" !== a.unit || (this.parsedOptions.timeScaleIncludeHour = !0);
                const indexA = sortOrder.indexOf(a.unit), indexB = sortOrder.indexOf(b.unit);
                return -1 === indexA ? 1 : -1 === indexB ? -1 : indexA - indexB;
            })), reverseOrderedScales = timelineScales.slice().sort(((a, b) => {
                const indexA = sortOrder.indexOf(a.unit), indexB = sortOrder.indexOf(b.unit);
                return -1 === indexA ? 1 : -1 === indexB ? -1 : indexB - indexA;
            }));
            this.parsedOptions.sortedTimelineScales = orderedScales, this.parsedOptions.reverseSortedTimelineScales = reverseOrderedScales;
        }
    }
    _generateTimeLineDateMap() {
        if (this.parsedOptions.minDate && this.parsedOptions.maxDate) for (const scale of this.parsedOptions.reverseSortedTimelineScales) scale.timelineDates = generateTimeLineDate(new Date(this.parsedOptions.minDate), this.parsedOptions.maxDate, scale);
        this._rebuildTimelineColXMap();
    }
    _rebuildTimelineColXMap() {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
        const minScale = null === (_a = this.parsedOptions.reverseSortedTimelineScales) || void 0 === _a ? void 0 : _a[0], timelineDates = null !== (_b = null == minScale ? void 0 : minScale.timelineDates) && void 0 !== _b ? _b : [], baseWidth = null !== (_c = this.parsedOptions.timelineColWidth) && void 0 !== _c ? _c : 0, hideWeekend = !0 === (null === (_e = null === (_d = this.options) || void 0 === _d ? void 0 : _d.timelineHeader) || void 0 === _e ? void 0 : _e.hideWeekend), weekendColWidth = null === (_g = null === (_f = this.options) || void 0 === _f ? void 0 : _f.timelineHeader) || void 0 === _g ? void 0 : _g.weekendColWidth, enableWeekendWidth = "day" === (null == minScale ? void 0 : minScale.unit) && 1 === (null == minScale ? void 0 : minScale.step) && (hideWeekend || void 0 !== weekendColWidth);
        this._timelineColWidths = new Array(timelineDates.length), this._timelineColX = new Array(timelineDates.length + 1), 
        this._timelineColStartTimes = new Array(timelineDates.length), this._timelineColEndTimes = new Array(timelineDates.length), 
        this._timelineColX[0] = 0;
        let sumX = 0;
        for (let i = 0; i < timelineDates.length; i++) {
            const d = timelineDates[i], startTime = null !== (_k = null === (_j = null === (_h = d.startDate) || void 0 === _h ? void 0 : _h.getTime) || void 0 === _j ? void 0 : _j.call(_h)) && void 0 !== _k ? _k : 0, endTime = null !== (_o = null === (_m = null === (_l = d.endDate) || void 0 === _l ? void 0 : _l.getTime) || void 0 === _m ? void 0 : _m.call(_l)) && void 0 !== _o ? _o : startTime;
            this._timelineColStartTimes[i] = startTime, this._timelineColEndTimes[i] = endTime;
            let w = baseWidth;
            if (enableWeekendWidth) {
                const day = d.startDate.getDay();
                (0 === day || 6 === day) && (hideWeekend ? w = 0 : "number" == typeof weekendColWidth ? w = weekendColWidth : "function" == typeof weekendColWidth && (w = weekendColWidth(baseWidth)));
            }
            w = Math.max(0, Number.isFinite(w) ? w : baseWidth), this._timelineColWidths[i] = w, 
            sumX += w, this._timelineColX[i + 1] = sumX;
        }
    }
    getXByTime(time) {
        var _a, _b, _c, _d, _e;
        const startTimes = this._timelineColStartTimes, endTimes = this._timelineColEndTimes, widths = this._timelineColWidths, xPrefix = this._timelineColX;
        if (!((null == startTimes ? void 0 : startTimes.length) && (null == endTimes ? void 0 : endTimes.length) && (null == widths ? void 0 : widths.length) && (null == xPrefix ? void 0 : xPrefix.length))) return 0;
        if (time <= startTimes[0]) return 0;
        const lastIndex = endTimes.length - 1;
        if (time > endTimes[lastIndex]) return null !== (_a = xPrefix[lastIndex + 1]) && void 0 !== _a ? _a : 0;
        let low = 0, high = lastIndex;
        for (;low <= high; ) {
            const mid = low + high >> 1, st = startTimes[mid], et = endTimes[mid];
            if (time < st) high = mid - 1; else {
                if (!(time > et)) {
                    const offset = (time - st) / Math.max(1, et - st + 1);
                    return (null !== (_b = xPrefix[mid]) && void 0 !== _b ? _b : 0) + (null !== (_c = widths[mid]) && void 0 !== _c ? _c : 0) * offset;
                }
                low = mid + 1;
            }
        }
        const idx = Math.max(0, Math.min(lastIndex, high)), st = startTimes[idx], et = endTimes[idx], duration = Math.max(1, et - st + 1), offset = Math.max(0, Math.min(1, (time - st) / duration));
        return (null !== (_d = xPrefix[idx]) && void 0 !== _d ? _d : 0) + (null !== (_e = widths[idx]) && void 0 !== _e ? _e : 0) * offset;
    }
    getDateIndexByTime(time) {
        const startTimes = this._timelineColStartTimes, endTimes = this._timelineColEndTimes;
        if (!(null == startTimes ? void 0 : startTimes.length) || !(null == endTimes ? void 0 : endTimes.length)) return 0;
        if (time <= startTimes[0]) return 0;
        const lastIndex = endTimes.length - 1;
        if (time > endTimes[lastIndex]) return lastIndex;
        let low = 0, high = lastIndex;
        for (;low <= high; ) {
            const mid = low + high >> 1, st = startTimes[mid], et = endTimes[mid];
            if (time < st) high = mid - 1; else {
                if (!(time > et)) return mid;
                low = mid + 1;
            }
        }
        return Math.max(0, Math.min(lastIndex, high));
    }
    getDateIndexByX(x) {
        var _a, _b, _c;
        const totalX = x + this.stateManager.scroll.horizontalBarPos, xPrefix = this._timelineColX;
        if (!(null == xPrefix ? void 0 : xPrefix.length)) return 0;
        if (totalX <= 0) return 0;
        const lastIndex = xPrefix.length - 2;
        if (totalX >= (null !== (_a = xPrefix[lastIndex + 1]) && void 0 !== _a ? _a : 0)) return Math.max(0, lastIndex);
        let low = 0, high = lastIndex;
        for (;low <= high; ) {
            const mid = low + high >> 1, left = null !== (_b = xPrefix[mid]) && void 0 !== _b ? _b : 0, right = null !== (_c = xPrefix[mid + 1]) && void 0 !== _c ? _c : left;
            if (totalX < left) high = mid - 1; else {
                if (!(totalX >= right)) return mid;
                low = mid + 1;
            }
        }
        return Math.max(0, Math.min(lastIndex, low));
    }
    getRowHeightByIndex(index) {
        return this.taskListTableInstance ? this.taskListTableInstance.getRowHeight(index + this.taskListTableInstance.columnHeaderLevelCount) : this.parsedOptions.rowHeight;
    }
    getRowsHeightByIndex(startIndex, endIndex) {
        return this.taskListTableInstance ? this.taskListTableInstance.getRowsHeight(startIndex + this.taskListTableInstance.columnHeaderLevelCount, endIndex + this.taskListTableInstance.columnHeaderLevelCount) : this.parsedOptions.rowHeight * (endIndex - startIndex + 1);
    }
    getAllRowsHeight() {
        return this.taskListTableInstance ? this.taskListTableInstance.getAllRowsHeight() : this.getAllHeaderRowsHeight() + this.itemCount * this.parsedOptions.rowHeight;
    }
    getAllHeaderRowsHeight() {
        return this.parsedOptions.timeLineHeaderRowHeights.reduce(((acc, curr, index) => !1 === this.parsedOptions.sortedTimelineScales[index].visible ? acc : acc + curr), 0);
    }
    getAllDateColsWidth() {
        var _a, _b, _c;
        const xPrefix = this._timelineColX;
        return (null == xPrefix ? void 0 : xPrefix.length) ? null !== (_a = xPrefix[xPrefix.length - 1]) && void 0 !== _a ? _a : 0 : this.parsedOptions.timelineColWidth * (null !== (_c = null === (_b = this.parsedOptions.reverseSortedTimelineScales[0].timelineDates) || void 0 === _b ? void 0 : _b.length) && void 0 !== _c ? _c : 0);
    }
    getAllTaskBarsHeight() {
        return this.taskListTableInstance ? this.taskListTableInstance.getRowsHeight(this.taskListTableInstance.columnHeaderLevelCount, this.taskListTableInstance.rowCount - 1) : this.itemCount * this.parsedOptions.rowHeight;
    }
    getRecordIndexByTaskShowIndex(showIndex) {
        return this.taskListTableInstance ? this.taskListTableInstance.getRecordIndexByCell(0, this.taskListTableInstance.columnHeaderLevelCount + showIndex) : showIndex;
    }
    getTaskShowIndexByRecordIndex(index) {
        return this.taskListTableInstance.getBodyRowIndexByRecordIndex(index);
    }
    getRecordByIndex(taskShowIndex, sub_task_index) {
        var _a, _b;
        if (this.taskListTableInstance) {
            if (isValid(sub_task_index)) {
                const record = this.taskListTableInstance.getRecordByCell(0, taskShowIndex + this.taskListTableInstance.columnHeaderLevelCount);
                if (Array.isArray(sub_task_index)) {
                    const recordIndex = this.getRecordIndexByTaskShowIndex(taskShowIndex), parentIndexLength = Array.isArray(recordIndex) ? recordIndex.length : 1, new_sub_task_index = [ ...sub_task_index ];
                    new_sub_task_index.splice(0, parentIndexLength);
                    let currentRecord = record;
                    for (;new_sub_task_index.length > 0; ) {
                        const index = new_sub_task_index.shift();
                        currentRecord = null === (_a = null == currentRecord ? void 0 : currentRecord.children) || void 0 === _a ? void 0 : _a[index];
                    }
                    return currentRecord;
                }
                return null === (_b = null == record ? void 0 : record.children) || void 0 === _b ? void 0 : _b[sub_task_index];
            }
            return this.taskListTableInstance.getRecordByCell(0, taskShowIndex + this.taskListTableInstance.columnHeaderLevelCount);
        }
        return this.records[taskShowIndex];
    }
    _refreshTaskBar(taskShowIndex, sub_task_index) {
        this.scenegraph.taskBar.updateTaskBarNode(taskShowIndex, sub_task_index), this.scenegraph.refreshRecordLinkNodes(taskShowIndex, void 0, this.scenegraph.taskBar.getTaskBarNodeByIndex(taskShowIndex, sub_task_index)), 
        this.scenegraph.updateNextFrame();
    }
    _updateRecordToListTable(record, index) {
        this.taskListTableInstance.updateRecords([ record ], [ index ]);
    }
    getTaskInfoByTaskListIndex(taskShowIndex, sub_task_index) {
        const taskRecord = this.getRecordByIndex(taskShowIndex, sub_task_index), isMilestone = null == taskRecord ? void 0 : taskRecord.type, startDateField = this.parsedOptions.startDateField, endDateField = this.parsedOptions.endDateField, progressField = this.parsedOptions.progressField, rawDateStartDateTime = createDateAtMidnight(null == taskRecord ? void 0 : taskRecord[startDateField]).getTime(), rawDateEndDateTime = createDateAtMidnight(null == taskRecord ? void 0 : taskRecord[endDateField]).getTime();
        if (isMilestone && !(null == taskRecord ? void 0 : taskRecord[startDateField]) || !isMilestone && (rawDateEndDateTime < this.parsedOptions._minDateTime || rawDateStartDateTime > this.parsedOptions._maxDateTime || !(null == taskRecord ? void 0 : taskRecord[startDateField]) || !(null == taskRecord ? void 0 : taskRecord[endDateField]))) return {
            taskDays: 0,
            progress: 0,
            startDate: null,
            endDate: null,
            taskRecord: taskRecord
        };
        const progress = convertProgress(taskRecord[progressField]);
        let startDate, endDate;
        if (this.parsedOptions.timeScaleIncludeHour) {
            startDate = createDateAtMidnight(Math.min(Math.max(this.parsedOptions._minDateTime, rawDateStartDateTime), this.parsedOptions._maxDateTime));
            const rawEnd = null == taskRecord ? void 0 : taskRecord[endDateField];
            let hasMillisecondProvided = !1;
            "string" == typeof rawEnd && (hasMillisecondProvided = /:\d{2}\.\d+/.test(rawEnd));
            const shouldForceMillisecond = !hasMillisecondProvided;
            endDate = createDateAtLastMillisecond(Math.max(Math.min(this.parsedOptions._maxDateTime, rawDateEndDateTime), this.parsedOptions._minDateTime), shouldForceMillisecond);
        } else startDate = createDateAtMidnight(Math.min(Math.max(this.parsedOptions._minDateTime, rawDateStartDateTime), this.parsedOptions._maxDateTime), !0), 
        endDate = createDateAtLastHour(Math.max(Math.min(this.parsedOptions._maxDateTime, rawDateEndDateTime), this.parsedOptions._minDateTime), !0);
        return {
            taskRecord: taskRecord,
            taskDays: (endDate.getTime() - startDate.getTime() + 1) / 864e5,
            startDate: startDate,
            endDate: endDate,
            progress: progress
        };
    }
    getBaselineInfoByTaskListIndex(taskShowIndex, sub_task_index) {
        const taskRecord = this.getRecordByIndex(taskShowIndex, sub_task_index), baselineStartDateField = this.parsedOptions.baselineStartDateField, baselineEndDateField = this.parsedOptions.baselineEndDateField;
        if (!(baselineStartDateField && baselineEndDateField && (null == taskRecord ? void 0 : taskRecord[baselineStartDateField]) && (null == taskRecord ? void 0 : taskRecord[baselineEndDateField]))) return {
            baselineStartDate: null,
            baselineEndDate: null,
            baselineDays: 0
        };
        const rawBaselineStartDateTime = createDateAtMidnight(null == taskRecord ? void 0 : taskRecord[baselineStartDateField]).getTime(), rawBaselineEndDateTime = createDateAtMidnight(null == taskRecord ? void 0 : taskRecord[baselineEndDateField]).getTime();
        if (rawBaselineEndDateTime < this.parsedOptions._minDateTime || rawBaselineStartDateTime > this.parsedOptions._maxDateTime) return {
            baselineStartDate: null,
            baselineEndDate: null,
            baselineDays: 0
        };
        let baselineStartDate, baselineEndDate;
        if (this.parsedOptions.timeScaleIncludeHour) {
            baselineStartDate = createDateAtMidnight(Math.min(Math.max(this.parsedOptions._minDateTime, rawBaselineStartDateTime), this.parsedOptions._maxDateTime));
            const rawEnd = null == taskRecord ? void 0 : taskRecord[baselineEndDateField];
            let hasMillisecondProvided = !1;
            "string" == typeof rawEnd && (hasMillisecondProvided = /:\d{2}\.\d+/.test(rawEnd));
            const shouldForceMillisecond = !hasMillisecondProvided;
            baselineEndDate = createDateAtLastMillisecond(Math.max(Math.min(this.parsedOptions._maxDateTime, rawBaselineEndDateTime), this.parsedOptions._minDateTime), shouldForceMillisecond);
        } else baselineStartDate = createDateAtMidnight(Math.min(Math.max(this.parsedOptions._minDateTime, rawBaselineStartDateTime), this.parsedOptions._maxDateTime), !0), 
        baselineEndDate = createDateAtLastHour(Math.max(Math.min(this.parsedOptions._maxDateTime, rawBaselineEndDateTime), this.parsedOptions._minDateTime), !0);
        const baselineDays = (baselineEndDate.getTime() - baselineStartDate.getTime() + 1) / 864e5;
        return {
            baselineStartDate: baselineStartDate,
            baselineEndDate: baselineEndDate,
            baselineDays: baselineDays
        };
    }
    _updateStartDateToTaskRecord(startDate, index, sub_task_index) {
        var _a;
        const taskRecord = this.getRecordByIndex(index, sub_task_index), startDateField = this.parsedOptions.startDateField, dateFormat = null !== (_a = this.parsedOptions.dateFormat) && void 0 !== _a ? _a : parseDateFormat(taskRecord[startDateField]), newStartDate = formatDate(startDate, dateFormat);
        if (taskRecord[startDateField] = newStartDate, isValid(sub_task_index)) Array.isArray(sub_task_index) && this.stateManager.updateProjectTaskTimes(sub_task_index); else {
            const indexs = this.getRecordIndexByTaskShowIndex(index);
            this._updateRecordToListTable(taskRecord, indexs), Array.isArray(indexs) && this.stateManager.updateProjectTaskTimes(indexs);
        }
    }
    _updateEndDateToTaskRecord(endDate, index, sub_task_index) {
        var _a;
        const taskRecord = this.getRecordByIndex(index, sub_task_index), endDateField = this.parsedOptions.endDateField, dateFormat = null !== (_a = this.parsedOptions.dateFormat) && void 0 !== _a ? _a : parseDateFormat(taskRecord[endDateField]), newEndDate = formatDate(endDate, dateFormat);
        if (taskRecord[endDateField] = newEndDate, isValid(sub_task_index)) Array.isArray(sub_task_index) && this.stateManager.updateProjectTaskTimes(sub_task_index); else {
            const indexs = this.getRecordIndexByTaskShowIndex(index);
            this._updateRecordToListTable(taskRecord, indexs), Array.isArray(indexs) && this.stateManager.updateProjectTaskTimes(indexs);
        }
    }
    _updateStartEndDateToTaskRecord(startDate, endDate, index, sub_task_index) {
        var _a;
        const taskRecord = this.getRecordByIndex(index, sub_task_index), startDateField = this.parsedOptions.startDateField, endDateField = this.parsedOptions.endDateField, dateFormat = null !== (_a = this.parsedOptions.dateFormat) && void 0 !== _a ? _a : parseDateFormat(taskRecord[startDateField]), newStartDate = formatDate(startDate, dateFormat);
        taskRecord[startDateField] = newStartDate;
        const newEndDate = formatDate(endDate, dateFormat);
        if (taskRecord[endDateField] = newEndDate, isValid(sub_task_index)) Array.isArray(sub_task_index) && this.stateManager.updateProjectTaskTimes(sub_task_index); else {
            const indexs = this.getRecordIndexByTaskShowIndex(index);
            this._updateRecordToListTable(taskRecord, indexs), Array.isArray(indexs) && this.stateManager.updateProjectTaskTimes(indexs);
        }
    }
    _updateProgressToTaskRecord(progress, index, sub_task_index) {
        const taskRecord = this.getRecordByIndex(index, sub_task_index), progressField = this.parsedOptions.progressField;
        if (progressField) {
            taskRecord[progressField] = progress;
            const indexs = this.getRecordIndexByTaskShowIndex(index);
            this._updateRecordToListTable(taskRecord, indexs), this._refreshTaskBar(index, sub_task_index);
        }
    }
    _dragOrderTaskRecord(source_index, source_sub_task_index, target_index, target_sub_task_index) {
        this.data.adjustOrder(source_index, source_sub_task_index, target_index, target_sub_task_index);
    }
    updateTaskRecord(record, task_index, sub_task_index) {
        if (isValid(sub_task_index)) {
            const index = "number" == typeof task_index ? task_index : task_index[0];
            return this._updateRecordToListTable(record, [ index, sub_task_index ]), void this._refreshTaskBar(index, sub_task_index);
        }
        if (Array.isArray(task_index)) {
            const index = task_index[0], sub_index = task_index[1];
            return this._updateRecordToListTable(record, task_index), void this._refreshTaskBar(index, sub_index);
        }
        let recordIndexs = task_index;
        "tree" === this.taskListTableInstance.rowHierarchyType && (recordIndexs = this.taskListTableInstance.getRecordIndexByCell(0, task_index + this.taskListTableInstance.columnHeaderLevelCount)), 
        this._updateRecordToListTable(record, recordIndexs), this._refreshTaskBar(task_index, void 0);
    }
    setPixelRatio(pixelRatio) {
        var _a;
        null === (_a = this.taskListTableInstance) || void 0 === _a || _a.setPixelRatio(pixelRatio), 
        this.parsedOptions.pixelRatio = pixelRatio, this.scenegraph.setPixelRatio(pixelRatio);
    }
    updateTasksShowMode(tasksShowMode) {
        this.options.tasksShowMode = tasksShowMode, this.updateOption(this.options);
    }
    _resize() {
        var _a, _b, _c, _d, _e;
        this._updateSize(), null === (_a = this.taskListTableInstance) || void 0 === _a || _a.setCanvasSize(this.taskTableWidth, this.tableNoFrameHeight + toBoxArray(null !== (_c = null === (_b = this.parsedOptions.outerFrameStyle) || void 0 === _b ? void 0 : _b.borderLineWidth) && void 0 !== _c ? _c : 0)[0] + toBoxArray(null !== (_e = null === (_d = this.parsedOptions.outerFrameStyle) || void 0 === _d ? void 0 : _d.borderLineWidth) && void 0 !== _e ? _e : 0)[2]), 
        this._syncPropsFromTable(), this.scenegraph.resize(), updateSplitLineAndResizeLine(this);
    }
    _syncPropsFromTable() {
        this.itemCount = this.taskListTableInstance ? this.taskListTableInstance.rowCount - this.taskListTableInstance.columnHeaderLevelCount : this.records.length, 
        this.headerHeight = this.getAllHeaderRowsHeight(), this.drawHeight = Math.min(this.getAllRowsHeight(), this.tableNoFrameHeight), 
        this.gridHeight = this.drawHeight - this.headerHeight;
    }
    hasDataZoom() {
        var _a;
        if (!this.zoomScaleManager) return !1;
        const dataZoomConfig = null === (_a = this.zoomScaleManager.config) || void 0 === _a ? void 0 : _a.dataZoomAxis;
        return !(!dataZoomConfig || !1 === dataZoomConfig.enabled) && null !== this.zoomScaleManager.getDataZoomIntegration();
    }
    getDataZoomHeight() {
        var _a, _b, _c;
        return this.hasDataZoom() ? (null === (_c = null === (_b = null === (_a = this.zoomScaleManager) || void 0 === _a ? void 0 : _a.config) || void 0 === _b ? void 0 : _b.dataZoomAxis) || void 0 === _c ? void 0 : _c.height) || 30 : 0;
    }
    getContext() {
        return this.context;
    }
    release() {
        var _a, _b, _c;
        null === (_a = super.release) || void 0 === _a || _a.call(this), this.eventManager.release(), 
        null === (_b = this.taskListTableInstance) || void 0 === _b || _b.release(), this.zoomScaleManager && (this.zoomScaleManager.destroyDataZoomIntegration(), 
        this.zoomScaleManager = null);
        const parentElement = null === (_c = this.element) || void 0 === _c ? void 0 : _c.parentElement;
        parentElement && (parentElement.removeChild(this.element), this.verticalSplitResizeLine && parentElement.removeChild(this.verticalSplitResizeLine), 
        this.horizontalSplitLine && parentElement.removeChild(this.horizontalSplitLine)), 
        this.scenegraph = null, this.pluginManager.release();
    }
    updateOption(options) {
        var _a, _b, _c, _d, _e;
        if (this.parsedOptions = {}, this.options = options, this.taskTableWidth = "number" == typeof (null === (_a = null == options ? void 0 : options.taskListTable) || void 0 === _a ? void 0 : _a.tableWidth) ? null === (_b = null == options ? void 0 : options.taskListTable) || void 0 === _b ? void 0 : _b.tableWidth : -1, 
        this.taskTableColumns = null !== (_d = null === (_c = null == options ? void 0 : options.taskListTable) || void 0 === _c ? void 0 : _c.columns) && void 0 !== _d ? _d : [], 
        this.records = null !== (_e = null == options ? void 0 : options.records) && void 0 !== _e ? _e : [], 
        this._sortScales(), initOptions(this), this.data.setRecords(this.records), this._generateTimeLineDateMap(), 
        this.timeLineHeaderLevel = this.parsedOptions.sortedTimelineScales.length, this._updateSize(), 
        this.taskListTableInstance) {
            const listTableOption = this._generateListTableOptions();
            this.taskListTableInstance.updateOption(listTableOption), this._updateListTableSize(this.taskListTableInstance);
        }
        this._syncPropsFromTable(), this.scenegraph.updateStageBackground(), this.element.style.left = -1 !== this.taskTableWidth ? `${this.taskTableWidth}px` : "0px", 
        updateSplitLineAndResizeLine(this), this.scenegraph.updateSceneGraph(), this.scenegraph.afterCreateSceneGraph(), 
        this._scrollToMarkLine();
    }
    setRecords(records) {
        this.records = records, this.data.setRecords(records), updateOptionsWhenRecordChanged(this), 
        this.taskListTableInstance.setRecords(records), this._syncPropsFromTable(), this._generateTimeLineDateMap(), 
        this.timeLineHeaderLevel = this.parsedOptions.sortedTimelineScales.length, this._updateSize(), 
        this.scenegraph.refreshAll(), this.verticalSplitResizeLine.style.height = this.drawHeight + "px";
        const left = this.stateManager.scroll.horizontalBarPos, top = this.stateManager.scroll.verticalBarPos;
        this.scenegraph.setX(-left), this.scenegraph.setY(-top);
    }
    updateScales(scales) {
        const oldScalesLength = this.parsedOptions.sortedTimelineScales.length;
        if (this.options.timelineHeader.scales = scales, this._sortScales(), updateOptionsWhenScaleChanged(this), 
        this._generateTimeLineDateMap(), this.timeLineHeaderLevel = this.parsedOptions.sortedTimelineScales.length, 
        this.scenegraph.refreshAll(), updateSplitLineAndResizeLine(this), this.taskListTableInstance) if (this.taskListTableInstance.columnHeaderLevelCount === this.parsedOptions.timeLineHeaderRowHeights.length) for (let i = 0; i < this.taskListTableInstance.columnHeaderLevelCount; i++) this.taskListTableInstance.setRowHeight(i, this.parsedOptions.timeLineHeaderRowHeights[i]); else {
            const newRowHeight = this.getAllHeaderRowsHeight() / this.taskListTableInstance.columnHeaderLevelCount;
            for (let i = 0; i < this.taskListTableInstance.columnHeaderLevelCount; i++) this.taskListTableInstance.setRowHeight(i, newRowHeight);
        }
        oldScalesLength !== scales.length && this._resize();
    }
    updateDateRange(minDate, maxDate) {
        this.options.minDate = minDate, this.options.maxDate = maxDate, updateOptionsWhenDateRangeChanged(this), 
        this._generateTimeLineDateMap(), this._updateSize(), this.scenegraph.refreshAll(), 
        this._scrollToMarkLine();
    }
    updateMarkLine(markLine) {
        this.options.markLine = markLine, updateOptionsWhenMarkLineChanged(this), this.scenegraph.markLine.refresh(), 
        this.scenegraph.renderSceneGraph();
    }
    addMarkLine(markLine) {
        this.options.markLine = [ ...this.parsedOptions.markLine, markLine ], updateOptionsWhenMarkLineChanged(this), 
        this.scenegraph.markLine.refresh(), this.scenegraph.renderSceneGraph(), this.scenegraph.updateNextFrame();
    }
    updateCurrentMarkLine(markLine) {
        const currentMarkLineIndex = this.parsedOptions.markLine.findIndex((item => item.date === markLine.date));
        -1 !== currentMarkLineIndex && (this.options.markLine = [ ...this.parsedOptions.markLine.slice(0, currentMarkLineIndex), Object.assign(Object.assign({}, this.options.markLine[currentMarkLineIndex]), markLine), ...this.parsedOptions.markLine.slice(currentMarkLineIndex + 1) ], 
        updateOptionsWhenMarkLineChanged(this), this.scenegraph.markLine.refresh(), this.scenegraph.renderSceneGraph(), 
        this.scenegraph.updateNextFrame());
    }
    _scrollToMarkLine() {
        if (this.parsedOptions.scrollToMarkLineDate && this.parsedOptions.minDate) {
            const left = this.getXByTime(this.parsedOptions.scrollToMarkLineDate.getTime()) - this.tableNoFrameWidth / 2;
            this.stateManager.setScrollLeft(left);
        }
    }
    scrollToMarkLine(date) {
        if (!date || !this.parsedOptions.minDate) return;
        const left = this.getXByTime(date.getTime()) - this.tableNoFrameWidth / 2;
        this.stateManager.setScrollLeft(left);
    }
    addLink(link) {
        this.parsedOptions.dependencyLinks.push(link), this.scenegraph.dependencyLink.initLinkLine(this.parsedOptions.dependencyLinks.length - 1), 
        this.scenegraph.updateNextFrame();
    }
    deleteLink(link) {
        if (this.parsedOptions.dependencyLinkDeletable) {
            const index = this.parsedOptions.dependencyLinks.findIndex((item => item.type === link.type && item.linkedFromTaskKey === link.linkedFromTaskKey && item.linkedToTaskKey === link.linkedToTaskKey));
            if (-1 !== index) {
                const link = this.parsedOptions.dependencyLinks[index];
                this.parsedOptions.dependencyLinks.splice(index, 1), this.scenegraph.dependencyLink.deleteLink(link), 
                this.scenegraph.updateNextFrame();
            }
        }
    }
    get scrollTop() {
        return this.stateManager.scrollTop;
    }
    set scrollTop(value) {
        this.stateManager.setScrollTop(value);
    }
    get scrollLeft() {
        return this.stateManager.scrollLeft;
    }
    set scrollLeft(value) {
        this.stateManager.setScrollLeft(value);
    }
    getTaskBarRelativeRect(index) {
        const taskBarNode = this.scenegraph.taskBar.getTaskBarNodeByIndex(index);
        return {
            left: taskBarNode.attribute.x + this.taskListTableInstance.tableNoFrameWidth + this.taskListTableInstance.tableX + this.tableX - this.scrollLeft,
            top: taskBarNode.attribute.y + this.tableY + this.headerHeight - this.scrollTop,
            width: taskBarNode.attribute.width,
            height: taskBarNode.attribute.height
        };
    }
    getDateColWidth(dateIndex) {
        var _a;
        const widths = this._timelineColWidths;
        return (null == widths ? void 0 : widths.length) && dateIndex >= 0 && dateIndex < widths.length ? null !== (_a = widths[dateIndex]) && void 0 !== _a ? _a : 0 : this.parsedOptions.timelineColWidth;
    }
    getDateColsWidth(startDateIndex, endDateIndex) {
        var _a, _b;
        const xPrefix = this._timelineColX;
        if (null == xPrefix ? void 0 : xPrefix.length) {
            const start = Math.max(0, Math.min(startDateIndex, xPrefix.length - 1)), end = Math.max(0, Math.min(endDateIndex + 1, xPrefix.length - 1));
            return end <= start ? 0 : (null !== (_a = xPrefix[end]) && void 0 !== _a ? _a : 0) - (null !== (_b = xPrefix[start]) && void 0 !== _b ? _b : 0);
        }
        return (endDateIndex - startDateIndex + 1) * this.parsedOptions.timelineColWidth;
    }
    getDateRangeByIndex(index) {
        const minScale = this.parsedOptions.reverseSortedTimelineScales[0];
        if (index < minScale.timelineDates.length) {
            return {
                startDate: minScale.timelineDates[index].startDate,
                endDate: minScale.timelineDates[index].endDate
            };
        }
        return null;
    }
    parseTimeFormat(date) {
        return parseDateFormat(date);
    }
    getTaskBarStyle(task_index, sub_task_index) {
        const {startDate: startDate, endDate: endDate, taskRecord: taskRecord} = this.getTaskInfoByTaskListIndex(task_index, sub_task_index);
        let style;
        if (style = taskRecord.type === TaskType.PROJECT ? this.parsedOptions.projectBarStyle : this.parsedOptions.taskBarStyle, 
        "function" == typeof style) {
            return style({
                index: task_index,
                startDate: startDate,
                endDate: endDate,
                taskRecord: taskRecord,
                ganttInstance: this
            });
        }
        return style;
    }
    getBaselineStyle(task_index, sub_task_index) {
        const {startDate: startDate, endDate: endDate, taskRecord: taskRecord} = this.getTaskInfoByTaskListIndex(task_index, sub_task_index), style = this.parsedOptions.baselineStyle;
        if ("function" == typeof style) {
            return style({
                index: task_index,
                startDate: startDate,
                endDate: endDate,
                taskRecord: taskRecord,
                ganttInstance: this
            });
        }
        return style;
    }
    formatDate(date, format) {
        return formatDate(date instanceof Date ? date : new Date(date), format);
    }
    getCurrentMillisecondsPerPixel() {
        return this.millisecondsPerPixel;
    }
    setMillisecondsPerPixel(millisecondsPerPixel) {
        var _a, _b, _c, _d;
        const minMillisecondsPerPixel = null !== (_b = null === (_a = this.parsedOptions.zoom) || void 0 === _a ? void 0 : _a.minMillisecondsPerPixel) && void 0 !== _b ? _b : 2e5, maxMillisecondsPerPixel = null !== (_d = null === (_c = this.parsedOptions.zoom) || void 0 === _c ? void 0 : _c.maxMillisecondsPerPixel) && void 0 !== _d ? _d : 3e6, oldMillisecondsPerPixel = this.millisecondsPerPixel, oldWidth = this.parsedOptions.timelineColWidth;
        this.millisecondsPerPixel = Math.max(minMillisecondsPerPixel, Math.min(maxMillisecondsPerPixel, millisecondsPerPixel)), 
        this.recalculateTimeScale(), this._updateSize(), this.scenegraph.refreshAll();
        const newWidth = this.parsedOptions.timelineColWidth, scale = newWidth / oldWidth;
        this.hasListeners(GANTT_EVENT_TYPE.ZOOM) && this.fireListeners(GANTT_EVENT_TYPE.ZOOM, {
            oldWidth: oldWidth,
            newWidth: newWidth,
            scale: scale,
            oldMillisecondsPerPixel: oldMillisecondsPerPixel,
            newMillisecondsPerPixel: this.millisecondsPerPixel
        });
    }
    getCurrentZoomScaleLevel() {
        var _a, _b;
        return null !== (_b = null === (_a = this.zoomScaleManager) || void 0 === _a ? void 0 : _a.getCurrentLevel()) && void 0 !== _b ? _b : -1;
    }
}
//# sourceMappingURL=Gantt.js.map