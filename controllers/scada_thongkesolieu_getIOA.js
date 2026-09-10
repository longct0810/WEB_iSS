const { executeCursor } = require("./oracleConnection");
function validateInput(req) {
    return {
        id_thietbi: req.body.v_idthietbi
    };
}

const post = async (req, res, next) => {
    try {
        if (!req.body.v_idthietbi) {
            return res.status(400).json({
                message: "Chưa nhập thiết bị"
            });
        }

        const input = validateInput(req);
        const result = await find(input);

        res.status(200).json(result);
    } catch (err) {
        next(err);
    }
};

async function find(context) {
    const { id_thietbi } = context;

    return await executeCursor(
        "CALL p_scada_get_ioa($1,$2)",
        [
            id_thietbi,
            "cv_1"
        ],
        "cv_1"
    );
}

module.exports = {
    post
};

