const { find } = require('../db_apis/lay_tsvh_din.js');

function validateInput(req) {
    const employee = {
        v_imei: req.body.v_imei,
        v_time: req.body.v_time
    };

    return employee;
}

async function post(req, res, next) {
    try {

        const requiredFields = {
            v_imei: "Chưa nhập imei",
            v_time: "Chưa nhập thời gian",
        };

        for (const [field, message] of Object.entries(requiredFields)) {
            if (!req.body[field]) {
                return res.status(400).json({ message: message });
            }
        }
        const input = validateInput(req);
        const result = await find(input);
        res.status(200).json(result);
    } catch (err) {
        next(err);
    }
}
function toNumber(value) {
    const num = Number(value);
    return isNaN(num) ? null : num;
}
module.exports = { post };

