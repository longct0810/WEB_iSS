const { executeCursor } = require("./oracleConnection");



function validateInput(req) {
  const employee = {
    danhmucid: req.body.v_danhmucid,
    typenote: req.body.v_typenode,
    userid: req.body.v_mataikhoan,
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
  const { danhmucid, typenote, userid } = context;
  try {
    return await executeCursor(
      "CALL p_danhmuc_layds_danhmuc($1,$2,$3,$4)",
      [
        String(danhmucid).trim(),
        String(typenote).trim(),
        Number(userid),
        "cv_1"
      ],
      "cv_1"
    );
  } catch (err) {
    console.error("ds_thietbi_ir PostgreSQL error:", err);
    return "failure";
  }
}

module.exports = {
  post
};

