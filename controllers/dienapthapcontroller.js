const inputService = require('../db_apis/dienapthapdb.js');


const validateInput = (req) => {
  const input = {
    tungay: req.body.v_tungay,
    denngay: req.body.v_denngay,
    imei: req.body.v_imei
  };
  return input;
};


const post = async (req, res, next) => {
  try {
    if (!req.body.v_tungay || !req.body.v_imei) {
      return res.status(400).json({
        message: "Thiếu thông tin"
      })
    }
    const input = validateInput(req);
    const result = await inputService.find(input);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

module.exports = { post };


