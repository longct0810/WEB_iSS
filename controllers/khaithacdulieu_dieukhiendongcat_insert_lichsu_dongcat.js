const { find } = require('../db_apis/khaithacdulieu_dieukhiendongcat_insert_lichsu_dongcat.js');

const validateInput = (req) => {
    console.log(req.body);
    const input = {
        imei: req.body.v_imei,
        socongto: req.body.v_socongto,
        event: parseInt(req.body.v_event),
        mataikhoan: req.body.v_mataikhoan
    };
    return input;
};


const post = async (req, res, next) => {
    try {
        if (!req.body.v_imei || !req.body.v_socongto) {
            return res.status(400).json({
                message: "Chưa nhập imei, socongto"
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


