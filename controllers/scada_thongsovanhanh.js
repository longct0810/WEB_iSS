const { find } = require('../db_apis/scada_thongsovanhanh.js');

const validateInput = (req) => {
    const input = {
        id_thietbi: req.body.v_idthietbi,
        tungay: req.body.v_tungay,
        denngay: req.body.v_denngay
    };
    return input;
};


const post = async (req, res, next) => {
    try {
        if (!req.body.v_idthietbi) {
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


