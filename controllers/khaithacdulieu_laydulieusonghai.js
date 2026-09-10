const { find } = require('../db_apis/khaithacdulieu_laydulieusonghai.js');

const validateInput = (req) => {
    const input = {
        MeterId: req.body.MeterId,
        SoCongTo: req.body.SoCongTo,
        TuNgay: req.body.TuNgay,
        SoDong: req.body.SoDong,
        SoTrang: req.body.SoTrang,
        gio: req.body.gio,
        mataikhoan: req.body.mataikhoan
    };
    return input;
};


const post = async (req, res, next) => {
    try {
        if (!req.body.MeterId || !req.body.SoCongTo) {
            return res.status(400).json({
                message: "Chưa nhập meterid và số công tơ"
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


