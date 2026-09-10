const net = require("net");

const SYSTEM_CONFIG = {
    DCU_CONCURRENCY: 4,
    CONNECT_TIMEOUT: 15000,
    READ_LIST_MAX_WAIT_MS: 60000,
    READ_LIST_IDLE_END_MS: 2500,
    READ_INSTANT_TIMEOUT: 30000,
    READ_INSTANT_HES_WAIT_MS: 2 * 60 * 1000,
    HES_IDLE_END_MS: 2500,
    RETRIES: 2,
    RETRY_DELAY_MS: 1000,
    RETRY_FACTOR: 2
};

const post = async (req, res, next) => {
    const isClientClosedRef = { closed: false };

    try {
        const inputList = Array.isArray(req.body?.list) ? req.body.list : [];

        if (!inputList.length) {
            return res.status(400).json({
                success: false,
                message: "Danh sách công tơ không hợp lệ"
            });
        }

        const normalizedList = inputList
            .map(item => ({
                rowId: Number(item.rowId || 0),
                imei: String(item.imei || "").trim(),
                socongto: normalizeMeterNo(item.socongto),
                madiemdo: String(item.madiemdo || "").trim(),
                ten_khachhang: String(item.ten_khachhang || "").trim(),
                ip: String(item.ip || "").trim(),
                port: Number(item.port || 0),
                tcp_timeout: Number(item.tcp_timeout || SYSTEM_CONFIG.READ_INSTANT_TIMEOUT)
            }))
            .filter(item =>
                item.imei &&
                item.socongto &&
                item.ip &&
                Number.isFinite(item.port) &&
                item.port > 0
            );

        if (!normalizedList.length) {
            return res.status(400).json({
                success: false,
                message: "Không có imei / số công tơ / ip / port hợp lệ"
            });
        }

        res.writeHead(200, {
            "Content-Type": "text/event-stream; charset=utf-8",
            "Cache-Control": "no-cache, no-transform",
            Connection: "keep-alive",
            "X-Accel-Buffering": "no"
        });

        if (typeof res.flushHeaders === "function") {
            res.flushHeaders();
        }

        req.on("aborted", () => {
            isClientClosedRef.closed = true;
        });

        res.on("close", () => {
            isClientClosedRef.closed = true;
        });

        const sendEvent = (event, data) => {
            if (isClientClosedRef.closed || res.writableEnded || res.destroyed) return;

            res.write(`event: ${event}\n`);
            res.write(`data: ${JSON.stringify(data)}\n\n`);
        };

        const total = normalizedList.length;
        let processed = 0;
        let successCount = 0;
        let errorCount = 0;

        const pushRow = rowData => {
            processed++;

            if (
                rowData.success &&
                rowData.chisokwh !== null &&
                rowData.chisokwh !== undefined &&
                rowData.chisokwh !== ""
            ) {
                successCount++;
            } else {
                errorCount++;
            }

            sendEvent("row", {
                ...rowData,
                progress: buildProgress(processed, total, successCount, errorCount)
            });
        };

        sendEvent("start", {
            success: true,
            message: "Bắt đầu đọc tức thời",
            progress: buildProgress(processed, total, successCount, errorCount)
        });

        const groupedEntries = Object.entries(groupByImeiAndHost(normalizedList));

        await runWithConcurrency(
            groupedEntries,
            SYSTEM_CONFIG.DCU_CONCURRENCY,
            async ([, meterListInput]) => {
                if (isClientClosedRef.closed) return;

                try {
                    await processOneDcuGroup({
                        meterListInput,
                        pushRow,
                        isClientClosedRef
                    });
                } catch (err) {
                    for (const meter of meterListInput) {
                        if (isClientClosedRef.closed) break;

                        pushRow(
                            buildErrorResult({
                                meter,
                                imei: meter.imei,
                                status: err.message || "Không phản hồi"
                            })
                        );
                    }
                }
            }
        );

        if (!isClientClosedRef.closed && !res.writableEnded && !res.destroyed) {
            sendEvent("done", {
                success: true,
                message: "Hoàn thành đọc tức thời",
                progress: buildProgress(processed, total, successCount, errorCount)
            });

            res.end();
        }

    } catch (err) {
        console.error("post stream error:", err);

        if (!res.headersSent) {
            return next(err);
        }

        try {
            if (!res.writableEnded && !res.destroyed) {
                res.write(`event: error\n`);
                res.write(
                    `data: ${JSON.stringify({
                        success: false,
                        message: err.message || "Có lỗi xảy ra"
                    })}\n\n`
                );
                res.end();
            }
        } catch (_) { }
    }
};

async function processOneDcuGroup({
    meterListInput,
    pushRow,
    isClientClosedRef
}) {
    const { imei, ip, port, tcp_timeout } = meterListInput[0];

    const {
        readListCommand,
        readListRaw,
        matchedMeters,
        unmatchedMeters
    } = await retryWithBackoff(
        async () => {
            if (isClientClosedRef.closed) {
                throw new Error("Client đã đóng kết nối");
            }

            return withTcpClient(
                async client => {
                    const [resultCode, message] = await sendConnToAMI(
                        client,
                        imei,
                        tcp_timeout || SYSTEM_CONFIG.READ_INSTANT_TIMEOUT
                    );

                    if (resultCode !== 1) {
                        throw new Error(message || "Không kết nối được DCU");
                    }

                    const readListCommand = buildReadMeterListCommand(imei);

                    const readListRaw = await sendTcpCommandReadFullMeterList(
                        client,
                        readListCommand,
                        {
                            maxWaitMs: SYSTEM_CONFIG.READ_LIST_MAX_WAIT_MS,
                            idleEndMs: SYSTEM_CONFIG.READ_LIST_IDLE_END_MS
                        }
                    );

                    const meterListFromDcu = parseMeterListResponse(readListRaw);

                    if (!meterListFromDcu.length) {
                        throw new Error("Không đọc được danh sách công tơ từ DCU");
                    }

                    const dcuMeterMap = new Map();

                    for (const item of meterListFromDcu) {
                        dcuMeterMap.set(toComparableMeterNo(item.socongto), item);
                    }

                    const matchedMeters = [];
                    const unmatchedMeters = [];

                    for (const meter of meterListInput) {
                        const found = dcuMeterMap.get(toComparableMeterNo(meter.socongto));

                        if (found) {
                            matchedMeters.push({
                                ...meter,
                                meterIndex: Number(found.index)
                            });
                        } else {
                            unmatchedMeters.push(meter);
                        }
                    }

                    return {
                        readListCommand,
                        readListRaw,
                        matchedMeters,
                        unmatchedMeters
                    };
                },
                {
                    TCP_HOST: ip,
                    TCP_PORT: port,
                    CONNECT_TIMEOUT: SYSTEM_CONFIG.CONNECT_TIMEOUT,
                    DATA_TIMEOUT: tcp_timeout || SYSTEM_CONFIG.READ_INSTANT_TIMEOUT
                }
            );
        },
        {
            retries: SYSTEM_CONFIG.RETRIES,
            delayMs: SYSTEM_CONFIG.RETRY_DELAY_MS,
            factor: SYSTEM_CONFIG.RETRY_FACTOR,
            shouldRetry: isRetryableTcpError
        }
    );
    console.log("matchedMeters:", matchedMeters);

    for (const meter of unmatchedMeters) {
        if (isClientClosedRef.closed) break;

        pushRow({
            success: false,
            rowId: meter.rowId,
            imei,
            ip,
            port,
            socongto: meter.socongto,
            madiemdo: meter.madiemdo,
            ten_khachhang: meter.ten_khachhang,
            status: "Công tơ không có trong danh sách DCU",
            chisokwh: null,
            thoigiandoc: null,
            command_read_list: readListCommand,
            raw_read_list: readListRaw
        });
    }

    for (const meter of matchedMeters) {
        if (isClientClosedRef.closed) break;

        let readInstantCommand = null;
        let readInstantRaw = null;

        try {
            const hesResult = await withTcpClient(
                async client => {
                    const [resultCode, message] = await sendConnToAMI(
                        client,
                        imei,
                        tcp_timeout || SYSTEM_CONFIG.READ_INSTANT_TIMEOUT
                    );

                    if (resultCode !== 1) {
                        throw new Error(message || "Không kết nối được DCU");
                    }

                    readInstantCommand = buildDocTucThoiCommand(imei, [meter.meterIndex]);
                    console.log("readInstantCommand:", readInstantCommand);
                    return sendTcpCommandWaitHesDirect(
                        client,
                        readInstantCommand,
                        {
                            maxWaitMs: SYSTEM_CONFIG.READ_INSTANT_HES_WAIT_MS,
                            idleEndMs: SYSTEM_CONFIG.HES_IDLE_END_MS,
                            meter
                        }
                    );
                },
                {
                    TCP_HOST: ip,
                    TCP_PORT: port,
                    CONNECT_TIMEOUT: SYSTEM_CONFIG.CONNECT_TIMEOUT,
                    DATA_TIMEOUT: SYSTEM_CONFIG.READ_INSTANT_HES_WAIT_MS + 10000
                }
            );

            readInstantRaw = hesResult.raw;
            console.log("readInstantRaw: ", readInstantRaw);

            if (!hesResult.has8000) {
                pushRow({
                    success: false,
                    rowId: meter.rowId,
                    imei,
                    ip,
                    port,
                    socongto: meter.socongto,
                    madiemdo: meter.madiemdo,
                    ten_khachhang: meter.ten_khachhang,
                    meter_index: meter.meterIndex,
                    status: "Lệnh đọc tức thời không thành công",
                    chisokwh: null,
                    thoigiandoc: null,
                    command_read_list: readListCommand,
                    command_doctucthoi: readInstantCommand,
                    raw_read_list: readListRaw,
                    raw_doctucthoi: readInstantRaw
                });

                continue;
            }

            if (
                !hesResult.parsed ||
                hesResult.parsed.chisokwh === null ||
                hesResult.parsed.chisokwh === undefined ||
                hesResult.parsed.chisokwh === ""
            ) {
                pushRow({
                    success: false,
                    rowId: meter.rowId,
                    imei,
                    ip,
                    port,
                    socongto: meter.socongto,
                    madiemdo: meter.madiemdo,
                    ten_khachhang: meter.ten_khachhang,
                    meter_index: meter.meterIndex,
                    status: "HES đã nhận lệnh 8000 nhưng quá 2 phút chưa trả dữ liệu",
                    chisokwh: null,
                    thoigiandoc: null,
                    command_read_list: readListCommand,
                    command_doctucthoi: readInstantCommand,
                    raw_read_list: readListRaw,
                    raw_doctucthoi: readInstantRaw
                });

                continue;
            }

            pushRow({
                success: true,
                rowId: meter.rowId,
                imei,
                ip,
                port,
                socongto: meter.socongto,
                madiemdo: meter.madiemdo,
                ten_khachhang: meter.ten_khachhang,
                meter_index: meter.meterIndex,
                status: "Đọc tức thời thành công",
                chisokwh: hesResult.parsed.chisokwh,
                thoigiandoc: hesResult.parsed.thoigiandoc || formatDate(new Date()),
                data_hes: hesResult.parsed.data || hesResult.parsed,
                command_read_list: readListCommand,
                command_doctucthoi: readInstantCommand,
                raw_read_list: readListRaw,
                raw_doctucthoi: readInstantRaw
            });

        } catch (meterErr) {
            const msg = String(meterErr?.message || "");
            let status = msg || "Lỗi khi đọc công tơ";

            if (msg.includes("Timeout connect")) {
                status = "Timeout kết nối DCU";
            } else if (msg.includes("Timeout data")) {
                status = "DCU/HES không trả dữ liệu";
            } else if (msg.includes("Timeout khi gửi lệnh")) {
                status = "Gửi lệnh nhưng quá thời gian chờ phản hồi";
            }

            pushRow({
                success: false,
                rowId: meter.rowId,
                imei,
                ip,
                port,
                socongto: meter.socongto,
                madiemdo: meter.madiemdo,
                ten_khachhang: meter.ten_khachhang,
                meter_index: meter.meterIndex,
                status,
                chisokwh: null,
                thoigiandoc: null,
                command_read_list: readListCommand,
                command_doctucthoi: readInstantCommand,
                raw_read_list: readListRaw,
                raw_doctucthoi: readInstantRaw
            });
        }
    }
}

async function withTcpClient(callback, config) {
    const {
        TCP_HOST,
        TCP_PORT,
        CONNECT_TIMEOUT = 5000,
        DATA_TIMEOUT = 5000
    } = config;

    const client = new net.Socket();

    return new Promise((resolve, reject) => {
        let done = false;
        let connectTimer = null;

        const finish = (fn, value) => {
            if (done) return;

            done = true;

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

        client.connect(TCP_PORT, TCP_HOST, async () => {
            clearTimeout(connectTimer);

            client.setTimeout(DATA_TIMEOUT);

            client.on("data", () => {
                client.setTimeout(DATA_TIMEOUT);
            });

            try {
                const result = await callback(client);
                finish(resolve, result);
            } catch (err) {
                finish(reject, err);
            }
        });

        client.on("timeout", () => {
            finish(reject, new Error(`Timeout data ${TCP_HOST}:${TCP_PORT}`));
        });

        client.on("error", err => {
            finish(reject, err);
        });
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

async function waitForKeyword(client, keyword, timeout = 5000) {
    return new Promise(resolve => {
        let settled = false;

        const cleanup = result => {
            if (settled) return;

            settled = true;
            clearTimeout(timer);
            client.off("data", onData);
            client.off("error", onError);

            resolve(result);
        };

        const timer = setTimeout(() => cleanup(false), timeout);

        const onData = data => {
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

async function sendTcpCommandReadFullMeterList(client, command, options = {}) {
    const maxWaitMs = options.maxWaitMs || 60000;
    const idleEndMs = options.idleEndMs || 2500;

    return new Promise((resolve, reject) => {
        const chunks = [];
        let settled = false;
        let idleTimer = null;

        const cleanup = () => {
            if (settled) return;

            settled = true;

            clearTimeout(maxTimer);

            if (idleTimer) clearTimeout(idleTimer);

            client.off("data", onData);
            client.off("error", onError);
        };

        const finishSuccess = () => {
            cleanup();
            resolve(Buffer.concat(chunks).toString("utf8"));
        };

        const resetIdleTimer = () => {
            if (idleTimer) clearTimeout(idleTimer);

            idleTimer = setTimeout(() => {
                finishSuccess();
            }, idleEndMs);
        };

        const maxTimer = setTimeout(() => {
            if (chunks.length > 0) {
                finishSuccess();
            } else {
                cleanup();
                reject(new Error(`Timeout khi đọc danh sách công tơ: ${command}`));
            }
        }, maxWaitMs);

        const onData = data => {
            chunks.push(data);
            resetIdleTimer();
        };

        const onError = err => {
            cleanup();
            reject(err);
        };

        client.on("data", onData);
        client.on("error", onError);

        client.write(command);
        resetIdleTimer();
    });
}

async function sendTcpCommandWaitHesDirect(client, command, options = {}) {
    const maxWaitMs = options.maxWaitMs || SYSTEM_CONFIG.READ_INSTANT_HES_WAIT_MS;
    const idleEndMs = options.idleEndMs || SYSTEM_CONFIG.HES_IDLE_END_MS;
    const meter = options.meter || null;

    return new Promise((resolve, reject) => {
        const chunks = [];
        let settled = false;
        let has8000 = false;
        let idleTimer = null;

        const cleanup = () => {
            if (settled) return;

            settled = true;

            clearTimeout(maxTimer);

            if (idleTimer) clearTimeout(idleTimer);

            client.off("data", onData);
            client.off("error", onError);
        };

        const finish = reason => {
            cleanup();

            const raw = Buffer.concat(chunks).toString("utf8");
            const parsed = parseHesInstantDirect(raw, meter);

            resolve({
                raw,
                has8000,
                parsed,
                reason
            });
        };

        const resetIdleTimer = () => {
            if (idleTimer) clearTimeout(idleTimer);

            idleTimer = setTimeout(() => {
                const raw = Buffer.concat(chunks).toString("utf8");
                const parsed = parseHesInstantDirect(raw, meter);

                if (parsed && parsed.chisokwh !== null && parsed.chisokwh !== undefined && parsed.chisokwh !== "") {
                    finish("HAS_DATA");
                    return;
                }

                if (!has8000) {
                    finish("NO_8000");
                }
            }, idleEndMs);
        };

        const maxTimer = setTimeout(() => {
            const raw = Buffer.concat(chunks).toString("utf8");

            if (!contains8000(raw)) {
                finish("TIMEOUT_NO_8000");
                return;
            }

            finish("TIMEOUT_WAIT_HES_DATA");
        }, maxWaitMs);

        const onData = data => {
            chunks.push(data);

            const raw = Buffer.concat(chunks).toString("utf8");

            if (contains8000(raw)) {
                has8000 = true;
            }

            const parsed = parseHesInstantDirect(raw, meter);

            if (
                has8000 &&
                parsed &&
                parsed.chisokwh !== null &&
                parsed.chisokwh !== undefined &&
                parsed.chisokwh !== ""
            ) {
                finish("HAS_DATA");
                return;
            }

            resetIdleTimer();
        };

        const onError = err => {
            cleanup();
            reject(err);
        };

        client.on("data", onData);
        client.on("error", onError);

        client.write(command);
        resetIdleTimer();
    });
}

async function runWithConcurrency(items, limit, worker) {
    const results = new Array(items.length);
    let currentIndex = 0;

    async function runner() {
        while (true) {
            const index = currentIndex++;

            if (index >= items.length) break;

            try {
                results[index] = await worker(items[index], index);
            } catch (err) {
                results[index] = { error: err };
            }
        }
    }

    const workers = Array.from(
        { length: Math.min(limit, items.length) },
        () => runner()
    );

    await Promise.all(workers);

    return results;
}

async function retryWithBackoff(fn, options = {}) {
    const {
        retries = 2,
        delayMs = 800,
        factor = 2,
        shouldRetry = () => false
    } = options;

    let lastError;

    for (let attempt = 0; attempt <= retries; attempt++) {
        try {
            return await fn(attempt);
        } catch (err) {
            lastError = err;

            if (attempt >= retries || !shouldRetry(err)) {
                throw err;
            }

            const waitMs = delayMs * Math.pow(factor, attempt);
            await sleep(waitMs);
        }
    }

    throw lastError;
}

function isRetryableTcpError(err) {
    const msg = String(err?.message || "").toLowerCase();

    return (
        msg.includes("timeout") ||
        msg.includes("econnreset") ||
        msg.includes("etimedout") ||
        msg.includes("socket hang up") ||
        msg.includes("dcu đang bận") ||
        msg.includes("client chưa kết nối") ||
        msg.includes("không kết nối được comserver")
    );
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function buildReadMeterListCommand(imei) {
    return `CMD#${imei}#READDATA_DCU#33333333#07`;
}

function buildDocTucThoiCommand(imei, indexes = []) {
    const cleanIndexes = indexes
        .map(x => Number(x))
        .filter(x => Number.isInteger(x) && x >= 0);

    const zeroIndexes = cleanIndexes
        .map(x => x - 1)
        .filter(x => x >= 0);

    const count = pad2(zeroIndexes.length);
    const indexPart = zeroIndexes.map(x => `(${pad2(x)})`).join("");

    return `CMD#${imei}#DOCTUCTHOI#(${count})${indexPart}`;
}

function pad2(value) {
    return String(Number(value)).padStart(2, "0");
}

function parseMeterListResponse(raw) {
    if (!raw) return [];

    const text = String(raw)
        .replace(/\r/g, "")
        .replace(/\n/g, "");

    const result = [];
    const seenMeter = new Set();

    const matches = text.match(/\((\d{6,}:[^)]*)\)/g) || [];

    for (const item of matches) {
        const clean = item.replace(/[()]/g, "");
        const parts = clean.split(":");

        let socongto = parts[0];

        if (!socongto) continue;

        socongto = normalizeMeterNo(socongto);

        const compareKey = toComparableMeterNo(socongto);

        if (seenMeter.has(compareKey)) continue;

        seenMeter.add(compareKey);

        result.push({
            index: result.length + 1,
            socongto
        });
    }

    return result;
}

function contains8000(raw) {
    return String(raw || "").includes("8000");
}

function extractReadTime(raw) {
    if (!raw) return null;

    const text = String(raw);

    let m = text.match(/(20\d{12})/);

    if (m) {
        const s = m[1];

        const date = new Date(
            `${s.slice(0, 4)}-${s.slice(4, 6)}-${s.slice(6, 8)}T${s.slice(8, 10)}:${s.slice(10, 12)}:${s.slice(12, 14)}`
        );

        if (!Number.isNaN(date.getTime())) return date;
    }

    m = text.match(/(\d{2}\/\d{2}\/\d{4}\s+\d{2}:\d{2}:\d{2})/);

    if (m) {
        const [d, t] = m[1].split(/\s+/);
        const [dd, mm, yyyy] = d.split("/");
        const iso = `${yyyy}-${mm}-${dd}T${t}`;
        const date = new Date(iso);

        if (!Number.isNaN(date.getTime())) return date;
    }

    return null;
}
function parseHesInstantDirect(raw, meter) {

    if (!raw || !meter) return null;

    const text = String(raw);
    const meterKey = toComparableMeterNo(meter.socongto);

    const meterIndex = text.indexOf(meterKey);

    if (meterIndex < 0) {
        console.log("Không tìm thấy số công tơ:", meterKey);
        return null;
    }

    const fromMeterText = text.substring(meterIndex);

    const endIndex = fromMeterText.indexOf("(TSVH_KT)");
    const block = endIndex >= 0
        ? fromMeterText.substring(0, endIndex + "(TSVH_KT)".length)
        : fromMeterText;


    // Lấy thời gian đọc: (13)(002228990125)(PSMAS80)(260508113812)
    const timeMatch = block.match(/\(\d+\)\(\d+\)\([^)]*\)\((\d{12})\)/);
    const rawTime = timeMatch ? timeMatch[1] : null;

    // Lấy chỉ số OBIS 1.8.0
    const obis180Match = block.match(/\(1\.8\.0#(-?\d+(?:\.\d+)?)\*?[^)]*\)/i);

    if (!obis180Match) {
        console.log("Không tìm thấy OBIS 1.8.0");
        return null;
    }

    return {
        chisokwh: obis180Match[1],
        thoigiandoc: formatHesDateTime(rawTime) || formatDate(new Date()),
        data: {
            raw: block,
            obis: "1.8.0",
            raw_time: rawTime,
            raw_value: obis180Match[0]
        }
    };
}
function escapeRegExp(value) {
    return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function formatHesDateTime(value) {
    const s = String(value || "").trim();

    if (!/^\d{12}$/.test(s)) return null;

    const yy = Number(s.substring(0, 2));
    const mm = s.substring(2, 4);
    const dd = s.substring(4, 6);
    const hh = s.substring(6, 8);
    const mi = s.substring(8, 10);
    const ss = s.substring(10, 12);

    const yyyy = yy >= 70 ? 1900 + yy : 2000 + yy;

    return `${dd}/${mm}/${yyyy} ${hh}:${mi}:${ss}`;
}


function groupByImeiAndHost(list) {
    return list.reduce((acc, item) => {
        const key = `${item.imei}_${item.ip}_${item.port}`;

        if (!acc[key]) acc[key] = [];

        acc[key].push(item);

        return acc;
    }, {});
}

function normalizeMeterNo(value) {
    return String(value || "")
        .trim()
        .replace(/\s+/g, "")
        .toUpperCase();
}

function toComparableMeterNo(value) {
    return normalizeMeterNo(value).replace(/^0+/, "");
}

function formatDate(date = new Date()) {
    const d = new Date(date);

    if (Number.isNaN(d.getTime())) return null;

    const pad = n => String(n).padStart(2, "0");

    return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

function buildProgress(processed, total, success, error) {
    return {
        processed,
        total,
        success,
        error
    };
}

function buildErrorResult({
    meter,
    imei,
    status,
    commandReadList = null,
    rawReadList = null,
    commandDocTucThoi = null,
    rawDocTucThoi = null
}) {
    return {
        success: false,
        rowId: meter.rowId,
        imei,
        ip: meter.ip,
        port: meter.port,
        socongto: meter.socongto,
        madiemdo: meter.madiemdo,
        ten_khachhang: meter.ten_khachhang,
        status,
        chisokwh: null,
        thoigiandoc: null,
        command_read_list: commandReadList,
        raw_read_list: rawReadList,
        command_doctucthoi: commandDocTucThoi,
        raw_doctucthoi: rawDocTucThoi
    };
}

module.exports = { post };