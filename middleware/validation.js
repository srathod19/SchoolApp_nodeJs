const { check } = require('express-validator');

exports.signUpValidation = [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please enter a valid mail').isEmail(),
    check('password', 'password is required').isLength({ min: 6 }),
    check('image').custom((value, { req }) => {
        if (req.file.mimetype == 'image/jpeg' || req.file.mimetype == 'image/png') {
            return true;

        } else {
            return false;
        }
    }).withMessage('Please upload an image type of PNG, JPG')
]

exports.loginValidation = [
    check('email', 'Please enter a valid mail').isEmail(),
    check('password', 'password is required').isLength({ min: 6 }),
]
exports.createSchoolValidation = [
    check('name', 'Please enter a valid mail').not().isEmpty(),
    check('image').custom((value, { req }) => {
        if (req.file.mimetype == 'image/jpeg' || req.file.mimetype == 'image/png') {
            return true;

        } else {
            return false;
        }
    }).withMessage('Please upload an image type of PNG, JPG')
]

exports.classValidation = [
    check('name', 'Please enter a valid mail').not().isEmpty(),
]
exports.studentValidation = [
    check('name', 'Please enter a valid mail').not().isEmpty(),
    check('image').custom((value, { req }) => {
        if (req.file.mimetype == 'image/jpeg' || req.file.mimetype == 'image/png') {
            return true;

        } else {
            return false;
        }
    }).withMessage('Please upload an image type of PNG, JPG')
]
exports.assignValidation = [
    check('class_id', 'Please select the class').not().isEmpty(),
    check('student_id', 'Please select the student').not().isEmpty(),
]
exports.getClassmatesValidation = [
    check('student_id', 'Please select the student').not().isEmpty(),
]