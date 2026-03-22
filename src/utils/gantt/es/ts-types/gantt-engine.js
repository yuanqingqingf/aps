export var DependencyType;

!function(DependencyType) {
    DependencyType.FinishToStart = "finish_to_start", DependencyType.StartToStart = "start_to_start", 
    DependencyType.FinishToFinish = "finish_to_finish", DependencyType.StartToFinish = "start_to_finish";
}(DependencyType || (DependencyType = {}));

export var TasksShowMode;

!function(TasksShowMode) {
    TasksShowMode.Tasks_Separate = "tasks_separate", TasksShowMode.Sub_Tasks_Inline = "sub_tasks_inline", 
    TasksShowMode.Sub_Tasks_Separate = "sub_tasks_separate", TasksShowMode.Sub_Tasks_Arrange = "sub_tasks_arrange", 
    TasksShowMode.Sub_Tasks_Compact = "sub_tasks_compact", TasksShowMode.Project_Sub_Tasks_Inline = "project_sub_tasks_inline";
}(TasksShowMode || (TasksShowMode = {}));

export var TaskType;

!function(TaskType) {
    TaskType.TASK = "task", TaskType.PROJECT = "project", TaskType.MILESTONE = "milestone";
}(TaskType || (TaskType = {}));
//# sourceMappingURL=gantt-engine.js.map