
var lstTsvh = []
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
        monthsFull: [
            'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
            'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
        ],
        monthsShort: [
            'Th 1', 'Th 2', 'Th 3', 'Th 4', 'Th 5', 'Th 6',
            'Th 7', 'Th 8', 'Th 9', 'Th 10', 'Th 11', 'Th 12'
        ]
    });


    $("#btnthuchien_bdpt_chitiet").click(function () {
        loadTSPT_KH();
    })

});
function openModalChiTiet_bdpt(Meterid, tenkhachhang, loaipha) {
    $(".nav-link ").removeClass("active");
    $("a[href='#bieudophutai']").addClass("active");
    $("a[href='#chisocongto']").removeClass("active");
    $("a[href='#thongsovanhanh']").removeClass("active");
    $("a[href='#chisopmax']").removeClass("active");
    $(".tab_giamsat").removeClass("active show");
    $("#bieudophutai").addClass("active show");
    ////
    $("#lbltitle_giamsat").html("Khách hàng: " + tenkhachhang);

    //gán cho biểu đồ phụ tải
    $("#hdMeterid_bdpt").val(Meterid);
    $("#hdMeterid_pmax").val(Meterid);
    $("#hdMeterid_tsvh").val(Meterid);
    $("#hdMeterid_csct").val(Meterid);
    //
    $("#hdloaicongto_tsvh").val(loaipha);
    $("#hdloaicongto_csct").val(loaipha);
    $("#hdloaicongto_pmax").val(loaipha);
    setDatePickerValue("#txttungay_bdpt", $('#txtngay_bdpt').val());
    setDatePickerValue("#txtdenngay_bdpt", $('#txtngay_bdpt').val());
    getDanhSachCongTo_bdpt(Meterid);
}

function getDanhSachCongTo_bdpt(meterid) {
    $.ajax({
        url: "/api/khaithacdulieu_laychisocongto_dscongto",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify({ v_meterid: parseInt(meterid) }),
        success: function (result) {
            $("#cboSocongto_bdpt").html("");
            var option = "<option value='-1'>--Tất cả--</option>";
            $.each(result, function (k, v) {
                option += "<option data-time=" + retNull(v.ngaythao) + " treothao=" + v.treothao + " value=" + v.socongto + " >" + v.socongto + "</option>";
            });
            $("#cboSocongto_bdpt").html(option);
            loadTSPT_KH();

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
function loadTSPT_KH() {

    var node = JSON.parse(localStorage.getItem("node"));
    let loaithumuc = node.type;
    let danhmucid = node.id;
    if (node == null || danhmucid == undefined) {
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

    var day = compareDates(timeyyyymmdd($('#txttungay_bdpt').val()), timeyyyymmdd($('#txtdenngay_bdpt').val()));
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
    var day = compareTwoDate(timeyyyymmdd($('#txttungay_bdpt').val()), timeyyyymmdd($('#txtdenngay_bdpt').val()));
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
    ChiSoParameter.v_meterid = parseInt($("#hdMeterid_bdpt").val());
    ChiSoParameter.v_socongto = $("#cboSocongto_bdpt").val();
    ChiSoParameter.v_tungay = $("#txttungay_bdpt").val();
    ChiSoParameter.v_denngay = $("#txtdenngay_bdpt").val();
    ChiSoParameter.v_sotrang = 0;
    ChiSoParameter.v_sodong = 100000;
    ChiSoParameter.v_mataikhoan = 1;
    $.ajax({
        url: "/api/khaithacdulieu_laybieudophutai_chitiet",
        data: JSON.stringify(ChiSoParameter),
        type: "POST",
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: function (result) {
            var dongcongto = $("#hdLoaiCongTo_bdpt").val();
            lstTsvh_bdpt = [];
            lstTsvh_bdpt = result;
            $("#rdPTongGiao").prop("checked", true);
            drawData_bdpt(result, dongcongto);

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

function drawData_bdpt(data, dongcongto) {

    var activeRequestsTable = $('#tbl_chitiet_tspt').DataTable();
    activeRequestsTable.state.clear();
    activeRequestsTable.destroy();
    $("#tbl_chitiet_tspt thead").html("");
    $("#tbl_chitiet_tspt tbody").html("");
    var str = "";
    str += "<tr>";
    str += "<th>STT</th>";
    str += "<th>Thời gian</th>";
    str += "<th>P tổng giao (kW)</th>";
    str += "<th>P tổng nhận (kW)</th>";
    str += "<th>Q tổng giao (kVar)</th>";
    str += "<th>Q tổng nhận (kVar)</th>";
    //str += "<th>SL P Giao</th>";
    //str += "<th>SL P Nhận</th>";
    //str += "<th>SL Q Giao</th>";
    //str += "<th>SL Q Nhận</th>";
    str += "</tr>";
    $("#tbl_chitiet_tspt thead").append(str);

    var str1 = "";
    var stt = 0;
    $.each(data, function (k, v) {
        stt = stt + 1;
        str1 += "<tr>";
        str1 += "<td   style='text-align: center;vertical-align: middle;font-weight:bold'>" + stt + "</td>";
        str1 += "<td>" + v.starttime + "</td>";
        str1 += "<td style='text-align:center'>" + retNull(v.pgiao) + "</td>";
        str1 += "<td style='text-align:center'>" + retNull(v.pnhan) + "</td>";
        str1 += "<td style='text-align:center'>" + retNull(v.qgiao) + "</td>";
        str1 += "<td style='text-align:center'>" + retNull(v.qnhan) + "</td>";
        //str1 += "<td style='text-align:center'>" + retNull(v.sl_pgiaotong) + "</td>";
        //str1 += "<td style='text-align:center'>" + retNull(v.sl_pnhantong) + "</td>";
        //str1 += "<td style='text-align:center'>" + retNull(v.sl_qgiaotong)+ "</td>";
        //str1 += "<td style='text-align:center'>" + retNull(v.sl_qnhantong) + "</td>";

        str1 += "</tr>";

    });
    $("#tbl_chitiet_tspt tbody").html(str1);
    getStyleTableChiTiet_bdpt();
    setTimeout(function () {
        drawChart_CT1_bdpt(data);
    }, 100);
}

function getStyleTableChiTiet_bdpt() {
    $('#tbl_chitiet_tspt').DataTable({
        dom: 'Bfrtip',
        buttons: [
            'excelHtml5'
        ],
        "order": [[0, "asc"]],
        'scrollCollapse': true,
        'paging': true,
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
            $("#tbl_chitiet_tspt").wrap("<div style='overflow:auto; width:100%;position:relative;' id='chitietct'></div>");
        },

    }).columns.adjust().draw();


};

// Thực hiện đồng bộ sau khi window được thay đổi kích thước

function drawChart_CT1_bdpt(data) {
    var date_ar = [];
    var sl_ar = [];
    var background_color = [];
    var background_color_Nhan = [];
    var donvi_doluong = "";
    var data1 = data.reverse();
    $.each(data1, function (k, v) {
        if (!date_ar.includes(v.starttime.substring(11, 5))) {
            date_ar.push(v.starttime.substr(11, 5));
        }
    });
    if (data.length > 0) {
        for (var i = 0; i < date_ar.length; i++) {
            var sl_tong_pgiao = 0;
            var sl_tong_pnhan = 0;
            var sl_tong_qgiao = 0;
            var sl_tong_qnhan = 0;
            var sl_pgiao = 0;
            var sl_pnhan = 0;
            var sl_qgiao = 0;
            var sl_qnhan = 0;
            for (var j = 0; j < data.length; j++) {
                if (date_ar[i] == data[j].starttime.substr(11, 5)) {
                    var slpgiao = parseFloat(data[j].pgiao);
                    var slpnhan = parseFloat(data[j].pnhan);
                    var slqgiao = parseFloat(data[j].qgiao);
                    var slqnhan = parseFloat(data[j].qnhan);
                    var sl_pgiaotong = parseFloat(data[j].sl_pgiaotong);
                    var sl_pnhantong = parseFloat(data[j].sl_pnhantong);
                    var sl_qgiaotong = parseFloat(data[j].sl_qgiaotong);
                    var sl_qnhantong = parseFloat(data[j].sl_qnhantong);
                    sl_tong_pgiao += slpgiao;
                    sl_tong_pnhan += slpnhan;
                    sl_tong_qgiao += slqgiao;
                    sl_tong_qnhan += slqnhan;
                    sl_pgiao += sl_pgiaotong;
                    sl_pnhan += sl_pnhantong;
                    sl_qgiao += sl_qgiaotong;
                    sl_qnhan += sl_qnhantong;

                }
                background_color.push(GetColorByTimeDl(data[j].starttime));
            }
            if ($("[name=charttype_bdpt]:checked").val() == "PTongGiao") {
                sl_ar.push((sl_tong_pgiao).toFixed(3));
                donvi_doluong = "P tổng giao (kW)";
            }
            else if ($("[name=charttype_bdpt]:checked").val() == "PTongNhan") {
                sl_ar.push((sl_tong_pnhan).toFixed(3));
                donvi_doluong = "P tổng nhận (kW)";
            }
            else if ($("[name=charttype_bdpt]:checked").val() == "QTongGiao") {
                sl_ar.push((sl_tong_qgiao).toFixed(3));
                donvi_doluong = "Q tổng giao (kVAR)";
            }
            else if ($("[name=charttype_bdpt]:checked").val() == "QTongNhan") {
                sl_ar.push((sl_tong_qnhan).toFixed(3));
                donvi_doluong = "Q tổng nhận (kVAR)";
            }
            else if ($("[name=charttype_bdpt]:checked").val() == "SLPGiao") {
                sl_ar.push((sl_pgiao).toFixed(3));
                donvi_doluong = "SL P Giao";
            }
            else if ($("[name=charttype_bdpt]:checked").val() == "SLPNhan") {
                sl_ar.push((sl_pnhan).toFixed(3));
                donvi_doluong = "SL P Nhận";
            }
            else if ($("[name=charttype_bdpt]:checked").val() == "SLQGiao") {
                sl_ar.push((sl_qgiao).toFixed(3));
                donvi_doluong = "SL Q Giao";
            }
            else if ($("[name=charttype_bdpt]:checked").val() == "SLQNhan") {
                sl_ar.push((sl_qnhan).toFixed(3));
                donvi_doluong = "SL Q Nhận";
            }
        }
    }
    $('#modal_chart_bdpt').html('')
    $('#modal_chart_bdpt').html('<canvas id="canvas_bdpt" style="height:300px"></canvas>')
    var lineChart_3 = document.getElementById('canvas_bdpt').getContext('2d');

    //generate gradient
    const lineChart_3gradientStroke1 = lineChart_3.createLinearGradient(500, 0, 100, 0);
    lineChart_3gradientStroke1.addColorStop(0, "rgba(91, 207, 197, 1)");
    lineChart_3gradientStroke1.addColorStop(1, "rgba(91, 207, 197, 0.5)");

    const lineChart_3gradientStroke2 = lineChart_3.createLinearGradient(500, 0, 100, 0);
    lineChart_3gradientStroke2.addColorStop(0, "rgba(255, 92, 0, 1)");
    lineChart_3gradientStroke2.addColorStop(1, "rgba(255, 92, 0, 1)");

    // Chart.controllers.line = Chart.controllers.line.extend({
    //     draw: function () {
    //         draw.apply(this, arguments);
    //         let nk = this.chart.chart.ctx;
    //         let _stroke = nk.stroke;
    //         nk.stroke = function () {
    //             nk.save();
    //             nk.shadowColor = 'rgba(0, 0, 0, 0)';
    //             nk.shadowBlur = 10;
    //             nk.shadowOffsetX = 0;
    //             nk.shadowOffsetY = 10;
    //             _stroke.apply(this, arguments)
    //             nk.restore();
    //         }
    //     }
    // });

    new Chart(lineChart_3, {
        type: 'bar',
        data: {
            label: date_ar,
            datasets: [{
                label: donvi_doluong,
                data: sl_ar,
                type: 'bar',
                backgroundColor: background_color,
                order: 1
            }
            ],
            labels: date_ar
        },
        options: {
            legend: false,
            maintainAspectRatio: false,
            pan: {
                enabled: true,
                mode: "x",
                speed: 10,
                threshold: 10
            },
            zoom: {
                enabled: true,
                drag: false,
                mode: "xy",
                speed: 0.01,
                // sensitivity: 0.1,
                limits: {
                    max: 10,
                    min: 0.5
                }
            },
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
// lấy màu sắc theo time
function GetColorByTimeDl(time) {
    //1. Giờ bình thường: màu cam
    /*  a) Gồm các ngày từ thứ Hai đến thứ Bảy:
        - Từ 04 giờ 00 đến 9 giờ 30 (05 giờ 30 phút);
        - Từ 11 giờ 30 đến 17 giờ 00 (05 giờ 30 phút);
        - Từ 20 giờ 00 đến 22 giờ 00 (02 giờ).
        b) Ngày Chủ nhật:
        Từ 04 giờ 00 đến 22 giờ 00 (18 giờ).
    */
    // 2. Giờ cao điểm: Màu đỏ
    /*
         a) Gồm các ngày từ thứ Hai đến thứ Bảy:
         - Từ 09 giờ 30 đến 11 giờ 30 (02 giờ);
         - Từ 17 giờ 00 đến 20 giờ 00 (03 giờ).
         b) Ngày Chủ nhật: không có giờ cao điểm.
  
     */
    //3. Giờ thấp điểm: Màu xanh
    //Tất cả các ngày trong tuần: từ 22 giờ 00 đến 04 giờ 00(06 giờ) sáng ngày hôm sau

    var datetime = moment(time, 'DD/MM/YYYY HH:mm');

    var day = datetime.day();
    var timeTemp = time.split(' ')[1].split(':');
    var minuteCheck = (parseInt(timeTemp[0]) * 60) + parseInt(timeTemp[1]);
    // Khung giờ thấp điểm  - Tất cả các ngày trong tuần
    var thapdiem1Tu = 22 * 60;
    var thapdiem1Den = 24 * 60;
    var thapdiem2Tu = 0;
    var thapdiem2Den = 4 * 60;
    if ((minuteCheck >= thapdiem1Tu && minuteCheck <= thapdiem1Den) || (minuteCheck >= thapdiem2Tu && minuteCheck < thapdiem2Den)) {
        return "#8bbc21";//màu xanh
    }
    else {
        // Ngày chủ nhật
        if (day == 0) {
            // Giờ bình thường
            return "#f58220";
        } else {
            var binhthuong1Tu = 4 * 60;
            var binhthuong1Den = (9 * 60) + 30;

            var binhthuong2Tu = (11 * 60) + 30;
            var binhthuong2Den = (17 * 60);

            var binhthuong3Tu = (20 * 60);
            var binhthuong3Den = (22 * 60);

            if ((minuteCheck >= binhthuong1Tu && minuteCheck < binhthuong1Den) || (minuteCheck >= binhthuong2Tu && minuteCheck < binhthuong2Den) || (minuteCheck >= binhthuong3Tu && minuteCheck < binhthuong3Den)) {
                return "#f58220";//màu cam
            } else {
                return "#ff0000";//màu đỏ
            }
        }
    }
}
function GetColorByTimeNhan(time) {
    //1. Giờ bình thường: màu cam
    /*  a) Gồm các ngày từ thứ Hai đến thứ Bảy:
        - Từ 04 giờ 00 đến 9 giờ 30 (05 giờ 30 phút);
        - Từ 11 giờ 30 đến 17 giờ 00 (05 giờ 30 phút);
        - Từ 20 giờ 00 đến 22 giờ 00 (02 giờ).
        b) Ngày Chủ nhật:
        Từ 04 giờ 00 đến 22 giờ 00 (18 giờ).
    */
    // 2. Giờ cao điểm: Màu đỏ
    /*
         a) Gồm các ngày từ thứ Hai đến thứ Bảy:
         - Từ 09 giờ 30 đến 11 giờ 30 (02 giờ);
         - Từ 17 giờ 00 đến 20 giờ 00 (03 giờ).
         b) Ngày Chủ nhật: không có giờ cao điểm.
  
     */
    //3. Giờ thấp điểm: Màu xanh
    //Tất cả các ngày trong tuần: từ 22 giờ 00 đến 04 giờ 00(06 giờ) sáng ngày hôm sau

    let datetime = moment(time, 'DD/MM/YYYY HH:mm');

    var day = datetime.day();
    var timeTemp = time.split(' ')[1].split(':');
    var minuteCheck = (parseInt(timeTemp[0]) * 60) + parseInt(timeTemp[1]);
    // Khung giờ thấp điểm  - Tất cả các ngày trong tuần
    var thapdiem1Tu = 22 * 60;
    var thapdiem1Den = 24 * 60;
    var thapdiem2Tu = 0;
    var thapdiem2Den = 4 * 60;
    if ((minuteCheck >= thapdiem1Tu && minuteCheck <= thapdiem1Den) || (minuteCheck >= thapdiem2Tu && minuteCheck < thapdiem2Den)) {
        return "#597d0b";//màu xanh
    }
    else {
        // Ngày chủ nhật
        if (day == 0) {
            // Giờ bình thường
            return "#e86b00";//màu cam
        } else {
            var binhthuong1Tu = 4 * 60;
            var binhthuong1Den = (9 * 60) + 30;

            var binhthuong2Tu = (11 * 60) + 30;
            var binhthuong2Den = (17 * 60);

            var binhthuong3Tu = (20 * 60);
            var binhthuong3Den = (22 * 60);

            if ((minuteCheck >= binhthuong1Tu && minuteCheck < binhthuong1Den) || (minuteCheck >= binhthuong2Tu && minuteCheck < binhthuong2Den) || (minuteCheck >= binhthuong3Tu && minuteCheck < binhthuong3Den)) {
                return "#d64a09";//màu cam
            } else {
                return "#bf1212";//màu đỏ
            }
        }
    }
}
function chartTypeChange_bdpt() {
    setTimeout(function () {
        drawChart_CT1_bdpt(lstTsvh_bdpt.reverse());
    }, 100);
}