import { base } from '../core/config.js';
import { state } from '../core/state.js';
import { $, render } from '../core/dom.js';
import { donut, line, replaceChart } from '../core/charts.js';
import { badge, distribution, energyStats, recentAlerts, row, stationTable, table, tabs, icon } from '../components/ui.js';
import { factoryMap } from '../components/factory.js';

export async function mount() {
  render('#overview-summary', energyStats());
  render('#overview-factory', factoryMap());
  render('#station-list', stationTable());
  render('#overview-load-tabs', tabs(['Công suất (MW)', 'Điện năng (kWh)'], 'load'));
  render('#overview-distribution', distribution());
  render('#overview-goal', `<div class="goal">${icon('bullseye')} Giảm tiêu thụ điện năng<b>3% <small>trên sản lượng clinker</small></b><div class="progress"><span style="width:62%"></span></div><p>Tiến độ thực hiện <strong class="green-text">62%</strong></p></div><div class="mini-stats" style="margin-top:14px"><div class="mini-stat">EnPI hiện tại<b>684 <small>kWh/tấn</small></b></div><div class="mini-stat">Mục tiêu<b>700</b></div><div class="mini-stat">Tiết kiệm<b class="green-text">2.5%</b></div></div>`);
  render('#overview-meters', table(
    ['Mã điểm đo', 'Tên thiết bị', 'Trạm điện', 'P (MW)', 'Cosφ', 'Trạng thái'],
    state.meters.slice(0, 6).map(meter => row([
      `<a href="#" data-action="meter" data-id="${meter.id}">${meter.id}</a>`,
      meter.name,
      meter.station,
      meter.power,
      meter.pf,
      badge(meter.status)
    ]))
  ));
  render('#overview-alerts', recentAlerts(base));
  line('load-chart');
  donut('distribution', [22,18,16,12,11,7,6,8], '8,524,630');
}

export async function onTab(group, value) {
  if (group !== 'load') return false;
  state.loadMetric = value.startsWith('Công') ? 'power' : 'energy';
  replaceChart('load-chart');
  line('load-chart', state.loadMetric);
  return true;
}

export async function onInput(target) {
  if (target.id !== 'station-search') return false;
  const query = target.value.toLocaleLowerCase('vi');
  render('#station-list', stationTable(state.stations.filter(item => item.name.toLocaleLowerCase('vi').includes(query))));
  return true;
}
