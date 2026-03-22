import { DataZoom, createStage, vglobal } from "@visactor/vtable/es/vrender";

export class DataZoomIntegration {
    constructor(gantt, config) {
        this.isUpdatingFromDataZoom = !1, this.isUpdatingFromGantt = !1, this.lastDataZoomState = {
            start: .2,
            end: .5
        }, this.lastSpanLimits = null, this.cleanupCallbacks = [], this.resizeTimeout = null, 
        this.isInitializing = !0, this.gantt = gantt, this.initializeDataZoom(config), this.setupEventListeners(), 
        setTimeout((() => {
            this.updateDataZoomLimits(), this.syncDataZoomToGanttView();
        }), 0);
    }
    syncDataZoomToGanttView() {
        var _a, _b, _c;
        try {
            const scrollLeft = (null === (_a = this.gantt.stateManager) || void 0 === _a ? void 0 : _a.scrollLeft) || 0, totalWidth = (null === (_c = (_b = this.gantt).getAllDateColsWidth) || void 0 === _c ? void 0 : _c.call(_b)) || 0, viewportWidth = this.gantt.tableNoFrameWidth || 0;
            if (totalWidth > 0 && viewportWidth > 0) {
                const start = Math.max(0, Math.min(1, scrollLeft / totalWidth)), end = Math.max(0, Math.min(1, (scrollLeft + viewportWidth) / totalWidth));
                this.dataZoomAxis.setStartAndEnd(start, end);
            }
        } catch (error) {}
    }
    getContainerId(providedId) {
        if (providedId) return providedId;
        const ganttContainer = this.gantt.container;
        if (null == ganttContainer ? void 0 : ganttContainer.id) return ganttContainer.id;
        const ganttElements = document.querySelectorAll('[id*="gantt"], [id*="table"], [class*="gantt"], [class*="vtable"]');
        if (ganttElements.length > 0) {
            const element = ganttElements[0];
            if (element.id) return element.id;
        }
        return "vTable";
    }
    initializeDataZoom(config) {
        var _a, _b;
        const containerId = this.getContainerId(config.containerId);
        if (!document.getElementById(containerId)) throw new Error(`DataZoom container with ID "${containerId}" not found`);
        const ganttContainer = this.gantt.container;
        if (!ganttContainer) throw new Error("Gantt container not found");
        const taskTableWidth = this.gantt.taskTableWidth || 0, defaultWidth = (ganttContainer.offsetWidth || 1e3) - taskTableWidth, defaultX = this.gantt.taskTableWidth || 0, {start: start = .2, end: end = .5, width: width = defaultWidth, height: height = 30, x: x = defaultX, y: y = 0, delayTime: delayTime = 10} = config;
        "static" === window.getComputedStyle(ganttContainer).position && (ganttContainer.style.position = "relative");
        const dataZoomWrapper = document.createElement("div");
        dataZoomWrapper.id = "dataZoomWrapper", dataZoomWrapper.style.cssText = `\n      width: 100%;\n      height: ${height}px;\n      position: absolute;\n      bottom: ${y}px;\n      left: 0px;\n      background: transparent;\n      overflow: visible;\n      pointer-events: none;\n      z-index: 1000;\n    `, 
        this.canvas = document.createElement("canvas"), this.canvas.id = "dataZoomCanvas", 
        this.canvas.width = width, this.canvas.height = height, this.canvas.style.cssText = `\n      width: ${width}px;\n      height: ${height}px;\n      position: absolute;\n      top: 0px;\n      left: ${x}px;\n      pointer-events: auto;\n    `, 
        dataZoomWrapper.appendChild(this.canvas), ganttContainer.appendChild(dataZoomWrapper), 
        this.stage = createStage({
            canvas: this.canvas,
            width: width,
            height: height,
            autoRender: !0
        }), this.dataZoomAxis = new DataZoom({
            start: start,
            end: end,
            position: {
                x: 0,
                y: 0
            },
            size: {
                width: width,
                height: height - 1
            },
            showDetail: !1,
            delayTime: delayTime,
            brushSelect: !1,
            backgroundChartStyle: {
                line: {
                    visible: !0,
                    stroke: "#ddd"
                },
                area: {
                    visible: !0,
                    fill: "#f5f5f5"
                }
            },
            startHandlerStyle: {
                symbolType: "M-0.5-2.4h0.9c0.4,0,0.7,0.3,0.7,0.7v3.3c0,0.4-0.3,0.7-0.7,0.7h-0.9c-0.4,0-0.7-0.3-0.7-0.7v-3.3\nC-1.2-2-0.9-2.4-0.5-2.4z M-0.4-1.4L-0.4-1.4c0,0,0,0.1,0,0.1v2.6c0,0.1,0,0.1,0,0.1l0,0c0,0,0-0.1,0-0.1v-2.6\nC-0.4-1.4-0.4-1.4-0.4-1.4z M0.3-1.4L0.3-1.4c0,0,0,0.1,0,0.1v2.6c0,0.1,0,0.1,0,0.1l0,0c0,0,0-0.1,0-0.1v-2.6\nC0.3-1.4,0.3-1.4,0.3-1.4z;",
                fill: "#fff",
                size: null !== (_a = config.width) && void 0 !== _a ? _a : 30,
                stroke: "#c2c8cf",
                lineWidth: 1
            },
            endHandlerStyle: {
                symbolType: "M-0.5-2.4h0.9c0.4,0,0.7,0.3,0.7,0.7v3.3c0,0.4-0.3,0.7-0.7,0.7h-0.9c-0.4,0-0.7-0.3-0.7-0.7v-3.3\nC-1.2-2-0.9-2.4-0.5-2.4z M-0.4-1.4L-0.4-1.4c0,0,0,0.1,0,0.1v2.6c0,0.1,0,0.1,0,0.1l0,0c0,0,0-0.1,0-0.1v-2.6\nC-0.4-1.4-0.4-1.4-0.4-1.4z M0.3-1.4L0.3-1.4c0,0,0,0.1,0,0.1v2.6c0,0.1,0,0.1,0,0.1l0,0c0,0,0-0.1,0-0.1v-2.6\nC0.3-1.4,0.3-1.4,0.3-1.4z;",
                fill: "#fff",
                size: null !== (_b = config.width) && void 0 !== _b ? _b : 30,
                stroke: "#c2c8cf",
                lineWidth: 1
            },
            middleHandlerStyle: {
                visible: !1
            }
        }), this.stage.defaultLayer.add(this.dataZoomAxis), vglobal.getRequestAnimationFrame()((() => {
            if (this.isInitializing) {
                const boundaries = this.getGanttViewBoundaries();
                this.dataZoomAxis.setStartAndEnd(boundaries.startRatio, boundaries.endRatio), this.isInitializing = !1;
            }
            this.stage.render();
        })), this.lastDataZoomState = {
            start: start,
            end: end
        };
    }
    setupEventListeners() {
        const dataZoomChangeHandler = event => {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
            if (this.isUpdatingFromGantt) return;
            this.isUpdatingFromDataZoom = !0;
            let start = null !== (_c = null !== (_a = event.start) && void 0 !== _a ? _a : null === (_b = event.detail) || void 0 === _b ? void 0 : _b.start) && void 0 !== _c ? _c : null === (_e = null === (_d = event.currentTarget) || void 0 === _d ? void 0 : _d.attribute) || void 0 === _e ? void 0 : _e.start, end = null !== (_h = null !== (_f = event.end) && void 0 !== _f ? _f : null === (_g = event.detail) || void 0 === _g ? void 0 : _g.end) && void 0 !== _h ? _h : null === (_k = null === (_j = event.currentTarget) || void 0 === _j ? void 0 : _j.attribute) || void 0 === _k ? void 0 : _k.end;
            void 0 !== start && void 0 !== end || (start = this.dataZoomAxis.attribute.start, 
            end = this.dataZoomAxis.attribute.end), void 0 === start || void 0 === end || isNaN(start) || isNaN(end) || this.applyDataZoomRangeToGantt(start, end), 
            this.updateDataZoomLimits(), this.isUpdatingFromDataZoom = !1;
        };
        this.dataZoomAxis.addEventListener("dataZoomChange", dataZoomChangeHandler), this.cleanupCallbacks.push((() => {
            this.dataZoomAxis.removeEventListener("dataZoomChange", dataZoomChangeHandler);
        }));
        const ganttScrollHandler = event => {
            if (this.isUpdatingFromDataZoom) return;
            if ("horizontal" !== event.scrollDirection) return;
            this.isUpdatingFromGantt = !0;
            const boundaries = this.getGanttViewBoundaries();
            this.dataZoomAxis.setStartAndEnd(boundaries.startRatio, boundaries.endRatio), this.stage.render(), 
            this.dataZoomAxis.setAttribute("disableTriggerEvent", !1), this.isUpdatingFromGantt = !1;
        };
        this.gantt.addEventListener("scroll", ganttScrollHandler), this.cleanupCallbacks.push((() => {
            this.gantt.removeEventListener("scroll", ganttScrollHandler);
        }));
        const windowResizeHandler = () => {
            clearTimeout(this.resizeTimeout), this.resizeTimeout = setTimeout((() => {
                this.updateDataZoomLimits(), this.updateResponsive();
            }), 70);
        };
        window.addEventListener("resize", windowResizeHandler), this.cleanupCallbacks.push((() => {
            window.removeEventListener("resize", windowResizeHandler), this.resizeTimeout && clearTimeout(this.resizeTimeout);
        }));
        const ganttZoomHandler = () => {
            this.isUpdatingFromDataZoom || (this.isUpdatingFromGantt = !0, this.updateDataZoomLimits(), 
            this.isUpdatingFromDataZoom || this.syncToDataZoom(), this.isUpdatingFromGantt = !1);
        };
        this.gantt.addEventListener("zoom", ganttZoomHandler), this.cleanupCallbacks.push((() => {
            this.gantt.removeEventListener("zoom", ganttZoomHandler);
        }));
    }
    calculateDataZoomLimits() {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        let minMillisecondsPerPixel, maxMillisecondsPerPixel;
        this.gantt.zoomScaleManager ? (minMillisecondsPerPixel = (null === (_b = (_a = this.gantt.zoomScaleManager).getGlobalMinMillisecondsPerPixel) || void 0 === _b ? void 0 : _b.call(_a)) || 1e3, 
        maxMillisecondsPerPixel = (null === (_d = (_c = this.gantt.zoomScaleManager).getGlobalMaxMillisecondsPerPixel) || void 0 === _d ? void 0 : _d.call(_c)) || 6e6) : (minMillisecondsPerPixel = null !== (_f = null === (_e = this.gantt.parsedOptions.zoom) || void 0 === _e ? void 0 : _e.minMillisecondsPerPixel) && void 0 !== _f ? _f : 1e3, 
        maxMillisecondsPerPixel = null !== (_h = null === (_g = this.gantt.parsedOptions.zoom) || void 0 === _g ? void 0 : _g.maxMillisecondsPerPixel) && void 0 !== _h ? _h : 6e6);
        const viewportWidth = this.gantt.tableNoFrameWidth, totalTimeRange = this.gantt.parsedOptions._maxDateTime - this.gantt.parsedOptions._minDateTime, minViewTimeRange = minMillisecondsPerPixel * viewportWidth, minRangeRatio = Math.min(1, minViewTimeRange / totalTimeRange), maxViewTimeRange = maxMillisecondsPerPixel * viewportWidth, maxRangeRatio = Math.min(1, maxViewTimeRange / totalTimeRange);
        return {
            minRangeRatio: Math.min(minRangeRatio, maxRangeRatio),
            maxRangeRatio: Math.max(minRangeRatio, maxRangeRatio),
            minMillisecondsPerPixel: minMillisecondsPerPixel,
            maxMillisecondsPerPixel: maxMillisecondsPerPixel
        };
    }
    updateDataZoomLimits() {
        const limits = this.calculateDataZoomLimits();
        if (!(!this.lastSpanLimits || limits.minRangeRatio !== this.lastSpanLimits.minSpan || limits.maxRangeRatio !== this.lastSpanLimits.maxSpan)) return;
        const start = this.lastDataZoomState.start, end = this.lastDataZoomState.end;
        this.dataZoomAxis.setAttributes({
            minSpan: limits.minRangeRatio,
            maxSpan: limits.maxRangeRatio,
            start: start,
            end: end
        }), this.lastSpanLimits = {
            minSpan: limits.minRangeRatio,
            maxSpan: limits.maxRangeRatio
        }, this.stage.render();
    }
    getGanttViewBoundaries() {
        const scrollLeft = this.gantt.stateManager.scrollLeft, totalWidth = this.gantt.getAllDateColsWidth(), viewportWidth = this.gantt.tableNoFrameWidth;
        return {
            scrollLeft: scrollLeft,
            totalWidth: totalWidth,
            viewportWidth: viewportWidth,
            startRatio: Math.max(0, Math.min(1, scrollLeft / totalWidth)),
            endRatio: Math.max(0, Math.min(1, (scrollLeft + viewportWidth) / totalWidth))
        };
    }
    applyDataZoomRangeToGantt(start, end) {
        if (void 0 === start || void 0 === end || isNaN(start) || isNaN(end)) return;
        this.lastDataZoomState = {
            start: start,
            end: end
        };
        const currentViewportWidth = this.gantt.tableNoFrameWidth, currentMillisecondsPerPixel = this.gantt.getCurrentMillisecondsPerPixel(), rangeRatio = end - start, targetMillisecondsPerPixel = (this.gantt.parsedOptions._maxDateTime - this.gantt.parsedOptions._minDateTime) * rangeRatio / currentViewportWidth;
        if (Math.abs(targetMillisecondsPerPixel - currentMillisecondsPerPixel) > .01 * currentMillisecondsPerPixel) if (this.gantt.zoomScaleManager) {
            const targetLevel = this.gantt.zoomScaleManager.findOptimalLevel(targetMillisecondsPerPixel);
            targetLevel !== this.gantt.zoomScaleManager.getCurrentLevel() && this.gantt.zoomScaleManager.switchToLevel(targetLevel), 
            this.gantt.setMillisecondsPerPixel(targetMillisecondsPerPixel);
        } else this.gantt.setMillisecondsPerPixel(targetMillisecondsPerPixel);
        const targetScrollLeft = start * this.gantt.getAllDateColsWidth();
        this.gantt.stateManager.setScrollLeft(targetScrollLeft);
    }
    syncInitialPosition() {
        setTimeout((() => {
            const boundaries = this.getGanttViewBoundaries();
            (boundaries.startRatio > 0 || boundaries.endRatio < 1) && this.dataZoomAxis.setStartAndEnd(boundaries.startRatio, boundaries.endRatio);
        }), 100);
    }
    syncToGantt() {
        const start = this.dataZoomAxis.attribute.start || 0, end = this.dataZoomAxis.attribute.end || 1;
        this.applyDataZoomRangeToGantt(start, end);
    }
    syncToDataZoom() {
        const boundaries = this.getGanttViewBoundaries();
        this.dataZoomAxis.setStartAndEnd(boundaries.startRatio, boundaries.endRatio);
    }
    syncToGanttWithState(start, end) {
        this.isUpdatingFromDataZoom = !0, this.applyDataZoomRangeToGantt(start, end), setTimeout((() => {
            this.isUpdatingFromDataZoom = !1;
        }), 50);
    }
    setRange(start, end) {
        this.dataZoomAxis.setStartAndEnd(start, end);
    }
    getRange() {
        return {
            start: this.dataZoomAxis.attribute.start || 0,
            end: this.dataZoomAxis.attribute.end || 1
        };
    }
    resize(width, height) {
        if (void 0 === width) {
            const ganttContainer = this.gantt.container;
            if (ganttContainer) {
                const taskTableWidth = this.gantt.taskTableWidth || 0;
                width = ganttContainer.offsetWidth - taskTableWidth;
            } else width = 1e3;
        }
        void 0 === height && (height = 30), this.canvas.width = width, this.canvas.height = height, 
        this.canvas.style.width = `${width}px`, this.canvas.style.height = `${height}px`, 
        this.stage.resize(width, height), this.dataZoomAxis.setAttributes({
            size: {
                width: width,
                height: height - 1
            }
        }), this.stage.render();
    }
    updateResponsive() {
        const ganttContainer = this.gantt.container;
        if (!ganttContainer) return;
        const taskTableWidth = this.gantt.taskTableWidth || 0, newWidth = ganttContainer.offsetWidth - taskTableWidth;
        this.resize(newWidth);
        const defaultX = this.gantt.taskTableWidth || 0;
        this.updatePosition(defaultX, 0), this.syncToDataZoom();
    }
    updatePosition(x, y) {
        var _a;
        const xPos = null !== (_a = null != x ? x : this.gantt.taskTableWidth) && void 0 !== _a ? _a : 0;
        this.canvas.style.left = `${xPos}px`;
    }
    destroy() {
        if (this.cleanupCallbacks.forEach((cleanup => cleanup())), this.cleanupCallbacks = [], 
        this.canvas && this.canvas.parentNode) {
            const wrapper = this.canvas.parentNode;
            wrapper && "dataZoomWrapper" === wrapper.id && wrapper.parentNode ? wrapper.parentNode.removeChild(wrapper) : wrapper.removeChild(this.canvas);
        }
        this.stage && this.stage.release();
    }
}
//# sourceMappingURL=DataZoomIntegration.js.map