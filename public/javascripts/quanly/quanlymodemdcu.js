
var Base64 = { _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=", encode: function (e) { var t = ""; var n, r, i, s, o, u, a; var f = 0; e = Base64._utf8_encode(e); while (f < e.length) { n = e.charCodeAt(f++); r = e.charCodeAt(f++); i = e.charCodeAt(f++); s = n >> 2; o = (n & 3) << 4 | r >> 4; u = (r & 15) << 2 | i >> 6; a = i & 63; if (isNaN(r)) { u = a = 64 } else if (isNaN(i)) { a = 64 } t = t + this._keyStr.charAt(s) + this._keyStr.charAt(o) + this._keyStr.charAt(u) + this._keyStr.charAt(a) } return t }, decode: function (e) { var t = ""; var n, r, i; var s, o, u, a; var f = 0; e = e.replace(/[^A-Za-z0-9\+\/\=]/g, ""); while (f < e.length) { s = this._keyStr.indexOf(e.charAt(f++)); o = this._keyStr.indexOf(e.charAt(f++)); u = this._keyStr.indexOf(e.charAt(f++)); a = this._keyStr.indexOf(e.charAt(f++)); n = s << 2 | o >> 4; r = (o & 15) << 4 | u >> 2; i = (u & 3) << 6 | a; t = t + String.fromCharCode(n); if (u != 64) { t = t + String.fromCharCode(r) } if (a != 64) { t = t + String.fromCharCode(i) } } t = Base64._utf8_decode(t); return t }, _utf8_encode: function (e) { e = e.replace(/\r\n/g, "\n"); var t = ""; for (var n = 0; n < e.length; n++) { var r = e.charCodeAt(n); if (r < 128) { t += String.fromCharCode(r) } else if (r > 127 && r < 2048) { t += String.fromCharCode(r >> 6 | 192); t += String.fromCharCode(r & 63 | 128) } else { t += String.fromCharCode(r >> 12 | 224); t += String.fromCharCode(r >> 6 & 63 | 128); t += String.fromCharCode(r & 63 | 128) } } return t }, _utf8_decode: function (e) { var t = ""; var n = 0; var r = c1 = c2 = 0; while (n < e.length) { r = e.charCodeAt(n); if (r < 128) { t += String.fromCharCode(r); n++ } else if (r > 191 && r < 224) { c2 = e.charCodeAt(n + 1); t += String.fromCharCode((r & 31) << 6 | c2 & 63); n += 2 } else { c2 = e.charCodeAt(n + 1); c3 = e.charCodeAt(n + 2); t += String.fromCharCode((r & 15) << 12 | (c2 & 63) << 6 | c3 & 63); n += 3 } } return t } };
var current_meterid;
var is_imei_doc = "";
var is_ip_doc = "";
var is_port_doc = "";
$(document).ready(function () {
  if (!localStorage.getItem("us")) {
    window.location.href = "../login";
  }
  handleSidebarNode();

  $("#bt_xemq_apquyen").change(function () {
    var checked_status = this.checked;
    $("input[name='check_socongto']").each(function () {
      this.checked = checked_status;
    });
  });

});


function handleSidebarNode() {
  var node = JSON.parse(localStorage.getItem("node"));
  if (!node) {
    toastr.error("Vui lòng chọn danh mục", "Thông báo");
    return;
  }
  let loaithumuc = node.type;
  if (loaithumuc == 9) {
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
  load_danhsach_IMEI();

}

function load_danhsach_IMEI() {
  var node = JSON.parse(localStorage.getItem("node"));
  let danhmucid = node.id == undefined ? "001" : node.id;
  var para = {
    v_danhmucid: danhmucid
  }
  var url = "/api/quanly_ds_imei_mapcto";
  var lst = ExecuteServiceSyns(JSON.stringify(para), url);
  drawData(lst);
}

function escapeHtml(value) {
  if (value === null || value === undefined) return "";
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function safeValue(value, fallback = "-") {
  return value === null || value === undefined || value === "" ? fallback : escapeHtml(value);
}



function drawData(obj) {
  const tableId = "#tbl_danhsachnguoidung";
  const $table = $(tableId);
  const $tbody = $table.find("tbody");

  if ($.fn.DataTable.isDataTable(tableId)) {
    $table.DataTable().clear().destroy();
  }

  $tbody.empty();

  if (!Array.isArray(obj) || obj.length === 0) {
    initDanhSachNguoiDungTable();
    return;
  }

  const rows = obj.map((item, index) => {
    const data = JSON.parse(item);
    if (!data) return "";
    const imei = data.imei ?? "";
    const ip = data.ip ?? "";
    const port = data.port ?? "";

    return `
      <tr>
        <td class="text-center">${index + 1}</td>
        <td class="text-break">${safeValue(imei)}</td>
        <td class="text-break">${safeValue(data.tendanhmuc)}</td>
        <td class="text-break">${safeValue(ip)}</td>
        <td class="text-center">${safeValue(port)}</td>
        <td class="text-center">-</td>
        <td class="text-center action-col">
          <button
            type="button"
            class="btn btn-warning btn-sm btn-view"
            data-bs-toggle="modal"
            data-bs-target="#modal-map_congto"
            data-imei="${escapeHtml(imei)}"
            data-ip="${escapeHtml(ip)}"
            data-port="${escapeHtml(port)}"
            title="Cập nhật công tơ vào DCU"
          >
            <i class="fa fa-cogs"></i>
          </button>
          
        </td>
        <td class="text-center action-col">
          <button
            type="button"
            class="btn btn-warning btn-sm btn-doc-cto"
            data-bs-toggle="modal"
            data-bs-target="#modal-map_doc_congto"
            data-imei="${escapeHtml(imei)}"
            data-ip="${escapeHtml(ip)}"
            data-port="${escapeHtml(port)}"
            title="Đọc danh sách công tơ"
          >
            <i class="fa fa-eye"></i>
          </button>
          
        </td>
        <td class="text-center action-col">
          <button
            type="button"
            class="btn btn-warning btn-sm btn-edit"
            data-bs-toggle="modal"
            data-bs-target="#modal_sua_tt_dcu"
            data-imei="${escapeHtml(imei)}"
            title="Sửa"
          >
            <i class="fa fa-edit"></i>
          </button>
        </td>
         <td class="text-center action-col">
          <button
            type="button"
            class="btn btn-warning btn-sm btn-thaymodem"
            title="Thay modem/dcu" 
            data-imei="${escapeHtml(imei)}"
            data-danhmucid="${escapeHtml(data.code)}"
            data-bs-toggle="modal" data-bs-target="#modal-sua_MODEM_DCU" 
          >
           Thay Modem
          </button>
        </td>
      </tr>
    `;
  }).join("");

  $tbody.html(rows);

  initDanhSachNguoiDungTable();

  // Gắn sự kiện sau khi render
  $table.off("click", ".btn-view");
  $table.on("click", ".btn-view", function () {
    const imei = $(this).data("imei");
    const ip = $(this).data("ip");
    const port = $(this).data("port");
    Load_data_modal_CTO(imei, ip, port);
  });

  $table.off("click", ".btn-edit");
  $table.on("click", ".btn-edit", function () {
    const imei = $(this).data("imei");
    GetThongTinDcu(imei);
  });
  $table.off("click", ".btn-doc-cto");
  $table.on("click", ".btn-doc-cto", function () {
    is_imei_doc = $(this).data("imei");
    is_ip_doc = $(this).data("ip");
    is_port_doc = $(this).data("port");
    $("#tbl_docds_congto tbody").empty();
    sendDocCongToToDCU();
  });

  $table.off("click", ".btn-thaymodem");
  $table.on("click", ".btn-thaymodem", function () {
    var imei = $(this).data("imei");
    var danhmucid = $(this).data("danhmucid");
    Load_data_modal_DCU(imei, danhmucid);
  });

}
function Load_data_modal_DCU(imei, danhmucid) {
  $("#edit_imei_moi").val("");
  $("#btnthayDCU").attr("data-imei", imei);
  $("#btnthayDCU").attr("data-danhmucid", danhmucid);

  $("#edit_imei_cu").val(imei);
}


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
      var userinfo = localStorage.getItem("us");
      var user = JSON.parse(Base64.decode(userinfo));
      var imei = $("#btnthayDCU").data("imei");
      var danhmucid = $("#btnthayDCU").data("danhmucid");
      var para = {
        v_imei_cu: String(imei),
        v_imei_moi: $("#edit_imei_moi").val(),
        v_mataikhoan: user.mataikhoan,
        v_danhmucid: danhmucid
      }

      var url = "/api/quanly_thaymodem_imei";
      var lst = ExecuteServiceSyns(JSON.stringify(para), url);

      if (lst[0].message.indexOf('OK') > -1) {
        toastr.success("Thay IMEI thành công", "Thông báo");
        load_danhsach_IMEI();
        $('#modal-sua_MODEM_DCU').modal('hide');
        $('.modal-backdrop').css('display', 'none');
        $("#edit_imei_moi").val("");
      }
      else {
        toastr.error(lst[0].message, "Thông báo");
      }
    }
  }

}


function initDanhSachNguoiDungTable() {
  const tableId = "#tbl_danhsachnguoidung";
  const $table = $(tableId);

  const dt = $table.DataTable({
    paging: true,
    lengthChange: true,
    searching: true,
    ordering: true,
    info: true,
    autoWidth: false,
    responsive: false,
    scrollX: true,
    scrollCollapse: true,
    pagingType: "full_numbers",
    destroy: true,
    deferRender: true,
    pageLength: 10,
    columnDefs: [
      { targets: 0, width: "60px", className: "text-center" },
      { targets: 4, width: "90px", className: "text-center" },
      { targets: 5, width: "80px", className: "text-center" },
      { targets: [6, 7], width: "90px", orderable: false, searchable: false, className: "text-center" }
    ],
    language: {
      sProcessing: "Đang xử lý...",
      sLengthMenu: "Xem _MENU_ bản ghi",
      sZeroRecords: "Không tìm thấy dòng nào phù hợp",
      sInfo: "Đang xem _START_ đến _END_ trong tổng số _TOTAL_ bản ghi",
      sInfoEmpty: "Đang xem 0 đến 0 trong tổng số 0 bản ghi",
      sInfoFiltered: "(được lọc từ _MAX_ bản ghi)",
      sInfoPostFix: "",
      sSearch: "Tìm kiếm:",
      sUrl: "",
      oPaginate: {
        sFirst: "Đầu",
        sPrevious: "Trước",
        sNext: "Tiếp",
        sLast: "Cuối"
      }
    },
    initComplete: function () {
      $($.fn.dataTable.tables(true)).DataTable().columns.adjust();
    },
    drawCallback: function () {
      $($.fn.dataTable.tables(true)).DataTable().columns.adjust();
    }
  });

  $(window).off("resize.danhsachnguoidung").on("resize.danhsachnguoidung", function () {
    dt.columns.adjust();
  });
}
//=========================S ================


function retNull(number) {
  if (number == null || number == undefined || (number == "")) {

    return '-';
  }
  return number;
}

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


function isNumber(evt) {
  evt = (evt) ? evt : window.event
  var charCode = (evt.which) ? evt.which : evt.keyCode
  if (charCode > 31 && (charCode < 48 || charCode > 57) && charCode !== 44) {
    return false
  }
  return true
}
//============================function thiết bị============================
function GetThongTinDcu(imei) {
  var url = "/api/quanly_get_thietbi";
  var para = {
    v_imei: String(imei)
  }
  var lst = ExecuteServiceSyns(JSON.stringify(para), url);
  if (lst.length > 0) {
    $("#txt_tenthietbi").val(lst[0].tenthietbi);
    $("#txt_tenthietbi").attr("data", lst[0].id_thietbi);
    $("#txt_ip_thietbi").val(lst[0].ip);
    $("#txt_ip_port").val(lst[0].port);
    $("#txt_kinhdo_thietbi").val(lst[0].kinhdo);
    $("#txt_vido_thietbi").val(lst[0].vido);
    $("#txt_sosim_thietbi").val(lst[0].sosim);
  }

}

$("#btn_luu_thietbi").click(function () {
  var tenthietbi = $("#txt_tenthietbi").val();
  var ip = $("#txt_ip_thietbi").val();
  var port = $("#txt_ip_port").val();
  if (tenthietbi == "") {
    $("#messinfo_sua_thietbi").html("<p class='bg-danger' style='padding: 5px;'>Chưa nhập tên thiết bị</p>");
    return;
  }
  if (ip == "") {
    $("#messinfo_sua_thietbi").html("<p class='bg-danger' style='padding: 5px;'>Chưa nhập IP</p>");
    return;
  }
  if (port == "") {
    $("#messinfo_sua_thietbi").html("<p class='bg-danger' style='padding: 5px;'>Chưa nhập Port</p>");
    return;
  }
  $("#messinfo_sua_thietbi").html("");
  var tree = JSON.parse(localStorage.getItem("tree_node_qldm"));
  var url = "/api/quanly_suathietbi";
  var para = {
    v_idthietbi: $("#txt_tenthietbi").attr("data"),
    v_tenthietbi: tenthietbi,
    v_ip: ip,
    v_port: port,
    v_kinhdo: $("#txt_kinhdo_thietbi").val(),
    v_vido: $("#txt_vido_thietbi").val(),
    v_sosim: $("#txt_sosim_thietbi").val()
  }
  var lst = ExecuteServiceSyns(JSON.stringify(para), url);
  if (lst[0].result.indexOf('thành công') > -1) {
    $("#modal_sua_tt_dcu").modal("hide");
    $('.modal-backdrop').css('display', 'none');
    load_danhsach_IMEI();
    toastr.success(lst[0].result, "Thông báo", {
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
  else {
    $("#messinfo_sua_thietbi").html("<p class='bg-danger' style='padding: 5px;'>" + lst[0].result + "</p>");

  }
});

async function sendDocCongToToDCU() {
  try {
    const imei = String(is_imei_doc || "").trim();
    const ip = String(is_ip_doc || "").trim();
    const port = Number(is_port_doc);

    if (!imei) {
      updateStatus("Không xác định được IMEI DCU...", "danger");
      return;
    }

    if (!ip) {
      updateStatus("Không xác định được IP DCU", "danger");
      return;
    }

    if (!Number.isFinite(port) || port <= 0) {
      updateStatus("Port DCU không hợp lệ", "danger");
      return;
    }

    updateStatus("Đang gửi lệnh cập nhật công tơ xuống DCU...", "warning");

    const res = await fetch("/api/quanly_mapcto_doc_ds_cto", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        imei,
        ip,
        port
      })
    });
    updateStatus("Đang nhận phản hồi từ DCU...", "warning");

    let result = null;
    try {
      result = await res.json();
    } catch (e) {
      updateStatus("API trả về dữ liệu không hợp lệ", "danger");
      return;
    }

    if (!res.ok) {
      updateStatus(result?.message || `Lỗi HTTP ${res.status}`, "danger");
      return;
    }

    if (!result?.success) {
      updateStatus(result?.message || "Gửi lệnh thất bại", "danger");
      return;
    }
    drawTableDSCongTo(result.list);
    updateStatus("Đọc danh sách công tơ thành công", "success");
  } catch (err) {
    updateMapStatus(err?.message || "Lỗi gửi lệnh cập nhật công tơ", "danger");
  }
}



function updateStatus(message, type = "info") {
  const $box = $("#doc_status_box");
  $box.removeClass("alert-info alert-success alert-danger alert-warning");
  $box.addClass("alert-" + type);
  $("#doc_status_text").text(message);
}

function drawTableDSCongTo(details) {

  if (!details.length) {
    $("#tbl_docds_congto tbody").html(`
            <tr>
                <td colspan="2" class="text-center">Không có dữ liệu</td>
            </tr>
        `);
    return;
  }

  let rows = "";

  $.each(details, function (i, item) {
    const index = item.index || (i + 1);
    const socongto = item.socongto || "";

    rows += `
            <tr>
                <td class="text-center">${index}</td>
                 <td>${is_imei_doc}</td>
                <td>${socongto}</td>
            </tr>
        `;
  });

  $("#tbl_docds_congto tbody").html(rows);
}