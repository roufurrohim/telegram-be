const multer = require('multer')
const path = require('path')
const { errLogin } = require('../helpers/response');

const multerUpload = multer({
    storage: multer.diskStorage({
        destination: (req, res, cb) => {
            cb(null, './uploads')
        },
        filename: (req, file, cb) => {
            const ext = path.extname(file.originalname)
            cb(null, `${Math.round(Math.random() * 1E9)}${ext}`)
        }
    }),

    fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname)
        if (ext === '.jpg' || ext === '.png' || ext === '.svg') {
           cb(null, true) 
        } else {
            const error = {
                message: 'file type does not match',
            }
            cb(null, error)
        }
    },

    limits: {fileSize: 160 * 1000},
})

const upload = (req, res, next) => {
    const multerSIngle = multerUpload.single('image')
    multerSIngle(req, res, (err) => {
        if (err) {
            errLogin(res, err)
        } else {
            next()
        }
    })
}

module.exports = upload