
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
    $("#txttungaydate").val(getDateTimeCurrent());
    $("#txtdenngaydate").val(getDateTimeCurrent());

    $("#btnthuchien_bdpt").click(function () {
        loadData_();
    });
    $("#cb_loaicambien").change(function () {
        loadData_();
    });
    loadData_();
});

function getDateTimeCurrent() {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    const day = currentDate.getDate();
    return `${day.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}/${year} `;
}


function loadData_() {
 
    $(".tab-content-css").show();

    const payload = {
        v_tungay: $("#txttungaydate").val(),
        v_denngay: $("#txtdenngaydate").val(),
        v_danhmucId: "001",
    };

    $.ajax({
        url: "/api/thongkedangnhap",
        type: "POST",
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify(payload),
        success: function (rows) {
            renderThongKeDangNhap(rows);
        },
        error: function (xhr) {
            const message = xhr?.responseJSON?.message || "Có lỗi xảy ra";
            showToastError(message);
            renderEmptyThongKeDangNhap("Không có dữ liệu");
        }
    });
}

function renderThongKeDangNhap(rows) {
    const $tbody = $("#tbl_thongkedangnhap tbody");
    $tbody.empty();

    if (!Array.isArray(rows) || rows.length === 0) {
        renderEmptyThongKeDangNhap("Không có dữ liệu");
        return;
    }

    const html = rows.map((item, index) => {
        const mataikhoan = replaceStrNull(item.mataikhoan);
        const taikhoan = escapeHtml(replaceStrNull(item.taikhoan));
        const thoidiem = escapeHtml(replaceStrNull(item.thoidiem));
        const solan = escapeHtml(replaceStrNull(item.solan));
        const tendanhmuc = escapeHtml(replaceStrNull(item.tendanhmuc));

        return `
            <tr>
                <td class="text-center">${index + 1}</td>
                <td>${taikhoan}</td>
                <td>${thoidiem}</td>
                <td class="text-center">${solan}</td>
                <td>${tendanhmuc}</td>
                <td class="text-center">
                    <a href="#"
                       class="btn btn-warning"
                       data-bs-toggle="modal"
                       data-bs-target="#modal-lichsuhoatdong"
                       onclick="Load_data_modal_CTO('${String(mataikhoan).replace(/'/g, "\\'")}')"
                       style="padding:0.5rem 1rem;">
                        <i class="fa fa-eye"></i>
                    </a>
                </td>
            </tr>
        `;
    }).join("");

    $tbody.html(html || getEmptyRowHtml("Không có dữ liệu hợp lệ"));
}

function Load_data_modal_CTO(mataikhoan) {
    getChiTietLichSuHoatDong(mataikhoan);
}
function getChiTietLichSuHoatDong(mataikhoan) {
    const payload = {
        v_mataikhoan: mataikhoan
    };

    $.ajax({
        url: "/api/chitietthongkedangnhap",
        type: "POST",
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify(payload),
        success: function (rows) {
            renderThongKeDangNhapChiTiet(rows);
        },
        error: function (xhr) {
            const message = xhr?.responseJSON?.message || "Có lỗi xảy ra";
            showToastError(message);
        }
    });
}
function renderThongKeDangNhapChiTiet(rows) {
    const $tbody = $("#tbl_thongkedangnhap_chitiet tbody");
    $tbody.empty();

    if (!Array.isArray(rows) || rows.length === 0) {
        $("#tbl_thongkedangnhap_chitiet tbody").html(`
         <tr>
            <td colspan="4" class="text-center text-muted">Không có dữ liệu</td>
         </tr>`);
        return;
    }

    const html = rows.map((item, index) => {
        const taikhoan = escapeHtml(replaceStrNull(item.taikhoan));
        const thoidiem = escapeHtml(replaceStrNull(item.thoidiem));
        const tendanhmuc = escapeHtml(replaceStrNull(item.tendanhmuc));

        return `
            <tr>
                <td class="text-center">${index + 1}</td>
                <td>${taikhoan}</td>
                <td class="text-center">${thoidiem}</td>
                <td>${tendanhmuc}</td>
            </tr>
        `;
    }).join("");

    $tbody.html(html || getEmptyRowHtml("Không có dữ liệu hợp lệ"));
    getStyleTable();
}
function renderEmptyThongKeDangNhap(message) {
    $("#tbl_thongkedangnhap tbody").html(getEmptyRowHtml(message));
}

function getEmptyRowHtml(message) {
    return `
        <tr>
            <td colspan="7" class="text-center text-muted">${escapeHtml(message)}</td>
        </tr>
    `;
}
function getStyleTable() {
  if ($.fn.DataTable.isDataTable("#tbl_thongkedangnhap_chitiet")) {
    $("#tbl_thongkedangnhap_chitiet").DataTable().destroy();
  }

  $("#tbl_thongkedangnhap_chitiet").DataTable({
    dom: '<"top"Bf>' +
      'rt' +
      '<"row mt-2"<"col-md-3"l><"col-md-9 text-end"p>>' +
      '<"row mt-2"<"col-12 text-center"i>>',
    buttons: [
      {
        extend: "excel",
        title: "Thống kê đăng nhập chi tiết",
        className: "btn btn-success",
        text: '<i class="fa fa-file-excel-o"></i> Xuất Excel'
       
      }
    ],
    paging: true,
    lengthChange: true,
    searching: true,
    ordering: true,
    info: true,
    autoWidth: false,
    responsive: false,
    scrollX: true,
    scrollCollapse: true,
    pagingType: "full_numbers",
   
    language: {
      sProcessing: "Đang xử lý...",
      sLengthMenu: "Xem _MENU_ bản ghi",
      sZeroRecords: "Không tìm thấy dòng nào phù hợp",
      sInfo: "Đang xem _START_ đến _END_ trong tổng số _TOTAL_ bản ghi",
      sInfoEmpty: "Đang xem 0 đến 0 trong tổng số 0 bản ghi",
      sInfoFiltered: "(được lọc từ _MAX_ bản ghi)",
      sInfoPostFix: "",
      sSearch: "Tìm kiếm:",
      sUrl: "",
      oPaginate: {
        sFirst: "Đầu",
        sPrevious: "Trước",
        sNext: "Tiếp",
        sLast: "Cuối"
      }
    },
    initComplete: function () {
      this.api().columns.adjust();
    }
  });

  setTimeout(function () {
    $("#tbl_thongkedangnhap_chitiet").DataTable().columns.adjust();
  }, 200);
}
function getSelectedNode() {
    try {
        const raw = localStorage.getItem("node");
        return raw ? JSON.parse(raw) : null;
    } catch (error) {
        console.error("Lỗi parse node trong localStorage:", error);
        return null;
    }
}

function replaceStrNull(value) {
    return value === null || value === undefined || value === "" ? "-" : value;
}

function escapeHtml(value) {
    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function showToastError(message) {
    toastr.error(message, "Thông báo", {
        positionClass: "toast-bottom-right",
        timeOut: 5000,
        closeButton: true,
        debug: false,
        newestOnTop: true,
        progressBar: true,
        preventDuplicates: true,
        onclick: null,
        showDuration: "300",
        hideDuration: "1000",
        extendedTimeOut: "1000",
        showEasing: "swing",
        hideEasing: "linear",
        showMethod: "fadeIn",
        hideMethod: "fadeOut",
        tapToDismiss: false
    });
}