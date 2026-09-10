const { executeCursor } = require("./oracleConnection");
function validateInput(req) {
  return {
    id_thietbi: req.body.v_idthietbi,
    tungay: req.body.v_tungay,
    denngay: req.body.v_denngay,
    ioa: req.body.v_ioa
  };
}

const post = async (req, res, next) => {
  try {
    const input = validateInput(req);

    if (!input.id_thietbi) {
      return res.status(400).json({
        message: "Chưa nhập thiết bị"
      });
    }

    if (!input.tungay || !input.denngay) {
      return res.status(400).json({
        message: "Chưa nhập khoảng thời gian"
      });
    }

    if (!input.ioa) {
      return res.status(400).json({
        message: "Chưa nhập danh sách IOA"
      });
    }

    const result = await find(input);

    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

async function find(context) {
  const {
    id_thietbi,
    tungay,
    denngay,
    ioa
  } = context;

  return executeCursor(
    "CALL p_scada_thongkesolieu($1,$2,$3,$4,$5)",
    [
      String(id_thietbi).trim(),
      String(tungay).trim(),
      String(denngay).trim(),
      String(ioa).trim(),
      "cv_1"
    ],
    "cv_1"
  );
}

module.exports = {
  post
};