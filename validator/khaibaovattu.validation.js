const { khaibaovattuSchema } = require("./khaibaovattu.schema.js");
module.exports = {
    addkhaibaovattuValidation: async (req, res, next) => {
        const value = await khaibaovattuSchema.validate(req.body);
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