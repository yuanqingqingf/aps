import { Group } from "@visactor/vtable/es/vrender";

import { getTextPos } from "../gantt-helper";

import { toBoxArray } from "../tools/util";

import { isValid } from "@visactor/vutils";

import { textMeasure } from "@visactor/vtable";

export class GanttTaskBarNode extends Group {
    constructor(attrs) {
        super(attrs), this._lastWidth = attrs.width, this._lastHeight = attrs.height, this._lastX = attrs.x, 
        this._lastY = attrs.y;
    }
    updateTextPosition() {
        var _a, _b, _c;
        if (!this.textLabel || !this.barRect) return;
        const labelStyle = this.labelStyle || {}, {textAlign: textAlign = "left", textBaseline: textBaseline = "middle", textOverflow: textOverflow, color: color = "#333333", outsideColor: outsideColor = "#333333", padding: rawPadding = 8} = labelStyle, padding = Array.isArray(rawPadding) ? rawPadding[3] : rawPadding, barWidth = this.barRect.attribute.width, barHeight = this.barRect.attribute.height, fontSize = this.textLabel.attribute.fontSize || 12, fontFamily = this.textLabel.attribute.fontFamily || "Arial", text = String(this.textLabel.attribute.text || ""), textFitsInBar = textMeasure.measureTextWidth(text, {
            fontSize: fontSize,
            fontFamily: fontFamily
        }) + 2 * padding <= barWidth, defaultPosition = getTextPos(toBoxArray(padding), textAlign, textBaseline, barWidth, barHeight), textPosition = labelStyle.orient || (!textFitsInBar && labelStyle.orientHandleWithOverflow ? labelStyle.orientHandleWithOverflow : null);
        if (this.textLabel.setAttribute("visible", !0), this.textLabel.setAttribute("textBaseline", textBaseline), 
        textPosition) {
            null === (_a = this.textLabel.parent) || void 0 === _a || _a.removeChild(this.textLabel), 
            this.appendChild(this.textLabel), this.textLabel.setAttribute("fill", outsideColor), 
            this.textLabel.setAttribute("ellipsis", void 0), this.textLabel.setAttribute("maxLineWidth", void 0), 
            this.textLabel.setAttribute("zIndex", 1e4), this.setAttribute("zIndex", 1e4);
            const pos = {
                left: {
                    x: -padding,
                    y: barHeight / 2,
                    align: "right",
                    baseline: "middle"
                },
                right: {
                    x: barWidth + padding,
                    y: barHeight / 2,
                    align: "left",
                    baseline: "middle"
                },
                top: {
                    x: barWidth / 2,
                    y: -padding,
                    align: "center",
                    baseline: "bottom"
                },
                bottom: {
                    x: barWidth / 2,
                    y: barHeight + padding,
                    align: "center",
                    baseline: "top"
                }
            }[textPosition];
            pos && (this.textLabel.setAttribute("x", pos.x), this.textLabel.setAttribute("y", pos.y), 
            this.textLabel.setAttribute("textAlign", pos.align), this.textLabel.setAttribute("textBaseline", pos.baseline));
        } else null === (_b = this.textLabel.parent) || void 0 === _b || _b.removeChild(this.textLabel), 
        null === (_c = this.clipGroupBox) || void 0 === _c || _c.appendChild(this.textLabel), 
        this.textLabel.setAttribute("x", defaultPosition.x), this.textLabel.setAttribute("y", defaultPosition.y), 
        this.textLabel.setAttribute("textAlign", textAlign), this.textLabel.setAttribute("fill", color), 
        this.textLabel.setAttribute("maxLineWidth", barWidth - padding), this.textLabel.setAttribute("ellipsis", "clip" === textOverflow ? "" : "ellipsis" === textOverflow ? "..." : isValid(textOverflow) ? textOverflow : void 0);
    }
}
//# sourceMappingURL=gantt-node.js.map