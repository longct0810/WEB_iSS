const { find } = require('../db_apis/quanly_ds_danhmuc_suathietbi.js');

const validateInput = (req) => {
    const input = {
        idthietbi: req.body.v_idthietbi,
        tenthietbi: req.body.v_tenthietbi,
        ip: req.body.v_ip,
        port: req.body.v_port,
        kinhdo: req.body.v_kinhdo,
        vido: req.body.v_vido,
        sosim: req.body.v_sosim
    };
    return input;
};


const post = async (req, res, next) => {
    try {
        if (!req.body.v_idthietbi) {
            return res.status(400).json({
                message: "Chưa chọn thiết bị"
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


