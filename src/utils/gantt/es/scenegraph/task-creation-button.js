import { createLine, Group } from "@visactor/vtable/es/vrender";

export class TaskCreationButton {
    constructor(scene) {
        this._scene = scene, this.createAddButton();
    }
    createAddButton() {
        var _a;
        this._scene._gantt.parsedOptions.taskBarCreationCustomLayout ? this.group = new Group({
            x: 0,
            y: 0,
            width: 100,
            height: 100
        }) : (this.group = new Group({
            x: 0,
            y: 0,
            width: 100,
            height: 100,
            lineDash: this._scene._gantt.parsedOptions.taskBarCreationButtonStyle.lineDash,
            cursor: "pointer",
            lineWidth: this._scene._gantt.parsedOptions.taskBarCreationButtonStyle.lineWidth,
            stroke: this._scene._gantt.parsedOptions.taskBarCreationButtonStyle.lineColor,
            cornerRadius: null !== (_a = this._scene._gantt.parsedOptions.taskBarCreationButtonStyle.cornerRadius) && void 0 !== _a ? _a : 0,
            fill: this._scene._gantt.parsedOptions.taskBarCreationButtonStyle.backgroundColor
        }), this.lineVertical = createLine({
            pickable: !1,
            stroke: this._scene._gantt.parsedOptions.taskBarCreationButtonStyle.lineColor,
            lineWidth: this._scene._gantt.parsedOptions.taskBarCreationButtonStyle.lineWidth,
            points: [ {
                x: 50,
                y: 0
            }, {
                x: 50,
                y: 100
            } ]
        }), this.group.appendChild(this.lineVertical), this.lineHorizontal = createLine({
            pickable: !1,
            stroke: this._scene._gantt.parsedOptions.taskBarCreationButtonStyle.lineColor,
            lineWidth: this._scene._gantt.parsedOptions.taskBarCreationButtonStyle.lineWidth,
            points: [ {
                x: 0,
                y: 50
            }, {
                x: 100,
                y: 50
            } ]
        }), this.group.appendChild(this.lineHorizontal)), this.group.name = "task-creation-button", 
        this._scene.taskBar.group.addChild(this.group);
    }
    show(x, y, width, height) {
        if (this._scene._gantt.parsedOptions.taskBarCreationCustomLayout) this.group.appendChild(this._scene._gantt.parsedOptions.taskBarCreationCustomLayout({
            width: width,
            height: height,
            ganttInstance: this._scene._gantt
        }).rootContainer); else {
            const lineSize = Math.min(width, height) / 6;
            this.lineHorizontal.setAttribute("points", [ {
                x: (width - 4 * lineSize) / 2,
                y: height / 2
            }, {
                x: (width - 4 * lineSize) / 2 + 4 * lineSize,
                y: height / 2
            } ]), this.lineVertical.setAttribute("points", [ {
                x: width / 2,
                y: (height - 4 * lineSize) / 2
            }, {
                x: width / 2,
                y: (height - 4 * lineSize) / 2 + 4 * lineSize
            } ]);
        }
        this.group.setAttribute("x", x), this.group.setAttribute("y", y), this.group.setAttribute("width", width), 
        this.group.setAttribute("height", height), this.group.setAttribute("visibleAll", !0);
    }
    hide() {
        this.group.setAttribute("visibleAll", !1), this._scene._gantt.parsedOptions.taskBarCreationCustomLayout && this.group.removeAllChild();
    }
}
//# sourceMappingURL=task-creation-button.js.map