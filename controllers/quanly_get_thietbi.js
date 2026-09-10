const { find } = require('../db_apis/quanly_get_thietbi.js');

const validateInput = (req) => {
    const input = {
        imei: req.body.v_imei
    };
    return input;
};


const post = async (req, res, next) => {
    try {
        if (!req.body.v_imei) {
            return res.status(400).json({
                message: "Chưa nhập thiết bị"
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


