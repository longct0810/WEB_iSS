const oracledb = require("oracledb");

let pool;
let ioInstance;
let subscribeConn;

function log(...args) {
    console.log("[ORACLE-REALTIME]", new Date().toISOString(), ...args);
}

async function initOracleRealtime(io) {
    ioInstance = io;

    log("Init start");
    log("oracledb.thin =", oracledb.thin);

    pool = await oracledb.createPool({
        user: "SMARTGRID",
        password: "SMARTGRID",
        connectString:
            "(DESCRIPTION=(ADDRESS=(PROTOCOL=TCP)(HOST=113.160.233.26)(PORT=1521))(CONNECT_DATA=(SID=IFC)))",
        poolMin: 1,
        poolMax: 5,
        poolIncrement: 1,
        events: true
    });

    log("Pool created");

    subscribeConn = await pool.getConnection();

    const test = await subscribeConn.execute(
        `SELECT SYSDATE AS NOW_TIME FROM DUAL`,
        [],
        { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    log("DB connected OK:", test.rows[0]);

//Đăng ký subscription để lắng nghe thay đổi trên bảng DASHBOARD_REALTIME. Mỗi khi có dữ liệu mới, callback sẽ được gọi.
await subscribeConn.subscribe("dashboard_change", {
  sql: `
    SELECT ROWID
    FROM SMARTGRID.DASHBOARD_REALTIME
  `,
  operations: oracledb.CQN_OPCODE_INSERT |
              oracledb.CQN_OPCODE_UPDATE |
              oracledb.CQN_OPCODE_DELETE,
  callback: async function (message) {
    log("CQN CALLBACK FIRED:", JSON.stringify(message));
    await emitLatestDashboard("oracle-cqn");
  }
});



log("Oracle realtime subscription started");

    await emitLatestDashboard("init-first-load");
}

async function emitLatestDashboard(reason) {
    const latestData = await getLatestDashboardData();

   // log("Latest data reason =", reason, latestData);

    if (!latestData) {
        log("No latest data found");
        return;
    }

    if (!ioInstance) {
        log("ioInstance missing");
        return;
    }

    const clientCount = ioInstance.engine.clientsCount;

    //log("Emit dashboard-realtime, clients =", clientCount);

    ioInstance.emit("dashboard-realtime", latestData);
}

async function getLatestDashboardData() {
    if (!pool) {
        log("Pool not ready");
        return null;
    }
    let conn;
    try {
        conn = await pool.getConnection();

        const result = await conn.execute(
            `
      SELECT 
        VOLTAGE,
        CURRENT_VALUE,
        POWER_VALUE,
        FREQUENCY,
        POWER_FACTOR,
        UPDATED_AT
      FROM SMARTGRID.DASHBOARD_REALTIME
      ORDER BY UPDATED_AT DESC
      FETCH FIRST 1 ROWS ONLY
      `,
            [],
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );

        const row = result.rows[0];

        if (!row) return null;

        return {
            voltage: row.VOLTAGE,
            current: row.CURRENT_VALUE,
            power: row.POWER_VALUE,
            frequency: row.FREQUENCY,
            pf: row.POWER_FACTOR,
            time: row.UPDATED_AT
        };
    } catch (err) {
        console.error("[ORACLE-REALTIME] getLatestDashboardData error:", err);
        throw err;
    } finally {
        if (conn) await conn.close();
    }
}

module.exports = {
    initOracleRealtime,
    getLatestDashboardData,
    emitLatestDashboard
};