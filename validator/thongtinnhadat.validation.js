const { thongtinnhadatSchema } = require("../validator/thongtinnhadat.schema.js");
module.exports = {
    addthongtinnhadatValidation: async (req, res, next) => {
        const value = await thongtinnhadatSchema.validate(req.body);
        if (value.error) {
            res.json({
                success: 0,
                message: value.error.details[0].message
            })
        } else {
            next();
        }
    }
};