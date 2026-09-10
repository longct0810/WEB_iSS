const { find } = require('../db_apis/canhbao_apdung_udm.js');

const validateInput = (req) => {
    const input = {
        v_apdung: req.body.v_apdung,
        v_mataikhoanthuchien: req.body.v_mataikhoanthuchien,
        v_danhmucid: req.body.v_danhmucid,

    };
    return input;
};


const post = async (req, res, next) => {
    try {
        if (!req.body.v_apdung) {
            return res.status(400).json({
                message: "Vui lòng chọn công thức udm để áp"
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




