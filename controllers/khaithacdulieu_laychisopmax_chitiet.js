const { find } = require('../db_apis/khaithacdulieu_laychisopmax_chitiet.js');

const validateInput = (req) => {
    const input = {
        meterid: req.body.v_meterid,
        socongto: req.body.v_socongto,
        tungay: req.body.v_tungay,
        denngay: req.body.v_denngay,
        sotrang: req.body.v_sotrang,
        sodong: req.body.v_sodong,
        loaichiso: req.body.v_loaichiso,
        mataikhoan: req.body.v_mataikhoan
    };
    return input;
};


const post = async (req, res, next) => {
    try {
        if (!req.body.v_meterid) {
            return res.status(400).json({
                message: "Chưa nhập meterid"
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


