const { find } = require('../db_apis/khaibaovttb_laythongtin_hangmuc.js');



const validateInput = (req) => {
  const input = {
    ma_duan: req.body.v_maduan
  };
  return input;
};


const post = async (req, res, next) => {
  try {
    if (!req.body.v_maduan) {
      return res.status(400).json({
        message: "Chưa nhập mã dự án"
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


