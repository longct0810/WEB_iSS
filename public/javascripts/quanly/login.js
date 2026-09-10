
var Base64 = { _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=", encode: function (e) { var t = ""; var n, r, i, s, o, u, a; var f = 0; e = Base64._utf8_encode(e); while (f < e.length) { n = e.charCodeAt(f++); r = e.charCodeAt(f++); i = e.charCodeAt(f++); s = n >> 2; o = (n & 3) << 4 | r >> 4; u = (r & 15) << 2 | i >> 6; a = i & 63; if (isNaN(r)) { u = a = 64 } else if (isNaN(i)) { a = 64 } t = t + this._keyStr.charAt(s) + this._keyStr.charAt(o) + this._keyStr.charAt(u) + this._keyStr.charAt(a) } return t }, decode: function (e) { var t = ""; var n, r, i; var s, o, u, a; var f = 0; e = e.replace(/[^A-Za-z0-9\+\/\=]/g, ""); while (f < e.length) { s = this._keyStr.indexOf(e.charAt(f++)); o = this._keyStr.indexOf(e.charAt(f++)); u = this._keyStr.indexOf(e.charAt(f++)); a = this._keyStr.indexOf(e.charAt(f++)); n = s << 2 | o >> 4; r = (o & 15) << 4 | u >> 2; i = (u & 3) << 6 | a; t = t + String.fromCharCode(n); if (u != 64) { t = t + String.fromCharCode(r) } if (a != 64) { t = t + String.fromCharCode(i) } } t = Base64._utf8_decode(t); return t }, _utf8_encode: function (e) { e = e.replace(/\r\n/g, "\n"); var t = ""; for (var n = 0; n < e.length; n++) { var r = e.charCodeAt(n); if (r < 128) { t += String.fromCharCode(r) } else if (r > 127 && r < 2048) { t += String.fromCharCode(r >> 6 | 192); t += String.fromCharCode(r & 63 | 128) } else { t += String.fromCharCode(r >> 12 | 224); t += String.fromCharCode(r >> 6 & 63 | 128); t += String.fromCharCode(r & 63 | 128) } } return t }, _utf8_decode: function (e) { var t = ""; var n = 0; var r = c1 = c2 = 0; while (n < e.length) { r = e.charCodeAt(n); if (r < 128) { t += String.fromCharCode(r); n++ } else if (r > 191 && r < 224) { c2 = e.charCodeAt(n + 1); t += String.fromCharCode((r & 31) << 6 | c2 & 63); n += 2 } else { c2 = e.charCodeAt(n + 1); c3 = e.charCodeAt(n + 2); t += String.fromCharCode((r & 15) << 12 | (c2 & 63) << 6 | c3 & 63); n += 3 } } return t } }
$(document).ready(function () {
  $("#btn_login").click(function () {
    var data = {
      "username": $("#txt_tk").val(),
      "password": $("#matkhau").val()
    }
    login(data);
  })
});

function login(data) {
  var url = "/api/login";
  var lst = ExecuteServiceSyns(JSON.stringify(data), url);
   if (!lst || !lst[0]) {
    alert("Không nhận được dữ liệu đăng nhập");
    return;
  }
  const user = lst[0];
 if (!user.result) {
   
    var id = user.mataikhoan;
    var code = user.danhmucid;
    localStorage.setItem("ps", id + "-" + Date.now() + "-" + code)
    localStorage.setItem("us", Base64.encode(JSON.stringify(user)));
    localStorage.setItem("id", code);
    localStorage.setItem("hes_login_token", user.loginToken);
    localStorage.setItem("type_tb", "folder");
    loadquyentheouser(id);
    localStorage.setItem("login_user", JSON.stringify({mataikhoan: user.mataikhoan, taikhoan: user.taikhoan, tennguoidung: user.tennguoidung, danhmucid: user.danhmucid, loginToken: user.loginToken}));
    if (id === 3) {
      window.location.href = "/dashboard";
    } else {
      window.location.href = "/";
    }

  }
  else {
    alert(user.result)
  }
}

function loadquyentheouser(userID) {

  var useridint = parseInt(userID);
  var para = {
    v_mataikhoan: useridint
  }
  var url = "/api/phanquyen_layds";
  var lst = ExecuteServiceSyns(JSON.stringify(para), url);
  if (!lst || !Array.isArray(lst) || lst.length === 0) {
    alert("Tài khoản chưa được cấp quyền.");
    localStorage.removeItem("pmsion");
    return;
  }
  try {
    // Phải stringify trước khi encode
    const json = JSON.stringify(lst);
    const pmsion_encode = btoaUnicode(json);
    localStorage.setItem("pmsion", pmsion_encode);
  } catch (error) {
    console.error("Lỗi lưu quyền:", error);
    alert("Không thể lưu dữ liệu phân quyền.");
  }

}