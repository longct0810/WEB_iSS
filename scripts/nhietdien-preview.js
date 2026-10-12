'use strict';

// Standalone Nhiet Dien preview: no database connection, authentication or HES socket.
const express = require('express');
const path = require('path');

const app = express();
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'ejs');

// Reuse the repository's public assets while keeping Nhiet Dien assets isolated.
app.use('/nhietdien/assets', express.static(path.join(__dirname, '../public/nhietdien/assets')));
app.use(express.static(path.join(__dirname, '../public')));

app.get('/', (req, res) => res.redirect('/nhietdien/preview/overview'));
app.use('/nhietdien', require('../routes/nhietdien').pages);

const port = Number(process.env.PORT) || 6582;
app.listen(port, '0.0.0.0', () => {
  console.log(`Nhiet Dien preview listening on 0.0.0.0:${port}`);
});
