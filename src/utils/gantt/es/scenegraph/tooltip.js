import { PopTip } from "@visactor/vtable/es/vrender";

export class ToolTip {
    constructor(scene) {
        this._scene = scene, this.group = new PopTip({
            position: "top",
            content: "",
            contentStyle: {
                fill: "#fff"
            },
            visible: !1,
            panel: {
                background: "#14161c",
                cornerRadius: 4
            }
        }), scene.ganttGroup.addChild(this.group);
    }
    show(graphic) {
        var _a, _b, _c;
        const options = (null === (_a = this._scene._gantt.parsedOptions.markLineCreateOptions) || void 0 === _a ? void 0 : _a.markLineCreationHoverToolTip) || {}, matrix = graphic.globalTransMatrix, targetWidth = graphic.attribute.width, targetHeight = graphic.attribute.height;
        let x, y;
        const position = options.position || "top";
        "top" === position ? (x = matrix.e + targetWidth / 2 - 2, y = matrix.f) : "bottom" === position && (x = matrix.e + targetWidth / 2 - 2, 
        y = matrix.f + targetHeight);
        const contentStyle = (null === (_b = options.style) || void 0 === _b ? void 0 : _b.contentStyle) || {
            fill: "#fff"
        }, pannelStyle = (null === (_c = options.style) || void 0 === _c ? void 0 : _c.panelStyle) || {
            background: "#14161c",
            cornerRadius: 4
        };
        this.group.setAttributes({
            content: options.tipContent,
            position: position,
            visibleAll: !0,
            visible: !0,
            contentStyle: contentStyle,
            panel: Object.assign(Object.assign({}, pannelStyle), {
                visible: !0
            }),
            x: x,
            y: y
        });
    }
    hide() {
        this.group.setAttributes({
            visibleAll: !1,
            visible: !1
        });
    }
}
//# sourceMappingURL=tooltip.js.map