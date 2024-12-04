// const multer = require('multer')

// const storage=multer.diskStorage({
//     filename:function(req,file,callback){
//         callback(null,file.originalname)
//     }
// })

// const upload = multer({storage})

// module.exports=upload
const path = require('path');
const multer = require('multer');
const fs = require('fs');
const uploadDir = path.join(__dirname, 'uploads');
const jwt = require('jsonwebtoken');

// Ensure the uploads directory exists
if (!fs.existsSync(uploadDir)) {
    console.log(`Creating uploads directory at: ${uploadDir}`);
    fs.mkdirSync(uploadDir, { recursive: true });
} else {
    console.log(`Uploads directory already exists at: ${uploadDir}`);
}

const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        const destinationPath = path.join(__dirname, 'uploads');
        console.log(`Destination path: ${destinationPath}`);
        callback(null, destinationPath);
    },
    filename: function (req, file, callback) {
        console.log(`Saving file: ${file.originalname}`);
        callback(null, file.originalname);
    },
});

const upload = multer({ storage });



// token verification

const verifyToken = (req, res, next) => {
    
    const token = req.headers['authorization']?.split(' ')[1]; // Extract token from the "Authorization" header

    if (!token) {
        return res.status(401).json({ success: false, message: 'Access Denied. No token provided.' });
    }
    
    try {
        
        const decoded = jwt.verify(token, process.env.SECRET_KEY); // Verify the token

        console.log("decoded:",decoded)
        req.user = decoded; // Add the decoded user information to the request object
       
        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        console.error('Token verification error:', error.message);
        return res.status(403).json({ success: false, message: 'Invalid or expired token.' });
    }
};




module.exports = {
    verifyToken,
    uploadFiles: upload.array('uploadedFiles'), // Expect the field name to be "uploadedFiles"
};
