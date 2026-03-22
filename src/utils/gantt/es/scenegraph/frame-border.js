import { createRect } from "@visactor/vtable/es/vrender";

import { toBoxArray } from "@visactor/vtable";

export class FrameBorder {
    constructor(scene) {
        this._scene = scene, this.createFrameBorder();
    }
    createFrameBorder() {
        var _a, _b, _c, _d, _e, _f;
        const group = this._scene.ganttGroup, frameStyle = this._scene._gantt.parsedOptions.outerFrameStyle;
        if (!frameStyle) return;
        const {cornerRadius: cornerRadius, borderColor: borderColor, borderLineWidth: borderLineWidth, borderLineDash: borderLineDash} = frameStyle, groupAttributes = {}, rectAttributes = {
            pickable: !1
        }, lineWidths = toBoxArray(null != borderLineWidth ? borderLineWidth : 0), strokeArrayWidth = [ lineWidths[0], lineWidths[1], lineWidths[2], this._scene._gantt.taskListTableInstance ? 0 : lineWidths[3] ];
        rectAttributes.stroke = !0, rectAttributes.fill = !1, rectAttributes.stroke = borderColor, 
        rectAttributes.lineWidth = Math.max(...strokeArrayWidth), rectAttributes.strokeArrayWidth = strokeArrayWidth, 
        borderLineDash && (rectAttributes.lineDash = borderLineDash), rectAttributes.lineCap = "butt";
        const hasTaskList = !!this._scene._gantt.taskListTableInstance;
        rectAttributes.x = hasTaskList ? 0 : strokeArrayWidth[3] / 2, rectAttributes.y = strokeArrayWidth[0] / 2;
        const verticalSplitLineWidth = null !== (_b = null === (_a = this._scene._gantt.parsedOptions.verticalSplitLine) || void 0 === _a ? void 0 : _a.lineWidth) && void 0 !== _b ? _b : 0;
        if (rectAttributes.width = group.attribute.width + strokeArrayWidth[3] / 2 + strokeArrayWidth[1] / 2 + (hasTaskList ? verticalSplitLineWidth : 0), 
        rectAttributes.height = group.attribute.height + strokeArrayWidth[0] / 2 + strokeArrayWidth[2] / 2, 
        cornerRadius) {
            const radius = Array.isArray(cornerRadius) ? cornerRadius : [ cornerRadius, cornerRadius, cornerRadius, cornerRadius ];
            this._scene._gantt.taskListTableInstance ? (rectAttributes.cornerRadius = [ 0, null !== (_c = radius[1]) && void 0 !== _c ? _c : 0, null !== (_d = radius[2]) && void 0 !== _d ? _d : 0, 0 ], 
            groupAttributes.cornerRadius = [ 0, null !== (_e = radius[1]) && void 0 !== _e ? _e : 0, null !== (_f = radius[2]) && void 0 !== _f ? _f : 0, 0 ]) : (rectAttributes.cornerRadius = radius, 
            groupAttributes.cornerRadius = radius);
        }
        if (group.setAttributes(groupAttributes), rectAttributes.stroke) {
            const borderRect = createRect(rectAttributes);
            borderRect.name = "border-rect", group.parent.insertAfter(borderRect, group), this.border = borderRect, 
            group.border = borderRect;
        }
    }
    refresh() {
        this.border && this.border.parent && this.border.parent.removeChild(this.border), 
        this.createFrameBorder();
    }
    resize() {
        var _a, _b, _c;
        const {borderLineWidth: borderLineWidth} = this._scene._gantt.parsedOptions.outerFrameStyle, lineWidths = toBoxArray(null != borderLineWidth ? borderLineWidth : 0), strokeArrayWidth = [ lineWidths[0], lineWidths[1], lineWidths[2], this._scene._gantt.taskListTableInstance ? 0 : lineWidths[3] ], verticalSplitLineWidth = null !== (_b = null === (_a = this._scene._gantt.parsedOptions.verticalSplitLine) || void 0 === _a ? void 0 : _a.lineWidth) && void 0 !== _b ? _b : 0, hasTaskList = !!this._scene._gantt.taskListTableInstance;
        null === (_c = this.border) || void 0 === _c || _c.setAttributes({
            x: hasTaskList ? 0 : strokeArrayWidth[3] / 2,
            y: strokeArrayWidth[0] / 2,
            width: this._scene.ganttGroup.attribute.width + strokeArrayWidth[3] / 2 + strokeArrayWidth[1] / 2 + (hasTaskList ? verticalSplitLineWidth : 0),
            height: this._scene.ganttGroup.attribute.height + strokeArrayWidth[0] / 2 + strokeArrayWidth[2] / 2
        }), this.border.strokeArrayWidth = strokeArrayWidth;
    }
}
//# sourceMappingURL=frame-border.js.map