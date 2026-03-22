import { createDateAtMidnight } from "../tools/util";

import { Group, createLine, Text } from "@visactor/vtable/es/vrender";

export class MarkLine {
    constructor(scene) {
        this.markLineContainerWidth = 20, this._scene = scene, this.height = Math.min(scene._gantt.tableNoFrameHeight, scene._gantt.drawHeight) - scene._gantt.getAllHeaderRowsHeight(), 
        this.group = new Group({
            x: 0,
            y: scene._gantt.getAllHeaderRowsHeight(),
            width: scene._gantt.tableNoFrameWidth,
            height: this.height,
            pickable: !1,
            clip: !0
        }), this.group.name = "mark-line-container", scene.ganttGroup.addChild(this.group), 
        this.markLIneContainer = new Group({
            x: 0,
            y: 0,
            width: this._scene._gantt.getAllDateColsWidth(),
            height: this.height,
            pickable: !1,
            clip: !0
        }), this.group.appendChild(this.markLIneContainer), this.initMarkLines();
    }
    initMarkLines() {
        const height = Math.min(this._scene._gantt.tableNoFrameHeight, this._scene._gantt.drawHeight) - this._scene._gantt.getAllHeaderRowsHeight();
        this.group.setAttributes({
            y: this._scene._gantt.getAllHeaderRowsHeight(),
            width: this._scene._gantt.tableNoFrameWidth,
            height: height
        }), this.markLIneContainer.setAttribute("width", this._scene._gantt.getAllDateColsWidth()), 
        this.markLIneContainer.setAttribute("height", height);
        const markLine = this._scene._gantt.parsedOptions.markLine;
        this._scene._gantt.parsedOptions.minDate && markLine.forEach((line => {
            const style = line.style, contentStyle = line.contentStyle || {}, dateTime = (this._scene._gantt.parsedOptions.timeScaleIncludeHour ? createDateAtMidnight(line.date) : createDateAtMidnight(line.date, !0)).getTime();
            if (dateTime < this._scene._gantt.parsedOptions._minDateTime || dateTime > this._scene._gantt.parsedOptions._maxDateTime) return;
            const cellIndex = this._scene._gantt.getDateIndexByTime(dateTime), cellStartX = cellIndex >= 1 ? this._scene._gantt.getDateColsWidth(0, cellIndex - 1) : 0, cellWidth = this._scene._gantt.getDateColWidth(cellIndex);
            let dateX = cellStartX;
            "date" === line.position ? dateX = this._scene._gantt.getXByTime(dateTime) : "right" === line.position ? dateX = cellStartX + cellWidth : "middle" === line.position && (dateX = cellStartX + cellWidth / 2);
            const markLineGroup = new Group({
                pickable: !1,
                x: dateX - this.markLineContainerWidth / 2,
                y: 0,
                width: this.markLineContainerWidth,
                height: this.height
            });
            markLineGroup.name = "mark-line", this.markLIneContainer.appendChild(markLineGroup);
            const lineObj = createLine({
                pickable: !1,
                stroke: style.lineColor,
                lineWidth: style.lineWidth,
                lineDash: style.lineDash,
                points: [ {
                    x: this.markLineContainerWidth / 2,
                    y: 0
                }, {
                    x: this.markLineContainerWidth / 2,
                    y: this.height
                } ]
            });
            if (markLineGroup.appendChild(lineObj), line.content) {
                const textMaxLineWidth = Math.max(this._scene._gantt.getDateColWidth(cellIndex), 1), textContainerHeight = contentStyle.lineHeight || 18, textGroup = new Group({
                    x: this.markLineContainerWidth / 2,
                    y: 0,
                    cursor: "pointer",
                    height: textContainerHeight,
                    clip: !1,
                    fill: contentStyle.backgroundColor || style.lineColor,
                    display: "flex",
                    cornerRadius: contentStyle.cornerRadius || [ 0, 2, 2, 0 ]
                });
                textGroup.name = "mark-line-content", textGroup.data = line, markLineGroup.appendChild(textGroup);
                const text = new Text({
                    maxLineWidth: textMaxLineWidth,
                    text: line.content,
                    cursor: "pointer",
                    lineHeight: textContainerHeight,
                    fontWeight: contentStyle.fontWeight || "normal",
                    fill: contentStyle.color || style.lineColor,
                    fontSize: contentStyle.fontSize || 12,
                    poptip: {
                        position: "top",
                        dx: textMaxLineWidth / 4,
                        dy: -textContainerHeight / 4
                    }
                });
                textGroup.appendChild(text);
            }
        }));
    }
    refresh() {
        this.height = Math.min(this._scene._gantt.tableNoFrameHeight, this._scene._gantt.drawHeight) - this._scene._gantt.getAllHeaderRowsHeight(), 
        this.markLIneContainer.removeAllChild(), this.group.setAttribute("height", this.height), 
        this.markLIneContainer.setAttribute("height", this.height), this.initMarkLines();
    }
    setX(x) {
        this.markLIneContainer.setAttribute("x", x);
    }
}
//# sourceMappingURL=mark-line.js.map