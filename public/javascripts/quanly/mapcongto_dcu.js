// ========================= THÔNG TIN DCU =========================
var is_imei = "";
var is_ip = "";
var is_port = "";

// ========================= LOAD MODAL =========================
function Load_data_modal_CTO(imei, ip, port) {
    is_imei = imei;
    is_ip = ip;
    is_port = port;

    $("#lbl_map_imei").text(imei || "--");
    $("#lbl_map_ip").text(ip || "--");
    $("#lbl_map_port").text(port || "--");

    resetMapSteps();
    updateMapStatus("Đang tải danh sách công tơ...", "info");

    const para = {
        v_imei: imei != null ? String(imei).trim() : "",
        v_danhmucid: -1
    };

    const url = "/api/quanly_ds_congto_byimei";
    const lst = ExecuteServiceSyns(JSON.stringify(para), url);

    let data = [];
    try {
        data = Array.isArray(lst)
            ? lst.map(x => (typeof x === "string" ? JSON.parse(x) : x))
            : [];
    } catch (e) {
        console.error("Parse danh sách công tơ lỗi:", e);
        data = [];
    }

    renderMapCongToResult(data);
    updateMapStatus("Sẵn sàng cập nhật công tơ xuống DCU.", "info");
}

// ========================= STEP UI =========================
function resetMapSteps() {
    $(".map-step-item").removeClass("active done");
    $("#step_1").addClass("active");
}

function setMapStep(step) {
    $(".map-step-item").removeClass("active done");

    for (let i = 1; i < step; i++) {
        $("#step_" + i).addClass("done");
    }

    $("#step_" + step).addClass("active");
}

function updateMapStatus(message, type = "info") {
    const $box = $("#map_status_box");
    $box.removeClass("alert-info alert-success alert-danger alert-warning");
    $box.addClass("alert-" + type);
    $("#map_status_text").text(message);
}



// ========================= TABLE DATA =========================
function getSelectedMetersFromTable() {
    const selected = [];
    $("#tbl_hsnhanngoai_suacts tbody tr").each(function () {
        const $row = $(this);
        selected.push({
            madiemdo: String($row.attr("data-madiemdo") || "").trim(),
            ten_khachhang: String($row.attr("data-tenkhachhang") || "").trim(),
            imei: String($row.attr("data-imei") || "").trim(),
            socongto: String($row.attr("data-socongto") || "").trim()
        });
    });
    return selected;
}

function renderMapCongToResult(lst) {
    let rows = "";

    if (!Array.isArray(lst) || lst.length === 0) {
        $("#tbl_hsnhanngoai_suacts tbody").html(`
            <tr>
                <td colspan="7" class="text-center">Không có dữ liệu</td>
            </tr>
        `);
        return;
    }

    lst.forEach((item, index) => {
        const imei = item?.imei ?? "";
        const madiemdo = item?.madiemdo ?? "";
        const ten_khachhang = item?.ten_khachhang ?? "";
        const socongto = item?.socongto ?? "";
        const status = item?.status ?? "";
        const isSuccess = item?.success === true;

        const statusHtml = status
            ? `<span class="${isSuccess ? "text-xanh" : "text-do"}">${retNull(status)}</span>`
            : "";

        rows += `
            <tr 
                data-imei="${escapeHtml(String(imei))}"
                data-madiemdo="${escapeHtml(String(madiemdo))}"
                data-tenkhachhang="${escapeHtml(String(ten_khachhang))}"
                data-socongto="${escapeHtml(String(socongto))}"
            >
              
                <td class="text-center">${index + 1}</td>
                <td>${retNull(madiemdo)}</td>
                <td>${retNull(ten_khachhang)}</td>
                <td>${retNull(imei)}</td>
                <td>${retNull(socongto)}</td>
                <td class="col-status">${statusHtml}</td>
            </tr>
        `;
    });

    $("#tbl_hsnhanngoai_suacts tbody").html(rows);
}

function updateMapCongToStatus(details) {
    if (!Array.isArray(details) || !details.length) return;

    const detailMap = new Map();

    details.forEach(item => {
        const key = [
            String(item.madiemdo || "").trim(),
            String(item.socongto || "").trim()
        ].join("|");

        detailMap.set(key, item);
    });

    $("#tbl_hsnhanngoai_suacts tbody tr").each(function () {
        const $row = $(this);

        const key = [
            String($row.attr("data-madiemdo") || "").trim(),
            String($row.attr("data-socongto") || "").trim()
        ].join("|");

        const matched = detailMap.get(key);
        if (!matched) return;

        const isSuccess = matched.success === true;
        const statusText = retNull(matched.status || "");
        const statusClass = isSuccess ? "text-xanh" : "text-do";

        $row.find(".col-status").html(
            `<span class="${statusClass}">${statusText}</span>`
        );
    });
}

// ========================= API SEND MAP =========================
async function sendMapCongToToDCU() {

    try {
        const imei = String(is_imei || "").trim();
        const ip = String(is_ip || "").trim();
        const port = Number(is_port);
        const meters = getSelectedMetersFromTable();
        if (!confirm(`Bạn có chắc muốn cập nhật ${meters.length} công tơ xuống DCU không?`)) {
            return;
        }
        if (!imei) {
            updateMapStatus("Không xác định được IMEI DCU...", "danger");
            return;
        }

        if (!ip) {
            updateMapStatus("Không xác định được IP DCU", "danger");
            return;
        }

        if (!Number.isFinite(port) || port <= 0) {
            updateMapStatus("Port DCU không hợp lệ", "danger");
            return;
        }
        setMapStep(2);
        updateMapStatus("Đang gửi lệnh cập nhật công tơ xuống DCU...", "warning");

        const res = await fetch("/api/quanly_mapcto_modem_dcu", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                imei,
                ip,
                port,
                list: meters
            })
        });

        setMapStep(3);
        updateMapStatus("Đang nhận phản hồi từ DCU...", "warning");

        let result = null;
        try {
            result = await res.json();
        } catch (e) {
            updateMapStatus("API trả về dữ liệu không hợp lệ", "danger");
            return;
        }

        if (!res.ok) {
            updateMapStatus(result?.message || `Lỗi HTTP ${res.status}`, "danger");
            return;
        }

        if (!result?.success) {
            updateMapStatus(result?.message || "Gửi lệnh thất bại", "danger");
            return;
        }

        if (Array.isArray(result.data?.details)) {
            updateMapCongToStatus(result.data.details);
        }

        setMapStep(4);
        updateMapStatus(result.message || "Cập nhật công tơ vào DCU thành công", "success");
    } catch (err) {
        updateMapStatus(err?.message || "Lỗi gửi lệnh cập nhật công tơ", "danger");
    }
}

// ========================= HELPER =========================
function escapeHtml(value) {
    if (value === null || value === undefined) return "";
    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}