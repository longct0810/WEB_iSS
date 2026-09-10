const employees = require('../db_apis/quanly_ds_chungloaicongto.js');

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
 
  };
  return employee;
}

async function post(req, res, next) {
  try {
    let employee = getEmployeeFromRec(req);
    console.log("NHẬN: "+ JSON.stringify(employee));
     employee = await employees.find(employee);
     res.status(200).json(employee);
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

