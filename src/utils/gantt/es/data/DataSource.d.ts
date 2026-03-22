import type { Gantt } from '../Gantt';
export declare class DataSource {
    records: any[];
    _gantt: Gantt;
    constructor(_gantt: Gantt);
    processRecords(): void;
    adjustOrder(source_index: number, source_sub_task_index: number, target_index: number, target_sub_task_index: number): void;
    setRecords(records: any[]): void;
}
