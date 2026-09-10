'use strict';
const { verifyLoginToken } = require('../services/login-jwt');
const service = require('../services/enms-service');
function authenticate(req,res,next) {
  try {
    const match = String(req.headers.authorization||'').match(/^Bearer\s+(.+)$/i);
    if (!match) throw new Error('Missing token');
    req.enmsUser = verifyLoginToken(match[1]);
    if (!req.enmsUser.sub || !Number.isFinite(req.enmsUser.exp)) throw new Error('Invalid claims');
    next();
  } catch { res.status(401).json({error:'LOGIN_REQUIRED',message:'Vui lòng đăng nhập lại'}); }
}
async function handle(req,res) {
  try {
    const result = await service.request(req.enmsUser,req.method,req.path,req.method==='GET'?req.query:req.body);
    res.set('Cache-Control','no-store').status(req.method==='POST'?201:200).json(result);
  } catch(e) { res.status(e.status||500).json({error:e.status?'ENMS_REQUEST_FAILED':'INTERNAL_ERROR',message:e.status?e.message:'Không thể tải dữ liệu EnMS'}); }
}
module.exports = {authenticate,handle};
