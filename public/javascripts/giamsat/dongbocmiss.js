var lstData = [];
$(document).ready(function () {
    if (!localStorage.getItem("us")) {
        window.location.href = "../login";
        return;
    }

    $("#txtNgay").val(getDateTimeCurrent());
    initDatePickerDefault();
    getHour();

    $('input[type="file"]').on("change", handle_upload);

    $('input[type="file"]').click(function () {
        $('input[type="file"]').val("");
    });
    $("#btnNapDuLieu").on("click", function () {
        f_napdulieu();
    });
    $("#btnXuatXml").on("click", function () {
        f_xuatXmlTable();
    });
    $("#btnXuatExcel").on("click", function () {
        f_xuatExcelTable();
    });
    $("#btnKiemSoatChiSo").on("click", function () {
        f_printChiSo();
    });
});

const CMIS_HEADERS = [
    "Ghi chú",
    "MA_KHANG",
    "SERY_CTO",
    "CS_CU",
    "SL_CU",
    "CS_MOI",
    "SL_MOI",
    "MA_NVGCS",
    "MA_DDO",
    "MA_DVIQLY",
    "MA_GC",
    "MA_QUYEN",
    "MA_TRAM",
    "BOCSO_ID",
    "LOAI_BCS",
    "TEN_KHANG",
    "DIA_CHI",
    "MA_NN",
    "SO_HO",
    "MA_CTO",
    "HSN",
    "TTR_CU",
    "SL_TTIEP",
    "NGAY_CU",
    "TTR_MOI",
    "CHUOI_GIA",
    "KY",
    "THANG",
    "NAM",
    "NGAY_MOI",
    "NGUOI_GCS",
    "SL_THAO",
    "KIMUA_CSPK",
    "MA_COT",
    "SLUONG_1",
    "SLUONG_2",
    "SLUONG_3",
    "SO_HOM",
    "PMAX",
    "NGAY_PMAX",
    "X",
    "Y",
    "Z"
];

function initDatePickerDefault() {
    $(".datepicker-default").pickadate({
        monthPrev: "&larr;",
        monthNext: "&rarr;",
        weekdaysShort: ["CN", "T2", "T3", "T4", "T5", "T6", "T7"],
        showMonthsFull: true,
        today: "Hôm nay",
        clear: "Xóa",
        close: "Đóng",
        formatSubmit: "dd/mm/yyyy",
        format: "dd/mm/yyyy",
        monthsFull: [
            "Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6",
            "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"
        ],
        monthsShort: [
            "Th 1", "Th 2", "Th 3", "Th 4", "Th 5", "Th 6",
            "Th 7", "Th 8", "Th 9", "Th 10", "Th 11", "Th 12"
        ]
    });
}

function getDateTimeCurrent() {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    const day = currentDate.getDate();

    return `${String(day).padStart(2, "0")}/${String(month).padStart(2, "0")}/${year}`;
}

function getHour() {
    const data = getListTime();

    $("#cboGio").empty();
    $("#cboGio").append(`<option value="-1">Tất cả</option>`);

    $.each(data, function (index, item) {
        $("#cboGio").append(`<option value="${item.value}">${item.value}</option>`);
    });
}

function handle_upload(e) {
    const files = e.target.files;

    if (!files || files.length === 0) {
        resetCmisTable();
        $("#tblCmis").addClass("hidden");
        toastr.error("Vui lòng chọn file", "Thông báo");
        return false;
    }

    resetCmisTable();

    $("#tblCmis").removeClass("hidden");
    $(".alert").alert("close");

    const formData = new FormData();
    formData.append("file", files[0]);

    $.ajax({
        url: "/api/dongbocmiss_uploadfile",
        data: formData,
        type: "POST",
        processData: false,
        contentType: false,
        dataType: "json",

        success: function (result) {
            if (result.success !== true) {
                toastr.error(result.message || "Import file thất bại", "Thông báo");
                return;
            }

            let arr = [];

            try {
                arr = typeof result.data === "string"
                    ? JSON.parse(result.data)
                    : result.data;
            } catch (err) {
                console.error("Parse result.data error:", err);
                toastr.error("Dữ liệu trả về không hợp lệ", "Thông báo");
                return;
            }

            if (!Array.isArray(arr) || arr.length === 0) {
                toastr.warning("File không có dữ liệu", "Thông báo");
                renderCmisTable([]);
                return;
            }

            renderCmisTable(arr);
            // toastr.success(`Đã load ${arr.length} bản ghi`, "Thông báo");
        },

        error: function (errormessage) {
            const msg =
                errormessage?.responseJSON?.message ||
                errormessage?.responseText ||
                "Có lỗi khi upload file";

            toastr.error(msg, "Thông báo");
        }
    });
}

function resetCmisTable() {
    if ($.fn.DataTable.isDataTable("#tblCmis")) {
        $("#tblCmis").DataTable().clear().destroy();
    }

    $("#tblCmis thead").empty();
    $("#tblCmis tbody").empty();
}

function renderCmisTable(arr) {
    resetCmisTable();

    let thead = "<tr>";
    CMIS_HEADERS.forEach(function (header) {
        thead += `<th>${escapeHtml(header)}</th>`;
    });
    thead += "</tr>";

    $("#tblCmis thead").html(thead);

    let tbody = "";

    if (!Array.isArray(arr) || arr.length === 0) {
        tbody = `
            <tr>
                <td colspan="${CMIS_HEADERS.length}" class="text-center">
                    Không có dữ liệu
                </td>
            </tr>
        `;
        $("#tblCmis tbody").html(tbody);
        return;
    }

    arr.forEach(function (row) {
        const bg = row.bgcolor ? `background:${row.bgcolor};` : "";
        const color = row.txtcolor ? `color:${row.txtcolor};` : "";

        tbody += `<tr style="${bg}${color}">`;
        CMIS_HEADERS.forEach(function (header) {
            if (header === "Ghi chú") {
                const note = row.GHICHU || "";
                tbody += `<td>${escapeHtml(note)}</td>`;
            } else {
                tbody += `<td>${escapeHtml(retNull(row[header]))}</td>`;
            }
        });

        tbody += "</tr>";
    });

    $("#tblCmis tbody").html(tbody);

    initCmisDataTable();
}

function initCmisDataTable() {
    const table = $("#tblCmis").DataTable({
        paging: true,
        pageLength: 20,
        lengthMenu: [10, 20, 50, 100, 200, 500],
        searching: true,
        ordering: true,
        info: true,
        autoWidth: false,
        scrollX: true,
        scrollCollapse: true,
        stateSave: false,

        columnDefs: [
            { targets: "_all", className: "text-nowrap" },
            { targets: 0, orderable: false, searchable: false }
        ],

        language: {
            sLengthMenu: "Xem _MENU_ bản ghi",
            sZeroRecords: "Không tìm thấy dòng nào phù hợp",
            sInfo: "Đang xem _START_ đến _END_ trong tổng số _TOTAL_ bản ghi",
            sInfoEmpty: "Đang xem 0 đến 0 trong tổng số 0 bản ghi",
            sInfoFiltered: "(lọc từ _MAX_ bản ghi)",
            sSearch: "Tìm kiếm:",
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
        table.columns.adjust().draw(false);
    }, 300);
}
function retNull(value) {
    if (value === null || value === undefined || value === "") {
        return "-";
    }

    return value;
}

function escapeHtml(value) {
    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function f_napdulieu() {
    const files = $('#btnUploadCmis')[0].files;

    if (!files || files.length === 0) {
        resetCmisTable();
        $("#tblCmis").addClass("hidden");
        toastr.error("Vui lòng chọn file", "Thông báo");
        return false;
    }
    const formData = new FormData();
    var hsn = $("#chkChiaHSN").prop("checked") == true ? 1 : 0;
    var isNgay = $("#chkLayTrongNgay").prop("checked") == true ? 1 : 0;
    var thoidiem = $("#txtNgay").val() + " " + $("#cboGio").val();
    formData.append("file", files[0]);
    formData.append("v_sudung_hsn", hsn);
    formData.append("v_thoidiem", thoidiem);
    formData.append("v_isNgay", isNgay);
    $.ajax({
        url: "/api/dongbocmiss_napdulieu",
        data: formData,
        type: "POST",
        processData: false,
        contentType: false,
        dataType: "json",

        success: function (result) {
            $("#messageBox").hide().html("");
            if (result.success !== true) {
                toastr.error(result.message || "Import file thất bại", "Thông báo");
                return;
            }

            let arr = [];

            try {
                arr = typeof result.data === "string"
                    ? JSON.parse(result.data)
                    : result.data;
                // ✅ check lỗi DATE_TOO_FAR
                if (
                    Array.isArray(arr) &&
                    arr.length > 0 &&
                    Number(arr[0].KETQUA) === -1 &&
                    arr[0].THONGBAO === "DATE_TOO_FAR"
                ) {
                    renderCmisTable([]);
                    showMessage(
                        "Ngày mới quá xa so với ngày chốt. Vui lòng kiểm tra lại tệp *.xml",
                        "error"
                    );
                    return;
                }
                lstData = arr;
            } catch (err) {
                console.error("Parse result.data error:", err);
                toastr.error("Dữ liệu trả về không hợp lệ", "Thông báo");
                return;
            }

            if (!Array.isArray(arr) || arr.length === 0) {
                toastr.warning("File không có dữ liệu", "Thông báo");
                return;
            }
            arr = applyCmisGhiChu(arr);

            updateCmisSummary(arr);
            renderCmisTable(arr);
            // toastr.success(`Đã load ${arr.length} bản ghi`, "Thông báo");
        },

        error: function (errormessage) {
            const msg =
                errormessage?.responseJSON?.message ||
                errormessage?.responseText ||
                "Có lỗi khi upload file";

            toastr.error(msg, "Thông báo");
        }
    });

}
function showMessage(msg, type = "error") {
    const $box = $("#messageBox");

    let color = "#f8d7da";      // đỏ nhạt
    let textColor = "#721c24";  // đỏ đậm

    if (type === "success") {
        color = "#d4edda";
        textColor = "#155724";
    } else if (type === "warning") {
        color = "#fff3cd";
        textColor = "#856404";
    }

    $box
        .html(`<b>${msg}</b>`)
        .css({
            display: "block",
            background: color,
            color: textColor,
            padding: "10px",
            border: "1px solid #ccc",
            margin: "10px 0",
            borderRadius: "5px"
        });
}
function applyCmisGhiChu(arr) {
    const tyLeTren = Number($("#txtTyLeTren").val() || 35);
    const tyLeDuoi = Number($("#txtTyLeDuoi").val() || 35);

    return arr.map(function (x) {
        const csCu = Number(x.CS_CU || 0);

        const csMoiRaw = x.CS_MOI;
        const csMoi = Number(csMoiRaw);

        const slCu = Number(x.SL_CU || 0);
        const slMoi = Number(x.SL_MOI || 0);

        let ghichu = "";
        let bgcolor = "";
        let txtcolor = "";

        // ✅ FIX CHỖ NÀY
        if (!csMoiRaw || csMoiRaw === '-' || csMoi === '0' || isNaN(csMoi)) {
            ghichu = "Không lấy được chỉ số";
            bgcolor = "#EBF3BE";
        } else if (slCu > 0) {
            const tyle = ((slMoi - slCu) / slCu) * 100;

            if (csMoi > csCu && tyle > tyLeTren) {
                ghichu = "Sản lượng cao quá " + tyLeTren + "%";
                bgcolor = "#BEF3C9";
                txtcolor = "#FF0000";
            } else if (csMoi > csCu && tyle < -tyLeDuoi) {
                ghichu = "Sản lượng thấp quá " + tyLeDuoi + "%";
                bgcolor = "#B6DEFD";
                txtcolor = "#FF0000";
            } else if (csMoi < csCu) {
                ghichu = "Sản lượng âm do thay hoặc hư hỏng công tơ";
                bgcolor = "#F3BEBE";
            } else if (csMoi === csCu) {
                ghichu = "Sản lượng không tăng";
            } else if (csMoi < 0.5) {
                ghichu = "Sản lượng quá nhỏ (< 0.5)";
            }
        } else if (slCu === 0) {
            if (csMoi < csCu) {
                ghichu = "Sản lượng âm do thay hoặc hư hỏng công tơ";
                bgcolor = "#F3BEBE";
            } else if (csMoi !== csCu) {
                ghichu = "Sản lượng cũ bằng 0";
            }
        }

        return {
            ...x,
            GHICHU: ghichu,
            bgcolor,
            txtcolor
        };
    });
}
function updateCmisSummary(arr) {
    const tyLeTren = Number($("#txtTyLeTren").val() || 35);
    const tyLeDuoi = Number($("#txtTyLeDuoi").val() || 35);

    let countKH = arr.length;
    let soLuongKHLayCSMOI = 0;
    let soLuongBinhThuong = 0;
    let soLuongQuaTyleTren = 0;
    let soLuongQuaTyleDuoi = 0;
    let soLuongKgCoCsMoi = 0;
    let soLuongBatThuong = 0;

    arr.forEach(function (x) {
        const csMoiRaw = x.CS_MOI;
        const csMoi = Number(csMoiRaw);
        const ghichu = String(x.ghichus || "").trim();

        if (!csMoiRaw || csMoiRaw === "-" || isNaN(csMoi)) {
            soLuongKgCoCsMoi++;
            return;
        }

        soLuongKHLayCSMOI++;

        if (!ghichu) {
            soLuongBinhThuong++;
        } else if (ghichu.includes("cao quá")) {
            soLuongQuaTyleTren++;
            soLuongBatThuong++;
        } else if (ghichu.includes("thấp quá")) {
            soLuongQuaTyleDuoi++;
            soLuongBatThuong++;
        } else {
            soLuongBatThuong++;
        }
    });

    $("#countKH").text(countKH);
    $("#soLuongKHLayCSMOI").text(soLuongKHLayCSMOI);
    $("#soLuongBinhThuong").text(soLuongBinhThuong);
    $("#soLuongQuaTyleTren").text(soLuongQuaTyleTren);
    $("#soLuongQuaTyleDuoi").text(soLuongQuaTyleDuoi);
    $("#soLuongKgCoCsMoi").text(soLuongKgCoCsMoi);
    $("#soLuongBatThuong").text(soLuongBatThuong);

    $("#tyLeCbTrenText").text(tyLeTren);
    $("#tyLeCbDuoiText").text(tyLeDuoi);
}
let currentCmisData = [];

const CMIS_XML_FIELDS = [
    "MA_NVGCS", "MA_KHANG", "MA_DDO", "MA_DVIQLY", "MA_GC",
    "MA_QUYEN", "MA_TRAM", "BOCSO_ID", "LOAI_BCS", "LOAI_CS",
    "TEN_KHANG", "DIA_CHI", "MA_NN", "SO_HO", "MA_CTO",
    "SERY_CTO", "HSN", "CS_CU", "TTR_CU", "SL_CU",
    "SL_TTIEP", "NGAY_CU", "CS_MOI", "TTR_MOI", "SL_MOI",
    "CHUOI_GIA", "KY", "THANG", "NAM", "NGAY_MOI",
    "NGUOI_GCS", "SL_THAO", "KIMUA_CSPK", "MA_COT",
    "SLUONG_1", "SLUONG_2", "SLUONG_3", "SO_HOM", "GIA_TRI_1", "GIA_TRI_2", "GIA_TRI_3",
    "PMAX", "NGAY_PMAX", "X", "Y", "Z"
];

function renderCmisTable(arr) {
    currentCmisData = Array.isArray(arr) ? arr : [];

    resetCmisTable();

    let thead = "<tr>";
    CMIS_HEADERS.forEach(function (header) {
        thead += `<th>${escapeHtml(header)}</th>`;
    });
    thead += "</tr>";
    $("#tblCmis thead").html(thead);

    let tbody = "";

    if (!currentCmisData.length) {
        $("#tblCmis tbody").html(`
            <tr>
                <td colspan="${CMIS_HEADERS.length}" class="text-center">Không có dữ liệu</td>
            </tr>
        `);
        return;
    }

    currentCmisData.forEach(function (row) {
        const bg = row.bgcolor ? `background:${row.bgcolor};` : "";
        const color = row.txtcolor ? `color:${row.txtcolor};` : "";

        tbody += `<tr style="${bg}${color}">`;

        CMIS_HEADERS.forEach(function (header) {
            if (header === "Ghi chú") {
                tbody += `<td style="${bg}${color}"><b>${escapeHtml(row.GHICHU || "")}</b></td>`;
            } else {
                tbody += `<td style="${bg}${color}">${escapeHtml(retNull(row[header]))}</td>`;
            }
        });

        tbody += "</tr>";
    });

    $("#tblCmis tbody").html(tbody);
    initCmisDataTable();
}

function f_xuatXmlTable() {
    if (!currentCmisData || currentCmisData.length === 0) {
        toastr.warning("Chưa có dữ liệu để xuất XML", "Thông báo");
        return;
    }

    let xml = `<?xml version="1.0" encoding="UTF-8"?>`;
    xml += `<NewDataSet>\n`;
    xml += buildCmisSchemaXml();

    currentCmisData.forEach(function (row) {
        xml += `  <Table1>\n`;

        CMIS_XML_FIELDS.forEach(function (field) {
            let value = row[field];

            if (value === "-" || value === null || value === undefined) {
                value = "";
            }

            xml += `    <${field}>${escapeXml(value)}</${field}>\n`;
        });

        xml += `  </Table1>\n`;
    });

    xml += `</NewDataSet>`;
    const files = $('#btnUploadCmis')[0].files;
    const file = files[0];
    const currentFileName = file.name.replace(/\.xml$/i, "");

    // ✅ tạo timestamp
    const now = new Date();
    const time = now.toISOString().slice(0, 19).replace(/[:T]/g, "-");
    // ✅ export
    downloadXmlFile(xml, currentFileName + "_" + time + ".XML");
}


function buildCmisSchemaXml() {
    const fields = [
        { name: "MA_NVGCS", type: "xs:string" },
        { name: "MA_KHANG", type: "xs:string" },
        { name: "MA_DDO", type: "xs:string" },
        { name: "MA_DVIQLY", type: "xs:string" },
        { name: "MA_GC", type: "xs:string" },
        { name: "MA_QUYEN", type: "xs:string" },
        { name: "MA_TRAM", type: "xs:string" },

        { name: "BOCSO_ID", type: "xs:long" },

        { name: "LOAI_BCS", type: "xs:string" },
        { name: "LOAI_CS", type: "xs:string" },
        { name: "TEN_KHANG", type: "xs:string" },
        { name: "DIA_CHI", type: "xs:string" },
        { name: "MA_NN", type: "xs:string" },

        { name: "SO_HO", type: "xs:decimal" },

        { name: "MA_CTO", type: "xs:string" },
        { name: "SERY_CTO", type: "xs:string" },

        { name: "HSN", type: "xs:decimal" },
        { name: "CS_CU", type: "xs:decimal" },
        { name: "TTR_CU", type: "xs:string" },

        { name: "SL_CU", type: "xs:long" },
        { name: "SL_TTIEP", type: "xs:int" },

        { name: "NGAY_CU", type: "xs:dateTime", isDate: true },

        { name: "CS_MOI", type: "xs:decimal" },
        { name: "TTR_MOI", type: "xs:string" },
        { name: "SL_MOI", type: "xs:decimal" },

        { name: "CHUOI_GIA", type: "xs:string" },

        { name: "KY", type: "xs:int" },
        { name: "THANG", type: "xs:int" },
        { name: "NAM", type: "xs:int" },

        { name: "NGAY_MOI", type: "xs:dateTime", isDate: true },

        { name: "NGUOI_GCS", type: "xs:string" },
        { name: "SL_THAO", type: "xs:decimal" },

        { name: "KIMUA_CSPK", type: "xs:short" },

        { name: "MA_COT", type: "xs:string" },

        { name: "SLUONG_1", type: "xs:long" },
        { name: "SLUONG_2", type: "xs:long" },
        { name: "SLUONG_3", type: "xs:long" },

        { name: "SO_HOM", type: "xs:string" },

        { name: "PMAX", type: "xs:decimal" },

        { name: "NGAY_PMAX", type: "xs:dateTime", isDate: true },

        { name: "X", type: "xs:string" },
        { name: "Y", type: "xs:string" },
        { name: "Z", type: "xs:string" }
    ];

    let xml = `
<xs:complexType>
  <xs:choice minOccurs="0" maxOccurs="unbounded">
    <xs:element name="Table1">
      <xs:complexType>
        <xs:sequence>
`;

    fields.forEach(f => {
        if (f.isDate) {
            xml += `          <xs:element name="${f.name}" msdata:DateTimeMode="Unspecified" type="${f.type}" minOccurs="0" />\n`;
        } else {
            xml += `          <xs:element name="${f.name}" type="${f.type}" minOccurs="0" />\n`;
        }
    });

    xml += `
        </xs:sequence>
      </xs:complexType>
    </xs:element>
  </xs:choice>
</xs:complexType>
`;

    return xml;
}

// function buildCmisSchemaXml() {
//      
//     let schema = "";
//     schema += `  <xs:schema xmlns:msdata="urn:schemas-microsoft-com:xml-msdata" xmlns:xs="http://www.w3.org/2001/XMLSchema" id="NewDataSet">\n`;
//     schema += `    <xs:element msdata:IsDataSet="true" msdata:UseCurrentLocale="true" name="NewDataSet">\n`;
//     schema += `      <xs:complexType>\n`;
//     schema += `        <xs:choice maxOccurs="unbounded" minOccurs="0">\n`;
//     schema += `          <xs:element name="Table1">\n`;
//     schema += `            <xs:complexType>\n`;
//     schema += `              <xs:sequence>\n`;

//     CMIS_XML_FIELDS.forEach(function (field) {
//         schema += `                <xs:element minOccurs="0" name="${field}" type="xs:string"/>\n`;
//     });

//     schema += `              </xs:sequence>\n`;
//     schema += `            </xs:complexType>\n`;
//     schema += `          </xs:element>\n`;
//     schema += `        </xs:choice>\n`;
//     schema += `      </xs:complexType>\n`;
//     schema += `    </xs:element>\n`;
//     schema += `  </xs:schema>\n`;

//     return schema;
// }

function escapeXml(value) {
    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&apos;");
}

function downloadXmlFile(xmlContent, fileName) {
    const blob = new Blob([xmlContent], {
        type: "application/xml;charset=utf-8"
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");

    a.href = url;
    a.download = fileName;

    document.body.appendChild(a);
    a.click();

    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function stripHtml(value) {
    return $("<div>").html(value ?? "").text();
}

function escapeXml(value) {
    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&apos;");
}

function downloadXmlFile(xmlContent, fileName) {
    const blob = new Blob([xmlContent], {
        type: "application/xml;charset=utf-8"
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");

    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();

    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}


async function f_xuatExcelTable() {
    const $table = $("#tblCmis");

    if (!$table.length) {
        toastr.error("Không tìm thấy bảng dữ liệu", "Thông báo");
        return;
    }

    if (typeof XLSX === "undefined") {
        toastr.error("Chưa load thư viện XLSX", "Thông báo");
        return;
    }

    if (!$.fn.DataTable.isDataTable("#tblCmis")) {
        toastr.error("Bảng chưa được khởi tạo DataTable", "Thông báo");
        return;
    }

    const dt = $table.DataTable();
    const totalRows = dt.rows({ search: "applied" }).count();

    if (!totalRows) {
        toastr.error("Không có dữ liệu để xuất Excel", "Thông báo");
        return;
    }

    const oldPageLen = dt.page.len();
    const oldPage = dt.page();
    const oldScrollTop = $(window).scrollTop();

    try {
        setExportLoading(true);

        toastr.info(`Đang xuất ${totalRows} dòng, vui lòng chờ...`, "Thông báo", {
            timeOut: 1500,
            positionClass: "toast-bottom-right"
        });

        await sleep(80);

        await redrawDataTableAsync(dt, -1);
        await waitNextFrame();
        await waitNextFrame();
        await sleep(50);

        const $exportTable = buildExportTableFromRenderedDom($table);

        const debugInfo = {
            headerCols: countLeafColumns($exportTable.find("thead")),
            bodyCols: countFirstBodyColumns($exportTable.find("tbody")),
            bodyRows: $exportTable.find("tbody tr").length
        };


        if (!debugInfo.bodyRows) {
            toastr.error("Không có dữ liệu để xuất Excel", "Thông báo");
            return;
        }

        await sleep(30);

        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.table_to_sheet($exportTable[0], { raw: true });

        await sleep(30);

        ws["!merges"] = buildWorksheetMergesFromTable($exportTable);
        ws["!cols"] = buildColumnWidthsFromRenderedTable($exportTable);

        if (totalRows > 2000) {
            applyWorksheetStylesFast($exportTable, ws);
        } else {
            applyWorksheetStylesFromRenderedTable($exportTable, ws);
        }

        const headerRowCount = $exportTable.find("thead tr").length;
        ws["!freeze"] = {
            xSplit: 0,
            ySplit: headerRowCount
        };

        XLSX.utils.book_append_sheet(wb, ws, "sheet1");

        await sleep(30);
        const files = $('#btnUploadCmis')[0].files;
        const file = files[0];
        const currentFileName = file.name.replace(/\.xml$/i, "");

        XLSX.writeFile(wb, buildExportFileName(currentFileName));
    } catch (err) {
        console.error("Export Excel lỗi:", err);
        toastr.error("Xuất Excel thất bại", "Thông báo");
    } finally {
        await redrawDataTableAsync(dt, oldPageLen, oldPage);
        $(window).scrollTop(oldScrollTop);
        setExportLoading(false);
    }
}

function setExportLoading(isLoading) {
    const $btn = $("#btnExportExcelCsct");

    if (!$btn.length) return;

    if (isLoading) {
        if (!$btn.data("old-text")) {
            $btn.data("old-text", $btn.html());
        }

        $btn.prop("disabled", true);
        $btn.html(`<i class="fa fa-spinner fa-spin"></i> Đang xuất...`);
    } else {
        $btn.prop("disabled", false);
        $btn.html($btn.data("old-text") || "Xuất Excel");
        $btn.removeData("old-text");
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function redrawDataTableAsync(dt, pageLen, pageIndex) {
    return new Promise((resolve) => {
        dt.one("draw", function () {
            resolve();
        });

        if (typeof pageIndex === "number") {
            dt.page.len(pageLen).page(pageIndex).draw(false);
        } else {
            dt.page.len(pageLen).draw(false);
        }
    });
}

function waitNextFrame() {
    return new Promise((resolve) => {
        requestAnimationFrame(() => resolve());
    });
}

function buildExportTableFromRenderedDom($sourceTable) {
    const clonedTable = $sourceTable[0].cloneNode(true);
    const $cloned = $(clonedTable);

    $cloned.removeAttr("id");
    $cloned.find("*").removeAttr("id");
    $cloned.find("colgroup").remove();

    removeHiddenCellsFromExportTable($cloned);

    const visibleColCount = countLeafColumns($cloned.find("thead"));
    $cloned.find("tbody tr.dt-group-row td").attr("colspan", visibleColCount);

    cleanExportTableHtml($cloned);

    return $cloned;
}

function removeHiddenCellsFromExportTable($table) {
    $table.find("th, td").each(function () {
        const $cell = $(this);
        const style = String($cell.attr("style") || "").toLowerCase();

        const isHidden =
            style.includes("display: none") ||
            style.includes("display:none") ||
            $cell.hasClass("d-none") ||
            $cell.hasClass("dt-hidden") ||
            $cell.hasClass("dtr-hidden");

        if (isHidden) {
            $cell.remove();
        }
    });

    $table.find("thead tr").each(function () {
        if (!$(this).children("th").length) {
            $(this).remove();
        }
    });
}

function cleanExportTableHtml($table) {
    $table.find("a").each(function () {
        $(this).replaceWith($(this).text());
    });

    $table.find("br").replaceWith("\n");

    $table.find("[onclick]").removeAttr("onclick");
    $table.find("[data-toggle]").removeAttr("data-toggle");
    $table.find("[data-target]").removeAttr("data-target");
    $table.find("[data-bs-toggle]").removeAttr("data-bs-toggle");
    $table.find("[data-bs-target]").removeAttr("data-bs-target");

    $table.find(".sorting, .sorting_asc, .sorting_desc")
        .removeClass("sorting sorting_asc sorting_desc");
}

function buildWorksheetMergesFromTable($table) {
    const merges = [];
    const occupied = {};
    let excelRow = 0;

    $table.find("thead tr, tbody tr").each(function () {
        const $row = $(this);
        let excelCol = 0;

        $row.children("th, td").each(function () {
            while (occupied[excelRow + "_" + excelCol]) excelCol++;

            const $cell = $(this);
            const rowspan = parseInt($cell.attr("rowspan") || 1, 10);
            const colspan = parseInt($cell.attr("colspan") || 1, 10);

            if (rowspan > 1 || colspan > 1) {
                merges.push({
                    s: { r: excelRow, c: excelCol },
                    e: { r: excelRow + rowspan - 1, c: excelCol + colspan - 1 }
                });
            }

            for (let rr = 0; rr < rowspan; rr++) {
                for (let cc = 0; cc < colspan; cc++) {
                    occupied[(excelRow + rr) + "_" + (excelCol + cc)] = true;
                }
            }

            excelCol += colspan;
        });

        excelRow++;
    });

    return merges;
}

function buildColumnWidthsFromRenderedTable($table) {
    const widths = [];
    const occupied = {};
    let rowIndex = 0;

    $table.find("thead tr, tbody tr").each(function () {
        let colIndex = 0;

        $(this).children("th, td").each(function () {
            while (occupied[rowIndex + "_" + colIndex]) colIndex++;

            const $cell = $(this);
            const colspan = parseInt($cell.attr("colspan") || 1, 10);
            const rowspan = parseInt($cell.attr("rowspan") || 1, 10);
            const text = normalizeText($cell.text());

            let wch = Math.max(10, Math.min(55, text.length + 4));

            if ($cell.hasClass("text-right")) {
                wch = Math.max(wch, 14);
            }

            const eachCol = Math.ceil(wch / colspan);
            for (let i = 0; i < colspan; i++) {
                widths[colIndex + i] = Math.max(widths[colIndex + i] || 0, eachCol);
            }

            for (let rr = 0; rr < rowspan; rr++) {
                for (let cc = 0; cc < colspan; cc++) {
                    occupied[(rowIndex + rr) + "_" + (colIndex + cc)] = true;
                }
            }

            colIndex += colspan;
        });

        rowIndex++;
    });

    return widths.map(w => ({ wch: w || 12 }));
}

function applyWorksheetStylesFast($table, ws) {
    if (!ws["!ref"]) return;

    const range = XLSX.utils.decode_range(ws["!ref"]);
    const headerRowCount = $table.find("thead tr").length;
    const $bodyRows = $table.find("tbody tr");

    for (let r = range.s.r; r <= range.e.r; r++) {
        const isHeader = r < headerRowCount;
        const bodyRowIndex = r - headerRowCount;
        const isGroup = !isHeader && $bodyRows.eq(bodyRowIndex).hasClass("dt-group-row");

        if (!isHeader && !isGroup) continue;

        for (let c = range.s.c; c <= range.e.c; c++) {
            const ref = XLSX.utils.encode_cell({ r, c });
            if (!ws[ref]) continue;

            ws[ref].s = {
                font: {
                    name: "Arial",
                    sz: 10,
                    bold: true
                },
                alignment: {
                    vertical: "center",
                    horizontal: isHeader ? "center" : "left",
                    wrapText: true
                },
                fill: {
                    fgColor: {
                        rgb: isHeader ? "D9EAF7" : "E8ECF1"
                    }
                }
            };
        }
    }
}

function applyWorksheetStylesFromRenderedTable($table, ws) {
    if (!ws["!ref"]) return;

    const range = XLSX.utils.decode_range(ws["!ref"]);
    const headerRowCount = $table.find("thead tr").length;
    const $bodyRows = $table.find("tbody tr");

    for (let r = range.s.r; r <= range.e.r; r++) {
        for (let c = range.s.c; c <= range.e.c; c++) {
            const ref = XLSX.utils.encode_cell({ r, c });
            if (!ws[ref]) continue;

            const isHeader = r < headerRowCount;
            const bodyRowIndex = r - headerRowCount;
            const $bodyRow = bodyRowIndex >= 0 ? $bodyRows.eq(bodyRowIndex) : $();
            const isGroup = !isHeader && $bodyRow.hasClass("dt-group-row");

            let horizontal = "left";

            if (isHeader) {
                horizontal = "center";
            } else if (!isGroup) {
                const $domCell = $bodyRow.children("td").eq(c);
                if ($domCell.hasClass("text-right")) horizontal = "right";
                else if ($domCell.hasClass("text-center")) horizontal = "center";
            }

            ws[ref].s = {
                font: {
                    name: "Arial",
                    sz: 10,
                    bold: isHeader || isGroup
                },
                alignment: {
                    vertical: "center",
                    horizontal,
                    wrapText: true
                },
                border: {
                    top: { style: "thin", color: { rgb: "999999" } },
                    bottom: { style: "thin", color: { rgb: "999999" } },
                    left: { style: "thin", color: { rgb: "999999" } },
                    right: { style: "thin", color: { rgb: "999999" } }
                },
                fill: isHeader
                    ? { fgColor: { rgb: "D9EAF7" } }
                    : isGroup
                        ? { fgColor: { rgb: "E8ECF1" } }
                        : undefined
            };
        }
    }
}

function countLeafColumns($thead) {
    const $rows = $thead.find("tr");
    if (!$rows.length) return 0;

    const grid = [];

    $rows.each(function (r) {
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

function countFirstBodyColumns($tbody) {
    const $firstNormalRow = $tbody.find("tr").not(".dt-group-row").first();
    return $firstNormalRow.length ? $firstNormalRow.children("td").length : 0;
}

function normalizeText(text) {
    return String(text == null ? "" : text)
        .replace(/\u00a0/g, " ")
        .replace(/\s+\n/g, "\n")
        .replace(/\n\s+/g, "\n")
        .replace(/[ \t]+/g, " ")
        .trim();
}

function buildExportFileName(prefix) {
    const now = new Date();
    const yyyy = now.getFullYear();
    const MM = String(now.getMonth() + 1).padStart(2, "0");
    const dd = String(now.getDate()).padStart(2, "0");
    const hh = String(now.getHours()).padStart(2, "0");
    const mm = String(now.getMinutes()).padStart(2, "0");

    return `${prefix}_${yyyy}${MM}${dd}_${hh}${mm}.xlsx`;
}
function buildPrintHtml(lstDataKSCS) {
    let html = "";

    lstDataKSCS.forEach((group, index) => {
        html += `
            <table style="width:100%; margin-bottom:20px">
                <tr>
                    <td colspan="6"><b>${group.TEN_KHANG} - ${group.MA_KHANG}</b></td>
                </tr>
                <tr>
                    <th>STT</th>
                    <th>Số công tơ</th>
                    <th>CS cũ</th>
                    <th>CS mới</th>
                    <th>SL</th>
                    <th>Ghi chú</th>
                </tr>
        `;

        group.groupItem.forEach((item, i) => {
            html += `
                <tr>
                    <td>${i + 1}</td>
                    <td>${item.SERY_CTO || ""}</td>
                    <td>${item.CS_CU || ""}</td>
                    <td>${item.CS_MOI || ""}</td>
                    <td>${item.SL_MOI || ""}</td>
                    <td>${item.GHICHU || ""}</td>
                </tr>
            `;
        });

        html += `</table>`;
    });

    return html;
}
function f_printChiSo() {

    if (!lstData || lstData.length === 0) {
        toastr.error("Chưa có dữ liệu để in");
        return;
    }
    var tenso = lstData[0].MA_QUYEN;
    // 🔥 Gom nhóm
    const lstDataKSCS = [];

    lstData.forEach(function (item) {
        const existed = lstDataKSCS.some(x => x.MA_DDO == item.MA_DDO);

        if (!existed) {
            lstDataKSCS.push({
                MA_DDO: item.MA_DDO,
                TEN_KHANG: item.TEN_KHANG,
                SERY_CTO: item.SERY_CTO,
                MA_KHANG: item.MA_KHANG,
                DIA_CHI: item.DIA_CHI,
                groupItem: lstData.filter(v => v.MA_DDO == item.MA_DDO)
            });
        }
    });

    // 🔥 build HTML
    const printContents = buildPrintHtml(lstDataKSCS);

    const today = new Date();

    const popupWin = window.open("", "_blank", "width=1000,height=800");

    popupWin.document.open();
    popupWin.document.write(`
        <html>
            <head>
                <title>KIỂM SOÁT CHỈ SỐ</title>
                <style>
                    table { border-collapse: collapse; width:100% }
                    table, th, td { border: 1px solid black; }
                    th, td { padding: 5px; font-size: 12px }
                    h2 { text-align: center; }
                </style>
            </head>
            <body onload="window.print();window.close()">
                <h2>KIỂM SOÁT CHỈ SỐ</h2>
                <div style="margin-bottom:10px;text-align:right">
                  <h3>Sổ: ${tenso} -   Ngày: ${formatDateOnly(today)}
                </div>

                ${printContents}
            </body>
        </html>
    `);

    popupWin.document.close();
}

function formatDateOnly(date) {
    const d = String(date.getDate()).padStart(2, "0");
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const y = date.getFullYear();

    return `${d}/${m}/${y}`;
}