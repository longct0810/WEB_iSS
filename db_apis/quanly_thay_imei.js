const oracledb = require('oracledb');
const database = require('../services/database.js');

function sua_tt_diemdo(v_meterid, v_socongto_cu, v_imei_cu, v_imei_moi, v_mataikhoan) {
  return oracledb.getConnection()
    .then(function (conn) {
      return conn.execute(`BEGIN PKG_QUANLY_DIEMDO.P_THAY_THIETBI(:meterid,:socongto_cu,:imei_cu,:imei_moi,:mataikhoan,:CV_1); END;`, { // EXECUTE ORACLE PROCEDURE
        meterid: {
          type: oracledb.NUMBER,
          dir: oracledb.BIND_IN,
          val: v_meterid
        },
        socongto_cu: {
          type: oracledb.STRING,
          dir: oracledb.BIND_IN,
          val: v_socongto_cu
        },
        imei_cu: {
          type: oracledb.STRING,
          dir: oracledb.BIND_IN,
          val: v_imei_cu
        },
        imei_moi: {
          type: oracledb.STRING,
          dir: oracledb.BIND_IN,
          val: v_imei_moi
        },
        mataikhoan: {
          type: oracledb.NUMBER,
          dir: oracledb.BIND_IN,
          val: v_mataikhoan
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
          //console.error(err);
          return 'failure';
        })
    });
}

async function find(context) {
  const { meterid, socongto_cu, imei_cu, imei_moi, mataikhoan } = context;
  var data = sua_tt_diemdo(meterid, socongto_cu, imei_cu, imei_moi, mataikhoan);
  return data;

}

module.exports.find = find;

