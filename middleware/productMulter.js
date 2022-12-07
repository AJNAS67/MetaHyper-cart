const multer = require('multer')

const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, './public/images/productImages/')
    },
    filename: function (req, file, callback) {
        const unique = file.originalname.substr(file.originalname.lastIndexOf('.'))
        callback(null, file.fieldname + '-' + Date.now() + unique)
    }
})
const store = multer({ storage: storage })


module.exports = store;
