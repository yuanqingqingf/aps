import { DataZoomIntegration } from "./DataZoomIntegration";

import { GANTT_EVENT_TYPE } from "../ts-types/EVENT_TYPE";

export class ZoomScaleManager {
    constructor(gantt, config) {
        this.currentLevelIndex = 0, this.levelBoundaries = [], this.globalMinMillisecondsPerPixel = 0, 
        this.globalMaxMillisecondsPerPixel = 0, this.dataZoomIntegration = null, this.gantt = gantt;
        const finalConfig = Object.assign({
            enabled: !0,
            levels: []
        }, config);
        if (this.config = finalConfig, this.initializeZoomLimits(), this.sortLevelsByCoarseness(), 
        this.calculateGlobalMillisecondsPerPixelRange(), this.calculateLevelBoundaries(), 
        this.updateZoomLimits(), this.config.levels.length > 0) {
            const initialMillisecondsPerPixel = this.calculateInitialMillisecondsPerPixel();
            this.initializeWithMillisecondsPerPixel(initialMillisecondsPerPixel);
        }
        this.initializeDataZoomIfNeeded();
    }
    initializeZoomLimits() {
        var _a, _b, _c, _d, _e;
        const existingZoom = this.gantt.parsedOptions.zoom, zoomScaleConfig = this.config;
        this.gantt.parsedOptions.zoom = {
            minMillisecondsPerPixel: null !== (_b = null !== (_a = null == existingZoom ? void 0 : existingZoom.minMillisecondsPerPixel) && void 0 !== _a ? _a : zoomScaleConfig.minMillisecondsPerPixel) && void 0 !== _b ? _b : 1e3,
            maxMillisecondsPerPixel: null !== (_d = null !== (_c = null == existingZoom ? void 0 : existingZoom.maxMillisecondsPerPixel) && void 0 !== _c ? _c : zoomScaleConfig.maxMillisecondsPerPixel) && void 0 !== _d ? _d : 6e6,
            step: null !== (_e = zoomScaleConfig.step) && void 0 !== _e ? _e : .015
        };
    }
    initializeDataZoomIfNeeded() {
        var _a, _b, _c;
        const dataZoomConfig = this.config.dataZoomAxis;
        if (!(null == dataZoomConfig ? void 0 : dataZoomConfig.enabled)) return;
        const finalConfig = {
            containerId: dataZoomConfig.containerId,
            width: dataZoomConfig.width,
            height: null !== (_a = dataZoomConfig.height) && void 0 !== _a ? _a : 30,
            x: dataZoomConfig.x,
            y: null !== (_b = dataZoomConfig.y) && void 0 !== _b ? _b : 0,
            delayTime: null !== (_c = dataZoomConfig.delayTime) && void 0 !== _c ? _c : 10
        };
        try {
            this.dataZoomIntegration = new DataZoomIntegration(this.gantt, finalConfig);
        } catch (error) {}
    }
    handleTableWidthChange() {
        this.dataZoomIntegration && this.dataZoomIntegration.updateResponsive();
    }
    sortLevelsByCoarseness() {
        this.config.levels.length <= 1 || this.config.levels.sort(((levelA, levelB) => {
            const minUnitA = this.findMinTimeUnit(levelA), minUnitB = this.findMinTimeUnit(levelB), unitMsA = this.getUnitMilliseconds(minUnitA.unit, minUnitA.step);
            return this.getUnitMilliseconds(minUnitB.unit, minUnitB.step) - unitMsA;
        }));
    }
    calculateGlobalMillisecondsPerPixelRange() {
        const levels = this.config.levels;
        if (0 === levels.length) return;
        let maxMinUnit = null, maxMinUnitMs = 0, minMinUnit = null, minMinUnitMs = 1 / 0;
        for (const level of levels) {
            const minUnit = this.findMinTimeUnit(level), unitMs = this.getUnitMilliseconds(minUnit.unit, minUnit.step);
            unitMs > maxMinUnitMs && (maxMinUnitMs = unitMs, maxMinUnit = minUnit), unitMs < minMinUnitMs && (minMinUnitMs = unitMs, 
            minMinUnit = minUnit);
        }
        if (maxMinUnit && minMinUnit && (this.globalMinMillisecondsPerPixel = minMinUnitMs / 120, 
        this.globalMaxMillisecondsPerPixel = maxMinUnitMs / 150, this.globalMinMillisecondsPerPixel > this.globalMaxMillisecondsPerPixel)) {
            const temp = this.globalMinMillisecondsPerPixel;
            this.globalMinMillisecondsPerPixel = this.globalMaxMillisecondsPerPixel, this.globalMaxMillisecondsPerPixel = temp;
        }
    }
    calculateLevelBoundaries() {
        const levelCount = this.config.levels.length;
        if (0 === levelCount) return;
        this.levelBoundaries = [];
        const idealBoundaries = [];
        idealBoundaries[levelCount] = this.globalMinMillisecondsPerPixel;
        for (let i = levelCount - 1; i >= 1; i--) {
            const currentLevel = this.config.levels[i], currentMinUnit = this.findMinTimeUnit(currentLevel), idealBoundary = this.getUnitMilliseconds(currentMinUnit.unit, currentMinUnit.step) / this.getMinColWidthForUnit(currentMinUnit.unit, currentMinUnit.step);
            idealBoundaries[i] = idealBoundary;
        }
        idealBoundaries[0] = this.globalMaxMillisecondsPerPixel, this.levelBoundaries = [ ...idealBoundaries ];
        for (let i = 1; i < levelCount; i++) {
            if (this.levelBoundaries[i] >= this.levelBoundaries[i - 1]) {
                const prevBoundary = this.levelBoundaries[i - 1], nextBoundary = this.levelBoundaries[i + 1] || this.globalMinMillisecondsPerPixel;
                this.levelBoundaries[i] = (prevBoundary + nextBoundary) / 2;
            }
            this.levelBoundaries[i] = Math.max(this.globalMinMillisecondsPerPixel, Math.min(this.globalMaxMillisecondsPerPixel, this.levelBoundaries[i]));
        }
    }
    updateZoomLimits() {
        this.gantt.parsedOptions.zoom || (this.gantt.parsedOptions.zoom = {}), this.gantt.parsedOptions.zoom.minMillisecondsPerPixel = this.globalMinMillisecondsPerPixel, 
        this.gantt.parsedOptions.zoom.maxMillisecondsPerPixel = this.globalMaxMillisecondsPerPixel;
    }
    getGlobalMinMillisecondsPerPixel() {
        return this.globalMinMillisecondsPerPixel;
    }
    getGlobalMaxMillisecondsPerPixel() {
        return this.globalMaxMillisecondsPerPixel;
    }
    calculateInitialMillisecondsPerPixel() {
        return this.globalMinMillisecondsPerPixel + .4 * (this.globalMaxMillisecondsPerPixel - this.globalMinMillisecondsPerPixel);
    }
    initializeWithMillisecondsPerPixel(millisecondsPerPixel) {
        if (0 === this.config.levels.length) return;
        const optimalLevel = this.findOptimalLevel(millisecondsPerPixel);
        this.setInitialLevel(optimalLevel);
    }
    setInitialLevel(levelIndex) {
        if (levelIndex < 0 || levelIndex >= this.config.levels.length) return;
        const levelScales = this.config.levels[levelIndex];
        levelScales && 0 !== levelScales.length && (this.gantt.options.timelineHeader.scales = [ ...levelScales ], 
        this.currentLevelIndex = levelIndex);
    }
    findOptimalLevel(millisecondsPerPixel) {
        const clampedMillisecondsPerPixel = Math.max(this.globalMinMillisecondsPerPixel, Math.min(this.globalMaxMillisecondsPerPixel, millisecondsPerPixel));
        for (let i = 0; i < this.levelBoundaries.length - 1; i++) if (clampedMillisecondsPerPixel <= this.levelBoundaries[i] && clampedMillisecondsPerPixel > this.levelBoundaries[i + 1]) return i;
        return this.config.levels.length - 1;
    }
    switchToLevel(levelIndex) {
        if (levelIndex < 0 || levelIndex >= this.config.levels.length) return !1;
        if (this.currentLevelIndex === levelIndex) return !0;
        const levelScales = this.config.levels[levelIndex];
        if (!levelScales || 0 === levelScales.length) return !1;
        try {
            return this.gantt.updateScales([ ...levelScales ]), this.currentLevelIndex = levelIndex, 
            this.gantt.recalculateTimeScale(), !0;
        } catch (error) {
            return !1;
        }
    }
    findMinTimeUnit(scales) {
        let minUnit = scales[0], minUnitMs = this.getUnitMilliseconds(minUnit.unit, minUnit.step);
        for (const scale of scales) {
            const unitMs = this.getUnitMilliseconds(scale.unit, scale.step);
            unitMs < minUnitMs && (minUnitMs = unitMs, minUnit = scale);
        }
        return minUnit;
    }
    getUnitMilliseconds(unit, step) {
        const unitMs = {
            second: 1e3,
            minute: 6e4,
            hour: 36e5,
            day: 864e5,
            week: 6048e5,
            month: 2592e6,
            quarter: 7776e6,
            year: 31536e6
        };
        return (unitMs[unit] || unitMs.day) * step;
    }
    getMinColWidthForUnit(unit, step) {
        switch (unit) {
          case "hour":
            return step > 1 ? 120 : 60;

          case "minute":
            return 80;

          case "second":
            return 100;

          default:
            return 60;
        }
    }
    getCurrentLevel() {
        return this.currentLevelIndex;
    }
    getInitialMillisecondsPerPixel() {
        return this.calculateInitialMillisecondsPerPixel();
    }
    getCurrentZoomState() {
        if (0 === this.config.levels.length) return null;
        const currentLevel = this.config.levels[this.currentLevelIndex], minUnit = this.findMinTimeUnit(currentLevel), currentMillisecondsPerPixel = this.gantt.getCurrentMillisecondsPerPixel(), currentColWidth = this.getUnitMilliseconds(minUnit.unit, minUnit.step) / currentMillisecondsPerPixel;
        return {
            minUnit: minUnit.unit,
            step: minUnit.step,
            levelNum: this.currentLevelIndex,
            currentColWidth: Math.round(10 * currentColWidth) / 10
        };
    }
    setZoomPosition(params) {
        if (0 === this.config.levels.length) return !1;
        const {minUnit: minUnit, step: step, levelNum: levelNum, colWidth: colWidth} = params;
        let targetMillisecondsPerPixel, targetLevelIndex = null;
        if (void 0 !== minUnit && void 0 !== step) {
            if (targetLevelIndex = this.findLevelByMinUnit(minUnit, step), null === targetLevelIndex) return !1;
        } else {
            if (void 0 === levelNum) return !1;
            if (levelNum < 0 || levelNum >= this.config.levels.length) return !1;
            targetLevelIndex = levelNum;
        }
        if (void 0 !== colWidth) {
            const targetLevel = this.config.levels[targetLevelIndex], targetMinUnit = this.findMinTimeUnit(targetLevel);
            targetMillisecondsPerPixel = this.getUnitMilliseconds(targetMinUnit.unit, targetMinUnit.step) / colWidth;
            const upperBoundary = this.levelBoundaries[targetLevelIndex], lowerBoundary = this.levelBoundaries[targetLevelIndex + 1];
            (targetMillisecondsPerPixel < lowerBoundary || targetMillisecondsPerPixel > upperBoundary) && (targetMillisecondsPerPixel = (upperBoundary + lowerBoundary) / 2);
        } else {
            targetMillisecondsPerPixel = (this.levelBoundaries[targetLevelIndex] + this.levelBoundaries[targetLevelIndex + 1]) / 2;
        }
        return targetLevelIndex !== this.currentLevelIndex && this.switchToLevel(targetLevelIndex), 
        this.gantt.setMillisecondsPerPixel(targetMillisecondsPerPixel), !0;
    }
    findLevelByMinUnit(unit, step) {
        for (let i = 0; i < this.config.levels.length; i++) {
            const level = this.config.levels[i], minUnit = this.findMinTimeUnit(level);
            if (minUnit.unit === unit && minUnit.step === step) return i;
        }
        return null;
    }
    zoomIn(factor = 1.1, center = !0, centerX) {
        this.gantt.zoomByFactor(factor, center, centerX);
    }
    zoomOut(factor = .9, center = !0, centerX) {
        this.gantt.zoomByFactor(factor, center, centerX);
    }
    zoomByPercentage(percentage, center = !0, centerX) {
        const currentMillisecondsPerPixel = this.gantt.getCurrentMillisecondsPerPixel(), targetMillisecondsPerPixel = currentMillisecondsPerPixel - (this.globalMaxMillisecondsPerPixel - this.globalMinMillisecondsPerPixel) * percentage / 100;
        let centerTimePosition;
        center && this.gantt.scenegraph && (void 0 === centerX && (centerX = this.gantt.scenegraph.width / 2), 
        centerTimePosition = (this.gantt.stateManager.scroll.horizontalBarPos + centerX) * currentMillisecondsPerPixel);
        const targetLevel = this.findOptimalLevel(targetMillisecondsPerPixel);
        if (targetLevel !== this.getCurrentLevel() && this.switchToLevel(targetLevel), this.gantt.setMillisecondsPerPixel(targetMillisecondsPerPixel), 
        void 0 !== centerTimePosition && void 0 !== centerX) {
            const newScrollLeft = centerTimePosition / this.gantt.getCurrentMillisecondsPerPixel() - centerX;
            this.gantt.stateManager.setScrollLeft(newScrollLeft);
        }
    }
    getDataZoomIntegration() {
        return this.dataZoomIntegration;
    }
    createDataZoomIntegration(config) {
        return this.dataZoomIntegration && this.dataZoomIntegration.destroy(), this.dataZoomIntegration = new DataZoomIntegration(this.gantt, config), 
        this.dataZoomIntegration;
    }
    destroyDataZoomIntegration() {
        this.dataZoomIntegration && (this.dataZoomIntegration.destroy(), this.dataZoomIntegration = null);
    }
    updateDataZoomResponsive() {
        this.dataZoomIntegration && this.dataZoomIntegration.updateResponsive();
    }
    recalculateTimeScale() {
        const primaryScale = this.gantt.parsedOptions.reverseSortedTimelineScales[0];
        if (!primaryScale) return;
        let msPerStep;
        switch (primaryScale.unit) {
          case "second":
            msPerStep = 1e3 * primaryScale.step;
            break;

          case "minute":
            msPerStep = 6e4 * primaryScale.step;
            break;

          case "hour":
            msPerStep = 36e5 * primaryScale.step;
            break;

          case "day":
          default:
            msPerStep = 864e5 * primaryScale.step;
            break;

          case "week":
            msPerStep = 6048e5 * primaryScale.step;
            break;

          case "month":
            msPerStep = 2592e6 * primaryScale.step;
            break;

          case "quarter":
            msPerStep = 7776e6 * primaryScale.step;
            break;

          case "year":
            msPerStep = 31536e6 * primaryScale.step;
        }
        const newTimelineColWidth = msPerStep / this.gantt.getCurrentMillisecondsPerPixel();
        this.gantt.parsedOptions.timelineColWidth = newTimelineColWidth, this.gantt._generateTimeLineDateMap(), 
        this.gantt.scenegraph && (this.gantt._updateSize(), this.gantt.scenegraph.refreshAll());
    }
    zoomByFactor(factor, keepCenter = !0, centerX) {
        var _a, _b, _c, _d;
        const minMillisecondsPerPixel = null !== (_b = null === (_a = this.gantt.parsedOptions.zoom) || void 0 === _a ? void 0 : _a.minMillisecondsPerPixel) && void 0 !== _b ? _b : 2e5, maxMillisecondsPerPixel = null !== (_d = null === (_c = this.gantt.parsedOptions.zoom) || void 0 === _c ? void 0 : _c.maxMillisecondsPerPixel) && void 0 !== _d ? _d : 3e6, oldMillisecondsPerPixel = this.gantt.getCurrentMillisecondsPerPixel(), oldWidth = this.gantt.parsedOptions.timelineColWidth;
        let centerTimePosition;
        if (keepCenter) {
            void 0 === centerX && (centerX = this.gantt.scenegraph.width / 2);
            const scrollOffsetMs = (this.gantt.stateManager.scroll.horizontalBarPos + centerX) * oldMillisecondsPerPixel;
            centerTimePosition = this.gantt.parsedOptions._minDateTime + scrollOffsetMs;
        }
        const currentMillisecondsPerPixel = this.gantt.getCurrentMillisecondsPerPixel();
        let adjustedFactor = factor;
        const zoomRatio = Math.log(currentMillisecondsPerPixel / 144e4) / Math.log(2);
        if (currentMillisecondsPerPixel < 144e4) {
            const enhancement = Math.pow(1.2, -zoomRatio);
            adjustedFactor = Math.pow(factor, enhancement);
        } else {
            const dampening = Math.pow(.9, zoomRatio);
            adjustedFactor = Math.pow(factor, dampening);
        }
        const newMillisecondsPerPixel = this.gantt.getCurrentMillisecondsPerPixel() / adjustedFactor, clampedMillisecondsPerPixel = Math.max(minMillisecondsPerPixel, Math.min(maxMillisecondsPerPixel, newMillisecondsPerPixel));
        this.gantt.setMillisecondsPerPixel(clampedMillisecondsPerPixel);
        const targetLevel = this.findOptimalLevel(clampedMillisecondsPerPixel);
        if (targetLevel !== this.getCurrentLevel() ? this.switchToLevel(targetLevel) : this.recalculateTimeScale(), 
        keepCenter && void 0 !== centerTimePosition && void 0 !== centerX) {
            const actualMillisecondsPerPixel = this.gantt.getCurrentMillisecondsPerPixel(), newScrollLeft = (centerTimePosition - this.gantt.parsedOptions._minDateTime) / actualMillisecondsPerPixel - centerX;
            this.gantt.stateManager.setScrollLeft(newScrollLeft);
        }
        if (this.gantt.hasListeners(GANTT_EVENT_TYPE.ZOOM)) {
            const actualMillisecondsPerPixel = this.gantt.getCurrentMillisecondsPerPixel();
            this.gantt.fireListeners(GANTT_EVENT_TYPE.ZOOM, {
                oldWidth: oldWidth,
                newWidth: this.gantt.parsedOptions.timelineColWidth,
                scale: oldMillisecondsPerPixel / actualMillisecondsPerPixel,
                oldMillisecondsPerPixel: oldMillisecondsPerPixel,
                newMillisecondsPerPixel: actualMillisecondsPerPixel
            });
        }
    }
}
//# sourceMappingURL=ZoomScaleManager.js.map