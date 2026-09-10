
const multer = require('multer');
const path = require('path');
const ExcelJS = require('exceljs');
const xml2js = require('xml2js');
const XLSX = require('xlsx');
const fs = require('fs');
const oracledb = require('oracledb');
const { executeCursor } = require('./oracleConnection');
// Thiết lập multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../public/uploads'));
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
})

// Sử dụng multer để xử lý file
const upload = multer({ storage: storage }).single('file');// 'file' là tên trường file trong FormData
const post = async (req, res, next) => {

    upload(req, res, async function (err) {
        if (err instanceof multer.MulterError) {
            return res.status(500).json({ message: err.message });
        } else if (err) {
            return res.status(500).json({ message: err.message });
        }

        // Kiểm tra xem có file không
        if (!req.file) {
            return res.status(400).json({
                message: "không có file để upload"
            })
        }

        // Nếu có file, in đường dẫn file
        let table;
        const file = req.file;
        const fileExt = path.extname(file.originalname).toLowerCase();
        let conn;
        if (!fileExt.match(/\.(xml)$/)) {
            return res.status(400).json({ success: false, message: 'Chỉ chấp nhận file xml!' });
        }
        table = await convertXmlFileToDatatable(file);
        if (table) {
            res.json({ success: true, data: JSON.stringify(table, null, 2) });
        } else {
            res.status(500).json({ success: false, message: 'Failed to convert XML to table.' });
        }
        // Delete the Excel file after processing
        await fs.promises.unlink(file.path);

    });

};


//=====================xml==========================

// Hàm chuyển đổi file XML thành "bảng" dữ liệu
async function convertXmlFileToDatatable(file) {
    try {
        // Wrap in a Promise to handle async behavior
        const jsonResult = await new Promise((resolve, reject) => {
            // Read the XML file
            fs.readFile(file.path, 'utf8', (err, xmlData) => {
                if (err) {
                    console.error('Error reading the XML file:', err);
                    return reject(err);
                }

                // Parse the XML to a JavaScript object
                const parser = new xml2js.Parser({ explicitArray: false });
                parser.parseString(xmlData, (err, result) => {
                    if (err) {
                        console.error('Error parsing the XML:', err);
                        return reject(err);
                    }

                    // Access the Table1 object from the parsed result
                    const tableData = result.NewDataSet.Table1;

                    // Map the table data into a JSON result
                    const jsonResult = tableData.map(item => {
                        return {
                            MA_NVGCS: item.MA_NVGCS,
                            MA_KHANG: item.MA_KHANG,
                            MA_DDO: item.MA_DDO,
                            MA_DVIQLY: item.MA_DVIQLY,
                            MA_GC: item.MA_GC,
                            MA_QUYEN: item.MA_QUYEN,
                            MA_TRAM: item.MA_TRAM,
                            BOCSO_ID: item.BOCSO_ID,
                            LOAI_BCS: item.LOAI_BCS,
                            LOAI_CS: item.LOAI_CS,
                            TEN_KHANG: item.TEN_KHANG,
                            DIA_CHI: item.DIA_CHI,
                            MA_NN: item.MA_NN,
                            SO_HO: item.SO_HO,
                            MA_CTO: item.MA_CTO,
                            SERY_CTO: item.SERY_CTO,
                            HSN: item.HSN,
                            CS_CU: item.CS_CU,
                            TTR_CU: item.TTR_CU,
                            SL_CU: item.SL_CU,
                            SL_TTIEP: item.SL_TTIEP,
                            NGAY_CU: item.NGAY_CU,
                            CS_MOI: item.CS_MOI,
                            TTR_MOI: item.TTR_MOI,
                            SL_MOI: item.SL_MOI,
                            CHUOI_GIA: item.CHUOI_GIA,
                            KY: item.KY,
                            THANG: item.THANG,
                            NAM: item.NAM,
                            NGAY_MOI: item.NGAY_MOI,
                            NGUOI_GCS: item.NGUOI_GCS,
                            SL_THAO: item.SL_THAO,
                            KIMUA_CSPK: item.KIMUA_CSPK,
                            MA_COT: item.MA_COT,
                            SLUONG_1: item.SLUONG_1,
                            SLUONG_2: item.SLUONG_2,
                            SLUONG_3: item.SLUONG_3,
                            SO_HOM: item.SO_HOM,
                            PMAX: item.PMAX,
                            NGAY_PMAX: item.NGAY_PMAX,
                            X: item.X,
                            Y: item.Y,
                            Z: item.Z
                        };
                    });

                    resolve(jsonResult);
                });
            });
        });

        return jsonResult;
    } catch (error) {
        console.error("Error while converting XML to DataTable:", error);
        return null;
    }
}


napdulieu = async (req, res, next) => {

    upload(req, res, async function (err) {
        let filePath = null;

        try {
            const v_sudung_hsn = Number(req.body.v_sudung_hsn || 0);
            const v_thoidiem = String(req.body.v_thoidiem || "").trim();
            const v_isNgay = Number(req.body.v_isNgay || 0);

            if (err instanceof multer.MulterError) {
                return res.status(500).json({ success: false, message: err.message });
            } else if (err) {
                return res.status(500).json({ success: false, message: err.message });
            }

            if (!req.file) {
                return res.status(400).json({
                    success: false,
                    message: "Không có file để upload"
                });
            }

            const file = req.file;
            filePath = file.path;

            const fileExt = path.extname(file.originalname).toLowerCase();
            if (!fileExt.match(/\.(xml)$/)) {
                return res.status(400).json({
                    success: false,
                    message: "Chỉ chấp nhận file xml!"
                });
            }

            const table = await convertXmlFileToDatatable(file);

            if (!Array.isArray(table) || table.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: "File XML không có dữ liệu"
                });
            }

            const importResult = await insertDongBoCmisBulk(table);

            if ((importResult.rowsAffected || 0) <= 0) {
                return res.status(500).json({
                    success: false,
                    message: "Import dữ liệu không thành công",
                    errors: importResult.errors
                });
            }

            const data = await layDsChiSoMoiSlMoiBulk({
                v_sudung_hsn,
                v_thoidiem,
                v_isNgay
            });

            return res.json({
                success: true,
                message: "Import dữ liệu và lấy chỉ số thành công",
                totalRows: table.length,
                rowsAffected: importResult.rowsAffected,
                errors: importResult.errors,
                data
            });

        } catch (error) {
            console.error("napdulieu error:", error);
            return res.status(500).json({
                success: false,
                message: error.message || "Lỗi import dữ liệu"
            });
        } finally {
            if (filePath) {
                try {
                    await fs.promises.unlink(filePath);
                } catch (e) {
                    console.error("Không xóa được file upload:", e.message);
                }
            }
        }
    });
};
async function insertDongBoCmisBulk(rows) {
    let conn;

    const columns = [
        "MA_NVGCS", "MA_KHANG", "MA_DDO", "MA_DVIQLY", "MA_GC",
        "MA_QUYEN", "MA_TRAM", "BOCSO_ID", "LOAI_BCS", "LOAI_CS",
        "TEN_KHANG", "DIA_CHI", "MA_NN", "SO_HO", "MA_CTO",
        "SERY_CTO", "HSN", "CS_CU", "TTR_CU", "SL_CU",
        "SL_TTIEP", "NGAY_CU", "CS_MOI", "TTR_MOI", "SL_MOI",
        "CHUOI_GIA", "KY", "THANG", "NAM", "NGAY_MOI",
        "NGUOI_GCS", "SL_THAO", "KIMUA_CSPK", "MA_COT",
        "SLUONG_1", "SLUONG_2", "SLUONG_3", "SO_HOM",
        "PMAX", "NGAY_PMAX", "X", "Y", "Z"
    ];

    try {
        conn = await oracledb.getConnection();
        await conn.execute(`TRUNCATE TABLE BT_DONGBOCMIS_BULK`);
        const sql = `
            INSERT INTO BT_DONGBOCMIS_BULK (
                ${columns.join(", ")}
            ) VALUES (
                ${columns.map(c => ":" + c).join(", ")}
            )
        `;

        const binds = rows.map(row => {
            const obj = {};
            columns.forEach(col => {
                obj[col] = row[col] ?? null;
            });
            return obj;
        });

        const bindDefs = {};
        columns.forEach(col => {
            bindDefs[col] = {
                type: oracledb.STRING,
                maxSize: col === "DIA_CHI" || col === "CHUOI_GIA" ? 1000 : 500
            };
        });

        const result = await conn.executeMany(sql, binds, {
            autoCommit: true,
            batchErrors: true,
            bindDefs
        });

        return {
            rowsAffected: result.rowsAffected || 0,
            errors: (result.batchErrors || []).map(e => ({
                offset: e.offset,
                message: e.message
            }))
        };

    } finally {
        if (conn) {
            await conn.close();
        }
    }
}
async function layDsChiSoMoiSlMoiBulk({ v_sudung_hsn, v_thoidiem, v_isNgay }) {
    let conn;
    let rs;

    try {
        conn = await oracledb.getConnection();

        const sql = `
            BEGIN 
                PKG_DONGBOCMISS.P_LAYDS_CHISO_MOI_SLMOI_BULK(
                    :v_sudung_hsn,
                    :v_thoidiem,
                    :v_isNgay,
                    :cv_1
                ); 
            END;
        `;

        const binds = {
            v_sudung_hsn: {
                type: oracledb.NUMBER,
                dir: oracledb.BIND_IN,
                val: Number(v_sudung_hsn ?? 0)
            },
            v_thoidiem: {
                type: oracledb.STRING,
                dir: oracledb.BIND_IN,
                val: v_thoidiem
            },
            v_isNgay: {
                type: oracledb.NUMBER,
                dir: oracledb.BIND_IN,
                val: Number(v_isNgay ?? 0)
            },
            cv_1: {
                type: oracledb.CURSOR,
                dir: oracledb.BIND_OUT
            }
        };
        console.log(binds);
        const result = await conn.execute(sql, binds);
        rs = result.outBinds.cv_1;

        const rows = await rs.getRows(100000);
        // console.log(rows);
        const columns = rs.metaData.map(c => c.name);

        const data = rows.map(row => {
            const obj = {};
            columns.forEach((col, i) => {
                obj[col] = row[i];
            });
            return obj;
        });

        return data;


    } finally {
        if (rs) {
            try {
                await rs.close();
            } catch (_) { }
        }

        if (conn) {
            await conn.close();
        }
    }
}
module.exports = { post, napdulieu };