
let isReading = false;
let stopReading = false;
const seasonDays = {
    1: [],
    2: [],
    3: [],
    4: []
};
let LAST_METER_PASSWORD = null;
let FAILED_OBIS_MAP = {};
$(document).ready(function () {
    if (!localStorage.getItem("us")) {
        window.location.href = "../login";
    }
    handleSidebarNode();

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
    $("#txt_thoigianduytri").val(getDateTimeCurrent());
});
function handleSidebarNode() {

    $("#msg").html("").hide();
    var node = JSON.parse(localStorage.getItem("node"));
    let loaithumuc = node.type;
    if (loaithumuc != 9) {
        toastr.error("Vui lòng chọn công tơ cần cấu hình ở cây thư mục", "Thông báo", {
            positionClass: "toast-top-right",
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
    let loaipha = node.loaipha;
    $("#titlecongto").html(`
        <div class="meter-header">
            <div class="meter-title">
                ⚙️ Cấu hình cảnh báo sự kiện công tơ: <span>${node.socongto}
            </div>
          
        </div>
    `);
    if (loaipha == 1 || loaipha == 13) {
        f_loaisukien1Pha()
    } else {
        f_loaisukien3Pha()
    }


}
function getDateTimeCurrent() {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    const day = currentDate.getDate();
    return `${day.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}/${year} `;
}
function f_loaisukien3Pha() {
    $("#eventSelect").html("");
    // =========================
    // 1. Data cấu hình sự kiện
    // =========================
    const eventConfigs = {
        // ================= CÀI ĐẶT BIỂU GIÁ =================

        TOU_SEASON_ACTIVE_TIME: {
            group: "Cài đặt biểu giá mùa",
            displayName: "Cài thời gian kích hoạt của từng mùa",
            params: [
                {
                    id: "seasonActiveTime",
                    viName: "Thời gian kích hoạt của từng mùa",
                    enName: "Season active time",
                    obis: "0.0.13.0.0",
                    unit: "DateTime",
                    fomat: "YYYY-MM-DD HH:mm:ss"
                }
            ]
        },
        TOU_TARIFF_SEASON_1: {
            group: "Cài đặt biểu giá mùa",
            displayName: "Cài đặt biểu giá, thời gian mùa 1",
            params: [
                {
                    id: "dinhnghiangaylamviecmua1",
                    viName: "Định nghĩa ngày làm việc, ngày cuối tuần mùa 1",
                    enName: "Định nghĩa ngày làm việc, ngày cuối tuần mùa 1",
                    obis: "0.0.13.1.1",
                    unit: "Time",
                    fomat: "HH:mm"
                },
                {
                    id: "caidatthoigianbieugiangaylamviecmua1",
                    viName: "Cài thời gian chuyển biểu giá ngày làm việc mùa 1",
                    enName: "Cài thời gian chuyển biểu giá ngày làm việc mùa 1",
                    obis: "0.0.13.2.1",
                    unit: "Time",
                    fomat: "HH:mm"
                },
                {
                    id: "caidatthoigianbieugiangaycuoituanmua1",
                    viName: "Cài thời gian chuyển biểu giá ngày cuối tuần mùa 1",
                    enName: "Cài thời gian chuyển biểu giá ngày cuối tuần mùa 1",
                    obis: "0.0.13.2.2",
                    unit: "Time",
                    fomat: "HH:mm"
                }
            ]
        },
        TOU_TARIFF_SEASON_2: {
            group: "Cài đặt biểu giá mùa",
            displayName: "Cài đặt biểu giá, thời gian mùa 2",
            params: [
                {
                    id: "dinhnghiangaylamviecmua2",
                    viName: "Định nghĩa ngày làm việc, ngày cuối tuần mùa 2",
                    enName: "Định nghĩa ngày làm việc, ngày cuối tuần mùa 2",
                    obis: "0.0.13.1.2",
                    unit: "Time",
                    fomat: "HH:mm"
                },
                {
                    id: "caidatthoigianbieugiangaylamviecmua2",
                    viName: "Thời gian chuyển biểu giá ngày làm việc mùa 2",
                    enName: "Thời gian chuyển biểu giá ngày làm việc mùa 2",
                    obis: "0.0.13.2.3",
                    unit: "Time",
                    fomat: "HH:mm"
                },
                {
                    id: "caidatthoigianbieugiangaycuoituanmua2",
                    viName: "Thời gian chuyển biểu giá ngày cuối tuần mùa 2",
                    enName: "Thời gian chuyển biểu giá ngày cuối tuần mùa 2",
                    obis: "0.0.13.2.4",
                    unit: "Time",
                    fomat: "HH:mm"
                }
            ]
        },
        TOU_TARIFF_SEASON_3: {
            group: "Cài đặt biểu giá mùa",
            displayName: "Cài đặt biểu giá, thời gian mùa 3",
            params: [
                {
                    id: "dinhnghiangaylamviecmua3",
                    viName: "Định nghĩa ngày làm việc, ngày cuối tuần mùa 3",
                    enName: "Định nghĩa ngày làm việc, ngày cuối tuần mùa 3",
                    obis: "0.0.13.1.3",
                    unit: "Time",
                    fomat: "HH:mm"
                },
                {
                    id: "caidatthoigianbieugiangaylamviecmua3",
                    viName: "Thời gian chuyển biểu giá ngày làm việc mùa 3",
                    enName: "Thời gian chuyển biểu giá ngày làm việc mùa 3",
                    obis: "0.0.13.2.5",
                    unit: "Time",
                    fomat: "HH:mm"
                },
                {
                    id: "caidatthoigianbieugiangaycuoituanmua3",
                    viName: "Thời gian chuyển biểu giá ngày cuối tuần mùa 3",
                    enName: "Thời gian chuyển biểu giá ngày cuối tuần mùa 3",
                    obis: "0.0.13.2.6",
                    unit: "Time",
                    fomat: "HH:mm"
                }
            ]
        },
        TOU_TARIFF_SEASON_4: {
            group: "Cài đặt biểu giá mùa",
            displayName: "Cài đặt biểu giá, thời gian mùa 4",
            params: [
                {
                    id: "dinhnghiangaylamviecmua4",
                    viName: "Định nghĩa ngày làm việc, ngày cuối tuần mùa 4",
                    enName: "Định nghĩa ngày làm việc, ngày cuối tuần mùa 4",
                    obis: "0.0.13.1.4",
                    unit: "Time",
                    fomat: "HH:mm"
                },
                {
                    id: "caidatthoigianbieugiangaylamviecmua4",
                    viName: "Thời gian chuyển biểu giá ngày làm việc mùa 4",
                    enName: "Thời gian chuyển biểu giá ngày làm việc mùa 4",
                    obis: "0.0.13.2.7",
                    unit: "Time",
                    fomat: "HH:mm"
                },
                {
                    id: "caidatthoigianbieugiangaycuoituanmua4",
                    viName: "Thời gian chuyển biểu giá ngày cuối tuần mùa 4",
                    enName: "Thời gian chuyển biểu giá ngày cuối tuần mùa 4",
                    obis: "0.0.13.2.8",
                    unit: "Time",
                    fomat: "HH:mm"
                }
            ]
        },
        METER_TIME_SETTING: {
            group: "Cài đặt thời gian",
            displayName: "Cài thời gian công tơ",
            params: [
                {
                    id: "meterTimeSetting",
                    viName: "Cài thời gian công tơ",
                    enName: "Set meter time",
                    obis: "0.0.0.9.4",
                    unit: "DateTime",
                    fomat: "YYMMDDHHmmss"
                }
            ]
        },
        FUTURE_TOU_SEASON_ACTIVE_TIME: {
            group: "Biểu giá tương lai (dự phòng)",
            displayName: "Cài thời gian kích hoạt của từng mùa",
            displayName: "Cài thời gian kích hoạt của từng mùa",
            params: [
                {
                    id: "futureseasonActiveTime",
                    viName: "Thời gian kích hoạt của từng mùa",
                    enName: "Season active time",
                    obis: "0.0.13.0.10",
                    unit: "DateTime",
                    fomat: "YYYY-MM-DD HH:mm:ss"
                }
            ]
        },
        FUTURE_TARIFF_SEASON_1: {
            group: "Biểu giá tương lai (dự phòng)",
            displayName: "Cài đặt biểu giá, thời gian mùa 1",
            params: [
                {
                    id: "futuredinhnghiangaylamviecmua1",
                    viName: "Định nghĩa ngày làm việc, ngày cuối tuần mùa 1",
                    enName: "Định nghĩa ngày làm việc, ngày cuối tuần mùa 1",
                    obis: "0.0.13.1.11",
                    unit: "Time",
                    fomat: "HH:mm"
                },
                {
                    id: "futurecaidatthoigianbieugiangaylamviecmua1",
                    viName: "Cài thời gian chuyển biểu giá ngày làm việc mùa 1",
                    enName: "Cài thời gian chuyển biểu giá ngày làm việc mùa 1",
                    obis: "0.0.13.2.11",
                    unit: "Time",
                    fomat: "HH:mm"
                },
                {
                    id: "futurecaidatthoigianbieugiangaycuoituanmua1",
                    viName: "Cài thời gian chuyển biểu giá ngày cuối tuần mùa 1",
                    enName: "Cài thời gian chuyển biểu giá ngày cuối tuần mùa 1",
                    obis: "0.0.13.2.12",
                    unit: "Time",
                    fomat: "HH:mm"
                }
            ]
        },
        FUTURE_TARIFF_SEASON_2: {
            group: "Biểu giá tương lai (dự phòng)",
            displayName: "Cài đặt biểu giá, thời gian mùa 2",
            params: [
                {
                    id: "futuredinhnghiangaylamviecmua2",
                    viName: "Định nghĩa ngày làm việc, ngày cuối tuần mùa 2",
                    enName: "Định nghĩa ngày làm việc, ngày cuối tuần mùa 2",
                    obis: "0.0.13.1.12",
                    unit: "Time",
                    fomat: "HH:mm"
                },
                {
                    id: "futurecaidatthoigianbieugiangaylamviecmua2",
                    viName: "Cài thời gian chuyển biểu giá ngày làm việc mùa 2",
                    enName: "Cài thời gian chuyển biểu giá ngày làm việc mùa 2",
                    obis: "0.0.13.2.13",
                    unit: "Time",
                    fomat: "HH:mm"
                },
                {
                    id: "futurecaidatthoigianbieugiangaycuoituanmua2",
                    viName: "Cài thời gian chuyển biểu giá ngày cuối tuần mùa 2",
                    enName: "Cài thời gian chuyển biểu giá ngày cuối tuần mùa 2",
                    obis: "0.0.13.2.14",
                    unit: "Time",
                    fomat: "HH:mm"
                }
            ]
        },
        FUTURE_TARIFF_SEASON_3: {
            group: "Biểu giá tương lai (dự phòng)",
            displayName: "Cài đặt biểu giá, thời gian mùa 3",
            params: [
                {
                    id: "futuredinhnghiangaylamviecmua3",
                    viName: "Định nghĩa ngày làm việc, ngày cuối tuần mùa 3",
                    enName: "Định nghĩa ngày làm việc, ngày cuối tuần mùa 3",
                    obis: "0.0.13.1.13",
                    unit: "Time",
                    fomat: "HH:mm"
                },
                {
                    id: "futurecaidatthoigianbieugiangaylamviecmua3",
                    viName: "Cài thời gian chuyển biểu giá ngày làm việc mùa 3",
                    enName: "Cài thời gian chuyển biểu giá ngày làm việc mùa 3",
                    obis: "0.0.13.2.15",
                    unit: "Time",
                    fomat: "HH:mm"
                },
                {
                    id: "futurecaidatthoigianbieugiangaycuoituanmua3",
                    viName: "Cài thời gian chuyển biểu giá ngày cuối tuần mùa 3",
                    enName: "Cài thời gian chuyển biểu giá ngày cuối tuần mùa 3",
                    obis: "0.0.13.2.16",
                    unit: "Time",
                    fomat: "HH:mm"
                }
            ]
        },
        FUTURE_TARIFF_SEASON_4: {
            group: "Biểu giá tương lai (dự phòng)",
            displayName: "Cài đặt biểu giá, thời gian mùa 4",
            params: [
                {
                    id: "futuredinhnghiangaylamviecmua4",
                    viName: "Định nghĩa ngày làm việc, ngày cuối tuần mùa 4",
                    enName: "Định nghĩa ngày làm việc, ngày cuối tuần mùa 4",
                    obis: "0.0.13.1.14",
                    unit: "Time",
                    fomat: "HH:mm"
                },
                {
                    id: "futurecaidatthoigianbieugiangaylamviecmua4",
                    viName: "Cài thời gian chuyển biểu giá ngày làm việc mùa 4",
                    enName: "Cài thời gian chuyển biểu giá ngày làm việc mùa 4",
                    obis: "0.0.13.2.17",
                    unit: "Time",
                    fomat: "HH:mm"
                },
                {
                    id: "futurecaidatthoigianbieugiangaycuoituanmua4",
                    viName: "Cài thời gian chuyển biểu giá ngày cuối tuần mùa 4",
                    enName: "Cài thời gian chuyển biểu giá ngày cuối tuần mùa 4",
                    obis: "0.0.13.2.18",
                    unit: "Time",
                    fomat: "HH:mm"
                }
            ]
        },
        // ----- Sự kiện Loss Voltage Event -----
        LOSS_VOLTAGE: {
            group: "Cài đặt ngưỡng cảnh báo sự kiện",
            displayName: "Loss Voltage Event",
            params: [
                {
                    id: "lossVoltageLessDownLimit",
                    enName: "Loss Voltage Event Voltage Less Down-Limit",
                    viName: "Ngưỡng cảnh báo mất áp",
                    obis: "1.0.12.43.0",
                    unit: "V",
                    fomat: 'XXX.X'
                },
                {
                    id: "lossVoltageURecoveryDownLimit",
                    enName: "Loss Voltage Event U Recovery Down-Limit",
                    viName: "Ngưỡng kết thúc cảnh báo mất áp",
                    obis: "1.0.12.43.1",
                    unit: "V",
                    fomat: 'XXX.X'
                },
                {
                    id: "lossVoltageCurrentOverUpLimit",
                    enName: "Loss Voltage Event Current Over Up-Limit",
                    viName: "Ngưỡng dòng điện cảnh báo mất áp",
                    obis: "1.0.12.43.2",
                    unit: "A",
                    fomat: 'XX.XXXX'
                },
                {
                    id: "lossVoltageOccurDelayedTime",
                    enName: "Loss Voltage Event Occur Delayed Time",
                    viName: "Thời gian duy trì để công tơ ghi nhận cảnh báo",
                    obis: "1.0.12.43.3",
                    unit: "Second",
                    fomat: 'XX'
                }
            ]
        },

        // ----- Sự kiện Under Voltage Even -----
        UNDER_VOLTAGE: {
            group: "Cài đặt ngưỡng cảnh báo sự kiện",
            displayName: "Under Voltage Event",
            params: [
                {
                    id: "underVoltageLessDownLimit",
                    enName: "Under Voltage Event Voltage Less Down-Limit",
                    viName: "Ngưỡng cảnh báo sụt áp",
                    obis: "1.0.12.31.0",
                    unit: "V",
                    fomat: 'XXX.X'
                },
                {
                    id: "underVoltageURecoveryDownLimit",
                    enName: "Configure the retention time for the meter to register the alarm",
                    viName: "Thời gian duy trì để công tơ ghi nhận cảnh báo",
                    obis: "1.0.12.31.1",
                    unit: "Second",
                    fomat: 'XX'
                }
            ]
        },
        //-------------------Over Voltage Event------------
        OVER_VOLTAGE: {
            group: "Cài đặt ngưỡng cảnh báo sự kiện",
            displayName: "Over Voltage Event",
            params: [
                {
                    id: "OverVoltageEventVoltageOverUpLimit",
                    enName: "Over Voltage Event Voltage Over Up-Limit",
                    viName: "Ngưỡng cảnh báo quá áp",
                    obis: "1.0.12.35.0",
                    unit: "V",
                    fomat: 'XXX.X'
                },
                {
                    id: "OverVoltageEventOccurDelayedTime",
                    enName: "Over Voltage Event Occur Delayed Time",
                    viName: "Thời gian duy trì để công tơ ghi nhận cảnh báo",
                    obis: "1.0.12.35.1",
                    unit: "Second",
                    fomat: 'XX'
                }
            ]
        },
        //------------------Loss Phase Event------------
        LOST_PHASE: {
            group: "Cài đặt ngưỡng cảnh báo sự kiện",
            displayName: "Loss Phase Event",
            params: [
                {
                    id: "LossPhaseEventVoltageLessDownLimit",
                    enName: "Loss Phase Event Voltage Less Down-Limit",
                    viName: "Ngưỡng cảnh báo mất pha",
                    obis: "1.0.12.39.0",
                    unit: "V",
                    fomat: 'XXX.X'
                },
                {
                    id: "LossPhaseEventCurrentLessDownLimit",
                    enName: "Loss Phase Event Current Less Down-Limit",
                    viName: "Ngưỡng dòng điện cảnh báo mất pha",
                    obis: "1.0.12.39.1",
                    unit: "A",
                    fomat: 'XX.XXXX'
                },
                {
                    id: "LossPhaseEventOccurDelayedTime",
                    enName: "Loss Phase Event Occur Delayed Time",
                    viName: "Thời gian duy trì để công tơ ghi nhận cảnh báo",
                    obis: "1.0.12.39.2",
                    unit: "Second",
                    fomat: 'XXX.X'
                }
            ]
        },
        //------------------Voltage Unbalance-Rate------------
        VOLTAGE_UNBALANCE_RATE: {
            group: "Cài đặt ngưỡng cảnh báo sự kiện",
            displayName: "Voltage Unbalance-Rate",
            params: [
                {
                    id: "VoltageUnbalanceRateLimit",
                    enName: "Voltage Unbalance-Rate Limit",
                    viName: "Ngưỡng cảnh báo mất cân bằng điện áp",
                    obis: "1.0.12.44.0",
                    unit: "%",
                    fomat: 'XX.XX'
                },
                {
                    id: "VoltageUnbalanceRateOccurDelayedTime",
                    enName: "Voltage Unbalance-Rate Occur Delayed Time",
                    viName: "Thời gian duy trì để công tơ ghi nhận cảnh báo",
                    obis: "1.0.12.44.1",
                    unit: "Second",
                    fomat: 'XX'
                }

            ]
        },
        //-----------------Current Unbalance-Rate Limit------------
        CURRENT_UNBALANCE_RATE: {
            group: "Cài đặt ngưỡng cảnh báo sự kiện",
            displayName: "Current Unbalance-Rate",
            params: [
                {
                    id: "CurrentUnbalanceRateLimit",
                    enName: "Current Unbalance-Rate Limit",
                    viName: "Ngưỡng cảnh báo mất cân bằng dòng điện",
                    obis: "1.0.11.44.0",
                    unit: "%",
                    fomat: 'XX.XX'
                },
                {
                    id: "CurrentUnbalanceRateOccurDelayedTime",
                    enName: "Current Unbalance-Rate Occur Delayed Time",
                    viName: "Thời gian duy trì để công tơ ghi nhận cảnh báo",
                    obis: "1.0.11.44.1",
                    unit: "Second",
                    fomat: 'XX'
                }

            ]
        },
        //-----------------Over Current Event------------
        OVER_CURRENT_EVENT: {
            group: "Cài đặt ngưỡng cảnh báo sự kiện",
            displayName: "Over Current Event",
            params: [
                {
                    id: "OverCurrentEventCurrenOverUpLimit",
                    enName: "Over Current Event Current Over Up-Limit",
                    viName: "Ngưỡng quá dòng",
                    obis: "1.0.11.35.0",
                    unit: "A",
                    fomat: 'XXX.X'
                },
                {
                    id: "OverCurrentEventOccurDelayedTime",
                    enName: "Over Current Event Occur Delayed Time",
                    viName: "Thời gian duy trì để công tơ ghi nhận cảnh báo",
                    obis: "1.0.11.35.1",
                    unit: "Second",
                    fomat: 'XX'
                }

            ]
        },
        //-----------------Load Reverse Event------------
        LOAD_REVERSE_EVENT: {
            group: "Cài đặt ngưỡng cảnh báo sự kiện",
            displayName: "Load Reverse Event",
            params: [
                {
                    id: "LoadReverseEventPOverLimit",
                    enName: "Load Reverse Event P Over-Limit",
                    viName: "Ngưỡng ngược chiều công suất từng pha",
                    obis: "1.0.1.45.0",
                    unit: "kW",
                    fomat: 'XX.XXXX'
                },
                {
                    id: "LoadReverseEventOccurDelayedTime",
                    enName: "Load Reverse Event Occur Delayed Time",
                    viName: "Thời gian duy trì để công tơ ghi nhận cảnh báo",
                    obis: "1.0.1.45.1",
                    unit: "Second",
                    fomat: 'XX'
                }

            ]
        },
        //-----------------OverLoad Event ------------
        OVERLOAD_EVENT: {
            group: "Cài đặt ngưỡng cảnh báo sự kiện",
            displayName: "OverLoad Event ",
            params: [
                {
                    id: "OverLoadEventPOverLimit",
                    enName: "OverLoad Event P Over-Limit",
                    viName: "Ngưỡng quá tải",
                    obis: "1.0.1.35.0",
                    unit: "kW",
                    fomat: 'XX.XXXX'
                },
                {
                    id: "OverLoadEventOccurDelayedTime",
                    enName: "OverLoad Event Occur Delayed Time",
                    viName: "Thời gian duy trì để công tơ ghi nhận cảnh báo",
                    obis: "1.0.1.35.1",
                    unit: "Second",
                    fomat: 'XX'
                }

            ]
        },
        //-----------------PF Under Limit  ------------
        PF_UNDER_LIMIT: {
            group: "Cài đặt ngưỡng cảnh báo sự kiện",
            displayName: "PF Under Limit",
            params: [
                {
                    id: "PFUnderLimitThreshold",
                    enName: "PF Under Limit Threshold",
                    viName: "Ngưỡng cảnh báo hệ số công suất thấp",
                    obis: "1.0.13.31.0",
                    unit: "PF",
                    fomat: 'X.XXX'
                },
                {
                    id: "PFOverLimitOccurDelayedTime",
                    enName: "PF Over Limit Occur Delayed Time",
                    viName: "Thời gian duy trì để công tơ ghi nhận cảnh báo",
                    obis: "1.0.13.31.1",
                    unit: "Second",
                    fomat: 'XX'
                }

            ]
        },
        //-----------------Electrical leak Event  ------------
        ELECTTRICAL_LEAK: {
            group: "Cài đặt ngưỡng cảnh báo sự kiện",
            displayName: "Electrical leak Event",
            params: [
                {
                    id: "ElectricalleakEventCurrentLimit",
                    enName: "Electrical leak Event Current Limit",
                    viName: "Ngưỡng cảnh báo rò điện (so sánh dòng điện đo thực tế qua biến dòng và dòng điện trung tính theo lý thuyết của hệ thống)",
                    obis: "1.0.11.31.0",
                    unit: "A",
                    fomat: 'XX.XXXX'
                },
                {
                    id: "ElectricalleakEventOccurDelayedTime",
                    enName: "Electrical leak Event Occur Delayed Time",
                    viName: "Thời gian duy trì để công tơ ghi nhận cảnh báo",
                    obis: "1.0.11.31.1",
                    unit: "Second",
                    fomat: 'XX'
                }

            ]
        },
        //-----------------Total Power Reverse Event  ------------
        TOTAL_POWER_REVERSE: {
            group: "Cài đặt ngưỡng cảnh báo sự kiện",
            displayName: "Total Power Reverse Event",
            params: [
                {
                    id: "TotalPowerReverseEventPOverLimit",
                    enName: "Total Power Reverse Event P Over-Limit",
                    viName: "Ngưỡng ngược chiều công suất tổng (tổng đại số 3 pha)",
                    obis: "1.0.1.46.0",
                    unit: "kW",
                    fomat: 'XX.XXXX'
                },
                {
                    id: "TotalPowerReverseEventOccurDelayedTime",
                    enName: "Total Power Reverse Event Occur Delayed Time",
                    viName: "Thời gian duy trì để công tơ ghi nhận cảnh báo",
                    obis: "1.0.1.46.1",
                    unit: "Second",
                    fomat: 'XX'
                }

            ]
        },
    };
    // =============================
    // Tạo đơn vị chuẩn theo từng nhóm
    // =============================
    const UNIT_GROUPS = {
        VOLTAGE: ["V"],
        CURRENT: ["A"],
        PERCENT: ["%"],
        TIME: ["Second"],
        PF: ["PF"],
        KW: ["kW"]
    };

    // =============================
    // Detect type input
    // =============================
    function detectInputType(param) {
        const text = (param.enName + " " + param.viName).toLowerCase();

        if (text.includes("time") || text.includes("delay") || text.includes("thời gian"))
            return "time";

        if (text.includes("limit") || text.includes("ngưỡng"))
            return "number";

        return "text";
    }

    // Detect unit group
    function detectUnit(param) {
        const t = param.unit?.toLowerCase() || "";

        if (t === "v") return UNIT_GROUPS.VOLTAGE;
        if (t === "a") return UNIT_GROUPS.CURRENT;
        if (t === "%") return UNIT_GROUPS.PERCENT;
        if (t === "second" || t === "sec") return UNIT_GROUPS.TIME;
        if (t === "pf") return UNIT_GROUPS.PF;
        if (t === "kw") return UNIT_GROUPS.KW;

        return null;
    }

    // =============================
    // Render giao diện
    // =============================
    function renderParams(eventKey) {
        const cfg = eventConfigs[eventKey];
        const div = document.getElementById("eventParams");
        div.innerHTML = "";
        if (!cfg) return;

        if (eventKey === "TOU_SEASON_ACTIVE_TIME") {
            div.innerHTML = `
            <div class="season-box">
                <div class="season-toolbar">
                    <label style="margin-top: 7px;">Mùa:</label>
                    <select id="seasonSelect" class="form-control">
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                    </select>
                    <label  style="margin-top: 7px;">Ngày:</label>
                    <select id="daySelect" class="form-control"></select>

                    <label  style="margin-top: 7px;">Tháng:</label>
                    <select id="monthSelect" class="form-control"></select>

                    <button type="button" class="btn btn-primary" onclick="addSeasonDay()">
                        Thêm
                    </button>
                </div>

                <div id="seasonList" class="season-list"></div>

                <input 
                    type="hidden" 
                    id="seasonActiveTime" 
                    data-obis="${cfg.params[0].obis}" 
                    data-name="${cfg.params[0].viName}" 
                />
            </div>
        `;

            initSeasonActiveTime();
            return;
        }
        if (eventKey === "TOU_TARIFF_SEASON_1") {
            div.innerHTML = `
                <div class="tariff-season-box">

                    <div class="tariff-section">
                        <h4>1. Định nghĩa ngày làm việc / ngày nghỉ mùa 1</h4>

                        <table class="table table-bordered evn-table">
                            <thead>
                                <tr>
                                    <th>Thứ</th>
                                    <th>Ngày làm việc</th>
                                    <th>Ngày nghỉ</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${[
                    { val: 2, text: "Thứ 2" },
                    { val: 3, text: "Thứ 3" },
                    { val: 4, text: "Thứ 4" },
                    { val: 5, text: "Thứ 5" },
                    { val: 6, text: "Thứ 6" },
                    { val: 7, text: "Thứ 7" },
                    { val: 8, text: "Chủ nhật" }
                ].map(d => `
                                    <tr>
                                        <td>${d.text}</td>
                                        <!-- Ngày làm việc -->
                                        <td class="text-center">
                                            <input type="radio"
                                                name="season1_day_${d.val}"
                                                value="1"
                                                class="season1-day"
                                                ${d.val <= 6 ? "checked" : ""}
                                            >
                                        </td>

                                        <!-- Ngày nghỉ -->
                                        <td class="text-center">
                                            <input type="radio"
                                                name="season1_day_${d.val}"
                                                value="2"
                                                class="season1-day"
                                                ${d.val >= 7 ? "checked" : ""}
                                            >
                                        </td>
                                    </tr>
                                `).join("")}
                            </tbody>
                        </table>

                        <input type="hidden" id="dinhnghiangaylamviecmua1" data-obis="0.0.13.1.1" data-name="Định nghĩa ngày làm việc / ngày nghỉ mùa 1">
                    </div>

                    <div class="tariff-section">
                        <h4>2. Thời gian chuyển biểu giá ngày làm việc mùa 1</h4>
                        <div id="workdayTariffRows"></div>
                        <button class="btn btn-primary btn-sm" onclick="addTariffTimeRow('workday')">+ Thêm mốc giờ</button>

                        <input type="hidden" id="caidatthoigianbieugiangaylamviecmua1" data-obis="0.0.13.2.1" data-name="Thời gian chuyển biểu giá ngày làm việc mùa 1">
                    </div>

                    <div class="tariff-section">
                        <h4>3. Thời gian chuyển biểu giá ngày cuối tuần mùa 1</h4>
                        <div id="weekendTariffRows"></div>
                        <button class="btn btn-primary btn-sm" onclick="addTariffTimeRow('weekend')">+ Thêm mốc giờ</button>

                        <input type="hidden" id="caidatthoigianbieugiangaycuoituanmua1" data-obis="0.0.13.2.2" data-name="Thời gian chuyển biểu giá ngày cuối tuần mùa 1">
                    </div>

                </div>
            `;

            initTariffSeason1();
            return;
        }
        if (eventKey === "TOU_TARIFF_SEASON_2") {
            div.innerHTML = `
                <div class="tariff-season-box">

                    <div class="tariff-section">
                        <h4>1. Định nghĩa ngày làm việc / ngày nghỉ mùa 2</h4>

                        <table class="table table-bordered evn-table">
                            <thead>
                                <tr>
                                    <th>Thứ</th>
                                    <th>Ngày làm việc</th>
                                    <th>Ngày nghỉ</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${[
                    { val: 2, text: "Thứ 2" },
                    { val: 3, text: "Thứ 3" },
                    { val: 4, text: "Thứ 4" },
                    { val: 5, text: "Thứ 5" },
                    { val: 6, text: "Thứ 6" },
                    { val: 7, text: "Thứ 7" },
                    { val: 8, text: "Chủ nhật" }
                ].map(d => `
                                    <tr>
                                        <td>${d.text}</td>
                                        <!-- Ngày làm việc -->
                                        <td class="text-center">
                                            <input type="radio"
                                                name="season2_day_${d.val}"
                                                value="1"
                                                class="season1-day"
                                                ${d.val <= 6 ? "checked" : ""}
                                            >
                                        </td>

                                        <!-- Ngày nghỉ -->
                                        <td class="text-center">
                                            <input type="radio"
                                                name="season2_day_${d.val}"
                                                value="2"
                                                class="season1-day"
                                                ${d.val >= 7 ? "checked" : ""}
                                            >
                                        </td>
                                    </tr>
                                `).join("")}
                            </tbody>
                        </table>

                        <input type="hidden" id="dinhnghiangaylamviecmua2" data-obis="0.0.13.1.2" data-name="Định nghĩa ngày làm việc / ngày nghỉ mùa 2">
                    </div>

                    <div class="tariff-section">
                        <h4>2. Thời gian chuyển biểu giá ngày làm việc mùa 2</h4>
                        <div id="workdayTariffRows"></div>
                        <button class="btn btn-primary btn-sm" onclick="addTariffTimeRow('workday')">+ Thêm mốc giờ</button>

                        <input type="hidden" id="caidatthoigianbieugiangaylamviecmua2" data-obis="0.0.13.2.3" data-name="Thời gian chuyển biểu giá ngày làm việc mùa 2">
                    </div>

                    <div class="tariff-section">
                        <h4>3. Thời gian chuyển biểu giá ngày cuối tuần mùa 2</h4>
                        <div id="weekendTariffRows"></div>
                        <button class="btn btn-primary btn-sm" onclick="addTariffTimeRow('weekend')">+ Thêm mốc giờ</button>

                        <input type="hidden" id="caidatthoigianbieugiangaycuoituanmua2" data-obis="0.0.13.2.4" data-name="Thời gian chuyển biểu giá ngày cuối tuần mùa 2">
                    </div>

                </div>
            `;

            initTariffSeason1();
            return;
        }
        if (eventKey === "TOU_TARIFF_SEASON_3") {
            div.innerHTML = `
                <div class="tariff-season-box">

                    <div class="tariff-section">
                        <h4>1. Định nghĩa ngày làm việc / ngày nghỉ mùa 3</h4>

                        <table class="table table-bordered evn-table">
                            <thead>
                                <tr>
                                    <th>Thứ</th>
                                    <th>Ngày làm việc</th>
                                    <th>Ngày nghỉ</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${[
                    { val: 2, text: "Thứ 2" },
                    { val: 3, text: "Thứ 3" },
                    { val: 4, text: "Thứ 4" },
                    { val: 5, text: "Thứ 5" },
                    { val: 6, text: "Thứ 6" },
                    { val: 7, text: "Thứ 7" },
                    { val: 8, text: "Chủ nhật" }
                ].map(d => `
                                    <tr>
                                        <td>${d.text}</td>
                                        <!-- Ngày làm việc -->
                                        <td class="text-center">
                                            <input type="radio"
                                                name="season3_day_${d.val}"
                                                value="1"
                                                class="season1-day"
                                                ${d.val <= 6 ? "checked" : ""}
                                            >
                                        </td>

                                        <!-- Ngày nghỉ -->
                                        <td class="text-center">
                                            <input type="radio"
                                                name="season3_day_${d.val}"
                                                value="2"
                                                class="season1-day"
                                                ${d.val >= 7 ? "checked" : ""}
                                            >
                                        </td>
                                    </tr>
                                `).join("")}
                            </tbody>
                        </table>

                        <input type="hidden" id="dinhnghiangaylamviecmua3" data-obis="0.0.13.1.3"  data-name="Định nghĩa ngày làm việc / ngày nghỉ mùa 3">
                    </div>

                    <div class="tariff-section">
                        <h4>2. Thời gian chuyển biểu giá ngày làm việc mùa 3</h4>
                        <div id="workdayTariffRows"></div>
                        <button class="btn btn-primary btn-sm" onclick="addTariffTimeRow('workday')">+ Thêm mốc giờ</button>

                        <input type="hidden" id="caidatthoigianbieugiangaylamviecmua3" data-obis="0.0.13.2.5" data-name="Thời gian chuyển biểu giá ngày làm việc mùa 3">
                    </div>

                    <div class="tariff-section">
                        <h4>3. Thời gian chuyển biểu giá ngày cuối tuần mùa 3</h4>
                        <div id="weekendTariffRows"></div>
                        <button class="btn btn-primary btn-sm" onclick="addTariffTimeRow('weekend')">+ Thêm mốc giờ</button>

                        <input type="hidden" id="caidatthoigianbieugiangaycuoituanmua3" data-obis="0.0.13.2.6" data-name="Thời gian chuyển biểu giá ngày cuối tuần mùa 3">
                    </div>

                </div>
            `;

            initTariffSeason1();
            return;
        }
        if (eventKey === "TOU_TARIFF_SEASON_4") {
            div.innerHTML = `
                <div class="tariff-season-box">

                    <div class="tariff-section">
                        <h4>1. Định nghĩa ngày làm việc / ngày nghỉ mùa 4</h4>

                        <table class="table table-bordered evn-table">
                            <thead>
                                <tr>
                                    <th>Thứ</th>
                                    <th>Ngày làm việc</th>
                                    <th>Ngày nghỉ</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${[
                    { val: 2, text: "Thứ 2" },
                    { val: 3, text: "Thứ 3" },
                    { val: 4, text: "Thứ 4" },
                    { val: 5, text: "Thứ 5" },
                    { val: 6, text: "Thứ 6" },
                    { val: 7, text: "Thứ 7" },
                    { val: 8, text: "Chủ nhật" }
                ].map(d => `
                                    <tr>
                                        <td>${d.text}</td>
                                        <!-- Ngày làm việc -->
                                        <td class="text-center">
                                            <input type="radio"
                                                name="season4_day_${d.val}"
                                                value="1"
                                                class="season1-day"
                                                ${d.val <= 6 ? "checked" : ""}
                                            >
                                        </td>

                                        <!-- Ngày nghỉ -->
                                        <td class="text-center">
                                            <input type="radio"
                                                name="season4_day_${d.val}"
                                                value="2"
                                                class="season1-day"
                                                ${d.val >= 7 ? "checked" : ""}
                                            >
                                        </td>
                                    </tr>
                                `).join("")}
                            </tbody>
                        </table>

                        <input type="hidden" id="dinhnghiangaylamviecmua4" data-obis="0.0.13.1.4"  data-name="Định nghĩa ngày làm việc / ngày nghỉ mùa 4">
                    </div>

                    <div class="tariff-section">
                        <h4>2. Thời gian chuyển biểu giá ngày làm việc mùa 4</h4>
                        <div id="workdayTariffRows"></div>
                        <button class="btn btn-primary btn-sm" onclick="addTariffTimeRow('workday')">+ Thêm mốc giờ</button>

                        <input type="hidden" id="caidatthoigianbieugiangaylamviecmua4" data-obis="0.0.13.2.7"  data-name="Thời gian chuyển biểu giá ngày làm việc mùa 4">
                    </div>

                    <div class="tariff-section">
                        <h4>3. Thời gian chuyển biểu giá ngày cuối tuần mùa 4</h4>
                        <div id="weekendTariffRows"></div>
                        <button class="btn btn-primary btn-sm" onclick="addTariffTimeRow('weekend')">+ Thêm mốc giờ</button>

                        <input type="hidden" id="caidatthoigianbieugiangaycuoituanmua4" data-obis="0.0.13.2.8"  data-name="Thời gian chuyển biểu giá ngày cuối tuần mùa 4">
                    </div>

                </div>
            `;

            initTariffSeason1();
            return;
        }
        if (eventKey === "METER_TIME_SETTING") {
            div.innerHTML = renderMeterTimeSetting();
            initMeterTimeSetting();
            return;
        }
        cfg.params.forEach(p => {
            const row = document.createElement("div");
            row.className = "form-row";

            //label nhỏ – tiếng Anh
            // const lblEn = document.createElement("div");
            // lblEn.className = "param-label";
            // lblEn.textContent = p.enName;
            // row.appendChild(lblEn);

            // label lớn – tiếng Việt
            const lblVi = document.createElement("label");
            lblVi.textContent = p.viName;
            row.appendChild(lblVi);

            // kiểu input
            const inputType = detectInputType(p);
            const unitList = detectUnit(p);

            if (unitList) {
                // Có đơn vị => number + combo unit
                const wrap = document.createElement("div");
                wrap.className = "unit-box";

                const num = document.createElement("input");
                num.type = "number";
                num.id = p.id;
                num.placeholder = p.fomat ? `Nhập giá trị: ${p.fomat}` : "Nhập giá trị…";
                num.setAttribute("data-obis", p.obis);   // <-- thêm obis
                num.setAttribute("data-name", p.viName);   // <-- thêm obis
                attachAutoValidate(num, p.fomat);   // <— GẮN VÀO ĐÂY

                const sel = document.createElement("select");
                sel.className = "unit";

                unitList.forEach(u => {
                    const op = document.createElement("option");
                    op.value = u;
                    op.textContent = u;
                    sel.appendChild(op);
                });

                wrap.appendChild(num);
                wrap.appendChild(sel);
                // ⚡ Thêm Text hiển thị Format
                if (p.fomat) {
                    num.setAttribute("title", p.fomat ? `Format yêu cầu: ${p.fomat}` : "");

                }
                row.appendChild(wrap);
            }
            else if (inputType === "time") {
                // Trường thời gian => number + đơn vị thời gian
                const wrap = document.createElement("div");
                wrap.className = "unit-box";

                const num = document.createElement("input");
                num.type = "number";
                num.id = p.id;
                num.placeholder = p.fomat ? `Nhập giá trị: ${p.fomat}` : "Nhập thời gian…";
                num.setAttribute("data-obis", p.obis);   // <-- thêm obis

                attachAutoValidate(num, p.fomat);   // <— GẮN VÀO ĐÂY
                const sel = document.createElement("select");
                sel.className = "unit";

                UNIT_GROUPS.TIME.forEach(u => {
                    const op = document.createElement("option");
                    op.value = u;
                    op.textContent = u;
                    sel.appendChild(op);
                });

                wrap.appendChild(num);
                wrap.appendChild(sel);
                // ⚡ Thêm Text hiển thị Format
                if (p.fomat) {
                    num.setAttribute("title", p.fomat ? `Format yêu cầu: ${p.fomat}` : "");
                    // const hint = document.createElement("div");
                    // hint.className = "format-hint";
                    // hint.textContent = `Format yêu cầu: ${p.fomat}`;
                    // wrap.appendChild(hint);
                }
                row.appendChild(wrap);
            }
            else if (inputType === "number") {
                const num = document.createElement("input");
                num.type = "number";
                num.id = p.id;
                num.placeholder = p.fomat ? `Nhập giá trị: ${p.fomat}` : "";
                num.setAttribute("data-obis", p.obis);   // <-- thêm obis
                attachAutoValidate(num, p.fomat);   // <— GẮN VÀO ĐÂY
                row.appendChild(num);
            }
            else {
                const txt = document.createElement("input");
                txt.type = "text";
                txt.id = p.id;
                txt.placeholder = p.fomat ? `Nhập giá trị: ${p.fomat}` : "Nhập dữ liệu…";
                txt.setAttribute("data-obis", p.obis);
                txt.setAttribute("data-name", p.viName);
                // txt.type = "text";
                // txt.id = p.id;
                // txt.placeholder = p.fomat ? `Nhập giá trị: ${p.fomat}` : "Nhập dữ liệu…";
                // num.setAttribute("data-obis", p.obis);   // <-- thêm obis
                attachAutoValidate(txt, p.fomat);   // <— GẮN VÀO ĐÂY
                // ⚡ Thêm Text hiển thị Format
                if (p.fomat) {
                    num.setAttribute("title", p.fomat ? `Format yêu cầu: ${p.fomat}` : "");
                    // const hint = document.createElement("div");
                    // hint.className = "format-hint";
                    // hint.textContent = `Format yêu cầu: ${p.fomat}`;
                    // wrap.appendChild(hint);
                }
                row.appendChild(txt);
            }

            div.appendChild(row);
        });
    }
    function renderMeterTimeSetting() {
        return `
        <div class="meter-time-box">
            <h4>Cài thời gian công tơ</h4>

            <div class="meter-time-grid">
                <div>
                    <label>Ngày</label>
                    <select id="meterTimeDay" class="form-control"></select>
                </div>

                <div>
                    <label>Tháng</label>
                    <select id="meterTimeMonth" class="form-control"></select>
                </div>

                <div>
                    <label>Năm</label>
                    <select id="meterTimeYear" class="form-control"></select>
                </div>

                <div>
                    <label>Giờ</label>
                    <select id="meterTimeHour" class="form-control"></select>
                </div>

                <div>
                    <label>Phút</label>
                    <select id="meterTimeMinute" class="form-control"></select>
                </div>

                <div>
                    <label>Giây</label>
                    <select id="meterTimeSecond" class="form-control"></select>
                </div>
            </div>

            <input type="hidden"
                   id="meterTimeSetting"
                   data-obis="0.0.0.9.4"
                   data-name="Cài thời gian công tơ">
        </div>
    `;
    }

    function initMeterTimeSetting() {
        const now = new Date();

        fillSelectNumber("#meterTimeDay", 1, 31, now.getDate(), 2);
        fillSelectNumber("#meterTimeMonth", 1, 12, now.getMonth() + 1, 2);
        fillSelectNumber("#meterTimeYear", now.getFullYear() - 5, now.getFullYear() + 5, now.getFullYear(), 4);
        fillSelectNumber("#meterTimeHour", 0, 23, now.getHours(), 2);
        fillSelectNumber("#meterTimeMinute", 0, 59, now.getMinutes(), 2);
        fillSelectNumber("#meterTimeSecond", 0, 59, now.getSeconds(), 2);

        $("#meterTimeDay,#meterTimeMonth,#meterTimeYear,#meterTimeHour,#meterTimeMinute,#meterTimeSecond")
            .off("change.meterTime")
            .on("change.meterTime", updateMeterTimeHidden);

        updateMeterTimeHidden();
    }

    function fillSelectNumber(selector, from, to, selected, padLength) {
        let html = "";

        for (let i = from; i <= to; i++) {
            const value = String(i).padStart(padLength, "0");
            const text = value;

            html += `<option value="${value}" ${Number(i) === Number(selected) ? "selected" : ""}>${text}</option>`;
        }

        $(selector).html(html);
    }

    function updateMeterTimeHidden() {
        const dd = $("#meterTimeDay").val();
        const mm = $("#meterTimeMonth").val();
        const yyyy = $("#meterTimeYear").val();
        const hh = $("#meterTimeHour").val();
        const mi = $("#meterTimeMinute").val();
        const ss = $("#meterTimeSecond").val();

        const yy = String(yyyy).slice(-2);

        $("#meterTimeSetting").val(`${yy}${mm}${dd}${hh}${mi}${ss}`);
    }
    function initTariffSeason1() {

        $(".season1-day")
            .off("change.tariff1")
            .on("change.tariff1", updateTariffSeason1Hidden);

        $("#workdayTariffRows").empty();
        $("#weekendTariffRows").empty();

        addTariffTimeRow("workday", "00", "00", "1");
        addTariffTimeRow("weekend", "00", "00", "1");
        setTimeout(function () {
            updateTariffSeason1Hidden();
        }, 0);
    }

    function addTariffTimeRow(type, hour = "00", minute = "00", tariff = "1") {
        const targetId = type === "workday" ? "#workdayTariffRows" : "#weekendTariffRows";
        const rowId = "tariff_" + type + "_" + Date.now() + "_" + Math.floor(Math.random() * 1000);

        const html = `
        <div class="tariff-time-row" id="${rowId}" data-type="${type}">
            <label>Giờ</label>
            <select class="tariff-hour form-control">
                ${buildHourOptions(hour)}
            </select>

            <label>Phút</label>
            <select class="tariff-minute form-control">
                ${buildMinuteOptions(minute)}
            </select>

            <label>Biểu giá</label>
            <select class="tariff-type form-control">
                <option value="1"  ${String(tariff) === "1" ? "selected" : ""}>Bình thường</option>
                <option value="2"  ${String(tariff) === "2" ? "selected" : ""}>Cao điểm</option>
                <option value="3"  ${String(tariff) === "3" ? "selected" : ""}>Thấp điểm</option>
            </select>

            <button type="button" class="btn btn-danger btn-sm" onclick="removeTariffTimeRow('${rowId}')">
                Xóa
            </button>
        </div>
    `;

        $(targetId).append(html);

        $("#" + rowId).find("select")
            .off("change.tariff1")
            .on("change.tariff1", function () {
                updateTariffSeason1Hidden();
                validateTariffRowsUi(type);
            });

        updateTariffSeason1Hidden();
        validateTariffRowsUi(type);
    }

    // 👇 THÊM 2 DÒNG NÀY
    window.addTariffTimeRow = addTariffTimeRow;
    window.removeTariffTimeRow = removeTariffTimeRow;
    function validateTariffRowsUi(type) {
        const result = validateTariffRows(type);
        const boxId = type === "workday" ? "#workdayTariffError" : "#weekendTariffError";
        const container = type === "workday" ? "#workdayTariffRows" : "#weekendTariffRows";

        $(`${container} .tariff-time-row`).removeClass("tariff-row-error");

        const rows = [];

        $(`${container} .tariff-time-row`).each(function () {
            const hour = $(this).find(".tariff-hour").val();
            const minute = $(this).find(".tariff-minute").val();
            const timeKey = `${hour}${minute}`;

            rows.push({
                $row: $(this),
                timeKey
            });
        });

        const counts = {};
        rows.forEach(x => {
            counts[x.timeKey] = (counts[x.timeKey] || 0) + 1;
        });

        rows.forEach(x => {
            if (counts[x.timeKey] > 1) {
                x.$row.addClass("tariff-row-error");
            }
        });

        if (!$(boxId).length) return result.valid;

        if (!result.valid) {
            $(boxId).html(result.message).show();
        } else {
            $(boxId).hide().html("");
        }

        return result.valid;
    }
    function removeTariffTimeRow(rowId) {
        $("#" + rowId).remove();
        updateTariffSeason1Hidden();
    }

    function buildHourOptions(selectedHour) {
        let html = "";

        for (let i = 0; i <= 23; i++) {
            const v = String(i).padStart(2, "0");
            html += `<option value="${v}" ${v === selectedHour ? "selected" : ""}>${v}</option>`;
        }

        return html;
    }

    function buildMinuteOptions(selectedMinute) {
        let html = "";

        for (let i = 0; i <= 59; i++) {
            const v = String(i).padStart(2, "0");
            html += `<option value="${v}" ${v === selectedMinute ? "selected" : ""}>${v}</option>`;
        }

        return html;
    }



    function getTariffRows(type) {
        const rows = [];

        $(`.tariff-time-row[data-type="${type}"]`).each(function () {
            rows.push({
                hour: $(this).find(".tariff-hour").val(),
                minute: $(this).find(".tariff-minute").val(),
                tariff: $(this).find(".tariff-type").val()
            });
        });

        rows.sort(function (a, b) {
            return Number(a.hour + a.minute) - Number(b.hour + b.minute);
        });

        return rows;
    }

    function buildWeekdayValue(weekdays, holiday) {
        if (!weekdays.length) return "";

        // Format: (holiday + danh sách thứ)
        // VD: ngày làm việc thứ 2-6 => (023456)
        // VD: ngày nghỉ thứ 7,CN => (178)
        return `(${holiday}${weekdays.join("")})`;
    }
    // =============================
    // Combobox
    // =============================
    const eventSelect = document.getElementById("eventSelect");

    function initSelect() {
        eventSelect.innerHTML = "";

        const groups = {};

        // gom theo group
        for (const key in eventConfigs) {
            const item = eventConfigs[key];
            const groupName = item.group || "Khác";

            if (!groups[groupName]) {
                groups[groupName] = [];
            }

            groups[groupName].push({
                key,
                text: item.displayName
            });
        }

        // render optgroup
        for (const groupName in groups) {
            const optgroup = document.createElement("optgroup");
            optgroup.label = groupName;

            groups[groupName].forEach(item => {
                const opt = document.createElement("option");
                opt.value = item.key;
                opt.textContent = item.text;
                optgroup.appendChild(opt);
            });

            eventSelect.appendChild(optgroup);
        }
    }

    eventSelect.addEventListener("change", () => {
        stopReading = true;   // 🚫 yêu cầu dừng đọc obis
        renderParams(eventSelect.value);
        $("#msg").html("");
        $("#msg").hide();
    });

    // Khởi tạo
    initSelect();
    renderParams("TOU_SEASON_ACTIVE_TIME");

    function findParamConfigById(id) {
        for (const key in eventConfigs) {
            const params = eventConfigs[key].params;
            for (const p of params) {
                if (p.id === id) return p;
            }
        }
        return null;
    }

    // 👉 Cho phép các hàm bên ngoài LuuCauHinh() gọi
    window.findParamConfigById = findParamConfigById;
}

function initSeasonActiveTime() {
    const $day = $("#daySelect");
    const $month = $("#monthSelect");

    $day.empty();
    $month.empty();

    for (let m = 1; m <= 12; m++) {
        const val = String(m).padStart(2, "0");
        $month.append(`<option value="${val}">${m}</option>`);
    }

    for (let d = 1; d <= 31; d++) {
        const val = String(d).padStart(2, "0");
        $day.append(`<option value="${val}">${d}</option>`);
    }

    $("#seasonSelect, #monthSelect")
        .off("change.season")
        .on("change.season", refreshAvailableDays);

    renderSeasonList();
    refreshAvailableDays();
    updateSeasonHiddenValue();
}

function getSeasonDateKey(day, month) {
    return `${day}/${month}`;
}

function getUsedDatesInSeason(currentSeason) {
    const used = new Set();

    if (seasonDays[currentSeason]) {
        seasonDays[currentSeason].forEach(function (x) {
            used.add(x.key);
        });
    }

    return used;
}

function refreshAvailableDays() {
    const season = $("#seasonSelect").val();
    const month = $("#monthSelect").val();
    const used = getUsedDatesInSeason(season);

    $("#daySelect option").each(function () {
        const day = $(this).val();
        const key = getSeasonDateKey(day, month);

        // chỉ disable ngày đã chọn trong chính mùa hiện tại
        $(this).prop("disabled", used.has(key));
    });

    const currentVal = $("#daySelect").val();
    if (!currentVal || $("#daySelect option:selected").prop("disabled")) {
        const firstAvailable = $("#daySelect option:not(:disabled)").first().val();
        if (firstAvailable) {
            $("#daySelect").val(firstAvailable);
        }
    }
    $("#daySelect").trigger("change.select2");
}

function addSeasonDay() {
    const season = $("#seasonSelect").val();
    const month = $("#monthSelect").val();
    const day = $("#daySelect").val();

    if (!season || !month || !day) {
        toastr.warning("Vui lòng chọn mùa, tháng và ngày");
        return;
    }

    const key = getSeasonDateKey(day, month);

    // chỉ kiểm tra trùng trong cùng mùa
    if (seasonDays[season].some(x => x.key === key)) {
        toastr.warning(`Ngày ${key} đã có trong mùa ${season}`);
        refreshAvailableDays();
        return;
    }

    const dd = String(day).padStart(2, "0");
    const mm = String(month).padStart(2, "0");
    const ss = String(season).padStart(2, "0");

    seasonDays[season].push({
        key,
        day: dd,
        month: mm,
        season,
        value: `${dd}${mm}${ss}`
    });

    seasonDays[season].sort(function (a, b) {
        if (Number(a.month) === Number(b.month)) {
            return Number(a.day) - Number(b.day);
        }
        return Number(a.month) - Number(b.month);
    });

    renderSeasonList();
    refreshAvailableDays();
    updateSeasonHiddenValue();
}

function removeSeasonDay(season, key) {
    seasonDays[season] = seasonDays[season].filter(x => x.key !== key);

    renderSeasonList();
    refreshAvailableDays();
    updateSeasonHiddenValue();
}

function renderSeasonList() {
    let html = "";

    for (let season = 1; season <= 4; season++) {
        html += `
            <div class="season-card">
                <h4>Mùa ${season}</h4>
        `;

        if (!seasonDays[season].length) {
            html += `<div class="text-muted">Chưa chọn ngày</div>`;
        } else {
            seasonDays[season].forEach(function (item) {
                html += `
                    <span class="season-tag">
                        ${item.key}
                        <button type="button" onclick="removeSeasonDay(${season}, '${item.key}')">×</button>
                    </span>
                `;
            });
        }

        html += `</div>`;
    }

    $("#seasonList").html(html);
}
function buildSeasonActiveTimeValue() {
    const result = [];

    Object.keys(seasonDays).forEach(function (season) {
        seasonDays[season].forEach(function (item) {
            const dd = String(item.day).padStart(2, "0");
            const mm = String(item.month).padStart(2, "0");
            const ss = String(season).padStart(2, "0");

            result.push(`(${dd}${mm}${ss})`);
        });
    });

    return result.join("");
}

function validateTariffRows(type) {
    const rows = getTariffRows(type);

    const label = type === "workday"
        ? "ngày làm việc"
        : "ngày cuối tuần";

    if (!rows || rows.length === 0) {
        return {
            valid: false,
            message: `Vui lòng cài ít nhất một mốc thời gian biểu giá ${label}`
        };
    }

    const times = rows.map(x => `${x.hour}${x.minute}`);
    const duplicate = times.find((x, index) => times.indexOf(x) !== index);

    if (duplicate) {
        return {
            valid: false,
            message: `Biểu giá ${label} bị trùng mốc giờ ${duplicate.substring(0, 2)}:${duplicate.substring(2, 4)}`
        };
    }

    if (!times.includes("0000")) {
        return {
            valid: false,
            message: `Biểu giá ${label} phải có mốc bắt đầu 00:00`
        };
    }

    return {
        valid: true,
        message: "OK"
    };
}
function f_loaisukien1Pha() {
    $("#eventSelect").html("");
    // =========================
    // 1. Data cấu hình sự kiện
    // =========================
    const eventConfigs = {
        // ================= CÀI ĐẶT BIỂU GIÁ =================
        TOU_SEASON_ACTIVE_TIME: {
            group: "Cài đặt biểu giá mùa",
            displayName: "Cài thời gian kích hoạt của từng mùa",
            params: [
                {
                    id: "seasonActiveTime",
                    viName: "Thời gian kích hoạt của từng mùa",
                    enName: "Season active time",
                    obis: "0.0.13.0.0",
                    unit: "DateTime",
                    fomat: "YYYY-MM-DD HH:mm:ss"
                }
            ]
        },
        TOU_TARIFF_SEASON_1: {
            group: "Cài đặt biểu giá mùa",
            displayName: "Cài đặt biểu giá, thời gian mùa 1",
            params: [
                {
                    id: "dinhnghiangaylamviecmua1",
                    viName: "Định nghĩa ngày làm việc, ngày cuối tuần mùa 1",
                    enName: "Định nghĩa ngày làm việc, ngày cuối tuần mùa 1",
                    obis: "0.0.13.1.1",
                    unit: "Time",
                    fomat: "HH:mm"
                },
                {
                    id: "caidatthoigianbieugiangaylamviecmua1",
                    viName: "Cài thời gian chuyển biểu giá ngày làm việc mùa 1",
                    enName: "Cài thời gian chuyển biểu giá ngày làm việc mùa 1",
                    obis: "0.0.13.2.1",
                    unit: "Time",
                    fomat: "HH:mm"
                },
                {
                    id: "caidatthoigianbieugiangaycuoituanmua1",
                    viName: "Cài thời gian chuyển biểu giá ngày cuối tuần mùa 1",
                    enName: "Cài thời gian chuyển biểu giá ngày cuối tuần mùa 1",
                    obis: "0.0.13.2.2",
                    unit: "Time",
                    fomat: "HH:mm"
                }
            ]
        },
        TOU_TARIFF_SEASON_2: {
            group: "Cài đặt biểu giá mùa",
            displayName: "Cài đặt biểu giá, thời gian mùa 2",
            params: [
                {
                    id: "dinhnghiangaylamviecmua2",
                    viName: "Định nghĩa ngày làm việc, ngày cuối tuần mùa 2",
                    enName: "Định nghĩa ngày làm việc, ngày cuối tuần mùa 2",
                    obis: "0.0.13.1.2",
                    unit: "Time",
                    fomat: "HH:mm"
                },
                {
                    id: "caidatthoigianbieugiangaylamviecmua2",
                    viName: "Thời gian chuyển biểu giá ngày làm việc mùa 2",
                    enName: "Thời gian chuyển biểu giá ngày làm việc mùa 2",
                    obis: "0.0.13.2.3",
                    unit: "Time",
                    fomat: "HH:mm"
                },
                {
                    id: "caidatthoigianbieugiangaycuoituanmua2",
                    viName: "Thời gian chuyển biểu giá ngày cuối tuần mùa 2",
                    enName: "Thời gian chuyển biểu giá ngày cuối tuần mùa 2",
                    obis: "0.0.13.2.4",
                    unit: "Time",
                    fomat: "HH:mm"
                }
            ]
        },
        TOU_TARIFF_SEASON_3: {
            group: "Cài đặt biểu giá mùa",
            displayName: "Cài đặt biểu giá, thời gian mùa 3",
            params: [
                {
                    id: "dinhnghiangaylamviecmua3",
                    viName: "Định nghĩa ngày làm việc, ngày cuối tuần mùa 3",
                    enName: "Định nghĩa ngày làm việc, ngày cuối tuần mùa 3",
                    obis: "0.0.13.1.3",
                    unit: "Time",
                    fomat: "HH:mm"
                },
                {
                    id: "caidatthoigianbieugiangaylamviecmua3",
                    viName: "Thời gian chuyển biểu giá ngày làm việc mùa 3",
                    enName: "Thời gian chuyển biểu giá ngày làm việc mùa 3",
                    obis: "0.0.13.2.5",
                    unit: "Time",
                    fomat: "HH:mm"
                },
                {
                    id: "caidatthoigianbieugiangaycuoituanmua3",
                    viName: "Thời gian chuyển biểu giá ngày cuối tuần mùa 3",
                    enName: "Thời gian chuyển biểu giá ngày cuối tuần mùa 3",
                    obis: "0.0.13.2.6",
                    unit: "Time",
                    fomat: "HH:mm"
                }
            ]
        },
        TOU_TARIFF_SEASON_4: {
            group: "Cài đặt biểu giá mùa",
            displayName: "Cài đặt biểu giá, thời gian mùa 4",
            params: [
                {
                    id: "dinhnghiangaylamviecmua4",
                    viName: "Định nghĩa ngày làm việc, ngày cuối tuần mùa 4",
                    enName: "Định nghĩa ngày làm việc, ngày cuối tuần mùa 4",
                    obis: "0.0.13.1.4",
                    unit: "Time",
                    fomat: "HH:mm"
                },
                {
                    id: "caidatthoigianbieugiangaylamviecmua4",
                    viName: "Thời gian chuyển biểu giá ngày làm việc mùa 4",
                    enName: "Thời gian chuyển biểu giá ngày làm việc mùa 4",
                    obis: "0.0.13.2.7",
                    unit: "Time",
                    fomat: "HH:mm"
                },
                {
                    id: "caidatthoigianbieugiangaycuoituanmua4",
                    viName: "Thời gian chuyển biểu giá ngày cuối tuần mùa 4",
                    enName: "Thời gian chuyển biểu giá ngày cuối tuần mùa 4",
                    obis: "0.0.13.2.8",
                    unit: "Time",
                    fomat: "HH:mm"
                }
            ]
        },
        METER_TIME_SETTING: {
            group: "Cài đặt thời gian",
            displayName: "Cài thời gian công tơ",
            params: [
                {
                    id: "meterTimeSetting",
                    viName: "Cài thời gian công tơ",
                    enName: "Set meter time",
                    obis: "0.0.0.9.4",
                    unit: "DateTime",
                    fomat: "YYMMDDHHmmss"
                }
            ]
        },
        FUTURE_TOU_SEASON_ACTIVE_TIME: {
            group: "Biểu giá tương lai (dự phòng)",
            displayName: "Cài thời gian kích hoạt của từng mùa",
            displayName: "Cài thời gian kích hoạt của từng mùa",
            params: [
                {
                    id: "futureSeasonActiveTime",
                    viName: "Thời gian kích hoạt của từng mùa",
                    enName: "Season active time",
                    obis: "0.0.13.0.10",
                    unit: "DateTime",
                    fomat: "YYYY-MM-DD HH:mm:ss"
                }
            ]
        },
        FUTURE_TARIFF_SEASON_1: {
            group: "Biểu giá tương lai (dự phòng)",
            displayName: "Cài đặt biểu giá, thời gian mùa 1",
            params: [
                {
                    id: "futuredinhnghiangaylamviecmua1",
                    viName: "Định nghĩa ngày làm việc, ngày cuối tuần mùa 1",
                    enName: "Định nghĩa ngày làm việc, ngày cuối tuần mùa 1",
                    obis: "0.0.13.1.11",
                    unit: "Time",
                    fomat: "HH:mm"
                },
                {
                    id: "futurecaidatthoigianbieugiangaylamviecmua1",
                    viName: "Cài thời gian chuyển biểu giá ngày làm việc mùa 1",
                    enName: "Cài thời gian chuyển biểu giá ngày làm việc mùa 1",
                    obis: "0.0.13.2.11",
                    unit: "Time",
                    fomat: "HH:mm"
                },
                {
                    id: "futurecaidatthoigianbieugiangaycuoituanmua1",
                    viName: "Cài thời gian chuyển biểu giá ngày cuối tuần mùa 1",
                    enName: "Cài thời gian chuyển biểu giá ngày cuối tuần mùa 1",
                    obis: "0.0.13.2.12",
                    unit: "Time",
                    fomat: "HH:mm"
                }
            ]
        },
        FUTURE_TARIFF_SEASON_2: {
            group: "Biểu giá tương lai (dự phòng)",
            displayName: "Cài đặt biểu giá, thời gian mùa 2",
            params: [
                {
                    id: "futuredinhnghiangaylamviecmua2",
                    viName: "Định nghĩa ngày làm việc, ngày cuối tuần mùa 2",
                    enName: "Định nghĩa ngày làm việc, ngày cuối tuần mùa 2",
                    obis: "0.0.13.1.12",
                    unit: "Time",
                    fomat: "HH:mm"
                },
                {
                    id: "futurecaidatthoigianbieugiangaylamviecmua2",
                    viName: "Cài thời gian chuyển biểu giá ngày làm việc mùa 2",
                    enName: "Cài thời gian chuyển biểu giá ngày làm việc mùa 2",
                    obis: "0.0.13.2.13",
                    unit: "Time",
                    fomat: "HH:mm"
                },
                {
                    id: "futurecaidatthoigianbieugiangaycuoituanmua2",
                    viName: "Cài thời gian chuyển biểu giá ngày cuối tuần mùa 2",
                    enName: "Cài thời gian chuyển biểu giá ngày cuối tuần mùa 2",
                    obis: "0.0.13.2.14",
                    unit: "Time",
                    fomat: "HH:mm"
                }
            ]
        },
        FUTURE_TARIFF_SEASON_3: {
            group: "Biểu giá tương lai (dự phòng)",
            displayName: "Cài đặt biểu giá, thời gian mùa 3",
            params: [
                {
                    id: "futuredinhnghiangaylamviecmua3",
                    viName: "Định nghĩa ngày làm việc, ngày cuối tuần mùa 3",
                    enName: "Định nghĩa ngày làm việc, ngày cuối tuần mùa 3",
                    obis: "0.0.13.1.13",
                    unit: "Time",
                    fomat: "HH:mm"
                },
                {
                    id: "futurecaidatthoigianbieugiangaylamviecmua3",
                    viName: "Cài thời gian chuyển biểu giá ngày làm việc mùa 3",
                    enName: "Cài thời gian chuyển biểu giá ngày làm việc mùa 3",
                    obis: "0.0.13.2.15",
                    unit: "Time",
                    fomat: "HH:mm"
                },
                {
                    id: "futurecaidatthoigianbieugiangaycuoituanmua3",
                    viName: "Cài thời gian chuyển biểu giá ngày cuối tuần mùa 3",
                    enName: "Cài thời gian chuyển biểu giá ngày cuối tuần mùa 3",
                    obis: "0.0.13.2.16",
                    unit: "Time",
                    fomat: "HH:mm"
                }
            ]
        },
        FUTURE_TARIFF_SEASON_4: {
            group: "Biểu giá tương lai (dự phòng)",
            displayName: "Cài đặt biểu giá, thời gian mùa 4",
            params: [
                {
                    id: "futuredinhnghiangaylamviecmua4",
                    viName: "Định nghĩa ngày làm việc, ngày cuối tuần mùa 4",
                    enName: "Định nghĩa ngày làm việc, ngày cuối tuần mùa 4",
                    obis: "0.0.13.1.14",
                    unit: "Time",
                    fomat: "HH:mm"
                },
                {
                    id: "futurecaidatthoigianbieugiangaylamviecmua4",
                    viName: "Cài thời gian chuyển biểu giá ngày làm việc mùa 4",
                    enName: "Cài thời gian chuyển biểu giá ngày làm việc mùa 4",
                    obis: "0.0.13.2.17",
                    unit: "Time",
                    fomat: "HH:mm"
                },
                {
                    id: "futurecaidatthoigianbieugiangaycuoituanmua4",
                    viName: "Cài thời gian chuyển biểu giá ngày cuối tuần mùa 4",
                    enName: "Cài thời gian chuyển biểu giá ngày cuối tuần mùa 4",
                    obis: "0.0.13.2.18",
                    unit: "Time",
                    fomat: "HH:mm"
                }
            ]
        },
        // ----- Sự kiện Loss Voltage Event -----
        UNDER_VOLTAGE: {
            group: "Cài đặt ngưỡng cảnh báo sự kiện",
            displayName: "Under Voltage Event",
            params: [
                {
                    id: "UnderVoltageEventVoltageLessDownLimit",
                    enName: "Under Voltage Event Voltage Less Down-Limit",
                    viName: "Ngưỡng cảnh báo sụt áp",
                    obis: "1.0.12.31.0",
                    unit: "V",
                    fomat: 'XXX.X'
                },
                {
                    id: "UnderVoltageEventOccurDelayedTime",
                    enName: "Under Voltage Event Occur Delayed Time",
                    viName: "Thời gian duy trì để công tơ ghi nhận cảnh báo",
                    obis: "1.0.12.31.1",
                    unit: "Second",
                    fomat: 'XX'
                },

            ]
        },

        // ----- Sự kiện Over Voltage Event  -----
        OVER_VOLTAGE: {
            group: "Cài đặt ngưỡng cảnh báo sự kiện",
            displayName: "Over Voltage Event",
            params: [
                {
                    id: "OverVoltageEventVoltageOverUpLimit",
                    enName: "Over Voltage Event Voltage Over Up-Limit",
                    viName: "Ngưỡng cảnh báo quá áp",
                    obis: "1.0.12.35.0",
                    unit: "V",
                    fomat: 'XXX.X'
                },
                {
                    id: "Over Voltage Event Occur Delayed Time",
                    enName: "Over Voltage Event Occur Delayed Time",
                    viName: "Thời gian duy trì để công tơ ghi nhận cảnh báo",
                    obis: "1.0.12.35.1",
                    unit: "Second",
                    fomat: 'XX'
                }
            ]
        },
        //-----------------Over Current Event------------
        OVER_CURRENT_EVENT: {
            group: "Cài đặt ngưỡng cảnh báo sự kiện",
            displayName: "Over Current Event",
            params: [
                {
                    id: "OverCurrentEventCurrenOverUpLimit",
                    enName: "Over Current Event Current Over Up-Limit",
                    viName: "Ngưỡng quá dòng",
                    obis: "1.0.11.35.0",
                    unit: "A",
                    fomat: 'XXX.X'
                },
                {
                    id: "OverCurrentEventOccurDelayedTime",
                    enName: "Over Current Event Occur Delayed Time",
                    viName: "Thời gian duy trì để công tơ ghi nhận cảnh báo",
                    obis: "1.0.11.35.1",
                    unit: "Second",
                    fomat: 'XX'
                }

            ]
        },
        //-----------------Load Reverse Event------------
        LOAD_REVERSE_EVENT: {
            group: "Cài đặt ngưỡng cảnh báo sự kiện",
            displayName: "Load Reverse Event",
            params: [
                {
                    id: "LoadReverseEventPOverLimit",
                    enName: "Load Reverse Event P Over-Limit",
                    viName: "Ngưỡng ngược chiều công suất từng pha",
                    obis: "1.0.1.45.0",
                    unit: "kW",
                    fomat: 'XX.XXXX'
                },
                {
                    id: "LoadReverseEventOccurDelayedTime",
                    enName: "Load Reverse Event Occur Delayed Time",
                    viName: "Thời gian duy trì để công tơ ghi nhận cảnh báo",
                    obis: "1.0.1.45.1",
                    unit: "Second",
                    fomat: 'XX'
                }

            ]
        },
        //-----------------OverLoad Event ------------
        OVERLOAD_EVENT: {
            group: "Cài đặt ngưỡng cảnh báo sự kiện",
            displayName: "OverLoad Event ",
            params: [
                {
                    id: "OverLoadEventPOverLimit",
                    enName: "OverLoad Event P Over-Limit",
                    viName: "Ngưỡng quá tải",
                    obis: "1.0.1.35.0",
                    unit: "kW",
                    fomat: 'XX.XXXX'
                },
                {
                    id: "OverLoadEventOccurDelayedTime",
                    enName: "OverLoad Event Occur Delayed Time",
                    viName: "Thời gian duy trì để công tơ ghi nhận cảnh báo",
                    obis: "1.0.1.35.1",
                    unit: "Second",
                    fomat: 'XX'
                }

            ]
        },
        //-----------------PF Under Limit  ------------
        PF_UNDER_LIMIT: {
            group: "Cài đặt ngưỡng cảnh báo sự kiện",
            displayName: "PF Under Limit",
            params: [
                {
                    id: "PFUnderLimitThreshold",
                    enName: "PF Under Limit Threshold",
                    viName: "Ngưỡng cảnh báo hệ số công suất thấp",
                    obis: "1.0.13.31.0",
                    unit: "PF",
                    fomat: 'X.XXX'
                },
                {
                    id: "PFOverLimitOccurDelayedTime",
                    enName: "PF Over Limit Occur Delayed Time",
                    viName: "Thời gian duy trì để công tơ ghi nhận cảnh báo",
                    obis: "1.0.13.31.1",
                    unit: "Second",
                    fomat: 'XX'
                }

            ]
        },
        //-----------------Electrical leak Event  ------------
        ELECTTRICAL_LEAK: {
            group: "Cài đặt ngưỡng cảnh báo sự kiện",
            displayName: "Electrical leak Event",
            params: [
                {
                    id: "ElectricalleakEventCurrentLimit",
                    enName: "Electrical leak Event Current Limit",
                    viName: "Ngưỡng cảnh báo rò điện (so sánh dòng điện đo thực tế qua biến dòng và dòng điện trung tính theo lý thuyết của hệ thống)",
                    obis: "1.0.11.31.0",
                    unit: "A",
                    fomat: 'XX.XXXX'
                },
                {
                    id: "ElectricalleakEventOccurDelayedTime",
                    enName: "Electrical leak Event Occur Delayed Time",
                    viName: "Thời gian duy trì để công tơ ghi nhận cảnh báo",
                    obis: "1.0.11.31.1",
                    unit: "Second",
                    fomat: 'XX'
                }

            ]
        }

    };
    // =============================
    // Tạo đơn vị chuẩn theo từng nhóm
    // =============================
    const UNIT_GROUPS = {
        VOLTAGE: ["V"],
        CURRENT: ["A"],
        PERCENT: ["%"],
        TIME: ["Second"],
        PF: ["PF"],
        KW: ["kW"]
    };

    // =============================
    // Detect type input
    // =============================
    function detectInputType(param) {
        const text = (param.enName + " " + param.viName).toLowerCase();

        if (text.includes("time") || text.includes("delay") || text.includes("thời gian"))
            return "time";

        if (text.includes("limit") || text.includes("ngưỡng"))
            return "number";

        return "text";
    }

    // Detect unit group
    function detectUnit(param) {
        const t = param.unit?.toLowerCase() || "";

        if (t === "v") return UNIT_GROUPS.VOLTAGE;
        if (t === "a") return UNIT_GROUPS.CURRENT;
        if (t === "%") return UNIT_GROUPS.PERCENT;
        if (t === "second" || t === "sec") return UNIT_GROUPS.TIME;
        if (t === "pf") return UNIT_GROUPS.PF;
        if (t === "kw") return UNIT_GROUPS.KW;

        return null;
    }

    // =============================
    // Render giao diện
    // =============================
    const WEEK_DAYS = [
        { val: 2, text: "Thứ 2" },
        { val: 3, text: "Thứ 3" },
        { val: 4, text: "Thứ 4" },
        { val: 5, text: "Thứ 5" },
        { val: 6, text: "Thứ 6" },
        { val: 7, text: "Thứ 7" },
        { val: 8, text: "Chủ nhật" }
    ];

    const TARIFF_SEASON_META = {
        TOU_TARIFF_SEASON_1: {
            season: 1,
            dayId: "dinhnghiangaylamviecmua1",
            dayObis: "0.0.13.1.1",
            workId: "caidatthoigianbieugiangaylamviecmua1",
            workObis: "0.0.13.2.1",
            weekendId: "caidatthoigianbieugiangaycuoituanmua1",
            weekendObis: "0.0.13.2.2"
        },
        TOU_TARIFF_SEASON_2: {
            season: 2,
            dayId: "dinhnghiangaylamviecmua2",
            dayObis: "0.0.13.1.2",
            workId: "caidatthoigianbieugiangaylamviecmua2",
            workObis: "0.0.13.2.3",
            weekendId: "caidatthoigianbieugiangaycuoituanmua2",
            weekendObis: "0.0.13.2.4"
        },
        TOU_TARIFF_SEASON_3: {
            season: 3,
            dayId: "dinhnghiangaylamviecmua3",
            dayObis: "0.0.13.1.3",
            workId: "caidatthoigianbieugiangaylamviecmua3",
            workObis: "0.0.13.2.5",
            weekendId: "caidatthoigianbieugiangaycuoituanmua3",
            weekendObis: "0.0.13.2.6"
        },
        TOU_TARIFF_SEASON_4: {
            season: 4,
            dayId: "dinhnghiangaylamviecmua4",
            dayObis: "0.0.13.1.4",
            workId: "caidatthoigianbieugiangaylamviecmua4",
            workObis: "0.0.13.2.7",
            weekendId: "caidatthoigianbieugiangaycuoituanmua4",
            weekendObis: "0.0.13.2.8"
        }
    };

    function renderTariffSeason(meta) {
        return `
        <div class="tariff-season-box">
            <div class="tariff-section">
                <h4>1. Định nghĩa ngày làm việc / ngày nghỉ mùa ${meta.season} </h4>

                <table class="table table-bordered evn-table">
                    <thead>
                        <tr>
                            <th>Thứ</th>
                            <th>Ngày làm việc</th>
                            <th>Ngày nghỉ</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${WEEK_DAYS.map(d => `
                            <tr>
                                <td>${d.text}</td>
                                <td class="text-center">
                                    <input type="radio"
                                           name="season${meta.season}_day_${d.val}"
                                           value="1"
                                           class="tariff-day"
                                           ${d.val <= 6 ? "checked" : ""}>
                                </td>
                                <td class="text-center">
                                    <input type="radio"
                                           name="season${meta.season}_day_${d.val}"
                                           value="2"
                                           class="tariff-day"
                                           ${d.val >= 7 ? "checked" : ""}>
                                </td>
                            </tr>
                        `).join("")}
                    </tbody>
                </table>

                <input type="hidden"
                       id="${meta.dayId}"
                       data-obis="${meta.dayObis}"
                       data-name="Định nghĩa ngày làm việc / ngày nghỉ mùa ${meta.season}">
            </div>

            <div class="tariff-section">
                <h4>2. Thời gian chuyển biểu giá ngày làm việc mùa ${meta.season}</h4>

                <div id="workdayTariffRows"></div>
                <div id="workdayTariffError" class="text-danger" style="display:none"></div>

                <button type="button"
                        class="btn btn-primary btn-sm"
                        onclick="addTariffTimeRow('workday')">
                    + Thêm mốc giờ
                </button>

                <input type="hidden"
                       id="${meta.workId}"
                       data-obis="${meta.workObis}"
                       data-name="Thời gian chuyển biểu giá ngày làm việc mùa ${meta.season}">
            </div>

            <div class="tariff-section">
                <h4>3. Thời gian chuyển biểu giá ngày cuối tuần mùa ${meta.season}</h4>

                <div id="weekendTariffRows"></div>
                <div id="weekendTariffError" class="text-danger" style="display:none"></div>

                <button type="button"
                        class="btn btn-primary btn-sm"
                        onclick="addTariffTimeRow('weekend')">
                    + Thêm mốc giờ
                </button>

                <input type="hidden"
                       id="${meta.weekendId}"
                       data-obis="${meta.weekendObis}"
                       data-name="Thời gian chuyển biểu giá ngày cuối tuần mùa ${meta.season}">
            </div>
        </div>
    `;
    }

    function initTariffSeason(meta) {
        window.currentTariffSeasonMeta = meta;

        $(".tariff-day")
            .off("change.tariff")
            .on("change.tariff", function () {
                updateTariffSeasonHidden(meta);
            });

        $("#workdayTariffRows").empty();
        $("#weekendTariffRows").empty();

        addTariffTimeRow("workday", "00", "00", "3");
        addTariffTimeRow("weekend", "00", "00", "3");

        updateTariffSeasonHidden(meta);
    }


    function buildTariffDayTypeValue(season) {
        const values = [];

        for (let d = 2; d <= 8; d++) {
            const checked = $(`input[name="season${season}_day_${d}"]:checked`).val();

            if (!checked) {
                return "";
            }

            values.push(checked);
        }

        return `(${values.join(";")})`;
    }
    function updateTariffSeasonHidden(meta) {
        if (!meta) {
            toastr.error("Không xác định được mùa biểu giá", "Thông báo");
            return false;
        }

        const dayValue = buildTariffDayTypeValue(meta.season);
        const workValue = buildTariffTimeValueForObis("workday");
        const weekendValue = buildTariffTimeValueForObis("weekend");

        $("#" + meta.dayId).val(dayValue);
        $("#" + meta.workId).val(workValue);
        $("#" + meta.weekendId).val(weekendValue);

        return true;
    }
    function renderParams(eventKey) {
        const cfg = eventConfigs[eventKey];
        const div = document.getElementById("eventParams");

        div.innerHTML = "";

        if (!cfg) return;

        if (eventKey === "TOU_SEASON_ACTIVE_TIME" || eventKey === "FUTURE_TOU_SEASON_ACTIVE_TIME") {
            div.innerHTML = `
            <div class="season-box">
                <div class="season-toolbar">
                    <label style="margin-top: 7px;">Mùa:</label>
                    <select id="seasonSelect" class="form-control">
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                    </select>

                    <label style="margin-top: 7px;">Ngày:</label>
                    <select id="daySelect" class="form-control"></select>

                    <label style="margin-top: 7px;">Tháng:</label>
                    <select id="monthSelect" class="form-control"></select>

                    <button type="button" class="btn btn-primary" onclick="addSeasonDay()">
                        Thêm
                    </button>
                </div>

                <div id="seasonList" class="season-list"></div>

                <input type="hidden"
                       id="seasonActiveTime"
                       data-obis="${cfg.params[0].obis}"
                       data-name="${cfg.params[0].viName}">
            </div>
        `;

            initSeasonActiveTime();
            return;
        }

        if (TARIFF_SEASON_META[eventKey]) {
            div.innerHTML = renderTariffSeason(TARIFF_SEASON_META[eventKey]);
            initTariffSeason(TARIFF_SEASON_META[eventKey]);
            return;
        }

        cfg.params.forEach(function (p) {
            const row = document.createElement("div");
            row.className = "form-row";

            const lblVi = document.createElement("label");
            lblVi.textContent = p.viName;
            row.appendChild(lblVi);

            const inputType = detectInputType(p);
            const unitList = detectUnit(p);

            if (unitList) {
                const wrap = document.createElement("div");
                wrap.className = "unit-box";

                const num = document.createElement("input");
                num.type = "number";
                num.id = p.id;
                num.placeholder = p.fomat ? `Nhập giá trị: ${p.fomat}` : "Nhập giá trị…";
                num.setAttribute("data-obis", p.obis);
                num.setAttribute("data-name", p.viName);
                num.setAttribute("title", p.fomat ? `Format yêu cầu: ${p.fomat}` : "");
                attachAutoValidate(num, p.fomat);

                const sel = document.createElement("select");
                sel.className = "unit";

                unitList.forEach(function (u) {
                    const op = document.createElement("option");
                    op.value = u;
                    op.textContent = u;
                    sel.appendChild(op);
                });

                wrap.appendChild(num);
                wrap.appendChild(sel);
                row.appendChild(wrap);

            } else if (inputType === "time") {
                const wrap = document.createElement("div");
                wrap.className = "unit-box";

                const num = document.createElement("input");
                num.type = "number";
                num.id = p.id;
                num.placeholder = p.fomat ? `Nhập giá trị: ${p.fomat}` : "Nhập thời gian…";
                num.setAttribute("data-obis", p.obis);
                num.setAttribute("data-name", p.viName);
                num.setAttribute("title", p.fomat ? `Format yêu cầu: ${p.fomat}` : "");
                attachAutoValidate(num, p.fomat);

                const sel = document.createElement("select");
                sel.className = "unit";

                UNIT_GROUPS.TIME.forEach(function (u) {
                    const op = document.createElement("option");
                    op.value = u;
                    op.textContent = u;
                    sel.appendChild(op);
                });

                wrap.appendChild(num);
                wrap.appendChild(sel);
                row.appendChild(wrap);

            } else if (inputType === "number") {
                const num = document.createElement("input");
                num.type = "number";
                num.id = p.id;
                num.placeholder = p.fomat ? `Nhập giá trị: ${p.fomat}` : "";
                num.setAttribute("data-obis", p.obis);
                num.setAttribute("data-name", p.viName);
                num.setAttribute("title", p.fomat ? `Format yêu cầu: ${p.fomat}` : "");
                attachAutoValidate(num, p.fomat);

                row.appendChild(num);

            } else {
                const txt = document.createElement("input");
                txt.type = "text";
                txt.id = p.id;
                txt.placeholder = p.fomat ? `Nhập giá trị: ${p.fomat}` : "Nhập dữ liệu…";
                txt.setAttribute("data-obis", p.obis);
                txt.setAttribute("data-name", p.viName);
                txt.setAttribute("title", p.fomat ? `Format yêu cầu: ${p.fomat}` : "");
                attachAutoValidate(txt, p.fomat);

                row.appendChild(txt);
            }

            div.appendChild(row);
        });
    }

    // 👇 THÊM 2 DÒNG NÀY
    window.addTariffTimeRow = addTariffTimeRow;
    window.removeTariffTimeRow = removeTariffTimeRow;
    function addTariffTimeRow(type, hour = "00", minute = "00", tariff = "1") {
        const targetId = type === "workday" ? "#workdayTariffRows" : "#weekendTariffRows";
        const rowId = "tariff_" + type + "_" + Date.now() + "_" + Math.floor(Math.random() * 1000);

        const html = `
        <div class="tariff-time-row" id="${rowId}" data-type="${type}">
            <label>Giờ</label>
            <select class="tariff-hour form-control">
                ${buildHourOptions(hour)}
            </select>

            <label>Phút</label>
            <select class="tariff-minute form-control">
                ${buildMinuteOptions(minute)}
            </select>

            <label>Biểu giá</label>
            <select class="tariff-type form-control">
                <option value="1">Bình thường</option>
                <option value="2">Cao điểm</option>
                <option value="3">Thấp điểm</option>
            </select>

            <button type="button" class="btn btn-danger btn-sm" onclick="removeTariffTimeRow('${rowId}')">
                Xóa
            </button>
        </div>
    `;

        $(targetId).append(html);

        $("#" + rowId).find("select")
            .off("change.tariff1")
            .on("change.tariff1", function () {
                updateTariffSeason1Hidden();
                validateTariffRowsUi(type);
            });

        updateTariffSeason1Hidden();
        validateTariffRowsUi(type);
    }

    function validateTariffRowsUi(type) {
        const result = validateTariffRows(type);
        const boxId = type === "workday" ? "#workdayTariffError" : "#weekendTariffError";
        const container = type === "workday" ? "#workdayTariffRows" : "#weekendTariffRows";

        $(`${container} .tariff-time-row`).removeClass("tariff-row-error");

        const rows = [];

        $(`${container} .tariff-time-row`).each(function () {
            const hour = $(this).find(".tariff-hour").val();
            const minute = $(this).find(".tariff-minute").val();
            const timeKey = `${hour}${minute}`;

            rows.push({
                $row: $(this),
                timeKey
            });
        });

        const counts = {};
        rows.forEach(x => {
            counts[x.timeKey] = (counts[x.timeKey] || 0) + 1;
        });

        rows.forEach(x => {
            if (counts[x.timeKey] > 1) {
                x.$row.addClass("tariff-row-error");
            }
        });

        if (!$(boxId).length) return result.valid;

        if (!result.valid) {
            $(boxId).html(result.message).show();
        } else {
            $(boxId).hide().html("");
        }

        return result.valid;
    }
    function removeTariffTimeRow(rowId) {
        $("#" + rowId).remove();
        updateTariffSeason1Hidden();
    }

    function buildHourOptions(selectedHour) {
        let html = "";

        for (let i = 0; i <= 23; i++) {
            const v = String(i).padStart(2, "0");
            html += `<option value="${v}" ${v === selectedHour ? "selected" : ""}>${v}</option>`;
        }

        return html;
    }

    function buildMinuteOptions(selectedMinute) {
        let html = "";

        for (let i = 0; i <= 59; i++) {
            const v = String(i).padStart(2, "0");
            html += `<option value="${v}" ${v === selectedMinute ? "selected" : ""}>${v}</option>`;
        }

        return html;
    }



    function getTariffRows(type) {
        const rows = [];

        $(`.tariff-time-row[data-type="${type}"]`).each(function () {
            rows.push({
                hour: $(this).find(".tariff-hour").val(),
                minute: $(this).find(".tariff-minute").val(),
                tariff: $(this).find(".tariff-type").val()
            });
        });

        rows.sort(function (a, b) {
            return Number(a.hour + a.minute) - Number(b.hour + b.minute);
        });

        return rows;
    }

    // =============================
    // Combobox
    // =============================
    const eventSelect = document.getElementById("eventSelect");

    function initSelect() {
        eventSelect.innerHTML = "";

        const groups = {};

        // gom theo group
        for (const key in eventConfigs) {
            const item = eventConfigs[key];
            const groupName = item.group || "Khác";

            if (!groups[groupName]) {
                groups[groupName] = [];
            }

            groups[groupName].push({
                key,
                text: item.displayName
            });
        }

        // render optgroup
        for (const groupName in groups) {
            const optgroup = document.createElement("optgroup");
            optgroup.label = groupName;

            groups[groupName].forEach(item => {
                const opt = document.createElement("option");
                opt.value = item.key;
                opt.textContent = item.text;
                optgroup.appendChild(opt);
            });

            eventSelect.appendChild(optgroup);
        }
    }

    eventSelect.addEventListener("change", () => {
        stopReading = true;   // 🚫 yêu cầu dừng đọc obis
        renderParams(eventSelect.value);
        $("#msg").html("");
        $("#msg").hide();
    });

    // Khởi tạo
    initSelect();
    renderParams("TOU_SEASON_ACTIVE_TIME");

    function findParamConfigById(id) {
        for (const key in eventConfigs) {
            const params = eventConfigs[key].params;
            for (const p of params) {
                if (p.id === id) return p;
            }
        }
        return null;
    }

    // 👉 Cho phép các hàm bên ngoài LuuCauHinh() gọi
    window.findParamConfigById = findParamConfigById;
}
// =============================
// Validate theo fomat (auto)
// =============================
function validateFormat(value, format) {
    if (!format) return true;

    const fmt = format.trim();

    // TH không có phần thập phân (VD: XX)
    if (!fmt.includes(".")) {
        const intLength = fmt.length;
        const regex = new RegExp(`^\\d{1,${intLength}}$`);
        return regex.test(value);
    }

    // TH có thập phân (VD: XX.XXXX)
    const [intFmt, decFmt] = fmt.split(".");
    const intLength = intFmt.length;
    const decLength = decFmt.length;

    const regex = new RegExp(`^\\d{1,${intLength}}\\.\\d{1,${decLength}}$`);
    return regex.test(value);
}

// =============================
// Gắn auto validation vào input
// =============================
function attachAutoValidate(inputElement, format) {
    if (!format) return;

    inputElement.addEventListener("input", () => {
        const val = inputElement.value;

        if (validateFormat(val, format)) {
            inputElement.classList.remove("invalid");
        } else {
            inputElement.classList.add("invalid");
        }
    });
}

// =========================
// Modal nhập mật khẩu công tơ
// =========================
function ensureMeterPasswordModal() {
    if (document.getElementById("modalMeterPassword")) return;

    const modalHtml = `
        <div class="modal fade" id="modalMeterPassword" tabindex="-1" role="dialog" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Nhập mật khẩu công tơ</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Đóng">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>

                    <div class="modal-body">
                        <div class="form-group mb-0">
                            <label for="meterPasswordInput">Mật khẩu</label>
                            <input
                                type="password"
                                id="meterPasswordInput"
                                class="form-control"
                                placeholder="Nhập mật khẩu công tơ"
                                autocomplete="off"
                            />
                            <small class="text-muted">Mật khẩu sẽ được dùng để ghi cấu hình công tơ.</small>
                        </div>
                    </div>

                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Hủy</button>
                        <button type="button" class="btn btn-primary" id="btnConfirmMeterPassword">Xác nhận</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    $("body").append(modalHtml);
}
function getTariffMetaByEventKey(eventKey) {
    const season = Number(String(eventKey || "").replace("TOU_TARIFF_SEASON_", ""));

    const map = {
        1: {
            season: 1,
            dayId: "dinhnghiangaylamviecmua1",
            dayObis: "0.0.13.1.1",
            workId: "caidatthoigianbieugiangaylamviecmua1",
            workObis: "0.0.13.2.1",
            weekendId: "caidatthoigianbieugiangaycuoituanmua1",
            weekendObis: "0.0.13.2.2"
        },
        2: {
            season: 2,
            dayId: "dinhnghiangaylamviecmua2",
            dayObis: "0.0.13.1.2",
            workId: "caidatthoigianbieugiangaylamviecmua2",
            workObis: "0.0.13.2.3",
            weekendId: "caidatthoigianbieugiangaycuoituanmua2",
            weekendObis: "0.0.13.2.4"
        },
        3: {
            season: 3,
            dayId: "dinhnghiangaylamviecmua3",
            dayObis: "0.0.13.1.3",
            workId: "caidatthoigianbieugiangaylamviecmua3",
            workObis: "0.0.13.2.5",
            weekendId: "caidatthoigianbieugiangaycuoituanmua3",
            weekendObis: "0.0.13.2.6"
        },
        4: {
            season: 4,
            dayId: "dinhnghiangaylamviecmua4",
            dayObis: "0.0.13.1.4",
            workId: "caidatthoigianbieugiangaylamviecmua4",
            workObis: "0.0.13.2.7",
            weekendId: "caidatthoigianbieugiangaycuoituanmua4",
            weekendObis: "0.0.13.2.8"
        }
    };

    return map[season] || null;
}

function getTariffRows(type) {
    const rows = [];

    $(`.tariff-time-row[data-type="${type}"]`).each(function () {
        rows.push({
            hour: String($(this).find(".tariff-hour").val() || "00"),
            minute: String($(this).find(".tariff-minute").val() || "00"),
            tariff: String($(this).find(".tariff-type").val() || "1")
        });
    });

    rows.sort(function (a, b) {
        return Number(a.hour + a.minute) - Number(b.hour + b.minute);
    });

    return rows;
}
function validateTariffRowsUi(type) {
    const result = validateTariffRows(type);
    const boxId = type === "workday" ? "#workdayTariffError" : "#weekendTariffError";

    if (!$(boxId).length) return;

    if (!result.valid) {
        $(boxId).html(result.message).show();
    } else {
        $(boxId).hide().html("");
    }
}
function validateTariffRows(type) {
    const rows = getTariffRows(type);

    const label = type === "workday"
        ? "ngày làm việc"
        : "ngày cuối tuần";

    if (!rows || rows.length === 0) {
        return {
            valid: false,
            message: `Vui lòng cài ít nhất một mốc thời gian biểu giá ${label}`
        };
    }

    const times = rows.map(x => `${x.hour}${x.minute}`);
    const duplicate = times.find((x, index) => times.indexOf(x) !== index);

    if (duplicate) {
        return {
            valid: false,
            message: `Biểu giá ${label} bị trùng mốc giờ ${duplicate.substring(0, 2)}:${duplicate.substring(2, 4)}`
        };
    }

    if (!times.includes("0000")) {
        return {
            valid: false,
            message: `Biểu giá ${label} phải có mốc bắt đầu 00:00`
        };
    }

    return {
        valid: true,
        message: "OK"
    };
}
function buildTariffTimeValueForObis(type) {
    const rows = getTariffRows(type);

    if (!rows || rows.length === 0) return "";

    return rows.map(function (x) {
        return `(${x.hour}${x.minute})(${x.tariff})`;
    }).join("");
}

function buildTariffDayTypeValue(season) {
    const values = [];

    for (let d = 2; d <= 8; d++) {
        const checked = $(`input[name="season${season}_day_${d}"]:checked`).val();

        if (!checked) return "";

        values.push(checked);
    }

    return `(${values.join(";")})`;
}
function validateTariffSeasonBeforeSave(meta) {
    if (!meta) {
        toastr.error("Không xác định được mùa biểu giá", "Thông báo");
        return false;
    }

    updateTariffSeasonHidden(meta);
    const dayValue = $("#" + meta.dayId).val();
    if (!dayValue) {
        toastr.error(`Vui lòng định nghĩa ngày làm việc / ngày nghỉ mùa ${meta.season}`, "Thông báo");
        return false;
    }

    const workdayCheck = validateTariffRows("workday");
    if (!workdayCheck.valid) {
        toastr.error(`Thời gian chuyển biểu giá ngày làm việc mùa ${meta.season}: ${workdayCheck.message}`, "Thông báo");
        return false;
    }

    const weekendCheck = validateTariffRows("weekend");
    if (!weekendCheck.valid) {
        toastr.error(`Thời gian chuyển biểu giá ngày cuối tuần mùa ${meta.season}: ${weekendCheck.message}`, "Thông báo");
        return false;
    }

    return true;
}
function updateTariffSeasonHidden(meta) {
    if (!meta) {
        toastr.error("Không xác định được mùa biểu giá", "Thông báo");
        return false;
    }
    $("#" + meta.dayId).val(buildTariffDayTypeValue(meta.season));
    $("#" + meta.workId).val(buildTariffTimeValueForObis("workday"));
    $("#" + meta.weekendId).val(buildTariffTimeValueForObis("weekend"));
    return true;
}
function updateSeasonHiddenValue() {
    $("#seasonActiveTime").val(buildSeasonActiveTimeValue());
}
function updateTariffSeason1Hidden() {
    const values = [];

    for (let d = 2; d <= 8; d++) {
        const val = $(`input[name="season1_day_${d}"]:checked`).val();

        if (!val) {
            console.warn("Chưa chọn thứ:", d);
            return;
        }

        values.push(val);
    }

    $("#dinhnghiangaylamviecmua1").val(`(${values.join(";")})`);

    $("#caidatthoigianbieugiangaylamviecmua1").val(
        buildTariffTimeValue(getTariffRows("workday"))
    );

    $("#caidatthoigianbieugiangaycuoituanmua1").val(
        buildTariffTimeValue(getTariffRows("weekend"))
    );
}

function buildWeekdayValue(weekdays, holiday) {
    if (!weekdays.length) return "";

    // Format: (holiday + danh sách thứ)
    // VD: ngày làm việc thứ 2-6 => (023456)
    // VD: ngày nghỉ thứ 7,CN => (178)
    return `(${holiday}${weekdays.join("")})`;
}

function buildTariffTimeValue(rows) {
    if (!rows.length) return "";

    return rows.map(function (x) {
        return `(${x.hour}${x.minute}${x.tariff})`;
    }).join("");
}
async function ThucHien_Ghi() {
    if (isReading) return;

    $("#msg").html("").show();

    const node = JSON.parse(localStorage.getItem("node") || "{}");

    if (node.type != 9) {
        toastr.error("Vui lòng chọn công tơ cần cấu hình ở cây thư mục", "Thông báo");
        return;
    }

    const eventKey = $("#eventSelect").val();
    const obisMap = {};
    let hasError = false;

    if (eventKey === "TOU_SEASON_ACTIVE_TIME") {
        const value = buildSeasonActiveTimeValue();

        if (!value) {
            toastr.warning("Vui lòng chọn ít nhất một ngày kích hoạt mùa", "Thông báo");
            return;
        }

        obisMap["0.0.13.0.0"] = value;

    } else if (eventKey && eventKey.startsWith("TOU_TARIFF_SEASON_")) {
        const meta = getTariffMetaByEventKey(eventKey);

        if (!validateTariffSeasonBeforeSave(meta)) {
            return;
        }

        obisMap[meta.dayObis] = $("#" + meta.dayId).val();
        obisMap[meta.workObis] = $("#" + meta.workId).val();
        obisMap[meta.weekendObis] = $("#" + meta.weekendId).val();

    }
    else if (eventKey === "FUTURE_TOU_SEASON_ACTIVE_TIME") {
        const value = buildSeasonActiveTimeValue();

        if (!value) {
            toastr.warning("Vui lòng chọn ít nhất một ngày kích hoạt mùa", "Thông báo");
            return;
        }

        obisMap["0.0.13.0.10"] = value;
    }
    else if (eventKey && eventKey.startsWith("FUTURE_TARIFF_SEASON_")) {
        const meta = FUTURE_TARIFF_SEASON_META[eventKey];

        div.innerHTML = renderTariffSeasonFuture(meta);
        initTariffSeasonFuture(meta);
        return;
    }
    else {
        const elements = document.querySelectorAll("[data-obis]");

        elements.forEach(function (el) {
            const obis = el.dataset.obis;
            if (!obis) return;

            let value = "";

            if (el.tagName === "INPUT") {
                value = String(el.value || "").trim();

                if (value === "") {
                    el.classList.add("invalid");
                    hasError = true;
                } else {
                    el.classList.remove("invalid");
                }

                const cfg = typeof findParamConfigById === "function"
                    ? findParamConfigById(el.id)
                    : null;

                if (cfg && cfg.fomat && typeof validateFormat === "function") {
                    if (!validateFormat(value, cfg.fomat)) {
                        el.classList.add("invalid");
                        toastr.error(`Giá trị '${value}' không đúng Format: ${cfg.fomat}`, "Sai định dạng");
                        hasError = true;
                    } else {
                        el.classList.remove("invalid");
                    }
                }
            }

            if (el.tagName === "SELECT") {
                const prev = el.previousElementSibling;

                if (prev && prev.type === "number") {
                    const numVal = String(prev.value || "").trim();

                    if (numVal === "") {
                        prev.classList.add("invalid");
                        hasError = true;
                    } else {
                        prev.classList.remove("invalid");
                    }

                    const cfg = typeof findParamConfigById === "function"
                        ? findParamConfigById(prev.id)
                        : null;

                    if (cfg && cfg.fomat && typeof validateFormat === "function") {
                        if (!validateFormat(numVal, cfg.fomat)) {
                            prev.classList.add("invalid");
                            toastr.error(`Giá trị '${numVal}' không đúng Format: ${cfg.fomat}`, "Sai định dạng");
                            hasError = true;
                        } else {
                            prev.classList.remove("invalid");
                        }
                    }

                    value = `${numVal} ${el.value}`;
                }
            }

            if (value !== "") {
                obisMap[obis] = value;
            }
        });
    }

    if (hasError) {
        toastr.error("Vui lòng nhập đúng định dạng trước khi lưu!", "Lỗi dữ liệu");
        return;
    }

    if (!Object.keys(obisMap).length) {
        toastr.warning("Không có dữ liệu cấu hình để ghi", "Thông báo");
        return;
    }

    const meterPassword = await promptMeterPasswordModal();
    LAST_METER_PASSWORD = meterPassword;
    if (meterPassword === null) return;

    if (!meterPassword) {
        toastr.info("Bạn chưa nhập mật khẩu công tơ", "Thông báo");
        return;
    }

    isReading = true;
    stopReading = false;

    try {
        const socongto = node.socongto;
        const imei = decode(node.imei);
        const ip = decode(node.ip);
        const port = decode(node.port);

        if (!ip || !port || !isValidIP(ip) || !isValidPort(port)) {
            toastr.error("IP hoặc Port không hợp lệ", "Lỗi cấu hình");
            return;
        }

        const viNameMap = {
            "0.0.13.0.0": "Thời gian kích hoạt của từng mùa",

            "0.0.13.1.1": "Định nghĩa ngày làm việc / ngày nghỉ mùa 1",
            "0.0.13.1.2": "Định nghĩa ngày làm việc / ngày nghỉ mùa 2",
            "0.0.13.1.3": "Định nghĩa ngày làm việc / ngày nghỉ mùa 3",
            "0.0.13.1.4": "Định nghĩa ngày làm việc / ngày nghỉ mùa 4",

            "0.0.13.2.1": "Thời gian chuyển biểu giá ngày làm việc mùa 1",
            "0.0.13.2.2": "Thời gian chuyển biểu giá ngày cuối tuần mùa 1",
            "0.0.13.2.3": "Thời gian chuyển biểu giá ngày làm việc mùa 2",
            "0.0.13.2.4": "Thời gian chuyển biểu giá ngày cuối tuần mùa 2",
            "0.0.13.2.5": "Thời gian chuyển biểu giá ngày làm việc mùa 3",
            "0.0.13.2.6": "Thời gian chuyển biểu giá ngày cuối tuần mùa 3",
            "0.0.13.2.7": "Thời gian chuyển biểu giá ngày làm việc mùa 4",
            "0.0.13.2.8": "Thời gian chuyển biểu giá ngày cuối tuần mùa 4"
        };

        const isTariffConfig =
            eventKey === "TOU_SEASON_ACTIVE_TIME" ||
            (eventKey && eventKey.startsWith("TOU_TARIFF_SEASON_"));

        for (const obis in obisMap) {
            if (stopReading) {
                $("#msg").append(`<p style="color:red">⛔ Đã dừng ghi cấu hình</p>`);
                break;
            }

            const el = document.querySelector(`[data-obis="${obis}"]`);
            const viName = el?.dataset?.name || viNameMap[obis] || obis;

            const value = obisMap[obis];

            const cmd = isTariffConfig
                ? `${obis}${value}`
                : `${obis}(${value})`;

            $("#msg").append(`<p>⏳ Đang ghi cấu hình: ${viName}</p>`);

            try {

                const result = await saveMeterOBIS(
                    socongto,
                    imei,
                    ip,
                    port,
                    cmd,
                    meterPassword
                );

                if (!result) {
                    FAILED_OBIS_MAP[obis] = {
                        obis,
                        cmd,
                        viName
                    };

                    $("#msg").append(`
                                        <p class="obis-error-row" style="color:red">
                                            ❌ ${viName}: Không nhận được phản hồi
                                            <button type="button"
                                                    id="btn_retry_${obis.replace(/\./g, "_")}"
                                                    class="btn btn-warning btn-sm"
                                                    onclick="retrySaveFailedObis('${obis}')">
                                                Ghi lại OBIS này
                                            </button>
                                        </p>
                                    `);

                    continue;
                }

                if (Number(result.status) === 1) {
                    delete FAILED_OBIS_MAP[obis];

                    $("#msg").append(`<p style="color:green">✔ ${viName}: ${result.message || "OK"}</p>`);
                } else {
                    FAILED_OBIS_MAP[obis] = {
                        obis,
                        cmd,
                        viName
                    };

                    $("#msg").append(`
                        <p class="obis-error-row" style="color:red">
                            ❌ ${viName}: ${result.message || "Ghi thất bại"}
                            <button type="button"
                                    id="btn_retry_${obis.replace(/\./g, "_")}"
                                    class="btn btn-warning btn-sm"
                                    onclick="retrySaveFailedObis('${obis}')">
                                Ghi lại OBIS này
                            </button>
                        </p>
                    `);
                }


            } catch (err) {
                console.error(err);
                $("#msg").append(`<p style="color:red">❌ Lỗi ghi cấu hình: ${viName} - ${err.message || err}</p>`);
            }

            const msgBox = $("#msg");
            if (msgBox[0]) {
                msgBox.scrollTop(msgBox[0].scrollHeight);
            }
        }

        $("#msg").append(`<p style="color:blue">✔ Hoàn tất ghi cấu hình</p>`);

    } finally {
        isReading = false;
    }
}
async function saveMeterOBIS(socongto, imei, ip, port, obis, meterPassword) {

    const res = await fetch("/api/cauhinhcanhbaosukiencongto", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ v_socongto: socongto, v_imei: imei, v_ip: ip, v_port: port, v_obis: obis, v_meterpassword: meterPassword })
    });

    if (!res.ok) throw new Error("API lỗi status: " + res.status);

    const data = await res.json();
    return data;
}


function isValidIP(ip) {
    return /^(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}$/.test(ip);
}

function isValidPort(port) {
    const p = Number(port);
    return p > 0 && p <= 65535;
}
function parseSeasonActiveTimeFromRead(rawValue) {
    let arr = [];

    if (Array.isArray(rawValue)) {
        arr = rawValue;
    } else {
        const text = String(rawValue || "").trim();

        arr = text.includes("(")
            ? (text.match(/\((\d{6})\)/g) || []).map(x => x.replace(/[()]/g, ""))
            : (text.match(/\d{6}/g) || []);
    }

    seasonDays[1] = [];
    seasonDays[2] = [];
    seasonDays[3] = [];
    seasonDays[4] = [];

    arr.forEach(function (raw) {
        raw = String(raw || "").trim();

        if (!/^\d{6}$/.test(raw)) return;

        const dd = raw.substring(0, 2);
        const mm = raw.substring(2, 4);
        const ss = raw.substring(4, 6);
        const season = String(Number(ss));

        if (!seasonDays[season]) return;

        const key = `${dd}/${mm}`;

        if (!seasonDays[season].some(x => x.key === key)) {
            seasonDays[season].push({
                key,
                day: dd,
                month: mm,
                season,
                value: raw
            });
        }
    });

    renderSeasonList();
    refreshAvailableDays();
    updateSeasonHiddenValue();
}

function getObisValueFromReadResponse(value, obis) {
    if (!value) return "";

    if (typeof value === "object" && value.data && value.data[obis] !== undefined) {
        const v = value.data[obis];

        if (Array.isArray(v)) {
            return v.join("");
        }

        return String(v);
    }

    if (typeof value === "string") {
        return value;
    }

    return "";
}
async function ThuHien_Doc() {
    if (isReading) return;
    // 🧹 Xóa toàn bộ textbox trước khi đọc
    document.querySelectorAll("[data-obis]").forEach(el => {
        if (el.tagName === "INPUT") {
            el.value = "";
        }
    });
    var node = JSON.parse(localStorage.getItem("node"));
    let loaithumuc = node.type;

    if (loaithumuc != 9) {
        toastr.error("Vui lòng chọn công tơ cần cấu hình ở cây thư mục", "Thông báo", {
            positionClass: "toast-top-right",
            timeOut: 5000,
            closeButton: true,
            progressBar: true
        });
        return;
    }

    if (!confirm("Bạn có chắc chắn muốn thực hiện")) return;

    $("#msg").html("").show();

    isReading = true;
    stopReading = false;

    var socongto = node.socongto;
    var imei = decode(node.imei);
    var ip = decode(node.ip);
    var port = decode(node.port);

    // ✅ validate
    if (!ip || !port || !isValidIP(ip) || !isValidPort(port)) {
        toastr.error("IP hoặc Port không hợp lệ", "Lỗi cấu hình", {
            positionClass: "toast-top-right",
            timeOut: 3000,
            closeButton: true,
            progressBar: true
        });
        isReading = false;
        return;
    }

    const obisList = await getObisList();

    for (let i = 0; i < obisList.length; i++) {

        if (stopReading) {
            $("#msg").append(`<p style="color:red">⛔ Đã dừng đọc cấu hình</p>`);
            break;
        }

        const { obis, id, viName } = obisList[i];

        $("#msg").append(`<p>⏳ Đang đọc: ${viName}</p>`);

        try {
            const value = await readMeterOBIS(socongto, imei, ip, port, `${obis}()`);

            const eventKey = $("#eventSelect").val();
            if (eventKey === "TOU_SEASON_ACTIVE_TIME") {
                const raw = getObisValueFromReadResponse(value, obis);
                parseSeasonActiveTimeFromRead(raw);
                if (raw) {
                    $("#msg").append(`<p style="color:green">✔ Đọc thành công: ${viName} = ${Object.values(value.data)[0] || "null"}</p>`);
                } else {
                    $("#msg").append(`<p style="color:red">❌ Lỗi đọc: ${viName}</p>`);
                }


            } else if (eventKey && eventKey.startsWith("TOU_TARIFF_SEASON_")) {
                const season = getTariffSeasonNo(eventKey);
                const meta = getTariffMetaBySeason(season);

                const nameMap = {
                    [meta.dayObis]: `Định nghĩa ngày làm việc / ngày nghỉ mùa ${season}`,
                    [meta.workObis]: `Thời gian chuyển biểu giá ngày làm việc mùa ${season}`,
                    [meta.weekendObis]: `Thời gian chuyển biểu giá ngày cuối tuần mùa ${season}`
                };
                if (value) {
                    $("#msg").append(`<p style="color:green">✔ Đọc thành công: ${Object.values(value.data)[0]}</p>`);
                }
                fillTariffSeasonReadValue(season, value, obis);
            }
            else if (eventKey === "METER_TIME_SETTING") {
                const raw = getObisValueFromReadResponse(value, obis);
                fillMeterTimeSetting(raw);
                if (raw) {
                    $("#msg").append(`
                    <p style="color:green">
                        ✔ Đọc thành công: ${viName} = ${raw || "null"}
                    </p>
                `);
                } else {
                    $("#msg").append(`<p style="color:red">❌ Lỗi đọc: ${viName}</p>`);
                }


            } else if (eventKey === "FUTURE_TOU_SEASON_ACTIVE_TIME") {
                const raw = getObisValueFromReadResponse(value, obis);
                parseSeasonActiveTimeFromRead(raw);
                if (raw) {
                    $("#msg").append(`<p style="color:green">✔ Đọc thành công: ${viName} = ${Object.values(value.data)[0] || "null"}</p>`);
                } else {
                    $("#msg").append(`<p style="color:red">❌ Lỗi đọc: ${viName}</p>`);
                }


            }
            else {
                const el = document.getElementById(id);
                let giatri = value?.data?.[obis];

                if (Array.isArray(giatri)) {
                    giatri = giatri[0] ?? "";
                } else if (giatri === null || giatri === undefined) {
                    giatri = "";
                } else {
                    giatri = String(giatri);
                }
                if (el) {
                    ganGiaTriVaoTextbox(el, giatri);
                }
                // ✅ log thành công
                $("#msg").append(`
                    <p style="color:green">
                        ✔ Đọc thành công: ${viName} = ${giatri ?? "null"}
                    </p>`)
            }



        } catch (err) {
            $("#msg").append(`<p style="color:red">❌ Lỗi đọc: ${viName} - ${err}</p>`);
        }

        // auto scroll xuống cuối
        const msgBox = $("#msg");
        msgBox.scrollTop(msgBox[0].scrollHeight);
    }

    isReading = false;

    $("#msg").append(`<p style="color:blue">✔ Hoàn tất đọc cấu hình</p>`);
}
function fillMeterTimeSetting(rawValue) {

    const value = String(rawValue || "").trim();

    // YYMMDDHHmmss
    if (!/^\d{12}$/.test(value)) {
        console.log("Sai format thời gian:", value);
        return;
    }

    const yy = value.substring(0, 2);
    const mm = value.substring(2, 4);
    const dd = value.substring(4, 6);
    const hh = value.substring(6, 8);
    const mi = value.substring(8, 10);
    const ss = value.substring(10, 12);

    const yyyy = Number(yy) >= 70
        ? `19${yy}`
        : `20${yy}`;

    $("#meterTimeDay").val(dd);
    $("#meterTimeMonth").val(mm);
    $("#meterTimeYear").val(yyyy);
    $("#meterTimeHour").val(hh);
    $("#meterTimeMinute").val(mi);
    $("#meterTimeSecond").val(ss);

    $("#meterTimeSetting").val(value);
}
function getTariffSeasonNo(eventKey) {
    return Number(String(eventKey).replace("TOU_TARIFF_SEASON_", ""));
}

function getTariffMetaBySeason(season) {
    const map = {
        1: {
            dayObis: "0.0.13.1.1",
            workObis: "0.0.13.2.1",
            weekendObis: "0.0.13.2.2"
        },
        2: {
            dayObis: "0.0.13.1.2",
            workObis: "0.0.13.2.3",
            weekendObis: "0.0.13.2.4"
        },
        3: {
            dayObis: "0.0.13.1.3",
            workObis: "0.0.13.2.5",
            weekendObis: "0.0.13.2.6"
        },
        4: {
            dayObis: "0.0.13.1.4",
            workObis: "0.0.13.2.7",
            weekendObis: "0.0.13.2.8"
        }
    };

    return map[season];
}

function getReadDataObject(value) {
    if (!value) return {};

    if (value.data && typeof value.data === "object") {
        return value.data;
    }

    return value;
}

function getObisArray(data, obis) {
    const v = data?.[obis];

    if (Array.isArray(v)) return v;

    if (typeof v === "string") {
        if (v.includes("(")) {
            return (v.match(/\(([^)]*)\)/g) || []).map(x => x.replace(/[()]/g, ""));
        }

        return [v];
    }

    return [];
}

function fillDayTypeSeasonByValue(season, value) {
    const arr = String(value || "").split(";");

    for (let i = 0; i < 7; i++) {
        const day = i + 2;
        const val = arr[i] || "1";

        // UI mới
        $(`input[name="season${season}_day_${day}"][value="${val}"]`).prop("checked", true);

        // UI cũ trong file hiện tại của bạn
        $(`input[name="day_${day}"][value="${val}"]`).prop("checked", true);
    }
}

function parseTariffRowsFromArray(arr) {
    const rows = [];

    for (let i = 0; i < arr.length; i += 2) {
        const time = String(arr[i] || "");
        const tariff = String(arr[i + 1] || "1");

        if (!/^\d{4}$/.test(time)) continue;

        rows.push({
            hour: time.substring(0, 2),
            minute: time.substring(2, 4),
            tariff
        });
    }

    return rows;
}

function fillTariffRowsFromRead(type, rows) {
    if (!rows || !rows.length) return;

    const target = type === "workday"
        ? "#workdayTariffRows"
        : "#weekendTariffRows";

    $(target).empty();

    rows.forEach(x => {
        addTariffTimeRow(type, x.hour, x.minute, x.tariff);
    });
}
function fillTariffSeasonReadValue(season, value, currentObis) {
    const meta = getTariffMetaBySeason(season);
    if (!meta) return;

    const data = getReadDataObject(value);

    const dayArr = getObisArray(data, meta.dayObis);
    const workArr = getObisArray(data, meta.workObis);
    const weekendArr = getObisArray(data, meta.weekendObis);

    if (currentObis === meta.dayObis && dayArr.length) {
        fillDayTypeSeasonByValue(season, dayArr[0]);
    }

    if (currentObis === meta.workObis && workArr.length) {
        fillTariffRowsFromRead("workday", parseTariffRowsFromArray(workArr));
    }

    if (currentObis === meta.weekendObis && weekendArr.length) {
        fillTariffRowsFromRead("weekend", parseTariffRowsFromArray(weekendArr));
    }

}
async function getObisList() {
    const elements = document.querySelectorAll("[data-obis]");
    const unique = new Set();

    elements.forEach(el => {

        const obis = el.dataset.obis;
        const id = el.id;
        const viName = el.dataset.name;
        // chỉ lấy INPUT, tránh lấy SELECT 2 lần
        if (el.tagName === "INPUT" && obis) {
            unique.add(JSON.stringify({ obis, id, viName }));
        }
    });

    // Convert về object array
    return [...unique].map(x => JSON.parse(x));
}
async function readMeterOBIS(socongto, imei, ip, port, obis) {

    const res = await fetch("/api/read-obis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ v_socongto: socongto, v_imei: imei, v_ip: ip, v_port: port, v_obis: obis })
    });

    if (!res.ok) throw new Error("API lỗi status: " + res.status);

    const data = await res.json();
    if (!data || !data.data) {
        // toastr.error(data.message, "Thông báo");
        if (data.status == 1) {
            $("#msg").append(`<p>→ ${data.message}</p>`);
        } else {
            $("#msg").append(`<p style="color:red">❌ ${data.message}</p>`);
        }
        return;
    }

    // const value = Object.values(data.data)[0];
    return data;
}

function ganGiaTriVaoTextbox(inputEl, value) {
    /*
        value có thể là:
 
        "176.0" → set vào input
        "176.0 V" → tách số và đơn vị
        "10 Second" → tách số + đơn vị + gán vào select
    */

    const parts = value.trim().split(" ");

    if (parts.length === 1) {
        // chỉ giá trị
        inputEl.value = parts[0];
        return;
    }

    if (parts.length >= 2) {
        const val = parts[0];
        const unit = parts.slice(1).join(" ");

        inputEl.value = val;

        // tìm SELECT đơn vị nằm ngay sau input
        const selectEl = inputEl.nextElementSibling;
        if (selectEl && selectEl.tagName === "SELECT") {
            selectEl.value = unit;
        }
    }
}

function promptMeterPasswordModal() {
    return new Promise((resolve) => {
        const modalEl = document.getElementById("modalMeterPassword");
        if (!modalEl) {
            resolve(null);
            return;
        }

        const input = document.getElementById("meterPasswordInput");
        const btnConfirm = document.getElementById("btnConfirmMeterPassword");
        const btnCancel = modalEl.querySelector('[data-dismiss="modal"], [data-bs-dismiss="modal"]');

        if (!input || !btnConfirm || !btnCancel) {
            resolve(null);
            return;
        }

        input.value = "";

        let settled = false;
        let bsModal;

        function safeResolve(value) {
            if (settled) return;
            settled = true;
            resolve(value);
        }

        if (typeof bootstrap !== "undefined") {
            bsModal = bootstrap.Modal.getOrCreateInstance(modalEl, {
                backdrop: "static",
                keyboard: true
            });
        } else if (window.$ && $(modalEl).modal) {
            bsModal = {
                show: () => $(modalEl).modal("show"),
                hide: () => $(modalEl).modal("hide")
            };
        } else {
            alert("Chưa load Bootstrap JS");
            safeResolve(null);
            return;
        }

        function cleanup() {
            btnConfirm.removeEventListener("click", onConfirm);
            btnCancel.removeEventListener("click", onCancel);
            input.removeEventListener("keydown", onKeydown);
            modalEl.removeEventListener("hidden.bs.modal", onHidden);
        }

        function onConfirm() {
            const val = input.value.trim();
            if (!val) {
                toastr.error("Vui lòng nhập mật khẩu");
                input.focus();
                return;
            }

            cleanup();
            safeResolve(val);
            bsModal.hide();
        }

        function onCancel(e) {
            e.preventDefault();
            e.stopPropagation();

            cleanup();
            safeResolve(null);
            bsModal.hide();
        }

        function onHidden() {
            cleanup();
            safeResolve(null);
        }

        function onKeydown(e) {
            if (e.key === "Enter") {
                e.preventDefault();
                onConfirm();
            }
        }

        btnConfirm.addEventListener("click", onConfirm, { once: false });
        btnCancel.addEventListener("click", onCancel, { once: false });
        input.addEventListener("keydown", onKeydown);
        modalEl.addEventListener("hidden.bs.modal", onHidden, { once: false });

        bsModal.show();
        setTimeout(() => input.focus(), 200);
    });
}
$(document).on("click", "#toggleMeterPassword", function () {
    const $input = $("#meterPasswordInput");
    const $icon = $(this).find("i");

    const isHidden = $input.attr("type") === "password";

    $input.attr("type", isHidden ? "text" : "password");
    $icon.attr("class", isHidden ? "fa fa-eye-slash" : "fa fa-eye");
    $(this).attr("aria-label", isHidden ? "Ẩn mật khẩu" : "Hiển thị mật khẩu");
});
$("#modalMeterPassword").on("hidden.bs.modal", function () {
    $("#meterPasswordInput").attr("type", "password").val("");
    $("#toggleMeterPassword i").attr("class", "fa fa-eye");
    $("#toggleMeterPassword").attr("aria-label", "Hiển thị mật khẩu");
});
async function retrySaveFailedObis(obis) {
    const item = FAILED_OBIS_MAP[obis];

    if (!item) {
        toastr.warning("Không tìm thấy OBIS cần ghi lại", "Thông báo");
        return;
    }

    const node = JSON.parse(localStorage.getItem("node") || "{}");

    const socongto = node.socongto;
    const imei = decode(node.imei);
    const ip = decode(node.ip);
    const port = decode(node.port);

    let meterPassword = LAST_METER_PASSWORD;

    if (!meterPassword) {
        meterPassword = await promptMeterPasswordModal();
        if (!meterPassword) return;
        LAST_METER_PASSWORD = meterPassword;
    }

    const btnId = `btn_retry_${obis.replace(/\./g, "_")}`;
    const $btn = $("#" + btnId);

    $btn.prop("disabled", true).text("Đang ghi lại...");

    try {
        const result = await saveMeterOBIS(
            socongto,
            imei,
            ip,
            port,
            item.cmd,
            meterPassword
        );

        if (result && Number(result.status) === 1) {
            delete FAILED_OBIS_MAP[obis];

            $btn.closest(".obis-error-row").html(`
                <span style="color:green">
                    ✔ Ghi lại thành công: ${item.viName}: ${result.message || "OK"}
                </span>
            `);

            toastr.success(`Ghi lại thành công ${item.viName}`, "Thông báo");

        } else {
            $btn.prop("disabled", false).text("Ghi lại OBIS này");

            toastr.error(
                `${item.viName}: ${result?.message || "Ghi lại thất bại"}`,
                "Thông báo"
            );
        }

    } catch (err) {
        console.error(err);

        $btn.prop("disabled", false).text("Ghi lại OBIS này");

        toastr.error(
            `${item.viName}: ${err.message || err}`,
            "Lỗi ghi lại"
        );
    }
}

window.retrySaveFailedObis = retrySaveFailedObis;