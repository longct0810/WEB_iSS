'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { createStore } = require('../public/enms/mock');

const root = path.resolve(__dirname, '..');
const read = relative => fs.readFileSync(path.join(root, relative), 'utf8');

test('M4 SEU & EnPI exposes detailed dashboard contract', () => {
  const seu = createStore().request('GET', 'modules/seu');
  assert.equal(seu.id, 'seu');
  assert.equal(seu.kpis.length, 5);
  assert.equal(seu.structure.total, 12);
  assert.equal(seu.structure.groups.length, 6);
  assert.equal(seu.enpi.metrics.length, 3);
  assert.equal(seu.enpi.rows.length, 10);
  assert.equal(seu.trend.categories.length, 6);
  assert.equal(seu.trend.actual.at(-1), 139.1);
  assert.equal(seu.comparison.overall.actual.at(-1), 684);
  assert.equal(seu.potential.length, 5);
  assert.equal(seu.performance.length, 5);
  assert.ok(seu.enpi.rows.filter(item => item.enpi > item.baseline).length >= 2);
});

test('M4 is a dedicated modular view matching the SEU/EnPI reference screen', () => {
  const view = read('views/enms/pages/seu/index.ejs');
  for (const partial of ['_tabs','_summary','_workspace','_bottom']) assert.match(view, new RegExp(partial));
  const js = read('public/enms/js/pages/seu.js');
  assert.doesNotMatch(js, /mountModuleDashboard/);
  assert.match(js, /m4-seu-tree/);
  assert.match(js, /m4-enpi-table/);
  assert.match(js, /m4-trend-chart/);
  assert.match(js, /m4-compare-chart/);
  assert.match(js, /m4-export-enpi/);
  const css = read('public/enms/css/pages/seu.css');
  assert.match(css, /\.m4-workspace/);
  assert.match(css, /\.m4-enpi-table/);
  assert.match(css, /\.m4-bottom-grid/);
});

test('M4 toolbar contains plant, period, SEU filter and export action', () => {
  const bootstrap = read('public/enms/js/bootstrap.js');
  assert.match(bootstrap, /m4-period/);
  assert.match(bootstrap, /m4-unit-filter/);
  assert.match(bootstrap, /page === 'seu'/);
  assert.match(bootstrap, /Xuất báo cáo/);
});
