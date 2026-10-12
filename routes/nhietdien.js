'use strict';

const express = require('express');

const pages = express.Router();

function render(req, res) {
  const page = req.params.page || 'overview';
  if (page !== 'overview') {
    return res.status(404).send('Không tìm thấy trang Nhiệt điện');
  }

  res.render('nhietdien/index', {
    title: 'Tổng quan Nhiệt điện',
    preview: req.path.startsWith('/preview')
  });
}

pages.get('/preview/:page?', render);
pages.get('/:page?', render);

module.exports = { pages };
