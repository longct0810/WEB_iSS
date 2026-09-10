const { find } = require('../db_apis/khaibaovttb_laythongtin_duan.js');



let get = async (req, res, next) => {
  try {
    const context = {};
    const rows = await find(context);
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


module.exports = { get };


