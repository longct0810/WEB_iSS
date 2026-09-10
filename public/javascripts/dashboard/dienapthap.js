
$(document).ready(function () {

    // const input = "SomeTextE3228MoreTextE3228EvenMoreText";
    // const resultFiltered = input.split("E3228").filter(Boolean);
    // console.log(resultFiltered);
 
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
    load_cb_imei_dat();
    $("#txt_tungay_dat").val(getDateTimeCurrent());
    $("#txt_denngay_dat").val(getDateTimeCurrent());

    $('#txt_tungay_dat').change(function (e) {
        load_tsvh_dat();
        load_canhbaodienapthap();
    });
    $('#txt_denngay_dat').change(function (e) {
        load_tsvh_dat();
        load_canhbaodienapthap();
    });
    $('#cb_imei').change(function (e) {
        load_tsvh_dat();
        load_canhbaodienapthap();
    });

    setTimeout(function () {
        load_tsvh_dat();
        load_canhbaodienapthap();
    }, 60000);
});

function getDateTimeCurrent() {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    const day = currentDate.getDate();
    return `${day.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}/${year} `;
}

function load_cb_imei_dat() {
    var para = {}
    var url = "/api/imeidienapthap";
    var lst = ExecuteServiceSyns(JSON.stringify(para), url);
    var option = "<option value= ''>-- Chọn IMEI --</option>"
    $.each(lst, function (k, v) {
        var data = JSON.parse(lst[k]);
        option += "<option value=" + data.imei + ">" + data.imei + "</option>"
    });
    $("#cb_imei").html(option);
}

function load_tsvh_dat() {
    var DATParameter = new Object();
    DATParameter.v_tungay = $("#txt_tungay_dat").val();
    DATParameter.v_denngay = $("#txt_denngay_dat").val();
    DATParameter.v_imei = $("#cb_imei").val();

    $.ajax({
        url: "/api/dienapthap",
        data: JSON.stringify(DATParameter),
        type: "POST",
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: function (result) {

            drawChart_DAT(result);
        },
        error: function (errormessage) {
        }
    });
}

function load_canhbaodienapthap() {
    var DATParameter = new Object();
    DATParameter.v_tungay = $("#txt_tungay_dat").val();
    DATParameter.v_denngay = $("#txt_denngay_dat").val();
    DATParameter.v_imei = $("#cb_imei").val();

    $.ajax({
        url: "/api/canhbaodienapthap",
        data: JSON.stringify(DATParameter),
        type: "POST",
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: function (result) {

            drawCanhBao_DAT(result);
        },
        error: function (errormessage) {
        }
    });
}


function retNull(number) {
    if (number == null || number == undefined || (number == "")) {
        return '0';
    }
    return number;
}


function drawCanhBao_DAT(result) {

    var data = result;

    // Hủy DataTable nếu đã được khởi tạo
    var tableElement = $('#tbl_canhbao_dienapthap');
    if ($.fn.DataTable.isDataTable(tableElement)) {
        tableElement.DataTable().clear().destroy();
    }

    // Tạo nội dung HTML cho bảng
    var str1 = "";
    var color = "";
    var stt = 0;
    $.each(data, function (k, v) {
        stt++;
        var event = v.event;
        var loaicb = v.loaicanhbao;
        var msg = "";
        var style = "";
        if (loaicb == "start" || loaicb == "powerdown") {
            style = "style='background-color:#f77171; color: black;'";
        }
        else if (loaicb == "stop" || loaicb == "powerup") {
            style = "style='background-color:#068016; color: black;'"
        }
        switch (event) {
            case "CBDIENAP_THAP":
                if (loaicb == "start") {
                    msg = "Cảnh báo điện áp thấp";
                    break;
                }
                else {
                    msg = "Hết cảnh báo điện áp thấp";
                    break;
                }
            case "CBDIENAP_CAO":
                if (loaicb == "start") {
                    msg = "Cảnh báo điện áp cao";
                    break;
                }
                else {
                    msg = "Hết cảnh báo điện áp cao";
                    break;
                }


        }

        if (loaicb == 'powerdown') msg = "Cảnh báo mất điện ";
        else if (loaicb == 'powerup') msg = "Có điện trở lại ";

        str1 += "<tr  " + style + " >";
        str1 += "<td style='text-align: center; vertical-align: middle; font-weight: bold'>" + stt + "</td>";
        str1 += "<td style='text-align: center;'>" + v.time + "</td>";
        //  str1 += "<td>" + v.event + "</td>";
        str1 += "<td>" + msg + "</td>";
        str1 += "<td>" + v.phase + "</td>";
        str1 += "</tr>";
    });

    // Gán nội dung vào bảng

    $("#tbl_canhbao_dienapthap tbody").html(str1);

    // Sau khi bảng đã vẽ xong, áp dụng DataTable
    if (data.length == 0) {
        setTimeout(function () {
            getStyleTable1();
        }, 1000)
    } else {
        getStyleTable1();
    }


}

function getStyleTable1() {

    $('#tbl_canhbao_dienapthap').removeAttr('width').DataTable({
        dom: '<"top">Bfirt<"bottom"lp><"clear">',
        buttons: [
            //'excelHtml5'           
            {
                extend: 'excel',
                title: "Điện áp thấp"

            }
        ],

        'scrollX': true,
        'scrollCollapse': true,
        'pageLength': 10,
        "lengthMenu": [10, 20, 50, 100, 200, "All"],
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
            $("#tbl_canhbao_dienapthap").wrap("<div style='overflow:auto; width:100%;position:relative;' class='table-container'></div>");
        },

    }).columns.adjust().draw();



};

function drawChart_DAT(data) {
    $("#is_div_chart").html("");
    var time = [];
    var phaseA = [];
    var phaseB = [];
    var phaseC = [];
    $.each(data, function (k, v) {
        time.push(v.time);
        //time.push(v.time.substr(11, 5));
        phaseA.push(retNull(v.ua));
        phaseB.push(retNull(v.ub));
        phaseC.push(retNull(v.uc));
    });
    // multiLineChart.destroy(); 
    $("#is_div_chart").html(`<canvas id="multiLineChart" style="display: block; width: 1458px; height: 400px;"></canvas>`);
    const ctx = document.getElementById('multiLineChart').getContext('2d');
    const multiLineChart = new Chart(ctx, {
        type: 'line',
        data: {
            //labels: ['January', 'February', 'March', 'April', 'May', 'June'], // X-axis labels
            labels: time, // X-axis labels
            datasets: [
                {
                    label: 'Pha A',
                    data: phaseA,
                    fill: false,
                    borderWidth: 1,
                    pointRadius: 1,
                    borderColor: '#f58220'
                },
                {
                    label: 'Pha B',
                    data: phaseB,
                    fill: false,
                    borderWidth: 1,
                    pointRadius: 1,
                    borderColor: '#197b30'
                },
                {


                    label: 'Pha C',
                    data: phaseC,
                    fill: false,
                    borderWidth: 1,
                    pointRadius: 1,
                    borderColor: '#bf1e2e'
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

}


// const ctx = document.getElementById('voltageChart').getContext('2d');
// const voltageChart = new Chart(ctx, {
//     type: 'line',
//     data: {
//         labels: ['Ngày 01', 'Ngày 02', 'Ngày 03', 'Ngày 04', 'Ngày 05', 'Ngày 06', 'Ngày 07', 'Ngày 08', 'Ngày 09', 'Ngày 10', 'Ngày 02', 'Ngày 03', 'Ngày 04', 'Ngày 05', 'Ngày 06', 'Ngày 07', 'Ngày 08', 'Ngày 09', 'Ngày 10'],
//         datasets: [{
//             label: 'Điện Áp Thấp',
//             data: [123, 102, 108, 91, 124, 92, 123, 102, 108, 91, 124, 92],
//             borderColor: 'rgb(23, 151, 151)',
//             borderWidth: 1
//         }]
//     },
//     options: {
//         scales: {
//             y: {
//                 beginAtZero: true
//             }
//         }
//     }
// });




// const map = L.map('map').setView([21.0285, 105.8542], 13); // Tọa độ Hà Nội

// L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//     attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
// }).addTo(map);

// L.marker([21.0285, 105.8542]).addTo(map)
//     .bindPopup('Hà Nội, Việt Nam')
//     .openPopup();
