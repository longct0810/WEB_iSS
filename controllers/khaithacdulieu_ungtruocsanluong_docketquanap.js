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
                let lenhcmd = "CMD#" + imei + "#READDATA_CTO#" + socongto + "#1.0.E.1.1()";
                let lenhconlai = "CMD#" + imei + "#READDATA_CTO#" + socongto + "#1.0.E.1.2()";
                var tableJson = await send_cmd_CauHinh(client, ip, port, lenhcmd, lenhconlai);

                console.log("tableJson");
                console.log(tableJson);
                //save thông tin thiết bị
                //Luu log vào db
                // conn = await oracledb.getConnection();
                // let data = JSON.parse(tableJson[1]);
                // var result = JSON.parse(data);
                // var kq = await Save_ThietBi_CauHinhDieuKhien(result[0].imei, result[0].ip2, result[0].port2, conn);
                // console.log("kq");
                // console.log(kq);
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
async function send_cmd_CauHinh(client, ip1, port1, lenh, lenhconlai) {
    let ketqua = "";
    let thongbao = "";
    return new Promise(async (resolve) => {
        try {
            console.log('vào cấu hình: ' + lenh);
            // Check if the client is connected
            if (client && client.readyState === 'open') {
                // Clear previous data and send the connection command as a text string
                // Convert the password to hexadecimal
                //let matkhauhex = Buffer.from(matkhaucongto, 'utf-8').toString('hex');
                // Construct the command to be sent
                await client.write(lenh);
                // console.log('lenh: ', lenh);
                // Wait for the response from the server (equivalent to WaitForItToWork_Con3 in C#)
                const x = await WaitForItToWork_DocCauHinh(client);
                ketqua = "OK";
                // // gửi lệnh đọc còn lại

                await client.write(lenhconlai);
                const y = await WaitForItToWork_DocCauHinh_ConLai(client, x);

                thongbao = JSON.stringify(y);
                console.log("x:", x)

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
    console.log("WaitForItToWork_DocCauHinh");

    return new Promise((resolve) => {

        // Simulate waiting for a specific response from the server
        client.on('data', (data) => {
            //convert hex sang text
            const buffer = Buffer.from(data);
            const hexString = buffer.toString('hex');
            console.log("Hex String:", hexString);
            //cắt lấy bắt đầu từ 28 kết thúc 29
            var kq_lenh222 = catchuoi28den29(hexString);
            // cắt thành mảng 6 ký tự
            var data_split = cutStringInChunks(kq_lenh222, 6);
            const sanluong = data_split[0];
            const thogiansudung = data_split[1];
            const thauchi = data_split[2];
            const nguong1 = data_split[3];
            const nguong2 = data_split[4];
            const nguong3 = data_split[5];
            const thogian1 = data_split[6];
            const thogian2 = data_split[7];
            const thogian3 = data_split[8];
            //convert to int
            const decValue_SL = parseInt(sanluong, 16);
            const decValue_thogiansudung = parseInt(thogiansudung, 16);
            const decValue_thauchi = parseInt(thauchi, 16);
            const decValue_nguong1 = parseInt(nguong1, 16);
            const decValue_nguong2 = parseInt(nguong2, 16);
            const decValue_nguong3 = parseInt(nguong3, 16);
            const decValue_thogian1 = parseInt(thogian1, 16);
            const decValue_thogian2 = parseInt(thogian2, 16);
            const decValue_thogian3 = parseInt(thogian3, 16);
            var SL = [];
            SL.push({
                "sanluong": decValue_SL,
                "thogiansudung": decValue_thogiansudung,
                "thauchi": decValue_thauchi,
                "nguong1": decValue_nguong1,
                "nguong2": decValue_nguong2,
                "nguong3": decValue_nguong3,
                "thogian1": decValue_thogian1,
                "thogian2": decValue_thogian2,
                "thogian3": decValue_thogian3

            })
            console.log("waitForItToWorkDongCat8000 - result: ", kq_lenh222);
            console.log("waitForItToWorkDongCat8000 - sanluong: ", sanluong, "- decValue_SL:", decValue_SL);
            const responseCode = data;
            console.log("waitForItToWorkDongCat8000 - data: ", responseCode);
            resolve(SL);
        });

        client.on('error', () => resolve(0)); // In case of an error, return 0 (no response)
    });
}

async function WaitForItToWork_DocCauHinh_ConLai(client, x) {
    console.log("WaitForItToWork_DocCauHinh");

    return new Promise((resolve) => {

        // Simulate waiting for a specific response from the server
        client.on('data', (data) => {
            //convert hex sang text
            const buffer = Buffer.from(data);
            const hexString = buffer.toString('hex');
            console.log("Hex String:", hexString);
            //chia chuỗi thành các mảng con tại "E3228"
            const splitArray = hexString.toUpperCase().split("E3228");
            // 2. Lấy mảng đầu tiên
            var cut_1 = splitArray[1];

            //chia chuỗi thành các mảng con tại "29"
            const SL_conlai = cut_1.split("29");
            const firstSegment = SL_conlai[0]; // Lấy phần trước "29"
            console.log("cut_2:", firstSegment);
            // Lấy 16 ký tự cuối cùng từ mảng đầu tiên
            const last16Chars = firstSegment.slice(-16);
            // 4. Chia thành 2 mảng mỗi mảng 8 ký tự
            const sanluong_conlai = last16Chars.slice(0, 8);
            const thoigiansudung_conlai = last16Chars.slice(8);
            console.log("sanluong_conlai:", sanluong_conlai, "thoigiansudung_conlai: ", thoigiansudung_conlai);
            // Chuyển đổi từ chuỗi hex sang số nguyên
            const decValue_SL_conlai = parseInt(sanluong_conlai, 16);
            const decValue_TIME_conlai = parseInt(thoigiansudung_conlai, 16);

            x.push({
                "sanluongconlai": decValue_SL_conlai,
                "thogianconlai": decValue_TIME_conlai
            })
            console.log("san luong con lai: ", x);

            resolve(x);
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