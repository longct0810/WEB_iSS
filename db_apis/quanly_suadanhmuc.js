const oracledb = require('oracledb');

function getDatakhaibaotb(v_id, v_parentID, v_tendanhmuc, v_loaitree, v_type) {
  return oracledb.getConnection()
    .then(function (conn) {
      return conn.execute(`BEGIN PKG_DANHMUC.P_SUA_DANHMUC(:id,:parentID,:tendanhmuc,:loaitree,:type,:CV_1); END;`, { // EXECUTE ORACLE PROCEDURE
        id: {
          type: oracledb.STRING,
          dir: oracledb.BIND_IN,
          val: v_id
        },
        parentID: {
          type: oracledb.STRING,
          dir: oracledb.BIND_IN,
          val: v_parentID
        },
        tendanhmuc: {
          type: oracledb.STRING,
          dir: oracledb.BIND_IN,
          val: v_tendanhmuc
        },
        loaitree: {
          type: oracledb.NUMBER,
          dir: oracledb.BIND_IN,
          val: v_loaitree
        },
        type: {
          type: oracledb.NUMBER,
          dir: oracledb.BIND_IN,
          val: v_type
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
          console.log(err);
          return 'failure';
        })
    });
}
async function find(context) {
  const { id, parentID, tendanhmuc, loaitree, type } = context;
  if (tendanhmuc) {
    var data = getDatakhaibaotb(id, parentID, tendanhmuc, loaitree, type);
    return data;
  } else {
    return "Tên danh mục không được để trống"
  }


}

module.exports.find = find;

