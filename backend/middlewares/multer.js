
const path = require('path');
const multer = require('multer');
const fs = require('fs');
const jwt = require('jsonwebtoken');

// Ensure the uploads directory exists





const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    console.log(`Creating uploads directory at: ${uploadDir}`);
    fs.mkdirSync(uploadDir, { recursive: true });
} else {
    console.log(`Uploads directory already exists at: ${uploadDir}`);
}

if (!fs.existsSync(uploadDir)) {
  console.log(`Creating uploads directory at: ${uploadDir}`);
  fs.mkdirSync(uploadDir, { recursive: true });
} else {
  console.log(`Uploads directory already exists at: ${uploadDir}`);
}

// const storage = multer.diskStorage({
//   destination: function (req, file, callback) {
//       const destinationPath = path.join(__dirname, 'uploads');
//       console.log(`Destination path: ${destinationPath}`);
//       callback(null, destinationPath);
//   },
//   filename: function (req, file, callback) {
//       console.log(`Saving file: ${file.originalname}`);
//       callback(null, file.originalname);
//   },
// });



const storage = multer.diskStorage({
  destination: (req, file, cb) => {
      const uploadPath = path.join(__dirname, './uploads');
      if (!fs.existsSync(uploadPath)) {
          fs.mkdirSync(uploadPath, { recursive: true });
      }
      cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const fileName = `${uniqueSuffix}${path.extname(file.originalname)}`;
      console.log('Generated filename:', fileName);
      cb(null, fileName);
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


const upload = multer({
   storage,
   
   
   });


module.exports = upload;


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
    uploadFiles: upload.array('uploadedFiles',15), // Expect the field name to be "uploadedFiles"
};
