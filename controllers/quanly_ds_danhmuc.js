const { executeCursor } = require("./oracleConnection");


const post = async (req, res, next) => {
  try {
    const result = await find();

    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

async function find() {
  try {
    return await executeCursor(
      "CALL p_danhmuc_ds_ql_danhmuc($1)",
      [       
        "cv_1"
      ],
      "cv_1"
    );
  } catch (err) {
    console.error("PostgreSQL error:", err);
    return "failure";
  }
}

module.exports = {
  post
};




