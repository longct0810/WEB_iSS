const inputService = require('../db_apis/chitietthongtinnhadat.js');


const validateInput = (req) => {
  const input = {
    id: req.body.v_id
  };
  return input;
};


const post = async (req, res, next) => {
  try {
    if (!req.body.v_id) {
      return res.status(400).json({
        message: "Thiếu thông tin parameters"
      })
    }
    const input = validateInput(req);
    //console.log(input);
    const result = await inputService.find(input);
    // console.log(result);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

module.exports = { post };


