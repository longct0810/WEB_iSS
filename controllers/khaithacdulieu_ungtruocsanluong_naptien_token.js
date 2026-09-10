const net = require('net');
const { promisify } = require('util');




const post = async (req, res, next) => {
    var socongto = req.body.v_socongto;
    var imei = req.body.v_imei;
    var matkhaucongto = req.body.v_matkhaucongto;
    var ip = req.body.v_ip;
    var port = req.body.v_port;
    var lenhcmd = req.body.v_lenhcmd;
    try {
        // console.log("vào đây")
        // const tcp = new net.Socket();
        // const connect = promisify(tcp.connect).bind(tcp);

        //gửi lệnh đóng cắt
        const client = new net.Socket();
        client.connect(port, ip, async () => {
            const [resultCode, message] = await sendConnToAMI(client, imei);
            console.log('Result:', resultCode, 'Message:', message);
            if (resultCode == 1) {
                const [result, msg] = await sendCmdDongCat(client, imei, socongto, matkhaucongto, lenhcmd)
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
    return new Promise(async (resolve) => {
        try {
            // Check if the client is connected
            if (client && client.readyState === 'open') {
                // Clear previous data and send the connection command as a text string
                const Check = "WEB#" + imei + "CONNECT";
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
async function sendCmdDongCat(client, imei, socongto, matkhaucongto, lenhcmd) {
    let ketqua = 0;
    let thongbao = '';
    return new Promise(async (resolve) => {
        try {
            console.log('vào đóng cắt');
            // Check if the client is connected
            if (client && client.readyState === 'open') {
                // Clear previous data and send the connection command as a text string
                // Convert the password to hexadecimal
                let matkhauhex = Buffer.from(matkhaucongto, 'utf-8').toString('hex');
                // Construct the command to be sent
                let lenh = `CMD#${imei}#NAPTIEN#${socongto}#${matkhauhex}#0.0.19.40.0(${lenhcmd})`;
                client.write(lenh);
                console.log('lenh: ', lenh);
                // Wait for the response from the server (equivalent to WaitForItToWork_Con3 in C#)
                const x = await waitForItToWorkDongCat8000(client);
                console.log('8000: ', x);
                ////gửi tiếp lệnh đọc
                if (x === 0) {
                    ketqua = 3;
                    thongbao = "DCU không phản hồi";
                } else if (x === 2) {
                    ketqua = 1;
                    thongbao = "OK";
                } else if (x === 3) {
                    ketqua = 3;
                    thongbao = "Nạp sản lượng không thành công";
                } else if (x === 4 || x === 5) {
                    ketqua = 4;
                    thongbao = "Sai mật khẩu công tơ";
                } else {
                    // Wait for the ACK response from the device (equivalent to WaitFor_AMI_DongCat in C#)
                    const y = await waitForAMIDongCat(client);
                    if (!y) {
                        ketqua = 2;
                        thongbao = "Nạp sản lượng không thành công";
                    } else {
                        ketqua = 1;
                        thongbao = "Nạp sản lượng thành công";
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
// Mock function to simulate waiting for a response (equivalent to WaitForItToWork_DongCat_8000 in C#)
async function waitForItToWorkDongCat8000(client) {
    return new Promise((resolve) => {
        // Simulate waiting for a specific response from the server
        client.on('data', (data) => {
            //convert hex sang text
            const responseCode = parseInt(hexToText(data).toLowerCase());
            console.log("waitForItToWorkDongCat8000 - result: ", responseCode);
            resolve(responseCode);
        });

        client.on('error', () => resolve(0)); // In case of an error, return 0 (no response)
    });
}

async function waitForAMIDongCat(client) {
    return new Promise((resolve) => {
        // Simulate waiting for an 'ack' response
        client.on('data', (data) => {
            var result = hexToText(data).toLowerCase();
            //convert hex sang text
            console.log("waitForAMIDongCat - result: ", result);
            // Check for 'ack' in the response data
            if (result.includes('ack')) {
                resolve(true);
            } else {
                resolve(false);
            }
        });

        client.on('error', () => resolve(false)); // In case of an error, return false (no ACK)
    });
}
function hexToText(hexString) {
    // Create a buffer from the hexadecimal string
    const buffer = Buffer.from(hexString, 'hex');
    // Convert the buffer to a UTF-8 string
    return buffer.toString('utf8');
}
module.exports = { post };