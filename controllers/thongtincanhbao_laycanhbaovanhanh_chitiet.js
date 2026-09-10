const { find } = require('../db_apis/thongtincanhbao_laycanhbaovanhanh_chitiet.js');

const validateInput = (req) => {
    const input = {
        danhmucid: req.body.v_danhmucid,
        meterid: req.body.v_meterid,
        tungay: req.body.v_tungay,
        denngay: req.body.v_denngay,
        loaicanhbao: req.body.v_loaicanhbao
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
        if (!req.body.v_tungay) {
            return res.status(400).json({
                message: "Chưa chọn từ ngày"
            })
        }
        if (!req.body.v_denngay) {
            return res.status(400).json({
                message: "Chưa chọn đến ngày"
            })
        }
        if (!req.body.v_loaicanhbao) {
            return res.status(400).json({
                message: "Chưa nhập loại cảnh báo"
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


