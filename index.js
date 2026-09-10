const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const webServer = require('./services/web-server.js');
const database = require('./services/database.js');

let shutdownInProgress = false;

function writeCrashLog(type, error) {
    try {
        const now = new Date();
        const logDirectory = path.join(__dirname, 'logs');
        const logFile = path.join(
            logDirectory,
            `app-crash-${now.toISOString().slice(0, 10)}.log`
        );
        const detail = error && error.stack ? error.stack : String(error);
        fs.mkdirSync(logDirectory, { recursive: true });
        fs.appendFileSync(
            logFile,
            `[${now.toISOString()}] ${type}\n${detail}\n\n`,
            'utf8'
        );
    } catch (logError) {
        console.error('Không thể ghi crash log:', logError);
    }
}

async function startup() {
    console.log('===================================');
    console.log('Starting application...');
    console.log('===================================');

    process.title = 'BDS_V1.2';

    try {
        console.log('Connecting PostgreSQL...');

        await database.initialize();

        console.log('✅ PostgreSQL connected');
    } catch (err) {
        console.error('❌ PostgreSQL connection failed');
        console.error(err);
        process.exit(1);
    }

    try {
        console.log('Starting Web Server...');

        await webServer.initialize();

        console.log('✅ Web Server started');
    } catch (err) {
        console.error('❌ Web Server failed');
        console.error(err);

        await database.close().catch(() => {});

        process.exit(1);
    }
}

startup();

async function shutdown(err) {
    if (shutdownInProgress) return;
    shutdownInProgress = true;

    console.log('\n===================================');
    console.log('Stopping application...');
    console.log('===================================');

    try {
        console.log('Closing Web Server...');
        await webServer.close();
    } catch (e) {
        console.error(e);
    }

    try {
        console.log('Closing PostgreSQL...');
        await database.close();
    } catch (e) {
        console.error(e);
    }

    console.log('Application stopped.');

    process.exit(err ? 1 : 0);
}

process.on('SIGINT', () => {
    console.log('\nReceived SIGINT');
    shutdown();
});

process.on('SIGTERM', () => {
    console.log('\nReceived SIGTERM');
    shutdown();
});

process.on('uncaughtException', async (err) => {
    console.error('Uncaught Exception');
    console.error(err);
    writeCrashLog('Uncaught Exception', err);
    await shutdown(err);
});

process.on('unhandledRejection', async (reason) => {
    console.error('Unhandled Promise Rejection');
    console.error(reason);
    writeCrashLog('Unhandled Promise Rejection', reason);
    await shutdown(reason);
});
