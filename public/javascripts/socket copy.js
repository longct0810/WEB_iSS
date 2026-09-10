var socket = new WebSocket("wss://smartgrid.ifc.com.vn:6332");
socket.onopen = function () {
  //console.log("Connected to socket server.");
};
var id_tb = localStorage.getItem("id");
var ar = [366643, 366621, 157, 366502]; //JSON.parse(localStorage.getItem("lst_tb"));
var ar_cb = [];
socket.onmessage = function (event) {
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
  // console.log("Data: " + event.data);
  const data_arr = JSON.parse(event.data);
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
    if (ar.includes(id_thietbi)) {
      switch (status) {
        case "UN":

          scale = parseFloat(
            $("#tbl_value_ioa_" + id_thietbi + "_" + ioa).data("scale")
          );

          $("#time_ioa_" + id_thietbi + "_" + ioa).html(time_ioa);
          $("#value_ioa_" + id_thietbi + "_" + ioa).html(
            (value_ioa * scale).toFixed(3),
          );
          if (ioa === 4002) {
            value_ioa = $("#tbl_value_ioa_" + id_thietbi + "_9").text();
            scale = 1;
          }
          if (ioa === 4202) {
            value_ioa = $("#tbl_value_ioa_" + id_thietbi + "_13").text();
            scale = 1;

          }
          $("#tbl_value_ioa_" + id_thietbi + "_" + ioa).html(
            (value_ioa * scale).toFixed(3),
          );

          //updateValueWithFlip("value_ioa_" + id_thietbi + "_" + ioa, (value_ioa * scale).toFixed(1));
          break;
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
  // }
};
socket.onclose = function () {
  console.log("Disconnected from socket server.");
};
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
  $.each(ar, function (k, v) {
    var item = v.split("-");
    if (idthietbi == parseInt(item[0])) tentb = item[1];
  });
  return tentb;
}
