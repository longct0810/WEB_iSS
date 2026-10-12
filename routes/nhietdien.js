'use strict';

const express = require('express');
const pages = express.Router();

const pageTitles = {
  overview: 'Tổng quan',
  realtime: 'Giám sát thời gian thực',
  performance: 'Hiệu suất, EnPI và EnB tổ máy',
  seu: 'Điện tự dùng và SEU',
  boiler: 'Lò hơi, Turbine và hệ thống hơi',
  fuel: 'Nhiên liệu và hệ thống than',
  reports: 'Báo cáo',
  ai: 'Phân tích nâng cao (AI)'
};

function render(req, res) {
  const page = req.params.page || 'overview';
  const title = pageTitles[page];
  if (!title) return res.status(404).send('Không tìm thấy trang Nhiệt điện');

  res.render('nhietdien/index', {
    page,
    title,
    preview: req.path.startsWith('/preview')
  });
}

pages.get('/preview/:page?', render);
pages.get('/:page?', render);

module.exports = { pages };
