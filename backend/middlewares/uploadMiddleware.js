const multer = require("multer");

// memoryStorage keeps each file in RAM just long enough to forward it to
// Cloudinary. Nothing is written to this server's disk, which matters on
// shared hosting where the filesystem is small and wiped on restart.
const storage = multer.memoryStorage();

const IMAGE_TYPES = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
    "image/gif"
];

const DOCUMENT_TYPES = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
];

// multer calls this per file. Rejecting here means the controller never sees
// a file type it cannot handle, and the error surfaces as a clean 400.
const fileFilter = (req, file, cb) => {
    if (file.fieldname === "images") {
        if (IMAGE_TYPES.includes(file.mimetype)) return cb(null, true);
        return cb(new Error("Only JPG, PNG, WEBP or GIF images are allowed"));
    }

    if (file.fieldname === "documents") {
        if (DOCUMENT_TYPES.includes(file.mimetype)) return cb(null, true);
        return cb(new Error("Only PDF or Word documents are allowed"));
    }

    // Any other field (e.g. the category image) keeps the old behaviour.
    return cb(null, true);
};

const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024
    }
});

module.exports = upload;