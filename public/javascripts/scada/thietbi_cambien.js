var Base64 = { _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=", encode: function (e) { var t = ""; var n, r, i, s, o, u, a; var f = 0; e = Base64._utf8_encode(e); while (f < e.length) { n = e.charCodeAt(f++); r = e.charCodeAt(f++); i = e.charCodeAt(f++); s = n >> 2; o = (n & 3) << 4 | r >> 4; u = (r & 15) << 2 | i >> 6; a = i & 63; if (isNaN(r)) { u = a = 64 } else if (isNaN(i)) { a = 64 } t = t + this._keyStr.charAt(s) + this._keyStr.charAt(o) + this._keyStr.charAt(u) + this._keyStr.charAt(a) } return t }, decode: function (e) { var t = ""; var n, r, i; var s, o, u, a; var f = 0; e = e.replace(/[^A-Za-z0-9\+\/\=]/g, ""); while (f < e.length) { s = this._keyStr.indexOf(e.charAt(f++)); o = this._keyStr.indexOf(e.charAt(f++)); u = this._keyStr.indexOf(e.charAt(f++)); a = this._keyStr.indexOf(e.charAt(f++)); n = s << 2 | o >> 4; r = (o & 15) << 4 | u >> 2; i = (u & 3) << 6 | a; t = t + String.fromCharCode(n); if (u != 64) { t = t + String.fromCharCode(r) } if (a != 64) { t = t + String.fromCharCode(i) } } t = Base64._utf8_decode(t); return t }, _utf8_encode: function (e) { e = e.replace(/\r\n/g, "\n"); var t = ""; for (var n = 0; n < e.length; n++) { var r = e.charCodeAt(n); if (r < 128) { t += String.fromCharCode(r) } else if (r > 127 && r < 2048) { t += String.fromCharCode(r >> 6 | 192); t += String.fromCharCode(r & 63 | 128) } else { t += String.fromCharCode(r >> 12 | 224); t += String.fromCharCode(r >> 6 & 63 | 128); t += String.fromCharCode(r & 63 | 128) } } return t }, _utf8_decode: function (e) { var t = ""; var n = 0; var r = c1 = c2 = 0; while (n < e.length) { r = e.charCodeAt(n); if (r < 128) { t += String.fromCharCode(r); n++ } else if (r > 191 && r < 224) { c2 = e.charCodeAt(n + 1); t += String.fromCharCode((r & 31) << 6 | c2 & 63); n += 2 } else { c2 = e.charCodeAt(n + 1); c3 = e.charCodeAt(n + 2); t += String.fromCharCode((r & 15) << 12 | (c2 & 63) << 6 | c3 & 63); n += 3 } } return t } };
function handleSidebarNode() { }

(function () {
    "use strict";

    const API = {
        GET_IOA_LIST: "/api/giamsat/get-ds-ioa",
        GET_DEVICE_CATEGORY_TREE: "/api/giamsat/get-danhmuc-tree",
        SAVE_DEVICE_SENSOR_IOA: "/api/giamsat/save-thietbi-cambien-ioa",

        GET_DEVICE_LIST: "/api/giamsat/get-ds-thietbi-cambien",
        GET_IOA_BY_DEVICE: "/api/giamsat/get-ioa-by-thietbi",
        UPDATE_DEVICE_INFO: "/api/giamsat/update-thietbi",
        DELETE_DEVICE: "/api/giamsat/delete-thietbi"
    };

    const state = {
        currentStep: 1,
        mode: "create", // create | edit-ioa | edit-device

        device: {
            id: null,
            ten_thietbi: "",
            ip_thietbi: "",
            port_thietbi: "",
            code: "",
            category_name: ""
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
            expanded: {}
        },

        editing: {
            deviceId: null,
            sensorId: null
        }
    };

    function showAlert(message, type = "success", id) {
        const $alert = $(id);
        $alert
            .removeClass("d-none alert-success alert-danger alert-warning alert-info")
            .addClass(`alert-${type}`)
            .text(message);

        setTimeout(() => {
            $alert.addClass("d-none").removeClass(`alert-${type}`);
        }, 3000);
    }

    function showMessageAlert(message, type = "success", id) {
        const $alert = $(id);
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

    function normalizeCode(item) {
        return String(
            item.code ??
            item.CODE ??
            item.ioa_code ??
            item.IOA_CODE ??
            item.IOA_CODE ??
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

    function normalizeType(item) {
        return String(
            item.type ??
            item.TYPE ??
            ""
        ).trim();
    }
    function normalizeScale(item) {
        return String(
            item.ioa_scale ??
            item.IOA_SCALE ??
            item.scale ??
            item.SCALE ??
            1
        ).trim();
    }
    function buildSelectedPayload(item, typeOverride = null) {
        return {
            code: normalizeCode(item),
            ten_ioa: normalizeName(item),
            ioa_diachi: normalizeAddress(item),
            donvi: normalizeDonvi(item),
            type: typeOverride ?? normalizeType(item),
            scale: normalizeScale(item)
        };
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
            $("#stepIndicator3").addClass("active");
        }

        $("#btnPrev").prop("disabled", state.currentStep === 1);

        if (state.currentStep < 2) {
            $("#btnNext").removeClass("d-none");
            $("#btnFinish").addClass("d-none");
        } else {
            $("#btnNext").addClass("d-none");
            $("#btnFinish").removeClass("d-none");
            $("#btnFinish").prop("disabled", false);
            $("#btnFinish").text(state.mode === "create" ? "Hoàn tất" : "Cập nhật");
        }

        $("#btnReset").toggleClass("d-none", !(state.currentStep === 2));
        $("#editModeBadge").toggle(state.mode !== "create");
    }

    function fillDeviceSummary() {
        $("#summary_device_name").html(escapeHtml(state.device.ten_thietbi || ""));
        $("#summary_device_ip").html(escapeHtml(state.device.ip_thietbi || ""));
        $("#summary_device_port").html(escapeHtml(state.device.port_thietbi || ""));

        $("#device_category_id").val(state.device.code || "");
        $("#device_category_name").val(state.device.category_name || "");
        $("#selected_category_text").text(state.device.category_name || "Chưa chọn danh mục");
    }

    function restoreStep1Form() {
        $("#device_name").val(state.device.ten_thietbi || "");
        $("#device_ip").val(state.device.ip_thietbi || "");
        $("#device_port").val(state.device.port_thietbi || "");
        $("#device_category_id").val(state.device.code || "");
        $("#device_category_name").val(state.device.category_name || "");
        $("#selected_category_text").text(state.device.category_name || "Chưa chọn danh mục");

        const tree = $.jstree.reference("#device_category_tree");
        if (tree && state.device.code) {
            tree.deselect_all();
            tree.select_node(state.device.code);

            let parentId = tree.get_parent(state.device.code);
            while (parentId && parentId !== "#") {
                tree.open_node(parentId);
                parentId = tree.get_parent(parentId);
            }
        }
    }

    function updateSelectedIoaCount() {
        $("#selectedIoaCount").text(Object.keys(state.ioa.selected).length);
    }

    function renderEmptyIoa(text) {
        $("#ioaList").html(`<div class="empty-box">${escapeHtml(text)}</div>`);
        updateSelectedIoaCount();
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
            const validItems = state.ioa.all.filter(item => normalizeCode(item));
            if (!validItems.length) return [];

            const minLen = Math.min(...validItems.map(item => normalizeCode(item).length));
            return validItems.filter(item => normalizeCode(item).length === minLen);
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
    function getConfiguredIoa(code) {
        return state.ioa.selected?.[String(code).trim()] || null;
    }
    function mergeConfiguredIoaToTree(item) {
        const payload = buildSelectedPayload(item);
        let code = payload.code;

        // Nếu API không trả code, tìm theo tên IOA
        let master = code ? findItemByCode(code) : null;

        if (!master) {
            master = state.ioa.all.find(x =>
                normalizeName(x).trim().toLowerCase() === payload.ten_ioa.trim().toLowerCase()
            );
        }

        if (!master) {
            console.warn("Không tìm thấy IOA trong tree:", payload, item);
            return;
        }

        // Lấy lại code thật từ tree nếu API không khớp
        code = normalizeCode(master);

        const fixedPayload = {
            ...payload,
            code
        };

        state.ioa.selected[code] = fixedPayload;

        master.ioa_diachi = fixedPayload.ioa_diachi;
        master.IOA_DIACHI = fixedPayload.ioa_diachi;
        master.diachi = fixedPayload.ioa_diachi;
        master.DIACHI = fixedPayload.ioa_diachi;

        master.ioa_scale = fixedPayload.scale;
        master.IOA_SCALE = fixedPayload.scale;
        master.scale = fixedPayload.scale;
        master.SCALE = fixedPayload.scale;

        master.type = fixedPayload.type;
        master.TYPE = fixedPayload.type;

        master.ten_ioa = fixedPayload.ten_ioa;
        master.TEN_IOA = fixedPayload.ten_ioa;
        master.name = fixedPayload.ten_ioa;
        master.NAME = fixedPayload.ten_ioa;
    }
    function setSelectedRecursive(code, checked) {
        const affectedCodes = [code, ...getChildrenCodes(code)];

        affectedCodes.forEach(itemCode => {
            const item = findItemByCode(itemCode);
            if (!item) return;

            if (checked) {
                const $checkbox = $(`.ioa-checkbox[data-code="${itemCode}"]`);
                const typeFromDom = String($checkbox.data("type") ?? "").trim();

                state.ioa.selected[itemCode] = buildSelectedPayload(
                    item,
                    typeFromDom || normalizeType(item)
                );
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
            // BẮT BUỘC khai báo code trước
            const code = normalizeCode(item);
            const configured = getConfiguredIoa(code);

            const ten = configured?.ten_ioa ?? normalizeName(item);
            const ioaDiaChi = configured?.ioa_diachi ?? normalizeAddress(item);
            const donvi = configured?.donvi ?? normalizeDonvi(item);
            const type = configured?.type ?? normalizeType(item);
            const scale = configured?.scale ?? normalizeScale(item);

            const childExists = hasChildren(code);
            const expanded = !!state.ioa.expanded[code];
            const checkState = getCheckState(code);
            const showIoaDiaChi = code.length !== 3;
            const canEditIoa = !childExists;

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
                                data-type="${escapeHtml(type)}"
                                data-scale="${escapeHtml(scale)}"
                                ${checkState === "checked" ? "checked" : ""}>

                            <div class="d-flex align-items-center gap-2">
                                <label class="form-check-label fw-semibold mb-0" for="ioa_${escapeHtml(code)}">
                                    ${escapeHtml(ten)}
                                </label>

                                ${canEditIoa ? `
                                    <i class="fa fa-edit text-primary btn-edit-ioa"
                                       title="Sửa IOA"
                                       style="cursor:pointer;font-size:13px;"
                                       data-code="${escapeHtml(code)}"
                                       data-ten="${escapeHtml(ten)}"
                                       data-diachi="${escapeHtml(ioaDiaChi)}"
                                       data-type="${escapeHtml(type)}"
                                       data-scale="${escapeHtml(scale)}">
                                    </i>
                                ` : ""}
                            </div>

                            ${showIoaDiaChi ? `<div class="text-muted small">IOA địa chỉ: ${escapeHtml(ioaDiaChi)}</div>` : ""}
                            ${donvi ? `<div class="text-muted small">Đơn vị: ${escapeHtml(donvi)}</div>` : ""}
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

    async function loadIoas(forceReload = false) {
        renderEmptyIoa("Đang tải IOA...");

        try {
            if (forceReload || !state.ioa.all.length) {
                const res = await request(API.GET_IOA_LIST, "GET");

                if (!res || !Array.isArray(res) || !res.length) {
                    renderEmptyIoa("Không có IOA phù hợp");
                    return;
                }

                state.ioa.all = res;
                state.ioa.expanded = {};
            }

            renderIoasTree();
        } catch (error) {
            renderEmptyIoa("Không tải được IOA");
            showAlert(getErrorMessage(error), "danger", "#alertBox");
        }
    }

    async function createOrValidateDevice() {
        const ten_thietbi = $("#device_name").val().trim();
        const ip_thietbi = $("#device_ip").val().trim();
        const port_thietbi = $("#device_port").val().trim();
        const danhmuc_code = $("#device_category_id").val().trim();
        const danhmuc_name = $("#device_category_name").val().trim();

        if (!ten_thietbi) {
            showAlert("Vui lòng nhập tên thiết bị", "warning", "#alertBox");
            $("#device_name").focus();
            return false;
        }

        if (!ip_thietbi) {
            showAlert("Vui lòng nhập IP thiết bị", "warning", "#alertBox");
            $("#device_ip").focus();
            return false;
        }

        if (!isValidIPv4(ip_thietbi)) {
            showAlert("IP thiết bị không đúng định dạng IPv4", "warning", "#alertBox");
            $("#device_ip").focus();
            return false;
        }

        if (!port_thietbi) {
            showAlert("Vui lòng nhập port thiết bị", "warning", "#alertBox");
            $("#device_port").focus();
            return false;
        }

        const port = Number(port_thietbi);
        if (Number.isNaN(port) || port < 1 || port > 65535) {
            showAlert("Port phải từ 1 đến 65535", "warning", "#alertBox");
            $("#device_port").focus();
            return false;
        }

        if (!danhmuc_code) {
            showAlert("Vui lòng chọn danh mục", "warning", "#alertBox");
            return false;
        }

        state.device.ten_thietbi = ten_thietbi;
        state.device.ip_thietbi = ip_thietbi;
        state.device.port_thietbi = port;
        state.device.code = danhmuc_code;
        state.device.category_name = danhmuc_name;

        fillDeviceSummary();
        return true;
    }

    async function saveSensorIoas() {
        const userinfo = localStorage.getItem("us");
        const user = JSON.parse(Base64.decode(userinfo));
        const ioas = Object.values(state.ioa.selected);

        if (!ioas.length) {
            showAlert("Vui lòng chọn ít nhất 1 IOA", "warning", "#alertBox");
            return false;
        }

        try {
            $("#btnFinish").prop("disabled", true).text("Đang lưu...");

            if (state.mode === "create") {
                const payload = {
                    ten_thietbi: state.device.ten_thietbi,
                    ip_thietbi: state.device.ip_thietbi,
                    port_thietbi: state.device.port_thietbi,
                    ten_cambien: "Cảm biến",
                    giaothuc: 0,
                    loai_cambien: 5,
                    code: state.device.code,
                    ioas,
                    userId: user.mataikhoan
                };

                const res = await request(API.SAVE_DEVICE_SENSOR_IOA, "POST", payload);

                if (!res) {
                    showMessageAlert("Lưu IOA thất bại", "danger", "#alertBox");
                    return false;
                }

                if (Array.isArray(res) && res[0] && res[0].message !== "OK") {
                    showMessageAlert(res[0].message || "Lưu IOA thất bại", "danger", "#alertBox");
                    return false;
                }
                renderIoasTree();
                $("#btnFinish").prop("disabled", true).text("Đã cập nhật");
                showMessageAlert("Hoàn tất thêm thiết bị / cảm biến / IOA", "success", "#alertBox");
            } else if (state.mode === "edit-device") {
                const payload = {
                    id_thietbi: state.editing.deviceId,
                    id_cambien: state.editing.id_cambien,
                    ten_thietbi: state.device.ten_thietbi,
                    ip_thietbi: state.device.ip_thietbi,
                    port_thietbi: state.device.port_thietbi,
                    code: state.device.code,
                    ioas,
                    userId: user.mataikhoan
                };

                const res = await request(API.UPDATE_DEVICE_INFO, "POST", payload);

                if (!res) {
                    showMessageAlert("Lưu IOA thất bại", "danger", "#alertBox");
                    return false;
                }
                renderIoasTree();
                $("#btnFinish").prop("disabled", false).text("Cập nhật");
                showMessageAlert("Hoàn tất cập nhật thiết bị / cảm biến / IOA", "success", "#alertBox");
            }
            else if (state.mode === "delete") {
                const payloadDevice = {
                    id_thietbi: state.editing.deviceId,
                    ten_thietbi: state.device.ten_thietbi,
                    ip_thietbi: state.device.ip_thietbi,
                    port_thietbi: state.device.port_thietbi,
                    code: state.device.code,
                    userId: user.mataikhoan
                };

                const resDevice = await request(API.UPDATE_DEVICE_INFO, "POST", payloadDevice);

                if (!resDevice) {
                    showMessageAlert("Cập nhật thiết bị thất bại", "danger", "#alertBox");
                    return false;
                }

                if (ioas.length) {
                    await request(API.UPDATE_DEVICE_SENSOR_IOA, "POST", {
                        id_thietbi: state.editing.deviceId,
                        ten_thietbi: state.device.ten_thietbi,
                        ip_thietbi: state.device.ip_thietbi,
                        port_thietbi: state.device.port_thietbi,
                        code: state.device.code,
                        ioas,
                        userId: user.mataikhoan
                    });
                }
                $("#btnFinish").prop("disabled", true).text("Đã cập nhật");
                showMessageAlert("Cập nhật thiết bị thành công", "success", "#alertBox");
            }


            await loadDeviceList();
            return true;
        } catch (error) {
            showAlert(getErrorMessage(error), "danger", "#alertBox");
            $("#btnFinish").prop("disabled", false).text(state.mode === "create" ? "Hoàn tất" : "Cập nhật");
            return false;
        }
    }

    function resetWizard() {
        state.currentStep = 1;
        state.mode = "create";

        state.device = {
            id: null,
            ten_thietbi: "",
            ip_thietbi: "",
            port_thietbi: "",
            code: "",
            category_name: ""
        };

        state.sensor = {
            id: null,
            ten_cambien: "",
            giaothuc: "",
            loai_cambien: ""
        };

        state.editing = {
            deviceId: null,
            sensorId: null
        };

        state.ioa = {
            all: [],
            selected: {},
            expanded: {}
        };

        $("#device_name").val("");
        $("#device_ip").val("");
        $("#device_port").val("");
        $("#device_category_id").val("");
        $("#device_category_name").val("");
        $("#selected_category_text").text("Chưa chọn danh mục");

        renderEmptyIoa("Chưa có dữ liệu IOA");
        fillDeviceSummary();
        updateStepUI();
    }

    async function handleNext() {
        if (state.currentStep === 1) {
            const ok = await createOrValidateDevice();
            if (!ok) return;

            $("#btnNext").prop("disabled", true).text("Đang tải IOA...");

            try {
                await loadIoas();
                state.currentStep = 2;
                updateStepUI();
            } finally {
                $("#btnNext").prop("disabled", false).text("Next");
            }
        }
    }

    async function loadDeviceList() {
        const $tbody = $("#deviceListBody");
        $tbody.html(`<tr><td colspan="6" class="text-center">Đang tải dữ liệu</td></tr>`);

        try {
            const res = await request(API.GET_DEVICE_LIST, "GET");
            const rows = Array.isArray(res?.data) ? res.data : (Array.isArray(res) ? res : []);

            if (!rows.length) {
                $tbody.html(`<tr><td colspan="6" class="text-center">Chưa có thiết bị</td></tr>`);
                return;
            }

            let html = "";
            rows.forEach((item, index) => {
                const id = item.id_thietbi ?? "";
                const ten = item.tenthietbi ?? "";
                const ip = item.ip ?? "";
                const port = item.port ?? "";
                const category = item.tendanhmuc ?? "";
                const code = item.code ?? item.CODE ?? "";
                const id_cambien = item.id_cambien ?? "";

                html += `
                    <tr>
                        <td class="text-center">${index + 1}</td>
                        <td>${escapeHtml(ten)}</td>
                        <td>${escapeHtml(ip)}</td>
                        <td class="text-center">${escapeHtml(port)}</td>
                        <td>${escapeHtml(category)}</td>
                        <td>
                            <div class="btn-action-group">
                                <button type="button"
                                    class="btn btn-sm btn-outline-primary btn-edit-device"
                                    data-id="${escapeHtml(id)}"
                                    data-id_cambien="${escapeHtml(id_cambien)}"
                                    data-name="${escapeHtml(ten)}"
                                    data-ip="${escapeHtml(ip)}"
                                    data-port="${escapeHtml(port)}"
                                    data-code="${escapeHtml(code)}"
                                    data-category="${escapeHtml(category)}">
                                   Sửa thiết bị
                                </button>

                                <button type="button"
                                    class="btn btn-sm btn-outline-warning btn-delete"
                                    data-id="${escapeHtml(id)}"
                                    data-name="${escapeHtml(ten)}"
                                    data-ip="${escapeHtml(ip)}"
                                    data-port="${escapeHtml(port)}"
                                    data-code="${escapeHtml(code)}"
                                    data-category="${escapeHtml(category)}">
                                    Xóa
                                </button>
                            </div>
                        </td>
                    </tr>
                `;
            });

            $tbody.html(html);
        } catch (error) {
            $tbody.html(`<tr><td colspan="6" class="text-center text-danger">Không tải được danh sách thiết bị</td></tr>`);
        }
    }
    async function loadDeviceCategoryTree() {
        const $tree = $("#device_category_tree");

        try {
            const response = await request(
                API.GET_DEVICE_CATEGORY_TREE,
                "GET"
            );

          //  console.log("GET_DEVICE_CATEGORY_TREE:", response);

            // Hỗ trợ nhiều kiểu response
            const rows = Array.isArray(response)
                ? response
                : Array.isArray(response?.data)
                    ? response.data
                    : Array.isArray(response?.CV_1)
                        ? response.CV_1
                        : [];

            if (!rows.length) {
                $tree.html(
                    '<div class="text-muted">Không có dữ liệu danh mục</div>'
                );
                return;
            }

            // Lấy danh sách code hợp lệ trước
            const codeSet = new Set(
                rows
                    .map(item =>
                        String(item.code ?? item.CODE ?? "").trim()
                    )
                    .filter(Boolean)
            );

            const usedIds = new Set();

            const treeData = rows
                .map(item => {
                    const code = String(
                        item.code ?? item.CODE ?? ""
                    ).trim();

                    const text = String(
                        item.tendanhmuc ??
                        item.TENDANHMUC ??
                        item.text ??
                        item.TEXT ??
                        ""
                    ).trim();

                    if (!code) {
                        console.warn("Bỏ qua bản ghi không có code:", item);
                        return null;
                    }

                    if (usedIds.has(code)) {
                        console.warn("Code bị trùng:", code, item);
                        return null;
                    }

                    usedIds.add(code);

                    let parent = "#";

                    if (code.length > 3) {
                        const expectedParent = code.substring(
                            0,
                            code.length - 3
                        );

                        // Chỉ gán parent khi parent thực sự tồn tại
                        parent = codeSet.has(expectedParent)
                            ? expectedParent
                            : "#";
                    }

                    return {
                        id: code,
                        parent,
                        text: text || code,
                        state: {
                            opened: false,
                            selected: false
                        },
                        data: item
                    };
                })
                .filter(Boolean);

           // console.log("treeData:", treeData);

            if (!treeData.length) {
                $tree.html(
                    '<div class="text-muted">Không có dữ liệu hợp lệ</div>'
                );
                return;
            }

            // Hủy tree cũ
            if ($.jstree.reference($tree)) {
                $tree.jstree("destroy");
            }

            $tree.empty();

            // Phải đăng ký event trước khi khởi tạo jsTree
            $tree
                .off(".deviceCategoryTree")
                .on(
                    "ready.jstree.deviceCategoryTree",
                    function () {
                        const tree = $(this).jstree(true);

                        tree.close_all();

                        // console.log(
                        //     "jsTree đã tải:",
                        //     tree.get_json("#", { flat: true })
                        // );
                    }
                )
                .on(
                    "select_node.jstree.deviceCategoryTree",
                    function (event, data) {
                        const node = data.node;
                        const tree = $(this).jstree(true);

                        $("#device_category_id").val(node.id);
                        $("#device_category_name").val(node.text);
                        $("#selected_category_text").text(node.text);

                        if (tree.is_parent(node)) {
                            tree.toggle_node(node);
                        }
                    }
                );

            // Khởi tạo sau khi đã gắn event
            $tree.jstree({
                core: {
                    data: treeData,
                    multiple: false,
                    check_callback: true,
                    themes: {
                        dots: true,
                        icons: true,
                        responsive: true
                    }
                },
                plugins: ["wholerow"]
            });

        } catch (error) {
            console.error("Lỗi loadDeviceCategoryTree:", error);

            $tree.html(
                '<div class="text-danger">Không tải được danh mục</div>'
            );

            showAlert(
                getErrorMessage(error),
                "danger",
                "#alertBox"
            );
        }
    }
    async function openEditIoa(deviceInfo) {
        state.mode = "edit-ioa";
        state.currentStep = 2;
        state.editing.deviceId = deviceInfo.id;

        state.device.id = deviceInfo.id;
        state.device.ten_thietbi = deviceInfo.name;
        state.device.ip_thietbi = deviceInfo.ip;
        state.device.port_thietbi = deviceInfo.port;
        state.device.code = deviceInfo.code;
        state.device.category_name = deviceInfo.category;

        fillDeviceSummary();
        updateStepUI();

        await loadIoas(true);
        state.ioa.selected = {};

        try {
            const res = await request(API.GET_IOA_BY_DEVICE, "POST", {
                id_thietbi: deviceInfo.id
            });
            const selectedIoas = Array.isArray(res?.data) ? res.data : (Array.isArray(res) ? res : []);
            console.log("GET_IOA_BY_DEVICE", selectedIoas);
            // selectedIoas.forEach(item => {
            //     const code = normalizeCode(item);
            //     if (!code) return;
            //     state.ioa.selected[code] = buildSelectedPayload(item);
            // });
            selectedIoas.forEach(item => {
                mergeConfiguredIoaToTree(item);
            });
            renderIoasTree();
            showAlert("Đã tải IOA của thiết bị, bạn có thể chỉnh sửa lại", "info", "#alertBox");
        } catch (error) {
            renderIoasTree();
            showAlert("Không tải được IOA hiện tại của thiết bị", "warning", "#alertBox");
        }
    }

    async function openEditDevice(deviceInfo) {
        console.log(deviceInfo);
        state.mode = "edit-device";
        state.currentStep = 1;
        state.editing.deviceId = deviceInfo.id;
        state.editing.id_cambien = deviceInfo.id_cambien;

        state.device.id = deviceInfo.id;
        state.device.ten_thietbi = deviceInfo.name;
        state.device.ip_thietbi = deviceInfo.ip;
        state.device.port_thietbi = deviceInfo.port;
        state.device.code = deviceInfo.code;
        state.device.category_name = deviceInfo.category;

        restoreStep1Form();
        updateStepUI();

        try {
            await loadIoas(true);
            state.ioa.selected = {};

            const res = await request(API.GET_IOA_BY_DEVICE, "POST", {
                id_thietbi: deviceInfo.id
            });
            const selectedIoas = Array.isArray(res?.data) ? res.data : (Array.isArray(res) ? res : []);

            // selectedIoas.forEach(item => {
            //     const code = normalizeCode(item);
            //     if (!code) return;
            //     state.ioa.selected[code] = buildSelectedPayload(item);
            // });
            console.log("GET_IOA_BY_DEVICE", selectedIoas);
            selectedIoas.forEach(item => {
                mergeConfiguredIoaToTree(item);
            });
            renderIoasTree();
        } catch (error) {
            console.warn(error);
        }

        showAlert("Đã nạp thông tin thiết bị. Bấm Next để sửa IOA nếu cần.", "info", "#alertBox");
    }

    function bindEvents() {
        $("#btnNext").on("click", handleNext);

        $("#btnPrev").on("click", function () {
            if (state.currentStep > 1) {
                state.currentStep -= 1;
                updateStepUI();

                if (state.currentStep === 1) {
                    restoreStep1Form();
                }
            }
        });

        $("#btnFinish").on("click", async function () {
            await saveSensorIoas();
        });

        $("#btnReset").on("click", function () {
            $("#btnFinish").prop("disabled", false).text("Hoàn tất");
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

        $("#btnReloadIoa").on("click", async function () {
            await loadIoas(true);
        });

        $("#btnReloadDeviceList").on("click", async function () {
            await loadDeviceList();
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
            if ($(e.target).closest(".btn-edit-ioa").length) return;

            const $node = $(this).closest(".ioa-tree-node");
            const code = String($node.data("code") || "").trim();
            if (!code || !hasChildren(code)) return;

            state.ioa.expanded[code] = !state.ioa.expanded[code];
            renderIoasTree();
        });

        $(document).on("change", ".ioa-checkbox", function () {
            const code = String($(this).data("code") || "").trim();
            if (!code) return;

            const checked = $(this).is(":checked");

            // Cập nhật state cha + toàn bộ con
            setSelectedRecursive(code, checked);

            // Cập nhật trực tiếp checkbox con trên DOM, không render lại cây
            const childCodes = getChildrenCodes(code);

            childCodes.forEach(childCode => {
                $(".ioa-checkbox").filter(function () {
                    return String($(this).data("code") || "").trim() === childCode;
                }).prop("checked", checked)
                    .prop("indeterminate", false);
            });

            // Cập nhật lại trạng thái partial/checked cho checkbox cha
            applyIndeterminateStates();

            // Cập nhật số lượng IOA đã chọn
            updateSelectedIoaCount();
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

        $(document).on("click", ".btn-delete", async function () {
            var id_thietbi = $(this).data("id");
            await deleteThietBi(id_thietbi);
        });

        $(document).on("click", ".btn-edit-device", async function () {
            const deviceInfo = {
                id: $(this).data("id"),
                id_cambien: $(this).data("id_cambien"),
                name: $(this).data("name"),
                ip: $(this).data("ip"),
                port: $(this).data("port"),
                code: $(this).data("code"),
                category: $(this).data("category")
            };
            await openEditDevice(deviceInfo);
            // 👉 scroll lên form
            scrollToDeviceForm();
        });
    }
    function scrollToDeviceForm() {
        const $target = $(".section-box");

        if ($target.length) {
            $("html, body").animate({
                scrollTop: $target.offset().top - 80 // trừ header
            }, 400);
        }
    }
    
    async function deleteThietBi(id_thietbi) {
        if (!id_thietbi) {
            showAlert("Không xác định được thiết bị cần xóa", "warning", "#alertBox");
            return;
        }

        const ok = window.confirm("Bạn có chắc chắn muốn xóa thiết bị này không?");
        if (!ok) return;

        try {
            const userinfo = localStorage.getItem("us");
            const user = userinfo ? JSON.parse(Base64.decode(userinfo)) : null;

            const res = await request(API.DELETE_DEVICE, "POST", {
                id_thietbi: id_thietbi,
                userId: user?.mataikhoan || null
            });

            if (!res) {
                showAlert("Xóa thiết bị thất bại", "danger", "#alertBox");
                return;
            }

            if (res.success === false) {
                showAlert(res.message || "Xóa thiết bị thất bại", "danger", "#alertBox");
                return;
            }

            showAlert(res.message || "Xóa thiết bị thành công", "success", "#alertBox");

            if (String(state.editing.deviceId || "") === String(id_thietbi)) {
                resetWizard();
            }

            await loadDeviceList();
        } catch (error) {
            showAlert(getErrorMessage(error), "danger", "#alertBox");
        }
    }
    $(document).ready(async function () {
        bindEvents();
        updateStepUI();
        renderEmptyIoa("Chưa có dữ liệu IOA");
        await loadDeviceCategoryTree();
        await loadDeviceList();
    });



    $(document).on("click", ".btn-edit-ioa", function (e) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();

        const code = String($(this).data("code") || "").trim();
        const ten = String($(this).data("ten") || "").trim();
        const ioaDiaChi = $(this).data("diachi");
        const type = $(this).data("type");
        const tencapcha = $(this).data("ten");
        const scale = $(this).attr("data-scale") || 1;
        $("#edit_ioa_code").val(code);
        $("#edit_ioa_ten").val(ten);
        $("#edit_ioa_diachi").val(ioaDiaChi);
        $("#edit_ioa_type").val(type);
        $("#edit_ioa_tencapcha").val(tencapcha);
        $("#edit_ioa_scale").val(scale);
        $("#modalEditIoa").modal("show");

        return false;
    });
    $("#btnSaveEditIoa").on("click", async function () {
        const code = $("#edit_ioa_code").val().trim();
        const ten = $("#edit_ioa_ten").val().trim();
        const ioaDiaChi = $("#edit_ioa_diachi").val().trim();
        const type = $("#edit_ioa_type").val();
        const scale = $("#edit_ioa_scale").val().trim() || 1;
        if (!code) {
            showMessageAlert("Không xác định được IOA cần sửa", "warning", "#alertBoxIOa");
            return;
        }

        if (!ten) {
            showMessageAlert("Vui lòng nhập tên IOA", "warning", "#alertBoxIOa");
            $("#edit_ioa_ten").focus();
            return;
        }

        if (!ioaDiaChi) {
            showMessageAlert("Vui lòng nhập IOA địa chỉ", "warning", "#alertBoxIOa");
            $("#edit_ioa_diachi").focus();
            return;
        }
        if (isDuplicateIoaAddress(code, ioaDiaChi, type)) {

            showMessageAlert(
                `IOA địa chỉ ${ioaDiaChi} đã được khai báo`,
                "warning",
                "#alertBoxIOa"
            );

            $("#edit_ioa_diachi").focus();

            return;
        }
        try {
            $("#btnSaveEditIoa")
                .prop("disabled", true)
                .text("Đang cập nhật...");
            const userinfo = localStorage.getItem("us");
            const user = JSON.parse(Base64.decode(userinfo));

            // Cập nhật trực tiếp vào state để tree đổi ngay
            const newPayload = {
                code,
                ten_ioa: ten,
                ioa_diachi: ioaDiaChi,
                donvi: normalizeDonvi(findItemByCode(code) || {}),
                type,
                scale
            };

            // cập nhật IOA đã chọn
            state.ioa.selected[code] = {
                ...(state.ioa.selected[code] || {}),
                ...newPayload
            };

            // cập nhật IOA gốc trong tree
            const item = findItemByCode(code);

            if (item) {
                item.ten_ioa = ten;
                item.TEN_IOA = ten;
                item.name = ten;
                item.NAME = ten;

                item.ioa_diachi = ioaDiaChi;
                item.IOA_DIACHI = ioaDiaChi;
                item.diachi = ioaDiaChi;
                item.DIACHI = ioaDiaChi;

                item.type = type;
                item.TYPE = type;

                item.ioa_scale = scale;
                item.IOA_SCALE = scale;
                item.scale = scale;
                item.SCALE = scale;
            }

            // if (state.ioa.selected[code]) {
            //     state.ioa.selected[code] = {
            //         ...state.ioa.selected[code],
            //         code: code,
            //         ten_ioa: ten,
            //         ioa_diachi: ioaDiaChi,
            //         type: type,
            //         scale: scale
            //     };
            // }
            mergeConfiguredIoaToTree({
                code,
                ten_ioa: ten,
                ioa_diachi: ioaDiaChi,
                donvi: normalizeDonvi(findItemByCode(code) || {}),
                type,
                scale
            });

            renderIoasTree();
            const saveOk = await saveSensorIoas();

            if (!saveOk) {
                showMessageAlert("Đã cập nhật IOA nhưng lưu danh sách IOA chưa thành công", "warning", "#alertBoxIOa");
                return;
            }

            showAlert("Cập nhật IOA và lưu danh sách IOA thành công", "success", "#alertBoxIOa");

            setTimeout(() => {
                $("#modalEditIoa").modal("hide");
            }, 1500);

        } catch (error) {
            showMessageAlert(getErrorMessage(error), "danger", "#alertBoxIOa");
        } finally {
            $("#btnSaveEditIoa")
                .prop("disabled", false)
                .text("Cập nhật");
        }
    });
    function isDuplicateIoaAddress(code, ioaDiaChi, type) {

        return state.ioa.all.some(item => {

            const itemCode = normalizeCode(item);

            // bỏ qua chính bản ghi đang sửa
            if (itemCode === code) {
                return false;
            }

            const itemType = normalizeType(item);
            const itemIoa = String(normalizeAddress(item)).trim();

            return (
                itemType === String(type).trim() &&
                itemIoa === String(ioaDiaChi).trim()
            );
        });
    }

})();

