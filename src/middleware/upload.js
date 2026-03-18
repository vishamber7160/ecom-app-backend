import multer from "multer";
import fs from "fs"

const foldername = "uploads"

if(!fs.existsSync(foldername)){
    fs.mkdirSync(foldername)
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix + '-' + file.originalname)
    }
})

const allowedTypes = [
  "image/jpeg",
  "image/png",
  "image/jpg",
  "image/webp"
]
const fileFilter = (req, file, cb) => {
    if (allowedTypes.includes(file.mimetype)){
        cb(null, true)
    } else {
        cb(new Error('Only JPEG and PNG files are allowed!'), false)
    }
}

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize:200 * 1024 * 1024
  }
});
export default upload;