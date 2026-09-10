import { state } from '../core/state.js';
import { render } from '../core/dom.js';
import { stat, stationTable } from '../components/ui.js';
import { factoryMap, singleLineDiagram } from '../components/factory.js';

export async function mount() {
  render('#map-summary', [
    stat('Tổng công suất đặt','78.5','MVA','lightning-charge-fill'),
    stat('Tổng công suất đang vận hành','62.3','MW','gear','green','79.4%','công suất đặt'),
    stat('Tổng điện năng tiêu thụ (ngày)','1,245,600','kWh','lightning-charge','','↓ 2.5%'),
    stat('Hệ số tiêu thụ điện (EnPI)','684','kWh/tấn','leaf','green','↓ 2.5%'),
    stat('Phát thải CO₂ (ước tính)','652','tCO₂','cloud','purple','↓ 3.1%')
  ].join(''));
  render('#map-view', singleLineDiagram());
  render('#station-list', stationTable());
  render('#map-mini', factoryMap({ mini: true }));
}

export async function onInput(target) {
  if (target.id !== 'station-search') return false;
  const query = target.value.toLocaleLowerCase('vi');
  render('#station-list', stationTable(state.stations.filter(item => item.name.toLocaleLowerCase('vi').includes(query))));
  return true;
}

export async function onChange(target) {
  if (target.id !== 'map-mode') return false;
  render('#map-view', target.value === 'sld' ? singleLineDiagram() : factoryMap({ tall: true }));
  return true;
}
