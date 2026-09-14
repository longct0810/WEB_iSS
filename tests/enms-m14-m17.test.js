'use strict';
const fs=require('fs');const path=require('path');const root=path.join(__dirname,'..');
for(const p of ['analytics','digital-twin','ai-decision','autonomous']){
 const view=fs.readFileSync(path.join(root,'views/enms/pages',p,'index.ejs'),'utf8');
 const js=fs.readFileSync(path.join(root,'public/enms/js/pages',p+'.js'),'utf8');
 if(!view.includes("include('_tabs')")) throw new Error(p+' not modular');
 if(!js.includes('export async function mount')) throw new Error(p+' missing mount');
}
const mock=fs.readFileSync(path.join(root,'public/enms/mock.js'),'utf8');
for(const token of ['data.demandForecast','data.energyFlow','data.pareto','data.closedLoop']) if(!mock.includes(token)) throw new Error('missing '+token);
console.log('M14-M17 regression: 8/8 passed');
