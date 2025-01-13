const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'Upload');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname); 
    }
});


const upload2 = multer({
    storage: storage
});


module.exports = upload2;
