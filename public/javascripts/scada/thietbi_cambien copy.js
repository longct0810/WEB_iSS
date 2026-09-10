function handleSidebarNode() { }

(function () {
    "use strict";

    const state = {
        currentStep: 1,

        device: {
            id: null,
            ten_thietbi: "",
            ip_thietbi: "",
            port_thietbi: ""
        },

        sensor: {
            id: null,
            ten_cambien: "",
            giaothuc: "",
            loai_cambien: ""
        },

        ioa: {
            all: [],
            selected: {},
            expanded: {} // mặc định collapse toàn bộ
        }
    };

    function showAlert(message, type = "success") {
        const $alert = $("#alertBox");
        $alert
            .removeClass("d-none alert-success alert-danger alert-warning alert-info")
            .addClass(`alert-${type}`)
            .text(message);

        setTimeout(() => {
            $alert.addClass("d-none").removeClass(`alert-${type}`);
        }, 3000);
    }
    function showMessageAlert(message, type = "success") {
        const $alert = $("#alertBox");
        $alert
            .removeClass("d-none alert-success alert-danger alert-warning alert-info")
            .addClass(`alert-${type}`)
            .text(message);
    }
    function escapeHtml(text) {
        if (text === null || text === undefined) return "";
        return String(text)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    function getErrorMessage(error) {
        if (error && error.responseJSON && error.responseJSON.message) {
            return error.responseJSON.message;
        }
        if (error && error.responseText) {
            return error.responseText;
        }
        return error?.message || "Có lỗi xảy ra";
    }

    function request(url, method = "GET", data = null) {
        const options = {
            url,
            method,
            contentType: "application/json"
        };

        if (data) {
            options.data = JSON.stringify(data);
        }

        return $.ajax(options);
    }

    function isValidIPv4(ip) {
        const regex = /^(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}$/;
        return regex.test(ip);
    }

    function updateStepUI() {
        $(".step-panel").removeClass("active");
        $(`#step${state.currentStep}`).addClass("active");

        $(".step-item").removeClass("active done");

        if (state.currentStep === 1) {
            $("#stepIndicator1").addClass("active");
        }
        if (state.currentStep === 2) {
            $("#stepIndicator1").addClass("done");
            $("#stepIndicator2").addClass("active");
        }
        if (state.currentStep === 3) {
            $("#stepIndicator1").addClass("done");
            $("#stepIndicator2").addClass("done");
            $("#stepIndicator3").addClass("active");
        }

        $("#btnPrev").prop("disabled", state.currentStep === 1);

        if (state.currentStep < 3) {
            $("#btnNext").removeClass("d-none");
            $("#btnFinish").addClass("d-none");
        } else {
            $("#btnNext").addClass("d-none");
            $("#btnFinish").removeClass("d-none");
        }

        $("#btnReset").toggleClass("d-none", !(state.currentStep === 3));
    }

    function fillDeviceSummary() {
        $("#summary_device_name").html(escapeHtml(state.device.ten_thietbi || ""));
        $("#summary_device_ip").html(escapeHtml(state.device.ip_thietbi || ""));
        $("#summary_device_port").html(escapeHtml(state.device.port_thietbi || ""));
        $("#final_device_name").html(escapeHtml(state.device.ten_thietbi || ""));
        $("#device_category_id").val("");
        $("#device_category_name").val("");
        $("#selected_category_text").text("Chưa chọn danh mục");
    }

    function fillSensorSummary() {
        $("#final_sensor_name").html(escapeHtml(state.sensor.ten_cambien || ""));
        $("#final_sensor_protocol").html(escapeHtml(state.sensor.giaothuc || ""));
        $("#final_sensor_type").html(escapeHtml(state.sensor.loai_cambien || ""));
    }

    function normalizeCode(item) {
        return String(
            item.code ??
            item.CODE ??
            item.ma_ioa ??
            item.MA_IOA ??
            ""
        ).trim();
    }

    function normalizeName(item) {
        return String(
            item.ten_ioa ??
            item.TEN_IOA ??
            item.name ??
            item.NAME ??
            ""
        ).trim();
    }

    function normalizeAddress(item) {
        return String(
            item.ioa_diachi ??
            item.IOA_DIACHI ??
            item.diachi ??
            item.DIACHI ??
            ""
        ).trim();
    }

    function normalizeDonvi(item) {
        return String(
            item.donvi ??
            item.DONVI ??
            ""
        ).trim();
    }

    function updateSelectedIoaCount() {
        $("#selectedIoaCount").text(Object.keys(state.ioa.selected).length);
    }

    function renderEmptyIoa(text) {
        $("#ioaList").html(`<div class="empty-box">${escapeHtml(text)}</div>`);
        updateSelectedIoaCount();
    }

    function buildSelectedPayload(item) {
        return {
            code: normalizeCode(item),
            ten_ioa: normalizeName(item),
            ioa_diachi: normalizeAddress(item),
            donvi: normalizeDonvi(item)
        };
    }

    function getAllCodes() {
        return state.ioa.all.map(item => normalizeCode(item)).filter(Boolean);
    }

    function getChildrenCodes(parentCode) {
        return state.ioa.all
            .map(item => normalizeCode(item))
            .filter(code => code.startsWith(parentCode) && code.length > parentCode.length);
    }

    function hasChildren(code) {
        return state.ioa.all.some(item => {
            const childCode = normalizeCode(item);
            return childCode.startsWith(code) && childCode.length > code.length;
        });
    }

    function getDirectChildren(parentCode) {
        if (!parentCode) {
            return state.ioa.all.filter(item => normalizeCode(item).length === 3);
        }

        const parentLen = String(parentCode).length;
        const children = state.ioa.all.filter(item => {
            const code = normalizeCode(item);
            return code.startsWith(parentCode) && code.length > parentLen;
        });

        if (!children.length) return [];

        const minLen = Math.min(...children.map(item => normalizeCode(item).length));
        return children.filter(item => normalizeCode(item).length === minLen);
    }

    function findItemByCode(code) {
        return state.ioa.all.find(item => normalizeCode(item) === code) || null;
    }

    function setSelectedRecursive(code, checked) {
        const affectedCodes = [code, ...getChildrenCodes(code)];

        affectedCodes.forEach(itemCode => {
            const item = findItemByCode(itemCode);
            if (!item) return;

            if (checked) {
                state.ioa.selected[itemCode] = buildSelectedPayload(item);
            } else {
                delete state.ioa.selected[itemCode];
            }
        });
    }

    function isChecked(code) {
        return !!state.ioa.selected[code];
    }

    function getCheckState(code) {
        const selfChecked = isChecked(code);
        const descendants = getChildrenCodes(code);

        if (!descendants.length) {
            return selfChecked ? "checked" : "unchecked";
        }

        const checkedChildren = descendants.filter(childCode => isChecked(childCode)).length;

        if (selfChecked && checkedChildren === descendants.length) {
            return "checked";
        }

        if (selfChecked || checkedChildren > 0) {
            return "partial";
        }

        return "unchecked";
    }

    function renderTreeNodes(parentCode = null, level = 0) {
        const items = getDirectChildren(parentCode);
        if (!items.length) return "";

        let html = `<div class="ioa-tree-level ioa-tree-level-${level}">`;

        items.forEach(item => {
            const code = normalizeCode(item);
            const ten = normalizeName(item);
            const ioaDiaChi = normalizeAddress(item);
            const donvi = normalizeDonvi(item);
            const childExists = hasChildren(code);
            const expanded = !!state.ioa.expanded[code]; // mặc định false => thu gọn
            const checkState = getCheckState(code);
            const showIoaDiaChi = code.length !== 3;

            html += `
                <div class="ioa-tree-node" data-code="${escapeHtml(code)}">
                    <div class="ioa-tree-row border rounded mb-2 p-2 ${expanded ? "expanded" : ""}" style="margin-left:${level * 18}px;">
                        <div class="d-flex align-items-start gap-2">
                            <button type="button"
                                    class="btn btn-sm btn-light border ioa-toggle ${childExists ? "" : "invisible"}"
                                    data-code="${escapeHtml(code)}"
                                    title="${expanded ? "Thu gọn" : "Mở rộng"}"
                                    style="min-width:32px;">
                                ${expanded ? "▾" : "▸"}
                            </button>

                            <div class="form-check flex-grow-1 m-0">
                                <input class="form-check-input ioa-checkbox"
                                       type="checkbox"
                                       value="${escapeHtml(code)}"
                                       id="ioa_${escapeHtml(code)}"
                                       data-code="${escapeHtml(code)}"
                                       data-ten="${escapeHtml(ten)}"
                                       data-diachi="${escapeHtml(ioaDiaChi)}"
                                       data-donvi="${escapeHtml(donvi)}"
                                       ${checkState === "checked" ? "checked" : ""}>

                                <label class="form-check-label w-100" for="ioa_${escapeHtml(code)}">
                                    <div class="fw-semibold">${escapeHtml(ten)}</div>
                                    <div class="text-muted small">Mã: ${escapeHtml(code)}</div>
                                    ${showIoaDiaChi ? `<div class="text-muted small">IOA địa chỉ: ${escapeHtml(ioaDiaChi)}</div>` : ""}
                                    ${donvi ? `<div class="text-muted small">Đơn vị: ${escapeHtml(donvi)}</div>` : ""}
                                </label>
                            </div>
                        </div>
                    </div>

                    ${childExists && expanded ? `
                        <div class="ioa-tree-children">
                            ${renderTreeNodes(code, level + 1)}
                        </div>
                    ` : ""}
                </div>
            `;
        });

        html += `</div>`;
        return html;
    }

    function applyIndeterminateStates() {
        $(".ioa-checkbox").each(function () {
            const code = String($(this).data("code") || "").trim();
            const stateCheck = getCheckState(code);
            this.indeterminate = stateCheck === "partial";
        });
    }

    function renderIoasTree() {
        if (!state.ioa.all.length) {
            renderEmptyIoa("Không có IOA phù hợp");
            return;
        }

        const roots = getDirectChildren(null);
        if (!roots.length) {
            renderEmptyIoa("Không có IOA phù hợp");
            return;
        }

        const html = `
            <div class="mb-3 d-flex gap-2 flex-wrap">
                <button type="button" class="btn btn-outline-secondary btn-sm" id="btnExpandAllTree">Mở tất cả</button>
                <button type="button" class="btn btn-outline-secondary btn-sm" id="btnCollapseAllTree">Thu gọn</button>
            </div>
            <div class="ioa-tree-wrap">
                ${renderTreeNodes(null, 0)}
            </div>
        `;

        $("#ioaList").html(html);
        applyIndeterminateStates();
        updateSelectedIoaCount();
    }

    async function createDevice() {
        const ten_thietbi = $("#device_name").val().trim();
        const ip_thietbi = $("#device_ip").val().trim();
        const port_thietbi = $("#device_port").val().trim();
        const danhmuc_code = $("#device_category_id").val().trim();
        if (!ten_thietbi) {
            showAlert("Vui lòng nhập tên thiết bị", "warning");
            $("#device_name").focus();
            return false;
        }

        if (!ip_thietbi) {
            showAlert("Vui lòng nhập IP thiết bị", "warning");
            $("#device_ip").focus();
            return false;
        }

        if (!isValidIPv4(ip_thietbi)) {
            showAlert("IP thiết bị không đúng định dạng IPv4", "warning");
            $("#device_ip").focus();
            return false;
        }

        if (!port_thietbi) {
            showAlert("Vui lòng nhập port thiết bị", "warning");
            $("#device_port").focus();
            return false;
        }

        const port = Number(port_thietbi);
        if (Number.isNaN(port) || port < 1 || port > 65535) {
            showAlert("Port phải từ 1 đến 65535", "warning");
            $("#device_port").focus();
            return false;
        }
        if (!danhmuc_code) {
            showAlert("Vui lòng chọn danh mục", "warning");
            return false;
        }
        try {
            $("#btnNext").prop("disabled", true).text("Đang lưu thiết bị...");

            state.device.id = null;
            state.device.ten_thietbi = ten_thietbi;
            state.device.ip_thietbi = ip_thietbi;
            state.device.port_thietbi = port;
            state.device.code = danhmuc_code;
            fillDeviceSummary();
            return true;
        } catch (error) {
            showAlert(getErrorMessage(error), "danger");
            return false;
        } finally {
            $("#btnNext").prop("disabled", false).text("Next");
        }
    }

    async function createSensor() {
        const ten_cambien = $("#sensor_name").val().trim();
        const giaothuc = $("#sensor_protocol").val();
        const loai_cambien = $("#sensor_type").val();

        if (!ten_cambien) {
            showAlert("Vui lòng nhập tên cảm biến", "warning");
            $("#sensor_name").focus();
            return false;
        }

        if (!giaothuc) {
            showAlert("Vui lòng chọn giao thức", "warning");
            $("#sensor_protocol").focus();
            return false;
        }

        if (!loai_cambien) {
            showAlert("Vui lòng chọn loại cảm biến", "warning");
            $("#sensor_type").focus();
            return false;
        }

        try {
            $("#btnNext").prop("disabled", true).text("Đang lưu cảm biến...");

            state.sensor.id = null;
            state.sensor.ten_cambien = ten_cambien;
            state.sensor.giaothuc = giaothuc;
            state.sensor.loai_cambien = loai_cambien;

            fillSensorSummary();
            return true;
        } catch (error) {
            showAlert(getErrorMessage(error), "danger");
            return false;
        } finally {
            $("#btnNext").prop("disabled", false).text("Next");
        }
    }

    async function loadIoas() {
        renderEmptyIoa("Đang tải IOA...");

        try {
            if (!state.ioa.all.length) {
                const res = await request("/api/giamsat/get-ds-ioa", "GET");

                if (!res || !Array.isArray(res) || !res.length) {
                    renderEmptyIoa("Không có IOA phù hợp");
                    return;
                }

                state.ioa.all = res;
                state.ioa.expanded = {}; // mặc định thu gọn toàn bộ
            }

            renderIoasTree();
        } catch (error) {
            renderEmptyIoa("Không tải được IOA");
            showAlert(getErrorMessage(error), "danger");
        }
    }

    async function saveSensorIoas() {
        var userinfo = localStorage.getItem("us");
        var user = JSON.parse(Base64.decode(userinfo));
        const ioas = Object.values(state.ioa.selected);

        if (!ioas.length) {
            showAlert("Vui lòng chọn ít nhất 1 IOA", "warning");
            return false;
        }

        try {
            $("#btnFinish").prop("disabled", true).text("Đang lưu...");

            const payload = {
                ten_thietbi: state.device.ten_thietbi,
                ip_thietbi: state.device.ip_thietbi,
                port_thietbi: state.device.port_thietbi,
                ten_cambien: state.sensor.ten_cambien,
                giaothuc: state.sensor.giaothuc,
                loai_cambien: state.sensor.loai_cambien,
                code: state.device.code,
                ioas: ioas,
                userId: user.mataikhoan
            };

            const res = await request("/api/giamsat/save-thietbi-cambien-ioa", "POST", payload);

            if (!res) {
                showMessageAlert("Lưu IOA thất bại", "danger");
                return false;
            }

            showMessageAlert("Hoàn tất thêm thiết bị / cảm biến / IOA", "success");
            $("#btnFinish").prop("disabled", true).text("Hoàn tất");
            return true;
        } catch (error) {
            showAlert(getErrorMessage(error), "danger");
            $("#btnFinish").prop("disabled", false).text("Hoàn tất");
            return false;
        }
    }

    function resetWizard() {
        state.currentStep = 1;

        state.device = {
            id: null,
            ten_thietbi: "",
            ip_thietbi: "",
            port_thietbi: ""
        };

        state.sensor = {
            id: null,
            ten_cambien: "",
            giaothuc: "",
            loai_cambien: ""
        };

        state.ioa = {
            all: [],
            selected: {},
            expanded: {} // reset về collapse
        };

        $("#device_name").val("");
        $("#device_ip").val("");
        $("#device_port").val("");

        $("#sensor_name").val("");
        $("#sensor_protocol").val("");
        $("#sensor_type").val("");

        renderEmptyIoa("Chưa có dữ liệu IOA");

        fillDeviceSummary();
        fillSensorSummary();
        updateStepUI();
    }

    async function handleNext() {
        if (state.currentStep === 1) {
            const ok = await createDevice();
            if (!ok) return;

            state.currentStep = 2;
            updateStepUI();
            return;
        }

        if (state.currentStep === 2) {
            const ok = await createSensor();
            if (!ok) return;

            state.currentStep = 3;
            updateStepUI();
            await loadIoas();
        }
    }

    function bindEvents() {
        $("#btnNext").on("click", handleNext);

        $("#btnPrev").on("click", function () {
            if (state.currentStep > 1) {
                state.currentStep -= 1;
                updateStepUI();
            }
        });

        $("#btnFinish").on("click", async function () {
            await saveSensorIoas();
        });

        $("#btnReset").on("click", function () {
            const $alert = $("#alertBox");
            let type = "success"
            $alert.addClass("d-none").removeClass(`alert-${type}`);
            $("#btnFinish").prop("disabled", false).text("Hoàn tất");
            loadDeviceCategoryTree();
            resetWizard();
        });

        $("#btnCheckAllIoa").on("click", function () {
            state.ioa.all.forEach(item => {
                const code = normalizeCode(item);
                if (!code) return;
                state.ioa.selected[code] = buildSelectedPayload(item);
            });
            renderIoasTree();
        });

        $("#btnUncheckAllIoa").on("click", function () {
            state.ioa.selected = {};
            renderIoasTree();
        });

        $(document).on("click", ".ioa-toggle", function (e) {
            e.stopPropagation();
            const code = String($(this).data("code") || "").trim();
            if (!code) return;

            state.ioa.expanded[code] = !state.ioa.expanded[code];
            renderIoasTree();
        });

        $(document).on("click", ".ioa-tree-row", function (e) {
            if ($(e.target).is("input, label")) return;
            if ($(e.target).closest(".ioa-toggle").length) return;

            const $node = $(this).closest(".ioa-tree-node");
            const code = String($node.data("code") || "").trim();
            if (!code || !hasChildren(code)) return;

            state.ioa.expanded[code] = !state.ioa.expanded[code];
            renderIoasTree();
        });

        $(document).on("change", ".ioa-checkbox", function () {
            const code = String($(this).data("code") || "").trim();
            if (!code) return;

            setSelectedRecursive(code, $(this).is(":checked"));
            renderIoasTree();
        });

        $(document).on("click", "#btnExpandAllTree", function () {
            getAllCodes().forEach(code => {
                if (hasChildren(code)) {
                    state.ioa.expanded[code] = true;
                }
            });
            renderIoasTree();
        });

        $(document).on("click", "#btnCollapseAllTree", function () {
            state.ioa.expanded = {};
            renderIoasTree();
        });
    }
    async function loadDeviceCategoryTree() {
        try {
            const res = await request("/api/giamsat/get-danhmuc-tree", "GET");

            if (!res || !Array.isArray(res) || !res.length) {
                $("#device_category_tree").html('<div class="text-muted">Không có dữ liệu danh mục</div>');
                return;
            }

            // Chuẩn hóa dữ liệu theo code phân cấp 3 ký tự / cấp
            const treeData = res.map(item => {
                const code = String(item.code ?? item.code ?? "").trim();
                const text = String(item.tendanhmuc ?? item.TENDANHMUC ?? item.text ?? "").trim();

                let parent = "#";
                if (code.length > 3) {
                    parent = code.substring(0, code.length - 3);
                }

                return {
                    id: code,
                    parent: parent,
                    text: text || code,
                    state: {
                        opened: false,      // mặc định thu gọn
                        selected: false
                    },
                    data: item
                };
            });

            if ($.jstree.reference("#device_category_tree")) {
                $("#device_category_tree").jstree("destroy");
            }

            $("#device_category_tree").jstree({
                core: {
                    data: treeData,
                    multiple: false,
                    themes: {
                        dots: true,
                        icons: true
                    }
                },
                plugins: ["wholerow"]
            });

            // Sau khi render xong, chỉ mở cấp root nếu muốn
            $("#device_category_tree")
                .off("ready.jstree")
                .on("ready.jstree", function () {
                    const tree = $(this).jstree(true);

                    // Thu gọn toàn bộ trước
                    tree.close_all();

                    // Nếu muốn chỉ mở cấp đầu tiên thì bỏ comment đoạn dưới:
                    /*
                    treeData.forEach(node => {
                        if (node.parent === "#") {
                            tree.open_node(node.id);
                        }
                    });
                    */
                });

            $("#device_category_tree")
                .off("select_node.jstree")
                .on("select_node.jstree", function (e, data) {
                    const node = data.node;

                    $("#device_category_id").val(node.id);
                    $("#device_category_name").val(node.text);
                    $("#selected_category_text").text(node.text);

                    // Toggle mở/đóng khi click node
                    const tree = $(this).jstree(true);
                    if (tree.is_parent(node)) {
                        if (tree.is_open(node)) {
                            tree.close_node(node);
                        } else {
                            tree.open_node(node);
                        }
                    }
                });

        } catch (error) {
            $("#device_category_tree").html('<div class="text-danger">Không tải được danh mục</div>');
            showAlert(getErrorMessage(error), "danger");
        }
    }
    $(document).ready(function () {
        bindEvents();
        updateStepUI();
        renderEmptyIoa("Chưa có dữ liệu IOA");
        loadDeviceCategoryTree();
    });
})();