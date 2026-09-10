var socongtochitiet = "";
var dongcongtochitiet = "";
var lstTsvh = [];
$(document).ready(function () {
    if (!localStorage.getItem("us")) {
        window.location.href = "../login";
    }
    $('.datepicker-default').pickadate({
        monthPrev: '<<',
        monthNext: '>>',
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
    $('#txtngay').val(getDateTimeCurrent());

    // loadGio();
    loadDuLieuSongHai_KH();
    $('#txtngay').on('changeDate', function () {
        var date = $('#txtngay').datepicker('getFormattedDate');
        $("#txttungay").datepicker("setDate", date);
        $("#txtdenngay").datepicker("setDate", date);
        loadDuLieuSongHai_KH();
    });
    // $("#slgio").on('change', function () {

    //     loadDuLieuSongHai();
    // });
    $("#btnthuchien_sh").click(function () {
        loadDuLieuSongHai_KH();
    });



});
function handleSidebarNode() {
    loadDuLieuSongHai_KH();
}

function cal_THD(data) {
    var V1
    data[0] == null || data[0] == 0 ? V1 = 1 : V1 = data[0];

    var sum = 0;

    for (var i = 1; i < data.length; i++) {
        sum += Math.pow(data[i] / V1, 2);
    }

    var THD = Math.sqrt(sum) * 100;
    //console.log('THD: ' + THD.toFixed(2) + '%');
    return THD.toFixed(2);
}

function cal_TDD(data) {
    var I1 = data[0]; // Fundamental frequency RMS value
    var fullLoadCurrent = 15; // Example full load current
    var sum = 0;

    for (var i = 1; i < data.length; i++) {
        sum += Math.pow(data[i] / fullLoadCurrent, 2);
    }

    var TDD = Math.sqrt(sum) * 100;
    return TDD;
}

function cal_IHD(data) {
    var I1 = data[0]; // Fundamental frequency RMS value
    var ihdResults = [];

    for (var i = 1; i < data.length; i++) {
        var IHD = (data[i] / I1) * 100;
        ihdResults.push('Harmonic ' + (i + 1) + ': ' + IHD.toFixed(2) + '%');
    }

    return ihdResults;
}
function getDateTimeCurrent() {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    const day = currentDate.getDate();
    return `${day.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}/${year} `;
}

function loadGio() {
    var data = getListTime();
    $("#cbogio_csct").empty();
    $("#cbogio_csct").append(`<option value="-1">Tất cả</option>`);
    $.each(data, function (index, item) {
        $("#slgio").append(`<option value="${item.value}">${item.value}</option>`);
        $("#cbogio").append(`<option value="${item.value}">${item.value}</option>`);
    })
}
//load chỉ số
function loadDuLieuSongHai() {

    var loaidanhmuc = localStorage.getItem("type_tb");
    var danhmucid = localStorage.getItem("id");
    var ngay = $("#txtngay").val();
    // var gio = $("#slgio").val();
    if (danhmucid == null) {
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
    if (loaidanhmuc < 5) {
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

    var ChiSoParameter = new Object();
    ChiSoParameter.DanhmucId = danhmucid;
    // ChiSoParameter.LocDuLieu = locdulieu;
    ChiSoParameter.Ngay = ngay;
    // ChiSoParameter.Gio = gio;
    ChiSoParameter.SoTrang = 0;
    ChiSoParameter.SoDong = 100000;

    $.ajax({
        url: "/api/khaithacdulieu_laydulieusonghai",
        data: JSON.stringify(ChiSoParameter),
        type: "POST",
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: function (result) {
            var data = JSON.parse(result).data;
            drawData(data);
        },
        error: function (errormessage) {
            alert(errormessage.responseText);
            // window.location.href = "/Login/Logout";
        }
    });
}

function drawData(data) {
    // console.log(data)

}
function retNull(number) {

    if (number == null || number == undefined || (number == "")) {
        if (number == '0.0' || number == '0')
            return number
        return '-'
    }
    return number
}
function getStyleTable() {
    $('#example1').DataTable({
        dom: '<"top">Bfirt<"bottom"lp><"clear">',
        //dom: 'Bfrtip',
        buttons: [
            'excelHtml5'
        ],
        //rowGroup: {
        //    dataSrc: 0
        //},
        //"columnDefs": [
        //    { "visible": false, "targets": 0 }
        //],
        "order": [[0, "asc"]],
        'scrollX': true,
        'scrollCollapse': true,
        'pageLength': 100,
        "lengthMenu": [20, 50, 100, 200, "All"],
        'searching': true,
        'ordering': false,
        'info': true,
        'autoWidth': false,
        "language": {
            "sProcessing": "Đang xử lý...",
            "sLengthMenu": "Xem _MENU_ mục",
            "sZeroRecords": "Không tìm thấy dòng nào phù hợp",
            "sInfo": "Đang xem _START_ đến _END_ trong tổng số _TOTAL_ mục",
            "sInfoEmpty": "Đang xem 0 đến 0 trong tổng số 0 mục",
            "sInfoFiltered": "(được lọc từ _MAX_ mục)",
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
    })
};

//get Songhai khách hàng
function loadDuLieuSongHai_KH() {

    var node = JSON.parse(localStorage.getItem("node"));
    if (node == null || node == undefined) {
        toastr.error("Vui lòng chọn điểm đo", "Thông báo", {
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
    var id = node.id;
    var type = node.type;
    var sct = node.socongto;
    var tungay = $("#txtngay").val().trim();
    if (id == null) {
        toastr.error("Vui lòng chọn điểm đo", "Thông báo", {
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
    if (type != 9) {
        toastr.error("Vui lòng chọn điểm đo", "Thông báo", {
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
    var DulieuSongHai = new Object();
    DulieuSongHai.MeterId = id;
    DulieuSongHai.SoCongTo = sct;
    DulieuSongHai.TuNgay = tungay;
    DulieuSongHai.SoTrang = 0;
    DulieuSongHai.SoDong = 100000;
    DulieuSongHai.gio = "";
    DulieuSongHai.mataikhoan = 1;
    //callLoad();
    $.ajax({
        url: "/api/khaithacdulieu_laydulieusonghai",
        data: JSON.stringify(DulieuSongHai),
        type: "POST",
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: function (result) {
            lstSongHai = result;
            if (lstSongHai.length == 0) {
                toastr.error("Không có dữ liệu", "Thông báo", {
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
            } else {
                drawData_bdsh(lstSongHai);
            }


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

function drawData_bdsh(data) {
    // console.log(data)
    var groupedArray = groupByTime(data);
    //console.log(groupedArray);
    var ar_THD_a = [];
    var ar_THD_b = [];
    var ar_THD_c = [];
    var ar_THD_ia = [];
    var ar_THD_ib = [];
    var ar_THD_ic = [];
    var ar_THD_time = [];
    $.each(groupedArray, function (k, v) {
        // console.log(v[0].thoidiem)
        var ar_ua = [];
        var ar_ub = [];
        var ar_uc = [];
        var ar_ia = [];
        var ar_ib = [];
        var ar_ic = [];
        $.each(v, function (k1, v1) {
            //console.log(v1)
            ar_ua.push(v1.dienap_a)
            ar_ub.push(v1.dienap_b)
            ar_uc.push(v1.dienap_c)
            ar_ia.push(v1.dongdien_a)
            ar_ib.push(v1.dongdien_b)
            ar_ic.push(v1.dongdien_c)
        })
        ar_THD_time.push(v[0].thoidiem);
        ar_THD_a.push(cal_THD(ar_ua))
        ar_THD_b.push(cal_THD(ar_ub))
        ar_THD_c.push(cal_THD(ar_uc))
        ar_THD_ia.push(cal_IHD(ar_ua))
        ar_THD_ib.push(cal_IHD(ar_ub))
        ar_THD_ic.push(cal_IHD(ar_uc))
    })
    drawBD_THD_U(ar_THD_a, ar_THD_b, ar_THD_c, ar_THD_time);
    //drawBD_IHD_I(ar_THD_ia, ar_THD_ib, ar_THD_ic, ar_THD_time);
    drawDataBieuDoSongHai(data, 0);
    $("#time_cbx").select2();
    $('#time_cbx').on('change', function (e) {
        var optionSelected = $("option:selected", this);
        var valueSelected = this.value;
        drawDataBieuDoSongHai(data, valueSelected)

    });
    // ar_THD.push(cal_THD(ar_ua))
    // ar_THD_time.push(cal_THD(ar_ua))
}
function drawBD_THD_U(THD_UA, THD_UB, THD_UC, Time) {
    var ctx = $('#myLineChart')[0].getContext('2d');
    const lineChart_2gradientStroke = ctx.createLinearGradient(500, 0, 100, 0);
    lineChart_2gradientStroke.addColorStop(0, "rgba(91, 207, 197, 1)");
    lineChart_2gradientStroke.addColorStop(1, "rgba(91, 207, 197, 0.5)");
    var myLineChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: Time.reverse(),
            datasets: [
                {
                    label: 'THD UA(%)',
                    borderColor: 'orange',
                    borderWidth: 1,
                    pointRadius: 1,
                    fill: false,
                    data: THD_UA.reverse(),
                    // borderColor: lineChart_2gradientStroke, 
                    backgroundColor: 'transparent',
                    pointBackgroundColor: 'rgba(91, 207, 197, 0.5)'
                },
                {
                    label: 'THD UB(%)',
                    borderColor: 'green',
                    borderWidth: 1,
                    pointRadius: 1,
                    fill: false,
                    data: THD_UB.reverse()
                },
                {
                    label: 'THD UC(%)',
                    borderColor: 'red',
                    borderWidth: 1,
                    pointRadius: 1,
                    fill: false,
                    data: THD_UC.reverse()
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    display: true,
                    title: {
                        display: true,
                        text: 'Month'
                    }
                },
                y: {
                    display: true,
                    title: {
                        display: true,
                        text: 'Value (units)'
                    },
                    ticks: {
                        callback: function (value) {
                            return value + ' units';
                        }
                    }
                }
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            return context.dataset.label + ': ' + context.raw + ' units';
                        }
                    }
                }
            }
        }
    });
}

function drawBD_IHD_I(THD_UA, THD_UB, THD_UC, Time) {
    var ctx = $('#myLineChart_IHD_I')[0].getContext('2d');
    var myLineChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: Time.reverse(),
            datasets: [
                {
                    label: 'IHD IA(%)',
                    borderColor: 'orange',
                    borderWidth: 1,
                    pointRadius: 1,
                    fill: false,
                    data: THD_UA.reverse()
                },
                {
                    label: 'IHD IB(%)',
                    borderColor: 'green',
                    borderWidth: 1,
                    pointRadius: 1,
                    fill: false,
                    data: THD_UB.reverse()
                },
                {
                    label: 'IHD IC(%)',
                    borderColor: 'red',
                    borderWidth: 1,
                    pointRadius: 1,
                    fill: false,
                    data: THD_UC.reverse()
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    display: true,
                    title: {
                        display: true,
                        text: 'Month'
                    }
                },
                y: {
                    display: true,
                    title: {
                        display: true,
                        text: 'Value (units)'
                    },
                    ticks: {
                        callback: function (value) {
                            return value + ' units';
                        }
                    }
                }
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            return context.dataset.label + ': ' + context.raw + ' units';
                        }
                    }
                }
            }
        }
    });
}

function drawTab_SH(data) {

}
function groupByTime(array) {
    // Tạo một đối tượng để lưu trữ các nhóm
    var groups = {};

    // Duyệt qua từng phần tử trong mảng
    $.each(array, function (index, item) {
        // Lấy giá trị của trường time
        var time = item.thoidiem;

        // Nếu nhóm với giá trị time này chưa tồn tại, tạo mới
        if (!groups[time]) {
            groups[time] = [];
        }

        // Thêm phần tử vào nhóm tương ứng
        groups[time].push(item);
    });

    // Chuyển đổi đối tượng thành mảng các nhóm
    var result = $.map(groups, function (value, key) {
        return [value];
    });

    return result;
}


function getStyleTableChiTiet(data) {
    drawDataBieuDoSongHai(data, '0');
    table.on('page.dt', function () {
        var info = table.page.info();
        // console.log(info);
        //console.log($(this).attr("data-dt-idx"))
        var idx = info.page;

        drawDataBieuDoSongHai(data, idx);

    });
};

function drawDataBieuDoSongHai(data, idx) {
    var date_time = [];
    var data_chart_a = [];
    var data_chart_b = [];
    var data_chart_c = [];
    var donvi_a = [];
    var donvi_b = [];
    var donvi_c = [];
    // console.log(idx);
    var bacsong_21 = [];
    $("#chartIHD").empty();
    $("#chartIHD").append('<canvas id="myLineChart_IHD_I" style="height: 300px;"></canvas>');
    var ctx = document.getElementById('myLineChart_IHD_I').getContext('2d');
    //ctx.clearRect(0, 0, canvas.width, canvas.height);

    //
    var result = data.reduce(function (r, a) {
        r[a.thoidiem] = r[a.thoidiem] || [];
        r[a.thoidiem].push(a);
        return r;
    }, Object.create(null));
    var keys = Object.keys(result);
    var $select = $('#time_cbx');
    $.each(keys, function (k, v) {
        $select.append($('<option>', {
            value: k,
            text: v
        }));
    })
    var arr_data = Object.keys(result).map(function (key) { return result[key]; });
    for (i = 0; i < arr_data[idx].length; i++) {
        date_time.push(arr_data[idx][i].thoidiem);

        var bac1_dienap_a = arr_data[idx][0].dienap_a;
        var bac1_dienap_b = arr_data[idx][0].dienap_b;
        var bac1_dienap_c = arr_data[idx][0].dienap_c;
        var bac1_dongdien_a = arr_data[idx][0].dongdien_a;
        var bac1_dongdien_b = arr_data[idx][0].dongdien_b;
        var bac1_dongdien_c = arr_data[idx][0].dongdien_c;

        if (arr_data[idx][i].bac_song != '1') {
            //if ($("[name=charttype]:checked").val() == "DienAp") {
            bacsong_21.push(arr_data[idx][i].bac_song);
            data_chart_a.push((arr_data[idx][i].dienap_a / bac1_dienap_a * 100).toFixed(2));
            data_chart_b.push((arr_data[idx][i].dienap_b / bac1_dienap_b * 100).toFixed(2));
            data_chart_c.push((arr_data[idx][i].dienap_c / bac1_dienap_c * 100).toFixed(2));
            donvi_a = "Điện áp pha A";
            donvi_b = "Điện áp pha B";
            donvi_c = "Điện áp pha C";

            // data_chart_a.push((arr_data[idx][i].dongdien_a / bac1_dongdien_a * 100).toFixed(2));
            // data_chart_b.push((arr_data[idx][i].dongdien_b / bac1_dongdien_b * 100).toFixed(2));
            // data_chart_c.push((arr_data[idx][i].dongdien_c / bac1_dongdien_c * 100).toFixed(2));
            // donvi_a = "Dòng điện pha A";
            // donvi_b = "Dòng điện pha B";
            // donvi_c = "Dòng điện pha C";
            //}
            // else if ($("[name=charttype]:checked").val() == "DongDien") {
            //     bacsong_21.push(arr_data[idx][i].bac_song);
            //     data_chart_a.push((arr_data[idx][i].dongdien_a / bac1_dongdien_a * 100).toFixed(2));
            //     data_chart_b.push((arr_data[idx][i].dongdien_b / bac1_dongdien_b * 100).toFixed(2));
            //     data_chart_c.push((arr_data[idx][i].dongdien_c / bac1_dongdien_c * 100).toFixed(2));
            //     donvi_a = "Dòng điện pha A";
            //     donvi_b = "Dòng điện pha B";
            //     donvi_c = "Dòng điện pha C";

            // }
        }
    }
    //console.log(data_chart_a)
    // console.log(data_chart_c)
    //
    var opt = {
        type: 'bar',
        data: {
            label: date_time,
            datasets: [{
                //  label: donvi_doluong,
                label: donvi_a,
                data: data_chart_a,
                backgroundColor: "#f58220",
                type: 'bar',
                order: 1
            }
                , {
                label: donvi_b,
                data: data_chart_b,
                backgroundColor: "#8bbc21",
                type: 'bar',
                order: 2
            }
                , {
                label: donvi_c,
                data: data_chart_c,
                backgroundColor: "#ff0000",
                type: 'bar',
                order: 3
            }


            ],
            labels: bacsong_21
        },
        options: {
            legend: {
                display: false
            },
            scales: {
                yAxes: [{
                    ticks: {
                        suggestedMin: -1
                    }
                }]
            },
            maintainAspectRatio: false,
            pan: {
                enabled: true,
                mode: "x",
                speed: 10,
                threshold: 10
            },
            zoom: {
                enabled: false,
                drag: false,
                mode: "xy",
                speed: 0.01,
                // sensitivity: 0.1,
                limits: {
                    max: 1000,
                    min: 0.5
                }
            }
        }
    };
    //
    var myChart = new Chart(ctx, opt);

}




function chartTypeChange() {
    setTimeout(function () {
        loadDuLieuSongHai_KH();
    }, 100);
}
function retNull(number) {

    if (number == null || number == undefined || (number == "")) {
        if (number == '0.0' || number == '0')
            return number;
        return '-';
    }
    return number;
}