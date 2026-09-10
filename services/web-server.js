const http = require('http');
const express = require('express');
const morgan = require('morgan');
const webServerConfig = require('../config/web-server.js');
const router = require('./router.js');
const routes = require('./router_View.js');
const reportRoutes = require('./report.routes'); 

const cors = require('cors');
var path = require('path');
var favicon = require('serve-favicon');
var cookieParser = require('cookie-parser');
const socketIO = require('socket.io');

//const { initOracleRealtime, getLatestDashboardData, emitLatestDashboard } = require("./oracle-realtime");


let httpServer;
let io;
function initialize() {
  return new Promise((resolve, reject) => {
    const app = express();
    const allowedOrigins = String(process.env.CORS_ORIGINS || '')
      .split(',')
      .map(origin => origin.trim())
      .filter(Boolean);
    const corsOrigin = (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }
      callback(new Error('Nguồn truy cập không được phép bởi CORS'));
    };

    httpServer = http.createServer(app);
    io = socketIO(httpServer, {
      cors: {
        origin: corsOrigin
      }
    });

//     //chỗ này truyền io vào oracle-realtime.js, để module Oracle có thể emit dữ liệu ra browser.
//     initOracleRealtime(io).catch(err => {
//       console.error("Oracle realtime init error:", err);
//     });
// //cứ 2 giây backend đọc Oracle một lần, nếu có dữ liệu mới thì gửi ra dashboard.
//     setInterval(async () => {
//       try {
//         await emitLatestDashboard("polling-fallback");
//       } catch (err) {
//         console.error("[POLLING] dashboard error:", err.message);
//       }
//     }, 1000);
// //socket.io client handlers Hàm này chạy mỗi khi browser mở dashboard và kết nối Socket.IO.
//     io.on("connection", async socket => {
//       console.log("socket.idsocket.id Client connected:", socket.id);

//       try {
//         const data = await getLatestDashboardData();
//         socket.emit("dashboard-realtime", data);
//       } catch (err) {
//         console.error("Load initial dashboard data error:", err);
//       }
//     });
// //các hàm debug để test API từ browser (Route debug này dùng để kiểm tra backend đọc Oracle có đúng không.)
//     app.get("/debug/dashboard/latest", async function (req, res) {
//       try {
//         const data = await getLatestDashboardData();
//         console.log("[DEBUG] /debug/dashboard/latest", data);
//         res.json(data);
//       } catch (err) {
//         console.error("[DEBUG] latest error:", err);
//         res.status(500).json({ error: err.message });
//       }
//     });
// //cái này dùng để test việc emit dữ liệu realtime ra dashboard có hoạt động không, bằng cách gọi API này từ browser.
//     app.get("/debug/dashboard/emit", async function (req, res) {
//       try {
//         await emitLatestDashboard("manual-debug-api");
//         res.json({
//           ok: true,
//           clients: io.engine.clientsCount
//         });
//       } catch (err) {
//         console.error("[DEBUG] emit error:", err);
//         res.status(500).json({ error: err.message });
//       }
//     });



    // view engine setup
    app.set('views', path.join(__dirname, '../views'));
    app.set('view engine', 'ejs');
    app.use(express.json({
      limit: '2mb',
      reviver: reviveJson
    }));
    app.use(express.urlencoded({
      extended: false,
      limit: '1mb'
    }));
    app.use(cookieParser());
    app.use((req, res, next) => {
      res.set({
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'SAMEORIGIN',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
        'Permissions-Policy': 'camera=(), microphone=(), geolocation=()'
      });
      next();
    });
    app.get('/runtime-config.js', (req, res) => {
      res
        .type('application/javascript')
        .set('Cache-Control', 'no-store')
        .send(
          `window.SMARTGRID_SOCKET_URL=${JSON.stringify(
            process.env.SMARTGRID_SOCKET_URL || process.env.HES_WS_URL || ''
          )};window.POWER_AI_DERIVED_I0_ENABLED=false;`
        );
    });
    app.use(express.static(path.join(__dirname, '../public')));

    app.use(cors({
      origin: corsOrigin
    }));
    // Combines logging info from request and response
    app.use(morgan('combined'));

    app.use('/enms', require('../routes/enms').pages);
    app.use('/api/enms/v1', require('../routes/enms').api);
    app.use('/', routes);
    // Mount the router at /api so all its routes start with /api
    app.use('/api', router);

    app.use('/reports', reportRoutes);

    app.use((err, req, res, next) => {
      if (err && err.code === 'HES_WS_ACL_UNAVAILABLE') {
        return res.status(503).json({ error: 'DEVICE_ACL_UNAVAILABLE' });
      }
      if (err && (err.type === 'entity.too.large' || err.status === 413)) {
        return res.status(413).json({
          success: false,
          message: 'Dữ liệu gửi lên vượt quá giới hạn 2 MB'
        });
      }
      return next(err);
    });

    httpServer.listen(webServerConfig.port)
      .on('listening', () => {
        console.log(`Web server listening on localhost:${webServerConfig.port}`);

        resolve();
      })
      .on('error', err => {
        reject(err);
      });
  });
}

module.exports.initialize = initialize;

function close() {
  return new Promise((resolve, reject) => {
    httpServer.close((err) => {
      if (err) {
        reject(err);
        return;
      }

      resolve();
    });
  });
}

module.exports.close = close;

const iso8601RegExp = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z$/;

function reviveJson(key, value) {
  // revive ISO 8601 date strings to instances of Date
  if (typeof value === 'string' && iso8601RegExp.test(value)) {
    return new Date(value);
  } else {
    return value;
  }
}
