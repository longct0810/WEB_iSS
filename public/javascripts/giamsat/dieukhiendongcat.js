var is_socongto = '';
var is_imei = '';
var is_ip = '';
var is_port = '';
var is_matkhau_cto = "";
/*Trạng thái đóng cắt: 0 là đóng;  1 là cắt */
// Date picker
$(document).ready(function () {
    if (!localStorage.getItem("us")) {
        window.location.href = "../login";
        return;
    }

    $("#id_overlay").hide();
    $("#id_overlay_cat").hide();
    $("#canhbao_box").hide();
    $("#canhbao_box_cat").hide();

    handleSidebarNode();
});

function handleSidebarNode() {
    loadKH_DongCat();
}

function showToastError(message) {
    toastr.error(message, "Thông báo", {
        positionClass: "toast-bottom-right",
        timeOut: 5e3,
        closeButton: true,
        debug: false,
        newestOnTop: true,
        progressBar: true,
        preventDuplicates: true,
        onclick: null,
        showDuration: "300",
        hideDuration: "1000",
        extendedTimeOut: "1000",
        showEasing: "swing",
        hideEasing: "linear",
        showMethod: "fadeIn",
        hideMethod: "fadeOut",
        tapToDismiss: false
    });
}

function loadKH_DongCat() {
    var node = JSON.parse(localStorage.getItem("node"));

    if (!node) {
        showToastError("Vui lòng chọn danh mục");
        return;
    }

    let loaidanhmuc = node.type;
    let danhmucid = loaidanhmuc == 9 ? "-1" : node.id;

    if (!danhmucid) {
        showToastError("Vui lòng chọn danh mục");
        return;
    }

    if (loaidanhmuc < 5) {
        showToastError("Vui lòng chọn trạm");
        return;
    }

    $("#tbl_dieukhiendongcat tbody").html("");

    var socongto = loaidanhmuc == 9 ? node.socongto : "-1";

    $.ajax({
        url: "/api/khaithacdulieu_dieukhiendongcat_laykh",
        data: JSON.stringify({
            v_danhmucid: danhmucid,
            v_mataikhoan: 1,
            v_socongto: socongto
        }),
        type: "POST",
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: function (result) {
            setTimeout(function () {
                drawData(result);
            }, 200);
        },
        error: function (errormessage) {
            showToastError(errormessage?.responseJSON?.message || "Có lỗi xảy ra");
        }
    });
}

function drawData(data) {
    if ($.fn.DataTable.isDataTable('#tbl_dieukhiendongcat')) {
        var activeRequestsTable = $('#tbl_dieukhiendongcat').DataTable();
        activeRequestsTable.state.clear();
        activeRequestsTable.destroy();
    }

    $("#tbl_dieukhiendongcat tbody").html("");

    $.each(data, function (k, v) {
        var str = '<tr id="row_' + v.meterid + '">' +
            '<td class="text-center row_stt">' + v.stt + '</td>' +
            '<td>' + retNull(v.madiemdo) + '</td>' +
            '<td>' + retNull(v.ten_khachhang) + '</td>' +
            '<td>' + retNull(v.socongto) + '</td>' +
            '<td>' + retNull(v.imei) + '</td>' +
            '<td class="text-center" style="width:330px">' +
            `<a href="#" class="btn btn-primary classquyen_xoa"
                onclick="fn_doctrangthai('${v.socongto}', '${v.imei}', '${v.ip}', '${v.port}'); return false;"
                style="margin:5px">Điều Khiển</a>` +
            '</td>' +
            '</tr>';

        $("#tbl_dieukhiendongcat tbody").append(str);
    });

    getStyleTable();
}

function getStyleTable() {
    $('#tbl_dieukhiendongcat').DataTable({
        dom: 'Bfrtip',
        buttons: ['excelHtml5'],
        scrollX: false,
        scrollCollapse: true,
        paging: true,
        lengthChange: false,
        searching: true,
        order: [],
        columnDefs: [
            { targets: '_all', orderable: false }
        ],
        info: true,
        autoWidth: false,
        language: {
            sProcessing: "Đang xử lý...",
            sLengthMenu: "Xem _MENU_ mục",
            sZeroRecords: "Không tìm thấy dòng nào phù hợp",
            sInfo: "Đang xem _START_ đến _END_ trong tổng số _TOTAL_ mục",
            sInfoEmpty: "Đang xem 0 đến 0 trong tổng số 0 mục",
            sInfoFiltered: "(được lọc từ _MAX_ mục)",
            sInfoPostFix: "",
            sSearch: "Tìm:",
            sUrl: "",
            oPaginate: {
                sFirst: "Đầu",
                sPrevious: "Trước",
                sNext: "Tiếp",
                sLast: "Cuối"
            }
        }
    });
}

function retNull(value) {
    return (value === null || value === undefined || value === '') ? '-' : value;
}

function validateThongTinDongCat() {
    if (!is_socongto) {
        showToastError("Chưa cấu hình số công tơ");
        return false;
    }
    if (!is_imei) {
        showToastError("Chưa cấu hình imei");
        return false;
    }
    if (!is_ip || is_ip === "null") {
        showToastError("Chưa cấu hình IP");
        return false;
    }
    if (!is_port || is_port === "null") {
        showToastError("Chưa cấu hình PORT");
        return false;
    }
    // if (!is_matkhau_cto) {
    //     showToastError("Nhập mật khẩu công tơ");
    //     return false;
    // }

    return true;
}

function fn_doctrangthai(socongto, imei, ip, port) {
    is_socongto = socongto;
    is_imei = imei;
    is_ip = ip;
    is_port = port;
    is_matkhau_cto = "";

    document.getElementById("laber_imei_cat").innerHTML = socongto;
    document.getElementById("thongbao_ketqua").innerHTML = "";
    document.getElementById("thongbao_cat").innerHTML = "Đang đọc trạng thái đóng/cắt thiết bị, vui lòng chờ kết quả.....";
    $("#action_buttons").html("");

    $('#modal_DIEUKHIEN_CAT').modal('show');
    $("#canhbao_box_cat").show();

    GuiLenh_Doc();
}

function GuiLenh_Doc() {
    $("#canhbao_box").show();

    if (!validateThongTinDongCat()) return;

    f_SendDongCat();
}

function f_SendDongCat() {
    $.ajax({
        url: "/api/khaithacdulieu_dieukhiendongcat_doctrangthai",
        data: JSON.stringify({
            v_socongto: is_socongto,
            v_imei: is_imei,
            v_matkhaucongto: is_matkhau_cto,
            v_ip: is_ip,
            v_port: is_port
        }),
        type: "POST",
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        beforeSend: function () {
            $("#id_overlay").show();
        },
        complete: function () {
            $("#id_overlay").hide();
        },
        success: function (result) {
            renderTrangThai(result);
        },
        error: function (errormessage) {
            document.getElementById("thongbao_cat").innerHTML =
                errormessage?.responseText || "Có lỗi khi đọc trạng thái";
            $("#action_buttons").html("");
        }
    });
}

function renderTrangThai(result) {
    if (result && result[0] === "OK") {
        document.getElementById("thongbao_cat").innerHTML = "";

        let trangthai = result[1];
        let htmlBtn = "";

        if (trangthai == "1") {
            document.getElementById("thongbao_ketqua").innerHTML = "Trạng thái hiện tại: Đang cắt";
            htmlBtn = `
                <button id="btndong" class="btn btn-success" onclick="GuiLenh_Dong()">
                    Đóng điện
                </button>
            `;

        } else if (trangthai == "0") {
            document.getElementById("thongbao_ketqua").innerHTML = "Trạng thái hiện tại: Đang đóng";
            htmlBtn = `
                <button id="btnCat" class="btn btn-danger" onclick="GuiLenh_Cat()">
                    Cắt điện
                </button>
            `;
        } else {
            document.getElementById("thongbao_ketqua").innerHTML = "Không đọc được trạng thái";

        }

        $("#action_buttons").html(htmlBtn);
    } else {
        document.getElementById("thongbao_ketqua").innerHTML = "";
        document.getElementById("thongbao_cat").innerHTML =
            Array.isArray(result) ? result.join(" - ") : (result || "Không đọc được trạng thái");
        $("#action_buttons").html("");
    }
}

function ajaxSendLenhDongCat(lenh) {
    return $.ajax({
        url: "/api/khaithacdulieu_dieukhiendongcat_tcp",
        data: JSON.stringify({
            v_socongto: is_socongto,
            v_imei: is_imei,
            v_matkhaucongto: is_matkhau_cto,
            v_ip: is_ip,
            v_port: is_port,
            v_lenhcmd: lenh
        }),
        type: "POST",
        contentType: "application/json;charset=utf-8",
        dataType: "json"
    });
}

function ajaxDocTrangThai() {
    return $.ajax({
        url: "/api/khaithacdulieu_dieukhiendongcat_doctrangthai",
        data: JSON.stringify({
            v_socongto: is_socongto,
            v_imei: is_imei,
            v_matkhaucongto: is_matkhau_cto,
            v_ip: is_ip,
            v_port: is_port
        }),
        type: "POST",
        contentType: "application/json;charset=utf-8",
        dataType: "json"
    });
}

function delay(ms) {
    return new Promise(function (resolve) {
        setTimeout(resolve, ms);
    });
}

async function verifyTrangThaiSauLenh(expectedState, retry = 3, waitMs = 2000) {
    for (let i = 0; i < retry; i++) {
        try {
            const result = await ajaxDocTrangThai();
            if (result && result[0] === "OK") {
                if (String(result[1]) === String(expectedState)) {
                    return {
                        success: true,
                        result: result
                    };
                }
            }
        } catch (e) {
        }

        if (i < retry - 1) {
            await delay(waitMs);
        }
    }

    return {
        success: false,
        result: null
    };
}

async function GuiLenh_Dong() {
    $("#canhbao_box").show();

    if (!validateThongTinDongCat()) return;

    is_matkhau_cto = "";
    document.getElementById("thongbao_ketqua").innerHTML = "";
    document.getElementById("thongbao_cat").innerHTML = "Đã gửi lệnh đóng xuống DCU, vui lòng chờ kết quả...";
    $("#action_buttons").html("");

    try {
        $("#id_overlay").show();

        const sendResult = await ajaxSendLenhDongCat("0");

        if (!sendResult) {
            document.getElementById("thongbao_cat").innerHTML = "Gửi lệnh đóng thất bại";
            return;
        }

        await delay(2000);

        const verifyResult = await verifyTrangThaiSauLenh("0", 3, 2000);
        if (verifyResult.success) {
            await showMessage("✅ Đóng điện thành công");


            insert_lichsu_dongcat(is_imei, is_socongto, 0);
        } else {
            document.getElementById("thongbao_ketqua").innerHTML = "";
            document.getElementById("thongbao_cat").innerHTML = "Đã gửi lệnh đóng nhưng đọc lại trạng thái chưa thành công";
            f_SendDongCat();
        }
    } catch (err) {
        document.getElementById("thongbao_ketqua").innerHTML = "";
        document.getElementById("thongbao_cat").innerHTML =
            err?.responseText || err?.message || "Có lỗi khi gửi lệnh đóng";
    } finally {
        $("#id_overlay").hide();
    }
}

async function GuiLenh_Cat() {
    $("#canhbao_box_cat").show();

    if (!validateThongTinDongCat()) return;

    is_matkhau_cto = "";
    document.getElementById("thongbao_ketqua").innerHTML = "";
    document.getElementById("thongbao_cat").innerHTML = "Đã gửi lệnh cắt xuống DCU, vui lòng chờ kết quả...";
    $("#action_buttons").html("");

    try {
        $("#id_overlay_cat").show();

        const sendResult = await ajaxSendLenhDongCat("1");

        if (!sendResult) {
            document.getElementById("thongbao_cat").innerHTML = "Gửi lệnh cắt thất bại";
            return;
        }

        await delay(2000);

        const verifyResult = await verifyTrangThaiSauLenh("1", 3, 2000);

        if (verifyResult.success) {
            await showMessage("✅ Cắt điện thành công");

            // $("#thongbao_cat").fadeOut(200, function () {
            //     renderTrangThai_kq(verifyResult.result);
            // });

            insert_lichsu_dongcat(is_imei, is_socongto, 1);
        } else {
            document.getElementById("thongbao_ketqua").innerHTML = "";
            document.getElementById("thongbao_cat").innerHTML = "Đã gửi lệnh cắt nhưng đọc lại trạng thái chưa thành công";
            f_SendDongCat();
        }
    } catch (err) {
        document.getElementById("thongbao_ketqua").innerHTML = "";
        document.getElementById("thongbao_cat").innerHTML =
            err?.responseText || err?.message || "Có lỗi khi gửi lệnh cắt";
    } finally {
        $("#id_overlay_cat").hide();
    }
}
async function showMessage(message, time = null) {
    const $el = $("#thongbao_cat");

    $el.html(message).show();

    if (time !== null) {
        await delay(time);
        $el.fadeOut();
    }
}
function insert_lichsu_dongcat(is_imei, is_socongto, is_event) {
    let mataikhoan = 1;

    $.ajax({
        url: "/api/khaithacdulieu_dieukhiendongcat_insert_lichsu_dongcat",
        data: JSON.stringify({
            v_imei: is_imei,
            v_socongto: is_socongto,
            v_event: is_event,
            v_mataikhoan: mataikhoan
        }),
        type: "POST",
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: function () {
            loadKH_DongCat();
        },
        error: function (errormessage) {
            alert(errormessage.responseText);
        }
    });
}