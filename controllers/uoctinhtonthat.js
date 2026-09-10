const inputService = require('../db_apis/uoctinhtonthat.js');


const validateInput = (req) => {
    const input = {
        danhmucid: req.body.v_danhmucid,
        tungay: req.body.v_tungay,
        denngay: req.body.v_denngay,
        ddo_daunguon: req.body.v_ddo_daunguon
    };
    return input;
};


const post = async (req, res, next) => {
    try {
        if (!req.body.v_danhmucid) {
            return res.status(400).json({
                message: "Chưa nhập danh mục"
            })
        }
        const input = validateInput(req);
        const result = await inputService.find(input);
        res.status(200).json(result);
    } catch (err) {
        next(err);
    }
};

module.exports = { post };


