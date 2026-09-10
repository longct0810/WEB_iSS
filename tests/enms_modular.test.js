'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const pages = ['overview','realtime','map','seu','reports','alerts','data'];

function exists(relative) {
  return fs.existsSync(path.join(root, relative));
}

function read(relative) {
  return fs.readFileSync(path.join(root, relative), 'utf8');
}

test('EnMS 1.0.1 tách shell EJS thành partial dùng chung', () => {
  for (const name of ['head','sidebar','topbar','page-header','statusbar','dialogs','scripts']) {
    assert.ok(exists(`views/enms/partials/${name}.ejs`), name);
  }
  const index = read('views/enms/index.ejs');
  assert.match(index, /include\('partials\/sidebar'\)/);
  assert.match(index, /include\(viewPage\)/);
});

test('bảy màn hình nghiệp vụ có module view và JavaScript riêng', () => {
  for (const page of pages) {
    assert.ok(exists(`views/enms/pages/${page}/index.ejs`), `view ${page}`);
    assert.ok(exists(`public/enms/js/pages/${page}.js`), `js ${page}`);
    assert.ok(exists(`public/enms/css/pages/${page}.css`), `css ${page}`);
  }
});

test('core và component dùng chung đã được tách khỏi app.js nguyên khối', () => {
  for (const file of [
    'public/enms/js/core/api.js',
    'public/enms/js/core/realtime.js',
    'public/enms/js/core/charts.js',
    'public/enms/js/core/state.js',
    'public/enms/js/components/ui.js',
    'public/enms/js/components/factory.js',
    'public/enms/js/bootstrap.js'
  ]) assert.ok(exists(file), file);
  assert.equal(exists('public/enms/app.js'), false);
  assert.equal(exists('public/enms/api.js'), false);
  assert.equal(exists('public/enms/realtime.js'), false);
});

test('route truyền đúng page module cho EJS và package đã lên 1.0.1', () => {
  const route = read('routes/enms.js');
  assert.match(route, /viewPage:`pages\/\$\{page\}\/index`/);
  const pkg = JSON.parse(read('package.json'));
  assert.equal(pkg.version, '1.0.1');
});

test('login JWT và HES ticket trust boundary vẫn được giữ', () => {
  assert.match(read('controllers/enms.js'), /verifyLoginToken/);
  assert.match(read('public/enms/js/core/api.js'), /hes_login_token/);
  const realtime = read('public/enms/js/core/realtime.js');
  assert.match(realtime, /\/api\/hes\/ws-ticket/);
  assert.match(realtime, /hes104-v1/);
  assert.match(realtime, /SUBSCRIBE/);
});
