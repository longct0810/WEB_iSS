var isOK = false;
var instance = null;
var lst_tb = JSON.parse(localStorage.getItem("lst_tb") || "[]");

var currentNodeId = null;
var pollingTimer = null;
var isLoadingData = false;
var currentScale = 1;
const MIN_SCALE = 0.5;
const MAX_SCALE = 4;
const SCALE_STEP = 0.2;

function pad(n) {
  return String(n).padStart(2, "0");
}

function updateDigitalClock() {
  const now = new Date();

  const hh = document.getElementById("clock_hh");
  const mm = document.getElementById("clock_mm");
  const ss = document.getElementById("clock_ss");

  if (!hh || !mm || !ss) return;

  hh.textContent = pad(now.getHours());
  mm.textContent = pad(now.getMinutes());
  ss.textContent = pad(now.getSeconds());
  console.log(
    "Clock updated:",
    hh.textContent + ":" + mm.textContent + ":" + ss.textContent,
  );
}

$(document).ready(function () {
  if (!localStorage.getItem("us")) {
    window.location.href = "../login";
    return;
  }
  bootSoDoGiamSat();
});

async function bootSoDoGiamSat() {
  // const node = getCurrentNode();
  // if (!node) {
  //     toastr.error("Vui lòng chọn danh mục trên cây thư mục", "Thông báo");
  //     return;
  // };

  const loaded = await getDataSVG();
  if (!loaded) return;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getCurrentNode() {
  try {
    return JSON.parse(localStorage.getItem("node") || "null");
  } catch (e) {
    return null;
  }
}

function init() {
  const svgEl = document.getElementById("demoSVG");
  const containerEl = document.getElementById("SVGContainer");
  const viewportEl = document.getElementById("SVGViewport");

  if (!svgEl || !containerEl || !viewportEl) return;

  if (instance && typeof instance.destroy === "function") {
    instance.destroy();
    instance = null;
  }

  // Không dùng CSS transform nữa
  svgEl.style.transform = "";
  svgEl.style.transformOrigin = "";

  svgEl.setAttribute("width", "100%");
  svgEl.setAttribute("height", "100%");

  instance = svgPanZoom(svgEl, {
    zoomEnabled: true,
    panEnabled: true,
    controlIconsEnabled: false,
    mouseWheelZoomEnabled: true,
    dblClickZoomEnabled: true,
    fit: true,
    center: true,
    minZoom: 0.2,
    maxZoom: 20,
    zoomScaleSensitivity: 0.25,
    contain: false,
  });

  bindSvgPlayerControls();

  setTimeout(function () {
    instance.resize();
    instance.fit();
    instance.center();
  }, 100);

  $(".link_file").css("cursor", "pointer");
  $(".link_file")
    .off("click")
    .on("click", function () {
      const file = $(this).attr("inkscape:label");
      if (!file) {
        console.warn("Không có label:", this);
        return;
      }

      const code = file.replace(".svg", "");
      console.log("Clicked file:", file, "=> code:", code);
      getDataSVG_click(code);
    });

  applySvgViewportBg();
  applyToolbarState();
  bindSvgThemePanel();
  loadSvgThemeColors();

  updateDigitalClock();
  setInterval(updateDigitalClock, 1000);
}
function bindDeviceClickEvents() {
  $.each(lst_tb, function (k, v) {
    const parts = String(v).split("-");
    const id = parts[0];
    const $el = $("#thietbi_" + id);

    $el.off("click").on("click", function () {
      callModal(id);
    });
  });
}

async function f_laydulieugannhat(code) {
  // code = "001003001002";
  var user = localStorage.getItem("login_user");
  user = JSON.parse(user);
  var code = user.danhmucid;
  if (!code || isLoadingData) return;

  isLoadingData = true;

  try {
    const data = await $.ajax({
      url: "/api/sodomotsoi/getData",
      type: "POST",
      contentType: "application/json",
      dataType: "json",
      data: JSON.stringify({
        code: code,
      }),
    });

    renderSoDoMotSoi(Array.isArray(data) ? data : []);
    analytics_dashboard(Array.isArray(data) ? data : []);
  } catch (err) {
    console.error("Lỗi lấy dữ liệu sơ đồ 1 sợi:", err);
  } finally {
    isLoadingData = false;
  }
}
function analytics_dashboard(data) {
  if (!Array.isArray(data) || !data.length) return;
  var data_congto = [];
  var data_iec = [];
  $.each(data, function (k, v) {
    var ten_thietbi = v[0];
    var id_thietbi = v[1];
    var ioa = v[2];
    var value_ioa = v[3];
    var time_ioa = v[4];
    if (ten_thietbi == "CONGTOTONG") {
      data_congto.push(v);
    } else {
      data_iec.push(v);
    }
  });
  render_congto(data_congto);
  render_iec(data_iec);
}
// function render_congto(data) {
//   if (!Array.isArray(data) || !data.length) return;
//   $.each(data, function (k, v) {
//     $("#" + v[0] + "_" + v[2]).html(v[3].toFixed(2));
//   });
// }
const realtimeCache = {};

function render_congto(data) {
  if (!Array.isArray(data) || !data.length) return;

  $.each(data, function (k, v) {
    const key = v[0] + "_" + v[2];

    realtimeCache[key] = {
      base: Number(v[3]),
      current: Number(v[3]),
    };
  });
}

// realtime update mỗi giây
setInterval(() => {
  $.each(realtimeCache, function (key, item) {
    // CHỈ random nếu > 1
    if (item.base > 1) {
      // dao động nhỏ
      let step = Math.random() * 0.02 - 0.01;

      item.current += step;

      // giới hạn ±0.05 quanh base
      const min = item.base - 0.05;
      const max = item.base + 0.05;

      if (item.current < min) item.current = min;
      if (item.current > max) item.current = max;
    } else {
      // giữ nguyên giá trị
      item.current = item.base;
    }

    updateValueWithFlip(key, item.current.toFixed(2));
  });
}, 1000);
function warning_I0() {
  // =========================
  // Dòng điện
  // =========================
  const IA = Number($("#tbl_value_ioa_366621_7").text()) || 0;
  const IB = Number($("#tbl_value_ioa_366621_8").text()) || 0;
  const IC = Number($("#tbl_value_ioa_366621_9").text()) || 0;

  // =========================
  // cos phi
  // =========================
  const cosA = Number($("#tbl_value_ioa_366621_23").text()) || 0;
  const cosB = Number($("#tbl_value_ioa_366621_24").text()) || 0;
  const cosC = Number($("#tbl_value_ioa_366621_25").text()) || 0;

  // =========================
  // Góc pha (radian)
  // acos(cosφ)
  // =========================
  const phiA = Math.acos(cosA);
  const phiB = Math.acos(cosB);
  const phiC = Math.acos(cosC);

  // 120°
  const deg120 = (120 * Math.PI) / 180;

  // =========================
  // Thành phần X
  // =========================
  const x =
    IA * Math.cos(phiA) +
    IB * Math.cos(phiB - deg120) +
    IC * Math.cos(phiC + deg120);

  // =========================
  // Thành phần Y
  // =========================
  const y =
    IA * Math.sin(phiA) +
    IB * Math.sin(phiB - deg120) +
    IC * Math.sin(phiC + deg120);

  // =========================
  // I0
  // =========================
  const I0 = Math.sqrt(x * x + y * y);

  // =========================
  // % lệch pha
  // =========================
  const totalI = IA + IB + IC;

  let imbalance = 0;

  if (totalI > 0) {
    imbalance = ((3 * I0) / totalI) * 100;
  }

  // =========================
  // Đánh giá
  // =========================
  let text = "";
  let color = "";

  if (imbalance < 1.5) {
    text = "🟢 Bình thường";
    color = "#00c853";
  } else if (imbalance >= 1.5 && imbalance < 3) {
    text = "🟡 Lệch pha nhẹ";
    color = "#ffab00";
  } else {
    text = "🔴 Lệch pha nghiêm trọng";
    color = "#ff1744";
  }

  // =========================
  // Hiển thị
  // =========================
  $("#warning_I0")
    .html(
      `
      ${text} &nbsp;|&nbsp;
      I0: ${I0.toFixed(2)} A<br>
      Lệch pha: ${imbalance.toFixed(2)} %
    `,
    )
    .css({
      color: color,
      fontWeight: "bold",
    });

  console.log({
    IA,
    IB,
    IC,
    cosA,
    cosB,
    cosC,
    I0,
    imbalance,
  });
}

function updateValueWithFlip(key, value) {
  const $el = $("#" + key);
  // Không tồn tại element
  if (!$el.length) {
    return;
  }

  const oldValue = $el.text();
  // Chỉ animate khi giá trị đổi
  if (oldValue !== value) {
    $el.text(value);
    // reset animation
    $el.removeClass("flip-active");
    // force reflow
    // void $el[0].offsetWidth;
    // // add animation
    // $el.addClass("value-flip flip-active");
  }

  warning_I0();
}

function render_iec(data) {
  if (!Array.isArray(data) || !data.length) return;
  console.log("Dữ liệu công tơ:", data);
  var color_ = "red";
  var str = '<i class="fa-solid fa-door-closed green"></i>';
  $.each(data, function (k, v) {
    const ioa = v[2];
    const value = Number(v[3]);

    const $el = $("#tbl_value_ioa_" + v[1] + "_" + ioa);

    // trạng thái
    if (ioa === "3000" || ioa === "3001") {
      let color_ = "green";
      let str = value;

      // =========================
      // IOA 3000
      // =========================
      if (ioa === "3000") {
        if (value === 0) {
          color_ = "red";
        }

        str = "";
      }

      // =========================
      // IOA 3001
      // =========================
      if (ioa === "3001") {
        if (value === 0) {
          color_ = "red";
          str = '<i class="fa-solid fa-door-open red"></i>';
        } else {
          color_ = "green";
          str = '<i class="fa-solid fa-door-closed green"></i>';
        }
      }

      $el.removeClass("red green").addClass(color_).html(str);
    }

    // analog
    else {
      $el.html(value.toFixed(1));
    }
  });
}
function render_dashboard(data) {}

function renderSoDoMotSoi(data) {
  if (!Array.isArray(data) || !data.length) return;

  const latestTimeByDevice = {};

  $.each(data, function (k, v) {
    //console.log(v)
    var id_thietbi = v[1];
    var ioa = v[2];
    var value_ioa = v[3];
    var time_ioa = v[4];
    var label = $("#value_ioa_" + id_thietbi + "_" + ioa).attr(
      "inkscape:label",
    );
    var scale = 1;
    var status = "UN";
    var color = "red";
    switch (label) {
      case "trangthai":
        if (parseInt(value_ioa) === 1) {
          status = "CB_OFF";
          color = "green";
        } else if (parseInt(value_ioa) === 2) {
          status = "CB_ON";
          color = "yellow";
        } else {
          status = "CB_ON";
          color = "red";
        }

        break;
      case "canhbao":
        if (parseInt(value_ioa) === 1) {
          status = "CB_OFF";
          color = "green";
        } else {
          status = "CB_ON";
        }

        break;
      case undefined:
        scale = parseFloat(
          $("#value_ioa_" + id_thietbi + "_" + ioa).attr("inkscape:label"),
        );
        break;
      default:
        scale = parseFloat(
          $("#value_ioa_" + id_thietbi + "_" + ioa).attr("inkscape:label"),
        );
    }

    // console.log($("#value_ioa_" + id_thietbi + "_" + ioa).attr('inkscape:label'))

    // console.log("DATA", v);
    //console.log("DATA", v);
    switch (status) {
      case "UN":
        $("#time_ioa_" + id_thietbi + "_" + ioa).html(time_ioa);
        $("#value_ioa_" + id_thietbi + "_" + ioa).html(
          (value_ioa * scale).toFixed(1),
        );
        break;
      case "CB_ON":
      case "CB_OFF":
        const $el = $("#SVGContainer").find(
          "#value_ioa_" + id_thietbi + "_" + ioa,
        );
        $el[0].style.setProperty("fill", color, "important");
        $el.addClass("blink-glow");

        const $el_bg = $("#SVGContainer").find(
          "#value_ioa_" + id_thietbi + "_" + ioa + "_bg",
        );
        if (!$el_bg.length) return;

        // clear class cũ
        $el_bg.removeClass(function (index, className) {
          return (className.match(/bg-\S+/g) || []).join(" ");
        });

        if (color === "yellow" && label === "trangthai") {
          $el_bg.addClass("bg-" + color + " blink-glow");
        }
        break;
      default:
        $("#value_ioa_" + id_thietbi + "_" + ioa).html(status);
        $("#value_ioa_" + id_thietbi + "_" + ioa).css("color", color);
        break;
    }
  });

  fillLatestTimeToSvg(latestTimeByDevice);
}

function fillLatestTimeToSvg(latestTimeByDevice) {
  Object.keys(latestTimeByDevice).forEach(function (deviceId) {
    const time = latestTimeByDevice[deviceId] || "";

    // hỗ trợ nhiều kiểu id trên SVG nếu có
    const selectors = [
      "#time_latest_" + deviceId,
      "#time_device_" + deviceId,
      "#thoigian_" + deviceId,
    ];

    selectors.forEach(function (selector) {
      const $el = $(selector);
      if ($el.length) {
        $el.html(time);
      }
    });
  });
}

function getStyleTable() {
  $("#data_chitiet").DataTable({
    dom: "Brtp",
    paging: false,
    pageLength: 15,
    ordering: true,
    search: false,
    language: {
      paginate: {
        next: '<i class="fa fa-angle-double-right" style="line-height:2 !important" aria-hidden="true"></i>',
        previous:
          '<i class="fa fa-angle-double-left" style="line-height:2 !important" aria-hidden="true"></i>',
      },
    },
    scrollCollapse: true,
    scrollY: "70vh",
  });
}

function callModal(id) {
  var para = {
    v_idthietbi: parseInt(id, 10),
  };
  var url = "/api/ds_thietbi_home_IEC_104";
  var lst = ExecuteServiceSyns(JSON.stringify(para), url);
  var cambien = JSON.parse(lst[0]).cambien;
  var str = "";

  $("#data_chitiet tbody").empty();

  var activeRequestsTable = $("#data_chitiet").DataTable();
  activeRequestsTable.clear().destroy();

  $.each(cambien, function (k, v) {
    str +=
      '<tr data-value="' +
      v.ioa_diachi +
      '" class="tr_ioa">' +
      "<td>" +
      v.ten_ioa +
      "</td>" +
      '<td class="value_ioa_' +
      id +
      "_" +
      v.ioa_diachi +
      '">' +
      v.value +
      "</td>" +
      "<td>" +
      v.scale +
      "</td>" +
      "<td>" +
      v.ioa_diachi +
      "</td>" +
      '<td class="time_ioa_' +
      id +
      "_" +
      v.ioa_diachi +
      '">' +
      v.time +
      "</td>" +
      "<td>" +
      v.ghichu +
      "</td>" +
      "</tr>";
  });

  $("#data_chitiet tbody").empty().append(str);
  getStyleTable();

  $("#giamsatchitiet_modal").modal("show");

  $(".tr_ioa")
    .off("click")
    .on("click", function () {
      alert($(this).data("value"));
    });
}

function drawOnOff(id, status) {
  if (status == 1) {
    $("#" + id)
      .removeClass("blink_off")
      .addClass("blink_on");
  } else {
    $("#" + id)
      .removeClass("blink_on")
      .addClass("blink_off");
  }
}

function getData_IOA(id) {
  var para = {
    v_idthietbi: parseInt(id, 10),
  };
  var url = "/api/ds_thietbi_home_IEC_104";
  var lst = ExecuteServiceSyns(JSON.stringify(para), url);
  var cambien = JSON.parse(lst[0]).cambien;

  $("#time_ioa_" + id + "_300").html(cambien[0].time);

  $.each(cambien, function (k, v) {
    $("#value_ioa_" + id + "_" + v.ioa_diachi).html(v.value);
  });
}

function callModal_thietbi(id, type) {
  if (type == "mba") {
    loadtsvh(id, type);
    $("#thongsovanhanh_scada").show();
    $(".advc").hide();
    $(".cambien").show();
  } else {
    loadData(id, type);
    $("#thongsovanhanh_scada").hide();
    $(".advc").show();
    $(".cambien").hide();
  }

  $("#modal_thongsovanhanh_scada").modal("show");
}

async function getDataSVG() {
  //const node = getCurrentNode();
  // const code = node ? node.id : "001003001002";
  var user = localStorage.getItem("login_user");
  user = JSON.parse(user);
  var code = user.danhmucid;
  //  const code = "001003001002";
  $("#SVGContainer").empty();
  try {
    const xml = await $.ajax({
      type: "GET",
      //url: "/svg/" + code + ".svg",
      url: "/svg/" + code + "-dashboard" + ".svg",
      dataType: "xml",
    });

    var svg = $(xml).find("svg");

    $("#SVGContainer").empty().html(svg);

    const injectedSvg = $("#SVGContainer").find("svg")[0];
    if (injectedSvg && !injectedSvg.id) {
      injectedSvg.setAttribute("id", "demoSVG");
    }

    isOK = true;
    init();

    // 🔥 đảm bảo DOM ready
    return new Promise((resolve) => {
      setTimeout(() => resolve(true), 100);
      f_laydulieugannhat(code);
    });
  } catch (err) {
    return false;
  }
}

async function getDataSVG_click(code) {
  $("#SVGContainer").empty();
  try {
    const xml = await $.ajax({
      type: "GET",
      // url: "/svg/" + code + ".svg",
      url: "/svg/" + code + "-dashboard" + ".svg",
      dataType: "xml",
    });
    var svg = $(xml).find("svg");

    $("#SVGContainer").empty().html(svg);

    const injectedSvg = $("#SVGContainer").find("svg")[0];
    if (injectedSvg && !injectedSvg.id) {
      injectedSvg.setAttribute("id", "demoSVG");
    }

    isOK = true;
    init();
    const node = getCurrentNode();
    // 🔥 đảm bảo DOM ready
    return new Promise((resolve) => {
      setTimeout(() => resolve(true), 100);
      f_laydulieugannhat(node.id);
    });
  } catch (err) {
    return false;
  }
}
function bindSvgPlayerControls() {
  const btnZoomIn = document.getElementById("btnSvgZoomIn");
  const btnZoomOut = document.getElementById("btnSvgZoomOut");
  const btnReset = document.getElementById("btnSvgReset");
  //   const btnFit = document.getElementById("btnSvgFit");
  const btnBg = document.getElementById("btnSvgBg");
  const btnToggleToolbar = document.getElementById("btnToggleToolbar");
  const btnBack = document.getElementById("btnSvgBack");
  const btnFull = document.getElementById("btnSvgFit");
  const btnTheme = document.getElementById("btnSvgTheme");
  if (btnTheme) {
    btnTheme.onclick = function (e) {
      e.preventDefault();
      e.stopPropagation();

      const panel = document.getElementById("svgThemePanel");
      if (!panel) return;

      panel.classList.toggle("hidden");
      btnTheme.classList.toggle("active", !panel.classList.contains("hidden"));
    };
  }

  if (btnFull) {
    btnFull.onclick = function () {
      toggleFullscreen();
    };
  }
  if (btnToggleToolbar) {
    btnToggleToolbar.onclick = function (e) {
      e.preventDefault();
      e.stopPropagation();

      const toolbar = document.getElementById("svgFloatToolbar");
      if (!toolbar) return;

      toolbar.classList.toggle("collapsed");

      const isCollapsed = toolbar.classList.contains("collapsed");
      localStorage.setItem("svgToolbarCollapsed", isCollapsed ? "1" : "0");
    };
  }
  if (btnBack) {
    btnBack.onclick = function () {
      const node = getCurrentNode();
      getDataSVG_click(node.id);
    };
  }
  if (btnBg) {
    btnBg.onclick = function () {
      toggleSvgViewportBg();
    };
  }

  if (btnZoomIn) {
    btnZoomIn.onclick = function () {
      if (instance) instance.zoomIn();
    };
  }

  if (btnZoomOut) {
    btnZoomOut.onclick = function () {
      if (instance) instance.zoomOut();
    };
  }

  if (btnReset) {
    btnReset.onclick = function () {
      if (!instance) return;
      instance.resetZoom();
      instance.center();
    };
  }

  //   if (btnFit) {
  //     btnFit.onclick = function () {
  //       if (!instance) return;
  //       instance.resize();
  //       instance.fit();
  //       instance.center();
  //     };
  //   }
}
function toggleFullscreen() {
  const elem = document.getElementById("SVGViewport");

  if (!document.fullscreenElement) {
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) {
      elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) {
      elem.msRequestFullscreen();
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
  }
}
document.addEventListener("fullscreenchange", function () {
  const icon = document.querySelector("#btnSvgFit i");

  if (!icon) return;

  if (document.fullscreenElement) {
    icon.className = "fa fa-compress";
  } else {
    icon.className = "fa fa-expand";
  }
});
function applyToolbarState() {
  const toolbar = document.getElementById("svgFloatToolbar");
  if (!toolbar) return;

  const collapsed = localStorage.getItem("svgToolbarCollapsed") === "1";
  toolbar.classList.toggle("collapsed", collapsed);
}
// function zoomSvg(svgEl, nextScale) {
//   currentScale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, nextScale));
//   svgEl.style.transformOrigin = "center center";
//   svgEl.style.transform = "scale(" + currentScale + ")";
// }

// function resetSvgView(svgEl) {
//   currentScale = 1;
//   svgEl.style.transformOrigin = "center center";
//   svgEl.style.transform = "scale(1)";
// }

// function fitSvgToViewport(svgEl, viewportEl) {
//   if (!svgEl || !viewportEl) return;

//   const vb = svgEl.viewBox && svgEl.viewBox.baseVal;
//   if (!vb || !vb.width || !vb.height) {
//     resetSvgView(svgEl);
//     return;
//   }

//   const viewportWidth = viewportEl.clientWidth;
//   const viewportHeight = viewportEl.clientHeight;

//   const scaleX = viewportWidth / vb.width;
//   const scaleY = viewportHeight / vb.height;
//   const fitScale = Math.min(scaleX, scaleY) * 0.98;

//   currentScale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, fitScale));
//   svgEl.style.transformOrigin = "top left";
//   svgEl.style.transform = "scale(" + currentScale + ")";
// }

function setGray(id, isGray) {
  const img = document.getElementById(id);
  img.style.filter = isGray ? "grayscale(100%)" : "grayscale(0%)";
}

function bindSvgNavigationEvents() {
  $("#SVGContainer")
    .find(".link_file")
    .css("cursor", "pointer")
    .off("click")
    .on("click", async function (e) {
      e.preventDefault();
      e.stopPropagation();

      // 🔥 đọc file từ inkscape:label
      let file = $(this).attr("inkscape:label");

      if (!file) {
        console.warn("Không có label:", this);
        return;
      }

      // bỏ .svg nếu cần
      const code = file.replace(".svg", "");

      await getDataSVG(code);
    });
}
let svgBgIndex = Number(localStorage.getItem("svgBgIndex") || 0);

const svgBgClasses = ["", "bg-dark-svg"];

function toggleSvgViewportBg() {
  const viewport = document.getElementById("SVGViewport");
  if (!viewport) return;

  svgBgClasses.forEach((cls) => {
    if (cls) viewport.classList.remove(cls);
  });

  svgBgIndex = (svgBgIndex + 1) % svgBgClasses.length;

  const nextClass = svgBgClasses[svgBgIndex];
  if (nextClass) {
    viewport.classList.add(nextClass);
  }

  localStorage.setItem("svgBgIndex", svgBgIndex);
}
applySvgViewportBg();

function applySvgViewportBg() {
  const viewport = document.getElementById("SVGViewport");
  if (!viewport) return;

  svgBgClasses.forEach((cls) => {
    if (cls) viewport.classList.remove(cls);
  });

  const cls = svgBgClasses[svgBgIndex];
  if (cls) {
    viewport.classList.add(cls);
  }
}
const SVG_THEME_DEFAULT = {
  daydien: "#8b0000",
  gtext: "#006d77",
  khung: "#006d77",
  bangten: "#ffffff",
};

function applySvgGroupColor(groupId, color) {
  const $group = $("#SVGContainer").find("#" + groupId);
  if (!$group.length) {
    console.warn("Không tìm thấy group SVG:", groupId);
    return;
  }

  if (groupId === "bangten") {
    $group.find("rect,path,polygon,circle,ellipse").each(function () {
      this.style.setProperty("fill", color, "important");
    });
    return;
  }

  if (groupId === "gtext") {
    $group.find("text,path").each(function () {
      this.style.setProperty("stroke", color, "important");
    });
    return;
  }

  if (groupId === "daydien") {
    $group.find("path").each(function () {
      this.style.setProperty("stroke", color, "important");
    });
    $group.find("path").each(function () {
      this.style.setProperty("stroke", color, "important");
      // this.style.setProperty("fill", color, "important");
    });
    return;
  }
  if (groupId === "daydien" || groupId === "khung") {
    $group
      .find("path,line,polyline,polygon,rect,circle,ellipse")
      .each(function () {
        this.style.setProperty("stroke", color, "important");
      });
    return;
  }
}
function bindSvgThemePanel() {
  $("#svgThemePanel input[type='color']")
    .off("input change")
    .on("input change", function () {
      const groupId = this.dataset.svgGroup;
      const color = this.value;

      applySvgGroupColor(groupId, color);
      saveSvgThemeColor(groupId, color);
    });

  $("#btnResetSvgTheme")
    .off("click")
    .on("click", function () {
      localStorage.removeItem("svgThemeColors");
      loadSvgThemeColors(true);
    });
}

function saveSvgThemeColor(groupId, color) {
  const theme = JSON.parse(localStorage.getItem("svgThemeColors") || "{}");
  theme[groupId] = color;
  localStorage.setItem("svgThemeColors", JSON.stringify(theme));
}

function loadSvgThemeColors(resetDefault) {
  const saved = resetDefault
    ? {}
    : JSON.parse(localStorage.getItem("svgThemeColors") || "{}");

  const theme = {
    ...SVG_THEME_DEFAULT,
    ...saved,
  };

  Object.keys(theme).forEach(function (groupId) {
    const color = theme[groupId];

    const input = document.querySelector(
      `#svgThemePanel input[data-svg-group="${groupId}"]`,
    );

    if (input) input.value = color;

    applySvgGroupColor(groupId, color);
  });
}
