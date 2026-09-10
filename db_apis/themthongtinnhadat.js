const oracledb = require('oracledb');
const database = require('../services/database.js');

function themThongTiNhaDat(idkhuvuc, tenbds, giaban, thoidiem, loaibds
  , trangthai, dientich_thucte, dientich_so, sotang, loaimai, so_mattien, kichthuoc_mattien
  , kichthuoc_longdong, kichthuoc_viahe, loaiduong, khoangcach_duonglon, huong, nohau, hinhthai_thuadat, hientrang_sudung
  , tinhtrang_congtrinh, nguontin, mota, nhanvien_id, hinhanh) {
  return oracledb.getConnection()
    .then(function (conn) {
      return conn.execute(`BEGIN PKG_THONGTINNHADAT.P_THEM_THONGTINNHADAT(:idkhuvuc,:tenbds,:giaban,:thoidiem,:loaibds
        ,:trangthai,:dientich_thucte,:dientich_so,:sotang,:loaimai,:so_mattien,:kichthuoc_mattien
        ,:kichthuoc_longdong,:kichthuoc_viahe,:loaiduong,:khoangcach_duonglon,:huong,:nohau,:hinhthai_thuadat,:hientrang_sudung
        ,:tinhtrang_congtrinh,:nguontin,:mota,:nhanvien_id,:hinhanh
        ,:CV_1); END;`, { // EXECUTE ORACLE PROCEDURE
        idkhuvuc: {
          type: oracledb.STRING,
          dir: oracledb.BIND_IN,
          val: idkhuvuc
        },
        tenbds: {
          type: oracledb.STRING,
          dir: oracledb.BIND_IN,
          val: tenbds
        },
        giaban: {
          type: oracledb.NUMBER,
          dir: oracledb.BIND_IN,
          val: giaban
        },
        thoidiem: {
          type: oracledb.STRING,
          dir: oracledb.BIND_IN,
          val: thoidiem
        },
        loaibds: {
          type: oracledb.NUMBER,
          dir: oracledb.BIND_IN,
          val: loaibds
        },
        trangthai: {
          type: oracledb.NUMBER,
          dir: oracledb.BIND_IN,
          val: trangthai
        },
        dientich_thucte: {
          type: oracledb.NUMBER,
          dir: oracledb.BIND_IN,
          val: dientich_thucte
        },
        dientich_so: {
          type: oracledb.NUMBER,
          dir: oracledb.BIND_IN,
          val: dientich_so
        },
        sotang: {
          type: oracledb.NUMBER,
          dir: oracledb.BIND_IN,
          val: sotang
        },
        loaimai: {
          type: oracledb.NUMBER,
          dir: oracledb.BIND_IN,
          val: loaimai
        },
        so_mattien: {
          type: oracledb.NUMBER,
          dir: oracledb.BIND_IN,
          val: so_mattien
        },
        kichthuoc_mattien: {
          type: oracledb.NUMBER,
          dir: oracledb.BIND_IN,
          val: kichthuoc_mattien
        },
        kichthuoc_longdong: {
          type: oracledb.NUMBER,
          dir: oracledb.BIND_IN,
          val: kichthuoc_longdong
        },
        kichthuoc_viahe: {
          type: oracledb.NUMBER,
          dir: oracledb.BIND_IN,
          val: kichthuoc_viahe
        },
        loaiduong: {
          type: oracledb.NUMBER,
          dir: oracledb.BIND_IN,
          val: loaiduong
        },
        khoangcach_duonglon: {
          type: oracledb.NUMBER,
          dir: oracledb.BIND_IN,
          val: khoangcach_duonglon
        },
        huong: {
          type: oracledb.STRING,
          dir: oracledb.BIND_IN,
          val: huong
        },
        nohau: {
          type: oracledb.NUMBER,
          dir: oracledb.BIND_IN,
          val: nohau
        },
        hinhthai_thuadat: {
          type: oracledb.NUMBER,
          dir: oracledb.BIND_IN,
          val: hinhthai_thuadat
        },
        hientrang_sudung: {
          type: oracledb.NUMBER,
          dir: oracledb.BIND_IN,
          val: hientrang_sudung
        },
        tinhtrang_congtrinh: {
          type: oracledb.NUMBER,
          dir: oracledb.BIND_IN,
          val: tinhtrang_congtrinh
        },
        nguontin: {
          type: oracledb.NUMBER,
          dir: oracledb.BIND_IN,
          val: nguontin
        },
        mota: {
          type: oracledb.STRING,
          dir: oracledb.BIND_IN,
          val: mota
        },
        nhanvien_id: {
          type: oracledb.NUMBER,
          dir: oracledb.BIND_IN,
          val: nhanvien_id
        },
        hinhanh: {
          type: oracledb.STRING,
          dir: oracledb.BIND_IN,
          val: hinhanh
        },
        CV_1: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR }
      })
        .then((result) => {
          var resRows = [];
          var resultSet = result.outBinds.CV_1; //RESULT SET FOR OUTPUT
          var queryStream = resultSet.toQueryStream(); //QUERYSTREAM INITIALIZED FOR CURSOR VALUES

          return consumeStream = new Promise((resolve, reject) => {
            queryStream.on('data', (row) => {
              resRows.push(row); //STORE ROWS IN TO BLANK ARRAY 
            });
            queryStream.on('error', reject);
            queryStream.on('close', () => {
              resolve(resRows); //RETURN ON RESOLVING ALL THE ROWS
              conn.close();
              //return resRows;
            });
          });
        })
        .catch((err) => {
          console.log("err");
          console.log(err);
          conn.close();
          return 'failure';
        })
    });
}
async function find(context) {
  var idkhuvuc = oracledb.STRING;
  var tenbds = oracledb.STRING;
  var giaban = oracledb.NUMBER;
  var thoidiem = oracledb.STRING;
  var loaibds = oracledb.NUMBER;
  var trangthai = oracledb.NUMBER;
  var dientich_thucte = oracledb.NUMBER;
  var dientich_so = oracledb.NUMBER;
  var sotang = oracledb.NUMBER;
  var loaimai = oracledb.NUMBER;
  var so_mattien = oracledb.NUMBER;
  var kichthuoc_mattien = oracledb.NUMBER;
  var kichthuoc_longdong = oracledb.NUMBER;
  var kichthuoc_viahe = oracledb.NUMBER;
  var loaiduong = oracledb.NUMBER;
  var khoangcach_duonglon = oracledb.NUMBER;
  var huong = oracledb.STRING;
  var nohau = oracledb.NUMBER;
  var hinhthai_thuadat = oracledb.NUMBER;
  var hientrang_sudung = oracledb.NUMBER;
  var tinhtrang_congtrinh = oracledb.NUMBER;
  var nguontin = oracledb.NUMBER;
  var mota = oracledb.STRING;
  var nhanvien_id = oracledb.NUMBER;
  var hinhanh = oracledb.STRING;
  idkhuvuc = context.idkhuvuc;
  tenbds = context.tenbds;
  giaban = context.giaban;
  thoidiem = context.thoidiem;
  loaibds = context.loaibds;
  trangthai = context.trangthai;
  dientich_thucte = context.dientich_thucte;
  dientich_so = context.dientich_so;
  sotang = context.sotang;
  loaimai = context.loaimai;
  so_mattien = context.so_mattien;
  kichthuoc_mattien = context.kichthuoc_mattien;
  kichthuoc_longdong = context.kichthuoc_longdong;
  kichthuoc_viahe = context.kichthuoc_viahe;
  loaiduong = context.loaiduong;
  khoangcach_duonglon = context.khoangcach_duonglon;
  huong = context.huong;
  nohau = context.nohau;
  hinhthai_thuadat = context.hinhthai_thuadat;
  hientrang_sudung = context.hientrang_sudung;
  tinhtrang_congtrinh = context.tinhtrang_congtrinh;
  nguontin = context.nguontin;
  mota = context.mota;
  nhanvien_id = context.nhanvien_id;
  hinhanh = context.hinhanh;
  var data = themThongTiNhaDat(idkhuvuc, tenbds, giaban, thoidiem, loaibds
    , trangthai, dientich_thucte, dientich_so, sotang, loaimai, so_mattien, kichthuoc_mattien
    , kichthuoc_longdong, kichthuoc_viahe, loaiduong, khoangcach_duonglon, huong, nohau, hinhthai_thuadat, hientrang_sudung
    , tinhtrang_congtrinh, nguontin, mota, nhanvien_id, hinhanh);

  return data;

}

module.exports.find = find;
