const { find } = require('../db_apis/canhbao_save_udm.js');

const validateInput = (req) => {
    const input = {
        v_tu: req.body.v_tu,
        v_udm: req.body.v_udm
    };
    return input;
};


const post = async (req, res, next) => {
    try {
        if (!req.body.v_tu || !req.body.v_udm) {
            return res.status(400).json({
                message: "tu, Udm không được để trống"
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




