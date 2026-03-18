<template>
  <div>
    <el-button :loading="loading" @click="exportData">导出甘特图</el-button>
    <div id="gantt" style="width: 100%; height: 600px"></div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref, nextTick } from 'vue' // ✅ 导入 onUnmounted
import * as VTableGantt from '@visactor/vtable-gantt'
import { ExportGanttPlugin } from '@visactor/vtable-plugins'
let ganttInstance = null
let timer = null
const exportGanttPlugin = new ExportGanttPlugin()
const loading = ref(false)
onMounted(() => {
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth() + 1 // 月份从0开始，需要+1
  const day = now.getDate()
  const fullDate = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
  const records = [
    {
      id: 'converter1',
      name: '1#转炉',
      children: [
        {
          id: 1,
          name: '炉次1',
          start: `${fullDate} 08:00`,
          end: `${fullDate} 09:30`
        },
        {
          id: 2,
          name: '炉次2',
          start: `${fullDate} 10:00`,
          end: `${fullDate} 11:30`
        }
      ]
    },
    {
      id: 'converter2',
      name: '2#转炉',
      children: [
        {
          id: 3,
          name: '炉次1',
          start: `${fullDate} 09:00`,
          end: `${fullDate} 10:30`
        },
        {
          id: 4,
          name: '炉次2',
          start: `${fullDate} 11:00`,
          end: `${fullDate} 12:30`
        }
      ]
    },
    {
      id: 'converter3',
      name: '3#转炉',
      children: [
        {
          id: 5,
          name: '炉次1',
          start: `${fullDate} 08:30`,
          end: `${fullDate} 10:00`
        },
        {
          id: 6,
          name: '炉次2',
          start: `${fullDate} 10:30`,
          end: `${fullDate} 12:00`
        }
      ]
    },
    {
      id: 'argon1',
      name: '1#氩站',
      children: [
        {
          id: 7,
          name: '处理1',
          start: `${fullDate} 09:30`,
          end: `${fullDate} 10:15`
        },
        {
          id: 8,
          name: '处理2',
          start: `${fullDate} 11:30`,
          end: `${fullDate} 12:15`
        }
      ]
    },
    {
      id: 'argon2',
      name: '2#氩站',
      children: [
        {
          id: 9,
          name: '处理1',
          start: `${fullDate} 10:00`,
          end: `${fullDate} 10:45`
        },
        {
          id: 10,
          name: '处理2',
          start: `${fullDate} 12:00`,
          end: `${fullDate} 12:45`
        }
      ]
    },
    {
      id: 'argon3',
      name: '3#氩站',
      children: [
        {
          id: 11,
          name: '处理1',
          start: `${fullDate} 09:15`,
          end: `${fullDate} 10:00`
        },
        {
          id: 12,
          name: '处理2',
          start: `${fullDate} 11:15`,
          end: `${fullDate} 12:00`
        }
      ]
    },
    {
      id: 'rh1',
      name: '1#RH炉',
      children: [
        {
          id: 13,
          name: '精炼1',
          start: `${fullDate} 10:30`,
          end: `${fullDate} 11:45`
        },
        {
          id: 14,
          name: '精炼2',
          start: `${fullDate} 12:30`,
          end: `${fullDate} 13:45`
        }
      ]
    },
    {
      id: 'rh2',
      name: '2#RH炉',
      children: [
        {
          id: 15,
          name: '精炼1',
          start: `${fullDate} 11:00`,
          end: `${fullDate} 12:15`
        },
        {
          id: 16,
          name: '精炼2',
          start: `${fullDate} 13:00`,
          end: `${fullDate} 14:15`
        }
      ]
    },
    {
      id: 'caster1',
      name: '1#铸机',
      children: [
        {
          id: 17,
          name: '浇铸1',
          start: `${fullDate} 12:00`,
          end: `${fullDate} 13:30`
        },
        {
          id: 18,
          name: '浇铸2',
          start: `${fullDate} 14:00`,
          end: `${fullDate} 15:30`
        }
      ]
    },
    {
      id: 'caster2',
      name: '2#铸机',
      children: [
        {
          id: 19,
          name: '浇铸1',
          start: `${fullDate} 12:30`,
          end: `${fullDate} 14:00`
        },
        {
          id: 20,
          name: '浇铸2',
          start: `${fullDate} 14:30`,
          end: `${fullDate} 16:00`
        }
      ]
    }
  ]

  // ✅ 修正：时间范围覆盖任务数据（2026-03-18），月份用两位数
  const minDate = new Date(`${fullDate} 00:00:00`)
  const maxDate = new Date(`${fullDate} 23:59:59`)

  const option = {
    records,

    taskListTable: {
      columns: [
        {
          field: 'name',
          title: '设备',
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
      resizable: false,
      // moveable: false,
      startDateField: 'start',
      endDateField: 'end',
      labelText: '{name}',
      // barStyle: {
      //   width: 20,
      //   barColor: '#5B8FF9',
      //   cornerRadius: 6
      // }
      barStyle: (args) => {
        if (args.taskRecord.ceshi) {
          return {
            width: 20,
            barColor: '#32d541',
            cornerRadius: 6
          }
        } else {
          return {
            width: 20,
            barColor: '#5B8FF9',
            cornerRadius: 6
          }
        }
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
            const h = d.getHours()
            const m = String(d.getMinutes()).padStart(2, '0') // 保持 14:00, 14:10 格式
            return `${h}:${m}`
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
    // markLine: {
    //   date: getCurrentTime(),
    //   style: {
    //     lineColor: '#ff4444',
    //     lineWidth: 2,
    //     lineDash: [5, 3]
    //   },
    //   content: '现在',
    //   contentStyle: {
    //     color: '#fff',
    //     fontSize: '11px',
    //     backgroundColor: '#ff4444',
    //     cornerRadius: 3,
    //     padding: [2, 6]
    //   },
    //   position: 'date',
    //   scrollToMarkLine: false
    // },
    markLine: [
      {
        id: 'now-line',
        date: new Date(), // 直接传入当前 Date 对象
        scrollToMarkLine: true,
        position: 'date', // 重点加这个
        style: {
          lineColor: 'red',
          lineWidth: 2,
          lineDash: [4, 2],
          label: {
            text: '现在',
            style: { fontSize: 12, color: 'white', backgroundColor: 'red' }
          }
        }
      }
    ],
    timebarColumnWidth: 200,
    plugins: [exportGanttPlugin]
  }
  const container = document.getElementById('gantt')
  ganttInstance = new VTableGantt.Gantt(container, option)
  // ✅ 4. 优化定时器：为了 C 端流畅感，建议 10 秒更新一次，或者 1 秒
  timer = setInterval(() => {
    const now = new Date()
    ganttInstance.updateMarkLine({
      date: now, // 必须是 Date 对象
      scrollToMarkLine: true, // 除非你想让屏幕一直跟着红线跳动
      position: 'date' // 重点加这个
      // style: {
      //   lineColor: 'red',
      //   lineWidth: 2,
      //   lineDash: [4, 2],
      //   label: {
      //     position: 'top',
      //     text: `当前时间 ${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`,
      //     style: {
      //       fontSize: 12,
      //       // color: 'white',
      //       backgroundColor: 'red'
      //     }
      //   }
      // }
    })
  }, 10000) // 10秒刷一次，位置会更精确
  // 点击任务栏
  ganttInstance.on('click_task_bar', (args) => {
    console.log(args)
  })
  // 任务条移动结束事件
  ganttInstance.on('move_end_task_bar', (args) => {
    console.log('任务条移动结束:', args)
  })
})
// 导出
const exportData = async () => {
  try {
    loading.value = true
    console.log('导出开始执行了')
    await exportGanttPlugin.exportToImage({
      fileName: '甘特图导出测试',
      type: 'png',
      scale: 1,
      backgroundColor: '#ffffff',
      quality: 1
    })
    loading.value = false
  } catch (error) {
    console.error('导出失败', error)
    loading.value = false
  }
}
onUnmounted(() => {
  if (timer) clearInterval(timer)
  if (ganttInstance) {
    ganttInstance.release() // ✅ 官方 API，销毁 Canvas 实例，释放内存
  }
})
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
