const { find } = require('../db_apis/khaithacdulieu_laychisocongto_dscongto.js');

const validateInput = (req) => {
    const input = {
        meterid: req.body.v_meterid
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


