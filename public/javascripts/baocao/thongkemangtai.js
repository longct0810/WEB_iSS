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

    $("#txttungay_tkmt").val(getDateTimeCurrent());
    $("#txtdenngay_tkmt").val(getDateTimeCurrent());
    handleSidebarNode();
    $("#btnthuchien_tkmt").click(function () {
        getThongKeMangTai();
    });
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
            getThongKeMangTai();
        }

    }

}

function getThongKeMangTai() {
    var node = JSON.parse(localStorage.getItem("node"));
    let danhmucid = node.id;
    var tungay = $("#txttungay_tkmt").val();
    var denngay = $("#txtdenngay_tkmt").val();
    var loaitai = parseInt($("#cboloaitai").val());
    var canbang = parseInt($("#cbo_canpha").val());

    if (tungay == "" || denngay == "") {
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
    var para = {
        v_Danhmucid: danhmucid,
        v_Tungay: tungay,
        v_Denngay: denngay,
        v_Loaitai: loaitai,
        v_Canpha: canbang,
        v_pagenum: 0,
        v_numrecs: 100000,
        v_mataikhoan: 1
    }
    $.ajax({
        url: "/api/baocaothongkemangtai",
        data: JSON.stringify(para),
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
        }
    });
}
function drawData(obj) {
    var row = "";
    var activeRequestsTable = $("#tbl_tkmt").DataTable();
    activeRequestsTable.state.clear();
    activeRequestsTable.destroy();
    var node = JSON.parse(localStorage.getItem("node"));

    $.each(obj, function (k, data) {
        row += "<tr>"
        row += "<td class='text-center align-middle'>" + data.stt + "</td>";
        row += "<td class='text-center align-middle'>" + data.tenkhachhang + "</td>";
        row += "<td class='text-center align-middle'>" + data.socongto + "</td>";
        row += "<td class='text-right'>" + retNull(data.congsuat) + "</td>";
        row += "<td class='text-right'>" + retNull(data.ucaoha) + "</td>";
        row += "<td class='text-right'>" + retNull(data.uha) + "</td>";
        row += "<td class='text-right'>" + retNull(data.idinhmuc) + "</td>";
        row += "<td class='text-right'>" + retNull(data.ia) + "</td>";
        row += "<td class='text-right'>" + retNull(data.ib) + "</td>";
        row += "<td class='text-right'>" + retNull(data.ic) + "</td>";
        row += "<td class='text-right'>" + retNull(data.io) + "</td>";
        row += "<td class='text-right'>" + retNull(data.imax) + "</td>";
        row += "<td class='text-right'>" + retNull(data.ua) + "</td>";
        row += "<td class='text-right'>" + retNull(data.ub) + "</td>";
        row += "<td class='text-right'>" + retNull(data.uc) + "</td>";
        row += "<td class='text-right'>" + retNull(data.cosfi) + "</td>";
        row += "<td class='text-right'>" + retNull(data.itb) + "</td>";
        row += "<td class='text-right'>" + retNull(data.canpha) + "</td>";
        row += "<td class='text-right'>" + retNull(data.time) + "</td>";
        row += "<td class='text-right'>" + retNull(data.mucdomangtai) + "</td>";
        row += "<td class='text-right'>" + retNull(data.ghichu) + "</td>";
        row += "</tr>"



    });
    $("#tbl_tkmt tbody").html(row);

    getStyleTable1();
}
function getStyleTable1() {

    $('#tbl_tkmt').removeAttr('width').DataTable({
        dom: '<"top">Bfirt<"bottom"lp><"clear">',
        buttons: [
            //'excelHtml5'           
            {
                extend: 'excel',
                title: "Báo cáo thống kê mang tải"

            }
        ],

        'scrollX': true,
        'scrollCollapse': true,
        'pageLength': 100,
        "lengthMenu": [20, 50, 100, 200, "All"],
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
        }

    });



};
function retNull(number) {
    if (number == null || number == undefined || (number == "")) {
        return '-';
    }
    return number;
}