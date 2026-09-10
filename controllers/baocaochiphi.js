const inputService = require('../db_apis/baocaochiphi.js');


const validateInput = (req) => {
  const input = {
    maduan: req.body.v_maduan,
    mahangmuc: req.body.v_mahangmuc
  };
  return input;
};


const post = async (req, res, next) => {
  try {
    if (!req.body.v_maduan || !req.body.v_mahangmuc) {
      return res.status(400).json({
        message: "Thiếu thông tin mã dự án, mã hạng mục"
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


