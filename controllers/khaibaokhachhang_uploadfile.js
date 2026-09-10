
const multer = require('multer');
const path = require('path');
const ExcelJS = require('exceljs');
const xml2js = require('xml2js');
const XLSX = require('xlsx');
const fs = require('fs');
const oracledb = require('oracledb');
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
        const type = req.body.type;
        const code = req.body.code;
        const fileExt = path.extname(file.originalname).toLowerCase();
        let conn;
        switch (type) {
            case 'xml':
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
                break;
            case 'excel':
                if (!fileExt.match(/\.(xlsx|xls)$/)) {
                    return res.status(400).json({ success: false, message: 'Chỉ chấp nhận file excel!' });
                }
                table = await convertFileExcelToDatatable(file);
                if (table) {
                    try {

                        const tableJson = await convertExcelToJson(file.path);  // Sử dụng await để chờ hàm hoàn thành

                        // Trả về kết quả dưới dạng JSON
                        res.status(200).json({ success: true, data: tableJson });
                    } catch (err) {
                        res.status(500).json({ success: false, message: 'Error occurred', error: err.message });
                    }
                } else {
                    res.status(500).json({ success: false, message: 'Failed to convert Excel to table.' });
                }
                // Delete the Excel file after processing
                await fs.promises.unlink(file.path);
                break;
            default:
                return res.status(400).json({
                    message: "Loại file không hỗ trợ"
                })
        }


    });

};

// Hàm chuyển đổi file excel thành "bảng" dữ liệu
async function convertFileExcelToDatatable(file) {
    let table = [];

    try {
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile(file.path);  // Đọc file từ đường dẫn

        const worksheet = workbook.worksheets[0];  // Lấy sheet đầu tiên
        const colCount = worksheet.actualColumnCount;    //// Đếm số cột thực tế có dữ liệu
        const rowCount = worksheet.rowCount;       // Đếm số dòng
        // Duyệt qua các dòng còn lại và thêm vào bảng
        for (let rowNumber = 2; rowNumber <= rowCount; rowNumber++) {
            const row = [];
            // Duyệt qua từng cột theo số cột đã xác định
            for (let colNumber = 1; colNumber <= colCount; colNumber++) {
                const cell = worksheet.getRow(rowNumber).getCell(colNumber);
                row.push(cell.value || null);  // Đảm bảo không có giá trị undefined
            }
            // Nếu tất cả các ô trong hàng đều null, thì bỏ qua hàng đó
            if (row.every(cell => cell === null)) continue;
            // Thêm hàng vào bảng
            table.push(row);
        }


    } catch (error) {
        console.error("Error while converting Excel to DataTable:", error);
        return null;
    }
    return table;
}


// Hàm chuyển đổi file excel thành  json
async function convertExcelToJson(filePath) {
    try {
        // Đọc file Excel từ đường dẫn
        const workbook = XLSX.readFile(filePath);

        // Lấy sheet đầu tiên
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        // Chuyển đổi sheet sang định dạng JSON
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: null });
        // Chuyển đổi đối tượng JSON thành chuỗi JSON
        const jsonString = JSON.stringify(jsonData, null, 2);  // null, 2 để định dạng chuỗi JSON cho dễ đọc

        return jsonString;
    } catch (error) {
        console.error('Lỗi khi chuyển đổi Excel sang JSON:', error);
        return null;
    }
}

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
                            Z: item.Z,
                            IMEI_DCU: null
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

module.exports = { post };