var isOK = false;
var instance;
var lst_tb = JSON.parse(localStorage.getItem("lst_tb"));
//console.log(lst_tb);
$(document).ready(function () {
    if (!localStorage.getItem("us")) {
        window.location.href = "../login";
    }
    getDataSVG()
})
function init() {
    instance = new SVGPanZoom(document.getElementById('demoSVG'), {
        eventMagnet: document.getElementById('SVGContainer')
    });
    var idtb = localStorage.getItem("id");
    $.each(lst_tb, function (k, v) {
        $("#thietbi_" + v.split("-")[0]).click(function () {
            callModal(v.split("-")[0])
        })
    })
}
function getStyleTable() {
    $('#data_chitiet').DataTable({
        dom: 'Brtp',
        paging: false,
        pageLength: 15,
        ordering: true,
        search: false,
        language: {
            paginate: {
                next: '<i class="fa fa-angle-double-right" style="line-height:2 !important" aria-hidden="true"></i>',
                previous: '<i class="fa fa-angle-double-left" style="line-height:2 !important" aria-hidden="true"></i>'
            }
        },
        scrollCollapse: true,
        scrollY: '70vh'
    });


}
function callModal(id) {
    var para = {
        v_idthietbi: parseInt(id)
    }
    var url = "/api/ds_thietbi_home_IEC_104";
    var lst = ExecuteServiceSyns(JSON.stringify(para), url);
    var cambien = JSON.parse(lst[0]).cambien;
    var str = "";
    $("#data_chitiet tbody").empty();
    var activeRequestsTable = $("#data_chitiet").DataTable();
    activeRequestsTable.clear().destroy();
    $.each(cambien, function (k, v) {
        str += '<tr data-value="' + v.ioa_diachi + '" class="tr_ioa"><td>' + v.ten_ioa + '</td>' +
            '<td class="value_ioa_' + id + '_' + v.ioa_diachi + '">' + v.value + '</td>' +
            '<td>' + v.scale + '</td>' +
            '<td>' + v.ioa_diachi + '</td>' +
            '<td class="time_ioa_' + id + '_' + v.ioa_diachi + '">' + v.time + '</td>' +
            '<td>' + v.ghichu + '</td></tr>';
    })
    $('#data_chitiet tbody').empty();
    $('#data_chitiet tbody').append(str);
    getStyleTable();
    $("#giamsatchitiet_modal").modal("show");
    $(".tr_ioa").click(function () {
        alert($(this).data("value"));

    })
}
function drawOnOff(id, status) {
    if (status == 1) {
        $("#" + id).removeClass("blink_off");
        $("#" + id).addClass("blink_on");
    } else {
        $("#" + id).removeClass("blink_on");
        $("#" + id).addClass("blink_off");
    }
}
function getData_IOA(id) {
    var para = {
        v_idthietbi: parseInt(id)
    }
    var url = "/api/ds_thietbi_home_IEC_104";
    var lst = ExecuteServiceSyns(JSON.stringify(para), url);
    var cambien = JSON.parse(lst[0]).cambien;
    $("#time_ioa_" + id + "_300").html(cambien[0].time);
    $.each(cambien, function (k, v) {
        $("#value_ioa_" + id + "_" + v.ioa_diachi).html(v.value);
    })
}
function callModal_thietbi(id, type) {
    //console.log(id);
    handleSidebarNode();

    if (type == "mba") {
        loadtsvh(id, type);
        $("#thongsovanhanh_scada").show();
        $(".advc").hide();
        $(".cambien").show();
    } else {
        loadData(id, type);
        $("#thongsovanhanh_scada").hide();
        $(".advc").show();
        $(".cambien").hide();
    }
    $("#modal_thongsovanhanh_scada").modal("show");

}
function getDataSVG() {
    var type_tree = JSON.parse(localStorage.getItem("node")).tree;
    if (type_tree == 1) {
        toastr.error("Chức năng làm việc trên cây thư mục Lộ đường dây", "Thông báo", {
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
        $("#SVGContainer").empty();
    } else {
        const danhmucid = JSON.parse(localStorage.getItem("node")).id
        $.ajax({
            type: "GET",
            url: "/svg/" + danhmucid + ".svg",
            dataType: "xml",
            success: function (xml) {
                // Do something with the SVG XML data
                var svg = $(xml).find("svg");
                $("#SVGContainer").empty();
                $("#SVGContainer").html(svg);
                isOK = true;
                init();
                //getData_IOA(danhmucid);
            },
            error: function (xhr, status, error) {
                // Handle error
                console.error('Request failed:', status, error);
                // alert("Chọn lại danh mục:" + error)
                $("#SVGContainer").empty();
            }
        });
    }

}