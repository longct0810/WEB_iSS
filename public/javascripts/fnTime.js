function timesubday1(time, add) {
  try {
    if (time == null || time == undefined || time == "") return "";
    var t = time.substring(3, 5) + "/" + time.substring(0, 2) + "/" + time.substring(6, 10);
    var date = new Date(t);

    var newdate = new Date(date);
    newdate.setDate(newdate.getDate() - add);

    var dd = newdate.getDate();
    var mm = newdate.getMonth() + 1;
    var y = newdate.getFullYear();

    var someFormattedDate = (dd.toString().length == 1 ? "0" + dd : dd) + "/" + (mm.toString().length == 1 ? "0" + mm : mm) + "/" + y;
    return someFormattedDate;
  } catch (e) {
    //console.log(e);
    return "";
  }

}
function gettimenow() {
  try {
    var t = new Date();
    var d = t.getDate().toString().length == 1 ? "0" + t.getDate() : t.getDate();
    var m = (t.getMonth() + 1).toString().length == 1 ? "0" + (t.getMonth() + 1) : (t.getMonth() + 1);
    var y = t.getFullYear().toString().length == 1 ? "0" + t.getFullYear() : t.getFullYear();
    var tt = d + "/" + m + "/" + y;
    return tt;
  } catch (e) {
    ////console.log(e);
    return "";
  }
}

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
function compareTwoDate(date1, date2) {
  if (date1 < date2) {
    return -1
  }
  else if (date1 > date2) {
    return 1;
  }
  else {
    return 0;
  }

}

function stringToDate(_date, _format, _delimiter) {
  var formatLowerCase = _format.toLowerCase();
  var formatItems = formatLowerCase.split(_delimiter);
  var dateItems = _date.split(_delimiter);
  var monthIndex = formatItems.indexOf("mm");
  var dayIndex = formatItems.indexOf("dd");
  var yearIndex = formatItems.indexOf("yyyy");
  var month = parseInt(dateItems[monthIndex]);
  month -= 1;
  var formatedDate = new Date(dateItems[yearIndex], month, dateItems[dayIndex]);
  return formatedDate;
}

function getListTime() {
  let lst_time = [];
  lst_time = lst_time.concat(
    [
      { label: '00:00', value: '00:00' },
      { label: '00:30', value: '00:30' },
      { label: '01:00', value: '01:00' },
      { label: '01:30', value: '01:30' },
      { label: '02:00', value: '02:00' },
      { label: '02:30', value: '02:30' },
      { label: '03:00', value: '03:00' },
      { label: '03:30', value: '03:30' },
      { label: '04:00', value: '04:00' },
      { label: '04:30', value: '04:30' },
      { label: '05:00', value: '05:00' },
      { label: '05:30', value: '05:30' },
      { label: '06:00', value: '06:00' },
      { label: '06:30', value: '06:30' },
      { label: '07:00', value: '07:00' },
      { label: '07:30', value: '07:30' },
      { label: '08:00', value: '08:00' },
      { label: '08:30', value: '08:30' },
      { label: '09:00', value: '09:00' },
      { label: '09:30', value: '09:30' },
      { label: '10:00', value: '10:00' },
      { label: '10:30', value: '10:30' },
      { label: '11:00', value: '11:00' },
      { label: '11:30', value: '11:30' },
      { label: '12:00', value: '12:00' },
      { label: '12:30', value: '12:30' },
      { label: '13:00', value: '13:00' },
      { label: '13:30', value: '13:30' },
      { label: '14:00', value: '14:00' },
      { label: '14:30', value: '14:30' },
      { label: '15:00', value: '15:00' },
      { label: '15:30', value: '15:30' },
      { label: '16:00', value: '16:00' },
      { label: '16:30', value: '16:30' },
      { label: '17:00', value: '17:00' },
      { label: '17:30', value: '17:30' },
      { label: '18:00', value: '18:00' },
      { label: '18:30', value: '18:30' },
      { label: '19:00', value: '19:00' },
      { label: '19:30', value: '19:30' },
      { label: '20:00', value: '20:00' },
      { label: '20:30', value: '20:30' },
      { label: '21:00', value: '21:00' },
      { label: '21:30', value: '21:30' },
      { label: '22:00', value: '22:00' },
      { label: '22:30', value: '22:30' },
      { label: '23:00', value: '23:00' },
      { label: '23:30', value: '23:30' },
    ]);
  return lst_time;
}
function gettimenow_cscthang() {
  try {
    var t = new Date();
    var d = t.getDate().toString().length == 1 ? "0" + t.getDate() : t.getDate();
    var m = (t.getMonth() + 1).toString().length == 1 ? "0" + (t.getMonth() + 1) : (t.getMonth() + 1);
    var y = t.getFullYear().toString().length == 1 ? "0" + t.getFullYear() : t.getFullYear();
    var tt = m + "/" + y;
    return tt;
  } catch (e) {
    ////console.log(e);
    return "";
  }

}

//dd/MM/yyyy ==> 2015, 07,30 (time)
function timeyyyymmdd(t) {
  try {
    return new Date(t.substring(6, 10), parseInt(t.substring(3, 5)) - 1, t.substring(0, 2));
  } catch (e) {
    ////console.log(e);
    return "";
  }

}
function dataToCob(idCb, data, value, name, addValue, addName) {
  try {
    $("#" + idCb).empty();
    if (addValue != null && addValue != undefined && addValue != "" && addName != null && addName != undefined && addName != "")
      $("#" + idCb).append('<option value="' + addValue + '">' + addName + '</option>');
    $.each(data, function (key, val) {
      $('#' + idCb).append($('<option>', {
        value: val[value],
        text: val[name]
      }));
    });
    if (addValue != null && addValue != undefined && addValue != "" && addName != null && addName != undefined && addName != "")
      $('#' + idCb + ' option[value=' + addValue + ']').prop("selected", true);
  } catch (e) { console.log(e); }
}
function compareDates(from, to) {
  var dateResult = to.getTime() - from.getTime();
  var datedays = 0;
  //var dateObj = {};
  //dateObj.weeks = Math.round(dateResult / (1000 * 60 * 60 * 24 * 7));
  datedays = Math.ceil(dateResult / (1000 * 60 * 60 * 24));
  //dateObj.hours = Math.ceil(dateResult / (1000 * 60 * 60));
  //dateObj.minutes = Math.ceil(dateResult / (1000 * 60));
  //dateObj.seconds = Math.ceil(dateResult / (1000));
  //dateObj.milliseconds = dateResult;
  return datedays;
}

//trả về ngày cuối cùng của tháng
function getLastDayOfMonth(year, month) {
  // lấy date ứng với ngày đầu tiên của tháng tiếp theo
  let date = new Date(year, month);

  // giảm date đi 1 đơn vị để lấy ngày cuối cùng của tháng hiện tại
  date.setDate(date.getDate() - 1);

  // trả về date
  return date.getDate();
}

function get_first_month(t) {
  try {
    var t = new Date(t.substring(6, 10), parseInt(t.substring(3, 5)) - 1, t.substring(0, 2));
    var d = t.getDate().toString().length == 1 ? "0" + t.getDate() : t.getDate();
    var m = (t.getMonth() + 1).toString().length == 1 ? "0" + (t.getMonth() + 1) : (t.getMonth() + 1);
    var y = t.getFullYear().toString().length == 1 ? "0" + t.getFullYear() : t.getFullYear();
    var tt = d + "/" + m + "/" + y;
    return tt;
  } catch (e) {
    ////console.log(e);
    return "";
  }

}


function get_first_date(t) {
  try {
    var t = new Date(t.substring(6, 10), parseInt(t.substring(3, 5)) - 1, t.substring(0, 2));
    var d = t.getDate().toString().length == 1 ? "0" + t.getDate() : t.getDate();
    var m = (t.getMonth() + 1).toString().length == 1 ? "0" + (t.getMonth() + 1) : (t.getMonth() + 1);
    var y = t.getFullYear().toString().length == 1 ? "0" + t.getFullYear() : t.getFullYear();
    var tt = "01" + "/" + m + "/" + y;
    return tt;
  } catch (e) {
    ////console.log(e);
    return "";
  }

}