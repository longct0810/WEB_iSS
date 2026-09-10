

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
 
    $("#btnthuchien_bdpt").click(function () {
        loadData_CanhBao();
    });
    $("#cb_loaicanhbao").change(function () {
        loadData_CanhBao();
    });
});
function handleSidebarNode() {
    loadData_CanhBao();
}

function getDateTimeCurrent() {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    const day = currentDate.getDate();
    return `${day.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}/${year} `;
}

 
function loadData_CanhBao() {

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
 

    var macanhbao = ($("#cb_loaicanhbao").val());
    if (macanhbao == -1) {
        toastr.error("Vui lòng chọn loại cảnh báo", "Thông báo", {
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
        v_iddanhmuc: danhmucid,
        v_macanhbao: macanhbao,
        v_tungay: $("#txttungaydate").val(),
        v_denngay: $("#txtdenngaydate").val()
    }
    
    $.ajax({
        url: "/api/canhbao_matdien",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify(para),
        success: function (lst) {
            
            var row = "";
            var stt = 0;
            $.each(lst, function (k, v) {
              var data = JSON.parse(lst[k]);
              stt = stt + 1;
              row += "<tr>"
              row += "<td>" + stt + "</td>";
              row += "<td>" +  data.noidungcanhbao + "</td>";
              row += "<td>" +  data.thoigiancanhbao + "</td>";
              row += "<td>" +  data.thoigian_hetcanhbao + "</td>";
              row += "<td>" +  data.thoigianmatdien + "</td>";
              row += "<td>" +  data.khacphuc + "</td>";
              row += "</tr>"
            });
 
            $("#tbl_bchoatdong tbody").empty();
            $("#tbl_bchoatdong tbody").html(row);
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
