const Joi = require('@hapi/joi');

const Schema = {
    thongtinnhadatSchema: Joi.object({
        v_idkhuvuc: Joi.string().max(255).required(),
        v_tenbds: Joi.string().max(255).required(),
        v_giaban: Joi.number().required().options({ convert: false }).min(0),
        v_thoidiem: Joi.string().max(255).required().allow("").optional(),
        v_loaibds: Joi.number().integer().required().valid(0, 1).options({ convert: false }), //0: nhà, 1: đất
        v_trangthai: Joi.number().integer().required().valid(0, 1).options({ convert: false }), // --0: chưa bán được, 1: bán được
        v_dientich_thucte: Joi.number().required().options({ convert: false }).min(1).allow(null),
        v_dientich_so: Joi.number().required().options({ convert: false }).min(1).allow(null),
        v_sotang: Joi.number().integer().required().options({ convert: false }).allow(null),
        v_loaimai: Joi.number().integer().required().valid(0, 1).options({ convert: false }).allow(null), //0: mái ng, 1: mái bằng
        v_so_mattien: Joi.number().required().options({ convert: false }).min(1).allow(null),
        v_kichthuoc_mattien: Joi.number().required().options({ convert: false }).min(1).allow(null),
        v_kichthuoc_longdong: Joi.number().required().options({ convert: false }).min(1).allow(null),
        v_kichthuoc_viahe: Joi.number().required().options({ convert: false }).min(1).allow(null),
        v_loaiduong: Joi.number().integer().required().valid(0, 1, 2).options({ convert: false }),//0: Đường bê tông, 1: đường đất, 2: Đường nhựa
        v_khoangcach_duonglon: Joi.number().required().options({ convert: false }).min(1).allow(null),
        v_huong: Joi.string().max(255).required(),
        v_nohau: Joi.number().integer().required().valid(0, 1).options({ convert: false }),
        v_hinhthai_thuadat: Joi.number().integer().required().valid(0, 1, 2).options({ convert: false }),//0: vuông vức, 1: Hình chữ L, 2: tương đối vuông vức
        v_hientrang_sudung: Joi.number().integer().required().valid(0, 1, 2).options({ convert: false }).allow(null),//0: cho thuê, 1: kinh doanh, 2: nhà ở
        v_tinhtrang_congtrinh: Joi.number().integer().required().options({ convert: false }).allow(null),//0: đã giao dịch, chưa giao dịch
        v_nguontin: Joi.number().integer().required().valid(0, 1).options({ convert: false }), //0: trực tiếp, 1: internet
        v_mota: Joi.string().max(255).allow("").optional(),
        v_nhanvien_id: Joi.number().integer().required().options({ convert: false }),
        v_hinhanh: Joi.string().allow("").optional()
    })
}

module.exports = Schema;