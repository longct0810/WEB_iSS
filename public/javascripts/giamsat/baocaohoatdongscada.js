

$(document).ready(function () {
    if (!localStorage.getItem("us")) {
        window.location.href = "../login";
    }
    $('.datepicker-default').pickadate({
        monthPrev: '&larr;',
        monthNext: '&rarr;',
        weekdaysShort: ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'],
        showMonthsFull: true,
        today: 'Hôm nay',
        clear: 'Xóa',
        close: 'Đóng',
        formatSubmit: 'dd/mm/yyyy',
        format: 'dd/mm/yyyy',
        monthsFull: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'],
        monthsShort: ['Th 1', 'Th 2', 'Th 3', 'Th 4', 'Th 5', 'Th 6', 'Th 7', 'Th 8', 'Th 9', 'Th 10', 'Th 11', 'Th 12']
    });
    $("#txttungaydate").val(getDateTimeCurrent());
    $("#txtdenngaydate").val(getDateTimeCurrent());
    getCambien();
    $("#btnthuchien_bdpt").click(function () {
        loadData_CamBien();
    });
    $("#cb_loaicambien").change(function () {
        loadData_CamBien();
    });
});
function handleSidebarNode() {
    loadData_CamBien();
}

function getDateTimeCurrent() {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    const day = currentDate.getDate();
    return `${day.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}/${year} `;
}

function getCambien() {
    $.ajax({
        url: "/api/baocaohoatdong_getcambien",
        data: {},
        type: "GET",
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: function (result) {

            $('#cb_loaicambien').html("");
            $("#cb_loaicambien").append("<option value= '-1'>--Chọn loại cảm biến--</option>");
            if (result == null || result == undefined || result == "[]") return

            $.each(result, function (k, v) {
                $('#cb_loaicambien').append("<option value=" + v.type + ">" + v.tencambien + "</option>")
            });
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
            return;
        }
    })


}
function loadData_CamBien() {

    var node = JSON.parse(localStorage.getItem("node"));
    let loaithumuc = node.type;
    let danhmucid = node.id;
    var tree = node.tree;
    if (danhmucid == null || danhmucid == undefined) {
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
    if (tree != 2 || loaithumuc != 9 || (tree == 2 && loaithumuc == 3)) {
        toastr.error("Vui lòng chọn thiết bị ở cây thư mục lộ đường dây", "Thông báo", {
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


    var type = parseInt($("#cb_loaicambien").val());
    if (type == -1) {
        toastr.error("Vui lòng chọn loại cảm biến", "Thông báo", {
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
    $(".tab-content-css").show();
    var para = {
        v_idthietbi: parseInt(danhmucid),
        v_loaicambien: type,
        v_tungay: $("#txttungaydate").val(),
        v_denngay: $("#txtdenngaydate").val()
    }

    $.ajax({
        url: "/api/baocaohoatdong",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify(para),
        success: function (lst) {
            $("#tbl_bchoatdong thead").empty();
            if (type == 2) {
                var header = "";
                header += "<tr><th rowspan='2' class='text-center'>STT</th><th rowspan='2' class='text-center'>Tên cảm biến</th><th colspan='3' class='text-center'> Nhiệt độ</th><th colspan='3' class='text-center'>Dòng điện</th></tr>";
                header += "<tr><th class='text-center'>Nhiệt độ TB (°C)</th><th class='text-center'>Nhiệt độ thấp nhất (Min)</th><th class='text-center'>Nhiệt độ cao nhất (Max)</th><th class='text-center'>Dòng điện TB (A)</th><th class='text-center'>Dòng điện thấp nhất (Min)</th><th class='text-center'>Dòng điện cao nhất (Max)</th></tr>";
                $("#tbl_bchoatdong thead").append(header);
            } else {
                var header = "";
                header += "<tr><th rowspan='2' class='text-center'>STT</th><th  rowspan='2' class='text-center'>Tên cảm biến</th><th colspan='3' class='text-center'> Nhiệt độ</th><th colspan='3' class='text-center'>Độ ẩm</th></tr>";
                header += "<tr><th class='text-center'>Nhiệt độ TB (°C)</th><th class='text-center'>Nhiệt độ thấp nhất (Min)</th><th class='text-center'>Nhiệt độ cao nhất (Max)</th><th class='text-center'>Độ ẩm TB (%)</th><th class='text-center'>Độ ẩm thấp nhất (Min) </th><th class='text-center'>Độ ẩm cao nhất (Max)</th></tr>";
                $("#tbl_bchoatdong thead").append(header);
            }

            if (lst.length == 0) {
                $("#tbl_bchoatdong tbody").empty();
                $("#tbl_bchoatdong tbody").html("<tr><td colspan='8' style='text-align: center;'><b>Không có dữ liệu</b></td></tr>");
                $(".tab-content-css").hide();
                return;
            }
            var tr = "";
            $.each(lst, function (i, x) {

                var data_advc_ = JSON.parse(lst[i]);

                tr += "<tr><td colspan='8' class='tr_tencambien'>" + data_advc_.ten_cambien + "</td></tr>";
                var data_nhiet = data_advc_.cambiennhiet;

                if (type == 2) {
                    $.each(data_nhiet, function (k, v) {
                        tr += "<tr class= 'content_tr'><td class='text-center'>" + (k + 1) + "</td><td>" + v.ten_cambien + "</td><td class='text-right'>" + replaceStrNull(v.nhietdotb) + "</td><td class='text-center'>" + v.nhietdo_value_min + " - " + replaceStrNull(v.nhietbo_min) + "</td><td class='text-center'>" + v.nhietdo_value_max + " - " + replaceStrNull(v.nhietbo_max) + "</td><td class='text-right'>" + replaceStrNull(v.dongdientb) + "</td><td>" + v.dongdien_min + " - " + replaceStrNull(v.dongdien_min) + "</td><td>" + v.dongdien_max + " - " + replaceStrNull(v.dongdien_max) + "</td></tr>";
                    });
                }
                else if (type == 1) {
                    $.each(data_nhiet, function (k, v) {
                        tr += "<tr class= 'content_tr'><td class='text-center'>" + (k + 1) + "</td><td>" + v.ten_cambien + "</td><td class='text-right'>" + replaceStrNull(v.nhietdotb) + "</td><td class='text-center'>" + v.nhietdo_value_min + " - " + replaceStrNull(v.nhietbo_min) + "</td><td class='text-center'>" + v.nhietdo_value_max + " - " + replaceStrNull(v.nhietbo_max) + "</td><td class='text-right'>-</td><td>-</td><td>-</td></tr>";
                    });
                }
                else {
                    $.each(data_nhiet, function (k, v) {
                        tr += "<tr class= 'content_tr'><td class='text-center'>" + (k + 1) + "</td><td>" + v.ten_cambien + "</td><td class='text-right'>" + replaceStrNull(v.nhietdotb) + "</td><td class='text-center'>" + v.nhietdo_value_min + " - " + replaceStrNull(v.nhietbo_min) + "</td><td class='text-center'>" + v.nhietdo_value_max + " - " + replaceStrNull(v.nhietbo_max) + "</td><td class='text-right'>" + replaceStrNull(v.doamtb) + "</td><td>" + v.doam_value_min + " - " + replaceStrNull(v.doam_min) + "</td><td>" + v.doam_value_max + " - " + replaceStrNull(v.doamo_max) + "</td></tr>";
                    });
                }
            });


            $("#tbl_bchoatdong tbody").empty();
            $("#tbl_bchoatdong tbody").html(tr);
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
            return;
        }
    })

};
function replaceStrNull(number) {
    if (number == null || number == undefined || (number == "")) {
        return '-';
    }
    return number;
}
