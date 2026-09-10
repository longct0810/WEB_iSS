
var Base64 = { _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=", encode: function (e) { var t = ""; var n, r, i, s, o, u, a; var f = 0; e = Base64._utf8_encode(e); while (f < e.length) { n = e.charCodeAt(f++); r = e.charCodeAt(f++); i = e.charCodeAt(f++); s = n >> 2; o = (n & 3) << 4 | r >> 4; u = (r & 15) << 2 | i >> 6; a = i & 63; if (isNaN(r)) { u = a = 64 } else if (isNaN(i)) { a = 64 } t = t + this._keyStr.charAt(s) + this._keyStr.charAt(o) + this._keyStr.charAt(u) + this._keyStr.charAt(a) } return t }, decode: function (e) { var t = ""; var n, r, i; var s, o, u, a; var f = 0; e = e.replace(/[^A-Za-z0-9\+\/\=]/g, ""); while (f < e.length) { s = this._keyStr.indexOf(e.charAt(f++)); o = this._keyStr.indexOf(e.charAt(f++)); u = this._keyStr.indexOf(e.charAt(f++)); a = this._keyStr.indexOf(e.charAt(f++)); n = s << 2 | o >> 4; r = (o & 15) << 4 | u >> 2; i = (u & 3) << 6 | a; t = t + String.fromCharCode(n); if (u != 64) { t = t + String.fromCharCode(r) } if (a != 64) { t = t + String.fromCharCode(i) } } t = Base64._utf8_decode(t); return t }, _utf8_encode: function (e) { e = e.replace(/\r\n/g, "\n"); var t = ""; for (var n = 0; n < e.length; n++) { var r = e.charCodeAt(n); if (r < 128) { t += String.fromCharCode(r) } else if (r > 127 && r < 2048) { t += String.fromCharCode(r >> 6 | 192); t += String.fromCharCode(r & 63 | 128) } else { t += String.fromCharCode(r >> 12 | 224); t += String.fromCharCode(r >> 6 & 63 | 128); t += String.fromCharCode(r & 63 | 128) } } return t }, _utf8_decode: function (e) { var t = ""; var n = 0; var r = c1 = c2 = 0; while (n < e.length) { r = e.charCodeAt(n); if (r < 128) { t += String.fromCharCode(r); n++ } else if (r > 191 && r < 224) { c2 = e.charCodeAt(n + 1); t += String.fromCharCode((r & 31) << 6 | c2 & 63); n += 2 } else { c2 = e.charCodeAt(n + 1); c3 = e.charCodeAt(n + 2); t += String.fromCharCode((r & 15) << 12 | (c2 & 63) << 6 | c3 & 63); n += 3 } } return t } };
 

var idchungquyen = 0;
var count_xem = 0;
var count_them = 0;
var count_sua = 0;
var count_xoa = 0;
var count_download = 0;
var count_in = 0;
var countlength = 0;
// Load
$(document).ready(function () {
  if (!localStorage.getItem("us")) {
    window.location.href = "../login";
  }
  get_cbo_user();
  $("#bt_xemq_apquyen").change(function () {
    var checked_status = this.checked;
    $("input[name='xem_apquyen']").each(function () {
      this.checked = checked_status;
    });
  });
  $("#bt_themq_apquyen").change(function () {
    var checked_status = this.checked;
    $("input[name='them_apquyen']").each(function () {
      this.checked = checked_status;
    });
  });
  $("#bt_suaq_apquyen").change(function () {
    var checked_status = this.checked;
    $("input[name='sua_apquyen']").each(function () {
      this.checked = checked_status;
    });
  });
  $("#bt_xoaq_apquyen").change(function () {
    var checked_status = this.checked;
    $("input[name='xoa_apquyen']").each(function () {
      this.checked = checked_status;
    });
  });
  $("#cb_taikhoan_apquyen").change(function () {
    var id = $(this).val();
    if (id == "-1") {
      $("#table_apquyen").empty();
      return;
    }
    loadquyentheouser(id);
  });
  //// click để cập nhật
  $("#btn_capnhat_apquyen").click(function () {
    Save_quyen_user();
  });

});

function Save_quyen_user() {
  try {

    if ($("#cb_taikhoan_apquyen").val() == "0") {
      alert("Chưa chọn tài khoản phân quyền");
      return;
    }

    var listchucnangquyen = [];
    $('#table_apquyen tr').each(function () {
      var xem = $(($(this).find(".xem_apquyen"))).is(':checked') == true ? 1 : 0;
      var them = $(($(this).find(".them_apquyen"))).is(':checked') == true ? 1 : 0;
      var sua = $(($(this).find(".sua_apquyen"))).is(':checked') == true ? 1 : 0;
      var xoa = $(($(this).find(".xoa_apquyen"))).is(':checked') == true ? 1 : 0;

      var info =
      {
        machucnang: $(this).attr("idquyen"), xem: xem, them: them, sua: sua, xoa: xoa
      };

      listchucnangquyen.push(info);
    });

    if (listchucnangquyen == "[]") {
      alert("Chưa chọn quyền thích hợp");
      return;
    }

    var mataikhoanint = parseInt($("#cb_taikhoan_apquyen").val());
    // tham số insert vào bảng
    var paraobj = JSON.stringify(listchucnangquyen);
    //  var dscauhinhcanhbao = JSON.stringify(is_listcauhinh);


    //
    var para = {
      v_quyen: paraobj,
      v_mataikhoan: mataikhoanint,
      v_mataikhoanthuchien: 1
    }

    var url = "/api/phanquyen_ganquyen";
    var lst = ExecuteServiceSyns(JSON.stringify(para), url);

    if (lst[0][0].indexOf('thành công') > -1) {
      alert(lst[0][0]);
      get_cbo_user();
      $("#bt_xemq_apquyen").prop("checked", false);
      $("#bt_themq_apquyen").prop("checked", false);
      $("#bt_suaq_apquyen").prop("checked", false);
      $("#bt_xoaq_apquyen").prop("checked", false);
      $("#table_apquyen").empty();

    }
    else {
      alert(lst[0][0]);
    }

  } catch (e) {
    console.log(e);
  }
}


function clear_taikhoan() {
  try {
    // loadquyentheouser(0);
    $("#bt_xemq_apquyen").attr("checked", false);
    $("#bt_themq_apquyen").attr("checked", false);
    $("#bt_suaq_apquyen").attr("checked", false);
    $("#bt_xoaq_apquyen").attr("checked", false);
    $("#bt_suaktq_apquyen").attr("checked", false);
    $(".xem_apquyen").removeAttr("checked");
    $(".them_apquyen").removeAttr("checked");
    $(".sua_apquyen").removeAttr("checked");
    $(".xoa_apquyen").removeAttr("checked");
    $(".download_apquyen").removeAttr("checked");
    $(".in_apquyen").removeAttr("checked");

    $("#bt_downloadq_apquyen").attr("checked", false);
    $("#bt_inq_apquyen").attr("checked", false);
    $("#cb_danhsachmau_apquyen").val("0");
    $("#cb_taikhoan_apquyen").val("0");
    // $('#cb_taikhoan_apquyen').select2("val", "0");

  } catch (e) {
    //console.log(e);
  }
}


function load_danhsach_nguoidung() {
  var para = {
    v_mataikhoan: -1
  }
  
  var url = "/api/quanly_ds_taikhoan";
  var lst = ExecuteServiceSyns(JSON.stringify(para), url);
  drawData(lst);
  
}




function get_cbo_user() {

  var para = {
    v_mataikhoan: -1
  }
  var url = "/api/quanly_ds_taikhoan";
  var lst = ExecuteServiceSyns(JSON.stringify(para), url);
  var option = "<option value= ''>--Chọn tài khoản--</option>"
  $.each(lst, function (k, v) {
    var data = JSON.parse(v);
    option += "<option value=" + data.mataikhoan + ">" + data.taikhoan + ' - ' + data.tennguoidung + "</option>"
  })
  $("#cb_taikhoan_apquyen").html(option);
}


// loadquyen theo userID

function loadquyentheouser(userID) {

  //$("#bt_xemq_apquyen").attr("checked", false);
  //$("#bt_themq_apquyen").attr("checked", false);
  //$("#bt_suaq_apquyen").attr("checked", false);
  //$("#bt_xoaq_apquyen").attr("checked", false);
  var useridint = parseInt(userID);
  var para = {
    v_mataikhoan: useridint
  }

  var url = "/api/phanquyen_layds";
  var lst = ExecuteServiceSyns(JSON.stringify(para), url);

  countlength = 0;
  count_xem = 0;
  $("#table_apquyen").empty();
  $.each(lst, function (key, v) {
 
    var val = JSON.parse(v);
    countlength++;
    var tr = "";
    tr += "<tr idquyen=" + parseInt(val.machucnang) + "><td style='text-align:center'>"
      + val.stt + "</td> <td style='text-align:left'>"
      + val.tenchucnang + "</td><td style='text-align:center'>"
    if (val.xem == "1") {
      count_xem++;
      tr += '<input type="checkbox" checked name="xem_apquyen" class="xem_apquyen" /> </td><td style="text-align:center" hidden>'
    }
    else {
      tr += '<input type="checkbox"  name="xem_apquyen" class="xem_apquyen" /> </td><td style="text-align:center" hidden>'
    }
    if (val.them == "1") {
      count_them++;
      tr += '<input type="checkbox" checked name="them_apquyen" class="them_apquyen" hidden/> </td><td style="text-align:center" hidden>'
    }
    else {
      tr += '<input type="checkbox"  name="them_apquyen" class="them_apquyen" hidden /> </td><td style="text-align:center" hidden>'
    }
    if (val.sua == "1") {
      count_sua++;
      tr += '<input type="checkbox" checked name="sua_apquyen" class="sua_apquyen" /> </td><td style="text-align:center" hidden>'
    }
    else {
      tr += '<input type="checkbox"  name="sua_apquyen" class="sua_apquyen" /> </td><td style="text-align:center"hidden>'
    }
    if (val.xoa == "1") {
      count_xoa++;
      tr += '<input type="checkbox" checked name="xoa_apquyen" class="xoa_apquyen" /> </td><td style="text-align:center"hidden>'
    } else {
      tr += '<input type="checkbox"  name="xoa_apquyen" class="xoa_apquyen" /> </td><td style="text-align:center"hidden>'
    }

    $("#table_apquyen").append(tr);
  });

  // --------------start
  if (countlength == count_xem && count_xem > 0) {
    $("#bt_xemq_apquyen").prop("checked", true);
  } else {
    $("#bt_xemq_apquyen").prop("checked", false);
  }
  $(".xem_apquyen").change(function () {
    // alert($(this).prop("checked"));
    if ($(this).prop("checked") == true) {
      count_xem++;
    } else {
      count_xem--;
    }
    if (countlength == count_xem && count_xem > 0) {
      $("#bt_xemq_apquyen").prop("checked", true);
    } else {
      $("#bt_xemq_apquyen").prop("checked", false);
    }

  });

  if (countlength == count_them && count_them > 0) {
    $("#bt_themq_apquyen").prop("checked", true);
  } else {
    $("#bt_themq_apquyen").prop("checked", false);
  }
  $(".them_apquyen").change(function () {
    // alert($(this).prop("checked"));
    if ($(this).prop("checked") == true) {
      count_them++;
    } else {
      count_them--;
    }
    if (countlength == count_them && count_them > 0) {
      $("#bt_themq_apquyen").prop("checked", true);
    } else {
      $("#bt_themq_apquyen").prop("checked", false);
    }

  });

  if (countlength == count_sua && count_sua > 0) {
    $("#bt_suaq_apquyen").prop("checked", true);
  } else {
    $("#bt_suaq_apquyen").prop("checked", false);
  }
  $(".sua_apquyen").change(function () {
    // alert($(this).prop("checked"));
    if ($(this).prop("checked") == true) {
      count_sua++;
    } else {
      count_sua--;
    }
    if (countlength == count_sua && count_sua > 0) {
      $("#bt_suaq_apquyen").prop("checked", true);
    } else {
      $("#bt_suaq_apquyen").prop("checked", false);
    }

  });

  if (countlength == count_xoa && count_xoa > 0) {
    $("#bt_xoaq_apquyen").prop("checked", true);
  } else {
    $("#bt_xoaq_apquyen").prop("checked", false);
  }
  $(".xoa_apquyen").change(function () {
    // alert($(this).prop("checked"));
    if ($(this).prop("checked") == true) {
      count_xoa++;
    } else {
      count_xoa--;
    }
    if (countlength == count_xoa && count_xoa > 0) {
      $("#bt_xoaq_apquyen").prop("checked", true);
    } else {
      $("#bt_xoaq_apquyen").prop("checked", false);
    }

  });

  // --------------end

}
