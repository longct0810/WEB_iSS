
let instantReadTimer = null;
let instantReadStartedAt = null;
let instantReadFinishedAt = null;
let currentRows = [];
let isReadingStream = false;
let currentReadAbortController = null;

$(document).ready(function () {
    handleSidebarNode();
    bindDocTucThoiEvents();

});

function handleSidebarNode() {
    const node = JSON.parse(localStorage.getItem("node") || "{}");

    $(".page").show();
    hideThongBao("#thongbao_doctucthoi");
    f_loadDSKhachHang(node?.id ? String(node.id) : '');

    $(document).off("change", "#chk_all").on("change", "#chk_all", function () {
        const checked = $(this).is(":checked");
        $("#tbl_doctucthoi_khachhang .row-check").prop("checked", checked);
        $("#tbl_doctucthoi_khachhang tbody tr").toggleClass("selected", checked);
    });

    $(document).off("change", ".row-check").on("change", ".row-check", function () {
        const total = $(".row-check").length;
        const checked = $(".row-check:checked").length;

        $("#chk_all").prop("checked", total > 0 && total === checked);
        $(this).closest("tr").toggleClass("selected", $(this).is(":checked"));
    });
}

function bindDocTucThoiEvents() {
    $(document).off("click", "#btnDocTucThoi").on("click", "#btnDocTucThoi", async function () {
        await docTucThoiKhachHang();
    });

    $(document).off("click", "#btnHuyDocTucThoi").on("click", "#btnHuyDocTucThoi", function () {
        cancelCurrentRead();
    });

    $(document).off("input", ".search-box input").on("input", ".search-box input", function () {
        const keyword = String($(this).val() || "").trim().toLowerCase();

        $("#tbl_doctucthoi_khachhang tbody tr").each(function () {
            const text = $(this).text().toLowerCase();
            $(this).toggle(text.includes(keyword));
        });
    });
}

async function f_loadDSKhachHang(code) {
    if (!code) {
        showThongBao("Vui lòng chọn trạm ở cây thư mục", "#thongbao_doctucthoi");
        $("#tbl_doctucthoi_khachhang tbody").html(`
            <tr>
                <td colspan="9" class="text-center">Vui lòng chọn trạm</td>
            </tr>
        `);
        return;
    }

    hideThongBao("#thongbao_doctucthoi");

    try {
        const res = await request("/api/doctucthoi/getdskh", "POST", { code });

        if (!Array.isArray(res) || !res.length) {
            currentRows = [];
            $("#tbl_doctucthoi_khachhang tbody").html(`
                <tr>
                    <td colspan="9" class="text-center">Không có dữ liệu</td>
                </tr>
            `);
            updateSummary();
            resetProgressUI();
            return;
        }

        currentRows = res.map((item, index) => ({
            rowId: index + 1,
            madiemdo: item.madiemdo || "",
            ten_khachhang: item.ten_khachhang || "",
            imei: item.imei || "",
            socongto: item.socongto || "",
            chisokwh: null,
            thoigiandoc: null,
            trangthai: "Chưa đọc",
            ip: item.ip || "",
            port: item.port || "",
            raw: item
        }));

        drawData(currentRows);
        updateSummary();
        resetProgressUI();
    } catch (err) {
        console.error("Lỗi load danh sách khách hàng:", err);
        $("#tbl_doctucthoi_khachhang tbody").html(`
            <tr>
                <td colspan="9" class="text-center text-danger">Có lỗi khi tải dữ liệu</td>
            </tr>
        `);
        updateSummary();
    }
}

function drawData(rows) {
    let html = "";

    rows.forEach((item, index) => {
        const stt = String(index + 1).padStart(2, "0");

        html += `
            <tr data-row-id="${item.rowId}">
                <td style="width:56px;">
                    <input
                        class="chk row-check"
                        type="checkbox"
                        data-row-id="${item.rowId}"
                        data-socongto="${escapeHtml(item.socongto)}"
                        data-imei="${escapeHtml(item.imei)}"
                        data-madiemdo="${escapeHtml(item.madiemdo)}"
                        data-tenkhachhang="${escapeHtml(item.ten_khachhang)}"
                        data-ip="${escapeHtml(item.ip)}"
                        data-port="${escapeHtml(item.port)}"
                    />
                </td>
                <td style="width:80px;" class="meter-name text-center">${stt}</td>
                <td><div class="meter-name">${escapeHtml(item.madiemdo)}</div></td>
                <td><div class="meter-name">${escapeHtml(item.ten_khachhang)}</div></td>
                <td><span class="meter-name">${escapeHtml(item.imei)}</span></td>
                <td><span class="meter-name text-center">${escapeHtml(item.socongto)}</span></td>
                <td class="meter-name text-center col-chiso">${formatChiSo(item.chisokwh)}</td>
                <td class="meter-name text-center col-thoigian">${formatDateTime(item.thoigiandoc)}</td>
                <td class="meter-name text-center col-trangthai">${renderTrangThai(item.trangthai, item.chisokwh)}</td>
            </tr>
        `;
    });

    $("#tbl_doctucthoi_khachhang tbody").html(html);
}

function getSelectedMeters() {
    const selected = [];

    $("#tbl_doctucthoi_khachhang .row-check:checked").each(function () {
        const $chk = $(this);

        selected.push({
            rowId: Number($chk.data("row-id")),
            socongto: String($chk.data("socongto") || "").trim(),
            imei: String($chk.data("imei") || "").trim(),
            madiemdo: String($chk.data("madiemdo") || "").trim(),
            ten_khachhang: String($chk.data("tenkhachhang") || "").trim(),
            ip: String($chk.data("ip") || "").trim(),
            port: String($chk.data("port") || "").trim()
        });
    });

    return selected.filter(x => x.socongto && x.imei);
}

async function docTucThoiKhachHang() {
    if (isReadingStream) {
        toastr.warning("Đang có phiên đọc tức thời chạy", "Thông báo", {
            positionClass: "toast-bottom-right",
            timeOut: 2500,
            closeButton: true,
            progressBar: true
        });
        return;
    }

    const selected = getSelectedMeters();

    if (!selected.length) {
        toastr.error("Vui lòng chọn ít nhất 1 công tơ", "Thông báo", {
            positionClass: "toast-bottom-right",
            timeOut: 3000,
            closeButton: true,
            progressBar: true
        });
        return;
    }
    // kiểm tra ip/port
    const missingConfig = selected.filter(x => !x.ip || !x.port);

    if (missingConfig.length > 0) {

        missingConfig.forEach(item => {
            updateRowResult(item.rowId, {
                chisokwh: null,
                thoigiandoc: null,
                trangthai: "Chưa cài IP/Port"
            });
        });

        toastr.error(
            `Có ${missingConfig.length} công tơ chưa cài IP/Port`,
            "Thông báo",
            {
                positionClass: "toast-bottom-right",
                timeOut: 4000,
                closeButton: true,
                progressBar: true
            }
        );

        return;
    }
    setButtonLoading(true);
    startInstantReadTimer();

    currentReadAbortController = new AbortController();

    try {
        markRowsPending(selected);

        const payload = {
            list: selected.map(x => ({
                rowId: x.rowId,
                socongto: x.socongto,
                imei: x.imei,
                madiemdo: x.madiemdo,
                ten_khachhang: x.ten_khachhang,
                ip: x.ip,
                port: x.port
            }))
        };

        await streamDocTucThoi(
            "/api/doctucthoi/doctucthoi_tcp",
            payload,
            currentReadAbortController.signal
        );
    } catch (err) {
        console.error("Lỗi đọc tức thời:", err);

        if (err.name === "AbortError") {
            markRowsError(selected, "Đã hủy đọc");
            finishInstantReadTimer("Đã hủy");

            $(".pill-blue")
                .removeClass("is-running is-success")
                .addClass("is-error")
                .html("⛔ Đã hủy phiên đọc");

            return;
        }

        markRowsError(selected, err?.message || "Không phản hồi");
        finishInstantReadTimer("Lỗi");

        $(".pill-blue")
            .removeClass("is-running is-success")
            .addClass("is-error")
            .html("❌ Có lỗi trong quá trình đọc");

        toastr.error(err?.message || "Có lỗi khi đọc dữ liệu", "Thông báo", {
            positionClass: "toast-bottom-right",
            timeOut: 4000,
            closeButton: true,
            progressBar: true
        });
    } finally {
        currentReadAbortController = null;
        setButtonLoading(false);
        updateSummary();
    }
}

function cancelCurrentRead() {
    if (!isReadingStream || !currentReadAbortController) {
        return;
    }

    currentReadAbortController.abort();
}

async function streamDocTucThoi(url, payload, signal) {
    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload),
        signal
    });

    if (!response.ok) {
        let message = `HTTP ${response.status}`;
        try {
            const json = await response.json();
            message = json?.message || message;
        } catch (_) { }
        throw new Error(message);
    }

    if (!response.body) {
        throw new Error("Trình duyệt không hỗ trợ stream response");
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");
    let buffer = "";

    while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        const blocks = buffer.split("\n\n");
        buffer = blocks.pop() || "";

        for (const block of blocks) {
            const parsed = parseSSEBlock(block);
            if (!parsed) continue;
            handleStreamEvent(parsed.event, parsed.data);
        }
    }

    if (buffer.trim()) {
        const parsed = parseSSEBlock(buffer);
        if (parsed) {
            handleStreamEvent(parsed.event, parsed.data);
        }
    }
}

function parseSSEBlock(block) {
    const lines = String(block || "").split("\n");
    let eventName = "message";
    const dataLines = [];

    for (const line of lines) {
        if (line.startsWith("event:")) {
            eventName = line.slice(6).trim();
        } else if (line.startsWith("data:")) {
            dataLines.push(line.slice(5).trim());
        }
    }

    if (!dataLines.length) return null;

    try {
        return {
            event: eventName,
            data: JSON.parse(dataLines.join("\n"))
        };
    } catch (err) {
        console.error("Không parse được SSE data:", err);
        return null;
    }
}

function handleStreamEvent(eventName, data) {
    if (!data) return;

    if (eventName === "start") {
        $(".pill-blue")
            .removeClass("is-success is-error")
            .addClass("is-running")
            .html("⏳ Đang gửi lệnh và chờ phản hồi");

        updateProgressText(data.progress);
        return;
    }

    if (eventName === "row") {
        applyStreamRow(data);
        updateProgressText(data.progress);
        return;
    }

    if (eventName === "done") {
        updateProgressText(data.progress);

        $(".pill-blue")
            .removeClass("is-running is-error")
            .addClass("is-success")
            .html("✅ Hoàn thành đọc tức thời");

        finishInstantReadTimer("Hoàn thành");

        toastr.success("Đọc tức thời hoàn thành", "Thông báo", {
            positionClass: "toast-bottom-right",
            timeOut: 3000,
            closeButton: true,
            progressBar: true
        });
        return;
    }

    if (eventName === "error") {
        const msg = data.message || "Có lỗi xảy ra";

        $(".pill-blue")
            .removeClass("is-running is-success")
            .addClass("is-error")
            .html("❌ Có lỗi trong quá trình đọc");

        finishInstantReadTimer("Lỗi");

        toastr.error(msg, "Thông báo", {
            positionClass: "toast-bottom-right",
            timeOut: 4000,
            closeButton: true,
            progressBar: true
        });
    }
}

function applyStreamRow(item) {
    if (!item) return;

    const status = item.status || item.trangthai || "";
    const chiSo = item.chisokwh ?? null;
    const thoiGian = item.thoigiandoc ?? null;
    const attempt = Number(item.attempt || 1);

    let finalStatus = mapStreamStatus(status, chiSo);

    if (attempt > 1 && finalStatus === "Có dữ liệu") {
        finalStatus = `Có dữ liệu (retry ${attempt})`;
    }

    updateRowResult(item.rowId, {
        chisokwh: chiSo,
        thoigiandoc: thoiGian,
        trangthai: finalStatus
    });
}

function mapStreamStatus(status, chiSo) {
    const s = String(status || "").trim().toLowerCase();

    if (chiSo !== null && chiSo !== undefined && chiSo !== "") {
        return "Có dữ liệu";
    }

    if (
        s.includes("không phản hồi") ||
        s.includes("khong phan hoi") ||
        s.includes("timeout") ||
        s.includes("error")
    ) {
        return "Không phản hồi";
    }

    if (
        s.includes("chờ") ||
        s.includes("dang cho") ||
        s.includes("running") ||
        s.includes("pending")
    ) {
        return "Chờ kết quả";
    }

    if (
        s.includes("0 bản ghi") ||
        s.includes("0 ban ghi") ||
        s.includes("chưa lấy được dữ liệu db") ||
        s.includes("không có dữ liệu")
    ) {
        return "Có 0 bản ghi";
    }

    if (
        s.includes("không thành công") ||
        s.includes("khong thanh cong")
    ) {
        return "Không phản hồi";
    }

    return status || "Chưa có dữ liệu";
}

function updateProgressText(progress) {
    if (!progress) return;

    const processed = Number(progress.processed || 0);
    const total = Number(progress.total || 0);
    const success = Number(progress.success || 0);
    const error = Number(progress.error || 0);

    $(".table-sub").text(`Đọc thành công ${success}/${total} khách hàng`);

    if (isReadingStream) {
        $(".pill-blue")
            .removeClass("is-success is-error")
            .addClass("is-running")
            .html(`⏳ Đã xử lý ${processed}/${total} | Thành công: ${success} | Lỗi: ${error}`);
    }
}

function markRowsPending(selected) {
    selected.forEach(item => {
        updateRowResult(item.rowId, {
            chisokwh: null,
            thoigiandoc: null,
            trangthai: "Chờ kết quả"
        });
    });
}

function markRowsError(selected, message) {
    selected.forEach(item => {
        updateRowResult(item.rowId, {
            chisokwh: null,
            thoigiandoc: null,
            trangthai: message || "Không phản hồi"
        });
    });
}

function updateRowResult(rowId, data) {
    const row = currentRows.find(x => x.rowId === rowId);
    if (!row) return;

    if (Object.prototype.hasOwnProperty.call(data, "chisokwh")) {
        row.chisokwh = data.chisokwh;
    }
    if (Object.prototype.hasOwnProperty.call(data, "thoigiandoc")) {
        row.thoigiandoc = data.thoigiandoc;
    }
    if (Object.prototype.hasOwnProperty.call(data, "trangthai")) {
        row.trangthai = data.trangthai;
    }

    const $tr = $(`#tbl_doctucthoi_khachhang tbody tr[data-row-id="${rowId}"]`);
    if (!$tr.length) return;

    $tr.find(".col-chiso").html(formatChiSo(row.chisokwh));
    $tr.find(".col-thoigian").html(formatDateTime(row.thoigiandoc));
    $tr.find(".col-trangthai").html(renderTrangThai(row.trangthai, row.chisokwh));

    updateSummary();
}

function updateSummary() {
    const total = currentRows.length;
    const successCount = currentRows.filter(x =>
        x.chisokwh !== null && x.chisokwh !== undefined && x.chisokwh !== ""
    ).length;

    $(".table-sub").text(`Đọc thành công ${successCount}/${total} khách hàng`);
}

function setButtonLoading(isLoading) {
    const $btn = $("#btnDocTucThoi");
    $btn.prop("disabled", isLoading);

    if (isLoading) {
        $btn.data("original-text", $btn.text());
        $btn.text("Đang đọc...");
        $(".pill-blue")
            .removeClass("is-success is-error")
            .addClass("is-running")
            .html("⏳ Đang gửi lệnh và chờ phản hồi");
    } else {
        $btn.text($btn.data("original-text") || "Đọc tức thời");
    }
}

function startInstantReadTimer() {
    stopInstantReadTimer(false);

    isReadingStream = true;
    instantReadStartedAt = performance.now();
    instantReadFinishedAt = null;

    renderInstantReadTimer(0, "Đang chạy");

    instantReadTimer = setInterval(() => {
        if (!isReadingStream || instantReadStartedAt === null) return;

        const elapsedMs = performance.now() - instantReadStartedAt;
        renderInstantReadTimer(elapsedMs, "Đang chạy");
    }, 200);
}

function finishInstantReadTimer(label = "Hoàn thành") {
    if (instantReadStartedAt === null) return;

    isReadingStream = false;
    instantReadFinishedAt = performance.now();

    const elapsedMs = instantReadFinishedAt - instantReadStartedAt;
    renderInstantReadTimer(elapsedMs, label);
    stopInstantReadTimer(false);
}

function stopInstantReadTimer(reset = false) {
    if (instantReadTimer) {
        clearInterval(instantReadTimer);
        instantReadTimer = null;
    }

    if (reset) {
        isReadingStream = false;
        instantReadStartedAt = null;
        instantReadFinishedAt = null;
        renderInstantReadTimer(0, "Sẵn sàng");
    }
}

function renderInstantReadTimer(elapsedMs, label) {
    const safeMs = Math.max(0, Number(elapsedMs || 0));
    const totalSeconds = Math.floor(safeMs / 1000);

    const hh = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
    const mm = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0");
    const ss = String(totalSeconds % 60).padStart(2, "0");

    $(".ring span").html(`${hh}:${mm}:${ss}<small>${escapeHtml(label)}</small>`);
}

function resetProgressUI() {
    $(".pill-blue")
        .removeClass("is-running is-success is-error")
        .html("Sẵn sàng đọc dữ liệu");

    stopInstantReadTimer(true);
}

function request(url, method = "GET", data = null) {
    const options = {
        url,
        method,
        contentType: "application/json",
        dataType: "json"
    };

    if (data) {
        options.data = JSON.stringify(data);
    }

    return $.ajax(options);
}

function formatChiSo(value) {
    if (value === null || value === undefined || value === "") {
        return `<span class="muted">-</span>`;
    }

    const num = Number(value);
    if (Number.isNaN(num)) {
        return `<span class="muted">${escapeHtml(String(value))}</span>`;
    }

    return `<span class="num">${num.toLocaleString("vi-VN")}</span>`;
}

function formatDateTime(value) {
    if (!value) return "-";

    if (typeof value === "string") {
        return escapeHtml(value);
    }

    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return "-";

    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const yyyy = d.getFullYear();
    const hh = String(d.getHours()).padStart(2, "0");
    const mi = String(d.getMinutes()).padStart(2, "0");
    const ss = String(d.getSeconds()).padStart(2, "0");

    return `${dd}/${mm}/${yyyy} ${hh}:${mi}:${ss}`;
}

function renderTrangThai(status, chiSo) {
    const s = String(status || "").trim().toLowerCase();

    if (s.includes("không phản hồi") || s.includes("khong phan hoi") || s.includes("error")) {
        return `<span class="badge b-error">${escapeHtml(status || "Không phản hồi")}</span>`;
    }

    if (s.includes("chờ") || s.includes("dang cho") || s.includes("running") || s.includes("pending")) {
        return `<span class="badge b-running">${escapeHtml(status || "Chờ kết quả")}</span>`;
    }

    if (s.includes("0 bản ghi") || s.includes("0 ban ghi") || s.includes("empty")) {
        return `<span class="badge b-empty">${escapeHtml(status || "Có 0 bản ghi")}</span>`;
    }

    if (chiSo !== null && chiSo !== undefined && chiSo !== "") {
        return `<span class="badge b-success">${escapeHtml(status || "Có dữ liệu")}</span>`;
    }

    return `<span class="badge b-empty">${escapeHtml(status || "Chưa có dữ liệu")}</span>`;
}

function escapeHtml(str) {
    return String(str)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

$(document).off("click", "#btnExportExcel").on("click", "#btnExportExcel", function () {

    exportExcelDocTucThoi();
});
async function exportExcelDocTucThoi() {
    if (!currentRows || !currentRows.length) {
        toastr.warning("Không có dữ liệu để xuất");
        return;
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("DocTucThoi");

    // Header
    worksheet.columns = [
        { header: "STT", key: "stt", width: 10 },
        { header: "Mã điểm đo", key: "madiemdo", width: 20 },
        { header: "Tên khách hàng", key: "ten_khachhang", width: 30 },
        { header: "IMEI", key: "imei", width: 20 },
        { header: "Số công tơ", key: "socongto", width: 20 },
        { header: "Chỉ số (kWh)", key: "chisokwh", width: 18 },
        { header: "Thời gian đọc", key: "thoigiandoc", width: 22 },
        { header: "Trạng thái", key: "trangthai", width: 20 }
    ];

    // Style header
    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).alignment = { vertical: "middle", horizontal: "center" };

    // Data
    currentRows.forEach((item, index) => {
        worksheet.addRow({
            stt: index + 1,
            madiemdo: item.madiemdo,
            ten_khachhang: item.ten_khachhang,
            imei: item.imei,
            socongto: item.socongto,
            chisokwh: item.chisokwh ?? "",
            thoigiandoc: item.thoigiandoc ?? "",
            trangthai: item.trangthai ?? ""
        });
    });

    // Border
    worksheet.eachRow((row) => {
        row.eachCell((cell) => {
            cell.border = {
                top: { style: "thin" },
                left: { style: "thin" },
                bottom: { style: "thin" },
                right: { style: "thin" }
            };
        });
    });

    // Export file
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    });

    const now = new Date();
    const fileName = `DocTucThoi_${now.getTime()}.xlsx`;

    saveAs(blob, fileName);
}