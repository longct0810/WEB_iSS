$(document).ready(function () {
    
  //  load_permission() ;
    get_danhmuc(0, "01");
    // traCuu_ThongTinBDS();
    $("#btn_tracuu").click(function () {
        traCuu_ThongTinBDS();
    });
    var startDate = '2024-07-20'; // YYYY-MM-DD format
    var numberOfDays = 30;
    generateDateRangeColumns(startDate, numberOfDays);

})


function get_danhmuc(type, code) {
    if (type == 0) {
        $.ajax({
            type: "POST",
            url: "/api/ds_danhmuc",
            contentType: "application/json",
            data: JSON.stringify({ type: type, code: code }),
            success: function (data) {
                $("#select_tp").html("<option value='-1'> -- Chọn thành phố --</option>");
                $.each(data, function (k, v) {
                    $("#select_tp").append("<option value='" + JSON.parse(v[0]).ID_KHUVUC + "'>" + JSON.parse(v[0]).TEN_KHUVUC + "</option>");
                }) 
            }
        });
    } else {
        $.ajax({
            type: "POST",
            url: "/api/ds_danhmuc",
            contentType: "application/json",
            data: JSON.stringify({ type: type, code: code }),
            success: function (data) { 
                $.each(data, function (k, v) {
                    if (type == 1) {
                        $("#select_quan").append("<option value='" + JSON.parse(v[0]).ID_KHUVUC + "'>" + JSON.parse(v[0]).TEN_KHUVUC + "</option>");

                    }
                    else if (type == 2) {
                        $("#select_phuong").append("<option value='" + JSON.parse(v[0]).ID_KHUVUC + "'>" + JSON.parse(v[0]).TEN_KHUVUC + "</option>");

                    } 
                })
            }
        });

    }

    $("#select_tp").select2();
    $("#select_tp").on("change", function () {
        var selectedTp = $(this).val();
        $("#select_quan").html("<option value='-1'> -- Chọn Quận --</option>");
        $("#select_phuong").html("<option value='-1'> -- Chọn Phường --</option>");
        get_danhmuc(1, selectedTp)
    });
    $("#select_quan").select2();
    $("#select_quan").on("change", function () {
        var selectedTp = $(this).val();
        $("#select_phuong").html("<option value='-1'> -- Chọn Phường --</option>");
        get_danhmuc(2, selectedTp)
    });
    $("#select_phuong").select2();
    $("#select_typebds").select2();  
}

var barChart2 = function (data) {
    $("#vebieudo").html("");
    let labels = [];
    let data1Pha = []; 
    // if (jQuery('#barChart_2').length > 0) {
    $.each(data, function (index, item) {
        labels.push(item.thoidiem);
        data1Pha.push(item.giaban_m2);
    }); 
    //gradient bar chart
    $("#vebieudo").html(`<canvas id="barChart_2"></canvas>`);
    const barChart_2 = document.getElementById("barChart_2").getContext('2d');
    //generate gradient
    const barChart_2gradientStroke = barChart_2.createLinearGradient(0, 0, 0, 250);
    barChart_2gradientStroke.addColorStop(0, "rgba(91, 207, 197, 1)");
    barChart_2gradientStroke.addColorStop(1, "rgba(91, 207, 197, 0.5)"); 
    barChart_2.height = 100; 
    new Chart(barChart_2, {
        type: 'bar',
        data: {
            defaultFontFamily: 'Poppins',
            labels: labels,
            datasets: [
                {
                    label: "Giá trung bình (Tr/m2)",
                    data: data1Pha,
                    borderColor: barChart_2gradientStroke,
                    borderWidth: "0",
                    backgroundColor: barChart_2gradientStroke,
                    hoverBackgroundColor: barChart_2gradientStroke
                }
            ]
        },
        options: {
            legend: false,
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }],
                xAxes: [{
                    // Change here
                    barPercentage: 0.5
                }]
            }
        }
    });
    //}
}
function traCuu_ThongTinBDS() {
    var idkhuvuc_quan = $("#select_quan").val();
    var idkhuvuc_phuong = $("#select_phuong").val();
    var idkhuvuc_tp = $("#select_tp").val(); 
    if (idkhuvuc_tp == "-1") {
        toastr.error("Vui lòng chọn thành phố", "Thông báo", {
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
        })
        return;
    }

    var idkhuvuc = "-1";
    if (idkhuvuc_tp != "-1" && idkhuvuc_quan == "-1") {
        idkhuvuc = idkhuvuc_tp;
    }
    else if (idkhuvuc_tp != "-1" && idkhuvuc_quan != "-1" && idkhuvuc_phuong == "-1") {
        idkhuvuc = idkhuvuc_quan;
    }
    else if (idkhuvuc_tp != "-1" && idkhuvuc_quan != "-1" && idkhuvuc_phuong != "-1") {
        idkhuvuc = idkhuvuc_phuong;
    }

    var loaibds = $("#select_typebds").val();
    $.ajax({
        type: "POST",
        url: "/api/tracuuthongtinnhadat",
        contentType: "application/json",
        data: JSON.stringify({ v_khuvucid: idkhuvuc, v_loai_bds: loaibds }),
        success: function (data) {
            $.each(data, function (index, element) { 
                var result = JSON.parse(element);
                if (result.type == "caonhat") {
                    $("#giabantheom2_caonhat").html(result.giaban_m2);
                    $("#tenbds_caonhat").html(result.tenbds);
                    $("#dientinhso_caonhat").html(result.dientich_so + " m<sup>2</sup>");
                    $("#dientinhthucte_caonhat").html(result.dientich_thucte + " m<sup>2</sup>");
                    $("#matien_caonhat").html(SetValnull(result.so_mattien));
                    $("#duongtruocnha_caonhat").html(result.khoangcach_den_duonglon + " m");
                    $("#giaban_caonhat").html(new Intl.NumberFormat().format(result.giaban) + " VNĐ");
                    $("#chitiet_caonhat").attr("data-id", result.id);
                }
                else if (result.type == "thapnhat") {
                    $("#giathapm2_thapnhat").html(result.giaban_m2);
                    $("#tenbds_thapnhat").html(result.tenbds);
                    $("#dientichso_thapnhat").html(result.dientich_so + " m<sup>2</sup>");
                    $("#dientichthucte_thapnhat").html(result.dientich_thucte + " m<sup>2</sup>");
                    $("#mattien_thapnhat").html(SetValnull(result.so_mattien));
                    $("#duongtruocnha_thapnhat").html(result.khoangcach_den_duonglon + " m");
                    $("#giaban_thapnhat").html(new Intl.NumberFormat().format(result.giaban) + " VNĐ");
                    $("#chitiet_thapnhat").attr("data-id", result.id);
                }
                else if (result.type == "moinhat") {
                    $("#giathapm2_moinhat").html(result.giaban_m2);
                    $("#tenbds_moinhat").html(result.tenbds);
                    $("#dientichso_moinhat").html(result.dientich_so + " m<sup>2</sup>");
                    $("#dientichthucte_moinhat").html(result.dientich_thucte + " m<sup>2</sup>");
                    $("#mattien_moinhat").html(SetValnull(result.so_mattien));
                    $("#duongtruocnha_moinhat").html(result.khoangcach_den_duonglon + " m");
                    $("#giaban_moinhat").html(new Intl.NumberFormat().format(result.giaban) + " VNĐ");
                    $("#chitiet_moinhat").attr("data-id", result.id);
                }
                else if (result.type == "trungbinh") {
                    var data = result.arraytb;
                    if (data == null) {
                        $(".card_body_khongcodulieu").show();
                        $(".card_body_khongcodulieu").html("<span>Không có dữ liệu</span>");
                        $(".card-body").hide();
                        $("#chitiet_thapnhat").attr("disabled");
                        $("#chitiet_caonhat").attr("disabled");
                        $("#chitiet_moinhat").attr("disabled")
                    } else {
                        $(".card-body").show();
                        $(".card_body_khongcodulieu").hide();
                        barChart2(data);
                        $("#chitiet_thapnhat").attr("disabled", false);
                        $("#chitiet_caonhat").attr("disabled", false);
                        $("#chitiet_moinhat").attr("disabled", false);
                    }
                }
                else if (result.type == "thongtinnhadat") {
                    var data = result.arraytb;
                    if (data == null) {
                        $(".card_body_khongcodulieu").show();
                        $(".card_body_khongcodulieu").html("<span>Không có dữ liệu</span>");
                        $(".card-body").hide();
                        $("#chitiet_thapnhat").attr("disabled");
                        $("#chitiet_caonhat").attr("disabled");
                        $("#chitiet_moinhat").attr("disabled")
                    } else {
                        $(".card-body").show();
                        $(".card_body_khongcodulieu").hide();
                        danhSachThongTinNhaDat(data);
                        $("#chitiet_thapnhat").attr("disabled", false);
                        $("#chitiet_caonhat").attr("disabled", false);
                        $("#chitiet_moinhat").attr("disabled", false);
                    }
                }
            }) 
        }
    });
}
function danhSachThongTinNhaDat(data) {
    $("#tbl_dsthongtinnhadat tbody").html("");
    var activeRequestsTable = $("#tbl_dsthongtinnhadat").DataTable();
    activeRequestsTable.state.clear();
    activeRequestsTable.destroy();
    var row = ""; 
    $.each(data, function (index, item) {
        var giaban = new Intl.NumberFormat().format(item.giaban);
        var giaban_m2 = new Intl.NumberFormat().format(item.giaban_m2);
        row += "<tr>";
        row += "<td>" + (index + 1) + "</td>";
        row += "<td>" + item.tenbds + "</td>";
        row += "<td>" + giaban + "</td>";
        row += "<td>" + giaban_m2 + "</td>";
        row += "<td>" + item.dientich_so + "</td>";
        row += "<td>" + item.dientich_thucte + "</td>";
        row += "<td>" + SetValnull(item.so_mattien) + "</td>";
        row += "<td>" + item.khoangcach_den_duonglon + "</td>";
        row += "<td>" + item.thoidiem + "</td>";
        row += `<td style="text-align: center;"><a href="javascript:void(0);" data-bs-toggle="modal" data-id="${item.id}"
                                                        data-bs-target="#thongtinnhadat_modal"
                                                        onclick="traCuu_ChiTiet_ThongTinBDS(this)"
                                                        class="btn btn-primary shadow btn-xs sharp me-1"><i class="fas fa-pencil-alt"></i></a></td>`;
        row += "</tr>";
    });
    $("#tbl_dsthongtinnhadat tbody").html(row);
    getStyleTable1(); 
}
function generateDateRangeColumns(startDate, numberOfDays) {
    var start = new Date(startDate),
        end = new Date(start); 
    end.setDate(start.getDate() + numberOfDays); 
    var $table = $('<table>').addClass('date-range-table table table-bordered table-striped no-footer dataTable'),
        $thead = $('<thead>'),
        $trHead = $('<tr>'),
        $tbody = $('<tbody>'),
        currentDate = new Date(start); 
    for (var i = 0; i < numberOfDays; i++) {
        var day = currentDate.getDate(),
            month = currentDate.getMonth() + 1,
            year = currentDate.getFullYear();
        $trHead.append('<th>' + day + '-' + month + '</th>');
        currentDate.setDate(currentDate.getDate() + 1);
    }
    $thead.append($trHead);
    $table.append($thead); 
    var $tr = $('<tr>');
    for (var i = 0; i < numberOfDays; i++) {
        $tr.append('<td></td>');
    }
    $tbody.append($tr);
    $table.append($tbody); 
    $('.table-test').append($table);
}

function getStyleTable1() {
    var table = $('#tbl_dsthongtinnhadat').DataTable({
        createdRow: function (row, data, index) {
            $(row).addClass('selected')
        },
        language: {
            paginate: {
                next: '<i class="fa fa-angle-double-right" aria-hidden="true"></i>',
                previous: '<i class="fa fa-angle-double-left" aria-hidden="true"></i>'
            },
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
            },
            "ordering": false,
        }
    });


    table.on('click', 'tbody tr', function () {
        var $row = table.row(this).nodes().to$();
        var hasClass = $row.hasClass('selected');
        if (hasClass) {
            $row.removeClass('selected')
        } else {
            $row.addClass('selected')
        }
    })

    table.rows().every(function () {
        this.nodes().to$().removeClass('selected')
    });

}
function traCuu_ChiTiet_ThongTinBDS(event) {
    var id = $(event).data(id).id;
    $.ajax({
        type: "POST",
        url: "/api/chitietthongtinnhadat",
        contentType: "application/json",
        data: JSON.stringify({ v_id: id }),
        success: function (data) {
            $.each(data, function (index, element) {
                var result = JSON.parse(element);
                if (result.loaibds == 1) {
                    $("#tab_dat").addClass("active");
                    $("#tab_nha").removeClass("active");
                    $("#tab_nha").css('display', 'none');
                    $("#select_tp_modal").html(result.khuvucid_tp);
                    $("#select_quan_modal").html(result.khuvucid_quan);
                    $("#select_phuong_modal").html(result.khuvucid_phuong);
                    $("#txtdiachi_dat").html(result.tenbds);
                    $("#txt_dientich_trenso_dat").html(result.dientich_so);
                    $("#txt_dientich_thucte_dat").html(result.dientich_thucte);
                    $("#txt_kichthuoc_longduong_dat").html(SetValnull(result.kichthuoc_duong_truocnha_longduong));
                    $("#txt_kichthuoc_viave").html(SetValnull(result.kichthuoc_duong_truocnha_viahe));
                    $("#cbo_loaiduong_dat").html(SetValnull(result.loai_duong));
                    $("#cbo_hinhthai_thuadat_dat").html(SetValnull(result.hinhthai_thuadat));
                    $("#txt_huong_dat").html(SetValnull(result.huong));
                    $("#txt_mota_dat").html(result.mota);
                    $("#txt_somattien_dat").html(SetValnull(result.soa_mattien));
                    $("#txt_kichthuoc_mattien_dat").html(SetValnull(result.kichthuoc_mattien));
                    $("#txt_khoangcach_duonglon_dat").html(SetValnull(result.khoangcach_den_duonglon));
                    $("#txt_tinhtrang_congtrinh_dat").html(SetValnull(result.tinhtrang_congtrinh));
                    $("#cb_nohau_dat").html(result.no_hau);
                    $("#cb_trangthai_dat").html(result.trangthai);
                    $("#txt_giaban_dat").html(new Intl.NumberFormat().format(result.giaban));
                    $("#txt_giabantext_dat").html(new Intl.NumberFormat().format(result.giaban_m2) + " Triệu / m<sup>2</sup>");
                    $("#cbo_nguontin_dat").html(result.nguon_tin);
                    $("#dt_thoidiem_dat").html(result.thoidiem);
                } else {
                    $("#tab_nha").addClass("active");
                    $("#tab_dat").removeClass("active");
                    $("#tab_dat").css('display', 'none');
                    $("#select_tp_nha_modal").html(result.khuvucid_tp);
                    $("#select_quan_nha_modal").html(result.khuvucid_quan);
                    $("#select_phuong_nha_modal").html(result.khuvucid_phuong);
                    $("#txtdiachi_nha").html(result.tenbds);
                    $("#txt_sotang_nha").html(result.sotang);
                    $("#txt_loaimai_nha").html(SetValnull(result.loaimai));
                    $("#txt_dientich_so_nha").html(result.dientich_so);
                    $("#txt_dientich_thucte_nha").html(result.dientich_thucte);
                    $("#cbo_loaimai_nha").html(SetValnull(result.loaimai));
                    $("#txt_kichthuoc_longduong_nha").html(SetValnull(result.kichthuoc_duong_truocnha_longduong));
                    $("#txt_kichthuoc_viahe_nha").html(SetValnull(result.kichthuoc_duong_truocnha_viahe));
                    $("#cbo_loaiduong_nha").html(SetValnull(result.loai_duong));
                    $("#cbo_hinhthai_thuadat_nha").html(SetValnull(result.hinhthai_thuadat));
                    $("#txt_huong_nha").html(SetValnull(result.huong));
                    $("#txt_mota_nha").html(SetValnull(result.mota));
                    $("#txt_somattien_nha").html(SetValnull(result.soa_mattien));
                    $("#txt_kichthuoc_matien_nha").html(SetValnull(result.kichthuoc_mattien));
                    $("#txt_kichthuoc_duonglon_nha").html(SetValnull(result.khoangcach_den_duonglon));
                    $("#cbo_sudungdat_nha").html(SetValnull(result.hientrang_sudung));
                    $("#txt_tinhtrang_congtrinh_nha").html(SetValnull(result.tinhtrang_congtrinh));
                    $("#cb_nohau_nha").html(SetValnull(result.no_hau));
                    $("#cb_trangthai_nha").html(result.trangthai);
                    $("#txt_giaban_nha").html(new Intl.NumberFormat().format(result.giaban));
                    $("#txt_giabantext_nha").html(new Intl.NumberFormat().format(result.giaban_m2) + " Triệu / m<sup>2</sup>");
                    $("#cbo_nguontin_nha").html(SetValnull(result.nguon_tin));
                    $("#dt_thoidiem_nha").html(SetValnull(result.thoidiem));
                }


            })

        }
    });
}

function SetValnull(val) {
    try {
        if (val == null || val == 'null') {
            return '-'
        } else {
            return val
        }
    } catch (e) {
        console.log(e)
    }
}

