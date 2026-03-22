import type { Gantt } from '../Gantt';
import type { IGanttPlugin } from './interface';
import type { GanttConstructorOptions } from '../ts-types/gantt-engine';
export declare class PluginManager {
    private plugins;
    private gantt;
    constructor(gantt: Gantt, options: GanttConstructorOptions);
    private _initializePluginRun;
    register(plugin: IGanttPlugin): void;
    registerAll(plugins: IGanttPlugin[]): void;
    getPlugin(id: string): IGanttPlugin | undefined;
    getPluginByName(name: string): IGanttPlugin | undefined;
    private _bindGanttEventForPlugin;
    updatePlugins(plugins?: IGanttPlugin[]): void;
    release(): void;
}
