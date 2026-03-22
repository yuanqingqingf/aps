import { TasksShowMode, TaskType } from "./ts-types";

import { createDateAtLastHour, createDateAtLastMillisecond, createDateAtLastMinute, createDateAtLastSecond, createDateAtMidnight, getEndDateByTimeUnit, getStartDateByTimeUnit, getWeekNumber } from "./tools/util";

export const defaultTaskBarStyle = {
    barColor: "blue",
    completedBarColor: "gray",
    width: 30,
    cornerRadius: 3,
    borderWidth: 0,
    fontFamily: "Arial",
    fontSize: 14
};

export const defaultBaselineStyle = {
    barColor: "#d3d3d3",
    completedBarColor: "#a9a9a9",
    width: 20,
    cornerRadius: 3,
    borderWidth: 0
};

function setWidthToDefaultTaskBarStyle(width) {
    defaultTaskBarStyle.width = width;
}

const isNode = "undefined" == typeof window || void 0 === window.window;

export const DayTimes = 864e5;

export function getDateIndexByX(x, gantt) {
    return gantt.getDateIndexByX(x);
}

export function generateMarkLine(markLine) {
    var _a, _b, _c, _d, _e;
    return markLine ? !0 === markLine ? [ {
        date: createDateAtMidnight().toLocaleDateString(),
        content: "",
        scrollToMarkLine: !0,
        position: "left",
        style: {
            lineColor: "red",
            lineWidth: 1
        }
    } ] : Array.isArray(markLine) ? markLine.map(((item, index) => {
        var _a, _b, _c, _d;
        return Object.assign(Object.assign({}, item), {
            date: item.date,
            scrollToMarkLine: item.scrollToMarkLine,
            position: null !== (_a = item.position) && void 0 !== _a ? _a : "left",
            style: {
                lineColor: (null === (_b = item.style) || void 0 === _b ? void 0 : _b.lineColor) || "red",
                lineWidth: (null === (_c = item.style) || void 0 === _c ? void 0 : _c.lineWidth) || 1,
                lineDash: null === (_d = item.style) || void 0 === _d ? void 0 : _d.lineDash
            }
        });
    })) : [ Object.assign(Object.assign({}, markLine), {
        date: markLine.date,
        scrollToMarkLine: null === (_a = markLine.scrollToMarkLine) || void 0 === _a || _a,
        position: null !== (_b = markLine.position) && void 0 !== _b ? _b : "left",
        style: {
            lineColor: (null === (_c = markLine.style) || void 0 === _c ? void 0 : _c.lineColor) || "red",
            lineWidth: (null === (_d = markLine.style) || void 0 === _d ? void 0 : _d.lineWidth) || 1,
            lineDash: null === (_e = markLine.style) || void 0 === _e ? void 0 : _e.lineDash
        }
    }) ] : [];
}

export function getHorizontalScrollBarSize(scrollStyle) {
    var _a;
    return (null == scrollStyle ? void 0 : scrollStyle.hoverOn) || (null == scrollStyle ? void 0 : scrollStyle.horizontalVisible) && "none" === (null == scrollStyle ? void 0 : scrollStyle.horizontalVisible) || !(null == scrollStyle ? void 0 : scrollStyle.horizontalVisible) && "none" === (null == scrollStyle ? void 0 : scrollStyle.visible) ? 0 : null !== (_a = null == scrollStyle ? void 0 : scrollStyle.width) && void 0 !== _a ? _a : 7;
}

export function getVerticalScrollBarSize(scrollStyle) {
    var _a;
    return (null == scrollStyle ? void 0 : scrollStyle.hoverOn) || (null == scrollStyle ? void 0 : scrollStyle.verticalVisible) && "none" === (null == scrollStyle ? void 0 : scrollStyle.verticalVisible) || !(null == scrollStyle ? void 0 : scrollStyle.verticalVisible) && "none" === (null == scrollStyle ? void 0 : scrollStyle.visible) ? 0 : null !== (_a = null == scrollStyle ? void 0 : scrollStyle.width) && void 0 !== _a ? _a : 7;
}

export { isNode };

export function initOptions(gantt) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7, _8, _9, _10, _11, _12, _13, _14, _15, _16, _17, _18, _19, _20, _21, _22, _23, _24, _25, _26, _27, _28, _29, _30, _31, _32, _33, _34, _35, _36, _37, _38, _39, _40, _41, _42, _43, _44, _45, _46, _47, _48, _49, _50, _51, _52, _53, _54, _55, _56, _57, _58, _59, _60, _61, _62, _63, _64, _65, _66, _67, _68, _69, _70, _71, _72, _73, _74, _75, _76, _77, _78, _79, _80, _81, _82, _83, _84, _85, _86, _87, _88, _89, _90, _91, _92, _93, _94, _95, _96, _97, _98;
    const options = gantt.options;
    gantt.parsedOptions.tasksShowMode = null !== (_a = null == options ? void 0 : options.tasksShowMode) && void 0 !== _a ? _a : TasksShowMode.Tasks_Separate, 
    gantt.parsedOptions.pixelRatio = null !== (_b = null == options ? void 0 : options.pixelRatio) && void 0 !== _b ? _b : 1, 
    gantt.parsedOptions.rowHeight = null !== (_c = null == options ? void 0 : options.rowHeight) && void 0 !== _c ? _c : 40, 
    gantt.parsedOptions.timelineColWidth = null !== (_e = null === (_d = null == options ? void 0 : options.timelineHeader) || void 0 === _d ? void 0 : _d.colWidth) && void 0 !== _e ? _e : 60, 
    gantt.parsedOptions.startDateField = null !== (_g = null === (_f = options.taskBar) || void 0 === _f ? void 0 : _f.startDateField) && void 0 !== _g ? _g : "startDate", 
    gantt.parsedOptions.endDateField = null !== (_j = null === (_h = options.taskBar) || void 0 === _h ? void 0 : _h.endDateField) && void 0 !== _j ? _j : "endDate", 
    gantt.parsedOptions.progressField = null !== (_l = null === (_k = options.taskBar) || void 0 === _k ? void 0 : _k.progressField) && void 0 !== _l ? _l : "progress", 
    gantt.parsedOptions.baselineStartDateField = null === (_m = options.taskBar) || void 0 === _m ? void 0 : _m.baselineStartDateField, 
    gantt.parsedOptions.baselineEndDateField = null === (_o = options.taskBar) || void 0 === _o ? void 0 : _o.baselineEndDateField, 
    gantt.parsedOptions.baselinePosition = null !== (_q = null === (_p = options.taskBar) || void 0 === _p ? void 0 : _p.baselinePosition) && void 0 !== _q ? _q : "bottom", 
    gantt.parsedOptions.taskBarClip = null === (_s = null === (_r = null == options ? void 0 : options.taskBar) || void 0 === _r ? void 0 : _r.clip) || void 0 === _s || _s, 
    gantt.parsedOptions.projectSubTasksExpandable = null === (_t = null == options ? void 0 : options.projectSubTasksExpandable) || void 0 === _t || _t;
    const {unit: minTimeUnit, startOfWeek: startOfWeek, step: step} = gantt.parsedOptions.reverseSortedTimelineScales[0];
    gantt.parsedOptions.minDate = (null == options ? void 0 : options.minDate) ? getStartDateByTimeUnit(new Date(options.minDate), minTimeUnit, startOfWeek) : void 0, 
    gantt.parsedOptions.maxDate = (null == options ? void 0 : options.maxDate) && (null === (_u = gantt.parsedOptions) || void 0 === _u ? void 0 : _u.minDate) ? getEndDateByTimeUnit(null === (_v = gantt.parsedOptions) || void 0 === _v ? void 0 : _v.minDate, new Date(options.maxDate), minTimeUnit, step) : void 0, 
    gantt.parsedOptions._minDateTime = null === (_w = gantt.parsedOptions.minDate) || void 0 === _w ? void 0 : _w.getTime(), 
    gantt.parsedOptions._maxDateTime = null === (_x = gantt.parsedOptions.maxDate) || void 0 === _x ? void 0 : _x.getTime(), 
    gantt.parsedOptions.overscrollBehavior = null !== (_y = null == options ? void 0 : options.overscrollBehavior) && void 0 !== _y ? _y : "auto", 
    gantt.parsedOptions.underlayBackgroundColor = null !== (_z = null == options ? void 0 : options.underlayBackgroundColor) && void 0 !== _z ? _z : "#FFF", 
    gantt.parsedOptions.scrollStyle = Object.assign({}, {
        scrollRailColor: "rgba(100, 100, 100, 0.2)",
        scrollSliderColor: "rgba(100, 100, 100, 0.5)",
        scrollSliderCornerRadius: 4,
        width: 10,
        visible: "always",
        hoverOn: !0,
        barToSide: !1
    }, null == options ? void 0 : options.scrollStyle), gantt.parsedOptions.timelineHeaderHorizontalLineStyle = null === (_0 = null == options ? void 0 : options.timelineHeader) || void 0 === _0 ? void 0 : _0.horizontalLine, 
    gantt.parsedOptions.timelineHeaderVerticalLineStyle = null === (_1 = null == options ? void 0 : options.timelineHeader) || void 0 === _1 ? void 0 : _1.verticalLine, 
    gantt.parsedOptions.timelineHeaderBackgroundColor = null === (_2 = null == options ? void 0 : options.timelineHeader) || void 0 === _2 ? void 0 : _2.backgroundColor, 
    gantt.parsedOptions.timeLineHeaderRowHeights = [], gantt.parsedOptions.timelineHeaderStyles = [];
    for (let i = 0; i < gantt.parsedOptions.sortedTimelineScales.length; i++) {
        const style = gantt.parsedOptions.sortedTimelineScales[i].style;
        gantt.parsedOptions.timelineHeaderStyles.push(Object.assign({
            fontSize: 20,
            fontWeight: "bold",
            textAlign: "center",
            textBaseline: "middle",
            color: "#000",
            backgroundColor: "#fff"
        }, style)), gantt.parsedOptions.timeLineHeaderRowHeights.push(null !== (_4 = null !== (_3 = gantt.parsedOptions.sortedTimelineScales[i].rowHeight) && void 0 !== _3 ? _3 : null == options ? void 0 : options.headerRowHeight) && void 0 !== _4 ? _4 : 40);
    }
    gantt.parsedOptions.grid = Object.assign({}, null == options ? void 0 : options.grid), 
    setWidthToDefaultTaskBarStyle(3 * gantt.parsedOptions.rowHeight / 4), gantt.parsedOptions.taskBarStyle = (null === (_5 = null == options ? void 0 : options.taskBar) || void 0 === _5 ? void 0 : _5.barStyle) && "function" == typeof (null === (_6 = null == options ? void 0 : options.taskBar) || void 0 === _6 ? void 0 : _6.barStyle) ? options.taskBar.barStyle : Object.assign({}, defaultTaskBarStyle, null === (_7 = null == options ? void 0 : options.taskBar) || void 0 === _7 ? void 0 : _7.barStyle), 
    gantt.parsedOptions.projectBarStyle = (null === (_8 = null == options ? void 0 : options.taskBar) || void 0 === _8 ? void 0 : _8.projectStyle) && "function" == typeof (null === (_9 = null == options ? void 0 : options.taskBar) || void 0 === _9 ? void 0 : _9.projectStyle) ? options.taskBar.projectStyle : (null === (_10 = null == options ? void 0 : options.taskBar) || void 0 === _10 ? void 0 : _10.projectStyle) ? Object.assign({}, defaultTaskBarStyle, null === (_11 = null == options ? void 0 : options.taskBar) || void 0 === _11 ? void 0 : _11.projectStyle) : gantt.parsedOptions.taskBarStyle, 
    gantt.parsedOptions.baselineStyle = (null === (_12 = null == options ? void 0 : options.taskBar) || void 0 === _12 ? void 0 : _12.baselineStyle) && "function" == typeof (null === (_13 = null == options ? void 0 : options.taskBar) || void 0 === _13 ? void 0 : _13.baselineStyle) ? options.taskBar.baselineStyle : Object.assign({}, defaultBaselineStyle, null === (_14 = null == options ? void 0 : options.taskBar) || void 0 === _14 ? void 0 : _14.baselineStyle);
    gantt.parsedOptions.taskBarMilestoneStyle = Object.assign("function" == typeof gantt.parsedOptions.taskBarStyle ? {} : {
        width: gantt.parsedOptions.taskBarStyle.width,
        borderColor: gantt.parsedOptions.taskBarStyle.borderColor,
        borderLineWidth: null !== (_15 = gantt.parsedOptions.taskBarStyle.borderLineWidth) && void 0 !== _15 ? _15 : 1,
        fillColor: gantt.parsedOptions.taskBarStyle.barColor,
        cornerRadius: 0
    }, {
        labelTextStyle: {
            fontSize: 16,
            color: "red",
            fontFamily: "Arial",
            padding: 4
        }
    }, null === (_16 = null == options ? void 0 : options.taskBar) || void 0 === _16 ? void 0 : _16.milestoneStyle), 
    gantt.parsedOptions.taskBarMilestoneHypotenuse = gantt.parsedOptions.taskBarMilestoneStyle.width * Math.sqrt(2), 
    gantt.parsedOptions.dateFormat = null == options ? void 0 : options.dateFormat, 
    gantt.parsedOptions.taskBarHoverStyle = Object.assign({
        barOverlayColor: "rgba(99, 144, 0, 0.4)"
    }, null === (_17 = null == options ? void 0 : options.taskBar) || void 0 === _17 ? void 0 : _17.hoverBarStyle), 
    gantt.parsedOptions.taskBarSelectable = null === (_19 = null === (_18 = null == options ? void 0 : options.taskBar) || void 0 === _18 ? void 0 : _18.selectable) || void 0 === _19 || _19, 
    gantt.parsedOptions.taskBarSelectedStyle = Object.assign("function" == typeof gantt.parsedOptions.taskBarStyle ? {
        shadowBlur: 6,
        shadowOffsetX: 0,
        shadowOffsetY: 0,
        borderLineWidth: 1
    } : {
        shadowBlur: 6,
        shadowOffsetX: 0,
        shadowOffsetY: 0,
        shadowColor: gantt.parsedOptions.taskBarStyle.barColor,
        borderColor: gantt.parsedOptions.taskBarStyle.barColor,
        borderLineWidth: 1
    }, null === (_20 = null == options ? void 0 : options.taskBar) || void 0 === _20 ? void 0 : _20.selectedBarStyle), 
    gantt.parsedOptions.taskBarLabelText = null !== (_22 = null === (_21 = null == options ? void 0 : options.taskBar) || void 0 === _21 ? void 0 : _21.labelText) && void 0 !== _22 ? _22 : "", 
    gantt.parsedOptions.taskBarMoveable = null === (_24 = null === (_23 = null == options ? void 0 : options.taskBar) || void 0 === _23 ? void 0 : _23.moveable) || void 0 === _24 || _24, 
    gantt.parsedOptions.moveTaskBarToExtendDateRange = null === (_26 = null === (_25 = null == options ? void 0 : options.taskBar) || void 0 === _25 ? void 0 : _25.moveToExtendDateRange) || void 0 === _26 || _26, 
    gantt.parsedOptions.taskBarResizable = null === (_28 = null === (_27 = null == options ? void 0 : options.taskBar) || void 0 === _27 ? void 0 : _27.resizable) || void 0 === _28 || _28, 
    gantt.parsedOptions.taskBarProgressAdjustable = null !== (_30 = null === (_29 = null == options ? void 0 : options.taskBar) || void 0 === _29 ? void 0 : _29.progressAdjustable) && void 0 !== _30 && _30, 
    gantt.parsedOptions.taskBarDragOrder = null === (_32 = null === (_31 = null == options ? void 0 : options.taskBar) || void 0 === _31 ? void 0 : _31.dragOrder) || void 0 === _32 || _32, 
    gantt.parsedOptions.taskBarLabelStyle = {
        fontFamily: null !== (_35 = null === (_34 = null === (_33 = null == options ? void 0 : options.taskBar) || void 0 === _33 ? void 0 : _33.labelTextStyle) || void 0 === _34 ? void 0 : _34.fontFamily) && void 0 !== _35 ? _35 : "Arial",
        fontSize: null !== (_38 = null === (_37 = null === (_36 = null == options ? void 0 : options.taskBar) || void 0 === _36 ? void 0 : _36.labelTextStyle) || void 0 === _37 ? void 0 : _37.fontSize) && void 0 !== _38 ? _38 : 20,
        color: null !== (_41 = null === (_40 = null === (_39 = null == options ? void 0 : options.taskBar) || void 0 === _39 ? void 0 : _39.labelTextStyle) || void 0 === _40 ? void 0 : _40.color) && void 0 !== _41 ? _41 : "#F01",
        outsideColor: null !== (_44 = null === (_43 = null === (_42 = null == options ? void 0 : options.taskBar) || void 0 === _42 ? void 0 : _42.labelTextStyle) || void 0 === _43 ? void 0 : _43.outsideColor) && void 0 !== _44 ? _44 : "#333333",
        textAlign: null !== (_47 = null === (_46 = null === (_45 = null == options ? void 0 : options.taskBar) || void 0 === _45 ? void 0 : _45.labelTextStyle) || void 0 === _46 ? void 0 : _46.textAlign) && void 0 !== _47 ? _47 : "left",
        textBaseline: null !== (_50 = null === (_49 = null === (_48 = null == options ? void 0 : options.taskBar) || void 0 === _48 ? void 0 : _48.labelTextStyle) || void 0 === _49 ? void 0 : _49.textBaseline) && void 0 !== _50 ? _50 : "middle",
        padding: null !== (_53 = null === (_52 = null === (_51 = null == options ? void 0 : options.taskBar) || void 0 === _51 ? void 0 : _51.labelTextStyle) || void 0 === _52 ? void 0 : _52.padding) && void 0 !== _53 ? _53 : [ 0, 0, 0, 10 ],
        textOverflow: null === (_55 = null === (_54 = null == options ? void 0 : options.taskBar) || void 0 === _54 ? void 0 : _54.labelTextStyle) || void 0 === _55 ? void 0 : _55.textOverflow,
        orient: null === (_57 = null === (_56 = null == options ? void 0 : options.taskBar) || void 0 === _56 ? void 0 : _56.labelTextStyle) || void 0 === _57 ? void 0 : _57.orient,
        orientHandleWithOverflow: null === (_59 = null === (_58 = null == options ? void 0 : options.taskBar) || void 0 === _58 ? void 0 : _58.labelTextStyle) || void 0 === _59 ? void 0 : _59.orientHandleWithOverflow
    }, gantt.parsedOptions.taskBarCustomLayout = null === (_60 = null == options ? void 0 : options.taskBar) || void 0 === _60 ? void 0 : _60.customLayout, 
    gantt.parsedOptions.taskBarCreatable = null !== (_62 = null === (_61 = null == options ? void 0 : options.taskBar) || void 0 === _61 ? void 0 : _61.scheduleCreatable) && void 0 !== _62 ? _62 : !(gantt.parsedOptions.tasksShowMode !== TasksShowMode.Sub_Tasks_Separate && gantt.parsedOptions.tasksShowMode !== TasksShowMode.Tasks_Separate), 
    gantt.parsedOptions.taskBarCreationButtonStyle = Object.assign({
        lineColor: "rgb(99, 144, 0)",
        lineWidth: 1,
        lineDash: [ 5, 5 ],
        cornerRadius: 4,
        backgroundColor: "#FFF"
    }, null === (_64 = null === (_63 = null == options ? void 0 : options.taskBar) || void 0 === _63 ? void 0 : _63.scheduleCreation) || void 0 === _64 ? void 0 : _64.buttonStyle), 
    gantt.parsedOptions.taskBarCreationCustomLayout = null === (_66 = null === (_65 = null == options ? void 0 : options.taskBar) || void 0 === _65 ? void 0 : _65.scheduleCreation) || void 0 === _66 ? void 0 : _66.customLayout, 
    gantt.parsedOptions.taskBarCreationMaxWidth = null === (_68 = null === (_67 = null == options ? void 0 : options.taskBar) || void 0 === _67 ? void 0 : _67.scheduleCreation) || void 0 === _68 ? void 0 : _68.maxWidth, 
    gantt.parsedOptions.taskBarCreationMinWidth = null === (_70 = null === (_69 = null == options ? void 0 : options.taskBar) || void 0 === _69 ? void 0 : _69.scheduleCreation) || void 0 === _70 ? void 0 : _70.minWidth, 
    gantt.parsedOptions.outerFrameStyle = Object.assign({
        borderColor: "#e1e4e8",
        borderLineWidth: 1,
        cornerRadius: 4
    }, null === (_71 = options.frame) || void 0 === _71 ? void 0 : _71.outerFrameStyle), 
    gantt.parsedOptions.markLine = generateMarkLine(null == options ? void 0 : options.markLine), 
    null !== (_73 = null === (_72 = gantt.parsedOptions.markLine) || void 0 === _72 ? void 0 : _72.length) && void 0 !== _73 && _73 && ((null === (_74 = gantt.parsedOptions.markLine) || void 0 === _74 ? void 0 : _74.every((item => void 0 === item.scrollToMarkLine))) && (gantt.parsedOptions.markLine[0].scrollToMarkLine = !0), 
    (null === (_75 = gantt.parsedOptions.markLine) || void 0 === _75 ? void 0 : _75.find((item => item.scrollToMarkLine))) && (gantt.parsedOptions.scrollToMarkLineDate = getStartDateByTimeUnit(new Date(null === (_76 = gantt.parsedOptions.markLine) || void 0 === _76 ? void 0 : _76.find((item => item.scrollToMarkLine)).date), minTimeUnit, startOfWeek))), 
    gantt.parsedOptions.verticalSplitLineHighlight = null === (_77 = options.frame) || void 0 === _77 ? void 0 : _77.verticalSplitLineHighlight, 
    gantt.parsedOptions.verticalSplitLine = Object.assign({
        lineColor: null === (_78 = gantt.parsedOptions.outerFrameStyle) || void 0 === _78 ? void 0 : _78.borderColor,
        lineWidth: null === (_79 = gantt.parsedOptions.outerFrameStyle) || void 0 === _79 ? void 0 : _79.borderLineWidth
    }, null === (_80 = options.frame) || void 0 === _80 ? void 0 : _80.verticalSplitLine), 
    gantt.parsedOptions.horizontalSplitLine = null === (_81 = options.frame) || void 0 === _81 ? void 0 : _81.horizontalSplitLine, 
    gantt.parsedOptions.verticalSplitLineMoveable = null === (_82 = options.frame) || void 0 === _82 ? void 0 : _82.verticalSplitLineMoveable, 
    gantt.parsedOptions.taskKeyField = null !== (_83 = options.taskKeyField) && void 0 !== _83 ? _83 : "id", 
    gantt.parsedOptions.dependencyLinks = null !== (_85 = null === (_84 = options.dependency) || void 0 === _84 ? void 0 : _84.links) && void 0 !== _85 ? _85 : [], 
    gantt.parsedOptions.dependencyLinkCreatable = null !== (_87 = null === (_86 = options.dependency) || void 0 === _86 ? void 0 : _86.linkCreatable) && void 0 !== _87 && _87, 
    gantt.parsedOptions.dependencyLinkSelectable = null === (_89 = null === (_88 = options.dependency) || void 0 === _88 ? void 0 : _88.linkSelectable) || void 0 === _89 || _89, 
    gantt.parsedOptions.dependencyLinkDeletable = null !== (_91 = null === (_90 = options.dependency) || void 0 === _90 ? void 0 : _90.linkDeletable) && void 0 !== _91 && _91, 
    gantt.parsedOptions.dependencyLinkLineStyle = Object.assign({
        lineColor: "red",
        lineWidth: 1
    }, null === (_92 = options.dependency) || void 0 === _92 ? void 0 : _92.linkLineStyle), 
    gantt.parsedOptions.dependencyLinkSelectedLineStyle = Object.assign({
        shadowBlur: 4,
        shadowOffset: 0,
        shadowColor: gantt.parsedOptions.dependencyLinkLineStyle.lineColor,
        lineColor: gantt.parsedOptions.dependencyLinkLineStyle.lineColor,
        lineWidth: gantt.parsedOptions.dependencyLinkLineStyle.lineWidth
    }, null === (_93 = null == options ? void 0 : options.dependency) || void 0 === _93 ? void 0 : _93.linkSelectedLineStyle), 
    gantt.parsedOptions.dependencyLinkLineCreatePointStyle = Object.assign({
        strokeColor: "red",
        fillColor: "white",
        radius: 5,
        strokeWidth: 1
    }, null === (_94 = null == options ? void 0 : options.dependency) || void 0 === _94 ? void 0 : _94.linkCreatePointStyle), 
    gantt.parsedOptions.dependencyLinkLineCreatingPointStyle = Object.assign({
        strokeColor: "red",
        fillColor: "red",
        radius: 5,
        strokeWidth: 1
    }, null === (_95 = null == options ? void 0 : options.dependency) || void 0 === _95 ? void 0 : _95.linkCreatingPointStyle), 
    gantt.parsedOptions.dependencyLinkLineCreatingStyle = Object.assign({
        lineColor: "red",
        lineWidth: 1,
        lineDash: [ 5, 5 ]
    }, null === (_96 = null == options ? void 0 : options.dependency) || void 0 === _96 ? void 0 : _96.linkCreatingLineStyle), 
    gantt.parsedOptions.dependencyLinkDistanceToTaskBar = null !== (_98 = null === (_97 = null == options ? void 0 : options.dependency) || void 0 === _97 ? void 0 : _97.distanceToTaskBar) && void 0 !== _98 ? _98 : 20, 
    gantt.parsedOptions.eventOptions = null == options ? void 0 : options.eventOptions, 
    gantt.parsedOptions.keyboardOptions = null == options ? void 0 : options.keyboardOptions, 
    gantt.parsedOptions.markLineCreateOptions = null == options ? void 0 : options.markLineCreateOptions;
}

export function updateOptionsWhenScaleChanged(gantt) {
    var _a, _b, _c, _d;
    const options = gantt.options, {unit: minTimeUnit, startOfWeek: startOfWeek, step: step} = gantt.parsedOptions.reverseSortedTimelineScales[0];
    gantt.parsedOptions.minDate = getStartDateByTimeUnit(new Date(gantt.parsedOptions.minDate), minTimeUnit, startOfWeek), 
    gantt.parsedOptions.maxDate = getEndDateByTimeUnit(gantt.parsedOptions.minDate, new Date(gantt.parsedOptions.maxDate), minTimeUnit, step), 
    gantt.parsedOptions._minDateTime = null === (_a = gantt.parsedOptions.minDate) || void 0 === _a ? void 0 : _a.getTime(), 
    gantt.parsedOptions._maxDateTime = null === (_b = gantt.parsedOptions.maxDate) || void 0 === _b ? void 0 : _b.getTime(), 
    gantt.parsedOptions.timeLineHeaderRowHeights = [], gantt.parsedOptions.timelineHeaderStyles = [];
    for (let i = 0; i < gantt.parsedOptions.sortedTimelineScales.length; i++) {
        const style = gantt.parsedOptions.sortedTimelineScales[i].style;
        gantt.parsedOptions.timelineHeaderStyles.push(Object.assign({
            fontSize: 20,
            fontWeight: "bold",
            textAlign: "center",
            textBaseline: "middle",
            color: "#000",
            backgroundColor: "#fff"
        }, style)), gantt.parsedOptions.timeLineHeaderRowHeights.push(null !== (_d = null !== (_c = gantt.parsedOptions.sortedTimelineScales[i].rowHeight) && void 0 !== _c ? _c : null == options ? void 0 : options.headerRowHeight) && void 0 !== _d ? _d : 40);
    }
}

export function generateTimeLineDate(currentDate, endDate, scale) {
    var _a;
    const {unit: unit, step: step, format: format} = scale, timelineDates = [];
    for (;currentDate < endDate; ) if ("day" === unit) {
        const year = currentDate.getFullYear(), month = currentDate.getMonth(), day = currentDate.getDate(), end = createDateAtLastHour(new Date(year, month, day + step - 1), !0);
        end.getTime() > endDate.getTime() && end.setTime(endDate.getTime());
        const start = currentDate, columnTitle = (null == format ? void 0 : format({
            dateIndex: day,
            startDate: start,
            endDate: end
        })) || day.toString(), dayCellConfig = {
            days: Math.abs(end.getTime() - currentDate.getTime() + 1) / 864e5,
            startDate: start,
            endDate: end,
            step: step,
            unit: "day",
            title: columnTitle,
            dateIndex: day
        };
        timelineDates.push(dayCellConfig), currentDate = new Date(year, month, day + step);
    } else if ("month" === unit) {
        const year = currentDate.getFullYear(), month = currentDate.getMonth(), end = createDateAtLastHour(new Date(year, month + step, 0), !0);
        end.getTime() > endDate.getTime() && end.setTime(endDate.getTime());
        const start = currentDate, columnTitle = (null == format ? void 0 : format({
            dateIndex: month + 1,
            startDate: start,
            endDate: end
        })) || (month + 1).toString(), dayCellConfig = {
            days: Math.abs(end.getTime() - currentDate.getTime() + 1) / 864e5,
            startDate: start,
            step: step,
            unit: "month",
            endDate: end,
            title: columnTitle,
            dateIndex: month + 1
        };
        timelineDates.push(dayCellConfig), currentDate = new Date(year, month + step, 1);
    } else if ("quarter" === unit) {
        const year = currentDate.getFullYear(), quarter = Math.floor(currentDate.getMonth() / 3), end = createDateAtLastHour(new Date(year, 3 * (quarter + step), 0), !0);
        end.getTime() > endDate.getTime() && end.setTime(endDate.getTime());
        const start = currentDate, columnTitle = (null == format ? void 0 : format({
            dateIndex: quarter + 1,
            startDate: start,
            endDate: end
        })) || (quarter + 1).toString(), dayCellConfig = {
            days: Math.abs(end.getTime() - currentDate.getTime() + 1) / 864e5,
            startDate: start,
            step: step,
            unit: "quarter",
            endDate: end,
            title: columnTitle,
            dateIndex: quarter + 1
        };
        timelineDates.push(dayCellConfig), currentDate = new Date(year, 3 * (quarter + step), 1);
    } else if ("year" === unit) {
        const year = currentDate.getFullYear(), end = createDateAtLastHour(new Date(year + step - 1, 11, 31), !0);
        end.getTime() > endDate.getTime() && end.setTime(endDate.getTime());
        const start = currentDate, columnTitle = (null == format ? void 0 : format({
            dateIndex: year,
            startDate: start,
            endDate: end
        })) || year.toString(), dayCellConfig = {
            days: Math.abs(end.getTime() - currentDate.getTime() + 1) / 864e5,
            startDate: start,
            endDate: end,
            step: step,
            unit: "year",
            title: columnTitle,
            dateIndex: year
        };
        timelineDates.push(dayCellConfig), currentDate = new Date(year + step, 0, 1);
    } else if ("week" === unit) {
        const startOfWeekSetting = null !== (_a = scale.startOfWeek) && void 0 !== _a ? _a : "monday";
        let dayOfWeek = currentDate.getDay();
        "monday" === startOfWeekSetting && (dayOfWeek = 0 === dayOfWeek ? 6 : dayOfWeek - 1);
        const startOfWeek = createDateAtMidnight(currentDate), dateEnd = createDateAtLastHour(currentDate.getTime() + 24 * (7 * step - dayOfWeek) * 60 * 60 * 1e3 - 1, !0);
        dateEnd > endDate && dateEnd.setTime(endDate.getTime());
        const weekNumber = getWeekNumber(startOfWeek), columnTitle = (null == format ? void 0 : format({
            dateIndex: weekNumber,
            startDate: startOfWeek,
            endDate: dateEnd
        })) || weekNumber.toString(), dayCellConfig = {
            days: (dateEnd.getTime() - startOfWeek.getTime() + 1) / 864e5,
            startDate: startOfWeek,
            endDate: dateEnd,
            step: step,
            unit: "week",
            title: columnTitle,
            dateIndex: weekNumber
        };
        timelineDates.push(dayCellConfig), currentDate.setTime(createDateAtMidnight(currentDate.getTime() + 24 * (7 * step - dayOfWeek) * 60 * 60 * 1e3, !0).getTime());
    } else if ("hour" === unit) {
        const year = currentDate.getFullYear(), month = currentDate.getMonth(), day = currentDate.getDate(), hour = currentDate.getHours(), end = createDateAtLastMinute(new Date(year, month, day, hour + step - 1), !0);
        end.getTime() > endDate.getTime() && end.setTime(endDate.getTime());
        const start = currentDate, columnTitle = (null == format ? void 0 : format({
            dateIndex: hour,
            startDate: start,
            endDate: end
        })) || hour.toString(), dayCellConfig = {
            days: Math.abs(end.getTime() - currentDate.getTime() + 1) / 864e5,
            startDate: start,
            endDate: end,
            step: step,
            unit: "hour",
            title: columnTitle,
            dateIndex: currentDate.getHours()
        };
        timelineDates.push(dayCellConfig), currentDate = new Date(year, month, day, hour + step);
    } else if ("minute" === unit) {
        const year = currentDate.getFullYear(), month = currentDate.getMonth(), day = currentDate.getDate(), hour = currentDate.getHours(), minute = currentDate.getMinutes(), end = createDateAtLastSecond(new Date(year, month, day, hour, minute + step - 1), !0);
        end.getTime() > endDate.getTime() && end.setTime(endDate.getTime());
        const start = currentDate, columnTitle = (null == format ? void 0 : format({
            dateIndex: minute,
            startDate: start,
            endDate: end
        })) || minute.toString(), dayCellConfig = {
            days: Math.abs(end.getTime() - currentDate.getTime() + 1) / 864e5,
            startDate: start,
            endDate: end,
            step: step,
            unit: "minute",
            title: columnTitle,
            dateIndex: currentDate.getMinutes()
        };
        timelineDates.push(dayCellConfig), currentDate = new Date(year, month, day, hour, minute + step);
    } else if ("second" === unit) {
        const year = currentDate.getFullYear(), month = currentDate.getMonth(), day = currentDate.getDate(), hour = currentDate.getHours(), minute = currentDate.getMinutes(), second = currentDate.getSeconds(), end = createDateAtLastMillisecond(new Date(year, month, day, hour, minute, second + step - 1), !0);
        end.getTime() > endDate.getTime() && end.setTime(endDate.getTime());
        const start = currentDate, columnTitle = (null == format ? void 0 : format({
            dateIndex: second,
            startDate: start,
            endDate: end
        })) || second.toString(), dayCellConfig = {
            days: Math.abs(end.getTime() - currentDate.getTime() + 1) / 864e5,
            startDate: start,
            endDate: end,
            step: step,
            unit: "second",
            title: columnTitle,
            dateIndex: currentDate.getSeconds()
        };
        timelineDates.push(dayCellConfig), currentDate = new Date(year, month, day, hour, minute, second + step);
    }
    return timelineDates;
}

export function getTextPos(padding, textAlign, textBaseline, width, height) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
    let textX = null !== (_a = padding[3]) && void 0 !== _a ? _a : 10;
    "right" === textAlign || "end" === textAlign ? textX = width - 0 - (null !== (_b = padding[1]) && void 0 !== _b ? _b : 10) : "center" === textAlign && (textX = 0 + (width - 0 + (null !== (_c = padding[3]) && void 0 !== _c ? _c : 10) - (null !== (_d = padding[1]) && void 0 !== _d ? _d : 10)) / 2);
    let textY = 0 + (null !== (_e = padding[0]) && void 0 !== _e ? _e : 10);
    return "bottom" === textBaseline || "alphabetic" === textBaseline || "ideographic" === textBaseline ? textY = height - 0 - (null !== (_f = padding[2]) && void 0 !== _f ? _f : 10) : "middle" === textBaseline && (textY = 0 + (height - 0 - (null !== (_g = padding[0]) && void 0 !== _g ? _g : 10) - (null !== (_h = padding[2]) && void 0 !== _h ? _h : 10)) / 2 + (null !== (_j = padding[0]) && void 0 !== _j ? _j : 10)), 
    {
        x: textX,
        y: textY
    };
}

export function convertProgress(progress) {
    return "string" == typeof progress && (progress = progress.replace("%", ""), progress = parseFloat(progress)), 
    isNaN(progress) ? 0 : Math.max(0, Math.min(100, Math.round(10 * progress) / 10));
}

export function createSplitLineAndResizeLine(gantt) {
    if (gantt.taskListTableInstance) {
        gantt.verticalSplitResizeLine = document.createElement("div"), gantt.verticalSplitResizeLine.style.position = "absolute", 
        gantt.verticalSplitResizeLine.style.top = gantt.tableY + "px", gantt.verticalSplitResizeLine.style.left = (-1 !== gantt.taskTableWidth ? gantt.taskTableWidth - 7 + gantt.parsedOptions.verticalSplitLine.lineWidth / 2 : 0) + "px", 
        gantt.verticalSplitResizeLine.style.width = "14px", gantt.verticalSplitResizeLine.style.height = gantt.drawHeight + "px", 
        gantt.verticalSplitResizeLine.style.backgroundColor = "rgba(0,0,0,0)", gantt.verticalSplitResizeLine.style.zIndex = "100", 
        gantt.parsedOptions.verticalSplitLineMoveable && (gantt.verticalSplitResizeLine.style.cursor = "col-resize"), 
        gantt.verticalSplitResizeLine.style.userSelect = "none", gantt.verticalSplitResizeLine.style.opacity = "1";
        const verticalSplitLine = document.createElement("div");
        if (verticalSplitLine.style.position = "absolute", verticalSplitLine.style.top = "0px", 
        verticalSplitLine.style.left = (14 - gantt.parsedOptions.verticalSplitLine.lineWidth) / 2 + "px", 
        verticalSplitLine.style.width = gantt.parsedOptions.verticalSplitLine.lineWidth + "px", 
        verticalSplitLine.style.height = "100%", verticalSplitLine.style.backgroundColor = gantt.parsedOptions.verticalSplitLine.lineColor, 
        verticalSplitLine.style.zIndex = "100", verticalSplitLine.style.userSelect = "none", 
        verticalSplitLine.style.pointerEvents = "none", verticalSplitLine.style.transition = "background-color 0.3s", 
        gantt.verticalSplitResizeLine.appendChild(verticalSplitLine), gantt.parsedOptions.verticalSplitLineHighlight) {
            const highlightLine = document.createElement("div");
            highlightLine.style.position = "absolute", highlightLine.style.top = "0px", highlightLine.style.left = (14 - gantt.parsedOptions.verticalSplitLineHighlight.lineWidth) / 2 + "px", 
            highlightLine.style.width = gantt.parsedOptions.verticalSplitLineHighlight.lineWidth + "px", 
            highlightLine.style.height = "100%", highlightLine.style.backgroundColor = gantt.parsedOptions.verticalSplitLineHighlight.lineColor, 
            highlightLine.style.zIndex = "100", highlightLine.style.cursor = "col-resize", highlightLine.style.userSelect = "none", 
            highlightLine.style.pointerEvents = "none", highlightLine.style.opacity = "0", highlightLine.style.transition = "background-color 0.3s", 
            gantt.verticalSplitResizeLine.appendChild(highlightLine);
        }
        gantt.container.appendChild(gantt.verticalSplitResizeLine);
    }
}

export function updateSplitLineAndResizeLine(gantt) {
    if (gantt.verticalSplitResizeLine) {
        gantt.verticalSplitResizeLine.style.position = "absolute", gantt.verticalSplitResizeLine.style.top = gantt.tableY + "px", 
        gantt.verticalSplitResizeLine.style.left = -1 !== gantt.taskTableWidth ? gantt.taskTableWidth - 7 + gantt.parsedOptions.verticalSplitLine.lineWidth / 2 + "px" : "0px", 
        gantt.verticalSplitResizeLine.style.width = "14px", gantt.verticalSplitResizeLine.style.height = gantt.drawHeight + "px", 
        gantt.verticalSplitResizeLine.style.backgroundColor = "rgba(0,0,0,0)", gantt.verticalSplitResizeLine.style.zIndex = "100", 
        gantt.parsedOptions.verticalSplitLineMoveable && (gantt.verticalSplitResizeLine.style.cursor = "col-resize"), 
        gantt.verticalSplitResizeLine.style.userSelect = "none", gantt.verticalSplitResizeLine.style.opacity = "1";
        const verticalSplitLine = gantt.verticalSplitResizeLine.childNodes[0];
        if (verticalSplitLine.style.position = "absolute", verticalSplitLine.style.top = "0px", 
        verticalSplitLine.style.left = (14 - gantt.parsedOptions.verticalSplitLine.lineWidth) / 2 + "px", 
        verticalSplitLine.style.width = gantt.parsedOptions.verticalSplitLine.lineWidth + "px", 
        verticalSplitLine.style.height = "100%", verticalSplitLine.style.backgroundColor = gantt.parsedOptions.verticalSplitLine.lineColor, 
        verticalSplitLine.style.zIndex = "100", verticalSplitLine.style.userSelect = "none", 
        verticalSplitLine.style.pointerEvents = "none", verticalSplitLine.style.transition = "background-color 0.3s", 
        gantt.verticalSplitResizeLine.childNodes[1]) {
            const highlightLine = gantt.verticalSplitResizeLine.childNodes[1];
            highlightLine.style.position = "absolute", highlightLine.style.top = "0px", highlightLine.style.left = (14 - gantt.parsedOptions.verticalSplitLineHighlight.lineWidth) / 2 + "px", 
            highlightLine.style.width = gantt.parsedOptions.verticalSplitLineHighlight.lineWidth + "px", 
            highlightLine.style.height = "100%", highlightLine.style.backgroundColor = gantt.parsedOptions.verticalSplitLineHighlight.lineColor, 
            highlightLine.style.zIndex = "100", highlightLine.style.cursor = "col-resize", highlightLine.style.userSelect = "none", 
            highlightLine.style.pointerEvents = "none", highlightLine.style.opacity = "0", highlightLine.style.transition = "background-color 0.3s";
        }
    }
}

export function findRecordByTaskKey(records, taskKeyField, taskKey, childrenField = "children") {
    var _a;
    for (let i = 0; i < records.length; i++) {
        if (Array.isArray(taskKey) && 1 === taskKey.length && records[i][taskKeyField] === taskKey[0] || records[i][taskKeyField] === taskKey) return {
            record: records[i],
            index: [ i ]
        };
        if (null === (_a = records[i][childrenField]) || void 0 === _a ? void 0 : _a.length) if (Array.isArray(taskKey) && taskKey[0] === records[i][taskKeyField]) {
            const result = findRecordByTaskKey(records[i][childrenField], taskKeyField, taskKey.slice(1));
            if (result) return result.index.unshift(i), result;
        } else if (!Array.isArray(taskKey)) {
            const result = findRecordByTaskKey(records[i][childrenField], taskKeyField, taskKey);
            if (result) return result.index.unshift(i), result;
        }
    }
}

export function clearRecordLinkInfos(records, childrenField = "children") {
    var _a;
    for (let i = 0; i < records.length; i++) (null === (_a = records[i][childrenField]) || void 0 === _a ? void 0 : _a.length) ? clearRecordLinkInfos(records[i][childrenField], childrenField) : (delete records[i].vtable_gantt_linkedTo, 
    delete records[i].vtable_gantt_linkedFrom);
}

export function clearRecordShowIndex(records, childrenField = "children") {
    var _a;
    for (let i = 0; i < records.length; i++) (null === (_a = records[i][childrenField]) || void 0 === _a ? void 0 : _a.length) ? clearRecordShowIndex(records[i][childrenField], childrenField) : delete records[i].vtable_gantt_showIndex;
}

export function getTaskIndexsByTaskY(y, gantt) {
    var _a;
    let task_index, sub_task_index;
    if (gantt.taskListTableInstance) {
        const rowInfo = gantt.taskListTableInstance.getTargetRowAt(y + gantt.headerHeight);
        if (rowInfo) {
            const {row: row} = rowInfo;
            task_index = row - gantt.taskListTableInstance.columnHeaderLevelCount;
            const beforeRowsHeight = gantt.getRowsHeightByIndex(0, task_index - 1);
            if (gantt.parsedOptions.tasksShowMode === TasksShowMode.Sub_Tasks_Inline || gantt.parsedOptions.tasksShowMode === TasksShowMode.Sub_Tasks_Arrange || gantt.parsedOptions.tasksShowMode === TasksShowMode.Sub_Tasks_Compact || gantt.parsedOptions.tasksShowMode === TasksShowMode.Sub_Tasks_Separate) sub_task_index = Math.floor((y - beforeRowsHeight) / gantt.parsedOptions.rowHeight); else if (gantt.parsedOptions.tasksShowMode === TasksShowMode.Project_Sub_Tasks_Inline) {
                const record = gantt.getRecordByIndex(task_index);
                if (record && record.type === TaskType.PROJECT && (null === (_a = record.children) || void 0 === _a ? void 0 : _a.length) > 0) {
                    "expand" === record.hierarchyState || !1 === gantt.parsedOptions.projectSubTasksExpandable || (sub_task_index = Math.floor((y - beforeRowsHeight) / gantt.parsedOptions.rowHeight));
                }
            }
        }
    } else task_index = Math.floor(y / gantt.parsedOptions.rowHeight);
    return {
        task_index: task_index,
        sub_task_index: sub_task_index
    };
}

export function computeRowsCountByRecordDateForCompact(gantt, record) {
    var _a;
    if (!record.children || record.children.length <= 1) return 1 === (null === (_a = record.children) || void 0 === _a ? void 0 : _a.length) ? record.children[0].vtable_gantt_showIndex = 0 : record.vtable_gantt_showIndex = 0, 
    1;
    const sortedChildren = record.children.slice().sort(((a, b) => {
        const {startDate: aStartDate} = formatRecordDateConsiderHasHour(gantt, a), {startDate: bStartDate} = formatRecordDateConsiderHasHour(gantt, b);
        return aStartDate.getTime() - bStartDate.getTime();
    })), rows = [];
    for (let i = 0; i <= sortedChildren.length - 1; i++) {
        const newRecord = sortedChildren[i], {startDate: startDate, endDate: endDate} = formatRecordDateConsiderHasHour(gantt, newRecord);
        let placed = !1;
        for (let j = 0; j < rows.length; j++) if (startDate.getTime() > rows[j]) {
            rows[j] = endDate.getTime(), placed = !0, newRecord.vtable_gantt_showIndex = j;
            break;
        }
        placed || (rows.push(endDate.getTime()), newRecord.vtable_gantt_showIndex = rows.length - 1);
    }
    return rows.length;
}

function isOverlapping(startDate, endDate, rowTasks, gantt) {
    return rowTasks.some((rowTask => {
        const {startDate: startDate2, endDate: endDate2} = formatRecordDateConsiderHasHour(gantt, rowTask);
        return startDate <= endDate2 && startDate2 <= endDate;
    }));
}

export function computeRowsCountByRecordDate(gantt, record) {
    var _a;
    if (!record.children || record.children.length <= 1) return 1 === (null === (_a = record.children) || void 0 === _a ? void 0 : _a.length) ? record.children[0].vtable_gantt_showIndex = 0 : record.vtable_gantt_showIndex = 0, 
    1;
    const rows = [];
    for (let i = 0; i <= record.children.length - 1; i++) {
        const newRecord = record.children[i], {startDate: startDate, endDate: endDate} = formatRecordDateConsiderHasHour(gantt, newRecord);
        let placed = !1;
        for (let j = 0; j < rows.length; j++) {
            if (!isOverlapping(startDate, endDate, record.children.filter((t => t !== newRecord && t.vtable_gantt_showIndex === j)), gantt)) {
                rows[j] = endDate.getTime(), placed = !0, newRecord.vtable_gantt_showIndex = j;
                break;
            }
        }
        placed || (rows.push(endDate.getTime()), newRecord.vtable_gantt_showIndex = rows.length - 1);
    }
    return rows.length;
}

export function getSubTaskRowIndexByRecordDate(record, childIndex, startDateField, endDateField) {
    if (0 === childIndex) return 0;
    const rows = [];
    if (null == record ? void 0 : record.children) for (let i = 0; i <= record.children.length - 1; i++) {
        const newRecord = record.children[i], startDate = createDateAtMidnight(newRecord[startDateField]).getTime(), endDate = createDateAtMidnight(newRecord[endDateField]).getTime();
        let placed = !1;
        for (let j = 0; j < rows.length; j++) if (startDate > rows[j]) {
            if (rows[j] = endDate, placed = !0, i === childIndex) return j;
            break;
        }
        if (placed || rows.push(endDate), i === childIndex) return rows.length - 1;
    }
    return 0;
}

export function formatRecordDateConsiderHasHour(gantt, record) {
    const {timeScaleIncludeHour: timeScaleIncludeHour, startDateField: startDateField, endDateField: endDateField} = gantt.parsedOptions, startDate = record[startDateField], endDate = record[endDateField];
    return timeScaleIncludeHour ? {
        startDate: createDateAtMidnight(startDate),
        endDate: createDateAtLastHour(endDate)
    } : {
        startDate: createDateAtMidnight(startDate, !0),
        endDate: createDateAtLastHour(endDate, !0)
    };
}

export function updateOptionsWhenRecordChanged(gantt) {
    var _a, _b, _c, _d, _e, _f, _g;
    const options = gantt.options, {unit: minTimeUnit, startOfWeek: startOfWeek} = gantt.parsedOptions.reverseSortedTimelineScales[0];
    gantt.parsedOptions.markLine = generateMarkLine(null == options ? void 0 : options.markLine), 
    null !== (_b = null === (_a = gantt.parsedOptions.markLine) || void 0 === _a ? void 0 : _a.length) && void 0 !== _b && _b && ((null === (_c = gantt.parsedOptions.markLine) || void 0 === _c ? void 0 : _c.every((item => void 0 === item.scrollToMarkLine))) && (gantt.parsedOptions.markLine[0].scrollToMarkLine = !0), 
    (null === (_d = gantt.parsedOptions.markLine) || void 0 === _d ? void 0 : _d.find((item => item.scrollToMarkLine))) && (gantt.parsedOptions.scrollToMarkLineDate = getStartDateByTimeUnit(new Date(null === (_e = gantt.parsedOptions.markLine) || void 0 === _e ? void 0 : _e.find((item => item.scrollToMarkLine)).date), minTimeUnit, startOfWeek))), 
    gantt.parsedOptions.dependencyLinks = null !== (_g = null === (_f = options.dependency) || void 0 === _f ? void 0 : _f.links) && void 0 !== _g ? _g : [];
}

export function updateOptionsWhenDateRangeChanged(gantt) {
    var _a, _b;
    const options = gantt.options, {unit: minTimeUnit, startOfWeek: startOfWeek, step: step} = gantt.parsedOptions.reverseSortedTimelineScales[0];
    gantt.parsedOptions.minDate = (null == options ? void 0 : options.minDate) ? getStartDateByTimeUnit(new Date(options.minDate), minTimeUnit, startOfWeek) : void 0, 
    gantt.parsedOptions.maxDate = (null == options ? void 0 : options.maxDate) ? getEndDateByTimeUnit(gantt.parsedOptions.minDate, new Date(options.maxDate), minTimeUnit, step) : void 0, 
    gantt.parsedOptions._minDateTime = null === (_a = gantt.parsedOptions.minDate) || void 0 === _a ? void 0 : _a.getTime(), 
    gantt.parsedOptions._maxDateTime = null === (_b = gantt.parsedOptions.maxDate) || void 0 === _b ? void 0 : _b.getTime();
}

export function updateOptionsWhenMarkLineChanged(gantt) {
    const options = gantt.options;
    gantt.parsedOptions.markLine = generateMarkLine(null == options ? void 0 : options.markLine);
}

export function _getTaskInfoByXYForCreateSchedule(eventX, eventY, gantt) {
    const taskIndex = getTaskIndexsByTaskY(eventY - gantt.headerHeight + gantt.stateManager.scrollTop, gantt), recordParent = gantt.getRecordByIndex(taskIndex.task_index), dateIndex = getDateIndexByX(eventX, gantt), dateRange = gantt.getDateRangeByIndex(dateIndex);
    if (null == recordParent ? void 0 : recordParent.children) {
        const taskIndex = getTaskIndexsByTaskY(eventY - gantt.headerHeight + gantt.stateManager.scrollTop, gantt);
        for (let i = 0; i < recordParent.children.length; i++) {
            const {startDate: startDate, endDate: endDate, taskDays: taskDays, progress: progress, taskRecord: taskRecord} = gantt.getTaskInfoByTaskListIndex(taskIndex.task_index, i);
            if (((gantt.parsedOptions.tasksShowMode === TasksShowMode.Sub_Tasks_Compact || gantt.parsedOptions.tasksShowMode === TasksShowMode.Sub_Tasks_Arrange) && taskRecord.vtable_gantt_showIndex === taskIndex.sub_task_index || gantt.parsedOptions.tasksShowMode === TasksShowMode.Sub_Tasks_Inline || gantt.parsedOptions.tasksShowMode === TasksShowMode.Project_Sub_Tasks_Inline && recordParent.type === TaskType.PROJECT && "expand" !== recordParent.hierarchyState && !1 !== gantt.parsedOptions.projectSubTasksExpandable) && startDate && endDate && dateRange.startDate.getTime() >= startDate.getTime() && dateRange.endDate.getTime() <= endDate.getTime()) return {
                startDate: startDate,
                endDate: endDate,
                taskDays: taskDays,
                progress: progress,
                taskRecord: taskRecord
            };
        }
    }
}

export function getNodeClickPos(marklineIconNode, gantt) {
    return {
        left: marklineIconNode.globalTransMatrix.e + gantt.taskListTableInstance.tableNoFrameWidth + gantt.taskListTableInstance.tableX + gantt.tableX,
        top: marklineIconNode.globalTransMatrix.f,
        width: marklineIconNode.attribute.width,
        height: marklineIconNode.attribute.height
    };
}

export function judgeIfHasMarkLine(data, markLine) {
    const beginTime = data.startDate.getTime(), endTime = data.endDate.getTime();
    return markLine.some((item => {
        const marklineTime = new Date(item.date).getTime();
        return marklineTime >= beginTime && marklineTime <= endTime;
    }));
}

export function checkHasChildTasks(gantt, taskIndex, subTaskIndex) {
    const taskRecord = gantt.getRecordByIndex(taskIndex, subTaskIndex);
    return !!((null == taskRecord ? void 0 : taskRecord.children) && taskRecord.children.length > 0);
}

export function initProjectTaskTimes(gantt) {
    if (!gantt.records || 0 === gantt.records.length) return;
    const startDateField = gantt.parsedOptions.startDateField, endDateField = gantt.parsedOptions.endDateField, processTasksRecursively = (records, parentIndex, parentArray) => {
        let earliestStartAll = null, latestEndAll = null;
        return records.forEach(((record, index) => {
            var _a;
            if (!record) return;
            let earliestStart = null, latestEnd = null;
            if (record.children && record.children.length > 0 && record.type === TaskType.PROJECT) {
                const [childrenEarliestStart, childrenLatestEnd] = processTasksRecursively(record.children, index, records);
                if (childrenEarliestStart && childrenLatestEnd && (earliestStart = childrenEarliestStart, 
                latestEnd = childrenLatestEnd, record.type === TaskType.PROJECT)) {
                    const dateFormat = null !== (_a = gantt.parsedOptions.dateFormat) && void 0 !== _a ? _a : gantt.parseTimeFormat(record[startDateField] || record.children[0][startDateField] || ""), formatDateValue = date => gantt.formatDate ? gantt.formatDate(date, dateFormat) : date.toISOString().split("T")[0], updatedRecord = Object.assign({}, record);
                    updatedRecord[startDateField] = formatDateValue(earliestStart), updatedRecord[endDateField] = formatDateValue(latestEnd), 
                    records[index] = updatedRecord;
                }
            } else record[startDateField] && record[endDateField] && (earliestStart = new Date(record[startDateField]), 
            latestEnd = new Date(record[endDateField]));
            earliestStart && (!earliestStartAll || earliestStart < earliestStartAll) && (earliestStartAll = earliestStart), 
            latestEnd && (!latestEndAll || latestEnd > latestEndAll) && (latestEndAll = latestEnd);
        })), [ earliestStartAll, latestEndAll ];
    };
    processTasksRecursively(gantt.records);
}
//# sourceMappingURL=gantt-helper.js.map