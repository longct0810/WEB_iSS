var socket = null;
var socketReconnectTimer = null;
var socketHeartbeatTimer = null;
var socketReconnectAttempt = 0;
var socketConnecting = false;
var socketLastMessageAt = 0;
var socketConnectedAt = 0;
var socketDataTimeoutActive = false;
var SOCKET_DATA_TIMEOUT_MS = 2 * 60 * 1000;
var SOCKET_WATCHDOG_INTERVAL_MS = 10 * 1000;
var SMARTGRID_SOCKET_URL = window.SMARTGRID_SOCKET_URL;

function getRealtimeDeviceIds() {
  var ids = new Set();
  var selected = localStorage.getItem("id_thietbi");
  if (selected) ids.add(String(selected));
  try {
    var configured = JSON.parse(localStorage.getItem("lst_tb") || "[]");
    configured.forEach(function (item) {
      var value = typeof item === "object" && item !== null
        ? (item.id_thietbi || item.ID_THIETBI || item.id)
        : String(item).split("-")[0];
      if (value !== undefined && value !== null) ids.add(String(value));
    });
  } catch (error) {
    console.warn("Danh sách thiết bị realtime không hợp lệ:", error);
  }
  return ids;
}

function scheduleSocketReconnect() {
  if (socketReconnectTimer) return;
  var delay = Math.min(30000, 1000 * Math.pow(2, socketReconnectAttempt));
  socketReconnectAttempt += 1;
  socketReconnectTimer = window.setTimeout(function () {
    socketReconnectTimer = null;
    connectRealtimeSocket();
  }, delay);
}

async function getHesTicket(deviceIds) {
  var loginToken = localStorage.getItem("hes_login_token");
  if (!loginToken) throw new Error("LOGIN_REQUIRED");

  var response = await fetch("/api/hes/ws-ticket", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + loginToken
    },
    body: JSON.stringify({ devices: Array.from(deviceIds) })
  });
  if (!response.ok) {
    var error = new Error("Cannot get HES ticket: " + response.status);
    error.status = response.status;
    throw error;
  }
  return response.json();
}

async function connectRealtimeSocket() {
  if (!SMARTGRID_SOCKET_URL) {
    window.dispatchEvent(new CustomEvent("smartgrid:socket-status", {
      detail: { connected: false, stale: false, configurationError: true }
    }));
    return;
  }
  if (socketConnecting) return;
  if (socket && (
    socket.readyState === WebSocket.OPEN ||
    socket.readyState === WebSocket.CONNECTING
  )) return;
  var deviceIds = getRealtimeDeviceIds();
  if (!deviceIds.size) return;

  socketConnecting = true;
  var ticketResponse;
  try {
    ticketResponse = await getHesTicket(deviceIds);
  } catch (error) {
    socketConnecting = false;
    window.dispatchEvent(new CustomEvent("smartgrid:socket-status", {
      detail: { connected: false, stale: false, authError: error.status === 401 || error.status === 403 }
    }));
    if (error.status !== 401 && error.status !== 403) scheduleSocketReconnect();
    return;
  }

  socket = new WebSocket(ticketResponse.wsUrl || SMARTGRID_SOCKET_URL, [
    "hes104-v1",
    "ticket." + ticketResponse.ticket
  ]);
  socketConnecting = false;
  socket.onopen = function () {
    socketReconnectAttempt = 0;
    socketConnectedAt = Date.now();
    if (!socketLastMessageAt) socketLastMessageAt = socketConnectedAt;
    window.dispatchEvent(new CustomEvent("smartgrid:socket-status", {
      detail: { connected: true, stale: false }
    }));
  };
  socket.onmessage = handleRealtimeSocketMessage;
  socket.onerror = function () {
    window.dispatchEvent(new CustomEvent("smartgrid:socket-status", {
      detail: { connected: false, stale: false }
    }));
  };
  socket.onclose = function () {
    window.dispatchEvent(new CustomEvent("smartgrid:socket-status", {
      detail: { connected: false, stale: false }
    }));
    scheduleSocketReconnect();
  };
}
var id_tb = localStorage.getItem("id");
var ar_cb = [];
function handleRealtimeSocketMessage(event) {
  // if (event.data instanceof Blob) {
  //   reader = new FileReader();
  //   reader.onload = () => {
  //     var data = JSON.parse(reader.result);
  //     var log_data = "";

  //     $.each(data, function (k, v) {
  //       var id_thietbi = v[1];
  //       var ioa = v[2];
  //       var value_ioa = v[3];
  //       var time_ioa = v[4];
  //       var label = $("#value_ioa_" + id_thietbi + "_" + ioa).attr(
  //         "inkscape:label",
  //       );
  //       var scale = 1;
  //       var status = "UN";
  //       var color = "red";
  //       switch (label) {
  //         case "trangthai":
  //           if (value_ioa === 1) {
  //             status = "(Đang đóng)";
  //             color = "green";
  //           } else {
  //             status = "(Đang cắt)";
  //           }

  //           break;
  //         case "canhbao":
  //           console.log("CANH BAO 1", value_ioa);
  //           if (value_ioa === 1) {
  //             status = "CB_OFF";
  //             color = "green";
  //           } else {
  //             status = "CB_ON";
  //           }

  //           break;
  //         case undefined:
  //           scale = parseFloat(
  //             $("#value_ioa_" + id_thietbi + "_" + ioa).attr("inkscape:label"),
  //           );
  //           break;
  //         default:
  //           scale = 1;
  //       }

  //       // console.log($("#value_ioa_" + id_thietbi + "_" + ioa).attr('inkscape:label'))
  //       if (ar.includes(id_thietbi)) {
  //         switch (status) {
  //           case "UN":
  //             $("#time_ioa_" + id_thietbi + "_" + ioa).html(time_ioa);
  //             $("#value_ioa_" + id_thietbi + "_" + ioa).html(
  //               (value_ioa * scale).toFixed(1),
  //             );
  //             break;
  //           case "CB_ON":
  //           case "CB_OFF":
  //             $("#canhbao_ioa_" + id_thietbi + "_" + ioa).css("fill", color);
  //             break;
  //           default:
  //             $("#value_ioa_" + id_thietbi + "_" + ioa).html(status);
  //             $("#value_ioa_" + id_thietbi + "_" + ioa).css("color", color);
  //             break;
  //         }
  //       }
  //     });
  //   };

  //   reader.readAsText(event.data);
  // } else {
  console.log("Data: " + event.data);
  let data_arr;
  try {
    data_arr = JSON.parse(event.data);
  } catch (parseError) {
    console.warn("Bỏ qua bản tin socket không hợp lệ:", parseError);
    return;
  }
  if (data_arr && data_arr.type === "READY") {
    var devices = Array.from(getRealtimeDeviceIds());
    if (devices.length && socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({ type: "SUBSCRIBE", devices: devices }));
    }
    return;
  }
  if (!Array.isArray(data_arr)) return;
  socketLastMessageAt = Date.now();
  if (socketDataTimeoutActive) {
    socketDataTimeoutActive = false;
    window.dispatchEvent(new CustomEvent("smartgrid:data-timeout", {
      detail: {
        active: false,
        recovered: true,
        recoveredAt: new Date().toISOString(),
        lastMessageAt: new Date(socketLastMessageAt).toISOString()
      }
    }));
  }
  console.log("Data socket.onmessage: " + data_arr);
  //$("#canhbao_ioa_366621_23").removeAttr("style").attr("fill", "green");
  $.each(data_arr, function (k, v) {
    //console.log(v)
    var id_thietbi = v[1];
    var ioa = v[2];
    var value_ioa = v[3];
    var time_ioa = v[4];
    var label = $("#value_ioa_" + id_thietbi + "_" + ioa).attr(
      "inkscape:label",
    );
    var scale = 1;
    var status = "UN";
    var color = "red";
    switch (label) {
      case "trangthai":
        if (parseInt(value_ioa) === 1) {
          status = "CB_OFF";
          color = "green";
        } else if (parseInt(value_ioa) === 2) {
          status = "CB_ON";
          color = "yellow";
        } else {
          status = "CB_ON";
          color = "red";
        }

        break;
      case "canhbao":
        if (parseInt(value_ioa) === 1) {
          status = "CB_OFF";
          color = "green";
        } else {
          status = "CB_ON";
        }

        break;
      case undefined:
        scale = parseFloat(
          $("#value_ioa_" + id_thietbi + "_" + ioa).attr("inkscape:label"),
        );
        break;
      default:
        scale = parseFloat(
          $("#value_ioa_" + id_thietbi + "_" + ioa).attr("inkscape:label"),
        );
    }

    // console.log($("#value_ioa_" + id_thietbi + "_" + ioa).attr('inkscape:label'))
    if (getRealtimeDeviceIds().has(String(id_thietbi))) {
      switch (status) {
        case "UN": {
          const rawValue = Number(value_ioa);

          let scale = Number(
            $("#tbl_value_ioa_" + id_thietbi + "_" + ioa).data("scale")
          );

          if (!Number.isFinite(scale)) scale = 1;

          let finalValue = rawValue;

          if (ioa === 4002) {
            finalValue = Number($("#tbl_value_ioa_" + id_thietbi + "_9").text());
            scale = 1;
          }

          if (ioa === 4202) {
            finalValue = Number($("#tbl_value_ioa_" + id_thietbi + "_13").text());
            scale = 1;
          }

          if (!Number.isFinite(finalValue)) return;

          $("#time_ioa_" + id_thietbi + "_" + ioa).html(time_ioa);

          $("#value_ioa_" + id_thietbi + "_" + ioa).html(
            (finalValue * scale).toFixed(3)
          );

          $("#tbl_value_ioa_" + id_thietbi + "_" + ioa).html(
            (finalValue * scale).toFixed(3)
          );

          break;
        }
        case "CB_ON":
        case "CB_OFF":
          const $el = $("#SVGContainer").find(
            "#value_ioa_" + id_thietbi + "_" + ioa,
          );
          $el[0].style.setProperty("fill", color, "important");

          if (color === "red" && label === "canhbao") {
            $el.addClass("blink-glow");
          }

          const $el_bg = $("#SVGContainer").find(
            "#value_ioa_" + id_thietbi + "_" + ioa + "_bg",
          );
          if (!$el_bg.length) return;

          // clear class cũ
          $el_bg.removeClass(function (index, className) {
            return (className.match(/bg-\S+/g) || []).join(" ");
          });

          if (color === "yellow" && label === "trangthai") {
            $el_bg.addClass("bg-" + color + " blink-glow");
          }
          break;
        default:
          $("#value_ioa_" + id_thietbi + "_" + ioa).html(status);
          $("#value_ioa_" + id_thietbi + "_" + ioa).css("color", color);
          break;
      }
    }
  });
  if (typeof window.pushPowerAIRealtime === "function") {
    window.pushPowerAIRealtime(data_arr);
  }
  if (typeof window.pushTHDRealtime === "function") {
    window.pushTHDRealtime(data_arr);
  }
  if (typeof window.pushElectricalRealtime === "function") {
    window.pushElectricalRealtime(data_arr);
  }
  // }
}
function setBlink(ioa, isAlert) {
  const $el = $("#SVGContainer").find("#value_ioa_" + id_thietbi + "_" + ioa);

  if (!$el.length) return;

  if (isAlert) {
    $el.addClass("blink").css("fill", "red");
  } else {
    $el.removeClass("blink").css("fill", "green");
  }
}
function getTenthietbi(idthietbi) {
  var tentb = "NaN";
  $.each(Array.from(getRealtimeDeviceIds()), function (k, v) {
    var item = v.split("-");
    if (idthietbi == parseInt(item[0])) tentb = item[1];
  });
  return tentb;
}

socketHeartbeatTimer = window.setInterval(function () {
  var now = Date.now();
  var referenceTime = socketLastMessageAt || socketConnectedAt || now;
  var elapsed = now - referenceTime;
  var stale = elapsed >= SOCKET_DATA_TIMEOUT_MS;

  if (stale && !socketDataTimeoutActive) {
    socketDataTimeoutActive = true;
    window.dispatchEvent(new CustomEvent("smartgrid:data-timeout", {
      detail: {
        active: true,
        recovered: false,
        severity: "critical",
        code: "DATA_STREAM_TIMEOUT",
        title: "Server mất dữ liệu",
        message: "Không nhận được dữ liệu realtime từ socket trong hơn 2 phút.",
        timeoutSeconds: Math.floor(elapsed / 1000),
        lastMessageAt: referenceTime ? new Date(referenceTime).toISOString() : null,
        detectedAt: new Date(now).toISOString()
      }
    }));
  }

  window.dispatchEvent(new CustomEvent("smartgrid:socket-status", {
    detail: {
      connected: Boolean(socket && socket.readyState === WebSocket.OPEN),
      stale: stale,
      lastMessageAt: referenceTime ? new Date(referenceTime).toISOString() : null
    }
  }));

  // Đóng kết nối lỗi để cơ chế reconnect hoạt động, nhưng chỉ sau ngưỡng 2 phút.
  if (stale && socket && socket.readyState === WebSocket.OPEN) {
    socket.close();
  }
}, SOCKET_WATCHDOG_INTERVAL_MS);

connectRealtimeSocket();
