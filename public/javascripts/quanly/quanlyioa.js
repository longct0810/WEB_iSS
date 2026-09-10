var get_Link_IOA = "";
$(document).ready(function () {
  if (!localStorage.getItem("us")) {
    window.location.href = "../login";
  }
  handleSidebarNode();
  var node = JSON.parse(localStorage.getItem("node"));
  let tree = node.tree;
  let idtb = node.id;
  $(".select2").select2();
  loadData_IOA("-1", idtb);
  getThietBiIOA("-1");
  $("#checkall").click(function () {
    if (this.checked) {
      $("input[name='check']").each(function () {
        $("input[name='check']").prop("checked", true);
      });
    } else {
      $("input[name='check']").each(function () {
        $("input[name='check']").prop("checked", false);
      });
    }
  });
  $("#cb_view").change(function () {
    $("#cb_loaiIOA").val("-1");
    $('#cb_link').val("-1").select2();
    loadData_IOA("VIEW_IOA", idtb);
  });

  $("#cb_loaiIOA").change(function () {

    $("#cb_view").val("-1");
    $('#cb_link').val("-1").select2();
    loadData_IOA("LOAI_IOA", idtb);
  });
  $("#cb_link").change(function () {

    $("#cb_view").val("-1");
    $("#cb_loaiIOA").val("-1");
    var selected_value = $('#cb_link').val();
    get_Link_IOA = $('#cb_link').find('option[value="' + selected_value + '"]').attr('data-link');
    loadData_IOA("LINK_IOA", idtb);
  });
  $("#btnSave_View").click(function () {
    luuViewIOA();
  });
  $("#btnSave_LoaiIOA").click(function () {
    luuLoaiIOA();
  });

  $("#btnSave_link").click(function () {
    luuLinkIOA();
  })
});

//-----------------------------------------------------
function handleSidebarNode() {
  var node = JSON.parse(localStorage.getItem("node"));
  let loaithumuc = node.type;
  let tree = node.tree;
  var type = node.loaithietbi;
  let idtb = node.id;
  // 
  if (tree == 2) {
    loadData_IOA("-1", idtb);
  }
  else {
    alert("Vui lòng chọn thiết bị ở cây thư mục lộ đường dây");
    return;
  }

}
function changeAll(e) {
  if ($(e).prop("checked") == false) {
    $("#checkall").prop("checked", false);
  }
}
function getThietBiIOA(idioa) {

  var id = localStorage.getItem("node");
  var type_tb = localStorage.getItem("type_tb");
  if (id == undefined || type_tb == "folder") {
    return;
  }
  var para = {
    // v_idthietbi: parseInt(id),
    v_idthietbi: 84,
    v_loaiioa: -1
  }

  var url = "/api/ds_thietbi_quanly_ioa";
  var lst = ExecuteServiceSyns(JSON.stringify(para), url);
  if (lst == null || lst == undefined || lst == "[]") return;

  var data_advc_ = JSON.parse(lst[0]).cambien;
  $("#cb_link").html("");
  $("#cb_link").append("<option value= '-1'>--Chọn IOA--</option>");
  $.each(data_advc_, function (k, v) {
    $("#cb_link").append("<option value=" + v.id + " data-link=" + v.link + ">" + v.ten_ioa + "</option>");
  })

  if (idioa != "-1") {
    $('#cb_link').val(idioa).select2();
  }

}
function luuViewIOA() {
  var lstthietBi = "";
  if ($("#cb_view").val() == "-1") {
    alert("Chưa chọn loại hiển thị");
    return;
  }
  $("input[name='check']").each(function () {
    if ($(this).prop("checked") == true) {
      lstthietBi += $(this).attr("data") + ",";
    }
  });
  if (lstthietBi.length == 0) {
    alert("Chọn IOA ở mục danh sách");
    return;
  }

  var id = localStorage.getItem("node");
  var para = {
    v_lst_ma_ioa: lstthietBi,
    v_loaiioa: parseInt($("#cb_view").val()),
    v_idthietbi: parseInt(id),
    v_type: "VIEW_IOA"
  }
  var url = "/api/ds_quanly_ioa_capnhatloai";
  var lst = ExecuteServiceSyns(JSON.stringify(para), url);
  if (lst[0][0].indexOf('thành công') > -1) {
    alert(lst[0][0]);

  }
  else {
    alert(lst[0][0]);
  }
}


function luuLoaiIOA() {
  var lstthietBi = "";
  if ($("#cb_loaiIOA").val() == "-1") {
    alert("Chưa chọn loại IOA");
    return;
  }
  $("input[name='check']").each(function () {
    if ($(this).prop("checked") == true) {
      lstthietBi += $(this).attr("data") + ",";
    }
  });
  if (lstthietBi.length == 0) {
    alert("Chọn IOA ở mục danh sách");
    return;
  }

  var id = localStorage.getItem("id");
  var para = {
    v_lst_ma_ioa: lstthietBi,
    v_loaiioa: parseInt($("#cb_loaiIOA").val()),
    v_idthietbi: parseInt(id),
    v_type: "LOAI_IOA"
  }
  var url = "/api/ds_quanly_ioa_capnhatloai";
  var lst = ExecuteServiceSyns(JSON.stringify(para), url);
  if (lst[0][0].indexOf('thành công') > -1) {
    alert(lst[0][0]);

  }
  else {
    alert(lst[0][0]);
  }

}
function luuLinkIOA() {
  var lstthietBi = "";
  if ($("#cb_link").val() == "-1") {
    alert("Chưa chọn IOA cần cập nhật link");
    return;
  }
  $("input[name='check']").each(function () {
    if ($(this).prop("checked") == true) {
      if (parseInt($("#cb_link").val()) != $(this).attr("data")) {
        lstthietBi += $(this).attr("data") + ",";
      }
    }
  });
  if (lstthietBi.length == 0) {
    alert("Chọn IOA ở mục danh sách");
    return;
  }

  var id = localStorage.getItem("id");
  var para = {
    v_lst_ma_ioa: lstthietBi,
    v_loaiioa: parseInt($("#cb_link").val()),
    v_idthietbi: parseInt(id),
    v_type: "LINK_IOA"
  }
  var url = "/api/ds_quanly_ioa_capnhatloai";
  var lst = ExecuteServiceSyns(JSON.stringify(para), url);
  if (lst[0][0].indexOf('thành công') > -1) {
    getThietBiIOA(para.v_loaiioa);
    alert(lst[0][0]);
  }
  else {
    alert(lst[0][0]);
  }

}
function replaceStrNull(str) {
  if (str === "" || str === null || str === undefined)
    return "-";
  else
    return str;
}
function loadData_IOA(type, idthietbi) {
  var node = JSON.parse(localStorage.getItem("node"));
  var type = node.type;
  if (type != 9) {
    $("#content_advc tbody").empty();
    $("#content_advc tbody").html("<tr><td colspan='8' style='text-align: center;color:#ff0000'><b>Vui lòng chọn thiết bị</b></td></tr>");
    return;
  }

  var para = {
    v_idthietbi: idthietbi,
    v_loaiioa: -1
  }

  var url = "/api/ds_thietbi_quanly_ioa";
  var lst = ExecuteServiceSyns(JSON.stringify(para), url);

  var tr = "";
  $.each(lst, function (i, x) {

    var data_advc_ = JSON.parse(lst[i]);
    tr += "<tr><td colspan='5' style='color:#000'>" + data_advc_.ten_cambien + "</td></tr>";
    var data_cb = data_advc_.cambien;
    $.each(data_cb, function (k, v) {

      var checked11 = "";

      if (type == "LOAI_IOA") {
        checked11 = (v.loaiioa == parseInt($("#cb_loaiIOA").val()) && parseInt($("#cb_loaiIOA").val()) != -1) ? "checked" : "";
      } else if (type == "VIEW_IOA") {
        checked11 = (v.view == parseInt($("#cb_view").val()) && parseInt($("#cb_view").val()) != -1) ? "checked" : "";
      }
      else if (type == "LINK_IOA") {

        if (get_Link_IOA != null) {
          var arrayLink = get_Link_IOA.split(",");
          arrayLink = arrayLink.map(Number);
          if (arrayLink.indexOf(v.id) > -1) {
            checked11 = "checked";
          } else {
            checked11 = "";
          }
        } else {
          checked11 = "";
        }
      }
      else {
        checked11 = "";
      }


      if (v.ioa_diachi == '310' || v.ioa_diachi == '311' || v.ioa_diachi == '312') {
        tr += "<tr class= 'content_tr' data-ioa='" + v.ioa_diachi + "'><td class='text-center'><input type='checkbox' name='check' onclick='changeAll(this)' " + checked11 + "  data=" + v.id + " /></td><td>" + v.ioa_diachi + "</td><td>" + v.ten_ioa + "</td><td>" + replaceStrNull(v.ghichu) + "</td><td class='text-center'>" + replaceStrNull(v.time) + "</td></tr>";
      }
      else if (v.ioa_diachi == '313' || v.ioa_diachi == '314' || v.ioa_diachi == '315')
        tr += "<tr class= 'content_tr' data-ioa='" + v.ioa_diachi + "'><td class='text-center' ><input type='checkbox' name='check' onclick='changeAll(this)'  " + checked11 + " data=" + v.id + " /></td><td>" + v.ioa_diachi + "</td><td>" + v.ten_ioa + "</td><td>" + replaceStrNull(v.ghichu) + "</td><td class='text-center'>" + replaceStrNull(v.time) + "</td></tr>";
      else {
        tr += "<tr class= 'content_tr' data-ioa='" + v.ioa_diachi + "'><td class='text-center'><input type='checkbox' name='check' onclick='changeAll(this)' " + checked11 + " data=" + v.id + "   /></td><td>" + v.ioa_diachi + "</td><td>" + v.ten_ioa + "</td><td>" + replaceStrNull(v.ghichu) + "</td><td class='text-center'>" + replaceStrNull(v.time) + "</td></tr>";
      }
    })
  })


  $("#content_advc tbody").empty();
  $("#content_advc tbody").html(tr);

};
