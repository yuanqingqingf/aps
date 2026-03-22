import { ScrollBar } from "@visactor/vtable/es/vrender";

import { isValid } from "@visactor/vutils";

export class ScrollBarComponent {
    constructor(gantt) {
        this._gantt = gantt, this.createScrollBar(gantt.tableNoFrameWidth, gantt.tableNoFrameHeight - gantt.getAllHeaderRowsHeight());
    }
    createScrollBar(tableWidth, tableHeight) {
        var _a, _b;
        const scrollRailColor = this._gantt.parsedOptions.scrollStyle.scrollRailColor, scrollSliderColor = this._gantt.parsedOptions.scrollStyle.scrollSliderColor, scrollSliderCornerRadius = this._gantt.parsedOptions.scrollStyle.scrollSliderCornerRadius, width = this._gantt.parsedOptions.scrollStyle.width;
        let sliderStyle;
        sliderStyle = isValid(scrollSliderCornerRadius) ? {
            cornerRadius: scrollSliderCornerRadius,
            fill: scrollSliderColor
        } : {
            fill: scrollSliderColor
        };
        null === (_a = this._gantt.parsedOptions.scrollStyle) || void 0 === _a || _a.visible, 
        null === (_b = this._gantt.parsedOptions.scrollStyle) || void 0 === _b || _b.hoverOn;
        this.hScrollBar = new ScrollBar({
            direction: "horizontal",
            x: 2 * -tableWidth,
            y: 2 * -tableHeight,
            width: tableWidth,
            height: width,
            padding: 0,
            railStyle: {
                fill: scrollRailColor
            },
            sliderStyle: sliderStyle,
            range: [ 0, .1 ],
            visible: !1
        }), this.hScrollBar.render(), this.hScrollBar.hideAll(), this.vScrollBar = new ScrollBar({
            direction: "vertical",
            x: 2 * -tableWidth,
            y: 2 * -tableHeight,
            width: width,
            height: tableHeight,
            padding: 0,
            railStyle: {
                fill: scrollRailColor
            },
            sliderStyle: sliderStyle,
            range: [ 0, .1 ],
            visible: !1
        }), this.vScrollBar.render(), this.vScrollBar.hideAll();
    }
    refresh() {}
    hideVerticalScrollBar() {
        const visable = this._gantt.parsedOptions.scrollStyle.visible;
        "focus" !== visable && "scrolling" !== visable || (this.vScrollBar.setAttribute("visible", !1), 
        this.vScrollBar.hideAll(), this._gantt.scenegraph.updateNextFrame());
    }
    showVerticalScrollBar(autoHide) {
        const visable = this._gantt.parsedOptions.scrollStyle.visible;
        "focus" !== visable && "scrolling" !== visable || (this.vScrollBar.setAttribute("visible", !0), 
        this.vScrollBar.showAll(), this._gantt.scenegraph.updateNextFrame(), autoHide && (clearTimeout(this._clearVerticalScrollBar), 
        this._clearVerticalScrollBar = setTimeout((() => {
            this.hideVerticalScrollBar();
        }), 1e3)));
    }
    hideHorizontalScrollBar() {
        const visable = this._gantt.parsedOptions.scrollStyle.visible;
        "focus" !== visable && "scrolling" !== visable || (this.hScrollBar.setAttribute("visible", !1), 
        this.hScrollBar.hideAll(), this._gantt.scenegraph.updateNextFrame());
    }
    showHorizontalScrollBar(autoHide) {
        const visable = this._gantt.parsedOptions.scrollStyle.visible;
        "focus" !== visable && "scrolling" !== visable || (this.hScrollBar.setAttribute("visible", !0), 
        this.hScrollBar.showAll(), this._gantt.scenegraph.updateNextFrame(), autoHide && (clearTimeout(this._clearHorizontalScrollBar), 
        this._clearHorizontalScrollBar = setTimeout((() => {
            this.hideHorizontalScrollBar();
        }), 1e3)));
    }
    updateVerticalScrollBarPos(topRatio) {
        const range = this.vScrollBar.attribute.range, size = range[1] - range[0], range0 = topRatio * (1 - size);
        this.vScrollBar.setAttribute("range", [ range0, range0 + size ]);
        const bounds = this.vScrollBar.AABBBounds && this.vScrollBar.globalAABBBounds;
        this.vScrollBar._viewPosition = {
            x: bounds.x1,
            y: bounds.y1
        };
    }
    updateHorizontalScrollBarPos(leftRatio) {
        const range = this.hScrollBar.attribute.range, size = range[1] - range[0], range0 = leftRatio * (1 - size);
        this.hScrollBar.setAttribute("range", [ range0, range0 + size ]);
        const bounds = this.hScrollBar.AABBBounds && this.hScrollBar.globalAABBBounds;
        this.hScrollBar._viewPosition = {
            x: bounds.x1,
            y: bounds.y1
        };
    }
    updateScrollBar() {
        const oldHorizontalBarPos = this._gantt.stateManager.scroll.horizontalBarPos, oldVerticalBarPos = this._gantt.stateManager.scroll.verticalBarPos, scrollStyle = this._gantt.parsedOptions.scrollStyle, width = null == scrollStyle ? void 0 : scrollStyle.width, visible = null == scrollStyle ? void 0 : scrollStyle.visible, tableWidth = Math.ceil(this._gantt.scenegraph.ganttGroup.attribute.width), tableHeight = Math.ceil(this._gantt.scenegraph.ganttGroup.attribute.height), totalHeight = this._gantt.getAllRowsHeight(), totalWidth = this._gantt.getAllDateColsWidth(), frozenRowsHeight = this._gantt.getAllHeaderRowsHeight();
        if (totalWidth > tableWidth) {
            const y = Math.min(tableHeight, totalHeight), rangeEnd = Math.max(.05, tableWidth / totalWidth), hoverOn = scrollStyle.hoverOn;
            let attrY = 0;
            attrY = scrollStyle.barToSide ? this._gantt.tableNoFrameHeight - (hoverOn ? width : -this._gantt.scenegraph.ganttGroup.attribute.y) + this._gantt.tableY : y - (hoverOn ? width : -this._gantt.scenegraph.ganttGroup.attribute.y) + this._gantt.tableY, 
            this.hScrollBar.setAttributes({
                x: this._gantt.scenegraph.ganttGroup.attribute.x,
                y: attrY,
                width: tableWidth,
                range: [ 0, rangeEnd ],
                visible: "always" === visible
            });
            const bounds = this.hScrollBar.AABBBounds && this.hScrollBar.globalAABBBounds;
            this.hScrollBar._viewPosition = {
                x: bounds.x1,
                y: bounds.y1
            }, "always" === visible && this.hScrollBar.showAll();
        } else this.hScrollBar.setAttributes({
            x: 2 * -this._gantt.tableNoFrameWidth,
            y: 2 * -this._gantt.tableNoFrameHeight,
            width: 0,
            visible: !1
        });
        if (totalHeight > tableHeight) {
            const x = Math.min(tableWidth, totalWidth) + this._gantt.scenegraph.ganttGroup.attribute.x, rangeEnd = Math.max(.05, (tableHeight - frozenRowsHeight) / (totalHeight - frozenRowsHeight));
            let attrX = 0;
            const hoverOn = this._gantt.parsedOptions.scrollStyle.hoverOn;
            attrX = this._gantt.parsedOptions.scrollStyle.barToSide ? this._gantt.tableNoFrameWidth - (hoverOn ? width : -this._gantt.scenegraph.ganttGroup.attribute.x) : x - (hoverOn ? width : -this._gantt.scenegraph.ganttGroup.attribute.x), 
            this.vScrollBar.setAttributes({
                x: attrX,
                y: frozenRowsHeight + (hoverOn ? 0 : this._gantt.scenegraph.ganttGroup.attribute.y) + this._gantt.tableY,
                height: tableHeight - frozenRowsHeight,
                range: [ 0, rangeEnd ],
                visible: "always" === visible
            });
            const bounds = this.vScrollBar.AABBBounds && this.vScrollBar.globalAABBBounds;
            this.vScrollBar._viewPosition = {
                x: bounds.x1,
                y: bounds.y1
            }, "always" === visible && this.vScrollBar.showAll();
        } else this.vScrollBar.setAttributes({
            x: 2 * -this._gantt.tableNoFrameWidth,
            y: 2 * -this._gantt.tableNoFrameHeight,
            height: 0,
            visible: !1
        });
        this._gantt.stateManager.setScrollLeft(oldHorizontalBarPos), this._gantt.stateManager.setScrollTop(oldVerticalBarPos);
    }
}
//# sourceMappingURL=scroll-bar.js.map