const { executeCursor } = require("./oracleConnection");


function validateInput(req) {
  const employee = {
    taikhoanthuchien: req.body.v_taikhoanthuchien,
    taikhoan: req.body.v_taikhoan,
    tennguoidung: req.body.v_tennguoidung,
    email: req.body.v_email,
    sodienthoai: req.body.v_sodienthoai,
    diachi: req.body.v_diachi,
    danhmucid: req.body.v_danhmucid
  };
  return employee;
}

async function post(req, res, next) {
  try {
    const input = validateInput(req);
    const result = await find(input);
    if (
      Array.isArray(result) &&
      result.length > 0 &&
      result[0]?.result
    ) {
      return res.status(200).json(result[0].result);
    }

    return res.status(500).json("Có lỗi xảy ra");
  } catch (err) {
    next(err);
  }
}

async function find(context) {
  const { taikhoanthuchien, taikhoan, tennguoidung, email, sodienthoai, diachi, danhmucid } = context;
  try {
    return await executeCursor(
      "CALL p_taikhoan_sua_taikhoan($1,$2,$3,$4,$5,$6,$7,$8)",
      [
        Number(taikhoanthuchien),
        String(taikhoan).trim(),
        String(tennguoidung).trim(),
        String(email).trim(),
        String(sodienthoai).trim(),
        String(diachi).trim(),
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


