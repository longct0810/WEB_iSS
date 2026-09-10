const { find } = require('../db_apis/khaithacdulieu_laychisocongto.js');

const validateInput = (req) => {
    const input = {
        danhmucid: req.body.v_danhmucid,
        locdulieu: req.body.v_locdulieu,
        loaihienthi: req.body.v_loaihienthi,
        ngay: req.body.v_ngay,
        Gio: req.body.v_gio,
        LoaiPha: req.body.v_loaipha,
        SoTrang: req.body.v_sotrang,
        SoDong: req.body.v_sodong,
        mataikhoan: req.body.v_mataikhoan,
        LoaiChiSo: req.body.v_loaichiso,
        PhaCongTo: req.body.v_phacongto
    };
    return input;
};


const post = async (req, res, next) => {
    try {
        if (!req.body.v_danhmucid) {
            return res.status(400).json({
                message: "Chưa nhập danh mục"
            })
        }
        const input = validateInput(req);
        const result = await find(input);
        res.status(200).json(result);
    } catch (err) {
        next(err);
    }
};

module.exports = { post };


