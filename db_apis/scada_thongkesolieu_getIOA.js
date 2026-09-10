const oracledb = require('oracledb');

async function scada_getIOA(id_thietbi) {
    console.log("id_thietbi: ", id_thietbi);
    let conn;
    let resultSet;

    try {
        conn = await oracledb.getConnection();

        const result = await conn.execute(
            `BEGIN PKG_SCADA.P_GET_IOA(:id_thietbi, :CV_1); END;`,
            {
                id_thietbi: {
                    type: oracledb.STRING,
                    dir: oracledb.BIND_IN,
                    val: String(id_thietbi).trim()
                },
                CV_1: {
                    dir: oracledb.BIND_OUT,
                    type: oracledb.CURSOR
                }
            }

        );

        const resultSet = result.outBinds.CV_1;
        const queryStream = resultSet.toQueryStream();
        console.log(queryStream);
        return await streamToArray(queryStream, conn);

    } catch (err) {
        console.error('❌ Error in find:', err);
        return { error: true, message: err.message };

    } finally {
        await safeClose(conn);
    }
}
function streamToArray(queryStream, conn) {
    return new Promise((resolve, reject) => {
        const resRows = [];
        let colNames = {};
        let metadataProcessed = false;

        queryStream.on('metadata', (metadata) => {
            metadata.forEach((col, i) => (colNames[col.name.toLowerCase()] = i));
            metadataProcessed = true;
        });

        queryStream.on('data', (row) => {
            if (!metadataProcessed) return;
            const rowData = {};
            for (const key in colNames) {
                rowData[key] = row[colNames[key]];
            }
            resRows.push(rowData);
        });

        queryStream.on('error', async (err) => {
            reject(err);
        });
        queryStream.on('end', async () => {
            resolve(resRows);
        });

    });
}
async function safeClose(conn) {
    if (conn && conn.close) {
        try {
            await conn.close();
            console.log('✅ Oracle connection closed');
        } catch (err) {
            console.error('❌ Failed to close Oracle connection:', err.message || err);
        }
    }
}
async function find(context) {
    var data = await scada_getIOA(context);
    return data;

}

module.exports.find = find;

