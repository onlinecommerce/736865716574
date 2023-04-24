const multer = require('multer');

const fileFilter = (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
    if (!allowedTypes.includes(file.mimetype)) {
        const error = new Error("Incorrect file");
        error.code = "INCORRECT_FILETYPE"
        return cb(error, false)
    }
    cb(null, true)
}
const upload = multer({
    dest: './storage',
    fileFilter,
    limits: {
        fileSize: 3000000
    }
});
module.exports = upload;