'use strict';
// Standalone mock preview: no database connection, JWT issuance or HES socket.
const express=require('express');
const path=require('path');
const app=express();
app.set('views',path.join(__dirname,'../views'));
app.set('view engine','ejs');
app.use('/enms/assets',express.static(path.join(__dirname,'../public/enms/assets')));
app.use(express.static(path.join(__dirname,'../public')));
app.get('/',(req,res)=>res.redirect('/enms/preview/overview'));
app.use('/enms',require('../routes/enms').pages);
const port=Number(process.env.ENMS_PREVIEW_PORT||3001);
app.listen(port,'127.0.0.1',()=>console.log(`EnMS preview: http://127.0.0.1:${port}/enms/preview/overview`));
