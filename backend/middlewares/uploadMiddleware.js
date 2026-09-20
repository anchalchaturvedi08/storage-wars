const multer = require("multer");

const storage = multer.memoryStorage();

const upload = multer({
    storage,
    limits: {
        fileSize: 10 * 1024 * 1024
    }
});

module.exports = upload;

/* 
multer.memoryStorage(): Image ko temporarily RAM/memory mein rakhega, kisi local folder mein permanently save nahi karega.

fileSize: 10 * 1024 * 1024: Ek image maximum 10 MB ki allow hogi.

Seller selects image
        ↓
Multer
        ↓
req.file / req.files
        ↓
Cloudinary
*/