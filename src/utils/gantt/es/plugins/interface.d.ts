import type { EVENT_TYPES } from '../ts-types/EVENT_TYPE';
import type { Gantt } from '../Gantt';
export interface IGanttPlugin {
    id: string;
    name: string;
    runTime?: EVENT_TYPES[keyof EVENT_TYPES][];
    run: (...args: any[]) => void;
    update?: () => void;
    release?: (gantt: Gantt) => void;
}
