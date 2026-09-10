
var lstTsvh_bdpt = [];
var tt_nhamay = "";
let aiReportTimer = null;
// dashboard
$(document).ready(function () {
  const savedCode = localStorage.getItem("code_nhamay");

  if (savedCode) {
    reloadDashboardByNhaMay(savedCode);
    loadBaoCaoAI(savedCode);
    startBaoCaoAITimer();
  }

  window.addEventListener("nhamay:changed", function (e) {
    const child_code = e.detail.child_code;
    reloadDashboardByNhaMay(child_code);
    loadBaoCaoAI(child_code);
    startBaoCaoAITimer();
  });

  $("#bdptPrev").on("click", function () {
    if (bdptPage > 1) {
      bdptPage--;
      renderBdptPage();
    }
  });

  $("#bdptNext").on("click", function () {
    const totalPage = Math.ceil(feeders.length / bdptPageSize);
    if (bdptPage < totalPage) {
      bdptPage++;
      renderBdptPage();
    }
  });



  // loadBaoCaoAI(savedCode);

});

function startBaoCaoAITimer() {

  if (aiReportTimer) {
    clearInterval(aiReportTimer);
  }

  aiReportTimer = setInterval(() => {

    const nhaMay =
      $('#cb_nhamay').val() ||
      localStorage.getItem('child_code');

    if (!nhaMay) return;

    console.log('Auto refresh AI Report:', new Date());

    loadBaoCaoAI(nhaMay);

  }, 15 * 60 * 1000); // 15 phút
}

function getTodayVN() {
  const d = new Date();
  return [
    String(d.getDate()).padStart(2, '0'),
    String(d.getMonth() + 1).padStart(2, '0'),
    d.getFullYear()
  ].join('/');
}

function parseAiRows(response) {
  if (!Array.isArray(response)) return [];

  return response
    .map(r => {
      const raw = r.JSON_DATA || r.json_data;
      return typeof raw === 'string' ? JSON.parse(raw) : raw;
    })
    .filter(Boolean);
}

function getValuesByDiaChi(ioaData, diachi) {
  const item = ioaData.find(x => Number(x.ioa_diachi) === Number(diachi));
  if (!item || !Array.isArray(item.cambien)) return [];

  return item.cambien
    .map(x => typeof x === 'string' ? JSON.parse(x) : x)
    .map(x => Number(x.value))
    .filter(x => !Number.isNaN(x));
}

function avg(arr) {
  return arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;
}

function max(arr) {
  return arr.length ? Math.max(...arr) : 0;
}

function round(v, n = 2) {
  return Number(Number(v || 0).toFixed(n));
}
function buildAiRecommendation(x) {
  const notes = [];

  if (x.score >= 90) {
    notes.push('Hệ thống đang vận hành ổn định, không phát hiện bất thường nghiêm trọng.');
  } else if (x.score >= 75) {
    notes.push('Hệ thống vận hành bình thường nhưng có một số thông số cần theo dõi.');
  } else {
    notes.push('Phát hiện dấu hiệu bất thường, cần kiểm tra thiết bị và chất lượng điện năng.');
  }

  notes.push(`Điện áp 3 pha hiện tại ${round(x.avgUa, 1)} / ${round(x.avgUb, 1)} / ${round(x.avgUc, 1)} V.`);

  if (x.imbalance > 20) {
    notes.push(`Dòng điện mất cân bằng ${round(x.imbalance)}%, cần kiểm tra phân bố tải.`);
  } else {
    notes.push(`Dòng điện các pha ở mức ${round(x.avgIa, 2)} / ${round(x.avgIb, 2)} / ${round(x.avgIc, 2)} A.`);
  }

  notes.push(`Công suất phụ tải hiện tại khoảng ${round(x.maxP, 2)} kW.`);

  if (x.avgPf >= 0.95) {
    notes.push(`Cosφ đạt ${round(x.avgPf, 2)}, hệ số công suất tốt.`);
  } else {
    notes.push(`Cosφ đạt ${round(x.avgPf, 2)}, nên tiếp tục theo dõi hệ thống bù.`);
  }

  notes.push(`Tần số ${round(x.avgFreq, 2)} Hz, THD trung bình ${round(x.avgThd, 2)}%.`);

  return notes.join(' ');
}

async function loadBaoCaoAI(v_idthietbi) {
  try {
    const today = getTodayVN();

    showBaoCaoAILoading();

    const res = await $.ajax({
      url: '/api/baocao_ai_vanhanh_ngay',
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify({
        v_idthietbi: String(v_idthietbi),
        v_tungay: today,
        v_denngay: today
      })
    });

    let data = null;

    // Kiểu mới: backend đã xử lý rule
    if (res && res.success === true && res.data) {
      data = res.data;
    }

    // Kiểu cũ: API trả mảng json_data
    if (!data && Array.isArray(res)) {
      const ioaData = parseAiRows(res);

      const ia = getValuesByDiaChi(ioaData, 4000);
      const ib = getValuesByDiaChi(ioaData, 4001);
      const ic = getValuesByDiaChi(ioaData, 4002);

      const ua = getValuesByDiaChi(ioaData, 4104);
      const ub = getValuesByDiaChi(ioaData, 4105);
      const uc = getValuesByDiaChi(ioaData, 4106);

      const pTotal = getValuesByDiaChi(ioaData, 4203);
      const pf = getValuesByDiaChi(ioaData, 4283);
      const freq = getValuesByDiaChi(ioaData, 4300);

      const thdUa = getValuesByDiaChi(ioaData, 4504);
      const thdUb = getValuesByDiaChi(ioaData, 4505);
      const thdUc = getValuesByDiaChi(ioaData, 4506);

      const avgUa = avg(ua);
      const avgUb = avg(ub);
      const avgUc = avg(uc);

      const avgIa = avg(ia);
      const avgIb = avg(ib);
      const avgIc = avg(ic);

      const avgPf = avg(pf);
      const avgFreq = avg(freq);
      const avgThd = avg([avg(thdUa), avg(thdUb), avg(thdUc)].filter(x => x > 0));
      const maxPValue = max(pTotal);

      const noElectricalData =
        avgUa === 0 &&
        avgUb === 0 &&
        avgUc === 0 &&
        avgIa === 0 &&
        avgIb === 0 &&
        avgIc === 0 &&
        maxPValue === 0;

      const avgI = avg([avgIa, avgIb, avgIc].filter(x => x > 0));

      const imbalance = avgI > 0
        ? Math.max(
          Math.abs(avgIa - avgI),
          Math.abs(avgIb - avgI),
          Math.abs(avgIc - avgI)
        ) / avgI * 100
        : 0;

      let score = 100;

      if (noElectricalData) {
        score = 0;
      } else {
        const voltageBad = [avgUa, avgUb, avgUc].some(v => v > 0 && (v < 198 || v > 242));

        if (voltageBad) score -= 10;
        if (avgPf > 0 && avgPf < 0.9) score -= 10;
        if (avgFreq > 0 && (avgFreq < 49.5 || avgFreq > 50.5)) score -= 10;
        if (avgThd > 5) score -= 15;
        if (imbalance > 20) score -= 15;

        score = Math.max(score, 0);
      }

      const voltageStatus = noElectricalData
        ? 'Không có dữ liệu'
        : [avgUa, avgUb, avgUc].some(v => v > 0 && (v < 198 || v > 242))
          ? 'Bất thường'
          : 'Bình thường';

      const currentStatus = noElectricalData
        ? 'Không có dữ liệu'
        : imbalance > 20
          ? 'Mất cân bằng'
          : imbalance > 10
            ? 'Cần theo dõi'
            : 'Cân bằng';

      const pfStatus =
        avgPf >= 0.95 ? 'Tốt' :
          avgPf >= 0.9 ? 'Khá' :
            avgPf > 0 ? 'Cần theo dõi' :
              'Chưa có dữ liệu';

      const status = noElectricalData
        ? 'Không có dữ liệu'
        : score >= 90 ? 'Tốt'
          : score >= 75 ? 'Cần theo dõi'
            : score >= 60 ? 'Bất thường'
              : 'Nguy cơ cao';

      const recommendation = noElectricalData
        ? 'Không ghi nhận dữ liệu điện áp, dòng điện và công suất trong khoảng thời gian đánh giá. Có thể thiết bị đang OFF, mất nguồn đo lường, mất kết nối Gateway/RTU hoặc chưa phát sinh dữ liệu SCADA. Khuyến nghị kiểm tra trạng thái thiết bị, nguồn cấp và đường truyền SCADA.'
        : buildAiRecommendation({
          score,
          avgUa,
          avgUb,
          avgUc,
          avgIa,
          avgIb,
          avgIc,
          avgPf,
          avgFreq,
          avgThd,
          imbalance,
          maxP: maxPValue
        });

      data = {
        score,
        status,
        voltage_status: voltageStatus,
        current_status: currentStatus,
        pf_status: pfStatus,

        avg_ua: round(avgUa, 1),
        avg_ub: round(avgUb, 1),
        avg_uc: round(avgUc, 1),

        avg_ia: round(avgIa, 2),
        avg_ib: round(avgIb, 2),
        avg_ic: round(avgIc, 2),

        max_p: round(maxPValue, 2),
        avg_pf: round(avgPf, 2),
        avg_freq: round(avgFreq, 2),
        avg_thd: round(avgThd, 2),

        warning_count: noElectricalData ? 1 : 0,
        no_electrical_data: noElectricalData,

        recommendation
      };
    }

    if (!data) {
      throw new Error('API không trả dữ liệu báo cáo AI');
    }

    $('#aiScore').text(data.score ?? '--');

    $('#aiStatus')
      .removeClass()
      .addClass(
        data.no_electrical_data ? 'ai-status warning' :
          data.score >= 90 ? 'ai-status good' :
            data.score >= 75 ? 'ai-status warning' :
              'ai-status danger'
      )
      .html(
        data.no_electrical_data
          ? '<i class="fas fa-triangle-exclamation"></i> Không có dữ liệu'
          : data.score >= 90
            ? '<i class="fas fa-circle"></i> Tốt'
            : data.score >= 75
              ? '<i class="fas fa-triangle-exclamation"></i> Cần theo dõi'
              : '<i class="fas fa-bolt"></i> Bất thường'
      );

    const recommendation = data.recommendation || 'Chưa có khuyến nghị.';
    window.currentAiRecommendation = recommendation;

    const shortRecommendation = recommendation.length > 90
      ? recommendation.substring(0, 90) + '...'
      : recommendation;

    $('#aiSummary').html(`
      <div class="ai-kpi-list">
        <div class="ai-kpi-item">
          <span>⚡ Điện áp</span>
          <b>${data.voltage_status || 'Chưa có dữ liệu'}</b>
        </div>

        <div class="ai-kpi-item">
          <span>UA / UB / UC</span>
          <b>${data.avg_ua || 0} / ${data.avg_ub || 0} / ${data.avg_uc || 0} V</b>
        </div>

        <div class="ai-kpi-item">
          <span>🔌 Dòng điện</span>
          <b>${data.current_status || 'Chưa có dữ liệu'}</b>
        </div>

        <div class="ai-kpi-item">
          <span>IA / IB / IC</span>
          <b>${data.avg_ia || 0} / ${data.avg_ib || 0} / ${data.avg_ic || 0} A</b>
        </div>

        <div class="ai-kpi-item">
          <span>⚙ Công suất</span>
          <b>${data.max_p || 0} kW</b>
        </div>

        <div class="ai-kpi-item">
          <span>📈 Cosφ</span>
          <b>${data.pf_status || 'Chưa có dữ liệu'} (${data.avg_pf || 0})</b>
        </div>

        <div class="ai-kpi-item">
          <span>🌐 Tần số</span>
          <b>${data.avg_freq ? data.avg_freq + ' Hz' : 'Chưa có dữ liệu'}</b>
        </div>

        <div class="ai-kpi-item">
          <span>📊 THD</span>
          <b>${data.avg_thd ? data.avg_thd + ' %' : 'Chưa có dữ liệu'}</b>
        </div>

        <div class="ai-kpi-item">
          <span>⚠ Cảnh báo</span>
          <b>${data.warning_count || 0}</b>
        </div>
      </div>

      <div class="ai-recommend ai-recommend-click" id="aiRecommendBox">
        <div class="ai-recommend-title">💡 Khuyến nghị</div>
        <div>${shortRecommendation}</div>
        <div class="ai-view-more">Xem chi tiết</div>
      </div>
    `);
    $('#aiLastUpdate').text(
      'Cập nhật: ' +
      new Date().toLocaleTimeString('vi-VN')
    );

  } catch (err) {
    console.error(err);

    $('#aiScore').text('--');

    $('#aiStatus')
      .removeClass()
      .addClass('ai-status danger')
      .html('<i class="fas fa-circle-xmark"></i> Lỗi');

    $('#aiSummary').html(`
      <div class="ai-recommend">
        Không thể tải báo cáo thông minh.
      </div>
    `);
  }
}

$(document).on('click', '#aiRecommendBox', function () {
  const text = window.currentAiRecommendation || 'Không có nội dung khuyến nghị.';

  $('#aiModalBody').html(`
        <div class="ai-modal-section">
            ${text
      .split('. ')
      .filter(Boolean)
      .map(x => `<p>• ${x.trim()}${x.endsWith('.') ? '' : '.'}</p>`)
      .join('')}
        </div>
    `);

  $('#aiReportModal').fadeIn(150);
});

$(document).on('click', '#aiModalClose', function () {
  $('#aiReportModal').fadeOut(150);
});

$(document).on('click', '#aiReportModal', function (e) {
  if (e.target.id === 'aiReportModal') {
    $('#aiReportModal').fadeOut(150);
  }
});

function reloadDashboardByNhaMay(child_code) {
  if (!child_code) return;
showBaoCaoAILoading();
 // load_bdpt(child_code);
 // loadDuLieuSongHai_KH(child_code);
 loadDuLieu_THD(child_code);
  f_canhbao(child_code);
}


// function getSoCongToByChildCode(child_code) {
//   const map = {
//     "001003001004": "2527990001", // NHÀ MÁY 1
//     "001003001002": "2527990002", // Nhà máy 2
//     "001003001001": "2527990001"  // Lộ 01, chỉnh lại nếu lộ có công tơ riêng
//   };

//   return map[child_code] || "2527990001";
// }

async function getSoCongToByChildCode(child_code) {
  const result = await $.ajax({
    url: "/api/get_meter_by_child_code",
    type: "POST",
    contentType: "application/json;charset=utf-8",
    dataType: "json",
    data: JSON.stringify({
      child_code: child_code
    })
  });

  return {
    meterId: result.METERID,
    soCongTo: result.SOCONGTO,
    code: result.CODE
  };
}

// THD ĐIỆN ÁP và DÒNG ĐIỆN
// async function loadDuLieuSongHai_KH(child_code) {
//   const meterInfo = await getSoCongToByChildCode(child_code);
//   console.log("Meter info for child_code", child_code, meterInfo);
//   // lấy ngày hiện tại
//   const today = new Date();
//   // format dd/MM/yyyy
//   const currentDate =
//     String(today.getDate()).padStart(2, '0') + '/' +
//     String(today.getMonth() + 1).padStart(2, '0') + '/' +
//     today.getFullYear();
//   var tungay = currentDate;


//   //kiểm tra từ ngày đến ngày
//   var DulieuSongHai = new Object();
//   //DulieuSongHai.MeterId = 13124352;
//   DulieuSongHai.MeterId = meterInfo.meterId || 13124352;
//   // DulieuSongHai.SoCongTo = "2527990001";
//   DulieuSongHai.SoCongTo = meterInfo.soCongTo || "2527990001";
//   DulieuSongHai.TuNgay = tungay;
//   DulieuSongHai.SoTrang = 0;
//   DulieuSongHai.SoDong = 100000;
//   DulieuSongHai.gio = "";
//   DulieuSongHai.mataikhoan = 1;

//   $.ajax({
//     url: "/api/khaithacdulieu_laydulieusonghai",
//     data: JSON.stringify(DulieuSongHai),
//     type: "POST",
//     contentType: "application/json;charset=utf-8",
//     dataType: "json",
//     success: function (result) {
//       lstSongHai = result;
//        
//       drawData_bdsh_v2(lstSongHai);

//     },
//     error: function (errormessage) {
//     }
//   });
// }
async function loadDuLieu_THD(child_code) {
    var Dulieu = new Object();
    Dulieu.code = child_code;
    $.ajax({
    url: "/api/sodomotsoi/dulieusonghai_ioa",
    data: JSON.stringify(Dulieu),
    type: "POST",
    contentType: "application/json;charset=utf-8",
    dataType: "json",
    success: function (result) {
      lstdata = result;
      
      drawData_bdsh_v2(lstdata);

    },
    error: function (errormessage) {
    }
  });
}

function drawData_bdsh_v2(data) {
  var groupedArray = groupByTime(data);
  // THD điện áp
  var ar_THD_a = [];
  var ar_THD_b = [];
  var ar_THD_c = [];

  // THDI dòng điện
  var ar_THDI_a = [];
  var ar_THDI_b = [];
  var ar_THDI_c = [];

  var ar_THD_time = [];

  // harmonics điện áp
  var harmonicsUAByTime = [];
  var harmonicsUBByTime = [];
  var harmonicsUCByTime = [];

  // harmonics dòng điện
  var harmonicsIAByTime = [];
  var harmonicsIBByTime = [];
  var harmonicsICByTime = [];

  $.each(groupedArray, function (k, v) {
    var ar_ua = [];
    var ar_ub = [];
    var ar_uc = [];

    var ar_ia = [];
    var ar_ib = [];
    var ar_ic = [];

    v.sort(function (a, b) {
      return Number(a.bac_song || 0) - Number(b.bac_song || 0);
    });

    $.each(v, function (k1, v1) {
      ar_ua.push(Number(v1.dienap_a || 0));
      ar_ub.push(Number(v1.dienap_b || 0));
      ar_uc.push(Number(v1.dienap_c || 0));

      ar_ia.push(Number(v1.dongdien_a || 0));
      ar_ib.push(Number(v1.dongdien_b || 0));
      ar_ic.push(Number(v1.dongdien_c || 0));
    });

    ar_THD_time.push(v[0]?.thoidiem || "");

    // THD điện áp
    ar_THD_a.push(toFixed2(cal_THD(ar_ua)));
    ar_THD_b.push(toFixed2(cal_THD(ar_ub)));
    ar_THD_c.push(toFixed2(cal_THD(ar_uc)));

    // THDI dòng điện

    ar_THDI_a.push(toFixed2(cal_THDI(ar_ia)));
    ar_THDI_b.push(toFixed2(cal_THDI(ar_ib)));
    ar_THDI_c.push(toFixed2(cal_THDI(ar_ic)));

    // 21 bậc điện áp
    harmonicsUAByTime.push(ar_ua.slice(0, 21).map(toFixed2));
    harmonicsUBByTime.push(ar_ub.slice(0, 21).map(toFixed2));
    harmonicsUCByTime.push(ar_uc.slice(0, 21).map(toFixed2));

    // 21 bậc dòng điện
    harmonicsIAByTime.push(ar_ia.slice(0, 21).map(toFixed2));
    harmonicsIBByTime.push(ar_ib.slice(0, 21).map(toFixed2));
    harmonicsICByTime.push(ar_ic.slice(0, 21).map(toFixed2));
  });

  // Biểu đồ THD điện áp
  drawBD_THD_U_v2(
    ar_THD_a,
    ar_THD_b,
    ar_THD_c,
    ar_THD_time,
    harmonicsUAByTime,
    harmonicsUBByTime,
    harmonicsUCByTime
  );

  // Biểu đồ THDI dòng điện
  drawBD_THD_I_v2(
    ar_THDI_a,
    ar_THDI_b,
    ar_THDI_c,
    ar_THD_time,
    harmonicsIAByTime,
    harmonicsIBByTime,
    harmonicsICByTime
  );
}
function drawBD_THD_U_v2(
  THD_UA,
  THD_UB,
  THD_UC,
  Time,
  harmonicsUAByTime = [],
  harmonicsUBByTime = [],
  harmonicsUCByTime = []
) {

  const canvas = document.getElementById("myLineChart");
  if (!canvas) {
    console.warn("Không tìm thấy canvas #myLineChart");
    return;
  }

  //const labels = [...Time].reverse();
  const labels = [...Time].reverse().map(getOnlyTime);
  const dataUA = [...THD_UA].reverse();
  const dataUB = [...THD_UB].reverse();
  const dataUC = [...THD_UC].reverse();

  const hsUA = [...harmonicsUAByTime].reverse();
  const hsUB = [...harmonicsUBByTime].reverse();
  const hsUC = [...harmonicsUCByTime].reverse();

  if (window.chartTHDU) {
    window.chartTHDU.destroy();
    window.chartTHDU = null;
  }
  ensureTooltipStyle();
  const ctx = canvas.getContext("2d");

  window.chartTHDU = new Chart(ctx, {
    type: "line",
    data: {
      labels: labels,
      datasets: [
        {
          label: "THD UA (%)",
          data: dataUA,
          borderColor: "orange",
          borderWidth: 1,
          pointRadius: 3,
          pointHoverRadius: 5,
          fill: false,
          harmonics: hsUA
        },
        {
          label: "THD UB (%)",
          data: dataUB,
          borderColor: "green",
          borderWidth: 1,
          pointRadius: 3,
          pointHoverRadius: 5,
          fill: false,
          harmonics: hsUB
        },
        {
          label: "THD UC (%)",
          data: dataUC,
          borderColor: "red",
          borderWidth: 1,
          pointRadius: 3,
          pointHoverRadius: 5,
          fill: false,
          harmonics: hsUC
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      tooltips: {
        enabled: false,
        mode: "nearest",
        intersect: true,
        displayColors: false,
        custom: function (tooltipModel) {
          const tooltipEl = getOrCreateTooltipEl();

          if (!tooltipModel || tooltipModel.opacity === 0) {
            tooltipEl.style.opacity = 0;
            return;
          }

          if (!tooltipModel.dataPoints || !tooltipModel.dataPoints.length) {
            tooltipEl.style.opacity = 0;
            return;
          }

          const point = tooltipModel.dataPoints[0];
          const datasetIndex = point.datasetIndex;
          const index = point.index;

          const chart = this._chart;
          const dataset = chart.config.data.datasets[datasetIndex];
          const label = chart.config.data.labels[index] || "";
          const rawValue = dataset.data[index];
          const value = rawValue != null ? Number(rawValue).toFixed(2) : "0.00";
          const color = dataset.borderColor || "#fff";

          const harmonics = Array.isArray(dataset.harmonics?.[index])
            ? dataset.harmonics[index]
            : [];

          let harmonicHtml = `
                        <div class="tt-h-title">21 BẬC SÓNG</div>
                    `;

          if (harmonics.length) {
            harmonicHtml += `<div class="tt-grid">`;

            for (let i = 0; i < 21; i++) {
              const v = harmonics[i] != null ? Number(harmonics[i]).toFixed(2) : "0.00";
              harmonicHtml += `<div class="tt-cell">B${i + 1}: ${v}</div>`;
            }

            harmonicHtml += `</div>`;
          } else {
            harmonicHtml += `<div>Không có dữ liệu 21 bậc sóng</div>`;
          }

          tooltipEl.querySelector(".tooltip-content").innerHTML = `
                        <div class="tt-title">Thời điểm: ${label}</div>
                        <div class="tt-line">
                            <span class="tt-color" style="background:${color}"></span>
                            <span>${dataset.label}: ${value}%</span>
                        </div>
                        ${harmonicHtml}
                    `;

          const position = chart.canvas.getBoundingClientRect();

          let left = position.left + window.pageXOffset + tooltipModel.caretX;
          let top = position.top + window.pageYOffset + tooltipModel.caretY;

          tooltipEl.style.opacity = 1;
          tooltipEl.style.left = left + "px";
          tooltipEl.style.top = top + "px";

          requestAnimationFrame(() => {
            const rect = tooltipEl.getBoundingClientRect();
            const vw = window.pageXOffset + window.innerWidth;
            const vh = window.pageYOffset + window.innerHeight;

            let finalLeft = left;
            let finalTop = top;

            if (finalLeft - rect.width / 2 < window.pageXOffset + 8) {
              finalLeft = window.pageXOffset + rect.width / 2 + 8;
            }

            if (finalLeft + rect.width / 2 > vw - 8) {
              finalLeft = vw - rect.width / 2 - 8;
            }

            if (finalTop - rect.height - 16 < window.pageYOffset) {
              tooltipEl.style.transform = "translate(-50%, 10px)";
            } else {
              tooltipEl.style.transform = "translate(-50%, calc(-100% - 10px))";
            }

            if (finalTop + rect.height > vh - 8) {
              finalTop = vh - rect.height - 8;
            }

            tooltipEl.style.left = finalLeft + "px";
            tooltipEl.style.top = finalTop + "px";
          });
        }
      },
      legend: {
        onClick: function (e, legendItem) {
          const ci = this.chart;
          const index = legendItem.datasetIndex;
          const meta = ci.getDatasetMeta(index);

          // toggle ẩn/hiện line
          meta.hidden = meta.hidden === null ? !ci.data.datasets[index].hidden : null;

          ci.update();
        },
        labels: {
          generateLabels: function (chart) {
            const datasets = chart.data.datasets || [];

            return datasets.map(function (ds, i) {
              const meta = chart.getDatasetMeta(i);
              const hidden = meta.hidden === true || ds.hidden === true;

              return {
                text: ds.label,
                fillStyle: hidden ? "rgba(255, 250, 250, 0)" : (ds.backgroundColor || ds.borderColor),
                strokeStyle: hidden ? "rgba(180,180,180,0.35)" : (ds.borderColor || ds.backgroundColor),
                lineWidth: 2,
                hidden: false, // không cho text bị strike/mờ mặc định
                datasetIndex: i,

                // giữ style box ổn định
                lineCap: ds.borderCapStyle,
                lineDash: ds.borderDash || [],
                lineDashOffset: ds.borderDashOffset || 0,
                lineJoin: ds.borderJoinStyle,

                // Chart.js v2 có thể dùng thêm
                pointStyle: ds.pointStyle || "rect"
              };
            });
          },
          fontColor: "#f9f9f9",
          boxWidth: 30,
          padding: 12
        }
      },
      scales: {
        xAxes: [{
          scaleLabel: {
            display: false,
            labelString: "Thời điểm",
            fontColor: "#f9f9f9"
          },
          ticks: {
            autoSkip: false,
            maxRotation: 90,
            minRotation: 45,
            fontColor: "#9c9b9b"
          }
        }],
        yAxes: [{
          scaleLabel: {
            display: true,
            labelString: "THDI (%)",
            fontColor: "#f9f9f9"
          },
          ticks: {
            fontColor: "#9c9b9b",
            callback: function (value) {
              return value + " %";
            }
          }
        }]
      }
    }
  });
}
function drawBD_THD_I_v2(
  THDI_IA,
  THDI_IB,
  THDI_IC,
  Time,
  harmonicsIAByTime = [],
  harmonicsIBByTime = [],
  harmonicsICByTime = []
) {
  const canvas = document.getElementById("myLineChart_I");

  if (!canvas) return;

  //const labels = [...Time].reverse();
  const labels = [...Time].reverse().map(getOnlyTime);
  const dataIA = [...THDI_IA].reverse();
  const dataIB = [...THDI_IB].reverse();
  const dataIC = [...THDI_IC].reverse();

  const hsIA = [...harmonicsIAByTime].reverse();
  const hsIB = [...harmonicsIBByTime].reverse();
  const hsIC = [...harmonicsICByTime].reverse();

  if (window.chartTHDI) {
    window.chartTHDI.destroy();
    window.chartTHDI = null;
  }
  ensureTooltipStyle();

  const ctx = canvas.getContext("2d");

  window.chartTHDI = new Chart(ctx, {
    type: "line",
    data: {
      labels: labels,
      datasets: [
        {
          label: "THDI IA (%)",
          data: dataIA,
          borderColor: "orange",
          backgroundColor: "orange",
          borderWidth: 1,
          pointRadius: 3,
          pointHoverRadius: 5,
          fill: false,
          harmonics: hsIA
        },
        {
          label: "THDI IB (%)",
          data: dataIB,
          borderColor: "green",
          backgroundColor: "green",
          borderWidth: 1,
          pointRadius: 3,
          pointHoverRadius: 5,
          fill: false,
          harmonics: hsIB
        },
        {
          label: "THDI IC (%)",
          data: dataIC,
          borderColor: "red",
          backgroundColor: "red",
          borderWidth: 1,
          pointRadius: 3,
          pointHoverRadius: 5,
          fill: false,
          harmonics: hsIC
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      tooltips: {
        enabled: false,
        mode: "nearest",
        intersect: true,
        displayColors: false,
        custom: function (tooltipModel) {
          const tooltipEl = getOrCreateTooltipEl();

          if (!tooltipModel || tooltipModel.opacity === 0) {
            tooltipEl.style.opacity = 0;
            return;
          }

          if (!tooltipModel.dataPoints || !tooltipModel.dataPoints.length) {
            tooltipEl.style.opacity = 0;
            return;
          }

          const point = tooltipModel.dataPoints[0];
          const datasetIndex = point.datasetIndex;
          const index = point.index;

          const chart = this._chart;
          const dataset = chart.config.data.datasets[datasetIndex];
          const label = chart.config.data.labels[index] || "";
          const rawValue = dataset.data[index];
          const value = rawValue != null ? Number(rawValue).toFixed(2) : "0.00";
          const color = dataset.borderColor || "#fff";

          const harmonics = Array.isArray(dataset.harmonics?.[index])
            ? dataset.harmonics[index]
            : [];

          let harmonicHtml = `
                        <div class="tt-h-title">21 BẬC SÓNG</div>
                    `;

          if (harmonics.length) {
            harmonicHtml += `<div class="tt-grid">`;

            for (let i = 0; i < 21; i++) {
              const v = harmonics[i] != null ? Number(harmonics[i]).toFixed(2) : "0.00";
              harmonicHtml += `<div class="tt-cell">B${i + 1}: ${v}</div>`;
            }

            harmonicHtml += `</div>`;
          } else {
            harmonicHtml += `<div>Không có dữ liệu 21 bậc sóng</div>`;
          }

          tooltipEl.querySelector(".tooltip-content").innerHTML = `
                        <div class="tt-title">Thời điểm: ${label}</div>
                        <div class="tt-line">
                            <span class="tt-color" style="background:${color}"></span>
                            <span>${dataset.label}: ${value}%</span>
                        </div>
                        ${harmonicHtml}
                    `;

          const position = chart.canvas.getBoundingClientRect();

          let left = position.left + window.pageXOffset + tooltipModel.caretX;
          let top = position.top + window.pageYOffset + tooltipModel.caretY;

          tooltipEl.style.opacity = 1;
          tooltipEl.style.left = left + "px";
          tooltipEl.style.top = top + "px";

          requestAnimationFrame(() => {
            const rect = tooltipEl.getBoundingClientRect();
            const vw = window.pageXOffset + window.innerWidth;
            const vh = window.pageYOffset + window.innerHeight;

            let finalLeft = left;
            let finalTop = top;

            if (finalLeft - rect.width / 2 < window.pageXOffset + 8) {
              finalLeft = window.pageXOffset + rect.width / 2 + 8;
            }

            if (finalLeft + rect.width / 2 > vw - 8) {
              finalLeft = vw - rect.width / 2 - 8;
            }

            if (finalTop - rect.height - 16 < window.pageYOffset) {
              tooltipEl.style.transform = "translate(-50%, 10px)";
            } else {
              tooltipEl.style.transform = "translate(-50%, calc(-100% - 10px))";
            }

            if (finalTop + rect.height > vh - 8) {
              finalTop = vh - rect.height - 8;
            }

            tooltipEl.style.left = finalLeft + "px";
            tooltipEl.style.top = finalTop + "px";
          });
        }
      },
      legend: {
        onClick: function (e, legendItem) {
          const ci = this.chart;
          const index = legendItem.datasetIndex;
          const meta = ci.getDatasetMeta(index);

          // toggle ẩn/hiện line
          meta.hidden = meta.hidden === null ? !ci.data.datasets[index].hidden : null;

          ci.update();
        },
        labels: {
          generateLabels: function (chart) {
            const datasets = chart.data.datasets || [];

            return datasets.map(function (ds, i) {
              const meta = chart.getDatasetMeta(i);
              const hidden = meta.hidden === true || ds.hidden === true;

              return {
                text: ds.label,
                fillStyle: hidden ? "rgba(0,0,0,0)" : (ds.backgroundColor || ds.borderColor),
                strokeStyle: hidden ? "rgba(180,180,180,0.35)" : (ds.borderColor || ds.backgroundColor),
                lineWidth: 2,
                hidden: false, // không cho text bị strike/mờ mặc định
                datasetIndex: i,

                // giữ style box ổn định
                lineCap: ds.borderCapStyle,
                lineDash: ds.borderDash || [],
                lineDashOffset: ds.borderDashOffset || 0,
                lineJoin: ds.borderJoinStyle,

                // Chart.js v2 có thể dùng thêm
                pointStyle: ds.pointStyle || "rect"
              };
            });
          },
          fontColor: "#f9f9f9",
          boxWidth: 30,
          padding: 12
        }
      },
      scales: {
        xAxes: [{
          scaleLabel: {
            display: false,
            labelString: "Thời điểm",
            fontColor: "#f9f9f9"
          },
          ticks: {
            autoSkip: false,
            maxRotation: 90,
            minRotation: 45
          }
        }],
        yAxes: [{
          scaleLabel: {
            display: true,
            labelString: "THDI (%)",
            fontColor: "#d6d4d4"
          },
          ticks: {
            fontColor: "#9c9b9b",
            callback: function (value) {
              return value + " %";
            }
          }
        }]
      }
    }
  });
}
function getOrCreateTooltipEl() {
  let tooltipEl = document.getElementById("chartjs-tooltip-thdi");

  if (!tooltipEl) {
    tooltipEl = document.createElement("div");
    tooltipEl.id = "chartjs-tooltip-thdi";
    tooltipEl.className = "chartjs-tooltip-thdi";
    tooltipEl.innerHTML = "<div class='tooltip-content'></div>";
    document.body.appendChild(tooltipEl);
  }

  return tooltipEl;
}
function groupByTime(array) {
  // Tạo một đối tượng để lưu trữ các nhóm
  var groups = {};

  // Duyệt qua từng phần tử trong mảng
  $.each(array, function (index, item) {
    // Lấy giá trị của trường time
    var time = item.thoidiem;

    // Nếu nhóm với giá trị time này chưa tồn tại, tạo mới
    if (!groups[time]) {
      groups[time] = [];
    }

    // Thêm phần tử vào nhóm tương ứng
    groups[time].push(item);
  });

  // Chuyển đổi đối tượng thành mảng các nhóm
  var result = $.map(groups, function (value, key) {
    return [value];
  });

  return result;
}
function toFixed2(val) {
  const num = Number(val);
  return isNaN(num) ? 0 : Number(num.toFixed(2));
}
function cal_THD(data) {
  var V1
  data[0] == null || data[0] == 0 ? V1 = 1 : V1 = data[0];

  var sum = 0;

  for (var i = 1; i < data.length; i++) {
    sum += Math.pow(data[i] / V1, 2);
  }

  var THD = Math.sqrt(sum) * 100;
  //console.log('THD: ' + THD.toFixed(2) + '%');
  return THD.toFixed(2);
}

function cal_TDD(data) {
  var I1 = data[0]; // Fundamental frequency RMS value
  var fullLoadCurrent = 15; // Example full load current
  var sum = 0;

  for (var i = 1; i < data.length; i++) {
    sum += Math.pow(data[i] / fullLoadCurrent, 2);
  }

  var TDD = Math.sqrt(sum) * 100;
  return TDD;
}
function cal_THDI(arr) {

  if (!Array.isArray(arr) || arr.length === 0) return 0;
  /*arr[0] = I1 (bậc 1 – fundamental)
  Nếu I1 = 0 → không thể chia → trả về 0 */
  const i1 = Number(arr[0] || 0);
  if (!i1) return 0;
  //Tính tổng bình phương các bậc sóng hài:I22​+I32​+...+In2​​
  let sum = 0;
  for (let i = 1; i < arr.length; i++) {
    const val = Number(arr[i] || 0);
    sum += Math.pow(val, 2);
  }
  //Áp dụng công thức THDI:
  return Number(((Math.sqrt(sum) / i1) * 100).toFixed(2));
}

function ensureTooltipStyle() {
  if (document.getElementById("chartjs-tooltip-thdi-style")) return;

  const style = document.createElement("style");
  style.id = "chartjs-tooltip-thdi-style";
  style.innerHTML = `
            .chartjs-tooltip-thdi {
                position: absolute;
                background: rgba(33, 33, 33, 0.95);
                color: #fff;
                border-radius: 8px;
                padding: 10px 12px;
                font-size: 12px;
                line-height: 1.45;
                pointer-events: none;
                opacity: 0;
                z-index: 99999;
                min-width: 360px;
                max-width: 520px;
                box-shadow: 0 4px 14px rgba(0,0,0,.25);
                transform: translate(-50%, calc(-100% - 10px));
                transition: opacity .08s ease;
            }

            .chartjs-tooltip-thdi .tt-title {
                font-weight: 700;
                margin-bottom: 6px;
            }

            .chartjs-tooltip-thdi .tt-line {
                display: flex;
                align-items: center;
                gap: 6px;
                margin-bottom: 8px;
            }

            .chartjs-tooltip-thdi .tt-color {
                width: 10px;
                height: 10px;
                display: inline-block;
                border-radius: 2px;
                flex: 0 0 10px;
            }

            .chartjs-tooltip-thdi .tt-h-title {
                text-align: center;
                font-weight: 700;
                margin: 4px 0 8px;
            }

            .chartjs-tooltip-thdi .tt-grid {
                display: grid;
                grid-template-columns: repeat(4, minmax(72px, 1fr));
                gap: 4px 14px;
                font-family: monospace;
                white-space: nowrap;
            }

            .chartjs-tooltip-thdi .tt-cell {
                text-align: left;
            }
        `;
  document.head.appendChild(style);
}
async function f_canhbao() {
  // code = "001003001002";
  var user = localStorage.getItem("login_user");
  user = JSON.parse(user);
  var code = user.danhmucid;
  try {
    const data = await $.ajax({
      url: "/api/sodomotsoi/laysukiencanhbao",
      type: "POST",
      contentType: "application/json",
      dataType: "json",
      data: JSON.stringify({
        code: code,
      }),
    });

    var xxx = data;
  } catch (err) {
    console.error("Lỗi lấy dữ liệu sơ đồ 1 sợi:", err);
  } finally {
    isLoadingData = false;
  }
}




// biểu đồ phụ tải
async function load_bdpt() {

  // lấy ngày hiện tại
  const today = new Date();
  // format dd/MM/yyyy
  const currentDate =
    String(today.getDate()).padStart(2, '0') + '/' +
    String(today.getMonth() + 1).padStart(2, '0') + '/' +
    today.getFullYear();

  const ChiSoParameter = {
    v_meterid: 13124352,
    v_socongto: "-1",
    v_tungay: currentDate,
    v_denngay: currentDate,
    v_sotrang: 0,
    v_sodong: 100000,
    v_mataikhoan: 1
  };
  try {
    const data = await $.ajax({
      url: "/api/khaithacdulieu_laybieudophutai_chitiet",
      type: "POST",
      contentType: "application/json;charset=utf-8",
      dataType: "json",
      data: JSON.stringify(ChiSoParameter),
    });

    // console.log("data biểu đồ phụ tải", data);
    render_bdpt(data);
  } catch (err) {
    console.error("Lỗi xxload bdpt:", err);
    $("#bdptBody").html(`<tr><td colspan="6">Không tải được dữ liệu</td></tr>`);
  }
}

let bdptPage = 1;
const bdptPageSize = 10;
let feeders = [];

function render_bdpt(data) {
  const rows = Array.isArray(data) ? data : (data?.data || data?.rows || data?.result || []);

  feeders = rows.map((x, i) => {

    const starttime = x.starttime || "--";

    let onlyDate = "--";
    let onlyTime = "--";

    if (starttime.includes(" ")) {
      const arr = starttime.split(" ");
      onlyDate = arr[0];
      onlyTime = arr[1];
    }

    return {
      stt: x.stt || i + 1,
      starttime,
      onlyDate,
      timeOnly: onlyTime,

      pgiao: Number(x.pgiao || 0),
      pnhan: Number(x.pnhan || 0),
      qgiao: Number(x.qgiao || 0),
      qnhan: Number(x.qnhan || 0),
    };
  });

  bdptPage = 1;
  if (feeders.length > 0) {
    $("#bdptDate").text(feeders[0].onlyDate);
  }
  renderBdptPage();
  drawLoadChart(data);
}

function renderBdptPage() {
  const total = feeders.length;
  const totalPage = Math.max(1, Math.ceil(total / bdptPageSize));
  const start = (bdptPage - 1) * bdptPageSize;
  const pageRows = feeders.slice(start, start + bdptPageSize);

  const html = pageRows.map((f, i) => `
    <tr>
      <td>${start + i + 1}</td>
    <td>${f.timeOnly}</td>
      <td>${f.pgiao.toFixed(1)}</td>
      <td>${f.pnhan.toFixed(1)}</td>
      <td>${f.qgiao.toFixed(2)}</td>
      <td>${f.qnhan.toFixed(2)}</td>
    </tr>
  `).join("");

  $("#bdptBody").html(html || `<tr><td colspan="6">Không có dữ liệu</td></tr>`);

  const from = total ? start + 1 : 0;
  const to = Math.min(start + bdptPageSize, total);

  $("#bdptInfo").text(`Đang xem ${from} đến ${to} trong tổng số ${total} bản ghi`);
  $("#bdptPageText").text(`${bdptPage}/${totalPage}`);

  $("#bdptPrev").prop("disabled", bdptPage <= 1);
  $("#bdptNext").prop("disabled", bdptPage >= totalPage);
}

function getOnlyTime(value) {
  if (!value) return "";

  const s = String(value).trim();

  if (s.includes(" ")) {
    return s.split(" ")[1] || s;
  }

  return s;
}

function drawLoadChart(data) {
  lstTsvh_bdpt = data;
  if (!Array.isArray(data) || data.length === 0) {
    console.warn("Không có dữ liệu vẽ biểu đồ");
    return;
  }

  var date_ar = [];
  var sl_ar = [];
  var background_color = [];
  var donvi_doluong = "";

  var data1 = [...data].reverse();

  $.each(data1, function (k, v) {
    if (!v.starttime) return;

    var timeLabel = v.starttime.substr(11, 5); // HH:mm

    if (!date_ar.includes(timeLabel)) {
      date_ar.push(timeLabel);
    }
  });

  var chartType = $("[name=charttype_bdpt]:checked").val() || "PTongGiao";

  for (var i = 0; i < date_ar.length; i++) {
    var sl_tong_pgiao = 0;
    var sl_tong_pnhan = 0;
    var sl_tong_qgiao = 0;
    var sl_tong_qnhan = 0;
    var sl_pgiao = 0;
    var sl_pnhan = 0;
    var sl_qgiao = 0;
    var sl_qnhan = 0;

    for (var j = 0; j < data1.length; j++) {
      if (!data1[j].starttime) continue;

      if (date_ar[i] == data1[j].starttime.substr(11, 5)) {
        sl_tong_pgiao += Number(data1[j].pgiao || 0);
        sl_tong_pnhan += Number(data1[j].pnhan || 0);
        sl_tong_qgiao += Number(data1[j].qgiao || 0);
        sl_tong_qnhan += Number(data1[j].qnhan || 0);

        sl_pgiao += Number(data1[j].sl_pgiaotong || 0);
        sl_pnhan += Number(data1[j].sl_pnhantong || 0);
        sl_qgiao += Number(data1[j].sl_qgiaotong || 0);
        sl_qnhan += Number(data1[j].sl_qnhantong || 0);
      }
    }

    background_color.push(GetColorByTimeDl(data1[i]?.starttime || data1[0].starttime));

    if (chartType == "PTongGiao") {
      sl_ar.push(Number(sl_tong_pgiao.toFixed(3)));
      donvi_doluong = "P tổng giao (kW)";
    } else if (chartType == "PTongNhan") {
      sl_ar.push(Number(sl_tong_pnhan.toFixed(3)));
      donvi_doluong = "P tổng nhận (kW)";
    } else if (chartType == "QTongGiao") {
      sl_ar.push(Number(sl_tong_qgiao.toFixed(3)));
      donvi_doluong = "Q tổng giao (kVAR)";
    } else if (chartType == "QTongNhan") {
      sl_ar.push(Number(sl_tong_qnhan.toFixed(3)));
      donvi_doluong = "Q tổng nhận (kVAR)";
    } else if (chartType == "SLPGiao") {
      sl_ar.push(Number(sl_pgiao.toFixed(3)));
      donvi_doluong = "SL P Giao";
    } else if (chartType == "SLPNhan") {
      sl_ar.push(Number(sl_pnhan.toFixed(3)));
      donvi_doluong = "SL P Nhận";
    } else if (chartType == "SLQGiao") {
      sl_ar.push(Number(sl_qgiao.toFixed(3)));
      donvi_doluong = "SL Q Giao";
    } else if (chartType == "SLQNhan") {
      sl_ar.push(Number(sl_qnhan.toFixed(3)));
      donvi_doluong = "SL Q Nhận";
    }
  }

  $("#modal_chart_bdpt").html(
    '<div style="width:100%;height:300px;position:relative;">' +
    '<canvas id="canvas_bdpt" style="width:100%;height:100%;"></canvas>' +
    '</div>'
  );

  var ctx = document.getElementById("canvas_bdpt").getContext("2d");

  new Chart(ctx, {
    type: "bar",
    data: {
      labels: date_ar,
      datasets: [{
        label: donvi_doluong,
        data: sl_ar,
        backgroundColor: background_color,
        type: "bar"
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      legend: {
        display: false,
        labels: {
          fontColor: "#fff"
        }
      },
      scales: {
        xAxes: [{
          ticks: {
            fontColor: "#fff"
          }
        }],
        yAxes: [{
          scaleLabel: {
            display: true,
            labelString: donvi_doluong,
            fontColor: "#fff"
          },
          ticks: {
            beginAtZero: true,
            fontColor: "#fff"
          }
        }]
      }
    }
  });
}
// lấy màu sắc theo time
function GetColorByTimeDl(time) {
  //1. Giờ bình thường: màu cam
  /*  a) Gồm các ngày từ thứ Hai đến thứ Bảy:
      - Từ 04 giờ 00 đến 9 giờ 30 (05 giờ 30 phút);
      - Từ 11 giờ 30 đến 17 giờ 00 (05 giờ 30 phút);
      - Từ 20 giờ 00 đến 22 giờ 00 (02 giờ).
      b) Ngày Chủ nhật:
      Từ 04 giờ 00 đến 22 giờ 00 (18 giờ).
  */
  // 2. Giờ cao điểm: Màu đỏ
  /*
       a) Gồm các ngày từ thứ Hai đến thứ Bảy:
       - Từ 09 giờ 30 đến 11 giờ 30 (02 giờ);
       - Từ 17 giờ 00 đến 20 giờ 00 (03 giờ).
       b) Ngày Chủ nhật: không có giờ cao điểm.
 
   */
  //3. Giờ thấp điểm: Màu xanh
  //Tất cả các ngày trong tuần: từ 22 giờ 00 đến 04 giờ 00(06 giờ) sáng ngày hôm sau

  var datetime = moment(time, 'DD/MM/YYYY HH:mm');

  var day = datetime.day();
  var timeTemp = time.split(' ')[1].split(':');
  var minuteCheck = (parseInt(timeTemp[0]) * 60) + parseInt(timeTemp[1]);
  // Khung giờ thấp điểm  - Tất cả các ngày trong tuần
  var thapdiem1Tu = 22 * 60;
  var thapdiem1Den = 24 * 60;
  var thapdiem2Tu = 0;
  var thapdiem2Den = 4 * 60;
  if ((minuteCheck >= thapdiem1Tu && minuteCheck <= thapdiem1Den) || (minuteCheck >= thapdiem2Tu && minuteCheck < thapdiem2Den)) {
    return "#8bbc21";//màu xanh
  }
  else {
    // Ngày chủ nhật
    if (day == 0) {
      // Giờ bình thường
      return "#f58220";
    } else {
      var binhthuong1Tu = 4 * 60;
      var binhthuong1Den = (9 * 60) + 30;

      var binhthuong2Tu = (11 * 60) + 30;
      var binhthuong2Den = (17 * 60);

      var binhthuong3Tu = (20 * 60);
      var binhthuong3Den = (22 * 60);

      if ((minuteCheck >= binhthuong1Tu && minuteCheck < binhthuong1Den) || (minuteCheck >= binhthuong2Tu && minuteCheck < binhthuong2Den) || (minuteCheck >= binhthuong3Tu && minuteCheck < binhthuong3Den)) {
        return "#f58220";//màu cam
      } else {
        return "#ff0000";//màu đỏ
      }
    }
  }
}
function GetColorByTimeNhan(time) {
  //1. Giờ bình thường: màu cam
  /*  a) Gồm các ngày từ thứ Hai đến thứ Bảy:
      - Từ 04 giờ 00 đến 9 giờ 30 (05 giờ 30 phút);
      - Từ 11 giờ 30 đến 17 giờ 00 (05 giờ 30 phút);
      - Từ 20 giờ 00 đến 22 giờ 00 (02 giờ).
      b) Ngày Chủ nhật:
      Từ 04 giờ 00 đến 22 giờ 00 (18 giờ).
  */
  // 2. Giờ cao điểm: Màu đỏ
  /*
       a) Gồm các ngày từ thứ Hai đến thứ Bảy:
       - Từ 09 giờ 30 đến 11 giờ 30 (02 giờ);
       - Từ 17 giờ 00 đến 20 giờ 00 (03 giờ).
       b) Ngày Chủ nhật: không có giờ cao điểm.
 
   */
  //3. Giờ thấp điểm: Màu xanh
  //Tất cả các ngày trong tuần: từ 22 giờ 00 đến 04 giờ 00(06 giờ) sáng ngày hôm sau

  let datetime = moment(time, 'DD/MM/YYYY HH:mm');

  var day = datetime.day();
  var timeTemp = time.split(' ')[1].split(':');
  var minuteCheck = (parseInt(timeTemp[0]) * 60) + parseInt(timeTemp[1]);
  // Khung giờ thấp điểm  - Tất cả các ngày trong tuần
  var thapdiem1Tu = 22 * 60;
  var thapdiem1Den = 24 * 60;
  var thapdiem2Tu = 0;
  var thapdiem2Den = 4 * 60;
  if ((minuteCheck >= thapdiem1Tu && minuteCheck <= thapdiem1Den) || (minuteCheck >= thapdiem2Tu && minuteCheck < thapdiem2Den)) {
    return "#597d0b";//màu xanh
  }
  else {
    // Ngày chủ nhật
    if (day == 0) {
      // Giờ bình thường
      return "#e86b00";//màu cam
    } else {
      var binhthuong1Tu = 4 * 60;
      var binhthuong1Den = (9 * 60) + 30;

      var binhthuong2Tu = (11 * 60) + 30;
      var binhthuong2Den = (17 * 60);

      var binhthuong3Tu = (20 * 60);
      var binhthuong3Den = (22 * 60);

      if ((minuteCheck >= binhthuong1Tu && minuteCheck < binhthuong1Den) || (minuteCheck >= binhthuong2Tu && minuteCheck < binhthuong2Den) || (minuteCheck >= binhthuong3Tu && minuteCheck < binhthuong3Den)) {
        return "#d64a09";//màu cam
      } else {
        return "#bf1212";//màu đỏ
      }
    }
  }
}
function chartTypeChange_bdpt() {
  setTimeout(function () {
    drawLoadChart(lstTsvh_bdpt.reverse());
  }, 100);
}
