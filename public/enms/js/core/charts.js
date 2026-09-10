import { state } from './state.js';
import { $, fmt } from './dom.js';

export const colors = ['#0789ed','#0cb48b','#ffb125','#8061d8','#16b8d4','#ed6aab','#638aa7','#c7d4de'];

export function destroyAllCharts() {
  state.charts.forEach(chart => chart.destroy());
  state.charts = [];
}

export function replaceChart(id) {
  state.charts = state.charts.filter(chart => {
    if (chart.el?.id === id) {
      chart.destroy();
      return false;
    }
    return true;
  });
  const target = $(`#${id}`);
  if (target) target.innerHTML = '';
}

export function chart(id, type, series, options = {}) {
  const target = $(`#${id}`);
  if (!target) return null;

  const config = {
    chart: {
      type,
      height: options.height || 210,
      fontFamily: 'Segoe UI, Arial, sans-serif',
      toolbar: { show: false },
      animations: { enabled: false },
      parentHeightOffset: 0
    },
    series,
    colors: options.colors || colors,
    stroke: { width: 2, curve: 'smooth' },
    dataLabels: { enabled: false },
    grid: {
      borderColor: '#e9f0f6',
      strokeDashArray: 0,
      padding: { left: 4, right: 10, top: 0, bottom: 0 }
    },
    xaxis: {
      categories: options.categories || Array.from({ length: 25 }, (_, i) => `${String(i).padStart(2, '0')}:00`),
      labels: { style: { fontSize: '9px', colors: '#7b91a4' }, rotate: 0, hideOverlappingLabels: true },
      axisBorder: { show: false },
      axisTicks: { show: false },
      tickAmount: 6
    },
    yaxis: {
      labels: {
        style: { fontSize: '9px', colors: '#7b91a4' },
        formatter: value => fmt(value, options.decimals || 0)
      }
    },
    legend: {
      position: 'top', horizontalAlign: 'right', fontSize: '10px',
      markers: { width: 7, height: 7 }, itemMargin: { horizontal: 8, vertical: 2 }
    },
    fill: {
      type: type === 'area' ? 'gradient' : 'solid',
      gradient: { opacityFrom: .32, opacityTo: .04 }
    },
    tooltip: { x: { show: true } },
    markers: { size: 2, strokeWidth: 0 },
    ...options
  };

  const instance = new ApexCharts(target, config);
  state.charts.push(instance);
  instance.render();
  return instance;
}

export function donut(id, values, total, unit = 'kWh', labels = []) {
  return chart(id, 'donut', values, {
    height: 215,
    labels: labels.length ? labels : state.stations.slice(0, values.length).map(item => item.name),
    legend: { show: false },
    stroke: { width: 1, colors: ['#fff'] },
    markers: { size: 0 },
    plotOptions: {
      pie: {
        donut: {
          size: '68%',
          labels: {
            show: true,
            name: { show: true, fontSize: '10px', offsetY: 22 },
            value: { show: true, fontSize: '20px', fontWeight: 700, offsetY: -10, formatter: value => fmt(value) },
            total: { show: true, showAlways: true, label: unit, fontSize: '11px', color: '#52718a', formatter: () => total }
          }
        }
      }
    }
  });
}

export function line(id, metric = 'power', height = 210) {
  const factor = metric === 'energy' ? 15000 : metric === 'enpi' ? 11 : 1;
  return chart(id, 'area', [
    {
      name: metric === 'power' ? 'Công suất (MW)' : metric === 'energy' ? 'Điện năng (kWh)' : 'EnPI (kWh/tấn)',
      data: state.summary.series.map(value => +(value * factor).toFixed(2))
    },
    {
      name: 'Kỳ trước',
      data: state.summary.series.map((value, index) => +((value + Math.cos(index) * 5) * factor).toFixed(2))
    }
  ], {
    height,
    colors: ['#0789ed', '#b1c5d5'],
    stroke: { width: [2, 1.5], curve: 'smooth', dashArray: [0, 5] }
  });
}

export function days() {
  return Array.from({ length: 10 }, (_, index) => `${String(index + 1).padStart(2, '0')}/06`);
}
