$(document).ready(function () {
    if (!localStorage.getItem("us")) {
        window.location.href = "../login";
    }
    $(".thang").hide();
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

    $("#txttungaydate").val(getDateTimeCurrent());
    $("#txtdenngaydate").val(getDateTimeCurrent());



    $("#btnthuchien_dscb").click(function () {
        var node = JSON.parse(localStorage.getItem("node"));
        var tree = node.tree;
        if (tree == 2) {
            loadDanhSachCanhBao();
        } else {
            LayDanhSachCanhBaoVanHanh();
        }

    });
    handleSidebarNode();

});

function handleSidebarNode() {

    var node = JSON.parse(localStorage.getItem("node"));
    let danhmucid = node.id;
    let loaithumuc = node.type;
    var tree = node.tree;
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
    if (tree == 2) {
        $("#tbl_canhbao tbody").empty();
        loadDanhSachCanhBao();
        $(".danhsachcanhbao").show();
        $(".canhbaovanhanh").hide();
    } else {
        getCanhBaoVanHanh();
        $(".danhsachcanhbao").hide();
        $(".canhbaovanhanh").show();
    }



}

function getCanhBaoVanHanh() {
    $.ajax({
        url: "/api/canhbao_ds_laycanhbaovh",
        data: {},
        type: "GET",
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: function (result) {

            $('#cbloaicanhbao').html(`<option value="-1">--Tất cả--</option>`);
            if (result == null || result == undefined || result == "[]") return

            $.each(result, function (k, v) {
                $('#cbloaicanhbao').append("<option value=" + v.maloai + ">" + v.tenloai + "</option>");
            });
            LayDanhSachCanhBaoVanHanh();
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
    })
}

function getDateTimeCurrent() {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    const day = currentDate.getDate();
    return `${day.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}/${year} `;
}

function loadDanhSachCanhBao() {
    var node = JSON.parse(localStorage.getItem("node"));
    let loaidanhmuc = node.type;
    let danhmucid = loaidanhmuc == 9 ? "-1" : node.id;
    let idthietbi = loaidanhmuc == 9 ? parseInt(node.id) : -1;
    var tungay = $("#txttungaydate").val();
    var denngay = $("#txtdenngaydate").val();

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
        v_tungay: tungay,
        v_denngay: denngay,
        v_danhmucid: danhmucid,
        v_idthietbi: idthietbi
    }
    $.ajax({
        url: "/api/scada_canhbao_ds_canhbao",
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
    $("#tbl_canhbao_ami_wrapper").hide();
    $("#tbl_canhbao_wrapper").show();
    $("#tbl_canhbao tbody").empty();
    var activeRequestsTable = $("#tbl_canhbao").DataTable();
    activeRequestsTable.state.clear();
    activeRequestsTable.destroy();

    $.each(obj, function (k, v) {
        var data = JSON.parse(obj[k]);
        row += "<tr>"
        row += "<td style='width:50px'>" + data.stt + "</td>";
        row += "<td>" + data.tenthietbi + "</td>";
        row += "<td>" + data.tencambien + "</td>";
        row += "<td>" + data.noidungcanhbao + "</td>";
        row += "<td class='text-center'>" + data.thoigianbatdau + "</td>";
        row += "<td class='text-center'>" + data.thoigianketthuc + "</td>";
        row += "<td class='text-right'>" + retNull(data.solancb) + "</td>";
        row += "</tr>"
    });
    $("#tbl_canhbao tbody").html(row);

    getStyleTable1();

}
function getStyleTable1() {

    $('#tbl_canhbao').DataTable({

        "paging": true,
        "lengthChange": false,
        "searching": false,
        "ordering": true,
        "info": true,
        "autoWidth": false,
        "responsive": true,
        "pagingType": "full_numbers",
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

        "buttons": ["excel"] //["copy", "csv", "excel", "pdf", "print", "colvis"]
    });
};
function retNull(number) {
    if (number == null || number == undefined || (number == "")) {
        return '-';
    }
    return number;
}

function LayDanhSachCanhBaoVanHanh() {
    var node = JSON.parse(localStorage.getItem("node"));
    let loaidanhmuc = node.type;
    let danhmucid = loaidanhmuc == 9 ? "-1" : node.id;
    let meterid = loaidanhmuc == 9 ? node.id : "-1";
    var kh = $("#cbloaicanhbao").val();
    var kh_id = "";
    if (kh != null && kh != undefined && kh != "-1") {
        $.each(kh, function (key, val) {
            kh_id += val + ',';
        })
    } else kh_id = "-1";

    var ChiSoParameter = new Object()
    ChiSoParameter.v_danhmucid = danhmucid;
    ChiSoParameter.v_type = kh_id == "" ? "-1" : kh_id;
    ChiSoParameter.v_meterid = parseInt(meterid);

    $.ajax({
        url: "/api/canhbao_ds_canhbaovanhanh",
        data: JSON.stringify(ChiSoParameter),
        type: "POST",
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: function (result) {

            drawDataCanhBaoVanHanh(result);

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
function drawDataCanhBaoVanHanh(obj) {
    var row = "";
    $("#tbl_canhbao_ami_wrapper").show();
    $("#tbl_canhbao_wrapper").hide();
    var activeRequestsTable = $('#tbl_canhbao_ami').DataTable();
    activeRequestsTable.state.clear();
    activeRequestsTable.destroy();
    $("#tbl_canhbao_ami tbody").empty();
    $.each(obj, function (k, v) {
        row += "<tr>"
        row += "<td style='font-weight:bold'>Mã điểm đo: " + v.madiemdo + " - Tên khách hàng: " + v.ten_khachhang + "</td >";
        row += "<td style='width:50px'  class='text-center'>" + v.stt + "</td>";
        row += "<td style='display:none'>" + v.madiemdo + "</td>";
        row += "<td style='display:none'>" + v.ten_khachhang + "</td>";
        row += "<td class='text-center'>" + v.tgcanhbao + "</td>";
        row += "<td class='text-center'>" + v.tgcanhbaogannhat + "</td>";
        row += "<td>" + v.tencanhbao + "</td>";
        row += "<td>" + v.noidungcanhbao + "</td>";
        row += "</tr>"
    });
    $("#tbl_canhbao_ami tbody").html(row);
    getStyleTable();


}
function getStyleTable() {

    $('#tbl_canhbao_ami').removeAttr('width').DataTable({
        dom: 'Bfrtip',
        buttons: [
            {
                extend: 'excel',
                exportOptions: {
                    columns: [1, 2, 3, 4, 5, 6, 7]
                },
                title: "Danh sách cảnh báo"
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
    }).columns.adjust();
};