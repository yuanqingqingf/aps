import { isValid } from "@visactor/vutils";

import { getTextPos } from "../gantt-helper";

import { toBoxArray } from "../tools/util";

import { Group, Text, createLine, Image } from "@visactor/vtable/es/vrender";

const DEFAULT_MARKLINE_CREATION_ICON = '<svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1471" width="24" height="24"> <path d="M840.05 153.35a27.61875 27.61875 0 0 0-22.95-4.95c-56.25 13.05-218.25 39.6-289.8 2.25-115.65-60.75-241.65-31.95-299.7-13.05V95.75a27.05625 27.05625 0 0 0-27-27 27.05625 27.05625 0 0 0-27 27v834.75c0 14.85 12.15 27 27 27s27-12.15 27-27V611.9c44.1-13.95 199.35-56.25 293.85 1.8 45.9 28.35 96.75 37.8 143.55 37.8 89.1 0 164.7-34.2 169.65-36.45a27.9 27.9 0 0 0 15.75-24.75V174.5a27.5625 27.5625 0 0 0-10.35-21.15z" fill="#f54319" p-id="1472"></path></svg>';

export class TimelineHeader {
    constructor(scene) {
        this._scene = scene, this.initNodes();
    }
    initNodes() {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
        const {_scene: scene} = this, dateHeader = new Group({
            x: 0,
            y: 0,
            width: scene._gantt.getAllDateColsWidth(),
            height: scene._gantt.getAllHeaderRowsHeight(),
            clip: !0,
            pickable: !1
        });
        this.group = dateHeader, dateHeader.name = "date-header-container", scene.ganttGroup.addChild(this.group);
        let y = 0;
        for (let i = 0; i < scene._gantt.timeLineHeaderLevel; i++) {
            const {timelineDates: timelineDates, customLayout: customLayout, visible: visible} = scene._gantt.parsedOptions.sortedTimelineScales[i];
            if (!1 === visible) continue;
            const rowHeader = new Group({
                x: 0,
                y: y,
                width: scene._gantt.getAllDateColsWidth(),
                height: scene._gantt.parsedOptions.timeLineHeaderRowHeights[i],
                clip: !1
            });
            y += rowHeader.attribute.height, rowHeader.name = "row-header", dateHeader.addChild(rowHeader);
            for (let j = 0; j < (null == timelineDates ? void 0 : timelineDates.length); j++) {
                const {days: days, endDate: endDate, startDate: startDate, title: title, dateIndex: dateIndex, unit: unit} = timelineDates[j], x = Math.ceil(scene._gantt.getXByTime(startDate.getTime())), width = Math.ceil(scene._gantt.getXByTime(endDate.getTime() + 1)) - x, date = new Group({
                    x: x,
                    y: 0,
                    width: width,
                    height: rowHeader.attribute.height,
                    clip: !1,
                    fill: scene._gantt.parsedOptions.timelineHeaderBackgroundColor
                });
                let rootContainer;
                date.name = "date-header-cell";
                let renderDefaultText = !0;
                const height = rowHeader.attribute.height;
                if (customLayout) {
                    let customLayoutObj;
                    if ("function" == typeof customLayout) {
                        customLayoutObj = customLayout({
                            width: width,
                            height: height,
                            index: j,
                            startDate: startDate,
                            endDate: endDate,
                            days: days,
                            dateIndex: dateIndex,
                            title: title,
                            ganttInstance: this._scene._gantt
                        });
                    } else customLayoutObj = customLayout;
                    customLayoutObj && (rootContainer = customLayoutObj.rootContainer, renderDefaultText = null !== (_a = customLayoutObj.renderDefaultText) && void 0 !== _a && _a, 
                    rootContainer.name = "task-bar-custom-render"), rootContainer && date.appendChild(rootContainer);
                }
                if (renderDefaultText) {
                    const {padding: padding, textAlign: textAlign, textBaseline: textBaseline, textOverflow: textOverflow, fontSize: fontSize, fontWeight: fontWeight, color: color, strokeColor: strokeColor, textStick: textStick} = scene._gantt.parsedOptions.timelineHeaderStyles[i], position = getTextPos(toBoxArray(padding), textAlign, textBaseline, width, height), text = new Text({
                        x: position.x,
                        y: position.y,
                        maxLineWidth: width,
                        heightLimit: height,
                        pickable: !0,
                        text: title.toLocaleString(),
                        fontSize: fontSize,
                        fontWeight: fontWeight,
                        fill: color,
                        stroke: strokeColor,
                        lineWidth: 2,
                        textAlign: textAlign,
                        textBaseline: textBaseline,
                        ellipsis: "clip" === textOverflow ? "" : "ellipsis" === textOverflow ? "..." : isValid(textOverflow) ? textOverflow : void 0
                    });
                    text.attribute.textStick = textStick, date.appendChild(text), text.name = "date-header-cell-text";
                }
                if (i === scene._gantt.timeLineHeaderLevel - 1 && scene._gantt.parsedOptions.markLineCreateOptions && scene._gantt.parsedOptions.markLineCreateOptions.markLineCreatable) {
                    const markLineStyle = scene._gantt.parsedOptions.markLineCreateOptions.markLineCreationStyle || {}, size = markLineStyle.size || 24, iconSize = markLineStyle.iconSize || 18, marklineCreateIcon = markLineStyle.svg || DEFAULT_MARKLINE_CREATION_ICON, marklineCreateGroup = new Group({
                        x: width / 2 - size / 2,
                        y: height / 2 - size / 2,
                        width: size,
                        height: size,
                        visible: !0
                    });
                    marklineCreateGroup.name = "markline-hover-group", marklineCreateGroup.data = timelineDates[j];
                    const marklineCreateInnerGroup = new Group({
                        x: 0,
                        y: 0,
                        width: size,
                        height: size,
                        cornerRadius: size / 2,
                        fill: markLineStyle.fill || "#ccc",
                        cursor: "pointer",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        visibleAll: !1
                    });
                    marklineCreateInnerGroup.name = "markline-hover-inner-group", marklineCreateGroup.add(marklineCreateInnerGroup);
                    const icon = new Image({
                        width: iconSize,
                        height: iconSize,
                        image: marklineCreateIcon,
                        cursor: "pointer",
                        pickable: !0
                    });
                    icon.name = "markline-hover-icon", marklineCreateInnerGroup.appendChild(icon), date.add(marklineCreateGroup);
                }
                if (rowHeader.addChild(date), j > 0) {
                    const line = createLine({
                        pickable: !1,
                        stroke: null === (_b = scene._gantt.parsedOptions.timelineHeaderVerticalLineStyle) || void 0 === _b ? void 0 : _b.lineColor,
                        lineWidth: null === (_c = scene._gantt.parsedOptions.timelineHeaderVerticalLineStyle) || void 0 === _c ? void 0 : _c.lineWidth,
                        lineDash: null === (_d = scene._gantt.parsedOptions.timelineHeaderVerticalLineStyle) || void 0 === _d ? void 0 : _d.lineDash,
                        points: [ {
                            x: 1 & (null === (_e = scene._gantt.parsedOptions.timelineHeaderVerticalLineStyle) || void 0 === _e ? void 0 : _e.lineWidth) ? .5 : 0,
                            y: 0
                        }, {
                            x: 1 & (null === (_f = scene._gantt.parsedOptions.timelineHeaderVerticalLineStyle) || void 0 === _f ? void 0 : _f.lineWidth) ? .5 : 0,
                            y: rowHeader.attribute.height
                        } ]
                    });
                    date.appendChild(line);
                }
            }
            if (i > 0) {
                const line = createLine({
                    pickable: !1,
                    stroke: null === (_g = scene._gantt.parsedOptions.timelineHeaderHorizontalLineStyle) || void 0 === _g ? void 0 : _g.lineColor,
                    lineWidth: null === (_h = scene._gantt.parsedOptions.timelineHeaderHorizontalLineStyle) || void 0 === _h ? void 0 : _h.lineWidth,
                    lineDash: null === (_j = scene._gantt.parsedOptions.timelineHeaderHorizontalLineStyle) || void 0 === _j ? void 0 : _j.lineDash,
                    points: [ {
                        x: 0,
                        y: 1 & (null === (_k = scene._gantt.parsedOptions.timelineHeaderHorizontalLineStyle) || void 0 === _k ? void 0 : _k.lineWidth) ? .5 : 0
                    }, {
                        x: scene._gantt.getAllDateColsWidth(),
                        y: 1 & (null === (_l = scene._gantt.parsedOptions.timelineHeaderHorizontalLineStyle) || void 0 === _l ? void 0 : _l.lineWidth) ? .5 : 0
                    } ]
                });
                rowHeader.addChild(line);
            }
        }
    }
    setX(x) {
        this.group.setAttribute("x", x);
    }
    setY(y) {
        this.group.setAttribute("y", y);
    }
    resize() {
        var _a, _b, _c, _d;
        this.group.setAttribute("width", null !== (_b = null === (_a = this.group.attribute) || void 0 === _a ? void 0 : _a.width) && void 0 !== _b ? _b : 0), 
        this.group.setAttribute("height", null !== (_d = null === (_c = this.group.attribute) || void 0 === _c ? void 0 : _c.height) && void 0 !== _d ? _d : 0);
    }
    refresh() {
        var _a;
        null === (_a = this.group) || void 0 === _a || _a.parent.removeChild(this.group), 
        this.initNodes();
    }
    showMarklineIcon(target) {
        let innerGroup;
        return target.children.forEach((child => {
            "date-header-cell-text" === child.name && child.setAttribute("visible", !1), "markline-hover-group" === child.name && (innerGroup = child.firstChild, 
            innerGroup.setAttribute("visibleAll", !0));
        })), innerGroup;
    }
    hideMarklineIconHover(target) {
        let innerGroup;
        return target.children.forEach((child => {
            "date-header-cell-text" === child.name && child.setAttribute("visible", !0), "markline-hover-group" === child.name && (innerGroup = child.firstChild, 
            innerGroup.setAttribute("visibleAll", !1));
        })), innerGroup;
    }
}
//# sourceMappingURL=timeline-header.js.map