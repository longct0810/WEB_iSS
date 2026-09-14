'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const modulePages = ['overview','realtime','balance','seu','targets','alerts','savings','emissions','reports','data','forecast','optimization','iso50001','analytics','digital-twin','ai-decision','autonomous'];
const utilityPages = ['map','settings'];

function exists(relative) { return fs.existsSync(path.join(root, relative)); }
function read(relative) { return fs.readFileSync(path.join(root, relative), 'utf8'); }

test('EnMS 1.1.0 giữ shell EJS thành partial dùng chung', () => {
  for (const name of ['head','sidebar','topbar','page-header','statusbar','dialogs','scripts','module-dashboard']) {
    assert.ok(exists(`views/enms/partials/${name}.ejs`), name);
  }
  const index = read('views/enms/index.ejs');
  assert.match(index, /include\('partials\/sidebar'\)/);
  assert.match(index, /include\(viewPage\)/);
});

test('17 module EnMS Advanced và utility pages có view/js/css phù hợp', () => {
  for (const page of [...modulePages,...utilityPages]) {
    assert.ok(exists(`views/enms/pages/${page}/index.ejs`), `view ${page}`);
    assert.ok(exists(`public/enms/js/pages/${page}.js`), `js ${page}`);
    assert.ok(exists(`public/enms/css/pages/${page}.css`), `css ${page}`);
  }
});

test('advanced module renderer dùng component dùng chung thay vì nhân bản code', () => {
  assert.ok(exists('public/enms/js/components/module-page.js'));
  assert.ok(exists('public/enms/css/module-dashboard.css'));
  for (const page of ['balance','targets','savings','emissions','forecast','optimization','iso50001','analytics','digital-twin','ai-decision','autonomous']) {
    assert.match(read(`public/enms/js/pages/${page}.js`), /mountModuleDashboard/);
    assert.match(read(`views/enms/pages/${page}/index.ejs`), /module-dashboard/);
  }
});

test('core và component dùng chung đã được tách khỏi app.js nguyên khối', () => {
  for (const file of [
    'public/enms/js/core/api.js','public/enms/js/core/realtime.js','public/enms/js/core/charts.js','public/enms/js/core/state.js',
    'public/enms/js/components/ui.js','public/enms/js/components/factory.js','public/enms/js/components/module-page.js','public/enms/js/bootstrap.js'
  ]) assert.ok(exists(file), file);
  assert.equal(exists('public/enms/app.js'), false);
  assert.equal(exists('public/enms/api.js'), false);
  assert.equal(exists('public/enms/realtime.js'), false);
});

test('route truyền đúng page module và package đã lên 1.1.0', () => {
  const route = read('routes/enms.js');
  assert.match(route, /viewPage: `pages\/\$\{page\}\/index`/);
  assert.match(route, /modules\/:id/);
  const pkg = JSON.parse(read('package.json'));
  assert.equal(pkg.version, '1.1.0');
});

test('login JWT và HES ticket trust boundary vẫn được giữ', () => {
  assert.match(read('controllers/enms.js'), /verifyLoginToken/);
  assert.match(read('public/enms/js/core/api.js'), /hes_login_token/);
  const realtime = read('public/enms/js/core/realtime.js');
  assert.match(realtime, /\/api\/hes\/ws-ticket/);
  assert.match(realtime, /hes104-v1/);
  assert.match(realtime, /SUBSCRIBE/);
});
