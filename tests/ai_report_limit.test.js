const test = require("node:test");
const assert = require("node:assert/strict");

const {
  _test: { limitSensorPoints }
} = require("../controllers/baocao_ai_vanhanh_ngay");

test("giới hạn báo cáo giữ lại các điểm mới nhất", () => {
  const rows = [{
    json_data: {
      ioa_diachi: 5000,
      cambien: [1, 2, 3, 4, 5].map(value => ({ value }))
    }
  }];

  const limited = limitSensorPoints(rows, 3);
  assert.deepEqual(
    limited[0].json_data.cambien.map(item => item.value),
    [3, 4, 5]
  );
  assert.equal(rows[0].json_data.cambien.length, 5);
});

test("giới hạn báo cáo hỗ trợ json_data dạng chuỗi", () => {
  const rows = [{
    JSON_DATA: JSON.stringify({
      ioa_diachi: 5006,
      cambien: [{ value: 10 }, { value: 20 }]
    })
  }];
  const limited = limitSensorPoints(rows, 1);
  assert.equal(JSON.parse(limited[0].JSON_DATA).cambien[0].value, 20);
});
