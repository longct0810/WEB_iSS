const oracledb = require('oracledb');
const database = require('../services/database.js');

function suathietbi(idthietbi, tenthietbi, ip, port, kinhdo, vido, sosim) {
    return oracledb.getConnection()
        .then(function (conn) {
            return conn.execute(`BEGIN PKG_DANHMUC.P_SUA_THIETBI(:idthietbi,:tenthietbi,:ip,:port,:kinhdo,:vido,:sosim,:CV_1); END;`, { // EXECUTE ORACLE PROCEDURE
                idthietbi: {
                    type: oracledb.STRING,
                    dir: oracledb.BIND_IN,
                    val: idthietbi
                },
                tenthietbi: {
                    type: oracledb.STRING,
                    dir: oracledb.BIND_IN,
                    val: tenthietbi
                },
                ip: {
                    type: oracledb.STRING,
                    dir: oracledb.BIND_IN,
                    val: ip
                },
                port: {
                    type: oracledb.STRING,
                    dir: oracledb.BIND_IN,
                    val: port
                },
                kinhdo: {
                    type: oracledb.STRING,
                    dir: oracledb.BIND_IN,
                    val: kinhdo
                },
                vido: {
                    type: oracledb.STRING,
                    dir: oracledb.BIND_IN,
                    val: vido
                },
                sosim: {
                    type: oracledb.STRING,
                    dir: oracledb.BIND_IN,
                    val: sosim
                },
                CV_1: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR }

            })
                .then((result) => {
                    var resRows = [];
                    var metaData = [];
                    var resultSet = result.outBinds.CV_1;
                    var queryStream = resultSet.toQueryStream();

                    var rowData = {};
                    var ColumNames = {};
                    var metadataProcessed = false;
                    return consumeStream = new Promise((resolve, reject) => {
                        queryStream.on('metadata', (metadata) => {
                            metadata.forEach((column, index) => {
                                ColumNames[column.name.toLowerCase()] = index;
                            });
                            metadataProcessed = true;
                        });

                        queryStream.on('data', (row) => {

                            if (!metadataProcessed) {
                                return;
                            }
                            rowData = {};
                            for (const key in ColumNames) {
                                rowData[key] = row[ColumNames[key]];
                            }
                            resRows.push(rowData);

                        });
                        queryStream.on('error', (err) => {
                            console.error(err);
                        });
                        queryStream.on('close', () => {
                            resolve(resRows); //RETURN ON RESOLVING ALL THE ROWS
                            conn.close();

                        });
                    })
                })
                .catch((err) => {
                    conn.close();
                    console.error(err);
                    return 'failure';
                })
        });
}
async function find(context) {
    var tenthietbi = oracledb.STRING;
    var idthietbi = oracledb.STRING;
    var ip = oracledb.STRING;
    var port = oracledb.STRING;
    var kinhdo = oracledb.STRING;
    var vido = oracledb.STRING;
    var sosim = oracledb.STRING;
    tenthietbi = context.tenthietbi;
    idthietbi = context.idthietbi;
    ip = context.ip;
    port = context.port;
    kinhdo = context.kinhdo;
    vido = context.vido;
    sosim = context.sosim;
    var data = suathietbi(idthietbi, tenthietbi, ip, port, kinhdo, vido, sosim);
    return data;

}

module.exports.find = find;
