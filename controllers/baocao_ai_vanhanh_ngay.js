const { executeCursor } = require("./oracleConnection");
const IOA = require("../services/ioa_map");

const REPORT_CACHE_TTL_MS = 10 * 1000;
const reportRequests = new Map();

function limitSensorPoints(rows, maxPoints) {
  if (!Number.isFinite(maxPoints)) return rows;

  return (rows || []).map(row => {
    const key = row.JSON_DATA !== undefined ? "JSON_DATA" : "json_data";
    const raw = row[key];
    const parsed = typeof raw === "string" ? JSON.parse(raw) : raw;
    if (!parsed || !Array.isArray(parsed.cambien)) return row;

    const limited = {
      ...parsed,
      cambien: parsed.cambien.slice(-maxPoints)
    };
    return {
      ...row,
      [key]: typeof raw === "string" ? JSON.stringify(limited) : limited
    };
  });
}

async function findCached(context) {
  const cacheKey = [
    context.id_thietbi,
    context.tungay,
    context.denngay,
    context.maxPoints || "all"
  ].join(":");
  const now = Date.now();
  const current = reportRequests.get(cacheKey);

  if (current && current.result && now - current.createdAt < REPORT_CACHE_TTL_MS) {
    return current.result;
  }
  if (current && current.inFlight) return current.inFlight;

  const state = { createdAt: now, result: null, inFlight: null };
  state.inFlight = find(context)
    .then(rows => {
      state.result = limitSensorPoints(rows, context.maxPoints);
      state.createdAt = Date.now();
      return state.result;
    })
    .finally(() => {
      state.inFlight = null;
      const timer = setTimeout(() => {
        if (reportRequests.get(cacheKey) === state) {
          reportRequests.delete(cacheKey);
        }
      }, REPORT_CACHE_TTL_MS);
      timer.unref();
    });
  reportRequests.set(cacheKey, state);
  return state.inFlight;
}

async function post(req, res, next) {
  try {
    const requestedMaxPoints = Number.parseInt(req.body.v_max_points, 10);
    const input = {
      id_thietbi: req.body.v_idthietbi,
      tungay: req.body.v_tungay,
      denngay: req.body.v_denngay,
      maxPoints: Number.isFinite(requestedMaxPoints)
        ? Math.max(1, Math.min(requestedMaxPoints, 5000))
        : null
    };

    if (!input.id_thietbi || !input.tungay || !input.denngay) {
      return res.status(400).json({
        success: false,
        message: "Thiếu v_idthietbi, v_tungay hoặc v_denngay"
      });
    }

    const result = await findCached(input);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

async function find(context) {
  const defaultIOA = Object.values(IOA).join(",");
  const { id_thietbi, tungay, denngay } = context;

  return await executeCursor(
    "CALL p_scada_thongkesolieu_ai($1,$2,$3,$4,$5)",
    [
      id_thietbi,
      tungay,
      denngay,
      defaultIOA,
      "cv_1"
    ],
    "cv_1"
  );
}

module.exports = {
  post,
  _test: {
    limitSensorPoints
  }
};
