var Base64 = { _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=", encode: function (e) { var t = ""; var n, r, i, s, o, u, a; var f = 0; e = Base64._utf8_encode(e); while (f < e.length) { n = e.charCodeAt(f++); r = e.charCodeAt(f++); i = e.charCodeAt(f++); s = n >> 2; o = (n & 3) << 4 | r >> 4; u = (r & 15) << 2 | i >> 6; a = i & 63; if (isNaN(r)) { u = a = 64 } else if (isNaN(i)) { a = 64 } t = t + this._keyStr.charAt(s) + this._keyStr.charAt(o) + this._keyStr.charAt(u) + this._keyStr.charAt(a) } return t }, decode: function (e) { var t = ""; var n, r, i; var s, o, u, a; var f = 0; e = e.replace(/[^A-Za-z0-9\+\/\=]/g, ""); while (f < e.length) { s = this._keyStr.indexOf(e.charAt(f++)); o = this._keyStr.indexOf(e.charAt(f++)); u = this._keyStr.indexOf(e.charAt(f++)); a = this._keyStr.indexOf(e.charAt(f++)); n = s << 2 | o >> 4; r = (o & 15) << 4 | u >> 2; i = (u & 3) << 6 | a; t = t + String.fromCharCode(n); if (u != 64) { t = t + String.fromCharCode(r) } if (a != 64) { t = t + String.fromCharCode(i) } } t = Base64._utf8_decode(t); return t }, _utf8_encode: function (e) { e = e.replace(/\r\n/g, "\n"); var t = ""; for (var n = 0; n < e.length; n++) { var r = e.charCodeAt(n); if (r < 128) { t += String.fromCharCode(r) } else if (r > 127 && r < 2048) { t += String.fromCharCode(r >> 6 | 192); t += String.fromCharCode(r & 63 | 128) } else { t += String.fromCharCode(r >> 12 | 224); t += String.fromCharCode(r >> 6 & 63 | 128); t += String.fromCharCode(r & 63 | 128) } } return t }, _utf8_decode: function (e) { var t = ""; var n = 0; var r = c1 = c2 = 0; while (n < e.length) { r = e.charCodeAt(n); if (r < 128) { t += String.fromCharCode(r); n++ } else if (r > 191 && r < 224) { c2 = e.charCodeAt(n + 1); t += String.fromCharCode((r & 31) << 6 | c2 & 63); n += 2 } else { c2 = e.charCodeAt(n + 1); c3 = e.charCodeAt(n + 2); t += String.fromCharCode((r & 15) << 12 | (c2 & 63) << 6 | c3 & 63); n += 3 } } return t } };
$(document).ready(function () {

    $("#id_overlay_nt").hide();
    $("#btndoc").click(function () {
        clearControl();
        Docauhinh();
    });
    load_ds_imei();
});

function clearControl() {
    document.getElementById("thongbao_dong").innerHTML = "";
    $("#id_time_tsvh_bt").val(0);
    $("#id_time_tsvh_caothap").val(0);
    $("#id_nguong_canhbao_thap").val(0);
    $("#id_delta_thap").val(0);
    $("#id_nguong_canhbao_cao").val(0);
    $("#id_delta_cao").val(0);
}

var is_imei = '';
var is_ip = '';
var is_port = '';

function Docauhinh() {
     
    if (is_imei == "") { alert("Chưa cấu hình IMEI"); return; }
    if (is_ip == "") { alert("Chưa cấu hình IP"); return; }
    if (is_port == "") { alert("Chưa cấu hình PORT"); return; }
    $("#id_overlay").show();

    document.getElementById("thongbao_dong").innerHTML = 'Đang gửi lệnh xuống DCU, vui lòng chờ kết quả.....';
    $.ajax({
        url: "/api/dienapthap_cauhinh_docthongso",
        data: JSON.stringify({ v_imei: is_imei, v_ip: is_ip, v_port: is_port }),
        type: "POST",
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        beforeSend: () => $("#id_overlay_nt").show(),
        success: function (result) {

            clearControl();
            if (result.indexOf("(at+config)") > -1) {
                //const items = result.split(/[)()]/);
                var kq = result.split(")(");
                var splitdata = kq[4].split(",");
                var delta_cao = splitdata[5].split(")");
                $("#id_time_tsvh_bt").val(splitdata[0]);
                $("#id_time_tsvh_caothap").val(splitdata[1]);
                $("#id_nguong_canhbao_thap").val(splitdata[2]);
                $("#id_delta_thap").val(splitdata[3]);
                $("#id_nguong_canhbao_cao").val(splitdata[4]);
                $("#id_delta_cao").val(delta_cao[0]);
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


function load_ds_imei() {

    var node = JSON.parse(localStorage.getItem("node"));
    let danhmucid = node.id;
    $("#tbl_thietbitruyenthong tbody").html("");

    $.ajax({
        url: "/api/dienapthap_ds_imei_cauhinh",
        data: JSON.stringify({ v_danhmucid: "0", v_mataikhoan: "1" }),
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
    var stt = 0;
    $.each(data, function (k, v) {
        stt++;


        var str = '<tr id="row_' + v.imei + '">' +
            '<td class="text-center row_stt" style="width:80px">' + stt + '</td>' +
            '<td class="text-center" >' + retNull(v.imei) + '</td>' +
            '<td class="text-center" >  ' + v.ip + ' </td>' +
            '<td class="text-center" >  ' + v.port + ' </td>' +

            '<td   class="text-center" style="width:140px">' +
            `<a    href="#"  class="btn btn-primary classquyen_xoa" 
            onclick = "dieukhien_cauhinh_dat('${v.imei}' ,'${v.ip}', '${v.port}' )" style="margin: 0 5px" >  Cấu Hình </a> ` +
            '</td > '
            + '</tr>';

        $("#tbl_thietbitruyenthong tbody").append(str);  //
    });
    $("#content-w").show();
    getStyleTable();

}


function dieukhien_cauhinh_dat(imei, ip, port) {

    if (confirm("Bạn có chắc chắn muốn thực hiện cấu hình") == true) {
        is_imei = imei;
        is_ip = ip;
        is_port = port;
        $("#id_overlay_th_nt").hide();
        clearControl();
        $('#modal-DIEUKHIEN_DONG').modal('show');
    }
}

function ThucHien_CauHinh() {
    var userinfo = localStorage.getItem("us");
    var user = JSON.parse(Base64.decode(userinfo));
    if (is_imei == "") { alert("Chưa cấu hình IMEI"); return; }
    if (is_ip == "") { alert("Chưa cấu hình IP"); return; }
    if (is_port == "") { alert("Chưa cấu hình PORT"); return; }
    if ($("#id_time_tsvh_bt").val() == "") { alert("Chưa nhập thời gian gửi TSVH bình thường"); return; }
    if ($("#id_time_tsvh_caothap").val() == "") { alert("Chưa nhập thời gian gửi TSVH khi điện áp cao/thấp "); return; }
    if ($("#id_nguong_canhbao_thap").val() == "") { alert("Chưa nhập ngưỡng cảnh báo điện áp thấp"); return; }
    if ($("#id_nguong_canhbao_cao").val() == "") { alert("Chưa nhập ngưỡng cảnh báo điện áp cao"); return; }
    if ($("#id_delta_thap").val() == "") { alert("Chưa nhập  Giá trị delta cảnh báo điện áp thấp"); return; }
    if ($("#id_delta_cao").val() == "") { alert("Chưa nhập  Giá trị delta cảnh báo điện áp cao"); return; }

    $("#id_overlay").show();
    document.getElementById("thongbao_dong").innerHTML = 'Đang gửi lệnh xuống DCU, vui lòng chờ kết quả.....';
    $.ajax({
        url: "/api/dienapthap_cauhinh_dieukhien",
        data: JSON.stringify({
            v_imei: is_imei, v_ip: is_ip, v_port: is_port,
            v_time_tsvh_bt: $("#id_time_tsvh_bt").val(),
            v_time_tsvh_caothap: $("#id_time_tsvh_caothap").val(),
            v_nguong_canhbao_thap: $("#id_nguong_canhbao_thap").val(),
            v_nguong_canhbao_cao: $("#id_nguong_canhbao_cao").val(),
            v_delta_thap: $("#id_delta_thap").val(),
            v_delta_cao: $("#id_delta_cao").val()
        }),
        type: "POST",
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        beforeSend: () => $("#id_overlay_th_nt").show(),
        success: function (result) {
             
            var ccc = result;
            $("#id_overlay_th_nt").hide();
            if (result.indexOf("(ok)") > -1) {
                $("#id_overlay_th_nt").hide();
                document.getElementById("thongbao_dong").innerHTML = "Cấu hình thành công.!";
                load_ds_imei();
            } else {
                document.getElementById("thongbao_dong").innerHTML = result;
                $("#id_overlay").hide();
            }
        },
        error: function (errormessage) {
            alert(errormessage.responseText);
            $("#id_overlay").hide();
        },
        complete: () => $("#id_overlay_th_nt").hide()
    });
    load_ds_imei();
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