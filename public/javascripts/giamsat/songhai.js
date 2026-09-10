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
    // $("#txtngay").on('change', function () {
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
                drawData_bdsh_v2(lstSongHai);
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
function toFixed2(val) {
    const num = Number(val);
    return isNaN(num) ? 0 : Number(num.toFixed(2));
}
function cal_THDI(arr) {

    if (!Array.isArray(arr) || arr.length === 0) return 0;
    /*arr[0] = I1 (bậc 1 – fundamental)
    Nếu I1 = 0 → không thể chia → trả về 0 */
    const i1 = Number(arr[0] || 0);
    if (!i1) return 0;
    //Tính tổng bình phương các bậc sóng hài:I22​+I32​+...+In2​​
    let sum = 0;
    for (let i = 1; i < arr.length; i++) {
        const val = Number(arr[i] || 0);
        sum += Math.pow(val, 2);
    }
    //Áp dụng công thức THDI:
    return Number(((Math.sqrt(sum) / i1) * 100).toFixed(2));
}
function drawData_bdsh_v2(data) {
    var groupedArray = groupByTime(data);
    // THD điện áp
    var ar_THD_a = [];
    var ar_THD_b = [];
    var ar_THD_c = [];

    // THDI dòng điện
    var ar_THDI_a = [];
    var ar_THDI_b = [];
    var ar_THDI_c = [];

    var ar_THD_time = [];

    // harmonics điện áp
    var harmonicsUAByTime = [];
    var harmonicsUBByTime = [];
    var harmonicsUCByTime = [];

    // harmonics dòng điện
    var harmonicsIAByTime = [];
    var harmonicsIBByTime = [];
    var harmonicsICByTime = [];

    $.each(groupedArray, function (k, v) {
        var ar_ua = [];
        var ar_ub = [];
        var ar_uc = [];

        var ar_ia = [];
        var ar_ib = [];
        var ar_ic = [];

        v.sort(function (a, b) {
            return Number(a.bac_song || 0) - Number(b.bac_song || 0);
        });

        $.each(v, function (k1, v1) {
            ar_ua.push(Number(v1.dienap_a || 0));
            ar_ub.push(Number(v1.dienap_b || 0));
            ar_uc.push(Number(v1.dienap_c || 0));

            ar_ia.push(Number(v1.dongdien_a || 0));
            ar_ib.push(Number(v1.dongdien_b || 0));
            ar_ic.push(Number(v1.dongdien_c || 0));
        });

        ar_THD_time.push(v[0]?.thoidiem || "");

        // THD điện áp
        ar_THD_a.push(toFixed2(cal_THD(ar_ua)));
        ar_THD_b.push(toFixed2(cal_THD(ar_ub)));
        ar_THD_c.push(toFixed2(cal_THD(ar_uc)));

        // THDI dòng điện

        ar_THDI_a.push(toFixed2(cal_THDI(ar_ia)));
        ar_THDI_b.push(toFixed2(cal_THDI(ar_ib)));
        ar_THDI_c.push(toFixed2(cal_THDI(ar_ic)));

        // 21 bậc điện áp
        harmonicsUAByTime.push(ar_ua.slice(0, 21).map(toFixed2));
        harmonicsUBByTime.push(ar_ub.slice(0, 21).map(toFixed2));
        harmonicsUCByTime.push(ar_uc.slice(0, 21).map(toFixed2));

        // 21 bậc dòng điện
        harmonicsIAByTime.push(ar_ia.slice(0, 21).map(toFixed2));
        harmonicsIBByTime.push(ar_ib.slice(0, 21).map(toFixed2));
        harmonicsICByTime.push(ar_ic.slice(0, 21).map(toFixed2));
    });

    // Biểu đồ THD điện áp
    drawBD_THD_U_v2(
        ar_THD_a,
        ar_THD_b,
        ar_THD_c,
        ar_THD_time,
        harmonicsUAByTime,
        harmonicsUBByTime,
        harmonicsUCByTime
    );

    // Biểu đồ THDI dòng điện
    drawBD_THD_I_v2(
        ar_THDI_a,
        ar_THDI_b,
        ar_THDI_c,
        ar_THD_time,
        harmonicsIAByTime,
        harmonicsIBByTime,
        harmonicsICByTime
    );
}
function drawBD_THD_U_v2(
    THD_UA,
    THD_UB,
    THD_UC,
    Time,
    harmonicsUAByTime = [],
    harmonicsUBByTime = [],
    harmonicsUCByTime = []
) {
    console.log("drawBD_THD_U_v2");

    const canvas = document.getElementById("myLineChart");
    if (!canvas) {
        console.warn("Không tìm thấy canvas #myLineChart");
        return;
    }

    const labels = [...Time].reverse();
    const dataUA = [...THD_UA].reverse();
    const dataUB = [...THD_UB].reverse();
    const dataUC = [...THD_UC].reverse();

    const hsUA = [...harmonicsUAByTime].reverse();
    const hsUB = [...harmonicsUBByTime].reverse();
    const hsUC = [...harmonicsUCByTime].reverse();

    if (window.chartTHDU) {
        window.chartTHDU.destroy();
        window.chartTHDU = null;
    }
    ensureTooltipStyle();
    const ctx = canvas.getContext("2d");

    window.chartTHDU = new Chart(ctx, {
        type: "line",
        data: {
            labels: labels,
            datasets: [
                {
                    label: "THD UA (%)",
                    data: dataUA,
                    borderColor: "orange",
                    borderWidth: 1,
                    pointRadius: 3,
                    pointHoverRadius: 5,
                    fill: false,
                    harmonics: hsUA
                },
                {
                    label: "THD UB (%)",
                    data: dataUB,
                    borderColor: "green",
                    borderWidth: 1,
                    pointRadius: 3,
                    pointHoverRadius: 5,
                    fill: false,
                    harmonics: hsUB
                },
                {
                    label: "THD UC (%)",
                    data: dataUC,
                    borderColor: "red",
                    borderWidth: 1,
                    pointRadius: 3,
                    pointHoverRadius: 5,
                    fill: false,
                    harmonics: hsUC
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            tooltips: {
                enabled: false,
                mode: "nearest",
                intersect: true,
                displayColors: false,
                custom: function (tooltipModel) {
                    const tooltipEl = getOrCreateTooltipEl();

                    if (!tooltipModel || tooltipModel.opacity === 0) {
                        tooltipEl.style.opacity = 0;
                        return;
                    }

                    if (!tooltipModel.dataPoints || !tooltipModel.dataPoints.length) {
                        tooltipEl.style.opacity = 0;
                        return;
                    }

                    const point = tooltipModel.dataPoints[0];
                    const datasetIndex = point.datasetIndex;
                    const index = point.index;

                    const chart = this._chart;
                    const dataset = chart.config.data.datasets[datasetIndex];
                    const label = chart.config.data.labels[index] || "";
                    const rawValue = dataset.data[index];
                    const value = rawValue != null ? Number(rawValue).toFixed(2) : "0.00";
                    const color = dataset.borderColor || "#fff";

                    const harmonics = Array.isArray(dataset.harmonics?.[index])
                        ? dataset.harmonics[index]
                        : [];

                    let harmonicHtml = `
                        <div class="tt-h-title">21 BẬC SÓNG</div>
                    `;

                    if (harmonics.length) {
                        harmonicHtml += `<div class="tt-grid">`;

                        for (let i = 0; i < 21; i++) {
                            const v = harmonics[i] != null ? Number(harmonics[i]).toFixed(2) : "0.00";
                            harmonicHtml += `<div class="tt-cell">B${i + 1}: ${v}</div>`;
                        }

                        harmonicHtml += `</div>`;
                    } else {
                        harmonicHtml += `<div>Không có dữ liệu 21 bậc sóng</div>`;
                    }

                    tooltipEl.querySelector(".tooltip-content").innerHTML = `
                        <div class="tt-title">Thời điểm: ${label}</div>
                        <div class="tt-line">
                            <span class="tt-color" style="background:${color}"></span>
                            <span>${dataset.label}: ${value}%</span>
                        </div>
                        ${harmonicHtml}
                    `;

                    const position = chart.canvas.getBoundingClientRect();

                    let left = position.left + window.pageXOffset + tooltipModel.caretX;
                    let top = position.top + window.pageYOffset + tooltipModel.caretY;

                    tooltipEl.style.opacity = 1;
                    tooltipEl.style.left = left + "px";
                    tooltipEl.style.top = top + "px";

                    requestAnimationFrame(() => {
                        const rect = tooltipEl.getBoundingClientRect();
                        const vw = window.pageXOffset + window.innerWidth;
                        const vh = window.pageYOffset + window.innerHeight;

                        let finalLeft = left;
                        let finalTop = top;

                        if (finalLeft - rect.width / 2 < window.pageXOffset + 8) {
                            finalLeft = window.pageXOffset + rect.width / 2 + 8;
                        }

                        if (finalLeft + rect.width / 2 > vw - 8) {
                            finalLeft = vw - rect.width / 2 - 8;
                        }

                        if (finalTop - rect.height - 16 < window.pageYOffset) {
                            tooltipEl.style.transform = "translate(-50%, 10px)";
                        } else {
                            tooltipEl.style.transform = "translate(-50%, calc(-100% - 10px))";
                        }

                        if (finalTop + rect.height > vh - 8) {
                            finalTop = vh - rect.height - 8;
                        }

                        tooltipEl.style.left = finalLeft + "px";
                        tooltipEl.style.top = finalTop + "px";
                    });
                }
            },
            legend: {
                onClick: function (e, legendItem) {
                    const ci = this.chart;
                    const index = legendItem.datasetIndex;
                    const meta = ci.getDatasetMeta(index);

                    // toggle ẩn/hiện line
                    meta.hidden = meta.hidden === null ? !ci.data.datasets[index].hidden : null;

                    ci.update();
                },
                labels: {
                    generateLabels: function (chart) {
                        const datasets = chart.data.datasets || [];

                        return datasets.map(function (ds, i) {
                            const meta = chart.getDatasetMeta(i);
                            const hidden = meta.hidden === true || ds.hidden === true;

                            return {
                                text: ds.label,
                                fillStyle: hidden ? "rgba(0,0,0,0)" : (ds.backgroundColor || ds.borderColor),
                                strokeStyle: hidden ? "rgba(180,180,180,0.35)" : (ds.borderColor || ds.backgroundColor),
                                lineWidth: 2,
                                hidden: false, // không cho text bị strike/mờ mặc định
                                datasetIndex: i,

                                // giữ style box ổn định
                                lineCap: ds.borderCapStyle,
                                lineDash: ds.borderDash || [],
                                lineDashOffset: ds.borderDashOffset || 0,
                                lineJoin: ds.borderJoinStyle,

                                // Chart.js v2 có thể dùng thêm
                                pointStyle: ds.pointStyle || "rect"
                            };
                        });
                    },
                    fontColor: "#333",
                    boxWidth: 30,
                    padding: 12
                }
            },
            scales: {
                xAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: "Thời điểm"
                    },
                    ticks: {
                        autoSkip: false,
                        maxRotation: 90,
                        minRotation: 45
                    }
                }],
                yAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: "THDI (%)"
                    },
                    ticks: {
                        callback: function (value) {
                            return value + " %";
                        }
                    }
                }]
            }
        }
    });
}
function getOrCreateTooltipEl() {
    let tooltipEl = document.getElementById("chartjs-tooltip-thdi");

    if (!tooltipEl) {
        tooltipEl = document.createElement("div");
        tooltipEl.id = "chartjs-tooltip-thdi";
        tooltipEl.className = "chartjs-tooltip-thdi";
        tooltipEl.innerHTML = "<div class='tooltip-content'></div>";
        document.body.appendChild(tooltipEl);
    }

    return tooltipEl;
}

function ensureTooltipStyle() {
    if (document.getElementById("chartjs-tooltip-thdi-style")) return;

    const style = document.createElement("style");
    style.id = "chartjs-tooltip-thdi-style";
    style.innerHTML = `
            .chartjs-tooltip-thdi {
                position: absolute;
                background: rgba(33, 33, 33, 0.95);
                color: #fff;
                border-radius: 8px;
                padding: 10px 12px;
                font-size: 12px;
                line-height: 1.45;
                pointer-events: none;
                opacity: 0;
                z-index: 99999;
                min-width: 360px;
                max-width: 520px;
                box-shadow: 0 4px 14px rgba(0,0,0,.25);
                transform: translate(-50%, calc(-100% - 10px));
                transition: opacity .08s ease;
            }

            .chartjs-tooltip-thdi .tt-title {
                font-weight: 700;
                margin-bottom: 6px;
            }

            .chartjs-tooltip-thdi .tt-line {
                display: flex;
                align-items: center;
                gap: 6px;
                margin-bottom: 8px;
            }

            .chartjs-tooltip-thdi .tt-color {
                width: 10px;
                height: 10px;
                display: inline-block;
                border-radius: 2px;
                flex: 0 0 10px;
            }

            .chartjs-tooltip-thdi .tt-h-title {
                text-align: center;
                font-weight: 700;
                margin: 4px 0 8px;
            }

            .chartjs-tooltip-thdi .tt-grid {
                display: grid;
                grid-template-columns: repeat(4, minmax(72px, 1fr));
                gap: 4px 14px;
                font-family: monospace;
                white-space: nowrap;
            }

            .chartjs-tooltip-thdi .tt-cell {
                text-align: left;
            }
        `;
    document.head.appendChild(style);
}
function drawBD_THD_I_v2(
    THDI_IA,
    THDI_IB,
    THDI_IC,
    Time,
    harmonicsIAByTime = [],
    harmonicsIBByTime = [],
    harmonicsICByTime = []
) {
    const canvas = document.getElementById("myLineChart_I");
    if (!canvas) return;

    const labels = [...Time].reverse();
    const dataIA = [...THDI_IA].reverse();
    const dataIB = [...THDI_IB].reverse();
    const dataIC = [...THDI_IC].reverse();

    const hsIA = [...harmonicsIAByTime].reverse();
    const hsIB = [...harmonicsIBByTime].reverse();
    const hsIC = [...harmonicsICByTime].reverse();

    if (window.chartTHDI) {
        window.chartTHDI.destroy();
        window.chartTHDI = null;
    }
    ensureTooltipStyle();

    const ctx = canvas.getContext("2d");

    window.chartTHDI = new Chart(ctx, {
        type: "line",
        data: {
            labels: labels,
            datasets: [
                {
                    label: "THDI IA (%)",
                    data: dataIA,
                    borderColor: "orange",
                    backgroundColor: "orange",
                    borderWidth: 1,
                    pointRadius: 3,
                    pointHoverRadius: 5,
                    fill: false,
                    harmonics: hsIA
                },
                {
                    label: "THDI IB (%)",
                    data: dataIB,
                    borderColor: "green",
                    backgroundColor: "green",
                    borderWidth: 1,
                    pointRadius: 3,
                    pointHoverRadius: 5,
                    fill: false,
                    harmonics: hsIB
                },
                {
                    label: "THDI IC (%)",
                    data: dataIC,
                    borderColor: "red",
                    backgroundColor: "red",
                    borderWidth: 1,
                    pointRadius: 3,
                    pointHoverRadius: 5,
                    fill: false,
                    harmonics: hsIC
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            tooltips: {
                enabled: false,
                mode: "nearest",
                intersect: true,
                displayColors: false,
                custom: function (tooltipModel) {
                    const tooltipEl = getOrCreateTooltipEl();

                    if (!tooltipModel || tooltipModel.opacity === 0) {
                        tooltipEl.style.opacity = 0;
                        return;
                    }

                    if (!tooltipModel.dataPoints || !tooltipModel.dataPoints.length) {
                        tooltipEl.style.opacity = 0;
                        return;
                    }

                    const point = tooltipModel.dataPoints[0];
                    const datasetIndex = point.datasetIndex;
                    const index = point.index;

                    const chart = this._chart;
                    const dataset = chart.config.data.datasets[datasetIndex];
                    const label = chart.config.data.labels[index] || "";
                    const rawValue = dataset.data[index];
                    const value = rawValue != null ? Number(rawValue).toFixed(2) : "0.00";
                    const color = dataset.borderColor || "#fff";

                    const harmonics = Array.isArray(dataset.harmonics?.[index])
                        ? dataset.harmonics[index]
                        : [];

                    let harmonicHtml = `
                        <div class="tt-h-title">21 BẬC SÓNG</div>
                    `;

                    if (harmonics.length) {
                        harmonicHtml += `<div class="tt-grid">`;

                        for (let i = 0; i < 21; i++) {
                            const v = harmonics[i] != null ? Number(harmonics[i]).toFixed(2) : "0.00";
                            harmonicHtml += `<div class="tt-cell">B${i + 1}: ${v}</div>`;
                        }

                        harmonicHtml += `</div>`;
                    } else {
                        harmonicHtml += `<div>Không có dữ liệu 21 bậc sóng</div>`;
                    }

                    tooltipEl.querySelector(".tooltip-content").innerHTML = `
                        <div class="tt-title">Thời điểm: ${label}</div>
                        <div class="tt-line">
                            <span class="tt-color" style="background:${color}"></span>
                            <span>${dataset.label}: ${value}%</span>
                        </div>
                        ${harmonicHtml}
                    `;

                    const position = chart.canvas.getBoundingClientRect();

                    let left = position.left + window.pageXOffset + tooltipModel.caretX;
                    let top = position.top + window.pageYOffset + tooltipModel.caretY;

                    tooltipEl.style.opacity = 1;
                    tooltipEl.style.left = left + "px";
                    tooltipEl.style.top = top + "px";

                    requestAnimationFrame(() => {
                        const rect = tooltipEl.getBoundingClientRect();
                        const vw = window.pageXOffset + window.innerWidth;
                        const vh = window.pageYOffset + window.innerHeight;

                        let finalLeft = left;
                        let finalTop = top;

                        if (finalLeft - rect.width / 2 < window.pageXOffset + 8) {
                            finalLeft = window.pageXOffset + rect.width / 2 + 8;
                        }

                        if (finalLeft + rect.width / 2 > vw - 8) {
                            finalLeft = vw - rect.width / 2 - 8;
                        }

                        if (finalTop - rect.height - 16 < window.pageYOffset) {
                            tooltipEl.style.transform = "translate(-50%, 10px)";
                        } else {
                            tooltipEl.style.transform = "translate(-50%, calc(-100% - 10px))";
                        }

                        if (finalTop + rect.height > vh - 8) {
                            finalTop = vh - rect.height - 8;
                        }

                        tooltipEl.style.left = finalLeft + "px";
                        tooltipEl.style.top = finalTop + "px";
                    });
                }
            },
            legend: {
                onClick: function (e, legendItem) {
                    const ci = this.chart;
                    const index = legendItem.datasetIndex;
                    const meta = ci.getDatasetMeta(index);

                    // toggle ẩn/hiện line
                    meta.hidden = meta.hidden === null ? !ci.data.datasets[index].hidden : null;

                    ci.update();
                },
                labels: {
                    generateLabels: function (chart) {
                        const datasets = chart.data.datasets || [];

                        return datasets.map(function (ds, i) {
                            const meta = chart.getDatasetMeta(i);
                            const hidden = meta.hidden === true || ds.hidden === true;

                            return {
                                text: ds.label,
                                fillStyle: hidden ? "rgba(0,0,0,0)" : (ds.backgroundColor || ds.borderColor),
                                strokeStyle: hidden ? "rgba(180,180,180,0.35)" : (ds.borderColor || ds.backgroundColor),
                                lineWidth: 2,
                                hidden: false, // không cho text bị strike/mờ mặc định
                                datasetIndex: i,

                                // giữ style box ổn định
                                lineCap: ds.borderCapStyle,
                                lineDash: ds.borderDash || [],
                                lineDashOffset: ds.borderDashOffset || 0,
                                lineJoin: ds.borderJoinStyle,

                                // Chart.js v2 có thể dùng thêm
                                pointStyle: ds.pointStyle || "rect"
                            };
                        });
                    },
                    fontColor: "#333",
                    boxWidth: 30,
                    padding: 12
                }
            },
            scales: {
                xAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: "Thời điểm"
                    },
                    ticks: {
                        autoSkip: false,
                        maxRotation: 90,
                        minRotation: 45
                    }
                }],
                yAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: "THDI (%)"
                    },
                    ticks: {
                        callback: function (value) {
                            return value + " %";
                        }
                    }
                }]
            }
        }
    });
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