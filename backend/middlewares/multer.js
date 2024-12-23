const path = require('path');
const multer = require('multer');
const fs = require('fs');
const jwt = require('jsonwebtoken');

// Define the upload directory on EC2
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    console.log(`Creating uploads directory at: ${uploadDir}`);
    fs.mkdirSync(uploadDir, { recursive: true });
} else {
    console.log(`Uploads directory already exists at: ${uploadDir}`);
}

// Configure Multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir); // Save files to the defined directory
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`);
    },
});

// File filter for allowed types
const fileFilter = (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "application/pdf", "video/mp4"];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Invalid file type. Only images, PDFs, and videos are allowed."));
    }
};

// Multer upload configuration with limits
const upload = multer({
    storage,
    limits: { fileSize: 50 * 1024 * 1024 }, // Limit each file to 50MB
    fileFilter,
});

// Token verification middleware
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]; // Extract token from the "Authorization" header

    if (!token) {
        return res.status(401).json({ success: false, message: 'Access Denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY); // Verify the token
        req.user = decoded; // Add the decoded user information to the request object
        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        console.error('Token verification error:', error.message);
        return res.status(403).json({ success: false, message: 'Invalid or expired token.' });
    }
};

// Export the configured upload and middleware
module.exports = {
    verifyToken,
    uploadFiles: upload.array('uploadedFiles', 15), // Expect the field name to be "uploadedFiles"
};
