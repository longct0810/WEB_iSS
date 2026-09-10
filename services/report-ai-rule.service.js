// services/report-ai-rule.service.js
function generateDailySummary(data) {
  const comments = [];

  const maxP = Number(data.MAX_P || 0);
  const avgP = Number(data.AVG_P || 0);
  const maxIa = Number(data.MAX_IA || 0);
  const maxIb = Number(data.MAX_IB || 0);
  const maxIc = Number(data.MAX_IC || 0);
  const totalRecord = Number(data.TOTAL_RECORD || 0);

  comments.push(`Trong khoảng thời gian ${data.TU_NGAY} đến ${data.DEN_NGAY}, hệ thống ghi nhận ${totalRecord} bản ghi vận hành.`);

  if (maxP > 0) {
    comments.push(`Công suất tác dụng lớn nhất đạt ${maxP.toFixed(2)} kW, công suất trung bình đạt ${avgP.toFixed(2)} kW.`);
  }

  const maxI = Math.max(maxIa, maxIb, maxIc);

  if (maxI > 0) {
    comments.push(`Dòng điện lớn nhất ghi nhận là ${maxI.toFixed(2)} A.`);
  }

  if (maxIa && maxIb && maxIc) {
    const avgI = (maxIa + maxIb + maxIc) / 3;
    const lệchPha = Math.max(
      Math.abs(maxIa - avgI),
      Math.abs(maxIb - avgI),
      Math.abs(maxIc - avgI)
    ) / avgI * 100;

    if (lệchPha > 20) {
      comments.push(`Dòng điện giữa các pha có dấu hiệu mất cân bằng khoảng ${lệchPha.toFixed(1)}%, cần kiểm tra phân bố tải.`);
    } else {
      comments.push('Dòng điện giữa các pha tương đối cân bằng.');
    }
  }

  comments.push('Khuyến nghị tiếp tục theo dõi các khung giờ cao điểm và các thông số dòng, áp, công suất.');

  return comments.join(' ');
}

module.exports = {
  generateDailySummary
};