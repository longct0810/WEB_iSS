(function () {
    const MODAL_SELECTOR = "#modal_giamsat";
    const TAB_SELECTOR = "a[data-bs-toggle='tab']";

    const tabState = {
        current: null,
        loading: false,
        lastCall: 0
    };

    const DEBOUNCE_TIME = 250;

    function canCallTab(tabId) {
        const now = Date.now();

        if (tabState.loading) return false;

        if (tabState.current === tabId && now - tabState.lastCall < DEBOUNCE_TIME) {
            return false;
        }

        tabState.current = tabId;
        tabState.lastCall = now;
        tabState.loading = true;
        return true;
    }

    function doneCall() {
        tabState.loading = false;
    }

    function getMeterId() {
        return (
            $("#hdMeterid_csct").val() ||
            $("#hdMeterid_tsvh").val() ||
            $("#hdMeterid_pmax").val() ||
            $("#hdMeterid_bdpt").val() ||
            ""
        );
    }

    function getDateRangeByTab(tabId) {
        switch (tabId) {
            case "#thongsovanhanh":
                return {
                    from: $("#txttungay_tsvh").val() || "",
                    to: $("#txtdenngay_tsvh").val() || ""
                };

            case "#bieudophutai":
                return {
                    from: $("#txttungay_bdpt").val() || "",
                    to: $("#txtdenngay_bdpt").val() || ""
                };

            case "#chisopmax":
                return {
                    from: $("#txttungay_pmax").val() || "",
                    to: $("#txtdenngay_pmax").val() || ""
                };

            case "#chisocongto":
            default:
                return {
                    from: $("#txttungay_csct_ct").val() || "",
                    to: $("#txtdenngay_csct_ct").val() || ""
                };
        }
    }
    function safeSetDate(selector, value) {
        if (!value) return;

        const $el = $(selector);

        // nếu là input tháng
        if ($el.hasClass("month-picker")) {
            const parts = value.split("/");
            if (parts.length === 3) {
                value = parts[1] + "/" + parts[2]; // MM/yyyy
            }
        }

        if (typeof setDatePickerValue === "function") {
            setDatePickerValue(selector, value);
        } else {
            $el.val(value);
        }
    }
    // function safeSetDate(selector, value) {
    //     if (!value) return;

    //     if (typeof setDatePickerValue === "function") {
    //         setDatePickerValue(selector, value);
    //     } else {
    //         $(selector).val(value);
    //     }
    // }

    function setCsctLoaiCongToFromContext() {
        const current = $("#hdloaicongto_csct").val();
        if (current) return;

        const fromTsvh = $("#hdloaicongto_tsvh").val();
        const fromPmax = $("#hdloaicongto_pmax").val();

        if (fromTsvh) {
            $("#hdloaicongto_csct").val(fromTsvh);
            return;
        }

        if (fromPmax) {
            $("#hdloaicongto_csct").val(fromPmax);
        }
    }

    function handleTabChiSoCongTo(fromTab) {
        const meterId = getMeterId();
        if (!meterId) return doneCall();
        $("#hdMeterid_csct").val(meterId);
        setCsctLoaiCongToFromContext();
        let fromDate = "";
        let toDate = "";

        if (fromTab === "#chisopmax") {
            // Không lấy ngày từ Pmax
            fromDate = $("#txttungay_csct_ct").val() || getCurrentDateString();
            toDate = $("#txtdenngay_csct_ct").val() || getCurrentDateString();
        } else {
            const dateRange = getDateRangeByTab(fromTab);
            fromDate = dateRange.from;
            toDate = dateRange.to;
        }
        safeSetDate("#txttungay_csct_ct", fromDate);
        safeSetDate("#txtdenngay_csct_ct", toDate);

        if (typeof renderChiTietHeaderOnly === "function") {
            renderChiTietHeaderOnly();
        }

        if (typeof LoadSoCongTo_csct === "function") {
            LoadSoCongTo_csct(meterId);
        } else if (typeof triggerLoadChiSoChiTiet === "function") {
            triggerLoadChiSoChiTiet(true);
        }

        doneCall();
    }

    function handleTabThongSoVanHanh(fromTab) {
        const meterId = getMeterId();
        if (!meterId) return doneCall();
        $("#hdMeterid_tsvh").val(meterId);

        if ($("#hdloaicongto_csct").val()) {
            $("#hdloaicongto_tsvh").val($("#hdloaicongto_csct").val());
        }
        let fromDate = "";
        let toDate = "";

        if (fromTab === "#chisopmax") {
            // Không lấy ngày từ Pmax
            fromDate = $("#txttungay_tsvh").val() || getCurrentDateString();
            toDate = $("#txttungay_tsvh").val() || getCurrentDateString();
        } else {
            const dateRange = getDateRangeByTab(fromTab);
            fromDate = dateRange.from;
            toDate = dateRange.to;
        }
        safeSetDate("#txttungay_tsvh", fromDate);
        safeSetDate("#txtdenngay_tsvh", toDate);

        if (typeof LoadSoCongTo_TSVH === "function") {
            LoadSoCongTo_TSVH(meterId);
        }

        doneCall();
    }

    function handleTabBieuDoPhuTai(fromTab) {
        const meterId = getMeterId();
        if (!meterId) return doneCall();
        $("#hdMeterid_bdpt").val(meterId);
        let fromDate = "";
        let toDate = "";

        if (fromTab === "#chisopmax") {
            // Không lấy ngày từ Pmax
            fromDate = $("#txttungay_bdpt").val() || getCurrentDateString();
            toDate = $("#txtdenngay_bdpt").val() || getCurrentDateString();
        } else {
            const dateRange = getDateRangeByTab(fromTab);
            fromDate = dateRange.from;
            toDate = dateRange.to;
        }
        safeSetDate("#txttungay_bdpt", fromDate);
        safeSetDate("#txtdenngay_bdpt", toDate);

        if (typeof getDanhSachCongTo_bdpt === "function") {
            getDanhSachCongTo_bdpt(meterId);
        }

        doneCall();
    }
    function handleTabChiSoPmax() {
        const meterId = getMeterId();
        if (!meterId) return doneCall();

        $("#hdMeterid_pmax").val(meterId);
        $("#hdloaicongto_pmax").val(2);

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

        if (typeof LoadSoCongTo_pmax === "function") {
            LoadSoCongTo_pmax(meterId);
        }

        doneCall();
    }
    $(document)
        .off("shown.bs.tab.giamsat", `${MODAL_SELECTOR} ${TAB_SELECTOR}`)
        .on("shown.bs.tab.giamsat", `${MODAL_SELECTOR} ${TAB_SELECTOR}`, function (e) {
            const targetTab = $(e.target).attr("href") || "";
            const fromTab = $(e.relatedTarget).attr("href") || "";

            if (!targetTab) return;
            if (!canCallTab(targetTab)) return;

            switch (targetTab) {
                case "#chisocongto":
                    handleTabChiSoCongTo(fromTab);
                    break;

                case "#thongsovanhanh":
                    handleTabThongSoVanHanh(fromTab);
                    break;

                case "#bieudophutai":
                    handleTabBieuDoPhuTai(fromTab);
                    break;

                case "#chisopmax":
                    handleTabChiSoPmax();
                    break;

                default:
                    doneCall();
                    break;
            }
        });
})();

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