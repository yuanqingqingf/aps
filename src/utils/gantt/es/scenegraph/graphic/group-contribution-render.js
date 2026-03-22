var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
    var d, c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc;
    if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};

import { injectable, BaseRenderContributionTime } from "@visactor/vtable/es/vrender";

let DateHeaderGroupBeforeRenderContribution = class {
    constructor() {
        this.time = BaseRenderContributionTime.beforeFillStroke, this.useStyle = !0, this.order = 0, 
        this.supportedAppName = "vtable";
    }
    drawShape(group, context, x, y, doFill, doStroke, fVisible, sVisible, groupAttribute, drawContext, fillCb, strokeCb, doFillOrStroke) {
        "date-header-cell" === group.name && group.forEachChildren((child => {
            var _a;
            if ("date-header-cell-text" === child.name && !0 === child.attribute.textStick) {
                const text = child;
                text.setAttribute("dx", 0);
                const textBounds = text.globalAABBBounds, stageBound = text.stage.globalAABBBounds, groupParent = text.parent.globalAABBBounds, intersectBounds = stageBound.intersect(groupParent);
                stageBound.intersect(groupParent) && (textBounds.width() >= intersectBounds.width() && text.attribute.last_dx ? text.setAttribute("dx", null !== (_a = text.attribute.last_dx) && void 0 !== _a ? _a : 0) : stageBound.x1 >= textBounds.x1 ? (text.setAttribute("dx", stageBound.x1 - textBounds.x1), 
                text.setAttribute("last_dx", stageBound.x1 - textBounds.x1)) : stageBound.x2 <= textBounds.x2 && (text.setAttribute("dx", stageBound.x2 - textBounds.x2), 
                text.setAttribute("last_dx", stageBound.x1 - textBounds.x1)));
            }
        }));
    }
};

DateHeaderGroupBeforeRenderContribution = __decorate([ injectable() ], DateHeaderGroupBeforeRenderContribution);

export { DateHeaderGroupBeforeRenderContribution };
//# sourceMappingURL=group-contribution-render.js.map