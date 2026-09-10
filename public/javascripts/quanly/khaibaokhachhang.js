let chosen = 'xml', tableJson = []
$(document).ready(function () {
    if (!localStorage.getItem("us")) {
        window.location.href = "../login";
    }
    handleSidebarNode();
    $('input[type="file"]').on('change', handle_upload)
    $('input[type="file"]').click(function () {
        $('input[type="file"]').val('');

    });
    $('input[type="radio"]').change(function () {
        $('#data_table tbody').html("");
        getOptionCheckBox();
    });

    $("#check_file").click(function () {
        fn_KiemTra();
    });


});

function handleSidebarNode() {
    var node = JSON.parse(localStorage.getItem("node"));
    let loaithumuc = node.type;
    let tree = node.tree;
    $(".point_name_on_page").html(`<i class="flaticon-050-info"></i> ${node.tendanhmuc}`)
    if (tree == 2 || loaithumuc == 9 || loaithumuc < 5) {
        $(".thongbaokbkh").show();
        $("#thongbaokbkh").addClass("show");
        $(".khaibaokh").hide();
        return;
    }
    $(".thongbaokbkh").hide();
    $("#thongbaokbkh").removeClass("show");
    $(".khaibaokh").show();


}
function getOptionCheckBox() {
    chosen = $('input[name="checkfile"]:checked').val();
    $('#thuc_hien').addClass('disabled').off('click');
    switch (chosen) {
        case 'xml':
            $(".downloadfilemau").hide();
            $('input[name="checkfile"]').prop('accept', ".xml");
            break;
        case 'excel':
            $(".downloadfilemau").show();
            $('input[name="checkfile"]').prop('accept', ".xlsx, .xls");
            $('.example_file').append(`<a class="text-aqua" href="/QuanLyKDDN/GetExampleFile"><i class="fa fa-download"></i> File mẫu</a>`)
            break;
    }

}
function handle_upload(e) {

    const file = e.target.files
    if (!file) return false;
    const emptyFile = $('input[type="file"]')[0].files.length === 0
    $('#data_table').DataTable().rows().remove();
    $('#data_table').DataTable().destroy();
    if (emptyFile) {
        $('#data_table').addClass('hidden');
        toastr.error("Vui lòng chọn file", "Thông báo", {
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
        tableJson = []
        $('#data_table').removeClass('hidden')
        $('.alert').alert("close")
        var node = JSON.parse(localStorage.getItem("node"));
        const formData = new FormData();
        formData.append('file', file[0]);
        formData.append('type', chosen);
        formData.append('code', node.id);
        $.ajax({
            url: "/api/khaibaokhachhang_uploadfile",
            data: formData,
            type: "POST",
            processData: false, // Ngăn jQuery xử lý dữ liệu
            contentType: false, // Ngăn jQuery thiết lập contentType
            dataType: "json",
            success: function (result) {
                if (result.success == true) {
                    var chosen = $('input[name="checkfile"]:checked').val();

                    var arr = JSON.parse(result.data);
                    var str1 = "";
                    var activeRequestsTable = $('#data_table').DataTable();
                    activeRequestsTable.state.clear();
                    activeRequestsTable.destroy();
                    $("#data_table tbody").html("");
                    if (chosen == "excel") {
                        $.each(arr, function (i, v) {
                            var thongbao = v.THONGBAO == undefined ? "" : v.THONGBAO;
                            var thongbaoketqua = v.THONGBAO_KETQUA == undefined ? "" : v.THONGBAO_KETQUA;
                            str1 += "<tr>";
                            str1 += '<td> ' + (i + 1) + '</td >';
                            str1 += "<td>" + v.MA_KHANG + "</td>";
                            str1 += "<td>" + v.MA_DDO + "</td>";
                            str1 += "<td>" + v.SERY_CTO + "</td>";
                            str1 += "<td>" + v.IMEI_DCU + "</td>";
                            str1 += "<td>" + v.TEN_KHANG + "</td>";
                            str1 += "<td>" + v.LOAICONGTO + "</td>";
                            str1 += "<td>" + retNull(v.MATKHAU) + "</td>";
                            str1 += "<td>" + retNull(v.MA_QUYEN) + "</td>";
                            str1 += "<td>" + retNull(v.MA_TRAM) + "</td>";
                            str1 += "<td>" + retNull(v.MA_COT) + "</td>";
                            str1 += "<td>" + retNull(v.SO_HOM) + "</td>";
                            str1 += "<td></td>";
                            str1 += "<td>" + retNull(v.HSN) + "</td>";
                            str1 += "<td>" + retNull(v.DIA_CHI) + "</td>";
                            str1 += "<td>" + thongbao + "</td>";
                            str1 += "<td>" + thongbaoketqua + "</td>";
                            str1 += "</tr>";
                        });
                    } else {
                        $.each(arr, function (i, v) {
                            var thongbao = v.THONGBAO == undefined ? "" : v.THONGBAO;
                            var thongbaoketqua = v.THONGBAO_KETQUA == undefined ? "" : v.THONGBAO_KETQUA;
                            str1 += "<tr>";
                            str1 += '<td> ' + (i + 1) + '</td >';
                            str1 += "<td>" + v.MA_KHANG + "</td>";
                            str1 += "<td>" + v.MA_DDO + "</td>";
                            str1 += "<td>" + v.SERY_CTO + "</td>";
                            str1 += "<td>" + retNull(v.IMEI_DCU) + "</td>";
                            str1 += "<td>" + v.TEN_KHANG + "</td>";
                            str1 += "<td>" + retNull(v.LOAI_BCS) + "</td>";
                            str1 += "<td>" + retNull(v.MATKHAU) + "</td>";
                            str1 += "<td>" + retNull(v.MA_QUYEN) + "</td>";
                            str1 += "<td>" + retNull(v.MA_TRAM) + "</td>";
                            str1 += "<td>" + retNull(v.MA_COT) + "</td>";
                            str1 += "<td>" + retNull(v.SO_HOM) + "</td>";
                            str1 += "<td>" + retNull(v.SO_HOM) + "</td>";
                            str1 += "<td>" + retNull(v.HSN) + "</td>";
                            str1 += "<td>" + retNull(v.DIA_CHI) + "</td>";
                            str1 += "<td>" + thongbao + "</td>";
                            str1 += "<td>" + thongbaoketqua + "</td>";
                            str1 += "</tr>";
                        });
                    }

                    $('#data_table tbody').html(str1);
                    initDataTable();
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
                return;
            }

        });
    }
}


function initDataTable() {

    $('#data_table').DataTable({
        dom: '<"top">Bfrt<"bottom"lp><"clear">',
        buttons: [
            {
                extend: 'excel'
            }
        ],
        scrollX: true,
        ordering: true,
        // columnDefs: [
        //     { targets: targets, orderable: false, width: '200px' },
        // ],
        language: {
            processing: 'Đang xử lý...',
            lengthMenu: 'Xem _MENU_ mục',
            zeroRecords: 'Không có dữ liệu nào được tìm thấy',
            info: 'Đang xem từ _START_ đến _END_ trong tổng số _TOTAL_ mục',
            infoEmpty: 'Đang xem 0 dữ liệu',
            infoFiltered: 'Được lọc từ _MAX_ mục',
            search: "Tìm",
            paginate: {
                first: '<i class="fa fa-fast-backward"></i>',
                previous: '<i class="fa fa-arrow-left"></i>',
                next: '<i class="fa fa-arrow-right"></i>',
                last: '<i class="fa fa-fast-forward"></i>',
            }
        }
    })
}

function retNull(number) {
    if (number == null || number == undefined || (number == "")) {
        return '-';
    }
    return number;
}


function fn_KiemTra() {
    const file = $('input[type="file"]')[0].files;
    if (!file) return false;
    const emptyFile = $('input[type="file"]')[0].files.length === 0
    $('#data_table').DataTable().rows().remove();
    $('#data_table').DataTable().destroy();
    if (emptyFile) {
        $('#data_table').addClass('hidden');
        toastr.error("Vui lòng chọn file", "Thông báo", {
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
        tableJson = []
        $('#data_table').removeClass('hidden')
        $('.alert').alert("close")
        var node = JSON.parse(localStorage.getItem("node"));
        const formData = new FormData();
        formData.append('file', file[0]);
        formData.append('type', chosen);
        formData.append('code', node.id);
        $.ajax({
            url: "/api/khaibaokhachhang_kiemtra",
            data: formData,
            type: "POST",
            processData: false, // Ngăn jQuery xử lý dữ liệu
            contentType: false, // Ngăn jQuery thiết lập contentType
            dataType: "json",
            success: function (result) {
                if (result.success == true) {
                    var arr = result.data;
                    var str1 = "";

                    $('#thuc_hien_khaibao').removeClass('disabled').on('click', fn_ThucHien_Khaibao);

                    const count_thaocongto = arr.filter(v => v.hanhdong === 'THAO_CTO').length,
                        count_khac = arr.filter(v => v.hanhdong === 'KHAC' || v.hanhdong === 'KHONG_TONTAI').length,
                        count_capnhat_tt = arr.filter(v => v.hanhdong === 'CAPNHAT_TT' || v.hanhdong === 'CAPNHAT_TT_THAY_MODEM').length,
                        count_thay_cto = arr.filter(v => v.hanhdong === 'THAY_CTO' || v.hanhdong === 'THAY_CTO').length,
                        count_khaibao_tudong = arr.filter(v => v.hanhdong === 'KHAIBAO_TUDONG').length,
                        count_thay_dcu = arr.filter(v => v.hanhdong === 'THAY_DCU').length,
                        count_THAY_CTO_MODEM = arr.filter(v => v.hanhdong === 'THAY_CTO_MODEM').length,

                        count_tong = count_thaocongto + count_khac + count_capnhat_tt + count_thay_cto + count_khaibao_tudong + count_thay_dcu + count_THAY_CTO_MODEM

                    $('#print_section').empty()
                        .append(`<h4>Tổng số: <span class="text-danger">${count_tong}</span> khách hàng, trong đó: </h4>
                    <ul class="list-unstyled list_describe"></ul>`)
                    $('.list_describe')
                        .append(`<li><span class="text-warning">${count_thaocongto}</span> khách hàng - Tháo công tơ</li>`)
                        .append(`<li><span class="text-warning">${count_capnhat_tt}</span> khách hàng - Cập nhật thông tin điểm đo</li>`)
                        .append(`<li><span class="text-warning">${count_thay_cto}</span> khách hàng - Thay công tơ</li>`)
                        .append(`<li><span class="text-warning">${count_thay_dcu}</span> khách hàng - Thay Modem/DCU</li>`)
                        .append(`<li class="XANHNHAT"><span class="text-warning">${count_khaibao_tudong}</span> khách hàng - Khai báo điểm đo tự động</li>`)
                        .append(`<li><span class="text-warning">${count_khac + count_THAY_CTO_MODEM}</span> khách hàng - Loại khác</li>`)

                    var activeRequestsTable = $('#data_table').DataTable();
                    activeRequestsTable.state.clear();
                    activeRequestsTable.destroy();
                    $("#data_table tbody").html("");
                    var chosen = $('input[name="checkfile"]:checked').val();
                    $.each(arr, function (i, v) {
                        var thongbao = v.thongbao == undefined ? "" : v.thongbao;
                        var thongbaoketqua = v.thongbao_ketqua == undefined ? "" : v.thongbao_ketqua;
                        var imei_dcu = v.imei_dcu;
                        var loaicongto = chosen == "xml" ? v.loai_bcs : v.loaicongto;
                        str1 += "<tr>";
                        str1 += '<td> ' + (i + 1) + '</td >';
                        str1 += "<td>" + v.ma_khang + "</td>";
                        str1 += "<td>" + v.ma_ddo + "</td>";
                        str1 += "<td>" + v.sery_cto + "</td>";
                        str1 += "<td>" + imei_dcu + "</td>";
                        str1 += "<td>" + v.ten_khang + "</td>";
                        str1 += "<td>" + loaicongto + "</td>";
                        str1 += "<td>" + retNull(v.repeaterid) + "</td>";
                        str1 += "<td>" + retNull(v.ma_quyen) + "</td>";
                        str1 += "<td>" + retNull(v.ma_tram) + "</td>";
                        str1 += "<td>" + retNull(v.ma_cto) + "</td>";
                        str1 += "<td>" + retNull(v.so_hom) + "</td>";
                        str1 += "<td>" + retNull(v.sapxep) + "</td>";
                        str1 += "<td>" + retNull(v.hsn) + "</td>";
                        str1 += "<td>" + retNull(v.dia_chi) + "</td>";
                        str1 += "<td>" + thongbao + "</td>";
                        str1 += "<td>" + thongbaoketqua + "</td>";
                        str1 += "</tr>";
                    });
                    $('#data_table tbody').html(str1);
                    initDataTable();
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
                return;
            }

        });
    }
}

function fn_ThucHien_Khaibao() {
    const file = $('input[type="file"]')[0].files;
    if (!file) return false;
    const emptyFile = $('input[type="file"]')[0].files.length === 0
    $('#data_table').DataTable().rows().remove();
    $('#data_table').DataTable().destroy();
    if (emptyFile) {
        $('#data_table').addClass('hidden');
        toastr.error("Vui lòng chọn file", "Thông báo", {
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
        tableJson = []
        $('#data_table').removeClass('hidden')
        $('.alert').alert("close")
        var node = JSON.parse(localStorage.getItem("node"));
        const formData = new FormData();
        formData.append('file', file[0]);
        formData.append('type', chosen);
        formData.append('code', node.id);
        formData.append('mataikhoan', 1);
        $.ajax({
            url: "/api/khaibaokhachhang_thuchien",
            data: formData,
            type: "POST",
            processData: false, // Ngăn jQuery xử lý dữ liệu
            contentType: false, // Ngăn jQuery thiết lập contentType
            dataType: "json",
            success: function (result) {
                if (result.success == true) {
                    var arr = result.data;
                    var str1 = "";
                    $('#thuc_hien_khaibao').addClass('disabled').off('click');
                    const count_thanhcong = arr.filter(v => v.thongbao_ketqua === 'THÀNH CÔNG').length;
                    const count_tong = arr.length;

                    $('#print_section').empty().append(`<h4 style='font-size: 15px;'>Khai báo thành công: <span class="text-danger">${count_thanhcong}/${count_tong}</span> khách hàng</h4>`)


                    var activeRequestsTable = $('#data_table').DataTable();
                    activeRequestsTable.state.clear();
                    activeRequestsTable.destroy();
                    $("#data_table tbody").html("");
                    var chosen = $('input[name="checkfile"]:checked').val();
                    $.each(arr, function (i, v) {
                        var thongbao = v.thongbao == undefined ? "" : v.thongbao;
                        var thongbaoketqua = v.thongbao_ketqua == undefined ? "" : v.thongbao_ketqua;
                        var imei_dcu = v.imei_dcu;
                        var loaicongto = chosen == "xml" ? v.loai_bcs : v.loaicongto;
                        str1 += "<tr>";
                        str1 += '<td> ' + (i + 1) + '</td >';
                        str1 += "<td>" + v.ma_khang + "</td>";
                        str1 += "<td>" + v.ma_ddo + "</td>";
                        str1 += "<td>" + v.sery_cto + "</td>";
                        str1 += "<td>" + imei_dcu + "</td>";
                        str1 += "<td>" + v.ten_khang + "</td>";
                        str1 += "<td>" + loaicongto + "</td>";
                        str1 += "<td>" + retNull(v.repeaterid) + "</td>";
                        str1 += "<td>" + retNull(v.ma_quyen) + "</td>";
                        str1 += "<td>" + retNull(v.ma_tram) + "</td>";
                        str1 += "<td>" + retNull(v.ma_cto) + "</td>";
                        str1 += "<td>" + retNull(v.so_hom) + "</td>";
                        str1 += "<td>" + retNull(v.sapxep) + "</td>";
                        str1 += "<td>" + retNull(v.hsn) + "</td>";
                        str1 += "<td>" + retNull(v.dia_chi) + "</td>";
                        str1 += "<td>" + thongbao + "</td>";
                        str1 += "<td>" + thongbaoketqua + "</td>";
                        str1 += "</tr>";
                    });
                    $('#data_table tbody').html(str1);
                    initDataTable();
                    loadDataTree('001');
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
                return;
            }

        });
    }
}
