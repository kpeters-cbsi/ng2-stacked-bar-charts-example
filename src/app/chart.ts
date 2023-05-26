import { Chart, ChartConfiguration, ChartOptions } from 'chart.js';

export const chartData: Array<Record<string, number>> = [
  { COMPLIANT: 1 },
  { COMPLIANT: 1 },
  { COMPLIANT: 1 },
  { COMPLIANT: 1 },
  { COMPLIANT: 19, NON_COMPLIANT: 1 },
  { COMPLIANT: 1 },
  { COMPLIANT: 15 },
  { COMPLIANT: 1 },
  {},
  { COMPLIANT: 20 },
  { COMPLIANT: 1 },
  { COMPLIANT: 1 },
  { COMPLIANT: 1 },
  { COMPLIANT: 1 },
  { COMPLIANT: 6 },
  { COMPLIANT: 1 },
  { COMPLIANT: 27 },
  { COMPLIANT: 27 },
  { COMPLIANT: 27 },
  { COMPLIANT: 26, NON_COMPLIANT: 1 },
  { COMPLIANT: 1 },
  { COMPLIANT: 1 },
  { COMPLIANT: 1 },
  { COMPLIANT: 2 },
  { COMPLIANT: 2, NON_COMPLIANT: 2 },
  {},
  { COMPLIANT: 1 },
  { COMPLIANT: 69, NON_COMPLIANT: 5, INSUFFICIENT_DATA: 1 },
  {},
  { COMPLIANT: 4, NON_COMPLIANT: 23 },
  { COMPLIANT: 1 },
  { COMPLIANT: 14, NON_COMPLIANT: 15 },
  { COMPLIANT: 13 },
  { COMPLIANT: 15 },
  { COMPLIANT: 91, NON_COMPLIANT: 11 },
  { COMPLIANT: 101, NON_COMPLIANT: 1 },
  { COMPLIANT: 61, NON_COMPLIANT: 1 },
  { COMPLIANT: 15 },
  { COMPLIANT: 2 },
  { COMPLIANT: 135 },
  { COMPLIANT: 119, NON_COMPLIANT: 1 },
  { COMPLIANT: 100 },
  { COMPLIANT: 335, NON_COMPLIANT: 2 },
  { COMPLIANT: 2189 },
];

export const chartOptions: ChartOptions = {
  indexAxis: 'y',
  scales: {
    x: {
      border: { display: false },
      stacked: true,
      ticks: { display: false },
      grid: {
        display: false,
      },
    },
    y: {
      border: { display: false },
      stacked: true,
      ticks: { display: false },
      grid: {
        display: false,
      },
    },
  },
  plugins: {
    legend: {
      display: false,
      position: 'bottom',
      onClick: (e, legendItem, legend) => {
        console.debug('Legend clicked', { e, legendItem, legend });
      },
    },
    tooltip: {
      enabled: true,
    },
    datalabels: {
      anchor: 'center',
      align: 'center',
      color: 'white',
      backgroundColor: 'black',
      font: {
        weight: 'bold',
      },
      formatter: (value: number, context: any) => {
        const total = context.chart.data.datasets
          .map((dataset: any) => dataset.data)
          .reduce((acc: number, data: any) => acc + (data[0] as number), 0);
        return Math.round((value / total) * 100) + '%';
      },
    },
  },
  onResize: (chart, size) => {
    console.debug('Resize: ', { chart, size });
  },
  responsive: true,
};
