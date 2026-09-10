var socket = new WebSocket("wss://smartgrid.ifc.com.vn:6331");
socket.onopen = function () {
  console.log("Connected to socket server DAT");
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
        if (data.sukien = "1.0.95.1.6") {
          console.log(event.data);
          createToast("Điện áp thấp: " + socongto + "; " + "sukien" + "; " + "Thời gian: " + time);
        }
      }
    };

    reader.readAsText(event.data);
  } else {
    console.log("Data: " + event.data);
    var data = JSON.parse(event.data);
    var log_data = "";
    if (data != null) {
      var imei = data.imei;
      var socongto = data.socongto;
      var time = formatDateTime(data.time);
      var value = data.value;

    //  var sukien = getTensukien(data.sukien, value);

    if (data.sukien != "1.0.95.1.6") {
      console.log(event.data);
      createToast("Điện áp thấp: " + socongto + "; " + "sukien" + "; " + "Thời gian: " + time);
    }

    }
  };
  socket.onclose = function () {
    console.log("Disconnected from socket server.");

  };
  function createToast(msg) {
    toastr.error(msg, "Thông báo", {
      positionClass: "toast-bottom-right",
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
 
}
 