const multer = require('multer');
const path = require('path')

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadsDir = path.join(__dirname, '../public/uploads')
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const filename = `${Date.now()}-${Math.round(Math.random() * 1E9)}${ext}`;
        cb(null, filename)
    }
});

//file filter
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true)
    } else {
        cb(new Error('Only .jpeg and .png format allowed'), false)
    }
}

// multer setup
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 1024 * 1024 * 7 } // 7MB
})

//store file url in db
const getFileUrl = (req, file) => {
    return `${req.protocol}://${req.get('host')}/uploads/${file.filename}`
}

module.exports = { upload, getFileUrl };