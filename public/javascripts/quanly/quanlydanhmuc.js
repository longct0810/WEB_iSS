var type_click = "";
var istab_select = 1;
$(document).ready(function () {
    if (!localStorage.getItem("us")) {
        window.location.href = "../login";
    }
    GetTreeAll_qldmdl();
    $("#btn_luu_thietbi").click(function () {
        f_Save_Thietbi();
    });

});


var arrPhanQuyen = null;
function load_permission() {
    var ispms = localStorage.getItem("pmsion");
    var listpms = Base64.decode(ispms);
    var mnmn = '[' + listpms + ']';
    arrPhanQuyen = JSON.parse(mnmn);
    if (arrPhanQuyen == null) {
        alert("Tài khoản chưa được cấp quyền.");
        window.location.href = "login.html";
        return;
    }

}
function handleSidebarNode() {

}
function GetTreeAll_qldmdl() {
    $("#tree_left_qldmdl").show();
    $("#stree_qldm").show();
    $('.easy-tree-qldm').jstree("destroy");
    $("#help_tree_qldm").hide();
    var Base64 = { _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=", encode: function (e) { var t = ""; var n, r, i, s, o, u, a; var f = 0; e = Base64._utf8_encode(e); while (f < e.length) { n = e.charCodeAt(f++); r = e.charCodeAt(f++); i = e.charCodeAt(f++); s = n >> 2; o = (n & 3) << 4 | r >> 4; u = (r & 15) << 2 | i >> 6; a = i & 63; if (isNaN(r)) { u = a = 64 } else if (isNaN(i)) { a = 64 } t = t + this._keyStr.charAt(s) + this._keyStr.charAt(o) + this._keyStr.charAt(u) + this._keyStr.charAt(a) } return t }, decode: function (e) { var t = ""; var n, r, i; var s, o, u, a; var f = 0; e = e.replace(/[^A-Za-z0-9\+\/\=]/g, ""); while (f < e.length) { s = this._keyStr.indexOf(e.charAt(f++)); o = this._keyStr.indexOf(e.charAt(f++)); u = this._keyStr.indexOf(e.charAt(f++)); a = this._keyStr.indexOf(e.charAt(f++)); n = s << 2 | o >> 4; r = (o & 15) << 4 | u >> 2; i = (u & 3) << 6 | a; t = t + String.fromCharCode(n); if (u != 64) { t = t + String.fromCharCode(r) } if (a != 64) { t = t + String.fromCharCode(i) } } t = Base64._utf8_decode(t); return t }, _utf8_encode: function (e) { e = e.replace(/\r\n/g, "\n"); var t = ""; for (var n = 0; n < e.length; n++) { var r = e.charCodeAt(n); if (r < 128) { t += String.fromCharCode(r) } else if (r > 127 && r < 2048) { t += String.fromCharCode(r >> 6 | 192); t += String.fromCharCode(r & 63 | 128) } else { t += String.fromCharCode(r >> 12 | 224); t += String.fromCharCode(r >> 6 & 63 | 128); t += String.fromCharCode(r & 63 | 128) } } return t }, _utf8_decode: function (e) { var t = ""; var n = 0; var r = c1 = c2 = 0; while (n < e.length) { r = e.charCodeAt(n); if (r < 128) { t += String.fromCharCode(r); n++ } else if (r > 191 && r < 224) { c2 = e.charCodeAt(n + 1); t += String.fromCharCode((r & 31) << 6 | c2 & 63); n += 2 } else { c2 = e.charCodeAt(n + 1); c3 = e.charCodeAt(n + 2); t += String.fromCharCode((r & 15) << 12 | (c2 & 63) << 6 | c3 & 63); n += 3 } } return t } }
    var userinfo = localStorage.getItem("us");
    var user = JSON.parse(Base64.decode(userinfo));
    try {
        var para = { v_danhmucid: user.danhmucid == null ? "-1" : user.danhmucid, v_danhmucid_lo: user.danhmuc_lo == null ? "-1" : user.danhmuc_lo }
        var url = "/api/quanly_ds_danhmuc_user";
        var lst = ExecuteServiceSyns(JSON.stringify(para), url);
        result_GetTreeAll_qldmdl(lst);
    } catch (e) {
        console.log(e);
    }
}

function result_GetTreeAll_qldmdl(obj) {

    var jsdataqldm_1 = [];
    $.each(obj, function (k, v) {
        var data = JSON.parse(obj[k]);
        if (data.length == 0) {
            jsdataqldm_1.splice(0, jsdataqldm_1.length);
            initTree_qldm(jsdataqldm_1);
        } else {
            var label = data.ip != null ? data.label + ' (' + data.ip + '/' + data.port + ')' : data.label;
            jsdataqldm_1.push({
                "id": data.id, "parent": data.parentid, "text": label, "icon": data.icon, "data": {
                    id: data.id,
                    parent: data.parentid,
                    text: data.label,
                    nameparent: data.nameparent,
                    ip: data.ip,
                    port: data.port,
                    tenthietbi: data.label,
                    type: data.type,
                    loaidanhmuc: data.loaidanhmuc
                }
            });
        }

    });

    initTree_qldm(jsdataqldm_1);

}

function initTree_qldm(data) {
    $('#tree_left_qldmdl').jstree({
        "core": {
            "multiple": true,//false
            "animation": 0,
            "check_callback": true,
            'data': data
        },

        "search": {
            "show_only_matches": true,
            "search_callback": function (str, node) {
                if (node.text.indexOf(str) != -1) {
                    $('.easy-tree-qldm').jstree('open_node', node.id);
                    $(".easy-tree-qldm").jstree('get_selected', true);
                    $(".easy-tree-qldm").jstree('select_node', node.id, function (e, d) {
                        if (e.parents.length) {
                            $(".easy-tree-qldm").jstree('open_node', e.parent);
                        };
                    });
                }

            }
        },
        "contextmenu": {
            "items": customMenu_qldm
        },
        "plugins": [
            "search",
            "contextmenu"]
    }).bind("loaded.jstree", function (event, data) {
        $(this).jstree("open_all");
    });

    $("#stree_qldm span").click(function () {
        $(".easy-tree-qldm").jstree(true).search($("#search_meter_qldmdl").val());
    });
    $('.easy-tree-qldm').on("changed.jstree", function (e, data) {
        localStorage.removeItem("tree_node_qldm");
        var data_row = [];
        if (data.selected.length > 1) {
            for (var i = 0; i < data.selected.length; i++) {
                data_row.push({ "id": data.instance.get_node(data.selected[i]).id, "name": data.instance.get_node(data.selected[i]).text, "nameparent": data.instance.get_node(data.selected[i]).data.nameparent, "parentid": data.instance.get_node(data.selected[i]).data.parent, "ip": data.instance.get_node(data.selected[i]).data.ip, "port": data.instance.get_node(data.selected[i]).data.port, "tenthietbi": data.instance.get_node(data.selected[i]).data.tenthietbi, "type": data.instance.get_node(data.selected[i]).data.type, "loaidanhmuc": data.instance.get_node(data.selected[i]).data.loaidanhmuc });
            }
        } else {
            data_row = ([{ "id": data.instance.get_node(data.selected[0]).id, "name": data.instance.get_node(data.selected[0]).text, "nameparent": data.instance.get_node(data.selected[0]).data.nameparent, "parentid": data.instance.get_node(data.selected[0]).data.parent, "ip": data.instance.get_node(data.selected[0]).data.ip, "port": data.instance.get_node(data.selected[0]).data.port, "tenthietbi": data.instance.get_node(data.selected[0]).data.tenthietbi, "type": data.instance.get_node(data.selected[0]).data.type, "loaidanhmuc": data.instance.get_node(data.selected[0]).data.loaidanhmuc }]);
        }
        localStorage.setItem("tree_node_qldm", JSON.stringify(data_row));

    });

}

function customMenu_qldm(node) {

    // The default set of all items
    var tree = JSON.parse(localStorage.getItem("tree_node_qldm"));
    console.log(tree[0].name);
    var items = {

        addItem: { // The "rename" menu item
            label: (tree[0].loaidanhmuc == 4 || tree[0].loaidanhmuc == 5 || tree[0].loaidanhmuc == 6) && tree[0].type == 2 ? "Thêm thiết bị" : "Thêm danh mục",
            action: function () {
                console.log(tree);
                if ((tree[0].loaidanhmuc == 4 || tree[0].loaidanhmuc == 5 || tree[0].loaidanhmuc == 6) && tree[0].type == 2) {
                    $("#modal_themthietbi").modal("show");
                    $(".modal-title_dm").html("Thêm mới thiết bị");
                    type_click = "addDevice";
                    $("#txt_danhmuccha").val(tree[0].name);
                    $("#txt_danhmuccha_tb").val(tree[0].nameparent);
                    $("#txt_tendanhmuc_tb").val(tree[0].name);
                    $("#txt_tendanhmuc_tb").attr("disabled", "disabled");
                    $("#trtenthietbi").css("display", "table-row");
                    $("#messinfo11_tkho").html("");
                    loadThietBi();

                }
                else {
                    $("#messinfo11_tkho").html("");
                    $("#modal_themdanhmuc").modal("show");
                    $(".modal-title_dm").html("Thêm mới danh mục");
                    $("#trtenthietbi").css("display", "none");
                    $("#txt_tendanhmuc_tb").removeAttr("disabled");
                    $("#txt_danhmuccha").val(tree[0].name);
                    $("#txt_tendanhmuc").val("");
                    $("#txt_tendanhmuc").removeAttr("disabled");
                    $("#cb_type").prop("checked", false);
                    type_click = "add";
                }
            }
        },
        renameItem: { // The "rename" menu item

            label: !tree[0]?.id?.startsWith("00") && tree[0].type == 2 ? "Sửa thiết bị" : "Sửa danh mục",
            action: function () {
                if (!tree[0]?.id?.startsWith("00") && tree[0].type == 2) {

                    $("#modal_Suathietbi").modal("show");
                    $("#messinfo_sua_thietbi").html("");
                    $(".modal-title_dm").html("Sửa thiết bị");
                    $("#txt_tenthietbi").val(tree[0].tenthietbi);
                    $("#txt_ip_thietbi").val(tree[0].ip);
                    $("#txt_ip_port").val(tree[0].port);
                    type_click = "edit";
                    $("#trtenthietbi").css("display", "none");
                } else {
                    $("#modal_themdanhmuc").modal("show");
                    $("#messinfo11_tkho").html("");
                    $(".modal-title_dm").html("Sửa danh mục");
                    $("#txt_tendanhmuc").val(tree[0].name);
                    $("#txt_danhmuccha").val(tree[0].nameparent);
                    $("#cb_type").prop("checked", tree[0].type == 1 ? false : true);
                    $("#txt_tendanhmuc").removeAttr("disabled");
                    type_click = "edit";
                    $("#trtenthietbi").css("display", "none");
                }
            }
        },
        deleteItem: { // The "delete" menu item
            label: "Xóa",
            action: function () {
                if (confirm("Bạn chắc chắn muốn xóa?")) {
                    if (tree[0].parentid.length < 9) {
                        f_xoa_dm(node.id);
                    } else {
                        f_xoa_dm_thietbi(node.id);
                    }
                };
            }
        }
    };

    if (tree[0].parentid.length == 1) {
        delete items.deleteItem;
    }
    else if (tree[0].id == "999999") {
        delete items.renameItem;
        delete items.addItem;
        delete items.deleteItem;
    }
    else if (tree[0].parentid == "999999") {
        //delete items.renameItem;
        delete items.addItem;
        delete items.deleteItem;
    }
    else if (!tree[0]?.id?.startsWith("00")) {
        delete items.addItem;

    }
    return items;
}
function loadThietBi() {
    try {

        $.ajax({
            url: "/api/quanly_ds_danhmuc_getthietbi",
            data: {},
            type: "GET",
            contentType: "application/json;charset=utf-8",
            dataType: "json",
            success: function (result) {
                $('#cb_ds_thietbi').html("");
                if (result == null || result == undefined || result == "[]") return;

                $.each(result, function (k, v) {
                    $('#cb_ds_thietbi').append("<option value=" + v.id_thietbi + ">" + v.tenthietbi + "</option>");
                });


            },
            complete: function (xhr, textStatus) {
                if (xhr.status == "400") {
                    toastr.error(xhr.responseJSON.message, "Thông báo", {
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
            }


        });

    } catch (e) {
        console.log(e);
    }
}

function f_xoa_dm(code) {
    try {
        var url = "/api/quanly_xoadanhmuc";
        var para = {
            v_id: code,
        }
        var lst = ExecuteServiceSyns(JSON.stringify(para), url);
        if (lst[0][0].indexOf('thành công') > -1) {
            alert(lst[0][0]);
            GetTreeAll_qldmdl();
        }
        else {
            alert(lst[0][0]);
        }
    } catch (e) {
        console.log(e);
    }
}
function f_xoa_dm_thietbi(idthietbi) {
    try {
        var url = "/api/quanly_xoadanhmuc_thietbi";
        var para = {
            v_idthietbi: idthietbi,
        }
        var lst = ExecuteServiceSyns(JSON.stringify(para), url);
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
            GetTreeAll_qldmdl();
        }
        else {
            toastr.error(lst[0], "Thông báo", {
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
    } catch (e) {
        console.log(e);
    }
}


$("a[href='#is_tab_danhmuc']").click(function () {
    istab_select = 1;
});
$("a[href='#is_tab_loduongday']").click(function () {
    istab_select = 2;
});
$("#btn_them_thietbi").click(function () {
    var tree = JSON.parse(localStorage.getItem("tree_node_qldm"));
    var kh = $("#cb_ds_thietbi").val();
    var kh_id = "";
    if (kh != null && kh != undefined && kh != "-1") {
        $.each(kh, function (key, val) {
            kh_id += val + ',';
        })
    } else kh_id = "-1";
    if (kh_id == "-1") {
        toastr.error("Vui lòng chọn thiết bị", "Thông báo", {
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

    var ChiSoParameter = new Object()
    ChiSoParameter.v_idthietbi = kh_id == "" ? "-1" : kh_id;
    ChiSoParameter.v_danhmucid = tree[0].id;
    $.ajax({
        url: "/api/quanly_ds_danhmuc_themthietbi",
        data: JSON.stringify(ChiSoParameter),
        type: "POST",
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: function (lst) {
            var data = lst[0].result;
            if (data.indexOf('thành công') > -1) {
                loadThietBi();
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

                GetTreeAll_qldmdl();
            }
        },
        complete: function (xhr, textStatus) {
            if (xhr.status == "400") {
                toastr.error(xhr.responseJSON.message, "Thông báo", {
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
        }


    });
});
// save danh muc
$("#btn_luu").click(function () {

    var tree = JSON.parse(localStorage.getItem("tree_node_qldm"));
    var para = [];
    var url = "";
    var tendanhmuc = $("#txt_tendanhmuc").val();
    if (tendanhmuc == "") {
        $("#messinfo11_tkho").html("<p class='bg-danger' style='padding: 5px;'>Chưa nhập tên danh mục</p>");
        return;
    }
    if (type_click == "add") { // thêm danh mục

        url = "/api/quanly_themdanhmuc";
        para = {
            v_parentID: tree[0].id,
            v_tendanhmuc: $("#txt_tendanhmuc").val(),
            v_loaitree: istab_select,
            v_type: $("#cb_type").prop("checked") ? 2 : 1
        }
    } else if (type_click == "edit") { //sửa danh mục
        url = "/api/quanly_suadanhmuc";
        para = {
            v_parentID: tree[0].parentid,
            v_tendanhmuc: $("#txt_tendanhmuc").val(),
            v_id: tree[0].id,
            v_loaitree: istab_select,
            v_type: $("#cb_type").prop("checked") ? 2 : 1
        }

    } else if (type_click == "addDevice") {// thêm thiết bị

        var listIDThietBi = "";
        var thietbi = $('#cb_thietbi').val();
        if (thietbi != null && thietbi.length > 0) {
            $.each(thietbi, function (key, val) {
                listIDThietBi += val + ',';
            });
        }
        else {
            listIDThietBi = thietbi;
        }
        if (listIDThietBi == "") {
            $("#messinfo11_tkho").html("<p class='bg-danger' style='padding: 5px;'>Chưa chọn thiết bị</p>");
            return;
        }

        url = "/api/quanly_themdanhmuc_thietbi";
        para = {
            v_danhmucid: tree[0].id,
            v_lst_idthietbi: listIDThietBi

        }
    }
    var lst = ExecuteServiceSyns(JSON.stringify(para), url);
    if (lst[0][0].indexOf('thành công') > -1) {
        $("#messinfo11_tkho").html("<p class='bg-success' style='padding: 5px;'>" + lst[0][0] + "</p>");
        GetTreeAll_qldmdl();
        $("#modal_themdanhmuc").modal("hide");

    }
    else {
        $("#messinfo11_tkho").html("<p class='bg-danger' style='padding: 5px;'>" + lst[0][0] + "</p>");
    }

});

function f_Save_Thietbi() {
    try {
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
        var url = "/api/quanly_ds_danhmuc_suathietbi";
        var para = {
            v_idthietbi: tree[0].id,
            v_tenthietbi: tenthietbi,
            v_ip: ip,
            v_port: port,
            v_kinhdo: $("#txt_kinhdo_thietbi").val(),
            v_vido: $("#txt_vido_thietbi").val(),
            v_sosim: $("#txt_sosim_thietbi").val()
        }
        var lst = ExecuteServiceSyns(JSON.stringify(para), url);
        // console.log(lst);
        if (lst[0].result.indexOf('thành công') > -1) {
            GetTreeAll_qldmdl();
            $("#modal_Suathietbi").modal("hide");
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
    } catch (e) {
        console.log(e);
    }
}