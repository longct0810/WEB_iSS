$(document).ready(function () {
  if (!localStorage.getItem("us")) {
    window.location.href = "../login";
  }
  handleSidebarNode();
  $("#cb_macdinh").click(function () {
    get_macdinh();
  });
  $("#btncapnhat_danhsachcanhbao").click(function () {
    save_cauhinh_canhbao();
  });
  $("#btncapnhat_vanhanh").click(function () {
    save_cauhinh_vanhanh();
  });
});
function handleSidebarNode() {
  var node = JSON.parse(localStorage.getItem("node"));
  var tree = node.tree;
  if (tree == 2) {
    $(".danhsachcanhbao").show();
    $(".canhbaovanhanh").hide();
    load_cauhinh_canhbao();
  } else {
    $(".danhsachcanhbao").hide();
    $(".canhbaovanhanh").show();
    LayDanhSachCauHinhCanhBao();
  }
}
function save_cauhinh_canhbao() {
  var cambien_nhiet_duoi = $("#cambien_nhiet_duoi").val();
  var cambien_nhiet_tren = $("#cambien_nhiet_tren").val();
  var cambien_nhiet_type = $("#hdcambiennhiet").val();
  var cambien_nhiet_check = $("#chkcambiennhiet").prop("checked") == true ? "1" : "0";
  //
  var cambien_doam_duoi = $("#cambien_doam_duoi").val();
  var cambien_doam_tren = $("#cambien_doam_tren").val();
  var cambien_doam_type = $("#hdcambiendoam").val();
  var cambien_doam_check = $("#chkcambiendoam").prop("checked") == true ? "1" : "0";
  //
  var nhietdo_fi_duoi = $("#cambien_nhiet_fi_duoi").val();
  var nhietdo_fi_tren = $("#cambien_nhiet_fi_tren").val();
  var nhietdo_fi_type = $("#hdcambiennhietdofi").val();
  var nhietdo_fi_check = $("#chkcambiennhietdofi").prop("checked") == true ? "1" : "0";
  //
  var dong_fi_duoi = $("#dong_fi_duoi").val();
  var dong_fi_tren = $("#dong_fi_tren").val();
  var dong_fi_type = $("#hddongfi").val();
  var dong_fi_check = $("#chkcambiendongfi").prop("checked") == true ? "1" : "0";
  //
  var cambien_khi_duoi = "0";
  var cambien_khi_tren = "0";
  var cambien_khi_type = $("#hdcambienkhi").val();
  var cambien_khi_check = $("#chkcambienkhi").prop("checked") == true ? "1" : "0";
  //
  var dienap_pin_type = $("#hddienappin").val();
  var dienap_pin_check = $("#chkcambiendienappin").prop("checked") == true ? "1" : "0";
  if (cambien_nhiet_duoi == "" || cambien_nhiet_tren == "" || cambien_doam_duoi == "" || cambien_doam_tren == "" || nhietdo_fi_duoi == "" || nhietdo_fi_tren == ""
    || dong_fi_duoi == "" || dong_fi_tren == ""
  ) {
    toastr.error("Vui lòng nhập vào các trường", "Thông báo", {
      positionClass: "toast-bottom-right",
      timeOut: 5e3,
      closeButton: !0,
      debug: !1,
      newestOnTop: !0,
      progressBar: !0,
      preventDuplicates: !0,
      onclick: null,
      showDuration: "300",
      hideDuration: "1000",
      extendedTimeOut: "1000",
      showEasing: "swing",
      hideEasing: "linear",
      showMethod: "fadeIn",
      hideMethod: "fadeOut",
      tapToDismiss: !1
    });
    return;
  }
  var para = {
    v_cambien_nhiet_duoi: cambien_nhiet_duoi,
    v_cambien_nhiet_tren: cambien_nhiet_tren,
    v_cambien_nhiet_type: cambien_nhiet_type,
    v_cambien_nhiet_check: cambien_nhiet_check,
    v_cambien_doam_duoi: cambien_doam_duoi,
    v_cambien_doam_tren: cambien_doam_tren,
    v_cambien_doam_type: cambien_doam_type,
    v_cambien_doam_check: cambien_doam_check,
    v_nhietdo_fi_duoi: nhietdo_fi_duoi,
    v_nhietdo_fi_tren: nhietdo_fi_tren,
    v_nhietdo_fi_type: nhietdo_fi_type,
    v_nhietdo_fi_check: nhietdo_fi_check,
    v_dong_fi_duoi: dong_fi_duoi,
    v_dong_fi_tren: dong_fi_tren,
    v_dong_fi_type: dong_fi_type,
    v_dong_fi_check: dong_fi_check,
    v_cambien_khi_duoi: cambien_khi_duoi,
    v_cambien_khi_tren: cambien_khi_tren,
    v_cambien_khi_type: cambien_khi_type,
    v_cambien_khi_check: cambien_khi_check,
    v_dienap_pin_type: dienap_pin_type,
    v_dienap_pin_check: dienap_pin_check
  }
  $.ajax({
    url: "/api/canhbao_cauhinh_save_canhbao",
    data: JSON.stringify(para),
    type: "POST",
    contentType: "application/json;charset=utf-8",
    dataType: "json",
    success: function (lst) {

      if (lst[0][0].indexOf('thành công') > -1) {
        toastr.success(lst[0][0], "Thông báo", {
          positionClass: "toast-bottom-right",
          timeOut: 5e3,
          closeButton: !0,
          debug: !1,
          newestOnTop: !0,
          progressBar: !0,
          preventDuplicates: !0,
          onclick: null,
          showDuration: "300",
          hideDuration: "1000",
          extendedTimeOut: "1000",
          showEasing: "swing",
          hideEasing: "linear",
          showMethod: "fadeIn",
          hideMethod: "fadeOut",
          tapToDismiss: !1
        });
        load_cauhinh_canhbao();
      }
      else {
        toastr.error(lst[0][0], "Thông báo", {
          positionClass: "toast-bottom-right",
          timeOut: 5e3,
          closeButton: !0,
          debug: !1,
          newestOnTop: !0,
          progressBar: !0,
          preventDuplicates: !0,
          onclick: null,
          showDuration: "300",
          hideDuration: "1000",
          extendedTimeOut: "1000",
          showEasing: "swing",
          hideEasing: "linear",
          showMethod: "fadeIn",
          hideMethod: "fadeOut",
          tapToDismiss: !1
        });
      }

    },
    error: function (errormessage) {
      toastr.error(errormessage.responseJSON.message, "Thông báo", {
        positionClass: "toast-bottom-right",
        timeOut: 5e3,
        closeButton: !0,
        debug: !1,
        newestOnTop: !0,
        progressBar: !0,
        preventDuplicates: !0,
        onclick: null,
        showDuration: "300",
        hideDuration: "1000",
        extendedTimeOut: "1000",
        showEasing: "swing",
        hideEasing: "linear",
        showMethod: "fadeIn",
        hideMethod: "fadeOut",
        tapToDismiss: !1
      });
    }
  });


}
function load_cauhinh_canhbao() {
  var para = {
    v_userid: 1
  }
  $.ajax({
    url: "/api/cauhinh_canhbao_IEC_104",
    data: JSON.stringify(para),
    type: "POST",
    contentType: "application/json;charset=utf-8",
    dataType: "json",
    success: function (result) {
      drawData(result);
    },
    error: function (errormessage) {
      toastr.error(errormessage.responseJSON.message, "Thông báo", {
        positionClass: "toast-bottom-right",
        timeOut: 5e3,
        closeButton: !0,
        debug: !1,
        newestOnTop: !0,
        progressBar: !0,
        preventDuplicates: !0,
        onclick: null,
        showDuration: "300",
        hideDuration: "1000",
        extendedTimeOut: "1000",
        showEasing: "swing",
        hideEasing: "linear",
        showMethod: "fadeIn",
        hideMethod: "fadeOut",
        tapToDismiss: !1
      });
    }
  });
}

function drawData(lst) {
  $.each(lst, function (k, v) {
    var data = JSON.parse(v);
    if (data.type == 1) {
      $("#cambien_nhiet_duoi").val(data.nguong_duoi);
      $("#cambien_nhiet_tren").val(data.nguong_tren);
      $("#chkcambiennhiet").prop("checked", data.bat_canhbao == 0 ? false : true);
    }
    else if (data.type == 2) {
      $("#cambien_nhiet_fi_duoi").val(data.nguong_duoi);
      $("#cambien_nhiet_fi_tren").val(data.nguong_tren);
      $("#chkcambiennhietdofi").prop("checked", data.bat_canhbao == 0 ? false : true);
    }
    else if (data.type == 3) {
      $("#cambien_doam_duoi").val(data.nguong_duoi);
      $("#cambien_doam_tren").val(data.nguong_tren);
      $("#chkcambiendoam").prop("checked", data.bat_canhbao == 0 ? false : true);
    }
    else if (data.type == 4) {
      $("#dong_fi_duoi").val(data.nguong_duoi);
      $("#dong_fi_tren").val(data.nguong_tren);
      $("#chkcambiendongfi").prop("checked", data.bat_canhbao == 0 ? false : true);
    }
    else if (data.type == 0) {
      $("#cambien_khi_duoi").val(data.nguong_duoi);
      $("#cambien_khi_tren").val(data.nguong_tren);
      $("#chkcambienkhi").prop("checked", data.bat_canhbao == 0 ? false : true);
    }
    else if (data.type == 5) {
      $("#chkcambiendienappin").prop("checked", data.bat_canhbao == 0 ? false : true);
    }
  });

}
function get_macdinh() {
  $("#txt_U_QUA").val("5");
  $("#txt_U_DUOI").val("5");
  $("#txt_U_MATCB").val("90");
  $("#txt_I_QUA").val("15");
  $("#txt_I_MATCB").val("45");
  $("#txt_I_LECH").val("45");
  $("#txt_COS").val("0.9");
  $("#txt_ANGLE_TREN").val("30");
  $("#txt_ANGLE_DUOI").val("330");
}
function save_cauhinh_vanhanh() {
  var node = JSON.parse(localStorage.getItem("node"));
  let danhmucid = node.id;
  let loaithumuc = node.type;
  let tree = node.tree;
  if (tree != 1 || (tree == 1 && loaithumuc == 9)) {
    toastr.error("Vui lòng chọn danh mục", "Thông báo", {
      positionClass: "toast-bottom-right",
      timeOut: 5e3,
      closeButton: !0,
      debug: !1,
      newestOnTop: !0,
      progressBar: !0,
      preventDuplicates: !0,
      onclick: null,
      showDuration: "300",
      hideDuration: "1000",
      extendedTimeOut: "1000",
      showEasing: "swing",
      hideEasing: "linear",
      showMethod: "fadeIn",
      hideMethod: "fadeOut",
      tapToDismiss: !1
    });
    return;
  }
  var v_UTREN = $("#txt_U_QUA").val();
  var v_UDUOI = $("#txt_U_DUOI").val();
  var v_UTILE = $("#txt_U_MATCB").val();
  var v_U_STATUS = $("#CB_U").prop("checked") == true ? 1 : 0;
  var v_ITREN = $("#txt_I_QUA").val();
  var v_IDUOI = $("#txt_I_MATCB").val();
  var v_IO = $("#txt_I_LECH").val();
  var v_I_STATUS = $("#CB_I").prop("checked") == true ? 1 : 0;
  var v_CB_COSPHI = $("#txt_COS").val();
  var v_COS_STATUS = $("#CB_CosPhi").prop("checked") == true ? 1 : 0;
  var v_ANGELTREN = $("#txt_ANGLE_TREN").val();
  var v_ANGELDUOI = $("#txt_ANGLE_DUOI").val();
  var v_ANGLE_STATUS = $("#CB_GocLech").prop("checked") == true ? 1 : 0;
  if (v_UTREN == "" || v_UDUOI == "" || v_UTILE == "")
    return "Chưa thiết lập thông số cảnh báo điện áp";

  if (v_ITREN == "" || v_IDUOI == "" || v_IO == "")
    return "Chưa thiết lập thông số cảnh báo dòng điện";

  if (v_UTREN == "" || v_UDUOI == "" || v_UTILE == "")
    return "Chưa thiết lập thông số cảnh báo điện áp";

  if (v_CB_COSPHI == "")
    return "Chưa thiết lập cảnh báo hệ số công suất - Cos(φ)";
  if (v_ANGELTREN == "" || v_ANGELDUOI == "")
    return "Chưa thiết lập cảnh báo góc lệch pha (φ)";

  var para = {
    v_MATAIKHOAN: 1,
    v_DANHMUCID: danhmucid,
    v_UTREN: v_UTREN,
    v_UDUOI: v_UDUOI,
    v_UTILE: v_UTILE,
    v_U_STATUS: v_U_STATUS,
    v_ITREN: v_ITREN,
    v_IDUOI: v_IDUOI,
    v_IO: v_IO,
    v_I_STATUS: v_I_STATUS,
    v_CB_COSPHI: v_CB_COSPHI,
    v_COS_STATUS: v_COS_STATUS,
    v_ANGELTREN: v_ANGELTREN,
    v_ANGELDUOI: v_ANGELDUOI,
    v_ANGLE_STATUS: v_ANGLE_STATUS
  }
  $.ajax({
    url: "/api/canhbao_cauhinh_save_canhbaovanhanh",
    data: JSON.stringify(para),
    type: "POST",
    contentType: "application/json;charset=utf-8",
    dataType: "json",
    success: function (lst) {

      if (lst[0][0].indexOf('thành công') > -1) {
        toastr.success(lst[0][0], "Thông báo", {
          positionClass: "toast-bottom-right",
          timeOut: 5e3,
          closeButton: !0,
          debug: !1,
          newestOnTop: !0,
          progressBar: !0,
          preventDuplicates: !0,
          onclick: null,
          showDuration: "300",
          hideDuration: "1000",
          extendedTimeOut: "1000",
          showEasing: "swing",
          hideEasing: "linear",
          showMethod: "fadeIn",
          hideMethod: "fadeOut",
          tapToDismiss: !1
        });
        LayDanhSachCauHinhCanhBao();
      }
      else {
        toastr.error(lst[0][0], "Thông báo", {
          positionClass: "toast-bottom-right",
          timeOut: 5e3,
          closeButton: !0,
          debug: !1,
          newestOnTop: !0,
          progressBar: !0,
          preventDuplicates: !0,
          onclick: null,
          showDuration: "300",
          hideDuration: "1000",
          extendedTimeOut: "1000",
          showEasing: "swing",
          hideEasing: "linear",
          showMethod: "fadeIn",
          hideMethod: "fadeOut",
          tapToDismiss: !1
        });
      }

    },
    error: function (errormessage) {
      toastr.error(errormessage.responseJSON.message, "Thông báo", {
        positionClass: "toast-bottom-right",
        timeOut: 5e3,
        closeButton: !0,
        debug: !1,
        newestOnTop: !0,
        progressBar: !0,
        preventDuplicates: !0,
        onclick: null,
        showDuration: "300",
        hideDuration: "1000",
        extendedTimeOut: "1000",
        showEasing: "swing",
        hideEasing: "linear",
        showMethod: "fadeIn",
        hideMethod: "fadeOut",
        tapToDismiss: !1
      });
    }
  });

}
function LayDanhSachCauHinhCanhBao() {
  var node = JSON.parse(localStorage.getItem("node"));
  let danhmucid = node.id;
  let loaithumuc = node.type;
  let tree = node.tree;
  if (tree != 1 || (tree == 1 && loaithumuc == 9)) {
    toastr.error("Vui lòng chọn danh mục", "Thông báo", {
      positionClass: "toast-bottom-right",
      timeOut: 5e3,
      closeButton: !0,
      debug: !1,
      newestOnTop: !0,
      progressBar: !0,
      preventDuplicates: !0,
      onclick: null,
      showDuration: "300",
      hideDuration: "1000",
      extendedTimeOut: "1000",
      showEasing: "swing",
      hideEasing: "linear",
      showMethod: "fadeIn",
      hideMethod: "fadeOut",
      tapToDismiss: !1
    });
    return;
  }
  var para = {
    v_danhmucid: danhmucid
  }
  $.ajax({
    url: "/api/canhbao_laydanhsach_vanhanh",
    data: JSON.stringify(para),
    type: "POST",
    contentType: "application/json;charset=utf-8",
    dataType: "json",
    success: function (result) {
      var data = result[0];
      $("#txt_U_QUA").val(data.u_tren);
      $("#txt_U_DUOI").val(data.u_duoi);
      $("#txt_U_MATCB").val(data.tile_umax);
      $("#txt_I_QUA").val(data.i_tren);
      $("#txt_I_MATCB").val(data.i_duoi);
      $("#txt_I_LECH").val(data.io);
      $("#txt_COS").val(data.cos_value);
      $("#txt_ANGLE_TREN").val(data.angle_tren);
      $("#txt_ANGLE_DUOI").val(data.angle_duoi);
      if (data.u_status == 1) {
        $("#CB_U").prop("checked", true)
      } else {
        ("#CB_U").prop("checked", false)
      }
      if (data.i_status == 1) {
        $("#CB_I").prop("checked", true)
      } else {
        ("#CB_I").prop("checked", false)
      }
      if (data.cos_status == 1) {
        $("#CB_CosPhi").prop("checked", true)
      } else {
        ("#CB_CosPhi").prop("checked", false)
      }
      if (data.angle_status == 1) {
        $("#CB_GocLech").prop("checked", true)
      } else {
        ("#CB_GocLech").prop("checked", false)
      }
    },
    error: function (errormessage) {
      toastr.error(errormessage.responseJSON.message, "Thông báo", {
        positionClass: "toast-bottom-right",
        timeOut: 5e3,
        closeButton: !0,
        debug: !1,
        newestOnTop: !0,
        progressBar: !0,
        preventDuplicates: !0,
        onclick: null,
        showDuration: "300",
        hideDuration: "1000",
        extendedTimeOut: "1000",
        showEasing: "swing",
        hideEasing: "linear",
        showMethod: "fadeIn",
        hideMethod: "fadeOut",
        tapToDismiss: !1
      });
    }
  });
}

function get_Udm() {
  var node = JSON.parse(localStorage.getItem("node"));
  let danhmucid = node.id;
  var para = {
    v_danhmucid: danhmucid
  }
  $.ajax({
    url: "/api/canhbao_get_udm",
    data: JSON.stringify(para),
    type: "POST",
    contentType: "application/json;charset=utf-8",
    dataType: "json",
    success: function (result) {
      $("#tbl_thietlap_udm tbody").html("");
      var row = "";

      $.each(result, function (index, item) {
        row += '<tr id=' + item.tu + '><td > Nếu TU = ' + item.tu + ' thì danh định = ' + item.udm + ' (V)' + '</td>';
        if (item.dulieu == 0) {
          row += "<td><input type='checkbox' class='form-check-input cb_tu'></td>";
        } else {
          row += "<td><input type='checkbox' class='form-check-input cb_tu' checked></td>";
        }

        row += '</tr>';
      });
      $("#tbl_thietlap_udm tbody").html(row);
    },
    error: function (errormessage) {
      toastr.error(errormessage.responseJSON.message, "Thông báo", {
        positionClass: "toast-bottom-right",
        timeOut: 5e3,
        closeButton: !0,
        debug: !1,
        newestOnTop: !0,
        progressBar: !0,
        preventDuplicates: !0,
        onclick: null,
        showDuration: "300",
        hideDuration: "1000",
        extendedTimeOut: "1000",
        showEasing: "swing",
        hideEasing: "linear",
        showMethod: "fadeIn",
        hideMethod: "fadeOut",
        tapToDismiss: !1
      });
    }
  })
}

$("#them_khaibao_udm").click(function () {
  var tu = $("#txt_tu").val();
  var udm = $("#txt_udm").val();
  if (tu == "" && udm == "") {
    toastr.error("Chưa nhập TU, Udm", "Thông báo", {
      positionClass: "toast-bottom-right",
      timeOut: 5e3,
      closeButton: !0,
      debug: !1,
      newestOnTop: !0,
      progressBar: !0,
      preventDuplicates: !0,
      onclick: null,
      showDuration: "300",
      hideDuration: "1000",
      extendedTimeOut: "1000",
      showEasing: "swing",
      hideEasing: "linear",
      showMethod: "fadeIn",
      hideMethod: "fadeOut",
      tapToDismiss: !1
    });
    return;
  }
  var para = {
    v_tu: tu,
    v_udm: udm,
  }
  $.ajax({
    url: "/api/canhbao_save_udm",
    data: JSON.stringify(para),
    type: "POST",
    contentType: "application/json;charset=utf-8",
    dataType: "json",
    success: function (lst) {
      var data = lst[0].result;
      if (data.indexOf('thành công') > -1) {
        toastr.success(data, "Thông báo", {
          positionClass: "toast-bottom-right",
          timeOut: 5e3,
          closeButton: !0,
          debug: !1,
          newestOnTop: !0,
          progressBar: !0,
          preventDuplicates: !0,
          onclick: null,
          showDuration: "300",
          hideDuration: "1000",
          extendedTimeOut: "1000",
          showEasing: "swing",
          hideEasing: "linear",
          showMethod: "fadeIn",
          hideMethod: "fadeOut",
          tapToDismiss: !1
        });
        $("#txt_tu").val("");
        $("#txt_udm").val("");
        get_Udm();
      }
      else {
        toastr.error(data, "Thông báo", {
          positionClass: "toast-bottom-right",
          timeOut: 5e3,
          closeButton: !0,
          debug: !1,
          newestOnTop: !0,
          progressBar: !0,
          preventDuplicates: !0,
          onclick: null,
          showDuration: "300",
          hideDuration: "1000",
          extendedTimeOut: "1000",
          showEasing: "swing",
          hideEasing: "linear",
          showMethod: "fadeIn",
          hideMethod: "fadeOut",
          tapToDismiss: !1
        });
      }

    },
    error: function (errormessage) {
      toastr.error(errormessage.responseJSON.message, "Thông báo", {
        positionClass: "toast-bottom-right",
        timeOut: 5e3,
        closeButton: !0,
        debug: !1,
        newestOnTop: !0,
        progressBar: !0,
        preventDuplicates: !0,
        onclick: null,
        showDuration: "300",
        hideDuration: "1000",
        extendedTimeOut: "1000",
        showEasing: "swing",
        hideEasing: "linear",
        showMethod: "fadeIn",
        hideMethod: "fadeOut",
        tapToDismiss: !1
      });
    }
  });

});

$("#update_khaibao_udm").click(function () {
  var listchucnangquyen = [];
  var node = JSON.parse(localStorage.getItem("node"));
  let danhmucid = node.id;
  $('#tbl_thietlap_udm tbody tr').each(function () {
    var xem = $(($(this).find(".cb_tu"))).is(':checked') == true ? 1 : 0;
    var info =
    {
      matu: $(this).attr("id"),
      apdung: xem
    };

    listchucnangquyen.push(info);
  });
  if (listchucnangquyen == "[]") {
    alert("Vui lòng chọn công thức udm để áp dụng");
    return;
  }
  var para = {
    v_apdung: JSON.stringify(listchucnangquyen),
    v_mataikhoanthuchien: 1,
    v_danhmucid: danhmucid
  }

  $.ajax({
    url: "/api/canhbao_apdung_udm",
    data: JSON.stringify(para),
    type: "POST",
    contentType: "application/json;charset=utf-8",
    dataType: "json",
    success: function (lst) {
      var data = lst[0].result;
      if (data.indexOf('thành công') > -1) {
        toastr.success(data, "Thông báo", {
          positionClass: "toast-bottom-right",
          timeOut: 5e3,
          closeButton: !0,
          debug: !1,
          newestOnTop: !0,
          progressBar: !0,
          preventDuplicates: !0,
          onclick: null,
          showDuration: "300",
          hideDuration: "1000",
          extendedTimeOut: "1000",
          showEasing: "swing",
          hideEasing: "linear",
          showMethod: "fadeIn",
          hideMethod: "fadeOut",
          tapToDismiss: !1
        });
        $("#txt_tu").val("");
        $("#txt_udm").val("");
        get_Udm();
      }
      else {
        toastr.error(data, "Thông báo", {
          positionClass: "toast-bottom-right",
          timeOut: 5e3,
          closeButton: !0,
          debug: !1,
          newestOnTop: !0,
          progressBar: !0,
          preventDuplicates: !0,
          onclick: null,
          showDuration: "300",
          hideDuration: "1000",
          extendedTimeOut: "1000",
          showEasing: "swing",
          hideEasing: "linear",
          showMethod: "fadeIn",
          hideMethod: "fadeOut",
          tapToDismiss: !1
        });
      }

    },
    error: function (errormessage) {
      toastr.error(errormessage.responseJSON.message, "Thông báo", {
        positionClass: "toast-bottom-right",
        timeOut: 5e3,
        closeButton: !0,
        debug: !1,
        newestOnTop: !0,
        progressBar: !0,
        preventDuplicates: !0,
        onclick: null,
        showDuration: "300",
        hideDuration: "1000",
        extendedTimeOut: "1000",
        showEasing: "swing",
        hideEasing: "linear",
        showMethod: "fadeIn",
        hideMethod: "fadeOut",
        tapToDismiss: !1
      });
    }
  });
});

function get_Idm() {
  var node = JSON.parse(localStorage.getItem("node"));
  let danhmucid = node.id;
  var para = {
    v_danhmucid: danhmucid
  }
  $.ajax({
    url: "/api/canhbao_get_idm",
    data: JSON.stringify(para),
    type: "POST",
    contentType: "application/json;charset=utf-8",
    dataType: "json",
    success: function (result) {
      $("#tbl_thietlap_idm tbody").html("");
      var row = "";

      $.each(result, function (index, item) {
        row += '<tr id=' + item.ti + '><td > Nếu TI = ' + item.ti + ' thì danh định = ' + item.idm + ' (A)' + '</td>';
        if (item.dulieu == 0) {
          row += "<td><input type='checkbox' class='form-check-input cb_ti'></td>";
        } else {
          row += "<td><input type='checkbox' class='form-check-input cb_ti' checked></td>";
        }

        row += '</tr>';
      });
      $("#tbl_thietlap_idm tbody").html(row);
    },
    error: function (errormessage) {
      toastr.error(errormessage.responseJSON.message, "Thông báo", {
        positionClass: "toast-bottom-right",
        timeOut: 5e3,
        closeButton: !0,
        debug: !1,
        newestOnTop: !0,
        progressBar: !0,
        preventDuplicates: !0,
        onclick: null,
        showDuration: "300",
        hideDuration: "1000",
        extendedTimeOut: "1000",
        showEasing: "swing",
        hideEasing: "linear",
        showMethod: "fadeIn",
        hideMethod: "fadeOut",
        tapToDismiss: !1
      });
    }
  })
}

$("#them_khaibao_idm").click(function () {
  var ti = $("#txt_ti").val();
  var idm = $("#txt_idm").val();
  if (ti == "" && idm == "") {
    toastr.error("Chưa nhập TI, Idm", "Thông báo", {
      positionClass: "toast-bottom-right",
      timeOut: 5e3,
      closeButton: !0,
      debug: !1,
      newestOnTop: !0,
      progressBar: !0,
      preventDuplicates: !0,
      onclick: null,
      showDuration: "300",
      hideDuration: "1000",
      extendedTimeOut: "1000",
      showEasing: "swing",
      hideEasing: "linear",
      showMethod: "fadeIn",
      hideMethod: "fadeOut",
      tapToDismiss: !1
    });
    return;
  }
  var para = {
    v_ti: ti,
    v_idm: idm,
  }
  $.ajax({
    url: "/api/canhbao_save_idm",
    data: JSON.stringify(para),
    type: "POST",
    contentType: "application/json;charset=utf-8",
    dataType: "json",
    success: function (lst) {
      var data = lst[0].result;
      if (data.indexOf('thành công') > -1) {
        toastr.success(data, "Thông báo", {
          positionClass: "toast-bottom-right",
          timeOut: 5e3,
          closeButton: !0,
          debug: !1,
          newestOnTop: !0,
          progressBar: !0,
          preventDuplicates: !0,
          onclick: null,
          showDuration: "300",
          hideDuration: "1000",
          extendedTimeOut: "1000",
          showEasing: "swing",
          hideEasing: "linear",
          showMethod: "fadeIn",
          hideMethod: "fadeOut",
          tapToDismiss: !1
        });
        $("#txt_ti").val("");
        $("#txt_idm").val("");
        get_Idm();
      }
      else {
        toastr.error(data, "Thông báo", {
          positionClass: "toast-bottom-right",
          timeOut: 5e3,
          closeButton: !0,
          debug: !1,
          newestOnTop: !0,
          progressBar: !0,
          preventDuplicates: !0,
          onclick: null,
          showDuration: "300",
          hideDuration: "1000",
          extendedTimeOut: "1000",
          showEasing: "swing",
          hideEasing: "linear",
          showMethod: "fadeIn",
          hideMethod: "fadeOut",
          tapToDismiss: !1
        });
      }

    },
    error: function (errormessage) {
      toastr.error(errormessage.responseJSON.message, "Thông báo", {
        positionClass: "toast-bottom-right",
        timeOut: 5e3,
        closeButton: !0,
        debug: !1,
        newestOnTop: !0,
        progressBar: !0,
        preventDuplicates: !0,
        onclick: null,
        showDuration: "300",
        hideDuration: "1000",
        extendedTimeOut: "1000",
        showEasing: "swing",
        hideEasing: "linear",
        showMethod: "fadeIn",
        hideMethod: "fadeOut",
        tapToDismiss: !1
      });
    }
  });

});

$("#update_khaibao_idm").click(function () {
  var listchucnangquyen = [];
  var node = JSON.parse(localStorage.getItem("node"));
  let danhmucid = node.id;
  $('#tbl_thietlap_idm tbody tr').each(function () {
    var xem = $(($(this).find(".cb_ti"))).is(':checked') == true ? 1 : 0;
    var info =
    {
      mati: $(this).attr("id"),
      apdung: xem
    };

    listchucnangquyen.push(info);
  });
  if (listchucnangquyen == "[]") {
    alert("Vui lòng chọn công thức udm để áp dụng");
    return;
  }
  var para = {
    v_apdung: JSON.stringify(listchucnangquyen),
    v_mataikhoanthuchien: 1,
    v_danhmucid: danhmucid
  }

  $.ajax({
    url: "/api/canhbao_apdung_idm",
    data: JSON.stringify(para),
    type: "POST",
    contentType: "application/json;charset=utf-8",
    dataType: "json",
    success: function (lst) {
      var data = lst[0].result;
      if (data.indexOf('thành công') > -1) {
        toastr.success(data, "Thông báo", {
          positionClass: "toast-bottom-right",
          timeOut: 5e3,
          closeButton: !0,
          debug: !1,
          newestOnTop: !0,
          progressBar: !0,
          preventDuplicates: !0,
          onclick: null,
          showDuration: "300",
          hideDuration: "1000",
          extendedTimeOut: "1000",
          showEasing: "swing",
          hideEasing: "linear",
          showMethod: "fadeIn",
          hideMethod: "fadeOut",
          tapToDismiss: !1
        });
        $("#txt_ti").val("");
        $("#txt_idm").val("");
        get_Idm();
      }
      else {
        toastr.error(data, "Thông báo", {
          positionClass: "toast-bottom-right",
          timeOut: 5e3,
          closeButton: !0,
          debug: !1,
          newestOnTop: !0,
          progressBar: !0,
          preventDuplicates: !0,
          onclick: null,
          showDuration: "300",
          hideDuration: "1000",
          extendedTimeOut: "1000",
          showEasing: "swing",
          hideEasing: "linear",
          showMethod: "fadeIn",
          hideMethod: "fadeOut",
          tapToDismiss: !1
        });
      }

    },
    error: function (errormessage) {
      toastr.error(errormessage.responseJSON.message, "Thông báo", {
        positionClass: "toast-bottom-right",
        timeOut: 5e3,
        closeButton: !0,
        debug: !1,
        newestOnTop: !0,
        progressBar: !0,
        preventDuplicates: !0,
        onclick: null,
        showDuration: "300",
        hideDuration: "1000",
        extendedTimeOut: "1000",
        showEasing: "swing",
        hideEasing: "linear",
        showMethod: "fadeIn",
        hideMethod: "fadeOut",
        tapToDismiss: !1
      });
    }
  });
});