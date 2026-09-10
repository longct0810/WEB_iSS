const oracledb = require('oracledb');
const database = require('../services/database.js');

function tracuuthongtinnhadat(khuvucid, loaibds) {
  return oracledb.getConnection()
    .then(function (conn) {
      return conn.execute(`BEGIN PKG_TRACUU_THONGTIN.P_TRACUU_THONGTINDAT(:i,:t,:CV_1); END;`, { // EXECUTE ORACLE PROCEDURE
        i: {
          type: oracledb.STRING,
          dir: oracledb.BIND_IN,
          val: khuvucid
        },
        t: {
          type: oracledb.STRING,
          dir: oracledb.BIND_IN,
          val: loaibds
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
  var khuvucid = oracledb.STRING;
  var loaibds = oracledb.STRING;
  khuvucid = context.khuvucid;
  loaibds = context.loaibds;
  var data = tracuuthongtinnhadat(khuvucid, loaibds);
  return data;

}

module.exports.find = find;
