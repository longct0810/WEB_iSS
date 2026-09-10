const { find } = require('../db_apis/khaithacdulieu_laychiso_pmax.js');

const validateInput = (req) => {
    const input = {
        danhmucid: req.body.v_danhmucid,
        locdulieu: req.body.v_locdulieu,
        ngay: req.body.v_ngay,
        loaipha: req.body.v_loaipha,
        sotrang: req.body.v_sotrang,
        sodong: req.body.v_sodong,
        mataikhoan: req.body.v_mataikhoan,
        loaichiso: req.body.v_loaichiso
    };
    return input;
};


const post = async (req, res, next) => {
    try {
        if (!req.body.v_danhmucid) {
            return res.status(400).json({
                message: "Chưa nhập danh mục, lọc dữ liệu"
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


