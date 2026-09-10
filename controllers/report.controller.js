// controllers/report.controller.js
const reportService = require('../services/report.service');
const reportAiRuleService = require('../services/report-ai-rule.service');

async function getDailyOperation(req, res, next) {
  try {
    const { id_thietbi, tungay, denngay } = req.query;

    if (!id_thietbi || !tungay || !denngay) {
      return res.status(400).json({
        success: false,
        message: 'Thiếu tham số id_thietbi, tungay, denngay'
      });
    }

    const data = await reportService.getDailyOperation({
      id_thietbi,
      tungay,
      denngay
    });

    const aiSummary = reportAiRuleService.generateDailySummary(data);

    return res.json({
      success: true,
      data: {
        ...data,
        aiSummary
      }
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getDailyOperation
};