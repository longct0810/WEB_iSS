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

    $("#txttungay_uttt").val(getDateTimeCurrent());
    $("#txtdenngay_uttt").val(getDateTimeCurrent());
    handleSidebarNode();
    $("#btnthuchien_uttt").click(function () {
        layUoctinh();
    });
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
    if (node == undefined) {
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
    var tree = node.tree;
    let loaithumuc = node.type;
    if (tree == 2) {
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
    } else {
        if (loaithumuc == 9 && loaithumuc < 2) {
            toastr.error("Vui lòng chọn cấp Điện lực hoặc cấp trạm", "Thông báo", {
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

    }

}

function loaiUocTinhChange(element) {
    if ($(element).prop('checked')) {
        if ($(element).val() == "1") {
            $(".nhapdiemdo").hide();
            $(".nhapchiso").show();
        }
        else {
            $(".nhapdiemdo").show();
            $(".nhapchiso").hide();
        }

    }
}
function onNhapTay() {
    var nhap_csmoi = $("#txt_nhap_csmoi").val();
    var nhap_cscu = $("#txt_nhap_cscu").val();
    var nhap_hsn = $("#txt_nhap_hsn").val();
    var nhap_sl = "";
    if (nhap_cscu != "" && nhap_csmoi != "" && nhap_hsn != "")
        nhap_sl = (nhap_csmoi - nhap_cscu) * nhap_hsn;
    else
        nhap_sl = "";

    $("#txt_nhap_sl").val(nhap_sl);
}
function layUoctinh() {
    var node = JSON.parse(localStorage.getItem("node"));
    let danhmucid = node.id;
    let tendanhmuc = node.tendanhmuc;
    var tungay = $("#txttungay_uttt").val();
    var denngay = $("#txtdenngay_uttt").val();
    var ddo_daunguon = $("#ls_madiemdo_cu").val();
    var loai_uoctinh = $('input[name="typeUT"]:checked').val();
    if (tungay == "" || denngay == "") {
        toastr.error("Vui lòng chọn từ ngày đến ngày", "Thông báo", {
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
    if (ddo_daunguon == "" && loai_uoctinh == '1') {
        toastr.error("Vui lòng nhập điểm đo đầu nguồn", "Thông báo", {
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

    var para = {
        v_danhmucid: danhmucid,
        v_tungay: tungay,
        v_denngay: denngay,
        v_ddo_daunguon: loai_uoctinh == "1" ? ddo_daunguon : ""
    }
    $.ajax({
        url: "/api/uoctinhtonthat",
        data: JSON.stringify(para),
        type: "POST",
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: function (res) {
            if (res[0].result == 'NOT_EXISTS') {
                toastr.error('Điểm đo đầu nguồn không tồn tại trong hệ thống', "Thông báo", {
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
            } else if (res[0].result == 'NOT_IN') {
                toastr.error('Điểm đo đầu nguồn không nằm trong: ' + tendanhmuc, "Thông báo", {
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
            else if (res[0].result == 'NO_METER') {
                toastr.error('Không tồn tại điểm đo trong: ' + tendanhmuc, "Thông báo", {
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
                drawData(res, loai_uoctinh, tendanhmuc);
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
function drawData(obj, loai_uoctinh, tendanhmuc) {
    if (obj[0].length < 0) {
        $("#modal_bieudo_uoctinh").hide();
        return;
    }

    var row = "";

    var sldaunguon = loai_uoctinh == 1 ? obj[0].sl_daunguon : $("#txt_nhap_sl").val();
    var sl_thuongpham = obj[0].sl_thuongpham;
    var ketquauoctinh = "";
    var rowww = "";
    rowww += "<tr>"
    rowww += `<td class="text-left">Đầu nguồn</td>`;
    rowww += `<td class="text-right">${loai_uoctinh == 1 ? retNull(obj[0].cs_daunguon_ngaycuoi) : $("#txt_nhap_csmoi").val()}</td>`;
    rowww += `<td class='text-right'>${loai_uoctinh == 1 ? retNull(obj[0].cs_daunguon_ngaydau) : $("#txt_nhap_cscu").val()}</td>`;
    rowww += `<td class='text-right'>${retNull(sldaunguon)}</td>`;
    rowww += "</tr>"
    rowww += "<tr>"
    rowww += `<td class="text-left">Điện thương phẩm</td>`;
    rowww += `<td class="text-right">${retNull(obj[0].cs_thuongpham_ngaycuoi)}</td>`;
    rowww += `<td class="text-right">${retNull(obj[0].cs_thuongpham_ngaydau)}</td>`;
    rowww += `<td class="text-right">${retNull(sl_thuongpham)}</td>`;
    rowww += "</tr>"
    $("#tbl_uoctinhtonthat tbody").html(rowww);

    if (sldaunguon != null && sl_thuongpham != null) {
        ketquauoctinh = ((sldaunguon - sl_thuongpham) / sldaunguon * 100).toFixed(2);
    } else {
        ketquauoctinh = "";
    }
    $("#ketquauoctinh").html(ketquauoctinh);
    var activeRequestsTable = $("#tbl_diemdo").DataTable();
    activeRequestsTable.state.clear();
    activeRequestsTable.destroy();
    $.each(obj, function (k, data) {
        row += "<tr>"
        row += "<td class='text-center align-middle'>" + data.stt + "</td>";
        row += "<td class='text-center align-middle'>" + data.madiemdo + "</td>";
        row += "<td class='text-center'>" + retNull(data.socongto) + "</td>";
        row += "<td class='text-center'>" + retNull(data.tenkhachhang) + "</td>";
        row += "<td class='text-right'>" + retNull(data.cs_cuoi) + "</td>";
        row += "<td class='text-right'>" + retNull(data.cs_dau) + "</td>";
        row += "<td class='text-right'>" + retNull(data.hsn) + "</td>";
        row += "<td class='text-right'>" + retNull(data.sanluong) + "</td>";
        row += "</tr>"
    });
    $("#tbl_diemdo tbody").html(row);

    getStyleTable1();
    drawChart(tendanhmuc, sl_thuongpham, sldaunguon);
}
function getStyleTable1() {

    $('#tbl_diemdo').removeAttr('width').DataTable({
        dom: '<"top">firt<"bottom"lp><"clear">',
        buttons: [],
        'scrollX': true,
        'scrollCollapse': true,
        'pageLength': 100,
        "lengthMenu": [20, 50, 100, 200, "All"],
        'paging': true,
        "pagingType": "full_numbers",
        'lengthChange': false,
        'searching': false,
        "order": [[1, "asc"]],
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

    });



};

function drawChart(tendanhmuc, sl_thuongpham, sldaunguon) {

    $("#modal_bieudo_uoctinh").show();
    let labels = ['Sản lượng thương phẩm', 'Sản lượng đầu nguồn'];
    let data = [sl_thuongpham, sldaunguon];
    let Colors = ['#14CDE9', '#14CDE9'];
    let donvi_doluong = "KWh";
    if (this.chartDrew)
        this.chart.destroy();
    this.chart = new Chart('bieudo_uoctinh', {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: '',
                    data: data,
                    backgroundColor: Colors,
                    fill: true,
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            legend: {
                display: false,
            },
            scales: {
                xAxes: [{
                    display: true,
                    scaleLabel: {
                        display: true,
                    },
                    barThickness: 70
                }],
                yAxes: [{
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: donvi_doluong
                    },
                    ticks: {
                        min: 0
                    }
                }]
            },
            chartArea: {
                backgroundColor: '#FFF'
            },
            title: {
                display: true,
                text: 'BIỂU ĐỒ ƯỚC TÍNH TỔN THẤT - ' + tendanhmuc
            },
        }
    })
    this.chartDrew = true;
}



function retNull(number) {
    if (number == null || number == undefined || (number == "")) {
        return '-';
    }
    return number;
}

function validatePositiveNumber(input) {
    // Lấy giá trị của input và chuyển sang kiểu số
    const value = Number(input.value);

    // Kiểm tra nếu giá trị nhỏ hơn hoặc bằng 0
    if (value <= 0) {
        alert("Vui lòng nhập một số lớn hơn 0");
        input.value = ''; // Xóa giá trị không hợp lệ
        return false;
    }
    return true;
}