
var lstTsvh = [];
var TI_TSVH;
var TU_TSVH;
var HSN_TSVH;
$(document).ready(function () {
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
        monthsFull: [
            'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
            'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
        ],
        monthsShort: [
            'Th 1', 'Th 2', 'Th 3', 'Th 4', 'Th 5', 'Th 6',
            'Th 7', 'Th 8', 'Th 9', 'Th 10', 'Th 11', 'Th 12'
        ]
    });


    $("#btnthuchien_ct_tsvh").click(function () {
        loadTSVH_ChiTiet()
    });


});

function f_XemChiTiet_tsvh(Meterid, tenkhachhang, loaipha, tu, ti, hsn) {
    $(".nav-link ").removeClass("active");
    $("a[href='#thongsovanhanh']").addClass("active");
    $("a[href='#chisocongto']").removeClass("active");
    $("a[href='#bieudophutai']").removeClass("active");
    $("a[href='#chisopmax']").removeClass("active");
    $(".tab_giamsat").removeClass("active show");
    $("#thongsovanhanh").addClass("active show");
    ////
    let title = "Khách hàng: " + tenkhachhang;

    if (tu || TU_TSVH) title += " - TU: " + (tu || TU_TSVH);
    if (ti || TI_TSVH) title += " - TI: " + (ti || TI_TSVH);
    if (hsn || HSN_TSVH) title += " - HSN: " + (hsn || HSN_TSVH);

    $("#lbltitle_giamsat").html(title);
    $("#hdMeterid_tsvh").val(Meterid);
    $("#hdMeterid_csct").val(Meterid);
    $("#hdMeterid_bdpt").val(Meterid);
    $("#hdMeterid_pmax").val(Meterid);
    $("#hdloaicongto_tsvh").val(loaipha);
    setDatePickerValue("#txttungay_tsvh", $('#txtngay_tsvh').val());
    setDatePickerValue("#txtdenngay_tsvh", $('#txtngay_tsvh').val());

    $("#rdU").prop("checked", true);
    LoadSoCongTo_TSVH(Meterid);
}

function LoadSoCongTo_TSVH(meterid) {
    $.ajax({
        url: "/api/khaithacdulieu_laychisocongto_dscongto",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify({ v_meterid: parseInt(meterid) }),
        success: function (result) {
            $("#slsocongto_ct_tsvh").html("");
            var option = "<option value='-1'>--Tất cả--</option>";
            $.each(result, function (k, v) {
                option += "<option data-time=" + retNull(v.ngaythao) + " treothao=" + v.treothao + " value=" + v.socongto + " >" + v.socongto + "</option>";
            });
            $("#slsocongto_ct_tsvh").html(option);
            loadTSVH_ChiTiet();


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
        }
    });
}

function loadTSVH_ChiTiet() {

    var node = JSON.parse(localStorage.getItem("node"));
    let loaithumuc = node.type;
    let danhmucid = node.id;
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

    if (loaithumuc < 5) {
        toastr.error("Vui lòng chọn trạm", "Thông báo", {
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
    //kiểm tra từ ngày đến ngày
    var day = compareDates(timeyyyymmdd($('#txttungay_tsvh').val()), timeyyyymmdd($('#txtdenngay_tsvh').val()))
    if (day > 31) {
        toastr.error("Vui lòng chọn tối đa 31 ngày để xem dữ liệu", "Thông báo", {
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
    var day = compareTwoDate(timeyyyymmdd($('#txttungay_tsvh').val()), timeyyyymmdd($('#txtdenngay_tsvh').val()))
    if (day == 1) {
        toastr.error("Từ ngày nhỏ hơn đến ngày", "Thông báo", {
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
    var ChiSoParameter = new Object();
    ChiSoParameter.v_meterid = parseInt($("#hdMeterid_tsvh").val());
    ChiSoParameter.v_socongto = $("#slsocongto_ct_tsvh").val();
    ChiSoParameter.v_tungay = $("#txttungay_tsvh").val();
    ChiSoParameter.v_denngay = $("#txtdenngay_tsvh").val();
    ChiSoParameter.v_sotrang = 0;
    ChiSoParameter.v_sodong = 100000;
    ChiSoParameter.v_mataikhoan = 1;
    $.ajax({
        url: "/api/khaithacdulieu_laythongsovanhanh_chitiet",
        data: JSON.stringify(ChiSoParameter),
        type: "POST",
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: function (data) {
            lstTsvh = [];
            lstTsvh = data;
            const item = (data && data.length > 0) ? data[0] : {};

            TU_TSVH = item.tu ?? null;
            TI_TSVH = item.ti ?? null;
            HSN_TSVH = item.hsn ?? null;
            drawData_ChiTiet_TSVH(data);

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
        }
    })
}

function drawData_ChiTiet_TSVH(data) {
    var activeRequestsTable = $('#tbl_xemchitiet_tsvh').DataTable()
    activeRequestsTable.state.clear()
    activeRequestsTable.destroy()
    $("#tbl_xemchitiet_tsvh tbody").empty()
    $("#tbl_xemchitiet_tsvh thead").empty()

    var str = ""
    if ($("#hdloaicongto_tsvh").val() == "3") {
        str += "<tr>"
        str += "<th>STT</th>"
        str += "<th>Thời điểm</th>"
        str += "<th>Pha</th>"
        str += "<th>U (V)</th>"
        str += "<th>I (A)</th>"
        str += "<th>Góc φ</th>"
        str += "<th>Cos φ</th>"
        str += "<th>F (Hz)</th>"
        str += "<th>S Giao (kVA)</th>"
        str += "<th>S Nhận (kVA)</th>"
        str += "<th>P Giao (kW)</th>"
        str += "<th>P Nhận (kW)</th>"
        str += "<th>Q Giao (kVar)</th>"
        str += "<th>Q Nhận (kVar)</th>"
        str += "</tr>"
    } else {
        str += "<tr>"
        str += "<th>STT</th>"
        str += "<th>Số công tơ</th>"
        str += "<th>Loại công tơ</th>"
        str += "<th>Thời điểm</th>"
        str += "<th>U (V)</th>"
        str += "<th>I (A)</th>"
        str += "<th>Cos φ</th>"
        str += "<th>P Giao Tổng (kW)</th>"
        str += "<th>P Nhận Tổng (kW)</th>"
        str += "<th>Q Giao Tổng (kVar)</th>"
        str += "<th>Q Nhận Tổng (kVar)</th>"

        str += "</tr>"
    }
    $("#tbl_xemchitiet_tsvh thead").append(str)

    var str1 = ""
    $.each(data, function (k, v) {
        var thoigian = "";
        thoigian = "<span class='text-xanh'> HT:" + v.time + " </span > <br /> <span class='text-do'> CT: " + v.timemeter + "</span>";
        if ($("#hdloaicongto_tsvh").val() == "3") {
            str1 += "<tr>"
            str1 += "<td  style='text-align: center;vertical-align: middle'  rowspan='3'>" + v.stt + "</td>"
            str1 += "<td  style='text-align: center;vertical-align: middle;white-space: nowrap;' rowspan='3'>"
            str1 += thoigian
            str1 += "</td >"

            str1 += "<td class='text-center text-do'>Pha A</td>"
            str1 += "<td class='text-right text-do'>" + retNull(v.ua) + "</td>"
            str1 += "<td class='text-right text-do'>" + retNull(v.ia) + "</td>"
            str1 += "<td class='text-right text-do'>" + retNull(v.anglea) + "</td>"
            str1 += "<td class='text-right text-do'>" + retNull(v.cosa) + "</td>"
            str1 += "<td class='text-right text-do'  rowspan='3' style='text-align: center;vertical-align: middle'>" + retNull(v.frega) + "</td>"
            str1 += `<td class="text-right text-do">${retNull(v.s_giaoa)}</td>
                         <td class="text-right text-do">${retNull(v.s_nhana)}</td>`
            str1 += "<td class='text-right text-do'>" + retNull(v.pa_giao) + "</td>"
            str1 += "<td class='text-right text-do'>" + retNull(v.pa_nhan) + "</td>"
            str1 += "<td class='text-right text-do'>" + retNull(v.qa_giao) + "</td>"
            str1 += "<td class='text-right text-do'>" + retNull(v.qa_nhan) + "</td>"
            str1 += "</tr >"
            str1 += "<tr>"
            str1 += "<td  style='display: none'></td>"
            str1 += "<td  style='display: none'></td>"
            str1 += "<td class='text-center text-xanh'>Pha B </td>"
            str1 += "<td class='text-right text-xanh'>" + retNull(v.ub) + "</td>"
            str1 += "<td class='text-right text-xanh'>" + retNull(v.ib) + "</td>"
            str1 += "<td class='text-right text-xanh'>" + retNull(v.angleb) + "</td>"
            str1 += "<td class='text-right text-xanh'>" + retNull(v.cosb) + "</td>"
            str1 += "<td class='text-right text-xanh' style='display: none'></td>"
            str1 += `<td class="text-right text-xanh">${retNull(v.s_giaob)}</td>
                         <td class="text-right text-xanh">${retNull(v.s_nhanb)}</td>`
            str1 += "<td class='text-right text-xanh'>" + retNull(v.pb_giao) + "</td>"
            str1 += "<td class='text-right text-xanh'>" + retNull(v.pb_nhan) + "</td>"
            str1 += "<td class='text-right text-xanh'>" + retNull(v.qb_giao) + "</td>"
            str1 += "<td class='text-right text-xanh'>" + retNull(v.qb_nhan) + "</td>"
            str1 += "</tr >"
            str1 += "<tr>"
            str1 += "<td  style='display: none'></td>"
            str1 += "<td  style='display: none'></td>"
            str1 += "<td class='text-center text-cam'>Pha C</td>"
            str1 += "<td class='text-right text-cam'>" + retNull(v.uc) + "</td>"
            str1 += "<td class='text-right text-cam'>" + retNull(v.ic) + "</td>"
            str1 += "<td class='text-right text-cam'>" + retNull(v.anglec) + "</td>"
            str1 += "<td class='text-right text-cam'>" + retNull(v.cosc) + "</td>"
            str1 += "<td class='text-right text-cam' style='display: none'></td>"
            str1 += `<td class="text-right text-cam">${retNull(v.s_giaoc)}</td>
                         <td class="text-right text-cam">${retNull(v.s_nhanc)}</td>`
            str1 += "<td class='text-right text-cam'>" + retNull(v.pc_giao) + "</td>"
            str1 += "<td class='text-right text-cam'>" + retNull(v.pc_nhan) + "</td>"
            str1 += "<td class='text-right text-cam'>" + retNull(v.qc_giao) + "</td>"
            str1 += "<td class='text-right text-cam'>" + retNull(v.qc_nhan) + "</td>"
            str1 += "</tr>"
        } else {
            str1 += "<tr>"
            str1 += "<td class='text-center'>" + v.stt + "</td>"
            str1 += "<td class='text-center fw-bold'>" + thoigian + "</td>"
            str1 += "<td class='text-center'>" + v.socongto + "</td>"
            str1 += "<td class='text-left'>" + retNull(v.loaicongto) + "</td>"

            str1 += "<td class='text-right'>" + retNull(v.ua) + "</td>"
            str1 += "<td class='text-right'>" + retNull(v.ia) + "</td>"
            str1 += "<td class='text-right'>" + retNull(v.cosa) + "</td>"
            str1 += "<td class='text-right'>" + retNull(v.p_giaotong) + "</td>"
            str1 += "<td class='text-right'>" + retNull(v.p_nhantong) + "</td>"
            str1 += "<td class='text-right'>" + retNull(v.q_giaotong) + "</td>"
            str1 += "<td class='text-right'>" + retNull(v.q_nhantong) + "</td>"
            str1 += "</tr >"
        }
    })
    $("#tbl_xemchitiet_tsvh tbody").html(str1)
    if ($("#hdloaicongto_tsvh").val() == "3") {
        getStyleTable_TSVH3_ChiTiet()
    } else {
        getStyleTable_TSVH1_ChiTiet()
    }

    setTimeout(function () {
        if ($("#hdloaicongto_tsvh").val() == "1") {
            drawDataBieuDo(data);
        } else {
            drawDataBieuDo3Pha(data)
        }

    }, 100)

}
function getStyleTable_TSVH3_ChiTiet() {
    const tableSelector = '#tbl_xemchitiet_tsvh';
    $(tableSelector).removeClass("table-striped table-hover");
    $(tableSelector).removeAttr('width').DataTable({
        dom: 'Bfrtip',
        buttons: [
            'excelHtml5'
        ],
        'pageLength': 18,
        'paging': true,
        'lengthChange': false,
        'searching': true,
        order: [[0, 'asc']],
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
        },
        "initComplete": function (settings, json) {
            $("#tbl_xemchitiet_tsvh").wrap("<div style='overflow:auto; width:100%;position:relative;' id='chitietsvh'></div>");
        },
    }).columns.adjust().draw();
};

function getStyleTable_TSVH1_ChiTiet() {

    $('#tbl_xemchitiet_tsvh').removeAttr('width').DataTable({
        dom: 'Bfrtip',
        buttons: [
            'excelHtml5'
        ],
        "order": [[1, "asc"]],
        'pageLength': 10,
        'paging': true,
        "pagingType": "full_numbers",
        'lengthChange': false,
        'searching': true,
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
        },
        "initComplete": function (settings, json) {
            $("#tbl_xemchitiet_tsvh").wrap("<div style='overflow:auto; width:100%;position:relative;' id='chitietsvh'></div>");
        },
    }).columns.adjust().draw();


};


function drawDataBieuDo(data) {
    let draw = Chart.controllers.line.__super__.draw;

    var date_time = []
    var data_chart = []
    var donvi_doluong = ""

    var data1 = data.reverse();

    $.each(data1, function (k, v) {
        date_time.push(v.time)
        if ($("[name=charttype]:checked").val() == "U") {
            data_chart.push(v.ua)
            donvi_doluong = "Điện áp (V)"

        }
        else if ($("[name=charttype]:checked").val() == "I") {
            data_chart.push(v.ia)
            donvi_doluong = "Dòng điện (A)"

        }
        else if ($("[name=charttype]:checked").val() == "COS") {
            data_chart.push(v.cosa)
            donvi_doluong = "Hệ số cos"

        }
        else if ($("[name=charttype]:checked").val() == "P") {
            data_chart.push(v.pgiaotong)
            donvi_doluong = "P (kWH)"

        }

    })
    $('#chart_container').html('')
    $('#chart_container').html('<canvas id="canvas_tsvh" style="height:300px"></canvas>')
    var lineChart_3 = document.getElementById('canvas_tsvh').getContext('2d');

    //generate gradient
    const lineChart_3gradientStroke1 = lineChart_3.createLinearGradient(500, 0, 100, 0);
    lineChart_3gradientStroke1.addColorStop(0, "rgba(91, 207, 197, 1)");
    lineChart_3gradientStroke1.addColorStop(1, "rgba(91, 207, 197, 0.5)");

    const lineChart_3gradientStroke2 = lineChart_3.createLinearGradient(500, 0, 100, 0);
    lineChart_3gradientStroke2.addColorStop(0, "rgba(255, 92, 0, 1)");
    lineChart_3gradientStroke2.addColorStop(1, "rgba(255, 92, 0, 1)");



    new Chart(lineChart_3, {
        type: 'line',
        data: {
            label: date_time,
            datasets: [{
                label: donvi_doluong,
                data: data_chart,
                borderWidth: 1,
                pointRadius: 1,
                type: 'line',
                fill: false,
                borderColor: '#0275d8',
            }
            ],
            labels: date_time
        },
        options: {
            legend: false,
            maintainAspectRatio: false,
            scales: {
                xAxes: [{
                    display: true,
                    scaleLabel: {
                        display: true,
                    },
                    ticks: { beginAtZero: true },
                }],
                yAxes: [{
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: donvi_doluong
                    },
                    ticks: { beginAtZero: true },
                }]
            }//,
        }
    });


}


function drawDataBieuDo3Pha(data) {
    var date_time = []
    var dataPhaA = []
    var dataPhaB = []
    var dataPhaC = []
    var donvi_doluong = ""
    var data1 = data.reverse()
    $.each(data1, function (k, v) {
        date_time.push(v.time)
        if ($("[name=charttype]:checked").val() == "U") {
            dataPhaA.push(v.ua)
            dataPhaB.push(v.ub)
            dataPhaC.push(v.uc)
            donvi_doluong = "Điện áp (V)"

        }
        else if ($("[name=charttype]:checked").val() == "I") {
            dataPhaA.push(v.ia)
            dataPhaB.push(v.ib)
            dataPhaC.push(v.ic)
            donvi_doluong = "Dòng điện (A)"

        }
        else if ($("[name=charttype]:checked").val() == "COS") {
            dataPhaA.push(v.cosa)
            dataPhaB.push(v.cosb)
            dataPhaC.push(v.cosc)
            donvi_doluong = "Hệ số cos"

        }
        else if ($("[name=charttype]:checked").val() == "PGiao") {
            dataPhaA.push(v.pa_giao)
            dataPhaB.push(v.pb_giao)
            dataPhaC.push(v.pc_giao)
            donvi_doluong = "P Giao(kW)"

        }
        else if ($("[name=charttype]:checked").val() == "PNhan") {
            dataPhaA.push(v.pa_nhan)
            dataPhaB.push(v.pb_nhan)
            dataPhaC.push(v.pc_nhan)
            donvi_doluong = "P Nhận(kW)"

        }
        else if ($("[name=charttype]:checked").val() == "QGiao") {
            dataPhaA.push(v.qa_giao)
            dataPhaB.push(v.qb_giao)
            dataPhaC.push(v.qc_giao)
            donvi_doluong = "Q Giao(kW)"

        }
        else if ($("[name=charttype]:checked").val() == "QNhan") {
            dataPhaA.push(v.qa_nhan)
            dataPhaB.push(v.qb_nhan)
            dataPhaC.push(v.qc_nhan)
            donvi_doluong = "Q Nhận(kW)"

        }

    })

    $('#chart_container').html('')
    $('#chart_container').html('<canvas id="canvas_tsvh" style="height:300px"></canvas>')
    var lineChart_3 = document.getElementById('canvas_tsvh').getContext('2d');

    //generate gradient
    const lineChart_3gradientStroke1 = lineChart_3.createLinearGradient(500, 0, 100, 0);
    lineChart_3gradientStroke1.addColorStop(0, "rgba(91, 207, 197, 1)");
    lineChart_3gradientStroke1.addColorStop(1, "rgba(91, 207, 197, 0.5)");

    const lineChart_3gradientStroke2 = lineChart_3.createLinearGradient(500, 0, 100, 0);
    lineChart_3gradientStroke2.addColorStop(0, "rgba(255, 92, 0, 1)");
    lineChart_3gradientStroke2.addColorStop(1, "rgba(255, 92, 0, 1)");
    new Chart(lineChart_3, {
        type: 'line',
        data: {
            label: date_time,
            datasets: [
                {
                    label: 'Pha A',
                    data: dataPhaA,
                    fill: false,
                    borderWidth: 1,
                    pointRadius: 1,
                    borderColor: '#bf1e2e'
                },
                {
                    label: 'Pha B',
                    data: dataPhaB,
                    fill: false,
                    borderWidth: 1,
                    pointRadius: 1,
                    borderColor: '#197b30'
                },
                {
                    label: 'Pha C',
                    data: dataPhaC,
                    fill: false,
                    borderWidth: 1,
                    pointRadius: 1,
                    borderColor: '#f58220'
                }
            ],
            labels: date_time
        },
        options: {
            // responsive: true,
            legend: false,
            maintainAspectRatio: false,
            scales: {
                xAxes: [{
                    display: true,
                    scaleLabel: {
                        display: true,
                    },
                    ticks: { beginAtZero: true },
                }],
                yAxes: [{
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: donvi_doluong
                    },
                    ticks: { beginAtZero: true },
                }]
            }//,
        }
    });

}


function chartTypeChange() {
    setTimeout(function () {
        if ($("#slloaicongto_tsvh").val() == "1") {
            drawDataBieuDo(lstTsvh.reverse())
        } else {
            drawDataBieuDo3Pha(lstTsvh.reverse())
        }

    }, 100)
}