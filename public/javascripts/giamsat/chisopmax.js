
var getThang = "";
$(document).ready(function () {
    if (!localStorage.getItem("us")) {
        window.location.href = "../login";
    }
    $('.thang_pmax').pickadate({
        monthPrev: '&larr;',
        monthNext: '&rarr;',
        today: 'Hôm nay',
        clear: 'Xóa',
        close: 'Đóng',
        format: 'mm/yyyy', // Display format for month and year
        formatSubmit: 'mm/yyyy', // Submit format for month and year
        selectYears: true, // Enable year selector
        selectMonths: true, // Enable month selector
        monthsFull: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'],
        monthsShort: ['Th 1', 'Th 2', 'Th 3', 'Th 4', 'Th 5', 'Th 6', 'Th 7', 'Th 8', 'Th 9', 'Th 10', 'Th 11', 'Th 12'],
        min: new Date(1900, 0, 1), // Set a minimum date to prevent days from being selectable
        max: new Date(2100, 11, 31), // Set a maximum date for range control
        onOpen: function () {
            this.$root.find('.picker__day').remove(); // Hide days in the calendar
        },
        onSet: function (context) {
            var selectedYear = this.get('highlight', 'yyyy');
            var selectedMonth = this.get('highlight', 'mm');

            // Automatically close the picker after selecting a month and year
            if (selectedYear && selectedMonth) {
                var formattedDate = selectedMonth + '/' + selectedYear;
                $('#txtthang_pmax').val(formattedDate); // Set the formatted date into the input
                this.close(); // Close the picker
            }
        }
    });


    $("#slnhompha_pmax").change(function () {
        var node = JSON.parse(localStorage.getItem("node"));
        let loaidanhmuc = node.type;
        if (loaidanhmuc != 9 && loaidanhmuc < 5) {
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
        if ($("#slnhompha_pmax").val() == '1') {
            $("#slloaichiso_pmax").attr("disabled", true);
        } else {
            $("#slloaichiso_pmax").removeAttr("disabled");
        }
        loadChiSoPMAX();
    });

    $("#slloaichiso_pmax").change(function () {
        loadChiSoPMAX();
    });
    $("#btnthuchien_pmax").click(function () {
        loadChiSoPMAX();
    });

    handleSidebarNode();

});
function handleSidebarNode() {
    var node = JSON.parse(localStorage.getItem("node"));
    let loaithumuc = Number(node?.type);
    $('#txtthang_pmax').val(gettimenow_cscthang());
    if (loaithumuc == 9) {
        let Meterid = node.id;
        let tenkhachhang = node.tendanhmuc;
        f_XemChiTiet_pmax(Meterid, tenkhachhang);
        $("#modal_giamsat").modal("show");
    } else {
        loadChiSoPMAX();
        $("#modal_giamsat").modal('hide');
    }

}
function getDateTimeCurrent() {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    const day = currentDate.getDate();
    return `${day.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}/${year} `;
}

function loadChiSoPMAX() {

    var node = JSON.parse(localStorage.getItem("node"));
    if (node == null) {
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
    let loaidanhmuc = node.type;
    let danhmucid = node.id;
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
    var locdulieu = $("#sllocdulieu_pmax").val();
    var loaihienthi = 'TG';
    var nhompha = $("#slnhompha_pmax").val();

    var ngay = '01' + '/' + $('#txtthang_pmax').val();
    var ChiSoParameter = new Object();
    ChiSoParameter.v_danhmucid = danhmucid;
    ChiSoParameter.v_locdulieu = parseInt(locdulieu);
    ChiSoParameter.v_ngay = ngay;
    ChiSoParameter.v_loaipha = parseInt(nhompha);
    ChiSoParameter.v_sotrang = 0;
    ChiSoParameter.v_sodong = 100000;
    ChiSoParameter.v_mataikhoan = 1;
    ChiSoParameter.v_loaichiso = $("#slloaichiso_pmax").val();

    $.ajax({
        url: "/api/khaithacdulieu_laychiso_pmax",
        data: JSON.stringify(ChiSoParameter),
        type: "POST",
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: function (result) {
            drawData(result)
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
    if ($.fn.DataTable.isDataTable('#tbl_pmax')) {
        const activeRequestsTable = $('#tbl_pmax').DataTable();
        activeRequestsTable.state.clear();
        activeRequestsTable.destroy();
    }

    $("#tbl_pmax thead").empty();
    $("#tbl_pmax tbody").empty();

    const isDetail = $("#sllocdulieu_pmax").val() === "0";

    let theadHtml = "";
    if (isDetail) {
        theadHtml += `
            <tr>
                <th rowspan="2">Mã điểm đo - Số công tơ - Tên khách hàng - Loại công tơ</th>
                <th rowspan="2">STT</th>
                <th rowspan="2" style="display:none">Mã điểm đo</th>
                <th rowspan="2" style="display:none">Tên khách hàng</th>
                <th rowspan="2" style="display:none">Số công tơ</th>
                <th rowspan="2" style="display:none">Loại công tơ</th>
                <th rowspan="2">Loại</th>
                <th colspan="2">P max giao</th>
                <th colspan="2">P max nhận</th>
                <th rowspan="2">Thời điểm đọc</th>
            </tr>
            <tr>
                <th>Giá trị (kW)</th>
                <th>Thời điểm</th>
                <th>Giá trị (kW)</th>
                <th>Thời điểm</th>
            </tr>
        `;
    } else {
        theadHtml += `
            <tr>
                <th>Mã điểm đo - Tên khách hàng</th>
                <th>STT</th>
                <th style="display:none">Mã điểm đo</th>
                <th style="display:none">Tên khách hàng</th>
                <th>Số công tơ</th>
                <th>Loại công tơ</th>
                <th>IMEI</th>
                <th>Mã cột</th>
                <th>Mã trạm</th>
            </tr>
        `;
    }

    $("#tbl_pmax thead").html(theadHtml);

    let tbodyHtml = "";
    let stt = 0;

    $.each(data, function (k, v) {
        stt++;

        if (!isDetail) {
            tbodyHtml += `
                <tr>
                    <td style="font-weight:bold;color:#000;">${retNull(v.madiemdo)} - ${retNull(v.tenkhachhang)}</td>
                    <td>${stt}</td>
                    <td style="display:none">${retNull(v.madiemdo)}</td>
                    <td style="display:none">${retNull(v.tenkhachhang)}</td>
                    <td>${retNull(v.socongto)}</td>
                    <td>${retNull(v.loaicongto)}</td>
                    <td>${retNull(v.imei)}</td>
                    <td>${retNull(v.macot)}</td>
                    <td>${retNull(v.matram)}</td>
                </tr>
            `;
            return;
        }

        const isThreePhase = String(v.loaipha) === "3" || String(v.loaipha) === "31";

        const rows = [
            {
                loai: "BT",
                pgiao: retNull(v.pgiao1_max),
                tgPgiao: retNull(v.pgiao1_max_time),
                pnhan: retNull(v.pnhan1_max),
                tgPnhan: retNull(v.pnhan1_max_time)
            },
            {
                loai: "CD",
                pgiao: retNull(v.pgiao2_max),
                tgPgiao: retNull(v.pgiao2_max_time),
                pnhan: retNull(v.pnhan2_max),
                tgPnhan: retNull(v.pnhan2_max_time)
            },
            {
                loai: "TD",
                pgiao: retNull(v.pgiao3_max),
                tgPgiao: retNull(v.pgiao3_max_time),
                pnhan: retNull(v.pnhan3_max),
                tgPnhan: retNull(v.pnhan3_max_time)
            }
        ];

        if (isThreePhase) {
            rows.push(
                {
                    loai: "Pha A",
                    pgiao: retNull(v.pgiaoa_max),
                    tgPgiao: retNull(v.pgiaoa_max_time),
                    pnhan: retNull(v.pnhana_max),
                    tgPnhan: retNull(v.pnhana_max_time)
                },
                {
                    loai: "Pha B",
                    pgiao: retNull(v.pgiaob_max),
                    tgPgiao: retNull(v.pgiaob_max_time),
                    pnhan: retNull(v.pnhanb_max),
                    tgPnhan: retNull(v.pnhanb_max_time)
                },
                {
                    loai: "Pha C",
                    pgiao: retNull(v.pgiaoc_max),
                    tgPgiao: retNull(v.pgiaoc_max_time),
                    pnhan: retNull(v.pnhanc_max),
                    tgPnhan: retNull(v.pnhanc_max_time)
                }
            );
        }

        const rowSpan = rows.length;
        const linkHtml = `<a href="#" data-bs-toggle="modal" data-bs-target="#modal_giamsat" onClick="f_XemChiTiet_pmax('${v.meterid}','${String(v.tenkhachhang || "").replace(/'/g, "\\'")}')">Mã điểm đo: ${retNull(v.madiemdo)} - Số công tơ: ${retNull(v.socongto)} - Tên khách hàng: ${retNull(v.tenkhachhang)} - Loại công tơ: ${retNull(v.loaicongto)}</a>`;

        $.each(rows, function (idx, row) {
            tbodyHtml += `<tr>`;
            tbodyHtml += `<td style="font-weight:bold">${linkHtml}</td>`;

            if (idx === 0) {
                tbodyHtml += `<td rowspan="${rowSpan}" style="text-align:center;vertical-align:middle;font-weight:bold">${stt}</td>`;
                tbodyHtml += `<td rowspan="${rowSpan}" style="display:none">${retNull(v.madiemdo)}</td>`;
                tbodyHtml += `<td rowspan="${rowSpan}" style="display:none">${retNull(v.tenkhachhang)}</td>`;
                tbodyHtml += `<td rowspan="${rowSpan}" style="display:none">${retNull(v.socongto)}</td>`;
                tbodyHtml += `<td rowspan="${rowSpan}" style="display:none">${retNull(v.loaicongto)}</td>`;
            } else {
                tbodyHtml += `<td style="display:none"></td>`;
                tbodyHtml += `<td style="display:none"></td>`;
                tbodyHtml += `<td style="display:none"></td>`;
                tbodyHtml += `<td style="display:none"></td>`;
                tbodyHtml += `<td style="display:none"></td>`;
            }

            tbodyHtml += `<td style="text-align:center;vertical-align:middle">${row.loai}</td>`;
            tbodyHtml += `<td class="text-right">${row.pgiao}</td>`;
            tbodyHtml += `<td class="text-center">${row.tgPgiao}</td>`;
            tbodyHtml += `<td class="text-right">${row.pnhan}</td>`;
            tbodyHtml += `<td class="text-center">${row.tgPnhan}</td>`;

            if (idx === 0) {
                tbodyHtml += `<td rowspan="${rowSpan}" style="text-align:center;vertical-align:middle">${retNull(v.import_date)}</td>`;
            } else {
                tbodyHtml += `<td style="display:none"></td>`;
            }

            tbodyHtml += `</tr>`;
        });
    });

    $("#tbl_pmax tbody").html(tbodyHtml);
    $("#messageerror").hide();
    $("#content-w").show();

    if (isDetail) {
        getStyleTable3_pmax();
    } else {
        getStyleTable_pmax();
    }
}

function getStyleTable3_pmax() {
    const tableSelector = '#tbl_pmax';
    $(tableSelector).removeClass("table-striped table-hover");

    const dt = $(tableSelector).removeAttr('width').DataTable({
        dom: '<"top">Bfirt<"bottom"><"clear">',
        buttons: [
            {
                extend: 'excel',
                title: "Chỉ số Pmax",
                exportOptions: {
                    columns: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
                    format: {
                        header: function (data, columnIdx) {
                            if (columnIdx == 7) return 'Giá trị P max giao (kW)';
                            if (columnIdx == 8) return 'Thời điểm P max giao';
                            if (columnIdx == 9) return 'Giá trị P max nhận (kW)';
                            if (columnIdx == 10) return 'Thời điểm P max nhận';
                            return data;
                        }
                    }
                }
            }
        ],
        rowGroup: {
            dataSrc: 0
        },
        columnDefs: [
            { visible: false, targets: 0 }
        ],
        paging: false,
        scrollY: '500px',
        scrollCollapse: true,
        scrollX: true,
        searching: true,
        ordering: false,
        info: true,
        autoWidth: false,
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
        initComplete: function () {
            this.api().columns.adjust();
        }
    });

    setTimeout(function () {
        dt.columns.adjust().draw(false);
    }, 100);
};

function getStyleTable_pmax() {

    $('#tbl_pmax').DataTable({
        // dom: 'Bfrtip',
        dom: '<"top">Bfirt<"bottom"lp><"clear">',
        buttons: [
            {
                extend: 'excel',
                title: "Chỉ số Pmax",
                exportOptions: {
                    columns: [1, 2, 3, 4, 5, 6, 7, 8]
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
        'pageLength': 100,
        "lengthMenu": [10, 20, 50, 100, 200, "All"],
        'paging': true,
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
function setDatePickerValue(selector, value) {
    const picker = $(selector).pickadate("picker");
    if (picker) {
        const parts = value.split("/");
        if (parts.length === 3) {
            picker.set("select", [
                parseInt(parts[2], 10),
                parseInt(parts[1], 10) - 1,
                parseInt(parts[0], 10)
            ]);
        }
    } else {
        $(selector).val(value);
    }
}
