var socket = new WebSocket("wss://smartgrid.ifc.com.vn:6331");
socket.onopen = function () {
  //console.log("Connected to socket server AMI");
};
socket.onmessage = function (event) {
  if (event.data instanceof Blob) {
    reader = new FileReader();
    reader.onload = () => {
      var data = JSON.parse(reader.result);

      var log_data = "";
      if (data != null) {
        var imei = data.imei;
        var socongto = data.socongto;
        var time = formatDateTime(data.time);
        var value = data.value;
        if (data.sukien != 'C_7_0' && data.sukien != 'C_51_13_1') {
          var sukien = getTensukien(data.sukien, value);
          if (value.indexOf('STOP') != -1) {
            createToast("Khách hàng: " + socongto + "; " + sukien + " - Thời gian: " + time, value);
          }
          else if (value.indexOf('START') != -1) {
            createToast("Khách hàng: " + socongto + "; " + sukien + " - Thời gian: " + time, value);
          }
          else {
            createToast("Khách hàng: " + socongto + "; " + sukien + " - Thời gian: " + time, value);
          }
        }

        // sự kiện điện áp thấp -----------------------------------------------
        var skiendat = "0";
        skiendat = getSukien_dienapthap(data.sukien);
        if (skiendat == '1') {
          var sukien = getTensukien(data.sukien, value);
          //console.log(event.data);
          createToast_dat("Điểm đo : " + imei + " - " + sukien + " - Thời gian: " + time, value);
        }
      }
    };

    reader.readAsText(event.data);
  } else {
    //console.log("Data: " + event.data);
    var data = JSON.parse(event.data);
    var log_data = "";
    if (data != null) {
      var imei = data.imei;
      var socongto = data.socongto;
      var time = formatDateTime(data.time);
      var value = data.value;
      if (data.sukien != 'C_7_0' && data.sukien != 'C_51_13_1') {
        var sukien = getTensukien(data.sukien, value);
        if (value.indexOf('STOP') != -1) {
          createToast("Khách hàng: " + socongto + "; " + sukien + " - Thời gian: " + time, value);
        }
        else if (value.indexOf('START') != -1) {
          createToast("Khách hàng: " + socongto + "; " + sukien + " - Thời gian: " + time, value);
        }
        else {
          createToast("Khách hàng: " + socongto + "; " + sukien + " - Thời gian: " + time, value);
        }
      }

      // sự kiện điện áp thấp -----------------------------------------------
      var skiendat = "0";
      skiendat = getSukien_dienapthap(data.sukien);
      if (skiendat == '1') {
        var sukien = getTensukien(data.sukien, value);
        //console.log(event.data);
        createToast_dat("Điểm đo : " + imei + " - " + sukien + " - Thời gian: " + time, value);
      }

    }
  };
  socket.onclose = function () {
    //console.log("Disconnected from socket server.");
  };

  function createToast_dat(msg, type) {
    toastr.error(msg, "Thông báo", {
      positionClass: "toast-bottom-right " + type,
      timeOut: 0,//5e3
      closeButton: !0,
      debug: !1,
      newestOnTop: !0,
      progressBar: !0,
      preventDuplicates: !0,
      onclick: function () {
        location.href = "/sukiencongto";

      },
      showDuration: "2000",
      hideDuration: "1000",
      extendedTimeOut: "1000",
      showEasing: "swing",
      hideEasing: "linear",
      showMethod: "fadeIn",
      hideMethod: "fadeOut",
      tapToDismiss: 1
    });
  }

  function createToast(msg, type) {

    if (type.indexOf('STOP') != -1) {
      toastr.success(msg, "Thông báo", {
        positionClass: "toast-bottom-right " + type,
        timeOut: 0,//5e3
        closeButton: !0,
        debug: !1,
        newestOnTop: !0,
        progressBar: !0,
        preventDuplicates: !0,
        onclick: function () {
          location.href = "/sukiencongto";
        },
        showDuration: "2000",
        hideDuration: "1000",
        extendedTimeOut: "1000",
        showEasing: "swing",
        hideEasing: "linear",
        showMethod: "fadeIn",
        hideMethod: "fadeOut",
        tapToDismiss: 1
      });
    }
    else {
      toastr.error(msg, "Thông báo", {
        positionClass: "toast-bottom-right " + type,
        timeOut: 0,//5e3
        closeButton: !0,
        debug: !1,
        newestOnTop: !0,
        progressBar: !0,
        preventDuplicates: !0,
        onclick: function () {
          location.href = "/sukiencongto";
        },
        showDuration: "2000",
        hideDuration: "1000",
        extendedTimeOut: "1000",
        showEasing: "swing",
        hideEasing: "linear",
        showMethod: "fadeIn",
        hideMethod: "fadeOut",
        tapToDismiss: 1
      });
    }

  }

  function formatDateTime(input) {
    // Extract parts of the input string
    var year = '20' + input.substring(0, 2);
    var month = input.substring(2, 4);
    var day = input.substring(4, 6);
    var hour = input.substring(6, 8);
    var minute = input.substring(8, 10);
    var second = input.substring(10, 12);

    // Format the date-time string
    var formattedDateTime = year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second;

    return formattedDateTime;
  }
  const listDAT = new Set([
    "1.0.95.1.6",
    "1.0.95.1.7",
    "1.0.95.1.8",
    "1.0.95.1.9",
    "1.0.95.1.10",
    "1.0.95.1.11",
    "1.0.95.1.12",
    "1.0.95.1.13"
  ]);

  function getSukien_dienapthap(obis) {
    if (!listDAT) return "0";
    return listDAT.has(obis) ? "1" : "0";
  }
  function getTensukien(obis, value) {
    switch (obis) {
      case '1.0.95.6':
      case '1.0.95.8':
        if (value.indexOf('STOP') != -1) {
          return 'Hết cảnh báo : Điện áp thấp pha A'
          break;
        } else {
          return 'Cảnh báo: Điện áp thấp pha A'
          break;
        }
      case '1.0.95.7':
      case '1.0.95.9':
        if (value.indexOf('STOP') != -1) {
          return 'Hết cảnh báo : Điện áp cao pha A'
          break;
        } else {
          return 'Cảnh báo: Điện áp cao pha A'
          break;
        }
      case '1.0.95.10':
        if (value.indexOf('STOP') != -1) {
          return 'Hết cảnh báo : Điện áp thấp pha B'
          break;
        } else {
          return 'Cảnh báo: Điện áp thấp pha B'
          break;
        }
      case '1.0.95.11':
        if (value.indexOf('STOP') != -1) {
          return 'Hết cảnh báo : Điện áp cao pha B'
          break;
        } else {
          return 'Cảnh báo: Điện áp cao pha B'
          break;
        }
      case '1.0.95.12':
        if (value.indexOf('STOP') != -1) {
          return 'Hết cảnh báo : Điện áp thấp pha C'
          break;
        } else {
          return 'Cảnh báo: Điện áp thấp pha C'
          break;
        }
      case '1.0.95.13':
        if (value.indexOf('STOP') != -1) {
          return 'Hết cảnh báo : Điện áp cao pha C'
          break;
        } else {
          return 'Cảnh báo: Điện áp cao pha C'
          break;
        }
      case '0.9.4#': //time_meter
        return 'Time_Meter'
        break;
      case '0.4.2#': //ti
        return 'TI'
        break;
      case '0.4.3#': //tu
        return 'TU'
        break;
      case '11.7.0#': //i
        return 'I'
        break;
      case '12.7.0#': //u
        return 'U'
        break;
      case '13.7.0#': //COS
        return 'COS'
        break;
      case '1.8.0#': //PGT
        return 'PGT'
        break;
      case '1.8.1#': //PG1
        return 'PG1'
        break;
      case '1.8.2#': //PG2
        return 'PG2'
        break;
      case '1.8.3#': //PG3
        return 'PG3'
        break;
      case '2.8.0#': //PNT
        return 'PNT'
        break;
      case '2.8.1#': //PN1
        return 'PN1'
        break;
      case '2.8.2#': //PN2
        return 'PN2'
        break;
      case '2.8.3#': //PN3
        return 'PN3'
        break;
      case '3.8.0#': //QG
        return 'QG'
        break;
      case '4.8.0#': //QN
        return 'QN'
        break;
      //Chốt tháng
      case '0.1.3.1#': //time_CHOTTHANG 
        return 'Time_CHOTTHANG'
        break;
      case '1.8.0.1#': //PGT_CHOTTHANG
        return 'PGT_CHOTTHANG'
        break;
      case '1.8.1.1#': //PG1_CHOTTHANG
        return 'PG1_CHOTTHANG'
        break;
      case '1.8.2.1#': //PG2_CHOTTHANG
        return 'PG2_CHOTTHANG'
        break;
      case '1.8.3.1#': //PG3_CHOTTHANG
        return 'PG3_CHOTTHANG'
        break;
      case '2.8.0.1#': //PNT_CHOTTHANG
        return 'PNT_CHOTTHANG'
        break;
      case '2.8.1.1#': //PN1_CHOTTHANG
        return 'PN1_CHOTTHANG'
        break;
      case '2.8.2.1#': //PN2_CHOTTHANG
        return 'PN2_CHOTTHANG'
        break;
      case '2.8.3.1#': //PN3_CHOTTHANG
        return 'PN3_CHOTTHANG'
        break;
      case '3.8.0.1#': //QG_CHOTTHANG
        return 'QGT_CHOTTHANG'
        break;
      case '4.8.0.1#': //QN_CHOTTHANG
        return 'QNT_CHOTTHANG'
        break;
      case '99.1.1(00)#': //time_CHOTNGAY
        return 'Time_CHOTNGAY'
        break;
      case '99.1.1(01)#': //PGT_CHOTNGAY
        return 'PGT_CHOTNGAY'
        break;
      case '99.1.1(02)#': //PNT_CHOTNGAY
        return 'PNT_CHOTNGAY'
        break;
      case '99.1.1(03)#': //QG_CHOTNGAY
        return 'QGT_CHOTNGAY'
        break;
      case '99.1.1(04)#': //QN_CHOTNGAY
        return 'QNT_CHOTNGAY'
        break;
      case '1.6.0#': //PGT_MAX
        return 'PGT_MAX'
        break;
      case '1.6.1#': //PG1_MAX
        return 'PG1_MAX'
        break;
      case '1.6.2#': //PG2_MAX
        return 'PG2_MAX'
        break;
      case '1.6.3#': //PG3_MAX
        return 'PG3_MAX'
        break;
      case '2.6.0#': //PNT_MAX
        return 'PNT_MAX'
        break;
      case '2.6.1#': //PN1_MAX
        return 'PN1_MAX'
        break;
      case '2.6.2#': //PN2_MAX
        return 'PN2_MAX'
        break;
      case '2.6.3#': //PN3_MAX
        return 'PN3_MAX'
        break;
      case '1.6.0.1#': //PGT_MAX_HOADON
        return 'PGT_MAX_HOADON'
        break;
      case '1.6.1.1#': //PG1_MAX_HOADON
        return 'PG1_MAX_HOADON'
        break;
      case '1.6.2.1#': //PG2_MAX_HOADON
        return 'PG2_MAX_HOADON'
        break;
      case '1.6.3.1#': //PG3_MAX_HOADON
        return 'PG3_MAX_HOADON'
        break;
      case '2.6.0.1#': //PNT_MAX_HOADON
        return 'PNT_MAX_HOADON'
        break;
      case '2.6.1.1#': //PN1_MAX_HOADON
        return 'PN1_MAX_HOADON'
        break;
      case '2.6.2.1#': //PN2_MAX_HOADON
        return 'PN2_MAX_HOADON'
        break;
      case '2.6.3.1#': //PN3_MAX_HOADON
        return 'PN3_MAX_HOADON'
        break;

      //RTC Battery under voltage
      case 'C_52_33': //RTCBattery_UnderVoltage_StartCounter

        if (value.indexOf('STOP') != -1) {
          return 'Hết cảnh báo : Pin đồng hồ yếu'
          break;
        } else {
          return 'Cảnh báo: Pin đồng hồ yếu'
          break;
        }

      case 'C_52_34': //RTCBattery_UnderVoltage_StartTime
        return 'RTCBattery_UnderVoltage_StartTime'
        break;
      case 'C_52_35': //RTCBattery_UV_StartTime
        return 'RTCBattery_UnderVoltage_StopCounter'
        break;
      case 'C_52_36': //RTCBattery_UV_StopTime
        return 'RTCBattery_UnderVoltage_StopTime'
        break;
      //Current_Unbalance_Rate
      case 'C_51_27': //CurrentUnbalance_Rate_StartCounter
        if (value.indexOf('STOP') != -1) {
          return 'Hết cảnh báo : Mất cân bằng dòng';
          break;
        } else {
          return 'Cảnh báo: Mất cân bằng dòng'
          break;
        }
        break;
      case 'C_51_28': //CurrentUnbalance_Rate_StartTime
        return 'CurrentUnbalance_Rate_StartTime'
        break;
      case 'C_51_29': //CurrentUnbalance_Rate_StopCounter
        return 'CurrentUnbalance_Rate_StopCounter'
        break;
      case 'C_51_30': //CurrentUnbalance_Rate_StopTime
        return 'CurrentUnbalance_Rate_StopTime'
        break;
      //Power outage
      case 'C_51_13': //PowerOutage_PowerUpCounter
        if (value.indexOf('STOP') != -1) {
          return 'Hết cảnh báo : Công tơ bị mất điện';
          break;
        } else {
          return 'Cảnh báo: Công tơ bị mất điện'
          break;
        }

      case 'C_51_13_1': //PowerOutage_PowerUpCounter_Module     
        if (value.indexOf('STOP') != -1) {
          return 'Hết cảnh báo: Mất nguồn module'
          break;
        } else {
          return 'Mất nguồn module'
          break;
        }
      case 'C_51_14': //PowerOutage_PowerUpTime
        return 'PowerOutage_PowerUpTime'
        break;
      case 'C_7_0': //PowerOutage_PowerDownTime

        if (value.indexOf('STOP') != -1) {
          return 'Hết cảnh báo: Mất điện công tơ'
          break;
        } else {
          return 'Cảnh báo: Mất điện công tơ'
          break;
        }

      case 'C_7_10': //PowerOutage_PowerDownTime
        return 'PowerOutage_PowerDownTime'
        break;
      //Time Synchronization
      case 'C_51_15': //TimeSync_SetCounter
        if (value.indexOf('STOP') != -1) {
          return 'Hết cảnh báo: Đồng bộ thời gian'
          break;
        } else {
          return 'Cảnh báo: Đồng bộ thời gian'
          break;
        }

      case 'C_51_16': //TimeSync_SetTime
        return 'TimeSync_SetTime'
        break;

      //Electrical leak
      case 'C_51_31': //ElectricalLeak_StartCounter
        if (value.indexOf('STOP') != -1) {
          return 'Hết cảnh báo: Rò điện'
          break;
        } else {
          return 'Cảnh báo: Rò điện'
          break;
        }

      case 'C_51_32': //ElectricalLeak_StartTime
        return 'ElectricalLeak_StartTime'
        break;
      case 'C_51_33': //ElectricalLeak_StopCounter
        return 'ElectricalLeak_StopCounter'
        break;
      case 'C_51_34': //ElectricalLeak_StopTime
        return 'ElectricalLeak_StopTime'
        break;
      //Customer's aptomat OFF
      case 'C_51_35': //CustomerAptomatOff_OpenCounter
        if (value.indexOf('STOP') != -1) {
          return 'Aptomat khách hàng có điện trở lại'
          break;
        } else {
          return 'Mất điện sau Aptomat khách hàng'
          break;
        }
      case 'C_51_36': //CustomerAptomatOff_StartTime
        return 'CustomerAptomatOff_StartTime'
        break;
      case 'C_51_37': //CustomerAptomatOff_ClosedCounter
        return 'CustomerAptomatOff_ClosedCounter'
        break;
      case 'C_51_38': //CustomerAptomatOff_StopTime
        return 'CustomerAptomatOff_StopTime'
        break;
      //Open meter cover
      case 'C_51_3': //OpenMeterCover_OpenCounter
        return 'ĐÓng/Mở vỏ công tơ'
        break;
      case 'C_51_4': //OpenMeterCover_OpenTime
        return 'OpenMeterCover_OpenTime'
        break;
      case 'C_51_23': //OpenMeterCover_ClosedCounter
        return 'OpenMeterCover_ClosedCounter'
        break;
      case 'C_51_24': //OpenMeterCover_ClosedTime
        return 'OpenMeterCover_ClosedTime'
        break;
      //Open terminal cover
      case 'C_51_1': //OpenTerminalCover_OpenCounter

        if (value.indexOf('STOP') != -1) {
          return 'Đã đóng nắp che cầu đấu'
          break;
        } else {
          return 'Đang mở nắp che cầu đấu'
          break;
        }

      case 'C_51_2': //OpenTerminalCover_OpenTime
        return 'OpenTerminalCover_OpenTime'
        break;
      case 'C_51_21': //OpenTerminalCover_ClosedCounter
        return 'OpenTerminalCover_ClosedCounter'
        break;
      case 'C_51_22': //OpenTerminalCover_ClosedTime
        return 'OpenTerminalCover_ClosedTime'
        break;
      //Open meter box
      case 'C_51_45': //
        if (value.indexOf('STOP') != -1) {
          return 'Đã đóng hộp công tơ'
          break;
        } else {
          return 'Đang mở hộp công tơ'
          break;
        }

      case 'C_51_46': //OpenMeterBox_OpenTime
        return 'OpenMeterBox_OpenTime'
        break;
      case 'C_51_47': //OpenMeterBox_ClosedCounter
        return 'OpenMeterBox_ClosedCounter'
        break;
      case 'C_51_48': //OpenMeterBox_ClosedTime
        return 'OpenMeterBox_ClosedTime'
        break;
      //Latching OFF
      case 'C_53_5': //LatchingOff_StartCounter
        if (value.indexOf('STOP') != -1) {
          return 'Công tơ đã đóng điện'
          break;
        } else {
          return 'Công tơ bị cắt điện'
          break;
        }
      case 'C.53.6#': //LatchingOff_StartTime
        return 'LatchingOff_StartTime'
        break;
      case 'C.53.55#': //LatchingOff_StopCounter
        return 'LatchingOff_StopCounter'
        break;
      case 'C.53.56#': //LatchingOff_StopTime
        return 'LatchingOff_StopTime'
        break;
      //MagnetIC field detection
      case 'C.51.5#': //MagnetICFieldDetec_StartCounter
        if (value.indexOf('STOP') != -1) {
          return 'Hết cảnh báo: Từ trường ngoài'
          break;
        } else {
          return 'Cảnh báo: Từ trường ngoài'
          break;
        }

      case 'C.51.6#': //MagnetICFieldDetec_StartTime
        return 'MagnetICFieldDetec_StartTime'
        break;
      case 'C.51.55#': //MagnetICFieldDetec_StopCounter
        return 'MagnetICFieldDetec_StopCounter'
        break;
      case 'C.51.56#': //MagnetICFieldDetec_StopTime
        return 'MagnetICFieldDetec_StopTime'
        break;
      //Program
      case 'C.2.0#': //Program_Counter
        return 'Program_Counter'
        break;
      case 'C.2.1#': //Program_Time
        return 'Program_Time'
        break;
      //Reset meter event
      case 'C.51.25#': //ResetMeterEvent_Counter
        return 'ResetMeterEvent_Counter'
        break;
      case 'C.51.26#': //ResetMeterEvent_Time
        return 'ResetMeterEvent_Time'
        break;
      //5 < Prepayment energy =< 10 kWh
      case 'C_53_7': //5 < Prepayment energy =< 10 kWh - Start Counter
        return 'Cảnh báo sắp hết sản lượng lần 1'
        break;
      case 'C_53_8': //5 < Prepayment energy =< 10 kWh - Start Timestamp
        return 'PEnergy_5_10_StartTime'
        break;
      case 'C.53.9#': //5 < Prepayment energy =< 10 kWh - Stop Counter
        return 'Cảnh báo lần 1: Sắp hết sản lượng'
        break;
      case 'C.53.10#': //5 < Prepayment energy =< 10 kWh - Stop Timestamp
        return 'PEnergy_5_10_StopTime'
        break;
      //1 < Prepayment energy =< 5 kWh
      case 'C_53_11': //1 < Prepayment energy =< 5 kWh - Start Counter
        return 'Cảnh báo lần 2: Sắp hết sản lượng'
        break;
      case 'C.53.12#': //1 < Prepayment energy =< 5 kWh - Start Timestamp
        return 'PEnergy_1_5_StartTime'
        break;
      case 'C.53.13#': //1 < Prepayment energy =< 5 kWh -Stop Counter
        return 'PEnergy_1_5_StopCounter'
        break;
      case 'C.53.14#': //1 < Prepayment energy =< 5 kWh - Stop Timestamp
        return 'PEnergy_1_5_StopTime'
        break;
      //0 < Prepayment energy =< 1 kWh
      case 'C_53_19': //0 < Prepayment energy =< 1 kWh - Start Counter
        return 'Cảnh báo lần 3: Sắp hết sản lượng'
        break;
      case 'C.53.20#': //0 < Prepayment energy =< 1 kWh - Start Timestamp
        return 'PEnergy_0_1_StartTime'
        break;
      case 'C.53.21#': //0 < Prepayment energy =< 1 kWh - Stop Counter
        return 'PEnergy_0_1_StopCounter'
        break;
      case 'C.53.22#': //0 < Prepayment energy =< 1 kWh - Stop Timestamp
        return 'PEnergy_0_1_StopTime'
        break;
      //Prepayment energy = 0 kWh
      case 'C_53_15': //Prepayment energy = 0 kWh - Start Counter
        return 'Cảnh báo: Hết sản lượng ứng trước'
        break;
      case 'C.53.16#': //Prepayment energy = 0 kWh - Start Timestamp
        return 'PEnergy_0_StartTime'
        break;
      case 'C.53.17#': //Prepayment energy = 0 kWh - Stop Counter
        return 'PEnergy_0_StopCounter'
        break;
      case 'C.53.18#': //Prepayment energy = 0 kWh - Stop Timestamp
        return 'PEnergy_0_StopTime'
        break;
      //3pha
      case '32.7.0#': //UA
        return 'UA'
        break;
      case '52.7.0#': //UB
        return 'UB'
        break;
      case '72.7.0#': //UC
        return 'UC'
        break;
      case '31.7.0#': //IA
        return 'IA'
        break;
      case '51.7.0#': //IB
        return 'IB'
        break;
      case '71.7.0#': //IC
        return 'IC'
        break;
      case '33.7.0#': //COSa
        return 'COSA'
        break;
      case '53.7.0#': //COSb
        return 'COSB'
        break;
      case '73.7.0#': //COSc
        return 'COSC'
        break;

      //Chốt tháng theo pha
      case '21.8.0.1#': //L1 export active energy
        return 'PGIAOA_CHOTTHANG'
        break;
      case '41.8.0.1#': //L2 export active energy
        return 'PGIAOB_CHOTTHANG'
        break;
      case '61.8.0.1#': //L3 export active energy
        return 'PGIAOC_CHOTTHANG'
        break;
      case '22.8.0.1#': //L1 export active energy
        return 'PNHANA_CHOTTHANG'
        break;
      case '42.8.0.1#': //L2 export active energy
        return 'PNHANB_CHOTTHANG'
        break;
      case '62.8.0.1#': //L3 export active energy
        return 'PNHANC_CHOTTHANG'
        break;
      case '23.8.0.1#': //L1 import reactive energy
        return 'QGIAOA_CHOTTHANG'
        break;
      case '43.8.0.1#': //L2 import reactive energy
        return 'QGIAOB_CHOTTHANG'
        break;
      case '63.8.0.1#': //L3 import reactive energy
        return 'QGIAOC_CHOTTHANG'
        break;
      case '24.8.0.1#': //L1 export reactive energy
        return 'QNHANA_CHOTTHANG'
        break;
      case '44.8.0.1#': //L2 export reactive energy
        return 'QNHANB_CHOTTHANG'
        break;
      case '64.8.0.1#': //L3 export reactive energy
        return 'QNHANC_CHOTTHANG'
        break;

      //Năng lượng theo pha
      case '21.8.0#': //L1 export active energy
        return 'PGIAOA'
        break;
      case '41.8.0#': //L2 export active energy
        return 'PGIAOB'
        break;
      case '61.8.0#': //L3 export active energy
        return 'PGIAOC'
        break;
      case '22.8.0#': //L1 export active energy
        return 'PNHANA'
        break;
      case '42.8.0#': //L2 export active energy
        return 'PNHANB'
        break;
      case '62.8.0#': //L3 export active energy
        return 'PNHANC'
        break;
      case '23.8.0#': //L1 import reactive energy
        return 'QGIAOA'
        break;
      case '43.8.0#': //L2 import reactive energy
        return 'QGIAOB'
        break;
      case '63.8.0#': //L3 import reactive energy
        return 'QGIAOC'
        break;
      case '24.8.0#': //L1 export reactive energy
        return 'QNHANA'
        break;
      case '44.8.0#': //L2 export reactive energy
        return 'QNHANB'
        break;
      case '64.8.0#': //L3 export reactive energy
        return 'QNHANC'
        break;

      // Chốt ngày theo pha
      case '99.1.1(21)#': //L1 import active energy
        return 'PGIAOA_CHOTNGAY'
        break;
      case '99.1.1(41)#': //L2 import active energy
        return 'PGIAOB_CHOTNGAY'
        break;
      case '99.1.1(61)#': //L3 import active energy
        return 'PGIAOC_CHOTNGAY'
        break;
      case '99.1.1(22)#': //L1 export active energy
        return 'PNHANA_CHOTNGAY'
        break;
      case '99.1.1(42)#': //L2 export active energy
        return 'PNHANB_CHOTNGAY'
        break;
      case '99.1.1(62)#': //L3 export active energy
        return 'PNHANC_CHOTNGAY'
        break;
      case '99.1.1(23)#': //L1 import reactive energy
        return 'QGIAOA_CHOTNGAY'
        break;
      case '99.1.1(43)#': //L2 import reactive energy
        return 'QGIAOB_CHOTNGAY'
        break;
      case '99.1.1(63)#': //L3 import reactive energy
        return 'QGIAOC_CHOTNGAY'
        break;
      case '99.1.1(24)#': //L1 export reactive energy
        return 'QNHANA_CHOTNGAY'
        break;
      case '99.1.1(44)#': //L2 export reactive energy
        return 'QNHANB_CHOTNGAY'
        break;
      case '99.1.1(64)#': //L3 export reactive energy
        return 'QNHANC_CHOTNGAY'
        break;

      //P MAX (t?ng pha)
      case '21.6.0#': //Active MAX Demand L1 import (_A); Total
        return 'PGIAOA_MAX'
        break;
      case '41.6.0#': //Active MAX Demand L2 import (_A); Total 
        return 'PGIAOB_MAX'
        break;
      case '61.6.0#': //Active MAX Demand L3 import (_A); Total 
        return 'PGIAOC_MAX'
        break;
      case '22.6.0#': //Active MAX Demand L1 import (-A); Total 
        return 'PNHANA_MAX'
        break;
      case '42.6.0#': //Active MAX Demand L2 import (-A); Total 
        return 'PNHANB_MAX'
        break;
      case '62.6.0#': //Active MAX Demand L3 import (-A); Total 
        return 'PNHANC_MAX'
        break;

      //PMAX hóa đơn lần 1(từng pha)
      case '21.6.0.1#': //Last 1 Month  Active MAX Demand L1 import (_A); Total 
        return 'PGIAOA_MAX_HOADON'
        break;
      case '41.6.0.1#': //Last 1 Month  Active MAX Demand L2 import (_A); Total 
        return 'PGIAOB_MAX_HOADON'
        break;
      case '61.6.0.1#': //Last 1 Month  Active MAX Demand L3 import (_A); Total 
        return 'PGIAOC_MAX_HOADON'
        break;
      case '22.6.0.1#': //Last 1 Month  Active MAX Demand L1 import (-A); Total 
        return 'PNHANA_MAX_HOADON'
        break;
      case '42.6.0.1#': //Last 1 Month  Active MAX Demand L2 import (-A); Total 
        return 'PNHANB_MAX_HOADON'
        break;
      case '62.6.0.1#': //Last 1 Month  Active MAX Demand L3 import (-A); Total 
        return 'PNHANC_MAX_HOADON'
        break;
      //Power reverse
      case 'C_51_7': //StartCounter
        if (value.indexOf('STOP') != -1) {
          return 'Hết cảnh báo: Ngược chiều công suất'
          break;
        } else {
          return 'Cảnh báo: Ngược chiều công suất'
          break;
        }

      case 'C.51.8#': //Start Timestamp
        return 'PowerReverse_StartTime'
        break;
      case 'C.51.9#': //StopCounter
        return 'PowerReverse_StopCounter'
        break;
      case 'C.51.10#': //Stop Timestamp
        return 'PowerReverse_StopTime'
        break;

      //Phase sequense reverse
      case 'C_52_25': //Start Counter
        if (value.indexOf('STOP') != -1) {
          return 'Hết cảnh báo: Sai thứ tự pha'
          break;
        } else {
          return 'Cảnh báo: Sai thứ tự pha'
          break;
        }
      case 'C.52.26#': //Start Timestamp
        return 'PhaseSeqReverse_StartTime'
        break;
      case 'C.52.26#': //Start Timestamp
        return 'PhaseSeqReverse_StopCounter'
        break;
      case 'C.52.28#': //Stop Timestamp
        return 'PhaseSeqReverse_StopTime'
        break;

      //Phase A under voltage
      case 'C_51_59': //Start Counter
        if (value.indexOf('STOP') != -1) {
          return 'Hết cảnh báo: Thấp áp pha A'
          break;
        } else {
          return 'Cảnh báo: Thấp áp pha A'
          break;
        }
      case 'C.51.60#': //Start Timestamp
        return 'PhaseA_UnderVoltage_StartTime'
        break;
      case 'C.51.61#': //Start Timestamp
        return 'PhaseA_UnderVoltage_StopCounter'
        break;
      case 'C.51.62#': //Stop Timestamp
        return 'PhaseA_UnderVoltage_StopTime'
        break;
      //Phase B under voltage
      case 'C_51_63': //Start Counter
        if (value.indexOf('STOP') != -1) {
          return 'Hết cảnh báo: Thấp áp pha B'
          break;
        } else {
          return 'Cảnh báo: Thấp áp pha B'
          break;
        }
      case 'C.51.64#': //Start Timestamp
        return 'PhaseB_UnderVoltage_StartTime'
        break;
      case 'C.51.65#': //Start Timestamp
        return 'PhaseB_UnderVoltage_StopCounter'
        break;
      case 'C.51.66#': //Stop Timestamp
        return 'PhaseB_UnderVoltage_StopTime'
        break;
      //Phase C under voltage
      case 'C_51_67': //Start Counter
        if (value.indexOf('STOP') != -1) {
          return 'Hết cảnh báo: Thấp áp pha C'
          break;
        } else {
          return 'Cảnh báo: Thấp áp pha C'
          break;
        }

      case 'C.51.68#': //Start Timestamp
        return 'PhaseC_UnderVoltage_StartTime'
        break;
      case 'C.51.69#': //Start Timestamp
        return 'PhaseC_UnderVoltage_StopCounter'
        break;
      case 'C.51.70#': //Stop Timestamp
        return 'PhaseC_UnderVoltage_StopTime'
        break;
      //Phase A current reverse
      case 'C_52_13': //Start Counter
        if (value.indexOf('STOP') != -1) {
          return 'Hết cảnh báo Ngược chiều dòng điện pha A'
          break;
        } else {
          return 'Cảnh báo: Ngược chiều dòng điện pha A'
          break;
        }
        ;
      case 'C.52.14#': //Start Timestamp
        return 'PhaseA_CurentReverse_StartTime'
        break;
      case 'C_52_15#': //Start Timestamp
        return 'PhaseA_CurentReverse_StopCounter'
        break;
      case 'C.52.16#': //Stop Timestamp
        return 'PhaseA_CurentReverse_StopTime'
        break;
      //Phase B current reverse
      case 'C_52_17': //Start Counter
        if (value.indexOf('STOP') != -1) {
          return 'Hết cảnh báo Ngược chiều dòng điện pha B'
          break;
        } else {
          return 'Cảnh báo: Ngược chiều dòng điện pha B'
          break;
        }
        break;
      case 'C.52.18#': //Start Timestamp
        return 'PhaseB_CurentReverse_StartTime'
        break;
      case 'C.52.19#': //Start Timestamp
        return 'PhaseB_CurentReverse_StopCounter'
        break;
      case 'C.52.20#': //Stop Timestamp
        return 'PhaseB_CurentReverse_StopTime'
        break;
      //Phase C current reverse
      case 'C_52_21': //Start Counter
        if (value.indexOf('STOP') != -1) {
          return 'Hết cảnh báo Ngược chiều dòng điện pha C '
          break;
        } else {
          return 'Cảnh báo: Ngược chiều dòng điện pha C'
          break;
        }
        break;
      case 'C.52.22#': //Start Timestamp
        return 'PhaseC_CurentReverse_StartTime'
        break;
      case 'C.52.23#': //Start Timestamp
        return 'PhaseC_CurentReverse_StopCounter'
        break;
      case 'C.52.24#': //Stop Timestamp
        return 'PhaseC_CurentReverse_StopTime'
        break;
      //Phase A over voltage
      case 'C_51_71': //Start Counter
        if (value.indexOf('STOP') != -1) {
          return 'Hết cảnh báo: Quá Áp Pha A '
          break;
        } else {
          return 'Cảnh báo: Quá Áp Pha A'
          break;
        }

      case 'C.51.72#': //Start Timestamp
        return 'PhaseA_OverVoltage_StartTime'
        break;
      case 'C.51.73#': //Start Timestamp
        return 'PhaseA_OverVoltage_StopCounter'
        break;
      case 'C.51.74#': //Stop Timestamp
        return 'PhaseA_OverVoltage_StopTime'
        break;
      //Phase B over voltage
      case 'C_51_75': //Start Counter
        if (value.indexOf('STOP') != -1) {
          return 'Hết cảnh báo:  Quá Áp Pha B '
          break;
        } else {
          return 'Cảnh báo:  Quá Áp Pha B'
          break;
        }

      case 'C.51.76#': //Start Timestamp
        return 'PhaseB_OverVoltage_StartTime'
        break;
      case 'C.51.77#': //Start Timestamp
        return 'PhaseB_OverVoltage_StopCounter'
        break;
      case 'C.51.78#': //Stop Timestamp
        return 'PhaseB_OverVoltage_StopTime'
        break;
      //Phase C over voltage
      case 'C_51_79': //Start Counter
        if (value.indexOf('STOP') != -1) {
          return 'Hết cảnh báo:  Quá Áp Pha C '
          break;
        } else {
          return 'Cảnh báo:  Quá Áp Pha C'
          break;
        }
        break;
      case 'C.51.80#': //Start Timestamp
        return 'PhaseC_OverVoltage_StartTime'
        break;
      case 'C.51.81#': //Start Timestamp
        return 'PhaseC_OverVoltage_StopCounter'
        break;
      case 'C.51.82#': //Stop Timestamp
        return 'PhaseC_OverVoltage_StopTime'
        break;

      //Phase A over current
      case 'C_52_1': //Start Counter

        if (value.indexOf('STOP') != -1) {
          return 'Hết cảnh báo Quá dòng Pha A'
          break;
        } else {
          return 'Cảnh báo: Quá dòng Pha A'
          break;
        }

      case 'C.52.2#': //Start Timestamp
        return 'PhaseA_OverCurrent_StartTime'
        break;
      case 'C.52.3#': //Start Timestamp
        return 'PhaseA_OverCurrent_StopCounter'
        break;
      case 'C.52.4#': //Stop Timestamp
        return 'PhaseA_OverCurrent_StopTime'
        break;
      //Phase B over current
      case 'C_52_5': //Start Counter
        if (value.indexOf('STOP') != -1) {
          return 'Hết cảnh báo: Quá dòng Pha B'
          break;
        } else {
          return 'Cảnh báo: Quá dòng Pha B'
          break;
        }
        break;
      case 'C.52.6#': //Start Timestamp
        return 'PhaseB_OverCurrent_StartTime'
        break;
      case 'C.52.7#': //Start Timestamp
        return 'PhaseB_OverCurrent_StopCounter'
        break;
      case 'C.52.8#': //Stop Timestamp
        return 'PhaseB_OverCurrent_StopTime'
        break;
      //Phase C over current
      case 'C_52_9': //Start Counter
        if (value.indexOf('STOP') != -1) {
          return 'Hết cảnh báo: Quá dòng Pha C'
          break;
        } else {
          return 'Cảnh báo: Quá dòng Pha C'
          break;
        }
        break;
      case 'C.52.10#': //Start Timestamp
        return 'PhaseC_OverCurrent_StartTime'
        break;
      case 'C.52.11#': //Start Timestamp
        return 'PhaseC_OverCurrent_StopCounter'
        break;
      case 'C.52.12#': //Stop Timestamp
        return 'PhaseC_OverCurrent_StopTime'
        break;

      //Phase A lost of phase
      case 'C_51_83': //Start Counter
        if (value.indexOf('STOP') != -1) {
          return 'Hết cảnh báo: Mất pha A'
          break;
        } else {
          return 'Cảnh báo: Mất pha A'
          break;
        }
      case 'C.51.84#': //Start Timestamp
        return 'PhaseA_LostPhase_StartTime'
        break;
      case 'C.51.85#': //Start Timestamp
        return 'PhaseA_LostPhase_StopCounter'
        break;
      case 'C.51.86#': //Stop Timestamp
        return 'PhaseA_LostPhase_StopTime'
        break;
      //Phase B lost of phase
      case 'C_51_87': //Start Counter
        if (value.indexOf('STOP') != -1) {
          return 'Hết cảnh báo: Mất pha B'
          break;
        } else {
          return 'Cảnh báo: Mất pha B'
          break;
        }
      case 'C.51.88#': //Start Timestamp
        return 'PhaseB_LostPhase_StartTime'
        break;
      case 'C.51.89#': //Start Timestamp
        return 'PhaseB_LostPhase_StopCounter'
        break;
      case 'C.51.90#': //Stop Timestamp
        return 'PhaseB_LostPhase_StopTime'
        break;
      //Phase C lost of phase
      case 'C_51_91': //Start Counter
        if (value.indexOf('STOP') != -1) {
          return 'Hết cảnh báo: Mất pha C'
          break;
        } else {
          return 'Cảnh báo: Mất pha C'
          break;
        }
      case 'C.51.92#': //Start Timestamp
        return 'PhaseC_LostPhase_StartTime'
        break;
      case 'C.51.93#': //Start Timestamp
        return 'PhaseC_LostPhase_StopCounter'
        break;
      case 'C.51.94#': //Stop Timestamp
        return 'PhaseC_LostPhase_StopTime'
        break;

      //Voltage Unbalance-Rate(%)
      case 'C_51_41': //Start Counter
        if (value.indexOf('STOP') != -1) {
          return 'Hết cảnh báo: Mất cân bằng Áp'
          break;
        } else {
          return 'Cảnh báo: Mất cân bằng Áp'
          break;
        }

      case 'C.51.42#': //Start Timestamp
        return 'VoltageUnbalanceRate_StartTime'
        break;
      case 'C.51.43#': //Start Timestamp
        return 'VoltageUnbalanceRate_StopCounter'
        break;
      case 'C.51.44#': //Stop Timestamp
        return 'VoltageUnbalanceRate_StopTime'
        break;

      //New
      case '14.7.0#': //Tần số
        return 'Frequency'
        break;
      case '81.7.40#': //Góc pha A
        return 'Phase_Angle_L1'
        break;
      case '81.7.51#': //Góc pha B
        return 'Phase_Angle_L2'
        break;
      case '81.7.62#': //Góc pha C
        return 'Phase_Angle_L3'
        break;
      //Power
      case '1.7.0#':
        return 'P13A_GIAO'
        break;
      case '2.7.0#':
        return 'P13A_NHAN'
        break;
      case '21.7.0#':
        return 'PA_GIAO'
        break;
      case '22.7.0#':
        return 'PA_NHAN'
        break;
      case '23.7.0#':
        return 'QA_GIAO'
        break;
      case '24.7.0#':
        return 'QA_NHAN'
        break;
      case '41.7.0#':
        return 'PB_GIAO'
        break;
      case '42.7.0#':
        return 'PB_NHAN'
        break;
      case '43.7.0#':
        return 'QB_GIAO'
        break;
      case '44.7.0#':
        return 'QB_NHAN'
        break;
      case '61.7.0#':
        return 'PC_GIAO'
        break;
      case '62.7.0#':
        return 'PC_NHAN'
        break;
      case '63.7.0#':
        return 'QC_GIAO'
        break;
      case '64.7.0#':
        return 'QC_NHAN'
        break;
      //Phase A loss voltage
      case 'C_53_23': //Start Counter
        return 'Phase A loss voltage'
        break;
      case 'C.53.24#': //Start Timestamp
        return 'PhaseA_LossVoltage_StartTime'
        break;
      case 'C.53.25#': //Stop Timestamp
        return 'PhaseA_LossVoltage_StopCounter'
        break;
      case 'C.53.26#': //Start Counter
        return 'PhaseA_LossVoltage_StopTime'
        break;
      //Phase B loss voltage
      case 'C_53_27': //Start Counter
        return 'Phase B loss voltage'
        break;
      case 'C.53.28#': //Start Timestamp
        return 'PhaseB_LossVoltage_StartTime'
        break;
      case 'C.53.29#': //Stop Timestamp
        return 'PhaseB_LossVoltage_StopCounter'
        break;
      case 'C.53.30#': //Start Counter
        return 'PhaseB_LossVoltage_StopTime'
        break;
      //Phase C loss voltage
      case 'C.53.31#': //Start Counter
        return 'PhaseC_LossVoltage_StartCounter'
        break;
      case 'C.53.32#': //Start Timestamp
        return 'PhaseC_LossVoltage_StartTime'
        break;
      case 'C.53.33#': //Stop Timestamp
        return 'PhaseC_LossVoltage_StopCounter'
        break;
      case 'C.53.34#': //Start Counter
        return 'PhaseC_LossVoltage_StopTime'
        break;
      //Hardware error
      case 'C_53_35': //Start Counter
        if (value.indexOf('STOP') != -1) {
          return 'Nghi ngờ lỗi phần cứng (Kết thúc)'
          break;
        } else {
          return 'Nghi ngờ lỗi phần cứng (Bắt đầu)'
          break;
        }
      case 'C.53.36#': //Start Timestamp
        return 'Hardware_Error_StartTime'
        break;
      case 'C.53.37#': //Stop Timestamp
        return 'Hardware_Error_StopCounter'
        break;
      case 'C.53.38#': //Start Counter
        return 'Hardware_Error_StopTime'
        break;
      //Phase A Overload
      case 'C.53.39#': //Start Counter
        return 'PhaseA_Overload_StartCounter'
        break;
      case 'C.53.40#': //Start Timestamp
        return 'PhaseA_Overload_StartTime'
        break;
      case 'C.53.41#': //Stop Timestamp
        return 'PhaseA_Overload_StopCounter'
        break;
      case 'C.53.42#': //Start Counter
        return 'PhaseA_Overload_StopTime'
        break;
      //Phase B Overload
      case 'C.53.43#': //Start Counter
        return 'PhaseB_Overload_StartCounter'
        break;
      case 'C.53.44#': //Start Timestamp
        return 'PhaseB_Overload_StartTime'
        break;
      case 'C.53.45#': //Stop Timestamp
        return 'PhaseB_Overload_StopCounter'
        break;
      case 'C.53.46#': //Start Counter
        return 'PhaseB_Overload_StopTime'
        break;
      //Phase C Overload
      case 'C.53.47#': //Start Counter
        return 'PhaseC_Overload_StartCounter'
        break;
      case 'C.53.48#': //Start Timestamp
        return 'PhaseC_Overload_StartTime'
        break;
      case 'C.53.49#': //Stop Timestamp
        return 'PhaseC_Overload_StopCounter'
        break;
      case 'C.53.50#': //Start Counter
        return 'PhaseC_Overload_StopTime'
        break;
      case '99.1.0#': //LoadProfile
        return 'Loadprofile'
        break;
      // SÓNG HÀI
      case '32.7.1#': //L1 Voltage (1st honorific)
        return 'L1_Voltage_1'
        break;
      case '32.7.2#': //L1 Voltage (2nd honorific)
        return 'L1_Voltage_2'
        break;
      case '32.7.3#': //L1 Voltage (3st honorific)
        return 'L1_Voltage_3'
        break;
      case '32.7.4#': //L1 Voltage (4th honorific)
        return 'L1_Voltage_4'
        break;
      case '32.7.5#': //L1 Voltage (5th honorific)
        return 'L1_Voltage_5'
        break;
      case '32.7.6#': //L1 Voltage (6th honorific)
        return 'L1_Voltage_6'
        break;
      case '32.7.7#': //L1 Voltage (7th honorific)
        return 'L1_Voltage_7'
        break;
      case '32.7.8#': //L1 Voltage (8th honorific)
        return 'L1_Voltage_8'
        break;
      case '32.7.9#': //L1 Voltage (9th honorific)
        return 'L1_Voltage_9'
        break;
      case '32.7.10#': //L1 Voltage (10th honorific)
        return 'L1_Voltage_10'
        break;
      case '32.7.11#': //L1 Voltage (11st honorific)
        return 'L1_Voltage_11'
        break;
      case '32.7.12#': //L1 Voltage (12nd honorific)
        return 'L1_Voltage_12'
        break;
      case '32.7.13#': //L1 Voltage (13st honorific)
        return 'L1_Voltage_13'
        break;
      case '32.7.14#': //L1 Voltage (14th honorific)
        return 'L1_Voltage_14'
        break;
      case '32.7.15#': //L1 Voltage (15th honorific)
        return 'L1_Voltage_15'
        break;
      case '32.7.16#': //L1 Voltage (16th honorific)
        return 'L1_Voltage_16'
        break;
      case '32.7.17#': //L1 Voltage (17th honorific)
        return 'L1_Voltage_17'
        break;
      case '32.7.18#': //L1 Voltage (18th honorific)
        return 'L1_Voltage_18'
        break;
      case '32.7.19#': //L1 Voltage (19th honorific)
        return 'L1_Voltage_19'
        break;
      case '32.7.20#': //L1 Voltage (20th honorific)
        return 'L1_Voltage_20'
        break;
      case '32.7.21#': //L1 Voltage (21st honorific)
        return 'L1_Voltage_21'
        break;

      case '52.7.1#': //L2 Voltage (1st honorific)
        return 'L2_Voltage_1'
        break;
      case '52.7.2#': //L2 Voltage (2nd honorific)
        return 'L2_Voltage_2'
        break;
      case '52.7.3#': //L2 Voltage (3st honorific)
        return 'L2_Voltage_3'
        break;
      case '52.7.4#': //L2 Voltage (4th honorific)
        return 'L2_Voltage_4'
        break;
      case '52.7.5#': //L2 Voltage (5th honorific)
        return 'L2_Voltage_5'
        break;
      case '52.7.6#': //L2 Voltage (6th honorific)
        return 'L2_Voltage_6'
        break;
      case '52.7.7#': //L2 Voltage (7th honorific)
        return 'L2_Voltage_7'
        break;
      case '52.7.8#': //L2 Voltage (8th honorific)
        return 'L2_Voltage_8'
        break;
      case '52.7.9#': //L2 Voltage (9th honorific)
        return 'L2_Voltage_9'
        break;
      case '52.7.10#': //L2 Voltage (10th honorific)
        return 'L2_Voltage_10'
        break;
      case '52.7.11#': //L2 Voltage (11st honorific)
        return 'L2_Voltage_11'
        break;
      case '52.7.12#': //L2 Voltage (12nd honorific)
        return 'L2_Voltage_12'
        break;
      case '52.7.13#': //L2 Voltage (13st honorific)
        return 'L2_Voltage_13'
        break;
      case '52.7.14#': //L2 Voltage (14th honorific)
        return 'L2_Voltage_14'
        break;
      case '52.7.15#': //L2 Voltage (15th honorific)
        return 'L2_Voltage_15'
        break;
      case '52.7.16#': //L2 Voltage (16th honorific)
        return 'L2_Voltage_16'
        break;
      case '52.7.17#': //L2 Voltage (17th honorific)
        return 'L2_Voltage_17'
        break;
      case '52.7.18#': //L2 Voltage (18th honorific)
        return 'L2_Voltage_18'
        break;
      case '52.7.19#': //L2 Voltage (19th honorific)
        return 'L2_Voltage_19'
        break;
      case '52.7.20#': //L2 Voltage (20th honorific)
        return 'L2_Voltage_20'
        break;
      case '52.7.21#': //L2 Voltage (21st honorific)
        return 'L2_Voltage_21'
        break;

      case '72.7.1#': //L3 Voltage (1st honorific)
        return 'L3_Voltage_1'
        break;
      case '72.7.2#': //L3 Voltage (2nd honorific)
        return 'L3_Voltage_2'
        break;
      case '72.7.3#': //L3 Voltage (3st honorific)
        return 'L3_Voltage_3'
        break;
      case '72.7.4#': //L3 Voltage (4th honorific)
        return 'L3_Voltage_4'
        break;
      case '72.7.5#': //L3 Voltage (5th honorific)
        return 'L3_Voltage_5'
        break;
      case '72.7.6#': //L3 Voltage (6th honorific)
        return 'L3_Voltage_6'
        break;
      case '72.7.7#': //L3 Voltage (7th honorific)
        return 'L3_Voltage_7'
        break;
      case '72.7.8#': //L3 Voltage (8th honorific)
        return 'L3_Voltage_8'
        break;
      case '72.7.9#': //L3 Voltage (9th honorific)
        return 'L3_Voltage_9'
        break;
      case '72.7.10#': //L3 Voltage (10th honorific)
        return 'L3_Voltage_10'
        break;
      case '72.7.11#': //L3 Voltage (11st honorific)
        return 'L3_Voltage_11'
        break;
      case '72.7.12#': //L3 Voltage (12nd honorific)
        return 'L3_Voltage_12'
        break;
      case '72.7.13#': //L3 Voltage (13st honorific)
        return 'L3_Voltage_13'
        break;
      case '72.7.14#': //L3 Voltage (14th honorific)
        return 'L3_Voltage_14'
        break;
      case '72.7.15#': //L3 Voltage (15th honorific)
        return 'L3_Voltage_15'
        break;
      case '72.7.16#': //L3 Voltage (16th honorific)
        return 'L3_Voltage_16'
        break;
      case '72.7.17#': //L3 Voltage (17th honorific)
        return 'L3_Voltage_17'
        break;
      case '72.7.18#': //L3 Voltage (18th honorific)
        return 'L3_Voltage_18'
        break;
      case '72.7.19#': //L3 Voltage (19th honorific)
        return 'L3_Voltage_19'
        break;
      case '72.7.20#': //L3 Voltage (20th honorific)
        return 'L3_Voltage_20'
        break;
      case '72.7.21#': //L3 Voltage (21st honorific)
        return 'L3_Voltage_21'
        break;

      case '31.7.1#': //L1 Current (1st honorific)
        return 'L1_Current_1'
        break;
      case '31.7.2#': //L1 Current (2nd honorific)
        return 'L1_Current_2'
        break;
      case '31.7.3#': //L1 Current (3st honorific)
        return 'L1_Current_3'
        break;
      case '31.7.4#': //L1 Current (4th honorific)
        return 'L1_Current_4'
        break;
      case '31.7.5#': //L1 Current (5th honorific)
        return 'L1_Current_5'
        break;
      case '31.7.6#': //L1 Current (6th honorific)
        return 'L1_Current_6'
        break;
      case '31.7.7#': //L1 Current (7th honorific)
        return 'L1_Current_7'
        break;
      case '31.7.8#': //L1 Current (8th honorific)
        return 'L1_Current_8'
        break;
      case '31.7.9#': //L1 Current (9th honorific)
        return 'L1_Current_9'
        break;
      case '31.7.10#': //L1 Current (10th honorific)
        return 'L1_Current_10'
        break;
      case '31.7.11#': //L1 Current (11st honorific)
        return 'L1_Current_11'
        break;
      case '31.7.12#': //L1 Current (12nd honorific)
        return 'L1_Current_12'
        break;
      case '31.7.13#': //L1 Current (13st honorific)
        return 'L1_Current_13'
        break;
      case '31.7.14#': //L1 Current (14th honorific)
        return 'L1_Current_14'
        break;
      case '31.7.15#': //L1 Current (15th honorific)
        return 'L1_Current_15'
        break;
      case '31.7.16#': //L1 Current (16th honorific)
        return 'L1_Current_16'
        break;
      case '31.7.17#': //L1 Current (17th honorific)
        return 'L1_Current_17'
        break;
      case '31.7.18#': //L1 Current (18th honorific)
        return 'L1_Current_18'
        break;
      case '31.7.19#': //L1 Current (19th honorific)
        return 'L1_Current_19'
        break;
      case '31.7.20#': //L1 Current (20th honorific)
        return 'L1_Current_20'
        break;
      case '31.7.21#': //L1 Current (21st honorific)
        return 'L1_Current_21'
        break;

      case '51.7.1#': //L2 Current (1st honorific)
        return 'L2_Current_1'
        break;
      case '51.7.2#': //L2 Current (2nd honorific)
        return 'L2_Current_2'
        break;
      case '51.7.3#': //L2 Current (3st honorific)
        return 'L2_Current_3'
        break;
      case '51.7.4#': //L2 Current (4th honorific)
        return 'L2_Current_4'
        break;
      case '51.7.5#': //L2 Current (5th honorific)
        return 'L2_Current_5'
        break;
      case '51.7.6#': //L2 Current (6th honorific)
        return 'L2_Current_6'
        break;
      case '51.7.7#': //L2 Current (7th honorific)
        return 'L2_Current_7'
        break;
      case '51.7.8#': //L2 Current (8th honorific)
        return 'L2_Current_8'
        break;
      case '51.7.9#': //L2 Current (9th honorific)
        return 'L2_Current_9'
        break;
      case '51.7.10#': //L2 Current (10th honorific)
        return 'L2_Current_10'
        break;
      case '51.7.11#': //L2 Current (11st honorific)
        return 'L2_Current_11'
        break;
      case '51.7.12#': //L2 Current (12nd honorific)
        return 'L2_Current_12'
        break;
      case '51.7.13#': //L2 Current (13st honorific)
        return 'L2_Current_13'
        break;
      case '51.7.14#': //L2 Current (14th honorific)
        return 'L2_Current_14'
        break;
      case '51.7.15#': //L2 Current (15th honorific)
        return 'L2_Current_15'
        break;
      case '51.7.16#': //L2 Current (16th honorific)
        return 'L2_Current_16'
        break;
      case '51.7.17#': //L2 Current (17th honorific)
        return 'L2_Current_17'
        break;
      case '51.7.18#': //L2 Current (18th honorific)
        return 'L2_Current_18'
        break;
      case '51.7.19#': //L2 Current (19th honorific)
        return 'L2_Current_19'
        break;
      case '51.7.20#': //L2 Current (20th honorific)
        return 'L2_Current_20'
        break;
      case '51.7.21#': //L2 Current (21st honorific)
        return 'L2_Current_21'
        break;

      case '71.7.1#': //L3 Current (1st honorific)
        return 'L3_Current_1'
        break;
      case '71.7.2#': //L3 Current (2nd honorific)
        return 'L3_Current_2'
        break;
      case '71.7.3#': //L3 Current (3st honorific)
        return 'L3_Current_3'
        break;
      case '71.7.4#': //L3 Current (4th honorific)
        return 'L3_Current_4'
        break;
      case '71.7.5#': //L3 Current (5th honorific)
        return 'L3_Current_5'
        break;
      case '71.7.6#': //L3 Current (6th honorific)
        return 'L3_Current_6'
        break;
      case '71.7.7#': //L3 Current (7th honorific)
        return 'L3_Current_7'
        break;
      case '71.7.8#': //L3 Current (8th honorific)
        return 'L3_Current_8'
        break;
      case '71.7.9#': //L3 Current (9th honorific)
        return 'L3_Current_9'
        break;
      case '71.7.10#': //L3 Current (10th honorific)
        return 'L3_Current_10'
        break;
      case '71.7.11#': //L3 Current (11st honorific)
        return 'L3_Current_11'
        break;
      case '71.7.12#': //L3 Current (12nd honorific)
        return 'L3_Current_12'
        break;
      case '71.7.13#': //L3 Current (13st honorific)
        return 'L3_Current_13'
        break;
      case '71.7.14#': //L3 Current (14th honorific)
        return 'L3_Current_14'
        break;
      case '71.7.15#': //L3 Current (15th honorific)
        return 'L3_Current_15'
        break;
      case '71.7.16#': //L3 Current (16th honorific)
        return 'L3_Current_16'
        break;
      case '71.7.17#': //L3 Current (17th honorific)
        return 'L3_Current_17'
        break;
      case '71.7.18#': //L3 Current (18th honorific)
        return 'L3_Current_18'
        break;
      case '71.7.19#': //L3 Current (19th honorific)
        return 'L3_Current_19'
        break;
      case '71.7.20#': //L3 Current (20th honorific)
        return 'L3_Current_20'
        break;
      case '71.7.21#': //L3 Current (21st honorific)
        return 'L3_Current_21'
        break;
      case 'C_51_45':
        if (value.indexOf('STOP') != -1) {
          return 'Đã đóng hòm công tơ'
          break;
        } else {
          return 'Hòm công tơ đang mở'
          break;
        }
      case 'C_51_83_1': //L3 Current (21st honorific)
        if (value.indexOf('STOP') != -1) {
          return 'DCU có điện trở lại'
          break;
        } else {
          return 'DCU mất điện'
          break;
        }

      case 'C.51.87.1#': //L3 Current (21st honorific)
        if (value.indexOf('STOP') != -1) {
          return 'DCU có điện trở lại'
          break;
        } else {
          return 'DCU mất điện'
          break;
        }
      case 'C.51.91.1#': //L3 Current (21st honorific)
        if (value.indexOf('STOP') != -1) {
          return 'DCU có điện trở lại'
          break;
        } else {
          return 'DCU mất điện'
          break;
        }
      default:
        return obis;
        break;
    }
  }
}

function getTenthietbi(idthietbi) {
  var tentb = "NaN";
  $.each(ar, function (k, v) {
    var item = v.split("-");
    if (idthietbi == parseInt(item[0]))
      tentb = item[1];
  })
  return tentb;
}