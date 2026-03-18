<template>
  <div id="gantt_here" class="gantt-container"></div>
</template>

<script setup>
import { onMounted } from 'vue'
import gantt from 'dhtmlx-gantt'
import 'dhtmlx-gantt/codebase/dhtmlxgantt.css'

onMounted(() => {
  gantt.config.date_format = '%Y-%m-%d %H:%i'

  // ⭐关键配置
  gantt.config.open_split_tasks = true

  gantt.config.columns = [
    { name: 'text', label: '设备 / 炉次', width: 160, tree: true },
    { name: 'start_date', label: '开始时间', align: 'center' },
    { name: 'end_date', label: '结束时间', align: 'center' }
  ]

  gantt.templates.tooltip_text = function (start, end, task) {
    return `
      <b>${task.text}</b><br/>
      开始: ${gantt.templates.tooltip_date_format(start)}<br/>
      结束: ${gantt.templates.tooltip_date_format(end)}
    `
  }

  gantt.init('gantt_here')

  gantt.parse({
    data: [
      {
        id: 1,
        text: '设备A',
        type: 'project',
        render: 'split',
        open: true
      },

      {
        id: 11,
        text: '炉次1',
        start_date: '2026-03-12 08:00',
        end_date: '2026-03-12 10:00',
        parent: 1
      },
      {
        id: 12,
        text: '炉次2',
        start_date: '2026-03-12 10:30',
        end_date: '2026-03-12 13:00',
        parent: 1
      },
      {
        id: 13,
        text: '炉次3',
        start_date: '2026-03-12 14:00',
        end_date: '2026-03-12 18:00',
        parent: 1
      },

      {
        id: 2,
        text: '设备B',
        type: 'project',
        render: 'split',
        open: true
      },

      {
        id: 21,
        text: '炉次4',
        start_date: '2026-03-12 09:00',
        end_date: '2026-03-12 11:00',
        parent: 2
      },
      {
        id: 22,
        text: '炉次5',
        start_date: '2026-03-12 13:00',
        end_date: '2026-03-12 16:00',
        parent: 2
      }
    ]
  })
})
</script>

<style>
.gantt-container {
  width: 100%;
  height: 600px;
}
</style>
