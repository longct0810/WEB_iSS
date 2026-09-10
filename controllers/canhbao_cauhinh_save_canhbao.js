const employees = require('../db_apis/canhbao_cauhinh_save_canhbao.js');

async function get(req, res, next) {
    try {
        const context = {};

        context.id = parseInt(req.params.id, 10);

        const rows = await employees.find(context);

        if (req.params.id) {
            if (rows.length === 1) {
                res.status(200).json(rows[0]);
            } else {
                res.status(404).end();
            }
        } else {
            res.status(200).json(rows);
        }
    } catch (err) {
        next(err);
    }
}

module.exports.get = get;

function getEmployeeFromRec(req) {
    const employee = {
        cambien_nhiet_duoi: req.body.v_cambien_nhiet_duoi,
        cambien_nhiet_tren: req.body.v_cambien_nhiet_tren,
        cambien_nhiet_type: req.body.v_cambien_nhiet_type,
        cambien_nhiet_check: req.body.v_cambien_nhiet_check,
        cambien_doam_duoi: req.body.v_cambien_doam_duoi,
        cambien_doam_tren: req.body.v_cambien_doam_tren,
        cambien_doam_type: req.body.v_cambien_doam_type,
        cambien_doam_check: req.body.v_cambien_doam_check,
        nhietdo_fi_duoi: req.body.v_nhietdo_fi_duoi,
        nhietdo_fi_tren: req.body.v_nhietdo_fi_tren,
        nhietdo_fi_type: req.body.v_nhietdo_fi_type,
        nhietdo_fi_check: req.body.v_nhietdo_fi_check,
        dong_fi_duoi: req.body.v_dong_fi_duoi,
        dong_fi_tren: req.body.v_dong_fi_tren,
        dong_fi_type: req.body.v_dong_fi_type,
        dong_fi_check: req.body.v_dong_fi_check,
        cambien_khi_duoi: req.body.v_cambien_khi_duoi,
        cambien_khi_tren: req.body.v_cambien_khi_tren,
        cambien_khi_type: req.body.v_cambien_khi_type,
        cambien_khi_check: req.body.v_cambien_khi_check,
        dienap_pin_type: req.body.v_dienap_pin_type,
        dienap_pin_check: req.body.v_dienap_pin_check,
    };
    return employee;
}

async function post(req, res, next) {
    try {
        let employee = getEmployeeFromRec(req);
        console.log("NHẬN: " + employee);
        employee = await employees.find(employee);
        res.status(201).json(employee);
    } catch (err) {
        next(err);
    }
}

module.exports.post = post;

async function put(req, res, next) {
    try {
        let employee = getEmployeeFromRec(req);

        employee.employee_id = parseInt(req.params.id, 10);

        employee = await employees.update(employee);

        if (employee !== null) {
            res.status(200).json(employee);
        } else {
            res.status(404).end();
        }
    } catch (err) {
        next(err);
    }
}

module.exports.put = put;

async function del(req, res, next) {
    try {
        const id = parseInt(req.params.id, 10);

        const success = await employees.delete(id);

        if (success) {
            res.status(204).end();
        } else {
            res.status(404).end();
        }
    } catch (err) {
        next(err);
    }
}

module.exports.delete = del;

