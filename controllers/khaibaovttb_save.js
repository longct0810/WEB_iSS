const inputService = require('../db_apis/khaibaovttb_save.js');


const validateInput = (req) => {
  const input = {
    maduan: req.body.v_maduan,
    mahangmuccha: req.body.v_mahangmuccha,
    mahangmuc: req.body.v_mahangmuc,
    mavattu: req.body.v_mavattu,
    mancc: req.body.v_mancc,
    soluong: req.body.v_soluong,
    dongia: req.body.v_dongia,
    donvitinh: req.body.v_donvitinh,
    thoidiem: req.body.v_thoidiem,
    mota: req.body.v_mota,
    manv: req.body.v_manv
  };
  return input;
};


const post = async (req, res, next) => {
  try {

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


