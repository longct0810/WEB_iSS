var Base64 = { _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=", encode: function (e) { var t = ""; var n, r, i, s, o, u, a; var f = 0; e = Base64._utf8_encode(e); while (f < e.length) { n = e.charCodeAt(f++); r = e.charCodeAt(f++); i = e.charCodeAt(f++); s = n >> 2; o = (n & 3) << 4 | r >> 4; u = (r & 15) << 2 | i >> 6; a = i & 63; if (isNaN(r)) { u = a = 64 } else if (isNaN(i)) { a = 64 } t = t + this._keyStr.charAt(s) + this._keyStr.charAt(o) + this._keyStr.charAt(u) + this._keyStr.charAt(a) } return t }, decode: function (e) { var t = ""; var n, r, i; var s, o, u, a; var f = 0; e = e.replace(/[^A-Za-z0-9\+\/\=]/g, ""); while (f < e.length) { s = this._keyStr.indexOf(e.charAt(f++)); o = this._keyStr.indexOf(e.charAt(f++)); u = this._keyStr.indexOf(e.charAt(f++)); a = this._keyStr.indexOf(e.charAt(f++)); n = s << 2 | o >> 4; r = (o & 15) << 4 | u >> 2; i = (u & 3) << 6 | a; t = t + String.fromCharCode(n); if (u != 64) { t = t + String.fromCharCode(r) } if (a != 64) { t = t + String.fromCharCode(i) } } t = Base64._utf8_decode(t); return t }, _utf8_encode: function (e) { e = e.replace(/\r\n/g, "\n"); var t = ""; for (var n = 0; n < e.length; n++) { var r = e.charCodeAt(n); if (r < 128) { t += String.fromCharCode(r) } else if (r > 127 && r < 2048) { t += String.fromCharCode(r >> 6 | 192); t += String.fromCharCode(r & 63 | 128) } else { t += String.fromCharCode(r >> 12 | 224); t += String.fromCharCode(r >> 6 & 63 | 128); t += String.fromCharCode(r & 63 | 128) } } return t }, _utf8_decode: function (e) { var t = ""; var n = 0; var r = c1 = c2 = 0; while (n < e.length) { r = e.charCodeAt(n); if (r < 128) { t += String.fromCharCode(r); n++ } else if (r > 191 && r < 224) { c2 = e.charCodeAt(n + 1); t += String.fromCharCode((r & 31) << 6 | c2 & 63); n += 2 } else { c2 = e.charCodeAt(n + 1); c3 = e.charCodeAt(n + 2); t += String.fromCharCode((r & 15) << 12 | (c2 & 63) << 6 | c3 & 63); n += 3 } } return t } };
$(document).ready(function () {
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

    $("#txtngay_tttl").val(getDateTimeCurrent());

    // Clock pickers
    $('.clockpicker').clockpicker({
        placement: 'bottom',
        align: 'left',
        autoclose: true,
        'default': 'now'
    });
    $('#txtngay_tttl').change(function (e) {
        getThongKeChatLuong();
        $("#currenttime").val(getTimeCurrent($("#txtngay_tttl").val()));
    });
    $('#currenttime').change(function (e) {
        getThongKeChatLuong();
    });
    $('#startingtime').change(function (e) {
        getThongKeChatLuong();
    });
    $("#currenttime").val(getTimeCurrent($("#txtngay_tttl").val()));

    handleSidebarNode();

});
function getDateTimeCurrent() {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    const day = currentDate.getDate();
    return `${day.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}/${year} `;
}
function getTimeCurrent(dateStr) {
    const now = new Date();

    // nếu không truyền ngày → dùng hiện tại
    if (!dateStr) {
        return formatTime(now);
    }

    // parse dd/MM/yyyy
    const parts = dateStr.split("/");
    if (parts.length !== 3) return formatTime(now);

    const selectedDate = new Date(
        parseInt(parts[2]),          // year
        parseInt(parts[1]) - 1,      // month
        parseInt(parts[0])           // day
    );

    // set về 00:00 để so sánh ngày
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const selected = new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        selectedDate.getDate()
    );

    // nếu là ngày quá khứ
    if (selected < today) {
        return "23:59";
    }

    // hôm nay hoặc tương lai → giờ hiện tại
    return formatTime(now);
}

function formatTime(date) {
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
}

function handleSidebarNode() {
    var node = JSON.parse(localStorage.getItem("node"));
    // if (node == undefined) {
    //     toastr.error("Vui lòng chọn danh mục", "Thông báo", {
    //         positionClass: "toast-bottom-right",
    //         timeOut: 5e3,
    //         closeButton: !0,
    //         debug: !1,
    //         newestOnTop: !0,
    //         progressBar: !0,
    //         preventDuplicates: !0,
    //         onclick: null,
    //         showDuration: "300",
    //         hideDuration: "1000",
    //         extendedTimeOut: "1000",
    //         showEasing: "swing",
    //         hideEasing: "linear",
    //         showMethod: "fadeIn",
    //         hideMethod: "fadeOut",
    //         tapToDismiss: !1
    //     });

    //     return;
    // }
    if (node == undefined) {
        getThongKeChatLuong();
        return;
    }
    var tree = node.tree;
    let loaithumuc = node.type;
    if (tree == 2) {
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
    } else {
        if (loaithumuc == 9) {
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
        } else {
            getThongKeChatLuong();
        }

    }

}

function getThongKeChatLuong() {
    var node = JSON.parse(localStorage.getItem("node"));
    var userinfo = localStorage.getItem("us");
    var user = JSON.parse(Base64.decode(userinfo));
    var tungay = $("#txtngay_tttl").val();
    var starttime = $("#startingtime").val();
    var currenttime = $("#currenttime").val();
    let danhmucid = node == undefined ? user.danhmucid : node.id;
    if (tungay == "") {
        toastr.error("Vui lòng chọn từ ngày đến ngày", "Thông báo", {
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
    else if (starttime == "" || currenttime == "") {
        toastr.error("Vui lòng chọn giờ ", "Thông báo", {
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
    var para = {
        v_danhmucid: danhmucid,
        v_ngay: tungay,
        v_starttime: starttime,
        v_currenttime: currenttime,
        v_mataikhoan: user.mataikhoan
    }
    $.ajax({
        url: "/api/thongkechatluong",
        data: JSON.stringify(para),
        type: "POST",
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: function (result) {
            drawData(result, danhmucid);

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
        }
    });
}
function drawData(result, danhmucid) {
    var kq1 = result.rows1;
    var kq2 = result.rows2;
    drawBieuDo(kq2[0]);
    var row = "";
    $("#tbl_thongkechatluong tbody").html("");
    $.each(kq1, function (k, data) {

        row += "<tr>"
        row += "<td class='text-center align-middle'>" + (k + 1) + "</td>";
        row += "<td>" + data.tendanhmuc + "</td>";
        row += "<td class='text-right text-success'>" + data.docthanhcong + "</td>";
        row += `<td class='text-right text-danger' style='cursor: pointer;' data-bs-toggle="modal" data-bs-target="#modal_XemChitiet_thongke" onClick="get_chitet_diemdo_loi('${data.danhmucid}', 'cv_1');">${data.chuacodulieu}</td>`;
        row += "<td class='text-right text-info'>" + data.tongdiemdo + "</td>";
        row += "<td class='text-right text-success'>" + data.tyle + "</td>";
        row += "</tr>"
    });

    row += "<tr>"
    row += "<td class='text-center align-middle'></td>";
    row += "<td style='font-weight:bold;'>TỔNG</td>";
    row += "<td class='text-right text-success'  style='font-weight:bold;'>" + kq2[0].docthanhcong + "</td>";
    row += `<td class='text-right text-danger'  style='font-weight:bold;cursor: pointer;' data-bs-toggle="modal" data-bs-target="#modal_XemChitiet_thongke" onClick="get_chitet_diemdo_loi('${danhmucid}','cv_2');">${kq2[0].chuacodulieu}</td>`;
    row += "<td class='text-right  text-info'  style='font-weight:bold;'>" + kq2[0].tongdiemdo + "</td>";
    row += "<td class='text-right  text-success'  style='font-weight:bold;'>" + kq2[0].tyledocthanhcong + "</td>";
    row += "</tr>"
    $("#tbl_thongkechatluong tbody").html(row);

}

function drawBieuDo(data) {

    if (this.chartDrew)
        this.chart.destroy();
    this.chart = new Chart($('#bieudo_thongkechatluong'), {
        type: 'pie',
        data: {
            labels: [`Tỉ lệ đọc thành công:${data.tyledocthanhcong} `, `Không có dữ liệu: ${Number(100 - data.tyledocthanhcong).toFixed(2)}`],
            datasets: [{
                label: '# of votes',
                data: [`${data.tyledocthanhcong}`, `${Number(100 - data.tyledocthanhcong).toFixed(2)}`],
                backgroundColor: [
                    '#52b788',
                    '#f07167',
                ],
                borderWidth: 2,
                hoverOffset: 3,
            }]
        },
        plugins: [],
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    labels: {
                        generateLabels: (chart) => {
                            const ds = chart.data.datasets
                            return ds[0].data.map((data, i) =>
                            ({
                                text: `${chart.data.labels[i]}: ${data}`,
                                fillStyle: ds[0].backgroundColor[i],
                            })
                            )
                        },
                    }
                }
            }
        }
    });
    this.chartDrew = true;
}
function get_chitet_diemdo_loi(danhmucid, phanbiet) {
    var tungay = $("#txtngay_tttl").val();
    var starttime = $("#startingtime").val();
    var currenttime = $("#currenttime").val();
    var userinfo = localStorage.getItem("us");
    var user = JSON.parse(Base64.decode(userinfo));

    if (tungay == "") {
        toastr.error("Vui lòng chọn từ ngày đến ngày", "Thông báo", {
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
    else if (starttime == "" || currenttime == "") {
        toastr.error("Vui lòng chọn giờ ", "Thông báo", {
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
    var para = {
        v_danhmucid: danhmucid,
        v_ngay: tungay,
        v_starttime: starttime,
        v_currenttime: currenttime,
        v_mataikhoan: user.mataikhoan,
        v_phanbiet: phanbiet
    }
    $.ajax({
        url: "/api/thongkechatluong_getdiemdoloi",
        data: JSON.stringify(para),
        type: "POST",
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: function (result) {
            draw_get_chitet_diemdo_loi(result);

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
        }
    });
}
function draw_get_chitet_diemdo_loi(result) {

    var data = result.rows1;

    // Hủy DataTable nếu đã được khởi tạo
    var tableElement = $('#tbl_xemchitiet_thongkect');
    if ($.fn.DataTable.isDataTable(tableElement)) {
        tableElement.DataTable().clear().destroy();
    }

    // Tạo nội dung HTML cho bảng
    var str1 = "";
    var stt = 0;
    $.each(data, function (k, v) {
        stt++;
        str1 += "<tr>";
        str1 += "<td style='text-align: center; vertical-align: middle; font-weight: bold'>" + stt + "</td>";
        str1 += "<td style='text-align: center;'>" + v.socongto + "</td>";
        str1 += "<td>" + v.tenkhachhang + "</td>";
        str1 += "<td>" + retNull(v.tendanhmuc) + "</td>";
        str1 += "</tr>";
    });

    // Gán nội dung vào bảng

    $("#tbl_xemchitiet_thongkect tbody").html(str1);

    // Sau khi bảng đã vẽ xong, áp dụng DataTable
    if (data.length == 0) {
        setTimeout(function () {
            getStyleTable1();
        }, 100)
    } else {
        getStyleTable1();
    }


}

function getStyleTable1() {

    $('#tbl_xemchitiet_thongkect').removeAttr('width').DataTable({
        dom: '<"top">Bfirt<"bottom"lp><"clear">',
        buttons: [
            //'excelHtml5'           
            {
                extend: 'excel',
                title: "Chi tiết điểm đo lỗi"

            }
        ],

        'scrollX': true,
        'scrollCollapse': true,
        'pageLength': 10,
        "lengthMenu": [10, 20, 50, 100, 200, "All"],
        'paging': true,
        "pagingType": "full_numbers",
        'lengthChange': false,
        'searching': true,
        'ordering': false,
        'info': true,
        'autoWidth': false,
        "language": {
            "sProcessing": "Đang xử lý...",
            "sLengthMenu": "Xem _MENU_ bản ghi",
            "sZeroRecords": "Không tìm thấy dòng nào phù hợp",
            "sInfo": "Đang xem _START_ đến _END_ trong tổng số _TOTAL_ bản ghi",
            "sInfoEmpty": "Đang xem 0 đến 0 trong tổng số 0 bản ghi",
            "sInfoFiltered": "(được lọc từ _MAX_ bản ghi)",
            "sInfoPostFix": "",
            "sSearch": "Tìm:",
            "sUrl": "",
            "oPaginate": {
                "sFirst": "Đầu",
                "sPrevious": "Trước",
                "sNext": "Tiếp",
                "sLast": "Cuối"
            }
        },
        "initComplete": function (settings, json) {
            $("#tbl_xemchitiet_thongkect").wrap("<div style='overflow:auto; width:100%;position:relative;' class='table-container'></div>");
        },

    }).columns.adjust().draw();



};
function retNull(number) {
    if (number == null || number == undefined || (number == "")) {
        return '-';
    }
    return number;
}