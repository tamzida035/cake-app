//process multi-part forms
const multer = require("multer");
// Configure multer for file storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/images/personal_recipes'); /// Ensure the 'original-image' directory exists.The destination function specifies the directory where the uploaded files will be saved. In this example, we set it to **'uploads/'**, which means the files will be stored in a folder named "uploads" in the root directory of your project. 

  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    //cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    cb(null,  uniqueSuffix + '-' + file.originalname);
    //cb(null, uniqueSuffix +'-' +'recipe');
  }
});

const upload = multer({ storage: storage });
/*const upload = multer({ dest: "../public/images/",limits:{
    fileSize: 200000// 10 MB-> change it to 2 MB
  }, });*/

//not needed file
const imageUploaded = upload.single("photos");
  
module.exports={
	imageUploaded,
};