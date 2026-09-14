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
        data.kpis=[
          kpi('Tổng tiêu thụ điện năng','8,524,630','kWh','lightning-charge-fill','blue','▼ 3.2%','so với tháng trước'),
          kpi('Tổng tiêu thụ nhiên liệu','12,450','tấn','fire','green','▼ 1.8%','so với tháng trước'),
          kpi('Tổng chi phí năng lượng','1,245,600','triệu VNĐ','coin','orange','▼ 2.1%','so với tháng trước'),
          kpi('Phát thải CO₂e (ước tính)','652','tCO₂e','cloud','purple','▼ 3.1%','so với tháng trước'),
          kpi('Chỉ số EnPI (Clinker)','684','kWh/tấn','gear','green','▼ 2.5%','so với tháng trước'),
          {...kpi('Tỷ lệ hoàn thành mục tiêu','96','%','bullseye','green','Đạt kế hoạch',''),progress:96}
        ];
        data.plant={
          name:'NHÀ MÁY XI MĂNG LAM THẠCH II',
          address:'Xã Lam Thạch, Huyện Như Thanh, Tỉnh Thanh Hóa',
          designCapacity:'2.3 triệu tấn/năm',
          mainProduct:'Clinker, Xi măng PCB40',
          stations:16,
          meters:71,
          energySources:'Điện, than, dầu, khí, hơi',
          operatingSince:'01/01/2024'
        };
        data.production={
          categories:['T1','T2','T3','T4','T5','T6'],
          metrics:{
            production:{label:'Sản lượng clinker (tấn)',series:[405000,382000,365000,348000,356000,428000]},
            enpi:{label:'EnPI (kWh/tấn)',series:[690,672,655,598,606,684]},
            cost:{label:'Chi phí/Tấn (nghìn VNĐ)',series:[118,115,111,109,108,112]},
            emission:{label:'Phát thải/Tấn (kgCO₂e)',series:[54,53,51,49,48,50]}
          }
        };
        data.energyMix={
          energy:{labels:['Điện','Than','Dầu/FO','Hơi (Steam)','Khác'],values:[42.3,38.5,6.2,8.1,4.9],total:'28,320',unit:'MWh (quy đổi)'},
          area:{labels:['Lò nung','Nghiền liệu','Nghiền xi','Đóng bao','Phụ trợ'],values:[46.2,18.6,17.8,8.4,9.0],total:'28,320',unit:'MWh (quy đổi)'}
        };
        data.energyTrend={
          categories:Array.from({length:30},(_,i)=>`${String(i+1).padStart(2,'0')}/06`),
          metrics:{
            electricity:{label:'Điện',unit:'MWh',current:wave(38500,6200,30,55),previous:wave(35600,5100,30,25)},
            coal:{label:'Than',unit:'tấn',current:wave(1210,145,30,2),previous:wave(1260,125,30,1)},
            steam:{label:'Hơi',unit:'tấn',current:wave(720,82,30,1.5),previous:wave(760,74,30,1)},
            heat:{label:'Nhiệt',unit:'GJ',current:wave(1680,190,30,2),previous:wave(1740,175,30,1)},
            total:{label:'Tổng quy đổi',unit:'MWh',current:wave(47200,6900,30,70),previous:wave(45100,5900,30,42)}
          }
        };
        data.efficiency=[
          {name:'Nghiền liệu 1',enpi:742,ratio:42,delta:-2.3},
          {name:'Nghiền liệu 2',enpi:658,ratio:42,delta:-1.6},
          {name:'Lò nung 1',enpi:1125,ratio:88,delta:0.8,bad:true},
          {name:'Nghiền xi',enpi:854,ratio:61,delta:-4.2},
          {name:'Đóng bao',enpi:410,ratio:28,delta:-3.9},
          {name:'Phụ trợ',enpi:320,ratio:21,delta:-2.1}
        ];
        data.alertHighlights=[
          {time:'10/06 08:45',area:'Lò nung',message:'Nhiệt độ khí thải cao bất thường',level:'Cao',status:'Chưa xử lý'},
          {time:'10/06 06:12',area:'Nghiền xi 1',message:'Công suất quạt ID giảm',level:'Trung bình',status:'Đang xử lý'},
          {time:'09/06 22:18',area:'Trạm biến áp 2',message:'Mất truyền thông',level:'Trung bình',status:'Đã khôi phục'}
        ];
        data.targets=[
          {name:'Giảm EnPI clinker',unit:'kWh/tấn',target:'720',actual:'684',progress:96},
          {name:'Giảm tiêu thụ điện',unit:'%',target:'-5%',actual:'-3.2%',progress:64},
          {name:'Giảm chi phí năng lượng',unit:'%',target:'-8%',actual:'-7.1%',progress:89},
          {name:'Giảm phát thải CO₂e',unit:'%',target:'-10%',actual:'-8.7%',progress:87}
        ];
        data.impacts=[
          {label:'Chi phí năng lượng',value:'750,240',unit:'triệu VNĐ',delta:'▼ 6.5%',tone:'orange',icon:'coin'},
          {label:'Chi phí năng lượng/tấn',value:'365,000',unit:'VNĐ/tấn',delta:'▼ 5.8%',tone:'green',icon:'gear'},
          {label:'Phát thải CO₂e',value:'412,650',unit:'tCO₂e',delta:'▼ 7.2%',tone:'purple',icon:'cloud'},
          {label:'Cây xanh tương đương',value:'68,780',unit:'cây/năm',delta:'',tone:'leaf',icon:'tree-fill'}
        ];
        data.primary={kind:'line',title:'Xu hướng tiêu thụ năng lượng',categories:data.energyTrend.categories,series:[{name:'Tháng 06/2025',data:data.energyTrend.metrics.electricity.current},{name:'Tháng 05/2025',data:data.energyTrend.metrics.electricity.previous}]};
        data.secondary={kind:'donut',title:'Cơ cấu tiêu thụ năng lượng',labels:data.energyMix.energy.labels,values:data.energyMix.energy.values};
        data.table={title:'Hiệu suất theo khu vực',headers:['Khu vực','EnPI','So với kỳ trước'],rows:data.efficiency.map(item=>[item.name,String(item.enpi),`${item.delta<0?'▼':'▲'} ${Math.abs(item.delta)}%`])};
        data.insights=[{title:'Mục tiêu năm 2025',value:'96%',note:'Tiến độ mục tiêu EnPI clinker',status:'good',icon:'bullseye'},{title:'Cảnh báo cần xử lý',value:'3',note:'1 mức cao · 2 mức trung bình',status:'warn',icon:'exclamation-triangle'},{title:'Phát thải lũy kế',value:'412,650 tCO₂e',note:'Giảm 7.2% so với cùng kỳ',status:'good',icon:'cloud'}];
      } else if(id==='realtime') {
        data.kpis=[
          kpi('Tổng công suất điện','78.5','MVA','lightning-charge-fill','blue','▲ 2.3%','so với hôm qua'),
          kpi('Tổng tiêu thụ nhiệt','1,245','GJ/h','fire','red','▲ 1.8%','so với hôm qua'),
          kpi('Tiêu thụ than','235','tấn/h','leaf','green','▼ 0.6%','so với hôm qua'),
          kpi('Tiêu thụ nước','320','m³/h','droplet-fill','cyan','▲ 1.2%','so với hôm qua'),
          kpi('Phát thải CO₂ (ước tính)','652','tCO₂/h','cloud','purple','▼ 3.1%','so với hôm qua'),
          kpi('Chi phí năng lượng','245','triệu VNĐ/h','coin','orange','▼ 2.5%','so với hôm qua')
        ];
        data.systemStatus={normal:69,warning:5,fault:2};
        data.flow={
          sources:[
            {kind:'electricity',label:'Điện lưới',value:'78.5 MVA'},
            {kind:'coal',label:'Than',value:'235 tấn/h'},
            {kind:'oil',label:'Dầu',value:'12.5 m³/h'},
            {kind:'steam',label:'Hơi',value:'145 t/h'},
            {kind:'water',label:'Nước',value:'320 m³/h'}
          ],
          processes:[
            {id:'raw',order:2,name:'Nghiền liệu',value:'12.5 MW',x:25,y:31,status:'normal'},
            {id:'kiln',order:3,name:'Lò nung',value:'28.4 MW',x:47,y:18,status:'warning'},
            {id:'cement',order:4,name:'Nghiền xi',value:'18.7 MW',x:67,y:29,status:'normal'},
            {id:'packing',order:5,name:'Đóng bao',value:'6.8 MW',x:84,y:26,status:'normal'}
          ],
          product:{name:'Clinker / Xi măng',value:'3,250 tấn/ngày'},
          utilities:[
            {kind:'electricity',icon:'building',label:'Trạm biến áp 110/6kV',value:''},
            {kind:'electricity',icon:'diagram-3',label:'Trạm phân phối 6kV',value:'(16 trạm)'},
            {kind:'heat',icon:'fire',label:'Hệ thống hơi',value:'145 t/h'},
            {kind:'air',icon:'wind',label:'Hệ thống khí nén',value:'32 m³/min'},
            {kind:'water',icon:'droplet-fill',label:'Hệ thống nước',value:'320 m³/h'}
          ].concat([{kind:'environment',icon:'tree-fill',label:'Trạm xử lý môi trường',value:'(ESP, Bagfilter, …)'}]),
          lines:[
            {kind:'electricity',points:'0,235 150,235 150,405 530,405 530,190'},
            {kind:'coal',points:'0,285 190,285 190,165 470,165'},
            {kind:'oil',points:'0,335 220,335 220,185 470,185'},
            {kind:'steam',points:'0,385 260,385 260,315 470,315'},
            {kind:'water',points:'0,435 310,435 310,365 755,365'},
            {kind:'renewable',points:'470,405 900,405 900,325'}
          ]
        };
        data.realtimeTrend={
          categories:hourly.concat(['24:00']),
          series:[
            {name:'Điện (MW)',data:[68,68,69,69,70,70,71,72,74,76,75,74,73,72,72,73,74,75,74,75,76,76,75,74,74]},
            {name:'Nhiệt (GJ/h)',data:[18,18,18,19,19,19,20,20,21,22,22,22,21,21,21,21,22,22,22,23,23,23,23,22,22]},
            {name:'Than (tấn/h)',data:[37,37,38,38,38,39,40,41,43,45,45,44,44,43,43,44,45,45,45,46,46,46,45,44,44]},
            {name:'Nước (m³/h)',data:[19,19,19,20,20,20,21,21,22,23,23,23,22,22,22,22,23,24,24,24,24,24,24,23,23]}
          ]
        };
        data.shiftProduction={
          categories:['Clinker\n(tấn)','Xi măng\n(tấn)','Điện tiêu thụ\n(MWh)','Than tiêu thụ\n(tấn)','Nhiệt tiêu thụ\n(GJ/h)'],
          today:{series:[{name:'Ca 1',data:[1050,980,520,230,2850]},{name:'Ca 2',data:[1120,1050,560,245,2950]},{name:'Ca 3',data:[1080,1020,540,238,2900]}]},
          yesterday:{series:[{name:'Ca 1',data:[1010,940,535,235,2890]},{name:'Ca 2',data:[1090,1020,575,250,2980]},{name:'Ca 3',data:[1060,995,548,241,2935]}]}
        };
        data.stations=[
          {id:'1',name:'MBA T1 - Lò 1',voltage:'110/6kV',capacity:25,p:12.48,q:3.21,pf:.97,status:'Hoạt động'},
          {id:'2',name:'MBA T2 - Lò 2',voltage:'110/6kV',capacity:25,p:12.52,q:3.18,pf:.97,status:'Hoạt động'},
          {id:'3',name:'Nghiền liệu 1',voltage:'6kV',capacity:8,p:6.35,q:1.85,pf:.96,status:'Hoạt động'},
          {id:'4',name:'Nghiền liệu 2',voltage:'6kV',capacity:8,p:6.12,q:1.78,pf:.96,status:'Hoạt động'},
          {id:'5',name:'Nghiền xi 1',voltage:'6kV',capacity:10,p:7.85,q:2.21,pf:.96,status:'Hoạt động'},
          {id:'6',name:'Nghiền xi 2',voltage:'6kV',capacity:10,p:7.42,q:2.10,pf:.95,status:'Hoạt động'},
          {id:'7',name:'Đóng bao 1',voltage:'6kV',capacity:4,p:3.20,q:.85,pf:.97,status:'Hoạt động'},
          {id:'8',name:'Đóng bao 2',voltage:'6kV',capacity:4,p:3.10,q:.82,pf:.97,status:'Hoạt động'},
          {id:'9',name:'Đầu lò 2',voltage:'6kV',capacity:8,p:5.80,q:1.60,pf:.95,status:'Cảnh báo'},
          {id:'10',name:'Kho rác kín',voltage:'380V',capacity:4,p:2.90,q:.66,pf:.94,status:'Hoạt động'},
          {id:'11',name:'Cảng',voltage:'380V',capacity:6,p:4.80,q:1.12,pf:.93,status:'Hoạt động'},
          {id:'12',name:'Phụ trợ',voltage:'380V',capacity:3,p:1.20,q:.31,pf:.96,status:'Hoạt động'},
          {id:'13',name:'Trạm bơm nước',voltage:'380V',capacity:3,p:1.50,q:.42,pf:.95,status:'Hoạt động'},
          {id:'14',name:'Nhà tuabin',voltage:'6kV',capacity:5,p:3.90,q:1.01,pf:.97,status:'Hoạt động'},
          {id:'15',name:'Tiền nghiền xi',voltage:'6kV',capacity:6,p:4.60,q:1.24,pf:.96,status:'Hoạt động'},
          {id:'16',name:'Dây chuyền đá 3',voltage:'6kV',capacity:5,p:3.60,q:.90,pf:.97,status:'Hoạt động'}
        ];
        data.parameters=[
          {group:'Hơi',name:'Lưu lượng hơi',value:'145',unit:'t/h',status:'Bình thường'},
          {group:'Hơi',name:'Áp suất hơi',value:'12.5',unit:'bar',status:'Bình thường'},
          {group:'Hơi',name:'Nhiệt độ hơi',value:'350',unit:'°C',status:'Bình thường'},
          {group:'Than',name:'Lưu lượng than',value:'235',unit:'tấn/h',status:'Bình thường'},
          {group:'Than',name:'Nhiệt trị (NCV)',value:'5,800',unit:'kcal/kg',status:'Bình thường'},
          {group:'Nước',name:'Lưu lượng nước',value:'320',unit:'m³/h',status:'Bình thường'},
          {group:'Nước',name:'Áp suất',value:'6.2',unit:'bar',status:'Bình thường'},
          {group:'Khí nén',name:'Lưu lượng khí nén',value:'32',unit:'m³/min',status:'Bình thường'},
          {group:'Khí nén',name:'Áp suất',value:'7.5',unit:'bar',status:'Bình thường'},
          {group:'Môi trường',name:'Nhiệt độ khí thải',value:'145',unit:'°C',status:'Bình thường'},
          {group:'Môi trường',name:'Nồng độ bụi',value:'18',unit:'mg/Nm³',status:'Bình thường'},
          {group:'Môi trường',name:'NOx',value:'320',unit:'mg/Nm³',status:'Bình thường'}
        ];
        data.realtimeAlerts=[
          {time:'10:22:14',area:'Lò 2',message:'Suất tiêu hao điện năng vượt ngưỡng',level:'Cao',status:'Đang xử lý',statusType:'processing',statusIcon:'clock'},
          {time:'10:18:05',area:'Nghiền liệu 2',message:'Dòng điện tăng bất thường',level:'Trung bình',status:'Đã xác nhận',statusType:'',statusIcon:'check-circle'},
          {time:'10:12:33',area:'Chiller 1',message:'Nhiệt độ nước làm mát cao',level:'Trung bình',status:'Đang xử lý',statusType:'processing',statusIcon:'clock'},
          {time:'09:58:41',area:'Trạm khí nén',message:'Áp suất giảm dưới 7 bar',level:'Cao',status:'Đã khắc phục',statusType:'',statusIcon:'check-circle'},
          {time:'09:45:12',area:'ESP',message:'Bụi khí thải tăng (28 mg/Nm³)',level:'Trung bình',status:'Đang xử lý',statusType:'open',statusIcon:'clock'}
        ];
        data.primary={kind:'line',title:'Biểu đồ công suất tổng theo thời gian thực',categories:data.realtimeTrend.categories,series:data.realtimeTrend.series};
        data.secondary={kind:'bar',title:'Sản lượng theo ca',categories:data.shiftProduction.categories,series:data.shiftProduction.today.series};
        data.table={title:'Danh sách trạm điện',headers:['Tên trạm','Điện áp','P','Q','Cosφ','Trạng thái'],rows:data.stations.slice(0,8).map(s=>[s.name,s.voltage,s.p,s.q,s.pf,s.status])};
        data.insights=[{title:'Tần suất lấy mẫu',value:'5 giây',note:'Realtime gateway',status:'good',icon:'clock'},{title:'Cảnh báo mới',value:'3',note:'Trong 60 phút gần nhất',status:'warn',icon:'bell'},{title:'Độ trễ trung bình',value:'1.2 giây',note:'Gateway → Web',status:'good',icon:'wifi'}];
      } else if(id==='balance') {
        data.kpis=[
          kpi('Điện','78.5','MVA','lightning-charge-fill','blue','▲ 2.3%','so với tháng trước'),
          kpi('Than','235','tấn/h','fire','red','▼ 1.8%','so với tháng trước'),
          kpi('Dầu','12.5','m³/h','droplet-fill','orange','▼ 0.5%','so với tháng trước'),
          kpi('Hơi','145','t/h','wind','slate','▼ 1.2%','so với tháng trước'),
          kpi('Nước','320','m³/h','droplet-half','blue','▼ 3.1%','so với tháng trước'),
          kpi('Phát thải CO₂ (ước tính)','652','tCO₂/h','cloud','purple','▼ 3.1%','so với tháng trước')
        ];
        data.energyBalance={
          period:'Tháng 06/2025',inputTotal:1245600,usefulTotal:1058400,lossTotal:187200,lossRate:15.0,
          inputs:[
            {kind:'electricity',label:'Điện',value:420500,share:33.7},
            {kind:'coal',label:'Than',value:620300,share:49.8},
            {kind:'oil',label:'Dầu',value:55200,share:4.4},
            {kind:'steam',label:'Hơi (mua/thu hồi)',value:120800,share:9.7},
            {kind:'water',label:'Nước (năng lượng bơm)',value:28800,share:2.3}
          ],
          processes:[
            {kind:'raw',label:'Nghiền liệu',value:215400,share:17.3},
            {kind:'kiln',label:'Lò nung',value:587200,share:47.1},
            {kind:'cement',label:'Nghiền xi',value:298600,share:24.0},
            {kind:'packing',label:'Đóng bao & phụ trợ',value:82100,share:6.6},
            {kind:'common',label:'Hệ thống chung',value:62300,share:5.0}
          ],
          usefulOutputs:[
            {kind:'raw',label:'Clinker',value:765200,share:61.4},
            {kind:'cement',label:'Xi măng thành phẩm',value:293200,share:23.5}
          ],
          losses:[
            {kind:'heat',label:'Tổn thất nhiệt (khói thải)',value:125600,share:10.1},
            {kind:'surface',label:'Tổn thất bề mặt, làm mát',value:32800,share:2.6},
            {kind:'other',label:'Tổn thất khác (rò rỉ, chờ...)',value:28800,share:2.3}
          ]
        };
        data.energyMap=[
          {id:'raw',name:'Nghiền liệu',share:17.3,x:22,y:20,targetX:32,targetY:37,tone:'blue',intensity:742,loss:8.6},
          {id:'kiln',name:'Lò nung',share:47.1,x:45,y:15,targetX:50,targetY:43,tone:'red',intensity:1125,loss:18.4},
          {id:'cement',name:'Nghiền xi',share:24.0,x:72,y:27,targetX:66,targetY:52,tone:'orange',intensity:854,loss:12.2},
          {id:'packing',name:'Đóng bao',share:6.6,x:86,y:57,targetX:73,targetY:66,tone:'purple',intensity:410,loss:7.8},
          {id:'aux',name:'Khu phụ trợ',share:5.0,x:58,y:84,targetX:53,targetY:68,tone:'slate',intensity:320,loss:9.4}
        ];
        data.efficiency=[
          {label:'Tỷ lệ năng lượng hữu ích',value:'85.0',unit:'%',delta:1.2,arrow:'↑',goodDirection:'up'},
          {label:'Tổn thất năng lượng',value:'15.0',unit:'%',delta:-1.3,arrow:'↓',goodDirection:'down'},
          {label:'SEC (Điện + nhiệt)',value:'98.6',unit:'kWh/t',delta:-2.5,arrow:'↓',goodDirection:'down'},
          {label:'Clinker factor',value:'0.82',unit:'',delta:0.0,arrow:'→',goodDirection:'neutral'}
        ];
        data.balanceTable={
          process:[
            {name:'Nghiền liệu',electricity:95200,coal:102400,oil:8500,steam:6300,water:3000,total:215400,share:17.3},
            {name:'Lò nung',electricity:120500,coal:410200,oil:32600,steam:18400,water:5500,total:587200,share:47.1},
            {name:'Nghiền xi',electricity:172300,coal:80400,oil:10100,steam:25600,water:10200,total:298600,share:24.0},
            {name:'Đóng bao & phụ trợ',electricity:25100,coal:12300,oil:3200,steam:36700,water:4800,total:82100,share:6.6},
            {name:'Hệ thống chung',electricity:7400,coal:15000,oil:800,steam:33800,water:5300,total:62300,share:5.0}
          ],
          totals:{electricity:420500,coal:620300,oil:55200,steam:120800,water:28800,total:1245600},
          energy:[
            {name:'Điện',input:420500,useful:386000,loss:34500,lossRate:8.2,note:'Tổn thất MBA, cáp và động cơ'},
            {name:'Than',input:620300,useful:506600,loss:113700,lossRate:18.3,note:'Tập trung tại lò nung'},
            {name:'Dầu',input:55200,useful:44000,loss:11200,lossRate:20.3,note:'Khởi động và phụ trợ nhiệt'},
            {name:'Hơi',input:120800,useful:96700,loss:24100,lossRate:20.0,note:'Thu hồi và phân phối hơi'},
            {name:'Nước',input:28800,useful:25100,loss:3700,lossRate:12.8,note:'Quy đổi năng lượng bơm'}
          ],
          unit:[
            {unit:'Nghiền liệu',input:215400,allocated:212100,unallocated:3300,balanceRate:98.5,status:'Đạt'},
            {unit:'Lò nung',input:587200,allocated:579900,unallocated:7300,balanceRate:98.8,status:'Đạt'},
            {unit:'Nghiền xi',input:298600,allocated:293400,unallocated:5200,balanceRate:98.3,status:'Đạt'},
            {unit:'Đóng bao & phụ trợ',input:82100,allocated:79600,unallocated:2500,balanceRate:97.0,status:'Theo dõi'},
            {unit:'Hệ thống chung',input:62300,allocated:60400,unallocated:1900,balanceRate:97.0,status:'Theo dõi'}
          ],
          compare:[
            {metric:'Tổng năng lượng đầu vào',current:'1,245,600 MWh',previous:'1,283,900 MWh',change:'▼ 3.0%',good:true,status:'Cải thiện'},
            {metric:'Tỷ lệ năng lượng hữu ích',current:'85.0%',previous:'83.8%',change:'▲ 1.2%',good:true,status:'Cải thiện'},
            {metric:'Tỷ lệ tổn thất',current:'15.0%',previous:'16.3%',change:'▼ 1.3%',good:true,status:'Cải thiện'},
            {metric:'SEC điện + nhiệt',current:'98.6 kWh/t',previous:'101.1 kWh/t',change:'▼ 2.5%',good:true,status:'Cải thiện'}
          ]
        };
        data.distribution={
          process:{labels:['Lò nung','Nghiền xi','Nghiền liệu','Đóng bao & PT','Hệ thống chung'],values:[47.1,24.0,17.3,6.6,5.0],colors:['#f13e48','#ff9914','#168ee5','#7b45dc','#71889b']},
          energy:{labels:['Than','Điện','Hơi','Dầu','Nước'],values:[49.8,33.7,9.7,4.4,2.3],colors:['#f05252','#168ee5','#71889b','#f6a51c','#25a0e7']}
        };
        data.trend={
          categories:['01/2025','02/2025','03/2025','04/2025','05/2025','06/2025'],
          metrics:{
            lossRate:{label:'Tỷ lệ tổn thất năng lượng',unit:'%',data:[18.2,16.3,16.1,15.6,15.3,15.0],min:0,max:25},
            usefulRate:{label:'Tỷ lệ năng lượng hữu ích',unit:'%',data:[81.8,83.7,83.9,84.4,84.7,85.0],min:75,max:90},
            sec:{label:'SEC (điện + nhiệt)',unit:'kWh/t',data:[106.4,103.8,102.9,100.7,99.6,98.6],min:90,max:110}
          }
        };
        // Compatibility payload for generic module integrations.
        data.primary={kind:'flow',title:'Luồng cân đối năng lượng',nodes:data.energyBalance.processes.map(item=>[item.label,`${item.value.toLocaleString('en-US')} MWh`])};
        data.secondary={kind:'twin',title:'Bản đồ năng lượng theo khu vực',assets:data.energyMap.map(item=>[item.name,item.share,99,'%'])};
        data.table={title:'Đối soát cân bằng theo khu vực',headers:['Khu vực','Đầu vào','Đã phân bổ','Chênh lệch','Tỷ lệ','Đánh giá'],rows:data.balanceTable.unit.map(item=>[item.unit,`${item.input.toLocaleString('en-US')} MWh`,`${item.allocated.toLocaleString('en-US')} MWh`,`${item.unallocated.toLocaleString('en-US')} MWh`,`${(100-item.balanceRate).toFixed(1)}%`,item.status])};
        data.insights=[{title:'Hiệu suất cân bằng',value:'85.0%',note:'Tăng 1.2% so với kỳ trước',status:'good',icon:'check-circle'},{title:'Tổn thất năng lượng',value:'15.0%',note:'Giảm 1.3% so với kỳ trước',status:'good',icon:'graph-down'},{title:'Khu vực ưu tiên',value:'Lò nung',note:'47.1% năng lượng đầu vào',status:'warn',icon:'fire'}];
      
} else if(id==='seu') {
        data.kpis=[
          {...kpi('Tổng tiêu thụ điện năng','8,524,630','kWh','lightning-charge-fill','blue','▼ 3.2%','so với cùng kỳ'),goodDirection:'down'},
          {...kpi('Tổng sản lượng clinker','12,450','tấn','building','green','▲ 1.8%','so với cùng kỳ'),goodDirection:'up'},
          {...kpi('Chỉ số SEC (toàn nhà máy)','684','kWh/tấn','bar-chart-fill','blue','▼ 2.5%','so với cùng kỳ'),goodDirection:'down'},
          {...kpi('Chi phí năng lượng','245','triệu VNĐ/tấn','coin','orange','▼ 2.1%','so với cùng kỳ'),goodDirection:'down'},
          {...kpi('Phát thải CO₂ (ước tính)','652','tCO₂','cloud','purple','▼ 3.1%','so với cùng kỳ'),goodDirection:'down'}
        ];
        data.structure={
          name:'Nhà máy Xi măng Lam Thạch II',total:12,
          groups:[
            {id:'raw',name:'Khai thác & Nghiền liệu',count:2,icon:'folder-fill',children:[{id:'SEU-09',code:'SEU-09',name:'Nghiền liệu 1'},{id:'SEU-10',code:'SEU-10',name:'Nghiền liệu 2'}]},
            {id:'kiln',name:'Lò nung & Hệ thống nung',count:2,icon:'folder-fill',children:[{id:'SEU-01',code:'SEU-01',name:'Lò nung Line 1'},{id:'SEU-02',code:'SEU-02',name:'Lò nung Line 2'}]},
            {id:'cement',name:'Nghiền xi măng',count:3,icon:'folder-fill',children:[{id:'SEU-03',code:'SEU-03',name:'Nghiền xi 1'},{id:'SEU-04',code:'SEU-04',name:'Nghiền xi 2'},{id:'SEU-05',code:'SEU-05',name:'Nghiền xi 3'}]},
            {id:'packing',name:'Đóng bao & Vận chuyển',count:2,icon:'folder-fill',children:[{id:'SEU-11',code:'SEU-11',name:'Đóng bao 1'},{id:'SEU-12',code:'SEU-12',name:'Đóng bao 2'}]},
            {id:'aux',name:'Hệ thống phụ trợ',count:3,icon:'folder-fill',children:[{id:'SEU-06',code:'SEU-06',name:'Trạm khí nén'},{id:'SEU-07',code:'SEU-07',name:'Hệ thống quạt'},{id:'SEU-08',code:'SEU-08',name:'Bơm nước'}]},
            {id:'other',name:'Khác',count:0,icon:'folder-fill',children:[]}
          ]
        };
        data.enpi={
          period:'Tháng 06/2025',
          metrics:[
            {id:'sec-electric',label:'SEC - Điện năng / tấn clinker',unit:'kWh/tấn',factor:1,digits:1,chartMin:100,chartMax:200},
            {id:'sec-thermal',label:'SEC - Nhiệt năng / tấn clinker',unit:'MJ/tấn',factor:4.6,digits:0,chartMin:450,chartMax:950},
            {id:'sec-cement',label:'SEC - Điện năng / tấn xi măng',unit:'kWh/tấn',factor:.78,digits:1,chartMin:70,chartMax:160}
          ],
          rows:[
            {id:'SEU-01',group:'kiln',name:'Lò nung Line 1',production:68450,energy:9525300,enpi:139.1,baseline:145.2,target:130,causes:['Sản lượng clinker tăng 6.5%','Nhiệt độ đầu vào ổn định hơn','Vận hành tối ưu hệ thống làm mát clinker']},
            {id:'SEU-02',group:'kiln',name:'Lò nung Line 2',production:71230,energy:10215600,enpi:143.5,baseline:150.0,target:132,causes:['Tăng ổn định cấp liệu','Giảm thời gian chạy không tải','Tối ưu lưu lượng gió sơ cấp']},
            {id:'SEU-09',group:'raw',name:'Nghiền liệu',production:185450,energy:15320200,enpi:82.6,baseline:85.4,target:75,causes:['Giảm tuần hoàn liệu','Tăng tải hữu ích của máy nghiền','Giảm tổn thất quạt phân ly']},
            {id:'SEU-03',group:'cement',name:'Nghiền xi 1',production:125600,energy:14850300,enpi:118.3,baseline:123.0,target:105,causes:['Tối ưu bi nghiền','Giảm chạy non tải','Tối ưu quạt phân ly']},
            {id:'SEU-04',group:'cement',name:'Nghiền xi 2',production:120350,energy:14125600,enpi:117.4,baseline:122.1,target:104,causes:['Ổn định độ mịn sản phẩm','Giảm thời gian chờ','Tối ưu tốc độ phân ly']},
            {id:'SEU-05',group:'cement',name:'Nghiền xi 3',production:98450,energy:11850700,enpi:120.3,baseline:124.8,target:105,causes:['Tải nghiền chưa tối ưu','Nhiệt độ đầu vào biến động','Quạt phân ly còn dư tải']},
            {id:'SEU-11',group:'packing',name:'Đóng bao',production:90200,energy:4125600,enpi:45.7,baseline:48.0,target:42,causes:['Giảm chạy băng tải không tải','Đồng bộ máy đóng bao','Tối ưu lịch vận chuyển']},
            {id:'SEU-06',group:'aux',name:'Trạm khí nén',production:30400,energy:3950200,enpi:130.0,baseline:120.0,target:110,causes:['Rò rỉ khí nén tăng','Áp suất đặt cao hơn nhu cầu','Máy nén chạy vùng hiệu suất thấp']},
            {id:'SEU-07',group:'aux',name:'Hệ thống quạt',production:58000,energy:8420600,enpi:145.2,baseline:140.0,target:125,causes:['Van tiết lưu mở lớn','Điểm làm việc lệch vùng tối ưu','Cần ưu tiên VSD cho quạt ID']},
            {id:'SEU-08',group:'other',name:'Khác',production:25300,energy:2180500,enpi:86.2,baseline:90.0,target:82,causes:['Giảm tải phụ trợ','Tắt tải không cần thiết','Ổn định lịch vận hành']}
          ]
        };
        data.trend={
          categories:['01/2025','02/2025','03/2025','04/2025','05/2025','06/2025'],
          actual:[158.2,152.6,149.3,146.8,142.5,139.1],
          baseline:[162.0,158.4,154.8,151.2,148.0,145.2],target:130,
          bySeu:{
            'SEU-01':{actual:[158.2,152.6,149.3,146.8,142.5,139.1],baseline:[162.0,158.4,154.8,151.2,148.0,145.2],target:130},
            'SEU-02':{actual:[161.0,156.2,152.8,149.1,146.0,143.5],baseline:[166,162,158,155,152,150],target:132},
            'SEU-09':{actual:[91.5,89.8,87.3,85.4,83.9,82.6],baseline:[94,92,90,88,86.5,85.4],target:75},
            'SEU-03':{actual:[129.4,126.8,124.2,121.9,119.5,118.3],baseline:[133,131,128,126,124.5,123],target:105},
            'SEU-04':{actual:[128.2,125.4,122.8,120.6,118.8,117.4],baseline:[132,130,127,125,123.2,122.1],target:104},
            'SEU-05':{actual:[130.6,128.1,125.9,123.8,122.1,120.3],baseline:[134,132,130,128,126,124.8],target:105},
            'SEU-11':{actual:[52.0,50.2,48.8,47.6,46.4,45.7],baseline:[54,53,51.5,50,49,48],target:42},
            'SEU-06':{actual:[121,123,125,127,128.5,130],baseline:[118,118.5,119,119,119.5,120],target:110},
            'SEU-07':{actual:[137,139,141,143,144,145.2],baseline:[136,137,138,139,139.5,140],target:125},
            'SEU-08':{actual:[94,92,90.5,89,87.5,86.2],baseline:[96,94,93,92,91,90],target:82}
          }
        };
        data.comparison={
          categories:['01/2025','02/2025','03/2025','04/2025','05/2025','06/2025'],
          overall:{actual:[720,712,705,698,691,684],baseline:[750,745,735,720,710,700]},
          bySeu:{
            'SEU-01':{actual:[758,744,730,716,702,684],baseline:[780,770,760,745,730,720]},
            'SEU-02':{actual:[770,755,742,728,716,699],baseline:[790,780,770,755,742,730]}
          }
        };
        data.potential=[
          {name:'Trạm khí nén',current:130.0,target:110.0,potential:15.4,saving:592530},
          {name:'Hệ thống quạt ID',current:145.2,target:125.0,potential:13.9,saving:720450},
          {name:'Nghiền xi 3',current:120.3,target:105.0,potential:12.7,saving:680320},
          {name:'Nghiền liệu',current:82.6,target:75.0,potential:9.2,saving:580120},
          {name:'Đóng bao',current:45.7,target:42.0,potential:8.1,saving:230450}
        ];
        data.performance=[
          {name:'Clinker factor',value:'0.82',unit:'kg clinker/kg xi',change:1.2},
          {name:'Thermal consumption',value:'3,220',unit:'MJ/t clinker',change:2.6},
          {name:'Electrical consumption',value:'684',unit:'kWh/t clinker',change:2.5},
          {name:'Tổng tiêu hao năng lượng',value:'3,760',unit:'MJ/t clinker',change:2.4},
          {name:'Chi phí năng lượng',value:'245,000',unit:'VNĐ/t clinker',change:2.1}
        ];
        data.primary={kind:'bar',title:'Chỉ số EnPI theo SEU',categories:data.enpi.rows.map(item=>item.name),series:[{name:'EnPI',data:data.enpi.rows.map(item=>item.enpi)},{name:'EnB',data:data.enpi.rows.map(item=>item.baseline)}]};
        data.secondary={kind:'line',title:'Xu hướng EnPI – Lò nung Line 1',categories:data.trend.categories,series:[{name:'EnPI thực tế',data:data.trend.actual},{name:'Đường cơ sở EnB',data:data.trend.baseline},{name:'Mục tiêu',data:Array(6).fill(data.trend.target)}]};
        data.table={title:'SEU trọng yếu',headers:['SEU','Sản lượng','Điện năng','EnPI','EnB','Trạng thái'],rows:data.enpi.rows.map(item=>[item.name,item.production,item.energy,item.enpi,item.baseline,item.enpi<=item.baseline?'Tốt':'Cần chú ý'])};
        data.insights=[{title:'SEU đạt EnB',value:'8/10',note:'80% SEU tốt hơn đường cơ sở',status:'good',icon:'check2-circle'},{title:'SEU cần hành động',value:'2',note:'Trạm khí nén · Hệ thống quạt',status:'warn',icon:'exclamation-triangle'},{title:'Tiềm năng tiết kiệm',value:'2.80 GWh/tháng',note:'Top 5 cơ hội cải thiện',status:'good',icon:'leaf'}];
            } else if(id==='targets') {
        data.kpis=[
          kpi('Tổng số mục tiêu','8','','bullseye','blue','▲ +2','so với 2024'),
          kpi('Đang thực hiện đúng tiến độ','5','','check-circle-fill','green','62.5%',''),
          kpi('Có nguy cơ chậm tiến độ','2','','clock-fill','orange','25.0%',''),
          kpi('Chậm tiến độ','1','','exclamation-triangle-fill','red','12.5%',''),
          kpi('Tổng tiềm năng tiết kiệm','3,760','MWh/năm','leaf','green','~ 8.2 tỷ VNĐ/năm','')
        ];
        data.viewTabs=['Tổng quan','Mục tiêu năng lượng','Kế hoạch hành động','Theo dõi thực hiện','Hiệu quả & Tiết kiệm','Liên quan ISO 50001'];
        data.goals=[
          {id:'TG-2025-01',name:'Giảm SEC toàn nhà máy',indicator:'kWh/tấn clinker',target:'-5%',current:'-3.2%',progress:64,status:'Đúng tiến độ',statusKey:'good',due:'31/12/2025',owner:'P. SX'},
          {id:'TG-2025-02',name:'Giảm tiêu thụ nhiệt lò nung',indicator:'GJ/tấn clinker',target:'-4%',current:'-2.1%',progress:53,status:'Nguy cơ chậm',statusKey:'warning',due:'31/12/2025',owner:'P. Vận hành'},
          {id:'TG-2025-03',name:'Giảm tiêu thụ điện nghiền xi',indicator:'kWh/tấn xi',target:'-6%',current:'-6.8%',progress:113,status:'Vượt kế hoạch',statusKey:'good',due:'30/06/2025',owner:'P. Nghiền'},
          {id:'TG-2025-04',name:'Tăng tỷ lệ điện từ NL tái tạo',indicator:'%',target:'≥ 10%',current:'8.5%',progress:85,status:'Nguy cơ chậm',statusKey:'warning',due:'31/12/2025',owner:'P. Kỹ thuật'},
          {id:'TG-2025-05',name:'Giảm thất thoát khí nén',indicator:'%',target:'-15%',current:'-12%',progress:80,status:'Đúng tiến độ',statusKey:'good',due:'30/09/2025',owner:'P. Cơ điện'},
          {id:'TG-2025-06',name:'Giảm tiêu thụ nước',indicator:'m³/tấn clinker',target:'-10%',current:'-4.2%',progress:42,status:'Chậm tiến độ',statusKey:'critical',due:'31/12/2025',owner:'P. Môi trường'},
          {id:'TG-2025-07',name:'Giảm phát thải CO₂ (Scope 2)',indicator:'tCO₂/tấn clinker',target:'-5%',current:'-2.8%',progress:56,status:'Nguy cơ chậm',statusKey:'warning',due:'31/12/2025',owner:'P. Môi trường'},
          {id:'TG-2025-08',name:'Nâng cao nhận thức nhân viên',indicator:'% nhân viên',target:'100%',current:'68%',progress:68,status:'Đúng tiến độ',statusKey:'good',due:'31/12/2025',owner:'P. HCNS'}
        ];
        data.progress={total:8,items:[{label:'Đúng tiến độ',value:5,percent:62.5,tone:'good'},{label:'Nguy cơ chậm',value:2,percent:25,tone:'warning'},{label:'Chậm tiến độ',value:1,percent:12.5,tone:'critical'}]};
        data.savings=[
          {label:'Điện',value:'2,350',unit:'MWh/năm',money:'(~ 5.2 tỷ VNĐ)',icon:'lightning-charge-fill',tone:'blue'},
          {label:'Nhiệt',value:'1,120',unit:'GJ/năm',money:'(~ 2.4 tỷ VNĐ)',icon:'fire',tone:'orange'},
          {label:'CO₂',value:'2,950',unit:'tCO₂e/năm',money:'',icon:'cloud',tone:'purple'}
        ];
        data.isoLinks=[
          'Phù hợp Chính sách năng lượng của nhà máy',
          'Đóng góp đạt mục tiêu giảm 5% SEC năm 2025',
          'Liên kết với mục tiêu giảm phát thải CO₂ & ESG',
          'Đáp ứng yêu cầu đánh giá nội bộ ISO 50001:2018'
        ];
        data.documents=[
          {id:'energy-policy',name:'Chính sách năng lượng'},
          {id:'iso-goal-template',name:'Mẫu thiết lập mục tiêu (ISO 50001)'},
          {id:'action-plan-template',name:'Mẫu kế hoạch hành động'},
          {id:'goal-periodic-report',name:'Báo cáo định kỳ mục tiêu'},
          {id:'evaluation-minutes',name:'Biên bản họp đánh giá'}
        ];
        data.trend={
          metrics:[
            {id:'sec',label:'SEC toàn nhà máy (kWh/tấn clinker)',unit:'kWh/tấn',categories:['01/2025','02/2025','03/2025','04/2025','05/2025','06/2025','07/2025','08/2025','09/2025','10/2025','11/2025','12/2025'],actual:[105.2,101.1,99.0,96.7,94.5,93.1],target:[102,99,97,94,91,88,86,84,82,80,79,78],forecast:[null,null,null,null,null,93.1,92,91,90,89,88,87],annualTarget:95},
            {id:'thermal',label:'Tiêu thụ nhiệt lò nung (GJ/tấn clinker)',unit:'GJ/tấn',categories:['01/2025','02/2025','03/2025','04/2025','05/2025','06/2025','07/2025','08/2025','09/2025','10/2025','11/2025','12/2025'],actual:[3.42,3.39,3.36,3.33,3.29,3.25],target:[3.38,3.35,3.32,3.29,3.26,3.22,3.20,3.18,3.16,3.14,3.12,3.10],forecast:[null,null,null,null,null,3.25,3.23,3.21,3.20,3.18,3.17,3.15],annualTarget:3.18},
            {id:'cement',label:'Điện nghiền xi (kWh/tấn xi)',unit:'kWh/tấn',categories:['01/2025','02/2025','03/2025','04/2025','05/2025','06/2025','07/2025','08/2025','09/2025','10/2025','11/2025','12/2025'],actual:[123,120,117,114,111,108],target:[121,119,117,115,113,111,109,107,105,103,101,99],forecast:[null,null,null,null,null,108,106,105,103,101,100,98],annualTarget:105}
          ]
        };
        data.actions=[
          {id:'HD-2025-01',name:'Tối ưu điều khiển lò nung (APC)',saving:'650 MWh/năm',status:'Đang thực hiện',statusKey:'good'},
          {id:'HD-2025-02',name:'Thay thế motor hiệu suất cao nghiền xi Line 2',saving:'420 MWh/năm',status:'Đang thực hiện',statusKey:'good'},
          {id:'HD-2025-03',name:'Thu hồi nhiệt khí thải (WHR - giai đoạn 1)',saving:'1,200 MWh/năm',status:'Chuẩn bị đầu tư',statusKey:'info'},
          {id:'HD-2025-04',name:'Giảm rò rỉ khí nén toàn nhà máy',saving:'310 MWh/năm',status:'Đang thực hiện',statusKey:'good'},
          {id:'HD-2025-05',name:'Tối ưu hệ thống bơm nước tuần hoàn',saving:'180 MWh/năm',status:'Nguy cơ chậm',statusKey:'warning'}
        ];
        data.primary={kind:'goal',title:'Tiến độ mục tiêu năng lượng',items:data.goals.slice(0,4).map(item=>[item.name,item.progress,item.target])};
        data.secondary={kind:'line',title:'Xu hướng mục tiêu trọng yếu',categories:data.trend.metrics[0].categories,series:[{name:'Thực tế',data:data.trend.metrics[0].actual},{name:'Mục tiêu',data:data.trend.metrics[0].target}]};
        data.table={title:'Kế hoạch hành động',headers:['Mã','Hành động','Tiết kiệm dự kiến','Trạng thái'],rows:data.actions.map(item=>[item.id,item.name,item.saving,item.status])};
        data.insights=[{title:'Hoàn thành mục tiêu',value:'62.5%',note:'5/8 mục tiêu đúng tiến độ',status:'good',icon:'bullseye'},{title:'Mục tiêu cần ưu tiên',value:'3',note:'2 nguy cơ chậm · 1 chậm tiến độ',status:'warn',icon:'alarm'},{title:'Lợi ích ước tính',value:'8.2 tỷ VNĐ/năm',note:'3,760 MWh/năm',status:'good',icon:'cash-stack'}];
      } else if(id==='alerts') {
        data.kpis=[
          kpi('Tổng số cảnh báo','12','','exclamation-triangle-fill','red','▲ 4','so với tuần trước'),
          kpi('Cảnh báo đang xử lý','3','','gear-fill','orange','25.0%',''),
          kpi('Đã khắc phục','8','','check-circle-fill','green','66.7%',''),
          kpi('Thời gian xử lý TB','2.6','giờ','clock-fill','blue','▼ 40%','so với tháng trước'),
          kpi('Tiềm năng tiết kiệm','1,250','MWh/năm','cash-stack','green','~ 2.1 tỷ VNĐ/năm','')
        ];
        data.viewTabs=['Tổng quan','Cảnh báo thời gian thực','Phân tích nguyên nhân (RCA)','Phân tích xu hướng','Benchmark & AI','Khuyến nghị tối ưu'];
        data.severitySummary={critical:1,high:4,medium:5};
        data.areaAlerts=[
          {id:'raw',name:'Nghiền liệu',count:3,status:'critical',x:14,y:20},
          {id:'kiln',name:'Lò nung',count:2,status:'warning',x:47,y:12},
          {id:'cement',name:'Nghiền xi',count:0,status:'good',x:70,y:22},
          {id:'power',name:'Hệ thống điện',count:0,status:'good',x:10,y:78},
          {id:'air',name:'Trạm khí nén',count:1,status:'warning',x:48,y:79},
          {id:'packing',name:'Đóng bao',count:4,status:'critical',x:84,y:61},
          {id:'aux',name:'Khu phụ trợ',count:0,status:'good',x:79,y:45}
        ];
        data.latestAlerts=[
          {time:'10:18:42',area:'Đóng bao',device:'DB-01',message:'Công suất tăng bất thường',severity:'Cao',severityKey:'critical',status:'Đang xử lý',statusKey:'warning'},
          {time:'09:52:17',area:'Lò nung',device:'ID Fan',message:'Nhiệt độ ổ trục cao (92°C)',severity:'Cao',severityKey:'critical',status:'Mới',statusKey:'info'},
          {time:'08:43:05',area:'Nghiền liệu',device:'Mill-01',message:'SEC tăng 12% so với định mức',severity:'Trung bình',severityKey:'warning',status:'Đang xử lý',statusKey:'warning'},
          {time:'06:21:33',area:'Khí nén',device:'COMP-02',message:'Áp suất dao động (6.2 → 7.8 bar)',severity:'Trung bình',severityKey:'warning',status:'Mới',statusKey:'info'},
          {time:'05:17:08',area:'Đóng bao',device:'DB-03',message:'Điện năng tăng 18%',severity:'Trung bình',severityKey:'warning',status:'Đã khắc phục',statusKey:'good'},
          {time:'04:36:11',area:'Lò nung',device:'Cooler',message:'Chênh áp cao bất thường',severity:'Cao',severityKey:'critical',status:'Mới',statusKey:'info'},
          {time:'03:12:55',area:'Nghiền xi',device:'Mill-02',message:'Độ rung vượt ngưỡng',severity:'Thấp',severityKey:'minor',status:'Đã khắc phục',statusKey:'good'},
          {time:'01:48:20',area:'Trạm điện',device:'T1-6kV',message:'Hệ số công suất thấp (0.82)',severity:'Thấp',severityKey:'minor',status:'Đã khắc phục',statusKey:'good'}
        ];
        data.rca={
          cases:[
            {id:'raw-sec',label:'SEC tăng 12% – Nghiền liệu Mill-01',phenomenon:'SEC nghiền liệu tăng 12% so với định mức',whys:['Do tải nghiền cao hơn bình thường','Do độ ẩm nguyên liệu tăng (từ 4% → 6.5%)','Do mưa kéo dài, bãi chứa che phủ chưa tốt','Do hệ thống mái che bãi liệu xuống cấp'],rootCause:'Bảo trì mái che, cải thiện quy trình quản lý nguyên liệu',recommendations:['Sửa chữa và nâng cấp mái che bãi liệu','Tăng tần suất kiểm tra độ ẩm nguyên liệu đầu vào','Tối ưu chế độ vận hành mill khi độ ẩm > 6%'],saving:'420 MWh/năm (~ 714 triệu VNĐ/năm)'},
            {id:'fan-temp',label:'Nhiệt độ ổ trục cao – ID Fan',phenomenon:'Nhiệt độ ổ trục ID Fan đạt 92°C',whys:['Ma sát ổ trục tăng','Mỡ bôi trơn suy giảm tính năng','Chu kỳ bôi trơn chưa phù hợp tải thực tế','Bảo trì dự phòng chưa dựa theo trạng thái'],rootCause:'Chu kỳ bảo trì chưa tối ưu theo condition monitoring',recommendations:['Kiểm tra ổ trục và bổ sung mỡ đúng chủng loại','Rà soát ngưỡng nhiệt và rung','Thiết lập bảo trì theo tình trạng'],saving:'118 MWh/năm (~ 201 triệu VNĐ/năm)'}
          ]
        };
        data.trend={
          metrics:[
            {id:'raw-sec',label:'SEC – Nghiền liệu (kWh/tấn)',unit:'kWh/tấn',categories:['01/03','08/03','15/03','22/03','01/04','08/04','15/04','22/04','01/05','08/05','15/05','22/05','01/06','08/06','15/06'],actual:[82,76,79,77,80,84,92,96,94,101,97,100,103,106,null],trend:[78,79,80,82,84,87,90,92,95,98,100,102,104,107,110],threshold:[120,120,120,120,120,120,120,120,120,120,120,120,120,120,120],forecast:[null,null,null,null,null,null,null,null,null,null,null,null,106,118,132],annotation:'Dự báo vượt ngưỡng sau 5 ngày'},
            {id:'kiln-temp',label:'Nhiệt độ ổ trục ID Fan (°C)',unit:'°C',categories:['01/03','08/03','15/03','22/03','01/04','08/04','15/04','22/04','01/05','08/05','15/05','22/05','01/06','08/06','15/06'],actual:[71,72,73,75,76,78,79,81,83,84,86,88,90,92,null],trend:[71,72,73,74,75,77,78,80,82,84,86,88,90,92,94],threshold:[95,95,95,95,95,95,95,95,95,95,95,95,95,95,95],forecast:[null,null,null,null,null,null,null,null,null,null,null,null,90,94,98],annotation:'Dự báo vượt ngưỡng trong 7 ngày'}
          ]
        };
        data.benchmark={categories:['Lam Thạch II','Trung bình VN','Top 25%','Bottom 25%'],values:[72.5,68.3,62.1,85.0],notes:['SEC Nghiền xi của Lam Thạch II cao hơn 6.2% so với trung bình ngành','Còn dư địa tiết kiệm 10.4 kWh/tấn (~ 1,768 MWh/năm)','Cần tập trung tối ưu hệ thống nghiền và phân loại']};
        data.correlations=[{label:'Độ ẩm nguyên liệu',value:.62,tone:'red'},{label:'Tải nghiền',value:.48,tone:'orange'},{label:'Độ mịn sản phẩm',value:.35,tone:'yellow'},{label:'Nhiệt độ môi trường',value:.21,tone:'blue'},{label:'Lưu lượng gió',value:.18,tone:'blue'}];
        data.aiRecommendations=[
          {level:'critical',icon:'exclamation-triangle-fill',text:'Dự báo SEC Nghiền liệu có thể vượt ngưỡng trong 5 ngày tới. Đề xuất kiểm tra độ ẩm nguyên liệu.'},
          {level:'warning',icon:'award-fill',text:'Mẫu tiêu thụ điện Lò nung tương tự giai đoạn trước khi xảy ra sự cố. Đề xuất kiểm tra ID Fan.'},
          {level:'warning',icon:'lightning-charge-fill',text:'Cơ hội tiết kiệm 320 MWh/năm tại hệ thống khí nén bằng cách tối ưu áp suất vận hành.'}
        ];
        data.primary={kind:'line',title:'Phân tích xu hướng & Dự báo bất thường',categories:data.trend.metrics[0].categories,series:[{name:'Thực tế',data:data.trend.metrics[0].actual},{name:'Xu hướng',data:data.trend.metrics[0].trend},{name:'Ngưỡng cảnh báo',data:data.trend.metrics[0].threshold},{name:'Dự báo AI',data:data.trend.metrics[0].forecast}]};
        data.secondary={kind:'bar',title:'So sánh Benchmark',categories:data.benchmark.categories,series:[{name:'SEC',data:data.benchmark.values}]};
        data.table={title:'Danh sách cảnh báo mới nhất',headers:['Thời gian','Khu vực','Thiết bị','Nội dung','Mức độ','Trạng thái'],rows:data.latestAlerts.map(item=>[item.time,item.area,item.device,item.message,item.severity,item.status])};
        data.insights=[{title:'Nguyên nhân chính',value:'Độ ẩm nguyên liệu',note:'Hệ số tương quan 0.62',status:'warn',icon:'activity'},{title:'MTTR trung bình',value:'2.6 giờ',note:'Giảm 40% so với tháng trước',status:'good',icon:'clock-history'},{title:'Tiềm năng tiết kiệm',value:'1,250 MWh/năm',note:'Từ các khuyến nghị đang mở',status:'good',icon:'cash-stack'}];
      } else if(id==='savings') {
        data.viewTabs=['Tổng quan','Danh mục giải pháp','M&V chi tiết','Kết quả & Lợi ích','Bài học & Nhân rộng'];
        data.kpis=[
          {...kpi('Tổng tiềm năng tiết kiệm','3,760','MWh/năm','leaf','green','▲ 8.2%','so với 2024')},
          {...kpi('Giá trị tiết kiệm','7.8','tỷ VNĐ/năm','coin','orange','▲ 9.5%','')},
          {...kpi('Giảm phát thải CO₂','2,950','tCO₂/năm','cloud','blue','▼ 8.1%','')},
          {...kpi('Số dự án đã triển khai','5 / 8','','bullseye','red','',''),progress:62.5},
          {...kpi('Tỷ suất hoàn vốn TB (ROI)','1.8','năm','bar-chart-fill','purple','','')}
        ];
        data.projects=[
          {id:'GP-01',name:'Tối ưu vận hành lò nung',area:'Lò nung',potential:650,actual:592,ratio:91,investment:4.5,payback:'1.6 năm',status:'Đã triển khai',statusKey:'done'},
          {id:'GP-02',name:'Thu hồi nhiệt thải (WHR)',area:'Lò nung',potential:1200,actual:null,ratio:null,investment:28.0,payback:'3.2 năm',status:'Đang triển khai',statusKey:'ongoing'},
          {id:'GP-03',name:'Tối ưu hệ thống nghiền xi',area:'Nghiền xi',potential:420,actual:380,ratio:90,investment:3.2,payback:'1.8 năm',status:'Đã triển khai',statusKey:'done'},
          {id:'GP-04',name:'Cải tiến hệ thống khí nén',area:'Khí nén',potential:310,actual:null,ratio:null,investment:2.1,payback:'2.0 năm',status:'Chuẩn bị đầu tư',statusKey:'prep'},
          {id:'GP-05',name:'Tối ưu bơm và quạt',area:'Phụ trợ',potential:280,actual:210,ratio:75,investment:1.8,payback:'1.4 năm',status:'Đã triển khai',statusKey:'done'},
          {id:'GP-06',name:'Chiếu sáng LED toàn nhà máy',area:'Toàn nhà máy',potential:120,actual:115,ratio:96,investment:0.6,payback:'0.8 năm',status:'Đã triển khai',statusKey:'done'},
          {id:'GP-07',name:'Tối ưu điều khiển AQC',area:'Nghiền liệu',potential:480,actual:null,ratio:null,investment:4.0,payback:'2.5 năm',status:'Đang triển khai',statusKey:'ongoing'},
          {id:'GP-08',name:'Quản lý phụ tải & Peak shaving',area:'Trạm điện',potential:300,actual:null,ratio:null,investment:3.5,payback:'2.8 năm',status:'Đề xuất mới',statusKey:'proposed'}
        ];
        data.progressSummary={total:8,items:[
          {label:'Đã triển khai',value:5,percent:62.5,tone:'green'},
          {label:'Đang triển khai',value:2,percent:25.0,tone:'orange'},
          {label:'Chuẩn bị đầu tư',value:1,percent:12.5,tone:'blue'},
          {label:'Đề xuất mới',value:0,percent:0,tone:'purple'}
        ]};
        data.ipmvpSteps=[
          {title:'Lập đường cơ sở (Baseline)',items:['Chọn phương pháp IPMVP (Option A/B/C/D)','Thu thập dữ liệu lịch sử','Xác định yếu tố điều chỉnh']},
          {title:'Triển khai giải pháp (Implementation)',items:['Lắp đặt, vận hành','Đào tạo nhân sự','Giám sát liên tục']},
          {title:'Đo lường & Xác minh (Verification)',items:['Thu thập dữ liệu sau triển khai','So sánh với đường cơ sở','Tính toán mức tiết kiệm','Đánh giá độ tin cậy']},
          {title:'Báo cáo & Nhân rộng (Reporting)',items:['Lập báo cáo M&V','Xác nhận kết quả','Chuẩn hóa và nhân rộng']}
        ];
        data.yearlyImpact={categories:['2022','2023','2024','2025\n(ước)'],energy:[1120,2350,3470,3760],value:[2.1,4.5,6.9,7.8]};
        data.mvResults=[
          {id:'GP-01',area:'Lò nung',method:'Option C',period:'01-03/2025',energy:592,value:1.23,co2:465,note:'Đã thẩm định'},
          {id:'GP-03',area:'Nghiền xi',method:'Option B',period:'01-03/2025',energy:380,value:.79,co2:298,note:'Đã thẩm định'},
          {id:'GP-05',area:'Phụ trợ',method:'Option A',period:'01-02/2025',energy:210,value:.44,co2:165,note:'Đã thẩm định'},
          {id:'GP-06',area:'Toàn nhà máy',method:'Option A',period:'01-02/2025',energy:115,value:.24,co2:90,note:'Đã thẩm định'}
        ];
        data.totalSaving='3,760';
        data.contribution=[
          {label:'Lò nung',value:31.6,color:'#ec3347'},
          {label:'Nghiền liệu',value:22.7,color:'#1787e3'},
          {label:'Nghiền xi',value:19.7,color:'#14a978'},
          {label:'Phụ trợ',value:14.9,color:'#ffab16'},
          {label:'Khác',value:11.1,color:'#7f49d5'}
        ];
        data.recommendations=['Tiếp tục triển khai GP-02 (WHR) đúng tiến độ','Chuẩn bị đầu tư GP-04 và GP-07','Xem xét giải pháp BESS để tối ưu phụ tải','Định kỳ thẩm định M&V (6 tháng/lần)','Nhân rộng các giải pháp hiệu quả sang các dây chuyền khác'];
        data.primary={kind:'bar',title:'Hiệu quả tích lũy theo năm',categories:data.yearlyImpact.categories,series:[{name:'Sản lượng tiết kiệm (MWh)',data:data.yearlyImpact.energy},{name:'Giá trị tiết kiệm (tỷ VND)',data:data.yearlyImpact.value}]};
        data.secondary={kind:'donut',title:'Đóng góp theo lĩnh vực',labels:data.contribution.map(x=>x.label),values:data.contribution.map(x=>x.value)};
        data.table={title:'Danh mục giải pháp tiết kiệm năng lượng',headers:['Mã GP','Tên giải pháp','Khu vực','Tiềm năng','Tiết kiệm thực tế','ROI','Trạng thái'],rows:data.projects.map(x=>[x.id,x.name,x.area,`${x.potential} MWh/năm`,x.actual==null?'–':`${x.actual} MWh/năm`,x.payback,x.status])};
        data.insights=[{title:'Tiết kiệm đã xác minh',value:'1,297 MWh/năm',note:'4 giải pháp đã thẩm định',status:'good',icon:'patch-check'},{title:'Giải pháp lớn nhất',value:'WHR 1,200 MWh/năm',note:'Đang triển khai',status:'warn',icon:'fire'},{title:'ROI trung bình',value:'1.8 năm',note:'Danh mục hiện tại',status:'good',icon:'cash-stack'}];
      } else if(id==='emissions') {
        data.viewTabs=['Tổng quan','Phát thải CO₂','Phân tích theo nguồn','So sánh & Benchmark','Quản lý dữ liệu','Báo cáo ESG','Sáng kiến giảm phát thải'];
        data.kpis=[
          {...kpi('Tổng phát thải CO₂ (ước tính)','2,950','tCO₂/năm','leaf','green','▼ 8.1%','so với 2024')},
          {...kpi('Cường độ phát thải','652','kgCO₂/tấn clinker','cloud','blue','▼ 6.5%','so với 2024')},
          {...kpi('Mục tiêu giảm phát thải 2025','-8','%','bullseye','orange','',''),progress:75},
          {...kpi('Tỷ lệ nhiên liệu thay thế (AFR)','12.3','%','tree-fill','purple','▲ 2.8%','so với 2024')},
          {...kpi('Tỷ lệ điện từ nguồn tái tạo','18.5','%','recycle','green','▲ 5.2%','so với 2024')}
        ];
        data.totalEmission='2,950';
        data.trend={categories:['01/2025','02/2025','03/2025','04/2025','05/2025','06/2025'],emissions:[278000,265400,248600,236800,228500,221300],intensity:[720,702,680,660,645,628]};
        data.breakdown=[
          {label:'Nhiên liệu (than, dầu, ...)',value:68.5,color:'#ef3345'},
          {label:'Quá trình nung (CaCO₃)',value:21.2,color:'#ff9d13'},
          {label:'Điện',value:7.8,color:'#1689e4'},
          {label:'Vận chuyển nội bộ',value:2.1,color:'#0aaa77'},
          {label:'Khác',value:.4,color:'#7f4bd7'}
        ];
        data.benchmark={categories:['Lam Thạch II','Trung bình VN','Tốt nhất VN','Trung bình thế giới'],values:[652,750,620,800],betterThan:'13.1%'};
        data.details=[
          {category:'Nhiên liệu',activity:'Than, dầu FO, DO',emission:2021000,share:68.5,change:-10.2,note:'Giảm tiêu thụ than'},
          {category:'Quá trình',activity:'Phân hủy CaCO₃',emission:625400,share:21.2,change:-5.6,note:'Ổn định clinker'},
          {category:'Điện',activity:'Điện lưới quốc gia',emission:230100,share:7.8,change:-7.1,note:'Tăng sử dụng năng lượng tái tạo'},
          {category:'Vận chuyển',activity:'Xe vận chuyển nội bộ',emission:62400,share:2.1,change:2.5,note:'Tăng sản lượng'},
          {category:'Khác',activity:'Chất thải, rò rỉ, ...',emission:11800,share:.4,change:-8.0,note:'Kiểm soát tốt hơn'}
        ];
        data.targetProgress={categories:['01','02','03','04','05','06','07','08','09','10','11','12'],actual:[3050,2920,2780,2690,2620,2550,null,null,null,null,null,null],plan:[3050,2920,2790,2660,2530,2400,2270,2140,2010,1880,1750,1620],bau:[3100,3130,3160,3190,3220,3250,3280,3310,3340,3370,3400,3430]};
        data.esgMetrics=[
          {label:'Phát thải CO₂ (tCO₂)',value:'2,950',change:-8.1,rating:'Tốt'},
          {label:'Cường độ phát thải (kgCO₂/tấn clinker)',value:'652',change:-6.5,rating:'Tốt'},
          {label:'Tỷ lệ AFR (%)',value:'12.3%',change:2.8,rating:'Tốt'},
          {label:'Tỷ lệ điện tái tạo (%)',value:'18.5%',change:5.2,rating:'Tốt'},
          {label:'Tiêu thụ nước (m³/tấn clinker)',value:'0.82',change:-4.1,rating:'Tốt'},
          {label:'Tỷ lệ chất thải tái sử dụng (%)',value:'85%',change:6.3,rating:'Tốt'}
        ];
        data.initiatives=[
          {name:'Tăng tỷ lệ nhiên liệu thay thế (RDF)',impact:'-80,000 tCO₂/năm',status:'Đang triển khai',statusKey:'ongoing',due:'Q4/2025'},
          {name:'Tối ưu hệ thống nghiền xi',impact:'-25,000 tCO₂/năm',status:'Đã hoàn thành',statusKey:'done',due:'Q2/2025'},
          {name:'Lắp đặt WHR phát điện',impact:'-120,000 tCO₂/năm',status:'Đang triển khai',statusKey:'ongoing',due:'Q1/2026'},
          {name:'Tối ưu vận tải nội bộ',impact:'-5,000 tCO₂/năm',status:'Đang triển khai',statusKey:'ongoing',due:'Q3/2025'},
          {name:'Nghiên cứu CCS/CCU (dài hạn)',impact:'Tiềm năng lớn',status:'Nghiên cứu',statusKey:'research',due:'>2026'}
        ];
        data.compliance=['Phù hợp ISO 50001 (năng lượng)','Tuân thủ Nghị định 06/2022 về giảm nhẹ phát thải KNK','Đáp ứng yêu cầu báo cáo ESG (GRI, TCFD, ISSB)','Sẵn sàng cho cơ chế CBAM (EU)','Dữ liệu minh bạch, có thể kiểm chứng (MRV)'];
        data.documents=[
          {id:'CO2-2025-06',name:'Báo cáo phát thải CO₂ (tháng 06/2025)'},
          {id:'ESG-2024',name:'Báo cáo ESG năm 2024'},
          {id:'ESG-DATA',name:'Biểu mẫu thu thập dữ liệu phát thải'},
          {id:'GHG-GUIDE',name:'Hướng dẫn tính toán (IPCC, GHG Protocol)'},
          {id:'DECARB-2030',name:'Kế hoạch giảm phát thải 2025–2030'}
        ];
        data.primary={kind:'line',title:'Xu hướng phát thải CO₂ và cường độ phát thải',categories:data.trend.categories,series:[{name:'Phát thải CO₂',data:data.trend.emissions},{name:'Cường độ phát thải',data:data.trend.intensity}]};
        data.secondary={kind:'donut',title:'Cơ cấu phát thải CO₂ theo nguồn',labels:data.breakdown.map(x=>x.label),values:data.breakdown.map(x=>x.value)};
        data.table={title:'Chi tiết phát thải theo hạng mục',headers:['Hạng mục','Hoạt động/Tiêu mục','Phát thải','Tỷ lệ','So với 2024','Ghi chú'],rows:data.details.map(x=>[x.category,x.activity,x.emission,x.share,x.change,x.note])};
        data.insights=[{title:'Giảm so với 2024',value:'8.1%',note:'Theo tổng phát thải ước tính',status:'good',icon:'arrow-down-circle'},{title:'Nguồn phát thải lớn nhất',value:'Nhiên liệu 68.5%',note:'Ưu tiên AFR và hiệu suất nhiệt',status:'warn',icon:'fire'},{title:'Sẵn sàng ESG/MRV',value:'Tốt',note:'5 tiêu chí tuân thủ',status:'good',icon:'clipboard-check'}];
      } else if(id==='reports') {
        data.kpis=[
          kpi('Tổng số báo cáo','28','','bar-chart-fill','green','▼ +6','so với 2024'),
          kpi('Báo cáo tự động','85','%','clock-fill','blue','▲ +15%',''),
          kpi('Người dùng truy cập','24','','people-fill','red','12 quản lý | 8 kỹ thuật | 4 lãnh đạo',''),
          kpi('Tần suất truy cập','3.6','lần/ngày','eye-fill','orange','▲ +40%',''),
          kpi('Báo cáo phục vụ ESG','12','','file-earmark-text-fill','purple','100% tự động',''),
          kpi('Tuân thủ ISO 50001','100','%','shield-check','green','Đầy đủ biểu mẫu','')
        ];
        data.viewTabs=['Tổng quan','Báo cáo định kỳ','Dashboard điều hành','Báo cáo ISO 50001','Báo cáo ESG','Tùy chỉnh báo cáo'];
        data.periodicReports=[
          {id:'RP-001',name:'Báo cáo năng lượng tổng hợp',frequency:'Hàng ngày',latest:'10/06/2025',status:'Đã tạo',statusKey:'done',formats:['pdf','xlsx']},
          {id:'RP-002',name:'Báo cáo EnPI theo SEC',frequency:'Hàng tuần',latest:'09/06/2025',status:'Đã tạo',statusKey:'done',formats:['pdf','xlsx']},
          {id:'RP-003',name:'Báo cáo tiêu thụ theo phân xưởng',frequency:'Hàng tháng',latest:'06/2025',status:'Đã tạo',statusKey:'done',formats:['pdf','xlsx']},
          {id:'RP-004',name:'Báo cáo M&V tiết kiệm năng lượng',frequency:'Hàng quý',latest:'Q2/2025',status:'Đã tạo',statusKey:'done',formats:['pdf','xlsx']},
          {id:'RP-005',name:'Báo cáo phát thải CO₂',frequency:'Hàng tháng',latest:'06/2025',status:'Đã tạo',statusKey:'done',formats:['pdf','xlsx']},
          {id:'RP-006',name:'Báo cáo ESG',frequency:'Hàng quý',latest:'Q2/2025',status:'Đang xử lý',statusKey:'pending',formats:['pdf','xlsx']},
          {id:'RP-007',name:'Báo cáo ISO 50001',frequency:'Hàng năm',latest:'2025',status:'Chưa tạo',statusKey:'empty',formats:['pdf','xlsx']}
        ];
        data.trend={
          categories:['01/2025','02/2025','03/2025','04/2025','05/2025','06/2025'],
          metrics:{
            sec:{label:'SEC (kWh/tấn)',actual:[105.2,102.1,98.6,96.5,94.8,93.2],plan:[101,98,95,92,89,86],average:[99,96,93,90,87,84],unit:'kWh/tấn',improvement:'Giảm 11.4%',context:'so với 01/2025'},
            co2:{label:'Phát thải CO₂ (tCO₂/tấn)',actual:[0.720,0.702,0.680,0.660,0.645,0.628],plan:[0.705,0.685,0.665,0.645,0.625,0.605],average:[0.695,0.680,0.665,0.650,0.635,0.620],unit:'tCO₂/tấn',improvement:'Giảm 12.8%',context:'so với 01/2025'},
            cost:{label:'Chi phí năng lượng (VNĐ/tấn)',actual:[405,398,386,378,369,365],plan:[400,390,380,370,360,350],average:[395,386,377,368,359,350],unit:'nghìn VNĐ/tấn',improvement:'Giảm 9.9%',context:'so với 01/2025'}
          }
        };
        data.categories=[
          {label:'Năng lượng',value:8,percent:28.6,color:'#138ce5'},
          {label:'M&V',value:5,percent:17.9,color:'#0db17f'},
          {label:'Phát thải CO₂',value:4,percent:14.3,color:'#ffad18'},
          {label:'ESG',value:4,percent:14.3,color:'#ed4e5d'},
          {label:'ISO 50001',value:3,percent:10.7,color:'#814fd5'},
          {label:'Khác',value:4,percent:14.3,color:'#7893a7'}
        ];
        data.reportTemplates=[
          {id:'TPL-ENERGY',name:'BÁO CÁO NĂNG LƯỢNG TỔNG HỢP',period:'Tháng 06/2025',tone:'blue'},
          {id:'TPL-CO2',name:'BÁO CÁO PHÁT THẢI CO₂',period:'Q2/2025',tone:'green'},
          {id:'TPL-ESG',name:'BÁO CÁO ESG',period:'Q2/2025',tone:'leaf'},
          {id:'TPL-ISO',name:'BÁO CÁO ISO 50001',period:'Năm 2025',tone:'iso'}
        ];
        data.esgReports=[
          {category:'Môi trường (E)',indicator:'Phát thải CO₂, NOx, SOx, bụi',frequency:'Hàng quý',status:'Đã cập nhật',statusKey:'done'},
          {category:'Năng lượng (E)',indicator:'SEC, năng lượng tái tạo',frequency:'Hàng quý',status:'Đã cập nhật',statusKey:'done'},
          {category:'Tài nguyên (E)',indicator:'Tiêu thụ nước, nguyên liệu',frequency:'Hàng quý',status:'Đã cập nhật',statusKey:'done'},
          {category:'Xã hội (S)',indicator:'An toàn lao động, cộng đồng',frequency:'Hàng năm',status:'Đang xử lý',statusKey:'pending'},
          {category:'Quản trị (G)',indicator:'Tuân thủ, minh bạch',frequency:'Hàng năm',status:'Chưa cập nhật',statusKey:'empty'}
        ];
        data.exportConfig={types:['Báo cáo năng lượng tổng hợp','Báo cáo EnPI','Báo cáo phát thải CO₂','Báo cáo ESG','Báo cáo ISO 50001'],formats:['PDF','Excel (.xlsx)','Word (.docx)'],periods:['Tháng 06/2025','Quý II/2025','Năm 2025'],includeCharts:true,includeComparison:true,includeData:true};
        data.history=[
          {time:'10/06/2025 08:15',name:'Báo cáo năng lượng tổng hợp',creator:'Nguyễn Văn A',format:'PDF',size:'2.4 MB'},
          {time:'09/06/2025 16:20',name:'Báo cáo EnPI tuần 23',creator:'Trần Thị B',format:'Excel',size:'1.8 MB'},
          {time:'05/06/2025 14:10',name:'Báo cáo phát thải CO₂',creator:'Lê Văn C',format:'PDF',size:'3.1 MB'},
          {time:'01/06/2025 09:05',name:'Báo cáo tiêu thụ nước',creator:'Phạm Thị D',format:'Excel',size:'1.2 MB'}
        ];
        data.notifications=[
          {level:'danger',icon:'bell-fill',text:'Còn 5 ngày đến hạn báo cáo ESG Q2/2025'},
          {level:'good',icon:'bell-fill',text:'Đã có dữ liệu phát thải tháng 06/2025'},
          {level:'warn',icon:'bell-fill',text:'Cần phê duyệt báo cáo M&V Q1/2025'},
          {level:'good',icon:'bell-fill',text:'Hoàn thành báo cáo ISO 50001 năm 2025'}
        ];
        data.sharing=[
          {icon:'people-fill',text:'Chia sẻ báo cáo cho Ban lãnh đạo'},
          {icon:'building',text:'Gửi báo cáo cho cơ quan quản lý'},
          {icon:'download',text:'Xuất dữ liệu sang hệ thống khác'},
          {icon:'link-45deg',text:'Tạo liên kết chia sẻ (URL)'},
          {icon:'archive-fill',text:'Lưu vào thư viện dữ liệu'}
        ];
        data.primary={kind:'line',title:'Xu hướng KPI kỳ báo cáo',categories:data.trend.categories,series:[{name:'Giá trị thực tế',data:data.trend.metrics.sec.actual},{name:'Kế hoạch',data:data.trend.metrics.sec.plan},{name:'Trung bình 2024',data:data.trend.metrics.sec.average}]};
        data.secondary={kind:'donut',title:'Cơ cấu báo cáo đã tạo',labels:data.categories.map(x=>x.label),values:data.categories.map(x=>x.value)};
        data.table={title:'Báo cáo gần đây',headers:['Tên báo cáo','Tần suất','Kỳ gần nhất','Trạng thái'],rows:data.periodicReports.map(x=>[x.name,x.frequency,x.latest,x.status])};
        data.insights=[{title:'Báo cáo tự động',value:'85%',note:'Tăng 15% so với 2024',status:'good',icon:'clock-fill'},{title:'Báo cáo ESG',value:'12',note:'100% tự động',status:'good',icon:'file-earmark-text'},{title:'Cần xử lý',value:'2',note:'ESG Q2 · M&V Q1',status:'warn',icon:'bell'}];
      } else if(id==='data') {
        data.kpis=[
          kpi('Tổng số điểm đo','2,856','','database-fill','blue','▼ +12%','so với 2024'),
          kpi('Thiết bị kết nối','142','','server','green','▲ +18%',''),
          kpi('Dung lượng dữ liệu','1.2','TB/năm','cloud-plus-fill','purple','▲ +25%',''),
          kpi('Tỷ lệ dữ liệu hợp lệ','99.2','%','clock-history','orange','▲ +0.8%',''),
          kpi('Sự cố hệ thống','0','','shield-fill-check','red','An toàn, ổn định',''),
          kpi('Hệ thống tích hợp','8','','puzzle-fill','cyan','SCADA, ERP, DCS, ...','')
        ];
        data.viewTabs=['Tổng quan','Kiến trúc hệ thống','Quản lý dữ liệu','Bảo mật & An toàn thông tin','Tích hợp hệ thống','Vận hành & Hỗ trợ','Kế hoạch phát triển'];
        data.architecture=[
          {id:'field',title:'Lớp thu thập dữ liệu',subtitle:'(OT – Thiết bị hiện trường)',tone:'blue',items:[['speedometer2','Công tơ điện'],['gauge','Đồng hồ hơi'],['droplet','Đồng hồ nước'],['thermometer-half','Cảm biến nhiệt độ, áp suất'],['cloud-haze2','Cảm biến khí thải (CEMS)'],['laptop','Thiết bị DCS/SCADA'],['activity','Thiết bị phân tích phòng LAB'],['file-earmark-spreadsheet','Dữ liệu thủ công (Excel, biểu mẫu)']]},
          {id:'edge',title:'Lớp truyền thông & Edge',subtitle:'(PSMART / INFRAS)',tone:'edge',items:[['router','Gateway IGD500'],['wifi','Router IFCS100/5200'],['cpu','RTU/PLC'],['diagram-3','Truyền thông Modbus, OPC, MQTT, IEC 104']]},
          {id:'platform',title:'Lớp lưu trữ & xử lý dữ liệu',subtitle:'(INFRAS – Data Platform)',tone:'platform',items:[['database','Data Lake / Historian'],['server','Cơ sở dữ liệu (SQL/NoSQL)'],['shuffle','Xử lý & Chuẩn hóa dữ liệu'],['cpu','AI & Phân tích dữ liệu'],['calculator','Tính toán EnPI, Carbon'],['link-45deg','API & Tích hợp hệ thống']]},
          {id:'app',title:'Lớp ứng dụng',subtitle:'(EnMS & ESG)',tone:'app',items:[['graph-up','Giám sát thời gian thực'],['exclamation-triangle','Phân tích & Cảnh báo'],['file-earmark-bar-graph','Báo cáo năng lượng'],['cloud','Báo cáo phát thải CO₂'],['leaf','Báo cáo ESG'],['speedometer2','Dashboard quản trị'],['building','Tích hợp ERP/CMMS'],['box-arrow-up-right','Cổng dữ liệu cho đối tác']]}
        ];
        data.dataFlow=[
          {icon:'broadcast-pin',label:'Thiết bị\nhiện trường'},
          {icon:'router',label:'Gateway/RTU\n(Edge)'},
          {icon:'database-fill',label:'Lưu trữ &\nXử lý dữ liệu'},
          {icon:'bar-chart-fill',label:'Phân tích &\nTính toán'},
          {icon:'file-earmark-text-fill',label:'Báo cáo &\nDashboard'},
          {icon:'people-fill',label:'Người dùng\n(VĐ: Quản lý, Đối tác)'}
        ];
        data.dataQuality=[
          {label:'Dữ liệu hợp lệ',value:99.2,color:'#0eae7c'},
          {label:'Dữ liệu thiếu',value:0.5,color:'#f0a315'},
          {label:'Dữ liệu lỗi',value:0.2,color:'#ec4758'},
          {label:'Chưa xác thực',value:0.1,color:'#718fa5'}
        ];
        data.storageGrowth={categories:['2022','2023','2024','2025\n(dự kiến)'],values:[320,580,960,1200],growth:'+25%/năm',average:'trung bình'};
        data.integrations=[
          {system:'SCADA/DCS',purpose:'Dữ liệu vận hành (nhiệt độ, áp suất, lưu lượng, ...)',status:'Đã tích hợp',statusKey:'done',note:'OPC/Modbus'},
          {system:'CEMS',purpose:'Dữ liệu khí thải (CO₂, NOx, SOx, bụi)',status:'Đã tích hợp',statusKey:'done',note:'Theo QCVN'},
          {system:'ERP (SAP/FAST)',purpose:'Sản lượng, tiêu hao, chi phí',status:'Đang triển khai',statusKey:'progress',note:'Hoàn thành Q3/2025'},
          {system:'CMMS',purpose:'Bảo trì thiết bị, lịch bảo dưỡng',status:'Đã tích hợp',statusKey:'done',note:'API'},
          {system:'LIMS (Phòng LAB)',purpose:'Kết quả phân tích mẫu',status:'Đã tích hợp',statusKey:'done',note:'Tự động import'},
          {system:'Hệ thống môi trường',purpose:'Nước thải, chất thải, quan trắc môi trường',status:'Đang triển khai',statusKey:'progress',note:'Hoàn thành Q4/2025'},
          {system:'Cổng dữ liệu đối tác',purpose:'Chia sẻ dữ liệu cho cơ quan quản lý/nhà đầu tư',status:'Kế hoạch',statusKey:'plan',note:'2026'}
        ];
        data.security=['Phân vùng mạng IT/OT','Tường lửa & VPN','Mã hóa dữ liệu (TLS/SSL)','Quản lý tài khoản & phân quyền','Sao lưu dữ liệu tự động (hàng ngày)','Giám sát an ninh mạng (SOC)','Tuân thủ ATTT cấp 2 (theo NĐ 85/2016, NĐ 53/2022)'];
        data.operations=['Hệ thống hoạt động ổn định 24/7','Giám sát tự động tình trạng thiết bị','Cảnh báo sớm khi mất dữ liệu','Hỗ trợ kỹ thuật trong 30 phút','Cập nhật phần mềm định kỳ','Đào tạo người dùng định kỳ','Tài liệu hướng dẫn đầy đủ'];
        data.roadmap=[
          {year:'2025',text:'Hoàn thiện kết nối & chuẩn hóa dữ liệu'},
          {year:'2026',text:'Tích hợp ERP/CMMS\nTriển khai Data Lake'},
          {year:'2027',text:'AI phân tích &\nDự báo năng lượng'},
          {year:'2028',text:'Tích hợp IoT mở rộng\nNhà máy thông minh'},
          {year:'2029',text:'Chia sẻ dữ liệu ESG\ncho đối tác'},
          {year:'2030',text:'Nền tảng dữ liệu mở\n(Net Zero Ready)'}
        ];
        data.documents=[
          {id:'SYSTEM-ARCH',name:'Sơ đồ kiến trúc hệ thống (PDF)'},
          {id:'DATA-PROC',name:'Quy trình quản lý dữ liệu (PDF)'},
          {id:'SECURITY-POLICY',name:'Chính sách bảo mật thông tin (PDF)'},
          {id:'SYSTEM-HANDBOOK',name:'Sổ tay vận hành hệ thống (PDF)'},
          {id:'DATA-TEMPLATE',name:'Biểu mẫu quản lý dữ liệu (Excel)'}
        ];
        data.primary={kind:'flow',title:'Kiến trúc hệ thống thu thập và quản lý dữ liệu',nodes:data.dataFlow.map(x=>[x.label,''])};
        data.secondary={kind:'donut',title:'Chất lượng dữ liệu',labels:data.dataQuality.map(x=>x.label),values:data.dataQuality.map(x=>x.value)};
        data.table={title:'Tích hợp hệ thống',headers:['Hệ thống','Mục đích tích hợp','Trạng thái','Ghi chú'],rows:data.integrations.map(x=>[x.system,x.purpose,x.status,x.note])};
        data.insights=[{title:'Dữ liệu hợp lệ',value:'99.2%',note:'Tăng 0.8% so với 2024',status:'good',icon:'check-circle'},{title:'Tích hợp hoạt động',value:'8 hệ thống',note:'SCADA, CEMS, CMMS, LIMS...',status:'good',icon:'puzzle'},{title:'Sự cố hệ thống',value:'0',note:'An toàn, ổn định',status:'good',icon:'shield-check'}];
      } else if(id==='forecast') {
        data.kpis=[
          kpi('Dự báo điện năng','92.5','GWh','lightning-charge-fill','green','▼ -3.2%','so với KH'),
          kpi('Dự báo than','158','nghìn tấn','hexagon-fill','coal','▼ -4.1%','so với KH'),
          kpi('Dự báo khí/nhiên liệu','12.6','triệu Nm³','fire','orange','▲ +2.5%','so với KH'),
          kpi('Dự báo hơi (Steam)','48.3','nghìn tấn','cloud-haze2-fill','purple','▼ -1.8%','so với KH'),
          kpi('Chi phí năng lượng','182.4','tỷ VNĐ','coin','orange','▼ -5.6%','so với KH'),
          kpi('Dự báo phát thải CO₂','295','nghìn tCO₂','leaf','green','▼ -4.3%','so với KH')
        ];
        data.viewTabs=['Tổng quan','Dự báo nhu cầu','Kế hoạch năng lượng','Ngân sách & Chi phí','Kịch bản & What-if','Báo cáo & Xuất dữ liệu'];
        data.demandTrend={
          categories:monthCats,currentAt:'T6',annual:'1,120 GWh (-3.2% so với KH)',annotationX:'T10',annotationY:120,
          series:[
            {name:'Thực tế',data:[92,78,68,80,73,88,null,null,null,null,null,null]},
            {name:'Dự báo',data:[null,null,null,null,null,86,96,108,119,121,117,112]},
            {name:'Kế hoạch',data:[null,null,null,82,88,98,110,123,132,137,134,128]}
          ]
        };
        data.coalTrend={
          categories:monthCats,currentAt:'T6',annual:'192 nghìn tấn (-4.1% so với KH)',annotationX:'T10',annotationY:18,
          series:[
            {name:'Thực tế',data:[17.2,15.4,13.2,14.6,13.5,14.2,null,null,null,null,null,null]},
            {name:'Dự báo',data:[null,null,null,null,null,14.1,15.2,16.4,17.5,18.4,18.5,17.9]},
            {name:'Kế hoạch',data:[null,null,null,null,14.0,14.9,16.5,18.0,19.1,20.0,19.8,19.2]}
          ]
        };
        data.costTrend={
          categories:monthCats,currentAt:'T6',annual:'2,180 tỷ VNĐ (-5.6% so với KH)',plan:[24.5,26,27.5,29,30,29.5,28.5,27,26,25,24,23],
          series:[
            {name:'Thực tế',data:[22,24,26,28,26,29,null,null,null,null,null,null]},
            {name:'Dự báo',data:[null,null,null,null,null,27.5,26.5,25.2,23.8,22.7,21.9,21.1]},
            {name:'Kế hoạch',data:[24.5,26,27.5,29,30,29.5,28.5,27,26,25,24,23]}
          ]
        };
        data.energyTypes=[
          {type:'Điện năng',unit:'GWh',ytd:'512.3',forecast:'1,120',plan:'1,156',diff:'-36',percent:'-3.2%'},
          {type:'Than',unit:'nghìn tấn',ytd:'88.5',forecast:'192',plan:'200',diff:'-8',percent:'-4.1%'},
          {type:'Khí tự nhiên',unit:'triệu Nm³',ytd:'6.8',forecast:'12.6',plan:'12.3',diff:'+0.3',percent:'+2.5%'},
          {type:'Dầu FO/DO',unit:'nghìn tấn',ytd:'3.2',forecast:'6.8',plan:'7.0',diff:'-0.2',percent:'-2.9%'},
          {type:'Hơi (Steam)',unit:'nghìn tấn',ytd:'26.5',forecast:'48.3',plan:'49.2',diff:'-0.9',percent:'-1.8%'},
          {type:'Nước',unit:'nghìn m³',ytd:'1,240',forecast:'2,680',plan:'2,750',diff:'-70',percent:'-2.5%'}
        ];
        data.scenarios=[
          {name:'Kế hoạch 2025',production:'4,300,000',electricity:'1,156',coal:'200',cost:'2,310',co2:'308'},
          {name:'Cơ sở (Base Case)',production:'4,200,000',electricity:'1,120',coal:'192',cost:'2,180',co2:'295',base:true},
          {name:'Tăng 5% sản lượng',production:'4,515,000',electricity:'1,182',coal:'204',cost:'2,300',co2:'312'},
          {name:'Giảm 5% sản lượng',production:'3,990,000',electricity:'1,058',coal:'182',cost:'2,060',co2:'278'},
          {name:'Tối ưu vận hành',production:'4,200,000',electricity:'1,065',coal:'182',cost:'2,020',co2:'270'},
          {name:'Sử dụng nhiên liệu thay thế',production:'4,200,000',electricity:'1,120',coal:'185',cost:'2,050',co2:'245'}
        ];
        data.assumptions=[
          {label:'Sản lượng clinker (tấn)',value:'4,200,000'},
          {label:'Hệ số điện (kWh/tấn)',value:'267'},
          {label:'Hệ số than (kg/tấn)',value:'45.7'},
          {label:'Hệ số nhiệt thay thế (%)',value:'15%'},
          {label:'Giá điện (VND/kWh)',value:'1,750'},
          {label:'Giá than (VND/tấn)',value:'1,950,000'},
          {label:'Giá khí (VND/Nm³)',value:'8,200'},
          {label:'Giá dầu DO (VND/lít)',value:'18,500'},
          {label:'Thời gian tính',value:'01–12/2025'}
        ];
        data.secTrend={categories:monthCats,currentAt:'T5',annual:'SEC 2025: 267 kWh/tấn (-3.6% so KH)',annotationY:267,series:[
          {name:'Thực tế',data:[302,272,282,268,267,null,null,null,null,null,null,null]},
          {name:'Dự báo',data:[null,null,null,null,267,265,264,262,262,263,264,267]},
          {name:'Mục tiêu',data:[285,270,268,266,264,262,260,258,257,256,255,255]}
        ]};
        data.planningSteps=[
          {title:'Thu thập dữ liệu\nLịch sử & Giả định',items:['Sản lượng kế hoạch','Thông số công nghệ','Giá năng lượng','Ràng buộc vận hành']},
          {title:'Dự báo & Mô hình',items:['Dự báo nhu cầu','Mô hình hồi quy/AI','Kịch bản What-if','Đánh giá rủi ro']},
          {title:'Lập kế hoạch &\nNgân sách',items:['Phân bổ theo tháng/quý','Xác định nguồn cung','Tính chi phí','Phê duyệt kế hoạch']},
          {title:'Theo dõi &\nĐiều chỉnh',items:['So sánh thực tế','Cảnh báo chênh lệch','Cập nhật kịch bản','Báo cáo định kỳ']}
        ];
        data.documents=[
          {id:'M11-ENERGY-DEMAND',name:'Báo cáo dự báo nhu cầu năng lượng (PDF)',type:'pdf'},
          {id:'M11-ENERGY-PLAN',name:'Kế hoạch năng lượng năm 2025 (PDF)',type:'pdf'},
          {id:'M11-SCENARIO',name:'Báo cáo phân tích kịch bản (PDF)',type:'pdf'},
          {id:'M11-BUDGET',name:'Báo cáo ngân sách năng lượng (Excel)',type:'xlsx'},
          {id:'M11-SEC',name:'Biểu đồ xu hướng SEC (PDF)',type:'pdf'}
        ];
        data.primary={kind:'line',title:'Dự báo nhu cầu điện năng',categories:data.demandTrend.categories,series:data.demandTrend.series};
        data.secondary={kind:'bar',title:'Dự báo chi phí năng lượng',categories:data.costTrend.categories,series:data.costTrend.series};
        data.table={title:'Dự báo theo loại năng lượng',headers:['Loại năng lượng','Đơn vị','Thực tế YTD','Dự báo cả năm','Kế hoạch','Chênh lệch','%'],rows:data.energyTypes.map(x=>[x.type,x.unit,x.ytd,x.forecast,x.plan,x.diff,x.percent])};
        data.insights=[{title:'Độ lệch điện năng',value:'-3.2%',note:'So với kế hoạch 2025',status:'good',icon:'lightning-charge'},{title:'Rủi ro chi phí',value:'Khí +2.5%',note:'Giá/nhu cầu cần theo dõi',status:'warn',icon:'exclamation-triangle'},{title:'SEC dự báo',value:'267 kWh/tấn',note:'Tốt hơn kế hoạch 3.6%',status:'good',icon:'graph-down-arrow'}];
      } else if(id==='optimization') {
        data.kpis=[
          kpi('Tiết kiệm chi phí dự kiến','15.8','tỷ VNĐ/năm','coin','green','▼ -12.6%','so với hiện tại'),
          kpi('Giảm điện tiêu thụ','18.2','GWh/năm','lightning-charge-fill','blue','▼ -11.5%','so với hiện tại'),
          kpi('Giảm than tiêu thụ','42.5','nghìn tấn/năm','fire','orange','▼ -8.9%','so với hiện tại'),
          kpi('Giảm phát thải CO₂','28.6','nghìn tCO₂/năm','cloud','purple','▼ -13.4%','so với hiện tại'),
          kpi('Thời gian hoàn vốn (ước tính)','2.8','năm','bar-chart-fill','cyan','với CAPEX 44.2 tỷ VNĐ','')
        ];
        data.viewTabs=['Tổng quan','Tối ưu phụ tải','Tối ưu nguồn năng lượng','Mô phỏng & What-if','Đánh giá hiệu quả & ROI','Khuyến nghị hành động'];
        data.loadShifting={categories:['00:00','02:00','04:00','06:00','08:00','10:00','12:00','14:00','16:00','18:00','20:00','22:00'],annotation:'Giảm đỉnh phụ tải -18 MW (-28%)',annotationY:23,series:[
          {name:'Hiện tại',data:[16,16,17,22,29,33,32,25,33,29,24,20]},
          {name:'Tối ưu',data:[15,15,16,16,17,18,23,23,23,22,21,18]},
          {name:'Giới hạn hợp đồng',data:Array(12).fill(42)}
        ]};
        data.fuelMix={categories:['Than','Khí tự nhiên','Điện','Nhiên liệu khác'],series:[{name:'Hiện tại',data:[480,96,62,12]},{name:'Tối ưu',data:[455,112,55,12]}]};
        data.scenarioCost={categories:['Hiện tại','Kịch bản 1\n(Tối ưu vận hành)','Kịch bản 2\n(Tối ưu nguồn + đầu tư)'],totals:[125.4,112.1,109.6],series:[
          {name:'Than',data:[74,59,55]},
          {name:'Khí tự nhiên',data:[8,14,16]},
          {name:'Điện',data:[38,34,32]},
          {name:'Nhiên liệu khác',data:[5.4,5.1,6.6]}
        ]};
        data.scenarios=[
          {code:'KB0 – Hiện tại',description:'Vận hành hiện tại',cost:'125.4',current:true},
          {code:'KB1 – Tối ưu vận hành',description:'Điều chỉnh lịch, phụ tải, hiệu suất thiết bị',cost:'112.1',saving:'13.3',co2:'23.5',capex:'5.8',payback:'0.4 năm'},
          {code:'KB2 – Thay thế nhiên liệu',description:'Tăng sử dụng khí, giảm than',cost:'109.6',saving:'15.8',co2:'28.6',capex:'44.2',payback:'2.8 năm'},
          {code:'KB3 – Đầu tư thiết bị',description:'Lắp VFD, tối ưu nghiền, thu hồi nhiệt',cost:'104.3',saving:'21.1',co2:'35.2',capex:'62.5',payback:'3.0 năm'},
          {code:'KB4 – Tích hợp BESS',description:'Lưu trữ điện, cắt đỉnh',cost:'101.8',saving:'23.6',co2:'36.8',capex:'88.0',payback:'3.7 năm'},
          {code:'KB5 – Kết hợp toàn diện',description:'KB1 + KB2 + KB3 + BESS',cost:'96.5',saving:'28.9',co2:'42.1',capex:'150.0',payback:'5.2 năm'}
        ];
        data.macc=[
          {short:'Tối ưu vận hành',potential:10,cost:-30,color:'#18ad77'},
          {short:'Cải tạo thiết bị',potential:12,cost:10,color:'#208ee8'},
          {short:'Thay thế nhiên liệu',potential:11,cost:45,color:'#f59c18'},
          {short:'Thu hồi nhiệt thải',potential:13,cost:120,color:'#8d54dc'},
          {short:'Tích hợp BESS',potential:12,cost:250,color:'#f04456'}
        ];
        data.maccNote='42.1 nghìn tCO₂/năm · từ các giải pháp khả thi';
        data.recommendations=[
          {name:'Tối ưu lịch nghiền & phân xưởng',saving:'5.2',co2:'8.6',investment:'1.5',payback:'0.3 năm',priority:'Cao',priorityKey:'high'},
          {name:'Điều chỉnh thông gió & khí nén',saving:'3.1',co2:'5.4',investment:'2.0',payback:'0.6 năm',priority:'Cao',priorityKey:'high'},
          {name:'Thay thế than bằng khí (từng phần)',saving:'4.8',co2:'9.1',investment:'18.0',payback:'2.5 năm',priority:'Trung bình',priorityKey:'medium'},
          {name:'Lắp biến tần (VFD) cho quạt, bơm',saving:'3.6',co2:'4.9',investment:'12.5',payback:'3.5 năm',priority:'Trung bình',priorityKey:'medium'},
          {name:'Thu hồi nhiệt thải phát điện (WHR)',saving:'6.2',co2:'14.0',investment:'45.0',payback:'4.8 năm',priority:'Thấp',priorityKey:'low'}
        ];
        data.decisionFlow=[
          {title:'Xác định\nmục tiêu',items:['Giảm chi phí','Giảm CO₂','Tăng hiệu suất','Ràng buộc vận hành']},
          {title:'Mô phỏng\n& so sánh',items:['Tạo kịch bản','Chạy mô phỏng','So sánh chỉ số','Phân tích rủi ro']},
          {title:'Đánh giá\nhiệu quả',items:['Tính NPV, IRR, ROI','Phân tích MACC','Đánh giá tác động','Xếp hạng ưu tiên']},
          {title:'Phê duyệt &\ntriển khai',items:['Lập kế hoạch','Phê duyệt đầu tư','Theo dõi thực hiện','Đo lường & M&V']}
        ];
        data.documents=[
          {id:'M12-SCENARIO',name:'Báo cáo mô phỏng kịch bản (PDF)',type:'pdf'},
          {id:'M12-SOLUTIONS',name:'Danh mục giải pháp tối ưu (Excel)',type:'xlsx'},
          {id:'M12-FINANCE',name:'Phân tích tài chính & ROI (PDF)',type:'pdf'},
          {id:'M12-MACC',name:'Báo cáo MACC (PDF)',type:'pdf'},
          {id:'M12-PLAN',name:'Kế hoạch triển khai (PDF)',type:'pdf'},
          {id:'M12-INVEST',name:'Biểu mẫu đề xuất đầu tư (Excel)',type:'xlsx'}
        ];
        data.primary={kind:'line',title:'Tối ưu phụ tải điện',categories:data.loadShifting.categories,series:data.loadShifting.series};
        data.secondary={kind:'bar',title:'Tối ưu cơ cấu nhiên liệu',categories:data.fuelMix.categories,series:data.fuelMix.series};
        data.table={title:'Các kịch bản mô phỏng',headers:['Kịch bản','Mô tả','Chi phí','Tiết kiệm','Giảm CO₂','CAPEX','Hoàn vốn'],rows:data.scenarios.map(x=>[x.code,x.description,x.cost,x.saving||'—',x.co2||'—',x.capex||'—',x.payback||'—'])};
        data.insights=[{title:'Kịch bản cân bằng',value:'KB2',note:'Tiết kiệm 15.8 tỷ VNĐ/năm',status:'good',icon:'stars'},{title:'Giảm phát thải',value:'28.6 ktCO₂/năm',note:'-13.4% so với hiện tại',status:'good',icon:'cloud'},{title:'Hoàn vốn',value:'2.8 năm',note:'CAPEX 44.2 tỷ VNĐ',status:'good',icon:'cash-coin'}];
      } else if(id==='iso50001') {
        data.kpis=[
          kpi('Trạng thái tuân thủ','100','%','shield-fill-check','green','Đáp ứng yêu cầu',''),
          kpi('Số bằng chứng','268','','file-earmark-text-fill','purple','▲ +18%','so với 2024'),
          kpi('NCR đang mở','2','','exclamation-triangle-fill','orange','▼ -60%','so với 2024'),
          kpi('Hành động khắc phục (CAPA)','18/20','','clipboard2-check-fill','blue','90%','hoàn thành'),
          kpi('Cơ hội cải tiến','14','','graph-up-arrow','green','8 đã triển khai',''),
          kpi('Mục tiêu 2025','Giảm 8% SEC','','bullseye','red','Đang thực hiện đúng tiến độ','')
        ];
        data.viewTabs=['Tổng quan','Energy Review','Bằng chứng & Tài liệu','Đánh giá nội bộ','Kiểm toán bên ngoài','NCR/CAPA','Cải tiến liên tục'];
        data.certificationRoadmap=[
          {title:'Khởi động dự án',date:'01/2024',done:true},
          {title:'Đào tạo & Nâng cao nhận thức',date:'Q2/2024',done:true},
          {title:'Xây dựng hệ thống tài liệu',date:'Q3/2024',done:true},
          {title:'Đánh giá nội bộ',date:'Q4/2024',done:true},
          {title:'Đánh giá chứng nhận bên ngoài',date:'03/2025',done:true},
          {title:'Duy trì & Cải tiến liên tục',date:'2025 →',done:false}
        ];
        data.compliance=[
          {label:'Bối cảnh tổ chức',clause:4,value:100,color:'#0fae7b'},
          {label:'Lãnh đạo',clause:5,value:100,color:'#19bb9c'},
          {label:'Hoạch định',clause:6,value:100,color:'#f24e5c'},
          {label:'Hỗ trợ',clause:7,value:100,color:'#f1ad1d'},
          {label:'Vận hành',clause:8,value:100,color:'#258ce2'},
          {label:'Đánh giá kết quả',clause:9,value:100,color:'#15b7ce'},
          {label:'Cải tiến',clause:10,value:100,color:'#8a55dc'}
        ];
        data.ncrTrend={categories:['01','02','03','04','05','06','07','08','09','10','11','12'],series:[{name:'NCR mới mở',data:[5,3,4,6,4,2,1,1,2,1,0,0]},{name:'NCR đã đóng',data:[4,3,3,5,3,3,2,1,0,0,0,0]}]};
        data.audits=[
          {type:'Đánh giá nội bộ',time:'11–12/2024',scope:'Toàn nhà máy',owner:'Đội ngũ nội bộ',result:'Đạt',note:'3 NCR (đã đóng)'},
          {type:'Đánh giá bên ngoài (Chứng nhận)',time:'03/2025',scope:'Theo ISO 50001:2024',owner:'Tổ chức chứng nhận',result:'Đạt',note:'Không NCR lớn'},
          {type:'Đánh giá chuyên đề (EnPI/SEU)',time:'04/2025',scope:'Xưởng nghiền, lò nung',owner:'Infras Consult',result:'Đạt',note:'5 khuyến nghị'},
          {type:'Kiểm toán năng lượng',time:'06/2025',scope:'Toàn nhà máy',owner:'Chuyên gia độc lập',result:'Đạt',note:'Tiềm năng tiết kiệm 8–12%'}
        ];
        data.capa={progress:90,note:'Không có CAPA quá hạn · Hệ thống được kiểm soát tốt',items:[
          {label:'Đã hoàn thành',value:18,color:'#0eaa7b'},
          {label:'Đang thực hiện',value:2,color:'#f1a416'},
          {label:'Quá hạn',value:0,color:'#ef4759'},
          {label:'Chưa bắt đầu',value:0,color:'#718fa5'}
        ]};
        data.opportunities=[
          {name:'Tối ưu vận hành lò nung',saving:'12,500',status:'Đã triển khai',statusKey:''},
          {name:'Cải thiện hiệu suất quạt ID/FD',saving:'6,800',status:'Đang thực hiện',statusKey:'progress'},
          {name:'Thu hồi nhiệt thải (WHR)',saving:'20,000',status:'Đang nghiên cứu',statusKey:'progress'},
          {name:'Tối ưu hệ thống khí nén',saving:'3,200',status:'Đã triển khai',statusKey:''},
          {name:'Điều chỉnh công thức phối liệu',saving:'4,500',status:'Kế hoạch 2026',statusKey:'plan'}
        ];
        data.documentSystem=[
          {type:'Chính sách năng lượng',count:'1',version:'v2.0 (01/2025)',status:'Hiệu lực'},
          {type:'Mục tiêu & chỉ tiêu EnMS',count:'6',version:'v1.1 (01/2025)',status:'Hiệu lực'},
          {type:'Quy trình (SOP)',count:'24',version:'v2.0 (02/2025)',status:'Hiệu lực'},
          {type:'Hướng dẫn công việc (WI)',count:'37',version:'v1.3 (03/2025)',status:'Hiệu lực'},
          {type:'Biểu mẫu, hồ sơ',count:'52',version:'v1.2 (03/2025)',status:'Hiệu lực'},
          {type:'Bằng chứng tuân thủ',count:'268',version:'Cập nhật liên tục',status:'Đầy đủ'}
        ];
        data.auditProcess=[
          {title:'Lập kế hoạch',icon:'clipboard',items:['Xác định phạm vi','Thu thập thông tin','Lập kế hoạch chi tiết']},
          {title:'Khảo sát & Đo đạc',icon:'shield-check',items:['Khảo sát hiện trường','Đo đạc, thu thập dữ liệu','Phân tích hiện trạng']},
          {title:'Phân tích & Đánh giá',icon:'file-earmark-bar-graph',items:['Xác định cơ hội tiết kiệm','Đánh giá tính khả thi','Ước tính hiệu quả (kWh, chi phí, CO₂)']},
          {title:'Báo cáo & Kiến nghị',icon:'clipboard-data',items:['Lập báo cáo','Đề xuất giải pháp','Lộ trình triển khai']},
          {title:'Theo dõi & Cải tiến',icon:'clipboard-check',items:['Cập nhật tiến độ','Đánh giá kết quả','Tích hợp vào EnMS']}
        ];
        data.documents=[
          {id:'M13-POLICY',name:'Chính sách năng lượng (PDF)',type:'pdf'},
          {id:'M13-IA-2024',name:'Báo cáo đánh giá nội bộ 2024 (PDF)',type:'pdf'},
          {id:'M13-AUDIT-2025',name:'Báo cáo kiểm toán năng lượng 2025 (PDF)',type:'pdf'},
          {id:'M13-CAPA',name:'Kế hoạch hành động CAPA (Excel)',type:'xlsx'},
          {id:'M13-EVIDENCE',name:'Danh mục bằng chứng (Excel)',type:'xlsx'},
          {id:'M13-ENERGY-REVIEW',name:'Biểu mẫu Energy Review (Excel)',type:'xlsx'}
        ];
        data.primary={kind:'score',title:'Mức độ đáp ứng theo nhóm điều khoản',items:data.compliance.map(x=>[x.label,x.value])};
        data.secondary={kind:'bar',title:'NCR theo thời gian',categories:data.ncrTrend.categories,series:data.ncrTrend.series};
        data.table={title:'Danh sách đánh giá & kiểm toán',headers:['Loại đánh giá','Thời gian','Phạm vi','Đơn vị thực hiện','Kết quả','Ghi chú'],rows:data.audits.map(x=>[x.type,x.time,x.scope,x.owner,x.result,x.note])};
        data.insights=[{title:'Trạng thái tuân thủ',value:'100%',note:'Đáp ứng ISO 50001:2024',status:'good',icon:'shield-check'},{title:'CAPA',value:'18/20',note:'Không có CAPA quá hạn',status:'good',icon:'clipboard-check'},{title:'Cơ hội cải tiến',value:'14',note:'8 cơ hội đã triển khai',status:'good',icon:'graph-up-arrow'}];
      } else if(id==='analytics') {
        data.viewTabs=['Tổng quan','Dự báo nhu cầu','Phát hiện bất thường','Dự báo hiệu suất (EnPI)','Dự báo chi phí & CO₂','Phân tích nguyên nhân (AI)','Bảo trì dự đoán (PdM-Energy)'];
        data.kpis=[kpi('Dự báo điện năng (7 ngày tới)','98.5','GWh','lightning-charge-fill','green','▼ -4.2%','so với kế hoạch'),kpi('Dự báo tiêu thụ than','186','nghìn tấn','clouds-fill','coal','▲ +2.1%','so với kế hoạch'),kpi('Dự báo tiêu thụ nhiệt (hơi)','52.3','nghìn tấn','fire','orange','▼ -3.5%','so với kế hoạch'),kpi('Dự báo chi phí năng lượng','165.4','tỷ VNĐ','currency-dollar','purple','▲ +1.8%','so với kế hoạch'),kpi('Dự báo phát thải CO₂','272','nghìn tCO₂','cloud','green','▼ -5.6%','so với kế hoạch'),kpi('Độ chính xác mô hình','94.2','%','bar-chart-fill','blue','▲ +2.8%','so với tháng trước')];
        const cats=Array.from({length:30},(_,i)=>`${String(i+1).padStart(2,'0')}/06`);
        const actual=[95,90,87,84,86,83,82,80,79,81,80,82,81,83,82,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null];
        const forecast=[null,null,null,null,null,null,null,null,null,null,null,null,null,null,82,85,91,96,100,104,105,102,108,110,106,105,109,111,112,110];
        data.demandForecast={categories:cats,currentAt:'15/06',annotationX:'27/06',annotationY:112,forecastEnd:'112.5 GWh (-4.2% so với KH)',series:[{name:'Thực tế',data:actual},{name:'Dự báo AI',data:forecast}]};
        data.secForecast={categories:cats,currentAt:'15/06',annotationX:'27/06',annotationY:92.3,forecastEnd:'92.3 kWh/tấn (-6.1% so với hiện tại)',series:[{name:'Thực tế',data:[99,97,96,95,94,93,94,94,93,93,92.8,93,92.6,92.5,92.8,...Array(15).fill(null)]},{name:'Dự báo AI',data:[...Array(14).fill(null),92.8,93.2,93.5,94,93.8,93.7,93.9,93.5,93.2,93.1,93,92.8,92.6,92.5,92.4,92.3]}]};
        data.co2Forecast={categories:cats,currentAt:'15/06',annotationX:'27/06',annotationY:8960,forecastEnd:'8,960 tCO₂ (-5.6% so với KH)',series:[{name:'Thực tế',data:[8700,9200,8500,8100,8000,8200,8300,7900,7800,7600,7300,7400,7200,7300,7400,...Array(15).fill(null)]},{name:'Dự báo AI',data:[...Array(14).fill(null),7400,7600,7900,8200,8000,8100,7900,7800,7600,7700,7500,7400,7350,7300,7250,7200]}]};
        data.anomalies=[{time:'10/06 08:15',asset:'Quạt ID - Lò nung',metric:'Điện năng (kW)',value:'1,850',threshold:'> 1,500',severity:'Cao',cause:'Bám bẩn cánh quạt, mất độ khí cao'},{time:'10/06 06:42',asset:'Nghiền than 2',metric:'SEC (kWh/tấn)',value:'28.5',threshold:'> 24',severity:'Cao',cause:'Độ ẩm than tăng, bi mòn'},{time:'09/06 23:10',asset:'Bơm nước làm mát',metric:'Hiệu suất (%)',value:'62',threshold:'< 75',severity:'Trung bình',cause:'Tắc lọc, cavitation'},{time:'09/06 14:35',asset:'Máy nén khí',metric:'Điện năng (kW)',value:'420',threshold:'> 350',severity:'Trung bình',cause:'Rò rỉ khí, áp suất cao'},{time:'08/06 11:20',asset:'Quạt làm mát clinker',metric:'Rung động (mm/s)',value:'7.2',threshold:'> 5',severity:'Thấp',cause:'Mất cân bằng, cần kiểm tra'}];
        data.rootCauses=[{label:'Độ ẩm nguyên liệu cao',value:32,color:'#e94956'},{label:'Hiệu suất thiết bị giảm',value:24,color:'#f16d1b'},{label:'Chế độ vận hành chưa tối ưu',value:18,color:'#f0a418'},{label:'Bám bẩn trao đổi nhiệt',value:12,color:'#1796df'},{label:'Chất lượng than/điện biến động',value:8,color:'#438ddb'},{label:'Yếu tố môi trường (nhiệt độ)',value:6,color:'#7a99b1'}];
        data.rootCauseConclusion='Độ ẩm nguyên liệu và hiệu suất quạt ID là 2 nguyên nhân chính làm tăng SEC trong 7 ngày qua.';
        data.maintenance=[{asset:'Quạt ID',indicator:'Hiệu suất',probability:'78%',eta:'≤ 14 ngày',recommendation:'Vệ sinh cánh quạt'},{asset:'Nghiền liệu 1',indicator:'Rung động',probability:'65%',eta:'≤ 21 ngày',recommendation:'Kiểm tra bi nghiền'},{asset:'Máy nén khí',indicator:'Nhiệt độ',probability:'62%',eta:'≤ 30 ngày',recommendation:'Kiểm tra rò rỉ'},{asset:'Bơm nước 3',indicator:'Hiệu suất',probability:'48%',eta:'≤ 45 ngày',recommendation:'Bảo dưỡng định kỳ'},{asset:'Quạt làm mát',indicator:'Dòng điện',probability:'42%',eta:'≤ 60 ngày',recommendation:'Cân bằng động'}];
        data.modelAccuracy=[{metric:'Điện năng',mape:'3.8',r2:'0.92',note:'Tốt'},{metric:'Than',mape:'5.1',r2:'0.88',note:'Tốt'},{metric:'Hơi (Steam)',mape:'4.6',r2:'0.90',note:'Tốt'},{metric:'SEC (kWh/tấn)',mape:'6.2',r2:'0.85',note:'Khá'},{metric:'Chi phí năng lượng',mape:'4.1',r2:'0.91',note:'Tốt'},{metric:'Phát thải CO₂',mape:'5.3',r2:'0.87',note:'Tốt'}];
        data.valueCards=[{title:'Giảm chi phí năng lượng',value:'8–12%',icon:'bar-chart-fill',tone:'green'},{title:'Giảm phát thải CO₂',value:'5–15%',icon:'cloud',tone:'red'},{title:'Cảnh báo sớm sự cố',value:'≥ 7 ngày',icon:'clock-fill',tone:'blue'},{title:'Giảm thời gian dừng máy',value:'20–40%',icon:'wrench-adjustable',tone:'orange'},{title:'Tăng độ tin cậy vận hành',value:'> 95%',icon:'shield-check',tone:'purple'},{title:'Hỗ trợ đạt mục tiêu ESG',value:'100%',icon:'leaf-fill',tone:'green'}];
        data.process=[{title:'Thu thập & chuẩn hóa dữ liệu',items:['SCADA/DCS','Công tơ, cảm biến IoT','Dữ liệu sản xuất (MES)','Thời tiết, giá năng lượng']},{title:'Làm sạch & tích hợp',items:['Data Lake','Kiểm tra chất lượng','Tạo đặc trưng (Feature)','Đồng bộ thời gian']},{title:'Huấn luyện mô hình AI',items:['Machine Learning','Deep Learning','Hiệu chỉnh theo đặc thù NM','Đánh giá độ chính xác']},{title:'Triển khai & vận hành',items:['Dự báo & Cảnh báo','Phân tích nguyên nhân','Khuyến nghị hành động','Liên tục học & cải thiện']}];
        data.documents=[{id:'M14-AI-METHOD',name:'Mô hình AI & Phương pháp luận (PDF)',type:'pdf'},{id:'M14-GUIDE',name:'Hướng dẫn sử dụng M14 (PDF)',type:'pdf'},{id:'M14-FORECAST',name:'Báo cáo dự báo tháng (PDF)',type:'pdf'},{id:'M14-ANOMALY',name:'Báo cáo phân tích bất thường (PDF)',type:'pdf'},{id:'M14-FEATURES',name:'Danh mục biến số & thuật toán (Excel)',type:'xlsx'},{id:'M14-EVAL',name:'Biểu mẫu đánh giá mô hình (Excel)',type:'xlsx'}];
        data.primary={kind:'line',title:'Dự báo nhu cầu điện năng',categories:cats,series:data.demandForecast.series}; data.secondary={kind:'bar',title:'Nguyên nhân gốc',categories:data.rootCauses.map(x=>x.label),series:[{name:'Tỷ trọng',data:data.rootCauses.map(x=>x.value)}]}; data.table={title:'Bất thường',headers:['Thiết bị','Chỉ số','Giá trị','Mức độ'],rows:data.anomalies.map(x=>[x.asset,x.metric,x.value,x.severity])}; data.insights=[{title:'Độ chính xác model',value:'94.2%',note:'Phiên bản v2.1',status:'good',icon:'cpu'}];
      } else if(id==='digital-twin') {
        data.viewTabs=['Tổng quan','Mô hình & Cấu trúc','Mô phỏng & What-if','Hiệu chuẩn mô hình','Liên kết thời gian thực','Ứng dụng nghiệp vụ','Báo cáo & Xuất dữ liệu']; data.modelTabs=['3D View','Sơ đồ quy trình','Sơ đồ năng lượng','Danh sách thiết bị']; data.energyTabs=['Điện','Than','Nhiệt (Hơi)','Khí/Nhiên liệu','Tổng hợp']; data.compareTabs=['Điện tiêu thụ','Than tiêu thụ','SEC','Chi phí','Phát thải CO₂'];
        data.kpis=[kpi('Điện tiêu thụ','98.5','GWh/tháng','lightning-charge-fill','green','▼ -4.2%','so với kế hoạch'),kpi('Than tiêu thụ','186','nghìn tấn','clouds-fill','coal','▲ +2.1%','so với kế hoạch'),kpi('Nhiệt năng (Nhiên liệu thay thế)','52.3','nghìn tấn','fire','orange','▼ -3.5%','so với kế hoạch'),kpi('Chi phí năng lượng','165.4','tỷ VNĐ','currency-dollar','purple','▲ +1.8%','so với kế hoạch'),kpi('Phát thải CO₂','272','nghìn tCO₂','cloud','green','▼ -5.6%','so với kế hoạch'),kpi('Hiệu suất tổng thể (OEE-Energy)','94.2','%','speedometer2','orange','▲ +2.8%','so với tháng trước')];
        data.assets=[{id:'mine',name:'Mỏ đá vôi',x:10,y:30,tag:'DT-MINE'},{id:'raw',name:'Nghiền liệu',x:31,y:33,tag:'DT-RAW'},{id:'coal',name:'Nghiền than',x:35,y:63,tag:'DT-COAL'},{id:'kiln',name:'Lò nung',x:62,y:39,tag:'DT-KILN'},{id:'heat',name:'Tháp trao đổi nhiệt',x:50,y:18,tag:'DT-PH'},{id:'cooler',name:'Làm mát clinker',x:72,y:49,tag:'DT-COOL'},{id:'packing',name:'Đóng bao & Xuất hàng',x:83,y:79,tag:'DT-PACK'}];
        data.energyFlow=[[{name:'Điện lưới',value:'42 MW',icon:'lightning-charge',tone:'blue'},{name:'Tự phát',value:'18 MW',icon:'battery-charging',tone:'blue'},{name:'Than',value:'22 t/h',icon:'clouds',tone:'gray'},{name:'Nhiên liệu thay thế',value:'6 t/h',icon:'leaf',tone:'green'},{name:'Hơi',value:'45 t/h',icon:'fire',tone:'orange'},{name:'Nước làm mát',value:'1,200 m³/h',icon:'droplet',tone:'blue'}],[{name:'Nghiền liệu',value:'25 MW',icon:'boxes',tone:'blue'},{name:'Lò nung',value:'48 MW',icon:'fire',tone:'orange'},{name:'Nghiền xi măng',value:'18 MW',icon:'gear',tone:'green'},{name:'Phụ trợ',value:'9 MW',icon:'plus-square',tone:'gray'}],[{name:'Clinker',value:'3,500 t/ngày',icon:'box-seam',tone:'green'},{name:'Xi măng',value:'4,200 t/ngày',icon:'bag',tone:'green'}]];
        data.modelStatus=[{label:'Kết nối dữ liệu thời gian thực',value:'Đang hoạt động',icon:'broadcast-pin'},{label:'Độ chính xác mô hình',value:'±5.2% (đạt yêu cầu)',icon:'check2-square'},{label:'Lần hiệu chuẩn gần nhất',value:'05/06/2025',icon:'clipboard-check'},{label:'Trạng thái mô hình',value:'Ổn định',icon:'check-circle'},{label:'Số thiết bị đã mô hình hóa',value:'352 / 368 (96%)',icon:'calendar3'},{label:'Phiên bản mô hình',value:'v2.1.0',icon:'info-circle'}];
        data.scenarios=[{name:'Tăng sản lượng clinker 10%'},{name:'Tối ưu vận hành (AI)'},{name:'Tăng AFR 30%'}]; data.scenario={note:'Kịch bản khả thi. SEC cải thiện nhờ tối ưu vận hành.',rows:[{metric:'Sản lượng clinker (t/ngày)',current:'3,500',scenario:'3,850',delta:'+350',percent:'+10.0%'},{metric:'Điện tiêu thụ (MWh/ngày)',current:'3,200',scenario:'3,420',delta:'+220',percent:'+6.9%'},{metric:'Than tiêu thụ (t/ngày)',current:'720',scenario:'770',delta:'+50',percent:'+6.9%'},{metric:'Nhiên liệu thay thế (t/ngày)',current:'180',scenario:'200',delta:'+20',percent:'+11.1%'},{metric:'SEC (kWh/t clinker)',current:'91.4',scenario:'88.8',delta:'-2.6',percent:'-2.8%'},{metric:'Chi phí năng lượng (tỷ VNĐ/tháng)',current:'165.4',scenario:'176.2',delta:'+10.8',percent:'+6.5%'},{metric:'Phát thải CO₂ (tCO₂/ngày)',current:'8,960',scenario:'9,550',delta:'+590',percent:'+6.6%'}]};
        data.comparison={labels:['Hiện tại','Tăng clinker 10%','Tối ưu vận hành (AI)','Tăng AFR 30%'],'Điện tiêu thụ':{values:[3200,3420,3050,2780]},'Than tiêu thụ':{values:[720,770,650,580]},'SEC':{values:[91.4,88.8,85.2,86.1]},'Chi phí':{values:[165.4,176.2,150.1,148.8]},'Phát thải CO₂':{values:[8960,9550,7900,7200]}};
        data.applications=[{name:'Đánh giá phương án đầu tư, cải tạo',icon:'clipboard-data'},{name:'Tối ưu cấu hình thiết bị',icon:'gear'},{name:'Lập kế hoạch sản xuất – năng lượng',icon:'calendar3'},{name:'Đào tạo vận hành (Operator Training)',icon:'award'},{name:'Phân tích sự cố (Root Cause)',icon:'fire'},{name:'Tích hợp AI & Tối ưu hóa (M16)',icon:'stars'}]; data.roadmap=[{title:'Xây dựng mô hình cơ bản',date:'Q2/2025'},{title:'Hiệu chuẩn & Kết nối RT',date:'Q3/2025'},{title:'Mô phỏng & Ứng dụng',date:'Q4/2025'},{title:'Tích hợp AI & Tối ưu',date:'2026'}];
        data.documents=[{id:'M15-ARCH',name:'Kiến trúc Digital Twin (PDF)',type:'pdf'},{id:'M15-GUIDE',name:'Hướng dẫn xây dựng mô hình (PDF)',type:'pdf'},{id:'M15-CAL',name:'Báo cáo kết quả mô phỏng (PDF)',type:'pdf'},{id:'M15-ASSET',name:'Danh mục thiết bị đã mô hình hóa (Excel)',type:'xlsx'},{id:'M15-SCENARIO',name:'Biểu mẫu kịch bản What-if (Excel)',type:'xlsx'}];
        data.primary={kind:'twin',title:'Digital Twin',assets:data.assets.map(x=>[x.name,'',96,''])}; data.secondary={kind:'bar',title:'So sánh mô phỏng',categories:data.comparison.labels,series:[{name:'Điện',data:data.comparison['Điện tiêu thụ'].values}]}; data.table={title:'Tài sản',headers:['Tài sản','Tag','Trạng thái'],rows:data.assets.map(x=>[x.name,x.tag,'Đồng bộ'])}; data.insights=[{title:'Độ chính xác',value:'94.8%',note:'Digital Twin v2.1',status:'good',icon:'check-circle'}];
      } else if(id==='ai-decision') {
        data.viewTabs=['Tổng quan','Tối ưu chi phí năng lượng','Tối ưu phụ tải & Peak Shaving','Tối ưu phối trộn nhiên liệu','Lập lịch vận hành tối ưu','Đánh giá đa kịch bản','Kết nối điều khiển (M17)'];
        data.kpis=[kpi('Tiết kiệm chi phí (ước tính)','15.8','tỷ VNĐ/tháng','database-check','green','▼ -12.6%','so với hiện tại'),kpi('Giảm điện tiêu thụ','18.2','GWh/tháng','lightning-charge-fill','blue','▼ -11.5%','so với hiện tại'),kpi('Giảm than tiêu thụ','42.5','nghìn tấn/tháng','fire','orange','▼ -8.9%','so với hiện tại'),kpi('Giảm phát thải CO₂','28.6','nghìn tCO₂/tháng','cloud','purple','▼ -13.4%','so với hiện tại'),kpi('Giảm công suất đỉnh','12.5','MW','bar-chart-fill','green','▼ -20.8%','so với hiện tại')];
        data.loadCurve={categories:Array.from({length:12},(_,i)=>`${String(i*2).padStart(2,'0')}:00`),series:[{name:'Hiện tại',data:[18,17,18,25,33,38,37,29,35,30,26,22]},{name:'Tối ưu (AI)',data:[18,18,18,18,19,22,24,24,28,27,25,20]},{name:'Giới hạn hợp đồng',data:Array(12).fill(42)}]}; data.fuelMix={categories:['Than','Khí tự nhiên','Điện','Nhiên liệu khác'],series:[{name:'Hiện tại',data:[480,96,62,12]},{name:'Tối ưu (AI)',data:[440,112,55,10]}]};
        data.pareto={points:Array.from({length:24},(_,i)=>({x:12+i*3.1,y:78-i*2.1,label:`PA-${i+1}`,type:i===4?'optimal':''})),current:{x:86,y:65,label:'(189.3; 42.1)'},optimal:{x:27,y:35,label:'(165.4; 27.8)'}};
        data.solutions=[{code:'PA-01',name:'Tối ưu chi phí (năng lượng)',saving:'15.8',electricity:'18.2',coal:'42.5',co2:'28.6',rank:'Khuyến nghị'},{code:'PA-02',name:'Tối ưu phát thải CO₂',saving:'14.2',electricity:'16.5',coal:'39.8',co2:'32.1',rank:'Khả thi'},{code:'PA-03',name:'Tối ưu phụ tải đỉnh',saving:'13.6',electricity:'14.8',coal:'35.2',co2:'24.5',rank:'Khả thi'},{code:'PA-04',name:'Tối ưu sản lượng (+10% clinker)',saving:'11.9',electricity:'-5.2',coal:'-8.6',co2:'-6.1',rank:'Xem xét'},{code:'PA-05',name:'Tối ưu kết hợp (năng lượng + CO₂)',saving:'15.0',electricity:'17.1',coal:'41.0',co2:'30.8',rank:'Khả thi'}];
        data.constraints=['Sản lượng clinker ≥ kế hoạch','Chất lượng sản phẩm đạt chuẩn','Thiết bị trong giới hạn vận hành','Giới hạn công suất đỉnh (hợp đồng)','Ràng buộc môi trường (NOx, SOx, CO₂)','An toàn vận hành','Chi phí đầu tư trong ngân sách']; data.process=[{title:'Xác định mục tiêu & ràng buộc',items:['Chi phí / Năng lượng / CO₂ / Peak / Sản lượng']},{title:'Chạy mô hình tối ưu (AI + Digital Twin)',items:['MILP / Heuristic / Reinforcement Learning','Tạo & đánh giá các phương án']},{title:'Đánh giá & lựa chọn phương án',items:['Rủi ro – lợi ích','Trình duyệt & phê duyệt']},{title:'Triển khai & Giám sát',items:['Tạo lịch vận hành, gửi setpoint (M17)','Theo dõi kết quả thực tế & M&V']}];
        data.outcomes=[{label:'ROI (năm)',value:'1.8',icon:'currency-dollar'},{label:'Thời gian hoàn vốn',value:'21 tháng',icon:'clock'},{label:'NPV (5 năm)',value:'68.5 tỷ VNĐ',icon:'bar-chart-fill'},{label:'Giảm CO₂ tích lũy (5 năm)',value:'1,720 nghìn tCO₂',icon:'leaf-fill'},{label:'Đạt mục tiêu ESG & ISO 50001',value:'✓',icon:'trophy'}]; data.integrations=[{name:'SCADA/DCS',note:'Gửi setpoint',icon:'clipboard-data'},{name:'EMS',note:'Quản lý phụ tải',icon:'droplet-fill'},{name:'Digital Twin',note:'Mô phỏng',icon:'cpu'},{name:'CMMS',note:'Bảo trì tối ưu',icon:'gear'},{name:'BESS',note:'Điều khiển lưu trữ',icon:'battery-charging'}]; data.documents=[{id:'M16-OPT',name:'Báo cáo tối ưu vận hành (PDF)',type:'pdf'},{id:'M16-SOL',name:'Danh sách phương án & đánh giá (Excel)',type:'xlsx'},{id:'M16-FIN',name:'Phân tích tài chính & ROI (PDF)',type:'pdf'},{id:'M16-MACC',name:'Báo cáo MACC (PDF)',type:'pdf'},{id:'M16-PLAN',name:'Kế hoạch triển khai (PDF)',type:'pdf'},{id:'M16-CAPEX',name:'Biểu mẫu đề xuất đầu tư (Excel)',type:'xlsx'}];
        data.primary={kind:'line',title:'Load shifting',categories:data.loadCurve.categories,series:data.loadCurve.series}; data.secondary={kind:'bar',title:'Fuel mix',categories:data.fuelMix.categories,series:data.fuelMix.series}; data.table={title:'Phương án',headers:['PA','Mô tả','Tiết kiệm','Đánh giá'],rows:data.solutions.map(x=>[x.code,x.name,x.saving,x.rank])}; data.insights=[{title:'Phương án tốt nhất',value:'PA-01',note:'Tối ưu chi phí',status:'good',icon:'stars'}];
      } else if(id==='autonomous') {
        data.viewTabs=['Tổng quan','Mức độ tự động hóa','Giám sát & Điều khiển','Tự học & Cải thiện','An toàn & Tuân thủ','Lịch sử quyết định','Chỉ số hiệu quả','Cấu hình & Quyền hạn'];
        data.kpis=[kpi('Mức độ tự động hóa hiện tại','L3','','gear-wide-connected','coal','','Có giám sát của con người'),kpi('Tiết kiệm năng lượng','18.5','%','lightning-charge-fill','green','','so với vận hành thủ công'),kpi('Giảm chi phí năng lượng','28.6','tỷ VNĐ/tháng','currency-dollar','purple','▼ -18.5%',''),kpi('Giảm phát thải CO₂','42.1','nghìn tCO₂/tháng','cloud','green','▼ -20.8%',''),kpi('Tỷ lệ khuyến nghị được thực thi','92.3','%','bar-chart-fill','blue','▲ +12.6%',''),kpi('An toàn vận hành','100','%','shield-fill-check','red','','Trong giới hạn cho phép')];
        data.closedLoop={nodes:[{title:'Dữ liệu thời gian thực',note:'SCADA/DCS/EMS · IoT – Meters – Sensors'},{title:'Hiểu & Phân tích',note:'AI Analytics (M14) · Dự báo & Nhận diện'},{title:'Tối ưu & Lập lệnh',note:'Optimization (M16) · Ràng buộc & Mục tiêu'},{title:'Điều khiển thiết bị',note:'DCS/PLC/EMS/BESS · Setpoint – Logic – API'},{title:'Đo lường & Xác thực',note:'M&V – EnPI – KPI · ISO 50001 – Báo cáo'},{title:'Tự học',note:'Machine Learning · Cập nhật mô hình'}]};
        data.levels=[{code:'L4',title:'Tự động hoàn toàn',note:'Tự tối ưu liên tục, tự thích ứng',stage:'Tương lai (sau 2030)',tone:'red'},{code:'L3',title:'Tự động có giám sát',note:'AI tự điều chỉnh trong giới hạn',stage:'Giai đoạn 2028–2030',tone:'orange'},{code:'L2',title:'Đề xuất & Phê duyệt',note:'AI đề xuất, người vận hành duyệt',stage:'Triển khai 2026–2028',tone:'yellow'},{code:'L1',title:'Tư vấn thông minh',note:'AI phân tích & khuyến nghị',stage:'Đang triển khai',tone:'blue'},{code:'L0',title:'Giám sát',note:'Chỉ thu thập và hiển thị',stage:'Hiện tại',tone:''}];
        data.process=[{title:'Nhận dữ liệu & trạng thái',note:'Từ SCADA, IoT, EMS, Digital Twin',icon:'cpu'},{title:'Phân tích & Dự báo',note:'AI Analytics (M14)',icon:'bar-chart'},{title:'Tối ưu & Lập phương án',note:'AI Optimization (M16)',icon:'shield-check'},{title:'Phê duyệt / Tự thực thi',note:'Theo cấp độ L1–L4',icon:'check-square'},{title:'Điều khiển thiết bị',note:'Gửi setpoint tới DCS/PLC/EMS',icon:'gear'},{title:'Kiểm tra & Đánh giá',note:'M&V, so sánh kết quả thực tế',icon:'bullseye'},{title:'Tự học & Cải thiện',note:'Cập nhật mô hình, nâng hiệu quả',icon:'arrow-clockwise'}];
        data.safety=['Luôn tuân thủ giới hạn vận hành','Không vượt ràng buộc an toàn','Cơ chế Human Override (dừng khẩn cấp)','Phân quyền theo vai trò','Ghi log đầy đủ mọi quyết định','Tuân thủ ISO 50001 & quy định pháp lý']; data.guardrails=['Giới hạn kỹ thuật thiết bị','Liên động an toàn với DCS','Phát hiện bất thường & dừng tự động','Cảnh báo đa kênh (SCADA/Email/SMS)','Cơ chế rollback khi có rủi ro'];
        data.pilot={categories:['01/06','05/06','10/06','15/06','20/06','25/06','30/06'],series:[{name:'Vận hành thường (MW)',data:[72,74,70,68,66,62,58]},{name:'Tự động điều hành (MW)',data:[51,52,53,55,57,58,55]},{name:'Giới hạn vận hành',data:[85,85,85,85,85,85,85]}]}; data.impact={categories:['Điện năng\n(GWh)','Chi phí\n(tỷ VNĐ)','Phát thải CO₂\n(nghìn tCO₂)','SEC\n(kWh/tấn)'],series:[{name:'Trước M17',data:[98.5,165.4,272,92.3]},{name:'Sau M17',data:[80,134,215,76.5]}]}; data.decisionLog=[{time:'10/06 09:15',decision:'Giảm tải quạt ID -4% (Xưởng nghiền)',source:'AI Agent',status:'Đã thực thi'},{time:'10/06 08:40',decision:'Chuyển nghiền liệu sang khung giờ thấp điểm',source:'AI Agent',status:'Đã thực thi'},{time:'10/06 06:20',decision:'Tăng tỷ lệ thay thế nhiệt 5%',source:'AI Agent',status:'Đã duyệt'},{time:'09/06 22:10',decision:'Tối ưu phân bổ tải lò nung',source:'AI Agent',status:'Đã thực thi'},{time:'09/06 14:35',decision:'Điều chỉnh setpoint hệ thống khí nén',source:'AI Agent',status:'Đang theo dõi'}];
        data.primary={kind:'flow',title:'Closed-loop',nodes:data.closedLoop.nodes.map(x=>[x.title,x.note])}; data.secondary={kind:'score',title:'Autonomy levels',items:data.levels.map((x,i)=>[x.code,100-i*18])}; data.table={title:'Nhật ký quyết định',headers:['Thời gian','Quyết định','Nguồn','Trạng thái'],rows:data.decisionLog.map(x=>[x.time,x.decision,x.source,x.status])}; data.insights=[{title:'Autonomy level',value:'L3',note:'Supervised automation',status:'good',icon:'robot'}];
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
