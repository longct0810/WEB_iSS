const oracledb = require('oracledb');
const database = require('../services/database.js');

function khaibaovttb_save(maduan, mahangmuccha, mahangmuc, mavattu, mancc, soluong, dongia, donvitinh, thoidiem, mota, manv) {
  return oracledb.getConnection()
    .then(function (conn) {
      return conn.execute(`BEGIN PKG_KHAIBAO_VTTB.P_KHAIBAOVTTB_SAVE(:maduan,:mahangmuccha,:mahangmuc,:mavattu,:mancc,:soluong,:dongia,:donvitinh,:thoidiem,:mota,:manv,:CV_1); END;`, { // EXECUTE ORACLE PROCEDURE
        maduan: {
          type: oracledb.STRING,
          dir: oracledb.BIND_IN,
          val: maduan
        },
        mahangmuccha: {
          type: oracledb.STRING,
          dir: oracledb.BIND_IN,
          val: mahangmuccha
        },
        mahangmuc: {
          type: oracledb.STRING,
          dir: oracledb.BIND_IN,
          val: mahangmuc
        },
        mavattu: {
          type: oracledb.STRING,
          dir: oracledb.BIND_IN,
          val: mavattu
        },
        mancc: {
          type: oracledb.STRING,
          dir: oracledb.BIND_IN,
          val: mancc
        },
        soluong: {
          type: oracledb.NUMBER,
          dir: oracledb.BIND_IN,
          val: soluong
        },
        dongia: {
          type: oracledb.NUMBER,
          dir: oracledb.BIND_IN,
          val: dongia
        },
        donvitinh: {
          type: oracledb.STRING,
          dir: oracledb.BIND_IN,
          val: donvitinh
        },
        thoidiem: {
          type: oracledb.STRING,
          dir: oracledb.BIND_IN,
          val: thoidiem
        },
        mota: {
          type: oracledb.STRING,
          dir: oracledb.BIND_IN,
          val: mota
        },
        manv: {
          type: oracledb.NUMBER,
          dir: oracledb.BIND_IN,
          val: manv
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
          conn.close();
          return 'failure';
        })
    });
}
async function find(context) {
  var binds = {};
  var maduan = oracledb.STRING;
  var mahangmuc = oracledb.STRING;
  var mavattu = oracledb.STRING;
  var mancc = oracledb.STRING;
  var soluong = oracledb.NUMBER;
  var dongia = oracledb.NUMBER;
  var donvitinh = oracledb.STRING;
  var thoidiem = oracledb.STRING;
  var mota = oracledb.STRING;
  var manv = oracledb.NUMBER;
  var mahangmuccha = oracledb.STRING;

  maduan = context.maduan;
  mahangmuc = context.mahangmuc;
  mavattu = context.mavattu;
  mancc = context.mancc;
  soluong = context.soluong;
  dongia = context.dongia;
  donvitinh = context.donvitinh;
  thoidiem = context.thoidiem;
  mota = context.mota;
  manv = context.manv;
  mahangmuccha = context.mahangmuccha;
  var data = khaibaovttb_save(maduan, mahangmuccha, mahangmuc, mavattu, mancc, soluong, dongia, donvitinh, thoidiem, mota, manv);
  return data;

}

module.exports.find = find;
