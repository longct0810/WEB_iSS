const { find } = require('../db_apis/quanly_ds_danhmuc_themthietbi.js');

const validateInput = (req) => {
    const input = {
        danhmucid: req.body.v_danhmucid,
        idthietbi: req.body.v_idthietbi
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

        const result = await find(input);
        res.status(200).json(result);
    } catch (err) {
        next(err);
    }
};

module.exports = { post };


