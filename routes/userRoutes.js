const express = require('express');
const router = express.Router()
const { signUpValidation, loginValidation, createSchoolValidation, classValidation, studentValidation, assignValidation, getClassmatesValidation } = require('../middleware/validation')
const userController = require('../controllers/userController')
const auth = require('../middleware/auth');
const path = require('path');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../public/images'));

    },
    filename: function (req, file, cb) {
        const name = Date.now() + '-' + file.originalname;
        cb(null, name);
    }
});
// Checking the type of image 
const filefilter = (req, file, cb) => {
    (file.mimetype == 'image/jpeg' || file.mimetype == 'image/png') ? cb(null, true) : cb(null, false);

}
const upload = multer({
    storage: storage,
    fileFilter: filefilter
})

// Routers

// register
router.post('/register', upload.single('image'), signUpValidation, userController.register);
// login
router.post('/login', loginValidation, userController.login);
// creating a school
router.post('/createSchool', auth.isAuthorize, upload.single('image'), createSchoolValidation, userController.createSchool);
// Get my school
router.get('/getMySchool', auth.isAuthorize, userController.getMySchool);

// creating class
router.post('/createClass', auth.isAuthorize, classValidation, userController.createClass);
// get the list of class
router.get('/getClass', auth.isAuthorize, userController.getClass);
// Create student
router.post('/createStudent', auth.isAuthorize, upload.single('image'), studentValidation, userController.createStudent);
// Get student
router.get('/getStudent', auth.isAuthorize, userController.getStudent);
// Assign studentt to class
router.post('/assignStudent', auth.isAuthorize, assignValidation, userController.assignStudent)
// get classsmates
router.post('/getClassmates', auth.isAuthorize, getClassmatesValidation, userController.getClassmates)
// Get students who's part of all class
router.get('/partOfAllClass', auth.isAuthorize, userController.partOfAllClass);


module.exports = router;