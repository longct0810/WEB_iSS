const { executeCursor } = require('./oracleConnection');

function rowsToJson(rows) {
  return rows.map(function (r) {
    return JSON.stringify(r);
  });
}



async function quanly_ds_nhamay(req, res, next) {
  try {

    var rows = await find();
    res.status(200).json(rows);
  } catch (err) {
    next(err);
  }
}
async function find() {
  try {

    return await executeCursor(
      "CALL p_nhamay_layds($1)",
      [
        "cv_1"
      ],
      "cv_1"
    );
  } catch (err) {
    console.error("find - p_nhamay_layds error:", err);
    throw err;
  }

}



async function quanly_lay_tt_nhamay(req, res, next) {
  try {
const {v_id } = req.body;
    var rows = await getTTNhaMay(v_id);
    res.status(200).json(rows);
  } catch (err) {
    next(err);
  }
}
async function getTTNhaMay(v_id) {
  try {

    return await executeCursor(
      "CALL p_nhamay_lay_tt_theo_id($1,$2)",
      [
        v_id,
        "cv_1"
      ],
      "cv_1"
    );
  } catch (err) {
    console.error("find - p_nhamay_lay_tt error:", err);
    throw err;
  }

}


async function quanly_them_nhamay(req, res, next) {
  try {
    const { v_ma_nhamay, v_ten_nhamay, v_diachi, v_kinhdo, v_vido, v_ghichu } = req.body;

    var result = await addNhaMay(v_ma_nhamay, v_ten_nhamay, v_diachi, v_kinhdo, v_vido, v_ghichu);
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
async function addNhaMay(v_ma_nhamay, v_ten_nhamay, v_diachi, v_kinhdo, v_vido, v_ghichu) {
  try {

    return await executeCursor(
      "CALL p_nhamay_them($1,$2,$3,$4,$5,$6,$7)",
      [
        v_ma_nhamay,
        v_ten_nhamay,
        v_diachi,
        v_kinhdo,
        v_vido,
        v_ghichu,
        "cv_1"
      ],
      "cv_1"
    );
  } catch (err) {
    console.error("find - p_nhamay_them error:", err);
    throw err;
  }

}



async function quanly_sua_nhamay(req, res, next) {
  try {
    const {   v_id,v_ma_nhamay,v_ten_nhamay,v_diachi,v_kinhdo,v_vido,v_ghichu } = req.body;
  if (!v_id) {
      return res.json("Không xác định được nhà máy cần sửa");
    }

    if (!v_ma_nhamay || !String(v_ma_nhamay).trim()) {
      return res.json("Mã nhà máy không được để trống");
    }

    if (!v_ten_nhamay || !String(v_ten_nhamay).trim()) {
      return res.json("Tên nhà máy không được để trống");
    }

    var result = await updateNhaMay( v_id,v_ma_nhamay,v_ten_nhamay,v_diachi,v_kinhdo,v_vido,v_ghichu);
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
async function updateNhaMay( v_id,v_ma_nhamay,v_ten_nhamay,v_diachi,v_kinhdo,v_vido,v_ghichu) {
  try {

    return await executeCursor(
      "CALL p_nhamay_sua($1,$2,$3,$4,$5,$6,$7,$8)",
      [
        v_id,
        v_ma_nhamay,
        v_ten_nhamay,
        v_diachi,
        v_kinhdo,
        v_vido,
        v_ghichu,
        "cv_1"
      ],
      "cv_1"
    );
  } catch (err) {
    console.error("updateNhaMay error:", err);
    throw err;
  }

}



async function quanly_xoa_nhamay(req, res, next) {
  try {
    const {   v_id} = req.body;
 
    if (!v_id) {
      return res.json("Không xác định được nhà máy cần xóa");
    }
    var result = await deleteNhaMay( v_id);
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
async function  deleteNhaMay( v_id) {
  try {

    return await executeCursor(
      "CALL p_nhamay_xoa($1,$2)",
      [
        v_id,      
        "cv_1"
      ],
      "cv_1"
    );
  } catch (err) {
    console.error("deleteNhaMay error:", err);
    throw err;
  }

}

module.exports = {
  quanly_ds_nhamay,
  quanly_lay_tt_nhamay,
  quanly_them_nhamay,
  quanly_sua_nhamay,
  quanly_xoa_nhamay
};
