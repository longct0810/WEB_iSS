const { executeCursor } = require("./oracleConnection");


function validateInput(req) {
  const employee = {
   danhmucid: req.body.v_danhmucid
  };
  return employee;
}

const post = async (req, res, next) => {
  try {
    const input = validateInput(req);
    const result = await find(input);

    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

async function find(context) {
  const { danhmucid } = context;
  try {
    return await executeCursor(
      "CALL p_taikhoan_layds_taikhoan_by_danhmucid($1,$2)",
      [
        String(danhmucid).trim(),
        "cv_1"
      ],
      "cv_1"
    );
  } catch (err) {
    console.error("PostgreSQL error:", err);
    return "failure";
  }
}

module.exports = {
  post
};





