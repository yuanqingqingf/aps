import { Group, createLine } from "@visactor/vtable/es/vrender";

export class DragOrderLine {
    constructor(scene) {
        this._scene = scene, this.dragLineContainer = new Group({
            x: 0,
            y: 0,
            width: scene._gantt.tableNoFrameWidth,
            height: Math.min(scene._gantt.tableNoFrameHeight, scene._gantt.drawHeight),
            pickable: !1,
            clip: !0,
            visible: !1
        }), this.dragLineContainer.name = "drag-order-line-container", scene.ganttGroup.addChild(this.dragLineContainer), 
        this.initDragLine();
    }
    initDragLine() {
        if (this._scene._gantt.taskListTableInstance) {
            const style = this._scene._gantt.taskListTableInstance.theme.dragHeaderSplitLine, lineObj = createLine({
                pickable: !1,
                stroke: "function" == typeof style.lineColor ? style.lineColor({}) : style.lineColor,
                lineWidth: style.lineWidth,
                points: []
            });
            this.dragLine = lineObj, this.dragLineContainer.appendChild(lineObj);
        }
    }
    showDragLine(y) {
        this.dragLineContainer.showAll(), this.dragLine.setAttribute("points", [ {
            x: 0,
            y: y
        }, {
            x: this._scene._gantt.tableNoFrameWidth,
            y: y
        } ]);
    }
    hideDragLine() {
        this.dragLineContainer.hideAll();
    }
}
//# sourceMappingURL=drag-order-line.js.map