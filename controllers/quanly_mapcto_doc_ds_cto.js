const net = require("net");

/**
 * ==========================================================
 * CONFIG
 * ==========================================================
 */
const SYSTEM_CONFIG = {
    CONNECT_TIMEOUT: 15000,
    DATA_TIMEOUT: 15000,
    READ_LIST_TIMEOUT: 20000,
    TCP_IDLE_END_MS: 1200
};

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
    });
}
async function sendTcpCommand(
    client,
    command,
    timeout = SYSTEM_CONFIG.DATA_TIMEOUT,
    idleMs = 1200
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
            const fullBuffer = Buffer.concat(chunks);
            const fullText = fullBuffer.toString("utf8");

            console.log("📦 FULL RESPONSE UTF8:", fullText);

            resolve(fullText);
        };

        const doneError = (err) => {
            cleanup();
            reject(err);
        };

        const hasCompleteAck = (text) => {
            // ACK dạng 4 ký tự HEX, ví dụ 0000, 0001, 8003...
            return /\b[0-9A-F]{4}\b/i.test(text);
        };

        const mainTimer = setTimeout(() => {
            doneError(new Error(`Timeout khi gửi lệnh: ${command}`));
        }, timeout);

        const onData = (data) => {
            const buf = Buffer.isBuffer(data) ? data : Buffer.from(data);
            const text = buf.toString("utf8");
            // console.log("📥 DATA CHUNK UTF8:", text);
            // console.log("📥 DATA CHUNK HEX :", buf.toString("hex"));

            chunks.push(buf);

            const fullText = Buffer.concat(chunks).toString("utf8");

            // Nếu đã thấy ACK đầy đủ thì chốt luôn
            if (hasCompleteAck(fullText)) {
                doneSuccess();
                return;
            }

            // Nếu chưa thấy ACK, đợi thêm một khoảng im lặng
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

        console.log("📤 SENT COMMAND:", command);

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
 * READ METER LIST
 * ==========================================================
 */
function buildReadMeterListCommand(imei) {
    return `CMD#${imei}#READDATA_DCU#33333333#07`;
}

function normalizeMeterNo(value) {
    return String(value || "")
        .trim()
        .replace(/\s+/g, "")
        .toUpperCase();
}

function uniqueByIndex(list) {
    const map = new Map();
    list.forEach((item) => {
        if (!map.has(item.index)) {
            map.set(item.index, item);
        }
    });
    return [...map.values()];
}

/**
 * Parse response dạng ví dụ:
 * (002539000003:33:S:U)(002228990125:13:S:U)
 */
function parseMeterListResponse(raw) {

    if (!raw) return [];

    const text = String(raw).replace(/\r/g, "").replace(/\n/g, "");
    const result = [];

    const matches = text.match(/\((\d{6,}:[^)]*)\)/g) || [];
    let index = 1;

    for (const item of matches) {
        const clean = item.replace(/[()]/g, "");
        const parts = clean.split(":");

        let socongto = parts[0];
        if (!socongto) continue;

        socongto = normalizeMeterNo(socongto);

        result.push({
            index: index++,
            socongto
        });
    }

    return uniqueByIndex(result);
}

async function readMeterListFromDCU({
    imei,
    ip,
    port,
    tcp_timeout = SYSTEM_CONFIG.DATA_TIMEOUT
}) {
    const command = buildReadMeterListCommand(imei);

    const raw = await withTcpClient(
        async (client) => {
            const [resultCode, message] = await sendConnToAMI(client, imei, tcp_timeout);

            if (resultCode !== 1) {
                throw new Error(message || "Không kết nối được DCU");
            }

            return await sendTcpCommand(
                client,
                command,
                SYSTEM_CONFIG.READ_LIST_TIMEOUT
            );
        },
        {
            TCP_HOST: ip,
            TCP_PORT: port,
            CONNECT_TIMEOUT: SYSTEM_CONFIG.CONNECT_TIMEOUT,
            DATA_TIMEOUT: tcp_timeout
        }
    );

    console.log(raw);
    const meters = parseMeterListResponse(raw);
    if (!meters.length) {
        throw new Error("Không đọc được danh sách công tơ từ DCU");
    }

    return {
        success: true,
        message: "Đọc danh sách công tơ từ DCU thành công",
        list: meters,
    };
}

/**
 * ==========================================================
 * CONTROLLER
 * POST /api/quanly_doc_congto_dcu
 * ==========================================================
 */
const post = async (req, res, next) => {
    try {
        const imei = String(req.body?.imei || "").trim();
        const ip = String(req.body?.ip || "").trim();
        const port = Number(req.body?.port || 0);

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

        const result = await readMeterListFromDCU({
            imei,
            ip,
            port
        });

        return res.status(200).json(result);
    } catch (err) {
        next(err);
    }
};

module.exports = {
    post,
    withTcpClient,
    sendTcpCommand,
    sendConnToAMI,
    buildReadMeterListCommand,
    parseMeterListResponse,
    readMeterListFromDCU
};