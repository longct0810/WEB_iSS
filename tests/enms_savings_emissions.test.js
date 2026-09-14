'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { createStore } = require('../public/enms/mock');

const root = path.resolve(__dirname, '..');
const read = relative => fs.readFileSync(path.join(root, relative), 'utf8');

test('M7 Tiết kiệm năng lượng & M&V exposes project, IPMVP and M&V contract', () => {
  const data = createStore().request('GET', 'modules/savings');
  assert.equal(data.id, 'savings');
  assert.equal(data.kpis.length, 5);
  assert.equal(data.viewTabs.length, 5);
  assert.equal(data.projects.length, 8);
  assert.equal(data.progressSummary.total, 8);
  assert.equal(data.progressSummary.items.reduce((sum,item)=>sum+item.value,0), 8);
  assert.equal(data.ipmvpSteps.length, 4);
  assert.equal(data.mvResults.length, 4);
  assert.equal(data.contribution.length, 5);
  assert.equal(data.recommendations.length, 5);
  assert.equal(data.yearlyImpact.energy.at(-1), 3760);
});

test('M7 uses a dedicated modular screen instead of generic module dashboard', () => {
  const view = read('views/enms/pages/savings/index.ejs');
  for (const partial of ['_tabs','_summary','_workspace']) assert.match(view, new RegExp(partial));
  const js = read('public/enms/js/pages/savings.js');
  assert.doesNotMatch(js, /mountModuleDashboard/);
  for (const token of ['m7-projects-table','m7-progress-chart','m7-yearly-impact','m7-contribution-chart','m7-create-solution']) assert.match(js, new RegExp(token));
  const css = read('public/enms/css/pages/savings.css');
  assert.match(css, /\.m7-dashboard/);
  assert.match(css, /\.m7-ipmvp/);
  assert.match(css, /\.m7-bottom-grid/);
});

test('M8 Phát thải CO2 & ESG exposes emissions, ESG and compliance contract', () => {
  const data = createStore().request('GET', 'modules/emissions');
  assert.equal(data.id, 'emissions');
  assert.equal(data.kpis.length, 5);
  assert.equal(data.viewTabs.length, 7);
  assert.equal(data.trend.categories.length, 6);
  assert.equal(data.breakdown.length, 5);
  assert.equal(Number(data.breakdown.reduce((sum,item)=>sum+item.value,0).toFixed(1)), 100);
  assert.equal(data.benchmark.values.length, 4);
  assert.equal(data.details.length, 5);
  assert.equal(data.esgMetrics.length, 6);
  assert.equal(data.initiatives.length, 5);
  assert.equal(data.compliance.length, 5);
  assert.equal(data.documents.length, 5);
});

test('M8 is dedicated and toolbar exposes year, period and ESG export', () => {
  const view = read('views/enms/pages/emissions/_workspace.ejs');
  for (const token of ['m8-emission-trend','m8-source-breakdown','m8-benchmark','m8-target-progress','m8-esg-metrics','m8-initiatives']) assert.match(view, new RegExp(token));
  const js = read('public/enms/js/pages/emissions.js');
  assert.doesNotMatch(js, /mountModuleDashboard/);
  assert.match(js, /m8-export-esg/);
  const css = read('public/enms/css/pages/emissions.css');
  assert.match(css, /\.m8-top-grid/);
  assert.match(css, /\.m8-middle-grid/);
  assert.match(css, /\.m8-bottom-grid/);
  const bootstrap = read('public/enms/js/bootstrap.js');
  for (const token of ['m7-year','m7-status','m7-create-solution','m8-year','m8-period','m8-export-esg']) assert.match(bootstrap, new RegExp(token));
});
