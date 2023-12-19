const { validationResult } = require('express-validator')
const bcrypt = require('bcryptjs')
const db = require('../config/database');
const randomString = require('randomstring');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;

const register = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).send({ errors: errors.array() })
    }

    db.query(`SELECT * FROM tbl_users WHERE LOWER(email) = LOWER('${req.body.email}')`, function (err, result) {

        if (result && result.length) {
            return res.status(409).send({ message: "this user is already in use" })
        } else {
            bcrypt.hash(req.body.password, 10, (err, hash) => {
                if (err) {
                    return res.status(500).send({ message: err })
                } else {
                    db.query(`INSERT INTO tbl_users(name,email,password,photo) VALUES('${req.body.name}','${req.body.email}',${db.escape(hash)},'images/${req.file.filename}')`, function (err, result) {
                        // console.log(this.sql);
                        if (err) {
                            return res.status(500).send({ message: err })
                        }
                        const parentCode = randomString.generate(7);
                        const teacherCode = randomString.generate(7);
                        db.query(`UPDATE tbl_users SET parent_invite_code=?, teacher_invite_code=? where email = ? `, [parentCode, teacherCode, req.body.email], function (err, result) {
                            // console.log(this.sql);
                            if (err) {
                                return res.status(500).send({ message: err })
                            }
                        })
                        return res.status(400).send({ message: 'The usee has been registered with us!' })
                    })
                }
            })
        }


    })

}
const login = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).send({ errors: errors.array() })
    }
    db.query(`SELECT * FROM tbl_users WHERE email = '${req.body.email}';`, function (err, result) {
        if (err) {
            return res.status(400).send({
                msg: err
            })
        }
        if (!result.length) {
            return res.status(401).send({
                msg: 'Email or password is incorrect'
            })
        }
        bcrypt.compare(req.body.password, result[0].password, (bErr, bResult) => {
            if (bErr) {
                return res.status(400).send({
                    msg: err
                })
            }
            if (bResult) {
                // console.log(JWT_SECRET);
                const token = jwt.sign({ user_id: result[0].user_id, is_admin: result[0] }, JWT_SECRET, { expiresIn: '1h' })
                db.query(`UPDATE tbl_users SET last_login = now() WHERE  user_id = '${result[0].user_id}'`)
                return res.status(200).send({
                    msg: 'Logged in',
                    token,
                    user: result[0]
                })
            }
            return res.status(401).send({
                msg: 'Email or password is incorrect'
            })
        });


    })

}
const createSchool = (req, res) => {
    const authToken = req.headers.authorization.split(' ')[1];
    const decode = jwt.verify(authToken, JWT_SECRET);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).send({ errors: errors.array() })
    }
    db.query(`INSERT INTO tbl_school (user_id,name,image) VALUES('${decode.user_id}','${req.body.name}', 'images/${req.file.filename}')`, function (err, result) {
        if (err) {
            return res.status(400).send({
                msg: err
            })
        }

        if (result.insertId) {
            return res.status(400).send({
                msg: 'School has been created successfully!'
            })
        }
    })
}
const getMySchool = (req, res) => {
    db.query(`SELECT ts.name as school_name,tu.name as user_name,tr.role FROM tbl_roles tr
        JOIN tbl_school ts
        ON tr.school_id = ts.school_id
        JOIN tbl_users tu
        ON tr.user_id = tu.user_id `, function (err, result) {
        if (err) {
            return res.status(400).send({
                msg: err
            })
        }

        if (result) {
            return res.status(200).send({
                data: result
            })
        } else {
            return res.status(200).send({
                msg: "No result found"
            })
        }

    })
}
const createClass = (req, res) => {
    const authToken = req.headers.authorization.split(' ')[1];
    const decode = jwt.verify(authToken, JWT_SECRET);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).send({ errors: errors.array() })
    }
    db.query(`INSERT INTO tbl_class (name) VALUES('${req.body.name}')`, function (err, result) {
        if (err) {
            return res.status(400).send({
                msg: err
            })
        }

        if (result.insertId) {
            return res.status(400).send({
                msg: 'Claas has been created successfully!'
            })
        }
    })
}
const getClass = (req, res) => {
    db.query(`SELECT * FROM tbl_class`, function (err, result) {
        if (err) {
            return res.status(400).send({
                msg: err
            })
        }

        if (result) {
            return res.status(400).send({
                data: result
            })
        }
    })
}
const createStudent = (req, res) => {
    const authToken = req.headers.authorization.split(' ')[1];
    const decode = jwt.verify(authToken, JWT_SECRET);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).send({ errors: errors.array() })
    }
    db.query(`INSERT INTO tbl_student (name,image) VALUES('${req.body.name}','${req.file.filename}')`, function (err, result) {
        if (err) {
            return res.status(400).send({
                msg: err
            })
        }

        if (result.insertId) {
            return res.status(400).send({
                msg: 'Student has been created successfully!'
            })
        }
    })
}
const getStudent = (req, res) => {
    db.query(`SELECT * FROM tbl_student`, function (err, result) {
        if (err) {
            return res.status(400).send({
                msg: err
            })
        }

        if (result) {
            return res.status(400).send({
                data: result
            })
        }
    })
}
const assignStudent = (req, res) => {
    const authToken = req.headers.authorization.split(' ')[1];
    const decode = jwt.verify(authToken, JWT_SECRET);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).send({ errors: errors.array() })
    }
    db.query(`SELECT * FROM tbl_assign_student where class_id = '${req.body.class_id}' AND student_id='${req.body.student_id}'`, function (err, result) {

        if (result.length) {
            return res.status(400).send({
                msg: 'This student has already been assigned to this class'
            })
        } else {
            db.query(`INSERT INTO tbl_assign_student(student_id,class_id) VALUES('${req.body.student_id}','${req.body.class_id}')`, function (err1, result1) {
                if (err1) {
                    return res.status(400).send({
                        msg: err
                    })
                }

                if (result1.insertId) {
                    return res.status(400).send({
                        msg: 'Student has been assigned successfully'
                    })
                }
            })
        }

    })
}
const getClassmates = (req, res) => {
    const authToken = req.headers.authorization.split(' ')[1];
    const decode = jwt.verify(authToken, JWT_SECRET);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).send({ errors: errors.array() })
    }
    db.query(`SELECT tas.student_id, ts.name from tbl_assign_student tas
            JOIN tbl_student ts
            ON tas.student_id = ts.student_id
            WHERE tas.student_id NOT IN(1) 
            AND class_id IN (SELECT class_id FROM tbl_assign_student
             WHERE student_id = '${req.body.student_id}') GROUP BY tas.student_id`, function (err, result) {

        if (err) {
            return res.status(400).send({
                msg: err
            })
        }
        if (result.length > 0) {
            return res.status(200).send({
                data: result
            })
        }
    })
}
const partOfAllClass = (req, res) => {
    const authToken = req.headers.authorization.split(' ')[1];
    const decode = jwt.verify(authToken, JWT_SECRET);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).send({ errors: errors.array() })
    }
    db.query(`SELECT tas.student_id,ts.name FROM tbl_assign_student tas
    JOIN tbl_student ts
    ON tas.student_id = ts.student_id 
    GROUP BY tas.student_id
    HAVING COUNT(tas.student_id)=(SELECT COUNT(class_id) FROM tbl_class)`, function (err, result) {

        if (err) {
            return res.status(400).send({
                msg: err
            })
        }
        if (result.length > 0) {
            return res.status(200).send({
                msg: "These students are part of all classes",
                data: result
            })
        } else {
            return res.status(200).send({
                msg: "No students are part of all classes"
            })
        }
    })
}


module.exports = {
    register,
    login,
    createSchool,
    getMySchool,
    createClass,
    getClass,
    createStudent,
    getStudent,
    assignStudent,
    getClassmates,
    partOfAllClass
}