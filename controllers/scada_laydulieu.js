const { executeCursor, executeMultiCursor } = require("./oracleConnection");
const ExcelJS = require("exceljs");

function validateInput(req) {
  return {
    v_id_thietbi: req.body.v_id_thietbi,
    v_tungay: req.body.v_tungay,
    v_denngay: req.body.v_denngay
  };
}

// ================= TSVH SCADA =================

const TSVHSCADA = async (req, res, next) => {
  try {
    const input = validateInput(req);
    const result = await getTSVHScada(input);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

async function getTSVHScada({ v_id_thietbi, v_tungay, v_denngay }) {
  return await executeMultiCursor(
    "CALL p_iec_104_get_list_tsvh($1,$2,$3,$4,$5)",
    [
      Number(v_id_thietbi),
      v_tungay,
      v_denngay,
      "cv_1",
      "cv_2"
    ],
    ["cv_1", "cv_2"]
  );
}

// ================= DS IOA =================

const GETDSIOA = async (req, res, next) => {
  try {
    const result = await getDSIOA();
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

async function getDSIOA() {
  return await executeCursor(
    "CALL p_iec_104_get_ds_ioa($1)",
    ["cv_1"],
    "cv_1"
  );
}

// ================= SAVE IOA =================

const saveIOA = async (req, res, next) => {
  try {
    const input = {
      ten_thietbi: req.body.ten_thietbi,
      ip_thietbi: req.body.ip_thietbi,
      port_thietbi: req.body.port_thietbi,
      ten_cambien: req.body.ten_cambien,
      giaothuc: req.body.giaothuc,
      loai_cambien: req.body.loai_cambien,
      ioas: req.body.ioas || [],
      code: req.body.code,
      userId: req.body.userId
    };

    const result = await saveSensorIoas(input);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

async function saveSensorIoas(input) {
  return await executeCursor(
    "CALL p_iec_104_save_thietbi_cambien_ioa($1::jsonb,$2)",
    [
      JSON.stringify(input),
      "cv_1"
    ],
    "cv_1"
  );
}

// ================= DANH MỤC TREE =================

const danhMucTree = async (req, res, next) => {
  try {
    const result = await getDanhMucTree();
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

async function getDanhMucTree() {
  return await executeCursor(
    "CALL p_iec_104_get_ds_danhmuc($1)",
    ["cv_1"],
    "cv_1"
  );
}

// ================= CHI TIẾT CẢM BIẾN =================

const ChitietCambien = async (req, res, next) => {
  try {
    const input = {
      id_thietbi: req.body.id_thietbi,
      id_cambien: req.body.id_cambien,
      ioa_diachi: req.body.ioa_diachi,
      tu_ngay: req.body.tu_ngay,
      den_ngay: req.body.den_ngay,
      skip: req.body.skip || 0,
      limit: req.body.limit || 50
    };

    const result = await getChiTietCambien(input);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

async function getChiTietCambien({
  id_thietbi,
  id_cambien,
  ioa_diachi,
  tu_ngay,
  den_ngay,
  skip,
  limit
}) {
  return await executeCursor(
    "CALL p_iec_104_get_chitiet_cambien($1,$2,$3,$4,$5,$6,$7,$8)",
    [
      Number(id_thietbi),
      Number(id_cambien),
      Number(ioa_diachi),
      tu_ngay,
      den_ngay,
      Number(skip),
      Number(limit),
      "cv_1"
    ],
    "cv_1"
  );
}

// ================= EXPORT EXCEL =================

const exportChiTietCambienExcel = async (req, res, next) => {
  try {
    const input = {
      id_thietbi: req.query.id_thietbi,
      id_cambien: req.query.id_cambien,
      ioa_diachi: req.query.ioa_diachi,
      tu_ngay: req.query.tu_ngay,
      den_ngay: req.query.den_ngay
    };

    const type = req.query.type;
    const rows = await getAllChiTietCambienForExport(input);

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("ChiTietCamBien");

    if (type === "giamsatcoday") {
      worksheet.columns = [
        { header: "STT", key: "stt", width: 10 },
        { header: "Thời gian", key: "time", width: 25 },
        { header: "Trạng thái", key: "value", width: 15 }
      ];

      rows.forEach((item, index) => {
        const value = Number(item.value ?? 0);

        worksheet.addRow({
          stt: index + 1,
          time: item.time || "",
          value: value === 0 ? "ON" : "OFF"
        });
      });
    } else {
      worksheet.columns = [
        { header: "STT", key: "stt", width: 10 },
        { header: "Thời gian", key: "time", width: 25 },
        { header: "Nhiệt độ", key: "nhietdo", width: 15 }
      ];

      rows.forEach((item, index) => {
        const value = Number(item.value ?? 0);
        const scale = Number(item.ioa_scale ?? 1);

        worksheet.addRow({
          stt: index + 1,
          time: item.time || "",
          nhietdo: (value * scale).toFixed(2)
        });
      });
    }

    worksheet.getRow(1).font = { bold: true };

    worksheet.eachRow((row) => {
      row.alignment = {
        vertical: "middle",
        horizontal: "center"
      };
    });

    const rawFileName = req.query.fileName || "chi_tiet_cam_bien";
    const fileName = String(rawFileName).replace(/[<>:"/\\|?*\x00-\x1F]/g, "_");

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    res.setHeader(
      "Content-Disposition",
      `attachment; filename="bao_cao.xlsx"; filename*=UTF-8''${encodeURIComponent(fileName)}.xlsx`
    );

    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    next(err);
  }
};

async function getAllChiTietCambienForExport(context) {
  return await getChiTietCambien({
    ...context,
    skip: 0,
    limit: 20000
  });
}

// ================= DS THIẾT BỊ CẢM BIẾN =================

const getDsThietbiCambien = async (req, res, next) => {
  try {
    const result = await f_getDsThietbiCambien();
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

async function f_getDsThietbiCambien() {
  return await executeCursor(
    "CALL p_iec_104_khaibao_ioa_get_ds_thietbi($1)",
    ["cv_1"],
    "cv_1"
  );
}

// ================= IOA BY THIẾT BỊ =================

const getIOAByThietBi = async (req, res, next) => {
  try {
    const { id_thietbi } = req.body;
    const result = await f_getIOAByThietBi(id_thietbi);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

async function f_getIOAByThietBi(id) {
  return await executeCursor(
    "CALL p_iec_104_khaibao_ioa_get_ioa_by_thietbi($1,$2)",
    [
      Number(id),
      "cv_1"
    ],
    "cv_1"
  );
}

// ================= UPDATE IOA =================

const updateIOA = async (req, res, next) => {
  try {
    const input = {
      id_thietbi: req.body.id_thietbi,
      id_cambien: req.body.id_cambien,
      ten_thietbi: req.body.ten_thietbi,
      ip_thietbi: req.body.ip_thietbi,
      port_thietbi: req.body.port_thietbi,
      ioas: req.body.ioas || [],
      code: req.body.code,
      userId: req.body.userId
    };

    const result = await updateSensorIoas(input);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

async function updateSensorIoas(input) {
  return await executeCursor(
    "CALL p_iec_104_update_thietbi_cambien_ioa($1::jsonb,$2)",
    [
      JSON.stringify(input),
      "cv_1"
    ],
    "cv_1"
  );
}

// ================= DELETE IOA =================

const deleteIOA = async (req, res, next) => {
  try {
    const input = {
      id_thietbi: req.body.id_thietbi,
      userId: req.body.userId
    };

    const result = await deleteIoas(input);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

async function deleteIoas({ id_thietbi, userId }) {
  return await executeCursor(
    "CALL p_iec_104_delete_thietbi_cambien_ioa($1,$2,$3)",
    [
      Number(id_thietbi),
      Number(userId),
      "cv_1"
    ],
    "cv_1"
  );
}

// ================= DATA THIẾT BỊ CẢM BIẾN =================

const getDataThietBiCamBien = async (req, res, next) => {
  try {
    const input = {
      id_thietbi: req.body.id_thietbi
    };

    const result = await getDataThietBiCamBienRTU(input);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

async function getDataThietBiCamBienRTU({ id_thietbi }) {
  return await executeCursor(
    "CALL p_iec_104_get_data_thietbi_cambien($1,$2)",
    [
      Number(id_thietbi),
      "cv_1"
    ],
    "cv_1"
  );
}

// ================= THIẾT BỊ THEO CODE =================

const getThietBiTheoCode = async (req, res, next) => {
  try {
    const input = {
      code: req.body.v_code
    };

    const result = await getDataThietBiTheoCode(input);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

async function getDataThietBiTheoCode({ code }) {
  return await executeCursor(
    "CALL p_iec_104_get_ds_danhmuc_thietbi($1,$2)",
    [
      code,
      "cv_1"
    ],
    "cv_1"
  );
}

module.exports = {
  TSVHSCADA,
  GETDSIOA,
  saveIOA,
  danhMucTree,
  ChitietCambien,
  exportChiTietCambienExcel,
  getDsThietbiCambien,
  getIOAByThietBi,
  updateIOA,
  deleteIOA,
  getDataThietBiCamBien,
  getThietBiTheoCode
};