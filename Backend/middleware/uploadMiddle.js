const multer = require('multer')
const path = require('path')

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, 'uploads/');
    },
    filename: function(req, file, cb){
        const uniqueName = Date.now() + '-' + Math.round(Math.random() *1E9);
        cb(null, uniqueName + path.extname(file.originalname));
    }
});


const fileFilter = (req, file, cb) => {
    const allowed = /jpeg|jpg|png/;
    const extname = allowed.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowed.test(file.mimetype);
    if (extname && mimetype) {
        cb(null, true);
    }else{
        cb(new Error('Only image files are allowed!'))
    }
};

const uploads = multer({
    storage,
    fileFilter
});

module.exports = uploads;