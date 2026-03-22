import { InteractionState } from "../ts-types";

import { throttle } from "../tools/util";

export function handleWhell(event, state, gantt, isWheelEvent = !0) {
    var _a, _b;
    let {deltaX: deltaX, deltaY: deltaY} = event;
    if (event.ctrlKey) {
        if (event.preventDefault(), !gantt.zoomScaleManager) return;
        const rect = gantt.element.getBoundingClientRect(), mouseX = event.clientX - rect.left;
        if (0 === deltaY) return;
        const zoomIn = event.deltaY < 0, isTouchpad = Math.abs(event.deltaY) < 100 && event.deltaY % 1 != 0, baseStep = (null === (_a = gantt.parsedOptions.zoom) || void 0 === _a ? void 0 : _a.step) || .015, zoomStep = isTouchpad ? baseStep : 5 * baseStep, factor = zoomIn ? 1 + zoomStep : 1 - zoomStep;
        return void gantt.zoomByFactor(factor, !0, mouseX);
    }
    event.shiftKey && event.deltaY && (deltaX = deltaY, deltaY = 0);
    const [optimizedDeltaX, optimizedDeltaY] = optimizeScrollXY(deltaX, deltaY, {
        horizontal: 1,
        vertical: 1
    });
    optimizedDeltaX && (state.setScrollLeft(state.scroll.horizontalBarPos + optimizedDeltaX), 
    gantt.scenegraph.scrollbarComponent.showHorizontalScrollBar(!0)), optimizedDeltaY && (state.setScrollTop(state.scroll.verticalBarPos + optimizedDeltaY), 
    gantt.scenegraph.scrollbarComponent.showVerticalScrollBar(!0)), isWheelEvent && state.resetInteractionState(), 
    (null === (_b = event.nativeEvent) || void 0 === _b ? void 0 : _b.cancelable) && ("none" === state._gantt.parsedOptions.overscrollBehavior || Math.abs(deltaY) >= Math.abs(deltaX) && 0 !== deltaY && isVerticalScrollable(deltaY, state) || Math.abs(deltaY) <= Math.abs(deltaX) && 0 !== deltaX && isHorizontalScrollable(deltaX, state)) && event.preventDefault();
}

function optimizeScrollXY(x, y, ratio) {
    var _a, _b;
    const angle = Math.abs(x / y), deltaX = angle <= .5 ? 0 : x, deltaY = angle > 2 ? 0 : y;
    return [ Math.ceil(deltaX * (null !== (_a = ratio.horizontal) && void 0 !== _a ? _a : 0)), Math.ceil(deltaY * (null !== (_b = ratio.vertical) && void 0 !== _b ? _b : 0)) ];
}

export function isVerticalScrollable(deltaY, state) {
    return 0 != state._gantt.getAllRowsHeight() - state._gantt.scenegraph.height && (!isScrollToTop(deltaY, state) && !isScrollToBottom(deltaY, state));
}

export function isHorizontalScrollable(deltaX, state) {
    return 0 != state._gantt.getAllDateColsWidth() - state._gantt.scenegraph.width && (!isScrollToLeft(deltaX, state) && !isScrollToRight(deltaX, state));
}

function isScrollToTop(deltaY, state) {
    return 0 !== state._gantt.getAllRowsHeight() - state._gantt.scenegraph.height && deltaY <= 0 && state.scroll.verticalBarPos < 1;
}

function isScrollToBottom(deltaY, state) {
    const totalHeight = state._gantt.getAllRowsHeight() - state._gantt.scenegraph.height;
    return 0 !== totalHeight && deltaY >= 0 && Math.abs(state.scroll.verticalBarPos - totalHeight) < 1;
}

function isScrollToLeft(deltaX, state) {
    return 0 !== state._gantt.getAllDateColsWidth() - state._gantt.scenegraph.width && deltaX <= 0 && state.scroll.horizontalBarPos < 1;
}

function isScrollToRight(deltaX, state) {
    const totalWidth = state._gantt.getAllDateColsWidth() - state._gantt.scenegraph.width;
    return 0 !== totalWidth && deltaX >= 0 && Math.abs(state.scroll.horizontalBarPos - totalWidth) < 1;
}

export function bindScrollBarListener(eventManager) {
    const table = eventManager._gantt, stateManager = table.stateManager, scenegraph = table.scenegraph;
    scenegraph.scrollbarComponent.vScrollBar.addEventListener("pointerover", (e => {
        scenegraph.scrollbarComponent.showVerticalScrollBar();
    })), scenegraph.scrollbarComponent.hScrollBar.addEventListener("pointerover", (e => {
        scenegraph.scrollbarComponent.showHorizontalScrollBar();
    })), scenegraph.scrollbarComponent.vScrollBar.addEventListener("pointerout", (e => {
        stateManager.interactionState !== InteractionState.scrolling && scenegraph.scrollbarComponent.hideVerticalScrollBar();
    })), scenegraph.scrollbarComponent.hScrollBar.addEventListener("pointerout", (e => {
        stateManager.interactionState !== InteractionState.scrolling && scenegraph.scrollbarComponent.hideHorizontalScrollBar();
    })), scenegraph.scrollbarComponent.vScrollBar.addEventListener("pointermove", (e => {
        e.stopPropagation();
    })), scenegraph.scrollbarComponent.vScrollBar.addEventListener("scrollDown", (e => {
        scenegraph._gantt.eventManager.isDown = !0;
    })), scenegraph.scrollbarComponent.vScrollBar.addEventListener("pointerup", (() => {
        scenegraph._gantt.eventManager.isDraging = !1, stateManager.interactionState === InteractionState.scrolling && stateManager.updateInteractionState(InteractionState.default);
    })), scenegraph.scrollbarComponent.vScrollBar.addEventListener("pointerupoutside", (() => {
        stateManager.interactionState === InteractionState.scrolling && stateManager.updateInteractionState(InteractionState.default);
    })), scenegraph.scrollbarComponent.vScrollBar.addEventListener("scrollUp", (e => {
        scenegraph._gantt.eventManager.isDraging = !1;
    })), scenegraph.scrollbarComponent.hScrollBar.addEventListener("pointermove", (e => {
        e.stopPropagation();
    })), scenegraph.scrollbarComponent.hScrollBar.addEventListener("pointerdown", (e => {
        e.stopPropagation();
    })), scenegraph.scrollbarComponent.hScrollBar.addEventListener("scrollDown", (e => {
        scenegraph._gantt.eventManager.isDown = !0, stateManager.interactionState !== InteractionState.scrolling && stateManager.updateInteractionState(InteractionState.scrolling);
    })), scenegraph.scrollbarComponent.hScrollBar.addEventListener("pointerup", (() => {
        stateManager.interactionState === InteractionState.scrolling && stateManager.updateInteractionState(InteractionState.default);
    })), scenegraph.scrollbarComponent.hScrollBar.addEventListener("pointerupoutside", (() => {
        stateManager.interactionState === InteractionState.scrolling && stateManager.updateInteractionState(InteractionState.default);
    })), scenegraph.scrollbarComponent.hScrollBar.addEventListener("scrollUp", (e => {
        scenegraph._gantt.eventManager.isDraging = !1;
    }));
    const throttleVerticalWheel = throttle(stateManager.updateVerticalScrollBar, 20), throttleHorizontalWheel = throttle(stateManager.updateHorizontalScrollBar, 20);
    scenegraph.scrollbarComponent.vScrollBar.addEventListener("scrollDrag", (e => {
        scenegraph._gantt.eventManager.isDown && (scenegraph._gantt.eventManager.isDraging = !0), 
        stateManager.interactionState !== InteractionState.scrolling && stateManager.updateInteractionState(InteractionState.scrolling);
        const ratio = e.detail.value[0] / (1 - e.detail.value[1] + e.detail.value[0]);
        throttleVerticalWheel(ratio, e);
    })), scenegraph.scrollbarComponent.hScrollBar.addEventListener("scrollDrag", (e => {
        scenegraph._gantt.eventManager.isDown && (scenegraph._gantt.eventManager.isDraging = !0), 
        stateManager.fastScrolling = !0, stateManager.interactionState !== InteractionState.scrolling && stateManager.updateInteractionState(InteractionState.scrolling);
        const ratio = e.detail.value[0] / (1 - e.detail.value[1] + e.detail.value[0]);
        throttleHorizontalWheel(ratio);
    }));
}
//# sourceMappingURL=scroll.js.map