const { executeCursor } = require("./oracleConnection");
const { createLoginToken } = require('../services/login-jwt.js');

function getEmployeeFromReq(req) {
  return {
    username: req.body.username,
    password: req.body.password
  };
}

async function post(req, res, next) {
  try {
    const employee = getEmployeeFromReq(req);

    const data = await find(employee);
    const response = Array.isArray(data) ? data : [];
    if (response[0] && !response[0].result) {
      response[0].loginToken = createLoginToken(response[0]);
    }
    res.status(200).json(response);
  } catch (err) {
    next(err);
  }
}
async function find(context) {
  if (!context.username) {
    throw new Error("Thiếu tên đăng nhập");
  }

  const rows = await executeCursor(
    "CALL p_taikhoan_dangnhap($1,$2,$3)",
    [
      context.username,
      context.password,
      "cv_1"
    ],
    "cv_1"
  );

  return rows;
}
module.exports = {
  post
};

