const Joi = require('@hapi/joi');

const Schema = {
    khaibaovattuSchema: Joi.object({
        v_maduan: Joi.string().max(255).required(),
        v_mahangmuc: Joi.string().max(255).required(),
        v_mahangmuccha: Joi.string().max(255).required(),
        v_mavattu: Joi.string().max(255).required(),
        v_mancc: Joi.string().max(255).required(),
        v_soluong: Joi.number().integer().required().options({ convert: false }), //0: nhà, 1: đất
        v_dongia: Joi.number().required().options({ convert: false }), // --0: chưa bán được, 1: bán được
        v_donvitinh: Joi.string().max(255).required(),
        v_thoidiem: Joi.string().max(255).required(),
        v_mota: Joi.string().max(255).allow("").optional(),
        v_manv: Joi.number().integer().required().options({ convert: false }), //0: mái ng, 1: mái bằng

    })
}

module.exports = Schema;