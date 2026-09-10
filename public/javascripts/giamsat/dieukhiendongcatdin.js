var is_socongto = '';
var is_imei = '';
var is_ip = '';
var is_port = '';
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
    loadKH_DongCat("-1");
}
function loadKH_DongCat(lenh) {

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
            setTimeout(function () {
                drawData(result, lenh)
            }, 200)
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


function drawData(data, lenh) {

    var activeRequestsTable = $('#tbl_dieukhiendongcat').DataTable();
    activeRequestsTable.state.clear();
    activeRequestsTable.destroy();
    $("#tbl_dieukhiendongcat tbody").html("");
    $.each(data, function (k, v) {

        var trangthai = "";

        if (v.trangthai_dongcat == 'ON') {
            trangthai = "Đang đóng";
        }
        else {

            trangthai = "Đang cắt";
        }

        var str = '<tr id="row_' + v.meterid + '">' +
            '<td class="text-center row_stt">' + v.stt + '</td>' +
            '<td>' + v.madiemdo + '</td>' +
            '<td>' + v.ten_khachhang + '</td>' +
            '<td>' + v.socongto + '</td>' +
            '<td>' + retNull(v.din_dk) + '</td>' +
            '<td>' + trangthai + '</td>' +
            // data-bs-toggle="modal" data-bs-target="#modal_DIEUKHIEN_DONG"

            '<td  class="text-center" style="width:330px">' +
            `<a href="#"  class="btn btn-primary classquyen_xoa"   onclick = "dieukhien_dong( '${v.socongto}' , '${v.din_dk}' ,'${v.ip}', '${v.port}' )" style="margin:5px">  Đóng </a> ` +
            `<a href="#"  class="btn btn-primary classquyen_xoa"   onclick = "dieukhien_cat( '${v.socongto}' , '${v.din_dk}' ,'${v.ip}', '${v.port}' )" style="margin:5px"> Cắt </a> ` +

            '</td > '

            + '</tr>';

        $("#tbl_dieukhiendongcat tbody").append(str);  //
    });
    getStyleTable();

}
function getStyleTable() {
    $('#tbl_dieukhiendongcat').DataTable({
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
function dieukhien_dong(socongto, imei, ip, port) {
    if (confirm("Bạn có chắc chắn muốn thực hiện đóng") == true) {
        is_socongto = socongto;
        is_imei = imei;
        is_ip = ip;
        is_port = port;
        is_matkhau_cto = "44444444";
        document.getElementById("laber_imei_dong").innerHTML = socongto;
        $('#modal_DIEUKHIEN_DONG').modal('show');
        // get_matkhau_cto(is_socongto, 'dong');
        GuiLenh_Dong();
    } else {
        $('#modal_DIEUKHIEN_DONG').modal('hide');
    }
}
function dieukhien_cat(socongto, imei, ip, port) {

    if (confirm("Bạn có chắc chắn muốn thực hiện cắt") == true) {
        is_socongto = socongto;
        is_imei = imei;
        is_ip = ip;
        is_port = port;
        is_matkhau_cto = "44444444";
        document.getElementById("laber_imei_cat").innerHTML = socongto;
        $('#modal_DIEUKHIEN_CAT').modal('show');
        // get_matkhau_cto(is_socongto, 'dong');
        GuiLenh_Cat();
    } else {
        $('#modal_DIEUKHIEN_CAT').modal('hide');
    }
}

function GuiLenh_Dong() {
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
    var lenh = "0";
    document.getElementById("thongbao_dong").innerHTML = "Đã gửi lệnh đóng xuống DCU, vui lòng chờ kết quả.....";

    $.ajax({
        url: "/api/khaithacdulieu_dieukhiendongcat_din_tcp",
        data: JSON.stringify({ v_socongto: is_socongto, v_imei: is_imei, v_matkhaucongto: is_matkhau_cto, v_ip: is_ip, v_port: is_port, v_lenhcmd: lenh }),
        type: "POST",
        contentType: "application/json;charset=utf-8",
        dataType: "json",

        beforeSend: () => $("#id_overlay").show(),
        success: function (result) {
            document.getElementById("thongbao_dong").innerHTML = result;
            insert_lichsu_dongcat(is_imei, is_socongto, 0, lenh);
        },
        error: function (errormessage) {
            document.getElementById("thongbao_dong").innerHTML = errormessage.responseText;

        }
    });
}

function GuiLenh_Cat() {
    $("#canhbao_box_cat").show();
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
    document.getElementById("thongbao_cat").innerHTML = "Đã gửi lệnh cắt xuống DCU, vui lòng chờ kết quả.....";
    var lenh = "1";
    $.ajax({
        url: "/api/khaithacdulieu_dieukhiendongcat_tcp",
        data: JSON.stringify({ v_socongto: is_socongto, v_imei: is_imei, v_matkhaucongto: is_matkhau_cto, v_ip: is_ip, v_port: is_port, v_lenhcmd: lenh }),
        type: "POST",
        contentType: "application/json;charset=utf-8",
        dataType: "json",

        beforeSend: () => $("#id_overlay_cat").show(),
        success: function (result) {
            document.getElementById("thongbao_cat").innerHTML = result;
            insert_lichsu_dongcat(is_imei, is_socongto, 1, lenh);

        },
        error: function (errormessage) {
            document.getElementById("thongbao_cat").innerHTML = errormessage.responseText;

        }
    });

}
function insert_lichsu_dongcat(is_imei, is_socongto, is_event, lenh) {
    let mataikhoan = 1;
    $.ajax({
        url: "/api/khaithacdulieu_dieukhiendongcat_insert_lichsu_dongcat",
        data: JSON.stringify({ v_imei: is_imei, v_socongto: is_socongto, v_event: is_event, v_mataikhoan: mataikhoan, v_lenh: lenh }),
        type: "POST",
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: function (result) {
            loadKH_DongCat(lenh);
        },
        error: function (errormessage) {
            alert(errormessage.responseText);
        },

    });
}

function retNull(number) {
    if (number == null || number == undefined || (number == "")) {
        return '-';
    }
    return number;
}