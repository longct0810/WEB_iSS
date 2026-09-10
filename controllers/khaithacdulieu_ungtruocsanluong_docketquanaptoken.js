const net = require('net');
const { promisify } = require('util');
const oracledb = require('oracledb');


const post = async (req, res, next) => {
    var imei = req.body.v_imei;
    var ip = req.body.v_ip;
    var port = req.body.v_port;
    var imei = req.body.v_imei;
    var socongto = req.body.v_socongto;
    let conn;
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
                let lenhcmd = "CMD#" + imei + "#READDATA_CTO#" + socongto + "#0.0.19.0.0()";
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
            console.log('vào cấu hình: ' + lenh);
            // Check if the client is connected
            if (client && client.readyState === 'open') {
                // Construct the command to be sent
                await client.write(lenh);
                //  Wait for the response from the server (equivalent to WaitForItToWork_Con3 in C#)

                const x = await WaitForItToWork_DocCauHinh(client);
                ketqua = "OK";
                thongbao = x;
                // console.log("x:", x)

            } else {
                ketqua = "0";
                thongbao = "Có lỗi xảy ra: Client not connected";
            }
        } catch (err) {
            ketqua = 0;
            thongbao = "Có lỗi xảy ra: " + err.message;
        }

        resolve([ketqua, thongbao]);
    });
}
async function WaitForItToWork_DocCauHinh(client) {

    console.log("vào WaitForItToWork_DocCauHinh")
    return new Promise((resolve) => {
        console.log("resolve")
        console.log(resolve)
        // Simulate waiting for a specific response from the server
        client.on('data', (data) => {
            //convert hex sang text
            console.log("data:");
            console.log(data);

            const buffer = Buffer.from(data);
            const hexString = buffer.toString();

            const text = data.toString();

            // Biểu thức chính quy để tìm số có dấu thập phân trước "*kwh"
            const regex = /(\d+\.\d+)\*kwh/i;
            const match = text.match(regex);
            const SL = match[1];
            console.log("waitForItToWorkDongCat8000 - match: ", SL);
            //cắt lấy bắt đầu từ 28 kết thúc 29
            //cắt lấy bắt đầu từ 28 kết thúc 29
            // var kq_lenh222 = catchuoi28den29(hexString);
            // // cắt thành mảng 6 ký tự
            // var data_split = cutStringInChunks(kq_lenh222, 6);
            // const sanluong = data_split[0];
            // var SL = [];
            // console.log("waitForItToWorkDongCat8000 - sanluong: ", sanluong);
            // const decValue_SL = parseInt(sanluong, 16);
            // console.log("waitForItToWorkDongCat8000 - decValue_SL: ", decValue_SL);
            // const responseCode = data;
            // console.log("waitForItToWorkDongCat8000 - data: ", responseCode);
            resolve(SL);
        });

        client.on('error', () => resolve(0)); // In case of an error, return 0 (no response)
    });
}


function cutStringInChunks(str, chunkSize) {
    const chunks = [];
    for (let i = 0; i < str.length; i += chunkSize) {
        chunks.push(str.substring(i, i + chunkSize));
    }
    return chunks;
}
function catchuoi28den29(data) {

    // Tìm vị trí bắt đầu bằng "28"
    const startIndex = data.indexOf("28");

    // Nếu tìm thấy "28" và "29"
    if (startIndex !== -1) {
        // Tìm vị trí tiếp theo của "29" sau "28"
        const endIndex = data.indexOf("29", startIndex);

        if (endIndex !== -1) {
            // Lấy chuỗi từ "28" đến "29", sau đó loại bỏ ký tự đầu và ký tự cuối
            const extractedData = data.slice(startIndex + 2, endIndex);
            console.log("Chuỗi sau khi loại bỏ ký tự đầu và cuối:", extractedData);
            return extractedData; // Bỏ 2 ký tự đầu "28" và không lấy "29"

        } else {
            console.log("Không tìm thấy '29' sau '28'.");
            return "-1";

        }
    } else {
        console.log("Không tìm thấy '28' trong chuỗi.");
        return "-1";

    }

}



module.exports = { post };