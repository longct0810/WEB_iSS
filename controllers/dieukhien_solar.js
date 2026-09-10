const WebSocket = require('ws');

const post = async (req, res, next) => {
    const { v_ip, v_port, v_ioa, v_value } = req.body;

    const command = {
        type: "DIEUKHIEN",
        Data: [
            [v_ip, v_port, v_ioa, v_value]
        ]
    };

    try {
        const socket = new WebSocket('wss://smartgrid.ifc.com.vn:6332/');

        socket.on('open', function open() {
            console.log('Đã kết nối WebSocket, gửi lệnh:', command);
            socket.send(JSON.stringify(command));
        });

        socket.on('message', function incoming(data) {
            console.log('Phản hồi từ server:', data.toString());
            res.status(200).json({ message: 'Lệnh đã gửi thành công', response: data.toString() });
            socket.close(); // Đóng kết nối sau khi nhận xong phản hồi
        });

        socket.on('error', function error(err) {
            console.error('WebSocket Error:', err);
            res.status(500).json({ error: 'Lỗi kết nối WebSocket', details: err.message });
        });

        socket.on('close', function close() {
            console.log('Kết nối WebSocket đã đóng.');
        });
    } catch (err) {
        next(err);
    }
};

module.exports = { post };