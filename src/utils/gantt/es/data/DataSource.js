import { createDateAtMidnight, getEndDateByTimeUnit, getStartDateByTimeUnit } from "../tools/util";

import { TasksShowMode, TaskType } from "../ts-types/gantt-engine";

import { isValid } from "@visactor/vutils";

export class DataSource {
    constructor(_gantt) {
        this._gantt = _gantt, this.records = _gantt.records, this.processRecords();
    }
    processRecords() {
        const needMinDate = !this._gantt.options.minDate, needMaxDate = !this._gantt.options.maxDate;
        let minDate = Number.MAX_SAFE_INTEGER, maxDate = Number.MIN_SAFE_INTEGER;
        if ((needMinDate || needMaxDate || this._gantt.parsedOptions.tasksShowMode === TasksShowMode.Sub_Tasks_Inline || this._gantt.parsedOptions.tasksShowMode === TasksShowMode.Sub_Tasks_Compact) && this.records.length) {
            for (let i = 0; i < this.records.length; i++) {
                const record = this.records[i];
                if (needMinDate && record[this._gantt.parsedOptions.startDateField]) {
                    const recordMinDate = createDateAtMidnight(record[this._gantt.parsedOptions.startDateField]);
                    minDate = Math.min(minDate, recordMinDate.getTime());
                }
                if (needMaxDate && record[this._gantt.parsedOptions.endDateField]) {
                    const recordMaxDate = createDateAtMidnight(record[this._gantt.parsedOptions.endDateField]);
                    maxDate = Math.max(maxDate, recordMaxDate.getTime());
                }
                this._gantt.parsedOptions.tasksShowMode !== TasksShowMode.Sub_Tasks_Inline && this._gantt.parsedOptions.tasksShowMode !== TasksShowMode.Sub_Tasks_Compact || record.children && record.children.sort(((a, b) => createDateAtMidnight(a[this._gantt.parsedOptions.startDateField]).getTime() - createDateAtMidnight(b[this._gantt.parsedOptions.startDateField]).getTime()));
            }
            const {unit: minTimeUnit, startOfWeek: startOfWeek, step: step} = this._gantt.parsedOptions.reverseSortedTimelineScales[0];
            needMinDate && (this._gantt.parsedOptions.minDate = getStartDateByTimeUnit(new Date(minDate), minTimeUnit, startOfWeek), 
            this._gantt.parsedOptions._minDateTime = this._gantt.parsedOptions.minDate.getTime()), 
            needMinDate && !needMaxDate && (this._gantt.parsedOptions.maxDate = getEndDateByTimeUnit(this._gantt.parsedOptions.minDate, new Date(this._gantt.options.maxDate), minTimeUnit, step), 
            this._gantt.parsedOptions._maxDateTime = this._gantt.parsedOptions.maxDate.getTime()), 
            needMaxDate && (this._gantt.parsedOptions.maxDate = getEndDateByTimeUnit(this._gantt.parsedOptions.minDate, new Date(maxDate), minTimeUnit, step), 
            this._gantt.parsedOptions._maxDateTime = this._gantt.parsedOptions.maxDate.getTime());
        }
    }
    adjustOrder(source_index, source_sub_task_index, target_index, target_sub_task_index) {
        var _a, _b, _c, _d, _e, _f, _g;
        if ((this._gantt.parsedOptions.tasksShowMode !== TasksShowMode.Sub_Tasks_Arrange && this._gantt.parsedOptions.tasksShowMode !== TasksShowMode.Sub_Tasks_Compact || source_index !== target_index) && !(target_index < 0 || target_sub_task_index < 0)) if (this._gantt.parsedOptions.tasksShowMode === TasksShowMode.Sub_Tasks_Inline) {
            if (isValid(source_sub_task_index) && isValid(target_sub_task_index) && isValid(source_index) && isValid(target_index)) {
                const sub_task_record = this.records[source_index].children[source_sub_task_index];
                this.records[source_index].children.splice(source_sub_task_index, 1), (null === (_a = this.records[target_index]) || void 0 === _a ? void 0 : _a.children) || (this.records[target_index].children = []), 
                this.records[target_index].children.splice(target_sub_task_index, 0, sub_task_record);
            }
            null === (_c = null === (_b = this.records[target_index]) || void 0 === _b ? void 0 : _b.children) || void 0 === _c || _c.sort(((a, b) => createDateAtMidnight(a[this._gantt.parsedOptions.startDateField]).getTime() - createDateAtMidnight(b[this._gantt.parsedOptions.startDateField]).getTime()));
        } else if (this._gantt.parsedOptions.tasksShowMode === TasksShowMode.Project_Sub_Tasks_Inline) {
            if (isValid(source_sub_task_index) && isValid(target_sub_task_index) && isValid(source_index) && isValid(target_index)) {
                this.records[source_index].type, TaskType.PROJECT;
                const targetIsProject = this.records[target_index].type === TaskType.PROJECT, sub_task_record = this.records[source_index].children[source_sub_task_index];
                this.records[source_index].children.splice(source_sub_task_index, 1), (null === (_d = this.records[target_index]) || void 0 === _d ? void 0 : _d.children) || (this.records[target_index].children = []), 
                this.records[target_index].children.splice(target_sub_task_index, 0, sub_task_record), 
                targetIsProject && (null === (_f = null === (_e = this.records[target_index]) || void 0 === _e ? void 0 : _e.children) || void 0 === _f || _f.sort(((a, b) => createDateAtMidnight(a[this._gantt.parsedOptions.startDateField]).getTime() - createDateAtMidnight(b[this._gantt.parsedOptions.startDateField]).getTime())));
            }
        } else if (isValid(source_sub_task_index) && isValid(target_sub_task_index) && isValid(source_index) && isValid(target_index)) {
            const sub_task_record = this.records[source_index].children[source_sub_task_index];
            this.records[source_index].children.splice(source_sub_task_index, 1), (null === (_g = this.records[target_index]) || void 0 === _g ? void 0 : _g.children) || (this.records[target_index].children = []), 
            this.records[target_index].children.splice(target_sub_task_index, 0, sub_task_record);
        }
    }
    setRecords(records) {
        this.records = records, this.processRecords();
    }
}
//# sourceMappingURL=DataSource.js.map