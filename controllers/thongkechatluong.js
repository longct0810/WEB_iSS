const { find } = require('../db_apis/thongkechatluong.js');

const validateInput = (req) => {
    const input = {
        danhmucid: req.body.v_danhmucid,
        ngay: req.body.v_ngay,
        starttime: req.body.v_starttime,
        currenttime: req.body.v_currenttime,
        mataikhoan: req.body.v_mataikhoan
    };
    return input;
};


const post = async (req, res, next) => {
    try {
        if (!req.body.v_danhmucid) {
            return res.status(400).json({
                message: "Chưa chọn danh mục"
            })
        }
        if (!req.body.v_ngay) {
            return res.status(400).json({
                message: "Chưa chọn ngày"
            })
        }
        if (!req.body.v_starttime || !req.body.v_currenttime) {
            return res.status(400).json({
                message: "Chưa chọn thời gian"
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


