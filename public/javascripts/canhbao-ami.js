(function () {
  "use strict";

  // =========================
  // CONFIG
  // =========================
  var ALERT_API_URL = "/api/canhbao/sukien";
  var ALERT_POLLING_INTERVAL = 5000; // 5 giây

  var alertPollingTimer = null;
  var isFetchingAlerts = false;
  var lastEventTime = null;
  var shownAlertKeys = new Set();

  // =========================
  // START
  // =========================
  $(document).ready(function () {
    startAlertPolling(ALERT_POLLING_INTERVAL);
  });

  function startAlertPolling(intervalMs) {
    stopAlertPolling();
    fetchAlertEvents();
    alertPollingTimer = setInterval(fetchAlertEvents, intervalMs || ALERT_POLLING_INTERVAL);
  }

  function stopAlertPolling() {
    if (alertPollingTimer) {
      clearInterval(alertPollingTimer);
      alertPollingTimer = null;
    }
  }

  // =========================
  // FETCH API
  // =========================
  async function fetchAlertEvents() {
    if (isFetchingAlerts) return;
    isFetchingAlerts = true;

    try {
      var url = ALERT_API_URL;

      if (lastEventTime) {
        url += "?fromTime=" + encodeURIComponent(lastEventTime);
      }

      var response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      });

      if (!response.ok) {
        throw new Error("HTTP " + response.status);
      }

      var result = await response.json();

      var rows = Array.isArray(result) ? result : [];

      if (!rows.length) return;

      for (var i = 0; i < rows.length; i++) {
        handleAlertItem(rows[i]);
      }

      var lastRow = rows[rows.length - 1];
      lastEventTime =
        lastRow.time ||
        lastRow.TIME ||
        lastRow.time_event ||
        lastRow.TIME_EVENT ||
        lastEventTime;

    } catch (error) {
      console.error("Lỗi lấy dữ liệu cảnh báo:", error);
    } finally {
      isFetchingAlerts = false;
    }
  }

  // =========================
  // HANDLE DATA
  // =========================
  function handleAlertItem(data) {
    if (!data) return;

    var imei = data.imei || "";
    var socongto = data.socongto || "";
    var sukienCode = data.value || "";
    var rawTime = data.timestart || "";
    var event = data.event ?? "";
    var value = String(data.value || data.VALUE || "");

    var time = formatDateTime(rawTime);

    // chống hiển thị trùng toast
    var uniqueKey = [
      imei,
      socongto,
      sukienCode,
      rawTime,
      value,
      event
    ].join("|");

    if (shownAlertKeys.has(uniqueKey)) return;
    shownAlertKeys.add(uniqueKey);

    // tránh Set quá lớn
    if (shownAlertKeys.size > 3000) {
      var firstKey = shownAlertKeys.values().next().value;
      shownAlertKeys.delete(firstKey);
    }

    if (event !== "PowerOutage_PowerDownCounter" && event !== "PowerOutage_PowerUpCounter_Module") {
      var sukien = getTensukien(event, value);
      createToast(
        "Khách hàng: " + socongto + "; " + sukien + " - Thời gian: " + time
      );
    }

  }

  // =========================
  // TOAST
  // =========================
  function createToast_dat(msg, type) {
    toastr.error(msg, "Thông báo", {
      positionClass: "toast-bottom-right " + type,
      timeOut: 0,
      closeButton: true,
      debug: false,
      newestOnTop: true,
      progressBar: true,
      preventDuplicates: true,
      onclick: function () {
        location.href = "/sukiencongto";
      },
      showDuration: "2000",
      hideDuration: "1000",
      extendedTimeOut: "1000",
      showEasing: "swing",
      hideEasing: "linear",
      showMethod: "fadeIn",
      hideMethod: "fadeOut",
      tapToDismiss: true
    });
  }

  function createToast(msg, type) {
    type = String(type || "");

    if (type.indexOf("STOP") !== -1) {
      toastr.success(msg, "Thông báo", {
        positionClass: "toast-bottom-right " + type,
        timeOut: 0,
        closeButton: true,
        debug: false,
        newestOnTop: true,
        progressBar: true,
        preventDuplicates: true,
        onclick: function () {
          location.href = "/sukiencongto";
        },
        showDuration: "2000",
        hideDuration: "1000",
        extendedTimeOut: "1000",
        showEasing: "swing",
        hideEasing: "linear",
        showMethod: "fadeIn",
        hideMethod: "fadeOut",
        tapToDismiss: true
      });
    } else {
      toastr.error(msg, "Thông báo", {
        positionClass: "toast-bottom-right " + type,
        timeOut: 0,
        closeButton: true,
        debug: false,
        newestOnTop: true,
        progressBar: true,
        preventDuplicates: true,
        onclick: function () {
          location.href = "/sukiencongto";
        },
        showDuration: "2000",
        hideDuration: "1000",
        extendedTimeOut: "1000",
        showEasing: "swing",
        hideEasing: "linear",
        showMethod: "fadeIn",
        hideMethod: "fadeOut",
        tapToDismiss: true
      });
    }
  }

  // =========================
  // FORMAT TIME
  // hỗ trợ cả chuỗi cũ YYMMDDHH24MISS và chuỗi date trả từ API
  // =========================
  function formatDateTime(input) {
    if (!input) return "";

    var str = String(input).trim();

    // dạng cũ: YYMMDDHH24MISS
    if (/^\d{12}$/.test(str)) {
      var year = "20" + str.substring(0, 2);
      var month = str.substring(2, 4);
      var day = str.substring(4, 6);
      var hour = str.substring(6, 8);
      var minute = str.substring(8, 10);
      var second = str.substring(10, 12);

      return year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second;
    }

    // dạng ISO / string date
    var d = new Date(str);
    if (!isNaN(d.getTime())) {
      var yyyy = d.getFullYear();
      var MM = String(d.getMonth() + 1).padStart(2, "0");
      var dd = String(d.getDate()).padStart(2, "0");
      var hh = String(d.getHours()).padStart(2, "0");
      var mm = String(d.getMinutes()).padStart(2, "0");
      var ss = String(d.getSeconds()).padStart(2, "0");

      return yyyy + "-" + MM + "-" + dd + " " + hh + ":" + mm + ":" + ss;
    }

    return str;
  }


  // =========================
  // MAP TÊN SỰ KIỆN
  // Tôi giữ nguyên style cũ của bạn.
  // Bạn có thể thay toàn bộ function này bằng bản đầy đủ đang dùng nếu muốn.
  // =========================
  function getTensukien(obis, value) {
    value = String(value || "");

    switch (obis) {
      case "1.0.95.6":
      case "1.0.95.8":
        return value.indexOf("STOP") !== -1
          ? "Hết cảnh báo : Điện áp thấp pha A"
          : "Cảnh báo: Điện áp thấp pha A";

      case "1.0.95.7":
      case "1.0.95.9":
        return value.indexOf("STOP") !== -1
          ? "Hết cảnh báo : Điện áp cao pha A"
          : "Cảnh báo: Điện áp cao pha A";

      case "1.0.95.10":
        return value.indexOf("STOP") !== -1
          ? "Hết cảnh báo : Điện áp thấp pha B"
          : "Cảnh báo: Điện áp thấp pha B";

      case "1.0.95.11":
        return value.indexOf("STOP") !== -1
          ? "Hết cảnh báo : Điện áp cao pha B"
          : "Cảnh báo: Điện áp cao pha B";

      case "1.0.95.12":
        return value.indexOf("STOP") !== -1
          ? "Hết cảnh báo : Điện áp thấp pha C"
          : "Cảnh báo: Điện áp thấp pha C";

      case "1.0.95.13":
        return value.indexOf("STOP") !== -1
          ? "Hết cảnh báo : Điện áp cao pha C"
          : "Cảnh báo: Điện áp cao pha C";

      case "RTCBattery_UV_SC":
        return value.indexOf("STOP") !== -1
          ? "Hết cảnh báo : Pin đồng hồ yếu"
          : "Cảnh báo: Pin đồng hồ yếu";

      case "CURate_SC":
        return value.indexOf("STOP") !== -1
          ? "Hết cảnh báo : Mất cân bằng dòng"
          : "Cảnh báo: Mất cân bằng dòng";
      case "PowerRev_SC":
        if (value.indexOf('STOP') != -1) {
          return 'Hết cảnh báo: Ngược chiều công suất'
          break;
        } else {
          return 'Cảnh báo: Ngược chiều công suất'
          break;
        }

      case "PowerOutage_PowerUpCounter":
        return value.indexOf("STOP") !== -1
          ? "Hết cảnh báo : Công tơ bị mất điện"
          : "Cảnh báo: Công tơ bị mất điện";

      case "PowerOutage_PowerUpCounter_Module":
        return value.indexOf("STOP") !== -1
          ? "Hết cảnh báo: Mất nguồn module"
          : "Mất nguồn module";

      case "PowerOutage_PowerDownCounter":
        return value.indexOf("STOP") !== -1
          ? "Hết cảnh báo: Mất điện công tơ"
          : "Cảnh báo: Mất điện công tơ";

      case "TimeSync_SetCounter":
        return value.indexOf("STOP") !== -1
          ? "Hết cảnh báo: Đồng bộ thời gian"
          : "Cảnh báo: Đồng bộ thời gian";

      case "ElectrICalLeak_SC":
        return value.indexOf("STOP") !== -1
          ? "Hết cảnh báo: Rò điện"
          : "Cảnh báo: Rò điện";

      case "CustomerAptomatOff_OC":
        return value.indexOf("STOP") !== -1
          ? "Aptomat khách hàng có điện trở lại"
          : "Mất điện sau Aptomat khách hàng";

      case "OpenMeterCover_OC":
        return "Đóng/Mở vỏ công tơ";

      case "OpenTerminalCover_OC":
        return value.indexOf("STOP") !== -1
          ? "Đã đóng nắp che cầu đấu"
          : "Đang mở nắp che cầu đấu";

      case "OpenMeterBox_OC":
        return value.indexOf("STOP") !== -1
          ? "Đã đóng hộp công tơ"
          : "Đang mở hộp công tơ";

      case "LatchingOff_SC":
        return value.indexOf("STOP") !== -1
          ? "Công tơ đã đóng điện"
          : "Công tơ bị cắt điện";

      case "PhaseC_UnderVoltage_StopTime":
        return value.indexOf("STOP") !== -1
          ? "Hết cảnh báo: Ngược chiều công suất"
          : "Cảnh báo: Ngược chiều công suất";

      case "PhaseSeqRev_SC":
        return value.indexOf("STOP") !== -1
          ? "Hết cảnh báo: Sai thứ tự pha"
          : "Cảnh báo: Sai thứ tự pha";

      case "PhaseA_UV_SC":
        return value.indexOf("STOP") !== -1
          ? "Hết cảnh báo: Thấp áp pha A"
          : "Cảnh báo: Thấp áp pha A";

      case "PhaseB_UV_SC":
        return value.indexOf("STOP") !== -1
          ? "Hết cảnh báo: Thấp áp pha B"
          : "Cảnh báo: Thấp áp pha B";

      case "PhaseC_UV_SC":
        return value.indexOf("STOP") !== -1
          ? "Hết cảnh báo: Thấp áp pha C"
          : "Cảnh báo: Thấp áp pha C";

      case "PhaseA_OV_SC":
        return value.indexOf("STOP") !== -1
          ? "Hết cảnh báo: Quá Áp Pha A"
          : "Cảnh báo: Quá Áp Pha A";

      case "PhaseB_OV_SC":
        return value.indexOf("STOP") !== -1
          ? "Hết cảnh báo: Quá Áp Pha B"
          : "Cảnh báo: Quá Áp Pha B";

      case "PhaseC_OV_SC":
        return value.indexOf("STOP") !== -1
          ? "Hết cảnh báo: Quá Áp Pha C"
          : "Cảnh báo: Quá Áp Pha C";

      case "PhaseA_OC_SC":
        return value.indexOf("STOP") !== -1
          ? "Hết cảnh báo Quá dòng Pha A"
          : "Cảnh báo: Quá dòng Pha A";

      case "PhaseB_OC_SC":
        return value.indexOf("STOP") !== -1
          ? "Hết cảnh báo: Quá dòng Pha B"
          : "Cảnh báo: Quá dòng Pha B";

      case "PhaseC_OC_SC":
        return value.indexOf("STOP") !== -1
          ? "Hết cảnh báo: Quá dòng Pha C"
          : "Cảnh báo: Quá dòng Pha C";

      case "Mat_pha_A":
        return value.indexOf("STOP") !== -1
          ? "Hết cảnh báo: Mất pha A"
          : "Cảnh báo: Mất pha A";

      case "Mat_pha_B":
        return value.indexOf("STOP") !== -1
          ? "Hết cảnh báo: Mất pha B"
          : "Cảnh báo: Mất pha B";

      case "Mat_pha_C":
        return value.indexOf("STOP") !== -1
          ? "Hết cảnh báo: Mất pha C"
          : "Cảnh báo: Mất pha C";

      case "VURate_SC":
        return value.indexOf("STOP") !== -1
          ? "Hết cảnh báo: Mất cân bằng Áp"
          : "Cảnh báo: Mất cân bằng Áp";

      case "PEnergy_5_10_SC":
        return "Cảnh báo sắp hết sản lượng lần 1";

      case "PEnergy_1_5_SC":
        return "Cảnh báo lần 2: Sắp hết sản lượng";

      case "PEnergy_0_1_SC":
        return "Cảnh báo lần 3: Sắp hết sản lượng";

      case "PEnergy_0_SC":
        return "Cảnh báo: Hết sản lượng ứng trước";

      case "Mat_pha_A":
        return value.indexOf("STOP") !== -1
          ? "DCU có điện trở lại"
          : "DCU mất điện";

      default:
        return obis || "Không xác định";
    }
  }

  // expose nếu cần gọi ngoài file
  window.startAlertPolling = startAlertPolling;
  window.stopAlertPolling = stopAlertPolling;
})();