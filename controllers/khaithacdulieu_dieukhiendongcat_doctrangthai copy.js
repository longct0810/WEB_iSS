const net = require('net');
const { promisify } = require('util');
const oracledb = require('oracledb');


const post = async (req, res, next) => {
    const {
        v_imei: imei,
        v_ip: ip,
        v_port: port,
        v_socongto: socongto
    } = req.body;

    if (!imei || !ip || !port || !socongto) {
        return res.status(400).json({
            success: false,
            message: 'Thiếu tham số đầu vào'
        });
    }


    try {
        //gửi lệnh đóng cắt
        const client = new net.Socket();
        client.connect(port, ip, async () => {
            const [resultCode, message] = await sendConnToAMI(client, imei);
            console.log('Result:', resultCode, 'Message:', message);
            if (resultCode == 1) {
                let lenhcmd = "CMD#" + imei + "#READDATA_CTO#" + socongto + "#0.0.96.3.10()";
                var tableJson = await send_cmd_CauHinh(client, lenhcmd);
                console.log("tableJson");
                console.log(tableJson);
                res.status(200).json(tableJson);

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
async function send_cmd_CauHinh(client, lenh) {
    let ketqua = "";
    let thongbao = "";

    return new Promise(async (resolve) => {
        try {

            if (client && client.readyState === 'open') {
                client.write(lenh);

                const x = await WaitForItToWork_DocCauHinh(client);
                console.log("Giá trị đọc được:", x);

                ketqua = "OK";
                thongbao = x; // trả ra giá trị 1
            } else {
                ketqua = "0";
                thongbao = "Có lỗi xảy ra: Client not connected";
            }
        } catch (err) {
            ketqua = "0";
            thongbao = "Có lỗi xảy ra: " + err.message;
        }

        resolve([ketqua, thongbao]);
    });
}

async function WaitForItToWork_DocCauHinh(client) {
    console.log("WaitForItToWork_DocCauHinh");

    return new Promise((resolve) => {
        const onData = (data) => {
            try {
                const buffer = Buffer.from(data);
                console.log("buffer:", buffer);

                // Đổi buffer sang text
                const text = buffer.toString('utf8');
                console.log("Raw text:", text);

                // Có thể log hex nếu cần debug
                const hexString = buffer.toString('hex');
                console.log("Hex String:", hexString);

                // Lấy giá trị trong ngoặc
                const value = extractValueInParentheses(text);

                client.off('data', onData);
                client.off('error', onError);

                resolve(value);
            } catch (err) {
                client.off('data', onData);
                client.off('error', onError);
                resolve(null);
            }
        };

        const onError = () => {
            client.off('data', onData);
            client.off('error', onError);
            resolve(null);
        };

        client.on('data', onData);
        client.on('error', onError);
    });
}

function extractValueInParentheses(text) {
    if (!text) return null;
    const match = text.match(/\(([^)]+)\)/);
    return match ? match[1] : null;
}
module.exports = { post };