const employees = require('../db_apis/canhbao_cauhinh_save_canhbaovanhanh.js');

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
        v_MATAIKHOAN: req.body.v_MATAIKHOAN,
        v_DANHMUCID: req.body.v_DANHMUCID,
        v_UTREN: req.body.v_UTREN,
        v_UDUOI: req.body.v_UDUOI,
        v_UTILE: req.body.v_UTILE,
        v_U_STATUS: req.body.v_U_STATUS,
        v_ITREN: req.body.v_ITREN,
        v_IDUOI: req.body.v_IDUOI,
        v_IO: req.body.v_IO,
        v_I_STATUS: req.body.v_I_STATUS,
        v_CB_COSPHI: req.body.v_CB_COSPHI,
        v_COS_STATUS: req.body.v_COS_STATUS,
        v_ANGELTREN: req.body.v_ANGELTREN,
        v_ANGELDUOI: req.body.v_ANGELDUOI,
        v_ANGLE_STATUS: req.body.v_ANGLE_STATUS
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

