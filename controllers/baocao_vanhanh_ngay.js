// controllers/baocao_vanhanh_ngay.js

const report = require('../db_apis/baocao_vanhanh_ngay.js');

async function post(req, res, next) {
    try {

        const context = {
            v_idthietbi: req.body.v_idthietbi,
            v_tungay: req.body.v_tungay,
            v_denngay: req.body.v_denngay
        };

        const rows = await report.find(context);

        res.status(200).json(rows);

    } catch (err) {
        next(err);
    }
}

module.exports.post = post;