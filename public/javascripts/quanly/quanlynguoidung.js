
var Base64 = {
  _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
  encode: function (e) {
    var t = "";
    var n, r, i, s, o, u, a;
    var f = 0;
    e = Base64._utf8_encode(e);
    while (f < e.length) {
      n = e.charCodeAt(f++);
      r = e.charCodeAt(f++);
      i = e.charCodeAt(f++);
      s = n >> 2;
      o = (n & 3) << 4 | r >> 4;
      u = (r & 15) << 2 | i >> 6;
      a = i & 63;
      if (isNaN(r)) {
        u = a = 64;
      } else if (isNaN(i)) {
        a = 64;
      }
      t =
        t +
        this._keyStr.charAt(s) +
        this._keyStr.charAt(o) +
        this._keyStr.charAt(u) +
        this._keyStr.charAt(a);
    }
    return t;
  },
  decode: function (e) {
    var t = "";
    var n, r, i;
    var s, o, u, a;
    var f = 0;
    e = e.replace(/[^A-Za-z0-9\+\/\=]/g, "");
    while (f < e.length) {
      s = this._keyStr.indexOf(e.charAt(f++));
      o = this._keyStr.indexOf(e.charAt(f++));
      u = this._keyStr.indexOf(e.charAt(f++));
      a = this._keyStr.indexOf(e.charAt(f++));
      n = (s << 2) | (o >> 4);
      r = ((o & 15) << 4) | (u >> 2);
      i = ((u & 3) << 6) | a;
      t = t + String.fromCharCode(n);
      if (u != 64) t = t + String.fromCharCode(r);
      if (a != 64) t = t + String.fromCharCode(i);
    }
    t = Base64._utf8_decode(t);
    return t;
  },
  _utf8_encode: function (e) {
    e = e.replace(/\r\n/g, "\n");
    var t = "";
    for (var n = 0; n < e.length; n++) {
      var r = e.charCodeAt(n);
      if (r < 128) {
        t += String.fromCharCode(r);
      } else if (r > 127 && r < 2048) {
        t += String.fromCharCode((r >> 6) | 192);
        t += String.fromCharCode((r & 63) | 128);
      } else {
        t += String.fromCharCode((r >> 12) | 224);
        t += String.fromCharCode(((r >> 6) & 63) | 128);
        t += String.fromCharCode((r & 63) | 128);
      }
    }
    return t;
  },
  _utf8_decode: function (e) {
    var t = "";
    var n = 0;
    var r = c1 = c2 = 0;
    while (n < e.length) {
      r = e.charCodeAt(n);
      if (r < 128) {
        t += String.fromCharCode(r);
        n++;
      } else if (r > 191 && r < 224) {
        c2 = e.charCodeAt(n + 1);
        t += String.fromCharCode(((r & 31) << 6) | (c2 & 63));
        n += 2;
      } else {
        c2 = e.charCodeAt(n + 1);
        c3 = e.charCodeAt(n + 2);
        t += String.fromCharCode(((r & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
        n += 3;
      }
    }
    return t;
  }
};

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


function getTreeNodeStorage() {
  try {
    return JSON.parse(localStorage.getItem("tree_node_tk"));
  } catch (e) {
    return null;
  }
}

function retNull(value) {
  return value == null || value === undefined || value === "" ? "-" : value;
}

function isApiSuccess(responseText) {
  if (!responseText) return false;
  var text = String(responseText).toLowerCase();
  return text.indexOf("ok") > -1 || text.indexOf("thành công") > -1;
}

function getApiMessage(lst, defaultMessage) {
  try {
    return lst || defaultMessage || "Có lỗi xảy ra";
  } catch (e) {
    return defaultMessage || "Có lỗi xảy ra";
  }
}

// =========================
// VALIDATION HELPERS
// =========================
function isValidEmail(email) {
  if (!email) return true;
  return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);
}

function isValidPhone(phone) {
  if (!phone) return true;
  var vnfRegex = /((09|03|07|08|05)+([0-9]{8})\b)/g;
  return vnfRegex.test(phone);
}

function validatePasswordFormat(password) {
  if (!password || password.length < 6) return false;
  var hasNumber = /[0-9]/.test(password);
  var hasLower = /[a-z]/.test(password);
  var hasUpper = /[A-Z]/.test(password);
  var hasSpecial = /[~!@#$%^&*()_\-+=?<>]/.test(password);
  return hasNumber && hasLower && hasUpper && hasSpecial;
}

// =========================
// INIT
// =========================
$(document).ready(function () {
  if (!localStorage.getItem("us")) {
    window.location.href = "../login";
    return;
  }
  var userinfo = localStorage.getItem("us");
  var user = JSON.parse(Base64.decode(userinfo));
  GetTreeAll_qldmdl(user.danhmucid);
  load_danhsach_nguoidung(user.danhmucid);
  $("#btnthemnguoidung").on("click", function () {

    themmoinguoidung(user.danhmucid);
  });

  $("#btneditnguoidung").on("click", function () {
    editnguoidung();
  });

  $("#btndoimatkhau").on("click", function () {
    doimatkhau();
  });

  $("#stree_qldm span").on("click", function () {
    $(".easy-tree-qldm").jstree(true).search($("#search_meter_qldmdl").val());
  });

});



function ThemMoi() {

  const tree = $('#tree_left_qldmdl').jstree(true);
  if (tree) {
    tree.deselect_all(true); // bỏ chọn tất cả node
  }

  localStorage.removeItem("tree_node_tk");
  cleartext();
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
  $(".easy-tree-qldm").jstree("destroy");
  $("#help_tree_qldm").hide();

  try {
    var lst = callApi("/api/quanly_ds_danhmuc", {});
    //console.log("lst vẽ cây thư mục bắt đầu từ code: " + lst);
    result_GetTreeAll_qldmdl(lst, code);
  } catch (e) {
    console.log(e);
    showError("Không tải được danh mục");
  }
}

function result_GetTreeAll_qldmdl(rawList, code) {

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

// =========================
// LOAD DATA
// =========================
function load_danhsach_nguoidung() {
 
 
  $(".tab-content-css").show();

  var lst = callApi("/api/ds_taikhoan", { });

  drawData(lst);
}

// =========================
// FORM HELPERS
// =========================
function cleartext() {
  $("#txt_add_mataikhoan").val("");
  $("#password_add").val("");
  $("#re_password_add").val("");
  $("#txt_add_tennguoidung").val("");
  $("#txt_add_email").val("");
  $("#txt_add_sdt").val("");
  $("#txt_add_diachi").val("");

  $("#txt_sua_mataikhoan").val("");
  $("#txt_sua_tennguoidung").val("");
  $("#txt_sua_email").val("");
  $("#txt_sua_sdt").val("");
  $("#txt_sua_diachi").val("");

  $("#txt_reset_mataikhoan").val("");
  $("#txt_reset_taikhoan").val("");
  $("#txt_reset_matkhau").val("");
  $("#txt_reset_nhaplai").val("");

  localStorage.removeItem("tree_node_tk");
}

function ValidateEmail(mail) {
  if (isValidEmail($("#txt_add_email").val())) return true;
  showError("Định dạng email chưa đúng");
  return false;
}

function phonenumber(inputtxt) {
  if (isValidPhone(inputtxt.value)) return true;
  showError("Định dạng SĐT chưa đúng");
  return false;
}

// =========================
// CREATE USER
// =========================
function themmoinguoidung(danhmucid) {

  var email = $("#txt_add_email").val().trim();
  var phone = $("#txt_add_sdt").val().trim();
  var username = $("#txt_add_mataikhoan").val().trim();
  var password = $("#password_add").val().trim();
  var rePassword = $("#re_password_add").val().trim();
  var tree = getTreeNodeStorage();

  if (email && !isValidEmail(email)) {
    showError("Định dạng email chưa đúng");
    return;
  }

  if (phone && !isValidPhone(phone)) {
    showError("SĐT không đúng định dạng");
    return;
  }

  if ($("#cbo_MaKH").val() === "") {
    showError("Chưa chọn mã khách hàng");
    return;
  }

  if (username.length < 6) {
    showError("Tên đăng nhập tối thiểu 6 ký tự");
    return;
  }

  if (password.length < 6) {
    showError("Mật khẩu tối thiểu 6 ký tự");
    return;
  }

  if (!validatePasswordFormat(password)) {
    showError("Mật khẩu phải có chữ hoa, chữ thường, số và ký tự đặc biệt");
    return;
  }

  if (password !== rePassword) {
    showError("Xác nhận mật khẩu không khớp");
    return;
  }

  if (!tree || !tree[0] || !tree[0].id) {
    showError("Chưa chọn danh mục");
    return;
  }

  var para = {
    v_taikhoanthuchien: 1,
    v_taikhoan: username,
    v_matkhau: password,
    v_tennguoidung: $("#txt_add_tennguoidung").val().trim(),
    v_email: email,
    v_sodienthoai: phone,
    v_diachi: $("#txt_add_diachi").val().trim(),
    v_danhmucid: tree[0].id
  };

  var lst = callApi("/api/quanly_them_taikhoan", para);
  if (lst.indexOf("OK") > -1) {
    showSuccess("Thêm mới thành công");
    cleartext();
    closeModal("#modal-xl");
    load_danhsach_nguoidung(danhmucid);
    return;
  }


  showError(lst);
}

// =========================
// EDIT USER
// =========================
function editnguoidung() {
  var email = $("#txt_sua_email").val().trim();
  var phone = $("#txt_sua_sdt").val().trim();
  var tree = getTreeNodeStorage();

  if (email && !isValidEmail(email)) {
    showError("Định dạng email chưa đúng");
    return;
  }

  if (phone && !isValidPhone(phone)) {
    showError("SĐT không đúng định dạng");
    return;
  }

  if (!tree || !tree[0] || !tree[0].id) {
    showError("Chưa chọn danh mục");
    return;
  }

  var para = {
    v_taikhoanthuchien: 1,
    v_taikhoan: $("#txt_sua_mataikhoan").val().trim(),
    v_tennguoidung: $("#txt_sua_tennguoidung").val().trim(),
    v_email: email,
    v_sodienthoai: phone,
    v_diachi: $("#txt_sua_diachi").val().trim(),
    v_danhmucid: tree[0].id
  };

  var lst = callApi("/api/quanly_sua_taikhoan", para);
  if (lst.indexOf("thành công") > -1) {
    showSuccess(lst);
    var userinfo = localStorage.getItem("us");
    var user = JSON.parse(Base64.decode(userinfo));
    load_danhsach_nguoidung(user.danhmucid);
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

  if ($.fn.DataTable.isDataTable("#tbl_danhsachnguoidung")) {
    $("#tbl_danhsachnguoidung").DataTable().clear().destroy();
  }

  $("#tbl_danhsachnguoidung tbody").empty();

  if (!obj) {
    obj = [];
  }

  if (typeof obj === "string") {
    try {
      obj = JSON.parse(obj);
    } catch (e) {
      console.error("Không parse được dữ liệu:", obj);
      obj = [];
    }
  }

  $.each(obj, function (k, item) {
    var data = item;

    if (typeof item === "string") {
      try {
        data = JSON.parse(item);
      } catch (e) {
        console.error("Dòng dữ liệu lỗi:", item);
        return;
      }
    }

    stt++;

    row += "<tr>";
    row += "<td>" + stt + "</td>";
    row += "<td>" + retNull(data.taikhoan) + "</td>";
    row += "<td>" + retNull(data.tennguoidung) + "</td>";
    row += "<td>" + retNull(data.sodienthoai) + "</td>";
    row += "<td>" + retNull(data.email) + "</td>";
    row += "<td>" + retNull(data.diachi) + "</td>";
    row += "<td>" + retNull(data.ngaytao) + "</td>";
    row +=
      '<td class="text-center" style="white-space: nowrap;">' +
      `<a href="#" class="btn btn-primary btn-sm me-1" data-bs-toggle="modal" data-bs-target="#modal-xl-edit" onclick="f_edit_nguoidung('${data.mataikhoan}')">Sửa</a>` +
      `<a href="#" class="btn btn-warning btn-sm me-1" data-bs-toggle="modal" data-bs-target="#modal-doimatkhau" onclick="f_open_doimatkhau('${data.mataikhoan}','${retNull(data.taikhoan)}')">Đổi MK</a>` +
      `<a href="#" class="btn btn-danger btn-sm" onclick="f_xoa_nguoidung('${data.mataikhoan}')">Xóa</a>` +
      "</td>";
    row += "</tr>";
  });

  $("#tbl_danhsachnguoidung tbody").html(row);
  getStyleTable1();
}

// =========================
// CHANGE PASSWORD
// =========================
function f_open_doimatkhau(mataikhoan, taikhoan) {
  $("#txt_reset_mataikhoan").val(mataikhoan);
  $("#txt_reset_taikhoan").val(taikhoan);
  $("#txt_reset_matkhau").val("");
  $("#txt_reset_nhaplai").val("");
}


function doimatkhau() {
  var mataikhoan = $("#txt_reset_mataikhoan").val();
  var matkhau = $("#txt_reset_matkhau").val().trim();
  var nhaplai = $("#txt_reset_nhaplai").val().trim();

  if (mataikhoan == "") {
    toastr.error("Không xác định được tài khoản cần đổi mật khẩu.", "Thông báo");
    return;
  }

  if (matkhau.length < 6) {
    toastr.error("Mật khẩu mới phải có ít nhất 6 ký tự.", "Thông báo");
    return;
  }

  if (!validatePasswordFormat(matkhau)) {
    toastr.error("Mật khẩu phải gồm chữ hoa, chữ thường, số và ký tự đặc biệt.", "Thông báo");
    return;
  }

  if (matkhau !== nhaplai) {
    toastr.error("Xác nhận mật khẩu không khớp.", "Thông báo");
    return;
  }

  var para = {
    v_taikhoanthuchien: 1,
    v_mataikhoan: parseInt(mataikhoan),
    v_matkhau: matkhau
  };

  var lst = callApi("/api/quanly_doimatkhau_taikhoan", para);
  if (lst.indexOf("thành công") > -1) {
    showSuccess(lst);
     $("#modal-doimatkhau").modal('hide');
    $('.modal-backdrop').css('display', 'none');
    cleartext();
    return;
  }
  showError(lst);
  
}

// =========================
// DELETE USER
// =========================
function f_xoa_nguoidung(mataikhoan) {
  if (!confirm("Bạn có chắc chắn muốn xóa?")) return;

  var para = {
    v_taikhoanthuchien: 1,
    v_mataikhoan: parseInt(mataikhoan, 10)
  };

  var lst = callApi("/api/quanly_xoa_taikhoan", para);
  if (lst.indexOf("thành công") > -1) {
    showSuccess(lst);
    var userinfo = localStorage.getItem("us");
    var user = JSON.parse(Base64.decode(userinfo));
    load_danhsach_nguoidung(user.danhmucid);
    return;
  }


  showError(lst);
}

// =========================
// GET DETAIL USER
// =========================
function selectDanhMucForEdit(danhmucid) {
  const $tree = $("#tree_left_sua_qldmdl");
  const tree = $tree.jstree(true);
  if (!tree || !danhmucid) return;

  const nodeId = String(danhmucid);

  // bỏ chọn toàn bộ node cũ
  tree.deselect_all(true);

  // mở đường dẫn tới node
  tree._open_to(nodeId);

  // chọn đúng node đã lưu
  tree.select_node(nodeId);

  // lưu lại localStorage nếu bạn đang dùng
  localStorage.setItem("tree_node_tk", JSON.stringify([{ id: nodeId }]));

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
function f_edit_nguoidung(mataikhoan) {
  cleartext();

  var lst = callApi("/api/quanly_ds_taikhoan", {
    v_mataikhoan: parseInt(mataikhoan, 10)
  });

  $.each(lst, function (k, v) {
    var data = v;

    $("#txt_sua_mataikhoan").val(data.taikhoan);
    $("#txt_sua_tennguoidung").val(data.tennguoidung);
    $("#txt_sua_sdt").val(data.sodienthoai);
    $("#txt_sua_email").val(data.email);
    $("#txt_sua_diachi").val(data.diachi);

    const $tree = $("#tree_left_sua_qldmdl");
    const tree = $tree.jstree(true);

    if (tree && tree._model && Object.keys(tree._model.data).length > 1) {
      selectDanhMucForEdit(data.danhmucid);
    } else {
      $tree.one("ready.jstree", function () {
        selectDanhMucForEdit(data.danhmucid);
      });
    }
  });
}

// =========================
// DATATABLE
// =========================
function getStyleTable1() {
  if ($.fn.DataTable.isDataTable("#tbl_danhsachnguoidung")) {
    $("#tbl_danhsachnguoidung").DataTable().destroy();
  }

  $("#tbl_danhsachnguoidung").DataTable({
    dom: '<"top"Bf>' +
      'rt' +
      '<"row mt-2"<"col-md-3"l><"col-md-9 text-end"p>>' +
      '<"row mt-2"<"col-12 text-center"i>>',
    buttons: [
      {
        extend: "excel",
        title: "Danh sách người dùng",
        exportOptions: {
          columns: [0, 1, 2, 3, 4, 5, 6]
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
      { targets: 2, className: "text-center", width: "180px" },
      { targets: 3, className: "text-center", width: "160px" },
      { targets: 4, className: "text-center", width: "180px" },
      { targets: 5, className: "text-center", width: "180px" },
      { targets: 6, className: "text-center", width: "150px" },
      { targets: 7, className: "text-center", width: "170px", orderable: false }
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
      this.api().columns.adjust();
    }
  });

  setTimeout(function () {
    $("#tbl_danhsachnguoidung").DataTable().columns.adjust();
  }, 200);
}

$(document).on("click", ".toggle-password", function () {
  const input = $($(this).data("target"));
  const icon = $(this).find("i");

  if (input.attr("type") === "password") {
    input.attr("type", "text");
    icon.removeClass("fa-eye").addClass("fa-eye-slash");
  } else {
    input.attr("type", "password");
    icon.removeClass("fa-eye-slash").addClass("fa-eye");
  }
});