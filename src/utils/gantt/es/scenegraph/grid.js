import { Group, createLine, createRect } from "@visactor/vtable/es/vrender";

export class Grid {
    constructor(scene) {
        var _a;
        this._scene = scene, this.scrollLeft = 0, this.scrollTop = 0, this.x = 0, this.y = scene._gantt.getAllHeaderRowsHeight(), 
        this.width = scene.ganttGroup.attribute.width, this.height = scene.ganttGroup.attribute.height - scene.timelineHeader.group.attribute.height, 
        this.rowHeight = scene._gantt.parsedOptions.rowHeight, this.rowCount = scene._gantt.itemCount, 
        this.allGridWidth = scene._gantt.getAllDateColsWidth(), this.allGridHeight = scene._gantt.getAllTaskBarsHeight(), 
        this.group = new Group({
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height,
            clip: !0,
            fill: null === (_a = scene._gantt.parsedOptions.grid) || void 0 === _a ? void 0 : _a.backgroundColor
        }), this.group.name = "grid-container", scene.ganttGroup.addChild(this.group), this.createVerticalBackgroundRects(), 
        this.createHorizontalBackgroundRects(), this.createVerticalLines(), this.createHorizontalLines(), 
        this.createTimeLineHeaderBottomLine();
    }
    createTimeLineHeaderBottomLine() {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j;
        const options = this._scene._gantt.parsedOptions, horizontalSplitLineWidth = null !== (_b = null === (_a = options.horizontalSplitLine) || void 0 === _a ? void 0 : _a.lineWidth) && void 0 !== _b ? _b : null === (_c = options.timelineHeaderHorizontalLineStyle) || void 0 === _c ? void 0 : _c.lineWidth, bottomLineY = (1 & horizontalSplitLineWidth ? -.5 : 0) + horizontalSplitLineWidth / 2, line = createLine({
            pickable: !1,
            stroke: null !== (_e = null === (_d = options.horizontalSplitLine) || void 0 === _d ? void 0 : _d.lineColor) && void 0 !== _e ? _e : null === (_f = options.timelineHeaderHorizontalLineStyle) || void 0 === _f ? void 0 : _f.lineColor,
            lineWidth: horizontalSplitLineWidth + (1 & horizontalSplitLineWidth ? 1 : 0),
            lineDash: null !== (_h = null === (_g = options.horizontalSplitLine) || void 0 === _g ? void 0 : _g.lineDash) && void 0 !== _h ? _h : null === (_j = options.timelineHeaderHorizontalLineStyle) || void 0 === _j ? void 0 : _j.lineDash,
            points: [ {
                x: 0,
                y: bottomLineY
            }, {
                x: this._scene._gantt.getAllDateColsWidth(),
                y: bottomLineY
            } ]
        });
        line.name = "timeLine-header-bottom-line", this.group.addChild(line);
    }
    createVerticalLines() {
        var _a, _b;
        const gridStyle = this._scene._gantt.parsedOptions.grid, verticalLineDependenceOnTimeScale = null !== (_a = gridStyle.verticalLineDependenceOnTimeScale) && void 0 !== _a ? _a : this._scene._gantt.parsedOptions.reverseSortedTimelineScales[0].unit;
        if (gridStyle.verticalLine) {
            this.verticalLineGroup = new Group({
                x: 0,
                y: 0,
                width: this.allGridWidth,
                height: this.allGridHeight
            }), this.verticalLineGroup.name = "grid-vertical", this.group.appendChild(this.verticalLineGroup);
            const dependenceOnTimeScale = null !== (_b = this._scene._gantt.parsedOptions.reverseSortedTimelineScales.find((scale => scale.unit === verticalLineDependenceOnTimeScale))) && void 0 !== _b ? _b : this._scene._gantt.parsedOptions.reverseSortedTimelineScales[0], {timelineDates: timelineDates} = dependenceOnTimeScale;
            if ("function" == typeof gridStyle.verticalLine) for (let i = 0; i < (null == timelineDates ? void 0 : timelineDates.length) - 1; i++) {
                const {endDate: endDate} = timelineDates[i], verticalLine_style = gridStyle.verticalLine({
                    index: i,
                    dateIndex: timelineDates[i].dateIndex,
                    date: timelineDates[i].endDate,
                    ganttInstance: this._scene._gantt
                }), x = Math.ceil(this._scene._gantt.getXByTime(endDate.getTime() + 1)) + (1 & verticalLine_style.lineWidth ? .5 : 0), line = createLine({
                    pickable: !1,
                    stroke: verticalLine_style.lineColor,
                    lineWidth: verticalLine_style.lineWidth,
                    lineDash: verticalLine_style.lineDash,
                    points: [ {
                        x: x,
                        y: 0
                    }, {
                        x: x,
                        y: this.allGridHeight
                    } ]
                });
                this.verticalLineGroup.appendChild(line);
            } else {
                const verticalLine_style = gridStyle.verticalLine;
                for (let i = 0; i < (null == timelineDates ? void 0 : timelineDates.length) - 1; i++) {
                    const {endDate: endDate} = timelineDates[i], x = Math.ceil(this._scene._gantt.getXByTime(endDate.getTime() + 1)) + (1 & verticalLine_style.lineWidth ? .5 : 0), line = createLine({
                        pickable: !1,
                        stroke: verticalLine_style.lineColor,
                        lineWidth: verticalLine_style.lineWidth,
                        lineDash: verticalLine_style.lineDash,
                        points: [ {
                            x: x,
                            y: 0
                        }, {
                            x: x,
                            y: this.allGridHeight
                        } ]
                    });
                    this.verticalLineGroup.appendChild(line);
                }
            }
        }
    }
    createHorizontalLines() {
        const gridStyle = this._scene._gantt.parsedOptions.grid;
        if (gridStyle.horizontalLine) if (this.horizontalLineGroup = new Group({
            x: 0,
            y: 0,
            width: this.allGridWidth,
            height: this.allGridHeight
        }), this.horizontalLineGroup.name = "grid-horizontal", this.group.appendChild(this.horizontalLineGroup), 
        "function" == typeof gridStyle.horizontalLine) {
            let y = .5;
            for (let i = 0; i < this.rowCount - 1; i++) {
                const horizontalLine_style = gridStyle.horizontalLine({
                    index: i,
                    ganttInstance: this._scene._gantt
                });
                y += this._scene._gantt.getRowHeightByIndex(i);
                const line = createLine({
                    pickable: !1,
                    stroke: horizontalLine_style.lineColor,
                    lineWidth: horizontalLine_style.lineWidth,
                    lineDash: horizontalLine_style.lineDash,
                    points: [ {
                        x: 0,
                        y: y
                    }, {
                        x: this.allGridWidth,
                        y: y
                    } ]
                });
                this.horizontalLineGroup.appendChild(line);
            }
        } else {
            const horizontalLine_style = gridStyle.horizontalLine;
            let y = 0;
            1 & horizontalLine_style.lineWidth && (y += .5);
            for (let i = 0; i < this.rowCount - 1; i++) {
                y += this._scene._gantt.getRowHeightByIndex(i);
                const line = createLine({
                    pickable: !1,
                    stroke: horizontalLine_style.lineColor,
                    lineWidth: horizontalLine_style.lineWidth,
                    lineDash: horizontalLine_style.lineDash,
                    points: [ {
                        x: 0,
                        y: y
                    }, {
                        x: this.allGridWidth,
                        y: y
                    } ]
                });
                this.horizontalLineGroup.appendChild(line);
            }
        }
    }
    createVerticalBackgroundRects() {
        const verticalBackgroundColor = this._scene._gantt.parsedOptions.grid.verticalBackgroundColor, weekendBackgroundColor = this._scene._gantt.parsedOptions.grid.weekendBackgroundColor;
        if (verticalBackgroundColor || weekendBackgroundColor) {
            this.verticalBackgroundRectsGroup = new Group({
                x: 0,
                y: 0,
                width: this.allGridWidth,
                height: this.allGridHeight
            }), this.verticalBackgroundRectsGroup.name = "grid-vertical-background", this.group.appendChild(this.verticalBackgroundRectsGroup);
            const {timelineDates: timelineDates, unit: unit, step: step} = this._scene._gantt.parsedOptions.reverseSortedTimelineScales[0];
            if (verticalBackgroundColor || weekendBackgroundColor) for (let i = 0; i <= (null == timelineDates ? void 0 : timelineDates.length) - 1; i++) {
                let backgroundColor;
                if (!weekendBackgroundColor || "day" !== unit || 1 !== step || 0 !== timelineDates[i].startDate.getDay() && 6 !== timelineDates[i].startDate.getDay() ? "function" == typeof verticalBackgroundColor ? backgroundColor = verticalBackgroundColor({
                    index: i,
                    dateIndex: timelineDates[i].dateIndex,
                    date: timelineDates[i].endDate,
                    ganttInstance: this._scene._gantt
                }) : verticalBackgroundColor && (backgroundColor = verticalBackgroundColor[i % verticalBackgroundColor.length]) : backgroundColor = weekendBackgroundColor, 
                backgroundColor) {
                    const x = i >= 1 ? Math.ceil(this._scene._gantt.getDateColsWidth(0, i - 1)) : 0, width = this._scene._gantt.getDateColWidth(i), rect = createRect({
                        pickable: !1,
                        fill: backgroundColor,
                        x: x,
                        y: 0,
                        width: width,
                        height: this.allGridHeight
                    });
                    this.verticalBackgroundRectsGroup.appendChild(rect);
                }
            }
        }
    }
    createHorizontalBackgroundRects() {
        const horizontalBackgroundColor = this._scene._gantt.parsedOptions.grid.horizontalBackgroundColor;
        if (horizontalBackgroundColor) {
            this.horizontalBackgroundRectsGroup = new Group({
                x: 0,
                y: 0,
                width: this.allGridWidth,
                height: this.allGridHeight
            }), this.horizontalBackgroundRectsGroup.name = "grid-horizontal-background", this.group.appendChild(this.horizontalBackgroundRectsGroup);
            let y = 0;
            for (let i = 0; i <= this.rowCount - 1; i++) {
                let backgroundColor;
                backgroundColor = "function" == typeof horizontalBackgroundColor ? horizontalBackgroundColor({
                    index: i,
                    ganttInstance: this._scene._gantt
                }) : horizontalBackgroundColor[i % horizontalBackgroundColor.length];
                const rect = createRect({
                    pickable: !1,
                    fill: backgroundColor,
                    x: 0,
                    y: y,
                    width: this.allGridWidth,
                    height: this._scene._gantt.getRowHeightByIndex(i)
                });
                this.horizontalBackgroundRectsGroup.appendChild(rect), y += this._scene._gantt.getRowHeightByIndex(i);
            }
        }
    }
    refresh() {
        this.width = this._scene.ganttGroup.attribute.width, this.height = this._scene.ganttGroup.attribute.height - this._scene.timelineHeader.group.attribute.height, 
        this.group.setAttributes({
            width: this.width,
            height: this.height,
            y: this._scene._gantt.getAllHeaderRowsHeight()
        }), this.rowCount = this._scene._gantt.itemCount, this.allGridWidth = this._scene._gantt.getAllDateColsWidth(), 
        this.allGridHeight = this._scene._gantt.getAllTaskBarsHeight(), this.group.removeAllChild(), 
        this.createVerticalBackgroundRects(), this.createHorizontalBackgroundRects(), this.createVerticalLines(), 
        this.createHorizontalLines(), this.createTimeLineHeaderBottomLine();
    }
    setX(x) {
        var _a, _b, _c, _d;
        null === (_a = this.verticalLineGroup) || void 0 === _a || _a.setAttribute("x", x), 
        null === (_b = this.horizontalLineGroup) || void 0 === _b || _b.setAttribute("x", x), 
        null === (_c = this.verticalBackgroundRectsGroup) || void 0 === _c || _c.setAttribute("x", x), 
        null === (_d = this.horizontalBackgroundRectsGroup) || void 0 === _d || _d.setAttribute("x", x);
    }
    setY(y) {
        var _a, _b, _c, _d;
        null === (_a = this.verticalLineGroup) || void 0 === _a || _a.setAttribute("y", y), 
        null === (_b = this.horizontalLineGroup) || void 0 === _b || _b.setAttribute("y", y), 
        null === (_c = this.verticalBackgroundRectsGroup) || void 0 === _c || _c.setAttribute("y", y), 
        null === (_d = this.horizontalBackgroundRectsGroup) || void 0 === _d || _d.setAttribute("y", y);
    }
    resize() {
        this.width = this._scene.ganttGroup.attribute.width, this.height = this._scene.ganttGroup.attribute.height - this._scene.timelineHeader.group.attribute.height, 
        this.group.setAttribute("width", this.width), this.group.setAttribute("height", this.height);
    }
}
//# sourceMappingURL=grid.js.map