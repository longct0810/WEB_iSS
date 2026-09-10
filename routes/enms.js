'use strict';
const express=require('express');
const controller=require('../controllers/enms');
const api=express.Router();
api.use(controller.authenticate);
for (const resource of ['summary','stations','meters','readings','seu','alerts','reports']) api.get('/'+resource,controller.handle);
api.get('/alerts/:id',controller.handle);
api.patch('/alerts/:id',controller.handle);
api.get('/reports/:id',controller.handle);
api.post('/reports',controller.handle);
const menu=require('../config/enms-menu');
const pages=express.Router();
pages.get('/vendor/xlsx.js',(req,res)=>res.sendFile(require.resolve('xlsx/dist/xlsx.full.min.js')));
function render(req,res) {
  const page=req.params.page||'overview';
  if(!menu.some(item=>item.id===page)) return res.status(404).send('Không tìm thấy trang EnMS');
  res.render('enms/index',{page,menu,preview:req.path.startsWith('/preview'),title:menu.find(x=>x.id===page).title});
}
pages.get('/preview/:page?',render);
pages.get('/:page?',render);
module.exports={api,pages,menu};
