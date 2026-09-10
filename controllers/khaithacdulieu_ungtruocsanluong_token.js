const axios = require('axios');

exports.getData = async (req, res) => {
    try {
        // const { msno, amount, username, password } = req.params;
        msno = req.body.v_socongto;
        username = 'admin';
        password = 'b4d1541229d2dbc7a9afe6c5096a2bb9d9261967';
        amount = req.body.v_sanluong;
        const url = `http://117.2.142.41:8282/vending?msno=${msno}&amount=${amount}&username=${username}&password=${password}`;

        if (!msno || !amount) {
            return res.status(400).json({ error: 'Thiếu tham số đầu vào' });
        }
        const response = await axios.post(url);
        res.json(response.data);


    } catch (error) {
        console.log('Lỗi khi gọi API:', error.message);
        res.status(500).json({ error: 'Lỗi khi lấy dữ liệu' });
    }
};
