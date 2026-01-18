<template>
  <div ref="chartRef" :style="{ width: typeof width === 'number' ? width + 'px' : width, height: typeof height === 'number' ? height + 'px' : height }"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, onUnmounted } from 'vue';
import * as echarts from 'echarts';
import { HAPPINESS_DIMENSIONS } from '@/utils/happiness-config';

const props = defineProps({
  data: {
    type: Object, // { [key: string]: number } 维度得分
    default: () => ({})
  },
  width: {
    type: [String, Number],
    default: '80px'
  },
  height: {
    type: [String, Number],
    default: '80px'
  },
  showLabel: {
    type: Boolean,
    default: false
  }
});

const chartRef = ref<HTMLElement | null>(null);
let chartInstance: echarts.ECharts | null = null;

const initChart = () => {
  if (!chartRef.value) return;
  
  chartInstance = echarts.init(chartRef.value);
  updateChart();
};

const updateChart = () => {
  if (!chartInstance) return;

  const dimensions = HAPPINESS_DIMENSIONS;
  // 构造数据：外层是维度名（如果有），内层是得分
  // 微缩图主要展示颜色和填充度
  
  // 修改为径向柱状图（类似南丁格尔图，但每个扇区角度相同，半径不同）
  // 实际上幸福力图是：每个扇区代表一个维度，半径代表得分。
  // ECharts 的 polar bar 默认是角度代表数值。
  // 要实现"每个扇区角度相同，半径不同"，需要用 angleAxis type='category'
  
  const option2 = {
    backgroundColor: 'transparent',
    polar: {
      radius: props.showLabel ? ['15%', '85%'] : ['10%', '100%'] // 显示标签时预留更多外围空间
    },
    angleAxis: {
      type: 'category',
      data: dimensions.map(d => d.outer),
      startAngle: 90,
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { 
        show: props.showLabel,
        interval: 0,
        color: '#333', // 标签颜色加深，确保清晰
        fontSize: 11,
        margin: 5
      },
      splitLine: { show: false }
    },
    radiusAxis: {
      min: 0,
      max: 10,
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { show: false },
      splitLine: { show: false }
    },
    series: [
      {
        type: 'bar',
        data: dimensions.map((d) => ({
          value: props.data?.[d.name] || 0,
          itemStyle: { color: d.color }
        })),
        coordinateSystem: 'polar',
        barWidth: '98%', // 扇区更紧凑，显得更饱满
        itemStyle: {
          borderRadius: 0 // 不需要圆角，保持锐利
        }
      }
    ]
  };

  chartInstance.setOption(option2);
};

onMounted(() => {
  initChart();
});

watch(() => props.data, () => {
  updateChart();
}, { deep: true });

onUnmounted(() => {
  if (chartInstance) {
    chartInstance.dispose();
    chartInstance = null;
  }
});
</script>

