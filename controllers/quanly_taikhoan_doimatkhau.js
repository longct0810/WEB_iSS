const { executeCursor } = require("./oracleConnection");


async function doimatkhau_tk(req, res) {

  const { v_mataikhoan, v_matkhau } = req.body;

  if (!v_mataikhoan || !v_matkhau) {
    return res.status(400).json("Thiếu dữ liệu đầu vào");
  }

  try {
    const result = await find(v_mataikhoan, v_matkhau);
    console.log("Result from find:", result); // Log the result for debugging
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
async function find(mataikhoan, matkhau) {
  try {
    return await executeCursor(
      "CALL p_taikhoan_doimatkhau($1,$2,$3)",
      [
        Number(mataikhoan),
        matkhau,
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
  doimatkhau_tk
};