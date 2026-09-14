'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { createStore } = require('../public/enms/mock');

const root = path.resolve(__dirname, '..');
const read = relative => fs.readFileSync(path.join(root, relative), 'utf8');

test('M5 Mục tiêu & Hành động exposes detailed ISO 50001 planning contract', () => {
  const data = createStore().request('GET', 'modules/targets');
  assert.equal(data.id, 'targets');
  assert.equal(data.kpis.length, 5);
  assert.equal(data.viewTabs.length, 6);
  assert.equal(data.goals.length, 8);
  assert.equal(data.progress.total, 8);
  assert.equal(data.progress.items.reduce((sum,item)=>sum+item.value,0), 8);
  assert.equal(data.actions.length, 5);
  assert.equal(data.trend.metrics.length, 3);
  assert.equal(data.documents.length, 5);
  assert.ok(data.goals.some(item => item.statusKey === 'critical'));
});

test('M5 is a dedicated modular screen matching the target/action reference', () => {
  const view = read('views/enms/pages/targets/index.ejs');
  for (const partial of ['_tabs','_summary','_workspace']) assert.match(view, new RegExp(partial));
  const js = read('public/enms/js/pages/targets.js');
  assert.doesNotMatch(js, /mountModuleDashboard/);
  for (const token of ['m5-goals-table','m5-progress-chart','m5-target-trend','m5-export-goals','m5-create-target']) assert.match(js, new RegExp(token));
  const css = read('public/enms/css/pages/targets.css');
  assert.match(css, /\.m5-layout/);
  assert.match(css, /\.m5-goals-table/);
  assert.match(css, /\.m5-saving-grid/);
});

test('M6 Phân tích & Cảnh báo exposes RCA, trend, benchmark and AI contract', () => {
  const data = createStore().request('GET', 'modules/alerts');
  assert.equal(data.id, 'alerts');
  assert.equal(data.kpis.length, 5);
  assert.equal(data.viewTabs.length, 6);
  assert.equal(data.areaAlerts.length, 7);
  assert.equal(data.latestAlerts.length, 8);
  assert.equal(data.rca.cases.length, 2);
  assert.equal(data.trend.metrics.length, 2);
  assert.equal(data.benchmark.values.length, 4);
  assert.equal(data.correlations.length, 5);
  assert.equal(data.aiRecommendations.length, 3);
  assert.ok(data.latestAlerts.filter(item => item.severityKey === 'critical').length >= 3);
});

test('M6 is a dedicated visual analysis module and toolbar follows reference screen', () => {
  const view = read('views/enms/pages/alerts/_workspace.ejs');
  for (const token of ['m6-alert-map','m6-rca-table','m6-trend-chart','m6-benchmark-chart','m6-correlation','m6-ai-recommendations']) assert.match(view, new RegExp(token));
  const js = read('public/enms/js/pages/alerts.js');
  assert.doesNotMatch(js, /mountModuleDashboard/);
  assert.match(js, /m6-area-filter/);
  assert.match(js, /m6-create-action/);
  const css = read('public/enms/css/pages/alerts.css');
  assert.match(css, /\.m6-alert-map/);
  assert.match(css, /\.m6-middle-grid/);
  assert.match(css, /\.m6-bottom-grid/);
  const bootstrap = read('public/enms/js/bootstrap.js');
  assert.match(bootstrap, /m5-year/);
  assert.match(bootstrap, /m5-status/);
  assert.match(bootstrap, /m5-create-target/);
  assert.match(bootstrap, /m6-period/);
  assert.match(bootstrap, /m6-scope/);
  assert.match(bootstrap, /m6-export-report/);
});
