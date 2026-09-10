var getThang = "";

$(document).ready(function () {
    if (!localStorage.getItem("us")) {
        window.location.href = "../login";
        return;
    }

    $(".thang").hide();

    initDatePickerDefault();
    getHour();

    if (!$("#txtngay_csct").val()) {
        $("#txtngay_csct").val(getDateTimeCurrent());
    }
    if (!$("#txttungay_tsvh_scada").val()) {
        $("#txttungay_tsvh_scada").val(getDateTimeCurrent());
    }
    if (!$("#txtdenngay_tsvh_scada").val()) {
        $("#txtdenngay_tsvh_scada").val(getDateTimeCurrent());
    }

    const reloadCsct = () => {
        const selectedDate = $("#txtngay_csct").val();
        const selectedHour = $("#cbogio_csct").val();

        Load_Table_Header();
        clearTableCsct();

        // nếu các hàm trên có render lại DOM thì set lại giá trị
        $("#txtngay_csct").val(selectedDate);
        $("#cbogio_csct").val(selectedHour);

        loadChiSo();
    };

    $("#slloaichiso_csct").off("change").on("change", function () {
        handleLoaiChiSoChange();
        reloadCsct();
    });

    $("#slnhompha_csct").off("change").on("change", function () {
        const isOnePhase = $(this).val() === "1";
        $(".phacongto").toggle(isOnePhase);
        if (!isOnePhase) $("#cbophacongto_csct").val("-1");
        reloadCsct();
    });

    $("#sllocdulieu_csct, #txtngay_csct, #cbogio_csct")
        .off("change")
        .on("change", reloadCsct);

    $("#btnthuchien_csct").off("click").on("click", loadChiSo);
    $("#btnExportExcelCsct").off("click").on("click", function () {
        exportCsctToExcel();
    });
    handleSidebarNode();
});

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

function handleLoaiChiSoChange() {
    if ($("#slloaichiso_csct").val() == "4") {
        $(".ngay").hide();
        $(".thang").show();

        const now = new Date();
        const currentMonth = String(now.getMonth() + 1).padStart(2, "0");
        const currentYear = now.getFullYear();
        const defaultThang = currentMonth + "/" + currentYear;

        getThang = "01/" + defaultThang;
        $("#txtthang_csct").val(defaultThang);

        try {
            const oldPicker = $("#txtthang_csct").pickadate("picker");
            if (oldPicker) oldPicker.stop();
        } catch (e) { }

        $("#txtthang_csct").pickadate({
            monthPrev: "&larr;",
            monthNext: "&rarr;",
            today: "Hôm nay",
            clear: "Xóa",
            close: "Đóng",
            format: "mm/yyyy",
            formatSubmit: "mm/yyyy",
            selectYears: true,
            selectMonths: true,
            monthsFull: [
                "Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6",
                "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"
            ],
            monthsShort: [
                "Th 1", "Th 2", "Th 3", "Th 4", "Th 5", "Th 6",
                "Th 7", "Th 8", "Th 9", "Th 10", "Th 11", "Th 12"
            ],
            min: new Date(1900, 0, 1),
            max: new Date(2100, 11, 31),
            onOpen: function () {
                this.$root.find(".picker__day").remove();
            },
            onSet: function () {
                const selectedYear = this.get("select", "yyyy");
                const selectedMonth = this.get("select", "mm");

                if (selectedYear && selectedMonth) {
                    const formattedDate = selectedMonth + "/" + selectedYear;
                    getThang = "01/" + formattedDate;
                    $("#txtthang_csct").val(formattedDate);
                    this.close();
                }
            }
        });
    } else {
        $(".ngay").show();
        $(".thang").hide();
        initDatePickerDefault();
        // $("#txtngay_csct").val(getDateTimeCurrent());
    }
}

function handleSidebarNode() {
    var node = JSON.parse(localStorage.getItem("node"));
    if (!node) return;

    let loaithumuc = node.type;
    let isCambien = node.isCambien;
    let id_thietbi = node.id_thietbi;

    if (isCambien == 1 || isCambien == undefined) {
        hideThongBao("#thongbao_csct");
        $("#box_chisocongto").show();
        $("#box_scada").hide();
        $("#txtthang_csct").val(gettimenow_cscthang());

        if (loaithumuc == 9) {
            let Meterid = node.id;
            let tenkhachhang = node.tendanhmuc;
            let loaipha = node.loaipha;

            f_XemChiTiet_csct(Meterid, tenkhachhang, loaipha);
            $("#modal_giamsat").modal("show");
        } else {
            Load_Table_Header();
            loadChiSo();
            $("#modal_giamsat").modal("hide");
        }
    } else {
        $("#box_chisocongto").hide();
        $("#box_scada").show();

        if (loaithumuc == 9) {
            hideThongBao("#thongbao_csct");
            $(".point_name_on_page").html(
                `<i class="flaticon-050-info"></i>${node.tendanhmuc}`
            );
            getTSVHScada(id_thietbi);
        } else {
            showThongBao("Vui lòng chọn thiết bị ở cây thư mục", "#thongbao_csct");
            $("#box_chisocongto").hide();
            $("#box_scada").hide();
        }
    }
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

function getHour() {
    var data = getListTime();
    $("#cbogio_csct").empty();
    $("#cbogio_csct").append(`<option value="-1">Tất cả</option>`);

    $.each(data, function (index, item) {
        $("#cbogio_csct").append(`<option value="${item.value}">${item.value}</option>`);
    });
}

function getDateTimeCurrent() {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    const day = currentDate.getDate();
    return `${String(day).padStart(2, "0")}/${String(month).padStart(2, "0")}/${year} `;
}

function clearTableCsct() {
    if ($.fn.DataTable.isDataTable("#tbl_csct")) {
        $("#tbl_csct").DataTable().clear().destroy();
    }
    $("#tbl_csct tbody").html("");
}

function getLeafHeaderCount() {
    const $thead = $("#tbl_csct thead");
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

function validateTableStructure() {
    const headerCols = getLeafHeaderCount();
    const $firstRow = $("#tbl_csct tbody tr:first");

    if (!$firstRow.length) return true;

    const bodyCols = $firstRow.children("td").length;

    if (headerCols !== bodyCols) {
        console.error("Lệch cột DataTable", {
            headerCols: headerCols,
            bodyCols: bodyCols,
            thead: $("#tbl_csct thead").html(),
            firstRow: $firstRow.html()
        });
        return false;
    }

    return true;
}

function Load_Table_Header() {
    clearTableCsct();
    $("#tbl_csct thead").html("");

    const loaichiso = $("#slloaichiso_csct").val();
    const nhompha = $("#slnhompha_csct").val();
    const locdulieu = $("#sllocdulieu_csct").val();

    let str = "";

    if (locdulieu == "0") {
        if (nhompha == "1") {
            str += `
                <tr>
                    <th rowspan="2">Nhóm</th>
                    <th rowspan="2">STT</th>
                   ${loaichiso == "4" ? `<th rowspan="2">Thời gian chốt</th>` : `<th rowspan="2">Thời điểm</th>`}
                    <th rowspan="2" style="display:none">Mã điểm đo</th>
                    <th rowspan="2" style="display:none">Tên khách hàng</th>
                    <th rowspan="2" style="display:none">Số công tơ</th>
                    <th rowspan="2" style="display:none">Loại công tơ</th>

                    <th colspan="4">P giao (kWh)</th>
                    <th colspan="4">P nhận (kWh)</th>
                    <th colspan="4">Q giao (kVarh)</th>
                    <th colspan="4">Q nhận (kVarh)</th>
                    ${loaichiso == "2" ? `
                        <th colspan="4">S giao tổng (kWh)</th>
                        <th colspan="4">S nhận tổng (kWh)</th>
                    ` : ""}
                  
                </tr>
                <tr>
                    <th>KT/SG</th><th>BT</th><th>CD</th><th>TD</th>
                    <th>KT/SN</th><th>BN</th><th>CN</th><th>TN</th>
                    <th>Biểu Tổng</th><th>Biểu 1</th><th>Biểu 2</th><th>Biểu 3</th>
                    <th>Biểu Tổng</th><th>Biểu 1</th><th>Biểu 2</th><th>Biểu 3</th>
                    ${loaichiso == "2" ? `
                        <th>Biểu Tổng</th><th>Biểu 1</th><th>Biểu 2</th><th>Biểu 3</th>
                        <th>Biểu Tổng</th><th>Biểu 1</th><th>Biểu 2</th><th>Biểu 3</th>
                    ` : ""}
                </tr>
            `;
        } else {
            str += `
                <tr>
                    <th rowspan="2">Nhóm</th>
                    <th rowspan="2">STT</th>
                     ${loaichiso == "4" ? `<th rowspan="2">Thời điểm</th>` : `<th rowspan="2">Thời gian chốt</th>`}
                    <th rowspan="2" style="display:none">Mã điểm đo</th>
                    <th rowspan="2" style="display:none">Tên khách hàng</th>
                    <th rowspan="2" style="display:none">Số công tơ</th>
                    <th rowspan="2" style="display:none">Loại công tơ</th>

                    <th colspan="7">P giao (kWh)</th>
                    <th colspan="7">P nhận (kWh)</th>
                    <th colspan="4">Q giao (kVarh)</th>
                    <th colspan="4">Q nhận (kVarh)</th>
                    ${loaichiso == "2" ? `
                        <th colspan="4">S giao tổng (kWh)</th>
                        <th colspan="4">S nhận tổng (kWh)</th>
                    ` : ""}
                 
                </tr>
                <tr>
                    <th>BT</th><th>CD</th><th>TD</th><th>SG</th><th>Pha A</th><th>Pha B</th><th>Pha C</th>
                    <th>BN</th><th>CN</th><th>TN</th><th>SN</th><th>Pha A</th><th>Pha B</th><th>Pha C</th>
                    <th>VC</th><th>Pha A</th><th>Pha B</th><th>Pha C</th>
                    <th>VN</th><th>Pha A</th><th>Pha B</th><th>Pha C</th>
                    ${loaichiso == "2" ? `
                        <th>Biểu Tổng</th><th>Biểu 1</th><th>Biểu 2</th><th>Biểu 3</th>
                        <th>Biểu Tổng</th><th>Biểu 1</th><th>Biểu 2</th><th>Biểu 3</th>
                    ` : ""}
                </tr>
            `;
        }
    } else {
        str += `
            <tr>
                <th>Nhóm</th>
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

    $("#tbl_csct thead").append(str);
}

function loadChiSo() {
    var node = JSON.parse(localStorage.getItem("node"));
    if (!node) return;

    let loaithumuc = node.type;
    let danhmucid = node.id;
    let tree = node.tree;

    if (danhmucid == null || danhmucid == undefined || tree == 2 || loaithumuc == 9) {
        toastr.error("Vui lòng chọn danh mục", "Thông báo", {
            positionClass: "toast-bottom-right",
            timeOut: 5000,
            closeButton: true,
            debug: false,
            newestOnTop: true,
            progressBar: true,
            preventDuplicates: true,
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

    Load_Table_Header();

    var locdulieu = $("#sllocdulieu_csct").val();
    var loaihienthi = "TG";
    var nhompha = $("#slnhompha_csct").val();
    var loaichiso = $("#slloaichiso_csct").val();
    var ngay = loaichiso == "4" ? getThang : $("#txtngay_csct").val();
    var phacongto = "-1";// $("#cbophacongto_csct").val();

    var ChiSoParameter = {
        v_danhmucid: danhmucid,
        v_locdulieu: parseInt(locdulieu, 10),
        v_loaihienthi: loaihienthi,
        v_ngay: ngay,
        v_gio: $("#cbogio_csct").val(),
        v_loaipha: parseInt(nhompha, 10),
        v_sotrang: 0,
        v_sodong: 100000,
        v_mataikhoan: 1,
        v_loaichiso: loaichiso,
        v_phacongto: phacongto
    };

    $.ajax({
        url: "/api/khaithacdulieu_laychisocongto",
        data: JSON.stringify(ChiSoParameter),
        type: "POST",
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: function (result) {
            drawData(result);
        },
        complete: function (xhr) {
            if (xhr.status == "401") {
                window.location.href = "/Login/Logout";
            } else if (xhr.status == "400") {
                toastr.error(xhr.responseJSON.message, "Thông báo", {
                    positionClass: "toast-bottom-right",
                    timeOut: 5000,
                    closeButton: true,
                    debug: false,
                    newestOnTop: true,
                    progressBar: true,
                    preventDuplicates: true,
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
        }
    });
}

function drawData(data) {
    clearTableCsct();

    let str1 = "";
    let stt = 0;
    const locdulieu = $("#sllocdulieu_csct").val();
    const nhompha = $("#slnhompha_csct").val();
    const loaichiso = $("#slloaichiso_csct").val();

    $.each(data, function (k, v) {
        stt += 1;

        var loaicongto_NOT_PSM = "";
        if (v.loaicongto != null) {
            loaicongto_NOT_PSM = v.loaicongto.substring(3, v.loaicongto.length);
        } else {
            loaicongto_NOT_PSM = v.loaicongto;
        }

        const groupText =
            `Mã điểm đo: ${retNull(v.madiemdo)} - ` +
            `Số công tơ: ${retNull(v.socongto)} - ` +
            `Tên khách hàng: ${retNull(v.tenkhachhang)} - ` +
            `Loại công tơ: ${retNull(v.loaicongto)} - ` +
            `TU: ${retNull(v.tu)} - TI: ${retNull(v.ti)} - HSN: ${retNull(v.hsn)}`;

        if (locdulieu == "0") {
            if (nhompha == "1") {
                str1 += "<tr>";
                str1 += `<td style="font-weight:bold"><a href="#" data-bs-toggle="modal" data-bs-target="#modal_giamsat" onClick="f_XemChiTiet_csct(${v.meterid},'${v.tenkhachhang}' ,'${v.loaipha}','${v.tu}','${v.ti}','${v.hsn}')">${groupText}</a></td>`;
                str1 += `<td style="text-align:center;vertical-align:middle;font-weight:bold">${stt}</td>`;
                if (loaichiso == "2") {
                    str1 += `<td class="text-center">
                                <span class="text-xanh">HT: ${retNull(v.time)}</span><br>
                                <span class="text-do">CT: ${retNull(v.timemeter)}</span>
                            </td>`;
                } else {
                    str1 += `<td class="text-center fw-bold">${retNull(v.time)}</td>`;
                }
                str1 += `<td style="display:none">${retNull(v.madiemdo)}</td>`;
                str1 += `<td style="display:none">${retNull(v.tenkhachhang)}</td>`;
                str1 += `<td style="display:none">${retNull(v.socongto)}</td>`;
                str1 += `<td style="display:none">${retNull(loaicongto_NOT_PSM)}</td>`;
                str1 += `<td class="text-right">${retNull(v.pgiaotong)}</td>`;
                str1 += `<td class="text-right">${retNull(v.pgiao1)}</td>`;
                str1 += `<td class="text-right">${retNull(v.pgiao2)}</td>`;
                str1 += `<td class="text-right">${retNull(v.pgiao3)}</td>`;
                str1 += `<td class="text-right">${retNull(v.pnhantong)}</td>`;
                str1 += `<td class="text-right">${retNull(v.pnhan1)}</td>`;
                str1 += `<td class="text-right">${retNull(v.pnhan2)}</td>`;
                str1 += `<td class="text-right">${retNull(v.pnhan3)}</td>`;
                str1 += `<td class="text-right">${retNull(v.qgiaotong)}</td>`;
                str1 += `<td class="text-right">${retNull(v.qgiao1)}</td>`;
                str1 += `<td class="text-right">${retNull(v.qgiao2)}</td>`;
                str1 += `<td class="text-right">${retNull(v.qgiao3)}</td>`;
                str1 += `<td class="text-right">${retNull(v.qnhantong)}</td>`;
                str1 += `<td class="text-right">${retNull(v.qnhan1)}</td>`;
                str1 += `<td class="text-right">${retNull(v.qnhan2)}</td>`;
                str1 += `<td class="text-right">${retNull(v.qnhan3)}</td>`;

                if (loaichiso == "2") {
                    str1 += `<td class="text-right">${retNull(v.sgiaotong)}</td>`;
                    str1 += `<td class="text-right">${retNull(v.sgiao1)}</td>`;
                    str1 += `<td class="text-right">${retNull(v.sgiao2)}</td>`;
                    str1 += `<td class="text-right">${retNull(v.sgiao3)}</td>`;
                    str1 += `<td class="text-right">${retNull(v.snhantong)}</td>`;
                    str1 += `<td class="text-right">${retNull(v.snhan1)}</td>`;
                    str1 += `<td class="text-right">${retNull(v.snhan2)}</td>`;
                    str1 += `<td class="text-right">${retNull(v.snhan3)}</td>`;
                }

                str1 += "</tr>";
            } else {
                str1 += "<tr>";
                str1 += `<td style="font-weight:bold"><a href="#" data-bs-toggle="modal" data-bs-target="#modal_giamsat" onClick="f_XemChiTiet_csct(${v.meterid},'${v.tenkhachhang}' ,'${v.loaipha}','${v.tu}','${v.ti}','${v.hsn}')">${groupText}</a></td>`;
                str1 += `<td style="text-align:center;vertical-align:middle;font-weight:bold">${stt}</td>`;
                if (loaichiso == "2") {
                    str1 += `<td class="text-center">
                                <span class="text-xanh">HT: ${retNull(v.time)}</span><br>
                                <span class="text-do">CT: ${retNull(v.timemeter)}</span>
                            </td>`;
                } else {
                    str1 += `<td class="text-center fw-bold">${retNull(v.time)}</td>`;
                }
                str1 += `<td style="display:none">${retNull(v.madiemdo)}</td>`;
                str1 += `<td style="display:none">${retNull(v.tenkhachhang)}</td>`;
                str1 += `<td style="display:none">${retNull(v.socongto)}</td>`;
                str1 += `<td style="display:none">${retNull(loaicongto_NOT_PSM)}</td>`;
                str1 += `<td class="text-right">${retNull(v.pgiao1)}</td>`;
                str1 += `<td class="text-right">${retNull(v.pgiao2)}</td>`;
                str1 += `<td class="text-right">${retNull(v.pgiao3)}</td>`;
                str1 += `<td class="text-right">${retNull(v.pgiaotong)}</td>`;
                str1 += `<td class="text-right">${retNull(v.pgiaoa)}</td>`;
                str1 += `<td class="text-right">${retNull(v.pgiaob)}</td>`;
                str1 += `<td class="text-right">${retNull(v.pgiaoc)}</td>`;
                str1 += `<td class="text-right">${retNull(v.pnhan1)}</td>`;
                str1 += `<td class="text-right">${retNull(v.pnhan2)}</td>`;
                str1 += `<td class="text-right">${retNull(v.pnhan3)}</td>`;
                str1 += `<td class="text-right">${retNull(v.pnhantong)}</td>`;
                str1 += `<td class="text-right">${retNull(v.pnhana)}</td>`;
                str1 += `<td class="text-right">${retNull(v.pnhanb)}</td>`;
                str1 += `<td class="text-right">${retNull(v.pnhanc)}</td>`;
                str1 += `<td class="text-right">${retNull(v.qgiaotong)}</td>`;
                str1 += `<td class="text-right">${retNull(v.qgiaoa)}</td>`;
                str1 += `<td class="text-right">${retNull(v.qgiaob)}</td>`;
                str1 += `<td class="text-right">${retNull(v.qgiaoc)}</td>`;
                str1 += `<td class="text-right">${retNull(v.qnhantong)}</td>`;
                str1 += `<td class="text-right">${retNull(v.qnhana)}</td>`;
                str1 += `<td class="text-right">${retNull(v.qnhanb)}</td>`;
                str1 += `<td class="text-right">${retNull(v.qnhanc)}</td>`;

                if (loaichiso == "2") {
                    str1 += `<td class="text-right">${retNull(v.sgiaotong)}</td>`;
                    str1 += `<td class="text-right">${retNull(v.sgiao1)}</td>`;
                    str1 += `<td class="text-right">${retNull(v.sgiao2)}</td>`;
                    str1 += `<td class="text-right">${retNull(v.sgiao3)}</td>`;
                    str1 += `<td class="text-right">${retNull(v.snhantong)}</td>`;
                    str1 += `<td class="text-right">${retNull(v.snhan1)}</td>`;
                    str1 += `<td class="text-right">${retNull(v.snhan2)}</td>`;
                    str1 += `<td class="text-right">${retNull(v.snhan3)}</td>`;
                }


                str1 += "</tr>";
            }
        } else {
            str1 += "<tr>";
            str1 += `<td style="font-weight:bold">${retNull(v.madiemdo)} - ${retNull(v.tenkhachhang)}</td>`;
            str1 += `<td>${stt}</td>`;
            str1 += `<td style="display:none">${retNull(v.madiemdo)}</td>`;
            str1 += `<td style="display:none">${retNull(v.tenkhachhang)}</td>`;
            str1 += `<td>${retNull(v.socongto)}</td>`;
            str1 += `<td>${retNull(loaicongto_NOT_PSM)}</td>`;
            str1 += `<td>${retNull(v.imei)}</td>`;
            str1 += `<td>${retNull(v.macot)}</td>`;
            str1 += `<td>${retNull(v.matram)}</td>`;
            str1 += "</tr>";
        }
    });

    $("#tbl_csct tbody").html(str1);

    if (!validateTableStructure()) {
        toastr.error("Cấu trúc bảng không khớp giữa header và dữ liệu", "Thông báo");
        return;
    }

    if (nhompha == "3") {
        if (locdulieu == "0") {
            initCsctDataTableThreePhase();
        } else {
            initCsctDataTableBasic();
        }
    } else {
        if (locdulieu == "0") {
            initCsctDataTableOnePhase();
        } else {
            initCsctDataTableBasic();
        }
    }
}

function buildDataTableBaseConfig() {
    return {
        destroy: true,
        dom: "frtip",
        scrollX: true,
        scrollCollapse: true,
        paging: true,
        pageLength: 20,
        lengthMenu: [10, 20, 50, 100, 200],
        searching: true,
        ordering: false,
        info: true,
        autoWidth: false,
        buttons: [
            {
                extend: "excel",
                title: "Chỉ số công tơ",
                exportOptions: {
                    columns: ":visible"
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
            $("#tbl_csct th").css({
                "text-align": "center",
                "vertical-align": "middle",
                "white-space": "nowrap"
            });
        }
    };
}

function buildRowGroupConfig(tableSelector) {
    return {
        dataSrc: 0,
        startRender: function (rows, group) {
            const table = $(tableSelector).DataTable();
            const visibleCols = table.columns(":visible").count();

            return $('<tr class="dt-group-row"/>').append(
                `<td colspan="${visibleCols}" style="font-weight:700;background:#e8ecf1;color:#212529;">${group}</td>`
            );
        }
    };
}

function initCsctDataTableOnePhase() {
    const config = buildDataTableBaseConfig();

    config.rowGroup = buildRowGroupConfig("#tbl_csct");
    config.order = [[0, "asc"], [1, "asc"]];
    config.columnDefs = [
        { visible: false, targets: [0, 3, 4, 5] },
        { targets: "_all", className: "align-middle nowrap" }
    ];

    const table = $("#tbl_csct").DataTable(config);
    table.columns.adjust().draw();
}

function initCsctDataTableThreePhase() {
    const config = buildDataTableBaseConfig();
    config.pageLength = 100;

    config.rowGroup = buildRowGroupConfig("#tbl_csct");
    config.order = [[0, "asc"], [1, "asc"]];
    config.columnDefs = [
        { visible: false, targets: [0, 2, 3, 4, 5] },
        { targets: "_all", className: "align-middle" }
    ];

    const table = $("#tbl_csct").DataTable(config);
    table.columns.adjust().draw();
}

function initCsctDataTableBasic() {
    const config = buildDataTableBaseConfig();
    config.pageLength = 100;

    config.rowGroup = buildRowGroupConfig("#tbl_csct");
    config.order = [[0, "asc"], [1, "asc"]];
    config.columnDefs = [
        { visible: false, targets: [0, 2, 3] },
        { targets: "_all", className: "align-middle" }
    ];

    const table = $("#tbl_csct").DataTable(config);
    table.columns.adjust().draw();
}

function retNull(number) {
    if (number == null || number == undefined || number === "") {
        return "-";
    }
    return number;
}

function safeAttr(value) {
    if (value == null || value == undefined) return "";
    return String(value)
        .replace(/'/g, "\\'")
        .replace(/"/g, "&quot;");
}
async function exportCsctToExcel() {
    const $table = $("#tbl_csct");

    if (!$table.length) {
        toastr.error("Không tìm thấy bảng dữ liệu", "Thông báo");
        return;
    }

    if (typeof XLSX === "undefined") {
        toastr.error("Chưa load thư viện XLSX", "Thông báo");
        return;
    }

    if (!$.fn.DataTable.isDataTable("#tbl_csct")) {
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

        console.log("[CSCT EXPORT DOM DEBUG]", debugInfo);

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

        XLSX.utils.book_append_sheet(wb, ws, "ChiSoCongTo");

        await sleep(30);

        XLSX.writeFile(wb, buildExportFileName("ChiSoCongTo"));
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