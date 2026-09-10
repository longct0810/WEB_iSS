var Base64 = { _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=", encode: function (e) { var t = ""; var n, r, i, s, o, u, a; var f = 0; e = Base64._utf8_encode(e); while (f < e.length) { n = e.charCodeAt(f++); r = e.charCodeAt(f++); i = e.charCodeAt(f++); s = n >> 2; o = (n & 3) << 4 | r >> 4; u = (r & 15) << 2 | i >> 6; a = i & 63; if (isNaN(r)) { u = a = 64 } else if (isNaN(i)) { a = 64 } t = t + this._keyStr.charAt(s) + this._keyStr.charAt(o) + this._keyStr.charAt(u) + this._keyStr.charAt(a) } return t }, decode: function (e) { var t = ""; var n, r, i; var s, o, u, a; var f = 0; e = e.replace(/[^A-Za-z0-9\+\/\=]/g, ""); while (f < e.length) { s = this._keyStr.indexOf(e.charAt(f++)); o = this._keyStr.indexOf(e.charAt(f++)); u = this._keyStr.indexOf(e.charAt(f++)); a = this._keyStr.indexOf(e.charAt(f++)); n = s << 2 | o >> 4; r = (o & 15) << 4 | u >> 2; i = (u & 3) << 6 | a; t = t + String.fromCharCode(n); if (u != 64) { t = t + String.fromCharCode(r) } if (a != 64) { t = t + String.fromCharCode(i) } } t = Base64._utf8_decode(t); return t }, _utf8_encode: function (e) { e = e.replace(/\r\n/g, "\n"); var t = ""; for (var n = 0; n < e.length; n++) { var r = e.charCodeAt(n); if (r < 128) { t += String.fromCharCode(r) } else if (r > 127 && r < 2048) { t += String.fromCharCode(r >> 6 | 192); t += String.fromCharCode(r & 63 | 128) } else { t += String.fromCharCode(r >> 12 | 224); t += String.fromCharCode(r >> 6 & 63 | 128); t += String.fromCharCode(r & 63 | 128) } } return t }, _utf8_decode: function (e) { var t = ""; var n = 0; var r = c1 = c2 = 0; while (n < e.length) { r = e.charCodeAt(n); if (r < 128) { t += String.fromCharCode(r); n++ } else if (r > 191 && r < 224) { c2 = e.charCodeAt(n + 1); t += String.fromCharCode((r & 31) << 6 | c2 & 63); n += 2 } else { c2 = e.charCodeAt(n + 1); c3 = e.charCodeAt(n + 2); t += String.fromCharCode((r & 15) << 12 | (c2 & 63) << 6 | c3 & 63); n += 3 } } return t } };
$(document).ready(function () {
    if (!localStorage.getItem("us")) {
        window.location.href = "../login";
    }
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
    $("#txttungay_cb").val(getDateTimeCurrent());
    $("#txtdenngay_cb").val(getDateTimeCurrent());
    $("#btnthuchien_cb").click(function () {

    })
    handleSidebarNode();
});
function getDateTimeCurrent() {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    const day = currentDate.getDate();
    return `${day.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}/${year} `;
}

function handleSidebarNode() {
    var node = JSON.parse(localStorage.getItem("node"));
    if (node == undefined) {
        var userinfo = localStorage.getItem("us");
        var user = JSON.parse(Base64.decode(userinfo));
        var danhmucid = user.danhmucid;
        var danhmuc_lo = user.danhmuc_lo;
        if (danhmucid.length > 0 && danhmucid != '-1') {
            $(".canhbaoami").removeClass("d-none");
            $(".canhbaortu").addClass("d-none");
            getCanhBaoVanHanhAMI(danhmucid, "-1");
        } else {
            $(".canhbaoami").addClass("d-none");
            $(".canhbaortu").removeClass("d-none");
            getCanhBaoVanHanhRTU(danhmuc_lo, "-1");
        }
    } else {
        let tree = node.tree;
        var meterid = node.type == 9 ? node.id : "-1";
        var danhmucid = node.type == 9 ? "-1" : node.id;
        if (tree == 2) {
            $(".canhbaoami").addClass("d-none");
            $(".canhbaortu").removeClass("d-none");
            getCanhBaoVanHanhRTU(danhmucid, meterid.toString());
        } else {
            $(".canhbaoami").removeClass("d-none");
            $(".canhbaortu").addClass("d-none");
            getCanhBaoVanHanhAMI(danhmucid, meterid.toString());
        }
    }


}
function getCanhBaoVanHanhAMI(danhmucid, meterid) {
    var CbParameter = new Object();
    CbParameter.v_danhmucid = danhmucid;
    CbParameter.v_meterid = meterid;
    CbParameter.v_tungay = $("#txttungay_cb").val();
    CbParameter.v_denngay = $("#txtdenngay_cb").val();

    $.ajax({
        url: "/api/thongtincanhbao_laycanhbaoami",
        data: JSON.stringify(CbParameter),
        type: "POST",
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: function (result) {
            drawDataCanhBaoAMI(result);

        },
        complete: function (xhr, textStatus) {

            if (xhr.status == "401") {
                window.location.href = '/Login/Logout'
            }
            else if (xhr.status == "400") {
                toastr.error(xhr.responseJSON.message, "Thông báo", {
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
        }


    });
}
function drawDataCanhBaoAMI(data) {
    $("#dienapcao").html(data[0].dienapcao);
    $("#dienapthap").html(data[0].dienapthap);
    $("#matcanbangdienap").html(data[0].matcanbangdienap);
    $("#quadongdien").html(data[0].quadongdien);
    $("#matcanbangdongdien").html(data[0].matcanbangdongdien);
    $("#lechpha").html(data[0].lechphadongdien);
    $("#hesocongsuatcos").html(data[0].hesocongsuat_cos);
    $("#goclechpha").html(data[0].goclechpha_angle);
    $("#dongmohopcongto").html(data[0].dongmohopcongto);
    $("#rodien").html(data[0].rodien);
}

function getCanhBaoVanHanhRTU(danhmucid, meterid) {
    // var CbParameter = new Object();
    // CbParameter.v_danhmucid = danhmucid;
    // CbParameter.v_meterid = meterid;
    // CbParameter.v_tungay = $("#txttungay_cb").val();
    // CbParameter.v_denngay = $("#txtdenngay_cb").val();

    // $.ajax({
    //     url: "/api/thongtincanhbao_laycanhbaortu",
    //     data: JSON.stringify(CbParameter),
    //     type: "POST",
    //     contentType: "application/json;charset=utf-8",
    //     dataType: "json",
    //     success: function (result) {
    //         var data = result;
    //         drawDataCanhBaoAMI(data);

    //     },
    //     complete: function (xhr, textStatus) {

    //         if (xhr.status == "401") {
    //             window.location.href = '/Login/Logout'
    //         }
    //         else if (xhr.status == "400") {
    //             toastr.error(xhr.responseJSON.message, "Thông báo", {
    //                 positionClass: "toast-bottom-right",
    //                 timeOut: 5e3,
    //                 closeButton: !0,
    //                 debug: !1,
    //                 newestOnTop: !0,
    //                 progressBar: !0,
    //                 preventDuplicates: !0,
    //                 onclick: null,
    //                 showDuration: "300",
    //                 hideDuration: "1000",
    //                 extendedTimeOut: "1000",
    //                 showEasing: "swing",
    //                 hideEasing: "linear",
    //                 showMethod: "fadeIn",
    //                 hideMethod: "fadeOut",
    //                 tapToDismiss: !1
    //             });
    //             return;
    //         }
    //     }


    // });
}

function showDetailWarning(loaicanhbao) {

    if ((loaicanhbao == "OpenMeterBox_OC" && parseInt($("#dongmohopcongto").html()) > 0) || (loaicanhbao == "ElectrICalLeak_SC" && parseInt($("#rodien").html()) > 0)) {
        getCanhBaoTucThoiChiTiet(loaicanhbao);
        $("#modal_sukientucthoi_chitiet").modal("show");

    }
    else if ((loaicanhbao == "U_QUA" && parseInt($("#dienapcao").html()) > 0) || (loaicanhbao == "U_DUOI" && parseInt($("#dienapthap").html()) > 0)
        || (loaicanhbao == "U_MATCB" && parseInt($("#matcanbangdienap").html()) > 0) || (loaicanhbao == "I_QUA" && parseInt($("#quadongdien").html()) > 0)
        || (loaicanhbao == "I_MATCB" && parseInt($("#matcanbangdongdien").html()) > 0)
        || (loaicanhbao == "I_LECH" && parseInt($("#lechpha").html()) > 0)
        || (loaicanhbao == "COS" && parseInt($("#hesocongsuatcos").html()) > 0)
        || (loaicanhbao == "ANGLE" && parseInt($("#goclechpha").html()) > 0)

    ) {
        getCanhBaoVanHanhChiTiet(loaicanhbao);
        $("#modal_canhbaovanhanh_chitiet").modal("show");
    }
    else {

        $("#modal_canhbaovanhanh_chitiet").modal("hide");
        $("#modal_sukientucthoi_chitiet").modal("hide");

    }
}

//===================== cảnh báo tức thời chi tiết========================
function getCanhBaoTucThoiChiTiet(loaicanhbao) {
    var node = JSON.parse(localStorage.getItem("node"));
    var ChiSoParameter = new Object()
    if (node == undefined) {
        var userinfo = localStorage.getItem("us");
        var user = JSON.parse(Base64.decode(userinfo));
        var danhmucid = user.danhmucid;
        ChiSoParameter.v_danhmucid = danhmucid;
        ChiSoParameter.v_meterid = "-1";
    } else {
        var meterid = node.type == 9 ? node.id : "-1";
        var danhmucid = node.type == 9 ? "-1" : node.id;
        ChiSoParameter.v_danhmucid = danhmucid;
        ChiSoParameter.v_meterid = meterid;
    }

    ChiSoParameter.v_meterid = meterid.toString();
    ChiSoParameter.v_tungay = $("#txttungay_cb").val();
    ChiSoParameter.v_denngay = $("#txtdenngay_cb").val();
    ChiSoParameter.v_loaicanhbao = loaicanhbao;
    $.ajax({
        url: "/api/thongtincanhbao_laysukien_tucthoi_chitiet",
        data: JSON.stringify(ChiSoParameter),
        type: "POST",
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: function (result) {
            drawData_sukientucthoi_chitiet(result);
        },
        error: function (errormessage) {
            toastr.error(errormessage.responseText, "Thông báo", {
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

        }
    })
}
function drawData_sukientucthoi_chitiet(lst) {
    var str2 = "";
    var background = "";
    $("#tbl_sukientucthoi_chitiet tbody").html("");
    $('#tbl_sukientucthoi_chitiet').DataTable().destroy();
    $.each(lst, function (k, v) {


        if (v.value != null) {

            if (v.value.indexOf("START") > -1) {
                background = "#dd4b39bf";
            }
            else if (v.value.indexOf("STOP") > -1) {
                background = "#00a65a3b";
            }
            else {
                background = "#dd4b39bf";
            }
        } else {
            background = "#dd4b39bf";
        }
        str2 += "<tr>";

        str2 += "<td   style='text-align: center;vertical-align: middle;font-weight:bold'>" + v.stt + "</td>";
        str2 += "<td>" + retNull(v.ten_khachhang) + "</td>";
        str2 += "<td>" + retNull(v.socongto) + "</td>";
        str2 += "<td  style='background:" + background + ";width: 300px;'>" + v.event + "</td>";
        str2 += "<td style='text-align:center'>" + v.timemin + "</td>";
        str2 += "<td>" + retNull(v.donvi) + "</td>";
        str2 += "</tr>";
    });
    $("#tbl_sukientucthoi_chitiet tbody").html(str2);
    setTimeout(function () {
        getStyleCanhBaoTucThoiChiTiet();
    }, 200)

}
function getStyleCanhBaoTucThoiChiTiet() {
    $('#tbl_sukientucthoi_chitiet').DataTable({
        dom: 'Bfrtip',
        buttons: [
            {
                extend: 'excelHtml5',
                title: "Sự kiện tức thời"
            }
        ],
        'scrollX': true,
        'scrollCollapse': true,
        'paging': true,
        'lengthChange': false,
        /*"order": [[0, "asc"]],*/
        ordering: true,
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
};
//=====================Cảnh báo vận hành chi tiết ======================
function getCanhBaoVanHanhChiTiet(loaicanhbao) {
    var node = JSON.parse(localStorage.getItem("node"));
    var ChiSoParameter = new Object()
    if (node == undefined) {
        var userinfo = localStorage.getItem("us");
        var user = JSON.parse(Base64.decode(userinfo));
        var danhmucid = user.danhmucid;
        ChiSoParameter.v_danhmucid = danhmucid;
        ChiSoParameter.v_meterid = "-1";
    } else {
        var meterid = node.type == 9 ? node.id : "-1";
        var danhmucid = node.type == 9 ? "-1" : node.id;
        ChiSoParameter.v_danhmucid = danhmucid;
        ChiSoParameter.v_meterid = meterid;
    }

    ChiSoParameter.v_meterid = meterid.toString();
    ChiSoParameter.v_tungay = $("#txttungay_cb").val();
    ChiSoParameter.v_denngay = $("#txtdenngay_cb").val();
    ChiSoParameter.v_loaicanhbao = loaicanhbao;
    $.ajax({
        url: "/api/thongtincanhbao_laycanhbaovanhanh_chitiet",
        data: JSON.stringify(ChiSoParameter),
        type: "POST",
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: function (result) {
            drawData_canhbaovanhanh_chitiet(result);
        },
        error: function (errormessage) {
            toastr.error(errormessage.responseText, "Thông báo", {
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

        }
    })
}

function drawData_canhbaovanhanh_chitiet(data) {
    var activeRequestsTable = $('#tbl_canhbaovanhanh_chitiet').DataTable();
    activeRequestsTable.state.clear();
    activeRequestsTable.destroy();
    $("#tbl_canhbaovanhanh_chitiet tbody").html("");
    var str = "";
    var str1 = "";
    var stt = 0;
    $.each(data, function (k, v) {
        stt = stt + 1;
        str1 += "<tr>";
        str1 += "<td style='font-weight:bold'>Mã điểm đo: " + v.madiemdo + " - Tên khách hàng: " + v.tenkhachhang + "</td >";
        str1 += "<td   style='text-align: center;vertical-align: middle;font-weight:bold'>" + stt + "</td>";
        str1 += "<td style='display:none'>" + v.madiemdo + "</td>";
        str1 += "<td style='display:none'>" + v.tenkhachhang + "</td>";
        str1 += "<td style='text-align:center'>" + v.tgcanhbao + "</td>";
        str1 += "<td style='text-align:center'>" + v.tgcanhbaogannhat + "</td>";
        str1 += "<td style='text-align:center'>" + v.noidungcanhbao + "</td>";
        str1 += "</tr>";
    });
    $("#tbl_canhbaovanhanh_chitiet tbody").html(str1);
    setTimeout(function () {
        getStyleTable_CanBaoVanhanh();
    }, 200);

}

function getStyleTable_CanBaoVanhanh() {
    $('#tbl_canhbaovanhanh_chitiet').DataTable({
        dom: 'Bfrtip',
        buttons: [
            {
                extend: 'excel',
                exportOptions: {
                    columns: [1, 2, 3, 4, 5, 6, 7]
                }
            }
        ],
        rowGroup: {
            dataSrc: 0
        },
        "columnDefs": [
            { "visible": false, "targets": 0 }
        ],
        "order": [[1, "asc"]],
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