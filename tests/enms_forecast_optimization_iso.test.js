'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { createStore } = require('../public/enms/mock');

const root = path.resolve(__dirname, '..');
const read = relative => fs.readFileSync(path.join(root, relative), 'utf8');

test('M11 forecast exposes planning, scenario and budget contract', () => {
  const data = createStore().request('GET', 'modules/forecast');
  assert.equal(data.id, 'forecast');
  assert.equal(data.kpis.length, 6);
  assert.equal(data.viewTabs.length, 6);
  assert.equal(data.demandTrend.categories.length, 12);
  assert.equal(data.coalTrend.categories.length, 12);
  assert.equal(data.costTrend.categories.length, 12);
  assert.equal(data.energyTypes.length, 6);
  assert.equal(data.scenarios.length, 6);
  assert.equal(data.assumptions.length, 9);
  assert.equal(data.planningSteps.length, 4);
  assert.equal(data.documents.length, 5);
});

test('M11 uses dedicated modular screen and requested toolbar', () => {
  const view = read('views/enms/pages/forecast/index.ejs');
  for (const partial of ['_tabs','_summary','_workspace']) assert.match(view, new RegExp(partial));
  const js = read('public/enms/js/pages/forecast.js');
  assert.doesNotMatch(js, /mountModuleDashboard/);
  for (const token of ['m11-demand-chart','m11-coal-chart','m11-cost-chart','m11-energy-types','m11-scenarios','m11-sec-chart']) assert.match(js,new RegExp(token));
  const bootstrap = read('public/enms/js/bootstrap.js');
  for (const token of ['m11-year','m11-period','m11-create-scenario']) assert.match(bootstrap,new RegExp(token));
});

test('M12 optimization exposes load shifting, what-if, MACC and decision contract', () => {
  const data = createStore().request('GET', 'modules/optimization');
  assert.equal(data.id, 'optimization');
  assert.equal(data.kpis.length, 5);
  assert.equal(data.viewTabs.length, 6);
  assert.equal(data.loadShifting.categories.length, 12);
  assert.equal(data.fuelMix.categories.length, 4);
  assert.equal(data.scenarioCost.totals.length, 3);
  assert.equal(data.scenarios.length, 6);
  assert.equal(data.macc.length, 5);
  assert.equal(data.recommendations.length, 5);
  assert.equal(data.decisionFlow.length, 4);
  assert.equal(data.documents.length, 6);
});

test('M12 uses dedicated screen and simulation toolbar', () => {
  const view = read('views/enms/pages/optimization/_workspace.ejs');
  for (const token of ['m12-load-chart','m12-fuel-chart','m12-cost-chart','m12-scenarios','m12-macc','m12-recommendations']) assert.match(view,new RegExp(token));
  const js = read('public/enms/js/pages/optimization.js');
  assert.doesNotMatch(js, /mountModuleDashboard/);
  assert.match(js,/m12-run-simulation/);
  const bootstrap = read('public/enms/js/bootstrap.js');
  for (const token of ['m12-period','m12-scenario','m12-run-simulation']) assert.match(bootstrap,new RegExp(token));
});

test('M13 ISO 50001 exposes compliance, audit, CAPA and document contract', () => {
  const data = createStore().request('GET', 'modules/iso50001');
  assert.equal(data.id, 'iso50001');
  assert.equal(data.kpis.length, 6);
  assert.equal(data.viewTabs.length, 7);
  assert.equal(data.certificationRoadmap.length, 6);
  assert.equal(data.compliance.length, 7);
  assert.ok(data.compliance.every(x => x.value === 100));
  assert.equal(data.ncrTrend.categories.length, 12);
  assert.equal(data.audits.length, 4);
  assert.equal(data.capa.progress, 90);
  assert.equal(data.opportunities.length, 5);
  assert.equal(data.documentSystem.length, 6);
  assert.equal(data.auditProcess.length, 5);
  assert.equal(data.documents.length, 6);
});

test('M13 uses dedicated ISO screen and assessment toolbar', () => {
  const view = read('views/enms/pages/iso50001/_workspace.ejs');
  for (const token of ['m13-certification-roadmap','m13-compliance','m13-ncr-chart','m13-audits','m13-capa','m13-opportunities','m13-audit-process']) assert.match(view,new RegExp(token));
  const js = read('public/enms/js/pages/iso50001.js');
  assert.doesNotMatch(js,/mountModuleDashboard/);
  const bootstrap = read('public/enms/js/bootstrap.js');
  for (const token of ['m13-year','m13-cycle','m13-create-record']) assert.match(bootstrap,new RegExp(token));
});
