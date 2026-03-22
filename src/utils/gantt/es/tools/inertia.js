import { vglobal } from "@visactor/vtable/es/vrender";

export class Inertia {
    constructor() {}
    setScrollHandle(scrollHandle) {
        this.scrollHandle = scrollHandle;
    }
    startInertia(speedX, speedY, friction) {
        this.stopped = !1, this.lastTime = Date.now(), this.speedX = speedX, this.speedY = speedY, 
        this.friction = friction, this.runingId || (this.runingId = vglobal.getRequestAnimationFrame()(this.inertia.bind(this)));
    }
    inertia() {
        var _a;
        if (this.stopped) return;
        const now = Date.now(), dffTime = now - this.lastTime;
        let stopped = !0;
        const f = Math.pow(this.friction, dffTime / 16), newSpeedX = f * this.speedX, newSpeedY = f * this.speedY;
        let dx = 0, dy = 0;
        Math.abs(newSpeedX) > .05 && (stopped = !1, dx = (this.speedX + newSpeedX) / 2 * dffTime), 
        Math.abs(newSpeedY) > .05 && (stopped = !1, dy = (this.speedY + newSpeedY) / 2 * dffTime), 
        null === (_a = this.scrollHandle) || void 0 === _a || _a.call(this, dx, dy), stopped ? this.runingId = null : (this.lastTime = now, 
        this.speedX = newSpeedX, this.speedY = newSpeedY, this.runingId = vglobal.getRequestAnimationFrame()(this.inertia.bind(this)));
    }
    endInertia() {
        vglobal.getCancelAnimationFrame()(this.runingId), this.runingId = null, this.stopped = !0;
    }
    isInertiaScrolling() {
        return !!this.runingId;
    }
}
//# sourceMappingURL=inertia.js.map