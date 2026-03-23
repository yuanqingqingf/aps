import { Group, createLine, Polygon } from "@visactor/vtable/es/vrender";

import { createDateAtMidnight } from "../tools/util";

import { clearRecordLinkInfos, findRecordByTaskKey } from "../gantt-helper";

import { DependencyType, TasksShowMode, TaskType } from "../ts-types";

export class DependencyLink {
    constructor(scene) {
        this._scene = scene, this.width = scene._gantt.tableNoFrameWidth, this.height = scene._gantt.gridHeight, 
        this.group = new Group({
            x: 0,
            y: scene._gantt.getAllHeaderRowsHeight(),
            width: this.width,
            height: this.height,
            pickable: !1,
            clip: !0
        }), this.group.name = "dependency-link-container", scene.ganttGroup.addChild(this.group), 
        this.initLinkLines();
    }
    initLinkLines() {
        var _a;
        if (clearRecordLinkInfos(this._scene._gantt.records), this.linkLinesContainer = new Group({
            x: 0,
            y: 0,
            width: this._scene._gantt.getAllDateColsWidth(),
            height: this._scene._gantt.getAllTaskBarsHeight(),
            pickable: !1,
            clip: !0
        }), this.group.appendChild(this.linkLinesContainer), null === (_a = this._scene._gantt.records) || void 0 === _a ? void 0 : _a.length) for (let i = 0; i < this._scene._gantt.parsedOptions.dependencyLinks.length; i++) this.initLinkLine(i);
    }
    initLinkLine(index) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
        const {taskKeyField: taskKeyField, dependencyLinks: dependencyLinks} = this._scene._gantt.parsedOptions, link = dependencyLinks[index], {linkedToTaskKey: linkedToTaskKey, linkedFromTaskKey: linkedFromTaskKey, type: type} = link, linkedToTaskRecord = findRecordByTaskKey(this._scene._gantt.records, taskKeyField, linkedToTaskKey), linkedFromTaskRecord = findRecordByTaskKey(this._scene._gantt.records, taskKeyField, linkedFromTaskKey);
        if (!linkedToTaskRecord || !linkedFromTaskRecord) return;
        let linkedToTaskStartDate, linkedToTaskEndDate, linkedToTaskTaskDays, linkedFromTaskStartDate, linkedFromTaskEndDate, linkedFromTaskTaskDays, linkedToTaskShowIndex, linkedFromTaskShowIndex;
        if (linkedToTaskRecord.record.vtable_gantt_linkedTo || (linkedToTaskRecord.record.vtable_gantt_linkedTo = []), 
        linkedToTaskRecord.record.vtable_gantt_linkedTo.push(link), linkedFromTaskRecord.record.vtable_gantt_linkedFrom || (linkedFromTaskRecord.record.vtable_gantt_linkedFrom = []), 
        linkedFromTaskRecord.record.vtable_gantt_linkedFrom.push(link), this._scene._gantt.parsedOptions.tasksShowMode === TasksShowMode.Sub_Tasks_Inline) linkedFromTaskShowIndex = linkedFromTaskRecord.index[0], 
        linkedToTaskShowIndex = linkedToTaskRecord.index[0], ({startDate: linkedToTaskStartDate, endDate: linkedToTaskEndDate, taskDays: linkedToTaskTaskDays} = this._scene._gantt.getTaskInfoByTaskListIndex(linkedToTaskRecord.index[0], linkedToTaskRecord.index[1])), 
        ({startDate: linkedFromTaskStartDate, endDate: linkedFromTaskEndDate, taskDays: linkedFromTaskTaskDays} = this._scene._gantt.getTaskInfoByTaskListIndex(linkedFromTaskRecord.index[0], linkedFromTaskRecord.index[1])); else if (this._scene._gantt.parsedOptions.tasksShowMode === TasksShowMode.Project_Sub_Tasks_Inline) {
            const fromParentRecordShowIndex = this._scene._gantt.getTaskShowIndexByRecordIndex(linkedFromTaskRecord.index.slice(0, -1)), toParentRecordShowIndex = this._scene._gantt.getTaskShowIndexByRecordIndex(linkedToTaskRecord.index.slice(0, -1)), fromParentRecord = this._scene._gantt.getRecordByIndex(fromParentRecordShowIndex), toParentRecord = this._scene._gantt.getRecordByIndex(toParentRecordShowIndex);
            linkedFromTaskShowIndex = fromParentRecord.type === TaskType.PROJECT && "expand" !== fromParentRecord.hierarchyState && !1 !== this._scene._gantt.parsedOptions.projectSubTasksExpandable ? fromParentRecordShowIndex : this._scene._gantt.getTaskShowIndexByRecordIndex(linkedFromTaskRecord.index), 
            linkedToTaskShowIndex = toParentRecord.type === TaskType.PROJECT && "expand" !== toParentRecord.hierarchyState && !1 !== this._scene._gantt.parsedOptions.projectSubTasksExpandable ? toParentRecordShowIndex : this._scene._gantt.getTaskShowIndexByRecordIndex(linkedToTaskRecord.index), 
            ({startDate: linkedToTaskStartDate, endDate: linkedToTaskEndDate, taskDays: linkedToTaskTaskDays} = this._scene._gantt.getTaskInfoByTaskListIndex(linkedToTaskShowIndex, linkedToTaskRecord.index)), 
            ({startDate: linkedFromTaskStartDate, endDate: linkedFromTaskEndDate, taskDays: linkedFromTaskTaskDays} = this._scene._gantt.getTaskInfoByTaskListIndex(linkedFromTaskShowIndex, linkedFromTaskRecord.index));
        } else if (this._scene._gantt.parsedOptions.tasksShowMode === TasksShowMode.Sub_Tasks_Separate || this._scene._gantt.parsedOptions.tasksShowMode === TasksShowMode.Sub_Tasks_Arrange || this._scene._gantt.parsedOptions.tasksShowMode === TasksShowMode.Sub_Tasks_Compact) {
            linkedFromTaskShowIndex = this._scene._gantt.getRowsHeightByIndex(0, linkedFromTaskRecord.index[0] - 1) / this._scene._gantt.parsedOptions.rowHeight + (this._scene._gantt.parsedOptions.tasksShowMode === TasksShowMode.Sub_Tasks_Arrange || this._scene._gantt.parsedOptions.tasksShowMode === TasksShowMode.Sub_Tasks_Compact ? linkedFromTaskRecord.record.vtable_gantt_showIndex : null !== (_a = linkedFromTaskRecord.index[1]) && void 0 !== _a ? _a : 0);
            linkedToTaskShowIndex = this._scene._gantt.getRowsHeightByIndex(0, linkedToTaskRecord.index[0] - 1) / this._scene._gantt.parsedOptions.rowHeight + (this._scene._gantt.parsedOptions.tasksShowMode === TasksShowMode.Sub_Tasks_Arrange || this._scene._gantt.parsedOptions.tasksShowMode === TasksShowMode.Sub_Tasks_Compact ? linkedToTaskRecord.record.vtable_gantt_showIndex : null !== (_b = linkedToTaskRecord.index[1]) && void 0 !== _b ? _b : 0), 
            ({startDate: linkedToTaskStartDate, endDate: linkedToTaskEndDate, taskDays: linkedToTaskTaskDays} = this._scene._gantt.getTaskInfoByTaskListIndex(linkedToTaskRecord.index[0], linkedToTaskRecord.index[1])), 
            ({startDate: linkedFromTaskStartDate, endDate: linkedFromTaskEndDate, taskDays: linkedFromTaskTaskDays} = this._scene._gantt.getTaskInfoByTaskListIndex(linkedFromTaskRecord.index[0], linkedFromTaskRecord.index[1]));
        } else linkedFromTaskShowIndex = this._scene._gantt.getTaskShowIndexByRecordIndex(linkedFromTaskRecord.index), 
        linkedToTaskShowIndex = this._scene._gantt.getTaskShowIndexByRecordIndex(linkedToTaskRecord.index), 
        ({startDate: linkedToTaskStartDate, endDate: linkedToTaskEndDate, taskDays: linkedToTaskTaskDays} = this._scene._gantt.getTaskInfoByTaskListIndex(linkedToTaskShowIndex)), 
        ({startDate: linkedFromTaskStartDate, endDate: linkedFromTaskEndDate, taskDays: linkedFromTaskTaskDays} = this._scene._gantt.getTaskInfoByTaskListIndex(linkedFromTaskShowIndex));
        if (!linkedFromTaskTaskDays || !linkedToTaskTaskDays) return;
        createDateAtMidnight(this._scene._gantt.parsedOptions.minDate);
        const {arrowPoints: arrowPoints, linePoints: linePoints} = generateLinkLinePoints(type, linkedFromTaskStartDate, linkedFromTaskEndDate, linkedFromTaskShowIndex, linkedFromTaskTaskDays, linkedFromTaskRecord.record.type === TaskType.MILESTONE, linkedToTaskStartDate, linkedToTaskEndDate, linkedToTaskShowIndex, linkedToTaskTaskDays, linkedToTaskRecord.record.type === TaskType.MILESTONE, this._scene._gantt), lineStyle = this._scene._gantt.parsedOptions.dependencyLinkLineStyle, lineObj = createLine({
            pickable: !0,
            stroke: null !== (_d = null === (_c = link.linkLineStyle) || void 0 === _c ? void 0 : _c.lineColor) && void 0 !== _d ? _d : lineStyle.lineColor,
            lineWidth: null !== (_f = null === (_e = link.linkLineStyle) || void 0 === _e ? void 0 : _e.lineWidth) && void 0 !== _f ? _f : lineStyle.lineWidth,
            lineDash: null !== (_h = null === (_g = link.linkLineStyle) || void 0 === _g ? void 0 : _g.lineDash) && void 0 !== _h ? _h : lineStyle.lineDash,
            points: linePoints,
            pickStrokeBuffer: 3,
            vtable_link: link
        });
        this.linkLinesContainer.appendChild(lineObj), link.vtable_gantt_linkLineNode = lineObj;
        const arrow = new Polygon({
            fill: null !== (_k = null === (_j = link.linkLineStyle) || void 0 === _j ? void 0 : _j.lineColor) && void 0 !== _k ? _k : lineStyle.lineColor,
            points: arrowPoints
        });
        this.linkLinesContainer.appendChild(arrow), link.vtable_gantt_linkArrowNode = arrow;
    }
    setX(x) {
        this.linkLinesContainer.setAttribute("x", x);
    }
    setY(y) {
        this.linkLinesContainer.setAttribute("y", y);
    }
    refresh() {
        this.width = this._scene._gantt.tableNoFrameWidth, this.height = this._scene._gantt.gridHeight, 
        this.group.setAttributes({
            height: this.height,
            width: this.width,
            y: this._scene._gantt.getAllHeaderRowsHeight()
        });
        const x = this.linkLinesContainer.attribute.x, y = this.linkLinesContainer.attribute.y;
        this.linkLinesContainer.removeAllChild(), this.group.removeChild(this.linkLinesContainer), 
        this.initLinkLines(), this.setX(x), this.setY(y);
    }
    resize() {
        this.width = this._scene._gantt.tableNoFrameWidth, this.height = this._scene._gantt.gridHeight, 
        this.group.setAttribute("width", this.width), this.group.setAttribute("height", this.height);
    }
    createSelectedLinkLine(selectedLink) {
        const lineNode = selectedLink.vtable_gantt_linkLineNode, arrowNode = selectedLink.vtable_gantt_linkArrowNode, selectedLineNodelineNode = lineNode.clone(), selectedLinkArrowNode = arrowNode.clone();
        selectedLineNodelineNode.setAttribute("stroke", this._scene._gantt.parsedOptions.dependencyLinkSelectedLineStyle.lineColor), 
        selectedLineNodelineNode.setAttribute("lineWidth", this._scene._gantt.parsedOptions.dependencyLinkSelectedLineStyle.lineWidth), 
        selectedLineNodelineNode.setAttribute("shadowColor", this._scene._gantt.parsedOptions.dependencyLinkSelectedLineStyle.shadowColor), 
        selectedLineNodelineNode.setAttribute("shadowOffsetX", this._scene._gantt.parsedOptions.dependencyLinkSelectedLineStyle.shadowOffset), 
        selectedLineNodelineNode.setAttribute("shadowOffsetY", this._scene._gantt.parsedOptions.dependencyLinkSelectedLineStyle.shadowOffset), 
        selectedLineNodelineNode.setAttribute("shadowBlur", this._scene._gantt.parsedOptions.dependencyLinkSelectedLineStyle.shadowBlur), 
        this.linkLinesContainer.appendChild(selectedLineNodelineNode), selectedLinkArrowNode.setAttribute("fill", this._scene._gantt.parsedOptions.dependencyLinkSelectedLineStyle.lineColor), 
        this.linkLinesContainer.appendChild(selectedLinkArrowNode), this.selectedEffectNodes = [ selectedLineNodelineNode, selectedLinkArrowNode ];
    }
    removeSelectedLinkLine() {
        var _a;
        null === (_a = this.selectedEffectNodes) || void 0 === _a || _a.forEach((node => {
            node.delete();
        })), this.selectedEffectNodes = [];
    }
    deleteLink(link) {
        const linkLineNode = link.vtable_gantt_linkLineNode, lineArrowNode = link.vtable_gantt_linkArrowNode;
        linkLineNode.delete(), lineArrowNode.delete();
    }
}

export function generateLinkLinePoints(type, linkedFromTaskStartDate, linkedFromTaskEndDate, linkedFromTaskRecordRowIndex, linkedFromTaskTaskDays, linkedFromTaskIsMilestone, linkedToTaskStartDate, linkedToTaskEndDate, linkedToTaskRecordRowIndex, linkedToTaskTaskDays, linkedToTaskIsMilestone, gantt) {
    var _a;
    const {rowHeight: rowHeight} = gantt.parsedOptions, taskBarMilestoneHypotenuse = gantt.parsedOptions.taskBarMilestoneHypotenuse, distanceToTaskBar = null !== (_a = gantt.parsedOptions.dependencyLinkDistanceToTaskBar) && void 0 !== _a ? _a : 20;
    let startDate, endDate, linePoints = [], arrowPoints = [];
    const getStartX = d => gantt.getXByTime(d.getTime()), getEndX = d => gantt.getXByTime(d.getTime() + 1);
    if (type === DependencyType.FinishToStart) {
        startDate = linkedFromTaskStartDate, endDate = linkedToTaskStartDate;
        let linkFromPointX = getEndX(linkedFromTaskEndDate);
        linkedFromTaskIsMilestone && (linkFromPointX = getStartX(linkedFromTaskStartDate) + taskBarMilestoneHypotenuse / 2);
        let linkToPointX = getStartX(linkedToTaskStartDate);
        linkedToTaskIsMilestone && (linkToPointX -= taskBarMilestoneHypotenuse / 2), linePoints = [ {
            x: linkFromPointX,
            y: rowHeight * (linkedFromTaskRecordRowIndex + .5)
        }, {
            x: linkToPointX,
            y: rowHeight * (linkedFromTaskRecordRowIndex + .5)
        }, {
            x: linkToPointX,
            y: rowHeight * (linkedToTaskRecordRowIndex + .2)
        } ];
        const lastPoint = linePoints[linePoints.length - 1];
        arrowPoints = [ {
            x: lastPoint.x,
            y: lastPoint.y
        }, {
            x: lastPoint.x - 5,
            y: lastPoint.y - 7.5
        }, {
            x: lastPoint.x + 5,
            y: lastPoint.y - 7.5
        }, {
            x: lastPoint.x,
            y: lastPoint.y
        } ];
    } else if (type === DependencyType.StartToFinish) {
        startDate = linkedFromTaskStartDate, endDate = linkedToTaskStartDate;
        let linkFromPointX = getStartX(linkedFromTaskStartDate);
        linkedFromTaskIsMilestone && (linkFromPointX -= taskBarMilestoneHypotenuse / 2);
        let linkToPointX = getEndX(linkedToTaskEndDate);
        linkedToTaskIsMilestone && (linkToPointX = getStartX(linkedToTaskStartDate) + taskBarMilestoneHypotenuse / 2), 
        linePoints = [ {
            x: linkFromPointX,
            y: rowHeight * (linkedFromTaskRecordRowIndex + .5)
        }, {
            x: linkFromPointX - distanceToTaskBar,
            y: rowHeight * (linkedFromTaskRecordRowIndex + .5)
        }, {
            x: linkFromPointX - distanceToTaskBar,
            y: rowHeight * (linkedFromTaskRecordRowIndex + (linkedFromTaskRecordRowIndex > linkedToTaskRecordRowIndex ? 0 : 1))
        }, {
            x: linkToPointX + distanceToTaskBar,
            y: rowHeight * (linkedFromTaskRecordRowIndex + (linkedFromTaskRecordRowIndex > linkedToTaskRecordRowIndex ? 0 : 1))
        }, {
            x: linkToPointX + distanceToTaskBar,
            y: rowHeight * (linkedToTaskRecordRowIndex + .5)
        }, {
            x: linkToPointX,
            y: rowHeight * (linkedToTaskRecordRowIndex + .5)
        } ], linkFromPointX - distanceToTaskBar >= linkToPointX + distanceToTaskBar && linePoints.splice(2, 3, {
            x: linkFromPointX - distanceToTaskBar,
            y: rowHeight * (linkedToTaskRecordRowIndex + .5)
        });
        const lastPoint = linePoints[linePoints.length - 1];
        arrowPoints = [ {
            x: lastPoint.x,
            y: lastPoint.y
        }, {
            x: lastPoint.x + 10,
            y: lastPoint.y - 5
        }, {
            x: lastPoint.x + 10,
            y: lastPoint.y + 5
        }, {
            x: lastPoint.x,
            y: lastPoint.y
        } ];
    } else if (type === DependencyType.StartToStart) {
        startDate = linkedFromTaskStartDate, endDate = linkedToTaskStartDate;
        let linkFromPointX = getStartX(linkedFromTaskStartDate);
        linkedFromTaskIsMilestone && (linkFromPointX -= taskBarMilestoneHypotenuse / 2);
        let linkToPointX = getStartX(linkedToTaskStartDate);
        linkedToTaskIsMilestone && (linkToPointX -= taskBarMilestoneHypotenuse / 2), linePoints = [ {
            x: linkFromPointX,
            y: rowHeight * (linkedFromTaskRecordRowIndex + .5)
        }, {
            x: (linkedFromTaskRecordRowIndex === linkedToTaskRecordRowIndex ? linkFromPointX : Math.min(linkFromPointX, linkToPointX)) - distanceToTaskBar,
            y: rowHeight * (linkedFromTaskRecordRowIndex + .5)
        }, {
            x: (linkedFromTaskRecordRowIndex === linkedToTaskRecordRowIndex ? linkFromPointX : Math.min(linkFromPointX, linkToPointX)) - distanceToTaskBar,
            y: rowHeight * (linkedToTaskRecordRowIndex + (linkedFromTaskRecordRowIndex === linkedToTaskRecordRowIndex ? 1 : .5))
        }, {
            x: linkToPointX - distanceToTaskBar,
            y: rowHeight * (linkedToTaskRecordRowIndex + (linkedFromTaskRecordRowIndex === linkedToTaskRecordRowIndex ? 1 : .5))
        }, {
            x: (linkedFromTaskRecordRowIndex === linkedToTaskRecordRowIndex ? linkToPointX : Math.min(linkFromPointX, linkToPointX)) - distanceToTaskBar,
            y: rowHeight * (linkedToTaskRecordRowIndex + .5)
        }, {
            x: linkToPointX,
            y: rowHeight * (linkedToTaskRecordRowIndex + .5)
        } ];
        const lastPoint = linePoints[linePoints.length - 1];
        arrowPoints = [ {
            x: lastPoint.x,
            y: lastPoint.y
        }, {
            x: lastPoint.x - 10,
            y: lastPoint.y - 5
        }, {
            x: lastPoint.x - 10,
            y: lastPoint.y + 5
        }, {
            x: lastPoint.x,
            y: lastPoint.y
        } ];
    } else if (type === DependencyType.FinishToFinish) {
        startDate = linkedFromTaskStartDate, endDate = linkedToTaskStartDate;
        let linkFromPointX = getEndX(linkedFromTaskEndDate);
        linkedFromTaskIsMilestone && (linkFromPointX = getStartX(linkedFromTaskStartDate) + taskBarMilestoneHypotenuse / 2);
        let linkToPointX = getEndX(linkedToTaskEndDate);
        linkedToTaskIsMilestone && (linkToPointX = getStartX(linkedToTaskStartDate) + taskBarMilestoneHypotenuse / 2), 
        linePoints = [ {
            x: linkFromPointX,
            y: rowHeight * (linkedFromTaskRecordRowIndex + .5)
        }, {
            x: (linkedFromTaskRecordRowIndex === linkedToTaskRecordRowIndex ? linkFromPointX : Math.max(linkFromPointX, linkToPointX)) + distanceToTaskBar,
            y: rowHeight * (linkedFromTaskRecordRowIndex + .5)
        }, {
            x: (linkedFromTaskRecordRowIndex === linkedToTaskRecordRowIndex ? linkFromPointX : Math.max(linkFromPointX, linkToPointX)) + distanceToTaskBar,
            y: rowHeight * (linkedToTaskRecordRowIndex + (linkedFromTaskRecordRowIndex === linkedToTaskRecordRowIndex ? 1 : .5))
        }, {
            x: linkToPointX + distanceToTaskBar,
            y: rowHeight * (linkedToTaskRecordRowIndex + (linkedFromTaskRecordRowIndex === linkedToTaskRecordRowIndex ? 1 : .5))
        }, {
            x: linkToPointX + distanceToTaskBar,
            y: rowHeight * (linkedToTaskRecordRowIndex + .5)
        }, {
            x: linkToPointX,
            y: rowHeight * (linkedToTaskRecordRowIndex + .5)
        } ];
        const lastPoint = linePoints[linePoints.length - 1];
        arrowPoints = [ {
            x: lastPoint.x,
            y: lastPoint.y
        }, {
            x: lastPoint.x + 10,
            y: lastPoint.y - 5
        }, {
            x: lastPoint.x + 10,
            y: lastPoint.y + 5
        }, {
            x: lastPoint.x,
            y: lastPoint.y
        } ];
    }
    return {
        linePoints: linePoints,
        arrowPoints: arrowPoints
    };
}

export function updateLinkLinePoints(type, linkedFromTaskStartDate, linkedFromTaskEndDate, linkedFromTaskRecordRowIndex, linkedFromTaskTaskDays, linkedFromTaskIsMilestone, linkedFromMovedTaskBarNode, fromNodeDiffY, linkedToTaskStartDate, linkedToTaskEndDate, linkedToTaskRecordRowIndex, linkedToTaskTaskDays, linkedToTaskIsMilestone, linkedToMovedTaskBarNode, toNodeDiffY, gantt) {
    var _a;
    const {rowHeight: rowHeight} = gantt.parsedOptions, taskBarMilestoneHypotenuse = gantt.parsedOptions.taskBarMilestoneHypotenuse, milestoneTaskbarHeight = gantt.parsedOptions.taskBarMilestoneStyle.width, distanceToTaskBar = null !== (_a = gantt.parsedOptions.dependencyLinkDistanceToTaskBar) && void 0 !== _a ? _a : 20;
    let startDate, endDate, linePoints = [], arrowPoints = [];
    const getStartX = d => gantt.getXByTime(d.getTime()), getEndX = d => gantt.getXByTime(d.getTime() + 1);
    if (type === DependencyType.FinishToStart) {
        startDate = linkedFromTaskStartDate, endDate = linkedToTaskStartDate;
        let linkFromPointX = linkedFromMovedTaskBarNode ? linkedFromMovedTaskBarNode.attribute.x + linkedFromMovedTaskBarNode.attribute.width : getEndX(linkedFromTaskEndDate);
        linkedFromTaskIsMilestone && (linkFromPointX = linkedFromMovedTaskBarNode ? linkedFromMovedTaskBarNode.attribute.x + linkedFromMovedTaskBarNode.attribute.width + (taskBarMilestoneHypotenuse - milestoneTaskbarHeight) / 2 : getStartX(linkedFromTaskStartDate) + taskBarMilestoneHypotenuse / 2);
        let linkToPointX = linkedToMovedTaskBarNode ? linkedToMovedTaskBarNode.attribute.x : getStartX(linkedToTaskStartDate);
        linkedToTaskIsMilestone && (linkToPointX -= (taskBarMilestoneHypotenuse - milestoneTaskbarHeight) / 2), 
        linePoints = [ {
            x: linkFromPointX,
            y: rowHeight * (linkedFromTaskRecordRowIndex + .5) + fromNodeDiffY
        }, {
            x: linkToPointX,
            y: rowHeight * (linkedFromTaskRecordRowIndex + .5) + fromNodeDiffY
        }, {
            x: linkToPointX,
            y: rowHeight * (linkedToTaskRecordRowIndex + .2) + toNodeDiffY
        } ];
        const lastPoint = linePoints[linePoints.length - 1];
        arrowPoints = [ {
            x: lastPoint.x,
            y: lastPoint.y
        }, {
            x: lastPoint.x - 5,
            y: lastPoint.y - 7.5
        }, {
            x: lastPoint.x + 5,
            y: lastPoint.y - 7.5
        }, {
            x: lastPoint.x,
            y: lastPoint.y
        } ];
    } else if (type === DependencyType.StartToFinish) {
        startDate = linkedFromTaskStartDate, endDate = linkedToTaskStartDate;
        let linkFromPointX = linkedFromMovedTaskBarNode ? linkedFromMovedTaskBarNode.attribute.x : getStartX(linkedFromTaskStartDate);
        linkedFromTaskIsMilestone && (linkFromPointX -= (taskBarMilestoneHypotenuse - milestoneTaskbarHeight) / 2);
        let linkToPointX = linkedToMovedTaskBarNode ? linkedToMovedTaskBarNode.attribute.x + linkedToMovedTaskBarNode.attribute.width : getEndX(linkedToTaskEndDate);
        linkedToTaskIsMilestone && (linkToPointX = linkedToMovedTaskBarNode ? linkedToMovedTaskBarNode.attribute.x + linkedToMovedTaskBarNode.attribute.width + (taskBarMilestoneHypotenuse - milestoneTaskbarHeight) / 2 : getStartX(linkedToTaskStartDate) + taskBarMilestoneHypotenuse / 2), 
        linePoints = [ {
            x: linkFromPointX,
            y: rowHeight * (linkedFromTaskRecordRowIndex + .5) + fromNodeDiffY
        }, {
            x: linkFromPointX - distanceToTaskBar,
            y: rowHeight * (linkedFromTaskRecordRowIndex + .5) + fromNodeDiffY
        }, {
            x: linkFromPointX - distanceToTaskBar,
            y: rowHeight * (linkedFromTaskRecordRowIndex + (linkedFromTaskRecordRowIndex > linkedToTaskRecordRowIndex ? 0 : 1)) + fromNodeDiffY
        }, {
            x: linkToPointX + distanceToTaskBar,
            y: rowHeight * (linkedFromTaskRecordRowIndex + (linkedFromTaskRecordRowIndex > linkedToTaskRecordRowIndex ? 0 : 1)) + fromNodeDiffY
        }, {
            x: linkToPointX + distanceToTaskBar,
            y: rowHeight * (linkedToTaskRecordRowIndex + .5) + toNodeDiffY
        }, {
            x: linkToPointX,
            y: rowHeight * (linkedToTaskRecordRowIndex + .5) + toNodeDiffY
        } ], linkFromPointX - distanceToTaskBar >= linkToPointX + distanceToTaskBar && linePoints.splice(2, 3, {
            x: linkFromPointX - distanceToTaskBar,
            y: rowHeight * (linkedToTaskRecordRowIndex + .5) + toNodeDiffY
        });
        const lastPoint = linePoints[linePoints.length - 1];
        arrowPoints = [ {
            x: lastPoint.x,
            y: lastPoint.y
        }, {
            x: lastPoint.x + 10,
            y: lastPoint.y - 5
        }, {
            x: lastPoint.x + 10,
            y: lastPoint.y + 5
        }, {
            x: lastPoint.x,
            y: lastPoint.y
        } ];
    } else if (type === DependencyType.StartToStart) {
        startDate = linkedFromTaskStartDate, endDate = linkedToTaskStartDate;
        let linkFromPointX = linkedFromMovedTaskBarNode ? linkedFromMovedTaskBarNode.attribute.x : getStartX(linkedFromTaskStartDate);
        linkedFromTaskIsMilestone && (linkFromPointX -= (taskBarMilestoneHypotenuse - milestoneTaskbarHeight) / 2);
        let linkToPointX = linkedToMovedTaskBarNode ? linkedToMovedTaskBarNode.attribute.x : getStartX(linkedToTaskStartDate);
        linkedToTaskIsMilestone && (linkToPointX -= (taskBarMilestoneHypotenuse - milestoneTaskbarHeight) / 2), 
        linePoints = [ {
            x: linkFromPointX,
            y: rowHeight * (linkedFromTaskRecordRowIndex + .5) + fromNodeDiffY
        }, {
            x: (linkedFromTaskRecordRowIndex === linkedToTaskRecordRowIndex ? linkFromPointX : Math.min(linkFromPointX, linkToPointX)) - distanceToTaskBar,
            y: rowHeight * (linkedFromTaskRecordRowIndex + .5) + fromNodeDiffY
        }, {
            x: (linkedFromTaskRecordRowIndex === linkedToTaskRecordRowIndex ? linkFromPointX : Math.min(linkFromPointX, linkToPointX)) - distanceToTaskBar,
            y: rowHeight * (linkedToTaskRecordRowIndex + (linkedFromTaskRecordRowIndex === linkedToTaskRecordRowIndex ? 1 : .5)) + toNodeDiffY
        }, {
            x: linkToPointX - distanceToTaskBar,
            y: rowHeight * (linkedToTaskRecordRowIndex + (linkedFromTaskRecordRowIndex === linkedToTaskRecordRowIndex ? 1 : .5)) + toNodeDiffY
        }, {
            x: (linkedFromTaskRecordRowIndex === linkedToTaskRecordRowIndex ? linkToPointX : Math.min(linkFromPointX, linkToPointX)) - distanceToTaskBar,
            y: rowHeight * (linkedToTaskRecordRowIndex + .5) + toNodeDiffY
        }, {
            x: linkToPointX,
            y: rowHeight * (linkedToTaskRecordRowIndex + .5) + toNodeDiffY
        } ];
        const lastPoint = linePoints[linePoints.length - 1];
        arrowPoints = [ {
            x: lastPoint.x,
            y: lastPoint.y
        }, {
            x: lastPoint.x - 10,
            y: lastPoint.y - 5
        }, {
            x: lastPoint.x - 10,
            y: lastPoint.y + 5
        }, {
            x: lastPoint.x,
            y: lastPoint.y
        } ];
    } else if (type === DependencyType.FinishToFinish) {
        startDate = linkedFromTaskStartDate, endDate = linkedToTaskStartDate;
        let linkFromPointX = linkedFromMovedTaskBarNode ? linkedFromMovedTaskBarNode.attribute.x + linkedFromMovedTaskBarNode.attribute.width : getEndX(linkedFromTaskEndDate);
        linkedFromTaskIsMilestone && (linkFromPointX = linkedFromMovedTaskBarNode ? linkedFromMovedTaskBarNode.attribute.x + linkedFromMovedTaskBarNode.attribute.width + (taskBarMilestoneHypotenuse - milestoneTaskbarHeight) / 2 : getStartX(linkedFromTaskStartDate) + taskBarMilestoneHypotenuse / 2);
        let linkToPointX = linkedToMovedTaskBarNode ? linkedToMovedTaskBarNode.attribute.x + linkedToMovedTaskBarNode.attribute.width : getEndX(linkedToTaskEndDate);
        linkedToTaskIsMilestone && (linkToPointX = linkedToMovedTaskBarNode ? linkedToMovedTaskBarNode.attribute.x + linkedToMovedTaskBarNode.attribute.width + (taskBarMilestoneHypotenuse - milestoneTaskbarHeight) / 2 : getStartX(linkedToTaskStartDate) + taskBarMilestoneHypotenuse / 2), 
        linePoints = [ {
            x: linkFromPointX,
            y: rowHeight * (linkedFromTaskRecordRowIndex + .5) + fromNodeDiffY
        }, {
            x: (linkedFromTaskRecordRowIndex === linkedToTaskRecordRowIndex ? linkFromPointX : Math.max(linkFromPointX, linkToPointX)) + distanceToTaskBar,
            y: rowHeight * (linkedFromTaskRecordRowIndex + .5) + fromNodeDiffY
        }, {
            x: (linkedFromTaskRecordRowIndex === linkedToTaskRecordRowIndex ? linkFromPointX : Math.max(linkFromPointX, linkToPointX)) + distanceToTaskBar,
            y: rowHeight * (linkedToTaskRecordRowIndex + (linkedFromTaskRecordRowIndex === linkedToTaskRecordRowIndex ? 1 : .5)) + toNodeDiffY
        }, {
            x: linkToPointX + distanceToTaskBar,
            y: rowHeight * (linkedToTaskRecordRowIndex + (linkedFromTaskRecordRowIndex === linkedToTaskRecordRowIndex ? 1 : .5)) + toNodeDiffY
        }, {
            x: linkToPointX + distanceToTaskBar,
            y: rowHeight * (linkedToTaskRecordRowIndex + .5) + toNodeDiffY
        }, {
            x: linkToPointX,
            y: rowHeight * (linkedToTaskRecordRowIndex + .5) + toNodeDiffY
        } ];
        const lastPoint = linePoints[linePoints.length - 1];
        arrowPoints = [ {
            x: lastPoint.x,
            y: lastPoint.y
        }, {
            x: lastPoint.x + 10,
            y: lastPoint.y - 5
        }, {
            x: lastPoint.x + 10,
            y: lastPoint.y + 5
        }, {
            x: lastPoint.x,
            y: lastPoint.y
        } ];
    }
    return {
        linePoints: linePoints,
        arrowPoints: arrowPoints
    };
}
//# sourceMappingURL=dependency-link.js.map