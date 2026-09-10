'use strict';

const crypto = require('crypto');

const ISSUER = process.env.LOGIN_JWT_ISSUER || 'smartgrid-web';
const AUDIENCE = process.env.LOGIN_JWT_AUDIENCE || 'smartgrid-web-app';

function getSecret() {
  const secret = String(process.env.LOGIN_JWT_SECRET || '').trim();
  if (secret.length < 32) {
    throw new Error('LOGIN_JWT_SECRET must contain at least 32 characters');
  }
  return secret;
}

function encode(value) {
  return Buffer.from(JSON.stringify(value)).toString('base64url');
}

function sign(payload, secret) {
  const header = encode({ alg: 'HS256', typ: 'JWT' });
  const body = encode(payload);
  const input = `${header}.${body}`;
  const signature = crypto.createHmac('sha256', secret).update(input).digest('base64url');
  return `${input}.${signature}`;
}

function verify(token, secret) {
  const parts = String(token || '').split('.');
  if (parts.length !== 3) throw new Error('Invalid login JWT');
  const [header, body, signature] = parts;
  const expected = crypto.createHmac('sha256', secret).update(`${header}.${body}`).digest('base64url');
  if (signature.length !== expected.length || !crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) {
    throw new Error('Invalid login JWT signature');
  }
  const parsedHeader = JSON.parse(Buffer.from(header, 'base64url').toString('utf8'));
  const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8'));
  if (parsedHeader.alg !== 'HS256') throw new Error('Invalid login JWT algorithm');
  const now = Math.floor(Date.now() / 1000);
  if (payload.iss !== ISSUER || payload.aud !== AUDIENCE || Number(payload.exp) <= now) {
    throw new Error('Invalid login JWT claims');
  }
  return payload;
}

function createLoginToken(user) {
  const now = Math.floor(Date.now() / 1000);
  const ttl = process.env.LOGIN_JWT_TTL === '8h' || !process.env.LOGIN_JWT_TTL
    ? 8 * 60 * 60
    : Number(process.env.LOGIN_JWT_TTL);
  return sign({
    sub: String(user.mataikhoan),
    role: String(user.role || user.vaitro || user.quyen || 'user'),
    username: user.taikhoan ? String(user.taikhoan) : undefined,
    iss: ISSUER,
    aud: AUDIENCE,
    iat: now,
    exp: now + ttl
  }, getSecret());
}

function verifyLoginToken(token) {
  return verify(token, getSecret());
}

module.exports = { createLoginToken, verifyLoginToken };
