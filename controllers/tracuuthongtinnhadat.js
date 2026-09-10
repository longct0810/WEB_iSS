const { find } = require('../db_apis/tracuuthongtinnhadat.js');

const validateInput = (req) => {
  const input = {
    khuvucid: req.body.v_khuvucid,
    loaibds: req.body.v_loai_bds
  };
  return input;
};

let post = async (req, res, next) => {
  try {
    if (!req.body.v_khuvucid || !req.body.v_loai_bds) {
      return res.status(400).json({
        message: "Thiếu thông tin parameters"
      })
    }
    const input = validateInput(req);
    const result = await find(input);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}


module.exports = { post };


