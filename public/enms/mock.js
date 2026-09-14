/* Deterministic EnMS demo data. No production credentials or database identifiers. */
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

  const moduleDefinitions = Object.freeze([
    ['overview','M1','Executive Dashboard – Tổng quan điều hành'],
    ['realtime','M2','Giám sát thời gian thực'],
    ['balance','M3','Bản đồ năng lượng & Energy Balance'],
    ['seu','M4','SEU & EnPI'],
    ['targets','M5','Mục tiêu & Hành động'],
    ['alerts','M6','Phân tích & Cảnh báo'],
    ['savings','M7','Tiết kiệm năng lượng & M&V'],
    ['emissions','M8','Phát thải CO₂ & ESG'],
    ['reports','M9','Báo cáo & Dashboard quản trị'],
    ['data','M10','Quản lý dữ liệu & Hệ thống'],
    ['forecast','M11','Dự báo & Kế hoạch năng lượng'],
    ['optimization','M12','Tối ưu hóa & Hỗ trợ ra quyết định'],
    ['iso50001','M13','ISO 50001 & Kiểm toán năng lượng'],
    ['analytics','M14','AI Analytics & Predictive Intelligence'],
    ['digital-twin','M15','Energy Digital Twin'],
    ['ai-decision','M16','AI Optimization & Decision Intelligence'],
    ['autonomous','M17','Autonomous Energy Management']
  ]);

  function createStore() {
    const stations = names.map((name,i) => ({id: String(i+1),name,power:power[i],capacity:Math.ceil(power[i]*1.35),energy:Math.round(8524630*power[i]/power.reduce((a,b)=>a+b,0)),meters:counts[i],status:'Hoạt động',group:i<8?'Trung tâm':i<11?'Khoảng cách TB':'Khu vực xa',distance:i<8?'≤500m':i<11?'≤800m':'900–1500m',x:positions[i][0],y:positions[i][1],color:palette[i%8],enpi:+(5.06-i*.13).toFixed(2)}));
    const meters = stations.flatMap(s=>Array.from({length:s.meters},(_,j)=>({id:`MT-${String(stations.slice(0,+s.id-1).reduce((n,x)=>n+x.meters,0)+j+1).padStart(3,'0')}`,stationId:s.id,name:j<2?`Máy biến áp T${j+1}`:`Tủ 6kV · Ngăn lộ ${j-1}`,station:s.name,power:+(s.power/s.meters).toFixed(2),voltage:6,pf:.97,status:'Hoạt động'})));
    meters[25].status='Lỗi'; meters[40].status='Lỗi';

    const messages=['Suất tiêu hao điện năng vượt ngưỡng','Công suất vượt 90%','Mất truyền thông','Suất tiêu hao tăng bất thường','Mất kết nối gateway','Dòng điện cao bất thường','Tiêu thụ điện tăng 20%','Nhiệt độ nước làm mát cao','Hệ số công suất thấp','Dữ liệu bất thường'];
    const alerts=Array.from({length:27},(_,i)=>({id:String(i+1),time:`2025-06-${String(10-Math.floor(i/5)).padStart(2,'0')}T${String(10-i%5).padStart(2,'0')}:${String(22-i%20).padStart(2,'0')}:14`,stationId: String(i===0?9:i%16+1),station:names[i===0?8:i%16],device:i===0?'Động cơ quạt ID':`Điểm đo MT-${String(i+1).padStart(3,'0')}`,message:messages[i%10],value:i===0?'125 kWh/tấn':i%3===0?'320 A':'78.5 MW',threshold:i===0?'100 kWh/tấn':i%3===0?'250 A':'75 MW',severity:i<3?'critical':i<10?'warning':i<15?'minor':'info',status:i%4===0?'Đang xử lý':i%4===1?'Chưa xử lý':i%4===2?'Đã xác nhận':'Đã khôi phục',assignee:'Đội vận hành',note:''}));

    const reports=Array.from({length:4},(_,i)=>({id:String(i+1),name:['Báo cáo tổng hợp tháng 06/2025','Báo cáo EnPI','Báo cáo phát thải CO₂','Báo cáo so sánh năng lượng'][i],type:['Tổng hợp','EnPI','Phát thải','So sánh'][i],from:'2025-06-01',to:'2025-06-10',createdAt:'2025-06-10T09:15:00',creator:'Nguyễn Văn A',status:'Hoàn thành'}));

    const summary={energy:8524630,power:62.3,capacity:78.5,clinker:12450,enpi:684,co2:652,cost:1245600,meters:71,stations:16,gateways:3,healthyMeters:69,target:700,targetProgress:62,updatedAt:'2025-06-10T10:24:00',series:Array.from({length:25},(_,i)=>+(49+Math.sin(i/3)*7+i*.55).toFixed(1))};

    const monthCats = ['T1','T2','T3','T4','T5','T6','T7','T8','T9','T10','T11','T12'];
    const dayCats = ['01/06','02/06','03/06','04/06','05/06','06/06','07/06','08/06','09/06','10/06'];
    const hourly = Array.from({length:24},(_,i)=>`${String(i).padStart(2,'0')}:00`);
    const wave = (base,amp,len=12,step=0) => Array.from({length:len},(_,i)=>+(base+Math.sin(i/1.7)*amp+i*step).toFixed(2));

    function kpi(label,value,unit,icon,tone='blue',delta='↓ 2.5%',context='so với kỳ trước') {
      return {label,value:String(value),unit,icon,tone,delta,context};
    }

    function moduleData(id) {
      const meta = moduleDefinitions.find(item=>item[0]===id);
      if (!meta) fail(404,'Không tìm thấy module EnMS');
      const base = {id,code:meta[1],title:meta[2],updatedAt:'2025-06-10T10:24:56'};
      const common = [
        kpi('Tổng tiêu thụ điện năng','8,524,630','kWh','lightning-charge-fill'),
        kpi('Sản lượng clinker','12,450','tấn','building','green','↑ 1.8%','so với hôm qua'),
        kpi('Chỉ số EnPI','684','kWh/tấn','graph-up','green'),
        kpi('Chi phí năng lượng','1,245.6','triệu VNĐ','coin','orange','↓ 2.1%'),
        kpi('Phát thải CO₂','652','tCO₂','cloud','purple','↓ 3.1%')
      ];
      const data = { ...base, kpis: common, primary:{}, secondary:{}, table:{headers:[],rows:[]}, insights:[] };

      if(id==='overview') {
        data.kpis=[common[0],common[1],common[2],kpi('Tổng điểm đo','71','điểm','speedometer2','cyan','69 hoạt động',' · 2 lỗi'),kpi('Tỷ lệ hoàn thành mục tiêu','96','%','bullseye','green','↑ 4%')];
        data.primary={kind:'line',title:'Xu hướng tiêu thụ và EnPI',categories:dayCats,series:[{name:'Điện năng (MWh)',data:wave(820,60,10,8)},{name:'EnPI quy đổi',data:wave(650,24,10,-1)}]};
        data.secondary={kind:'donut',title:'Cơ cấu tiêu thụ theo khu vực',labels:['Nghiền liệu','Đuôi lò','Nghiền xi','Đầu lò','Phụ trợ'],values:[27,21,19,17,16]};
        data.table={title:'KPI điều hành theo khu vực',headers:['Khu vực','Điện năng','EnPI','So với mục tiêu','Trạng thái'],rows:[['Nghiền liệu 1&2','1,820,450 kWh','702','-1.8%','Theo dõi'],['Đuôi lò 1&2','1,125,320 kWh','668','+2.4%','Tốt'],['Nghiền xi 1','742,560 kWh','655','+3.1%','Tốt'],['Đầu lò 1','965,780 kWh','691','-0.8%','Theo dõi']]};
        data.insights=[{title:'Mục tiêu năm 2025',value:'Giảm 3%',note:'Đã hoàn thành 62% lộ trình',status:'good',icon:'bullseye'},{title:'Cơ hội tiết kiệm',value:'342,000 kWh/năm',note:'6 cơ hội đang theo dõi',status:'good',icon:'lightbulb'},{title:'Cảnh báo cần xử lý',value:'3',note:'2 cảnh báo hiệu suất · 1 truyền thông',status:'warn',icon:'exclamation-triangle'}];
      } else if(id==='realtime') {
        data.kpis=[kpi('Công suất tức thời','62.3','MW','activity'),common[0],common[1],common[2],kpi('Điểm đo online','69/71','','broadcast','green','97.2%','kết nối')];
        data.primary={kind:'line',title:'Phụ tải thời gian thực',categories:hourly,series:[{name:'Công suất thực tế',data:wave(54,7,24,.15)},{name:'Công suất đặt',data:Array(24).fill(78.5)}]};
        data.secondary={kind:'bar',title:'Công suất theo khu vực',categories:names.slice(0,8),series:[{name:'MW',data:power.slice(0,8)}]};
        data.table={title:'Trạng thái điểm đo nổi bật',headers:['Điểm đo','Khu vực','P','Cosφ','Kết nối','Cập nhật'],rows:[['MT-001','Trạm biến áp tổng','4.85 MW','0.92','Online','10:24:55'],['MT-017','Đầu lò 2','5.80 MW','0.95','Online','10:24:54'],['MT-042','Nghiền xi 2','6.70 MW','0.91','Chập chờn','10:24:51'],['MT-061','Kho rác kín','2.90 MW','0.88','Online','10:24:55']]};
        data.insights=[{title:'Tần suất lấy mẫu',value:'5 giây',note:'Realtime gateway',status:'good',icon:'clock'},{title:'Cảnh báo mới',value:'3',note:'Trong 60 phút gần nhất',status:'warn',icon:'bell'},{title:'Độ trễ trung bình',value:'1.2 giây',note:'Gateway → Web',status:'good',icon:'wifi'}];
      } else if(id==='balance') {
        data.kpis=[kpi('Năng lượng đầu vào','8.72','GWh','box-arrow-in-right'),kpi('Năng lượng hữu ích','8.35','GWh','check2-circle','green','95.8%','hiệu suất cân bằng'),kpi('Chênh lệch cân đối','0.37','GWh','exclamation-diamond','orange','4.2%','cần đối soát'),kpi('Tổn thất kỹ thuật','235','MWh','fire','orange','↓ 1.2%'),kpi('Điểm cân bằng','16','khu vực','diagram-3','cyan','100%','đã khai báo')];
        data.primary={kind:'flow',title:'Luồng cân đối năng lượng',nodes:[['Lưới điện 110kV','8.72 GWh'],['Trạm biến áp tổng','8.61 GWh'],['Sản xuất clinker','5.42 GWh'],['Sản xuất xi măng','2.11 GWh'],['Phụ trợ','0.82 GWh'],['Tổn thất','0.26 GWh']]};
        data.secondary={kind:'twin',title:'Bản đồ năng lượng theo khu vực',assets:[['Nghiền liệu',17.3,99.2,'%'],['Lò nung',47.1,99.5,'%'],['Nghiền xi',24.0,98.9,'%'],['Đóng bao',6.6,99.0,'%'],['Phụ trợ',5.0,98.7,'%']]};
        data.table={title:'Đối soát cân bằng theo khu vực',headers:['Khu vực','Đầu vào','Đo đếm đầu ra','Chênh lệch','Tỷ lệ','Đánh giá'],rows:[['Trạm biến áp tổng','8.72 GWh','8.61 GWh','0.11 GWh','1.3%','Tốt'],['Nghiền liệu 1&2','1.52 GWh','1.47 GWh','0.05 GWh','3.3%','Theo dõi'],['Đuôi lò 1&2','1.28 GWh','1.22 GWh','0.06 GWh','4.7%','Cảnh báo'],['Nghiền xi 1','0.91 GWh','0.89 GWh','0.02 GWh','2.2%','Tốt']]};
        data.insights=[{title:'Sai số đo đếm',value:'1.8%',note:'Trong giới hạn cho phép',status:'good',icon:'check-circle'},{title:'Điểm cần kiểm tra',value:'2 khu vực',note:'Đuôi lò 1&2 · Phụ trợ',status:'warn',icon:'search'},{title:'Năng lượng chưa phân bổ',value:'145 MWh',note:'1.7% tổng đầu vào',status:'warn',icon:'question-circle'}];
      } else if(id==='seu') {
        data.kpis=[common[0],common[1],common[2],common[3],common[4]];
        data.primary={kind:'bar',title:'Top SEU theo mức tiêu thụ',categories:['Trạm biến áp tổng','Nghiền xi 1','Nghiền liệu 1&2','Đuôi lò 1&2','Đầu lò 1'],series:[{name:'kWh',data:[1245600,1230540,982450,765230,680450]}]};
        data.secondary={kind:'line',title:'Xu hướng EnPI',categories:dayCats,series:[{name:'EnPI',data:wave(4.8,.28,10,-.02)},{name:'Mục tiêu',data:Array(10).fill(4.65)}]};
        data.table={title:'SEU trọng yếu',headers:['SEU','Tiêu thụ','Sản lượng','EnPI','Cải thiện'],rows:[['Nghiền xi 1','1,230,540 kWh','250,000 t','4.92','↓ 2.3%'],['Nghiền liệu 1&2','982,450 kWh','240,000 t','4.10','↓ 2.1%'],['Đuôi lò 1&2','765,230 kWh','220,000 t','3.48','↓ 2.6%'],['Đầu lò 1','680,450 kWh','210,000 t','3.24','↓ 1.9%']]};
        data.insights=[{title:'SEU đạt mục tiêu',value:'6/8',note:'75% SEU trong ngưỡng',status:'good',icon:'check2-circle'},{title:'SEU cần hành động',value:'2',note:'Nghiền xi 1 · Đầu lò 1',status:'warn',icon:'exclamation-triangle'},{title:'Tiềm năng tiết kiệm',value:'342 MWh/năm',note:'Từ 6 cơ hội cải tiến',status:'good',icon:'leaf'}];
      } else if(id==='targets') {
        data.kpis=[kpi('Mục tiêu năng lượng','-3.0','%','bullseye','blue','62%','tiến độ'),kpi('Mục tiêu EnPI','650','kWh/tấn','speedometer','green','684 hiện tại','cần giảm 5%'),kpi('Kế hoạch hành động','12','hạng mục','list-check','purple','8 đúng hạn',' · 4 đang làm'),kpi('Tiết kiệm kỳ vọng','3760','MWh/năm','leaf','green','↑ 9.2%','so với kế hoạch'),kpi('Cảnh báo trễ hạn','1','hạng mục','alarm','orange','↓ 2','so với tháng trước')];
        data.primary={kind:'goal',title:'Tiến độ mục tiêu năng lượng',items:[['Giảm điện năng / tấn clinker',62,3.0],['Giảm EnPI nghiền xi',74,4.5],['Giảm giờ chạy không tải',81,12],['Tăng Cosφ trung bình',93,0.96]]};
        data.secondary={kind:'bar',title:'Tiết kiệm kế hoạch theo tháng',categories:monthCats,series:[{name:'Kế hoạch (MWh)',data:[210,250,260,280,300,320,340,360,370,390,410,430]},{name:'Thực hiện (MWh)',data:[205,240,258,275,295,315]}]};
        data.table={title:'Kế hoạch hành động',headers:['Hành động','Khu vực','Phụ trách','Hạn','Tiến độ','Trạng thái'],rows:[['Tối ưu vận hành quạt ID','Đầu lò 2','Vận hành','30/06/2025','75%','Đang thực hiện'],['Giảm chạy không tải máy nghiền','Nghiền xi 1','Sản xuất','20/06/2025','90%','Đúng hạn'],['Bù công suất phản kháng','Trạm biến áp tổng','Điện','15/07/2025','45%','Đang thực hiện'],['Kiểm soát rò rỉ khí nén','Phụ trợ','Cơ điện','12/06/2025','30%','Trễ hạn']]};
        data.insights=[{title:'Hoàn thành mục tiêu',value:'62%',note:'Đang bám kế hoạch năm',status:'good',icon:'bullseye'},{title:'Hành động đúng hạn',value:'8/12',note:'3 đang thực hiện · 1 trễ',status:'warn',icon:'list-check'},{title:'Lợi ích ước tính',value:'4.05 tỷ VNĐ/năm',note:'Theo giá điện hiện tại',status:'good',icon:'cash-stack'}];
      } else if(id==='alerts') {
        data.kpis=[kpi('Cảnh báo nghiêm trọng','3','','exclamation-triangle-fill','red','↑ 1','so với 7 ngày trước'),kpi('Cảnh báo','7','','lightning-fill','orange','↑ 2'),kpi('Cảnh báo nhẹ','5','','exclamation-circle','yellow','↓ 1'),kpi('Sự kiện thông tin','12','','info-circle','cyan','↓ 4'),kpi('Tỷ lệ đã xử lý','85','%','check-circle','green','↑ 6%')];
        data.primary={kind:'line',title:'Xu hướng cảnh báo 30 ngày',categories:Array.from({length:15},(_,i)=>`${i+1}/06`),series:[{name:'Nghiêm trọng',data:wave(2,.8,15,0)},{name:'Cảnh báo',data:wave(5,1.8,15,.04)}]};
        data.secondary={kind:'donut',title:'Phân bố theo nguyên nhân',labels:['Hiệu suất','Quá tải','Truyền thông','Chất lượng điện','Khác'],values:[31,24,19,16,10]};
        data.table={title:'Top cảnh báo cần ưu tiên',headers:['Thời gian','Khu vực','Nội dung','Mức độ','Trạng thái'],rows:alerts.slice(0,5).map(a=>[a.time.slice(5,16).replace('T',' '),a.station,a.message,a.severity==='critical'?'Nghiêm trọng':'Cảnh báo',a.status])};
        data.insights=[{title:'Nguyên nhân chính',value:'Hiệu suất 31%',note:'Tập trung quạt ID và nghiền xi',status:'warn',icon:'activity'},{title:'MTTR trung bình',value:'2.6 giờ',note:'Giảm 14% so với tháng trước',status:'good',icon:'clock-history'},{title:'Lặp lại nhiều nhất',value:'Mất truyền thông',note:'Gateway 3 · 4 lần/7 ngày',status:'warn',icon:'wifi-off'}];
      } else if(id==='savings') {
        data.kpis=[kpi('Tiềm năng tiết kiệm','3,760','MWh/năm','leaf','green','↑ 8.2%'),kpi('Giá trị tiết kiệm','7.8','tỷ VNĐ/năm','cash-stack','green','↑ 9.1%'),kpi('Đã xác minh M&V','2,950','MWh','patch-check','blue','78%','kế hoạch'),kpi('Dự án đang triển khai','5/8','','tools','orange','3 dự án','đã hoàn thành'),kpi('Giảm CO₂ tương ứng','1.8','ktCO₂/năm','cloud','purple','↓ 6.3%')];
        data.primary={kind:'bar',title:'Baseline vs. tiêu thụ sau cải tiến',categories:monthCats,series:[{name:'Baseline (MWh)',data:wave(780,45,12,4)},{name:'Sau cải tiến (MWh)',data:wave(690,35,12,1)}]};
        data.secondary={kind:'donut',title:'Tiềm năng theo nhóm giải pháp',labels:['Động cơ & VSD','Quạt & bơm','Khí nén','Vận hành','Chiếu sáng'],values:[34,27,16,15,8]};
        data.table={title:'Danh mục dự án tiết kiệm & M&V',headers:['Dự án','Khu vực','Đầu tư','Tiết kiệm','Hoàn vốn','M&V'],rows:[['Lắp VSD quạt ID','Đầu lò 2','1.8 tỷ','820 MWh/năm','2.1 năm','Đã xác minh'],['Tối ưu máy nghiền','Nghiền xi 1','0.9 tỷ','610 MWh/năm','1.6 năm','Đang đo'],['Giảm rò rỉ khí nén','Phụ trợ','0.3 tỷ','280 MWh/năm','1.1 năm','Đã xác minh'],['Bù Cosφ tự động','Trạm biến áp tổng','0.6 tỷ','190 MWh/năm','2.4 năm','Kế hoạch']]};
        data.insights=[{title:'Dự án hiệu quả nhất',value:'VSD quạt ID',note:'820 MWh/năm · ROI 47%',status:'good',icon:'award'},{title:'Sai lệch M&V',value:'2.1%',note:'Trong giới hạn IPMVP',status:'good',icon:'clipboard-check'},{title:'Cơ hội mới',value:'6',note:'342 MWh/năm đang đánh giá',status:'good',icon:'lightbulb'}];
      } else if(id==='emissions') {
        data.kpis=[kpi('Phát thải CO₂ năng lượng','652','tCO₂','cloud','purple','↓ 3.1%'),kpi('Cường độ phát thải','52.4','kgCO₂/tấn','speedometer2','green','↓ 2.8%'),kpi('Điện tái tạo quy đổi','12.3','%','sun','orange','↑ 2.8%'),kpi('CO₂ tránh phát thải','18.5','ktCO₂/năm','recycle','green','↑ 5.2%'),kpi('Mức hoàn thành ESG','88','%','globe2','blue','↑ 4%')];
        data.primary={kind:'area',title:'Xu hướng phát thải và mục tiêu',categories:monthCats,series:[{name:'Phát thải thực tế (tCO₂)',data:wave(710,48,12,-4)},{name:'Mục tiêu',data:Array.from({length:12},(_,i)=>700-i*7)}]};
        data.secondary={kind:'donut',title:'Cơ cấu phát thải liên quan năng lượng',labels:['Điện lưới','Nhiên liệu lò','Dầu DO','Vận tải','Khác'],values:[46,37,7,6,4]};
        data.table={title:'Theo dõi KPI ESG năng lượng',headers:['Chỉ tiêu','Hiện tại','Mục tiêu 2025','Xu hướng','Đánh giá'],rows:[['Cường độ CO₂','52.4 kg/tấn','50.0 kg/tấn','↓ 2.8%','Theo dõi'],['Tỷ lệ điện tái tạo','12.3%','15%','↑ 2.8%','Theo dõi'],['CO₂ tránh phát thải','18.5 kt/năm','17 kt/năm','↑ 5.2%','Tốt'],['Dữ liệu Scope 2','100%','100%','Ổn định','Đạt']]};
        data.insights=[{title:'Nguồn phát thải lớn nhất',value:'Điện lưới 46%',note:'Ưu tiên tối ưu phụ tải giờ cao điểm',status:'warn',icon:'lightning'},{title:'Giảm so với baseline',value:'3.1%',note:'Tương đương 21 tCO₂/ngày',status:'good',icon:'arrow-down-circle'},{title:'ESG data coverage',value:'100%',note:'Đủ dữ liệu Scope 2',status:'good',icon:'database-check'}];
      } else if(id==='reports') {
        data.kpis=[common[0],common[2],common[3],common[4],kpi('Báo cáo hoàn thành','12','báo cáo','file-earmark-check','green','100%','đúng hạn')];
        data.primary={kind:'line',title:'Xu hướng KPI kỳ báo cáo',categories:dayCats,series:[{name:'Điện năng',data:wave(850,70,10,5)},{name:'EnPI',data:wave(660,25,10,-1)}]};
        data.secondary={kind:'donut',title:'Cơ cấu báo cáo đã tạo',labels:['Tổng hợp','EnPI','Phát thải','So sánh','Tuân thủ'],values:[28,24,18,16,14]};
        data.table={title:'Báo cáo gần đây',headers:['Tên báo cáo','Loại','Khoảng thời gian','Người tạo','Trạng thái'],rows:reports.map(r=>[r.name,r.type,`${r.from} → ${r.to}`,r.creator,r.status])};
        data.insights=[{title:'Lịch tự động',value:'4 lịch',note:'Ngày · tuần · tháng · quý',status:'good',icon:'calendar-check'},{title:'Định dạng xuất',value:'Excel · PDF · Word',note:'Sẵn sàng xuất báo cáo',status:'good',icon:'download'},{title:'Báo cáo cần duyệt',value:'2',note:'Quản trị năng lượng · ESG',status:'warn',icon:'person-check'}];
      } else if(id==='data') {
        data.kpis=[kpi('Tổng điểm đo','71','','speedometer2'),kpi('Dữ liệu hôm nay','100','%','database-check','green','Đủ dữ liệu','thành công'),kpi('Dung lượng lưu trữ','245','GB / 1 TB','device-hdd','orange','25%','đã sử dụng'),kpi('Độ trễ thu thập','1.2','giây','clock-history','cyan','↓ 0.4s'),kpi('Nguồn dữ liệu','8','','hdd-network','purple','100%','đã cấu hình')];
        data.primary={kind:'line',title:'Chất lượng dữ liệu 24 giờ',categories:hourly,series:[{name:'Tỷ lệ nhận dữ liệu (%)',data:wave(99.4,.5,24,0)},{name:'Tỷ lệ hợp lệ (%)',data:wave(98.8,.7,24,0)}]};
        data.secondary={kind:'donut',title:'Nguồn dữ liệu',labels:['Modbus TCP','IEC 104','RS485','Import file','API'],values:[38,27,18,9,8]};
        data.table={title:'Trạng thái nguồn thu thập',headers:['Nguồn','Giao thức','Thiết bị','Chu kỳ','Độ trễ','Trạng thái'],rows:[['Gateway 1','Modbus TCP','26','5s','0.8s','Tốt'],['Gateway 2','RS485 / Ethernet','22','15s','1.1s','Tốt'],['Gateway 3','4G / IEC 104','23','5s','2.6s','Theo dõi'],['Import sản lượng','CSV / API','1','1h','—','Tốt']]};
        data.insights=[{title:'Dữ liệu lỗi',value:'0.8%',note:'Chủ yếu mất gói Gateway 3',status:'warn',icon:'exclamation-diamond'},{title:'Thời gian lưu',value:'3 năm',note:'Partition theo tháng',status:'good',icon:'archive'},{title:'Backup gần nhất',value:'02:00 hôm nay',note:'Thành công',status:'good',icon:'cloud-check'}];
      } else if(id==='forecast') {
        data.kpis=[kpi('Dự báo tháng','9.25','GWh','lightning-charge-fill'),kpi('Độ chính xác','94.1','%','check2-circle','green','↑ 1.6%'),kpi('Công suất đỉnh dự báo','12.6','MW','fire','orange','↓ 3.2%'),kpi('Ngân sách năng lượng','48.3','tỷ VNĐ','cash-stack','purple','98%','kế hoạch'),kpi('CO₂ dự báo','182.4','tCO₂','cloud','green','↓ 5.2%')];
        data.primary={kind:'line',title:'Thực tế & dự báo phụ tải',categories:Array.from({length:20},(_,i)=>`${i+1}/06`),series:[{name:'Thực tế',data:wave(8.7,.65,10,.03)},{name:'Dự báo',data:[null,null,null,null,null,null,null,null,null,9.2,9.1,9.35,9.6,9.55,9.8,10.05,9.9,10.1,10.3,10.2]}]};
        data.secondary={kind:'bar',title:'Kế hoạch năng lượng theo khu vực',categories:['Nghiền liệu','Đuôi lò','Nghiền xi','Đầu lò','Phụ trợ'],series:[{name:'Kế hoạch (MWh)',data:[1850,1460,1380,1190,830]},{name:'Dự báo (MWh)',data:[1780,1510,1325,1215,860]}]};
        data.table={title:'Kế hoạch năng lượng 4 tuần tới',headers:['Tuần','Kế hoạch','Dự báo','Chênh lệch','Chi phí dự báo','Trạng thái'],rows:[['W25','2.08 GWh','2.04 GWh','-1.9%','10.6 tỷ','Tốt'],['W26','2.12 GWh','2.18 GWh','+2.8%','11.3 tỷ','Theo dõi'],['W27','2.20 GWh','2.25 GWh','+2.3%','11.7 tỷ','Theo dõi'],['W28','2.15 GWh','2.11 GWh','-1.9%','10.9 tỷ','Tốt']]};
        data.insights=[{title:'Rủi ro vượt kế hoạch',value:'2.8%',note:'Tuần W26 · Nghiền liệu',status:'warn',icon:'exclamation-triangle'},{title:'Độ tin cậy dự báo',value:'94.1%',note:'Model ensemble v2.3',status:'good',icon:'cpu'},{title:'Cơ hội dịch chuyển tải',value:'320 MWh',note:'Sang khung giờ thấp điểm',status:'good',icon:'clock-history'}];
      } else if(id==='optimization') {
        data.kpis=[kpi('Tiết kiệm đề xuất','15.8','MWh/ngày','database-check','green','↑ 12.5%'),kpi('Giảm chi phí','18.2','triệu VNĐ/ngày','cash-stack','blue','↓ 4.2%'),kpi('CO₂ tránh phát thải','42.5','tCO₂/tháng','fire','orange','↑ 7.5%'),kpi('Cơ hội đang mở','28.6','GWh/năm','cloud','purple','↑ 3.1%'),kpi('Điểm tối ưu','12.5','MW','bar-chart','green','+2.8%','hiệu suất')];
        data.primary={kind:'matrix',title:'Ma trận ưu tiên quyết định',items:[['Tối ưu quạt ID',88,82,'Cao'],['Giảm giờ không tải nghiền xi',76,91,'Cao'],['Dịch chuyển tải bơm nước',58,71,'Trung bình'],['Bù Cosφ tự động',67,63,'Trung bình'],['Thay chiếu sáng LED',35,44,'Thấp']]};
        data.secondary={kind:'bar',title:'Tác động ước tính theo phương án',categories:['Quạt ID','Nghiền xi','Bơm nước','Bù Cosφ','Khí nén'],series:[{name:'Tiết kiệm MWh/tháng',data:[142,118,76,64,58]},{name:'Giảm chi phí tr.VNĐ',data:[165,139,82,73,68]}]};
        data.table={title:'Đề xuất hỗ trợ ra quyết định',headers:['Đề xuất','Lợi ích','Rủi ro','Đầu tư','Hoàn vốn','Ưu tiên'],rows:[['Tối ưu setpoint quạt ID','142 MWh/tháng','Thấp','120 tr','0.8 năm','1'],['Giảm chạy không tải nghiền xi','118 MWh/tháng','Thấp','60 tr','0.5 năm','2'],['Dịch chuyển tải bơm nước','76 MWh/tháng','Trung bình','20 tr','0.3 năm','3'],['Bù Cosφ tự động','64 MWh/tháng','Thấp','190 tr','2.1 năm','4']]};
        data.insights=[{title:'Phương án khuyến nghị',value:'Tối ưu quạt ID',note:'Điểm quyết định 88/100',status:'good',icon:'stars'},{title:'Lợi ích tức thời',value:'18.2 triệu/ngày',note:'Không ảnh hưởng sản lượng',status:'good',icon:'cash-coin'},{title:'Ràng buộc chính',value:'Nhiệt độ khí ra',note:'Giữ < 92°C',status:'warn',icon:'thermometer-half'}];
      } else if(id==='iso50001') {
        data.kpis=[kpi('Mức đáp ứng ISO 50001','100','%','patch-check','green','↑ 4%'),kpi('Điều khoản đã đánh giá','268','','clipboard-check','blue','100%','đã rà soát'),kpi('Phát hiện mở','4','','exclamation-triangle','orange','↓ 3','so với kỳ trước'),kpi('Hành động khắc phục','18/20','','tools','green','90%','hoàn thành'),kpi('Ngày audit tiếp theo','08/2026','','calendar-event','purple','Sẵn sàng','đánh giá')];
        data.primary={kind:'score',title:'Mức độ đáp ứng theo nhóm điều khoản',items:[['Bối cảnh tổ chức',100],['Lãnh đạo',96],['Hoạch định',92],['Hỗ trợ',98],['Vận hành',94],['Đánh giá kết quả',91],['Cải tiến',95]]};
        data.secondary={kind:'bar',title:'Phát hiện kiểm toán theo kỳ',categories:['Q3/2024','Q4/2024','Q1/2025','Q2/2025'],series:[{name:'Major',data:[1,0,0,0]},{name:'Minor',data:[8,6,5,4]},{name:'OFI',data:[12,10,9,7]}]};
        data.table={title:'Theo dõi phát hiện & hành động khắc phục',headers:['Mã','Điều khoản','Phát hiện','Chủ trì','Hạn','Trạng thái'],rows:[['NC-2025-04','6.6','Chưa cập nhật baseline SEU nghiền xi','QLNL','20/06/2025','Đang xử lý'],['OFI-2025-07','8.1','Bổ sung tiêu chí vận hành quạt ID','Sản xuất','30/06/2025','Đang xử lý'],['OFI-2025-08','9.1','Chuẩn hóa dashboard EnPI','CNTT','15/07/2025','Kế hoạch'],['NC-2025-02','7.5','Thiếu hồ sơ hiệu chuẩn','Đo lường','05/06/2025','Đã đóng']]};
        data.insights=[{title:'Audit readiness',value:'94%',note:'Còn 4 phát hiện mở',status:'good',icon:'shield-check'},{title:'Tài liệu cần cập nhật',value:'3',note:'EnPI · baseline · calibration',status:'warn',icon:'file-earmark-text'},{title:'Bằng chứng số hóa',value:'86%',note:'Tăng 12% so với audit trước',status:'good',icon:'folder-check'}];
      } else if(id==='analytics') {
        data.kpis=[kpi('Điện năng dự báo','98.5','GWh','lightning-charge-fill'),kpi('Bất thường phát hiện','186','sự kiện','activity','blue','↓ 4.2%'),kpi('Rủi ro cao','52.3','nghìn USD','fire','orange','↓ 7.5%'),kpi('Giá trị dự báo','165.4','tỷ VNĐ','cash-stack','purple','↓ 1.8%'),kpi('Độ chính xác model','94.2','%','cpu','green','↑ 4.3%')];
        data.primary={kind:'line',title:'AI phát hiện bất thường & dự báo',categories:Array.from({length:30},(_,i)=>`${i+1}/06`),series:[{name:'Giá trị thực',data:wave(65,9,30,.12)},{name:'Dự báo AI',data:wave(64,7.5,30,.14)},{name:'Ngưỡng bất thường',data:Array(30).fill(78)}]};
        data.secondary={kind:'donut',title:'Phân loại bất thường',labels:['Hiệu suất','Quá tải','Rung/Nhiệt','Dữ liệu','Truyền thông'],values:[32,24,18,14,12]};
        data.table={title:'Predictive intelligence – tài sản ưu tiên',headers:['Tài sản','Rủi ro','Xác suất','ETA','Tác động','Khuyến nghị'],rows:[['Quạt ID-02','Cao','86%','7–10 ngày','142 MWh/tháng','Kiểm tra ổ bi'],['Máy nghiền XM1','Trung bình','68%','14–21 ngày','118 MWh/tháng','Theo dõi rung'],['MBA T1','Trung bình','61%','30 ngày','Gián đoạn 2h','Kiểm tra nhiệt'],['Gateway 3','Thấp','42%','—','Mất 8% dữ liệu','Tối ưu 4G']]};
        data.insights=[{title:'Model tốt nhất',value:'Ensemble v2.3',note:'MAPE 5.8%',status:'good',icon:'cpu'},{title:'Anomaly cần xác minh',value:'7',note:'3 mức ưu tiên cao',status:'warn',icon:'exclamation-octagon'},{title:'Giá trị tránh rủi ro',value:'52.3k USD',note:'Ước tính 30 ngày',status:'good',icon:'shield-check'}];
      } else if(id==='digital-twin') {
        data.kpis=[kpi('Digital Twin coverage','93.5','%','boxes','blue','↑ 4.2%'),kpi('Tài sản đồng bộ','186','thiết bị','hdd-network','green','100%','online'),kpi('Sai lệch mô hình','4.8','%','activity','orange','↓ 7.5%'),kpi('Kịch bản mô phỏng','165.4','GWh/năm','sliders','purple','12','đã lưu'),kpi('Độ chính xác','94.2','%','check2-circle','green','↑ 4.3%')];
        data.primary={kind:'twin',title:'Mô hình số năng lượng nhà máy',assets:[['Trạm BA tổng',12.5,95],['Nghiền liệu',8.7,89],['Đuôi lò',6.8,92],['Nghiền xi',6.1,87],['Đóng bao',3.2,96],['Cảng',4.8,91]]};
        data.secondary={kind:'bar',title:'Thực tế vs. mô hình',categories:['TBA tổng','Nghiền liệu','Đuôi lò','Nghiền xi','Đóng bao'],series:[{name:'Thực tế MW',data:[12.5,8.7,6.8,6.1,3.2]},{name:'Digital Twin MW',data:[12.2,8.5,7.0,5.9,3.3]}]};
        data.table={title:'Tài sản Digital Twin',headers:['Tài sản','Tag dữ liệu','Sync','Sai lệch','Model','Trạng thái'],rows:[['Trạm biến áp tổng','26','5s','2.4%','Electrical v3','Đồng bộ'],['Nghiền liệu 1&2','18','5s','3.1%','Process v2','Đồng bộ'],['Đuôi lò 1&2','16','5s','4.8%','Thermal v2','Theo dõi'],['Nghiền xi 1','14','5s','3.6%','Grinding v4','Đồng bộ']]};
        data.insights=[{title:'Kịch bản tối ưu',value:'-4.6% năng lượng',note:'Không giảm sản lượng',status:'good',icon:'stars'},{title:'Sai lệch lớn nhất',value:'Đuôi lò 4.8%',note:'Cần hiệu chỉnh thermal model',status:'warn',icon:'exclamation-diamond'},{title:'Tốc độ đồng bộ',value:'5 giây',note:'186 tài sản online',status:'good',icon:'arrow-repeat'}];
      } else if(id==='ai-decision') {
        data.kpis=[kpi('AI savings identified','15.8','MWh/ngày','database-check','green','↑ 12.5%'),kpi('AI cost reduction','18.2','triệu VNĐ/ngày','lightning-charge','blue','↓ 4.2%'),kpi('CO₂ avoided','42.5','tCO₂/tháng','fire','orange','↑ 7.5%'),kpi('Decision value','28.6','tỷ VNĐ/năm','cloud','purple','↑ 3.1%'),kpi('Decision confidence','92.5','%','bar-chart','green','↑ 2.8%')];
        data.primary={kind:'matrix',title:'AI Decision Map – tác động & độ tin cậy',items:[['Quạt ID setpoint',92,94,'Tự động đề xuất'],['Nghiền xi feed rate',84,91,'Đề xuất'],['Lịch chạy bơm',72,88,'Đề xuất'],['Bù Cosφ',64,96,'Tự động'],['Tối ưu khí nén',78,83,'Đề xuất']]};
        data.secondary={kind:'bar',title:'Giá trị quyết định AI',categories:['Tiết kiệm NL','Chi phí','CO₂','Sản lượng','Độ ổn định'],series:[{name:'Tác động quy đổi',data:[88,82,76,65,91]}]};
        data.table={title:'Quyết định AI đang chờ phê duyệt',headers:['Quyết định','Confidence','Tác động','Ràng buộc','Chế độ','Trạng thái'],rows:[['Giảm setpoint quạt ID 3%','94%','-142 MWh/tháng','T khí < 92°C','Human-in-loop','Chờ duyệt'],['Dịch lịch bơm nước 22:00','91%','-76 MWh/tháng','Mức bể > 65%','Human-in-loop','Chờ duyệt'],['Bù Cosφ về 0.97','96%','-64 MWh/tháng','THD < 5%','Auto-safe','Sẵn sàng'],['Tăng feed nghiền xi 1.5%','88%','+1.2% sản lượng','Rung < ngưỡng','Human-in-loop','Theo dõi']]};
        data.insights=[{title:'Đề xuất tốt nhất',value:'Quạt ID -3%',note:'Confidence 94% · ROI cao',status:'good',icon:'stars'},{title:'Quyết định cần duyệt',value:'3',note:'Tổng lợi ích 11.6 tr/ngày',status:'warn',icon:'person-check'},{title:'Safety constraints',value:'12/12 đạt',note:'Không vi phạm ràng buộc vận hành',status:'good',icon:'shield-check'}];
      } else if(id==='autonomous') {
        data.kpis=[kpi('Mức tự động hóa','93.5','%','gear-wide-connected','blue','↑ 4.2%'),kpi('Hành động tự động','186','lệnh/ngày','robot','green','↑ 9.6%'),kpi('Sự kiện cần can thiệp','4.8','%','hand-index','orange','↓ 7.5%'),kpi('Giá trị tự tối ưu','165.4','MWh/tháng','cash-stack','purple','↑ 3.1%'),kpi('Safety compliance','94.2','%','shield-check','green','↑ 4.3%')];
        data.primary={kind:'flow',title:'Autonomous Energy Control Loop',nodes:[['Dữ liệu realtime','71 điểm đo'],['AI State Estimator','Confidence 94.2%'],['Optimizer','12 ràng buộc'],['Policy Engine','Human-in-loop'],['Thiết bị / Setpoint','186 actions'],['Feedback','5 giây']]};
        data.secondary={kind:'score',title:'Mức trưởng thành tự động hóa',items:[['Quan sát tự động',100],['Phân tích tự động',96],['Đề xuất quyết định',93],['Thực thi có phê duyệt',88],['Tự hành có giám sát',76],['Tự hành hoàn toàn',42]]};
        data.table={title:'Nhật ký hành động tự động',headers:['Thời gian','Policy','Thiết bị','Hành động','Lợi ích','Safety','Trạng thái'],rows:[['10:22:14','OPT-FAN-01','Quạt ID-02','Setpoint -1.5%','4.2 MWh/ngày','Pass','Đã thực thi'],['10:18:02','PF-AUTO-03','Tủ bù TBA','Cosφ → 0.97','1.1 MWh/ngày','Pass','Đã thực thi'],['09:55:41','LOAD-SHIFT-02','Bơm nước','Dời lịch +30 phút','2.8 MWh/ngày','Pass','Đã thực thi'],['09:41:10','GRIND-ADJ-01','Nghiền xi 1','Feed +1%','0.7% sản lượng','Review','Chờ duyệt']]};
        data.insights=[{title:'Autonomy level',value:'L4 – supervised',note:'Thực thi tự động trong policy cho phép',status:'good',icon:'robot'},{title:'Override thủ công',value:'2 lần/7 ngày',note:'Không có sự cố an toàn',status:'good',icon:'hand-index'},{title:'Policy cần rà soát',value:'1',note:'GRIND-ADJ-01 · rung tiệm cận ngưỡng',status:'warn',icon:'shield-exclamation'}];
      }
      return data;
    }

    function request(method, resource, params={}) {
      const [name,id] = resource.replace(/^\//,'').split('/');
      if(method==='GET') {
        if(name==='summary') return summary;
        if(name==='stations') return stations.filter(s=>(!params.search||s.name.toLocaleLowerCase('vi').includes(params.search.toLocaleLowerCase('vi')))&&(!params.stationId||s.id===params.stationId));
        if(name==='meters') return meters.filter(m=>(!params.stationId||m.stationId===params.stationId)&&(!params.search||`${m.id} ${m.name}`.toLowerCase().includes(params.search.toLowerCase())));
        if(name==='modules') return id ? moduleData(id) : moduleDefinitions.map(([id,code,title])=>({id,code,title}));
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
