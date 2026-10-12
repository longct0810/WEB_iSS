'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const fs = require('node:fs');
const ejs = require('ejs');
const diagramData = require('../config/nhietdien-preview-data');
const partial = path.join(__dirname,'../views/nhietdien/partials/diagram.ejs');

for (const type of Object.keys(diagramData)) {
  test(`${type}: schematic renders labels and values as native SVG text`, async () => {
    const svg = await ejs.renderFile(partial,{type,label:`Sơ đồ ${type}`,diagramData});
    assert.match(svg,new RegExp(`data-diagram="${type}"`));
    assert.match(svg,/<text\b/);
    const bindings = [...svg.matchAll(/data-value="([^"]+)"/g)].map(match=>match[1]);
    assert.ok(bindings.length >= 4, 'diagram must expose real measurement fields');
    for (const key of bindings) {
      assert.ok(Object.hasOwn(diagramData[type],key), `missing initial value: ${key}`);
    }
    const images = [...svg.matchAll(/<image[^>]+href="([^"]+)"/g)].map(match=>match[1]);
    assert.ok(images.every(src=>src.startsWith('/nhietdien/assets/equipment/')),
      'only text-free equipment artwork belongs inside the schematic');
  });
}

test('server data changes render in bound measurement text with fixed units', async () => {
  const data = structuredClone(diagramData);
  data.realtime.totalPowerMw = 999;
  data.realtime.unit3State = 'running';
  const svg = await ejs.renderFile(partial,{type:'realtime',label:'Realtime',diagramData:data});
  assert.match(svg,/data-value="totalPowerMw"[^>]*>999<\/tspan><tspan> MW<\/tspan>/);
  assert.match(svg,/data-state="unit3State" class="diagram-status running"/);
});

test('diagram labels escape markup', async () => {
  const svg = await ejs.renderFile(partial,{type:'overview',label:'<script>unsafe</script>',diagramData});
  assert.ok(!svg.includes('<script>'));
  assert.match(svg,/&lt;script&gt;unsafe&lt;\/script&gt;/);
});

test('views do not reference the retired full-diagram bitmap assets', () => {
  const index = fs.readFileSync(path.join(__dirname,'../views/nhietdien/index.ejs'),'utf8');
  const ai = fs.readFileSync(path.join(__dirname,'../views/nhietdien/partials/ai-predictive.ejs'),'utf8');
  assert.doesNotMatch(index+ai,/assets\/(?:[a-z]+-schematic|digital-twin)\.webp/);
});
