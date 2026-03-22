import { vglobal } from "@visactor/vtable/es/vrender";

import { handleWhell, isHorizontalScrollable, isVerticalScrollable } from "./scroll";

export function bindTouchListener(eventManager) {
    const gantt = eventManager._gantt, stateManager = gantt.stateManager, scenegraph = gantt.scenegraph;
    if (!1 === vglobal.envContribution.supportsTouchEvents) return;
    vglobal.addEventListener("contextmenu", (e => {
        e.stopPropagation(), e.preventDefault();
    }), {
        capture: !0
    }), eventManager.touchMovePoints = [], gantt.scenegraph.ganttGroup.addEventListener("touchstart", (e => {
        e.target.isChildOf(scenegraph.scrollbarComponent.vScrollBar) || e.target.isChildOf(scenegraph.scrollbarComponent.hScrollBar) || (eventManager.isTouchdown = !0, 
        eventManager.touchMovePoints.push({
            x: e.page.x,
            y: e.page.y,
            timestamp: Date.now()
        }));
    }));
    const globalTouchMoveCallback = e => {
        if (eventManager.isLongTouch && e.preventDefault(), eventManager.isTouchdown && isTouchEvent(e) && (eventManager.isTouchMove = !0, 
        eventManager.touchMovePoints.length > 4 && eventManager.touchMovePoints.shift(), 
        eventManager.touchMovePoints.push({
            x: e.changedTouches[0].pageX,
            y: e.changedTouches[0].pageY,
            timestamp: Date.now()
        }), eventManager._enableTableScroll)) {
            const deltaX = -eventManager.touchMovePoints[eventManager.touchMovePoints.length - 1].x + eventManager.touchMovePoints[eventManager.touchMovePoints.length - 2].x, deltaY = -eventManager.touchMovePoints[eventManager.touchMovePoints.length - 1].y + eventManager.touchMovePoints[eventManager.touchMovePoints.length - 2].y;
            handleWhell(e, stateManager, gantt), e.cancelable && ("none" === gantt.parsedOptions.overscrollBehavior || Math.abs(deltaY) >= Math.abs(deltaX) && 0 !== deltaY && isVerticalScrollable(deltaY, stateManager) || Math.abs(deltaY) <= Math.abs(deltaX) && 0 !== deltaX && isHorizontalScrollable(deltaX, stateManager)) && e.preventDefault();
        }
    };
    vglobal.addEventListener("touchmove", globalTouchMoveCallback, {
        passive: !1
    }), eventManager.globalEventListeners.push({
        name: "touchmove",
        env: "vglobal",
        callback: globalTouchMoveCallback
    });
    const globalTouchEndCallback = e => {
        var _a, _b;
        if (eventManager.touchEnd = !0, eventManager.isLongTouch = !1, eventManager.isTouchdown && isTouchEvent(e)) {
            if ((null === (_a = eventManager.touchMovePoints) || void 0 === _a ? void 0 : _a.length) && (eventManager.touchMovePoints.length > 4 && eventManager.touchMovePoints.shift(), 
            eventManager.touchMovePoints.push({
                x: e.changedTouches[0].pageX,
                y: e.changedTouches[0].pageY,
                timestamp: Date.now()
            }), eventManager._enableTableScroll)) {
                const firstPoint = eventManager.touchMovePoints[0], lastPoint = eventManager.touchMovePoints[(null === (_b = eventManager.touchMovePoints) || void 0 === _b ? void 0 : _b.length) - 1], vX = (lastPoint.x - firstPoint.x) / (lastPoint.timestamp - firstPoint.timestamp), vY = (lastPoint.y - firstPoint.y) / (lastPoint.timestamp - firstPoint.timestamp);
                eventManager.inertiaScroll.startInertia(vX, vY, .95), gantt.eventManager.inertiaScroll.setScrollHandle(((dx, dy) => {
                    handleWhell({
                        deltaX: -dx,
                        deltaY: -dy
                    }, gantt.stateManager, gantt);
                }));
            }
            eventManager.isTouchdown = !1, eventManager.isTouchMove = !1, eventManager.isDraging = !1, 
            eventManager.touchMovePoints = [];
        }
    };
    vglobal.addEventListener("touchend", globalTouchEndCallback), eventManager.globalEventListeners.push({
        name: "touchend",
        env: "vglobal",
        callback: globalTouchEndCallback
    });
    const globalTouchCancelCallback = e => {
        eventManager.touchEnd = !0, eventManager.isLongTouch = !1, eventManager.isTouchdown && (eventManager.isTouchdown = !1, 
        eventManager.isTouchMove = !1, eventManager.touchMovePoints = [], eventManager.isDraging = !1);
    };
    vglobal.addEventListener("touchcancel", globalTouchCancelCallback), eventManager.globalEventListeners.push({
        name: "touchcancel",
        env: "vglobal",
        callback: globalTouchCancelCallback
    });
}

function isTouchEvent(e) {
    return !!e.changedTouches;
}