const { executeCursor } = require("./oracleConnection");

const post = async (req, res, next) => {
  try {
    const result = await getData(req.body.code);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

async function getData(code) {
  const rows = await executeCursor(
    "CALL p_sodo1soi_lay_thietbi_ioa($1,$2)",
    [code, "cv_1"],
    "cv_1"
  );

  return (rows || []).map(row => [
    row.ioa_ten ?? "",
    row.id_thietbi ?? null,
    row.ioa_diachi ?? null,
    row.value ?? "",
    row.time ?? ""
  ]);
}

const getCanhBao = async (req, res, next) => {
  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({
        success: false,
        message: "Thiếu code"
      });
    }

    const result = await getCanhBaoSuKien(code);
    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

async function getCanhBaoSuKien(code) {
  return await executeCursor(
    "CALL p_sodo1soi_sukien_canhbao($1,$2)",
    [code, "cv_1"],
    "cv_1"
  );
}

const getdulieusonghai = async (req, res, next) => {
  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({
        success: false,
        message: "Thiếu code"
      });
    }

    const result = await getDuLieuSongHaitheoNgay(code);
    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

async function getDuLieuSongHaitheoNgay(code) {
  const rows = await executeCursor(
    "CALL p_sodo1soi_dulieu_songhai_ioa($1,$2)",
    [code, "cv_1"],
    "cv_1"
  );

  return (rows || []).map(row => [
    row.ioa_ten ?? "",
    row.id_thietbi ?? null,
    row.ioa_diachi ?? null,
    row.value ?? "",
    row.time ?? ""
  ]);
}

module.exports = {
  post,
  getCanhBao,
  getdulieusonghai
};