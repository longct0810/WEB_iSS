'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { createStore } = require('../public/enms/mock');

const root = path.resolve(__dirname, '..');
const read = relative => fs.readFileSync(path.join(root, relative), 'utf8');

test('M9 Báo cáo & Dashboard quản trị exposes full reporting contract', () => {
  const data = createStore().request('GET', 'modules/reports');
  assert.equal(data.id, 'reports');
  assert.equal(data.kpis.length, 6);
  assert.equal(data.viewTabs.length, 6);
  assert.equal(data.periodicReports.length, 7);
  assert.equal(Object.keys(data.trend.metrics).length, 3);
  assert.equal(data.categories.reduce((n,x)=>n+x.value,0), 28);
  assert.equal(data.reportTemplates.length, 4);
  assert.equal(data.esgReports.length, 5);
  assert.equal(data.history.length, 4);
  assert.equal(data.notifications.length, 4);
  assert.equal(data.sharing.length, 5);
});

test('M9 has dedicated view/js/css and management toolbar', () => {
  const view = read('views/enms/pages/reports/index.ejs');
  for (const partial of ['_tabs','_summary','_workspace']) assert.match(view, new RegExp(partial));
  const js = read('public/enms/js/pages/reports.js');
  for (const token of ['m9-periodic-reports','m9-trend-chart','m9-report-categories','m9-templates','m9-esg-reports','m9-export-custom']) assert.match(js,new RegExp(token));
  const css = read('public/enms/css/pages/reports.css');
  for (const token of ['.m9-top-grid','.m9-middle-grid','.m9-bottom-grid','.m9-template-grid']) assert.match(css,new RegExp(token.replace('.','\\.')));
  const bootstrap = read('public/enms/js/bootstrap.js');
  for (const token of ['m9-period','m9-compare','m9-create-report']) assert.match(bootstrap,new RegExp(token));
});

test('M10 Quản lý dữ liệu & Hệ thống exposes architecture, quality, integration and roadmap contract', () => {
  const data = createStore().request('GET', 'modules/data');
  assert.equal(data.id, 'data');
  assert.equal(data.kpis.length, 6);
  assert.equal(data.viewTabs.length, 7);
  assert.equal(data.architecture.length, 4);
  assert.equal(data.dataFlow.length, 6);
  assert.equal(Number(data.dataQuality.reduce((n,x)=>n+x.value,0).toFixed(1)),100);
  assert.equal(data.storageGrowth.values.length,4);
  assert.equal(data.integrations.length,7);
  assert.equal(data.security.length,7);
  assert.equal(data.operations.length,7);
  assert.equal(data.roadmap.length,6);
  assert.equal(data.documents.length,5);
});

test('M10 has dedicated IT/OT screen and system toolbar', () => {
  const view = read('views/enms/pages/data/_workspace.ejs');
  for (const token of ['m10-architecture','m10-data-flow','m10-integrations','m10-data-quality','m10-storage-growth','m10-security','m10-roadmap']) assert.match(view,new RegExp(token));
  const js = read('public/enms/js/pages/data.js');
  assert.doesNotMatch(js,/meterTree|readings-table/);
  for (const token of ['m10-system-report','m10-download-doc','m10-integration']) assert.match(js,new RegExp(token));
  const css = read('public/enms/css/pages/data.css');
  for (const token of ['.m10-architecture','.m10-flow','.m10-roadmap']) assert.match(css,new RegExp(token.replace('.','\\.')));
  const bootstrap = read('public/enms/js/bootstrap.js');
  for (const token of ['m10-year','m10-system-status','m10-system-report']) assert.match(bootstrap,new RegExp(token));
});
