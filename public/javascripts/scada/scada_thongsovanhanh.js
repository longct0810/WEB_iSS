let ID_THIETBI_SCADA = null;
let dtChiTietCambien = null;
let ALERT_HISTORY_MAP = {};
let SCADA_LOTONG_AI_ROWS = [];
$(document).ready(function () {
   if (!localStorage.getItem("us")) {
        window.location.href = "../login";
        return;
    }
      initDatePickerDefault();
    $("#txttungay_tsvh_scada").val(getDateTimeCurrent());
    $("#txtdenngay_tsvh_scada").val(getDateTimeCurrent());

    $("#btnthuchien_tsvh_scada").off("click").on("click", function () {
        if (!ID_THIETBI_SCADA) return;
        getTSVHScada(ID_THIETBI_SCADA);
    });
    var danhmucid = localStorage.getItem("code_nhamay");
    getThietBi(danhmucid);

    window.addEventListener("nhamay:changed", function (e) {
        const child_code = e.detail.child_code;
        getThietBi(child_code);
    });

    $("#cbo_thietbi").off("change").on("change", function () {
        const selectedId = $(this).val();
        if (selectedId) {
            ID_THIETBI_SCADA = parseInt(selectedId);
            getTSVHScada(ID_THIETBI_SCADA);
        } else {
            ID_THIETBI_SCADA = null;
            $("#scada_tabs").html("");
            $("#scada_tab_content").html(
                `<div class="alert alert-danger mb-0">Vui lòng chọn thiết bị</div>`
            );

        }
    })
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

function getDateTimeCurrent() {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    const day = currentDate.getDate();
    return `${String(day).padStart(2, "0")}/${String(month).padStart(2, "0")}/${year} `;
}
const TSVH_GROUPS = [
    { id: "scada_lotong", label: "Lộ tổng", type: "LOTONG", from: 0, to: 42, layout: "full" },
    { id: "scada_nhanh1", label: "Nhánh 1", type: "NHANH1", from: 100, to: 142, layout: "full" },
    { id: "scada_nhanh2", label: "Nhánh 2", type: "NHANH2", from: 200, to: 242, layout: "full" },
    { id: "scada_nhanh3", label: "Nhánh 3", type: "NHANH3", from: 300, to: 342, layout: "full" },
    { id: "scada_nhanh4", label: "Nhánh 4", type: "NHANH4", from: 400, to: 442, layout: "full" },
    { id: "scada_nhanh5", label: "Nhánh 5", type: "NHANH5", from: 500, to: 542, layout: "full" },
    { id: "scada_nhanh6", label: "Nhánh 6", type: "NHANH6", from: 600, to: 642, layout: "full" },
    { id: "scada_nhanh7", label: "Nhánh 7", type: "NHANH7", from: 700, to: 742, layout: "full" },
    { id: "scada_nhanh8", label: "Nhánh 8", type: "NHANH8", from: 800, to: 842, layout: "full" },

    { id: "scada_mccb1", label: "MCCB 1", type: "MCCB_1", from: 3, to: 17, layout: "generic" },
    { id: "scada_mccb2", label: "MCCB 2", type: "MCCB_2", from: 43, to: 57, layout: "generic" },
    { id: "scada_mccb3", label: "MCCB 3", type: "MCCB_3", from: 83, to: 97, layout: "generic" },
    { id: "scada_mccb4", label: "MCCB 4", type: "MCCB_4", from: 123, to: 137, layout: "generic" },
    { id: "scada_mccb5", label: "MCCB 5", type: "MCCB_5", from: 163, to: 177, layout: "generic" },
    { id: "scada_mccb6", label: "MCCB 6", type: "MCCB_6", from: 204, to: 217, layout: "generic" },
    { id: "scada_mccb7", label: "MCCB 7", type: "MCCB_7", from: 243, to: 257, layout: "generic" },
    { id: "scada_mccb8", label: "MCCB 8", type: "MCCB_8", from: 283, to: 297, layout: "generic" },
    { id: "scada_mccb9", label: "MCCB 9", type: "MCCB_9", from: 323, to: 337, layout: "generic" },
    { id: "scada_mccb10", label: "MCCB 10", type: "MCCB_10", from: 363, to: 377, layout: "generic" },
    { id: "scada_mccb11", label: "MCCB 11", type: "MCCB_11", from: 403, to: 417, layout: "generic" },
    { id: "scada_mccb12", label: "MCCB 12", type: "MCCB_12", from: 443, to: 457, layout: "generic" },
    { id: "scada_mccb13", label: "MCCB 13", type: "MCCB_13", from: 483, to: 497, layout: "generic" },
    { id: "scada_mccb14", label: "MCCB 14", type: "MCCB_14", from: 523, to: 537, layout: "generic" },
    { id: "scada_mccb15", label: "MCCB 15", type: "MCCB_15", from: 563, to: 577, layout: "generic" },
    { id: "scada_mccb16", label: "MCCB 16", type: "MCCB_16", from: 603, to: 617, layout: "generic" },
    { id: "scada_mccb17", label: "MCCB 17", type: "MCCB_17", from: 643, to: 657, layout: "generic" },
    { id: "scada_mccb18", label: "MCCB 18", type: "MCCB_18", from: 683, to: 697, layout: "generic" },
    { id: "scada_mccb19", label: "MCCB 19", type: "MCCB_19", from: 723, to: 737, layout: "generic" },
    { id: "scada_mccb20", label: "MCCB 20", type: "MCCB_20", from: 763, to: 777, layout: "generic" },
    { id: "scada_mccb21", label: "MCCB 21", type: "MCCB_21", from: 843, to: 857, layout: "generic" },
    { id: "scada_mccb22", label: "MCCB 22", type: "MCCB_22", from: 883, to: 897, layout: "generic" },
    { id: "scada_sma", label: "SMA", type: "SMA", from: 1, to: 12, layout: "customer" },
    { id: "scada_dongho_giamsat", label: "Đồng hồ giám sát", type: "DONGHO_GIAMSAT", from: 4000, to: 4507, layout: "dongho" }
];
function getIoaMapDongHoGiamSat() {
    return {
        IA: 4000,
        IB: 4001,
        IC: 4002,
        IN: 4003,

        UAB: 4100,
        UBC: 4101,
        UCA: 4102,
        ULLAVG: 4103,

        UA: 4104,
        UB: 4105,
        UC: 4106,
        UNAVG: 4107,

        PA: 4200,
        PB: 4201,
        PC: 4202,
        PTOTAL: 4203,

        QA: 4204,
        QB: 4205,
        QC: 4206,
        QTOTAL: 4207,

        SA: 4208,
        SB: 4209,
        SC: 4210,
        STOTAL: 4211,

        COSA: 4280,
        COSB: 4281,
        COSC: 4282,
        COSTOTAL: 4283,

        FREQ: 4300,

        THD_IA: 4400,
        THD_IB: 4401,
        THD_IC: 4402,
        THD_IN: 4403,

        THD_UAB: 4500,
        THD_UBC: 4501,
        THD_UCA: 4502,
        THD_ULLAVG: 4503,

        THD_UA: 4504,
        THD_UB: 4505,
        THD_UC: 4506,
        THD_UNAVG: 4507
    };
}
function safeJsonParse(str) {
    try {
        return typeof str === "string" ? JSON.parse(str) : str;
    } catch (e) {
        return null;
    }
}

function toNumber(val) {
    if (val === null || val === undefined || val === "") return null;
    const num = Number(val);
    return Number.isFinite(num) ? num : null;
}

function formatNumber(val, digits = 2) {
    if (val === null || val === undefined || Number.isNaN(Number(val))) return "-";
    return Number(val).toFixed(digits).replace(/\.00$/, "");
}

function getItemType(item) {
    const row = safeJsonParse(item.tsvh) || item;
    return String(row?.type ?? item?.type ?? "").trim();
}

function getItemIoa(item) {
    const row = safeJsonParse(item.tsvh) || item;
    return Number(row?.ioa_diachi ?? item?.ioa_diachi);
}

function filterRawDataByGroup(rawData, group) {
    return (rawData || []).filter(item => {
        const ioa = getItemIoa(item);
        const type = (getItemType(item) || "").toUpperCase();

        const isCustomerType = !type || type === "SMA" || type === "INVENTER";

        return Number.isFinite(ioa)
            && ioa >= Number(group.from)
            && ioa <= Number(group.to)
            && (
                group.layout === "customer"
                    ? isCustomerType
                    : (!group.type || type === group.type)
            );
    });
}

function getIoaMapTSVH(base = 0) {
    const start = Number(base);
    if (!Number.isFinite(start)) return {};
    return {
        Ua: start + 0, Ub: start + 1, Uc: start + 2,
        Uab: start + 3, Ubc: start + 4, Uca: start + 5,
        F: start + 6,
        Ia: start + 7, Ib: start + 8, Ic: start + 9, Io: start + 10,
        Pa: start + 11, Pb: start + 12, Pc: start + 13, P: start + 14,
        Qa: start + 15, Qb: start + 16, Qc: start + 17, Q: start + 18,
        Sa: start + 19, Sb: start + 20, Sc: start + 21, S: start + 22,
        CosA: start + 23, CosB: start + 24, CosC: start + 25, Cos: start + 26
    };
}

function getIoaMapCSCT(base = 0) {
    const start = Number(base);
    if (!Number.isFinite(start)) return {};
    return {
        PgiaoA: start + 27, PgiaoB: start + 28, PgiaoC: start + 29, PgiaoTong: start + 30,
        PnhanA: start + 31, PnhanB: start + 32, PnhanC: start + 33, PnhanTong: start + 34,
        QgiaoA: start + 35, QgiaoB: start + 36, QgiaoC: start + 37, QgiaoTong: start + 38,
        QnhanA: start + 39, QnhanB: start + 40, QnhanC: start + 41, QnhanTong: start + 42
    };
}

function getIoaMapTSVHGeneric(base = 0) {
    const start = Number(base);
    if (!Number.isFinite(start)) return {};
    return {
        Ua: start + 0, Ub: start + 1, Uc: start + 2,
        Ia: start + 3, Ib: start + 4, Ic: start + 5,
        P: start + 6,
        CosA: start + 7, CosB: start + 8, CosC: start + 9, Cos: start + 10
    };
}

function getIoaMapCSCTGeneric(base = 0) {
    const start = Number(base);
    if (!Number.isFinite(start)) return {};
    return {
        PgiaoTong: start + 11,
        PnhanTong: start + 12,
        QgiaoTong: start + 13,
        QnhanTong: start + 14
    };
}

function extractGroupData(rawData, base, ioaMapBuilder) {
    const ioaMap = ioaMapBuilder(base);
    const reverseMap = Object.fromEntries(Object.entries(ioaMap).map(([k, v]) => [v, k]));
    const result = {};

    rawData.forEach(item => {
        const row = safeJsonParse(item.tsvh) || item;
        if (!row) return;

        const ioa = Number(row.ioa_diachi ?? item.ioa_diachi);
        if (!Number.isFinite(ioa)) return;

        const key = reverseMap[ioa];
        if (!key) return;

        const value = row.value ?? item.value;
        const time = row.max_time ?? item.max_time ?? row.time ?? item.time ?? "";
        if (!time) return;

        if (!result[time]) result[time] = { time };
        result[time][key] = toNumber(value);
    });

    return result;
}

function buildRowTSVH(groupedData) {
    return Object.keys(groupedData).map((time, index) => {
        const g = groupedData[time];
        return {
            stt: index + 1,
            thoidiem: g.time || "-",
            Ua: g.Ua, Ub: g.Ub, Uc: g.Uc, Uab: g.Uab, Ubc: g.Ubc, Uca: g.Uca,
            Ia: g.Ia, Ib: g.Ib, Ic: g.Ic, Io: g.Io,
            CosA: g.CosA, CosB: g.CosB, CosC: g.CosC, Cos: g.Cos,
            Pa: g.Pa, Pb: g.Pb, Pc: g.Pc, P: g.P,
            Qa: g.Qa, Qb: g.Qb, Qc: g.Qc, Q: g.Q,
            Sa: g.Sa, Sb: g.Sb, Sc: g.Sc, S: g.S,
            F: g.F
        };
    });
}

function buildRowCSCT(groupedData) {
    return Object.keys(groupedData).map((time, index) => {
        const g = groupedData[time];
        return {
            stt: index + 1,
            thoidiem: g.time || "-",
            PgiaoA: g.PgiaoA, PgiaoB: g.PgiaoB, PgiaoC: g.PgiaoC, PgiaoTong: g.PgiaoTong,
            PnhanA: g.PnhanA, PnhanB: g.PnhanB, PnhanC: g.PnhanC, PnhanTong: g.PnhanTong,
            QgiaoA: g.QgiaoA, QgiaoB: g.QgiaoB, QgiaoC: g.QgiaoC, QgiaoTong: g.QgiaoTong,
            QnhanA: g.QnhanA, QnhanB: g.QnhanB, QnhanC: g.QnhanC, QnhanTong: g.QnhanTong
        };
    });
}

function buildRowTSVHGeneric(groupedData) {
    return Object.keys(groupedData).map((time, index) => {
        const g = groupedData[time];
        return {
            stt: index + 1,
            thoidiem: g.time || "-",
            Ua: g.Ua, Ub: g.Ub, Uc: g.Uc,
            Ia: g.Ia, Ib: g.Ib, Ic: g.Ic,
            Cos: g.Cos, CosA: g.CosA, CosB: g.CosB, CosC: g.CosC,
            P: g.P
        };
    });
}

function buildRowCSCTGeneric(groupedData) {
    return Object.keys(groupedData).map((time, index) => {
        const g = groupedData[time];
        return {
            stt: index + 1,
            thoidiem: g.time || "-",
            PgiaoTong: g.PgiaoTong,
            PnhanTong: g.PnhanTong,
            QgiaoTong: g.QgiaoTong,
            QnhanTong: g.QnhanTong
        };
    });
}
function buildRowDongHoGiamSat(groupedData) {
    return Object.keys(groupedData).map((time, index) => {
        const g = groupedData[time];

        return {
            stt: index + 1,
            thoidiem: g.time || "-",

            IA: g.IA,
            IB: g.IB,
            IC: g.IC,
            IN: g.IN,

            UAB: g.UAB,
            UBC: g.UBC,
            UCA: g.UCA,
            ULLAVG: g.ULLAVG,

            UA: g.UA,
            UB: g.UB,
            UC: g.UC,
            UNAVG: g.UNAVG,

            PA: g.PA,
            PB: g.PB,
            PC: g.PC,
            PTOTAL: g.PTOTAL,

            QA: g.QA,
            QB: g.QB,
            QC: g.QC,
            QTOTAL: g.QTOTAL,

            SA: g.SA,
            SB: g.SB,
            SC: g.SC,
            STOTAL: g.STOTAL,

            COSA: g.COSA,
            COSB: g.COSB,
            COSC: g.COSC,
            COSTOTAL: g.COSTOTAL,

            FREQ: g.FREQ
        };
    });
}
function buildRowDongHoGiamSatSongHai(groupedData) {
    return Object.keys(groupedData).map((time, index) => {
        const g = groupedData[time];

        return {
            stt: index + 1,
            thoidiem: g.time || "-",

            THD_IA: g.THD_IA,
            THD_IB: g.THD_IB,
            THD_IC: g.THD_IC,
            THD_IN: g.THD_IN,

            THD_UAB: g.UAB,
            THD_UBC: g.UBC,
            THD_UCA: g.UCA,
            THD_ULLAVG: g.ULLAVG,

            THD_UA: g.UA,
            THD_UB: g.UB,
            THD_UC: g.UC,
            THD_UNAVG: g.UNAVG
        };
    });
}
function hasCSCTPhaseData(groupRawData, baseIOA) {

    const phaseIOAs = [
        baseIOA + 27, // PgiaoA
        baseIOA + 31, // PnhanA
        baseIOA + 35, // QgiaoA
        baseIOA + 39  // QnhanA
    ];

    return (groupRawData || []).some(item => {

        const row = safeJsonParse(item.tsvh) || item;

        const ioa = Number(
            row?.ioa_diachi ??
            item?.ioa_diachi
        );

        return phaseIOAs.includes(ioa);
    });
}
function renderRowsTSVH(rows, tbodySelector) {

    const $tbody = $(tbodySelector).html("");
    if (!rows || !rows.length) {
        $tbody.html(`<tr><td colspan="29" class="text-center">Không có dữ liệu</td></tr>`);
        return;
    }
    let html = "";
    rows.forEach((row, index) => {
        html += `
            <tr>
                <td class="text-center">${index + 1}</td>
                <td class="text-center">${row.thoidiem || "-"}</td>
                <td class="text-end">${formatNumber(row.Ua)}</td><td class="text-end">${formatNumber(row.Ub)}</td><td class="text-end">${formatNumber(row.Uc)}</td>
                <td class="text-end">${formatNumber(row.Uab)}</td><td class="text-end">${formatNumber(row.Ubc)}</td><td class="text-end">${formatNumber(row.Uca)}</td>
                <td class="text-end">${formatNumber(row.Ia)}</td><td class="text-end">${formatNumber(row.Ib)}</td><td class="text-end">${formatNumber(row.Ic)}</td><td class="text-end">${formatNumber(row.Io)}</td>
                <td class="text-end">${formatNumber(row.Cos, 3)}</td><td class="text-end">${formatNumber(row.CosA, 3)}</td><td class="text-end">${formatNumber(row.CosB, 3)}</td><td class="text-end">${formatNumber(row.CosC, 3)}</td>
                <td class="text-end">${formatNumber(row.P)}</td><td class="text-end">${formatNumber(row.Pa)}</td><td class="text-end">${formatNumber(row.Pb)}</td><td class="text-end">${formatNumber(row.Pc)}</td>
                <td class="text-end">${formatNumber(row.Q)}</td><td class="text-end">${formatNumber(row.Qa)}</td><td class="text-end">${formatNumber(row.Qb)}</td><td class="text-end">${formatNumber(row.Qc)}</td>
                <td class="text-end">${formatNumber(row.S)}</td><td class="text-end">${formatNumber(row.Sa)}</td><td class="text-end">${formatNumber(row.Sb)}</td><td class="text-end">${formatNumber(row.Sc)}</td>
                <td class="text-end">${formatNumber(row.F)}</td>
            </tr>
        `;
    });
    $tbody.html(html);
}

function renderRowsCSCT(rows, tbodySelector) {
    const $tbody = $(tbodySelector).html("");
    if (!rows || !rows.length) {
        $tbody.html(`<tr><td colspan="18" class="text-center">Không có dữ liệu</td></tr>`);
        return;
    }
    let html = "";
    rows.forEach((row, index) => {
        html += `
            <tr>
                <td class="text-center">${index + 1}</td>
                <td class="text-center">${row.thoidiem || "-"}</td>
                <td class="text-end">${formatNumber(row.PgiaoTong)}</td><td class="text-end">${formatNumber(row.PgiaoA)}</td><td class="text-end">${formatNumber(row.PgiaoB)}</td><td class="text-end">${formatNumber(row.PgiaoC)}</td>
                <td class="text-end">${formatNumber(row.PnhanTong)}</td><td class="text-end">${formatNumber(row.PnhanA)}</td><td class="text-end">${formatNumber(row.PnhanB)}</td><td class="text-end">${formatNumber(row.PnhanC)}</td>
                <td class="text-end">${formatNumber(row.QgiaoTong)}</td><td class="text-end">${formatNumber(row.QgiaoA)}</td><td class="text-end">${formatNumber(row.QgiaoB)}</td><td class="text-end">${formatNumber(row.QgiaoC)}</td>
                <td class="text-end">${formatNumber(row.QnhanTong)}</td><td class="text-end">${formatNumber(row.QnhanA)}</td><td class="text-end">${formatNumber(row.QnhanB)}</td><td class="text-end">${formatNumber(row.QnhanC)}</td>
            </tr>
        `;
    });
    $tbody.html(html);
}

function renderRowsTSVHGeneric(rows, tbodySelector) {
    const $tbody = $(tbodySelector).html("");
    if (!rows || !rows.length) {
        $tbody.html(`<tr><td colspan="13" class="text-center">Không có dữ liệu</td></tr>`);
        return;
    }
    let html = "";
    rows.forEach((row, index) => {
        html += `
            <tr>
                <td class="text-center">${index + 1}</td>
                <td class="text-center">${row.thoidiem || "-"}</td>
                <td class="text-end">${formatNumber(row.Ua)}</td><td class="text-end">${formatNumber(row.Ub)}</td><td class="text-end">${formatNumber(row.Uc)}</td>
                <td class="text-end">${formatNumber(row.Ia)}</td><td class="text-end">${formatNumber(row.Ib)}</td><td class="text-end">${formatNumber(row.Ic)}</td>
                <td class="text-end">${formatNumber(row.Cos, 3)}</td><td class="text-end">${formatNumber(row.CosA, 3)}</td><td class="text-end">${formatNumber(row.CosB, 3)}</td><td class="text-end">${formatNumber(row.CosC, 3)}</td>
                <td class="text-end">${formatNumber(row.P)}</td>
            </tr>
        `;
    });
    $tbody.html(html);
}

function renderRowsCSCTGeneric(rows, tbodySelector) {
    const $tbody = $(tbodySelector).html("");
    if (!rows || !rows.length) {
        $tbody.html(`<tr><td colspan="6" class="text-center">Không có dữ liệu</td></tr>`);
        return;
    }
    let html = "";
    rows.forEach((row, index) => {
        html += `
            <tr>
                <td class="text-center">${index + 1}</td>
                <td class="text-center">${row.thoidiem || "-"}</td>
                <td class="text-end">${formatNumber(row.PgiaoTong)}</td>
                <td class="text-end">${formatNumber(row.PnhanTong)}</td>
                <td class="text-end">${formatNumber(row.QgiaoTong)}</td>
                <td class="text-end">${formatNumber(row.QnhanTong)}</td>
            </tr>
        `;
    });
    $tbody.html(html);
}

function renderRowsCustomer(rows, tbodySelector) {
    const $tbody = $(tbodySelector).html("");
    if (!rows || !rows.length) {
        $tbody.html(`<tr><td colspan="4" class="text-center">Không có dữ liệu</td></tr>`);
        return;
    }
    let html = "";
    rows.forEach(row => {
        html += `
            <tr>
                <td class="text-center">${row.ioa}</td>
                <td>${row.ten}</td>
                <td class="text-end">${formatNumber(row.value)}</td>
                <td class="text-center">${row.thoidiem}</td>
            </tr>
        `;
    });
    $tbody.html(html);
}
function renderRowsDongHoGiamSat(rows, tbodySelector) {
    const $tbody = $(tbodySelector).html("");

    if (!rows || !rows.length) {
        $tbody.html(`<tr><td colspan="31" class="text-center">Không có dữ liệu</td></tr>`);
        return;
    }

    let html = "";

    rows.forEach((row, index) => {
        html += `
            <tr>
                <td class="text-center">${index + 1}</td>
                <td class="text-center">${row.thoidiem || "-"}</td>

                <td class="text-end">${formatNumber(row.UA)}</td>
                <td class="text-end">${formatNumber(row.UB)}</td>
                <td class="text-end">${formatNumber(row.UC)}</td>
                <td class="text-end">${formatNumber(row.UNAVG)}</td>

                <td class="text-end">${formatNumber(row.UAB)}</td>
                <td class="text-end">${formatNumber(row.UBC)}</td>
                <td class="text-end">${formatNumber(row.UCA)}</td>
                <td class="text-end">${formatNumber(row.ULLAVG)}</td>

                <td class="text-end">${formatNumber(row.IA)}</td>
                <td class="text-end">${formatNumber(row.IB)}</td>
                <td class="text-end">${formatNumber(row.IC)}</td>
                <td class="text-end">${formatNumber(row.IN)}</td>

                <td class="text-end">${formatNumber(row.COSTOTAL, 3)}</td>
                <td class="text-end">${formatNumber(row.COSA, 3)}</td>
                <td class="text-end">${formatNumber(row.COSB, 3)}</td>
                <td class="text-end">${formatNumber(row.COSC, 3)}</td>

                <td class="text-end">${formatNumber(row.PTOTAL)}</td>
                <td class="text-end">${formatNumber(row.PA)}</td>
                <td class="text-end">${formatNumber(row.PB)}</td>
                <td class="text-end">${formatNumber(row.PC)}</td>

                <td class="text-end">${formatNumber(row.QTOTAL)}</td>
                <td class="text-end">${formatNumber(row.QA)}</td>
                <td class="text-end">${formatNumber(row.QB)}</td>
                <td class="text-end">${formatNumber(row.QC)}</td>

                <td class="text-end">${formatNumber(row.STOTAL)}</td>
                <td class="text-end">${formatNumber(row.SA)}</td>
                <td class="text-end">${formatNumber(row.SB)}</td>
                <td class="text-end">${formatNumber(row.SC)}</td>

                <td class="text-end">${formatNumber(row.FREQ)}</td>
            </tr>
        `;
    });

    $tbody.html(html);
}
function renderRowsDongHoGiamSatSongHai(rows, tbodySelector) {
    const $tbody = $(tbodySelector).html("");

    if (!rows || !rows.length) {
        $tbody.html(`<tr><td colspan="14" class="text-center">Không có dữ liệu</td></tr>`);
        return;
    }

    let html = "";

    rows.forEach((row, index) => {
        html += `
            <tr>
                <td class="text-center">${index + 1}</td>
                <td class="text-center">${row.thoidiem || "-"}</td>

                <td class="text-end">${formatNumber(row.THD_IA)}</td>
                <td class="text-end">${formatNumber(row.THD_IB)}</td>
                <td class="text-end">${formatNumber(row.THD_IC)}</td>
                <td class="text-end">${formatNumber(row.THD_IN)}</td>

                <td class="text-end">${formatNumber(row.THD_UAB)}</td>
                <td class="text-end">${formatNumber(row.THD_UBC)}</td>
                <td class="text-end">${formatNumber(row.THD_UCA)}</td>
                <td class="text-end">${formatNumber(row.THD_ULLAVG)}</td>
                <td class="text-end">${formatNumber(row.THD_UA)}</td>
                <td class="text-end">${formatNumber(row.THD_UB)}</td>
                <td class="text-end">${formatNumber(row.THD_UC)}</td>
                <td class="text-end">${formatNumber(row.THD_UNAVG)}</td>
            </tr>
        `;
    });

    $tbody.html(html);
}
function drawTSVHScada(groupRawData, baseIOA, tbodySelector) {
    const rows = buildRowTSVH(extractGroupData(groupRawData, baseIOA, getIoaMapTSVH));
    renderRowsTSVH(rows, tbodySelector);
}

function drawCSCTScada(groupRawData, baseIOA, tbodySelector) {
    const rows = buildRowCSCT(extractGroupData(groupRawData, baseIOA, getIoaMapCSCT));
    renderRowsCSCT(rows, tbodySelector);
}

function drawTSVHGenericScada(groupRawData, baseIOA, tbodySelector) {
    const rows = buildRowTSVHGeneric(extractGroupData(groupRawData, baseIOA, getIoaMapTSVHGeneric));
    renderRowsTSVHGeneric(rows, tbodySelector);
}

function drawCSCTGenericScada(groupRawData, baseIOA, tbodySelector) {
    const rows = buildRowCSCTGeneric(extractGroupData(groupRawData, baseIOA, getIoaMapCSCTGeneric));
    renderRowsCSCTGeneric(rows, tbodySelector);
}

function drawDongHoGiamSatScada(groupRawData, tbodySelector) {
    const groupedData = extractGroupData(
        groupRawData,
        0,
        getIoaMapDongHoGiamSat
    );

    const rows = buildRowDongHoGiamSat(groupedData);

    renderRowsDongHoGiamSat(rows, tbodySelector);
}

function drawDongHoGiamSatSongHaiScada(groupRawData, tbodySelector) {
    const groupedData = extractGroupData(
        groupRawData,
        0,
        getIoaMapDongHoGiamSat
    );

    const rows = buildRowDongHoGiamSatSongHai(groupedData);

    renderRowsDongHoGiamSatSongHai(rows, tbodySelector);
}
function buildScrollWrap(innerHtml) {
    return `<div class="table-responsive scada-table-wrap" >${innerHtml}</div>`;
}

function buildTableHtml(groupId) {
    return `
       
        ${buildScrollWrap(`
            <table id="table_${groupId}" class="table table-bordered table-hover align-middle mb-0">
                <thead class="table-info text-center">
                    <tr>
                        <th style="width:60px" rowspan="2">STT</th>
                        <th style="width:180px" rowspan="2">Thời điểm</th>
                        <th colspan="6">U (V)</th>
                        <th colspan="4">I (A)</th>
                        <th colspan="4">Cos φ</th>
                        <th colspan="4">P (kW)</th>
                        <th colspan="4">Q (kVar)</th>
                        <th colspan="4">S (kVA)</th>
                        <th rowspan="2">F (Hz)</th>
                    </tr>
                    <tr>
                        <th>Pha A</th><th>Pha B</th><th>Pha C</th><th>Pha AB</th><th>Pha BC</th><th>Pha CA</th>
                        <th>Pha A</th><th>Pha B</th><th>Pha C</th><th>In</th>
                        <th>Cos Tổng</th><th>Pha A</th><th>Pha B</th><th>Pha C</th>
                        <th>P Tổng </th><th>Pha A</th><th>Pha B</th><th>Pha C</th>
                        <th>Q Tổng</th><th>Pha A</th><th>Pha B</th><th>Pha C</th>
                        <th>S Tổng</th><th>Pha A</th><th>Pha B</th><th>Pha C</th>
                    </tr>
                </thead>
                <tbody id="tbody_${groupId}"></tbody>
            </table>
        `)}
    `;
}

function buildTableCSCTHtml(groupId) {
    return `
      
        ${buildScrollWrap(`
            <table id="table_csct_${groupId}" class="table table-bordered table-hover align-middle mb-0">
                <thead class="table-info text-center">
                    <tr>
                        <th style="width:60px" rowspan="2">STT</th>
                        <th style="width:180px" rowspan="2">Thời điểm</th>
                        <th colspan="4">P Giao (KWh)</th>
                        <th colspan="4">P Nhận (KWh)</th>
                        <th colspan="4">Q Giao (kVARh)</th>
                        <th colspan="4">Q Nhận (kVARh)</th>
                    </tr>
                    <tr>
                        <th>Biểu Tổng</th><th>Pha A</th><th>Pha B</th><th>Pha C</th>
                        <th>Biểu Tổng</th><th>Pha A</th><th>Pha B</th><th>Pha C</th>
                        <th>Biểu Tổng</th><th>Pha A</th><th>Pha B</th><th>Pha C</th>
                        <th>Biểu Tổng</th><th>Pha A</th><th>Pha B</th><th>Pha C</th>
                    </tr>
                </thead>
                <tbody id="tbody_csct_${groupId}"></tbody>
            </table>
        `)}
    `;
}

function buildGenericTableTSVHTHtml(groupId) {
    return `       
        ${buildScrollWrap(`
            <table id="table_${groupId}" class="table table-bordered table-hover align-middle mb-0">
                <thead class="table-info text-center">
                    <tr>
                        <th style="width:60px" rowspan="2">STT</th>
                        <th style="width:180px" rowspan="2">Thời điểm</th>
                        <th colspan="3">U (V)</th>
                        <th colspan="3">I (A)</th>
                        <th colspan="4">Cos φ</th>
                        <th rowspan="2">P (kW)</th>
                    </tr>
                    <tr>
                        <th>Pha A</th><th>Pha B</th><th>Pha C</th>
                        <th>Pha A</th><th>Pha B</th><th>Pha C</th>
                        <th>Cos</th><th>Pha A</th><th>Pha B</th><th>Pha C</th>
                    </tr>
                </thead>
                <tbody id="tbody_${groupId}"></tbody>
            </table>
        `)}
    `;
}

function buildGenericTableCSCTHtml(groupId) {
    return `
      
        ${buildScrollWrap(`
            <table id="table_csct_${groupId}" class="table table-bordered table-hover align-middle mb-0">
                <thead class="table-info text-center">
                    <tr>
                        <th style="width:60px">STT</th>
                        <th style="width:180px">Thời điểm</th>
                        <th>P Giao (KWh)</th>
                        <th>P Nhận (KWh)</th>
                        <th>Q Giao (kVARh)</th>
                        <th>Q Nhận (kVARh)</th>
                    </tr>
                </thead>
                <tbody id="tbody_csct_${groupId}"></tbody>
            </table>
        `)}
    `;
}

function buildCustomerTableHtml(groupId) {
    return `
      
        ${buildScrollWrap(`
            <table id="table_generic_${groupId}" class="table table-bordered table-hover align-middle mb-0">
                <thead class="table-info text-center">
                    <tr>
                        <th style="width:100px">IOA</th>
                        <th>Tên</th>
                        <th style="width:100px">Giá trị</th>
                        <th style="width:180px">Thời điểm</th>
                    </tr>
                </thead>
                <tbody id="tbody_generic_${groupId}"></tbody>
            </table>
        `)}
    `;
}
function buildDongHoGiamSatTable(groupId) {
    return `
        ${buildScrollWrap(`
            <table id="table_dongho_${groupId}" class="table table-bordered table-hover align-middle mb-0">
                <thead class="table-info text-center">
                   <tr>
                        <th style="width:60px" rowspan="2">STT</th>
                        <th style="width:180px" rowspan="2">Thời điểm</th>
                        <th colspan="8">U (V)</th>
                        <th colspan="4">I (A)</th>
                        <th colspan="4">Cos φ</th>
                        <th colspan="4">P (kW)</th>
                        <th colspan="4">Q (kVar)</th>
                        <th colspan="4">S (kVA)</th>
                        <th rowspan="2">F (Hz)</th>
                    </tr>
                    <tr>
                        <th>Pha A</th><th>Pha B</th><th>Pha C</th> <th>U pha TB</th>
                        <th>Pha AB</th><th>Pha BC</th><th>Pha CA</th><th>U dây TB</th>

                        <th>Pha A</th><th>Pha B</th><th>Pha C</th><th>In</th>
                        
                        <th>Cos Tổng</th><th>Pha A</th><th>Pha B</th><th>Pha C</th>
                        <th>P Tổng</th><th>Pha A</th><th>Pha B</th><th>Pha C</th>
                        <th>Q Tổng</th><th>Pha A</th><th>Pha B</th><th>Pha C</th>
                        <th>S Tổng</th><th>Pha A</th><th>Pha B</th><th>Pha C</th>
                    </tr>
                </thead>
                <tbody id="tbody_dongho_${groupId}"></tbody>
            </table>
        `)}
    `;
}

function buildDongHoGiamSatSongHaiTable(groupId) {
    return `
        ${buildScrollWrap(`
            <table id="table_songhai_${groupId}" class="table table-bordered table-hover align-middle mb-0">
                <thead class="table-info text-center">
                   <tr>
                        <th style="width:60px" rowspan="2">STT</th>
                        <th style="width:180px" rowspan="2">Thời điểm</th>
                        <th colspan="4">THD I</th>
                        <th colspan="8">THD U</th>
                    </tr>
                    <tr>
                        <th>THD IA</th>
                        <th>THD IB</th>
                        <th>THD IC</th>
                        <th>THD IN</th>

                        <th>THD UAB</th>
                        <th>THD UBC</th>
                        <th>THD UCA</th>
                        <th>THD U dây TB</th>
                        <th>THD UA</th>
                        <th>THD UB</th>
                        <th>THD UC</th>
                        <th>THD U pha TB</th>
                    </tr>
                </thead>
                <tbody id="tbody_songhai_${groupId}"></tbody>
            </table>
        `)}
    `;
}
function buildCustomerRows(rawData) {
    return (rawData || []).map((item, index) => {
        const row = safeJsonParse(item.tsvh) || item;
        const value = row?.value ?? item?.value;
        const scale = Number(row?.ioa_scale ?? item?.ioa_scale ?? 1);
        const finalValue = Number.isFinite(Number(value)) ? Number(value) * scale : value;
        return {
            stt: index + 1,
            thoidiem: row?.max_time ?? item?.max_time ?? row?.time ?? item?.time ?? "-",
            ioa: row?.ioa_diachi ?? item?.ioa_diachi ?? "-",
            value: finalValue,
            ten: row?.ten_cambien ?? item?.ten_cambien ?? "-"
        };
    });
}
function getCustomerFallbackGroup(rawData) {
    return {
        id: "scada_customer_other",
        label: "Thông số",
        type: "CUSTOMER_OTHER",
        from: null,
        to: null,
        layout: "customer",
        rawData: rawData || []
    };
}

function getMatchedGroupItems(rawData) {
    const matchedItems = new Set();
    const matchedGroups = [];

    TSVH_GROUPS.forEach(group => {
        const groupRaw = filterRawDataByGroup(rawData, group);

        if (groupRaw.length) {
            matchedGroups.push({
                ...group,
                rawData: groupRaw
            });

            groupRaw.forEach(item => matchedItems.add(item));
        }
    });

    const unmatchedRaw = (rawData || []).filter(item => !matchedItems.has(item));

    if (unmatchedRaw.length) {
        matchedGroups.push(getCustomerFallbackGroup(unmatchedRaw));
    }

    return matchedGroups;
}
function renderTabsByIOA(rawData, sensors) {
    let tabHtml = "";
    let contentHtml = "";
    let isFirst = true;

    const node = JSON.parse(localStorage.getItem("node")) || {};
    //loại bỏ ioa cảm biến nhiệt, cảm biến độ ẩm, giám sát trạng thái
    const ioaNhiet = new Set(Array.from({ length: 12 }, (_, i) => 1000 + i));
    const ioaDoam = new Set(Array.from({ length: 24 }, (_, i) => 2000 + i));
    const ioaCanhbao = new Set(Array.from({ length: 6 }, (_, i) => 3000 + i));

    const filteredRawData = (rawData || []).filter(item => {

        const row = safeJsonParse(item.tsvh) || item;

        const ioa = Number(
            row?.ioa_diachi ?? item?.ioa_diachi
        );

        return !ioaNhiet.has(ioa)
            && !ioaDoam.has(ioa)
            && !ioaCanhbao.has(ioa);
    });

    const groupsToRender = getMatchedGroupItems(filteredRawData);

    groupsToRender.forEach(group => {
        const groupRaw = group.rawData || [];
        if (!groupRaw.length) return;

        const activeClass = isFirst ? "active" : "";
        const paneClass = isFirst ? "show active" : "";

        tabHtml += `
            <li class="nav-item" role="presentation">
                <a class="nav-link ${activeClass}"
                   href="#${group.id}"
                   role="tab"
                   aria-selected="${isFirst ? "true" : "false"}">
                    <i class="flaticon-041-graph me-2"></i>${group.label}
                </a>
            </li>
        `;

        if (group.layout === "full") {
            contentHtml += `
                <div class="tab-pane fade ${paneClass}" id="${group.id}" role="tabpanel">
                    ${group.id === "scada_lotong" ? `
                    <div class="d-flex justify-content-end mb-2">
                        <button type="button" class="btn btn-info btn-sm" id="btn_ai_phan_tich_lotong">
                            <i class="fa fa-robot me-1"></i> Phân tích AI
                        </button>
                    </div>` : ""}
                    ${buildTableHtml(group.id)}
                    ${buildTableCSCTHtml(group.id)}
                </div>
            `;
        } else if (group.layout === "generic") {
            contentHtml += `
                <div class="tab-pane fade ${paneClass}" id="${group.id}" role="tabpanel">
                    ${buildGenericTableTSVHTHtml(group.id)}
                    ${buildGenericTableCSCTHtml(group.id)}
                </div>
            `;
        }
        else if (group.layout === "dongho") {
            contentHtml += `
                <div class="tab-pane fade ${paneClass}" id="${group.id}" role="tabpanel">
                     ${buildDongHoGiamSatTable(group.id)}
                     ${buildDongHoGiamSatSongHaiTable(group.id)}
                </div>
            `;
        }
        else {
            contentHtml += `
                <div class="tab-pane fade ${paneClass}" id="${group.id}" role="tabpanel">
                    ${buildCustomerTableHtml(group.id)}
                </div>
            `;
        }

        isFirst = false;
    });

    $("#scada_tabs").html(tabHtml);
    $("#scada_tab_content").html(contentHtml);

    if (!tabHtml.trim()) {
        $("#scada_tab_content").html(
            `<div class="alert alert-warning mb-0">Không có dữ liệu thông số vận hành.</div>`
        );
        return false;
    }

    $("#scada_tab_content .tab-pane").hide();
    $("#scada_tab_content .tab-pane.show.active").first().show();

    $("#scada_tabs .nav-link")
        .off("click.scadaTab")
        .on("click.scadaTab", function (e) {
            e.preventDefault();

            $("#scada_tabs .nav-link")
                .removeClass("active")
                .attr("aria-selected", "false");

            $("#scada_tab_content .tab-pane")
                .removeClass("show active")
                .hide();

            $(this)
                .addClass("active")
                .attr("aria-selected", "true");

            const target = $(this).attr("href");

            $(target)
                .addClass("show active")
                .show();
        });

    groupsToRender.forEach(group => {
        const groupRaw = group.rawData || [];
        if (!groupRaw.length) return;

        if (group.layout === "full") {
            const groupedData = extractGroupData(groupRaw, group.from, getIoaMapTSVH);
            const rows = buildRowTSVH(groupedData);
            renderRowsTSVH(rows, `#tbody_${group.id}`);
            if (group.id === "scada_lotong") SCADA_LOTONG_AI_ROWS = rows;
            initScadaDataTableAfterRender(`#table_${group.id}`, 5);
            if (hasCSCTPhaseData(groupRaw, group.from)) {
                drawCSCTScada(groupRaw, group.from, `#tbody_csct_${group.id}`);
                initScadaDataTableAfterRender(`#table_csct_${group.id}`, 5);

            } else {
                $(`#table_csct_${group.id}`).closest('.scada-table-wrap').hide();
            }
        } else if (group.layout === "generic") {
            drawTSVHGenericScada(groupRaw, group.from, `#tbody_${group.id}`);
            initScadaDataTableAfterRender(`#table_${group.id}`, 5);
            if (hasCSCTPhaseData(groupRaw, group.from)) {
                drawCSCTGenericScada(groupRaw, group.from, `#tbody_csct_${group.id}`);
                initScadaDataTableAfterRender(`#table_csct_${group.id}`, 5);
            } else {
                $(`#table_csct_${group.id}`).closest('.scada-table-wrap').hide();
            }
        } 
         else if (group.layout === "dongho") {
            drawDongHoGiamSatScada(groupRaw, `#tbody_dongho_${group.id}`);
            initScadaDataTableAfterRender(`#table_dongho_${group.id}`, 5);
            drawDongHoGiamSatSongHaiScada(groupRaw, `#tbody_songhai_${group.id}`);
             initScadaDataTableAfterRender(`#table_songhai_${group.id}`, 5);
          
        }
        
        else {
            renderRowsCustomer(buildCustomerRows(groupRaw), `#tbody_generic_${group.id}`);
            initScadaDataTableAfterRender(`#table_generic_${group.id}`, 10);
        }
    });
    return true;
}

$(document).off("click.scadaAiLoTong", "#btn_ai_phan_tich_lotong")
    .on("click.scadaAiLoTong", "#btn_ai_phan_tich_lotong", async function () {
        if (!SCADA_LOTONG_AI_ROWS.length) {
            if (typeof toastr !== "undefined") toastr.warning("Bảng Lộ tổng chưa có dữ liệu để phân tích");
            return;
        }

        const $button = $(this);
        const originalHtml = $button.html();
        const $modal = $("#modalAiPhanTichLoTong");
        const $loading = $("#ai_lotong_loading");
        const $error = $("#ai_lotong_error");
        const $meta = $("#ai_lotong_meta");
        const $result = $("#ai_lotong_result");

        $error.hide().text("");
        $meta.hide().text("");
        $result.empty();
        $loading.show();
        $modal.modal("show");
        $button.prop("disabled", true).html('<span class="spinner-border spinner-border-sm me-1"></span> Đang phân tích');

        try {
            const response = await $.ajax({
                url: "/api/scada_ai_lotong",
                type: "POST",
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                data: JSON.stringify({
                    device_id: ID_THIETBI_SCADA,
                    device_name: $("#cbo_thietbi option:selected").text(),
                    from_date: $("#txttungay_tsvh_scada").val(),
                    to_date: $("#txtdenngay_tsvh_scada").val(),
                    rows: SCADA_LOTONG_AI_ROWS
                })
            });

            const data = response?.data || {};
            $meta.text(`Đã phân tích ${data.row_count || SCADA_LOTONG_AI_ROWS.length} bản ghi`).show();
            $result.text(data.analysis || "Dịch vụ AI không trả về nội dung phân tích.");
        } catch (xhr) {
            $error.text(xhr.responseJSON?.message || "Không thể thực hiện phân tích AI. Vui lòng thử lại.").show();
        } finally {
            $loading.hide();
            $button.prop("disabled", false).html(originalHtml);
        }
    });

async function getTSVHScada(v_id_thietbi) {
    $("#popup-loading").show();

    try {
        ID_THIETBI_SCADA = v_id_thietbi;
        SCADA_LOTONG_AI_ROWS = [];

        const tungay = $("#txttungay_tsvh_scada").val() || getDateTimeCurrent();
        const denngay = $("#txtdenngay_tsvh_scada").val() || getDateTimeCurrent();

        $("#scada_tabs").html("");
        $("#scada_tab_content").html(`<div class="text-center p-3">Đang tải dữ liệu...</div>`);

        $("#tab_cambien_coday,#tab_cambien_khongday,#tab_giamsat_trangthai").hide();
        $("#scada_cambiencoday,#scada_khongday,#scada_canhbao").hide();

        renderLoading($("#lst_cambiennhiet tbody"), 3);
        renderLoading($("#lst_cambiendoam tbody"), 4);
        $("#box_trangthai_canhbao").html(`<p style="text-align:center;margin-top:20px">Đang tải dữ liệu</p>`);

        const result = await $.ajax({
            url: "/api/giamsat/get-tsvh-scada",
            type: "POST",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: JSON.stringify({
                v_id_thietbi,
                v_tungay: tungay,
                v_denngay: denngay
            })
        });

        const rawData = Array.isArray(result?.cv_1) ? result.cv_1 : [];
        const sensors = Array.isArray(result?.cv_2) ? result.cv_2 : [];

        const hasTab = renderTabsByIOA(rawData, sensors);

        await new Promise(resolve => setTimeout(resolve, 0));

        const ioaNhiet = new Set(Array.from({ length: 12 }, (_, i) => 1000 + i));
        const ioaDoam = new Set(Array.from({ length: 24 }, (_, i) => 2000 + i));
        const ioaCanhbao = new Set(Array.from({ length: 6 }, (_, i) => 3000 + i));

        let hasNhiet = false;
        let hasDoam = false;
        let hasCanhbao = false;

        for (const item of rawData) {
            const row = safeJsonParse(item.tsvh) || item;
            const ioa = Number(row?.ioa_diachi ?? item?.ioa_diachi ?? 0);

            if (ioaNhiet.has(ioa)) hasNhiet = true;
            if (ioaDoam.has(ioa)) hasDoam = true;
            if (ioaCanhbao.has(ioa)) hasCanhbao = true;

            if (hasNhiet && hasDoam && hasCanhbao) break;
        }

        if (hasNhiet) {
            $("#tab_cambien_coday").show();
            resetScadaDataTable("#lst_cambiennhiet");

            f_cambienNhiet(rawData, sensors);

            initScadaDataTableAfterRender("#lst_cambiennhiet", 20);
        } else {
            $("#tab_cambien_coday").hide();
            $("#scada_cambiencoday").hide();
            renderEmpty($("#lst_cambiennhiet tbody"), 3);
        }

        if (hasDoam) {
            $("#tab_cambien_khongday").show();
            resetScadaDataTable("#lst_cambiendoam");
            f_cambienDoam(rawData, sensors);
            initScadaDataTableAfterRender("#lst_cambiendoam", 20);
        } else {
            $("#tab_cambien_khongday").hide();
            $("#scada_khongday").hide();
            renderEmpty($("#lst_cambiendoam tbody"), 4);
        }

        if (hasCanhbao) {
            $("#tab_giamsat_trangthai").show();
            f_trangthaiCanhbao(rawData);
        } else {
            $("#tab_giamsat_trangthai").hide();
            $("#scada_canhbao").hide();
            $("#box_trangthai_canhbao").html(`<p style="text-align:center;margin-top:20px">Không có dữ liệu</p>`);
        }

        function hideAllSensorContent() {
            $("#scada_cambiencoday").hide();
            $("#scada_khongday").hide();
            $("#scada_canhbao").hide();
        }

        $(document)
            .off("click.scadaSensorTab", "#tab_cambien_coday")
            .on("click.scadaSensorTab", "#tab_cambien_coday", function () {
                hideAllSensorContent();
                $("#scada_cambiencoday").show();
            });

        $(document)
            .off("click.scadaSensorTab", "#tab_cambien_khongday")
            .on("click.scadaSensorTab", "#tab_cambien_khongday", function () {
                hideAllSensorContent();
                $("#scada_khongday").show();
            });

        $(document)
            .off("click.scadaSensorTab", "#tab_giamsat_trangthai")
            .on("click.scadaSensorTab", "#tab_giamsat_trangthai", function () {
                hideAllSensorContent();
                $("#scada_canhbao").show();
            });

        hideAllSensorContent();

        if (hasNhiet) {
            $("#scada_cambiencoday").show();
        } else if (hasDoam) {
            $("#scada_khongday").show();
        } else if (hasCanhbao) {
            $("#scada_canhbao").show();
        }

        if (!hasTab && !hasNhiet && !hasDoam && !hasCanhbao) {
            $("#scada_tab_content").html(
                `<div class="alert alert-warning mb-0">Không có dữ liệu thông số vận hành.</div>`
            );
        }

    } catch (err) {
        console.error("Lỗi getTSVHScada:", err);

        $("#scada_tabs").html("");
        $("#scada_tab_content").html(
            `<div class="alert alert-danger mb-0">Có lỗi khi tải dữ liệu: ${err?.message || err}</div>`
        );

        $("#tab_cambien_coday,#tab_cambien_khongday,#tab_giamsat_trangthai").hide();
        $("#scada_cambiencoday,#scada_khongday,#scada_canhbao").hide();

        renderEmpty($("#lst_cambiennhiet tbody"), 3);
        renderEmpty($("#lst_cambiendoam tbody"), 4);
        $("#box_trangthai_canhbao").html(`<p style="text-align:center;margin-top:20px">Không có dữ liệu</p>`);
    } finally {
        $("#popup-loading").hide();
    }
}
function resetScadaDataTable(tableSelector) {
    if ($.fn.DataTable.isDataTable(tableSelector)) {
        $(tableSelector).DataTable().clear().destroy();
    }

    $(tableSelector + " tbody").empty();

    // xóa wrapper DataTable nếu bị sinh trùng
    $(tableSelector).closest(".dataTables_wrapper").find(".dt-buttons").remove();
}
function getLatestByIoa(rawData, validIOA) {

    const map = {};

    (rawData || []).forEach(item => {

        const row = safeJsonParse(item.tsvh) || item;

        const ioa = Number(
            row?.ioa_diachi ??
            item?.ioa_diachi
        );

        if (!validIOA.has(ioa)) return;

        const timeText =
            row?.max_time ??
            item?.max_time ??
            row?.time ??
            item?.time ??
            row?.thoidiem ??
            item?.thoidiem ??
            "";

        const timeValue = parseDateTimeVNToMs(timeText);

        if (!timeValue) return;

        const d = new Date(timeValue);

        const ngay =
            d.getFullYear() + "-" +
            String(d.getMonth() + 1).padStart(2, "0") + "-" +
            String(d.getDate()).padStart(2, "0");

        // key theo ioa + ngày
        const key = `${ioa}_${ngay}`;

        // lấy max(time)
        if (!map[key] || timeValue > map[key].timeValue) {

            map[key] = {
                item,
                timeValue
            };
        }
    });

    return Object.values(map)
        .sort((a, b) => b.timeValue - a.timeValue)
        .map(x => x.item);
}
function parseDateTimeVNToMs(value) {
    if (!value) return 0;

    const text = String(value).trim();

    // dd/MM/yyyy HH:mm:ss
    let m = text.match(/^(\d{2})\/(\d{2})\/(\d{4})\s+(\d{2}):(\d{2}):(\d{2})$/);
    if (m) {
        return new Date(
            Number(m[3]),
            Number(m[2]) - 1,
            Number(m[1]),
            Number(m[4]),
            Number(m[5]),
            Number(m[6])
        ).getTime();
    }

    // yyyy-MM-ddTHH:mm:ss hoặc dạng JS parse được
    const d = new Date(text);
    return isNaN(d.getTime()) ? 0 : d.getTime();
}
function f_cambienNhiet(rawData, sensors = []) {
    const $tbody = $("#lst_cambiennhiet tbody").html("");
    const validIOA = new Set(Array.from({ length: 12 }, (_, i) => 1000 + i));

    const filtered = getLatestByIoa(rawData, validIOA);

    if (!filtered.length) return renderEmpty($tbody, 3);

    const tenCambienMacDinh = sensors.length ? (sensors[0].ten_cambien || "-") : "-";
    let html = "";

    filtered.forEach(item => {
        const row = safeJsonParse(item.tsvh) || item;
        const ten = row?.ten_cambien || item?.ten_cambien || tenCambienMacDinh;
        const nhietdo = (replaceNaN(row.value) * row.ioa_scale).toFixed(2);
        const thoigian = row?.time ?? item?.time ?? row?.thoidiem ?? item?.thoidiem ?? "-";
        const id_thietbi = row?.id_thietbi ?? item?.id_thietbi ?? "";
        const id_cambien = row?.id_cambien ?? item?.id_cambien ?? "";
        const ioa_diachi = row?.ioa_diachi ?? item?.ioa_diachi ?? "";
        const ngay = row?.ngay ?? item?.ngay ?? "";

        html += `
            <tr class="row-cambien" style="cursor:pointer"
                data-id_thietbi="${id_thietbi}" data-id_cambien="${id_cambien}"
                data-ioa="${ioa_diachi}" data-ten="${ten}" data-time="${ngay}" data-type="coday">
                <td>${ten}</td>
                <td class="text-end">${nhietdo}</td>
                <td class="text-center">${thoigian}</td>
            </tr>
        `;
    });

    $tbody.html(html);

    $("#lst_cambiennhiet tbody").off("click", ".row-cambien").on("click", ".row-cambien", function () {
        const id_thietbi = $(this).data("id_thietbi");
        const id_cambien = $(this).data("id_cambien");
        const ioa_diachi = $(this).data("ioa");
        const tencambien = $(this).data("ten");
        const ngay = $(this).data("time");
        const type = $(this).data("type");

        $("#popup-content").html(`
            <table class="table table-bordered" id="tbl_chitiet_cambien_scada">
                <thead><tr><th>STT</th><th>Thời gian</th><th>Nhiệt độ</th></tr></thead>
                <tbody></tbody>
            </table>
        `);

        openPopupChiTietCambienCoDay(id_thietbi, id_cambien, ioa_diachi, tencambien, ngay, ngay, type);
    });
}

function f_cambienDoam(rawData, sensors = []) {
    const $tbody = $("#lst_cambiendoam tbody").html("");
    const ioaNhietDo = new Set([2001, 2009, 2017]);

    const filtered = getLatestByIoa(rawData, ioaNhietDo);

    if (!filtered.length) return renderEmpty($tbody, 4);

    const tenCambienMacDinh = sensors.length ? (sensors[0].ten_cambien || "-") : "-";
    let html = "";

    filtered.forEach(item => {
        const row = safeJsonParse(item.tsvh) || item;
        const ten = row?.ten_cambien || item?.ten_cambien || tenCambienMacDinh;
        const nhietdo = (replaceNaN(row.value) * row.ioa_scale).toFixed(2);
        const thoigian = row?.time ?? item?.time ?? row?.thoidiem ?? item?.thoidiem ?? "-";
        const id_thietbi = row?.id_thietbi ?? item?.id_thietbi ?? "";
        const id_cambien = row?.id_cambien ?? item?.id_cambien ?? "";
        const ioa_diachi = row?.ioa_diachi ?? item?.ioa_diachi ?? "";
        const ngay = row?.ngay ?? item?.ngay ?? "";

        html += `
            <tr class="row-cambien" style="cursor:pointer"
                data-id_thietbi="${id_thietbi}" data-id_cambien="${id_cambien}"
                data-ioa="${ioa_diachi}" data-ten="${ten}" data-time="${ngay}" data-type="khongday">
                <td>${ten}</td>
                <td class="text-end">${nhietdo}</td>
                <td class="text-center">${thoigian}</td>
            </tr>
        `;
    });

    $tbody.html(html);

    $("#lst_cambiendoam tbody").off("click", ".row-cambien").on("click", ".row-cambien", function () {
        const id_thietbi = $(this).data("id_thietbi");
        const id_cambien = $(this).data("id_cambien");
        const ioa_diachi = $(this).data("ioa");
        const tencambien = $(this).data("ten");
        const ngay = $(this).data("time");
        const type = $(this).data("type");

        $("#popup-content").html(`
            <table class="table table-bordered" id="tbl_chitiet_cambien_scada">
                <thead><tr><th>STT</th><th>Thời gian</th><th>Nhiệt độ</th></tr></thead>
                <tbody></tbody>
            </table>
        `);

        openPopupChiTietCambienCoDay(id_thietbi, id_cambien, ioa_diachi, tencambien, ngay, ngay, type);
    });
}

function renderEmpty($tbody, type) {
    if (type == 3) $tbody.html(`<tr><td colspan="3" class="text-center">Không có dữ liệu</td></tr>`);
    else if (type == 4) $tbody.html(`<tr><td colspan="4" class="text-center">Không có dữ liệu</td></tr>`);
    else $tbody.html(`<tr><td class="text-center">Không có dữ liệu</td></tr>`);
}

function renderLoading($tbody, type) {
    if (type == 3) $tbody.html(`<tr><td colspan="3" class="text-center">Đang tải dữ liệu</td></tr>`);
    else if (type == 4) $tbody.html(`<tr><td colspan="4" class="text-center">Đang tải dữ liệu</td></tr>`);
    else $tbody.html(`<tr><td class="text-center">Đang tải dữ liệu</td></tr>`);
}

function replaceNaN(str) {
    if (str == 6116.60 || str == 61166) return 0;
    if (str < 0) return 0;
    return str;
}
function parseTimeToDate(time) {
    if (!time || time === "-") return new Date(0);

    // dạng dd/MM/yyyy HH:mm:ss
    if (typeof time === "string" && time.includes("/")) {
        const [datePart, timePart = "00:00:00"] = time.split(" ");
        const [dd, mm, yyyy] = datePart.split("/");
        return new Date(`${yyyy}-${mm}-${dd}T${timePart}`);
    }

    return new Date(time);
}
function f_trangthaiCanhbao(rawData) {
    const $wrap = $("#box_trangthai_canhbao").html("");
    const statusMap = {
        3000: "Cảnh báo rò điện/tiếp địa",
        3001: "Mở khoang tổn thất",
        3002: "Cảm biến khói",
        3003: "Cảm biến ngập nước",
        3004: "Cảm biến mức dầu ngưỡng trên",
        3005: "Cảm biến mức dầu ngưỡng dưới"
    };
    const dataByIoa = {};
    (rawData || []).forEach(item => {
        const row = safeJsonParse(item.tsvh) || item;
        const ioa = Number(row?.ioa_diachi ?? item?.ioa_diachi);

        if (!statusMap[ioa]) return;

        const currentTime = row?.thoidiem ?? item?.thoidiem ?? "-";
        const oldTime = dataByIoa[ioa]?.time ?? "-";

        // chỉ lấy bản ghi có time lớn nhất
        if (dataByIoa[ioa] && parseTimeToDate(oldTime) >= parseTimeToDate(currentTime)) {
            return;
        }

        dataByIoa[ioa] = {
            value: row?.value ?? item?.value ?? 0,
            time: currentTime,
            id_thietbi: row?.id_thietbi ?? item?.id_thietbi ?? null,
            ten_cambien: row?.ten_cambien ?? "-",
            id_cambien: row?.id_cambien ?? null,
        };
    });


    if (!Object.keys(dataByIoa).length) {
        $wrap.html(`<div class="text-muted">Không có dữ liệu cảnh báo</div>`);
        return;
    }

    let html = `<div class="row">`;
    Object.keys(dataByIoa).forEach(key => {

        const ioa = Number(key);
        const info = dataByIoa[ioa];
        const isOn = String(info.value) === "0" || String(info.value).toLowerCase() === "on" || String(info.value).toLowerCase() === "true";

        html += `
            <div class="col-md-6 col-lg-4 mb-3">
                <div class="card shadow-sm h-100 border-0  card-canhbao" style='margin: 10px 0;'  data-ioa="${ioa}"  data-id_thietbi="${info.id_thietbi}" data-ten="${info.ten_cambien}" data-id_cambien="${info.id_cambien}" 
                 data-time="${info.time}">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-start mb-2">
                            <div class="fw-bold">${statusMap[ioa]}</div>
                            <span class="badge ${isOn ? "bg-danger" : "bg-success"}">${isOn ? "ON" : "OFF"}</span>
                        </div>
                        <div class="small text-muted">IOA: ${ioa}</div>
                        <div class="small text-muted">Thời gian: ${info.time}</div>
                         <div class="small text-primary mt-2"  style="cursor:pointer;">Bấm để xem chi tiết</div>
                    </div>
                </div>
            </div>
        `;
    });
    html += `</div>`;
    $wrap.html(html);

    $wrap.off("click", ".card-canhbao").on("click", ".card-canhbao", function () {
       
        const ioa = Number($(this).data("ioa"));
        const id_thietbi = $(this).data("id_thietbi");
        const id_cambien = $(this).data("id_cambien");
        const tencambien = $(this).data("ten") || statusMap[ioa];
        const tungay = $("#txttungay_tsvh_scada").val();
        const denngay = $("#txtdenngay_tsvh_scada").val();
        openPopupChiTietTrangThaiCanhBao(
            ioa,
            statusMap[ioa],
            id_thietbi,
            tencambien,
            id_cambien,
            tungay,
            denngay
        );
    });
}

function openPopupChiTietCambienCoDay(id_thietbi, id_cambien, ioa_diachi, tencambien, tungay, denngay, type) {
    $(".title_cambien").html(tencambien || "");
    $("#btnthuchien_chitiet_cambien_scada").data({ id_thietbi, id_cambien, ioa_diachi, type: type || "coday" });
    $("#txttungay_cambien_scada").val(tungay || "");
    $("#txtdenngay_cambien_scada").val(denngay || "");
    $("#popupChitietCambienCoday").off("shown.bs.modal").on("shown.bs.modal", function () {
        initDataTableChiTietCambien(type || "coday");
    });
    $("#popupChitietCambienCoday").modal("show");
}

function initDataTableChiTietCambien(type) {
    if ($.fn.DataTable.isDataTable("#tbl_chitiet_cambien_scada")) {
        $("#tbl_chitiet_cambien_scada").DataTable().destroy();
        $("#tbl_chitiet_cambien_scada tbody").html("");
    }

    dtChiTietCambien = $("#tbl_chitiet_cambien_scada").DataTable({
        processing: true,
        serverSide: true,
        searching: false,
        ajax: function (data, callback) {
            $("#popup-loading").show();

            $.ajax({
                url: "/api/giamsat/chitiet-cambien",
                method: "POST",
                data: {
                    id_thietbi: $("#btnthuchien_chitiet_cambien_scada").data("id_thietbi"),
                    id_cambien: $("#btnthuchien_chitiet_cambien_scada").data("id_cambien"),
                    ioa_diachi: $("#btnthuchien_chitiet_cambien_scada").data("ioa_diachi"),
                    tu_ngay: $("#txttungay_cambien_scada").val(),
                    den_ngay: $("#txtdenngay_cambien_scada").val(),
                    skip: data.start,
                    limit: data.length
                },
                success: function (res) {
                    $("#popup-loading").hide();
                    let rows = res?.data || res?.rows || res || [];
                    let total = Number(res?.total || (rows.length ? (rows[0]?.total || rows.length) : 0));

                    const mappedRows = rows.map(item => ({
                        time: item?.TIME ?? item?.time ?? item?.thoidiem ?? item?.THOIDIEM ?? "-",
                        nhietdo: getScaledValue(item)
                    }));

                    callback({
                        draw: data.draw,
                        recordsTotal: total,
                        recordsFiltered: total,
                        data: mappedRows
                    });
                },
                error: function (xhr, status, err) {
                    $("#popup-loading").hide();
                    console.error("Lỗi tải chi tiết cảm biến:", err);
                    callback({ draw: data.draw, recordsTotal: 0, recordsFiltered: 0, data: [] });
                }
            });
        },
        columns: [
            {
                data: null,
                className: "text-center",
                width: "50px",
                render: function (data, type, row, meta) {
                    return meta.row + meta.settings._iDisplayStart + 1;
                }
            },
            { data: "time", className: "text-center", render: d => d || "-" },
            { data: "nhietdo", className: "text-center", render: d => d != null ? d : "-" }
        ],
        language: {
            sProcessing: "Đang xử lý...",
            sLengthMenu: "Xem _MENU_ bản ghi",
            sZeroRecords: "Không tìm thấy dòng nào phù hợp",
            sInfo: "Đang xem _START_ đến _END_ trong tổng số _TOTAL_ bản ghi",
            sInfoEmpty: "Đang xem 0 đến 0 trong tổng số 0 bản ghi",
            sInfoFiltered: "(được lọc từ _MAX_ bản ghi)",
            sSearch: "Tìm:",
            oPaginate: { sFirst: "Đầu", sPrevious: "Trước", sNext: "Tiếp", sLast: "Cuối" }
        },
        columnDefs: [{ targets: "_all", className: "text-center align-middle" }]
    });
}

function getScaledValue(row) {
    const value = Number(row?.VALUE ?? row?.value ?? 0);
    const scale = Number(row?.IOA_SCALE ?? row?.ioa_scale ?? 1);
    const result = value * scale;
    return Number.isFinite(result) ? result.toFixed(2) : null;
}

function moPopupChiTietCambien(id_thietbi, id_cambien, ioa_diachi, tencambien, tungay, denngay) {
    openPopupChiTietCambienCoDay(id_thietbi, id_cambien, ioa_diachi, tencambien, tungay, denngay);
}

$(document).on("click", "#btnthuchien_chitiet_cambien_scada", function () {
    if ($.fn.DataTable.isDataTable("#tbl_chitiet_cambien_scada")) {
        $("#tbl_chitiet_cambien_scada").DataTable().ajax.reload();
    } else {
        initDataTableChiTietCambien();
    }
});

$(document).on("click", "#btnExportExcelChiTietCambien", function () {
    const params = $.param({
        id_thietbi: $("#btnthuchien_chitiet_cambien_scada").data("id_thietbi"),
        id_cambien: $("#btnthuchien_chitiet_cambien_scada").data("id_cambien"),
        ioa_diachi: $("#btnthuchien_chitiet_cambien_scada").data("ioa_diachi"),
        type: $("#btnthuchien_chitiet_cambien_scada").data("type"),
        tu_ngay: $("#txttungay_cambien_scada").val(),
        den_ngay: $("#txtdenngay_cambien_scada").val(),
        fileName: $(".title_cambien").html()
    });
    window.open("/api/giamsat/export-chitiet-cambien-excel?" + params, "_blank");
});
function initScadaDataTableAfterRender(tableSelector, page = 5) {

    if (!tableSelector) return;

    if (!String(tableSelector).startsWith("#")) {
        tableSelector = "#" + tableSelector;
    }

    const $table = $(tableSelector);
    if (!$table.length) return;

    if ($.fn.DataTable.isDataTable(tableSelector)) {
        $table.DataTable().clear().destroy();
    }

    const tableId = $table.attr("id");

    $table.DataTable({
        paging: true,
        pageLength: page,
        lengthMenu: [[5, 10, 20, 50, 100],
        [5, 10, 20, 50, 100]],
        searching: false,
        ordering: false,
        info: true,
        autoWidth: false,
        destroy: true,

        dom:
            "<'row mb-2 align-items-center'<'col-sm-6'l><'col-sm-6 text-end'B>>" +
            "<'scada-dt-table-scroll't>" +
            "<'row mt-2 align-items-center'<'col-sm-6'i><'col-sm-6 text-end'p>>",

        buttons: [
            {
                text: '<i class="fa fa-file-excel"></i> Xuất Excel',
                className: 'btn btn-success btn-sm',
                action: function () {
                    exportTableToExcelFull(
                        "#" + tableId,
                        tableId || "bao_cao_scada"
                    );
                }
            }
        ],

        language: {
            sProcessing: "Đang xử lý...",
            sLengthMenu: "Xem _MENU_ bản ghi",
            sZeroRecords: "Không có dữ liệu",
            sInfo: "Đang xem _START_ đến _END_ trong tổng số _TOTAL_ bản ghi",
            sInfoEmpty: "Đang xem 0 đến 0 trong tổng số 0 bản ghi",
            oPaginate: {
                sFirst: "Đầu",
                sPrevious: "Trước",
                sNext: "Tiếp",
                sLast: "Cuối"
            }
        }
    });
}

function formatDateTimeVN(dateStr) {
    if (!dateStr) return "";

    const raw = String(dateStr).trim();

    // đã là dạng dd/MM/yyyy HH:mm:ss thì giữ nguyên
    if (/^\d{2}\/\d{2}\/\d{4}\s+\d{2}:\d{2}:\d{2}$/.test(raw)) {
        return raw;
    }

    const d = new Date(raw);
    if (isNaN(d)) return raw;

    const pad = n => String(n).padStart(2, "0");

    return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} `
        + `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

function exportTableToExcel(tableId, fileName) {
    const table = document.getElementById(tableId);
    if (!table) return;

    const allRows = Array.from(table.querySelectorAll("tr"));
    if (!allRows.length) return;

    const headerRowCount = table.querySelectorAll("thead tr").length || 1;

    const aoa = [];
    const merges = [];
    const occupied = {};
    const colWidths = [];
    const timeCols = new Set();

    // build AOA + merges
    allRows.forEach((row, r) => {
        aoa[r] = aoa[r] || [];
        const cells = Array.from(row.children);
        let c = 0;

        cells.forEach(cell => {
            while (occupied[`${r}_${c}`]) c++;

            const tag = cell.tagName.toLowerCase();
            const colspan = Number(cell.getAttribute("colspan") || 1);
            const rowspan = Number(cell.getAttribute("rowspan") || 1);

            let text = (cell.innerText || cell.textContent || "").trim();

            // detect cột thời gian ở header
            if (tag === "th") {
                const lower = text.toLowerCase();
                if (lower.includes("thời điểm") || lower.includes("thời gian")) {
                    for (let k = 0; k < colspan; k++) {
                        timeCols.add(c + k);
                    }
                }
            }

            // format thời gian cho body
            if (tag === "td" && timeCols.has(c)) {
                text = formatDateTimeVN(text);
            }

            aoa[r][c] = text;

            const w = String(text || "").length + 2;
            colWidths[c] = Math.max(colWidths[c] || 10, w);

            if (rowspan > 1 || colspan > 1) {
                merges.push({
                    s: { r, c },
                    e: { r: r + rowspan - 1, c: c + colspan - 1 }
                });

                for (let rr = 0; rr < rowspan; rr++) {
                    for (let cc = 0; cc < colspan; cc++) {
                        if (rr !== 0 || cc !== 0) {
                            occupied[`${r + rr}_${c + cc}`] = true;
                        }
                    }
                }
            }

            c++;
        });
    });

    const ws = XLSX.utils.aoa_to_sheet(aoa);

    // merge cells
    ws["!merges"] = merges;

    // width columns
    ws["!cols"] = colWidths.map(w => ({
        wch: Math.min(Math.max(w, 10), 40)
    }));

    const range = XLSX.utils.decode_range(ws["!ref"]);

    // style toàn sheet + ép cột thời gian là string
    for (let r = 0; r <= range.e.r; r++) {
        for (let c = 0; c <= range.e.c; c++) {
            const addr = XLSX.utils.encode_cell({ r, c });
            const cell = ws[addr];
            if (!cell) continue;

            // border chung
            cell.s = cell.s || {};
            cell.s.border = {
                top: { style: "thin", color: { rgb: "999999" } },
                bottom: { style: "thin", color: { rgb: "999999" } },
                left: { style: "thin", color: { rgb: "999999" } },
                right: { style: "thin", color: { rgb: "999999" } }
            };

            // header
            if (r < headerRowCount) {
                cell.s.font = { bold: true };
                cell.s.fill = {
                    patternType: "solid",
                    fgColor: { rgb: "D9EAF7" }
                };
                cell.s.alignment = {
                    horizontal: "center",
                    vertical: "center",
                    wrapText: true
                };
            } else {
                // body
                if (timeCols.has(c)) {
                    cell.t = "s";
                    cell.v = String(cell.v || "");
                    cell.z = "@";
                    cell.s.alignment = {
                        horizontal: "center",
                        vertical: "center"
                    };
                } else {
                    cell.s.alignment = {
                        horizontal: "right",
                        vertical: "center"
                    };

                    // cột text đầu bảng thường căn trái
                    if (c === 1) {
                        cell.s.alignment = {
                            horizontal: "left",
                            vertical: "center"
                        };
                    }

                    // cột STT / IOA thường căn giữa
                    if (c === 0) {
                        cell.s.alignment = {
                            horizontal: "center",
                            vertical: "center"
                        };
                    }
                }
            }
        }
    }

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

    const name = fileName + "_" + ($(".point_name_on_page").text() || "bao_cao").trim();
    XLSX.writeFile(wb, `${name}.xlsx`);
}
$(document).off("click", ".btn-export-scada").on("click", ".btn-export-scada", function () {
    const tableId = $(this).data("table");
    const fileName = $(this).data("filename") || "bao_cao_scada";

    exportTableToExcelFull("#" + tableId, fileName);
});
function openPopupChiTietTrangThaiCanhBao(
    ioa,
    title,
    id_thietbi,
    tencambien,
    id_cambien,
    tungay,
    denngay
) {
    $(".title_cambien").html(tencambien || title || "");

    $("#popup-content").html(`
        <table class="table table-bordered" id="tbl_chitiet_cambien_scada">
            <thead>
                <tr>
                    <th>STT</th>
                    <th>Thời gian</th>
                    <th>Trạng thái</th>
                </tr>
            </thead>
            <tbody></tbody>
        </table>
    `);

    $("#btnthuchien_chitiet_cambien_scada").data({
        id_thietbi,
        id_cambien,
        ioa_diachi: ioa,
        type: "giamsatcoday"
    });

    $("#txttungay_cambien_scada").val(tungay || "");
    $("#txtdenngay_cambien_scada").val(denngay || "");

    $("#popupChitietCambienCoday")
        .off("shown.bs.modal")
        .on("shown.bs.modal", function () {
            initDataTableChiTietGiamsatTrangThai("giamsatcoday");
        });

    $("#popupChitietCambienCoday").modal("show");
}
function getTrangThaiCanhBao(value) {
    const str = String(value ?? "").trim();

    const isOn = str === "0";

    return {
        isOn,
        text: isOn ? "ON" : "OFF",
        className: isOn ? "bg-danger" : "bg-success"
    };
}

function initDataTableChiTietGiamsatTrangThai(type) {
    if ($.fn.DataTable.isDataTable("#tbl_chitiet_cambien_scada")) {
        $("#tbl_chitiet_cambien_scada").DataTable().destroy();
        $("#tbl_chitiet_cambien_scada tbody").html("");
    }

    dtChiTietCambien = $("#tbl_chitiet_cambien_scada").DataTable({
        processing: true,
        serverSide: true,
        searching: false,
        ajax: function (data, callback) {
            $("#popup-loading").show();

            $.ajax({
                url: "/api/giamsat/chitiet-cambien",
                method: "POST",
                data: {
                    id_thietbi: $("#btnthuchien_chitiet_cambien_scada").data("id_thietbi"),
                    id_cambien: $("#btnthuchien_chitiet_cambien_scada").data("id_cambien"),
                    ioa_diachi: $("#btnthuchien_chitiet_cambien_scada").data("ioa_diachi"),
                    tu_ngay: $("#txttungay_cambien_scada").val(),
                    den_ngay: $("#txtdenngay_cambien_scada").val(),
                    skip: data.start,
                    limit: data.length
                },
                success: function (res) {
                    $("#popup-loading").hide();

                    const rows = res?.data || res?.rows || res || [];
                    const total = Number(
                        res?.total || (rows.length ? (rows[0]?.total || rows.length) : 0)
                    );

                    const mappedRows = rows.map(item => {
                        const status = getTrangThaiCanhBao(item?.VALUE ?? item?.value);
                        return {
                            time: item?.TIME ?? item?.time ?? item?.thoidiem ?? item?.THOIDIEM ?? "-",
                            trangthai: status
                        };
                    });

                    callback({
                        draw: data.draw,
                        recordsTotal: total,
                        recordsFiltered: total,
                        data: mappedRows
                    });
                },
                error: function (xhr, status, err) {
                    $("#popup-loading").hide();
                    console.error("Lỗi tải chi tiết trạng thái cảnh báo:", err);
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
                data: null,
                className: "text-center",
                width: "50px",
                render: function (data, type, row, meta) {
                    return meta.row + meta.settings._iDisplayStart + 1;
                }
            },
            {
                data: "time",
                className: "text-center",
                render: function (d) {
                    return d || "-";
                }
            },
            {
                data: "trangthai",
                className: "text-center",
                render: function (d) {
                    if (!d) return "-";
                    return `<span class="badge ${d.className}">${d.text}</span>`;
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
        columnDefs: [
            { targets: "_all", className: "text-center align-middle" }
        ]
    });
}
function exportTableToExcelFull(tableSelector, fileName) {
    const table = document.querySelector(tableSelector);

    if (!table) return;

    const aoa = [];
    const merges = [];
    const occupied = {};
    const colWidths = [];

    const rows = [];

    table.querySelectorAll("thead tr").forEach(tr => rows.push(tr));

    if ($.fn.DataTable.isDataTable(tableSelector)) {
        const dt = $(tableSelector).DataTable();

        dt.rows({ search: "applied" }).every(function (rowIdx) {
            rows.push(dt.row(rowIdx).node());
        });
    } else {
        table.querySelectorAll("tbody tr").forEach(tr => rows.push(tr));
    }

    rows.forEach((tr, r) => {
        aoa[r] = aoa[r] || [];

        let c = 0;
        const cells = Array.from(tr.children);

        cells.forEach(cell => {
            while (occupied[`${r}_${c}`]) c++;

            const colspan = Number(cell.getAttribute("colspan") || 1);
            const rowspan = Number(cell.getAttribute("rowspan") || 1);

            const text = (cell.innerText || cell.textContent || "").trim();

            aoa[r][c] = text;

            colWidths[c] = Math.max(colWidths[c] || 10, text.length + 2);

            if (rowspan > 1 || colspan > 1) {
                merges.push({
                    s: { r, c },
                    e: {
                        r: r + rowspan - 1,
                        c: c + colspan - 1
                    }
                });

                for (let rr = 0; rr < rowspan; rr++) {
                    for (let cc = 0; cc < colspan; cc++) {
                        if (rr !== 0 || cc !== 0) {
                            occupied[`${r + rr}_${c + cc}`] = true;
                        }
                    }
                }
            }

            c++;
        });
    });

    const ws = XLSX.utils.aoa_to_sheet(aoa);

    ws["!merges"] = merges;

    ws["!cols"] = colWidths.map(w => ({
        wch: Math.min(Math.max(w, 10), 35)
    }));

    const range = XLSX.utils.decode_range(ws["!ref"]);

    for (let r = 0; r <= range.e.r; r++) {
        for (let c = 0; c <= range.e.c; c++) {
            const addr = XLSX.utils.encode_cell({ r, c });
            const cell = ws[addr];

            if (!cell) continue;

            cell.s = {
                border: {
                    top: { style: "thin", color: { rgb: "999999" } },
                    bottom: { style: "thin", color: { rgb: "999999" } },
                    left: { style: "thin", color: { rgb: "999999" } },
                    right: { style: "thin", color: { rgb: "999999" } }
                },
                alignment: {
                    horizontal: r < table.querySelectorAll("thead tr").length ? "center" : "right",
                    vertical: "center",
                    wrapText: true
                }
            };

            if (r < table.querySelectorAll("thead tr").length) {
                cell.s.font = { bold: true };
                cell.s.fill = {
                    patternType: "solid",
                    fgColor: { rgb: "D9EAF7" }
                };
            }
        }
    }

    const wb = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

    const name = fileName + "_" + ($(".point_name_on_page").text() || "bao_cao").trim();

    XLSX.writeFile(wb, `${name}.xlsx`);
}

async function getThietBi(v_code) {
    try {
        const result = await $.ajax({
            url: "/api/giamsat/get-thietbi-theo-code",
            type: "POST",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: JSON.stringify({
                v_code: v_code
            })
        });

        const $cbo = $("#cbo_thietbi");

        $cbo.empty();
        $cbo.append('<option value="">-- Chọn thiết bị --</option>');

        result.forEach(item => {
            $cbo.append(`
                <option value="${item.id_thietbi}">
                    ${item.tenthietbi}
                </option>
            `);
        });

        // Nếu dùng Select2
        $cbo.trigger('change');

    } catch (err) {
        console.error("Lỗi khi lấy dữ liệu thiết bị:", err);
    }
}
