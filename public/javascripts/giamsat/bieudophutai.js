
var getThang = "";
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


    $("#sllocdulieu_bdpt").on('change', function () {
        loadBieuDoPhuTai();
    });
    $("#slgio_bdpt").on('change', function () {
        loadBieuDoPhuTai();
    });
    $("#btnthuchien_bdpt").click(function () {
        loadBieuDoPhuTai();
    });
    handleSidebarNode();
});
function handleSidebarNode() {

    loadGio_bdpt();
    $("#txtngay_bdpt").val(getDateTimeCurrent());
    var node = JSON.parse(localStorage.getItem("node"));
    let loaithumuc = node.type;
    if (loaithumuc == 9) {
        let Meterid = node.id;
        let tenkhachhang = node.tendanhmuc;
        let loaipha = node.loaipha;
        openModalChiTiet_bdpt(Meterid, tenkhachhang, loaipha);
        $("#modal_giamsat").modal("show");
    } else {
        loadBieuDoPhuTai();
        $("#modal_giamsat").modal('hide');
    }

}

function loadGio_bdpt() {
    var data = getListTime();
    $("#slgio_bdpt").empty();
    $("#slgio_bdpt").append(`<option value="-1">Tất cả</option>`);
    $.each(data, function (index, item) {
        $("#slgio_bdpt").append(`<option value="${item.value}">${item.value}</option>`);
    })

}
function getDateTimeCurrent() {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    const day = currentDate.getDate();
    return `${day.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}/${year} `;
}

function loadBieuDoPhuTai() {

    var node = JSON.parse(localStorage.getItem("node"));
    let loaidanhmuc = node.type;
    let danhmucid = node.id;
    var locdulieu = $("#sllocdulieu_bdpt").val();
    var ngay = $("#txtngay_bdpt").val();
    var gio = $("#slgio_bdpt").val();
    var node = JSON.parse(localStorage.getItem("node"));

    if (danhmucid == null) {
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
    if (loaidanhmuc < 5 || node.socongto != null) {
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


    var ChiSoParameter = new Object();
    ChiSoParameter.v_danhmucid = danhmucid;
    ChiSoParameter.v_locdulieu = parseInt(locdulieu);
    ChiSoParameter.v_ngay = ngay;
    ChiSoParameter.v_gio = $("#slgio_bdpt").val();
    ChiSoParameter.v_sotrang = 0;
    ChiSoParameter.v_sodong = 100000;
    ChiSoParameter.v_mataikhoan = 1;
    $.ajax({
        url: "/api/khaithacdulieu_laybieudophutai",
        data: JSON.stringify(ChiSoParameter),
        type: "POST",
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: function (result) {
            drawData(result);
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
    var activeRequestsTable = $('#tbl_bdpt').DataTable();
    activeRequestsTable.state.clear();
    activeRequestsTable.destroy();
    $("#tbl_bdpt thead").html("");
    $("#tbl_bdpt tbody").html("");
    var str = "";
    if ($("#sllocdulieu_bdpt").val() == "0") {
        str += "<tr>";
        str += "<th>STT</th>";
        str += "<th>Tên khách hàng</th>";
        str += "<th>Số công tơ</th>";
        str += "<th>Thời điểm</th>";
        str += "<th>P tổng giao (kW)</th>";
        str += "<th>P tổng nhận (kW)</th>";
        str += "<th>Q tổng giao (kVar)</th>";
        str += "<th>Q tổng nhận (kVar)</th>";
        str += "<th>SL P Giao</th>";
        str += "<th>SL P Nhận</th>";
        str += "<th>SL Q Giao</th>";
        str += "<th>SL Q Nhận</th>";
        str += "</tr>";
    } else {
        str += "<tr>";
        str += "<th>STT</th>";
        str += "<th>Tên khách hàng</th>";
        str += "<th>Số công tơ</th>";
        str += "<th>Loại công tơ</th>";
        str += "<th>IMEI</th>";
        str += "<th>Mã cột</th>";
        str += "<th>Mã trạm</th>";
        str += "</tr>";
    }
    $("#tbl_bdpt thead").append(str);

    var str1 = "";
    var stt = 0;
    $.each(data, function (k, v) {
        stt = stt + 1;
        if ($("#sllocdulieu_bdpt").val() == "0") {
            str1 += "<tr data-bs-toggle='modal' data-bs-target='#modal_giamsat' onclick='openModalChiTiet_bdpt(\"" + v.meterid + "\",\"" + v.tenkhachhang + "\",3)' style='cursor: pointer;'>";
            str1 += "<td   style='text-align: center;vertical-align: middle;font-weight:bold'>" + stt + "</td>";
            str1 += "<td>" + v.tenkhachhang + "</td>";
            str1 += "<td>" + v.socongto + "</td>";
            str1 += "<td style='text-align:center'>" + v.starttime + "</td>";
            str1 += "<td style='text-align:center'>" + retNull(v.pgiao) + "</td>";
            str1 += "<td style='text-align:center'>" + retNull(v.pnhan) + "</td>";
            str1 += "<td style='text-align:center'>" + retNull(v.qgiao) + "</td>";
            str1 += "<td style='text-align:center'>" + retNull(v.qnhan) + "</td>";
            str1 += "<td style='text-align:center'>" + retNull(v.sl_pgiaotong) + "</td>";
            str1 += "<td style='text-align:center'>" + retNull(v.sl_pnhantong) + "</td>";
            str1 += "<td style='text-align:center'>" + retNull(v.sl_qgiaotong) + "</td>";
            str1 += "<td style='text-align:center'>" + retNull(v.sl_qnhantong) + "</td>";
            str1 += "</tr>";

        } else {
            str1 += "<tr>";
            str1 += "<td>" + stt + "</td>";
            str1 += "<td>" + v.tenkhachhang + "</td>";
            str1 += "<td>" + v.socongto + "</td>";
            str1 += "<td>" + retNull(v.loaicongto) + "</td>";
            str1 += "<td>" + v.imei + "</td>";
            str1 += "<td>" + retNull(v.macot) + "</td>";
            str1 += "<td>" + retNull(v.matram) + "</td>";
            str1 += "</tr>";
        }

    });
    $("#tbl_bdpt tbody").html(str1);
    $("#messageerror_bdpt").hide();
    $("#content-w_bdpt").show();
    getStyleTable_bdpt();
}
function getStyleTable_bdpt() {
    $('#tbl_bdpt').DataTable({
        dom: '<"top">Bfirt<"bottom"lp><"clear">',
        buttons: [
            'excelHtml5'
        ],
        'scrollX': true,
        'scrollCollapse': true,
        'pageLength': 100,
        "lengthMenu": [20, 50, 100, 200, "All"],
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
    })
};
function retNull(number) {
    if (number === null || number === undefined || (number === '')) {
        return '-';
    }
    return number;
}

function setDatePickerValue(selector, value) {
    const picker = $(selector).pickadate('picker');
    if (picker) {
        const parts = value.split('/');
        if (parts.length === 3) {
            picker.set('select', [parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0])]);
        }
    } else {
        $(selector).val(value);
    }
}