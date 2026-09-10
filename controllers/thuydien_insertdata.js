
const multer = require('multer');
const path = require('path');
const fs = require('fs');
// Thiết lập multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../public/uploads'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    console.log('errerrerrerrerr:', file.fieldname);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));

  }
})

// Sử dụng multer để xử lý file
const upload = multer({ storage: storage }).single('file');// 'file' là tên trường file trong FormData

const post = async (req, res, next) => {
 // console.log('pótttt:', req);
  try {
    const text = 'This is the text to be written to the file.1111';
    const filename = 'myFile.txt';
    
    fs.writeFile(filename, text, (err) => {
      if (err) {
        console.error('Error writing file:', err);
      } else {
        console.log('File written successfully!');
      }
    });

    
  } catch (err) {
    console.log('errerrerrerrerr:', err);
  }
};


module.exports = { post };