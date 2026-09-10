const net = require('net');
const { promisify } = require('util');
const oracledb = require('oracledb');


const post = async (req, res, next) => {
    var imei = req.body.v_imei;
    var ip = req.body.v_ip;
    var port = req.body.v_port;
    var time_tsvh_bt = req.body.v_time_tsvh_bt;
    var time_tsvh_caothap = req.body.v_time_tsvh_caothap;
    var nguong_canhbao_thap = req.body.v_nguong_canhbao_thap;
    var nguong_canhbao_cao = req.body.v_nguong_canhbao_cao;
    var delta_thap = req.body.v_delta_thap;
    var delta_cao = req.body.v_delta_cao;
    let conn;

    try {
 
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

                //let lenhcmd = "CMD#" + imei + "#CAUHINH_DCU#3333333333333333#" + ip2 + "#" + port2;
                let lenhcmd = "at+config=" + time_tsvh_bt + "," + time_tsvh_caothap+ ","
                 + nguong_canhbao_thap + "," + delta_thap+ "," 
                 + nguong_canhbao_cao+ "," + delta_cao;
                 console.log('lenhhhh:', lenhcmd);
                const [result, msg] = await send_cmd_CauHinh(client,   lenhcmd);
                console.log('msg:', msg);
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
                console.log("check:" || Check);
                client.write(Check);

                // Wait for the response from the server (equivalent to WaitForItToWork_Con3 in C#)
                const x = await waitForItToWorkCon3(client);
 
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



async function send_cmd_CauHinh(client,   lenh) {
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
                // Wait for the response from the server (equivalent to WaitForItToWork_Con3 in C#)
                const x = await waitForItToWorkDongCat8000(client);
                console.log('(ok): ', x);
                ////gửi tiếp lệnh đọc
                if (x.indexOf("(ok)") > -1) {
                    ketqua = 1;
                    thongbao = "(ok)";
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
            const responseCode = hexToText(data).toLowerCase();
            console.log("(ok) - result: ", responseCode);
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

 
module.exports = { post };