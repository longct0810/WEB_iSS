var is_socongto = '';
var is_imei = '';
var is_ip = '';
var is_port = '';
var MaNapTien = "";
var TokencongTo1 = "";
var TokencongTo2 = "";
//Date picker
$(document).ready(function () {
    if (!localStorage.getItem("us")) {
        window.location.href = "../login";
    }
    $("#id_overlay_nt").hide();
    $("#id_overlay_kq").hide();
    handleSidebarNode();
});
function handleSidebarNode() {
    loadKH_Dieukhien();
}
function loadKH_Dieukhien() {

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
                drawData(result)
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


function drawData(data) {
    var activeRequestsTable = $('#tbl_dieukhiendongcat').DataTable();
    activeRequestsTable.state.clear();
    activeRequestsTable.destroy();
    $("#tbl_dieukhiendongcat tbody").html("");
    $.each(data, function (k, v) {

        var trangthai = "";
        if (v.matdien == 0) { trangthai = "Đang đóng" }
        else { trangthai = "Đang cắt" }

        var str = '<tr id="row_' + v.meterid + '">' +
            '<td class="text-center row_stt">' + v.stt + '</td>' +
            '<td>' + v.madiemdo + '</td>' +
            '<td>' + v.ten_khachhang + '</td>' +
            '<td>' + v.socongto + '</td>' +
            '<td>' + v.imei + '</td>' +

            '<td  class="text-center" style="width:90px">' +
            `<a href="#"  onclick = "dieukhien_naptien( '${v.SOCONGTO}' , '${v.IMEI}' ,'${v.IP}', '${v.PORT}' )" style="margin: 0 5px"><i class="fa fa-ticket"></i></a> ` +
            '</td > ' +

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
function dieukhien_naptien(socongto, imei, ip, port) {
    if (confirm("Bạn có chắc chắn muốn thực hiện nạp tiền") == true) {
        is_socongto = socongto;
        is_imei = imei;
        is_ip = ip;
        is_port = port;
        document.getElementById("id_overlay_nt").innerHTML = socongto;
        $('#modal_DIEUKHIEN_NAPTIEN').modal('show');
        ThucHien_NapTien();
    } else {
        $('#modal_DIEUKHIEN_NAPTIEN').modal('hide');
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
    var lenh = "0";
    document.getElementById("thongbao_dong").innerHTML = "Đã gửi lệnh đóng xuống DCU, vui lòng chờ kết quả.....";

    $.ajax({
        url: "/api/Nap_Tien_TraTruoc",
        data: JSON.stringify({ v_socongto: is_socongto, v_imei: is_imei, v_matkhaucongto: is_matkhau_cto, v_ip: is_ip, v_port: is_port, v_lenhcmd: lenh }),
        type: "POST",
        contentType: "application/json;charset=utf-8",
        dataType: "json",

        beforeSend: () => $("#id_overlay").show(),
        success: function (result) {
            document.getElementById("thongbao_dong").innerHTML = result;

        },
        error: function (errormessage) {
            document.getElementById("thongbao_dong").innerHTML = errormessage.responseText;

        }
    });
}

