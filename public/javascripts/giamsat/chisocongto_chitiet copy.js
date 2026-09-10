var lstTsvh = [];
var TI_CSCT;
var TU_CSCT;
var HSN_CSCT;
let isBindingCsctUi = false;
$(document).ready(function () {
    if (!localStorage.getItem("us")) {
        window.location.href = "../login";
        return;
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
        monthsFull: [
            'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
            'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
        ],
        monthsShort: [
            'Th 1', 'Th 2', 'Th 3', 'Th 4', 'Th 5', 'Th 6',
            'Th 7', 'Th 8', 'Th 9', 'Th 10', 'Th 11', 'Th 12'
        ]
    });


    $("#btnthuchien_ct").off("click").on("click", function () {
        loadChiSo_ChiTiet_csct();
    });

    $("#slloaichiso_ct")
        .off("change")
        .on("change", function () {
            renderChiTietHeaderOnly();

            if (isBindingCsctUi) return;
            if (!$("#hdMeterid_csct").val()) return;

            loadChiSo_ChiTiet_csct();
        });
    $("#btnExportExcelCsct_ct").off("click").on("click", function () {
        exportCsctChitietToExcel();
    });
});

$(document).on("shown.bs.modal", "#modal_giamsat", function () {
    adjustChiTietTable();
});

$(document).on("shown.bs.tab", "a[data-bs-toggle='tab'], a[data-toggle='tab']", function () {
    adjustChiTietTable();
});

function adjustChiTietTable() {
    if ($.fn.DataTable.isDataTable("#tbl_xemchitiet_csct")) {
        const dt = $("#tbl_xemchitiet_csct").DataTable();
        setTimeout(function () { dt.columns.adjust().draw(false); }, 50);
        setTimeout(function () { dt.columns.adjust().draw(false); }, 200);
        setTimeout(function () { dt.columns.adjust().draw(false); }, 400);
    }
}

function f_XemChiTiet_csct(Meterid, tenkhachhang, loaipha, tu, ti, hsn) {
    $("a[href='#chisocongto']").addClass("active");
    $("a[href='#thongsovanhanh']").removeClass("active");
    $("a[href='#bieudophutai']").removeClass("active");
    $("a[href='#chisopmax']").removeClass("active");

    $(".tab_giamsat").removeClass("active show");
    $("#chisocongto").addClass("active show");

    let title = "Khách hàng: " + (tenkhachhang || "");
    if (tu || TU_CSCT) title += " - TU: " + (tu || TU_CSCT);
    if (ti || TI_CSCT) title += " - TI: " + (ti || TI_CSCT);
    if (hsn || HSN_CSCT) title += " - HSN: " + (hsn || HSN_CSCT);

    $("#lbltitle_giamsat").html(title);
    $("#hdMeterid_csct").val(Meterid);
    $("#hdMeterid_tsvh").val(Meterid);
    $("#hdMeterid_bdpt").val(Meterid);
    $("#hdMeterid_pmax").val(Meterid);
    $("#hdloaicongto_csct").val(loaipha);
    $("#slloaichiso_ct").val($("#slloaichiso_csct").val() || "2");
    if ($("#slloaichiso_csct").val() == "4") {
        var year = timeyyyymmdd("01/" + $("#txtthang_csct").val()).getFullYear();
        var month = timeyyyymmdd("01/" + $("#txtthang_csct").val()).getMonth();
        var thang = month > 9 ? month : month + 1;
        var lastdate = getLastDayOfMonth(year, thang);
        var dengay = lastdate + "/" + $("#txtthang_csct").val();

        $("#txttungay_csct_ct").val("01/" + $("#txtthang_csct").val());
        if (month == new Date().getMonth()) {
            $("#txtdenngay_csct_ct").val(getDateTimeCurrent());
        } else {
            $("#txtdenngay_csct_ct").val(dengay);
        }
    } else {
        $("#txttungay_csct_ct").val($("#txtngay_csct").val());
        $("#txtdenngay_csct_ct").val($("#txtngay_csct").val());
    }

    renderChiTietHeaderOnly();
    LoadSoCongTo_csct(Meterid);
}



function LoadSoCongTo_csct(meterid) {
    $.ajax({
        url: "/api/khaithacdulieu_laychisocongto_dscongto",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify({ v_meterid: parseInt(meterid, 10) }),
        success: function (result) {
            $("#slsocongto_ct").html("");
            var option = "<option value='-1'>--Tất cả--</option>";

            $.each(result || [], function (k, v) {
                option += `<option data-time="${retNull(v.ngaythao)}" treothao="${v.treothao}" value="${v.socongto}">${v.socongto}</option>`;
            });

            $("#slsocongto_ct").html(option);
            loadChiSo_ChiTiet_csct();

        },
        error: function (errormessage) {
            showToastError(errormessage?.responseJSON?.message || "Có lỗi xảy ra");
        }
    });
}

function loadChiSo_ChiTiet_csct() {
    var node = JSON.parse(localStorage.getItem("node"));
    if (!node) {
        showToastError("Vui lòng chọn danh mục");
        return;
    }

    let loaithumuc = node.type;
    let danhmucid = node.id;

    if (danhmucid == null || danhmucid == undefined) {
        showToastError("Vui lòng chọn danh mục");
        return;
    }

    if (loaithumuc < 5) {
        showToastError("Vui lòng chọn trạm");
        return;
    }

    var soNgay = compareDates(
        timeyyyymmdd($("#txttungay_csct_ct").val()),
        timeyyyymmdd($("#txtdenngay_csct_ct").val())
    );

    if (soNgay > 31) {
        showToastError("Vui lòng chọn tối đa 31 ngày để xem dữ liệu");
        return;
    }

    var compareDate = compareTwoDate(
        timeyyyymmdd($("#txttungay_csct_ct").val()),
        timeyyyymmdd($("#txtdenngay_csct_ct").val())
    );

    if (compareDate == 1) {
        showToastError("Từ ngày nhỏ hơn đến ngày");
        return;
    }

    renderChiTietHeaderOnly();

    var loaichiso = $("#slloaichiso_ct").val() || $("#slloaichiso_csct").val() || "2";

    var ChiSoParameter = {
        v_meterid: parseInt($("#hdMeterid_csct").val(), 10),
        v_loaihienthi: "TG",
        v_socongto: $("#slsocongto_ct").val(),
        v_tungay: $("#txttungay_csct_ct").val(),
        v_denngay: $("#txtdenngay_csct_ct").val(),
        v_sotrang: 0,
        v_sodong: 100000,
        v_loaichiso: loaichiso,
        v_mataikhoan: 1
    };

    $.ajax({
        url: "/api/khaithacdulieu_laychisocongto_chitiet",
        data: JSON.stringify(ChiSoParameter),
        type: "POST",
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: function (result) {
            const item = result && result.length ? result[0] : {};

            TU_CSCT = item.tu ?? null;
            TI_CSCT = item.ti ?? null;
            HSN_CSCT = item.hsn ?? null;

            drawData_ChiTietCongTo(result || []);
        },
        error: function (errormessage) {
            showToastError(errormessage?.responseJSON?.message || "Có lỗi xảy ra");
        }
    });
}

function renderChiTietHeaderOnly() {
    const tableId = "#tbl_xemchitiet_csct";
    const $table = $(tableId);
    const $thead = $table.find("thead");
    const $tbody = $table.find("tbody");

    const loaichiso = String($("#slloaichiso_ct").val() || $("#slloaichiso_csct").val() || "2");
    const phaseMode = resolvePhaseMode([]);
    const config = getChiTietCongToConfig(phaseMode, loaichiso);

    if ($.fn.DataTable.isDataTable(tableId)) {
        $table.DataTable().clear().destroy();
    }

    cleanupChiTietTableDom($table);

    $thead.html(buildHeaderChiTietCongTo(config));
    $tbody.html(`
        <tr>
            <td colspan="${getChiTietColumnCount(config)}" class="text-center text-muted">
                Chưa có dữ liệu
            </td>
        </tr>
    `);
}

function getChiTietColumnCount(config) {
    let total = 1 + config.baseColumns.length;
    config.groups.forEach(group => {
        total += group.columns.length;
    });
    return total;
}

function drawData_ChiTietCongTo(data = []) {
    const tableId = "#tbl_xemchitiet_csct";
    const $table = $(tableId);
    const $thead = $table.find("thead");
    const $tbody = $table.find("tbody");

    const loaichiso = String($("#slloaichiso_ct").val() || $("#slloaichiso_csct").val() || "2");
    const phaseMode = resolvePhaseMode(data);
    const config = getChiTietCongToConfig(phaseMode, loaichiso);

    if ($.fn.DataTable.isDataTable(tableId)) {
        $table.DataTable().clear().destroy();
    }

    $table.find("colgroup").remove();
    $table.removeAttr("style");
    $table.css("width", "100%");

    $thead.html(buildHeaderChiTietCongTo(config));
    $tbody.html(buildBodyChiTietCongTo(data, config));

    if (!validateChiTietTable(tableId)) {
        console.error("Cấu trúc bảng chi tiết không khớp", {
            phaseMode: phaseMode,
            loaichiso: loaichiso,
            headerCols: countLeafHeaders($table.find("thead")),
            rowColCounts: getBodyRowColumnCounts($table),
            thead: $table.find("thead").html(),
            firstRow: $table.find("tbody tr:first").html()
        });
        showToastError("Cấu trúc bảng chi tiết không khớp giữa header và dữ liệu");
        return;
    }

    initChiTietCongToDataTable(tableId, config);
}

function cleanupChiTietTableDom($table) {
    $table.find("colgroup").remove();
    $table.removeAttr("style");
    $table.find("thead").removeAttr("style");
    $table.find("tbody").removeAttr("style");
    $table.find("tr").removeAttr("style");
    $table.find("th, td").removeAttr("style");
    $table.css("width", "100%");
    $table.find("thead").empty();
    $table.find("tbody").empty();
}

function resolvePhaseMode(data = []) {
    const loaiCongTo = String($("#hdloaicongto_csct").val() || "").trim();
    const nhomPha = String($("#slnhompha_csct").val() || "").trim();
    const firstRow = Array.isArray(data) && data.length ? data[0] : {};

    if (["1", "13"].includes(loaiCongTo)) return "1P";
    if (["3", "31", "33"].includes(loaiCongTo)) return "3P";

    const has3PhaseFields =
        firstRow.pgiaoa != null ||
        firstRow.pgiaob != null ||
        firstRow.pgiaoc != null ||
        firstRow.pnhana != null ||
        firstRow.pnhanb != null ||
        firstRow.pnhanc != null ||
        firstRow.qgiaoa != null ||
        firstRow.qgiaob != null ||
        firstRow.qgiaoc != null ||
        firstRow.qnhana != null ||
        firstRow.qnhanb != null ||
        firstRow.qnhanc != null;

    if (has3PhaseFields) return "3P";

    return nhomPha === "1" ? "1P" : "3P";
}

function getChiTietCongToConfig(phaseMode, loaichiso) {
    const is1Pha = phaseMode === "1P";

    const baseColumns = is1Pha
        ? [
            { key: "time_display", label: "Thời điểm", className: "text-center" },
            { key: "socongto", label: "Số công tơ", className: "text-center" },
            { key: "loaicongto", label: "Chủng loại công tơ", className: "text-center" }
        ]
        : [
            { key: "time_display", label: "Thời điểm", className: "text-center" },
            { key: "socongto", label: "Số công tơ", className: "text-center" }
        ];

    let groups = [];

    if (is1Pha) {
        groups = [
            {
                title: "P giao (kWh)",
                columns: [
                    { key: "pgiaotong", label: "KT/SG", className: "text-right" },
                    { key: "pgiao1", label: "BT", className: "text-right" },
                    { key: "pgiao2", label: "CD", className: "text-right" },
                    { key: "pgiao3", label: "TD", className: "text-right" }
                ]
            },
            {
                title: "P nhận (kWh)",
                columns: [
                    { key: "pnhantong", label: "KT/SN", className: "text-right" },
                    { key: "pnhan1", label: "BN", className: "text-right" },
                    { key: "pnhan2", label: "CN", className: "text-right" },
                    { key: "pnhan3", label: "TN", className: "text-right" }
                ]
            },
            {
                title: "Q giao (kVARh)",
                columns: [
                    { key: "qgiaotong", label: "Biểu Tổng", className: "text-right" },
                    { key: "qgiao1", label: "Biểu 1", className: "text-right" },
                    { key: "qgiao2", label: "Biểu 2", className: "text-right" },
                    { key: "qgiao3", label: "Biểu 3", className: "text-right" }
                ]
            },
            {
                title: "Q nhận (kVARh)",
                columns: [
                    { key: "qnhantong", label: "Biểu Tổng", className: "text-right" },
                    { key: "qnhan1", label: "Biểu 1", className: "text-right" },
                    { key: "qnhan2", label: "Biểu 2", className: "text-right" },
                    { key: "qnhan3", label: "Biểu 3", className: "text-right" }
                ]
            }
        ];

        if (loaichiso === "2") {
            groups.push(
                {
                    title: "S giao tổng (kWh)",
                    columns: [
                        { key: "sgiaotong", label: "Biểu Tổng", className: "text-right" },
                        { key: "sgiao1", label: "Biểu 1", className: "text-right" },
                        { key: "sgiao2", label: "Biểu 2", className: "text-right" },
                        { key: "sgiao3", label: "Biểu 3", className: "text-right" }
                    ]
                },
                {
                    title: "S nhận tổng (kWh)",
                    columns: [
                        { key: "snhantong", label: "Biểu Tổng", className: "text-right" },
                        { key: "snhan1", label: "Biểu 1", className: "text-right" },
                        { key: "snhan2", label: "Biểu 2", className: "text-right" },
                        { key: "snhan3", label: "Biểu 3", className: "text-right" }
                    ]
                }
            );
        }
    } else {
        groups = [
            {
                title: "P giao (kWh)",
                columns: [
                    { key: "pgiao1", label: "BT", className: "text-right" },
                    { key: "pgiao2", label: "CD", className: "text-right" },
                    { key: "pgiao3", label: "TD", className: "text-right" },
                    { key: "pgiaotong", label: "SG", className: "text-right" },
                    { key: "pgiaoa", label: "Pha A", className: "text-right" },
                    { key: "pgiaob", label: "Pha B", className: "text-right" },
                    { key: "pgiaoc", label: "Pha C", className: "text-right" }
                ]
            },
            {
                title: "P nhận (kWh)",
                columns: [
                    { key: "pnhan1", label: "BN", className: "text-right" },
                    { key: "pnhan2", label: "CN", className: "text-right" },
                    { key: "pnhan3", label: "TN", className: "text-right" },
                    { key: "pnhantong", label: "SN", className: "text-right" },
                    { key: "pnhana", label: "Pha A", className: "text-right" },
                    { key: "pnhanb", label: "Pha B", className: "text-right" },
                    { key: "pnhanc", label: "Pha C", className: "text-right" }
                ]
            },
            {
                title: "Q giao (kVARh)",
                columns: [
                    { key: "qgiaotong", label: "VC", className: "text-right" },
                    { key: "qgiaoa", label: "Pha A", className: "text-right" },
                    { key: "qgiaob", label: "Pha B", className: "text-right" },
                    { key: "qgiaoc", label: "Pha C", className: "text-right" }
                ]
            },
            {
                title: "Q nhận (kVARh)",
                columns: [
                    { key: "qnhantong", label: "VN", className: "text-right" },
                    { key: "qnhana", label: "Pha A", className: "text-right" },
                    { key: "qnhanb", label: "Pha B", className: "text-right" },
                    { key: "qnhanc", label: "Pha C", className: "text-right" }
                ]
            }
        ];

        if (loaichiso === "2") {
            groups.push(
                {
                    title: "S giao tổng (kWh)",
                    columns: [
                        { key: "sgiaotong", label: "Biểu Tổng", className: "text-right" },
                        { key: "sgiao1", label: "Biểu 1", className: "text-right" },
                        { key: "sgiao2", label: "Biểu 2", className: "text-right" },
                        { key: "sgiao3", label: "Biểu 3", className: "text-right" }
                    ]
                },
                {
                    title: "S nhận tổng (kWh)",
                    columns: [
                        { key: "snhantong", label: "Biểu Tổng", className: "text-right" },
                        { key: "snhan1", label: "Biểu 1", className: "text-right" },
                        { key: "snhan2", label: "Biểu 2", className: "text-right" },
                        { key: "snhan3", label: "Biểu 3", className: "text-right" }
                    ]
                }
            );
        }
    }

    return {
        phaseMode: phaseMode,
        is1Pha: is1Pha,
        loaichiso: loaichiso,
        baseColumns: baseColumns,
        groups: groups
    };
}

function buildHeaderChiTietCongTo(config) {
    const baseHeaders = `
        <th rowspan="2">STT</th>
        ${config.baseColumns.map(col => `<th rowspan="2">${col.label}</th>`).join("")}
    `;

    const groupHeaders = config.groups
        .map(group => `<th colspan="${group.columns.length}" style="border-bottom:none;">${group.title}</th>`)
        .join("");

    const subHeaders = config.groups
        .map(group => group.columns.map(col => `<th>${col.label}</th>`).join(""))
        .join("");

    return `
        <tr>
            ${baseHeaders}
            ${groupHeaders}
        </tr>
        <tr>
            ${subHeaders}
        </tr>
    `;
}

function buildBodyChiTietCongTo(data, config) {
    let html = "";

    data.forEach((v, index) => {
        const rowData = {
            ...v,
            time_display: `
                <span class="text-xanh">HT: ${safeText(v.time)}</span><br>
                <span class="text-do">CT: ${safeText(v.timemeter)}</span>
            `
        };

        html += `<tr>`;
        html += `<td style="text-align:center;vertical-align:middle;font-weight:bold">${index + 1}</td>`;

        config.baseColumns.forEach(col => {
            if (col.key === "time_display") {
                html += `<td class="${col.className || ""}">${rowData.time_display || ""}</td>`;
            } else {
                html += `<td class="${col.className || ""}">${safeText(rowData[col.key])}</td>`;
            }
        });

        config.groups.forEach(group => {
            group.columns.forEach(col => {
                html += `<td class="${col.className || ""}">${retNull(v[col.key])}</td>`;
            });
        });

        html += `</tr>`;
    });

    return html;
}

function initChiTietCongToDataTable(tableId, config) {
    const exportHeaders = buildExportHeaders(config);

    const dt = $(tableId).DataTable({
        destroy: true,
        dom: "frtip",
        scrollX: true,
        scrollCollapse: false,
        paging: true,
        pageLength: 10,
        searching: true,
        ordering: false,
        info: true,
        autoWidth: false,
        fixedHeader: false,
        buttons: [
            {
                extend: "excel",
                title: "Chỉ số công tơ",
                exportOptions: {
                    format: {
                        header: function (data, columnIdx) {
                            return exportHeaders[columnIdx] || data;
                        }
                    }
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
        initComplete: function () {
            const api = this.api();
            setTimeout(function () { api.columns.adjust().draw(false); }, 0);
            setTimeout(function () { api.columns.adjust().draw(false); }, 120);
            setTimeout(function () { api.columns.adjust().draw(false); }, 300);
        }
    });

    return dt;
}

function buildExportHeaders(config) {
    const headers = ["STT"];
    config.baseColumns.forEach(col => headers.push(col.label));
    config.groups.forEach(group => {
        group.columns.forEach(col => {
            headers.push(`${group.title} - ${col.label}`);
        });
    });
    return headers;
}

function validateChiTietTable(tableId) {
    const $table = $(tableId);
    const headerCols = countLeafHeaders($table.find("thead"));
    const $rows = $table.find("tbody tr");

    if (!$rows.length) return true;

    let isValid = true;

    $rows.each(function () {
        const bodyCols = $(this).children("td").length;
        if (bodyCols !== headerCols) {
            isValid = false;
            return false;
        }
    });

    return isValid;
}

function getBodyRowColumnCounts($table) {
    const result = [];
    $table.find("tbody tr").each(function (idx) {
        result.push({
            row: idx + 1,
            cols: $(this).children("td").length
        });
    });
    return result;
}

function countLeafHeaders($thead) {
    const rows = $thead.find("tr");
    if (!rows.length) return 0;

    const grid = [];
    rows.each(function (r) {
        grid[r] = grid[r] || [];
        let c = 0;

        $(this).children("th").each(function () {
            while (grid[r][c]) c++;

            const colspan = parseInt($(this).attr("colspan") || 1, 10);
            const rowspan = parseInt($(this).attr("rowspan") || 1, 10);

            for (let rr = 0; rr < rowspan; rr++) {
                for (let cc = 0; cc < colspan; cc++) {
                    grid[r + rr] = grid[r + rr] || [];
                    grid[r + rr][c + cc] = true;
                }
            }

            c += colspan;
        });
    });

    return grid[grid.length - 1] ? grid[grid.length - 1].length : 0;
}

function safeText(v) {
    return v == null
        ? ""
        : String(v)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#39;");
}

function retNull(number) {
    if (number == null || number == undefined || number === "") {
        return "-";
    }
    return number;
}

function getDateTimeCurrent() {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    const day = currentDate.getDate();
    return `${String(day).padStart(2, "0")}/${String(month).padStart(2, "0")}/${year}`;
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
function exportCsctChitietToExcel() {
    const table = document.getElementById("tbl_xemchitiet_csct");
    if (!table) {
        toastr.error("Không tìm thấy bảng dữ liệu", "Thông báo");
        return;
    }

    const $table = $("#tbl_xemchitiet_csct");

    if (!$table.find("tbody tr").length) {
        toastr.error("Không có dữ liệu để xuất Excel", "Thông báo");
        return;
    }

    if (typeof XLSX === "undefined") {
        toastr.error("Chưa load thư viện XLSX", "Thông báo");
        return;
    }

    const clonedTable = table.cloneNode(true);
    const $cloned = $(clonedTable);

    $cloned.removeAttr("id");
    $cloned.find("*").removeAttr("id");

    removeHiddenCellsFromClonedTable($cloned);

    console.log("Export rows:", $cloned.find("tbody tr").length);
    console.log("Export html:", $cloned[0].outerHTML);

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.table_to_sheet($cloned[0], {
        raw: true
    });

    applyWorksheetStylesFromTable($cloned, ws);
    ws["!cols"] = buildColumnWidthsFromTable($cloned);

    XLSX.utils.book_append_sheet(wb, ws, "ChitietChiSoCongTo");

    const fileName = buildExportFileName("ChitietChiSoCongTo");
    XLSX.writeFile(wb, fileName);
}

