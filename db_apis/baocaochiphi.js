const oracledb = require('oracledb');
const database = require('../services/database.js');

function baocaochiphi(maduan, mahangmuc) {
  return oracledb.getConnection()
    .then(function (conn) {
      return conn.execute(`BEGIN PKG_BAOCAO.P_BAOCAO_CHIPHI(:maduan,:mahangmuc,:CV_1); END;`, { // EXECUTE ORACLE PROCEDURE
        maduan: {
          type: oracledb.STRING,
          dir: oracledb.BIND_IN,
          val: maduan
        },
        mahangmuc: {
          type: oracledb.STRING,
          dir: oracledb.BIND_IN,
          val: mahangmuc
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
  var mahangmuc = oracledb.STRING;
  var maduan = oracledb.STRING;
  maduan = context.maduan;
  mahangmuc = context.mahangmuc;
  var data = baocaochiphi(maduan, mahangmuc);
  return data;

}

module.exports.find = find;
