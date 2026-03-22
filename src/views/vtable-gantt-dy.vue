<template>
  <div style="padding-top: 50px">
    <!-- <el-button :loading="loading" @click="exportData">导出甘特图</el-button> -->
    <div id="gantt" style="width: 100%; height: 700px"></div>
  </div>
</template>

<script setup lang="jsx">
import { onMounted, onUnmounted, ref, nextTick } from 'vue' // ✅ 导入 onUnmounted
// import * as VTableGantt from '@visactor/vtable-gantt'
import * as VTableGantt from '@/utils/gantt/es/index.js'
import { ExportGanttPlugin } from '@visactor/vtable-plugins'
import zhuanLu from '../assets/zhuanLu.png'
import zhuanLu1 from '../assets/zhuanLu1.png'
import yaZhan from '../assets/yaZhan.png'
import RH from '../assets/RH.png'
import zhuJi from '../assets/zhuJi.png'
import circle from '../assets/circle.png'
const ganttInstance = ref(null)
let timer = null
const exportGanttPlugin = new ExportGanttPlugin()
const loading = ref(false)
const imgShif = ref(false)
const curLines = ref([])
const taskCustomLayout1 = (args) => {
  const { table, row, col, rect, value } = args
  let image = null
  if (value.includes('转炉')) {
    image = zhuanLu
  } else if (value.includes('氩站')) {
    image = yaZhan
  } else if (value.includes('RH')) {
    image = RH
  } else if (value.includes('铸机')) {
    image = zhuJi
  }
  const record = table.getRecordByRowCol(col, row)
  const { height, width } = rect || table.getCellRect(col, row)

  const group = new VTableGantt.VRender.Group({
    width,
    height,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  })

  const img = new VTableGantt.VRender.Image({
    width: 30,
    height: 30,
    image: image
    // image:
    //   'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/custom-render/rabbit.jpg'
  })
  const circleImg = new VTableGantt.VRender.Image({
    width: 20,
    height: 20,
    image: circle,
    dx: 50, // 强制向右偏移 20 像素，不受 Flex 限制
    y: 0
  })
  const text = new VTableGantt.VRender.Text({
    text: record.name,
    fontSize: 14,
    fill: '#333',
    x: 40,
    y: height / 2,
    textBaseline: 'middle'
  })
  group.add(circleImg)

  group.add(img)
  if (value.includes('转炉')) {
    const zhuan = new VTableGantt.VRender.Image({
      width: 30,
      height: 30,
      image: imgShif.value ? zhuanLu1 : zhuanLu
    })
    group.add(zhuan)
  }
  group.add(text)

  return {
    rootContainer: group,
    renderDefault: false
  }
}
const taskCustomLayout = (args) => {
  const { table, row, col, rect, value } = args
  const record = table.getRecordByRowCol(col, row)
  const { height, width } = rect || table.getCellRect(col, row)
  const imgSize = 30
  const group = new VTableGantt.VRender.Group({
    width,
    height,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
    // justifyContent: 'space-between'
  })
  const text = new VTableGantt.VRender.Text({
    text: record.name,
    fontSize: 11,
    fill: '#333',
    direction: 'vertical'
  })
  const circleGroup = new VTableGantt.VRender.Group({
    width: 15,
    height: 15,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  })
  const circleImg = new VTableGantt.VRender.Image({
    width: 20,
    height: 20,
    image: circle
  })
  circleGroup.add(circleImg)
  const withTemp = value.includes('RH') ? imgSize + 8 : imgSize + 26
  const img1Group = new VTableGantt.VRender.Group({
    width: withTemp,
    height: imgSize
  })
  const img2Group = new VTableGantt.VRender.Group({
    width: withTemp,
    height: imgSize,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  })
  const img3Group = new VTableGantt.VRender.Group({
    width: imgSize + 8,
    height: imgSize,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  })
  if (value.includes('转炉')) {
    const img = new VTableGantt.VRender.Image({
      width: imgSize,
      height: imgSize,
      image: zhuanLu
    })
    const zhuan = new VTableGantt.VRender.Image({
      width: imgSize,
      height: imgSize,
      image: imgShif.value ? zhuanLu1 : zhuanLu
    })
    img1Group.add(img)
    img2Group.add(zhuan)
  } else if (value.includes('氩站')) {
    const img = new VTableGantt.VRender.Image({
      width: imgSize,
      height: imgSize,
      image: yaZhan
    })
    const zhuan = new VTableGantt.VRender.Image({
      width: imgSize,
      height: imgSize,
      image: yaZhan
    })
    img1Group.add(img)
    img2Group.add(zhuan)
  } else if (value.includes('RH')) {
    const img = new VTableGantt.VRender.Image({
      width: 25,
      height: 25,
      image: yaZhan
    })
    const zhuan = new VTableGantt.VRender.Image({
      width: 25,
      height: 25,
      image: yaZhan
    })
    img1Group.add(img)
    const RHImg = new VTableGantt.VRender.Image({
      width: imgSize,
      height: imgSize,
      image: RH
    })
    img3Group.add(RHImg)

    img2Group.add(zhuan)
  } else if (value.includes('铸机')) {
    const img = new VTableGantt.VRender.Image({
      width: imgSize,
      height: imgSize,
      image: zhuJi
    })
    const zhuan = new VTableGantt.VRender.Image({
      width: imgSize,
      height: imgSize,
      image: zhuJi
    })
    img1Group.add(img)
    img2Group.add(zhuan)
  }
  group.add(circleGroup)
  group.add(img1Group)
  if (value.includes('RH')) {
    group.add(img3Group)
  }
  group.add(img2Group)
  group.add(text)
  return {
    rootContainer: group,
    renderDefault: false
  }
}
const taskBarCustomLayout = (args) => {
  // const { width, height, taskRecord } = args
  // let curHeitht = height + 20
  // const group = new VTableGantt.VRender.Group({
  //   width,
  //   height,
  //   display: 'flex',
  //   flexDirection: 'row',
  //   alignItems: 'center',
  //   background: '#ccc'
  // })

  // const textName = new VTableGantt.VRender.Text({
  //   text: taskRecord.name,
  //   fontSize: 12,
  //   fill: '#333'
  //   // x: 40,
  //   // y: height / 2,
  //   // textBaseline: 'middle'
  // })
  // // const top = new VTableGantt.VRender.Group({
  // //   width,
  // //   height: height - 3,
  // // })
  // // top.add(textName)
  // group.add(textName)
  // return {
  //   rootContainer: group,
  //   renderDefault: false
  // }
  const { taskRecord, height, width } = args
  // const { width, height } = rect

  // 1. 根容器 (直接把属性平铺)
  const group = new VTableGantt.VRender.Group({
    width,
    height,
    clip: true,
    cornerRadius: 0 // 显式设置为 0，确保直角
  })

  // 设定切分比例（比如 70% 宽，70% 高）
  const splitX = width * 0.7
  const splitY = height * 0.7

  // --- 【左上区域】：白色背景 + 粗体主编号 ---
  const mainRect = new VTableGantt.VRender.Rect({
    name: 'main-rect-box',
    x: 0,
    y: 0,
    width: splitX,
    height: splitY,
    fill: '#fff',
    stroke: '#333',
    lineWidth: 1,
    cornerRadius: 0 // 直角
  })
  const mainText = new VTableGantt.VRender.Text({
    text: taskRecord.name || '6302666',
    x: splitX / 2,
    y: splitY / 2,
    fontSize: 12,
    fontWeight: 'bold',
    fill: '#000',
    textAlign: 'center',
    textBaseline: 'middle'
  })
  // group.on('click', (e) => {
  //   console.log('直系拿了么试试')
  //   // 停止事件冒泡，防止触发甘特图默认的点击行为
  //   e.stopPropagation()

  //   // 直接修改属性：变为蓝色
  //   mainRect.setAttributes({
  //     fill: '#5B8FF9' // 蓝色
  //   })

  //   // 如果文字也需要变白，可以顺便改 mainText
  //   mainText.setAttributes({
  //     fill: '#ffffff'
  //   })

  //   // 强制更新渲染（确保颜色立即变化）
  //   // mainRect.stage.renderNextFrame()
  // })
  // --- 【右上区域】：浅灰背景 + 次要标识 ---
  const subRect = new VTableGantt.VRender.Rect({
    x: splitX,
    y: 0,
    width: width - splitX,
    height: splitY,
    fill: '#e0e0e0', // 稍微灰一点
    stroke: '#333',
    lineWidth: 1
  })
  const subText = new VTableGantt.VRender.Text({
    text: '24/',
    x: splitX + (width - splitX) / 2,
    y: splitY / 2,
    fontSize: 11,
    fill: '#333',
    textAlign: 'center',
    textBaseline: 'middle'
  })

  // --- 【下方区域】：浅灰长条页脚 ---
  const footerRect = new VTableGantt.VRender.Rect({
    x: 0,
    y: splitY,
    width: width,
    height: height - splitY,
    fill: '#dcdcdc', // 最下面的灰色
    stroke: '#333',
    lineWidth: 1
  })

  // 依次添加，后添加的会盖在先添加的上面
  group.add(mainRect)
  group.add(mainText)
  group.add(subRect)
  group.add(subText)
  group.add(footerRect)

  return {
    rootContainer: group,
    renderDefault: false
  }
}
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
          id: 'conv1_A',
          name: '炉次A',
          start: `${fullDate} 08:00`,
          end: `${fullDate} 08:20`,
          zhuan_id: 'conv1_A',
          ya_id: 'arg1_A',
          RH_id: 'rh1_A',
          zhu_id: 'cast1_A'
        },
        {
          id: 'conv1_B',
          name: '炉次B',
          start: `${fullDate} 09:00`,
          end: `${fullDate} 09:20`,
          zhuan_id: 'conv1_B',
          ya_id: 'arg1_B',
          RH_id: 'rh1_B',
          zhu_id: 'cast1_B'
        },
        {
          id: 'conv1_C',
          name: '炉次C',
          start: `${fullDate} 10:00`,
          end: `${fullDate} 10:20`,
          zhuan_id: 'conv1_C',
          ya_id: 'arg1_C',
          RH_id: 'rh1_C',
          zhu_id: 'cast1_C'
        },
        {
          id: 'conv1_D',
          name: '炉次D',
          start: `${fullDate} 11:00`,
          end: `${fullDate} 11:20`,
          zhuan_id: 'conv1_D',
          ya_id: 'arg1_D',
          RH_id: 'rh1_D',
          zhu_id: 'cast1_D'
        }
      ]
    },
    {
      id: 'converter2',
      name: '2#转炉',
      children: [
        {
          id: 'conv2_E',
          name: '炉次E',
          start: `${fullDate} 08:10`,
          end: `${fullDate} 08:30`,
          zhuan_id: 'conv2_E',
          ya_id: 'arg2_E',
          RH_id: 'rh2_E',
          zhu_id: 'cast2_E'
        },
        {
          id: 'conv2_F',
          name: '炉次F',
          start: `${fullDate} 09:10`,
          end: `${fullDate} 09:30`,
          zhuan_id: 'conv2_F',
          ya_id: 'arg2_F',
          RH_id: 'rh2_F',
          zhu_id: 'cast2_F'
        },
        {
          id: 'conv2_G',
          name: '炉次G',
          start: `${fullDate} 10:10`,
          end: `${fullDate} 10:30`,
          zhuan_id: 'conv2_G',
          ya_id: 'arg2_G',
          RH_id: 'rh2_G',
          zhu_id: 'cast2_G'
        },
        {
          id: 'conv2_H',
          name: '炉次H',
          start: `${fullDate} 11:10`,
          end: `${fullDate} 11:30`,
          zhuan_id: 'conv2_H',
          ya_id: 'arg2_H',
          RH_id: 'rh2_H',
          zhu_id: 'cast2_H'
        }
      ]
    },
    {
      id: 'converter3',
      name: '3#转炉',
      children: [
        {
          id: 'conv3_I',
          name: '炉次I',
          start: `${fullDate} 08:20`,
          end: `${fullDate} 08:40`,
          zhuan_id: 'conv3_I',
          ya_id: 'arg3_I',
          RH_id: 'rh3_I',
          zhu_id: 'cast3_I'
        },
        {
          id: 'conv3_J',
          name: '炉次J',
          start: `${fullDate} 09:20`,
          end: `${fullDate} 09:40`,
          zhuan_id: 'conv3_J',
          ya_id: 'arg3_J',
          RH_id: 'rh3_J',
          zhu_id: 'cast3_J'
        },
        {
          id: 'conv3_K',
          name: '炉次K',
          start: `${fullDate} 10:20`,
          end: `${fullDate} 10:40`,
          zhuan_id: 'conv3_K',
          ya_id: 'arg3_K',
          RH_id: 'rh3_K',
          zhu_id: 'cast3_K'
        },
        {
          id: 'conv3_L',
          name: '炉次L',
          start: `${fullDate} 11:20`,
          end: `${fullDate} 11:40`,
          zhuan_id: 'conv3_L',
          ya_id: 'arg3_L',
          RH_id: 'rh3_L',
          zhu_id: 'cast3_L'
        }
      ]
    },
    {
      id: 'argon1',
      name: '1#氩站',
      children: [
        {
          id: 'arg1_A',
          name: '炉次A',
          start: `${fullDate} 08:25`,
          end: `${fullDate} 08:35`,
          zhuan_id: 'conv1_A',
          ya_id: 'arg1_A',
          RH_id: 'rh1_A',
          zhu_id: 'cast1_A'
        },
        {
          id: 'arg1_B',
          name: '炉次B',
          start: `${fullDate} 09:25`,
          end: `${fullDate} 09:35`,
          zhuan_id: 'conv1_B',
          ya_id: 'arg1_B',
          RH_id: 'rh1_B',
          zhu_id: 'cast1_B'
        },
        {
          id: 'arg1_C',
          name: '炉次C',
          start: `${fullDate} 10:25`,
          end: `${fullDate} 10:35`,
          zhuan_id: 'conv1_C',
          ya_id: 'arg1_C',
          RH_id: 'rh1_C',
          zhu_id: 'cast1_C'
        },
        {
          id: 'arg1_D',
          name: '炉次D',
          start: `${fullDate} 11:25`,
          end: `${fullDate} 11:35`,
          zhuan_id: 'conv1_D',
          ya_id: 'arg1_D',
          RH_id: 'rh1_D',
          zhu_id: 'cast1_D'
        }
      ]
    },
    {
      id: 'argon2',
      name: '2#氩站',
      children: [
        {
          id: 'arg2_E',
          name: '炉次E',
          start: `${fullDate} 08:35`,
          end: `${fullDate} 08:45`,
          zhuan_id: 'conv2_E',
          ya_id: 'arg2_E',
          RH_id: 'rh2_E',
          zhu_id: 'cast2_E'
        },
        {
          id: 'arg2_F',
          name: '炉次F',
          start: `${fullDate} 09:35`,
          end: `${fullDate} 09:45`,
          zhuan_id: 'conv2_F',
          ya_id: 'arg2_F',
          RH_id: 'rh2_F',
          zhu_id: 'cast2_F'
        },
        {
          id: 'arg2_G',
          name: '炉次G',
          start: `${fullDate} 10:35`,
          end: `${fullDate} 10:45`,
          zhuan_id: 'conv2_G',
          ya_id: 'arg2_G',
          RH_id: 'rh2_G',
          zhu_id: 'cast2_G'
        },
        {
          id: 'arg2_H',
          name: '炉次H',
          start: `${fullDate} 11:35`,
          end: `${fullDate} 11:45`,
          zhuan_id: 'conv2_H',
          ya_id: 'arg2_H',
          RH_id: 'rh2_H',
          zhu_id: 'cast2_H'
        }
      ]
    },
    {
      id: 'argon3',
      name: '3#氩站',
      children: [
        {
          id: 'arg3_I',
          name: '炉次I',
          start: `${fullDate} 08:45`,
          end: `${fullDate} 08:55`,
          zhuan_id: 'conv3_I',
          ya_id: 'arg3_I',
          RH_id: 'rh3_I',
          zhu_id: 'cast3_I'
        },
        {
          id: 'arg3_J',
          name: '炉次J',
          start: `${fullDate} 09:45`,
          end: `${fullDate} 09:55`,
          zhuan_id: 'conv3_J',
          ya_id: 'arg3_J',
          RH_id: 'rh3_J',
          zhu_id: 'cast3_J'
        },
        {
          id: 'arg3_K',
          name: '炉次K',
          start: `${fullDate} 10:45`,
          end: `${fullDate} 10:55`,
          zhuan_id: 'conv3_K',
          ya_id: 'arg3_K',
          RH_id: 'rh3_K',
          zhu_id: 'cast3_K'
        },
        {
          id: 'arg3_L',
          name: '炉次L',
          start: `${fullDate} 11:45`,
          end: `${fullDate} 11:55`,
          zhuan_id: 'conv3_L',
          ya_id: 'arg3_L',
          RH_id: 'rh3_L',
          zhu_id: 'cast3_L'
        }
      ]
    },
    {
      id: 'rh1',
      name: '1#RH炉',
      children: [
        {
          id: 'rh1_A',
          name: '炉次A',
          start: `${fullDate} 08:40`,
          end: `${fullDate} 08:55`,
          zhuan_id: 'conv1_A',
          ya_id: 'arg1_A',
          RH_id: 'rh1_A',
          zhu_id: 'cast1_A'
        },
        {
          id: 'rh1_B',
          name: '炉次B',
          start: `${fullDate} 09:40`,
          end: `${fullDate} 09:55`,
          zhuan_id: 'conv1_B',
          ya_id: 'arg1_B',
          RH_id: 'rh1_B',
          zhu_id: 'cast1_B'
        },
        {
          id: 'rh1_C',
          name: '炉次C',
          start: `${fullDate} 10:40`,
          end: `${fullDate} 10:55`,
          zhuan_id: 'conv1_C',
          ya_id: 'arg1_C',
          RH_id: 'rh1_C',
          zhu_id: 'cast1_C'
        },
        {
          id: 'rh1_D',
          name: '炉次D',
          start: `${fullDate} 11:40`,
          end: `${fullDate} 11:55`,
          zhuan_id: 'conv1_D',
          ya_id: 'arg1_D',
          RH_id: 'rh1_D',
          zhu_id: 'cast1_D'
        }
      ]
    },
    {
      id: 'rh2',
      name: '2#RH炉',
      children: [
        {
          id: 'rh2_E',
          name: '炉次E',
          start: `${fullDate} 08:50`,
          end: `${fullDate} 09:05`,
          zhuan_id: 'conv2_E',
          ya_id: 'arg2_E',
          RH_id: 'rh2_E',
          zhu_id: 'cast2_E'
        },
        {
          id: 'rh2_F',
          name: '炉次F',
          start: `${fullDate} 09:50`,
          end: `${fullDate} 10:05`,
          zhuan_id: 'conv2_F',
          ya_id: 'arg2_F',
          RH_id: 'rh2_F',
          zhu_id: 'cast2_F'
        },
        {
          id: 'rh2_G',
          name: '炉次G',
          start: `${fullDate} 10:50`,
          end: `${fullDate} 11:05`,
          zhuan_id: 'conv2_G',
          ya_id: 'arg2_G',
          RH_id: 'rh2_G',
          zhu_id: 'cast2_G'
        },
        {
          id: 'rh2_H',
          name: '炉次H',
          start: `${fullDate} 11:50`,
          end: `${fullDate} 12:05`,
          zhuan_id: 'conv2_H',
          ya_id: 'arg2_H',
          RH_id: 'rh2_H',
          zhu_id: 'cast2_H'
        }
      ]
    },
    {
      id: 'rh3', // 新增：3#RH炉
      name: '3#RH炉',
      children: [
        {
          id: 'rh3_I',
          name: '炉次I',
          start: `${fullDate} 09:00`,
          end: `${fullDate} 09:15`,
          zhuan_id: 'conv3_I',
          ya_id: 'arg3_I',
          RH_id: 'rh3_I',
          zhu_id: 'cast3_I'
        },
        {
          id: 'rh3_J',
          name: '炉次J',
          start: `${fullDate} 10:00`,
          end: `${fullDate} 10:15`,
          zhuan_id: 'conv3_J',
          ya_id: 'arg3_J',
          RH_id: 'rh3_J',
          zhu_id: 'cast3_J'
        },
        {
          id: 'rh3_K',
          name: '炉次K',
          start: `${fullDate} 11:00`,
          end: `${fullDate} 11:15`,
          zhuan_id: 'conv3_K',
          ya_id: 'arg3_K',
          RH_id: 'rh3_K',
          zhu_id: 'cast3_K'
        },
        {
          id: 'rh3_L',
          name: '炉次L',
          start: `${fullDate} 12:00`,
          end: `${fullDate} 12:15`,
          zhuan_id: 'conv3_L',
          ya_id: 'arg3_L',
          RH_id: 'rh3_L',
          zhu_id: 'cast3_L'
        }
      ]
    },
    {
      id: 'caster1',
      name: '1#铸机',
      children: [
        {
          id: 'cast1_A',
          name: '炉次A',
          start: `${fullDate} 09:00`,
          end: `${fullDate} 09:20`,
          zhuan_id: 'conv1_A',
          ya_id: 'arg1_A',
          RH_id: 'rh1_A',
          zhu_id: 'cast1_A'
        },
        {
          id: 'cast1_B',
          name: '炉次B',
          start: `${fullDate} 10:00`,
          end: `${fullDate} 10:20`,
          zhuan_id: 'conv1_B',
          ya_id: 'arg1_B',
          RH_id: 'rh1_B',
          zhu_id: 'cast1_B'
        },
        {
          id: 'cast1_C',
          name: '炉次C',
          start: `${fullDate} 11:00`,
          end: `${fullDate} 11:20`,
          zhuan_id: 'conv1_C',
          ya_id: 'arg1_C',
          RH_id: 'rh1_C',
          zhu_id: 'cast1_C'
        },
        {
          id: 'cast1_D',
          name: '炉次D',
          start: `${fullDate} 12:00`,
          end: `${fullDate} 12:20`,
          zhuan_id: 'conv1_D',
          ya_id: 'arg1_D',
          RH_id: 'rh1_D',
          zhu_id: 'cast1_D'
        },
        {
          id: 'cast3_I',
          name: '炉次I',
          start: `${fullDate} 09:30`,
          end: `${fullDate} 09:55`,
          zhuan_id: 'conv3_I',
          ya_id: 'arg3_I',
          RH_id: 'rh3_I',
          zhu_id: 'cast3_I'
        },
        {
          id: 'cast3_J',
          name: '炉次J',
          start: `${fullDate} 10:30`,
          end: `${fullDate} 10:55`,
          zhuan_id: 'conv3_J',
          ya_id: 'arg3_J',
          RH_id: 'rh3_J',
          zhu_id: 'cast3_J'
        },
        {
          id: 'cast3_K',
          name: '炉次K',
          start: `${fullDate} 11:30`,
          end: `${fullDate} 11:55`,
          zhuan_id: 'conv3_K',
          ya_id: 'arg3_K',
          RH_id: 'rh3_K',
          zhu_id: 'cast3_K'
        },
        {
          id: 'cast3_L',
          name: '炉次L',
          start: `${fullDate} 12:30`,
          end: `${fullDate} 12:50`,
          zhuan_id: 'conv3_L',
          ya_id: 'arg3_L',
          RH_id: 'rh3_L',
          zhu_id: 'cast3_L'
        }
      ]
    },
    {
      id: 'caster2',
      name: '2#铸机',
      children: [
        {
          id: 'cast2_E',
          name: '炉次E',
          start: `${fullDate} 09:10`,
          end: `${fullDate} 09:30`,
          zhuan_id: 'conv2_E',
          ya_id: 'arg2_E',
          RH_id: 'rh2_E',
          zhu_id: 'cast2_E'
        },
        {
          id: 'cast2_F',
          name: '炉次F',
          start: `${fullDate} 10:10`,
          end: `${fullDate} 10:30`,
          zhuan_id: 'conv2_F',
          ya_id: 'arg2_F',
          RH_id: 'rh2_F',
          zhu_id: 'cast2_F'
        },
        {
          id: 'cast2_G',
          name: '炉次G',
          start: `${fullDate} 11:10`,
          end: `${fullDate} 11:30`,
          zhuan_id: 'conv2_G',
          ya_id: 'arg2_G',
          RH_id: 'rh2_G',
          zhu_id: 'cast2_G'
        },
        {
          id: 'cast2_H',
          name: '炉次H',
          start: `${fullDate} 12:10`,
          end: `${fullDate} 12:30`,
          zhuan_id: 'conv2_H',
          ya_id: 'arg2_H',
          RH_id: 'rh2_H',
          zhu_id: 'cast2_H'
        }
      ]
    }
  ]

  // ✅ 修正：时间范围覆盖任务数据（2026-03-18），月份用两位数
  const minDate = new Date(`${fullDate} 00:00:00`)
  const maxDate = new Date(`${fullDate} 23:59:59`)

  const option = {
    records,

    renderService: {
      enableHtml: true
    },
    enableHtml: true,
    taskListTable: {
      columns: [
        {
          field: 'name',
          title: '设备',
          width: 150,
          tree: true,
          // 生效
          customLayout: taskCustomLayout
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
    tasksShowMode: VTableGantt.TYPES.TasksShowMode.Sub_Tasks_Inline,

    grid: {
      horizontalLine: { lineWidth: 1, lineColor: '#e1e4e8' },
      verticalLine: { lineWidth: 1, lineColor: '#e1e4e8' },
      horizontalBackgroundColor: [
        '#f1f1f1',
        '#f1f1f1',
        '#f1f1f1',
        '#dddddd',
        '#dddddd',
        '#dddddd',
        '#cccccc',
        '#cccccc',
        '#cccccc',
        '#aaa',
        '#aaa'
      ],
      verticalLineDependenceOnTimeScale: 'second',
      verticalLine: function (args) {
        if (args.index % 5 === 0) {
          return {
            lineWidth: 1,
            lineColor: '#ffffff'
          }
        } else {
          return {
            lineWidth: 1,
            lineColor: '#ffffff',
            lineDash: [3]
          }
        }
      }
    },

    rowHeight: 50,

    taskBar: {
      resizable: false,
      // moveable: false,
      startDateField: 'start',
      endDateField: 'end',
      labelText: '{name}',
      barStyle: (args) => {
        const isCeshi = args.taskRecord.ceshi
        return {
          width: 30,
          barColor: isCeshi ? '#32d541' : '#5B8FF9',
          cornerRadius: 0
        }
      },
      customLayout: taskBarCustomLayout
    },

    dependency: {
      links: [],
      linkDeletable: true,
      distanceToTaskBar:20
    },

    timelineHeader: {
      colWidth: 10,
      horizontalLine: {
        lineWidth: 0,
        lineColor: '#ccc'
      },
      verticalLine: {
        lineWidth: 1,
        lineColor: '#ccc'
      },
      scales: [
        {
          unit: 'day',
          step: 1,
          format(date) {
            return ''
          },
          rowHeight: 30,
          style: {
            fontSize: 0
          }
        },
        {
          unit: 'minute',
          step: 10,
          format(date) {
            const d = date.startDate
            const h = String(d.getHours()).padStart(2, '0')
            const m = String(d.getMinutes()).padStart(2, '0')
            return `${h}:${m}`
          },
          rowHeight: 10,
          style: {
            fontSize: 12,
            color: '#000',
            textAlign: 'center',
            fontWeight: 'normal',
            padding: [0, 100, 33, 0]
          }
        },
        {
          unit: 'minute',
          step: 5,
          format(date) {
            return ''
          },
          rowHeight: 10,
          style: {
            fontSize: 0
          }
        },
        {
          unit: 'minute',
          step: 1,
          format(date) {
            return ''
          },
          rowHeight: 10,
          style: {
            fontSize: 0
          }
        },
        {
          unit: 'second',
          step: 60,
          format(date) {
            return ''
          },
          rowHeight: 0,
          style: {
            fontSize: 0
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
        date: new Date(), // 直接传入当前 Date 对象
        scrollToMarkLine: true,
        position: 'date', // 重点加这个
        style: {
          lineColor: 'red'
          // lineWidth: 2,
          // lineDash: [4, 2],
        }
      }
    ],
    timebarColumnWidth: 200,
    plugins: [exportGanttPlugin]
  }
  const container = document.getElementById('gantt')
  ganttInstance.value = new VTableGantt.Gantt(container, option)

  let refreshCount = 0 // 计数器

  // let lastMarkDate = new Date()
  // ✅ 4. 优化定时器：为了 C 端流畅感，建议 10 秒更新一次，或者 1 秒
  timer = setInterval(() => {
    const now = new Date()

    // ganttInstance.value.updateMarkLine({
    //   date: now, // 必须是 Date 对象
    //   position: 'date' // 重点加这个
    // })
    // 1. 日期累加：每次增加 10 分钟
    // lastMarkDate = new Date(lastMarkDate.getTime() + 10 * 60 * 1000)

    // 2. 更新标记线
    ganttInstance.value.updateMarkLine([
      {
        date: now,
        position: 'date',
        scrollToMarkLine: true,
        style: { lineColor: 'red' }
      }
    ])
    refreshCount++

    if (refreshCount >= 10) {
      const gantt = ganttInstance.value
      // // 直接执行滚动
      // ganttInstance.value.scrollLeft += 100
      refreshCount = 0

      // 测试
      // 1. 获取所有列的开始时间戳
      const startTimes = gantt._timelineColStartTimes // 你截图里的 Array(144)
      // 2. 获取所有列对应的 X 像素坐标
      const colX = gantt._timelineColX // 你截图里的 Array(145)
      // debugger
      if (startTimes && colX) {
        const targetTime = now.getTime()

        // 3. 寻找当前时间落在哪一列 (二分查找或简单遍历)
        let colIndex = startTimes.findIndex((t) => t > targetTime) - 1
        if (colIndex < 0) colIndex = 0

        // 4. 直接从数组里拿像素值（这绝对是准的，因为它是 Canvas 渲染的依据）
        const lineX = colX[colIndex]

        // 5. 计算居中
        const visibleWidth = gantt.tableNoFrameWidth
        const targetLeft = lineX - visibleWidth / 2
        ganttInstance.value.scrollLeft = targetLeft + 10
        console.log('第三方都是', targetLeft)
      }
    }
  }, 10000) // 10秒刷一次，位置会更精确
  setTimeout(() => {
    imgShif.value = true
    // ganttInstance.value.updateOption(option)
    // 这里是找到了taskListTableInstance实例
    ganttInstance.value.taskListTableInstance.updateColumns([
      {
        field: 'name',
        title: '设备',
        width: 150,
        tree: true,
        // 生效
        customLayout: taskCustomLayout
      }
    ])
  }, 3000)
  // 点击任务栏
  ganttInstance.value.on('click_task_bar', (args) => {
    const { record } = args
    const { zhuan_id, ya_id, RH_id, zhu_id } = record
    if (curLines.value.length) {
      curLines.value.map((item) => {
        ganttInstance.value.deleteLink(item)
      })
      curLines.value = []
    }
    let temp = [
      {
        type: VTableGantt.TYPES.DependencyType.FinishToStart,
        linkedFromTaskKey: zhuan_id,
        linkedToTaskKey: ya_id
      },
      {
        type: VTableGantt.TYPES.DependencyType.FinishToStart,
        linkedFromTaskKey: ya_id,
        linkedToTaskKey: RH_id
      },
      {
        type: VTableGantt.TYPES.DependencyType.FinishToStart,
        linkedFromTaskKey: RH_id,
        linkedToTaskKey: zhu_id
      }
    ]
    temp.map((item) => {
      curLines.value.push(item)
      ganttInstance.value.addLink(item)
    })
  })
  // 任务条移动结束事件
  ganttInstance.value.on('move_end_task_bar', (args) => {
    console.log('任务条移动结束:', args)
  })
  // contextmenu_dependency_link-线的右击事件
  // 鼠标右键
  ganttInstance.value.on('contextmenu_task_bar', (args) => {
    console.log('任务栏的右键事件:', args)
  })
})
// 修改背景色
const updateBgColor = (args) => {
  // const { federatedEvent } = args
  // path 是从点击处向上冒泡的所有节点数组
  // const path = federatedEvent.path || []
  // // 1. 在路径里直接找名为 'main-rect-box' 的节点
  // const rect = path.find((node) => node.attribute && node.attribute.name === 'main-rect-box')
  // // 2. 如果找到了矩形，就修改它
  // if (rect) {
  //   // 修改背景色
  //   rect.setAttributes({
  //     fill: '#5B8FF9'
  //   })
  // }
  // console.log('点击任务栏', rect)
  // if (curLines.value.length > 0) {
  //   curLines.value.map((item) => {
  //     ganttInstance.value.deleteLink(item)
  //   })
  // }
}
// 假设你点击了某行，或者收到了某个状态变更
// const updateRowImage = (row) => {
//   // 1. 修改原始数据中的状态位
//   const record = ganttInstance.value.getRecordByRow(row);
//   record.isActive = !record.isActive; // 切换状态

//   // 2. 仅触发该单元格的重绘 (指定列 col 和 行 row)
//   // 假设图片所在的列是第 0 列
//   ganttInstance.value.taskListTableInstance.updateCustomCell(0, row);
// };
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
  if (ganttInstance.value) {
    ganttInstance.value.release() // ✅ 官方 API，销毁 Canvas 实例，释放内存
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
