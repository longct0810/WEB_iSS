'use strict';
const branches = [
  [78.4,62.1,55.3,12.4,195.8,18.6,'overload'],
  [45.2,48.6,47.9,5.1,141.7,4.3,'normal'],
  [32.1,28.4,56.8,7.3,117.3,38.2,'warning'],
  [25.6,22.1,24.3,3.2,72.0,7.9,'normal'],
  [18.4,19.1,17.6,2.1,55.1,7.8,'normal'],
  [12.3,14.5,12.1,1.8,38.9,15.6,'normal'],
  [28.6,35.2,21.4,4.6,85.2,33.1,'warning'],
  [16.2,18.7,15.9,2.8,50.8,18.8,'normal']
].map((values,index)=>({values,index,name:`Nhánh ${String(index+1).padStart(2,'0')} - Khu ${String.fromCharCode(65+index)}`}));
const statusLabels = {normal:'Bình thường',warning:'Cảnh báo',overload:'Quá tải'};
const normalize = value => value.normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/đ/g,'d').toLowerCase();
function renderBranches(query='') {
  const filtered=branches.filter(branch=>normalize(branch.name).includes(normalize(query)));
  document.getElementById('branch-rows').innerHTML=filtered.map(({values:v,index,name})=>`<tr><td>${index+1}</td><td>${name}</td>${v.slice(0,6).map((n,i)=>`<td class="${index===0&&i===0?'highlight-red':index===2&&i===2?'highlight-yellow':i===5&&n>30||i===5&&index===0?'imbalance':''}">${n.toFixed(1)}</td>`).join('')}<td><span class="badge ${v[6]}">${statusLabels[v[6]]}</span></td></tr>`).join('');
  document.getElementById('empty-state').hidden=filtered.length>0;
}
renderBranches();
document.getElementById('branch-search').addEventListener('input',event=>renderBranches(event.target.value));
function renderLoads(mode='total') {
  const column={total:4,a:0,b:1,c:2}[mode],limit=mode==='total'?200:80;
  document.getElementById('load-bars').innerHTML=branches.slice(0,5).map(({values:v,index})=>{const percent=Math.round(v[column]/limit*100),color=v[6]==='overload'?'red':v[6]==='warning'?'yellow':'green';return `<div class="load-row"><span>Nhánh ${index+1}</span><div class="bar-track"><div class="bar-fill ${color}" style="width:${Math.min(percent,100)}%"></div></div><span class="load-value">${v[column].toFixed(1)} A</span><span class="load-percent ${percent>=95?'danger':''}">${percent}%</span></div>`;}).join('');
}
renderLoads();
document.getElementById('load-mode').addEventListener('change',event=>renderLoads(event.target.value));
document.getElementById('show-alerts').addEventListener('click',event=>{const row=document.querySelector('.extra-alert');row.hidden=!row.hidden;event.target.textContent=row.hidden?'Xem tất cả':'Thu gọn';});
const profile=[0,5,-3,8,1,-4,7,2,12,32,-18,4,36,-7,-14,9,2,14,-1,22,-11,3,21,42,24,9,29,22,35,28,13,37,82,63,76,52,112,46,38,8,15,31,44,17,-12,6,33,53,40,12,28,43,51,19,4];
function chartData(period) {
  const labels=profile.map((_,i)=>period===1?`${13+Math.floor((30+i*60/(profile.length-1))/60)}:${String(Math.floor((30+i*60/(profile.length-1))%60)).padStart(2,'0')}`:period===24?`${String(Math.floor(i*24/(profile.length-1))%24).padStart(2,'0')}:00`:`${20+Math.min(6,Math.floor(i*7/profile.length))}/05`);
  return {labels,datasets:[{label:'Pha A',borderColor:'#ef3e36',base:195},{label:'Pha B',borderColor:'#18bb71',base:145},{label:'Pha C',borderColor:'#f2c519',base:100}].map((phase,index)=>({label:phase.label,borderColor:phase.borderColor,backgroundColor:phase.borderColor,data:profile.map((n,i)=>Math.round(phase.base+n*(index===0?1.2:index===1?1:.9)+(period===1?0:Math.sin(i*.65+index)*22))),fill:false,borderWidth:2,pointRadius:1.3,lineTension:0}))};
}
const chart=new Chart(document.getElementById('current-chart'),{type:'line',data:chartData(1),options:{responsive:true,maintainAspectRatio:false,legend:{position:'top',align:'start',labels:{usePointStyle:true,boxWidth:7,padding:20,fontColor:'#24313e'}},scales:{yAxes:[{ticks:{min:0,max:400,stepSize:100},scaleLabel:{display:true,labelString:'Dòng điện (A)'},gridLines:{color:'#e8ebef'}}],xAxes:[{ticks:{maxTicksLimit:7,maxRotation:0},gridLines:{display:false}}]},tooltips:{mode:'index',intersect:false}}});
document.querySelectorAll('[data-period]').forEach(button=>button.addEventListener('click',()=>{document.querySelectorAll('[data-period]').forEach(item=>item.classList.toggle('selected',item===button));chart.data=chartData(Number(button.dataset.period));chart.update();}));
document.querySelectorAll('nav a').forEach(link=>link.addEventListener('click',()=>{document.querySelectorAll('nav a').forEach(item=>item.classList.toggle('active',item===link));}));
