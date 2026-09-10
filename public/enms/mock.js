/* Deterministic demo data. No production credentials or database identifiers. */
(function(root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.EnmsMock = factory();
})(typeof window !== 'undefined' ? window : globalThis, function() {
  'use strict';
  const names = ['Trạm biến áp tổng','Nghiền liệu 1&2','Đuôi lò 1&2','Đầu lò 1','Tiền nghiền xi 1','Nghiền xi 1','Cán dong','Nhà tuabin','Đầu lò 2','Nghiền xi 2','Đóng bao 2','Kho rác kín','Cảng','Dây chuyền đá 3','Trạm bơm nước','Phụ trợ'];
  const power = [12.5,8.7,6.8,5.2,4.6,6.1,2.8,3.9,5.8,6.7,3.2,2.9,4.8,3.6,1.5,1.2];
  const counts = [6,8,6,5,4,4,4,4,3,4,4,3,4,3,5,4];
  const positions = [[10,24],[25,16],[36,34],[43,12],[51,45],[61,25],[30,66],[48,73],[69,12],[73,44],[84,30],[91,53],[86,78],[64,77],[13,65],[39,87]];
  const palette = ['#0789ed','#0cb48b','#ffab19','#7e62db','#16b8d4','#f06dab','#638aa7','#ffca54'];
  const fail = (status, message) => { const e = new Error(message); e.status = status; throw e; };
  function createStore() {
    const stations = names.map((name,i) => ({id: String(i+1),name,power:power[i],capacity:Math.ceil(power[i]*1.35),energy:Math.round(8524630*power[i]/power.reduce((a,b)=>a+b,0)),meters:counts[i],status:'Hoạt động',group:i<8?'Trung tâm':i<11?'Khoảng cách TB':'Khu vực xa',distance:i<8?'≤500m':i<11?'≤800m':'900–1500m',x:positions[i][0],y:positions[i][1],color:palette[i%8],enpi:+(5.06-i*.13).toFixed(2)}));
    const meters = stations.flatMap(s=>Array.from({length:s.meters},(_,j)=>({id:`MT-${String(stations.slice(0,+s.id-1).reduce((n,x)=>n+x.meters,0)+j+1).padStart(3,'0')}`,stationId:s.id,name:j<2?`Máy biến áp T${j+1}`:`Tủ 6kV · Ngăn lộ ${j-1}`,station:s.name,power:+(s.power/s.meters).toFixed(2),voltage:6,pf:.97,status:'Hoạt động'})));
    meters[25].status='Lỗi'; meters[40].status='Lỗi';
    const messages=['Suất tiêu hao điện năng vượt ngưỡng','Công suất vượt 90%','Mất truyền thông','Suất tiêu hao tăng bất thường','Mất kết nối gateway','Dòng điện cao bất thường','Tiêu thụ điện tăng 20%','Nhiệt độ nước làm mát cao','Hệ số công suất thấp','Dữ liệu bất thường'];
    const alerts=Array.from({length:27},(_,i)=>({id:String(i+1),time:`2025-06-${String(10-Math.floor(i/5)).padStart(2,'0')}T${String(10-i%5).padStart(2,'0')}:${String(22-i%20).padStart(2,'0')}:14`,stationId: String(i===0?9:i%16+1),station:names[i===0?8:i%16],device:i===0?'Động cơ quạt ID':`Điểm đo MT-${String(i+1).padStart(3,'0')}`,message:messages[i%10],value:i===0?'125 kWh/tấn':i%3===0?'320 A':'78.5 MW',threshold:i===0?'100 kWh/tấn':i%3===0?'250 A':'75 MW',severity:i<3?'critical':i<10?'warning':i<15?'minor':'info',status:i%4===0?'Đang xử lý':i%4===1?'Chưa xử lý':i%4===2?'Đã xác nhận':'Đã khôi phục',assignee:'Đội vận hành',note:''}));
    const reports=Array.from({length:4},(_,i)=>({id:String(i+1),name:['Báo cáo tổng hợp tháng 06/2025','Báo cáo EnPI','Báo cáo phát thải CO₂','Báo cáo so sánh năng lượng'][i],type:['Tổng hợp','EnPI','Phát thải','So sánh'][i],from:'2025-06-01',to:'2025-06-10',createdAt:'2025-06-10T09:15:00',creator:'Nguyễn Văn A',status:'Hoàn thành'}));
    const summary={energy:8524630,power:62.3,capacity:78.5,clinker:12450,enpi:684,co2:652,cost:1245600,meters:71,stations:16,gateways:3,healthyMeters:69,target:700,targetProgress:62,updatedAt:'2025-06-10T10:24:00',series:Array.from({length:25},(_,i)=>+(49+Math.sin(i/3)*7+i*.55).toFixed(1))};
    function request(method, resource, params={}) {
      const [name,id] = resource.replace(/^\//,'').split('/');
      if(method==='GET') {
        if(name==='summary') return summary;
        if(name==='stations') return stations.filter(s=>(!params.search||s.name.toLocaleLowerCase('vi').includes(params.search.toLocaleLowerCase('vi')))&&(!params.stationId||s.id===params.stationId));
        if(name==='meters') return meters.filter(m=>(!params.stationId||m.stationId===params.stationId)&&(!params.search||`${m.id} ${m.name}`.toLowerCase().includes(params.search.toLowerCase())));
        if(name==='alerts') {
          if(id) return alerts.find(a=>a.id===id)||fail(404,'Không tìm thấy sự kiện');
          let rows=alerts.filter(a=>(!params.severity||a.severity===params.severity)&&(!params.status||a.status===params.status)&&(!params.stationId||a.stationId===params.stationId)&&(!params.search||`${a.message} ${a.station} ${a.device}`.toLocaleLowerCase('vi').includes(params.search.toLocaleLowerCase('vi')))&&(!params.from||a.time.slice(0,10)>=params.from)&&(!params.to||a.time.slice(0,10)<=params.to));
          return paginate(rows,params);
        }
        if(name==='readings') {
          const meter=meters.find(m=>m.id===(params.meterId||'MT-001'));
          if(!meter) fail(404,'Không tìm thấy điểm đo');
          const from=new Date((params.from||'2025-06-10')+'T00:00:00Z'),to=new Date((params.to||'2025-06-10')+'T23:59:59Z');
          if(!Number.isFinite(+from)||!Number.isFinite(+to)||from>to) fail(400,'Khoảng thời gian không hợp lệ');
          const step=Number(params.interval||60)*60000;
          if(![15,60,1440].includes(step/60000)) fail(400,'Chu kỳ không hợp lệ');
          const total=Math.floor((to-from)/step)+1;
          if(total>35040) fail(400,'Vui lòng chọn khoảng thời gian ngắn hơn');
          const rows=Array.from({length:total},(_,i)=>({time:new Date(+to-(i+1)*step+1000).toISOString(),meterId:meter.id,p:+(meter.power*(.88+Math.sin(i/3)*.07)).toFixed(2),q:.32,s:+(meter.power*.96).toFixed(2),u:6.04,ia:1230,ib:1228,ic:1245,pf:.97,hz:50,energy:Math.round(meter.power*1000*(total-i))}));
          return paginate(rows,params);
        }
        if(name==='seu') return stations.map((s,i)=>({...s,production:i?Math.round(s.energy/s.enpi):null,previous:+(s.enpi*1.025).toFixed(2),improvement:2.5}));
        if(name==='reports') return id?(reports.find(r=>r.id===id)||fail(404,'Không tìm thấy báo cáo')):reports;
      }
      if(method==='PATCH'&&name==='alerts'&&id) {
        const row=alerts.find(a=>a.id===id); if(!row) fail(404,'Không tìm thấy sự kiện');
        if(!['Chưa xử lý','Đang xử lý','Đã xác nhận','Đã khôi phục'].includes(params.status)) fail(400,'Trạng thái không hợp lệ');
        if(typeof params.note!=='string'||params.note.length>2000) fail(400,'Ghi chú tối đa 2.000 ký tự');
        if(!['Đội vận hành','Phòng kỹ thuật','Quản lý năng lượng'].includes(params.assignee)) fail(400,'Đơn vị phụ trách không hợp lệ');
        Object.assign(row,{status:params.status,note:params.note,assignee:params.assignee}); return row;
      }
      if(method==='POST'&&name==='reports') {
        if(!['Tổng hợp','EnPI','Phát thải','So sánh'].includes(params.type)) fail(400,'Loại báo cáo không hợp lệ');
        if(!/^\d{4}-\d{2}-\d{2}$/.test(params.from||'')||!/^\d{4}-\d{2}-\d{2}$/.test(params.to||'')||params.from>params.to) fail(400,'Khoảng thời gian không hợp lệ');
        const r={id:String(reports.length+1),name:`Báo cáo ${params.type.toLowerCase()} · ${params.from} – ${params.to}`,type:params.type,from:params.from,to:params.to,createdAt:new Date().toISOString(),creator:'Người dùng hiện tại',status:'Hoàn thành'};reports.unshift(r);return r;
      }
      fail(404,'Không tìm thấy API');
    }
    return {request};
  }
  function paginate(rows,params) {
    const page=Number(params.page||1),pageSize=Number(params.pageSize||10);
    if(!Number.isInteger(page)||page<1||!Number.isInteger(pageSize)||pageSize<1||pageSize>1000) fail(400,'Phân trang không hợp lệ');
    return {items:rows.slice((page-1)*pageSize,page*pageSize),total:rows.length,page,pageSize};
  }
  return {createStore};
});
