const { executeCursor } = require("./oracleConnection");

async function get_child_codes(req, res, next) {
  try {
    const parent_code = String(req.body.parent_code || "").trim();

    if (!parent_code) {
      return res.status(400).json({
        error: {
          status: false,
          message: "parent_code không hợp lệ"
        }
      });
    }

    const child_code_length = getChildCodeLength(parent_code);

    if (!child_code_length) {
      return res.status(400).json({
        error: {
          status: false,
          message: "Không xác định được cấp con"
        }
      });
    }

    const rows = await executeCursor(
      "CALL p_dasboard_get_child_codes($1,$2,$3)",
      [parent_code, child_code_length, "cv_1"],
      "cv_1"
    );

    res.json({
      child_codes: rows || []
    });

  } catch (err) {
    console.error("❌ get_child_codes error:", err);
    next(err);
  }
}

function getChildCodeLength(code) {
  const len = String(code).trim().length;

  if (len === 3) return 6;
  if (len === 6) return 9;
  if (len === 9) return 12;

  return null;
}

async function get_meter_by_child_code(req, res, next) {
  try {
    const child_code = String(req.body.child_code || "").trim();

    if (!child_code) {
      return res.status(400).json({
        error: {
          status: false,
          message: "child_code không hợp lệ"
        }
      });
    }

    const rows = await executeCursor(
      "CALL p_dasboard_get_meter_by_child_code($1,$2)",
      [child_code, "cv_1"],
      "cv_1"
    );

    if (!rows || rows.length === 0) {
      return res.status(404).json({
        error: {
          status: false,
          message: "Không tìm thấy điểm đo theo child_code"
        }
      });
    }

    res.json(rows[0]);

  } catch (err) {
    console.error("❌ get_meter_by_child_code error:", err);
    next(err);
  }
}

module.exports = {
  get_child_codes,
  get_meter_by_child_code
};