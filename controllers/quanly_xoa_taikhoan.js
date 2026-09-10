const { executeCursor } = require("./oracleConnection");
function validateInput(req) {
    const employee = {
        mataikhoan: req.body.v_mataikhoan,
        taikhoanthuchien: req.body.v_taikhoanthuchien
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
  const { mataikhoan,taikhoanthuchien } = context;
  try {
    return await executeCursor(
      "CALL p_taikhoan_xoa_taikhoan($1,$2,$3)",
      [
        Number(mataikhoan),
        Number(taikhoanthuchien),
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


