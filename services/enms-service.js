'use strict';
const { createStore } = require('../public/enms/mock');
// Mock workspaces are isolated per authenticated user; no database writes.
const workspaces = new Map();
async function request(user, method, resource, params) {
  const mode = process.env.ENMS_DATA_SOURCE || 'mock';
  if (mode !== 'mock') {
    // Implement against services/database.js after validating the existing schema
    // and the account's plant/station ACL. Never fall back silently to mock data.
    const error = new Error('Nguồn dữ liệu EnMS thực chưa được cấu hình');
    error.status = 503;
    throw error;
  }
  const key = String(user.sub);
  if (!workspaces.has(key)) {
    if (workspaces.size >= 500) workspaces.delete(workspaces.keys().next().value);
    workspaces.set(key, createStore());
  }
  return {data: workspaces.get(key).request(method, resource, params), meta:{source:'mock',version:'1.0.0',generatedAt:new Date().toISOString()}};
}
module.exports = { request };
