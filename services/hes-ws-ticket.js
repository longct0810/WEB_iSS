'use strict';

const crypto = require('crypto');
const fs = require('fs');

function getPrivateKey() {
  const keyPath = String(process.env.HES_WS_PRIVATE_KEY_PATH || '').trim();
  if (!keyPath) throw new Error('HES_WS_PRIVATE_KEY_PATH is not configured');
  return fs.readFileSync(keyPath, 'utf8');
}

function createHesWsTicket({ userId, role, devices }) {
  const now = Math.floor(Date.now() / 1000);
  const payload = {
    sub: String(userId),
    role: String(role || 'user'),
    permissions: ['telemetry.read'],
    devices: devices.map(String),
    iat: now,
    exp: now + Number(process.env.HES_WS_TICKET_TTL_SEC || 90),
    iss: process.env.HES_WS_JWT_ISSUER || 'smartgrid-web',
    aud: process.env.HES_WS_JWT_AUDIENCE || 'hes104-ws',
    jti: crypto.randomUUID()
  };
  const header = {
    alg: 'RS256',
    typ: 'JWT',
    kid: String(process.env.HES_WS_JWT_KEY_ID || '')
  };
  if (!header.kid) throw new Error('HES_WS_JWT_KEY_ID is not configured');

  const encodedHeader = Buffer.from(JSON.stringify(header)).toString('base64url');
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto.sign(
    'RSA-SHA256',
    Buffer.from(`${encodedHeader}.${encodedPayload}`),
    getPrivateKey()
  ).toString('base64url');

  return `${encodedHeader}.${encodedPayload}.${signature}`;
}

module.exports = { createHesWsTicket };
