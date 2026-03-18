<template>
  <div class="schedule-wrapper">
    <div ref="timelineRef" class="timeline"></div>
    <canvas ref="canvasRef" class="line-layer"></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { Timeline } from 'vis-timeline/standalone'

// DOM refs
const timelineRef = ref()
const canvasRef = ref()
let timeline

// 设备分行
const groups = [
  { id: 1, content: 'BOF1' },
  { id: 2, content: 'BOF2' },
  { id: 3, content: 'BOF3' },
  { id: 4, content: 'LF1_1' },
  { id: 5, content: 'LF1_2' },
  { id: 6, content: 'LF2_1' },
  { id: 7, content: 'LF2_2' }
]

// 炉次数据（每个炉次跨多个设备）
const items = [
  {
    id: 1,
    heatId: 'H001',
    group: 1,
    content: 'H001 转炉',
    start: '2026-03-12 10:00',
    end: '2026-03-12 10:30',
    className: 'converter'
  },
  {
    id: 2,
    heatId: 'H001',
    group: 4,
    content: 'H001 精炼',
    start: '2026-03-12 10:40',
    end: '2026-03-12 11:20',
    className: 'refining'
  },
  {
    id: 3,
    heatId: 'H001',
    group: 7,
    content: 'H001 连铸',
    start: '2026-03-12 11:30',
    end: '2026-03-12 12:10',
    className: 'casting'
  },

  {
    id: 4,
    heatId: 'H002',
    group: 2,
    content: 'H002 转炉',
    start: '2026-03-12 11:00',
    end: '2026-03-12 11:30',
    className: 'converter'
  },
  {
    id: 5,
    heatId: 'H002',
    group: 5,
    content: 'H002 精炼',
    start: '2026-03-12 11:40',
    end: '2026-03-12 12:20',
    className: 'refining'
  }
]

onMounted(async () => {
  timeline = new Timeline(timelineRef.value, items, groups, {
    stack: false,
    zoomable: false,
    zoomMin: 1000 * 60 * 15,
    zoomMax: 1000 * 60 * 60 * 24,
    // 启用编辑功能
    editable: {
      add: false, // 禁止添加新项目
      remove: false, // 禁止删除项目
      updateGroup: true, // 允许更新项目所属分组（即允许拖拽到其他设备）
      updateTime: true // 允许更新项目时间
    },
    horizontalScroll: true
  })

  // 等 DOM 渲染完成再画轨迹
  await nextTick()
  setTimeout(drawLines, 1000)

  // 拖动、缩放、重绘
  timeline.on('rangechanged', drawLines)
  //   timeline.on('changed', drawLines)
  //   timeline.on('click', highlightHeat)
})

// ------------------ 绘制轨迹折线 ------------------
function drawLines() {
  const canvas = canvasRef.value
  const ctx = canvas.getContext('2d')
  const rect = timelineRef.value.getBoundingClientRect()

  // 检查canvas是否有效
  if (!ctx) return

  canvas.width = rect.width
  canvas.height = rect.height
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  // 获取当前时间轴的可见范围
  const visibleRange = timeline.getWindow()
  const visibleStart = new Date(visibleRange.start).getTime()
  const visibleEnd = new Date(visibleRange.end).getTime()

  const heatMap = {}
  Object.values(timeline.itemSet.items).forEach((item) => {
    if (!item.dom || !item.dom.box) return

    // 获取实际DOM元素的边界矩形
    const domElement = item.dom.box
    const boundingRect = domElement.getBoundingClientRect()

    // 检查元素是否在可视区域内
    const itemLeft = boundingRect.left
    const itemRight = boundingRect.right
    const containerLeft = rect.left
    const containerRight = rect.right

    // 判断元素是否在容器的可视范围内（水平方向）
    const isInViewport = itemRight >= containerLeft && itemLeft <= containerRight

    // 检查项目的时间范围是否在可视时间范围内
    const itemStartTime = new Date(item.data.start).getTime()
    const itemEndTime = new Date(item.data.end).getTime()
    const isTimeInViewport = itemEndTime >= visibleStart && itemStartTime <= visibleEnd

    // 只有时间和位置都在可视范围内才处理该项目
    if (isInViewport && isTimeInViewport) {
      const heatId = item.data.heatId
      if (!heatMap[heatId]) heatMap[heatId] = []

      // 存储元素的位置信息
      heatMap[heatId].push({
        element: domElement,
        boundingRect: boundingRect,
        left: boundingRect.left,
        right: boundingRect.right,
        top: boundingRect.top,
        bottom: boundingRect.bottom,
        width: boundingRect.width,
        height: boundingRect.height,
        startTime: itemStartTime,
        endTime: itemEndTime
      })
    }
  })

  // 只有当同一炉次的项目数量大于1时才绘制连线
  Object.values(heatMap).forEach((list) => {
    if (list.length > 1) {
      // 至少需要两个项目才能绘制连线
      list.sort((a, b) => a.left - b.left)
      for (let i = 0; i < list.length - 1; i++) {
        const from = list[i]
        const to = list[i + 1]

        // 计算相对于canvas的坐标
        const x1 = from.right - rect.left
        const y1 = from.top + from.height / 2 - rect.top
        const x2 = to.left - rect.left
        const y2 = to.top + to.height / 2 - rect.top

        drawPolyline(ctx, x1, y1, x2, y2)
      }
    }
  })
}

// ------------------ 折线 + 箜头 ------------------
function drawPolyline(ctx, x1, y1, x2, y2) {
  const midX = x1 + (x2 - x1) / 2
  ctx.beginPath()
  ctx.moveTo(x1, y1)
  ctx.lineTo(midX, y1)
  ctx.lineTo(midX, y2)
  ctx.lineTo(x2, y2)
  ctx.strokeStyle = '#000000'
  ctx.lineWidth = 2
  ctx.stroke()

  // 箭头
  const headlen = 6
  ctx.beginPath()
  ctx.moveTo(x2, y2)
  ctx.lineTo(x2 - headlen, y2 - headlen / 2)
  ctx.lineTo(x2 - headlen, y2 + headlen / 2)
  ctx.closePath()
  ctx.fillStyle = '#000000'
  ctx.fill()
}

// ------------------ 点击高亮同一炉次 ------------------
function highlightHeat(props) {
  if (!props.item) return
  const clicked = items.find((i) => i.id === props.item)
  document.querySelectorAll('.vis-item').forEach((el) => (el.style.opacity = 0.2))
  items.forEach((i) => {
    if (i.heatId === clicked.heatId) {
      const el = document.querySelector(`[data-id="${i.id}"]`)
      if (el) el.style.opacity = 1
    }
  })
}
</script>

<style>
.schedule-wrapper {
  position: relative;
  height: 600px;
  margin-top: 100px;
}
.timeline {
  height: 100%;
}
.line-layer {
  position: absolute;
  top: 0;
  left: 0;
  pointer-events: none;
}

/* 工序颜色 */
.vis-item.converter {
  background: #409eff;
}
.vis-item.refining {
  background: #f59e0b;
}
.vis-item.casting {
  background: #22c55e;
}
</style>
