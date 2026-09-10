/* HES protocol adapter. Reuses the existing JWT ticket endpoint and device ACL. */
(function(){
 'use strict';
 window.EnmsRealtime={connect(deviceIds,onTelemetry,onStatus){
   const devices=[...new Set(deviceIds.map(String))];
   if(!devices.length||devices.length>100)throw new Error('Phạm vi thiết bị HES không hợp lệ');
   let ws,timer,watchdog,stopped=false,attempt=0,lastMessage=0;
   const status=(detail)=>{onStatus?.(detail);window.dispatchEvent(new CustomEvent('enms:socket-status',{detail}));};
   async function open(){
     if(stopped)return;
     try{
       const response=await fetch('/api/hes/ws-ticket',{method:'POST',headers:{'Content-Type':'application/json',Authorization:'Bearer '+(localStorage.getItem('hes_login_token')||'')},body:JSON.stringify({devices})});
       if(!response.ok){status({connected:false,authError:[401,403].includes(response.status)});if([401,403].includes(response.status)){stopped=true;return;}throw new Error('Không lấy được vé HES');}
       const data=await response.json();if(stopped)return;
       ws=new WebSocket(data.wsUrl,['hes104-v1','ticket.'+data.ticket]);
       ws.onopen=()=>{attempt=0;lastMessage=Date.now();status({connected:true,stale:false});};
       ws.onmessage=event=>{let message;try{message=JSON.parse(event.data);}catch{return;}
         if(message?.type==='READY'){ws.send(JSON.stringify({type:'SUBSCRIBE',devices}));return;}
         if(!Array.isArray(message))return;
         const rows=message.filter(r=>Array.isArray(r)&&devices.includes(String(r[1])));
         if(rows.length){lastMessage=Date.now();status({connected:true,stale:false});onTelemetry(rows);}
       };
       ws.onerror=()=>status({connected:false});
       ws.onclose=()=>{status({connected:false});schedule();};
     }catch{status({connected:false});schedule();}
   }
   function schedule(){if(stopped||timer)return;timer=setTimeout(()=>{timer=null;open();},Math.min(30000,1000*2**attempt++));}
   watchdog=setInterval(()=>{if(ws?.readyState===WebSocket.OPEN&&Date.now()-lastMessage>120000)status({connected:true,stale:true});},10000);
   open();return {close(){stopped=true;clearTimeout(timer);clearInterval(watchdog);if(ws){ws.onclose=null;ws.close();}}};
 }};
})();
