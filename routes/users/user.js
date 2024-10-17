const express = require("express");
const { registerCtrl, loginCtrl, fetchUserCtrl, updateUserCtrl, profileCtrl, profilePhotoCtrl, coverPhotoCtrl, updatePasswordCtrl, logoutCtrl } = require("../../controllers/users/Users");
const protected = require("../../middlewares/protected");
const multer = require("multer");
const storage = require("../../config/cloudinary");
const userRoutes = express.Router();

//Instance of multer
const upload = multer({ storage });

//Users routes
//---------------------
//Register user
userRoutes.post('/register', registerCtrl);

//Login user
userRoutes.post('/login', loginCtrl);

//Get user profile
userRoutes.get('/profile', protected, profileCtrl);

//Get user
userRoutes.get('/:id', fetchUserCtrl);

//Update user
userRoutes.put('/update/:id', updateUserCtrl);

//Upload user profile photo
userRoutes.put('/profile-photo/', protected, upload.single('profile-photo'), profilePhotoCtrl);

//Upload user cover photo
userRoutes.put('/cover-photo/',protected, upload.single('cover-photo'), coverPhotoCtrl);

//Update user password
userRoutes.put('/update-password/:id', updatePasswordCtrl);

//User logout
userRoutes.get('/logout', logoutCtrl);

module.exports = userRoutes;