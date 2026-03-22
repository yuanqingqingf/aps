import { Group, createText, createRect, Image, Circle, Line, Polygon } from "@visactor/vtable/es/vrender";

import { parseStringTemplate, toBoxArray } from "../tools/util";

import { isValid } from "@visactor/vutils";

import { defaultTaskBarStyle, getTextPos } from "../gantt-helper";

import { GanttTaskBarNode } from "./gantt-node";

import { TasksShowMode, TaskType } from "../ts-types";

const TASKBAR_HOVER_ICON = '<svg width="100" height="200" xmlns="http://www.w3.org/2000/svg">\n  <line x1="30" y1="10" x2="30" y2="190" stroke="black" stroke-width="4"/>\n  <line x1="70" y1="10" x2="70" y2="190" stroke="black" stroke-width="4"/>\n</svg>';

export const TASKBAR_HOVER_ICON_WIDTH = 10;

export class TaskBar {
    formatMilestoneText(text, record) {
        if (!text) return "";
        const matches = text.match(/{([^}]+)}/g);
        return matches && matches.forEach((match => {
            const fieldName = match.substring(1, match.length - 1), fieldValue = record[fieldName];
            void 0 !== fieldValue && (text = text.replace(match, String(fieldValue)));
        })), text;
    }
    calculateMilestoneTextPosition(position, milestoneWidth, padding = 4) {
        const paddingVal = "number" == typeof padding ? padding : 4;
        let textX = 0, textY = 0, textAlignValue = "left", textBaselineValue = "middle";
        const center = milestoneWidth / 2;
        switch (position) {
          case "left":
            textX = -paddingVal, textY = center, textAlignValue = "end", textBaselineValue = "middle";
            break;

          case "right":
          default:
            textX = milestoneWidth + paddingVal, textY = center, textAlignValue = "start", textBaselineValue = "middle";
            break;

          case "top":
            textX = center, textY = -paddingVal, textAlignValue = "center", textBaselineValue = "bottom";
            break;

          case "bottom":
            textX = center, textY = milestoneWidth + paddingVal, textAlignValue = "center", 
            textBaselineValue = "top";
        }
        return {
            textX: textX,
            textY: textY,
            textAlignValue: textAlignValue,
            textBaselineValue: textBaselineValue
        };
    }
    constructor(scene) {
        this.selectedBorders = [], this._scene = scene, this.width = scene._gantt.tableNoFrameWidth, 
        this.height = scene._gantt.gridHeight, this.group = new Group({
            x: 0,
            y: scene._gantt.getAllHeaderRowsHeight(),
            width: this.width,
            height: this.height,
            pickable: !1,
            clip: !0
        }), this.group.name = "task-bar-container", scene.ganttGroup.addChild(this.group), 
        this.initBars(), this.initHoverBarIcons();
    }
    initBars() {
        var _a, _b, _c;
        this.barContainer = new Group({
            x: 0,
            y: 0,
            width: this._scene._gantt.getAllDateColsWidth(),
            height: this._scene._gantt.getAllTaskBarsHeight(),
            pickable: !1,
            clip: !0
        }), this.group.appendChild(this.barContainer);
        for (let i = 0; i < this._scene._gantt.itemCount; i++) if (this._scene._gantt.parsedOptions.tasksShowMode !== TasksShowMode.Sub_Tasks_Inline && this._scene._gantt.parsedOptions.tasksShowMode !== TasksShowMode.Sub_Tasks_Separate && this._scene._gantt.parsedOptions.tasksShowMode !== TasksShowMode.Sub_Tasks_Arrange && this._scene._gantt.parsedOptions.tasksShowMode !== TasksShowMode.Sub_Tasks_Compact) if (this._scene._gantt.parsedOptions.tasksShowMode !== TasksShowMode.Project_Sub_Tasks_Inline) {
            const {barGroupBox: barGroupBox, baselineBar: baselineBar} = this.initBar(i);
            baselineBar && this.barContainer.appendChild(baselineBar), barGroupBox && this.barContainer.appendChild(barGroupBox);
        } else {
            const record = this._scene._gantt.getRecordByIndex(i), isExpanded = "expand" === record.hierarchyState;
            if (record.type === TaskType.PROJECT && (null === (_c = record.children) || void 0 === _c ? void 0 : _c.length) > 0 && !isExpanded) {
                const recordIndex = this._scene._gantt.getRecordIndexByTaskShowIndex(i), sub_task_indexs = Array.isArray(recordIndex) ? [ ...recordIndex ] : [ recordIndex ], callInitBar = (record, sub_task_indexs) => {
                    var _a, _b;
                    if ((null === (_a = record.children) || void 0 === _a ? void 0 : _a.length) > 0) for (let j = 0; j < (null === (_b = record.children) || void 0 === _b ? void 0 : _b.length); j++) {
                        const child_record = record.children[j];
                        if (child_record.type !== TaskType.PROJECT) {
                            const {barGroupBox: barGroupBox, baselineBar: baselineBar} = this.initBar(i, [ ...sub_task_indexs, j ], record.children.length);
                            baselineBar && this.barContainer.appendChild(baselineBar), barGroupBox && this.barContainer.appendChild(barGroupBox);
                        } else callInitBar(child_record, [ ...sub_task_indexs, j ]);
                    }
                };
                callInitBar(record, sub_task_indexs);
            } else {
                const {barGroupBox: barGroupBox, baselineBar: baselineBar} = this.initBar(i);
                baselineBar && this.barContainer.appendChild(baselineBar), barGroupBox && this.barContainer.appendChild(barGroupBox);
            }
        } else {
            const record = this._scene._gantt.getRecordByIndex(i);
            if ((null === (_a = record.children) || void 0 === _a ? void 0 : _a.length) > 0) for (let j = 0; j < (null === (_b = record.children) || void 0 === _b ? void 0 : _b.length); j++) {
                const {barGroupBox: barGroupBox, baselineBar: baselineBar} = this.initBar(i, j, record.children.length);
                baselineBar && this.barContainer.appendChild(baselineBar), barGroupBox && this.barContainer.appendChild(barGroupBox);
            } else {
                const {barGroupBox: barGroupBox, baselineBar: baselineBar} = this.initBar(i);
                baselineBar && this.barContainer.appendChild(baselineBar), barGroupBox && this.barContainer.appendChild(barGroupBox);
            }
        }
    }
    initBar(index, childIndex, childrenLength) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j;
        const taskBarCustomLayout = this._scene._gantt.parsedOptions.taskBarCustomLayout, {startDate: startDate, endDate: endDate, taskDays: taskDays, progress: progress, taskRecord: taskRecord} = this._scene._gantt.getTaskInfoByTaskListIndex(index, childIndex), isMilestone = taskRecord.type === TaskType.MILESTONE;
        if (isMilestone && !startDate || !isMilestone && (taskDays <= 0 || !startDate || !endDate || startDate.getTime() > endDate.getTime())) return {
            barGroupBox: null,
            baselineBar: null
        };
        let taskBarSize = this._scene._gantt.getXByTime(endDate.getTime() + 1) - this._scene._gantt.getXByTime(startDate.getTime());
        const taskBarStyle = this._scene._gantt.getTaskBarStyle(index, childIndex), taskbarHeight = taskBarStyle.width;
        isValid(taskBarStyle.minSize) && (taskBarSize = Math.max(taskBarSize, taskBarStyle.minSize));
        const oneTaskHeigth = this._scene._gantt.parsedOptions.rowHeight, milestoneTaskBarHeight = this._scene._gantt.parsedOptions.taskBarMilestoneStyle.width, x = this._scene._gantt.getXByTime(startDate.getTime()) - (isMilestone ? milestoneTaskBarHeight / 2 : 0);
        let y = this._scene._gantt.getRowsHeightByIndex(0, index - 1) + (this._scene._gantt.parsedOptions.tasksShowMode === TasksShowMode.Sub_Tasks_Separate ? (null !== (_a = childIndex) && void 0 !== _a ? _a : 0) * oneTaskHeigth : this._scene._gantt.parsedOptions.tasksShowMode === TasksShowMode.Sub_Tasks_Arrange || this._scene._gantt.parsedOptions.tasksShowMode === TasksShowMode.Sub_Tasks_Compact ? taskRecord.vtable_gantt_showIndex * oneTaskHeigth : 0);
        const baselineInfo = this._scene._gantt.getBaselineInfoByTaskListIndex(index, childIndex), hasBaseline = baselineInfo.baselineStartDate && baselineInfo.baselineEndDate && baselineInfo.baselineDays > 0, baselinePosition = this._scene._gantt.parsedOptions.baselinePosition;
        let baselineBar = null, taskBarYOffset = 0;
        if (hasBaseline && !isMilestone) {
            const baselineStyle = this._scene._gantt.getBaselineStyle(index, childIndex), baselineX = this._scene._gantt.getXByTime(baselineInfo.baselineStartDate.getTime()), baselineWidth = this._scene._gantt.getXByTime(baselineInfo.baselineEndDate.getTime() + 1) - this._scene._gantt.getXByTime(baselineInfo.baselineStartDate.getTime());
            let baselineY;
            const taskBarPaddingTop = null !== (_b = taskBarStyle.paddingTop) && void 0 !== _b ? _b : void 0, baselinePaddingTop = null !== (_c = baselineStyle.paddingTop) && void 0 !== _c ? _c : void 0;
            if ("overlap" === baselinePosition) baselineY = void 0 !== taskBarPaddingTop ? y + taskBarPaddingTop : y + (oneTaskHeigth - baselineStyle.width) / 2; else if ("top" === baselinePosition) {
                const gap = 4;
                if (void 0 !== baselinePaddingTop && void 0 !== taskBarPaddingTop) baselineY = y + baselinePaddingTop, 
                taskBarYOffset = taskBarPaddingTop; else if (void 0 !== baselinePaddingTop) baselineY = y + baselinePaddingTop, 
                taskBarYOffset = baselinePaddingTop + baselineStyle.width + gap; else if (void 0 !== taskBarPaddingTop) {
                    baselineY = y + (oneTaskHeigth - (baselineStyle.width + gap + taskbarHeight)) / 2, 
                    taskBarYOffset = taskBarPaddingTop;
                } else {
                    const startY = (oneTaskHeigth - (baselineStyle.width + gap + taskbarHeight)) / 2;
                    baselineY = y + startY, taskBarYOffset = startY + baselineStyle.width + gap;
                }
            } else {
                const gap = 4;
                if (void 0 !== taskBarPaddingTop && void 0 !== baselinePaddingTop) taskBarYOffset = taskBarPaddingTop, 
                baselineY = y + baselinePaddingTop; else if (void 0 !== taskBarPaddingTop) taskBarYOffset = taskBarPaddingTop, 
                baselineY = y + taskBarPaddingTop + taskbarHeight + gap; else if (void 0 !== baselinePaddingTop) {
                    taskBarYOffset = (oneTaskHeigth - (taskbarHeight + gap + baselineStyle.width)) / 2, 
                    baselineY = y + baselinePaddingTop;
                } else {
                    const startY = (oneTaskHeigth - (taskbarHeight + gap + baselineStyle.width)) / 2;
                    taskBarYOffset = startY, baselineY = y + startY + taskbarHeight + gap;
                }
            }
            baselineBar = createRect({
                x: baselineX,
                y: baselineY,
                width: Math.max(baselineWidth, baselineStyle.minSize || 0),
                height: baselineStyle.width,
                fill: baselineStyle.barColor,
                cornerRadius: baselineStyle.cornerRadius,
                lineWidth: 2 * (null !== (_d = baselineStyle.borderLineWidth) && void 0 !== _d ? _d : baselineStyle.borderWidth),
                stroke: baselineStyle.borderColor,
                pickable: !1
            }), baselineBar.name = "baseline-bar";
        }
        const taskBarPaddingTop = null !== (_e = taskBarStyle.paddingTop) && void 0 !== _e ? _e : void 0;
        y += hasBaseline && !isMilestone && "overlap" !== baselinePosition ? taskBarYOffset : void 0 !== taskBarPaddingTop ? taskBarPaddingTop : (oneTaskHeigth - (isMilestone ? milestoneTaskBarHeight : taskbarHeight)) / 2 + taskBarYOffset;
        const barGroupBox = new GanttTaskBarNode({
            x: x,
            y: y,
            width: isMilestone ? milestoneTaskBarHeight : taskBarSize,
            height: isMilestone ? milestoneTaskBarHeight : taskbarHeight,
            cornerRadius: isMilestone ? this._scene._gantt.parsedOptions.taskBarMilestoneStyle.cornerRadius : taskBarStyle.cornerRadius,
            lineWidth: isMilestone ? 2 * this._scene._gantt.parsedOptions.taskBarMilestoneStyle.borderLineWidth : 2 * (null !== (_f = taskBarStyle.borderLineWidth) && void 0 !== _f ? _f : taskBarStyle.borderWidth),
            stroke: isMilestone ? this._scene._gantt.parsedOptions.taskBarMilestoneStyle.borderColor : taskBarStyle.borderColor,
            angle: isMilestone ? .25 * Math.PI : 0,
            anchor: isMilestone ? [ x + milestoneTaskBarHeight / 2, y + milestoneTaskBarHeight / 2 ] : void 0
        });
        barGroupBox.name = "task-bar", barGroupBox.task_index = index, barGroupBox.sub_task_index = childIndex, 
        barGroupBox.record = taskRecord;
        const barGroup = new Group({
            x: 0,
            y: 0,
            width: barGroupBox.attribute.width,
            height: barGroupBox.attribute.height,
            cornerRadius: isMilestone ? this._scene._gantt.parsedOptions.taskBarMilestoneStyle.cornerRadius : taskBarStyle.cornerRadius,
            clip: this._scene._gantt.parsedOptions.taskBarClip
        });
        let rootContainer;
        barGroup.name = "task-bar-group", barGroupBox.appendChild(barGroup), barGroupBox.clipGroupBox = barGroup;
        let renderDefaultBar = !0, renderDefaultText = !0;
        if (taskBarCustomLayout) {
            let customLayoutObj;
            if ("function" == typeof taskBarCustomLayout) {
                customLayoutObj = taskBarCustomLayout({
                    width: taskBarSize,
                    height: taskbarHeight,
                    index: index,
                    startDate: startDate,
                    endDate: endDate,
                    taskDays: taskDays,
                    progress: progress,
                    taskRecord: taskRecord,
                    ganttInstance: this._scene._gantt
                });
            } else customLayoutObj = taskBarCustomLayout;
            customLayoutObj && (rootContainer = customLayoutObj.rootContainer, renderDefaultBar = null !== (_g = customLayoutObj.renderDefaultBar) && void 0 !== _g && _g, 
            renderDefaultText = null !== (_h = customLayoutObj.renderDefaultText) && void 0 !== _h && _h, 
            rootContainer && (rootContainer.name = "task-bar-custom-render"));
        }
        if (renderDefaultBar) {
            const rect = createRect({
                x: 0,
                y: 0,
                width: barGroupBox.attribute.width,
                height: barGroupBox.attribute.height,
                fill: isMilestone ? this._scene._gantt.parsedOptions.taskBarMilestoneStyle.fillColor : taskBarStyle.barColor,
                pickable: !1
            });
            if (rect.name = "task-bar-rect", barGroup.appendChild(rect), barGroupBox.barRect = rect, 
            taskRecord.type !== TaskType.MILESTONE) {
                const progress_rect = createRect({
                    x: 0,
                    y: 0,
                    width: taskBarSize * progress / 100,
                    height: taskbarHeight,
                    fill: taskBarStyle.completedBarColor,
                    pickable: !1
                });
                progress_rect.name = "task-bar-progress-rect", barGroup.appendChild(progress_rect), 
                barGroupBox.progressRect = progress_rect;
            }
        }
        if (rootContainer && barGroup.appendChild(rootContainer), renderDefaultText && taskRecord.type !== TaskType.MILESTONE) {
            const {textAlign: textAlign, textBaseline: textBaseline, fontSize: fontSize, fontFamily: fontFamily, textOverflow: textOverflow, color: color, padding: padding} = this._scene._gantt.parsedOptions.taskBarLabelStyle, position = getTextPos(toBoxArray(padding), textAlign, textBaseline, taskBarSize, taskbarHeight), label = createText({
                x: position.x,
                y: position.y,
                fontSize: fontSize,
                fill: color,
                fontFamily: fontFamily,
                text: parseStringTemplate(this._scene._gantt.parsedOptions.taskBarLabelText, taskRecord),
                maxLineWidth: taskBarSize - 10,
                textBaseline: textBaseline,
                textAlign: textAlign,
                ellipsis: "clip" === textOverflow ? "" : "ellipsis" === textOverflow ? "..." : isValid(textOverflow) ? textOverflow : void 0,
                poptip: {
                    position: "bottom"
                }
            });
            barGroup.appendChild(label), barGroupBox.textLabel = label, barGroupBox.labelStyle = this._scene._gantt.parsedOptions.taskBarLabelStyle, 
            barGroupBox.updateTextPosition();
        }
        if (renderDefaultText && "milestone" === taskRecord.type && this._scene._gantt.parsedOptions.taskBarMilestoneStyle.labelText) {
            const milestoneStyle = this._scene._gantt.parsedOptions.taskBarMilestoneStyle, textStyle = milestoneStyle.labelTextStyle || {}, pos = this.calculateMilestoneTextPosition(milestoneStyle.textOrient || "right", milestoneStyle.width, null !== (_j = textStyle.padding) && void 0 !== _j ? _j : 4), textContainer = new Group({
                x: x,
                y: y,
                width: milestoneStyle.width,
                height: milestoneStyle.width,
                angle: 0,
                pickable: !1
            }), milestoneLabel = createText({
                x: pos.textX,
                y: pos.textY,
                fontSize: textStyle.fontSize || 16,
                fontFamily: textStyle.fontFamily || "Arial",
                fill: textStyle.color || "#ff0000",
                textBaseline: textStyle.textBaseline || pos.textBaselineValue,
                textAlign: textStyle.textAlign || pos.textAlignValue,
                text: this.formatMilestoneText(milestoneStyle.labelText, taskRecord),
                pickable: !1
            });
            textContainer.appendChild(milestoneLabel), this.barContainer.appendChild(textContainer), 
            barGroupBox.milestoneTextLabel = milestoneLabel, barGroupBox.milestoneTextContainer = textContainer;
        }
        return {
            barGroupBox: barGroupBox,
            baselineBar: baselineBar
        };
    }
    updateTaskBarNode(index, sub_task_index) {
        const taskbarGroup = this.getTaskBarNodeByIndex(index, sub_task_index);
        taskbarGroup && this.barContainer.removeChild(taskbarGroup);
        const {barGroupBox: barGroupBox, baselineBar: baselineBar} = this.initBar(index, sub_task_index);
        barGroupBox && (this.barContainer.insertInto(barGroupBox, index), barGroupBox.updateTextPosition()), 
        baselineBar && this.barContainer.insertBefore(baselineBar, barGroupBox);
    }
    initHoverBarIcons() {
        var _a, _b;
        const hoverBarGroup = new Group({
            x: 0,
            y: 0,
            width: 100,
            height: 100,
            clip: !1,
            pickable: !1,
            cornerRadius: null !== (_b = null !== (_a = this._scene._gantt.parsedOptions.taskBarHoverStyle.cornerRadius) && void 0 !== _a ? _a : defaultTaskBarStyle.cornerRadius) && void 0 !== _b ? _b : 0,
            fill: this._scene._gantt.parsedOptions.taskBarHoverStyle.barOverlayColor,
            visibleAll: !1
        });
        if (this.hoverBarGroup = hoverBarGroup, hoverBarGroup.name = "task-bar-hover-shadow", 
        this._scene._gantt.parsedOptions.taskBarResizable) {
            const icon = new Image({
                x: 0,
                y: 0,
                width: 10,
                height: 20,
                image: TASKBAR_HOVER_ICON,
                pickable: !0,
                cursor: "col-resize"
            });
            icon.name = "task-bar-hover-shadow-left-icon", this.hoverBarLeftIcon = icon, hoverBarGroup.appendChild(icon);
            const rightIcon = new Image({
                x: 0,
                y: 0,
                width: 10,
                height: 20,
                image: TASKBAR_HOVER_ICON,
                pickable: !0,
                cursor: "col-resize"
            });
            rightIcon.name = "task-bar-hover-shadow-right-icon", this.hoverBarRightIcon = rightIcon, 
            hoverBarGroup.appendChild(rightIcon);
        }
        const progressHandle = new Group({
            x: 0,
            y: 0,
            width: 12,
            height: 12,
            pickable: !0,
            cursor: "ew-resize",
            visible: !1
        }), triangleHandle = new Polygon({
            points: [ {
                x: 6,
                y: 0
            }, {
                x: 0,
                y: 6
            }, {
                x: 12,
                y: 6
            } ],
            fill: "#0064ff",
            stroke: "#ffffff",
            lineWidth: 1,
            pickable: !1
        });
        progressHandle.appendChild(triangleHandle), progressHandle.name = "task-bar-progress-handle", 
        this.hoverBarProgressHandle = progressHandle, hoverBarGroup.appendChild(progressHandle);
    }
    setX(x) {
        this.barContainer.setAttribute("x", x);
    }
    setY(y) {
        this.barContainer.setAttribute("y", y);
    }
    refresh() {
        this.width = this._scene._gantt.tableNoFrameWidth, this.height = this._scene._gantt.gridHeight, 
        this.group.setAttributes({
            height: this.height,
            width: this.width,
            y: this._scene._gantt.getAllHeaderRowsHeight()
        });
        const x = this.barContainer.attribute.x, y = this.barContainer.attribute.y;
        this.barContainer.removeAllChild(), this.group.removeChild(this.barContainer), this.initBars(), 
        this.setX(x), this.setY(y);
    }
    resize() {
        this.width = this._scene._gantt.tableNoFrameWidth, this.height = this._scene._gantt.gridHeight, 
        this.group.setAttribute("width", this.width), this.group.setAttribute("height", this.height);
    }
    showHoverBar(x, y, width, height, target) {
        var _a, _b, _c, _d, _e;
        const {startDate: startDate, endDate: endDate, taskRecord: taskRecord} = this._scene._gantt.getTaskInfoByTaskListIndex(target.task_index, target.sub_task_index);
        target && "task-bar" === target.name && target.appendChild(this.hoverBarGroup), 
        this.hoverBarGroup.setAttribute("x", 0), this.hoverBarGroup.setAttribute("y", 0), 
        this.hoverBarGroup.setAttribute("width", width), this.hoverBarGroup.setAttribute("height", height), 
        this.hoverBarGroup.setAttribute("visibleAll", !0);
        const taskBarStyle = this._scene._gantt.getTaskBarStyle(target.task_index, target.sub_task_index);
        if (taskRecord.type === TaskType.MILESTONE) this.hoverBarGroup.setAttribute("cornerRadius", target.attribute.cornerRadius); else {
            const cornerRadius = null !== (_b = null !== (_a = this._scene._gantt.parsedOptions.taskBarHoverStyle.cornerRadius) && void 0 !== _a ? _a : taskBarStyle.cornerRadius) && void 0 !== _b ? _b : 0;
            this.hoverBarGroup.setAttribute("cornerRadius", cornerRadius);
        }
        null === (_c = this.hoverBarLeftIcon) || void 0 === _c || _c.setAttribute("visible", !1), 
        null === (_d = this.hoverBarRightIcon) || void 0 === _d || _d.setAttribute("visible", !1), 
        null === (_e = this.hoverBarProgressHandle) || void 0 === _e || _e.setAttribute("visibleAll", !1);
        let leftResizable = !0, rightResizable = !0, progressAdjustable = !0;
        const progressField = this._scene._gantt.parsedOptions.progressField;
        if (progressField && void 0 !== taskRecord[progressField] && null !== taskRecord[progressField]) if ("function" == typeof this._scene._gantt.parsedOptions.taskBarProgressAdjustable) {
            const arg = {
                index: target.task_index,
                startDate: startDate,
                endDate: endDate,
                taskRecord: taskRecord,
                ganttInstance: this._scene._gantt
            };
            progressAdjustable = this._scene._gantt.parsedOptions.taskBarProgressAdjustable(arg);
        } else progressAdjustable = this._scene._gantt.parsedOptions.taskBarProgressAdjustable; else progressAdjustable = !1;
        if (taskRecord.type === TaskType.MILESTONE) leftResizable = !1, rightResizable = !1, 
        progressAdjustable = !1; else if ("function" == typeof this._scene._gantt.parsedOptions.taskBarResizable) {
            const arg = {
                index: target.task_index,
                startDate: startDate,
                endDate: endDate,
                taskRecord: taskRecord,
                ganttInstance: this._scene._gantt
            }, resizableResult = this._scene._gantt.parsedOptions.taskBarResizable(arg);
            Array.isArray(resizableResult) ? [leftResizable, rightResizable] = resizableResult : (leftResizable = resizableResult, 
            rightResizable = resizableResult);
        } else Array.isArray(this._scene._gantt.parsedOptions.taskBarResizable) ? [leftResizable, rightResizable] = this._scene._gantt.parsedOptions.taskBarResizable : (leftResizable = this._scene._gantt.parsedOptions.taskBarResizable, 
        rightResizable = this._scene._gantt.parsedOptions.taskBarResizable);
        if (leftResizable && this.hoverBarLeftIcon.setAttribute("visible", !0), rightResizable && this.hoverBarRightIcon.setAttribute("visible", !0), 
        progressAdjustable && this.hoverBarProgressHandle.setAttribute("visibleAll", !0), 
        this.hoverBarLeftIcon && (this.hoverBarLeftIcon.setAttribute("x", 0), this.hoverBarLeftIcon.setAttribute("y", Math.ceil(height / 10)), 
        this.hoverBarLeftIcon.setAttribute("width", 10), this.hoverBarLeftIcon.setAttribute("height", height - 2 * Math.ceil(height / 10)), 
        this.hoverBarRightIcon.setAttribute("x", width - 10), this.hoverBarRightIcon.setAttribute("y", Math.ceil(height / 10)), 
        this.hoverBarRightIcon.setAttribute("width", 10), this.hoverBarRightIcon.setAttribute("height", height - 2 * Math.ceil(height / 10))), 
        this.hoverBarProgressHandle) {
            const {progress: progress} = this._scene._gantt.getTaskInfoByTaskListIndex(target.task_index, target.sub_task_index), progressX = width * progress / 100 - 6;
            this.hoverBarProgressHandle.setAttribute("x", progressX), this.hoverBarProgressHandle.setAttribute("y", height - 3);
        }
    }
    hideHoverBar() {
        this.hoverBarGroup.setAttribute("visibleAll", !1);
    }
    createSelectedBorder(x, y, width, height, attachedToTaskBarNode, showLinkPoint = !1) {
        const record = attachedToTaskBarNode.record, selectedBorder = new Group({
            x: x,
            y: y,
            width: width,
            height: height,
            pickable: !1,
            attachedToTaskBarNode: attachedToTaskBarNode,
            zIndex: 1e4
        });
        selectedBorder.name = "task-bar-select-border", this.barContainer.appendChild(selectedBorder), 
        this.selectedBorders.push(selectedBorder);
        const selectRectBorder = new Group({
            x: 0,
            y: 0,
            width: width,
            height: height,
            lineWidth: this._scene._gantt.parsedOptions.taskBarSelectedStyle.borderLineWidth,
            pickable: !1,
            cornerRadius: attachedToTaskBarNode.attribute.cornerRadius,
            fill: !1,
            stroke: this._scene._gantt.parsedOptions.taskBarSelectedStyle.borderColor,
            shadowColor: this._scene._gantt.parsedOptions.taskBarSelectedStyle.shadowColor,
            shadowOffsetX: this._scene._gantt.parsedOptions.taskBarSelectedStyle.shadowOffsetX,
            shadowOffsetY: this._scene._gantt.parsedOptions.taskBarSelectedStyle.shadowOffsetY,
            shadowBlur: this._scene._gantt.parsedOptions.taskBarSelectedStyle.shadowBlur,
            angle: attachedToTaskBarNode.attribute.angle,
            anchor: [ width / 2, height / 2 ]
        });
        if (selectedBorder.appendChild(selectRectBorder), showLinkPoint) {
            const linePointPadding = record.type === TaskType.MILESTONE ? 15 : 10, linkPointContainer = new Group({
                x: -linePointPadding,
                y: 0,
                width: 10,
                height: height,
                pickable: !0
            }), linkPoint = new Circle({
                x: 5,
                y: height / 2,
                radius: this._scene._gantt.parsedOptions.dependencyLinkLineCreatePointStyle.radius,
                fill: this._scene._gantt.parsedOptions.dependencyLinkLineCreatePointStyle.fillColor,
                stroke: this._scene._gantt.parsedOptions.dependencyLinkLineCreatePointStyle.strokeColor,
                lineWidth: this._scene._gantt.parsedOptions.dependencyLinkLineCreatePointStyle.strokeWidth,
                pickable: !1
            });
            linkPointContainer.appendChild(linkPoint), linkPointContainer.name = "task-bar-link-point-left", 
            selectedBorder.appendChild(linkPointContainer);
            const linkPointContainer1 = new Group({
                x: width + (linePointPadding - 10),
                y: 0,
                width: 10,
                height: height,
                pickable: !0
            }), linkPoint1 = new Circle({
                x: 5,
                y: height / 2,
                radius: this._scene._gantt.parsedOptions.dependencyLinkLineCreatePointStyle.radius,
                fill: this._scene._gantt.parsedOptions.dependencyLinkLineCreatePointStyle.fillColor,
                stroke: this._scene._gantt.parsedOptions.dependencyLinkLineCreatePointStyle.strokeColor,
                lineWidth: this._scene._gantt.parsedOptions.dependencyLinkLineCreatePointStyle.strokeWidth,
                pickable: !1,
                pickStrokeBuffer: 10
            });
            linkPointContainer1.appendChild(linkPoint1), linkPointContainer1.name = "task-bar-link-point-right", 
            selectedBorder.appendChild(linkPointContainer1);
        }
    }
    removeSelectedBorder() {
        this.selectedBorders.forEach((border => {
            border.delete();
        })), this.selectedBorders = [];
    }
    removeSecondSelectedBorder() {
        if (2 === this.selectedBorders.length) {
            this.selectedBorders.pop().delete();
        }
    }
    updateCreatingDependencyLine(x1, y1, x2, y2) {
        this.creatingDependencyLine && (this.creatingDependencyLine.delete(), this.creatingDependencyLine = void 0);
        const line = new Line({
            points: [ {
                x: x1,
                y: y1
            }, {
                x: x2,
                y: y2
            } ],
            stroke: this._scene._gantt.parsedOptions.dependencyLinkLineCreatingStyle.lineColor,
            lineWidth: this._scene._gantt.parsedOptions.dependencyLinkLineCreatingStyle.lineWidth,
            lineDash: this._scene._gantt.parsedOptions.dependencyLinkLineCreatingStyle.lineDash,
            pickable: !1
        });
        this.creatingDependencyLine = line, this.selectedBorders[0].appendChild(line);
    }
    getTaskBarNodeByIndex(index, sub_task_index) {
        let c = this.barContainer.firstChild;
        if (!c) return null;
        for (let i = 0; i < this.barContainer.childrenCount; i++) {
            if (c.task_index === index && (!isValid(sub_task_index) || isValid(sub_task_index) && c.sub_task_index === sub_task_index)) return c;
            c = c._next;
        }
        return null;
    }
}
//# sourceMappingURL=task-bar.js.map