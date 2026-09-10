
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
    $("#txttungay").val(getDateTimeCurrent());
    $("#txtdenngay").val(getDateTimeCurrent());
    $('#txtthang_csct').val(gettimenow_cscthang());

    $('a[data-bs-toggle="tab"]').on('shown.bs.tab', function (e) {
        let target = $(e.target).attr("href"); // Get the target pane ID
        const node = JSON.parse(localStorage.getItem("node") || "{}");
        const meterId = Number(node.type) === 9 ? node.id : -1;
        if (target == "#sukientucthoi") {
            loadChiTietSuKienTucThoi(meterId);
        } else {
            getSuKienCongTo(meterId);
        }

    });
    loadloaicanhbao();
    loadChiTietSuKienTucThoi(-1);
    $("#btnthuchien_skct").click(function () {
        const node = JSON.parse(localStorage.getItem("node") || "{}");
        const meterId = Number(node.type) === 9 ? node.id : -1;
        getSuKienCongTo(meterId);
    });


});

function handleSidebarNode() {
    const node = JSON.parse(localStorage.getItem("node") || "{}");
    const meterId = Number(node.type) === 9 ? node.id : -1;
    loadChiTietSuKienTucThoi(meterId);
}


function getDateTimeCurrent() {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    const day = currentDate.getDate();
    return `${day.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}/${year} `;
}
function loadloaicanhbao() {
    $.ajax({
        url: "/api/khaithacdulieu_sukiencongto_layloaicanhbao",
        data: {},
        type: "GET",
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: function (result) {

            $('#cbloaicanhbao').html(`<option value="-1">--Tất cả--</option>`);
            if (result == null || result == undefined || result == "[]") return

            $.each(result, function (k, v) {
                $('#cbloaicanhbao').append("<option value=" + v.maloai + ">" + v.tenloai + "</option>")
            });
            // $('#cbloaicanhbao').val("-1");
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
//load chỉ số
function getSuKienCongTo(meterid) {
    var node = JSON.parse(localStorage.getItem("node"));
    let loaidanhmuc = node.type;
    let danhmucid = loaidanhmuc == 9 ? "-1" : node.id;
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
    var tungay = $("#txttungay").val()
    var denngay = $("#txtdenngay").val()
    //kiểm tra từ ngày đến ngày
    var day = compareDates(timeyyyymmdd($('#txttungay').val()), timeyyyymmdd($('#txtdenngay').val()))
    if (day > 31) {
        toastr.error("Vui lòng chọn tối đa 31 ngày để xem dữ liệu", "Thông báo", {
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
    var day = compareTwoDate(timeyyyymmdd($('#txttungay').val()), timeyyyymmdd($('#txtdenngay').val()))
    if (day == 1) {
        toastr.error("Từ ngày nhỏ hơn đến ngày", "Thông báo", {
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
    ChiSoParameter.v_tungay = tungay;
    ChiSoParameter.v_denngay = denngay;
    ChiSoParameter.v_meterid = parseInt(meterid);
    $.ajax({
        url: "/api/khaithacdulieu_sukiencongto_laysukienct",
        data: JSON.stringify(ChiSoParameter),
        type: "POST",
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: function (result) {
            drawData(result)
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

function drawData(data) {
    var activeRequestsTable = $('#tbl_chitietsukienct').DataTable();
    activeRequestsTable.state.clear();
    activeRequestsTable.destroy();
    $("#tbl_chitietsukienct tbody").html("")
    var str1 = ""
    $.each(data, function (k, v) {

        str1 += "<tr>"
        str1 += "<td   style='text-align: center;vertical-align: middle;font-weight:bold'>" + v.stt + "</td>"
        str1 += "<td>" + retNull(v.madiemdo) + "</td>"
        str1 += "<td>" + v.tenkhachhang + "</td>"
        str1 += "<td>" + v.socongto + "</td>"
        str1 += "<td>" + retNull(v.event) + "</td>"
        str1 += "<td>" + retNull(v.phase) + "</td>"
        str1 += "<td style='text-align:center'>" + retNull(v.timemin) + "</td>"
        str1 += "<td style='text-align:center'>" + retNull(v.timemax) + "</td>"
        str1 += "<td style='text-align:center'>" + retNull(v.solan) + "</td>"
        str1 += "<td>" + retNull(v.donvi) + "</td>"
        str1 += "</tr>"
    })
    $("#tbl_chitietsukienct tbody").html(str1);
    getStyleTable()
}
function getStyleTable() {
    $('#tbl_chitietsukienct').DataTable({
        dom: 'Bfrtip',
        buttons: [
            {
                extend: 'excelHtml5',
                title: "Sự kiện công tơ"
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

    }).columns.adjust();
};

function loadChiTietSuKienTucThoi(meterid) {
    const node = JSON.parse(localStorage.getItem("node") || "{}");
    const loaidanhmuc = Number(node.type);
    const danhmucid = loaidanhmuc === 9 ? -1 : node.id;

    if (danhmucid == null || danhmucid === undefined) {
        showToastError("Vui lòng chọn danh mục");
        return;
    }

    if (loaidanhmuc < 5) {
        showToastError("Vui lòng chọn trạm");
        return;
    }

    const $table = $("#tbl_sukientucthoi");

    if ($.fn.DataTable.isDataTable($table)) {
        $table.DataTable().destroy();
    }

    $table.find("tbody").empty();

    $table.DataTable({
        processing: true,
        serverSide: true,
        destroy: true,
        searching: true,
        ordering: false,
        lengthChange: true,
        pageLength: 20,
        lengthMenu: [10, 20, 50, 100],
        autoWidth: false,
        ajax: function (data, callback, settings) {
            const params = {
                v_danhmucid: danhmucid,
                v_meterid: parseInt(meterid, 10),
                v_start: data.start || 0,
                v_length: data.length || 20,
                v_search: data.search?.value || "",
                v_draw: data.draw || 1
            };

            $.ajax({
                url: "/api/khaithacdulieu_sukiencongto_laysukien_tucthoi",
                type: "POST",
                data: JSON.stringify(params),
                contentType: "application/json;charset=utf-8",
                dataType: "json",
                success: function (res) {
                    callback({
                        draw: data.draw,
                        recordsTotal: Number(res.recordsTotal || 0),
                        recordsFiltered: Number(res.recordsFiltered || 0),
                        data: Array.isArray(res.data) ? res.data : []
                    });
                },
                error: function (xhr) {
                    showToastError(xhr?.responseJSON?.message || xhr?.responseText || "Có lỗi xảy ra");
                    callback({
                        draw: data.draw,
                        recordsTotal: 0,
                        recordsFiltered: 0,
                        data: []
                    });
                }
            });
        },
        columns: [
            {
                data: "stt",
                className: "text-center fw-bold align-middle",
                width: "70px",
                render: function (data) {
                    return retNull(data);
                }
            },
            {
                data: "ten_khachhang",
                render: function (data) {
                    return retNull(data);
                }
            },
            {
                data: "socongto",
                render: function (data) {
                    return retNull(data);
                }
            },
            {
                data: null,
                width: "300px",
                render: function (_, __, row) {
                    const background = getEventBackground(row.value);
                    return `<div style="background:${background};color:#514a4a;padding:6px 8px;min-width:280px;">${retNull(row.event)}</div>`;
                }
            },
            {
                data: "timemin",
                className: "text-center",
                render: function (data) {
                    return retNull(data);
                }
            },
            {
                data: "donvi",
                render: function (data) {
                    return retNull(data);
                }
            }
        ],
        language: {
            sProcessing: "Đang xử lý...",
            sLengthMenu: "Xem _MENU_ bản ghi",
            sZeroRecords: "Không tìm thấy dòng nào phù hợp",
            sInfo: "Đang xem _START_ đến _END_ trong tổng số _TOTAL_ bản ghi",
            sInfoEmpty: "Đang xem 0 đến 0 trong tổng số 0 bản ghi",
            sInfoFiltered: "(được lọc từ _MAX_ bản ghi)",
            sSearch: "Tìm:",
            oPaginate: {
                sFirst: "Đầu",
                sPrevious: "Trước",
                sNext: "Tiếp",
                sLast: "Cuối"
            }
        },
        drawCallback: function () {
            if ($("#sukientucthoi").hasClass("active")) {
                this.api().columns.adjust();
            }
        }
    });

    $("#sukientucthoi")
        .off("shown.bs.tab.sukientucthoi")
        .on("shown.bs.tab.sukientucthoi", function () {
            if ($.fn.DataTable.isDataTable($table)) {
                $table.DataTable().columns.adjust();
            }
        });
}

function getEventBackground(value) {
    const text = String(value || "").toUpperCase();

    if (text.includes("START")) return "#dd4b39bf";
    if (text.includes("STOP")) return "#00a65a3b";
    return "#dd4b39bf";
}

function showToastError(message) {
    toastr.error(message, "Thông báo", {
        positionClass: "toast-bottom-right",
        timeOut: 5000,
        closeButton: true,
        debug: false,
        newestOnTop: true,
        progressBar: true,
        preventDuplicates: true,
        onclick: null,
        showDuration: "300",
        hideDuration: "1000",
        extendedTimeOut: "1000",
        showEasing: "swing",
        hideEasing: "linear",
        showMethod: "fadeIn",
        hideMethod: "fadeOut",
        tapToDismiss: false
    });
}

function retNull(value) {
    return value == null || value === "" ? "-" : value;
}
function drawData_sukientucthoi(lst) {

    var str2 = "";
    var background = "";
    $("#tbl_sukientucthoi tbody").html("");
    // if (lst.length == 0) {
    //     $("#tbl_sukientucthoi tbody").html("<tr><td colspan='6' class='text-center'>Không có dữ liệu hiển thị</td></tr>");
    //     return;
    // }
    // Hủy DataTable nếu đã được khởi tạo
    var tableElement = $('#tbl_sukientucthoi');
    if ($.fn.DataTable.isDataTable(tableElement)) {
        tableElement.DataTable().clear().destroy();
    }

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
        str2 += "<td  style='background:" + background + ";width: 300px;color:#514a4a'>" + v.event + "</td>";
        str2 += "<td style='text-align:center'>" + v.timemin + "</td>";
        str2 += "<td>" + retNull(v.donvi) + "</td>";
        str2 += "</tr>";
    });
    tableElement.find('tbody').html(str2); // Thêm dữ liệu vào bảng
    getStyleTableChiTiet();
    $('#sukientucthoi').on('shown.bs.tab', function () {
        tableElement.columns.adjust();
    });



}
function getStyleTableChiTiet() {
    $('#tbl_sukientucthoi').removeAttr('width').DataTable({
        dom: 'Bfrtip',
        buttons: [
            {
                extend: 'excelHtml5',
                title: "Sự kiện công tơ"
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

    }).columns.adjust();
};

