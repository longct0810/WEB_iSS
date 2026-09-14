'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { createStore } = require('../public/enms/mock');

const root = path.resolve(__dirname, '..');
const read = relative => fs.readFileSync(path.join(root, relative), 'utf8');

test('M3 Energy Balance exposes detailed visual contract', () => {
  const balance = createStore().request('GET', 'modules/balance');
  assert.equal(balance.id, 'balance');
  assert.equal(balance.kpis.length, 6);
  assert.equal(balance.energyBalance.inputs.length, 5);
  assert.equal(balance.energyBalance.processes.length, 5);
  assert.equal(balance.energyBalance.usefulOutputs.length, 2);
  assert.equal(balance.energyBalance.losses.length, 3);
  assert.equal(balance.energyMap.length, 5);
  assert.equal(balance.efficiency.length, 4);
  assert.equal(balance.balanceTable.process.length, 5);
  assert.equal(balance.distribution.process.values.length, 5);
  assert.equal(balance.trend.categories.length, 6);
  assert.equal(balance.energyBalance.inputTotal, 1245600);
  assert.equal(balance.energyBalance.usefulTotal + balance.energyBalance.lossTotal, balance.energyBalance.inputTotal);
  assert.equal(balance.balanceTable.process.reduce((sum, item) => sum + item.total, 0), balance.energyBalance.inputTotal);
});

test('M3 is a dedicated page module with Sankey, energy map and interactions', () => {
  const view = read('views/enms/pages/balance/index.ejs');
  for (const partial of ['_tabs', '_summary', '_main', '_bottom']) assert.match(view, new RegExp(partial));
  const js = read('public/enms/js/pages/balance.js');
  assert.doesNotMatch(js, /mountModuleDashboard/);
  assert.match(js, /m3-sankey-stage/);
  assert.match(js, /m3-map-mode/);
  assert.match(js, /m3-export-excel/);
  assert.match(js, /m3-unit/);
  assert.match(js, /m3-dist/);
  const css = read('public/enms/css/pages/balance.css');
  assert.match(css, /\.m3-sankey-stage/);
  assert.match(css, /\.m3-energy-map/);
});
