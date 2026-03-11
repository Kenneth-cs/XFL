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

// 统一将不同格式的 happiness 数据转换为 { 维度名: 分数 } 的 Map
// 兼容两种格式：
//   1. 扁平格式：{ '积极性格': 6.67, ... }
//   2. 数组格式：{ dimensions: [{ dimensionId:1, normalizedScore:6.67, dimensionName:'积极性格' }] }
const getScoreByDimId = (dimId: number): number => {
  const data = props.data;
  if (!data) return 0;
  // 数组格式（API 直接返回的 happiness 对象）
  if (data.dimensions && Array.isArray(data.dimensions)) {
    const dim = data.dimensions.find((d: any) => d.dimensionId === dimId);
    return dim?.normalizedScore || 0;
  }
  // 扁平格式（已转换过的对象，按 dimensionName 索引）
  const dimConfig = HAPPINESS_DIMENSIONS.find(d => d.id === dimId);
  if (dimConfig) {
    return data[dimConfig.name] || 0;
  }
  return 0;
};

const updateChart = () => {
  if (!chartInstance) return;

  const dimensions = HAPPINESS_DIMENSIONS;

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
      // 1. 实际得分 (内层)
      {
        type: 'bar',
        data: dimensions.map((d) => ({
          value: getScoreByDimId(d.id),
          itemStyle: { color: d.color }
        })),
        coordinateSystem: 'polar',
        stack: 'happiness-stack', // 开启堆叠
        barWidth: '98%', 
        z: 2, // 层级高
        itemStyle: {
          borderRadius: 0
        }
      },
      // 2. 剩余填充 (外层背景)
      {
        type: 'bar',
        data: dimensions.map((d) => ({
          value: 10 - getScoreByDimId(d.id), // 补齐到10分
          itemStyle: { 
            color: '#f9f9f9', // 浅灰背景
            borderColor: '#e0e0e0', // 边框
            borderWidth: 1
          }
        })),
        coordinateSystem: 'polar',
        stack: 'happiness-stack', // 开启堆叠
        barWidth: '98%',
        z: 1, // 层级低
        silent: true
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

