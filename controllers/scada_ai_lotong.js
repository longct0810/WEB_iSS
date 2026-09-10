const qwen = require('../services/ollama-service');

const MAX_ROWS = 5000;
const ALLOWED_FIELDS = [
    'stt', 'thoidiem',
    'Ua', 'Ub', 'Uc', 'Uab', 'Ubc', 'Uca',
    'Ia', 'Ib', 'Ic', 'Io',
    'Cos', 'CosA', 'CosB', 'CosC',
    'P', 'Pa', 'Pb', 'Pc',
    'Q', 'Qa', 'Qb', 'Qc',
    'S', 'Sa', 'Sb', 'Sc', 'F'
];

function sanitizeRows(rows) {
    return rows.map((row) => {
        const clean = {};
        ALLOWED_FIELDS.forEach((field) => {
            const value = row?.[field];
            if (value === null || value === undefined || value === '') return;
            clean[field] = typeof value === 'string' ? value.slice(0, 80) : value;
        });
        return clean;
    });
}

function summarizeRows(rows) {
    const cleanRows = sanitizeRows(rows);
    const numericFields = ALLOWED_FIELDS.filter((field) => field !== 'stt' && field !== 'thoidiem');
    const statistics = {};

    numericFields.forEach((field) => {
        const values = cleanRows
            .map((row) => ({ value: Number(row[field]), time: row.thoidiem || '-' }))
            .filter((item) => Number.isFinite(item.value));
        if (!values.length) return;
        const min = values.reduce((a, b) => b.value < a.value ? b : a);
        const max = values.reduce((a, b) => b.value > a.value ? b : a);
        statistics[field] = {
            count: values.length,
            min: min.value,
            min_time: min.time,
            max: max.value,
            max_time: max.time,
            average: Number((values.reduce((sum, item) => sum + item.value, 0) / values.length).toFixed(3))
        };
    });

    const imbalance = cleanRows.map((row) => {
        const currents = [row.Ia, row.Ib, row.Ic].map(Number);
        if (!currents.every(Number.isFinite)) return null;
        const average = currents.reduce((sum, value) => sum + value, 0) / 3;
        if (!average) return null;
        return {
            time: row.thoidiem || '-',
            percent: Number((Math.max(...currents.map((value) => Math.abs(value - average))) / average * 100).toFixed(2)),
            Ia: currents[0], Ib: currents[1], Ic: currents[2]
        };
    }).filter(Boolean).sort((a, b) => b.percent - a.percent);

    const lowPowerFactor = cleanRows
        .filter((row) => Number.isFinite(Number(row.Cos)) && Number(row.Cos) < 0.95)
        .map((row) => ({ time: row.thoidiem || '-', Cos: Number(row.Cos) }));

    return {
        total_rows: cleanRows.length,
        first_time: cleanRows[0]?.thoidiem || '-',
        last_time: cleanRows[cleanRows.length - 1]?.thoidiem || '-',
        statistics,
        maximum_current_unbalance: imbalance[0] || null,
        low_total_power_factor_count: lowPowerFactor.length,
        low_total_power_factor_events: lowPowerFactor.slice(0, 20)
    };
}

function fallbackVietnameseReport(summary) {
    const stat = summary.statistics;
    const range = (key, unit) => stat[key]
        ? `${stat[key].min}–${stat[key].max} ${unit}, trung bình ${stat[key].average} ${unit}`
        : 'không đủ dữ liệu';
    const imbalance = summary.maximum_current_unbalance;
    return [
        '1. Đánh giá tổng quan',
        `Đã xử lý toàn bộ ${summary.total_rows} bản ghi trong bảng Lộ tổng, từ ${summary.first_time} đến ${summary.last_time}.`,
        '',
        '2. Điện áp',
        `Pha A: ${range('Ua', 'V')}; pha B: ${range('Ub', 'V')}; pha C: ${range('Uc', 'V')}.`,
        '',
        '3. Dòng điện và mức độ mất cân bằng',
        `Pha A: ${range('Ia', 'A')}; pha B: ${range('Ib', 'A')}; pha C: ${range('Ic', 'A')}; dòng trung tính: ${range('Io', 'A')}.`,
        imbalance ? `Mất cân bằng dòng điện lớn nhất khoảng ${imbalance.percent}% tại ${imbalance.time}, với Ia=${imbalance.Ia} A, Ib=${imbalance.Ib} A, Ic=${imbalance.Ic} A.` : 'Không đủ dữ liệu để tính mất cân bằng dòng điện.',
        '',
        '4. Hệ số công suất',
        `Cosφ tổng: ${range('Cos', '')}. Có ${summary.low_total_power_factor_count} bản ghi thấp hơn 0,95.`,
        '',
        '5. Công suất và tần số',
        `Công suất tác dụng tổng: ${range('P', 'kW')}; công suất phản kháng tổng: ${range('Q', 'kVAr')}; công suất biểu kiến tổng: ${range('S', 'kVA')}; tần số: ${range('F', 'Hz')}.`,
        '',
        '6. Khuyến nghị',
        'Cần đối chiếu các thời điểm cực trị với trạng thái đóng cắt phụ tải; kiểm tra phân bố tải giữa ba pha, dòng trung tính và hệ thống bù công suất phản kháng. Kết quả này mang tính hỗ trợ và cần được xác nhận theo ngưỡng kỹ thuật của nhà máy.'
    ].join('\n');
}

async function post(req, res) {
    const rows = Array.isArray(req.body?.rows) ? req.body.rows : [];
    if (!rows.length) {
        return res.status(400).json({ success: false, message: 'Bảng Lộ tổng chưa có dữ liệu để phân tích' });
    }
    if (rows.length > MAX_ROWS) {
        return res.status(413).json({
            success: false,
            message: `Dữ liệu vượt quá giới hạn ${MAX_ROWS} bản ghi cho một lần phân tích`
        });
    }

    const context = {
        device_id: req.body?.device_id ?? null,
        device_name: String(req.body?.device_name || '').slice(0, 200),
        from_date: String(req.body?.from_date || '').slice(0, 20),
        to_date: String(req.body?.to_date || '').slice(0, 20),
        row_count: rows.length
    };

    try {
        const summary = summarizeRows(rows);
        let result = await qwen.chat([
            {
                role: 'system',
                content: [
                    'Bạn là kỹ sư phân tích vận hành hệ thống điện ba pha.',
                    'Chỉ xuất bản báo cáo cuối cùng, tuyệt đối không trình bày suy nghĩ, quá trình lập luận hay lời dẫn.',
                    'Hãy phân tích đúng dữ liệu được cung cấp, không tự tạo số liệu và trả lời 100% bằng tiếng Việt.',
                    'Không sử dụng câu, tiêu đề hoặc lời giải thích bằng tiếng Anh. Các ký hiệu kỹ thuật như U, I, P, Q, S, Cos φ và đơn vị đo được giữ nguyên.',
                    'Nêu rõ: 1. Đánh giá tổng quan; 2. Điện áp; 3. Dòng điện và mất cân bằng pha; 4. Hệ số công suất; 5. Công suất P/Q/S và tần số; 6. Bất thường theo thời điểm; 7. Khuyến nghị.',
                    'Trích dẫn giá trị và thời điểm làm bằng chứng. Nếu trường dữ liệu thiếu thì nói rõ không đủ dữ liệu.',
                    'Phân biệt nhận định tham khảo của AI với kết luận bảo vệ/an toàn điện.'
                ].join(' ')
            },
            {
                role: 'user',
                content: `/no_think\nThông tin truy vấn: ${JSON.stringify(context)}\nKết quả thống kê được tính từ toàn bộ dữ liệu bảng Lộ tổng: ${JSON.stringify(summary)}`
            }
        ], { temperature: 0.1, num_predict: 1400 });

        let analysis = qwen.stripThinkingContent(result.answer);
        if (!analysis || qwen.looksEnglishOrReasoning(analysis)) {
            result = await qwen.chat([
                {
                    role: 'system',
                    content: 'Bạn là biên tập viên kỹ thuật người Việt Nam. Chỉ trả về bản báo cáo cuối cùng bằng tiếng Việt. Không nêu quá trình suy nghĩ, không dùng lời dẫn và không để lại câu tiếng Anh. Giữ nguyên số liệu, thời điểm, ký hiệu điện và đơn vị đo.'
                },
                {
                    role: 'user',
                    content: `/no_think\nHãy lập báo cáo kỹ thuật 100% tiếng Việt từ số liệu sau: ${JSON.stringify(summary)}`
                }
            ], { temperature: 0.05, num_predict: 1400 });
            analysis = qwen.stripThinkingContent(result.answer);
        }

        if (!analysis || qwen.looksEnglishOrReasoning(analysis)) {
            analysis = fallbackVietnameseReport(summary);
        }

        return res.json({
            success: true,
            data: {
                analysis,
                row_count: rows.length
            }
        });
    } catch (error) {
        console.error('[SCADA AI LO TONG]', error.response?.data || error.message);
        const unavailable = error.code === 'ECONNREFUSED' || error.code === 'ECONNABORTED';
        return res.status(unavailable ? 503 : 502).json({
            success: false,
            message: unavailable ? 'Không kết nối được dịch vụ phân tích AI' : 'Dịch vụ AI chưa thể phân tích dữ liệu'
        });
    }
}

module.exports = { post };
