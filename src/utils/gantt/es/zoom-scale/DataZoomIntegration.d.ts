import type { Gantt } from '../Gantt';
export interface DataZoomConfig {
    containerId?: string;
    start?: number;
    end?: number;
    width?: number;
    height?: number;
    x?: number;
    y?: number;
    delayTime?: number;
}
export interface DataZoomLimits {
    minRangeRatio: number;
    maxRangeRatio: number;
    minMillisecondsPerPixel: number;
    maxMillisecondsPerPixel: number;
}
export declare class DataZoomIntegration {
    private gantt;
    private dataZoomAxis;
    private stage;
    private canvas;
    private isUpdatingFromDataZoom;
    private isUpdatingFromGantt;
    private lastDataZoomState;
    private lastSpanLimits;
    private cleanupCallbacks;
    private resizeTimeout;
    private isInitializing;
    constructor(gantt: Gantt, config: DataZoomConfig);
    private syncDataZoomToGanttView;
    private getContainerId;
    private initializeDataZoom;
    private setupEventListeners;
    private calculateDataZoomLimits;
    private updateDataZoomLimits;
    private getGanttViewBoundaries;
    private applyDataZoomRangeToGantt;
    private syncInitialPosition;
    syncToGantt(): void;
    syncToDataZoom(): void;
    private syncToGanttWithState;
    setRange(start: number, end: number): void;
    getRange(): {
        start: number;
        end: number;
    };
    resize(width?: number, height?: number): void;
    updateResponsive(): void;
    updatePosition(x?: number, y?: number): void;
    destroy(): void;
}
