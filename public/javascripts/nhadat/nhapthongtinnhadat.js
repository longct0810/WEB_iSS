$(document).ready(function () {
    get_danhmuc(0, "01");
    $('.datepicker-default').pickadate({
        monthPrev: '&larr;',
        monthNext: '&rarr;',
        weekdaysShort: ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'],
        showMonthsFull: true,
        today: 'Hôm nay',
        clear: 'Xóa',
        close: 'Đóng',
        formatSubmit: 'dd/mm/yyyy',
        format: 'dd/mm/yyyy',
        monthsFull: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'],
        monthsShort: ['Th 1', 'Th 2', 'Th 3', 'Th 4', 'Th 5', 'Th 6', 'Th 7', 'Th 8', 'Th 9', 'Th 10', 'Th 11', 'Th 12']
    });
    $("#btn_luuthongtin_dat").click(function () {
        f_Save_Dat();
    });
    $("#btn_luuthongtin_nha").click(function () {
        f_Save_Nha();
    });

    $("#txt_giaban_nha").change(function () {

        var dientich_thucte = $("#txt_dientich_thucte_nha").val();
        if (dientich_thucte != "") {
            var giaban = $("#txt_giaban_nha").val();
            var giabanm2 = parseFloat(giaban * 1000000000) / parseFloat(dientich_thucte);
            $("#txt_giabantext_nha").html((giabanm2 / 1000000).toFixed(2) + " Triệu / m<sup>2</sup>");
        }
    });

    $("#txt_dientich_thucte_nha").change(function () {

        var giaban = $("#txt_giaban_nha").val();
        if (giaban != "") {
            var dientich_thucte = $("#txt_dientich_thucte_nha").val();
            var giabanm2 = parseFloat(giaban * 1000000000) / parseFloat(dientich_thucte);
            $("#txt_giabantext_nha").html((giabanm2 / 1000000).toFixed(2) + " Triệu / m<sup>2</sup>");
        }
    });

    $("#txt_giaban_dat").change(function () {

        var dientich_thucte = $("#txt_dientich_thucte_dat").val();
        if (dientich_thucte != "") {
            var giaban = $("#txt_giaban_dat").val();
            var giabanm2 = parseFloat(giaban * 1000000000) / parseFloat(dientich_thucte);
            $("#txt_giabantext_dat").html((giabanm2 / 1000000).toFixed(2) + " Triệu / m<sup>2</sup>");
        }
    });

    $("#txt_dientich_thucte_dat").change(function () {

        var giaban = $("#txt_giaban_dat").val();
        if (giaban != "") {
            var dientich_thucte = $("#txt_dientich_thucte_dat").val();
            var giabanm2 = parseFloat(giaban * 1000000000) / parseFloat(dientich_thucte);
            $("#txt_giabantext_dat").html((giabanm2 / 1000000).toFixed(2) + " Triệu / m<sup>2</sup>");
        }
    });
})
function get_danhmuc(type, code) {
    if (type == 0) {
        $.ajax({
            type: "POST",
            url: "/api/ds_danhmuc",
            contentType: "application/json",
            data: JSON.stringify({ type: type, code: code }),
            success: function (data) {
                $("#select_tp").html("<option value='-1'> -- Chọn thành phố --</option>");
                $.each(data, function (k, v) {
                    $("#select_tp").append("<option value='" + JSON.parse(v[0]).ID_KHUVUC + "'>" + JSON.parse(v[0]).TEN_KHUVUC + "</option>");
                })
            }
        });
    } else {
        $.ajax({
            type: "POST",
            url: "/api/ds_danhmuc",
            contentType: "application/json",
            data: JSON.stringify({ type: type, code: code }),
            success: function (data) {

                $.each(data, function (k, v) {
                    if (type == 1) {
                        $("#select_quan").append("<option value='" + JSON.parse(v[0]).ID_KHUVUC + "'>" + JSON.parse(v[0]).TEN_KHUVUC + "</option>");

                    }
                    else if (type == 2) {
                        $("#select_phuong").append("<option value='" + JSON.parse(v[0]).ID_KHUVUC + "'>" + JSON.parse(v[0]).TEN_KHUVUC + "</option>");

                    }

                })
            }
        });

    }

    $("#select_tp").select2();
    $("#select_tp").on("change", function () {
        var selectedTp = $(this).val();
        $("#select_quan").html("<option value='-1'> -- Chọn Quận --</option>");
        $("#select_phuong").html("<option value='-1'> -- Chọn Phường --</option>");
        get_danhmuc(1, selectedTp)
    });
    $("#select_quan").select2();
    $("#select_quan").on("change", function () {
        var selectedTp = $(this).val();
        $("#select_phuong").html("<option value='-1'> -- Chọn Phường --</option>");
        get_danhmuc(2, selectedTp)
    });
    $("#select_phuong").select2();
}

function f_Save_Dat() {

    var idkhuvuc_quan = $("#select_quan").val();
    var idkhuvuc_phuong = $("#select_phuong").val();
    var idkhuvuc = idkhuvuc_phuong != "-1" ? idkhuvuc_phuong : idkhuvuc_quan;
    var tenbds = $("#txtdiachi_dat").val();
    var dientich_so = $("#txt_dientich_trenso_dat").val();
    var dientich_thucte = $("#txt_dientich_thucte_dat").val();
    var kichthuoc_longdong = $("#txt_kichthuoc_longduong_dat").val();
    var kichthuoc_viahe = $("#txt_kichthuoc_viave").val();
    var loaiduong = $("#cbo_loaiduong_dat").val();
    var hinhthai_thuadat = $("#cbo_hinhthai_thuadat_dat").val();
    var huong = $("#txt_huong_dat").val();
    var mota = $("#txt_mota_dat").val();
    var somattien = $("#txt_somattien_dat").val();
    var kichthuoc_mattien = $("#txt_kichthuoc_mattien_dat").val();
    var khoangcach_duonglon = $("#txt_khoangcach_duonglon_dat").val();
    var tinhtrang_congtrinh = $("#txt_tinhtrang_congtrinh_dat").val();
    var nohau = $("#cb_nohau_dat").is(":checked");
    var trangthai = $("#cb_trangthai_dat").is(":checked");
    var giaban = $("#txt_giaban_dat").val();
    var nguontin = $("#cbo_nguontin_dat").val();
    var thoidiem = $("#dt_thoidiem_dat").val();
    var nhanvienid = 1;
    if (dientich_so == "" || tenbds == "" || dientich_thucte == "" || huong == "" || giaban == "" || idkhuvuc == "-1") {
        toastr.error("Vui lòng nhập đầy đủ khu vực, địa chỉ, diện tích, hướng, giá", "Thông báo", {
            positionClass: "toast-bottom-right",
            timeOut: 5e3,
            closeButton: !0,
            debug: !1,
            newestOnTop: !0,
            progressBar: !0,
            preventDuplicates: !0,
            onclick: null,
            showDuration: "300",
            hideDuration: "1000",
            extendedTimeOut: "1000",
            showEasing: "swing",
            hideEasing: "linear",
            showMethod: "fadeIn",
            hideMethod: "fadeOut",
            tapToDismiss: !1
        })
        return;
    }
    $.ajax({
        type: "POST",
        url: "/api/themthongtinnhadat",
        contentType: "application/json",
        data: JSON.stringify({
            v_idkhuvuc: idkhuvuc
            , v_tenbds: tenbds
            , v_giaban: parseFloat(giaban)
            , v_thoidiem: thoidiem
            , v_loaibds: 1
            , v_trangthai: trangthai == true ? 1 : 0
            , v_dientich_thucte: parseFloat(dientich_thucte)
            , v_dientich_so: parseFloat(dientich_so)
            , v_sotang: null
            , v_loaimai: null
            , v_so_mattien: parseFloat(somattien)
            , v_kichthuoc_mattien: parseFloat(kichthuoc_mattien)
            , v_kichthuoc_longdong: parseFloat(kichthuoc_longdong)
            , v_kichthuoc_viahe: parseFloat(kichthuoc_viahe)
            , v_loaiduong: parseInt(loaiduong)
            , v_khoangcach_duonglon: parseFloat(khoangcach_duonglon)
            , v_huong: huong
            , v_nohau: nohau == true ? 1 : 0
            , v_hinhthai_thuadat: parseFloat(hinhthai_thuadat)
            , v_hientrang_sudung: null
            , v_tinhtrang_congtrinh: parseInt(tinhtrang_congtrinh)
            , v_nguontin: parseInt(nguontin)
            , v_mota: mota
            , v_nhanvien_id: nhanvienid
            , v_hinhanh: ""
        }),
        success: function (data) {
            if (data.success == 0) {
                toastr.error(data.message, "Thông báo", {
                    positionClass: "toast-bottom-right",
                    timeOut: 5e3,
                    closeButton: !0,
                    debug: !1,
                    newestOnTop: !0,
                    progressBar: !0,
                    preventDuplicates: !0,
                    onclick: null,
                    showDuration: "300",
                    hideDuration: "1000",
                    extendedTimeOut: "1000",
                    showEasing: "swing",
                    hideEasing: "linear",
                    showMethod: "fadeIn",
                    hideMethod: "fadeOut",
                    tapToDismiss: !1
                })
            } else {

                toastr.success(data, "Thông báo", {
                    positionClass: "toast-bottom-right",
                    timeOut: 5e3,
                    closeButton: !0,
                    debug: !1,
                    newestOnTop: !0,
                    progressBar: !0,
                    preventDuplicates: !0,
                    onclick: null,
                    showDuration: "300",
                    hideDuration: "1000",
                    extendedTimeOut: "1000",
                    showEasing: "swing",
                    hideEasing: "linear",
                    showMethod: "fadeIn",
                    hideMethod: "fadeOut",
                    tapToDismiss: !1
                });
                clearFormDat();
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(jqXHR);
            console.log(textStatus);
            console.log(errorThrown);
        }
    });

}
function f_Save_Nha() {
    var idkhuvuc_quan = $("#select_quan").val();
    var idkhuvuc_phuong = $("#select_phuong").val();
    var idkhuvuc = idkhuvuc_phuong != "-1" ? idkhuvuc_phuong : idkhuvuc_quan;
    var tenbds = $("#txtdiachi_dat").val();
    var dientich_so = $("#txt_dientich_so_nha").val();
    var dientich_thucte = $("#txt_dientich_thucte_nha").val();
    var sotang = $("#txt_sotang_nha").val();
    var loaimai = $("#cbo_loaimai_nha").val();
    var kichthuoc_longdong = $("#txt_kichthuoc_longduong_nha").val();
    var kichthuoc_viahe = $("#txt_kichthuoc_viahe_nha").val();
    var loaiduong = $("#cbo_loaiduong_nha").val();
    var hinhthai_thuadat = $("#cbo_hinhthai_thuadat_nha").val();
    var huong = $("#txt_huong_nha").val();
    var mota = $("#txt_mota_nha").val();
    var somattien = $("#txt_somattien_nha").val();
    var kichthuoc_mattien = $("#txt_kichthuoc_matien_nha").val();
    var khoangcach_duonglon = $("#txt_kichthuoc_duonglon_nha").val();
    var tinhtrang_congtrinh = $("#txt_tinhtrang_congtrinh").val();
    var tinhtrang_sudung = $("#cbo_sudungdat_nha").val();
    var nohau = $("#cb_nohau_nha").is(":checked");
    var trangthai = $("#cb_trangthai_nha").is(":checked");
    var giaban = $("#txt_giaban_nha").val();
    var nguontin = $("#cbo_nguontin_nha").val();
    var thoidiem = $("#dt_thoidiem_nha").val();
    var nhanvienid = 1;
    if (dientich_so == "" || tenbds == "" || dientich_thucte == "" || huong == "" || giaban == "" || idkhuvuc == "-1") {
        toastr.error("Vui lòng nhập đầy đủ khu vực, địa chỉ, diện tích, hướng, giá", "Thông báo", {
            positionClass: "toast-bottom-right",
            timeOut: 5e3,
            closeButton: !0,
            debug: !1,
            newestOnTop: !0,
            progressBar: !0,
            preventDuplicates: !0,
            onclick: null,
            showDuration: "300",
            hideDuration: "1000",
            extendedTimeOut: "1000",
            showEasing: "swing",
            hideEasing: "linear",
            showMethod: "fadeIn",
            hideMethod: "fadeOut",
            tapToDismiss: !1
        })
        return;
    }
    $.ajax({
        type: "POST",
        url: "/api/themthongtinnhadat",
        contentType: "application/json",
        data: JSON.stringify({
            v_idkhuvuc: idkhuvuc
            , v_tenbds: tenbds
            , v_giaban: parseFloat(giaban)
            , v_thoidiem: thoidiem
            , v_loaibds: 0
            , v_trangthai: trangthai == true ? 1 : 0
            , v_dientich_thucte: parseFloat(dientich_thucte)
            , v_dientich_so: parseFloat(dientich_so)
            , v_sotang: parseInt(sotang)
            , v_loaimai: parseInt(loaimai)
            , v_so_mattien: parseFloat(somattien)
            , v_kichthuoc_mattien: parseFloat(kichthuoc_mattien)
            , v_kichthuoc_longdong: parseFloat(kichthuoc_longdong)
            , v_kichthuoc_viahe: parseFloat(kichthuoc_viahe)
            , v_loaiduong: parseInt(loaiduong)
            , v_khoangcach_duonglon: parseFloat(khoangcach_duonglon)
            , v_huong: huong
            , v_nohau: nohau == true ? 1 : 0
            , v_hinhthai_thuadat: parseFloat(hinhthai_thuadat)
            , v_hientrang_sudung: parseFloat(tinhtrang_sudung)
            , v_tinhtrang_congtrinh: parseInt(tinhtrang_congtrinh)
            , v_nguontin: parseInt(nguontin)
            , v_mota: mota
            , v_nhanvien_id: nhanvienid
            , v_hinhanh: ""
        }),
        success: function (data) {
            if (data.success == 0) {
                toastr.error(data.message, "Thông báo", {
                    positionClass: "toast-bottom-right",
                    timeOut: 5e3,
                    closeButton: !0,
                    debug: !1,
                    newestOnTop: !0,
                    progressBar: !0,
                    preventDuplicates: !0,
                    onclick: null,
                    showDuration: "300",
                    hideDuration: "1000",
                    extendedTimeOut: "1000",
                    showEasing: "swing",
                    hideEasing: "linear",
                    showMethod: "fadeIn",
                    hideMethod: "fadeOut",
                    tapToDismiss: !1
                })
            } else {

                toastr.success(data, "Thông báo", {
                    positionClass: "toast-bottom-right",
                    timeOut: 5e3,
                    closeButton: !0,
                    debug: !1,
                    newestOnTop: !0,
                    progressBar: !0,
                    preventDuplicates: !0,
                    onclick: null,
                    showDuration: "300",
                    hideDuration: "1000",
                    extendedTimeOut: "1000",
                    showEasing: "swing",
                    hideEasing: "linear",
                    showMethod: "fadeIn",
                    hideMethod: "fadeOut",
                    tapToDismiss: !1
                });
                clearFormNha();
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(jqXHR);
            console.log(textStatus);
            console.log(errorThrown);
        }
    });
}
function clearFormDat() {

    $("#txtdiachi_dat").val("");
    $("#txt_dientich_trenso_dat").val("");
    $("#txt_dientich_thucte_dat").val("");
    $("#txt_kichthuoc_longduong_dat").val("");
    $("#txt_kichthuoc_viave").val("");
    $("#cbo_loaiduong_dat").val("0");
    $("#cbo_hinhthai_thuadat_dat").val("0");
    $("#txt_huong_dat").val("");
    $("#txt_mota_dat").val("");
    $("#txt_somattien_dat").val("");
    $("#txt_kichthuoc_mattien_dat").val("");
    $("#txt_khoangcach_duonglon_dat").val("");
    $("#txt_tinhtrang_congtrinh_dat").val("");
    $("#cb_nohau_dat").prop("checked", true);
    $("#cb_trangthai_dat").prop("checked", true);
    $("#txt_giaban_dat").val("");
    $("#cbo_nguontin_dat").val("0");
    $("#dt_thoidiem_dat").val("");
}

function clearFormNha() {

    $("#txtdiachi_dat").val("");
    $("#txt_dientich_so_nha").val("");
    $("#txt_dientich_trenso_dat").val("");
    $("#txt_dientich_thucte_nha").val("");
    $("#txt_sotang_nha").val("");
    $("#cbo_loaimai_nha").val("0");
    $("#txt_kichthuoc_longduong_nha").val("");
    $("#txt_kichthuoc_viahe_nha").val("");
    $("#cbo_loaiduong_nha").val("0");
    $("#cbo_hinhthai_thuadat_nha").val("0");
    $("#txt_huong_nha").val("");
    $("#txt_mota_nha").val("");
    $("#txt_somattien_nha").val("");
    $("#txt_kichthuoc_matien_nha").val("");
    $("#txt_kichthuoc_duonglon_nha").val("");
    $("#txt_tinhtrang_congtrinh").val("");
    $("#cbo_sudungdat_nha").val("0");
    $("#cb_nohau_nha").prop("checked", true);
    $("#cb_trangthai_nha").prop("checked", true);
    $("#txt_giaban_nha").val("");
    $("#cbo_nguontin_nha").val("0");
    $("#dt_thoidiem_nha").val("");
}