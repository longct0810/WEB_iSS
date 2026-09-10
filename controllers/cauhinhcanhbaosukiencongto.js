const net = require('net');
const post = async (req, res, next) => {

    let { v_socongto, v_imei, v_obis, v_ip, v_port, v_meterpassword } = req.body;

    try {
        if (String(v_obis).trim().toLowerCase() === "server") {
            const now = new Date(
                new Date().toLocaleString("en-US", {
                    timeZone: "Asia/Ho_Chi_Minh"
                })
            );

            const yy = String(now.getFullYear()).slice(-2);

            const mm = String(now.getMonth() + 1).padStart(2, "0");

            const dd = String(now.getDate()).padStart(2, "0");

            const hh = String(now.getHours()).padStart(2, "0");

            const mi = String(now.getMinutes()).padStart(2, "0");

            const ss = String(now.getSeconds()).padStart(2, "0");

            const meterTime = `(${yy}${mm}${dd}${hh}${mi}${ss})`;

            // OBIS thời gian công tơ
            v_obis = `0.0.0.9.4${meterTime}`;
        }

        const client = new net.Socket();

        client.connect(v_port, v_ip, async () => {
            console.log("→ Socket connected");

            const [connCode, connMsg] = await sendConnToAMI(client, v_imei);

            if (connCode !== 1) {
                client.destroy();
                return res.status(200).json({ status: connCode, message: connMsg });
            }

            // Connected OK → send command
            const [cmdCode, cmdMsg] = await sendCmdDongCat(client, v_imei, v_socongto, v_meterpassword, v_obis);

            client.destroy();
            return res.status(200).json({ status: cmdCode, message: cmdMsg });
        });

        client.on("error", (err) => {
            console.log("❌ Socket error:", err);
            res.status(500).json({ status: 0, message: "Lỗi TCP: " + err.message });
        });

    } catch (err) {
        next(err);
    }
};

async function sendConnToAMI(client, imei) {
    try {
        const str = "WEB#" + imei + "CONNECT";
        client.write(str);
        console.log("→ Gửi CONNECT:", str);

        const ok = await waitForResponse(client, (buffer) => {
            const res = buffer.toLowerCase();
            if (res.includes("connect3")) return true;
            return false;
        });

        if (!ok) return [0, "Không kết nối được COMSERVER"];

        // ---- Gửi @READ ----
        const read = "@READ" + imei;
        client.write(read);
        console.log("→ Gửi @READ:", read);

        const readOK = await waitForResponse(client, (buffer) => {
            const res = buffer.toLowerCase();
            if (res.includes("@read")) return true;
            if (res.includes("busy")) return 2; // DCU đang bận
            return false;
        });

        if (readOK === 2) return [2, "DCU đang bận"];
        if (readOK) return [1, "Thành công"];

        return [0, "Không nhận được phản hồi READ"];

    } catch (err) {
        return [0, "Lỗi CON3: " + err.message];
    }
}


function waitForResponse(client, matchFn, timeoutMs = 30000) {
    return new Promise((resolve) => {
        let buffer = "";
        let finished = false;

        function onData(data) {
            buffer += data.toString();
            // ❗ LOG TẤT CẢ DỮ LIỆU RAW TỪ DCU
            console.log("📥 RAW FROM DCU:", buffer);
            const match = matchFn(buffer);
            if (match !== false) {
                cleanup();
                finished = true;
                resolve(match);
            }
        }

        function onError() {
            if (!finished) {
                cleanup();
                console.log("❌ TCP ERROR:", err);
                resolve(false);
            }
        }

        function onTimeout() {
            if (!finished) {
                console.log("⏳ TIMEOUT:", timeoutMs, "ms");
                cleanup();
                resolve(false);
            }
        }

        function cleanup() {
            client.off("data", onData);
            client.off("error", onError);
            clearTimeout(timeout);
        }

        const timeout = setTimeout(onTimeout, timeoutMs);

        client.on("data", onData);
        client.on("error", onError);
    });
}

async function sendCmdDongCat(client, imei, socongto, matkhau, obis) {
    try {
        console.log("→ Thực hiện lưu cấu hình…");

        const passHex = Buffer.from(matkhau, "utf-8").toString("hex");
        const cmd = `CMD#${imei}#DK_CTO#${socongto}#${passHex}#${obis}`;

        console.log("→ Lệnh gửi:", cmd);
        client.write(cmd);

        const phase1 = await waitForResponse(client, (buffer) => {
            const res = buffer.toLowerCase();

            if (res.includes("8000")) return "8000";      // DCU nhận lệnh
            if (res.includes("8100")) return "8100";      // lỗi cấu hình
            if (res.includes("8200")) return "8200";      // sai mật khẩu
            if (res.includes("8300")) return "8300";      // lỗi khác

            return false;
        });

        if (!phase1) return [3, "DCU không phản hồi 8000"];
        if (phase1 === "8100") return [3, "Lưu cấu hình không thành công"];
        if (phase1 === "8200") return [4, "Sai mật khẩu công tơ"];
        if (phase1 === "8300") return [3, "Lỗi cấu hình (8300)"];

        console.log("✔ Nhận 8000 — DCU đã nhận lệnh, CHỜ ACK công tơ…");
        // Nếu không nằm các case trên → chờ ACK AMI
        const ack = await waitForResponse(client, (buffer) => {
            const res = buffer.toLowerCase();
            if (res.includes("ack")) return true;
            if (res.includes("nack")) return "nack";
            return false;
        }, 30000); // công tơ có thể trả ACK chậm 5–30s

        if (ack === true) {
            console.log("✔ Công tơ trả ACK → LƯU THÀNH CÔNG");
            return [1, "Lưu cấu hình thành công"];
        }

        if (ack === "nack") {
            console.log("❌ Công tơ trả NACK → Lưu thất bại");
            return [3, "Lưu cấu hình không thành công"];
        }

        console.log("❌ Không nhận ACK từ công tơ");
        return [2, "Lưu cấu hình không thành công"];

    } catch (err) {
        return [0, "Lỗi gửi lệnh: " + err.message];
    }
}


function hexToText(hexString) {
    // Create a buffer from the hexadecimal string
    const buffer = Buffer.from(hexString, 'hex');
    // Convert the buffer to a UTF-8 string
    return buffer.toString('utf8');
}

const readObis = async (req, res, next) => {

    const { v_socongto, v_imei, v_obis, v_ip, v_port } = req.body;

    const client = new net.Socket();

    client.connect(v_port, v_ip, async () => {
        console.log("→ Socket connected");

        const [connCode, connMsg] = await sendConnToAMI(client, v_imei);

        if (connCode !== 1) {
            client.destroy();
            return res.status(200).json({ status: connCode, message: connMsg });
        }
        const cmd = `CMD#${v_imei}#READDATA_CTO#${v_socongto}#${v_obis}`;
        console.log("→ Gửi lệnh đọc cấu hình:", cmd);

        const result = await readCauHinh(client, cmd);

        client.destroy();
        return res.status(200).json(result);
    });

    client.on("error", (err) => {
        console.log("❌ Socket error:", err);
        res.status(500).json({ status: 0, message: "Lỗi TCP: " + err.message });
    });

}
async function readCauHinh(client, lenh) {
    try {
        client.write(lenh);

        const raw = await waitForResponse(client, (buffer) => {
            const regex = /(\d+\.\d+\.\d+\.\d+\.\d+)\(([^)]*)\)/;
            if (regex.test(buffer)) {
                return buffer;     // buffer có chứa OBIS → đã đọc xong
            }
            return false;
        }, 30000);

        if (!raw) return { status: 0, message: "Không nhận dữ liệu từ DCU" };

        console.log("📥 RAW READ DATA:", raw);

        const parsed = parseObisData(raw);
        console.log("📥 RAW parsed:", parsed);

        return {
            status: 1,
            message: "OK",
            data: parsed
        };

    } catch (err) {
        return { status: 0, message: "Lỗi đọc cấu hình: " + err.message };
    }
}
function parseObisData(raw) {
    const result = {};

    // tách theo OBIS trước
    const obisRegex = /(\d+\.\d+\.\d+\.\d+\.\d+)((\([^)]*\))+)/g;

    let match;

    while ((match = obisRegex.exec(raw)) !== null) {
        const obis = match[1];
        const fullValue = match[2]; // toàn bộ (....)(....)

        // lấy tất cả value trong ()
        const values = [];
        const valueRegex = /\(([^)]*)\)/g;

        let v;
        while ((v = valueRegex.exec(fullValue)) !== null) {
            let val = v[1];

            // bỏ đơn vị nếu có *
            if (val.includes("*")) {
                val = val.split("*")[0];
            }

            values.push(val);
        }

        result[obis] = values;
    }

    return result;
}


module.exports = { post, readObis };