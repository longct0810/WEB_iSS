const { executeCursor } = require("./oracleConnection");


function validateInput(req) {
  const employee = {
    mataikhoan: req.body.v_mataikhoan
  };
  return employee;
}

async function post(req, res, next) {
  try {
    let input = validateInput(req);
    const result = await find(input);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

async function find(context) {
  const { mataikhoan } = context;
  try {
    return await executeCursor(
      "CALL p_taikhoan_layds_taikhoan($1,$2)",
      [
        Number(mataikhoan),
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