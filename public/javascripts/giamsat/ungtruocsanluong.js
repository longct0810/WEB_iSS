
var is_socongto = '';
var is_imei = '';
var is_ip = '';
var is_port = '';
var Base64 = { _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=", encode: function (e) { var t = ""; var n, r, i, s, o, u, a; var f = 0; e = Base64._utf8_encode(e); while (f < e.length) { n = e.charCodeAt(f++); r = e.charCodeAt(f++); i = e.charCodeAt(f++); s = n >> 2; o = (n & 3) << 4 | r >> 4; u = (r & 15) << 2 | i >> 6; a = i & 63; if (isNaN(r)) { u = a = 64 } else if (isNaN(i)) { a = 64 } t = t + this._keyStr.charAt(s) + this._keyStr.charAt(o) + this._keyStr.charAt(u) + this._keyStr.charAt(a) } return t }, decode: function (e) { var t = ""; var n, r, i; var s, o, u, a; var f = 0; e = e.replace(/[^A-Za-z0-9\+\/\=]/g, ""); while (f < e.length) { s = this._keyStr.indexOf(e.charAt(f++)); o = this._keyStr.indexOf(e.charAt(f++)); u = this._keyStr.indexOf(e.charAt(f++)); a = this._keyStr.indexOf(e.charAt(f++)); n = s << 2 | o >> 4; r = (o & 15) << 4 | u >> 2; i = (u & 3) << 6 | a; t = t + String.fromCharCode(n); if (u != 64) { t = t + String.fromCharCode(r) } if (a != 64) { t = t + String.fromCharCode(i) } } t = Base64._utf8_decode(t); return t }, _utf8_encode: function (e) { e = e.replace(/\r\n/g, "\n"); var t = ""; for (var n = 0; n < e.length; n++) { var r = e.charCodeAt(n); if (r < 128) { t += String.fromCharCode(r) } else if (r > 127 && r < 2048) { t += String.fromCharCode(r >> 6 | 192); t += String.fromCharCode(r & 63 | 128) } else { t += String.fromCharCode(r >> 12 | 224); t += String.fromCharCode(r >> 6 & 63 | 128); t += String.fromCharCode(r & 63 | 128) } } return t }, _utf8_decode: function (e) { var t = ""; var n = 0; var r = c1 = c2 = 0; while (n < e.length) { r = e.charCodeAt(n); if (r < 128) { t += String.fromCharCode(r); n++ } else if (r > 191 && r < 224) { c2 = e.charCodeAt(n + 1); t += String.fromCharCode((r & 31) << 6 | c2 & 63); n += 2 } else { c2 = e.charCodeAt(n + 1); c3 = e.charCodeAt(n + 2); t += String.fromCharCode((r & 15) << 12 | (c2 & 63) << 6 | c3 & 63); n += 3 } } return t } };
//Date picker
$(document).ready(function () {
    if (!localStorage.getItem("us")) {
        window.location.href = "../login";
    }
    $("#id_overlay").hide();
    $("#id_overlay_cat").hide();
    $("#canhbao_box").hide();
    $("#canhbao_box_cat").hide();
    handleSidebarNode();
});
function handleSidebarNode() {
    loadKH_UTSL();
}
function loadKH_UTSL() {

    var node = JSON.parse(localStorage.getItem("node"));
    let loaidanhmuc = node.type;
    let danhmucid = loaidanhmuc == 9 ? "-1" : node.id;
    if (node == null || danhmucid == null) {
        toastr.error("Vui lòng chọn danh mục", "Thông báo", {
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
        return;
    }
    if (loaidanhmuc < 5) {
        toastr.error("Vui lòng chọn trạm", "Thông báo", {
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
        return;
    }

    $("#tbl_dieukhiendongcat tbody").html("");
    var socongto = loaidanhmuc == 9 ? node.socongto : '-1';
    $.ajax({
        url: "/api/khaithacdulieu_dieukhiendongcat_laykh",
        data: JSON.stringify({ v_danhmucid: danhmucid, v_mataikhoan: 1, v_socongto: socongto }),
        type: "POST",
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: function (result) {
            drawData(result)
        },
        error: function (errormessage) {
            toastr.error(errormessage.responseJSON.message, "Thông báo", {
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
            return;
        }

    });
}


function drawData(data) {
    var activeRequestsTable = $('#tbl_ungtruocsanluong').DataTable();
    activeRequestsTable.state.clear();
    activeRequestsTable.destroy();
    $("#tbl_ungtruocsanluong tbody").html("");
    $.each(data, function (k, v) {
        var str = '<tr id="row_' + v.meterid + '">' +
            '<td class="text-center row_stt">' + v.stt + '</td>' +
            '<td>' + v.madiemdo + '</td>' +
            '<td>' + v.ten_khachhang + '</td>' +
            '<td>' + v.socongto + '</td>' +
            '<td>' + v.imei + '</td>' +
            '<td  class="text-center" style="width:410px">' +
            `<a href="#"  class="btn btn-primary classquyen_xoa"   onclick = "napsanluong( '${v.socongto}' , '${v.imei}' ,'${v.ip}', '${v.port}' )" style="margin:5px">  Nạp sản lượng </a>  - <a href="#"  class="btn btn-primary classquyen_xoa"   onclick = "docketqua( '${v.socongto}' , '${v.imei}' ,'${v.ip}', '${v.port}' )" style="margin:5px"> Đọc kết quả </a>` +
            `<a href="#"  class="btn btn-primary classquyen_xoa"   onclick = "napsanluongquatoken( '${v.socongto}' , '${v.imei}' ,'${v.ip}', '${v.port}' )" style="margin:5px">  Nạp qua token </a> - <a href="#"  class="btn btn-primary classquyen_xoa"   onclick = "docketquatoken( '${v.socongto}' , '${v.imei}' ,'${v.ip}', '${v.port}' )" style="margin:5px"> Đọc kết quả </a>` +
            '</td > '

            + '</tr>';

        $("#tbl_ungtruocsanluong tbody").append(str);  //
    });
    getStyleTable();

}
function getStyleTable() {
    $('#tbl_ungtruocsanluong').DataTable({
        dom: 'Bfrtip',
        buttons: [
            'excelHtml5'
        ],
        'scrollX': false,
        'scrollCollapse': true,
        'paging': true,
        'lengthChange': false,
        'searching': true,
        order: [],
        columnDefs: [
            { targets: '_all', orderable: false }
        ],
        'info': true,
        'autoWidth': false,
        "language": {
            "sProcessing": "Đang xử lý...",
            "sLengthMenu": "Xem _MENU_ mục",
            "sZeroRecords": "Không tìm thấy dòng nào phù hợp",
            "sInfo": "Đang xem _START_ đến _END_ trong tổng số _TOTAL_ mục",
            "sInfoEmpty": "Đang xem 0 đến 0 trong tổng số 0 mục",
            "sInfoFiltered": "(được lọc từ _MAX_ mục)",
            "sInfoPostFix": "",
            "sSearch": "Tìm:",
            "sUrl": "",
            "oPaginate": {
                "sFirst": "Đầu",
                "sPrevious": "Trước",
                "sNext": "Tiếp",
                "sLast": "Cuối"
            }
        }
    });
}
function napsanluong(socongto, imei, ip, port) {
    if (confirm("Bạn có chắc chắn muốn thực hiện nạp sản lượng?") == true) {
        is_socongto = socongto;
        is_imei = imei;
        is_ip = ip;
        is_port = port;
        is_matkhau_cto = "3434343434343434";
        document.getElementById("thongbao_naptien").innerHTML = "";
        document.getElementById("id_overlay_nt").innerHTML = socongto;
        $('#modal-DIEUKHIEN_NAPTIEN').modal('show');
    } else {
        $('#modal-DIEUKHIEN_NAPTIEN').modal('hide');
    }
}
function napsanluongquatoken(socongto, imei, ip, port) {
    if (confirm("Bạn có chắc chắn muốn thực hiện nạp sản lượng?") == true) {
        is_socongto = socongto;
        is_matkhau_cto = "44444444";
        is_imei = imei;
        is_ip = ip;
        is_port = port;
        document.getElementById("thongbao_naptien_token").innerHTML = "";
        document.getElementById("id_overlay_nt_token").innerHTML = socongto;
        $('#modal_DIEUKHIEN_NAPTIEN_TOKEN').modal('show');
    } else {
        $('#modal_DIEUKHIEN_NAPTIEN_TOKEN').modal('hide');
    }

}
function ThucHien_NapTien() {
    $("#canhbao_box").show();
    if (is_socongto == "") {
        toastr.error("Chưa cấu hình số công tơ", "Thông báo", {
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
        }); return;
    }
    if (is_imei == "") {
        toastr.error("Chưa cấu hình imei", "Thông báo", {
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
        }); return;
    }
    if (is_ip == "" || is_ip == "null") {
        toastr.error("Chưa cấu hình IP", "Thông báo", {
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
        }); return;
    }
    if (is_port == "" || is_port == "null") {
        toastr.error("Chưa cấu hình PORT", "Thông báo", {
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
        }); return;
    }

    if (is_matkhau_cto == "") {
        toastr.error("Nhập mật khẩu công tơ", "Thông báo", {
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
        }); return;
    }

    document.getElementById("thongbao_naptien").innerHTML = "Đã gửi lệnh xuống DCU, vui lòng chờ kết quả.....";
    var userinfo = localStorage.getItem("us");
    var user = JSON.parse(Base64.decode(userinfo));
    var sanluong = $("#id_sanluong").val();
    var thoigiansd = 0;
    var thauchi = 0;
    var nguong1 = $("#id_nguong_1").val();
    var nguong2 = $("#id_nguong_2").val();
    var nguong3 = $("#id_nguong_3").val();
    var thoigian1 = 0;
    var thoigian2 = 0;
    var thoigian3 = 0;
    var mataikhoan = 0;
    var lenh = `${sanluong}:${thoigiansd}:${thauchi}:${nguong1}:${nguong2}:${nguong3}:${thoigian1}:${thoigian2}:${thoigian3}`;
    $.ajax({
        url: "/api/khaithacdulieu_ungtruocsanluong_naptien",
        data: JSON.stringify({ v_socongto: is_socongto, v_imei: is_imei, v_matkhaucongto: is_matkhau_cto, v_ip: is_ip, v_port: is_port, v_lenhcmd: lenh, v_mataikhoan: user.mataikhoan }),
        type: "POST",
        contentType: "application/json;charset=utf-8",
        dataType: "json",

        beforeSend: () => $("#id_overlay_nt").show(),
        success: function (result) {
            document.getElementById("thongbao_naptien").innerHTML = result;
        },
        error: function (errormessage) {
            document.getElementById("thongbao_naptien").innerHTML = errormessage.responseText;

        }
    });


}


function ThucHien_NapTien_QuaToKen() {

    if (is_socongto == "") {
        toastr.error("Chưa cấu hình số công tơ", "Thông báo", {
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
        }); return;
    }

    document.getElementById("thongbao_naptien_token").innerHTML = "Đã gửi lệnh xuống DCU, vui lòng chờ kết quả.....";
    var userinfo = localStorage.getItem("us");
    var user = JSON.parse(Base64.decode(userinfo));
    var sanluong = $("#id_sanluong_token").val();

    $.ajax({
        url: "/api/khaithacdulieu_ungtruocsanluong_token",
        data: JSON.stringify({ v_socongto: is_socongto, v_sanluong: sanluong }),
        type: "POST",
        contentType: "application/json;charset=utf-8",
        dataType: "json",

        beforeSend: () => $("#id_overlay_nt").show(),
        success: function (result) {

            if (result.code == 1) {
                document.getElementById("thongbao_naptien_token").innerHTML = "Không lấy được token";
            } else {
                if (result.data != null) {
                    console.log(result.data);
                    var token_management = result.data.managementToken;
                    if (token_management != null) {
                        var token1 = token_management.token.split(",")[0];
                        var token2 = token_management.token.split(",")[1];
                        NapSanLuongCongTo_TOKEN(token1);
                        NapSanLuongCongTo_TOKEN(token2);
                    }
                    var token = result.data.token;
                    document.getElementById("thongbao_naptien_token").innerHTML = "";
                    NapSanLuongCongTo_TOKEN(token);
                } else {
                    document.getElementById("thongbao_naptien_token").innerHTML = "Không lấy được token";
                }
            }

        },
        error: function (errormessage) {
            document.getElementById("thongbao_naptien").innerHTML = errormessage.responseText;

        }
    });
}
function NapSanLuongCongTo_TOKEN(token) {
    document.getElementById("thongbao_naptien_token").innerHTML = "Đã gửi lệnh xuống DCU, vui lòng chờ kết quả.....";
    var userinfo = localStorage.getItem("us");
    var user = JSON.parse(Base64.decode(userinfo));

    $.ajax({
        url: "/api/khaithacdulieu_ungtruocsanluong_naptien_token",
        data: JSON.stringify({ v_socongto: is_socongto, v_imei: is_imei, v_matkhaucongto: is_matkhau_cto, v_ip: is_ip, v_port: is_port, v_lenhcmd: token, v_mataikhoan: user.mataikhoan }),
        type: "POST",
        contentType: "application/json;charset=utf-8",
        dataType: "json",

        beforeSend: () => $("#id_overlay_nt").show(),
        success: function (result) {
            document.getElementById("thongbao_naptien_token").innerHTML = result;
        },
        error: function (errormessage) {
            document.getElementById("thongbao_naptien_token").innerHTML = errormessage.responseText;

        }
    });

}
function docketqua(socongto, imei, ip, port) {

    is_socongto = socongto;
    is_imei = imei;
    is_ip = ip;
    is_port = port;
    document.getElementById("id_overlay_dkq").innerHTML = socongto;
    $("#tongsanluong").html("");
    $("#nguong_1").html("");
    $("#nguong_2").html("");
    $("#nguong_3").html("");
    document.getElementById("thongbao_doc").innerHTML = "";
    $('#modal_DIEUKHIEN_Doc').modal('show');
    $(".docketqua").hide();

}


function ThucHien_DocKQ() {
    $(".docketqua").hide();
    GuiLenh_doc();

}

function GuiLenh_doc() {
    $("#thongbao_doc").show();
    if (is_socongto == "") {
        toastr.error("Chưa cấu hình số công tơ", "Thông báo", {
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
        }); return;
    }
    if (is_imei == "") {
        toastr.error("Chưa cấu hình imei", "Thông báo", {
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
        }); return;
    }
    if (is_ip == "" || is_ip == "null") {
        toastr.error("Chưa cấu hình IP", "Thông báo", {
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
        }); return;
    }
    if (is_port == "" || is_port == "null") {
        toastr.error("Chưa cấu hình PORT", "Thông báo", {
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
        }); return;
    }


    document.getElementById("thongbao_doc").innerHTML = "Đã gửi lệnh xuống DCU, vui lòng chờ kết quả.....";


    $.ajax({
        url: "/api/khaithacdulieu_ungtruocsanluong_docketquanap",
        data: JSON.stringify({ v_socongto: is_socongto, v_imei: is_imei, v_ip: is_ip, v_port: is_port }),
        type: "POST",
        contentType: "application/json;charset=utf-8",
        dataType: "json",

        beforeSend: () => $("#id_overlay_dkq").show(),
        success: function (result) {


            if (result[0] == "OK") {
                $(".docketqua").show();
                var dataString = JSON.parse(result[1]);
                const data = dataString;

                $("#tongsanluong").html(data[0].sanluong);
                $("#nguong_1").html(data[0].nguong1);
                $("#nguong_2").html(data[0].nguong2);
                $("#nguong_3").html(data[0].nguong3);
                $("#sanluong_conlai").html(data[1].sanluongconlai);
                document.getElementById("thongbao_doc").innerHTML = "";
            }
        },
        error: function (errormessage) {
            document.getElementById("thongbao_doc").innerHTML = errormessage.responseText;

        }
    });

}

function docketquatoken(socongto, imei, ip, port) {
    is_socongto = socongto;
    is_imei = imei;
    is_ip = ip;
    is_port = port;
    document.getElementById("id_overlay_dkq_token").innerHTML = socongto;
    $("#tongsanluongtoken").html("");

    document.getElementById("thongbao_doc_token").innerHTML = "";
    $('#modal_DIEUKHIEN_DOCKQ_TOKEN').modal('show');
    $(".docketquatoken").hide();
}
function ThucHien_DocKQ_TOKEN() {
    $(".docketquatoken").hide();
    GuiLenh_doc_token();

}
function GuiLenh_doc_token() {
    $("#thongbao_doc").show();
    if (is_socongto == "") {
        toastr.error("Chưa cấu hình số công tơ", "Thông báo", {
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
        }); return;
    }
    if (is_imei == "") {
        toastr.error("Chưa cấu hình imei", "Thông báo", {
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
        }); return;
    }
    if (is_ip == "" || is_ip == "null") {
        toastr.error("Chưa cấu hình IP", "Thông báo", {
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
        }); return;
    }
    if (is_port == "" || is_port == "null") {
        toastr.error("Chưa cấu hình PORT", "Thông báo", {
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
        }); return;
    }


    document.getElementById("thongbao_doc_token").innerHTML = "Đã gửi lệnh xuống DCU, vui lòng chờ kết quả.....";


    $.ajax({
        url: "/api/khaithacdulieu_ungtruocsanluong_docketquanaptoken",
        data: JSON.stringify({ v_socongto: is_socongto, v_imei: is_imei, v_ip: is_ip, v_port: is_port }),
        type: "POST",
        contentType: "application/json;charset=utf-8",
        dataType: "json",

        beforeSend: () => $("#id_overlay_dkq").show(),
        success: function (result) {


            if (result[0] == "OK") {
                $(".docketquatoken").show();
                $("#tongsanluongtoken").html(result[1]);
                document.getElementById("thongbao_doc_token").innerHTML = "";
            }
        },
        error: function (errormessage) {
            document.getElementById("thongbao_doc_token").innerHTML = errormessage.responseText;

        }
    });
}