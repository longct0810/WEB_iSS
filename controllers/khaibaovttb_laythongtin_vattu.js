const { find } = require('../db_apis/khaibaovttb_laythongtin_vattu.js');



const validateInput = (req) => {
  const input = {
    ma_hangmuc: req.body.v_mahangmuc
  };
  return input;
};


const post = async (req, res, next) => {
  try {
    if (!req.body.v_mahangmuc) {
      return res.status(400).json({
        message: "Chưa nhập mã hạng mục"
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


