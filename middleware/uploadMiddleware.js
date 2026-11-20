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

// File filter to allow only images
const fileFiltered = (req, file, cb) => {
  //|| file.mimetype.startsWith('image/png'
  console.log("why never called: "+file.mimetype);
  if (file.mimetype==='image/jpeg') {//valid image formats
    console.log("NO photo err format");
    cb(null, true);
  } else {//invalid image formats
    console.log("photo err format");
    //cb('Photo only jpg, png files are allowed!');//works
    //cb(null,false);//works
    cb(new Error("allowed file formats: jpg, png"));//works with imageuploaded in controller
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFiltered,
  limits: { fileSize: 2 * 1024 * 1024 } // 2MB limit
});

const imageUploaded = upload.single("photos");
  
module.exports={
  multer,
	imageUploaded,
};