'use strict';

// Initial display values for the preview. The diagram DOM exposes the same keys
// through data-value attributes; a future API can update them without redrawing.
const steam = {steamPressureMpa:17.3,steamTemperatureC:541,reheatPressureMpa:4.18,reheatTemperatureC:541,coalFeedTph:886,coalStockTonnes:886000,unitCapacityMw:300};
const units = {};
[300.2,282.2,0,296].forEach((power,i)=>{
  const n=i+1;
  Object.assign(units,{['unit'+n+'PowerMw']:power,['unit'+n+'CoalTph']:[942,903,0,907][i],['unit'+n+'State']:i===2?'stopped':'running'});
});
module.exports = {
  overview:{...steam,capacityMw:1200,feedwaterPressureMpa:25,feedwaterTemperatureC:245,coolingTemperatureC:28.4,renewableMw:12},
  realtime:{...steam,...units,totalPowerMw:871,millsRunning:3,millsTotal:3,millsPowerMw:21.5,feedwaterPressureMpa:25,feedwaterTemperatureC:245,steamFlowTph:850,coolingPowerMw:28.6,foFeedTph:0},
  boiler:{...steam,...units,boilerCapacityTph:996,boilerCount:4,coolingFlowM3s:6.11,coolingHeadM:17,pumpCount:6,pumpPowerKw:1500},
  fuel:{...units,shipCapacityTonnes:30000,unloadDays:2.5,unloadCapacityTph:1200,unloadLines:2,stockCapacityTonnes:300000,stockTonnes:156200,stockPercent:52.1,stockDays:37.9,conveyorLines:2,conveyorCapacityTph:1000,millCount:5,millCapacityTph:86,millsRunning:4,millLoadMinTph:78,millLoadMaxTph:84},
  emissions:{unitCapacityMw:300,unitState:'running',noxInMgNm3:320,noxOutMgNm3:145,scrEfficiency:54.7,dustInMgNm3:850,dustOutMgNm3:12,espEfficiency:98.6,so2InMgNm3:1050,so2OutMgNm3:82,fgdEfficiency:92.2,stackHeightM:180},
  seu:{...units,unitCapacityMw:300,gridVoltageKv:220,generatorVoltageKv:20,transformerMva:400,auxVoltageKv:6.3,solarMw:8,windMw:5,solarOutputMw:7.2,windOutputMw:4.8,
    unit1PumpMw:2.8,unit1FanMw:3.2,unit1CoolingMw:1.6,unit1MillMw:5.1,unit1OtherMw:1.5,
    unit2PumpMw:2.6,unit2FanMw:3,unit2CoolingMw:1.6,unit2MillMw:5,unit2OtherMw:1.7,
    unit3PumpMw:0,unit3FanMw:0,unit3CoolingMw:0,unit3MillMw:0,unit3OtherMw:0,
    unit4PumpMw:2.4,unit4FanMw:3.1,unit4CoolingMw:1.5,unit4MillMw:4.8,unit4OtherMw:1.8},
  twin:{powerMw:598,efficiencyPercent:41.6,heatRateKjKwh:7520,auxPercent:6.1}
};
