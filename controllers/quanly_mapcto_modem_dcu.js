const net = require("net");
/**
 * ==========================================================
 * SERVICE GỬI MAP CÔNG TƠ
chia danh sách công tơ thành nhiều gói, mỗi gói tối đa 141 công tơ
trong mỗi gói, gửi tuần tự các bản tin:
00_00
00_01
00_02
...
bản tin cuối cùng có prefix 80, ví dụ 80_03
chỉ khi bản tin trước trả ACK 0000 thì mới gửi bản tin tiếp theo
nếu lỗi ở bất kỳ bản tin nào thì dừng và trả kết quả lỗi
sau khi xong tất cả gói thì trả details cho từng công tơ

/**
 * ==========================================================
 * CONFIG
 * ==========================================================
 */
const SYSTEM_CONFIG = {
    CONNECT_TIMEOUT: 10000,
    DATA_TIMEOUT: 15000,
    TCP_IDLE_END_MS: 350,
    MAX_METERS_PER_PACKAGE: 141,
    TOTAL_FRAMES_PER_PACKET: 100 // ví dụ: 00_00, 00_01, 00_02, 80_03
};

/**
 * ==========================================================
 * PACKET / ACK HELPERS
 * ==========================================================
 */

function getD4(value) {
    return String(value).toUpperCase().padStart(4, "0");
}

/**
 * Theo logic bạn đưa:
 * - 80_xx => parseInt(xx) + 32768 => hex 4 ký tự
 * - còn lại => parseInt(xx) => hex 4 ký tự
 *
 * Ví dụ:
 * 00_00 -> 0000
 * 00_01 -> 0001
 * 00_02 -> 0002
 * 80_03 -> 8003
 * 01_100 -> 0064
 */
function getAckCodeFromPacknum(packnum) {
    const arrpack = String(packnum || "").split("_");

    if (arrpack.length !== 2) {
        throw new Error(`packnum không hợp lệ: ${packnum}`);
    }

    const prefix = arrpack[0];
    const seq = parseInt(arrpack[1], 10);

    if (Number.isNaN(seq)) {
        throw new Error(`frame index không hợp lệ: ${packnum}`);
    }

    let encoded;
    if (prefix === "80") {
        encoded = (seq + 32768).toString(16);
    } else {
        encoded = seq.toString(16);
    }

    return getD4(encoded).replace(/ /g, "");
}

function chunkArray(list = [], size = SYSTEM_CONFIG.MAX_METERS_PER_PACKAGE) {
    const result = [];
    for (let i = 0; i < list.length; i += size) {
        result.push(list.slice(i, i + size));
    }
    return result;
}

/**
 * ==========================================================
 * BUILD COMMAND
 * ==========================================================
 * Format:
 * CMD#8605210573045640#MAP_CONGTO_DCU#MapCongTo#3333333333333333#00_00#(01)(2228990125)
 * CMD#8605210573045640#MAP_CONGTO_DCU#MapCongTo#3333333333333333#00_01#(01)(2228990125)
 * ...
 * CMD#8605210573045640#MAP_CONGTO_DCU#MapCongTo#3333333333333333#80_03#(01)(2228990125)
 */
function buildMapCongToCommand(imei, meters = [], frameNo = "00_00") {
    const validMeters = meters
        .map((x) => String(x.socongto || "").trim())
        .filter((x) => x.length > 0);

    if (!imei) {
        throw new Error("Thiếu IMEI DCU");
    }

    if (!validMeters.length) {
        throw new Error("Danh sách công tơ map rỗng");
    }

    if (validMeters.length > SYSTEM_CONFIG.MAX_METERS_PER_PACKAGE) {
        throw new Error(`Mỗi gói tối đa ${SYSTEM_CONFIG.MAX_METERS_PER_PACKAGE} công tơ`);
    }

    const count = String(validMeters.length).padStart(2, "0");
    const meterPart = validMeters.map((x) => `(${x})`).join("");

    return `CMD#${imei}#MAP_CONGTO_DCU#MapCongTo#3333333333333333#${frameNo}#(${count})${meterPart}`;
}
/**
 * ==========================================================
 * PARSE RESPONSE
 * ==========================================================
 * Lấy ACK code 4 ký tự HEX từ bản tin trả về, ví dụ:
 * 0000, 0001, 0002, 8003...
 */
function parseMapCongToResponse(raw) {
    const text = String(raw || "").trim().toUpperCase();

    const result = {
        success: false,
        ack: false,
        ackCode: null,
        code: null,
        message: "DCU không phản hồi hợp lệ",
        raw: text
    };

    if (!text) {
        result.message = "DCU không trả dữ liệu";
        return result;
    }

    // Tìm ACK dạng 4 ký tự HEX
    const hexMatch = text.match(/\b([0-9A-F]{4})\b/);
    if (hexMatch) {
        result.ack = true;
        result.ackCode = hexMatch[1];
        result.code = hexMatch[1];
        result.success = true;
        result.message = `DCU trả ACK ${hexMatch[1]}`;
        return result;
    }

    if (
        text.includes("SUCCESS") ||
        text.includes(" OK ") ||
        text.startsWith("OK") ||
        text.endsWith("OK") ||
        text.includes("#OK#")
    ) {
        result.success = true;
        result.ack = true;
        result.message = "DCU đã ACK bản tin thành công";
        return result;
    }

    const knownErrors = [
        { key: "DCU DANG BAN", message: "DCU đang bận" },
        { key: "TIMEOUT", message: "DCU quá thời gian phản hồi" },
        { key: "ERROR", message: "DCU trả về lỗi" },
        { key: "FAIL", message: "Map công tơ thất bại" },
        { key: "INVALID", message: "Lệnh map không hợp lệ" },
        { key: "NOT CONNECT", message: "DCU chưa kết nối" },
        { key: "BUSY", message: "DCU đang bận" }
    ];

    for (const item of knownErrors) {
        if (text.includes(item.key)) {
            result.message = item.message;
            return result;
        }
    }

    result.message = `Phản hồi không xác định: ${text}`;
    return result;
}

/**
 * ==========================================================
 * TCP HELPERS
 * ==========================================================
 */
async function withTcpClient(callback, config = {}) {
    const {
        TCP_HOST,
        TCP_PORT,
        CONNECT_TIMEOUT = SYSTEM_CONFIG.CONNECT_TIMEOUT,
        DATA_TIMEOUT = SYSTEM_CONFIG.DATA_TIMEOUT
    } = config;

    if (!TCP_HOST) {
        throw new Error("Thiếu TCP_HOST");
    }

    if (!Number.isFinite(Number(TCP_PORT)) || Number(TCP_PORT) <= 0) {
        throw new Error("TCP_PORT không hợp lệ");
    }

    const client = new net.Socket();

    return new Promise((resolve, reject) => {
        let settled = false;
        let connectTimer = null;

        const finish = (fn, value) => {
            if (settled) return;
            settled = true;

            try {
                if (connectTimer) clearTimeout(connectTimer);
                client.removeAllListeners();
                client.destroy();
            } catch (_) { }

            fn(value);
        };

        connectTimer = setTimeout(() => {
            finish(reject, new Error(`Timeout connect ${TCP_HOST}:${TCP_PORT}`));
        }, CONNECT_TIMEOUT);

        client.connect(Number(TCP_PORT), TCP_HOST, async () => {
            try {
                clearTimeout(connectTimer);

                client.setTimeout(DATA_TIMEOUT);

                client.on("data", () => {
                    client.setTimeout(DATA_TIMEOUT);
                });

                const result = await callback(client);
                finish(resolve, result);
            } catch (err) {
                finish(reject, err);
            }
        });

        client.on("timeout", () => {
            finish(reject, new Error(`Timeout data ${TCP_HOST}:${TCP_PORT}`));
        });

        client.on("error", (err) => {
            finish(reject, err);
        });

        client.on("close", () => {
            // đóng tự nhiên
        });
    });
}

async function sendTcpCommand(
    client,
    command,
    timeout = SYSTEM_CONFIG.DATA_TIMEOUT,
    idleMs = SYSTEM_CONFIG.TCP_IDLE_END_MS
) {
    if (!client || client.destroyed) {
        throw new Error("TCP client chưa kết nối");
    }

    if (!command || !String(command).trim()) {
        throw new Error("Lệnh gửi xuống DCU không hợp lệ");
    }

    return new Promise((resolve, reject) => {
        const chunks = [];
        let settled = false;
        let idleTimer = null;

        const cleanup = () => {
            if (settled) return;
            settled = true;
            clearTimeout(mainTimer);
            if (idleTimer) clearTimeout(idleTimer);
            client.off("data", onData);
            client.off("error", onError);
            client.off("timeout", onTimeout);
        };

        const doneSuccess = () => {
            cleanup();
            resolve(Buffer.concat(chunks).toString("utf8"));
        };

        const doneError = (err) => {
            cleanup();
            reject(err);
        };

        const mainTimer = setTimeout(() => {
            doneError(new Error(`Timeout khi gửi lệnh: ${command}`));
        }, timeout);

        const onData = (data) => {
            chunks.push(Buffer.isBuffer(data) ? data : Buffer.from(data));

            if (idleTimer) clearTimeout(idleTimer);
            idleTimer = setTimeout(() => {
                doneSuccess();
            }, idleMs);
        };

        const onError = (err) => {
            doneError(err);
        };

        const onTimeout = () => {
            doneError(new Error(`Timeout data khi gửi lệnh: ${command}`));
        };

        client.on("data", onData);
        client.on("error", onError);
        client.on("timeout", onTimeout);

        client.write(command, (err) => {
            if (err) {
                doneError(err);
            }
        });
    });
}

/**
 * ==========================================================
 * HANDSHAKE AMI / DCU
 * ==========================================================
 */
async function waitForKeyword(client, keyword, timeout = 5000) {
    return new Promise((resolve) => {
        let settled = false;

        const cleanup = (result) => {
            if (settled) return;
            settled = true;
            clearTimeout(timer);
            client.off("data", onData);
            client.off("error", onError);
            resolve(result);
        };

        const timer = setTimeout(() => cleanup(false), timeout);

        const onData = (data) => {
            const response = data.toString().toLowerCase();
            if (response.includes(String(keyword).toLowerCase())) {
                cleanup(true);
            }
        };

        const onError = () => cleanup(false);

        client.on("data", onData);
        client.on("error", onError);
    });
}

async function sendConnToAMI(client, imei, timeout = 5000) {
    try {
        if (!client || client.destroyed) {
            return [0, "Client chưa kết nối"];
        }

        client.write(`WEB#${imei}CONNECT`);
        const connectOk = await waitForKeyword(client, "connect3", timeout);
        if (!connectOk) return [0, "Không kết nối được comserver"];

        client.write(`@READ${imei}`);
        const readOk = await waitForKeyword(client, "@read", timeout);
        if (!readOk) return [2, "DCU đang bận"];

        return [1, "Thành công"];
    } catch (err) {
        return [0, err.message || "Có lỗi xảy ra"];
    }
}

/**
 * ==========================================================
 * FRAME HELPERS
 * ==========================================================
 */
function buildFrameNo(frameIndex, totalFramesPerPacket) {
    const isLastFrame = frameIndex === totalFramesPerPacket - 1;
    return `${isLastFrame ? "80" : "00"}_${String(frameIndex).padStart(2, "0")}`;
}

/**
 * ==========================================================
 * SERVICE GỬI MAP CÔNG TƠ
 * ==========================================================
 */
async function sendMapCongToToDCU({
    imei,
    ip,
    port,
    list,
    tcp_timeout = SYSTEM_CONFIG.DATA_TIMEOUT
}) {
    // Chia danh sách thành các gói, mỗi gói tối đa 141 công tơ
    const packages = chunkArray(list, SYSTEM_CONFIG.MAX_METERS_PER_PACKAGE);
    const packetResults = [];

    console.log("Tổng số công tơ:", list.length);
    console.log("Số gói:", packages.length);
    console.log(
        "Kích thước từng gói:",
        packages.map((p, i) => ({
            packetIndex: i,
            size: p.length
        }))
    );

    const overall = await withTcpClient(
        async (client) => {
            const [resultCode, message] = await sendConnToAMI(client, imei, tcp_timeout);

            if (resultCode !== 1) {
                throw new Error(message || "Không kết nối được DCU");
            }

            // Mỗi gói gửi đúng 1 lần
            for (let packetIndex = 0; packetIndex < packages.length; packetIndex++) {
                const packetMeters = packages[packetIndex];
                const frameNo = buildFrameNo(packetIndex, packages.length);
                const expectedAckCode = getAckCodeFromPacknum(frameNo);
                const command = buildMapCongToCommand(imei, packetMeters, frameNo);

                console.log("send packet command:", command);
                console.log("expectedAckCode:", expectedAckCode);

                const raw = await sendTcpCommand(client, command, tcp_timeout);
                const parsed = parseMapCongToResponse(raw);

                const packetResult = {
                    packetIndex: String(packetIndex).padStart(2, "0"),
                    frameNo,
                    expectedAckCode,
                    ackCode: parsed.ackCode,
                    success: parsed.success,
                    ack: parsed.ack,
                    code: parsed.code,
                    message: parsed.message,
                    command,
                    raw,
                    meters: packetMeters
                };

                packetResults.push(packetResult);

                // Chỉ ACK đúng gói hiện tại mới gửi gói kế
                if (!(parsed.ack === true && parsed.ackCode === expectedAckCode)) {
                    return {
                        success: false,
                        ack: parsed.ack,
                        ackCode: parsed.ackCode,
                        expectedAckCode,
                        code: parsed.code,
                        message: `Gói ${String(packetIndex).padStart(2, "0")} lỗi. ACK nhận được: ${parsed.ackCode || "null"}, ACK mong đợi: ${expectedAckCode}`,
                        packetResults
                    };
                }
            }

            return {
                success: true,
                ack: true,
                ackCode: "DONE",
                code: "DONE",
                message: "Thành công",
                packetResults
            };
        },
        {
            TCP_HOST: ip,
            TCP_PORT: port,
            CONNECT_TIMEOUT: SYSTEM_CONFIG.CONNECT_TIMEOUT,
            DATA_TIMEOUT: tcp_timeout
        }
    );

    return overall;
}

/**
 * ==========================================================
 * CONTROLLER
 * POST /api/quanly_mapcto_modem_dcu
 * ==========================================================
 */
const post = async (req, res, next) => {
    try {
        const imei = String(req.body?.imei || "").trim();
        const ip = String(req.body?.ip || "").trim();
        const port = Number(req.body?.port || 0);
        const inputList = Array.isArray(req.body?.list) ? req.body.list : [];

        if (!imei) {
            return res.status(400).json({
                success: false,
                message: "Thiếu imei"
            });
        }

        if (!ip) {
            return res.status(400).json({
                success: false,
                message: "Thiếu ip"
            });
        }

        if (!Number.isFinite(port) || port <= 0) {
            return res.status(400).json({
                success: false,
                message: "Port không hợp lệ"
            });
        }

        const meters = inputList
            .map((item, index) => ({
                rowId: Number(item.rowId || index + 1),
                socongto: String(item.socongto || "").trim(),
                madiemdo: String(item.madiemdo || "").trim(),
                ten_khachhang: String(item.ten_khachhang || "").trim(),
                imei: String(item.imei || "").trim()
            }))
            .filter((item) => item.socongto);

        if (!meters.length) {
            return res.status(400).json({
                success: false,
                message: "Danh sách công tơ không hợp lệ"
            });
        }

        const result = await sendMapCongToToDCU({
            imei,
            ip,
            port,
            list: meters
        });

        const details = meters.map((m) => ({
            rowId: m.rowId,
            socongto: m.socongto,
            madiemdo: m.madiemdo,
            ten_khachhang: m.ten_khachhang,
            imei: m.imei,
            success: result.success,
            ack: result.ack,
            ackCode: result.ackCode,
            status: result.message
        }));

        return res.status(result.success ? 200 : 500).json({
            success: result.success,
            ack: result.ack,
            ackCode: result.ackCode,
            expectedAckCode: result.expectedAckCode || null,
            message: result.message,
            data: {
                imei,
                ip,
                port,
                packetResults: result.packetResults,
                details
            }
        });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    post,
    getD4,
    getAckCodeFromPacknum,
    buildMapCongToCommand,
    parseMapCongToResponse,
    withTcpClient,
    sendTcpCommand,
    sendConnToAMI,
    sendMapCongToToDCU,
    chunkArray,
    buildFrameNo
};