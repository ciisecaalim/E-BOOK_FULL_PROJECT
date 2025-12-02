const multer = require("multer")


const storeImg = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "document")
    },

    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
})


const uploadImage = multer({
    storage : storeImg
})

module.exports = uploadImage