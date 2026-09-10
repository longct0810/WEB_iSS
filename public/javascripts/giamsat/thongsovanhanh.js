
var getThang = "";
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
    $("#txttungay_tsvh_scada").val(getDateTimeCurrent());
    $("#txtdenngay_tsvh_scada").val(getDateTimeCurrent());
    $("#slloaicongto_tsvh").change(function () {
        var node = JSON.parse(localStorage.getItem("node"));
        if (!node) {
            showThongBao("Vui lòng chọn trạm trên cây thư mục", "#thongbao_tsvh");
            return;
        }
        let loaidanhmuc = node.type;
        if (loaidanhmuc != 9 && loaidanhmuc < 5) {
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
        if ($("#slloaicongto_tsvh").val() == "1") {
            $(".gio").hide()
            $(".gio").val(" ");

        } else {
            $(".gio").show();
        }
        loadTSVH()
    })
    $("#txtngay_tsvh, #cbogio_tsvh")
        .off("change")
        .on("change", loadTSVH);
    $("#btnthuchien_tsvh").click(function () {
        loadTSVH()
    });
    $("#btnExportExceTSVH").off("click").on("click", function () {
        exportTSVHToExcel();
    });
    handleSidebarNode();
});

function handleSidebarNode() {
    var node = JSON.parse(localStorage.getItem("node"));
    if (!node) {
        showThongBao("Vui lòng chọn trạm trên cây thư mục", "#thongbao_tsvh");
        return;
    }
    let loaithumuc = node.type;
    let isCambien = node.isCambien;
    let id_thietbi = node.id_thietbi;
    $("#txtngay_tsvh").val(getDateTimeCurrent());
    if (isCambien == 1 || isCambien == undefined) {
        hideThongBao("#thongbao_tsvh");
        $("#box_tsvh").show();
        $("#box_scada").hide();
        loadGio_tsvh();
        if (loaithumuc == 9) {
            let Meterid = node.id;
            let tenkhachhang = node.tendanhmuc;
            let loaipha = node.loaipha;
            f_XemChiTiet_tsvh(Meterid, tenkhachhang, loaipha);
            $("#modal_giamsat").modal("show");
        } else {
            loadTSVH();
            $("#modal_giamsat").modal('hide');
        }
    } else {
        $("#box_tsvh").hide();
        $("#box_scada").show();
        if (loaithumuc == 9) {
            hideThongBao("#thongbao_tsvh");
            $(".point_name_on_page").html(
                `<i class="flaticon-050-info"></i>${node.tendanhmuc}`
            );
            getTSVHScada(id_thietbi);
        } else {
            showThongBao("Vui lòng chọn thiết bị ở cây thư mục", "#thongbao_tsvh");
            $("#box_tsvh").hide();
            $("#box_scada").hide();
            return;
        }

    }
}
function loadGio_tsvh() {
    var data = getListTime();
    $("#cbogio_tsvh").empty();
    $("#cbogio_tsvh").append(`<option value="-1">Tất cả</option>`);
    $.each(data, function (index, item) {
        $("#cbogio_tsvh").append(`<option value="${item.value}">${item.value}</option>`);
    })

}
function getDateTimeCurrent() {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    const day = currentDate.getDate();
    return `${day.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}/${year} `;
}

function loadTSVH() {
    var node = JSON.parse(localStorage.getItem("node"));
    if (!node) {
        showThongBao("Vui lòng chọn trạm trên cây thư mục", "#thongbao_tsvh");
        return;
    }
    let loaidanhmuc = node.type;
    let danhmucid = node.id;
    let tree = node.tree;
    var locdulieu = $("#sllocdulieu_tsvh").val();
    var loaipha = $("#slloaicongto_tsvh").val();
    var ngay = $("#txtngay_tsvh").val();
    if (danhmucid == null || danhmucid == undefined || tree == 2) {
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

    var ChiSoParameter = new Object()
    ChiSoParameter.v_danhmucid = danhmucid;
    ChiSoParameter.v_locdulieu = parseInt(locdulieu);
    ChiSoParameter.v_ngay = ngay;
    ChiSoParameter.v_gio = $("#cbogio_tsvh").val();
    ChiSoParameter.v_loaipha = parseInt(loaipha);
    ChiSoParameter.v_sotrang = 0;
    ChiSoParameter.v_sodong = 100000;
    ChiSoParameter.v_mataikhoan = 1;
    $.ajax({
        url: "/api/khaithacdulieu_laythongsovanhanh",
        data: JSON.stringify(ChiSoParameter),
        type: "POST",
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: function (result) {
            setTimeout(function () {
                drawData(result)
            }, 200)
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
            // alert(errormessage.responseText)
        }
    })
}
function drawData(data) {
    var activeRequestsTable = $('#tbltsvh').DataTable()
    activeRequestsTable.state.clear()
    activeRequestsTable.destroy()
    $("#tbltsvh tbody").empty()
    $("#tbltsvh thead").empty()

    var str = ""
    if ($("#slloaicongto_tsvh").val() == "3") {
        if ($("#sllocdulieu_tsvh").val() == "0") {
            str += `
            <tr>
                <th>STT</th>
                <th>Mã điểm đo -Số công tơ - Tên khách hàng</th>
                <th style="display:none">Mã điểm đo</th>
                <th style="display:none">Tên khách hàng</th>
                <th style="display:none">Số công tơ</th>
                <th style="display:none">Loại công tơ</th>
                <th>Thời điểm</th>
                <th>Pha</th>
                <th>U (V)</th>
                <th>I (A)</th>
                <th>Góc φ</th>
                <th>Cos φ</th>
                <th>F (Hz)</th>
                <th>S Giao (kVA)</th>
                <th>S Nhận (kVA)</th>
                <th>P Giao (kW)</th>
                <th>P Nhận (kW)</th>
                <th>Q Giao (kVar)</th>
                <th>Q Nhận (kVar)</th>
            </tr>`;


        } else {
            str += "<tr>"
            str += "<th>STT</th>"
            str += "<th>Mã điểm đo -Số công tơ - Tên khách hàng</th>"
            str += "<th style='display:none'>Mã điểm đo</th>"
            str += "<th>Số công tơ</th>"
            str += "<th>Loại công tơ</th>"
            str += "<th>IMEI</th>"
            str += "<th>Mã cột</th>"
            str += "<th>Mã trạm</th>"
            str += "</tr>"
        }
    } else {

        if ($("#sllocdulieu_tsvh").val() == "0") {
            str += "<tr>"
            str += "<th>STT</th>"
            str += "<th>Mã điểm đo -Số công tơ - Tên khách hàng</th>"
            str += "<th style='display:none'>Mã điểm đo</th>"
            str += "<th style='display:none'>Tên khách hàng</th>"
            str += "<th>Thời điểm</th>"
            str += "<th>Số công tơ</th>"
            str += "<th>Loại công tơ</th>"
            str += "<th>U (V)</th>"
            str += "<th>I (A)</th>"
            str += "<th>Cos φ</th>"
            str += "<th>P Giao Tổng (kW)</th>"
            str += "<th>P Nhận Tổng (kVA)</th>"
            str += "<th>Q Giao Tổng (kVar)</th>"
            str += "<th>Q Nhận Tổng (kVar)</th>"
            str += "</tr>"
        } else {
            str += "<tr>"
            str += "<th>STT</th>"
            str += "<th>Mã điểm đo -Số công tơ - Tên khách hàng</th>"
            str += "<th style='display:none'>Mã điểm đo</th>"
            str += "<th>Số công tơ</th>"
            str += "<th>Loại công tơ</th>"
            str += "<th>IMEI</th>"
            str += "<th>Mã cột</th>"
            str += "<th>Mã trạm</th>"
            str += "</tr>"
        }
    }
    $("#tbltsvh thead").append(str)

    var str1 = ""
    $.each(data, function (k, v) {
        var thoigian = "";
        thoigian = "<span class='text-xanh'> HT:" + v.time + " </span > <br /> <span class='text-do'> CT: " + v.timemeter + "</span>";


        if ($("#slloaicongto_tsvh").val() == "3") {
            if ($("#sllocdulieu_tsvh").val() == "0") {
                str1 += "<tr>"
                str1 += `<td  style='text-align: center;vertical-align: middle'  rowspan='3'>${v.stt}</td>`
                str1 += `<td  style="font-weight:bold"><a href="#thongsovanhanh" data-bs-toggle="modal" data-bs-target="#modal_giamsat" onClick="f_XemChiTiet_tsvh(${v.meterid},'${v.tenkhachhang}' ,'${v.loaipha}','${v.tu}','${v.ti}','${v.hsn}')">Mã điểm đo: ${v.madiemdo} - Số công tơ:  ${v.socongto} - Tên khách hàng: ${v.tenkhachhang} - Loại công tơ: ${v.loaicongto} - TU:  ${v.tu} - TI:  ${v.ti} - HSN:  ${v.hsn}</a></td>`
                str1 += `<td  style='text-align: center;vertical-align: middle; display:none'  rowspan='3'>${v.madiemdo}</td>`
                str1 += `<td  style='text-align: center;vertical-align: middle; display:none'  rowspan='3'>${v.tenkhachhang}</td>`
                str1 += `<td  style='text-align: center;vertical-align: middle; display:none'  rowspan='3'>${v.socongto}</td>`
                str1 += `<td  style='text-align: center;vertical-align: middle; display:none'  rowspan='3'>${retNull(v.loaicongto)}</td>`
                str1 += `<td  style='text-align: center;vertical-align: middle;white-space: nowrap;' rowspan='3'> ${thoigian}</td>`
                str1 += `<td class='text-center text-do' >Pha A</td>`
                str1 += `<td class='text-right text-do'>${retNull(v.ua)}</td>`
                str1 += `<td class='text-right text-do'>${retNull(v.ia)}</td>`
                str1 += `<td class='text-right text-do'>${retNull(v.anglea)}</td>`
                str1 += `<td class='text-right text-do'>${retNull(v.cosa)}</td>`
                str1 += `<td class='text-right text-do' rowspan='3' style='text-align: center;vertical-align: middle'>${retNull(v.frega)}</td>`
                str1 += `<td class="text-right text-do">${retNull(v.s_giaoa)}</td>
                         <td class="text-right text-do">${retNull(v.s_nhana)}</td>`

                str1 += `<td class='text-right text-do'>${retNull(v.pa_giao)}</td>`
                str1 += `<td class='text-right text-do'>${retNull(v.pa_nhan)}</td>`
                str1 += `<td class='text-right text-do'>${retNull(v.qa_giao)}</td>`
                str1 += `<td class='text-right text-do'>${retNull(v.qa_nhan)}</td>`

                str1 += "</tr>"

                str1 += "<tr>"
                str1 += `<td  style='display: none'></td>`
                str1 += `<td  style="font-weight:bold" style="display: none"><a href="#thongsovanhanh" data-bs-toggle="modal" data-bs-target="#modal_giamsat" onClick="f_XemChiTiet_tsvh(${v.meterid},'${v.tenkhachhang}' ,'${v.loaipha}','${v.tu}','${v.ti}','${v.hsn}')">Mã điểm đo: ${v.madiemdo} - Số công tơ:  ${v.socongto} - Tên khách hàng: ${v.tenkhachhang} - Loại công tơ: ${v.loaicongto} - TU:  ${v.tu} - TI:  ${v.ti} - HSN:  ${v.hsn}</a></td>`
                str1 += `<td  style='display: none'></td>`
                str1 += `<td  style='display: none'></td>`
                str1 += `<td  style='display: none'></td>`
                str1 += `<td  style='display: none'></td>`
                str1 += `<td  style='display: none'></td>`
                str1 += `<td class='text-center text-xanh'>Pha B</td>`
                str1 += `<td class='text-right text-xanh'>${retNull(v.ub)}</td>`
                str1 += `<td class='text-right text-xanh'>${retNull(v.ib)}</td>`
                str1 += `<td class='text-right text-xanh'>${retNull(v.angleb)}</td>`
                str1 += `<td class='text-right text-xanh'>${retNull(v.cosb)}</td>`
                str1 += `<td  style='display: none'></td>`
                str1 += `<td class="text-right text-xanh">${retNull(v.s_giaob)}</td>
                         <td class="text-right text-xanh">${retNull(v.s_nhanb)}</td>`
                str1 += `<td class='text-right text-xanh'>${retNull(v.pb_giao)}</td>`
                str1 += `<td class='text-right text-xanh'>${retNull(v.pb_nhan)}</td>`
                str1 += `<td class='text-right text-xanh'>${retNull(v.qb_giao)}</td>`
                str1 += `<td class='text-right text-xanh'>${retNull(v.qb_nhan)}</td>`
                str1 += "</tr>"
                str1 += "<tr>"
                str1 += `<td  style='display: none'></td>`
                str1 += `<td  style="font-weight:bold" style="display: none"><a href="#thongsovanhanh" data-bs-toggle="modal" data-bs-target="#modal_giamsat" onClick="f_XemChiTiet_tsvh(${v.meterid},'${v.tenkhachhang}' ,'${v.loaipha}','${v.tu}','${v.ti}','${v.hsn}')">Mã điểm đo: ${v.madiemdo} - Số công tơ:  ${v.socongto} - Tên khách hàng: ${v.tenkhachhang} - Loại công tơ: ${v.loaicongto} - TU:  ${v.tu} - TI:  ${v.ti} - HSN:  ${v.hsn}</a></td>`
                str1 += `<td  style='display: none'></td>`
                str1 += `<td  style='display: none'></td>`
                str1 += `<td  style='display: none'></td>`
                str1 += `<td  style='display: none'></td>`
                str1 += `<td  style='display: none'></td>`
                str1 += `<td class='text-center text-cam'>Pha C</td>`
                str1 += `<td class='text-right  text-cam'>${retNull(v.uc)}</td>`
                str1 += `<td class='text-right text-cam'>${retNull(v.ic)}</td>`
                str1 += `<td class='text-right text-cam'>${retNull(v.anglec)}</td>`
                str1 += `<td class='text-right text-cam'>${retNull(v.cosc)}</td>`
                str1 += `<td class="text-right text-cam">${retNull(v.s_giaoc)}</td>
                         <td class="text-right text-cam">${retNull(v.s_nhanc)}</td>`
                str1 += `<td class='text-right text-cam'>${retNull(v.pc_giao)}</td>`
                str1 += `<td class='text-right text-cam'>${retNull(v.pc_nhan)}</td>`
                str1 += `<td class='text-right text-cam'>${retNull(v.qc_giao)}</td>`
                str1 += `<td class='text-right text-cam'>${retNull(v.qc_nhan)}</td>`
                str1 += `<td  style='display: none'></td>`
                str1 += "</tr>"

            } else {
                str1 += "<tr>"
                str1 += "<td>" + v.STT + "</td>"
                str1 += "<td style='font-weight:bold'>  Mã điểm đo: " + v.madiemdo + " -  Số công tơ: " + v.socongto + " - Loại công tơ: " + v.loaicongto + "</td >"
                str1 += "<td  style='display: none'>" + v.madiemdo + "</td>"
                str1 += "<td>" + v.socongto + "</td>"
                str1 += "<td>" + retNull(v.loaicongto) + "</td>"
                str1 += "<td>" + v.imei + "</td>"
                str1 += "<td>" + retNull(v.macot) + "</td>"
                str1 += "<td>" + retNull(v.matram) + "</td>"
                str1 += "</tr >"
            }
        } else {
            if ($("#sllocdulieu_tsvh").val() == "0") {
                str1 += "<tr>"
                str1 += "<td class='text-center'>" + v.stt + "</td>"

                str1 += '<td style="font-weight:bold"><a href="#thongsovanhanh" data-bs-toggle="modal" data-bs-target="#modal_giamsat" onClick="f_XemChiTiet_tsvh(\'' + v.meterid + '\',\'' + v.tenkhachhang + '\',\'' + v.loaipha + '\')" >Mã điểm đo: ' + v.madiemdo + ' - Số công tơ:  ' + v.socongto + ' - Tên khách hàng: ' + v.tenkhachhang + ' - Loại công tơ:  ' + v.loaicongto + '</a></td >'
                str1 += "<td  style='display: none'>" + v.madiemdo + "</td>"
                str1 += "<td  style='display: none'>" + v.tenkhachhang + "</td>"
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
            } else {
                str1 += "<tr>"
                str1 += "<td>" + v.stt + "</td>"
                str1 += "<td style='font-weight:bold'>  Mã điểm đo: " + v.madiemdo + " -  Số công tơ: " + v.socongto + " - Loại công tơ: " + v.loaicongto + "</td >"
                str1 += "<td  style='display: none'>" + v.madiemdo + "</td>"
                str1 += "<td>" + v.socongto + "</td>"
                str1 += "<td>" + retNull(v.loaicongto) + "</td>"
                str1 += "<td>" + v.imei + "</td>"
                str1 += "<td>" + retNull(v.macot) + "</td>"
                str1 += "<td>" + retNull(v.matram) + "</td>"
                str1 += "</tr >"
            }
        }
    })
    $("#tbltsvh tbody").html(str1)

    $("#messageerror").hide()
    $("#content-w").show()

    if ($("#hdloaicongto_tsvh").val() == "3" || $("#slloaicongto_tsvh").val() == "3") {
        if ($("#sllocdulieu_tsvh").val() == "0") {
            getStyleTable_TSVH3()
        } else {
            getStyleTable_TSVH()
        }

    } else {
        if ($("#sllocdulieu_tsvh").val() == "0") {
            getStyleTable_TSVH1()
        } else {
            getStyleTable_TSVH()
        }
    }
}
function getStyleTable_TSVH3() {

    $('#tbltsvh').removeAttr('width').DataTable({
        // dom: 'Bfrtip',
        dom: '<"top">firt<"bottom"lp><"clear">',
        buttons: [
            // 'excelHtml5',
            {
                extend: 'excel',
                title: "Thông số vận hành",
                exportOptions: {
                    columns: [0, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18]
                }
            }
        ],
        rowGroup: {
            dataSrc: 1
        },
        "columnDefs": [
            { "visible": false, "targets": 1 }
        ],
        "exportOptions": { columns: [':visible'] },
        'pageLength': 100,
        "lengthMenu": [20, 50, 100, 200, "All"],
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
        }
    }).columns.adjust()

};

function getStyleTable_TSVH1() {

    $('#tbltsvh').removeAttr('width').DataTable({
        //dom: 'Bfrtip',
        dom: '<"top">firt<"bottom"lp><"clear">',
        buttons: [
            // 'excelHtml5',
            {
                extend: 'excel',
                title: "Thông số vận hành",
                exportOptions: {
                    columns: [0, 2, 3, 4, 5, 6, 7, 8, 9]
                }
            }
        ],
        rowGroup: {
            dataSrc: 1
        },
        "columnDefs": [
            { "visible": false, "targets": 1 }
        ],
        "order": [[0, "asc"]],
        'pageLength': 100,
        "lengthMenu": [10, 20, 50, 100, 200, "All"],
        //'lengthChange': false,
        'paging': true,
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
        }
    }).columns.adjust()


};
function getStyleTable_TSVH() {

    $('#tbltsvh').removeAttr('width').DataTable({
        //dom: 'Bfrtip',
        dom: '<"top">Bfirt<"bottom"lp><"clear">',
        buttons: [
            //'excelHtml5'           
            {
                extend: 'excel',
                title: "Thông số vận hành",
                exportOptions: {
                    columns: [0, 2, 3, 4, 5, 6, 7]
                }
            }
        ],
        rowGroup: {
            dataSrc: 1
        },
        "columnDefs": [
            { "visible": false, "targets": 1 }
        ],
        "order": [[0, "asc"]],
        'pageLength': 100,
        "lengthMenu": [10, 20, 50, 100, 200, "All"],
        //'lengthChange': false,
        'paging': true,
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
        }
    }).columns.adjust()


};

function retNull(number) {
    if (number == null || number == undefined || (number == '')) {
        return '-';
    }
    return number;
}
function setDatePickerValue(selector, value) {
    const picker = $(selector).pickadate('picker');
    if (picker) {
        const parts = value.split('/');
        if (parts.length === 3) {
            picker.set('select', [parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0])]);
        }
    } else {
        $(selector).val(value);
    }
}


async function exportTSVHToExcel() {
    const $table = $("#tbltsvh");

    if (!$table.length) {
        toastr.error("Không tìm thấy bảng dữ liệu", "Thông báo");
        return;
    }

    if (typeof XLSX === "undefined") {
        toastr.error("Chưa load thư viện XLSX", "Thông báo");
        return;
    }

    if (!$.fn.DataTable.isDataTable("#tbltsvh")) {
        toastr.error("Bảng chưa được khởi tạo DataTable", "Thông báo");
        return;
    }

    const dt = $table.DataTable();
    const totalRows = dt.rows({ search: "applied" }).count();

    if (!totalRows) {
        toastr.error("Không có dữ liệu để xuất Excel", "Thông báo");
        return;
    }

    const oldPageLen = dt.page.len();
    const oldPage = dt.page();
    const oldScrollTop = $(window).scrollTop();

    try {
        setExportLoading(true);

        toastr.info(`Đang xuất ${totalRows} dòng, vui lòng chờ...`, "Thông báo", {
            timeOut: 1500,
            positionClass: "toast-bottom-right"
        });

        await sleep(80);

        await redrawDataTableAsync(dt, -1);
        await waitNextFrame();
        await waitNextFrame();
        await sleep(50);

        const $exportTable = buildExportTableFromRenderedDom($table);

        const debugInfo = {
            headerCols: countLeafColumns($exportTable.find("thead")),
            bodyCols: countFirstBodyColumns($exportTable.find("tbody")),
            bodyRows: $exportTable.find("tbody tr").length
        };


        if (!debugInfo.bodyRows) {
            toastr.error("Không có dữ liệu để xuất Excel", "Thông báo");
            return;
        }

        await sleep(30);

        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.table_to_sheet($exportTable[0], { raw: true });

        await sleep(30);

        ws["!merges"] = buildWorksheetMergesFromTable($exportTable);
        ws["!cols"] = buildColumnWidthsFromRenderedTable($exportTable);

        if (totalRows > 2000) {
            applyWorksheetStylesFast($exportTable, ws);
        } else {
            applyWorksheetStylesFromRenderedTable($exportTable, ws);
        }

        const headerRowCount = $exportTable.find("thead tr").length;
        ws["!freeze"] = {
            xSplit: 0,
            ySplit: headerRowCount
        };

        XLSX.utils.book_append_sheet(wb, ws, "thongsovanhanh");

        await sleep(30);

        XLSX.writeFile(wb, buildExportFileName("thongsovanhanh"));
    } catch (err) {
        console.error("Export Excel lỗi:", err);
        toastr.error("Xuất Excel thất bại", "Thông báo");
    } finally {
        await redrawDataTableAsync(dt, oldPageLen, oldPage);
        $(window).scrollTop(oldScrollTop);
        setExportLoading(false);
    }
}

function setExportLoading(isLoading) {
    const $btn = $("#btnExportExceTSVH");

    if (!$btn.length) return;

    if (isLoading) {
        if (!$btn.data("old-text")) {
            $btn.data("old-text", $btn.html());
        }

        $btn.prop("disabled", true);
        $btn.html(`<i class="fa fa-spinner fa-spin"></i> Đang xuất...`);
    } else {
        $btn.prop("disabled", false);
        $btn.html($btn.data("old-text") || "Xuất Excel");
        $btn.removeData("old-text");
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function redrawDataTableAsync(dt, pageLen, pageIndex) {
    return new Promise((resolve) => {
        dt.one("draw", function () {
            resolve();
        });

        if (typeof pageIndex === "number") {
            dt.page.len(pageLen).page(pageIndex).draw(false);
        } else {
            dt.page.len(pageLen).draw(false);
        }
    });
}

function waitNextFrame() {
    return new Promise((resolve) => {
        requestAnimationFrame(() => resolve());
    });
}

function buildExportTableFromRenderedDom($sourceTable) {
    const clonedTable = $sourceTable[0].cloneNode(true);
    const $cloned = $(clonedTable);

    $cloned.removeAttr("id");
    $cloned.find("*").removeAttr("id");
    $cloned.find("colgroup").remove();

    removeHiddenCellsFromExportTable($cloned);

    const visibleColCount = countLeafColumns($cloned.find("thead"));
    $cloned.find("tbody tr.dt-group-row td").attr("colspan", visibleColCount);

    cleanExportTableHtml($cloned);

    return $cloned;
}

function removeHiddenCellsFromExportTable($table) {
    $table.find("th, td").each(function () {
        const $cell = $(this);
        const style = String($cell.attr("style") || "").toLowerCase();

        const isHidden =
            style.includes("display: none") ||
            style.includes("display:none") ||
            $cell.hasClass("d-none") ||
            $cell.hasClass("dt-hidden") ||
            $cell.hasClass("dtr-hidden");

        if (isHidden) {
            $cell.remove();
        }
    });

    $table.find("thead tr").each(function () {
        if (!$(this).children("th").length) {
            $(this).remove();
        }
    });
}

function cleanExportTableHtml($table) {
    $table.find("a").each(function () {
        $(this).replaceWith($(this).text());
    });

    $table.find("br").replaceWith("\n");

    $table.find("[onclick]").removeAttr("onclick");
    $table.find("[data-toggle]").removeAttr("data-toggle");
    $table.find("[data-target]").removeAttr("data-target");
    $table.find("[data-bs-toggle]").removeAttr("data-bs-toggle");
    $table.find("[data-bs-target]").removeAttr("data-bs-target");

    $table.find(".sorting, .sorting_asc, .sorting_desc")
        .removeClass("sorting sorting_asc sorting_desc");
}

function buildWorksheetMergesFromTable($table) {
    const merges = [];
    const occupied = {};
    let excelRow = 0;

    $table.find("thead tr, tbody tr").each(function () {
        const $row = $(this);
        let excelCol = 0;

        $row.children("th, td").each(function () {
            while (occupied[excelRow + "_" + excelCol]) excelCol++;

            const $cell = $(this);
            const rowspan = parseInt($cell.attr("rowspan") || 1, 10);
            const colspan = parseInt($cell.attr("colspan") || 1, 10);

            if (rowspan > 1 || colspan > 1) {
                merges.push({
                    s: { r: excelRow, c: excelCol },
                    e: { r: excelRow + rowspan - 1, c: excelCol + colspan - 1 }
                });
            }

            for (let rr = 0; rr < rowspan; rr++) {
                for (let cc = 0; cc < colspan; cc++) {
                    occupied[(excelRow + rr) + "_" + (excelCol + cc)] = true;
                }
            }

            excelCol += colspan;
        });

        excelRow++;
    });

    return merges;
}

function buildColumnWidthsFromRenderedTable($table) {
    const widths = [];
    const occupied = {};
    let rowIndex = 0;

    $table.find("thead tr, tbody tr").each(function () {
        let colIndex = 0;

        $(this).children("th, td").each(function () {
            while (occupied[rowIndex + "_" + colIndex]) colIndex++;

            const $cell = $(this);
            const colspan = parseInt($cell.attr("colspan") || 1, 10);
            const rowspan = parseInt($cell.attr("rowspan") || 1, 10);
            const text = normalizeText($cell.text());

            let wch = Math.max(10, Math.min(55, text.length + 4));

            if ($cell.hasClass("text-right")) {
                wch = Math.max(wch, 14);
            }

            const eachCol = Math.ceil(wch / colspan);
            for (let i = 0; i < colspan; i++) {
                widths[colIndex + i] = Math.max(widths[colIndex + i] || 0, eachCol);
            }

            for (let rr = 0; rr < rowspan; rr++) {
                for (let cc = 0; cc < colspan; cc++) {
                    occupied[(rowIndex + rr) + "_" + (colIndex + cc)] = true;
                }
            }

            colIndex += colspan;
        });

        rowIndex++;
    });

    return widths.map(w => ({ wch: w || 12 }));
}

const EXCEL_BORDER_STYLE = {
    top: { style: "thin", color: { rgb: "666666" } },
    bottom: { style: "thin", color: { rgb: "666666" } },
    left: { style: "thin", color: { rgb: "666666" } },
    right: { style: "thin", color: { rgb: "666666" } }
};

function applyWorksheetStylesFast($table, ws) {
    if (!ws["!ref"]) return;

    const range = XLSX.utils.decode_range(ws["!ref"]);
    const headerRowCount = $table.find("thead tr").length;

    for (let r = range.s.r; r <= range.e.r; r++) {
        for (let c = range.s.c; c <= range.e.c; c++) {
            const ref = XLSX.utils.encode_cell({ r, c });
            if (!ws[ref]) {
                ws[ref] = { t: "s", v: "" };
            }

            const isHeader = r < headerRowCount;
            let horizontal = "left";

            if (isHeader) {
                horizontal = "center";
            } else {
                const v = ws[ref].v;
                const clean = String(v ?? "").replace(/,/g, "").trim();

                if (typeof v === "number" || (clean !== "" && !isNaN(clean))) {
                    horizontal = "right";
                }
            }

            ws[ref].s = {
                font: {
                    name: "Arial",
                    sz: 10,
                    bold: isHeader
                },
                alignment: {
                    vertical: "center",
                    horizontal,
                    wrapText: true
                },
                border: EXCEL_BORDER_STYLE,
                fill: isHeader
                    ? { fgColor: { rgb: "D9EAF7" } }
                    : undefined
            };
        }
    }
}

function applyWorksheetStylesFromRenderedTable($table, ws) {
    if (!ws["!ref"]) return;

    const range = XLSX.utils.decode_range(ws["!ref"]);
    const headerRowCount = $table.find("thead tr").length;
    const $bodyRows = $table.find("tbody tr");

    for (let r = range.s.r; r <= range.e.r; r++) {
        for (let c = range.s.c; c <= range.e.c; c++) {
            const ref = XLSX.utils.encode_cell({ r, c });
            if (!ws[ref]) {
                ws[ref] = { t: "s", v: "" };
            }

            const isHeader = r < headerRowCount;
            const bodyRowIndex = r - headerRowCount;
            const $bodyRow = bodyRowIndex >= 0 ? $bodyRows.eq(bodyRowIndex) : $();
            const isGroup = !isHeader && $bodyRow.hasClass("dt-group-row");

            let horizontal = "left";

            if (isHeader) {
                horizontal = "center";
            } else if (!isGroup) {
                const v = ws[ref].v;
                const clean = String(v ?? "").replace(/,/g, "").trim();

                if (typeof v === "number" || (clean !== "" && !isNaN(clean))) {
                    horizontal = "right";
                } else {
                    horizontal = "left";
                }
            }

            ws[ref].s = {
                font: {
                    name: "Arial",
                    sz: 10,
                    bold: isHeader || isGroup
                },
                alignment: {
                    vertical: "center",
                    horizontal,
                    wrapText: true
                },
                border: EXCEL_BORDER_STYLE,
                fill: isHeader
                    ? { fgColor: { rgb: "D9EAF7" } }
                    : isGroup
                        ? { fgColor: { rgb: "E8ECF1" } }
                        : undefined
            };
        }
    }
}

function applyBorderToMergedCells(ws) {
    if (!ws["!merges"] || !ws["!merges"].length) return;

    ws["!merges"].forEach(function (merge) {
        for (let r = merge.s.r; r <= merge.e.r; r++) {
            for (let c = merge.s.c; c <= merge.e.c; c++) {
                const ref = XLSX.utils.encode_cell({ r, c });

                if (!ws[ref]) {
                    ws[ref] = { t: "s", v: "" };
                }

                const oldStyle = ws[ref].s || {};

                ws[ref].s = {
                    ...oldStyle,
                    border: EXCEL_BORDER_STYLE,
                    alignment: {
                        ...(oldStyle.alignment || {}),
                        vertical: "center",
                        wrapText: true
                    }
                };
            }
        }
    });
}
function countLeafColumns($thead) {
    const $rows = $thead.find("tr");
    if (!$rows.length) return 0;

    const grid = [];

    $rows.each(function (r) {
        grid[r] = grid[r] || [];
        let c = 0;

        $(this).children("th").each(function () {
            while (grid[r][c]) c++;

            const colspan = parseInt($(this).attr("colspan") || 1, 10);
            const rowspan = parseInt($(this).attr("rowspan") || 1, 10);

            for (let rr = 0; rr < rowspan; rr++) {
                for (let cc = 0; cc < colspan; cc++) {
                    grid[r + rr] = grid[r + rr] || [];
                    grid[r + rr][c + cc] = true;
                }
            }

            c += colspan;
        });
    });

    return grid[grid.length - 1] ? grid[grid.length - 1].length : 0;
}

function countFirstBodyColumns($tbody) {
    const $firstNormalRow = $tbody.find("tr").not(".dt-group-row").first();
    return $firstNormalRow.length ? $firstNormalRow.children("td").length : 0;
}

function normalizeText(text) {
    return String(text == null ? "" : text)
        .replace(/\u00a0/g, " ")
        .replace(/\s+\n/g, "\n")
        .replace(/\n\s+/g, "\n")
        .replace(/[ \t]+/g, " ")
        .trim();
}

function buildExportFileName(prefix) {
    const now = new Date();
    const yyyy = now.getFullYear();
    const MM = String(now.getMonth() + 1).padStart(2, "0");
    const dd = String(now.getDate()).padStart(2, "0");
    const hh = String(now.getHours()).padStart(2, "0");
    const mm = String(now.getMinutes()).padStart(2, "0");

    return `${prefix}_${yyyy}${MM}${dd}_${hh}${mm}.xlsx`;
}