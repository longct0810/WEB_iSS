const test = require("node:test");
const assert = require("node:assert/strict");

const IOA = require("../services/ioa_map");

test("IOA PowerAI có đủ góc pha và công suất tổng", () => {
  assert.equal(IOA.ANGLE_A, 5050);
  assert.equal(IOA.ANGLE_B, 5051);
  assert.equal(IOA.ANGLE_C, 5052);
  assert.equal(IOA.P_TOTAL, 5070);
  assert.equal(IOA.Q_TOTAL, 5071);
  assert.equal(IOA.FREQ, 5030);
});

test("địa chỉ IOA không bị trùng", () => {
  const values = Object.values(IOA);
  assert.equal(new Set(values).size, values.length);
});

test("IOA khoang hạ thế được ánh xạ đầy đủ", () => {
  assert.equal(IOA.HATHE_UA, 0);
  assert.equal(IOA.HATHE_UB, 1);
  assert.equal(IOA.HATHE_UC, 2);
  assert.equal(IOA.HATHE_IA, 7);
  assert.equal(IOA.HATHE_IB, 8);
  assert.equal(IOA.HATHE_IC, 9);
  assert.equal(IOA.HATHE_COS_A, 23);
  assert.equal(IOA.HATHE_COS_B, 24);
  assert.equal(IOA.HATHE_COS_C, 25);
  assert.equal(IOA.NHIETDO_CUC_A, 1008);
  assert.equal(IOA.NHIETDO_CUC_B, 1009);
  assert.equal(IOA.NHIETDO_CUC_C, 1010);
  assert.equal(IOA.NHIETDO_MOITRUONG, 1011);
});
