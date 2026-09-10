var lstTsvh = [];

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
        monthsFull: [
            'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
            'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
        ],
        monthsShort: [
            'Th 1', 'Th 2', 'Th 3', 'Th 4', 'Th 5', 'Th 6',
            'Th 7', 'Th 8', 'Th 9', 'Th 10', 'Th 11', 'Th 12'
        ]
    });


    injectPmaxBlockRowStyle();

    get_date();

    $("#btnthuchien_ct_pmax").off("click").on("click", function () {
        loadPmax_ChiTiet();
    });
});

function injectPmaxBlockRowStyle() {
    if ($("#style-pmax-block-row").length) return;

    $("head").append(`
        <style id="style-pmax-block-row">
            #tbl_xemchitiet_pmax tbody tr td {
                background-image: none !important;
                transition: none !important;
            }
        </style>
    `);
}

function getFirstDayOfMonth(input) {
    if (!input) return "";

    let str = String(input).trim();

    // Nếu dạng dd/MM/yyyy
    if (str.includes("/")) {
        const parts = str.split("/");

        // dd/MM/yyyy
        if (parts.length === 3) {
            const mm = parts[1].padStart(2, "0");
            const yyyy = parts[2];
            return `01/${mm}/${yyyy}`;
        }

        // MM/yyyy
        if (parts.length === 2) {
            const mm = parts[0].padStart(2, "0");
            const yyyy = parts[1];
            return `01/${mm}/${yyyy}`;
        }
    }

    // Nếu dạng yyyyMMdd
    if (/^\d{8}$/.test(str)) {
        const yyyy = str.substring(0, 4);
        const mm = str.substring(4, 6);
        return `01/${mm}/${yyyy}`;
    }

    // Nếu là Date object
    if (input instanceof Date) {
        const mm = String(input.getMonth() + 1).padStart(2, "0");
        const yyyy = input.getFullYear();
        return `01/${mm}/${yyyy}`;
    }

    return "";
}

function f_XemChiTiet_pmax(Meterid, tenkhachhang) {
    $(".nav-link").removeClass("active");
    $("a[href='#chisopmax']").addClass("active");
    $("a[href='#chisocongto']").removeClass("active");
    $("a[href='#thongsovanhanh']").removeClass("active");
    $("a[href='#bieudophutai']").removeClass("active");

    $(".tab_giamsat").removeClass("active show");
    $("#chisopmax").addClass("active show");

    $("#lbltitle_giamsat").html("Khách hàng: " + tenkhachhang);

    get_date();

    $("#hdMeterid_pmax").val(Meterid);
    $("#hdMeterid_tsvh").val(Meterid);
    $("#hdMeterid_csct").val(Meterid);
    $("#hdMeterid_bdpt").val(Meterid);
    $("#slloaichiso_ct_pmax").val($("#slloaichiso_pmax").val());

    LoadSoCongTo_pmax(Meterid);
}

function get_date() {
    let ngay = "";
    const thangPmax = ($("#txtthang_pmax").val() || "").trim();

    if (thangPmax) {
        ngay = "01/" + thangPmax; // ví dụ 01/04/2026
    } else {
        ngay = getFirstDayOfMonth(new Date()); // fallback ngày hiện tại
    }

    if (typeof timeyyyymmdd === "function" && typeof getLastDayOfMonth === "function") {
        const tungayDate = timeyyyymmdd(ngay);
        const year = tungayDate.getFullYear();
        const month = String(tungayDate.getMonth() + 1).padStart(2, "0");

        const denngay = getLastDayOfMonth(year, month) + "/" + month + "/" + year;

        $("#txttungay_pmax").val(ngay);
        $("#txtdenngay_pmax").val(denngay);
    } else {
        $("#txttungay_pmax").val(ngay);
        $("#txtdenngay_pmax").val(ngay);
    }
}

function LoadSoCongTo_pmax(meterid) {
    $.ajax({
        url: "/api/khaithacdulieu_laychisocongto_dscongto",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify({ v_meterid: parseInt(meterid, 10) }),
        success: function (result) {
            var option = "<option value='-1'>--Tất cả--</option>";

            $.each(result || [], function (k, v) {
                option += "<option data-time='" + retNull(v.ngaythao) + "' treothao='" + v.treothao + "' value='" + v.socongto + "'>" + v.socongto + "</option>";
            });

            $("#slsocongto_pmax").html(option);
            loadPmax_ChiTiet();
        },
        error: function (errormessage) {
            toastr.error(errormessage?.responseJSON?.message || "Có lỗi xảy ra", "Thông báo", {
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
    });
}

function loadPmax_ChiTiet() {
    var node = JSON.parse(localStorage.getItem("node"));
    let loaithumuc = node.type;
    let danhmucid = node.id;

    if (danhmucid == null || danhmucid == undefined) {
        toastr.error("Vui lòng chọn danh mục", "Thông báo", {
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
        return;
    }

    if (loaithumuc < 5) {
        toastr.error("Vui lòng chọn trạm", "Thông báo", {
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
        return;
    }

    var day = compareDates(
        timeyyyymmdd($('#txttungay_pmax').val()),
        timeyyyymmdd($('#txtdenngay_pmax').val())
    );

    if (day > 31) {
        toastr.error("Vui lòng chọn tối đa 31 ngày để xem dữ liệu", "Thông báo", {
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
        return;
    }

    day = compareTwoDate(
        timeyyyymmdd($('#txttungay_pmax').val()),
        timeyyyymmdd($('#txtdenngay_pmax').val())
    );

    if (day == 1) {
        toastr.error("Từ ngày nhỏ hơn đến ngày", "Thông báo", {
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
        return;
    }

    var ChiSoParameter = {
        v_meterid: parseInt($("#hdMeterid_pmax").val(), 10),
        v_socongto: $("#slsocongto_pmax").val(),
        v_tungay: $("#txttungay_pmax").val(),
        v_denngay: $("#txtdenngay_pmax").val(),
        v_sotrang: 0,
        v_sodong: 100000,
        v_loaichiso: $("#slloaichiso_ct_pmax").val(),
        v_mataikhoan: 1
    };

    $.ajax({
        url: "/api/khaithacdulieu_laychisopmax_chitiet",
        data: JSON.stringify(ChiSoParameter),
        type: "POST",
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: function (result) {
            drawData_ChiTietCongTo_Pmax(result || []);
        },
        error: function (errormessage) {
            toastr.error(errormessage?.responseJSON?.message || "Có lỗi xảy ra", "Thông báo", {
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
    });
}

function drawData_ChiTietCongTo_Pmax(data) {
    const tableId = '#tbl_xemchitiet_pmax';
    const $table = $(tableId);

    if ($.fn.DataTable.isDataTable(tableId)) {
        const dt = $table.DataTable();
        dt.state.clear();
        dt.destroy();
    }

    $table.removeClass("table-striped");
    $table.find("thead").html("");
    $table.find("tbody").html("");

    let headerHtml = "";
    headerHtml += "<tr>";
    headerHtml += "<th rowspan='2'>STT</th>";
    headerHtml += "<th rowspan='2'>Loại</th>";
    headerHtml += "<th colspan='2' style='border-bottom:none;'>P max giao</th>";
    headerHtml += "<th colspan='2' style='border-bottom:none;'>P max nhận</th>";
    headerHtml += "<th rowspan='2'>Thời điểm đọc</th>";
    headerHtml += "</tr>";
    headerHtml += "<tr>";
    headerHtml += "<th>Giá trị (kW)</th>";
    headerHtml += "<th>Thời điểm</th>";
    headerHtml += "<th>Giá trị (kW)</th>";
    headerHtml += "<th>Thời điểm</th>";
    headerHtml += "</tr>";

    $table.find("thead").html(headerHtml);

    let bodyHtml = "";
    let stt = 0;

    $.each(data || [], function (k, v) {
        stt++;

        bodyHtml += "<tr>";
        if (v.loaipha == 3 || v.loaipha == 31) {
            bodyHtml += "<td style='text-align:center;vertical-align:middle;font-weight:bold' rowspan='6'>" + stt + "</td>";
        } else {
            bodyHtml += "<td style='text-align:center;vertical-align:middle;font-weight:bold' rowspan='3'>" + stt + "</td>";
        }
        bodyHtml += "<td style='text-align:center;vertical-align:middle;'>BT</td>";
        bodyHtml += "<td class='text-right'>" + retNull(v.pgiao1_max) + "</td>";
        bodyHtml += "<td class='text-right'>" + retNull(v.pgiao1_max_time) + "</td>";
        bodyHtml += "<td class='text-right'>" + retNull(v.pnhan1_max) + "</td>";
        bodyHtml += "<td class='text-right'>" + retNull(v.pnhan1_max_time) + "</td>";
        if (v.loaipha == 3 || v.loaipha == 31) {
            bodyHtml += "<td style='text-align:center;vertical-align:middle;' rowspan='6'>" + retNull(v.import_date) + "</td>";
        } else {
            bodyHtml += "<td style='text-align:center;vertical-align:middle;' rowspan='3'>" + retNull(v.import_date) + "</td>";
        }
        bodyHtml += "</tr>";

        bodyHtml += "<tr>";
        bodyHtml += "<td style='display:none'></td>";
        bodyHtml += "<td style='text-align:center;vertical-align:middle;'>CD</td>";
        bodyHtml += "<td class='text-right'>" + retNull(v.pgiao2_max) + "</td>";
        bodyHtml += "<td class='text-right'>" + retNull(v.pgiao2_max_time) + "</td>";
        bodyHtml += "<td class='text-right'>" + retNull(v.pnhan2_max) + "</td>";
        bodyHtml += "<td class='text-right'>" + retNull(v.pnhan2_max_time) + "</td>";
        bodyHtml += "<td style='display:none'></td>";
        bodyHtml += "</tr>";

        bodyHtml += "<tr>";
        bodyHtml += "<td style='display:none'></td>";
        bodyHtml += "<td style='text-align:center;vertical-align:middle;'>TD</td>";
        bodyHtml += "<td class='text-right'>" + retNull(v.pgiao3_max) + "</td>";
        bodyHtml += "<td class='text-right'>" + retNull(v.pgiao3_max_time) + "</td>";
        bodyHtml += "<td class='text-right'>" + retNull(v.pnhan3_max) + "</td>";
        bodyHtml += "<td class='text-right'>" + retNull(v.pnhan3_max_time) + "</td>";
        bodyHtml += "<td style='display:none'></td>";
        bodyHtml += "</tr>";
        if (v.loaipha == 3 || v.loaipha == 31) {
            bodyHtml += "<tr>";
            bodyHtml += "<td style='display:none'></td>";
            bodyHtml += "<td style='text-align:center;vertical-align:middle;'>Pha A</td>";
            bodyHtml += "<td class='text-right'>" + retNull(v.pgiaoa_max) + "</td>";
            bodyHtml += "<td class='text-right'>" + retNull(v.pgiaoa_max_time) + "</td>";
            bodyHtml += "<td class='text-right'>" + retNull(v.pnhana_max) + "</td>";
            bodyHtml += "<td class='text-right'>" + retNull(v.pnhana_max_time) + "</td>";
            bodyHtml += "<td style='display:none'></td>";
            bodyHtml += "</tr>";

            bodyHtml += "<tr>";
            bodyHtml += "<td style='display:none'></td>";
            bodyHtml += "<td style='text-align:center;vertical-align:middle;'>Pha B</td>";
            bodyHtml += "<td class='text-right'>" + retNull(v.pgiaob_max) + "</td>";
            bodyHtml += "<td class='text-right'>" + retNull(v.pgiaob_max_time) + "</td>";
            bodyHtml += "<td class='text-right'>" + retNull(v.pnhanb_max) + "</td>";
            bodyHtml += "<td class='text-right'>" + retNull(v.pnhanb_max_time) + "</td>";
            bodyHtml += "<td style='display:none'></td>";
            bodyHtml += "</tr>";

            bodyHtml += "<tr>";
            bodyHtml += "<td style='display:none'></td>";
            bodyHtml += "<td style='text-align:center;vertical-align:middle;'>Pha C</td>";
            bodyHtml += "<td class='text-right'>" + retNull(v.pgiaoc_max) + "</td>";
            bodyHtml += "<td class='text-right'>" + retNull(v.pgiaoc_max_time) + "</td>";
            bodyHtml += "<td class='text-right'>" + retNull(v.pnhanc_max) + "</td>";
            bodyHtml += "<td class='text-right'>" + retNull(v.pnhanc_max_time) + "</td>";
            bodyHtml += "<td style='display:none'></td>";
            bodyHtml += "</tr>";
        }
    });

    if (!data || !data.length) {
        bodyHtml = `
            <tr>
                <td colspan="7" class="text-center text-muted">Không có dữ liệu</td>
            </tr>
        `;
    }

    $table.find("tbody").html(bodyHtml);

    getStyleTableChiTiet3_pmax();
    colorRowsByRecord('#tbl_xemchitiet_pmax');
}

function getStyleTableChiTiet3_pmax() {

    const tableSelector = '#tbl_xemchitiet_pmax';
    const ROWS_PER_RECORD = 6;
    $(tableSelector).removeClass("table-striped table-hover");

    $(tableSelector).DataTable({
        destroy: true,
        dom: 'Bfrtip',
        buttons: [
            {
                extend: 'excel',
                exportOptions: {
                    columns: [0, 1, 2, 3, 4, 5, 6],
                    format: {
                        header: function (data, columnIdx) {
                            if (columnIdx == 2) return 'Giá trị P max giao (kW)';
                            if (columnIdx == 3) return 'Thời điểm P max giao';
                            if (columnIdx == 4) return 'Giá trị P max nhận (kW)';
                            if (columnIdx == 5) return 'Thời điểm P max nhận';
                            return data;
                        }
                    }
                }
            }
        ],

        // 3 bản ghi / trang = 18 dòng
        pageLength: 18,

        // menu hiển thị theo bản ghi nhưng value là số dòng
        lengthMenu: [
            [18, 30, 60, -1],
            ['3 bản ghi', '5 bản ghi', '10 bản ghi', 'Tất cả']
        ],

        scrollCollapse: true,
        paging: true,
        lengthChange: true,
        searching: true,
        ordering: false,
        info: true,
        autoWidth: false,

        language: {
            sProcessing: "Đang xử lý...",
            sLengthMenu: "Xem _MENU_",
            sZeroRecords: "Không tìm thấy dòng nào phù hợp",
            sInfo: "Đang xem _START_ đến _END_ trong tổng số _TOTAL_ bản ghi",
            sInfoEmpty: "Đang xem 0 đến 0 trong tổng số 0 bản ghi",
            sInfoFiltered: "(được lọc từ _MAX_ bản ghi)",
            sInfoPostFix: "",
            sSearch: "Tìm:",
            sUrl: "",
            oPaginate: {
                sFirst: "Đầu",
                sPrevious: "Trước",
                sNext: "Tiếp",
                sLast: "Cuối"
            }
        },

        infoCallback: function (settings, start, end, max, total) {
            const api = this.api();

            const rows = api.rows({ search: 'applied' }).nodes().to$();
            const currentRows = api.rows({ page: 'current' }).nodes().to$();

            let totalRecord = 0;
            let currentRecord = 0;

            // 👉 đếm tổng record
            rows.each(function () {
                if ($(this).find("td[rowspan]").length > 0) {
                    totalRecord++;
                }
            });

            // 👉 đếm record trên page hiện tại
            currentRows.each(function () {
                if ($(this).find("td[rowspan]").length > 0) {
                    currentRecord++;
                }
            });

            const pageInfo = api.page.info();
            const startRecord = (pageInfo.page * currentRecord) + 1;
            const endRecord = startRecord + currentRecord - 1;

            return `Đang xem ${startRecord} đến ${endRecord} trong tổng số ${totalRecord} bản ghi`;
        },

        initComplete: function () {
            if (!$(tableSelector).parent().is("#chitietpmax")) {
                $(tableSelector).wrap("<div style='overflow:auto; width:100%; position:relative;' id='chitietpmax'></div>");
            }

            colorRowsByRecord(tableSelector);
            bindHoverByRecord(tableSelector); // 👈 thêm dòng này
        },

        drawCallback: function () {
            colorRowsByRecord(tableSelector);
            bindHoverByRecord(tableSelector); // 👈 thêm dòng này
        }
    }).columns.adjust();
}
function colorRowsByRecord(tableSelector) {
    const $rows = $(`${tableSelector} tbody tr`);
    let recordIndex = 0;
    let currentColor = "#ffffff";

    $rows.each(function () {
        const $tr = $(this);
        const isRecordStart = $tr.children("td[rowspan]").length > 0;

        if (isRecordStart) {
            recordIndex++;
            currentColor = (recordIndex % 2 === 1) ? "#f3f3f3" : "#ffffff";
        }

        $tr.attr("data-record-index", recordIndex);

        $tr.children("td").each(function () {
            this.style.setProperty("background-color", currentColor, "important");
        });
    });
}
function bindHoverByRecord(tableSelector) {
    const $table = $(tableSelector);

    // clear event cũ tránh bị nhân đôi
    $table.off("mouseenter", "tbody tr");
    $table.off("mouseleave", "tbody tr");

    // hover vào 1 dòng → highlight cả block
    $table.on("mouseenter", "tbody tr", function () {
        const recordIndex = $(this).attr("data-record-index");

        if (!recordIndex) return;

        $(`${tableSelector} tbody tr[data-record-index='${recordIndex}'] td`)
            .each(function () {
                this.style.setProperty("background-color", "#e6f2ff", "important"); // màu hover
            });
    });

    // rời chuột → trả lại màu gốc
    $table.on("mouseleave", "tbody tr", function () {
        colorRowsByRecord(tableSelector);
    });
}

function retNull(number) {
    if (number == null || number == undefined || number === "") {
        return '-';
    }
    return number;
}
function getCurrentDateString() {
    const d = new Date();
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
}