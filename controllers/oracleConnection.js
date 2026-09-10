const database = require("../services/database.js");

/**
 * Chạy procedure PostgreSQL trả về 1 refcursor.
 *
 * Ví dụ:
 * await executeCursor(
 *   "CALL public.p_dangnhap($1, $2, $3)",
 *   ["admin", "123456", "cv_1"],
 *   "cv_1"
 * );
 */
async function executeCursor(procSql, binds = [], cursorName = "cv_1") {
  try {
    await database.execute("BEGIN");

    await database.execute(procSql, binds);

    const result = await database.execute(
      `FETCH ALL FROM ${cursorName}`
    );

    await database.execute("COMMIT");

    const rows = result.rows || [];

    // Nếu chỉ có 1 cột json_object thì trả thẳng object
    return rows.map(r => {
      if (
        Object.keys(r).length === 1 &&
        r.json_object !== undefined
      ) {
        return r.json_object;
      }
      return r;
    });

  } catch (err) {
    try {
      await database.execute("ROLLBACK");
    } catch (_) {}

    console.error("❌ POSTGRES ERROR:", err);

    throw err;
  }
}

/**
 * Chạy procedure PostgreSQL trả về nhiều refcursor.
 *
 * Ví dụ:
 * await executeMultiCursor(
 *   "CALL public.p_lay_thongke_chatluong($1,$2,$3,$4,$5,$6,$7)",
 *   ["001", "07/07/2026", "00:00:00", "23:59:59", "admin", "cv_1", "cv_2"],
 *   ["cv_1", "cv_2"]
 * );
 */
async function executeMultiCursor(procSql, binds = [], cursorNames = []) {
  const results = {};

  try {
    await database.execute("BEGIN");

    await database.execute(procSql, binds);

    for (const cursorName of cursorNames) {
      const result = await database.execute(`FETCH ALL FROM ${cursorName}`);
      results[cursorName] = result.rows || [];
    }

    await database.execute("COMMIT");

    return results;
  } catch (err) {
    try {
      await database.execute("ROLLBACK");
    } catch (_) {}

    console.error("❌ executeMultiCursor POSTGRES Error:", {
      message: err.message,
      code: err.code,
      detail: err.detail,
      stack: err.stack
    });

    throw err;
  }
}

module.exports = {
  executeCursor,
  executeMultiCursor
};