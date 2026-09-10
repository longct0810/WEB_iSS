const { executeCursor } = require('./oracleConnection');
function getEmployeeFromRec(req) {
    const employee = {
        tungay: req.body.v_tungay,
        denngay: req.body.v_denngay,
        danhmucId: req.body.v_danhmucId
    };
    return employee;
}

async function post(req, res, next) {
    try {
        let employee = getEmployeeFromRec(req);
        var rows = await find(employee);
        res.status(200).json(rows);
    } catch (err) {
        next(err);
    }
}
async function find(context) {
   try {
        const { tungay, denngay, danhmucId } = context;

        return await executeCursor(
            "CALL p_taikhoan_thongke_dangnhap($1,$2,$3,$4)",
            [
                tungay,
                denngay,
                danhmucId,
                "cv_1"
            ],
            "cv_1"
        );
    } catch (err) {
        console.error("find - p_thongke_dangnhap error:", err);
        throw err;
    }

}

async function getthongkechitiet(req, res, next) {
    try {

        let mataikhoan = parseInt(req.body.v_mataikhoan);
        var rows = await f_getthongkechitiet(mataikhoan);

        res.status(200).json(rows);
    } catch (err) {
        next(err);
    }
}
async function f_getthongkechitiet(mataikhoan) {
     try {
        return await executeCursor(
            "CALL p_taikhoan_thongke_dangnhap_chitiet($1,$2)",
            [
                Number(mataikhoan),
                "cv_1"
            ],
            "cv_1"
        );
    } catch (err) {
        console.error(
            "f_getthongkechitiet - p_taikhoan_thongke_dangnhap_chitiet error:",
            err
        );
        throw err;
    }

}

module.exports = { post, getthongkechitiet };





