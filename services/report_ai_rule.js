const IOA = require('./ioa_map');

function avg(arr) {
  if (!arr || arr.length === 0) return 0;
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}

function max(arr) {
  if (!arr || arr.length === 0) return 0;
  return Math.max(...arr);
}

function min(arr) {
  if (!arr || arr.length === 0) return 0;
  return Math.min(...arr);
}

function round(value, digits = 2) {
  return Number(Number(value || 0).toFixed(digits));
}

function getValues(ioaData, ioaDiaChi) {
  const item = ioaData.find(x => {
    return Number(x.ioa_diachi || x.IOA_DIACHI) === Number(ioaDiaChi);
  });

  if (!item || !Array.isArray(item.cambien)) return [];

  return item.cambien
    .map(v => typeof v === 'string' ? JSON.parse(v) : v)
    .map(v => Number(v.value))
    .filter(v => !Number.isNaN(v));
}

function getVoltageStatus(avgUa, avgUb, avgUc) {
  const values = [avgUa, avgUb, avgUc].filter(v => v > 0);
  if (!values.length) return 'Chưa có dữ liệu';

  const abnormal = values.some(v => v < 198 || v > 242);
  return abnormal ? 'Bất thường' : 'Bình thường';
}

function getCurrentStatus(imbalance) {
  if (imbalance > 20) return 'Mất cân bằng';
  if (imbalance > 10) return 'Cần theo dõi';
  return 'Cân bằng';
}

function getPfStatus(avgPf) {
  if (!avgPf) return 'Chưa có dữ liệu';
  if (avgPf >= 0.95) return 'Tốt';
  if (avgPf >= 0.9) return 'Khá';
  return 'Cần theo dõi';
}

function getFreqStatus(avgFreq) {
  if (!avgFreq) return 'Chưa có dữ liệu';
  if (avgFreq >= 49.5 && avgFreq <= 50.5) return 'Bình thường';
  return 'Bất thường';
}

function getThdStatus(avgThd) {
  if (!avgThd) return 'Chưa có dữ liệu';
  if (avgThd < 5) return 'Tốt';
  if (avgThd <= 8) return 'Cần theo dõi';
  return 'Cảnh báo';
}

function getStatusByScore(score) {
  if (score >= 90) return 'Tốt';
  if (score >= 75) return 'Cần theo dõi';
  if (score >= 60) return 'Bất thường';
  return 'Nguy cơ cao';
}
function buildRecommendation({
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
  maxP
}) {
  if (
    avgUa === 0 &&
    avgUb === 0 &&
    avgUc === 0 &&
    avgIa === 0 &&
    avgIb === 0 &&
    avgIc === 0
  ) {
    return `
Không ghi nhận dữ liệu điện áp, dòng điện và công suất trong khoảng thời gian đánh giá.

Có thể xảy ra một trong các trường hợp:

• Thiết bị đang ngừng vận hành.
• MCCB/MBA đang OFF.
• Mất nguồn đo lường.
• Mất kết nối Gateway/RTU.
• Chưa phát sinh dữ liệu SCADA.

Khuyến nghị kiểm tra trạng thái kết nối và nguồn cấp thiết bị.
`;
  }
  const notes = [];

  // Điện áp
  if (
    avgUa < 220 || avgUa > 240 ||
    avgUb < 220 || avgUb > 240 ||
    avgUc < 220 || avgUc > 240
  ) {
    notes.push(
      `Điện áp trung bình các pha (${round(avgUa, 1)}/${round(avgUb, 1)}/${round(avgUc, 1)}V) có dấu hiệu lệch khỏi dải vận hành khuyến nghị 220÷240V.`
    );
  } else {
    notes.push(
      `Điện áp 3 pha ổn định (${round(avgUa, 1)}/${round(avgUb, 1)}/${round(avgUc, 1)}V).`
    );
  }

  // Dòng điện
  if (imbalance > 20) {
    notes.push(
      `Dòng điện các pha mất cân bằng (${round(avgIa, 2)}/${round(avgIb, 2)}/${round(avgIc, 2)}A), độ lệch ${round(imbalance)}%. Nên kiểm tra phân bố tải.`
    );
  } else {
    notes.push(
      `Dòng điện giữa các pha tương đối cân bằng (${round(avgIa, 2)}/${round(avgIb, 2)}/${round(avgIc, 2)}A).`
    );
  }

  // Công suất
  if (maxP < 1) {
    notes.push(
      `Phụ tải hiện tại rất thấp (${round(maxP, 2)} kW).`
    );
  } else if (maxP > 80) {
    notes.push(
      `Công suất phụ tải đạt ${round(maxP)} kW, cần theo dõi giờ cao điểm để tránh quá tải.`
    );
  }

  // Cosφ
  if (avgPf >= 0.95) {
    notes.push(
      `Hệ số công suất đạt ${round(avgPf, 2)}, hệ thống bù phản kháng hoạt động tốt.`
    );
  } else if (avgPf >= 0.9) {
    notes.push(
      `Hệ số công suất ${round(avgPf, 2)}, nên tiếp tục theo dõi.`
    );
  } else {
    notes.push(
      `Hệ số công suất thấp (${round(avgPf, 2)}), nên kiểm tra tụ bù hoặc tải cảm.`
    );
  }

  // Tần số
  if (avgFreq >= 49.5 && avgFreq <= 50.5) {
    notes.push(
      `Tần số hệ thống ổn định ở mức ${round(avgFreq, 2)} Hz.`
    );
  } else {
    notes.push(
      `Tần số ${round(avgFreq, 2)} Hz nằm ngoài giới hạn vận hành khuyến nghị.`
    );
  }

  // THD
  if (avgThd < 5) {
    notes.push(
      `Độ méo hài THD ${round(avgThd, 2)}%, nằm trong giới hạn cho phép.`
    );
  } else if (avgThd < 8) {
    notes.push(
      `THD ${round(avgThd, 2)}%, nên theo dõi thêm chất lượng điện năng.`
    );
  } else {
    notes.push(
      `THD ${round(avgThd, 2)}% ở mức cao, cần kiểm tra các tải phi tuyến.`
    );
  }

  // Tổng kết
  if (score >= 90) {
    notes.unshift(
      'Hệ thống đang vận hành ổn định, không phát hiện bất thường nghiêm trọng.'
    );
  } else if (score >= 75) {
    notes.unshift(
      'Hệ thống vận hành bình thường nhưng có một số thông số cần theo dõi.'
    );
  } else {
    notes.unshift(
      'Phát hiện các dấu hiệu bất thường, cần kiểm tra thiết bị và chất lượng điện năng.'
    );
  }

  return notes.join(' ');
}
function buildDailyReport({ id_thietbi, tungay, denngay, ioaData }) {
  const ua = getValues(ioaData, IOA.UA);
  const ub = getValues(ioaData, IOA.UB);
  const uc = getValues(ioaData, IOA.UC);

  const ia = getValues(ioaData, IOA.IA);
  const ib = getValues(ioaData, IOA.IB);
  const ic = getValues(ioaData, IOA.IC);

  const pTotal = getValues(ioaData, IOA.P_TOTAL);
  const pf = getValues(ioaData, IOA.PF_TOTAL);
  const freq = getValues(ioaData, IOA.FREQ);

  const thdUa = getValues(ioaData, IOA.THD_UA);
  const thdUb = getValues(ioaData, IOA.THD_UB);
  const thdUc = getValues(ioaData, IOA.THD_UC);

  const avgUa = avg(ua);
  const avgUb = avg(ub);
  const avgUc = avg(uc);

  const CT_RATIO = 250;

  const avgIa = avg(ia) * CT_RATIO;
  const avgIb = avg(ib) * CT_RATIO;
  const avgIc = avg(ic) * CT_RATIO;

  const noDataCondition =
    avgUa === 0 &&
    avgUb === 0 &&
    avgUc === 0 &&
    avgIa === 0 &&
    avgIb === 0 &&
    avgIc === 0;

  const avgPf = avg(pf);
  const avgFreq = avg(freq);

  const avgThd = avg([
    avg(thdUa),
    avg(thdUb),
    avg(thdUc)
  ].filter(v => v > 0));

  const maxI = Math.max(
    max(ia) * CT_RATIO,
    max(ib) * CT_RATIO,
    max(ic) * CT_RATIO
  );
  const avgI = avg([avgIa, avgIb, avgIc].filter(v => v > 0));

  const imbalance = avgI > 0
    ? Math.max(
      Math.abs(avgIa - avgI),
      Math.abs(avgIb - avgI),
      Math.abs(avgIc - avgI)
    ) / avgI * 100
    : 0;

  const voltageStatus = noDataCondition
    ? 'Không có dữ liệu'
    : getVoltageStatus(avgUa, avgUb, avgUc);

  const currentStatus = noDataCondition
    ? 'Không có dữ liệu'
    : getCurrentStatus(imbalance);
  const pfStatus = getPfStatus(avgPf);
  const freqStatus = getFreqStatus(avgFreq);
  const thdStatus = getThdStatus(avgThd);

  let score = 100;

  if (voltageStatus === 'Bất thường') score -= 10;
  if (avgPf > 0 && avgPf < 0.9) score -= 10;
  if (avgFreq > 0 && (avgFreq < 49.5 || avgFreq > 50.5)) score -= 10;
  if (avgThd > 5) score -= 15;
  if (imbalance > 20) score -= 15;

  score = Math.max(score, 0);

  let status = getStatusByScore(score);

  if (noDataCondition) {
    score = 0;
    status = 'Không có dữ liệu';
  }

  const recommendation = buildRecommendation({
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
    maxP: max(pTotal) * CT_RATIO
  });

  const summary = [
    `Trong khoảng thời gian ${tungay} đến ${denngay}, thiết bị ${id_thietbi} được đánh giá mức "${status}" với ${score} điểm.`,
    `Điện áp: ${voltageStatus}.`,
    `Dòng điện: ${currentStatus}.`,
    `Cosφ: ${pfStatus}.`,
    `Tần số: ${avgFreq ? round(avgFreq) + ' Hz' : 'chưa có dữ liệu'}.`,
    `THD: ${avgThd ? round(avgThd) + '%' : 'chưa có dữ liệu'}.`,
    recommendation
  ].join(' ');

  return {
    success: true,
    data: {
      id_thietbi,
      tungay,
      denngay,

      score,
      status,

      voltage_status: voltageStatus,
      current_status: currentStatus,
      pf_status: pfStatus,
      freq_status: freqStatus,
      thd_status: thdStatus,

      avg_ua: round(avgUa),
      avg_ub: round(avgUb),
      avg_uc: round(avgUc),

      min_ua: round(min(ua)),
      min_ub: round(min(ub)),
      min_uc: round(min(uc)),

      max_ua: round(max(ua)),
      max_ub: round(max(ub)),
      max_uc: round(max(uc)),

      avg_ia: round(avgIa),
      avg_ib: round(avgIb),
      avg_ic: round(avgIc),

      max_i: round(maxI),

      max_p: round(max(pTotal) * CT_RATIO),
      avg_p: round(avg(pTotal) * CT_RATIO),

      avg_pf: round(avgPf),
      avg_freq: round(avgFreq),
      avg_thd: round(avgThd),

      imbalance_percent: round(imbalance),
      warning_count: noDataCondition ? 1 : 0,

      no_electrical_data: noDataCondition,

      summary,
      recommendation
    }
  };
}

module.exports = {
  buildDailyReport
};