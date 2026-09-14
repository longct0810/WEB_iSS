'use strict';
const express = require('express');
const controller = require('../controllers/enms');
const menu = require('../config/enms-menu');

const api = express.Router();
api.use(controller.authenticate);
for (const resource of ['summary','stations','meters','readings','seu','alerts','reports','modules']) {
  api.get('/' + resource, controller.handle);
}
api.get('/modules/:id', controller.handle);
api.get('/alerts/:id', controller.handle);
api.patch('/alerts/:id', controller.handle);
api.get('/reports/:id', controller.handle);
api.post('/reports', controller.handle);

const pages = express.Router();
pages.get('/vendor/xlsx.js', (req,res) => res.sendFile(require.resolve('xlsx/dist/xlsx.full.min.js')));

// Giữ hai trang tiện ích của v1.0.x để không làm hỏng link cũ.
const utilities = Object.freeze([
  { id: 'map', code: 'UTIL', label: 'Bản đồ & Sơ đồ trạm', title: 'Bản đồ & Sơ đồ trạm', icon: 'map' },
  { id: 'settings', code: 'UTIL', label: 'Cài đặt hệ thống', title: 'Cài đặt hệ thống', icon: 'gear' }
]);
const allPages = [...menu, ...utilities];

function render(req,res) {
  const page = req.params.page || 'overview';
  const current = allPages.find(item => item.id === page);
  if (!current) return res.status(404).send('Không tìm thấy trang EnMS');
  res.render('enms/index', {
    page,
    menu,
    preview: req.path.startsWith('/preview'),
    title: current.title,
    moduleCode: current.code,
    viewPage: `pages/${page}/index`
  });
}

pages.get('/preview/:page?', render);
pages.get('/:page?', render);

module.exports = { api, pages, menu, utilities };
