const db = require("../services/database");

/**
 * Lấy danh sách tài khoản
 */
exports.getDanhSach = async (req, res) => {
    try {
        const sql = `
            SELECT
                mataikhoan,
                taikhoan,
                matkhau,
                danhmucid,
                loaitaikhoan,
                ngaytao,
                tennguoidung,
                email,
                sodienthoai,
                diachi,
                khoa,
                hienthi,
                quantri,
                dangnhap_thatbai,
                ma_otp,
                checkmail,
                ma_nhanvien,
                danhmuc_lo,
                password,
                numlimit,
                ngay_doi_mk,
                phai_doi_mk,
                hieuluc_mk,
                data_hash
            FROM ht_taikhoan
            ORDER BY mataikhoan
        `;

        const rs = await db.execute(sql);
        res.json(rs.rows);

    } catch (err) {
        console.log(err);
        res.status(500).json(err.message);
    }
};

/**
 * Lấy thông tin 1 tài khoản
 */
exports.getById = async (req, res) => {

    try {

        const sql = `
            SELECT *
            FROM ht_taikhoan
            WHERE mataikhoan=$1
        `;

        const rs = await db.execute(sql, [
            req.params.id
        ]);

        res.json(rs.rows);

    } catch (err) {
        console.log(err);
        res.status(500).json(err.message);
    }

};


/**
 * Thêm tài khoản
 */
exports.them = async (req, res) => {

    try {

        const body = req.body;

        const sql = `
        INSERT INTO ht_taikhoan
        (
            taikhoan,
            matkhau,
            tennguoidung,
            email,
            sodienthoai,
            diachi,
            danhmucid,
            loaitaikhoan,
            khoa,
            hienthi,
            quantri,
            ma_nhanvien,
            password,
            ngaytao
        )
        VALUES
        (
            $1,$2,$3,$4,$5,$6,$7,$8,
            COALESCE($9,0),
            COALESCE($10,1),
            COALESCE($11,0),
            $12,
            $13,
            NOW()
        )
        RETURNING mataikhoan
        `;

        const rs = await db.execute(sql, [

            body.taikhoan,
            body.matkhau,
            body.tennguoidung,
            body.email,
            body.sodienthoai,
            body.diachi,
            body.danhmucid,
            body.loaitaikhoan,
            body.khoa,
            body.hienthi,
            body.quantri,
            body.ma_nhanvien,
            body.password

        ]);

        res.json({
            success: true,
            mataikhoan: rs.rows[0].mataikhoan
        });

    } catch (err) {

        console.log(err);
        res.status(500).json(err.message);

    }

};


/**
 * Sửa tài khoản
 */
exports.sua = async (req, res) => {

    try {

        const body = req.body;

        const sql = `
        UPDATE ht_taikhoan
        SET
            taikhoan=$1,
            tennguoidung=$2,
            email=$3,
            sodienthoai=$4,
            diachi=$5,
            danhmucid=$6,
            loaitaikhoan=$7,
            khoa=$8,
            hienthi=$9,
            quantri=$10,
            ma_nhanvien=$11
        WHERE mataikhoan=$12
        `;

        await db.execute(sql, [

            body.taikhoan,
            body.tennguoidung,
            body.email,
            body.sodienthoai,
            body.diachi,
            body.danhmucid,
            body.loaitaikhoan,
            body.khoa,
            body.hienthi,
            body.quantri,
            body.ma_nhanvien,
            body.mataikhoan

        ]);

        res.json({
            success: true
        });

    } catch (err) {

        console.log(err);
        res.status(500).json(err.message);

    }

};


/**
 * Đổi mật khẩu
 */
exports.doiMatKhau = async (req, res) => {

    try {

        const sql = `
        UPDATE ht_taikhoan
        SET
            matkhau=$1,
            password=$2,
            ngay_doi_mk=NOW()
        WHERE mataikhoan=$3
        `;

        await db.execute(sql, [

            req.body.matkhau,
            req.body.password,
            req.body.mataikhoan

        ]);

        res.json({
            success: true
        });

    } catch (err) {

        console.log(err);
        res.status(500).json(err.message);

    }

};


/**
 * Khóa / mở khóa
 */
exports.khoa = async (req, res) => {

    try {

        await db.execute(

            `UPDATE ht_taikhoan
             SET khoa=$1
             WHERE mataikhoan=$2`,

            [
                req.body.khoa,
                req.body.mataikhoan
            ]

        );

        res.json({
            success: true
        });

    } catch (err) {

        console.log(err);
        res.status(500).json(err.message);

    }

};


/**
 * Xóa
 */
exports.xoa = async (req, res) => {

    try {

        await db.execute(

            `DELETE FROM ht_taikhoan
             WHERE mataikhoan=$1`,

            [
                req.body.mataikhoan
            ]

        );

        res.json({
            success: true
        });

    } catch (err) {

        console.log(err);
        res.status(500).json(err.message);

    }

};