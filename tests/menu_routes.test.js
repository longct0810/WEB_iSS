const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ejs = require('ejs');

const projectRoot = path.resolve(__dirname, '..');

function read(relativePath) {
  return fs.readFileSync(path.join(projectRoot, relativePath), 'utf8');
}

function withoutHtmlComments(source) {
  return source.replace(/<!--[\s\S]*?-->/g, '');
}

test('mọi chức năng đang hiển thị trên menu đều có route và template', () => {
  const menuSources = [
    withoutHtmlComments(read('views/header.ejs')),
    withoutHtmlComments(read('views/menu_form/sidebar.ejs'))
  ];
  const hrefs = new Set();

  for (const source of menuSources) {
    for (const match of source.matchAll(/href="(\/[^"]*)"/g)) {
      hrefs.add(match[1]);
    }
  }

  const routerSource = read('services/router_View.js');
  const routes = new Map();
  const routePattern = /router\.get\('(\/[^']*)',([\s\S]*?)(?=\nrouter\.get|\nmodule\.exports)/g;
  for (const match of routerSource.matchAll(routePattern)) {
    const template = match[2].match(/res\.render\('([^']+)'/);
    const enmsRedirect = match[2].includes("res.redirect('/enms/overview')");
    if (template || enmsRedirect) routes.set(match[1], template ? template[1] : 'enms/index');
  }

  assert.ok(hrefs.size >= 30, 'Số chức năng menu được phát hiện thấp bất thường');

  for (const href of hrefs) {
    assert.ok(routes.has(href), `Menu ${href} chưa có route`);
    const templatePath = path.join(projectRoot, 'views', `${routes.get(href)}.ejs`);
    assert.ok(fs.existsSync(templatePath), `Route ${href} trỏ tới template không tồn tại: ${templatePath}`);
  }
});

test('không khai báo trùng route GET của các màn hình', () => {
  const routerSource = read('services/router_View.js');
  const routeNames = [...routerSource.matchAll(/router\.get\('(\/[^']*)'/g)].map((match) => match[1]);
  const duplicates = routeNames.filter((route, index) => routeNames.indexOf(route) !== index);

  assert.deepEqual([...new Set(duplicates)], []);
});

test('Dashboard không nạp lớp CSS dành cho màn hình nghiệp vụ', () => {
  const dashboard = read('views/Dashboard/dashboard.ejs');

  assert.doesNotMatch(dashboard, /business-ui(?:\.css|")/);
  assert.doesNotMatch(dashboard, /<body[^>]*class="[^"]*business-ui/);
});

test('sidebar đánh dấu active theo route từ server', async () => {
  const sidebarPath = path.join(projectRoot, 'views/menu_form/sidebar.ejs');
  const html = await ejs.renderFile(sidebarPath, {
    currentPath: '/thongkesolieu',
    title: 'Thống kê số liệu'
  });

  assert.match(
    html,
    /href="\/thongkesolieu"[\s\S]*?class="pmsion-menu active"[\s\S]*?aria-current="page"/
  );
  assert.doesNotMatch(html, /href="\/thongsovanhanhscada"[^>]*\bactive\b/);
});
