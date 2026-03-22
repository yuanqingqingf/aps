import type { ITimelineScale } from './gantt-engine';
export interface IDataZoomAxisConfig {
    enabled?: boolean;
    containerId?: string;
    width?: number;
    height?: number;
    x?: number;
    y?: number;
    delayTime?: number;
}
export interface IZoomScale {
    enabled?: boolean;
    dataZoomAxis?: IDataZoomAxisConfig;
    minMillisecondsPerPixel?: number;
    maxMillisecondsPerPixel?: number;
    step?: number;
    levels: ITimelineScale[][];
}
export interface ILevelThreshold {
    levelIndex: number;
    minMillisecondsPerPixel: number;
    maxMillisecondsPerPixel: number;
    minUnit: string;
    minUnitMs: number;
}
export interface IZoomEventArgs {
    oldWidth: number;
    newWidth: number;
    scale: number;
    oldMillisecondsPerPixel?: number;
    newMillisecondsPerPixel?: number;
}
