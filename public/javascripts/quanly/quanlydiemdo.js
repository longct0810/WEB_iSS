

var Base64 = { _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=", encode: function (e) { var t = ""; var n, r, i, s, o, u, a; var f = 0; e = Base64._utf8_encode(e); while (f < e.length) { n = e.charCodeAt(f++); r = e.charCodeAt(f++); i = e.charCodeAt(f++); s = n >> 2; o = (n & 3) << 4 | r >> 4; u = (r & 15) << 2 | i >> 6; a = i & 63; if (isNaN(r)) { u = a = 64 } else if (isNaN(i)) { a = 64 } t = t + this._keyStr.charAt(s) + this._keyStr.charAt(o) + this._keyStr.charAt(u) + this._keyStr.charAt(a) } return t }, decode: function (e) { var t = ""; var n, r, i; var s, o, u, a; var f = 0; e = e.replace(/[^A-Za-z0-9\+\/\=]/g, ""); while (f < e.length) { s = this._keyStr.indexOf(e.charAt(f++)); o = this._keyStr.indexOf(e.charAt(f++)); u = this._keyStr.indexOf(e.charAt(f++)); a = this._keyStr.indexOf(e.charAt(f++)); n = s << 2 | o >> 4; r = (o & 15) << 4 | u >> 2; i = (u & 3) << 6 | a; t = t + String.fromCharCode(n); if (u != 64) { t = t + String.fromCharCode(r) } if (a != 64) { t = t + String.fromCharCode(i) } } t = Base64._utf8_decode(t); return t }, _utf8_encode: function (e) { e = e.replace(/\r\n/g, "\n"); var t = ""; for (var n = 0; n < e.length; n++) { var r = e.charCodeAt(n); if (r < 128) { t += String.fromCharCode(r) } else if (r > 127 && r < 2048) { t += String.fromCharCode(r >> 6 | 192); t += String.fromCharCode(r & 63 | 128) } else { t += String.fromCharCode(r >> 12 | 224); t += String.fromCharCode(r >> 6 & 63 | 128); t += String.fromCharCode(r & 63 | 128) } } return t }, _utf8_decode: function (e) { var t = ""; var n = 0; var r = c1 = c2 = 0; while (n < e.length) { r = e.charCodeAt(n); if (r < 128) { t += String.fromCharCode(r); n++ } else if (r > 191 && r < 224) { c2 = e.charCodeAt(n + 1); t += String.fromCharCode((r & 31) << 6 | c2 & 63); n += 2 } else { c2 = e.charCodeAt(n + 1); c3 = e.charCodeAt(n + 2); t += String.fromCharCode((r & 15) << 12 | (c2 & 63) << 6 | c3 & 63); n += 3 } } return t } };
const regex_dautiengviet = /^(?!_)(?!.*__)[a-zA-Z0-9_]{3,50}(?!_)$/;
var current_meterid;
var thaycongto_isheso;
var v_loaihesonhan = "0";
$(document).ready(function () {
  if (!localStorage.getItem("us")) {
    window.location.href = "../login";
  }
  $("#rdhsntrong").prop("checked", true);

  var userinfo = localStorage.getItem("us");
  var user = JSON.parse(Base64.decode(userinfo));
  GetTreeAll_qldmdl(user.danhmucid);


  getChungLoaiCongto();
  load_danhsach_khachhang();
  $("#btnthemmoidiemdo").click(function () {
    themmoidiemdo();
  });
  load_danhsach_DIEMDO();
});
function handleSidebarNode() {
  load_danhsach_DIEMDO();
}

function ThemMoi() {
  const tree = $('#tree_left_qldmdl').jstree(true);
  if (tree) {
    tree.deselect_all(true); // bỏ chọn tất cả node
  }

  localStorage.removeItem("tree_node_tk");
}


// =========================
function buildMap(list) {
  var map = {};
  list.forEach(function (item) {
    map[item.id] = item;
  });
  return map;
}
function getSubTree(list, rootId) {
  var result = [];
  var map = buildMap(list);

  function findChildren(parentId) {
    list.forEach(function (item) {
      if (item.parentid === parentId) {
        result.push(item);
        findChildren(item.id);
      }
    });
  }

  var root = map[rootId];
  if (!root) return [];

  result.push(root);
  findChildren(rootId);
  return result;
}
function GetTreeAll_qldmdl(code) {
  localStorage.removeItem("tree_node_tk");
  $(".easy-tree-qldm").show();
  $("#stree_qldm").show();
  $('.easy-tree-qldm').jstree("destroy");
  $("#help_tree_qldm").hide();
  try {
    var para = {}
    var url = "/api/quanly_ds_danhmuc";
    var lst = ExecuteServiceSyns(JSON.stringify(para), url);
    result_GetTreeAll_qldmdl(lst, code);
  } catch (e) {
    console.log(e);
  }
}

function result_GetTreeAll_qldmdl(obj, code) {
  var rawList = [];

  $.each(obj, function (k) {
    var data = JSON.parse(obj[k]);
    rawList.push(data);
  });

  var filtered = code ? getSubTree(rawList, code) : rawList;
  var jsdataqldm = [];

  filtered.forEach(function (data) {
    var label = data.ip != null
      ? data.label + " (" + data.ip + "/" + data.port + ")"
      : data.label;

    jsdataqldm.push({
      id: data.id,
      parent: (!code || data.id !== code) ? data.parentid : "#",
      text: label,
      icon: data.icon,
      data: {
        id: data.id,
        parent: (!code || data.id !== code) ? data.parentid : "#",
        text: data.label,
        nameparent: data.nameparent,
        ip: data.ip,
        port: data.port,
        tenthietbi: data.label
      }
    });
  });

  initTree_qldm(jsdataqldm, code);
}
function initTree_qldm(data, code) {
  $(".easy-tree-qldm")
    .jstree({
      core: {
        multiple: true,
        animation: 0,
        check_callback: true,
        data: data
      },
      search: {
        show_only_matches: true,
        search_callback: function (str, node) {
          if (node.text.indexOf(str) !== -1) {
            $(".easy-tree-qldm").jstree("open_node", node.id);
            $(".easy-tree-qldm").jstree("select_node", node.id, function (e) {
              if (e.parents.length) {
                $(".easy-tree-qldm").jstree("open_node", e.parent);
              }
            });
          }
        }
      },
      plugins: ["search", "contextmenu"]
    }).on("ready.jstree", function () {
      const tree = $(this).jstree(true);
      tree.open_all();
      if (code) {
        localStorage.setItem("tree_node_tk", JSON.stringify([{ id: code }]));
      }
    });


  $(".easy-tree-qldm").on("changed.jstree", function (e, dataSelected) {
    localStorage.removeItem("tree_node_tk");
    var dataRow = [];

    if (!dataSelected.selected || dataSelected.selected.length === 0) return;

    if (dataSelected.selected.length > 1) {
      for (var i = 0; i < dataSelected.selected.length; i++) {
        dataRow.push({ id: dataSelected.instance.get_node(dataSelected.selected[i]).id });
      }
    } else {
      dataRow.push({ id: dataSelected.instance.get_node(dataSelected.selected[0]).id });
    }

    localStorage.setItem("tree_node_tk", JSON.stringify(dataRow));
  });
}


function load_danhsach_DIEMDO() {
  var node = JSON.parse(localStorage.getItem("node"));
  let danhmucid = node.id == undefined ? "001" : node.id;
  var para = {
    v_danhmucid: String(danhmucid),
    v_mataikhoan: -1,
    v_doituong: "",
    v_loaikh: "",
    v_madiemdo: node.socongto,
    v_trangthai: ""
  }
  var url = "/api/quanly_ds_diemdo";
  var lst = ExecuteServiceSyns(JSON.stringify(para), url);
  drawData(lst);
}
var listkhachhang = [];
function load_danhsach_khachhang() {
  var para = {}
  var url = "/api/quanly_ds_khachhang";
  var lst = ExecuteServiceSyns(JSON.stringify(para), url);
  listkhachhang = [];
  var option = "<option value= ''>--Chọn khách hàng--</option>"
  $.each(lst, function (k, v) {
    var data = JSON.parse(lst[k]);
    option += "<option value=" + data.ma_khachhang + ">" + data.ma_khachhang + "</option>"
    listkhachhang.push({
      ma_khachhang: data.ma_khachhang,
      ten_khachhang: data.ten_khachhang,
      ma_loaikh: data.ma_loaikh,
      ma_doituong: data.ma_doituong,
      sodienthoai: data.sodienthoai
    })
  });
  $("#add_makhachhang").html(option);
  $("#edit_makhachhang").html(option);
}
function getChungLoaiCongto() {
  var para = {}
  var url = "/api/quanly_ds_chungloaicongto";
  var lst = ExecuteServiceSyns(JSON.stringify(para), url);
  var option = "<option value= ''>--Chọn loại công tơ--</option>"
  $.each(lst, function (k, v) {
    var data = JSON.parse(lst[k]);
    option += "<option value=" + data.loaicongto + ">" + data.loaicongto + "</option>"
  });

  $("#cbochungloaicongto_thayct").html(option);
  $("#add_chungloaictkh").html(option);
  $("#sua_chungloaictkh").html(option);
}


function themmoidiemdo() {
  var userinfo = localStorage.getItem("us");
  var user = JSON.parse(Base64.decode(userinfo));

  var madiemdo = $('#add_MaDiemDo').val().trim();
  var makhachhang = $('#add_makhachhang').val();
  var tenkhachhang = $('#add_tenkhachhang').val();
  var socongto = $('#add_SCT').val().trim();
  var imei = $('#add_Imei').val().trim();
  var loaipha = $('#add_LoaiPha').val();
  if (madiemdo === '' || makhachhang === '' || tenkhachhang == "" || socongto === '' || imei === '' || loaipha === '') {
    toastr.error("Vui lòng nhập đầy đủ các trường Mã khách hàng, Tên khách hàng, Mã điểm đo, loại pha, số công tơ", "Thông báo", {
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
    return
  }
  const input_makhachhang = !regex_dautiengviet.test(makhachhang)
  if (input_makhachhang) return alert('Mã khách hàng viết liền, không chứa kí tự đặc biệt và không dấu', 'info')

  const input_madiemdo = !regex_dautiengviet.test(madiemdo)
  if (input_madiemdo) return alert('Mã điểm đo viết liền, không chứa kí tự đặc biệt và không dấu', 'info')

  if (imei.length !== 16) {
    toastr.error("IMEI bao gồm 16 ký tự", "Thông báo", {
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

    return
  }

  var ischeck_TU = 0; var ischeck_TI = 0;
  if ($("#rdhsnngoai").prop("checked") == true) {
    if ($('#checkbox_TU').is(":checked")) {
      ischeck_TU = 1
    } else {
      ischeck_TU = 0
    }

    if ($('#checkbox_TI').is(":checked")) {
      ischeck_TI = 1
    } else {
      ischeck_TI = 0
    }
    if (ischeck_TU === 0 && ischeck_TI === 0) {
      toastr.error("Vui lòng nhập giá trị TU, TI", "Thông báo", {
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

      return
    }
    if (ischeck_TU === 1 && ($("#add_tu_no").val() === "" || $("#add_tysobien_tu").val() === "")) {
      toastr.error("Vui lòng nhập giá trị TU No, tỷ số biến", "Thông báo", {
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
      return
    }

    if (ischeck_TI === 1 && ($("#add_ti_no").val() === "" || $("#add_tysobien_ti").val() === "")) {
      toastr.error("Vui lòng nhập giá trị TI No, tỷ số biến", "Thông báo", {
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
      return
    }
  }
  const selectedNodes = $('.easy-tree-qldm').jstree(true).get_selected(true);
  if (!selectedNodes || selectedNodes.length === 0) {
    showError("Chưa chọn danh mục");
    return;
  }
  // lấy node đầu tiên (vì thêm mới chỉ cần 1 danh mục)
  const danhmucid = selectedNodes[0].id;

  var para = {

    v_danhmucid: danhmucid,
    v_madiemdo: madiemdo,
    v_makhachhang: $('#add_makhachhang').val(),
    v_tenkhachhang: $('#add_tenkhachhang').val(),
    v_ma_loai_kh: $('#add_LoaiKH').val(),
    v_ma_doi_tuong_kh: $('#add_doituongkh').val(),
    v_ghichu: $('#add_ghichu_kh').val(),

    v_macot: $('#add_macot').val(),
    v_matram: $('#add_matram').val(),
    v_soghi: $('#add_soghi').val(),

    v_loaipha: parseInt(loaipha),
    v_socongto: socongto,
    v_loaicongto: $("#add_chungloaictkh").val(),
    v_matkhaucongto: $("#add_makhauctkh").val(),
    v_outstation: $("#add_Outstation").val(),

    v_cs_giao: parseInt($("#add_cstreo_giao").val()) === null ? 0 : parseInt($("#add_cstreo_giao").val()),
    v_cs_nhan: parseInt($("#add_cstreo_nhan").val()) === null ? 0 : parseInt($("#add_cstreo_nhan").val()),

    v_bt_treo: parseInt($("#add_chiso_bt").val()),
    v_cd_treo: parseInt($("#add_chiso_cd").val()),
    v_td_treo: parseInt($("#add_chiso_td").val()),
    v_sg_treo: parseInt($("#add_chiso_sg").val()),
    v_vc_treo: parseInt($("#add_chiso_vc").val()),

    v_bn_treo: parseInt($("#add_chiso_bn").val()),
    v_cn_treo: parseInt($("#add_chiso_cn").val()),
    v_tn_treo: parseInt($("#add_chiso_tn").val()),
    v_sn_treo: parseInt($("#add_chiso_sn").val()),
    v_vn_treo: parseInt($("#add_chiso_vn").val()),

    v_imei: imei,
    v_loaiheso: v_loaihesonhan,

    v_TU_NO: $("#add_tu_no").val(),
    v_NAMSANXUAT_TU: $("#add_nam_SX_tu").val(),
    v_NGAY_KD_TU: $("#add_ngay_kd_tu").val(),
    v_LOAI_TU: $("#add_loai_tu").val(),
    v_TYSOBIEN_TU: $("#add_tysobien_tu").val(),
    v_MATEM_TU: $("#add_matem_tu").val(),
    v_MACHI_TU: $("#add_ma_chi_tu").val(),
    v_SOVIEN_CHI_TU: $("#add_sovien_chi_tu").val(),
    v_SOVIEN_TEM_TU: $("#add_sovien_tem_tu").val(),

    v_TI_NO: $("#add_ti_no").val(),
    v_NAMSANXUAT_TI: $("#add_nam_SX_ti").val(),
    v_NGAY_KD_TI: $("#add_ngay_kd_ti").val(),
    v_LOAI_TI: $("#add_loai_ti").val(),
    v_TYSOBIEN_TI: $("#add_tysobien_ti").val(),
    v_MATEM_TI: $("#add_matem_ti").val(),
    v_MACHI_TI: $("#add_ma_chi_ti").val(),
    v_SOVIEN_CHI_TI: $("#add_sovien_chi_ti").val(),
    v_SOVIEN_TEM_TI: $("#add_sovien_tem_ti").val(),
    v_CHECK_TU: ischeck_TU,
    v_CHECK_TI: ischeck_TI,
    v_din_dk: $("#add_din_dk").val()
  }

  var url = "/api/quanly_them_diemdo";
  var lst = ExecuteServiceSyns(JSON.stringify(para), url);
  if (lst[0][0].indexOf('OK') > -1) {
    toastr.success("Thêm mới thành công", "Thông báo", {
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
    clearControl();
    $("#modal_them_diemdo").modal("hide");
    $('.modal-backdrop').css('display', 'none');
    load_danhsach_DIEMDO();


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
}


function drawData(obj) {
  var row = "";
  var activeRequestsTable = $("#tbl_danhsachnguoidung").DataTable();
  activeRequestsTable.state.clear();
  activeRequestsTable.destroy();
  $("#tbl_danhsachnguoidung tbody").empty();
  var stt = 0;
  $.each(obj, function (k, v) {
    var data = JSON.parse(obj[k]);
    stt = stt + 1;
    row += "<tr>"
    row += "<td>" + stt + "</td>";
    row += "<td>" + retNull(data.madiemdo) + "</td>";
    row += "<td>" + retNull(data.ten_khachhang) + "</td>";
    row += "<td>" + retNull(data.socongto) + "</td>";
    row += "<td>" + retNull(data.imei) + "</td>";
    row += "<td>" + retNull(data.trangthai) + "</td>";
    row += "<td>" + retNull(data.thoidiemcodl) + "</td>";
    row += '<td  class="text-center" style="white-space: nowrap;">' +
      `<a href="#" title='Sửa thông tin điểm đo' class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#modal-x1-editkh" onclick = "Load_data_modal_KH('${data.meterid}')" style="padding:0.5rem 1rem;">  <i class="fa fa-edit"></i> </a> ` +
      `<a href="#"  title='Thanh lý điểm đo'  class="btn btn-warning" onclick = "f_thanhly('${data.meterid}')" style="padding:0.5rem 1rem;"> <i class="fa fa-eye"></i> </a> ` +
      '</td > '
    row += '<td  class="text-center" style="white-space: nowrap;">' +
      `<a href="#" title='Sửa thông tin công tơ'  class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#modal-editcongto" onclick = "Load_data_modal_CTO('${data.meterid}')" style="padding:0.5rem 1rem;">  <i class="fa fa-edit"></i> </a> ` +
      `<a href="#" title='Thay công tơ'  class="btn btn-warning" data-bs-toggle="modal" data-bs-target="#modal-thayctkh"  onclick = "thayctkh('${data.meterid}', '${data.socongto}', '${data.loaiheso}')" style="padding:0.5rem 1rem;"><i class="fa fa-eye"></i></a> ` +
      '</td > '
    row += '<td  class="text-center" style="white-space: nowrap;">' +
      `<a href="#" title="Thay modem/dcu"  class="btn btn-warning" data-bs-toggle="modal" data-bs-target="#modal-sua_MODEM_DCU" onclick = "Load_data_modal_DCU('${data.meterid}')" style="padding:0.5rem 1rem;"> <i class="fa fa-eye"></i> </a> ` +

      '</td > ';

    row += "</tr>"
  });
  $("#tbl_danhsachnguoidung tbody").html(row);

  getStyleTable1();

}


//=========================Sửa thông tin khách hàng===================

function clearControl() {
  try {
    $('#add_makhachhang').val('')
    $('#add_doituongkh').val('')
    $('#add_LoaiKH').val('')
    $("#add_MaDiemDo").val("")
    $("#add_tenkhachhang").val("")
    $("#add_DCKH").val("")
    $("#add_LoaiPha").val("1")
    $("#add_ghichu").val("")
    $("#add_SCT").val("")
    $("#add_chungloaictkh").val("");
    $("#add_makhauctkh").val("")
    //$("#add_ngaytreokh").datepicker("setDate", gettimenow())
    $("#add_cstreokh").val("")
    $("#add_Imei").val("")
    $(".kh_3pha").attr("style", "display:none")
    $("#add_bttreokh").val("")
    $("#add_bttreokh").val("")
    $("#add_cdtreokh").val("")
    $("#add_tdtreokh").val("")
    $("#add_sgtreokh").val("")
    $("#add_vctreokh").val("")
    $("#tuNgoai").val("")
    $("#tiNgoai").val("")
    $("#kqhsnngoai").val("")
    $("#add_tu_no").val('')
    $("#add_nam_SX_tu").val('')
    $("#add_ngay_kd_tu").val('')
    $("#add_loai_tu").val('')
    $("#add_tysobien_tu").val('')
    $("#add_matem_tu").val('')
    $("#add_ma_chi_tu").val('')
    $("#add_sovien_chi_tu").val('')
    $("#add_sovien_tem_tu").val('')

    $("#add_ti_no").val('')
    $("#add_nam_SX_ti").val('')
    $("#add_ngay_kd_ti").val('')
    $("#add_loai_ti").val('')
    $("#add_tysobien_ti").val('')
    $("#add_matem_ti").val('')
    $("#add_ma_chi_ti").val('')
    $("#add_sovien_chi_ti").val('')
    $("#add_sovien_tem_ti").val('')
    $("#add_tenkhachhang").val('')
    $("#add_diachiKH").val('')
    $("#add_matram").val('')
    $("#add_macot").val('')
    $("#add_soghi").val('')
    $("#add_ghichu_kh").val('')
    $("#add_Outstation").val('')
    $("#add_cstreo_giao").val('')
    $("#add_cstreo_nhan").val('')
    $("#rdhsntrong").prop("checked", true)
    $("#rdhsnngoai").prop("checked", false)
    $(".is_TU").attr("style", "display:none")
    $(".is_TI").attr("style", "display:none")
    $("input[name='tuTrong']").val("1/1")
    $("input[name='tiTrong']").val("1/1")
    $("input[name='hsnTrong']").val("1")
    $("#add_Nhanh").val("-1").trigger('change');
    $("#add_din_dk").val("");
  } catch (e) {
    console.error(e)
  };
}



function tysobienTu() {
  var giatri = $("#add_tysobien_tu").val()
  if (giatri.indexOf("/") < 0) {
    var x = document.getElementById("add_tysobien_tu")
    if (isNaN(x.value) === true) {
      alert("Tỷ số biến TU nhập số nguyên hoặc x/y")
      $("#add_tysobien_tu").val("")
      return
    }

    tyso = x.value + '/1'
    $("#add_tysobien_tu").val(tyso)
  } else {
    const myArray = giatri.split("/")
    var tuso = myArray[0]
    var mauso = myArray[1]
    if (isNaN(tuso) === true || isNaN(mauso) === true) {
      alert("Tỷ số biến TU nhập x/y (trong đó x: số nguyên, y: số nguyên)")
      $("#add_tysobien_tu").val("")
      return
    }
  }
}
function tysobienTI() {
  var giatri = $("#add_tysobien_ti").val()
  if (giatri.indexOf("/") < 0) {
    var x = document.getElementById("add_tysobien_ti")
    if (isNaN(x.value) === true) {
      alert("Tỷ số biến TI nhập số nguyên hoặc x/y")
      $("#add_tysobien_ti").val("")
      return
    }
    tyso = x.value + '/1'
    $("#add_tysobien_ti").val(tyso)
  } else {
    const myArray = giatri.split("/")
    var tuso = myArray[0]
    var mauso = myArray[1]
    if (isNaN(tuso) === true || isNaN(mauso) === true) {
      alert("Tỷ số biến TI nhập x/y (trong đó x: số nguyên, y: số nguyên)")
      $("#add_tysobien_ti").val("")
      return
    }
  }
}

function Load_data_modal_DCU(meterid) {
  $("#edit_imei_moi").val("");
  $("#btnthayDCU").attr("data-meterid", meterid);
  var para = {
    v_meterid: meterid
  }
  current_meterid = meterid;
  var url = "/api/quanly_lay_tt_diemdo";
  var lst = ExecuteServiceSyns(JSON.stringify(para), url);
  $.each(lst, function (k, v) {
    var data = JSON.parse(v);
    $("#edit_socongto").val(data.socongto)
    $("#edit_imei_cu").val(data.imei)
  });
}
//=========================  sửa thông tin điểm đo==================
function selectDanhMucForEdit(danhmucid) {
  const $tree = $("#tree_left_qldmdl_edit");
  const tree = $tree.jstree(true);
  if (!tree || !danhmucid) return;

  const nodeId = String(danhmucid);

  // bỏ chọn toàn bộ node cũ
  tree.deselect_all(true);

  // mở đường dẫn tới node
  tree._open_to(nodeId);

  // chọn đúng node đã lưu
  tree.select_node(nodeId);


  // scroll tới node để nhìn thấy
  setTimeout(function () {
    const $node = tree.get_node(nodeId, true);
    if ($node && $node.length) {
      const container = $tree.parent();
      if (container.length) {
        container.scrollTop(container.scrollTop() + $node.position().top - 100);
      }
    }
  }, 100);
}
function Load_data_modal_KH(meterid) {
  Clear_cachedata()
  var para = {
    v_meterid: meterid
  }
  current_meterid = meterid;
  var url = "/api/quanly_lay_tt_diemdo";
  var lst = ExecuteServiceSyns(JSON.stringify(para), url);

  $.each(lst, function (k, v) {
    var data = JSON.parse(v);
    $("#edit_MaDiemDo").val(data.madiemdo);
    $("#edit_makhachhang").val(data.makhachhang);
    $("#edit_tenkhachhang").val(data.ten_khachhang);
    $("#edit_LoaiPha").val(data.loaipha);
    $("#edit_matram").val(data.matram);
    $("#edit_macot").val(data.macot);
    $("#edit_soghi").val(data.soghi);
    $("#edit_ghichu_kh").val(data.ghichu);
    $("#edit_LoaiKH").val(data.ma_loaikh);
    $("#edit_doituongkh").val(data.ma_doituong);
    $("#edit_din_dk_kh").val(data.din_dk);
    const $tree = $("#tree_left_qldmdl_edit");
    const tree = $tree.jstree(true);

    if (tree && tree._model && Object.keys(tree._model.data).length > 1) {
      selectDanhMucForEdit(data.code);
    } else {
      $tree.one("ready.jstree", function () {
        selectDanhMucForEdit(data.code);
      });
    }
    var data_row = [];
    data_row.push({ "id": data.code });
    localStorage.setItem("tree_node_tk", JSON.stringify(data_row));

  });
}

function SuaThongTin_diemdo() {

  var madiemdo = $('#edit_MaDiemDo').val().trim();
  var makhachhang = $('#edit_makhachhang').val().trim();
  var loaipha = $('#edit_LoaiPha').val();
  var masoghi = $("#edit_soghi").val();
  var tenkhachhang = $("#edit_tenkhachhang").val();
  var din_dk = $("#edit_din_dk_kh").val();
  var userinfo = localStorage.getItem("us");
  var user = JSON.parse(Base64.decode(userinfo));
  if (madiemdo === '' || makhachhang === '' || loaipha === '' || tenkhachhang == "") {
    alert('Các trường dấu (*) không được để trống')
    return
  }
  // const input_madiemdo = !regex_dautiengviet.test(madiemdo)
  // if (input_madiemdo) return alert('Mã điểm đo viết liền, không chứa kí tự đặc biệt và không dấu', 'info')

  var tree = JSON.parse(localStorage.getItem("tree_node_tk"));
  if (tree == null) { alert("Chưa chọn danh mục"); return; }
  var para = {
    v_meterid: parseInt(current_meterid),
    v_danhmucid: tree[0].id,
    v_madiemdo: madiemdo,
    v_makhachhang: makhachhang,
    v_tenkhachhang: $("#edit_tenkhachhang").val(),
    v_loaipha: parseInt(loaipha),
    v_ghichu: $('#edit_ghichu_kh').val(),
    v_matram: $("#edit_matram").val(),
    v_macot: $("#edit_macot").val(),
    v_soghi: masoghi,
    v_maloai_kh: $("#edit_LoaiKH").val(),
    v_madoituong_kh: $("#edit_doituongkh").val(),
    v_din_dk: din_dk

  }

  var url = "/api/quanly_sua_tt_diemdo";
  var lst = ExecuteServiceSyns(JSON.stringify(para), url);

  if (lst[0][0].indexOf('OK') > -1) {
    toastr.success("Cập nhật thành công", "Thông báo");
    load_danhsach_DIEMDO();
    $('#modal-x1-editkh').modal('hide');
    $('.modal-backdrop').css('display', 'none');

  }
  else {
    toastr.error(lst[0][0], "Thông báo");

  }

}


//=========================Sửa thông tin công tơ==========================
function Load_data_modal_CTO(meterid) {
  current_meterid = meterid;
  Clear_cachedata()
  var para = {
    v_meterid: meterid
  }
  var url = "/api/quanly_lay_tt_diemdo";
  var lst = ExecuteServiceSyns(JSON.stringify(para), url);
  $.each(lst, function (k, x) {
    var v = JSON.parse(x);
    $("#sua_chungloaictkh").val(v.loaicongto)
    $("#sua_SCT").val(v.socongto)
    $("#sua_Imei").val(v.imei)
    $("#sua_makhauctkh").val(v.matkhaucongto)
    $("#sua_Outstation").val(v.outstation)
    if (v.loaiheso === 1) {
      $(".hesonhantrongctkh").hide()
      $(".hesonhanngoaictkh").show()
      $("#checkbox_TU_edit").attr("disabled", true)
      $("#checkbox_TI_edit").attr("disabled", true)
      $('#checkbox_TU_edit').prop('checked', true)
      $(".is_TU_edit").css("display", "block")
      $('#checkbox_TI_edit').prop('checked', true)
      $(".is_TI_edit").css("display", "block")
      //tu

      $("#tbl_hsnhanngoai_suacts tbody").html("<tr><td>" + SetNumbernull(v.tu_no) + "</td>"
        + "<td>" + SetNumbernull(v.namsanxuattu) + "</td>"
        + "<td>" + SetNumbernull(v.ngaykdtu) + "</td>"
        + "<td>" + SetNumbernull(v.loaitu) + "</td>"
        + "<td>" + SetNumbernull(v.tysobientu) + "</td>"
        + "<td>" + SetNumbernull(v.machitu) + "</td>"
        + "<td>" + SetNumbernull(v.sovienchitu) + "</td>"
        + "<td>" + SetNumbernull(v.matemtu) + "</td>"
        + "<td>" + SetNumbernull(v.sovientemtu) + "</td>"
        + "</tr> ")

      //ti
      $("#tbl_hsnhanngoai_suati tbody").html("<tr><td>" + SetNumbernull(v.ti_no) + "</td>"
        + "<td>" + SetNumbernull(v.namsanxuatti) + "</td>"
        + "<td>" + SetNumbernull(v.ngaykdti) + "</td>"
        + "<td>" + SetNumbernull(v.loaiti) + "</td>"
        + "<td>" + SetNumbernull(v.tysobienti) + "</td>"
        + "<td>" + SetNumbernull(v.machiti) + "</td>"
        + "<td>" + SetNumbernull(v.sovienchiti) + "</td>"
        + "<td>" + SetNumbernull(v.matemti) + "</td>"
        + "<td>" + SetNumbernull(v.sovien_temti) + "</td>"
        + "</tr> ")

    } else {
      $(".hesonhantrongctkh").show()
      $(".hesonhanngoaictkh").hide()
      $("#checkbox_TU_edit").attr("disabled", true)
      $("#checkbox_TI_edit").attr("disabled", true)
      $('#checkbox_TU_edit').prop('checked', false)
      $('#checkbox_TI_edit').prop('checked', false)

      $(".is_TU_edit").css("display", "block")
      $(".is_TU_edit").css("display", "none")
      $(".is_TI_edit").css("display", "block")
      $(".is_TI_edit").css("display", "none")

      //hsn
      $("#tuTrongsua").val(v.tu_trong)
      $("#tiTrong").val(v.ti_trong)
      $("#hsnTrong").val(v.hsn_trong)
    }

  });

}

function SuaThongTin_CTO() {

  var socongto = $('#sua_SCT').val().trim()
  var imei = $('#sua_Imei').val().trim()
  if (socongto === '' || imei === '') {
    toastr.error("Các trường dấu (*) không được để trống", "Thông báo", {
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
    return
  }
  var para = {
    v_meterid: parseInt(current_meterid),
    v_socongto: socongto,
    v_loaicongto: $("#sua_chungloaictkh").val(),
    v_matkhaucongto: $("#sua_makhauctkh").val(),
    v_outstation: $("#sua_Outstation").val(),
    v_mataikhoan: 1
  }

  var url = "/api/quanly_sua_tt_cto";
  var lst = ExecuteServiceSyns(JSON.stringify(para), url);

  if (lst[0][0].indexOf('OK') > -1) {
    toastr.success("Cập nhật thành công", "Thông báo");
    load_danhsach_DIEMDO();
    $('#modal-editcongto').modal('hide');
    $('.modal-backdrop').css('display', 'none');

  }
  else {
    alert(lst[0][0]);
  }

}

//=========================THANH LY công tơ==============
function f_thanhly(meterid) {
  var userinfo = localStorage.getItem("us");
  var user = JSON.parse(Base64.decode(userinfo));
  if (confirm("Bạn có chắc chắn muốn thanh lý") === true) {
    var para = {
      v_meterid: parseInt(meterid),
      v_mataikhoan: 1
    }

    var url = "/api/quanly_thanhly_diemdo";
    var lst = ExecuteServiceSyns(JSON.stringify(para), url);
    if (lst[0][0].indexOf('OK') > -1) {
      toastr.success("Thanh lý thành công", "Thông báo");
      load_danhsach_DIEMDO();
    }
    else {
      toastr.error("Thanh lý thất bại", "Thông báo");
    }
  }
}




//================Thay công tơ==============================
function tysobienTu_ThayCT() {
  var giatri = $("#edit_tysobien_tu_tct").val()
  if (giatri.indexOf("/") < 0) {
    var x = document.getElementById("edit_tysobien_tu_tct")
    if (isNaN(x.value) === true) {
      alert("Tỷ số biến TU nhập số nguyên hoặc x/y")
      $("#edit_tysobien_tu_tct").val("")
      return
    }

    tyso = x.value + '/1'
    $("#edit_tysobien_tu_tct").val(tyso)
  } else {
    const myArray = giatri.split("/")
    var tuso = myArray[0]
    var mauso = myArray[1]
    if (isNaN(tuso) === true || isNaN(mauso) === true) {
      alert("Tỷ số biến TU nhập x/y (trong đó x: số nguyên, y: số nguyên)")
      $("#edit_tysobien_tu_tct").val("")
      return
    }
  }
}

function tysobienTi_ThayCT() {
  var giatri = $("#edit_tysobien_ti_tct").val()
  if (giatri.indexOf("/") < 0) {
    var x = document.getElementById("edit_tysobien_ti_tct")
    if (isNaN(x.value) === true) {
      alert("Tỷ số biến TU nhập số nguyên hoặc x/y")
      $("#edit_tysobien_ti_tct").val("")
      return
    }

    tyso = x.value + '/1'
    $("#edit_tysobien_ti_tct").val(tyso)
  } else {
    const myArray = giatri.split("/")
    var tuso = myArray[0]
    var mauso = myArray[1]
    if (isNaN(tuso) === true || isNaN(mauso) === true) {
      alert("Tỷ số biến TU nhập x/y (trong đó x: số nguyên, y: số nguyên)")
      $("#edit_tysobien_ti_tct").val("")
      return
    }
  }
}


function thayctkh(meterid, socongto, loaiheso) {
  getChungLoaiCongto()
  getThongTinCongTo(meterid)
  $("#btnthaycongto").attr("data-meterid", meterid)
  $("#btnthaycongto").attr("data-socongto", socongto)
  clear_ThayCT()
  thaycongto_isheso = loaiheso
  if (loaiheso === 0) {
    $(".is_header_TI_tct").hide()
    $(".is_header_TU_tct").hide()
  } else {
    $(".is_header_TI_tct").show()
    $(".is_header_TU_tct").show()
  }
}

function getThongTinCongTo(meterid) {

  var para = {
    v_meterid: meterid
  }
  current_meterid = meterid;
  var url = "/api/quanly_lay_tt_diemdo";
  var lst = ExecuteServiceSyns(JSON.stringify(para), url);
  var str = "";
  $("#tbl_thongtincongto tbody").html("")
  $.each(lst, function (k, z) {
    var v = JSON.parse(z);
    str += "<tr>"
    str += "<td>1</td>"
    str += "<td>" + v.socongto + "</td>"
    str += "<td>" + v.loaicongto + "</td>"
    if (v.sophantu === null) {
      str += "<td>Chưa xác định</td>"
    } else {
      str += "<td>" + v.sophantu + "</td>"
    }
    str += "<td>" + v.ngaytreo + "</td>"
    str += "<td>" + v.ngaythao + "</td>"
    if (v.loaiheso === 1) {
      str += "<td><input  type='checkbox' checked disabled /></td>"
    } else {
      str += "<td><input  type='checkbox' disabled /></td>"
    }
    str += "<td>" + v.tu_ngoai + "</td>"
    str += "<td>" + v.ti_ngoai + "</td>"
    str += "<td>" + v.chukichot + "</td>"
    if (v.treothao === '1') {
      str += "<td>Đã tháo</td>"
    } else {
      str += "<td>Đang treo</td>"
    }

    if (v.loaipha === "1" || v.loaipha === "13") {
      $(".is_3gia").css("display", "none")
      $(".is_1gia").css("display", "block")
    } else {
      $(".is_3gia").css("display", "block")
      $(".is_1gia").css("display", "none")
    }
    str += "</tr>"
  });
  $("#tbl_thongtincongto tbody").append(str)


}
function SaveThaycongTo() {

  if (confirm("Bạn có chắc chắn muốn thay") === true) {
    var is_check_CTO = 0
    if ($('#checkbox_CTO_tct').is(":checked") === true) {
      is_check_CTO = 1
      if ($("#txtsocongto_thayct").val() === "") {
        toastr.error("Vui lòng nhập số công tơ", "Thông báo");
        return
      }

    } else {
      is_check_CTO = 0;
    }

    var is_check_TU = 0;
    if ($('#checkbox_TU_tct').is(":checked") === true) {
      is_check_TU = 1;
      if ($("#edit_tu_no_tct").val() === "") {
        toastr.error("Vui lòng nhập TU No", "Thông báo");
        return
      }

      if ($("#edit_tysobien_tu_tct").val() === "") {
        toastr.error("Vui lòng nhập tỷ số biến", "Thông báo");
        return
      }

    } else {
      is_check_TU = 0;
    }

    var is_check_TI = 0;
    if ($('#checkbox_TI_tct').is(":checked") === true) {
      is_check_TI = 1;
      if ($("#edit_ti_no_tct").val() === "") {
        toastr.error("Vui lòng nhập TU No", "Thông báo");
        return
      }
      if ($("#edit_tysobien_ti_tct").val() === "") {
        toastr.error("Vui lòng nhập tỷ số biến", "Thông báo");
        return
      }
    } else {
      is_check_TI = 0
    }


    if (is_check_CTO === 0 && is_check_TU === 0 && is_check_TI === 0) {

      toastr.error("Vui lòng chọn thay công tơ, thay TU, Thay TI", "Thông báo");
      return
    }

    var soccongto_dangtreo = $("#btnthaycongto").attr("data-socongto")
    var soccongto_moi = $("#txtsocongto_thayct").val()


    var para = {
      //v_meterid: parseInt(current_meterid),
      v_CHECK_THAY_CTO: is_check_CTO,
      v_meterid: parseInt($("#btnthaycongto").attr("data-meterid")),
      v_socongto_cu: soccongto_dangtreo,
      v_socongto_moi: soccongto_moi,
      v_matkhaucongto: $("#txtmatkhaucongto_thayct").val(),
      v_outstation: $("#txtOutstation_thayct").val(),

      v_cs_giao_treo: parseInt($("#txtcs_giaotreo_thayct").val()),
      v_cs_nhan_treo: parseInt($("#txtcs_nhantreo_thayct").val()),
      v_cs_giao_thao: parseInt($("#txtcs_giaothao_thayct").val()),
      v_cs_nhan_thao: parseInt($("#txtcs_nhanthao_thayct").val()),

      v_bt_treo: parseInt($("#BT_treo").val()),
      v_cd_treo: parseInt($("#CD_treo").val()),
      v_td_treo: parseInt($("#TD_treo").val()),
      v_sg_treo: parseInt($("#SG_treo").val()),
      v_vc_treo: parseInt($("#VC_treo").val()),

      v_bn_treo: parseInt($("#BN_treo").val()),
      v_cn_treo: parseInt($("#CN_treo").val()),
      v_tn_treo: parseInt($("#TN_treo").val()),
      v_sn_treo: parseInt($("#SN_treo").val()),
      v_vn_treo: parseInt($("#VN_treo").val()),


      v_bt_thao: parseInt($("#BT_thao").val()),
      v_cd_thao: parseInt($("#CD_thao").val()),
      v_td_thao: parseInt($("#TD_thao").val()),
      v_sg_thao: parseInt($("#SG_thao").val()),
      v_vc_thao: parseInt($("#VC_thao").val()),

      v_bn_thao: parseInt($("#BN_thao").val()),
      v_cn_thao: parseInt($("#CN_thao").val()),
      v_tn_thao: parseInt($("#TN_thao").val()),
      v_sn_thao: parseInt($("#SN_thao").val()),
      v_vn_thao: parseInt($("#VN_thao").val()),

      // TU
      v_TU_NO: $("#edit_tu_no_tct").val(),
      v_NAMSANXUAT_TU: $("#edit_namsx_tu_tct").val(),
      v_NGAY_KD_TU: $("#edit_ngay_kd_tu_tct").val(),
      v_LOAI_TU: $("#edit_loai_tu_tct").val(),
      v_TYSOBIEN_TU: $("#edit_tysobien_tu_tct").val(),
      v_MATEM_TU: $("#edit_matem_tu_tct").val(),
      v_MACHI_TU: $("#edit_machi_tu_tct").val(),
      v_SOVIEN_CHI_TU: $("#edit_sovien_chi_tu_tct").val(),
      v_SOVIEN_TEM_TU: $("#edit_sovien_tem_tu_tct").val(),
      // TI
      v_TI_NO: $("#edit_ti_no_tct").val(),
      v_NAMSANXUAT_TI: $("#edit_namsx_ti_tct").val(),
      v_NGAY_KD_TI: $("#edit_ngay_kd_ti_tct").val(),
      v_LOAI_TI: $("#edit_loai_ti_tct").val(),
      v_TYSOBIEN_TI: $("#edit_tysobien_ti_tct").val(),
      v_MATEM_TI: $("#edit_matem_ti_tct").val(),
      v_MACHI_TI: $("#edit_machi_ti_tct").val(),
      v_SOVIEN_CHI_TI: $("#edit_sovien_chi_ti_tct").val(),
      v_SOVIEN_TEM_TI: $("#edit_sovien_tem_tu_tct").val(),
      v_CHECK_TU: is_check_TU,
      v_CHECK_TI: is_check_TI,
      v_MaTaiKhoan: 1,
      v_loaicongto: $("#cbochungloaicongto_thayct").val()
    }
    // thay coong tow

    var url = "/api/quanly_diemdo_thay_cto";
    var lst = ExecuteServiceSyns(JSON.stringify(para), url);

    if (lst[0][0].indexOf('OK') > -1) {
      toastr.success("Thay thành công", "Thông báo", {
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
      load_danhsach_DIEMDO();
      getThongTinCongTo($("#btnthaycongto").attr("data-meterid"));
    }
    else {
      toastr.error(lst[0][0], "Thông báo");
    }


  }
}
function clear_ThayCT() {
  $("input[type='text']").val("")
  $("#checkbox_CTO_tct").prop("checked", false)
  $("#checkbox_TU_tct").prop("checked", false)
  $("#checkbox_TI_tct").prop("checked", false)
  $(".is_CTO_tct").css("display", "none")
  $(".is_TU_tct").css("display", "none")
  $(".is_TI_tct").css("display", "none")

}
$("#checkbox_CTO_tct").change(function () {

  if ($('#checkbox_CTO_tct').is(":checked")) {
    // it is checked
    $(".is_CTO_tct").css("display", "none")
    $(".is_CTO_tct").css("display", "block")
    if (thaycongto_isheso === 0) {
      $(".is_header_TI_tct").show()
      $(".is_header_TU_tct").show()
    }
  } else {
    $(".is_CTO_tct").css("display", "block")
    $(".is_CTO_tct").css("display", "none")
    if (thaycongto_isheso === 0) {
      $(".is_header_TI_tct").hide()
      $(".is_header_TU_tct").hide()
      $("input[type='text']").val("")
      $("#checkbox_TU_tct").prop("checked", false)
      $("#checkbox_TI_tct").prop("checked", false)
      $(".is_TU_tct").css("display", "none")
      $(".is_TI_tct").css("display", "none")
    }

  }
})
//==========================end thay công tơ=========================

function Save_Thay_MODEM_DCU() {

  if ($("#edit_imei_moi").val().length !== 16) {
    toastr.error("IMEI bao gồm 16 ký tự số", "Thông báo");
    return;
  }

  if ($("#edit_imei_moi").val() === "") {
    toastr.error("Vui lòng nhập số IMEI mới", "Thông báo");
    return;
  }
  else {

    if (confirm("Bạn có chắc chắn muốn thay IMEI") === true) {

      var para = {
        // v_meterid: parseInt(current_meterid),
        v_meterid: parseInt($("#btnthayDCU").data("meterid")),
        v_socongto_dangtreo: $("#edit_socongto").val(),
        v_imei_cu: $("#edit_imei_cu").val(),
        v_imei_moi: $("#edit_imei_moi").val(),
        v_mataikhoan: 1
      }

      var url = "/api/quanly_thay_imei";
      var lst = ExecuteServiceSyns(JSON.stringify(para), url);

      if (lst[0][0].indexOf('OK') > -1) {
        toastr.success("Thay IMEI thành công", "Thông báo");
        load_danhsach_DIEMDO();
        $('#modal-sua_MODEM_DCU').modal('hide');
        $('.modal-backdrop').css('display', 'none');
        $("#edit_imei_moi").val("");
      }
      else {
        toastr.error(lst[0][0], "Thông báo");
      }
    }
  }

}

function isNumber(evt) {
  evt = (evt) ? evt : window.event
  var charCode = (evt.which) ? evt.which : evt.keyCode
  if (charCode > 31 && (charCode < 48 || charCode > 57) && charCode !== 44) {
    return false
  }
  return true
}

function retNull(number) {
  if (number == null || number == undefined || (number == "")) {

    return '-';
  }
  return number;
}
function Clear_cache_hesonhan() {
  try {

    $("#edit_tu_no").val('')
    $("#edit_namsx_tu").val('')
    $("#edit_ngay_kd_tu").val('')
    $("#edit_loai_tu").val('')
    $("#edit_tysobien_tu").val('')
    $("#edit_machi_tu").val('')
    $("#edit_sovien_chi_tu").val('')
    $("#edit_matem_tu").val('')
    $("#edit_sovien_tem_tu").val('')
    $("#edit_ti_no").val('')
    $("#edit_namsx_ti").val('')
    $("#edit_ngay_kd_ti").val('')
    $("#edit_loai_ti").val('')
    $("#edit_tysobien_ti").val('')
    $("#edit_machi_ti").val('')
    $("#edit_sovien_chi_ti").val('')
    $("#edit_matem_ti").val('')
    $("#edit_sovien_tem_ti").val('')
  } catch (e) {
    console.error(e)
  }

}

function Clear_cachedata() {
  try {

    $("#edit_doituongkh").val('')
    $("#edit_LoaiKH").val('')
    $("#edit_MaDiemDo").val('')

    $("#edit_makhachhang").val('')
    $("#edit_tenkhachhang").val('')
    $("#edit_LoaiPha").val('')
    $("#edit_diachiKH").val('')
    $("#edit_din_dk_kh").val('')
    $("#edit_matram").val('')
    $("#edit_macot").val('')
    $("#edit_soghi").val('')
    $("#edit_ghichu_kh").val('')

    $("#sua_makhauctkh").val('')
    $("#sua_Outstation").val('')
    $("#edit_cstreo_giao").val('')
    $("#edit_cstreo_nhan").val('')

    $("#edit_chiso_bt").val('')
    $("#edit_chiso_cd").val('')
    $("#edit_chiso_td").val('')
    $("#edit_chiso_sg").val('')
    $("#edit_chiso_vc").val('')

    $("#edit_chiso_bn").val('')
    $("#edit_chiso_cn").val('')
    $("#edit_chiso_tn").val('')
    $("#edit_chiso_sn").val('')
    $("#edit_chiso_vn").val('')

    $("#sua_chungloaictkh").val('0')
    $("#sua_SCT").val('')
    $("#sua_Imei").val('')

    $('#checkbox_TU_edit').prop('checked', false)
    $('#checkbox_TI_edit').prop('checked', false)

    $("#edit_tu_no").val('')
    $("#edit_namsx_tu").val('')
    $("#edit_ngay_kd_tu").val('')
    $("#edit_loai_tu").val('')
    $("#edit_tysobien_tu").val('')
    $("#edit_machi_tu").val('')
    $("#edit_sovien_chi_tu").val('')
    $("#edit_matem_tu").val('')
    $("#edit_sovien_tem_tu").val('')
    $("#edit_ti_no").val('')
    $("#edit_namsx_ti").val('')
    $("#edit_ngay_kd_ti").val('')
    $("#edit_loai_ti").val('')
    $("#edit_tysobien_ti").val('')
    $("#edit_machi_ti").val('')
    $("#edit_sovien_chi_ti").val('')
    $("#edit_matem_ti").val('')
    $("#edit_sovien_tem_ti").val('')
  } catch (e) {
    console.error(e)
  }

}

$("#checkbox_TU").change(function () {

  if ($('#checkbox_TU').is(":checked")) {
    // it is checked
    $(".is_TU").css("display", "none")
    $(".is_TU").css("display", "block")
  } else {
    $(".is_TU").css("display", "block")
    $(".is_TU").css("display", "none")
  }
})
$("#checkbox_TI").change(function () {

  if ($('#checkbox_TI').is(":checked")) {
    // it is checked
    $(".is_TI").css("display", "none")
    $(".is_TI").css("display", "block")
  } else {
    $(".is_TI").css("display", "block")
    $(".is_TI").css("display", "none")
  }
})

$("#checkbox_TU_edit").change(function () {

  //  var xxx = ($('#checkbox_TU_edit').is(":checked"));
  if ($('#checkbox_TU_edit').is(":checked")) {
    // it is checked
    $(".is_TU_edit").css("display", "none")
    $(".is_TU_edit").css("display", "block")
  } else {
    $(".is_TU_edit").css("display", "block")
    $(".is_TU_edit").css("display", "none")
  }
})
$("#checkbox_TI_edit").change(function () {

  if ($('#checkbox_TI_edit').is(":checked")) {
    // it is checked
    $(".is_TI_edit").css("display", "none")
    $(".is_TI_edit").css("display", "block")
  } else {
    $(".is_TI_edit").css("display", "block")
    $(".is_TI_edit").css("display", "none")
  }
})

// thay công tơ
$("#checkbox_TU_tct").change(function () {

  if ($('#checkbox_TU_tct').is(":checked")) {
    // it is checked
    $(".is_TU_tct").css("display", "none")
    $(".is_TU_tct").css("display", "block")
  } else {
    $(".is_TU_tct").css("display", "block")
    $(".is_TU_tct").css("display", "none")
  }
})
$("#checkbox_TI_tct").change(function () {

  if ($('#checkbox_TI_tct').is(":checked")) {
    // it is checked
    $(".is_TI_tct").css("display", "none")
    $(".is_TI_tct").css("display", "block")
  } else {
    $(".is_TI_tct").css("display", "block")
    $(".is_TI_tct").css("display", "none")
  }
})

$("#add_LoaiPha").change(function () {
  var value = $("#add_LoaiPha").val()
  if (value === "1" || value === "31") {
    $(".kh_3pha").css("display", "none")
    $(".kh_1pha").css("display", "block")
  } else {
    $(".kh_3pha").css("display", "block")
    $(".kh_1pha").css("display", "none")
  }
})
$("#sua_LoaiPha").change(function () {
  var value = $("#sua_LoaiPha").val()
  if (value === "1" || value === "31") {
    $(".kh_3pha").css("display", "none")
    $(".kh_1pha").css("display", "block")
  } else {
    $(".kh_3pha").css("display", "block")
    $(".kh_1pha").css("display", "none")
  }
})

// radio sử dụng hệ số nhân ngoài
$("#rdhsnngoai").change(function () {
  v_loaihesonhan = "1";
  $("#checkbox_TU").removeAttr("disabled")
  $("#checkbox_TI").removeAttr("disabled")
})
$("#checkbox_TU").change(function () {
  if ($("#checkbox_TU").prop("checked") === true) {
    $(".is_TU").css("display", "block")
  } else {
    $(".is_TU").css("display", "none")
  }
})
$("#checkbox_TI").change(function () {
  if ($("#checkbox_TI").prop("checked") === true) {
    $(".is_TI").css("display", "block")
  } else {
    $(".is_TI").css("display", "none")
  }
})
// radio sử dụng hệ số nhân trong
$("#rdhsntrong").change(function () {
  v_loaihesonhan = "0";
  $("#checkbox_TU").attr("disabled", "disabled")
  $("#checkbox_TI").attr("disabled", "disabled")
  $('#checkbox_TU').prop('checked', false)
  $('#checkbox_TI').prop('checked', false)
  $(".is_TU").css("display", "none")
  $(".is_TI").css("display", "none")
})

$("#rdhsnngoaisua").change(function () {

  $("#checkbox_TU_edit").attr("disabled", true)
  $("#checkbox_TI_edit").attr("disabled", true)
  $('#checkbox_TU_edit').prop('checked', true)
  $(".is_TU_edit").css("display", "block")
  $('#checkbox_TI_edit').prop('checked', true)
  $(".is_TI_edit").css("display", "block")
})

$("#rdhsntrongsua").change(function () {
  // Clear_cache_ hệ số nhân ngoài
  //  Clear_cache_hesonhan();
  $("#checkbox_TU_edit").attr("disabled", true)
  $("#checkbox_TI_edit").attr("disabled", true)
  $('#checkbox_TU_edit').prop('checked', false)
  $('#checkbox_TI_edit').prop('checked', false)

  $(".is_TU_edit").css("display", "block")
  $(".is_TU_edit").css("display", "none")
  $(".is_TI_edit").css("display", "block")
  $(".is_TI_edit").css("display", "none")
})

function SetNumbernull(val) {
  try {
    if (val === null || val === 'null') {
      return ''
    } else {
      return val
    }
  } catch (e) {
    console.log(e)
  }
}

function getStyleTable1() {

  $('#tbl_danhsachnguoidung').DataTable({
    "paging": true,
    "lengthChange": true,
    "searching": true,
    "ordering": true,
    "info": true,
    "autoWidth": true,
    "responsive": true,
    'scrollX': true,
    'scrollCollapse': true,
    "pagingType": "full_numbers",
    "language": {
      "sProcessing": "Đang xử lý...",
      "sLengthMenu": "Xem _MENU_ bản ghi",
      "sZeroRecords": "Không tìm thấy dòng nào phù hợp",
      "sInfo": "Đang xem _START_ đến _END_ trong tổng số _TOTAL_ bản ghi",
      "sInfoEmpty": "Đang xem 0 đến 0 trong tổng số 0 bản ghi",
      "sInfoFiltered": "(được lọc từ _MAX_ bản ghi)",
      "sInfoPostFix": "",
      "sSearch": "Tìm kiếm:",
      "sUrl": "",
      "oPaginate": {
        "sFirst": "Đầu",
        "sPrevious": "Trước",
        "sNext": "Tiếp",
        "sLast": "Cuối"
      }
    },

    // "buttons": ["excel"] //["copy", "csv", "excel", "pdf", "print", "colvis"]
  }).buttons().container().appendTo('#tbl_danhsachnguoidung_wrapper .col-md-6:eq(0)');
};



