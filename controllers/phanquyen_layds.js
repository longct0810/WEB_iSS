const { executeCursor } = require("./oracleConnection");

function getEmployeeFromReq(req) {
  return {
    mataikhoan: req.body.v_mataikhoan
  };
}

async function post(req, res, next) {
  try {
    const employee = getEmployeeFromReq(req);

    const data = await find(employee);
    console.log(data);
    res.status(200).json(data);
  } catch (err) {
    next(err);
  }
}
async function find(context) {
  if (!context.mataikhoan) {
    throw new Error("Thiếu mã tài khoản");
  }

  const rows = await executeCursor(
    "CALL p_phanquyen_layds_quyen($1,$2)",
    [
      context.mataikhoan,
      "cv_1"
    ],
    "cv_1"
  );

  return rows;
}
module.exports = {
  post
};





