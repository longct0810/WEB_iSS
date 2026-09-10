const https = require('http');
const express = require('express');
const morgan = require('morgan');
const webServerConfig = require('../config/web-server.js');
const router = require('./router.js');
const routes = require('./router_View.js');
var fs = require('fs');
const cors = require('cors');
var path = require('path');
var favicon = require('serve-favicon');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
const socketIO = require('socket.io');
const oracledb = require('oracledb');
const {
  initOracleRealtime,
  getLatestDashboardData
} = require("./oracle-realtime");

let httpServer;
let io;
function initialize() {
  return new Promise((resolve, reject) => {
    const app = express();
    const intermediateCert = fs.readFileSync('config/SSL_IFC_2024_certSsl@#2024.pem', 'utf8');
    var options = {
      cert: fs.readFileSync('config/ifcssl2023-cert.crt'),
      key: fs.readFileSync('config/ifcssl2023-privatekey.key'),
      ca: fs.readFileSync('config/SSL_IFC_2024_certSsl@#2024.pem')
    };

    httpServer = https.createServer(options, app);

    io = socketIO(httpServer, {
      cors: {
        origin: '*'
      }
    });

    
initOracleRealtime(io).catch(err => {
  console.error("Oracle realtime init error:", err);
});

io.on("connection", async socket => {
  console.log("Client connected:", socket.id);

  try {
    const data = await getLatestDashboardData();
    socket.emit("dashboard-realtime", data);
  } catch (err) {
    console.error("Load initial dashboard data error:", err);
  }
});


    // view engine setup
    app.set('views', path.join(__dirname, '../views'));
    app.set('view engine', 'ejs');
    app.use(morgan('dev'));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(cookieParser());
    app.use(express.static(path.join(__dirname, '../public')));

    app.use(cors({
      origin: '*'
    }));
    // Combines logging info from request and response
    app.use(morgan('combined'));

    // Parse incoming JSON requests and revive JSON.
    app.use(express.json({
      reviver: reviveJson
    }));
    app.use('/', routes);
    // Mount the router at /api so all its routes start with /api
    app.use('/api', router);

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

// For emitting real-time data to clients
    // setInterval(() => {
    //   io.emit('iec104-data', buildIEC104Frame());
    // }, 2000);
    // //* ===== Dashboard diagram zoom & pan ===== */
    // function jitter(base, spread, digits = 2) {
    //   return Number(base + (Math.random() - 0.5) * spread).toFixed(digits);
    // }

    // function buildIEC104Frame() {
    //   return {
    //     metrics: {
    //       voltage: jitter(110.23, 1.2, 2),
    //       current: jitter(221.7, 15, 1),
    //       power: jitter(42.35, 4, 2),
    //       reactive: jitter(8.15, 1.2, 2),
    //       frequency: jitter(50.02, 0.05, 2),
    //       pf: jitter(0.98, 0.03, 2),
    //       temp: jitter(28.7, 1.5, 1),
    //       humidity: jitter(65, 8, 0)
    //     }
    //   };
    // }

setInterval(async () => {
  try {
    const data = await getDashboardRealtime();
console.log('Emitting dashboard-realtime:', data);
    io.emit('dashboard-realtime', {
      voltage: data.value,
      current: data.id_thietbi,
      // power: data.power,
      // frequency: data.frequency,
      // pf: data.power_factor,
      // time: data.updated_at
    });

  } catch (err) {
    console.error('Realtime dashboard error:', err.message);
  }
}, 2000);

async function getDashboardRealtime() {
  const result = await db.query(`
    SELECT 
      voltage,
      current,
      power,
      frequency,
      power_factor,
      updated_at
    FROM dashboard_realtime
    ORDER BY updated_at DESC
    LIMIT 1
  `);

  return result[0];
}
async function getAllbycode() {
  let connection;
  try {
    connection = await oracledb.getPool().getConnection();
const code = "001003001002";
    const result = await connection.execute(
      `
      SELECT
        ID,
        MA_KHOI,
        
      FROM BC_HOATDONG_KHOI_13
      ORDER BY NAM DESC, THANG DESC, TUAN_SO DESC, ID DESC
      `,
      {},
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    res.status(200).json((result.rows || []).map(normalizeRow));
  } catch (err) {
    console.error('❌ Lỗi getAll:', err);
    res.status(500).json({ message: err.message });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (_) {}
    }
  }
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
