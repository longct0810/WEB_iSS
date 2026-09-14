'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { createStore } = require('../public/enms/mock');

const root = path.resolve(__dirname, '..');
const read = relative => fs.readFileSync(path.join(root, relative), 'utf8');

test('M2 realtime contract bám bố cục màn hình chuẩn', () => {
  const realtime = createStore().request('GET', 'modules/realtime');
  assert.equal(realtime.kpis.length, 6);
  assert.deepEqual(realtime.systemStatus, { normal: 69, warning: 5, fault: 2 });
  assert.equal(realtime.flow.sources.length, 5);
  assert.equal(realtime.flow.processes.length, 4);
  assert.equal(realtime.flow.utilities.length, 6);
  assert.equal(realtime.realtimeTrend.series.length, 4);
  assert.equal(realtime.shiftProduction.today.series.length, 3);
  assert.equal(realtime.stations.length, 16);
  assert.equal(realtime.realtimeAlerts.length, 5);
});

test('M2 giữ websocket authenticated và các module view riêng', () => {
  const realtime = read('public/enms/js/pages/realtime.js');
  assert.match(realtime, /connectRealtime/);
  assert.match(realtime, /modules\/realtime/);
  assert.match(realtime, /m2-fullscreen/);
  assert.match(realtime, /m2-system/);
  const view = read('views/enms/pages/realtime/index.ejs');
  for (const partial of ['_summary', '_controls', '_monitor', '_bottom']) {
    assert.match(view, new RegExp(partial));
  }
});
