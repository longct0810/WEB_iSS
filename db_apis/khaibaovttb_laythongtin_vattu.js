const oracledb = require('oracledb');
const database = require('../services/database.js');

function khaibaovttb_getthongtin_vattu(mahangmuc) {
    return oracledb.getConnection()
        .then(function (conn) {
            return conn.execute(`BEGIN PKG_KHAIBAO_VTTB.P_GET_THONGTIND_VATTU(:mahangmuc,:CV_1); END;`, { // EXECUTE ORACLE PROCEDURE
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
    var ma_hangmuc = oracledb.STRING;
    ma_hangmuc = context.ma_hangmuc;
    var data = khaibaovttb_getthongtin_vattu(ma_hangmuc);
    return data;

}

module.exports.find = find;
