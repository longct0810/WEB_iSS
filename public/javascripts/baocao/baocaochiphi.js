

$(document).ready(function () {
    if (!localStorage.getItem("us")) {
        window.location.href = "../login";
    }
    getDuAn();

    $("#btn_luuthongtin").click(function () {
        f_Get_BaoCaoChiPhi();
    });


})

function getDuAn() {
    $.ajax({
        type: "GET",
        url: "/api/khaibaovttb_laythongtin_duan",
        contentType: "application/json",
        success: function (data) {
            $("#select_duan").html("<option value='-1'> -- Chọn dự án --</option>");
            $.each(data, function (k, v) {
                $("#select_duan").append("<option value='" + JSON.parse(v[0]).ma_duan + "'>" + JSON.parse(v[0]).ten_duan + "</option>");
            })
        }
    });
    $("#select_duan").select2();
    $("#select_duan").on("change", function () {
        var selectedDA = $(this).val();
        $("#select_hangmuc").html("<option value='-1'> -- Chọn hạng mục --</option>");
        getHangMuc(selectedDA)
    });
    $("#select_hangmuc").select2();

}



function getHangMuc(duanid) {
    $.ajax({
        type: "POST",
        url: "/api/khaibaovttb_getthongtin_hangmuc",
        contentType: "application/json",
        data: JSON.stringify({ v_maduan: duanid }),
        success: function (data) {
            $("#select_hangmuc").html("<option value='-1'> --  Chọn hạng mục --</option>");
            $.each(data, function (k, v) {
                var dt = JSON.parse(v[0]);
                $("#select_hangmuc").append("<option value='" + JSON.parse(v[0]).ma_hangmuc + "'>" + JSON.parse(v[0]).ten_hangmuc + "</option>");
            })
        }
    });

}

function f_Get_BaoCaoChiPhi() {

    var maduan = $("#select_duan").val();
    var mahangmuc = $("#select_hangmuc").val();

    if (maduan == "-1") {
        toastr.error("Vui lòng nhập chọn dự án", "Thông báo", {
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
    $.ajax({
        type: "POST",
        url: "/api/baocaochiphi",
        contentType: "application/json",
        data: JSON.stringify({
            v_maduan: maduan,
            v_mahangmuc: mahangmuc
        }),
        success: function (data) {

            const select2Data = [];
            let row = "";

            // Process data to build select2Data
            $.each(data, function (k, v) {
                const dt = JSON.parse(v[0]);
                const option = {
                    stt: k + 1,
                    id: dt.ma_hangmuc,
                    ten_hangmuc: dt.ten_hangmuc,
                    dongia: dt.dongia,
                    soluong: dt.soluong,
                    thanhtien: dt.thanhtien,
                    children: []
                };

                if (dt.level1 === 1) {
                    select2Data.push(option);
                } else {
                    const parentOption = select2Data.find(opt => opt.id === dt.ma_hangmuc.substring(0, 3));
                    if (parentOption) {
                        parentOption.children.push(option);
                    } else {
                        select2Data.push(option);
                    }
                }
            });

            // Clear the existing table body and DataTable instance
            $("#tbl_baocaochiphi tbody").empty();
            var activeRequestsTable = $("#tbl_baocaochiphi").DataTable();
            activeRequestsTable.clear().destroy();

            // Build table rows
            $.each(select2Data, function (key, item) {

                if (item.id === "0") {
                    row += `<tr class="tr_color_total bg-secondary">`;
                    row += `<td></td><td style="" >${item.ten_hangmuc}</td><td class='text-right'>${new Intl.NumberFormat().format(item.soluong)}</td><td class='text-right'>${new Intl.NumberFormat().format(item.dongia)}</td><td class='text-right'>${new Intl.NumberFormat().format(item.thanhtien)}</td>`;
                    row += "</tr>";
                } else {
                    row += `<tr style="vertical-align: middle; font-weight: bold;background-color: #eefaf9 !important;" class="tr_color">`;
                    row += `<td>${key}</td><td>${item.ten_hangmuc}</td><td class='text-right'>${new Intl.NumberFormat().format(item.soluong)}</td><td class='text-right'>${new Intl.NumberFormat().format(item.dongia)}</td><td class='text-right'>${new Intl.NumberFormat().format(item.thanhtien)}</td>`;
                    row += "</tr>";
                }


                $.each(item.children, function (key1, item1) {
                    row += `<tr  style="vertical-align: middle; font-weight: nomal;">`;
                    row += `<td></td><td>${item1.ten_hangmuc}</td><td class='text-right'>${new Intl.NumberFormat().format(item1.soluong)}</td><td class='text-right'>${new Intl.NumberFormat().format(item1.dongia)}</td><td class='text-right'>${new Intl.NumberFormat().format(item1.thanhtien)}</td>`;
                    row += "</tr>";
                });
            });

            // Append rows to the table
            $('#tbl_baocaochiphi tbody').append(row);

            // Reinitialize DataTable
            getStyleTable1();


        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(jqXHR);
            console.log(textStatus);
            console.log(errorThrown);
        }
    });

}
function getStyleTable1() {

    var table = $('#tbl_baocaochiphi').DataTable({
        dom: 'Brtp',
        buttons: [
            {
                extend: 'excelHtml5',
                filename: 'BaoCaoChiPhi', // Custom filename without extension
                title: 'BÁO CÁO CHI PHÍ', // Title in the exported file              
                customize: function (xlsx) {
                    var sheet = xlsx.xl.worksheets['sheet1.xml'];
                    $('row:eq(2) c', sheet).attr('s', '2'); // Đây áp dụng một style (s='2') để bôi đậm cho tất cả các ô (c) trong hàng thứ ba.

                }
            },
            {
                extend: 'print',
                title: 'BÁO CÁO CHI PHÍ',
                // messageTop: 'BÁO CÁO CHI PHÍ' // Title/message at the top of the printout
            }
        ],
        'paging': false,
        "ordering": false,
        "search": false,
        "fixedHeader": true


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