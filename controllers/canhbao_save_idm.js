const { find } = require('../db_apis/canhbao_save_idm.js');

const validateInput = (req) => {
    const input = {
        v_ti: req.body.v_ti,
        v_idm: req.body.v_idm
    };
    return input;
};


const post = async (req, res, next) => {
    try {
        if (!req.body.v_ti || !req.body.v_idm) {
            return res.status(400).json({
                message: "ti, Idm không được để trống"
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




