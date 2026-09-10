const net = require('net');
const { promisify } = require('util');
const oracledb = require('oracledb');


const post = async (req, res, next) => {
    var imei = req.body.v_imei;
    var ip = req.body.v_ip1;
    var port = req.body.v_port1;
    var ip2 = req.body.v_ip2;
    var port2 = req.body.v_port2;
    var mataikhoan = req.body.v_mataikhoan;
    let conn;
    try {
        // console.log("vào đây")
        // const tcp = new net.Socket();
        // const connect = promisify(tcp.connect).bind(tcp);

        //gửi lệnh đóng cắt
        const client = new net.Socket();
        // ip = "113.160.233.26";
        // port = 6303;
        client.connect(port, ip, async () => {
            // imei = "8605210574331570";
            // ip2 = "113.160.233.26";
            // port2 = 6303;
            const [resultCode, message] = await sendConnToAMI(client, imei);
            console.log('Result:', resultCode, 'Message:', message);
            if (resultCode == 1) {

                let lenhcmd = "CMD#" + imei + "#CAUHINH_DCU#3333333333333333#" + ip2 + "#" + port2;
                const [result, msg] = await send_cmd_CauHinh(client, ip, port, lenhcmd);
                console.log('msg:', msg);
                //Luu log vào db
                conn = await oracledb.getConnection();
                var tableJson = await Log_CauHinhDieuKhien(mataikhoan, imei, ip, port, ip2, port2, conn);
                console.log(tableJson);
                res.status(200).json(msg);

            } else {
                res.status(200).json(message);
            }
            client.destroy(); // Close the connection
        });

    } catch (err) {
        next(err);
    }
};

// Function to send connection command to AMI and handle response
async function sendConnToAMI(client, imei) {
    let ketqua = 0;
    let thongbao = '';
    console.log("imei:" || imei);
    return new Promise(async (resolve) => {
        try {
            // Check if the client is connected
            if (client && client.readyState === 'open') {
                // Clear previous data and send the connection command as a text string
                const Check = "WEB#" + imei + "CONNECT";
                console.log("check:" || Check);
                client.write(Check);

                // Wait for the response from the server (equivalent to WaitForItToWork_Con3 in C#)
                const x = await waitForItToWorkCon3(client);
                console.log("x");
                console.log(x);
                ////gửi tiếp lệnh đọc
                // var read = "@READ" + imei;
                // tcp.Send(ASCIIEncoding.ASCII.GetBytes(read));
                if (!x) {
                    ketqua = 0;
                    thongbao = "Không kết nối được comserver";
                } else {
                    const read = "@READ" + imei;
                    client.write(read, 'utf-8');

                    // Wait for the response from the server (equivalent to WaitForItToWork_Read in C#)
                    const xRead = await waitForItToWorkRead(client);

                    if (!xRead) {
                        ketqua = 2;
                        thongbao = "DCU đang bận";
                        writeLogErrorRead("Read DCU đang bận");
                    } else {
                        ketqua = 1;
                        thongbao = "Thành công";
                        // writeLogErrorConn3("Conn3 Thành công");
                    }
                }
            } else {
                ketqua = 0;
                thongbao = "Có lỗi xảy ra: Client not connected";
            }
        } catch (err) {
            ketqua = 0;
            thongbao = "Có lỗi xảy ra: " + err.message;
        }

        resolve([ketqua, thongbao]);
    });
}
// Mock function to simulate waiting for a response (equivalent to WaitForItToWork_Con3 in C#)
async function waitForItToWorkCon3(client) {
    return new Promise((resolve) => {
        // Simulate waiting for a specific response from the server
        client.on('data', (data) => {
            const response = data.toString().toLowerCase();
            console.log("waitForItToWorkCon3 - response: ", response);
            // Check if the response matches the expected 'connect3' acknowledgment
            if (response.includes('connect3')) {
                resolve(true);
            } else {
                resolve(false);
            }
        });

        client.on('error', () => resolve(false)); // In case of an error, return false
    });
}

// Mock function to simulate waiting for a read response (equivalent to WaitForItToWork_Read in C#)
async function waitForItToWorkRead(client) {
    return new Promise((resolve) => {
        // Simulate waiting for a specific response from the server
        client.on('data', (data) => {
            const response = data.toString().toLowerCase();
            console.log("waitForItToWorkRead - response: ", response);
            // Check if the response matches the expected '@read' acknowledgment
            if (response.includes('@read')) {
                resolve(true);
            } else {
                resolve(false);
            }
        });

        client.on('error', () => resolve(false)); // In case of an error, return false
    });
}
// Mock function to log errors (equivalent to WriteLogError_Read in C#)
function writeLogErrorRead(message) {
    console.error(message);
}



async function send_cmd_CauHinh(client, ip1, port1, lenh) {
    let ketqua = 0;
    let thongbao = '';
    return new Promise(async (resolve) => {
        try {
            console.log('vào cấu hình: ' + lenh);
            // Check if the client is connected
            if (client && client.readyState === 'open') {
                // Clear previous data and send the connection command as a text string
                // Convert the password to hexadecimal
                //let matkhauhex = Buffer.from(matkhaucongto, 'utf-8').toString('hex');
                // Construct the command to be sent
                client.write(lenh);
                console.log('lenh: ', lenh);
                // Wait for the response from the server (equivalent to WaitForItToWork_Con3 in C#)
                const x = await waitForItToWorkDongCat8000(client);
                console.log('8000: ', x);
                ////gửi tiếp lệnh đọc
                if (x.indexOf("8000") > -1) {
                    ketqua = 1;
                    thongbao = "Đã gửi lệnh cấu hình xuống dcu. Vui lòng kiểm tra bằng đọc lại cấu hình";
                } else if (x === 2) {
                    ketqua = 2;
                    thongbao = "Có lỗi xảy ra";
                }
            } else {
                ketqua = 0;
                thongbao = "Có lỗi xảy ra: Client not connected";
            }
        } catch (err) {
            ketqua = 0;
            thongbao = "Có lỗi xảy ra: " + err.message;
        }

        resolve([ketqua, thongbao]);
    });
}
// Mock function to simulate waiting for a response (equivalent to WaitForItToWork_DongCat_8000 in C#)
async function waitForItToWorkDongCat8000(client) {
    return new Promise((resolve) => {
        // Simulate waiting for a specific response from the server
        client.on('data', (data) => {
            //convert hex sang text
            console.log("waitForItToWorkDongCat8000- cau hình điều khiển: ", data)
            const responseCode = hexToText(data).toLowerCase();
            console.log("waitForItToWorkDongCat8000 - result: ", responseCode);
            resolve(responseCode);
        });

        client.on('error', () => resolve(0)); // In case of an error, return 0 (no response)
    });
}
function hexToText(hexString) {
    // Create a buffer from the hexadecimal string
    const buffer = Buffer.from(hexString, 'hex');
    // Convert the buffer to a UTF-8 string
    return buffer.toString('utf8');
}

async function Log_CauHinhDieuKhien(mataikhoan, imei, ip, port, ip2, port2, conn) {
    return conn.execute(`BEGIN PKG_CAUHINH.P_LOG_CAUHINH(:mataikhoan,:imei,:ip,:port,:ip2,:port2,:CV_1); END;`, { // EXECUTE ORACLE PROCEDURE
        mataikhoan: {
            type: oracledb.STRING,
            dir: oracledb.BIND_IN,
            val: mataikhoan
        },
        imei: {
            type: oracledb.STRING,
            dir: oracledb.BIND_IN,
            val: imei
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
        ip2: {
            type: oracledb.STRING,
            dir: oracledb.BIND_IN,
            val: ip2
        },
        port2: {
            type: oracledb.STRING,
            dir: oracledb.BIND_IN,
            val: port2
        },
        CV_1: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR }
    }).then((result) => {
        var resRows = [];
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
        });
    })
        .catch((err) => {
            conn.close();
            //console.error(err);
            console.log(err);
            return 'failure';
        })
}
module.exports = { post };