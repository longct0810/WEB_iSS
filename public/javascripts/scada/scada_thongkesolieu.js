

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
    $("#txttungaydate").val(getDateTimeCurrent());
    $("#txtdenngaydate").val(getDateTimeCurrent());
    var danhmucid = localStorage.getItem("code_nhamay");
    loadIOA(danhmucid);
    //thongKeSoLieu();
    $("#btnthuchien_bdpt").click(function () {
        thongKePage = 1;
        thongKeSoLieu(thongKePage);
    });


});
window.addEventListener("nhamay:changed", function (e) {
    const child_code = e.detail.child_code;
    loadIOA(child_code);
});
function getDateTimeCurrent() {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    const day = currentDate.getDate();
    return `${day.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}/${year} `;
}

function loadIOA(danhmucid) {
    var para = {
        "v_idthietbi": danhmucid
    }
    $.ajax({
        url: "/api/scada_thongkesolieu_getIOA",
        data: JSON.stringify(para),
        type: "POST",
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: function (result) {
            $('#cb_ioa').html(`<option value="-1">--Tất cả--</option>`);
            $.each(result, function (k, v) {
                $('#cb_ioa').append("<option value=" + v.id_ioa + ">" + v.ioa_ten + ' (' + v.ioa_diachi + ")" + "</option>")
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
    $('.multi-select').select2();
}

function thongKeSoLieu(page = 1) {
    var danhmucid = localStorage.getItem("code_nhamay");
    //kiểm tra từ ngày đến ngày
    var day = compareDates(timeyyyymmdd($('#txttungaydate').val()), timeyyyymmdd($('#txtdenngaydate').val()));
    if (day > 31) {
        $("#thongkesolieu").html(` <div class="alert alert-danger solid alert-dismissible fade show">
            <svg viewbox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" class="me-2"><polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"></polygon><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>
            <strong>Vui lòng chọn tối đa 7 ngày để xem dữ liệu</strong> 
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="btn-close">
            </button>
        </div>`);

        return;
    }
    var day = compareTwoDate(timeyyyymmdd($('#txttungaydate').val()), timeyyyymmdd($('#txtdenngaydate').val()));
    if (day == 1) {
        $("#thongkesolieu").html(` <div class="alert alert-danger solid alert-dismissible fade show">
            <svg viewbox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" class="me-2"><polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"></polygon><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>
            <strong>Từ ngày nhỏ hơn đến ngày</strong> 
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="btn-close">
            </button>
        </div>`);

        return;
    }
    var kh = $("#cb_ioa").val();
    var i = 0;
    var kh_id = "";
    if (kh != null && kh != undefined && kh != "-1") {
        $.each(kh, function (key, val) {
            i++;
            kh_id += val + ',';
        })
    }
    if (i > 3 || i == 0) {
        $("#thongkesolieu").html(` <div class="alert alert-danger solid alert-dismissible fade show">
            <svg viewbox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" class="me-2"><polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"></polygon><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>
            <strong>Vui lòng chọn tối đa 3 IOA</strong> 
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="btn-close">
            </button>
        </div>`);

        return;
    }
    showLoading();
    var para = {
        v_idthietbi: danhmucid,
        v_tungay: $('#txttungaydate').val(),
        v_denngay: $('#txtdenngaydate').val(),
        v_ioa: kh_id
    }
    $.ajax({
        url: "/api/scada_thongkesolieu_laydulieu",
        data: JSON.stringify(para),
        type: "POST",
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: function (result) {
            hideLoading();
            drawThongKeSoLieu(result);

        },
        error: function (errormessage) {
            hideLoading();

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

function drawThongKeSoLieu(lst) {
    const container = $("#thongkesolieu");

    // Hủy DataTable cũ trước khi xóa HTML
    $(".tbl_thongkesolieu").each(function () {
        if ($.fn.DataTable.isDataTable(this)) {
            $(this).DataTable().clear().destroy();
        }
    });

    container.empty();

    if (!Array.isArray(lst) || lst.length === 0) {
        container.html(`
            <div class="alert alert-danger solid alert-dismissible fade show">
                <svg viewBox="0 0 24 24"
                     width="24"
                     height="24"
                     stroke="currentColor"
                     stroke-width="2"
                     fill="none"
                     stroke-linecap="round"
                     stroke-linejoin="round"
                     class="me-2">
                    <polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"></polygon>
                    <line x1="15" y1="9" x2="9" y2="15"></line>
                    <line x1="9" y1="9" x2="15" y2="15"></line>
                </svg>

                <strong>Không có dữ liệu</strong>

                <button type="button"
                        class="btn-close"
                        data-bs-dismiss="alert"
                        aria-label="Close">
                </button>
            </div>
        `);

        return;
    }

    lst.forEach(function (item) {
        let sensor = item?.json_data;

        // Trường hợp PostgreSQL trả JSON dưới dạng chuỗi
        if (typeof sensor === "string") {
            try {
                sensor = JSON.parse(sensor);
            } catch (err) {
                console.error("JSON không hợp lệ:", sensor, err);
                return;
            }
        }

        if (!sensor || typeof sensor !== "object") {
            console.warn("Dữ liệu sensor không hợp lệ:", item);
            return;
        }

        const sensorId = sensor.id_ioa ?? sensor.ioa_diachi ?? Date.now();
        const data = Array.isArray(sensor.cambien) ? sensor.cambien : [];

        let rowsHtml = "";

        data.forEach(function (value, index) {
            rowsHtml += `
                <tr>
                    <td>
                        ${escapeHtml(value.ioa_ten ?? "")}
                        -
                        ${escapeHtml(value.ioa_diachi ?? "")}
                    </td>

                    <td class="text-center">
                        ${index + 1}
                    </td>

                    <td style="display:none">
                        ${escapeHtml(value.ioa_ten ?? "")}
                    </td>

                    <td style="display:none">
                        ${escapeHtml(value.ioa_diachi ?? "")}
                    </td>

                    <td class="text-end">
                        ${formatValue(value.value)}
                    </td>

                    <td class="text-center">
                        ${escapeHtml(retNull(value.ghichu))}
                    </td>

                    <td class="text-center">
                        ${escapeHtml(value.time ?? "")}
                    </td>
                </tr>
            `;
        });

        const tableHtml = `
            <div class="col-lg-6 mb-3">
                <table
                    id="tbl_thongkesolieu_${sensorId}"
                    class="table table-bordered table-striped table-hover tbl_thongkesolieu"
                    style="width:100%"
                >
                    <thead class="table-light">
                        <tr>
                            <th>Tên IOA - Địa chỉ</th>
                            <th class="text-center">STT</th>
                            <th style="display:none">Tên IOA</th>
                            <th style="display:none">Địa chỉ</th>
                            <th class="text-center">Giá trị</th>
                            <th class="text-center">Đơn vị</th>
                            <th class="text-center">Thời gian</th>
                        </tr>
                    </thead>

                    <tbody>
                        ${rowsHtml}
                    </tbody>
                </table>
            </div>
        `;

        container.append(tableHtml);
    });

    getStyleTable();
}

function getStyleTable() {
    $(".tbl_thongkesolieu").each(function () {
        const table = $(this);

        if ($.fn.DataTable.isDataTable(this)) {
            table.DataTable().clear().destroy();
        }

        table.DataTable({
            dom:
                '<"top"Bf>' +
                'rt' +
                '<"row mt-2"<"col-md-3"l><"col-md-9 text-end"p>>' +
                '<"row mt-2"<"col-12 text-center"i>>',

            buttons: [
                {
                    extend: "excelHtml5",
                    title: "Thống kê số liệu",
                    exportOptions: {
                        columns: [1, 2, 3, 4, 5, 6]
                    }
                }
            ],

            rowGroup: {
                dataSrc: 0
            },

            columnDefs: [
                {
                    visible: false,
                    targets: [0, 2, 3]
                },
                {
                    className: "text-center",
                    targets: [1, 5, 6]
                },
                {
                    className: "text-end",
                    targets: [4]
                }
            ],

            order: [[1, "asc"]],
            pageLength: 10,
            lengthMenu: [10, 20, 50, 100, 200],
            paging: true,
            searching: true,
            ordering: false,
            info: true,
            autoWidth: false,
            scrollX: false,
            scrollCollapse: true,

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
            }
        });
    });
}

function formatValue(value) {
    if (value === null || value === undefined || value === "") {
        return "";
    }

    const numberValue = Number(value);

    if (Number.isNaN(numberValue)) {
        return escapeHtml(String(value));
    }

    return numberValue.toLocaleString("vi-VN", {
        maximumFractionDigits: 3
    });
}

function escapeHtml(value) {
    return $("<div>").text(value ?? "").html();
}

function retNull(number) {
    if (number == null || number == undefined || (number == "")) {
        return '-';
    }
    return number;
}



function showLoading() {
    $("#thongkesolieu").html(`
        <div class="text-center p-5">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
            <div class="mt-2">
                Đang tải dữ liệu, vui lòng chờ...
            </div>
        </div>
    `);
}

function hideLoading() {
    // không cần làm gì, drawThongKeSoLieu sẽ ghi đè
}