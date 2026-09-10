
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
    $("#txttungay_csct_ct").val(getDateTimeCurrent());
    $("#txtdenngay_csct_ct").val(getDateTimeCurrent());
    handleSidebarNode();
});
function getDateTimeCurrent() {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    const day = currentDate.getDate();
    return `${day.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}/${year} `;
}
function handleSidebarNode() {
    var node = JSON.parse(localStorage.getItem("node"));
    if (!node) return;
    let loaithumuc = node.type;
    let tree = node.tree;
    var type = node.loaithietbi;
    $(".point_name_on_page").html(`<i class="flaticon-050-info"></i> ${node.tendanhmuc}`)
    if (tree != 2 || loaithumuc != 9 || (tree == 2 && loaithumuc == 3)) {
        $("#thongbaoscada").addClass("show");
        $(".thongsovanhanhscada").hide();
        $(".thongbaoscada").show();
        return;
    }
    $("#thongbaoscada").removeClass("show");
    $(".thongsovanhanhscada").show();
    $(".thongbaoscada").hide();
    let id = node.id;
    if (type == "MBA") {
        loadtsvh(id, type);
        $(".tsvh").show();
        $(".advc").hide();
        $(".cambien").show();
    } else {
        loadData(id, type);
        $(".tsvh").hide();
        $(".advc").show();
        $(".cambien").hide();
    }


}
function loadtsvh(id, type) {
    var para = {
        "v_idthietbi": parseInt(id),
        "v_tungay": $("#txttungay_csct_ct").val(),
        "v_denngay": $("#txtdenngay_csct_ct").val()
    }
    $.ajax({
        url: "/api/scada_thongsovanhanh",
        data: JSON.stringify(para),
        type: "POST",
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: function (result) {
            drawData_TSVH(result)
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
    });
}
function drawData_TSVH(data) {
    $("#modal_tsvh").empty();
    var str = '<table id="tsvh_modal" class="table table-bordered row-border order-column table-responsive">' +
        '<thead>' +
        '<tr>' +
        '<th>STT</th>' +
        '<th>Thời điểm</th>' +
        '<th>U (V)</th>' +
        '<th>I (A)</th>' +
        '<th>Pgiao tổng (kWh)</th>' +
        '<th>Pnhan tổng (kWh)</th>' +
        '<th>Q Giao (kvArh)</th>' +
        '<th>Q Nhận (kvArh)</th>' +
        '<th>TI</th>' +
        '<th>TU</th>' +
        '<th>Cos</th>' +
        '<th>Tần số (Hz)</th>' +
        '<th>Góc</th>' +
        '</tr>' +
        '</thead>' +
        '<tbody>';
    if (data.length == 0) {
        str += "<tr><td colspan='13' style='text-align: center;'>Không có dữ liệu hiển thị</td></tr>"
        $("#modal_tsvh").html(str);
        return;

    };
    var sct = JSON.parse(data[0][0]).value * Math.pow(10, 6) + JSON.parse(data[1][0]).value;
    $("#sct").html(sct);
    var SCT_H = '-', SCT_L = '-', TI_Ts = '-', TI_Ms = '-', TU_Ts = '-', TU_Ms = '-', UA = '-', UB = '-', UC = '-', IA = '-', IB = '-', IC = '-', CosA = '-', CosB = '-', CosC = '-', Freg = '-', AngleA = '-', AngleB = '-', AngleC = '-', PGIAOTONG = '-', PGIAO1 = '-', PGIAO2 = '-', PGIAO3 = '-', PNHANTONG = '-', PNHAN1 = '-', PNHAN2 = '-', PNHAN3 = '-', QGIAOTONG = '-', QNHANTONG = '-';
    var stt = 0;
    for (var index = 0; index < data.length; index++) {
        stt = stt + 1;

        var tsvh = JSON.parse(data[index][0]).tsvh;
        $.each(tsvh, function (k, v) {
            switch (v.ten_ioa) {
                case "SCT_H":
                    SCT_H = v.value;
                    break;
                case "SCT_L":
                    SCT_L = v.value;
                    break;
                case "TI_Ts":
                    TI_Ts = v.value;
                    break;
                case "TI_Ms":
                    TI_Ms = v.value;
                    break;
                case "TU_Ts":
                    TU_Ts = v.value;
                    break;
                case "TU_Ms":
                    TU_Ms = v.value;
                    break;
                case "UA":
                    UA = (v.value * v.scale * v.tu).toFixed(2);
                    break;
                case "UB":
                    UB = (v.value * v.scale * v.tu).toFixed(2);
                    break;
                case "UC":
                    UC = (v.value * v.scale * v.tu).toFixed(2);
                    break;
                case "IA":
                    IA = (v.value * v.scale * v.ti).toFixed(2);
                    break;
                case "IB":
                    IB = (v.value * v.scale * v.ti).toFixed(2);
                    break;
                case "IC":
                    IC = (v.value * v.scale * v.ti).toFixed(2);
                    break;
                case "CosA":
                    CosA = v.value;
                    break;
                case "CosB":
                    CosB = v.value;
                    break;
                case "CosC":
                    CosC = v.value;
                    break;
                case "Freg":
                    Freg = v.value;
                    break;
                case "AngleA":
                    AngleA = v.value;
                    break;
                case "AngleB":
                    AngleB = v.value;
                    break;
                case "AngleC":
                    AngleC = v.value;
                    break;
                case "PGIAOTONG":
                    PGIAOTONG = v.value;
                    break;
                case "PGIAO1":
                    PGIAO1 = v.value;
                    break;
                case "PGIAO2":
                    PGIAO2 = v.value;
                    break;
                case "PGIAO3":
                    PGIAO3 = v.value;
                    break;
                case "PNHANTONG":
                    PNHANTONG = v.value;
                    break;
                case "PNHAN1":
                    PNHAN1 = v.value;
                    break;
                case "PNHAN2":
                    PNHAN2 = v.value;
                    break;
                case "PNHAN3":
                    PNHAN3 = v.value;
                    break;
                case "QGIAOTONG":
                    QGIAOTONG = v.value;
                    break;
                case "QNHANTONG":
                    QNHANTONG = v.value;
                    break;
            }
        })

        str += '<tr class="phaA">' +
            '<td></td>' +
            '<td></td>' +
            '<td><span>Pha A: </span><b>' + UA + '</b></td>' +
            '<td><span>Pha A: </span><b>' + IA + '</b></td>' +
            '<td><span>Biểu 1: </span><b>' + PGIAO1 + '</b></td>' +
            '<td><span>Biểu 1: </span><b>' + PNHAN1 + '</b></td>' +
            '<td></td>' +
            '<td></td>' +
            '<td></td>' +
            '<td></td>' +
            '<td><span>Pha A: </span><b>' + CosA + '</b></td>' +
            '<td></td>' +
            '<td><span>Pha A: </span><b>' + AngleA + '</b></td>' +
            '</tr >' +
            '<tr class="phaB">' +////////////////////////////
            '<td>' + stt + '</td>' +
            '<td>' + JSON.parse(data[index][0]).time + '</td>' +
            '<td><span>Pha B: </span><b>' + UB + '</b></td>' +
            '<td><span>Pha B: </span><b>' + IB + '</b></td>' +
            '<td><span>Biểu 2: </span><b>' + PGIAO2 + '</b></td>' +
            '<td><span>Biểu 2: </span><b>' + PNHAN2 + '</b></td>' +
            '<td></td>' +
            '<td></td>' +
            '<td>' + TI_Ts + '/' + TI_Ms + '</td>' +
            '<td>' + TU_Ts + '/' + TU_Ms + '</td>' +
            '<td><span>Pha B: </span><b>' + CosB + '</b></td>' +
            '<td>' + Freg + '</td>' +
            '<td><span>Pha B: </span><b>' + AngleB + '</b></td>' +
            '</tr >'
            + '<tr class="phaC">' +////////////////////////
            '<td></td>' +
            '<td></td>' +
            '<td><span>Pha C: </span><b>' + UC + '</b></td>' +
            '<td><span>Pha C: </span><b>' + IC + '</b></td>' +
            '<td><span>Biểu 3: </span><b>' + PGIAO3 + '</b></td>' +
            '<td><span>Biểu 3: </span><b>' + PNHAN3 + '</b></td>' +
            '<td></td>' +
            '<td></td>' +
            '<td></td>' +
            '<td></td>' +
            '<td><span>Pha C: </span><b>' + CosC + '</b></td>' +
            '<td></td>' +
            '<td><span>Pha C: </span><b>' + AngleC + '</b></td></tr>' +
            '<tr class="tong">' +
            '<td>Tổng</td>' +
            '<td></td>' +
            '<td></td>' +
            '<td></td>' +
            '<td class="text-right"><b>' + PGIAOTONG + '</b></td>' +
            '<td class="text-right"><b>' + PNHANTONG + '</b></td>' +
            '<td class="text-right"><b>' + QGIAOTONG + '</b></td>' +
            '<td class="text-right"><b>' + QNHANTONG + '</b></td>' +
            '<td></td>' +
            '<td></td>' +
            '<td></td>' +
            '<td></td>' +
            '<td></td>' +
            '<td></td>' +
            '</tr>';
    }
    str += '</tbody>' +
        '</table>';

    $("#modal_tsvh").html(str);
    getStyleTable()

}
function getStyleTable() {
    $('#tsvh_modal').removeAttr('width').DataTable({
        dom: '<"top">Bfirt<"bottom"lp><"clear">',
        buttons: [
            {
                extend: 'excel'
            }
        ],
        'scrollX': true,
        'scrollCollapse': true,
        "order": [[1, "asc"]],
        'pageLength': 10,
        "lengthMenu": [10, 20, 50, 100, 200, "All"],
        'paging': true,
        'searching': false,
        'ordering': false,
        'info': true,
        'autoWidth': false,
        "language": {
            "sProcessing": "Đang xử lý...",
            "sLengthMenu": "Xem _MENU_ bản ghi",
            "sZeroRecords": "Không tìm thấy dòng nào phù hợp",
            "sInfo": "Đang xem _START_ đến _END_ trong tổng số _TOTAL_ bản ghi",
            "sInfoEmpty": "Đang xem 0 đến 0 trong tổng số 0 bản ghi",
            "sInfoFiltered": "(được lọc từ _MAX_ bản ghi)",
            "sInfoPostFix": "",
            "sSearch": "Tìm:",
            "sUrl": "",
            "oPaginate": {
                "sFirst": "Đầu",
                "sPrevious": "Trước",
                "sNext": "Tiếp",
                "sLast": "Cuối"
            }
        }
        // "initComplete": function (settings, json) {
        //     $("#tbl_csct").wrap("<div style='overflow:auto; width:100%;position:relative;'></div>");
        // },
    }).columns.adjust();
};
//Load sóng hài - cảm biến - nhánh
function loadData(id, type) {
    var para = {
        v_idthietbi: parseInt(id)
    }
    $.ajax({
        url: "/api/scada_thongsovanhanh_getAll",
        data: JSON.stringify(para),
        type: "POST",
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: function (result) {
            drawData_Cambien(result)
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
    });
}
function drawData_Cambien(obj) {

    var str = "";
    var strNhiet = "";
    var strFI = "";
    var strDoam = "";
    var strsucoFI = "";
    var strAcrel1 = "";
    var strAcrel2 = "";
    var strAcrel3 = "";
    var strAcrel4 = "";
    var ar_SHai_IA = [];
    var ar_SHai_IB = [];
    var ar_SHai_IC = [];
    var ar_SHai_UA = [];
    var ar_SHai_UB = [];
    var ar_SHai_UC = [];
    var temp_arr = [];
    var stradvc = "";

    $.each(obj, function (k, v) {
        var sensor = JSON.parse(v[0]);

        if (sensor.type == 1) {
            var nhietdo = (replaceNaN(sensor.cambien[0].value) * sensor.cambien[0].scale).toFixed(2);
            strNhiet += '"<tr><td>' + sensor.ten_cambien + '</td><td class="text-right">' + nhietdo + '</td><td  class="text-center">' + sensor.cambien[0].time + '</td></tr>';
        }
        else if (sensor.type == 2) {
            var nhietdo = (replaceNaN(sensor.cambien[3].value) * sensor.cambien[3].scale).toFixed(2);
            var dongdien = (replaceNaN(sensor.cambien[0].value) * sensor.cambien[0].scale).toFixed(2);
            var dienappin = (replaceNaN(sensor.cambien[2].value) * sensor.cambien[2].scale).toFixed(2);
            strFI += '"<tr><td>' + sensor.ten_cambien + '</td><td  class="text-right">' + nhietdo + '</td><td  class="text-right">' + dongdien + '</td><td  class="text-center">' + sensor.cambien[2].time + '</td></tr>';
        }
        else if (sensor.type == 3) {
            var dataCB_Doam = sensor.cambien;
            var nhietdo, doam, dienappin;
            var obj_dienappin = { value: 0, scale: 1 }
            var obj_nhietdo, obj_doam, obj_typeRF;
            var typeRF;

            $.each(dataCB_Doam, function (k, v) {

                if (v.ten_ioa == "Loại thiết bị đầu RF") {
                    typeRF = v.value;
                }
                else if (v.ten_ioa == "Nhiệt độ") {
                    obj_nhietdo = v;
                }
                else if (v.ten_ioa == "Độ ẩm") {
                    obj_doam = v;
                }
                else if (v.ten_ioa == "Điện áp pin") {
                    obj_dienappin = v;
                }
            })

            typeRF = 1 ? nhietdo = (replaceNaN(obj_nhietdo.value) * obj_nhietdo.scale).toFixed(2) : nhietdo = '-';
            dienappin = (replaceNaN(obj_dienappin.value) * obj_dienappin.scale).toFixed(2);
            typeRF = 2 ? doam = (replaceNaN(obj_doam.value) * obj_doam.scale).toFixed(2) : '-';
            strDoam += '"<tr><td>' + sensor.ten_cambien + '</td><td  class="text-right">' + dienappin + '</td><td  class="text-right">' + nhietdo + '</td><td  class="text-center">' + sensor.cambien[0].time + '</td></tr>';

        }
        // else if (sensor.type == 0) {
        //     $("#lst_cambienkhi").html('<img src="dist/img/sf6-0.png" style="width:70%" id="sf6-img"/>');
        //     //console.log(sensor.cambien[0]["Cảnh báo rò khí"]);
        //     if (sensor.cambien[0].time !== null) $("#time_cbSF").text("(" + sensor.cambien[0].time + ")");
        //     if (sensor.cambien[0].value == 1) {
        //         $("#sf6-img").attr("src", "dist/img/sf6-1.png")
        //         $("#sf6-img").attr("alt", "Đang đầy khí")
        //         $("#sf6-img").attr("title", "Đang đầy khí")
        //         $("#header_sf6").addClass("bg-green");
        //     } else {
        //         $("#sf6-img").attr("src", "dist/img/sf6-0.png")
        //         $("#sf6-img").attr("alt", "Hết khí")
        //         $("#sf6-img").attr("title", "Hết khí")
        //         $("#header_sf6").addClass("bg-danger");

        //     }
        // }
        else if (sensor.type == 4) {
            //console.log(sensor);
            strsucoFI += '"<tr><td>' + sensor.ten_cambien + '</td>';
            if (sensor.cambien[0].value == 0) {
                strsucoFI += '<td style="text-align:center;"><i id="ioa_' + sensor.cambien[0]["ioa_diachi"] + '"  class="icon fas fa-check" style="color: green;"></td>';
            } else {
                strsucoFI += '<td style="text-align:center;animation: blinker 1s linear infinite;"><i id="ioa_' + sensor.cambien[0]["ioa_diachi"] + '" class="icon fas fa-exclamation-triangle" style="color: red;"></td>';
            }
            if (sensor.cambien[1].value == 0) {
                strsucoFI += '<td style="text-align:center;"><i id="ioa_' + sensor.cambien[1]["ioa_diachi"] + '"   class="icon fas fa-check" style="color: green;"></td>';
            } else {
                strsucoFI += '<td style="text-align:center; animation: blinker 1s linear infinite;"><i id="ioa_' + sensor.cambien[1]["ioa_diachi"] + '"  class="icon fas fa-exclamation-triangle" style="color: red;"></td>';
            }
            strsucoFI += '</tr>'

        }
        else if (sensor.type == 5) {
            if (sensor.tsvh == undefined) {
                if (sensor.songhai_ua !== undefined) { //UA

                    //console.log(sensor);
                    var songhaiua = sensor.songhai_ua;
                    $.each(songhaiua, function (k, v) {
                        ar_SHai_UA.push(v.value);
                    })
                }
                else if (sensor.songhai_ub !== undefined) { //UB
                    //console.log(sensor)
                    var songhaiub = sensor.songhai_ub;
                    $.each(songhaiub, function (k, v) {
                        ar_SHai_UB.push(v.value);
                    })
                    //console.log(ar_SHai_UB)
                }
                else if (sensor.songhai_uc !== undefined) { //UC
                    var songhai = sensor.songhai_uc;
                    $.each(songhai, function (k, v) {
                        ar_SHai_UC.push(v.value);
                    })
                }
                else if (sensor.songhai_ia !== undefined) { //IA
                    var songhai = sensor.songhai_ia;
                    $.each(songhai, function (k, v) {
                        ar_SHai_IA.push(v.value);
                    })
                }
                else if (sensor.songhai_ib !== undefined) { //IB
                    var songhai = sensor.songhai_ib;
                    $.each(songhai, function (k, v) {
                        ar_SHai_IB.push(v.value);
                    })
                }
                else if (sensor.songhai_ic !== undefined) { //IC
                    var songhai = sensor.songhai_ic;
                    $.each(songhai, function (k, v) {
                        ar_SHai_IC.push(v.value);
                    })
                }
            }

        }
        else if (sensor.type == 7) {

            var data_advc_ = sensor.cambien;
            $.each(data_advc_, function (k, v) {
                if (v.ioa_diachi == '310' || v.ioa_diachi == '311' || v.ioa_diachi == '312') {
                    stradvc += "<tr class= 'content_tr' data-ioa='" + v.ioa_diachi + "'><td style='text-align:center;'>" + v.ioa_diachi + "</td><td>" + v.ten_ioa + "</td><td style='text-align:center;'><b id='ioa_" + v.ioa_diachi + "'>" + getDaybyIndex(replaceScaleNull(v.value, v.scale)) + "</b></td><td>" + replaceNull(v.ghichu) + "</td><td style='text-align:center;'>" + replaceNull(v.time) + "</td></tr>";
                }
                else if (v.ioa_diachi == '313' || v.ioa_diachi == '314' || v.ioa_diachi == '315')
                    stradvc += "<tr class= 'content_tr' data-ioa='" + v.ioa_diachi + "'><td style='text-align:center;'>" + v.ioa_diachi + "</td><td>" + v.ten_ioa + "</td><td style='text-align:center;'><b id='ioa_" + v.ioa_diachi + "'>" + getTimebyIndex(replaceScaleNull(v.value, v.scale)) + "</b></td><td>" + replaceNull(v.ghichu) + "</td><td style='text-align:center;'>" + replaceNull(v.time) + "</td></tr>";
                else {
                    stradvc += "<tr class= 'content_tr' data-ioa='" + v.ioa_diachi + "'><td style='text-align:center;'>" + v.ioa_diachi + "</td><td>" + v.ten_ioa + "</td><td style='text-align:center;'><b id='ioa_" + v.ioa_diachi + "'>" + replaceScaleNull(v.value, v.scale) + "</b></td><td>" + replaceNull(v.ghichu) + "</td><td style='text-align:center;'>" + replaceNull(v.time) + "</td></tr>";
                }
            });

        }
        else if (sensor.type == 8) {
            var data_Acrel = sensor.cambien;
            $.each(data_Acrel, function (k, v) {
                var chanel = (v.ten_ioa).substring(0, 3);
                if (chanel == "CH1") { //nhánh 1
                    strAcrel1 += '"<tr class="acrel" data-name = "' + v.ten_ioa + '" data-ioa = "' + v.ioa_diachi + '"><td>' + v.ten_ioa + '</td><td  class="text-right">' + (v.value * v.scale).toFixed(2) + '</td><td  class="text-center">' + v.time + '</td></tr>';
                }
                else if (chanel == "CH2") { //nhánh 2
                    strAcrel2 += '"<tr class="acrel" data-name = "' + v.ten_ioa + '"  data-ioa = "' + v.ioa_diachi + '"><td>' + v.ten_ioa + '</td><td  class="text-right">' + (v.value * v.scale).toFixed(2) + '</td><td   class="text-center">' + v.time + '</td></tr>';
                }
                else if (chanel == "CH3") { //nhánh 3
                    strAcrel3 += '"<tr class="acrel" data-name = "' + v.ten_ioa + '"  data-ioa = "' + v.ioa_diachi + '"><td>' + v.ten_ioa + '</td><td  class="text-right">' + (v.value * v.scale).toFixed(2) + '</td><td  class="text-center">' + v.time + '</td></tr>';
                }
                else if (chanel == "CH4") { //nhánh 4
                    strAcrel4 += '"<tr class="acrel" data-name = "' + v.ten_ioa + '"  data-ioa = "' + v.ioa_diachi + '"><td>' + v.ten_ioa + '</td><td  class="text-right">' + (v.value * v.scale).toFixed(2) + '</td><td  class="text-center">' + v.time + '</td></tr>';
                }

            })
        }
    });

    // localStorage.setItem("temp", temp_arr);
    $("#lst_cambiennhiet tbody").empty();
    if (strNhiet.length == 0) {
        $("#lst_cambiennhiet tbody").append(`<tr><td colspan='3' style="text-align: center;">Không có dữ liệu hiển thị</td></tr>`);
    } else {
        $("#lst_cambiennhiet tbody").append(strNhiet);
    }

    $("#lst_cambienfi tbody").empty();
    if (strFI.length == 0) {
        $("#lst_cambienfi tbody").append(`<tr><td colspan='4' style="text-align: center;">Không có dữ liệu hiển thị</td></tr>`);
    } else {
        $("#lst_cambienfi tbody").append(strFI);
    }


    $("#lst_cambiendoam tbody").empty();
    if (strDoam.length == 0) {
        $("#lst_cambiendoam tbody").append(`<tr><td colspan='4' style="text-align: center;">Không có dữ liệu hiển thị</td></tr>`);
    } else {
        $("#lst_cambiendoam tbody").append(strDoam);
    }


    //nhanh 1
    $("#nhanh1 tbody").empty();
    var activeRequestsTable = $('#nhanh1').DataTable();
    activeRequestsTable.state.clear();
    activeRequestsTable.destroy();
    $("#nhanh1 tbody").html(strAcrel1);

    //nhanh 2
    $("#nhanh2 tbody").empty();
    var activeRequestsTable = $('#nhanh2').DataTable();
    activeRequestsTable.state.clear();
    activeRequestsTable.destroy();
    $("#nhanh2 tbody").html(strAcrel2);
    //nhanh 3
    $("#nhanh3 tbody").empty();
    var activeRequestsTable = $('#nhanh3').DataTable();
    activeRequestsTable.state.clear();
    activeRequestsTable.destroy();
    $("#nhanh3 tbody").html(strAcrel3);
    //nhanh 4
    $("#nhanh4 tbody").empty();
    var activeRequestsTable = $('#nhanh4').DataTable();
    activeRequestsTable.state.clear();
    activeRequestsTable.destroy();
    $("#nhanh4 tbody").html(strAcrel4);

    getDataTable_Nhanh();

    draw_SongHai(ar_SHai_IA, ar_SHai_IB, ar_SHai_IC, ar_SHai_UA, ar_SHai_UB, ar_SHai_UC);
    //advc
    $("#tbl_advc tbody").empty();
    $("#tbl_advc tbody").html(stradvc);
    //cảnh báo fi
    $("#tbl_canhbaofi tbody").empty();
    $("#tbl_canhbaofi tbody").html(strsucoFI);

}
function draw_SongHai(ia, ib, ic, ua, ub, uc) {
    var label_ar = ['Bậc 1', 'Bậc 2', 'Bậc 3', 'Bậc 4', 'Bậc 5', 'Bậc 6', 'Bậc 7', 'Bậc 8', 'Bậc 9', 'Bậc 10', 'Bậc 11', 'Bậc 12', 'Bậc 13', 'Bậc 14', 'Bậc 15', 'Bậc 16', 'Bậc 17', 'Bậc 18', 'Bậc 19', 'Bậc 20', 'Bậc 21']
    var ctx = document.getElementById("barChartSonghai");
    var ctx2 = document.getElementById("barChartSonghaiU");
    var barChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        datasetFill: false
    }
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: label_ar,
            datasets: [{
                label: 'IA',
                backgroundColor: '#ffc107',
                borderColor: '#c87903',
                pointRadius: false,
                pointColor: '#3b8bba',
                pointStrokeColor: 'rgba(60,141,188,1)',
                pointHighlightFill: '#fff',
                pointHighlightStroke: 'rgba(60,141,188,1)',
                data: ia
            },
            {
                label: 'IB',
                backgroundColor: '#20c997',
                borderColor: '#2a9420',
                pointRadius: false,
                pointColor: '#3b8bba',
                pointStrokeColor: 'rgba(60,141,188,1)',
                pointHighlightFill: '#fff',
                pointHighlightStroke: 'rgba(60,141,188,1)',
                data: ib
            }, {
                label: 'IC',
                backgroundColor: '#dc3545',
                borderColor: '#9a0000',
                pointRadius: false,
                pointColor: '#3b8bba',
                pointStrokeColor: 'rgba(60,141,188,1)',
                pointHighlightFill: '#fff',
                pointHighlightStroke: 'rgba(60,141,188,1)',
                data: ic
            }
            ]
        },
        options: barChartOptions
    })

    new Chart(ctx2, {
        type: 'bar',
        data: {
            labels: label_ar,
            datasets: [{
                label: 'UA',
                backgroundColor: '#ffc107',
                borderColor: '#ffc107',
                pointRadius: false,
                pointColor: '#3b8bba',
                pointStrokeColor: 'rgba(60,141,188,1)',
                pointHighlightFill: '#fff',
                pointHighlightStroke: 'rgba(60,141,188,1)',
                data: ua
            }, {
                label: 'UB',
                backgroundColor: '#20c997',
                borderColor: '#20c997',
                pointRadius: false,
                pointColor: '#3b8bba',
                pointStrokeColor: 'rgba(60,141,188,1)',
                pointHighlightFill: '#fff',
                pointHighlightStroke: 'rgba(60,141,188,1)',
                data: ub
            }, {
                label: 'UC',
                backgroundColor: '#dc3545',
                borderColor: '#dc3545',
                pointRadius: false,
                pointColor: '#3b8bba',
                pointStrokeColor: 'rgba(60,141,188,1)',
                pointHighlightFill: '#fff',
                pointHighlightStroke: 'rgba(60,141,188,1)',
                data: uc
            }]
        },
        options: barChartOptions
    })
}
function getDataTable_Nhanh() {
    $('#nhanh1').DataTable({
        "language": {
            "sProcessing": "Đang xử lý...",
            "sLengthMenu": "Xem _MENU_ bản ghi",
            "sZeroRecords": "Không tìm thấy dòng nào phù hợp",
            "sInfo": "Đang xem _START_ đến _END_ trong tổng số _TOTAL_ bản ghi",
            "sInfoEmpty": "Đang xem 0 đến 0 trong tổng số 0 bản ghi",
            "sInfoFiltered": "(được lọc từ _MAX_ bản ghi)",
            "sInfoPostFix": "",
            "sSearch": "Tìm:",
            "sUrl": "",
            "oPaginate": {
                "sFirst": "Đầu",
                "sPrevious": "Trước",
                "sNext": "Tiếp",
                "sLast": "Cuối"
            }
        }
    });
    $('#nhanh2').DataTable({
        "language": {
            "sProcessing": "Đang xử lý...",
            "sLengthMenu": "Xem _MENU_ bản ghi",
            "sZeroRecords": "Không tìm thấy dòng nào phù hợp",
            "sInfo": "Đang xem _START_ đến _END_ trong tổng số _TOTAL_ bản ghi",
            "sInfoEmpty": "Đang xem 0 đến 0 trong tổng số 0 bản ghi",
            "sInfoFiltered": "(được lọc từ _MAX_ bản ghi)",
            "sInfoPostFix": "",
            "sSearch": "Tìm:",
            "sUrl": "",
            "oPaginate": {
                "sFirst": "Đầu",
                "sPrevious": "Trước",
                "sNext": "Tiếp",
                "sLast": "Cuối"
            }
        }
    });
    $('#nhanh3').DataTable({
        "language": {
            "sProcessing": "Đang xử lý...",
            "sLengthMenu": "Xem _MENU_ bản ghi",
            "sZeroRecords": "Không tìm thấy dòng nào phù hợp",
            "sInfo": "Đang xem _START_ đến _END_ trong tổng số _TOTAL_ bản ghi",
            "sInfoEmpty": "Đang xem 0 đến 0 trong tổng số 0 bản ghi",
            "sInfoFiltered": "(được lọc từ _MAX_ bản ghi)",
            "sInfoPostFix": "",
            "sSearch": "Tìm:",
            "sUrl": "",
            "oPaginate": {
                "sFirst": "Đầu",
                "sPrevious": "Trước",
                "sNext": "Tiếp",
                "sLast": "Cuối"
            }
        }
    });
    $('#nhanh4').DataTable({
        "language": {
            "sProcessing": "Đang xử lý...",
            "sLengthMenu": "Xem _MENU_ bản ghi",
            "sZeroRecords": "Không tìm thấy dòng nào phù hợp",
            "sInfo": "Đang xem _START_ đến _END_ trong tổng số _TOTAL_ bản ghi",
            "sInfoEmpty": "Đang xem 0 đến 0 trong tổng số 0 bản ghi",
            "sInfoFiltered": "(được lọc từ _MAX_ bản ghi)",
            "sInfoPostFix": "",
            "sSearch": "Tìm:",
            "sUrl": "",
            "oPaginate": {
                "sFirst": "Đầu",
                "sPrevious": "Trước",
                "sNext": "Tiếp",
                "sLast": "Cuối"
            }
        }
    });
}

function replaceScaleNull(str, scale) {
    if (str === "" || str === null || str === undefined)
        return "-";
    else
        return (parseFloat(str) * scale).toFixed(2);
}

function replaceNull(number) {
    if (number == null || number == undefined || (number == "")) {
        return '-';
    }
    return number;
}

function replaceNaN(str) {
    if (str == 6116.60 || str == 61166)
        return 0
    else if (str < 0)
        return 0
    else
        return str;
}

function getDaybyIndex(index) {

    if (index != '-') {
        const startOfYear = new Date('2024-01-01');
        startOfYear.setDate(startOfYear.getDate() + (parseInt(index) - 1)); // Thêm 118 vì ngày đầu tiên của năm là ngày thứ 1
        const day = startOfYear.getDate();
        const month = startOfYear.getMonth() + 1; // Tháng trong JavaScript bắt đầu từ 0
        const year = startOfYear.getFullYear();
        const formattedDate = day + '/' + month + '/' + year;
        return formattedDate;
    } else {
        return index;
    }
}
function getTimebyIndex(index) {
    if (index != '-') {
        const hours = Math.floor(index / 60);
        const minutes = index % 60;
        return hours.toString().padStart(2, '0') + ':' + minutes.toString().padStart(2, '0');
    } else {
        return index;
    }

}