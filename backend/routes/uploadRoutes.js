import path from 'path';
import express from 'express';
import multer from 'multer';
import fs from 'fs';
import { uploadOnCloudinary } from "../utils/cloudinary.js"; // Update the path as necessary

const router = express.Router();

// Use /tmp directory for uploads in a read-only file system environment
const uploadsDir = '/uploads';

// Ensure the 'uploads' directory exists
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}

const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, uploadsDir);
    },
    filename(req, file, cb) {
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    }
});

function checkFileType(file, cb) {
    const filetypes = /jpg|jpeg|png/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb(new Error('Images only!'));
    }
}

const upload = multer({
    storage,
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    }
});

router.post('/', (req, res) => {
    upload.single('image')(req, res, async (err) => {
        if (err instanceof multer.MulterError) {
            // A Multer error occurred when uploading.
            return res.status(400).json({ message: err.message });
        } else if (err) {
            // An unknown error occurred when uploading.
            return res.status(400).json({ message: err.message });
        }

        // Everything went fine.
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded or invalid file type' });
        }

        try {
            const cloudinaryResponse = await uploadOnCloudinary(req.file.path);

            if (cloudinaryResponse) {
                res.send({
                    message: 'Image uploaded successfully',
                    image: cloudinaryResponse.url,
                });
            } else {
                res.status(500).json({ message: 'Failed to upload image to Cloudinary' });
            }
        } catch (uploadErr) {
            res.status(500).json({ message: 'An error occurred while uploading the image' });
        }
    });
});

export default router;
