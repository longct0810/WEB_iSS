'use strict';

const devicesApi = require('../db_apis/ds_thietbi_IEC_104.js');
const { verifyLoginToken } = require('../services/login-jwt.js');
const { createHesWsTicket } = require('../services/hes-ws-ticket.js');

function readBearerToken(req) {
  const value = String(req.headers.authorization || '');
  const match = value.match(/^Bearer\s+(.+)$/i);
  return match ? match[1].trim() : '';
}

function readDeviceId(row) {
  return row && (row.ID_THIETBI ?? row.id_thietbi ?? row.ID ?? row.id);
}

function configuredLocalDevices() {
  if (process.env.NODE_ENV === 'production') return null;
  const value = String(process.env.HES_WS_LOCAL_ALLOWED_DEVICES || '').trim();
  if (!value) return null;
  return new Set(value.split(',').map((id) => id.trim()).filter(Boolean));
}

async function getAllowedDevices(userId) {
  try {
    const rows = await devicesApi.find({ userid: Number(userId) });
    return new Set(
      (Array.isArray(rows) ? rows : [])
        .map(readDeviceId)
        .filter((id) => id !== undefined && id !== null)
        .map(String)
    );
  } catch (error) {
    const localDevices = configuredLocalDevices();
    if (localDevices) return localDevices;
    error.code = 'HES_WS_ACL_UNAVAILABLE';
    throw error;
  }
}

async function post(req, res, next) {
  try {
    const loginToken = readBearerToken(req);
    if (!loginToken) return res.status(401).json({ error: 'LOGIN_REQUIRED' });

    let login;
    try {
      login = verifyLoginToken(loginToken);
    } catch {
      return res.status(401).json({ error: 'INVALID_LOGIN_TOKEN' });
    }

    const requested = Array.isArray(req.body?.devices)
      ? [...new Set(req.body.devices.map(String).filter(Boolean))]
      : [];
    if (requested.length === 0 || requested.length > 100) {
      return res.status(400).json({ error: 'INVALID_DEVICE_SCOPE' });
    }

    const allowed = await getAllowedDevices(login.sub);
    if (requested.some((deviceId) => !allowed.has(deviceId))) {
      return res.status(403).json({ error: 'DEVICE_FORBIDDEN' });
    }

    const ticket = createHesWsTicket({
      userId: login.sub,
      role: login.role,
      devices: requested
    });

    res.json({
      ticket,
      wsUrl: process.env.HES_WS_URL || 'wss://hes104.ifc.com.vn:6332/ws'
    });
  } catch (err) {
    if (err.code === 'HES_WS_ACL_UNAVAILABLE') {
      return res.status(503).json({ error: 'DEVICE_ACL_UNAVAILABLE' });
    }
    next(err);
  }
}

module.exports = { post, getAllowedDevices };
