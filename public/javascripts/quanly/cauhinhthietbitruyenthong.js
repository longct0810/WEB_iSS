var Base64 = { _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=", encode: function (e) { var t = ""; var n, r, i, s, o, u, a; var f = 0; e = Base64._utf8_encode(e); while (f < e.length) { n = e.charCodeAt(f++); r = e.charCodeAt(f++); i = e.charCodeAt(f++); s = n >> 2; o = (n & 3) << 4 | r >> 4; u = (r & 15) << 2 | i >> 6; a = i & 63; if (isNaN(r)) { u = a = 64 } else if (isNaN(i)) { a = 64 } t = t + this._keyStr.charAt(s) + this._keyStr.charAt(o) + this._keyStr.charAt(u) + this._keyStr.charAt(a) } return t }, decode: function (e) { var t = ""; var n, r, i; var s, o, u, a; var f = 0; e = e.replace(/[^A-Za-z0-9\+\/\=]/g, ""); while (f < e.length) { s = this._keyStr.indexOf(e.charAt(f++)); o = this._keyStr.indexOf(e.charAt(f++)); u = this._keyStr.indexOf(e.charAt(f++)); a = this._keyStr.indexOf(e.charAt(f++)); n = s << 2 | o >> 4; r = (o & 15) << 4 | u >> 2; i = (u & 3) << 6 | a; t = t + String.fromCharCode(n); if (u != 64) { t = t + String.fromCharCode(r) } if (a != 64) { t = t + String.fromCharCode(i) } } t = Base64._utf8_decode(t); return t }, _utf8_encode: function (e) { e = e.replace(/\r\n/g, "\n"); var t = ""; for (var n = 0; n < e.length; n++) { var r = e.charCodeAt(n); if (r < 128) { t += String.fromCharCode(r) } else if (r > 127 && r < 2048) { t += String.fromCharCode(r >> 6 | 192); t += String.fromCharCode(r & 63 | 128) } else { t += String.fromCharCode(r >> 12 | 224); t += String.fromCharCode(r >> 6 & 63 | 128); t += String.fromCharCode(r & 63 | 128) } } return t }, _utf8_decode: function (e) { var t = ""; var n = 0; var r = c1 = c2 = 0; while (n < e.length) { r = e.charCodeAt(n); if (r < 128) { t += String.fromCharCode(r); n++ } else if (r > 191 && r < 224) { c2 = e.charCodeAt(n + 1); t += String.fromCharCode((r & 31) << 6 | c2 & 63); n += 2 } else { c2 = e.charCodeAt(n + 1); c3 = e.charCodeAt(n + 2); t += String.fromCharCode((r & 15) << 12 | (c2 & 63) << 6 | c3 & 63); n += 3 } } return t } };
$(document).ready(function () {
    $("#id_overlay_nt").hide();
    handleSidebarNode();
    $("#btndoc").click(function () {
        clearControl();
        DocDieuKhien();
    });

});
function clearControl() {
    $("#ip_new").val("");
    $("#port_new").val("");
    document.getElementById("thongbao_th_dong").innerHTML = "";
}
function handleSidebarNode() {
    var node = JSON.parse(localStorage.getItem("node"));
    let danhmucid = node.id;
    if (danhmucid == null || danhmucid == undefined) {
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
    $("#messageerror").css("display", "none");
    $("#messagesuccess").css("display", "none");
    loadKH();

}


var is_socongto = '';
var is_imei = '';
var is_ip = '';
var is_port = '';
var is_ip2 = '';
var is_port2 = '';

function DocDieuKhien() {
    if ($("#ip_old").val() == "") { alert("Chưa có thông tin IP cũ"); return; }
    if ($("#port_old").val() == "0") { alert("Chưa có thông tin PORT cũ"); return; }
    if (is_imei == "") { alert("Chưa cấu hình IMEI"); return; }
    lenh = 0;
    $("#id_overlay").show();
    document.getElementById("thongbao_dong").innerHTML = 'Đang gửi lệnh xuống DCU, vui lòng chờ kết quả.....';
    $.ajax({
        url: "/api/thietbitruyenthong_guilenhdoccauhinh",
        data: JSON.stringify({ v_imei: is_imei, v_matkhaucongto: '11111111', v_ip: is_ip, v_port: is_port }),
        type: "POST",
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        beforeSend: () => $("#id_overlay_nt").show(),
        success: function (result) {


            if (result[0] == "OK") {
                var dataString = JSON.parse(result[1]);
                const data = JSON.parse(dataString);
                $("#ip2_hientai").html(data[0].ip2);
                $("#port2_hientai").html(data[0].port2);
                $("#ip_new").val(data[0].ip2);
                $("#port_new").val(data[0].port2);
                document.getElementById("thongbao_dong").innerHTML = "";

            } else {
                document.getElementById("thongbao_dong").innerHTML = result[1];
            }
            $("#id_overlay").hide();

        },
        error: function (errormessage) {
            alert(errormessage.responseText);
            $("#id_overlay").hide();
        },
        complete: () => $("#id_overlay_nt").hide()
    });
}


function loadKH() {

    var node = JSON.parse(localStorage.getItem("node"));
    let danhmucid = node.id;
    $("#tbl_thietbitruyenthong tbody").html("");

    $.ajax({
        url: "/api/thietbitruyenthong_getkhachhang",
        data: JSON.stringify({ v_danhmucid: danhmucid, v_mataikhoan: "1" }),
        type: "POST",
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: function (result) {
            drawData(result);
        },
        error: function (errormessage) {
            alert(errormessage.responseText);
        }
    });
}


function drawData(data) {

    var activeRequestsTable = $('#tbl_thietbitruyenthong').DataTable();
    activeRequestsTable.state.clear();
    activeRequestsTable.destroy();
    $("#tbl_thietbitruyenthong tbody").html("");
    $.each(data, function (k, v) {

        var trangthai = "";
        var is_disable = "";
        if (v.matdien == 1) {
            trangthai = ' Online  <i class="fa fa-circle" style="font-size:28px;color:green"></i> '; is_disable = '';
        }
        else { trangthai = ' Offline <i class="fa fa-circle" style="font-size:28px;color:black"></i> '; is_disable = 'disabled'; }

        var str = '<tr id="row_' + v.imei + '">' +
            '<td class="text-center row_stt" style="width:80px">' + v.stt + '</td>' +
            '<td class="text-center" >' + v.imei + '</td>' +
            '<td class="text-center" >  ' + trangthai + ' </td>' +

            '<td  ' + is_disable + '  class="text-center" style="width:140px">' +
            `<a  ` + is_disable + `  href="#"  class="btn btn-primary classquyen_xoa" onclick = "dieukhien_dong('${v.imei}' ,'${v.ip}', '${v.port}', '${is_disable}','${v.ip_2}', '${v.port2}' )" style="margin: 0 5px" >  Cấu Hình </a> ` +
            '</td > '
            + '</tr>';

        $("#tbl_thietbitruyenthong tbody").append(str);  //
    });
    $("#content-w").show();
    getStyleTable();

}



function dieukhien_dong(imei, ip, port, is_disable, ip2, port2) {

    if (is_disable == "disabled") {
        alert("Thiết bị Offline");
        return;
    }
    if (confirm("Bạn có chắc chắn muốn thực hiện cấu hình") == true) {
        $('#id_matkhau_dong').val('');

        is_imei = imei;
        is_ip = ip;
        is_port = port;
        $("#ip_old").val(ip);
        $("#port_old").val(port);
        $("#ip1_hientai").html(retNull(ip));
        $("#port1_hientai").html(retNull(port));
        $("#ip2_hientai").html(retNull(ip2));
        $("#port2_hientai").html(retNull(port2));
        $("#id_overlay_th_nt").hide();
        clearControl();
        $('#modal-DIEUKHIEN_DONG').modal('show');
    }
}



function ThucHien_Dong() {
    var userinfo = localStorage.getItem("us");
    var user = JSON.parse(Base64.decode(userinfo));
    if ($("#ip_old").val() == "") { alert("Chưa có thông tin IP cũ"); return; }
    if ($("#port_old").val() == "0") { alert("Chưa có thông tin PORT cũ"); return; }
    if (is_imei == "") { alert("Chưa cấu hình IMEI"); return; }
    if ($("#ip_new").val() == "") { alert("Chưa nhập IP mới"); return; }
    if ($("#port_new").val() == "") { alert("Chưa nhập PORT mới"); return; }

    $("#id_overlay").show();
    document.getElementById("thongbao_th_dong").innerHTML = 'Đang gửi lệnh xuống DCU, vui lòng chờ kết quả.....';
    $.ajax({
        url: "/api/thietbitruyenthong_cauhinhdieukhien",
        data: JSON.stringify({ v_imei: is_imei, v_ip1: $("#ip_old").val(), v_port1: $("#port_old").val(), v_ip2: $("#ip_new").val(), v_port2: $("#port_new").val(), v_mataikhoan: user.mataikhoan }),
        type: "POST",
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        beforeSend: () => $("#id_overlay_th_nt").show(),
        success: function (result) { 
            $("#id_overlay_th_nt").hide();
            if (result.indexOf("thành công") > -1) {
                $("#id_overlay_th_nt").hide();
                document.getElementById("thongbao_th_dong").innerHTML = result;
                loadKH();
            } else {
                document.getElementById("thongbao_th_dong").innerHTML = result;
                $("#id_overlay").hide();
            }
        },
        error: function (errormessage) {
            alert(errormessage.responseText);
            $("#id_overlay").hide();
        },
        complete: () => $("#id_overlay_th_nt").hide()
    });
    loadKH();
}



function isNumber(evt) {
    evt = (evt) ? evt : window.event;
    var charCode = (evt.which) ? evt.which : evt.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57) && charCode != 44) {
        return false;
    }
    return true;
}

function getStyleTable() {
    $('#tbl_thietbitruyenthong').DataTable({
        dom: 'Bfrtip',
        buttons: [
            'excelHtml5'
        ],
        'scrollX': true,
        'scrollCollapse': true,
        'paging': true,
        'lengthChange': false,
        'searching': true,
        'ordering': false,
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


function retNull(number) {
    if (number == null || number == undefined || (number == "")) {
        return '-';
    }
    return number;
}