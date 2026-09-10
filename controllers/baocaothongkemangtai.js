const { find } = require('../db_apis/baocaothongkemangtai.js');

const validateInput = (req) => {
    const input = {
        danhmucid: req.body.v_Danhmucid,
        tungay: req.body.v_Tungay,
        denngay: req.body.v_Denngay,
        loaitai: req.body.v_Loaitai,
        canpha: req.body.v_Canpha,
        pagenum: req.body.v_pagenum,
        numrecs: req.body.v_numrecs,
        mataikhoan: req.body.v_mataikhoan
    };
    return input;
};


const post = async (req, res, next) => {
    try {
        if (!req.body.v_Danhmucid) {
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


