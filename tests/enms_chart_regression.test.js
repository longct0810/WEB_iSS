'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');

test('shared module chart renderer never passes plotOptions as undefined', () => {
  const source = fs.readFileSync(path.join(root, 'public/enms/js/components/module-page.js'), 'utf8');
  assert.doesNotMatch(source, /plotOptions\s*:\s*[^\n]*\?[^\n]*:\s*undefined/);
  assert.match(source, /if \(panel\.kind === 'bar'\)/);
});

test('chart helper strips undefined top-level options before ApexCharts config merge', () => {
  const source = fs.readFileSync(path.join(root, 'public/enms/js/core/charts.js'), 'utf8');
  assert.match(source, /Object\.entries\(options \|\| \{\}\)/);
  assert.match(source, /value !== undefined/);
  assert.match(source, /\.\.\.safeOptions/);
});

test('chart helper deep-merges chart overrides so stacked charts keep base type/height', () => {
  const helper = require('node:fs').readFileSync(require('node:path').resolve(__dirname, '../public/enms/js/core/charts.js'), 'utf8');
  assert.match(helper, /const chartOverrides = safeOptions\.chart \|\| \{\}/);
  assert.match(helper, /\.\.\.chartOverrides/);
  assert.match(helper, /delete safeOptions\.chart/);
});
