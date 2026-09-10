// =========================
// TOAST HELPERS
// =========================
function showToast(type, message, title) {
  toastr[type](message, title || "Thông báo", {
    positionClass: "toast-bottom-right",
    timeOut: 3000,
    closeButton: true,
    progressBar: true,
    preventDuplicates: true
  });
}

function showSuccess(message) {
  showToast("success", message);
}

function showError(message) {
  showToast("error", message);
}

function showWarning(message) {
  showToast("warning", message);
}

// =========================
// COMMON HELPERS
// =========================
function callApi(url, data) {
  return ExecuteServiceSyns(JSON.stringify(data || {}), url);
}

function closeModal(modalId) {
  $(modalId).modal("hide");
  $(".modal-backdrop").css("display", "none");
}

function retNull(value) {
  return value == null || value === undefined || value === "" ? "-" : value;
}

function isApiSuccess(responseText) {
  if (!responseText) return false;
  var text = String(responseText).toLowerCase();
  return text.indexOf("ok") > -1 ||
    text.indexOf("thành công") > -1 ||
    text.indexOf("cập nhật") > -1 ||
    text.indexOf("xóa") > -1;
}

function getApiMessage(lst, defaultMessage) {
  try {
    return lst[0][0] || defaultMessage || "Có lỗi xảy ra";
  } catch (e) {
    return defaultMessage || "Có lỗi xảy ra";
  }
}

function parseApiRow(v) {
  if (typeof v === "string") return JSON.parse(v);
  return v;
}

// =========================
// INIT
// =========================
$(document).ready(function () {
  if (!localStorage.getItem("us")) {
    window.location.href = "../login";
    return;
  }

  $("#btnthemnhamay").on("click", function () {
    themmoinhamay();
  });

  $("#btneditnhamay").on("click", function () {
    editnhamay();
  });

  load_danhsach_nhamay();
});

// =========================
// FORM
// =========================
function ThemMoi() {
  cleartext();
}

function cleartext() {
  $("#txt_add_ma_nhamay").val("");
  $("#txt_add_ten_nhamay").val("");
  $("#txt_add_diachi").val("");
  $("#txt_add_kinhdo").val("");
  $("#txt_add_vido").val("");
  $("#txt_add_ghichu").val("");

  $("#txt_sua_id").val("");
  $("#txt_sua_ma_nhamay").val("");
  $("#txt_sua_ten_nhamay").val("");
  $("#txt_sua_diachi").val("");
  $("#txt_sua_kinhdo").val("");
  $("#txt_sua_vido").val("");
  $("#txt_sua_ghichu").val("");
}

function validateNhaMay(prefix) {
  var ma = $("#" + prefix + "_ma_nhamay").val().trim();
  var ten = $("#" + prefix + "_ten_nhamay").val().trim();

  if (ma === "") {
    showError("Chưa nhập mã nhà máy");
    $("#" + prefix + "_ma_nhamay").focus();
    return false;
  }

  if (ten === "") {
    showError("Chưa nhập tên nhà máy");
    $("#" + prefix + "_ten_nhamay").focus();
    return false;
  }

  return true;
}

// =========================
// LOAD DATA
// =========================
function load_danhsach_nhamay() {
  $(".tab-content-css").show();

  var lst = callApi("/api/quanly_ds_nhamay", {});
  drawData(lst);
}

// =========================
// CREATE
// =========================
function themmoinhamay() {
  if (!validateNhaMay("txt_add")) return;

  var para = {
    v_taikhoanthuchien: 1,
    v_ma_nhamay: $("#txt_add_ma_nhamay").val().trim(),
    v_ten_nhamay: $("#txt_add_ten_nhamay").val().trim(),
    v_diachi: $("#txt_add_diachi").val().trim(),
    v_kinhdo: $("#txt_add_kinhdo").val().trim(),
    v_vido: $("#txt_add_vido").val().trim(),
    v_ghichu: $("#txt_add_ghichu").val().trim()
  };

  var lst = callApi("/api/quanly_them_nhamay", para);
  if (lst.indexOf("OK") > -1) {
    showSuccess("Thêm mới thành công");
    cleartext();
    closeModal("#modal-xl");
    load_danhsach_nhamay();
    return;
  }

  showError(lst);
}

// =========================
// EDIT
// =========================
function f_edit_nhamay(id) {
  cleartext();

  var lst = callApi("/api/quanly_lay_tt_nhamay", {
    v_id: parseInt(id, 10)
  });

  if (!lst || lst.length === 0) {
    showError("Không tìm thấy thông tin nhà máy");
    return;
  }

  var data = parseApiRow(lst[0]);

  $("#txt_sua_id").val(data.id);
  $("#txt_sua_ma_nhamay").val(data.ma_nhamay);
  $("#txt_sua_ten_nhamay").val(data.ten_nhamay);
  $("#txt_sua_diachi").val(data.diachi);
  $("#txt_sua_kinhdo").val(data.kinhdo);
  $("#txt_sua_vido").val(data.vido);
  $("#txt_sua_ghichu").val(data.ghichu);
}

function editnhamay() {
  if (!validateNhaMay("txt_sua")) return;

  var id = $("#txt_sua_id").val();

  if (id === "") {
    showError("Không xác định được nhà máy cần sửa");
    return;
  }

  var para = {
    v_taikhoanthuchien: 1,
    v_id: parseInt(id, 10),
    v_ma_nhamay: $("#txt_sua_ma_nhamay").val().trim(),
    v_ten_nhamay: $("#txt_sua_ten_nhamay").val().trim(),
    v_diachi: $("#txt_sua_diachi").val().trim(),
    v_kinhdo: $("#txt_sua_kinhdo").val().trim(),
    v_vido: $("#txt_sua_vido").val().trim(),
    v_ghichu: $("#txt_sua_ghichu").val().trim()
  };

  var lst = callApi("/api/quanly_sua_nhamay", para);
  if (lst.indexOf("thành công") > -1) {
    showSuccess(lst);
    closeModal("#modal-xl");
    $("#modal-xl-edit").modal("hide");
    load_danhsach_nhamay();
    return;
  }

  showError(lst);
}

// =========================
// DELETE
// =========================
function f_xoa_nhamay(id) {
  if (!confirm("Bạn có chắc chắn muốn xóa nhà máy này?")) return;

  var para = {
    v_taikhoanthuchien: 1,
    v_id: parseInt(id, 10)
  };

  var lst = callApi("/api/quanly_xoa_nhamay", para);
  if (lst.indexOf("thành công") > -1) {
    showSuccess(lst);
    load_danhsach_nhamay();
    return;
  }

  showError(lst);
}

// =========================
// RENDER TABLE
// =========================
function drawData(obj) {

  var row = "";
  var stt = 0;

  if ($.fn.DataTable.isDataTable("#tbl_danhsachnhamay")) {
    $("#tbl_danhsachnhamay").DataTable().clear().destroy();
  }

  $("#tbl_danhsachnhamay tbody").empty();

  $.each(obj, function (k) {
    var data = parseApiRow(obj[k]);
    stt++;

    row += "<tr>";
    row += "<td>" + stt + "</td>";
    row += "<td>" + retNull(data.ma_nhamay) + "</td>";
    row += "<td>" + retNull(data.ten_nhamay) + "</td>";
    row += "<td>" + retNull(data.diachi) + "</td>";
    row += "<td>" + retNull(data.kinhdo) + "</td>";
    row += "<td>" + retNull(data.vido) + "</td>";
    row += "<td>" + retNull(data.ghichu) + "</td>";
    row += "<td>" + retNull(data.ngaytao) + "</td>";
    row +=
      '<td class="text-center" style="white-space: nowrap;">' +
      `<a href="#" class="btn btn-primary btn-sm me-1" data-bs-toggle="modal" data-bs-target="#modal-xl-edit" onclick="f_edit_nhamay('${data.id}')">Sửa</a>` +
      `<a href="#" class="btn btn-danger btn-sm" onclick="f_xoa_nhamay('${data.id}')">Xóa</a>` +
      "</td>";
    row += "</tr>";
  });

  $("#tbl_danhsachnhamay tbody").html(row);
  getStyleTable1();
}

// =========================
// DATATABLE
// =========================
function getStyleTable1() {
  if ($.fn.DataTable.isDataTable("#tbl_danhsachnhamay")) {
    $("#tbl_danhsachnhamay").DataTable().destroy();
  }

  $("#tbl_danhsachnhamay").DataTable({
    dom: '<"d-flex justify-content-between align-items-center flex-wrap mb-3"Bf>rt<"d-flex justify-content-between align-items-center flex-wrap mt-3"lip>',
    buttons: [
      {
        extend: "excel",
        title: "Danh sách nhà máy",
        exportOptions: {
          columns: [0, 1, 2, 3, 4, 5, 6, 7]
        }
      }
    ],
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
    columnDefs: [
      { targets: 0, className: "text-center", width: "70px" },
      { targets: 1, className: "text-center", width: "130px" },
      { targets: 2, className: "text-center", width: "220px" },
      { targets: 3, className: "text-left", width: "280px" },
      { targets: 4, className: "text-center", width: "120px" },
      { targets: 5, className: "text-center", width: "120px" },
      { targets: 6, className: "text-left", width: "180px" },
      { targets: 7, className: "text-center", width: "160px" },
      { targets: 8, className: "text-center", width: "150px", orderable: false }
    ],
    language: {
      sProcessing: "Đang xử lý...",
      sLengthMenu: "Xem _MENU_ bản ghi",
      sZeroRecords: "Không tìm thấy dòng nào phù hợp",
      sInfo: "Đang xem _START_ đến _END_ trong tổng số _TOTAL_ bản ghi",
      sInfoEmpty: "Đang xem 0 đến 0 trong tổng số 0 bản ghi",
      sInfoFiltered: "(được lọc từ _MAX_ bản ghi)",
      sSearch: "Tìm kiếm:",
      oPaginate: {
        sFirst: "Đầu",
        sPrevious: "Trước",
        sNext: "Tiếp",
        sLast: "Cuối"
      }
    },
    initComplete: function () {
      this.api().columns.adjust();
    }
  });

  setTimeout(function () {
    $("#tbl_danhsachnhamay").DataTable().columns.adjust();
  }, 200);
}