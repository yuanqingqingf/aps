<template>
  <div id="gantt" style="width: 100%; height: 600px"></div>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue' // ✅ 导入 onUnmounted
import * as VTableGantt from '@visactor/vtable-gantt'

let ganttInstance = null
let markLineTimer = null

onMounted(() => {
  const records = [
    {
      id: 'converter',
      name: '转炉',
      children: [
        {
          id: 1,
          name: '炉次1',
          start: '2026-03-18 10:00',
          end: '2026-03-18 11:30'
        },
        {
          id: 2,
          name: '炉次2',
          start: '2026-03-18 12:40',
          end: '2026-03-18 15:10'
        }
      ]
    },
    {
      id: 'refining',
      name: '精炼炉',
      children: [
        {
          id: 3,
          name: '炉次1',
          start: '2026-03-18 11:40',
          end: '2026-03-18 12:40'
        },
        {
          id: 4,
          name: '炉次2',
          start: '2026-03-18 15:30',
          end: '2026-03-18 16:30'
        }
      ]
    },
    {
      id: 'caster',
      name: '连铸机',
      children: [
        {
          id: 5,
          name: '炉次1',
          start: '2026-03-18 13:10',
          end: '2026-03-18 14:50'
        },
        {
          id: 6,
          name: '炉次2',
          start: '2026-03-18 14:50',
          end: '2026-03-18 16:50'
        }
      ]
    }
  ]

  // ✅ 修正：时间范围覆盖任务数据（2026-03-18），月份用两位数
  const minDate = '2026-03-18 08:00'
  const maxDate = '2026-03-18 19:00' // ✅ 原来是 '2026-5-18' 格式错误！

  const option = {
    records,

    taskListTable: {
      columns: [
        {
          field: 'name',
          title: '设备 / 炉次',
          width: 200,
          tree: true
        }
      ],
      theme: {
        headerStyle: {
          borderColor: '#e1e4e8',
          borderLineWidth: 1
        },
        bodyStyle: {
          borderColor: '#e1e4e8',
          borderLineWidth: 1
        }
      }
    },

    groupBy: true,
    tasksShowMode: VTableGantt.TYPES.TasksShowMode.Sub_Tasks_Arrange,

    grid: {
      horizontalLine: { lineWidth: 1, lineColor: '#e1e4e8' },
      verticalLine: { lineWidth: 1, lineColor: '#e1e4e8' }
    },

    rowHeight: 40,

    taskBar: {
      startDateField: 'start',
      endDateField: 'end',
      labelText: '{name}',
      barStyle: {
        width: 20,
        barColor: '#5B8FF9',
        cornerRadius: 6
      }
    },

    dependency: {
      links: [
        {
          type: VTableGantt.TYPES.DependencyType.FinishToStart,
          linkedFromTaskKey: 1,
          linkedToTaskKey: 3
        },
        {
          type: VTableGantt.TYPES.DependencyType.FinishToStart,
          linkedFromTaskKey: 3,
          linkedToTaskKey: 5
        },
        {
          type: VTableGantt.TYPES.DependencyType.FinishToStart,
          linkedFromTaskKey: 2,
          linkedToTaskKey: 4
        },
        {
          type: VTableGantt.TYPES.DependencyType.FinishToStart,
          linkedFromTaskKey: 4,
          linkedToTaskKey: 6
        }
      ]
    },

    timelineHeader: {
      horizontalLine: { lineWidth: 1, lineColor: '#e1e4e8' },
      verticalLine: { lineWidth: 1, lineColor: '#e1e4e8' },
      scales: [
        {
          unit: 'minute', // ✅ 单位：分钟
          step: 10, // ✅ 间隔：10分钟
          format(date) {
            const d = date.startDate
            // 🔥 关键：直接拼接，不加 padStart，显示 9:00 而非 09:00
            return `${d.getHours()}:${d.getMinutes()}`
          },
          style: {
            fontSize: 10,
            color: '#333'
          },
          lineStyle: {
            lineWidth: 1,
            lineColor: '#e1e4e8'
          }
        }
      ]
    },

    // ✅ 修正：时间范围必须包含任务数据
    minDate,
    maxDate,

    frame: {
      outerFrameStyle: {
        borderLineWidth: 1,
        borderColor: '#e1e4e8',
        cornerRadius: 0
      },
      verticalSplitLineMoveable: false
    },

    // ✅ 核心：markLine 配置（放在顶层，用 lineColor）
    markLine: {
      date: new Date(),
      style: {
        lineColor: '#ff4444',
        lineWidth: 2,
        lineDash: [5, 3]
      },
      content: '现在',
      contentStyle: {
        color: '#fff',
        fontSize: '11px',
        backgroundColor: '#ff4444',
        cornerRadius: 3,
        padding: [2, 6]
      },
      position: 'date',
      scrollToMarkLine: false
    },

    timebarColumnWidth: 70
  }
  const container = document.getElementById('gantt')
  ganttInstance = new VTableGantt.Gantt(container, option)
})

onUnmounted(() => {})
</script>

<style scoped>
#gantt {
  width: 100%;
  height: 600px;
  border: 1px solid #e1e4e8;
  box-sizing: border-box;
  border-radius: 4px;
}
</style>
