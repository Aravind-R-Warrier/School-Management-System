// CRUD
require('dotenv').config()
const formidable = require('formidable')
const Student = require('../models/student.model.js')
const path = require('path')
const fs = require('fs')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


module.exports = {


    registerStudent: async (req, res) => {
        try {
            const form = new formidable.IncomingForm()
            form.parse(req, async (err, fields, files) => {
                const student = await Student.findOne({ email: fields.email[0] });
                if (student) {
                    return res.status(409).json({ success: false, message: 'email already registered' })
                } else {


                    const photo = files.image[0]
                    let filePath = photo.filepath;
                    let originalFileName = photo.originalFilename.replace(" ", "_")
                    let newPath = path.join(__dirname, process.env.STUDENT_IMAGE_PATH, originalFileName)
                    let photoData = fs.readFileSync(filePath)

                    fs.writeFileSync(newPath, photoData)

                    const salt = bcrypt.genSaltSync(10)
                    const hashPassword = bcrypt.hashSync(fields.password[0], salt)

                    const newStudent = new Student({
                        school:req.user.schoolId,
                            name:fields.name[0],
                            email:fields.email[0],
                            student_class:fields.student_class[0],
                            age:fields.age[0],
                            gender:fields.gender[0],
                            guardian:fields.guardian[0],
                            guardian_phone:fields.guardian_phone[0],
                            student_image:originalFileName,
                            password:hashPassword,


                    })
                    const savedStudent = await newStudent.save()
                    res.status(200).json({ success: true, data: savedStudent, message: "student is registerd successFully" })
                }
            })
        } catch (error) {
            res.status(500).json({ success: false, message: 'student reg failed', error })
        }

    },



    loginStudent: async (req, res) => {

        try {
            const student = await Student.findOne({ email: req.body.email })

            if (student) {
                const isAuth = bcrypt.compareSync(req.body.password, student.password);
                if (isAuth) {

                    const token = jwt.sign({
                        id: student._id,
                        schoolId: student.school,
                        name: student.name,
                        image_url: student.student_image,
                        role: "STUDENT"
                    }, process.env.JWT_SECRET)
                    res.header("Autharisation", token)
                    res.status(200).json({
                        success: true, message: "login successfull",
                         user: {
                            id: student._id,
                            schoolId:student.school,
                            name: student.name,
                            image_url: student.student_image,
                            role: "STUDENT"
                        }
                    })
                } else {
                    res.status(401).json({ success: false, message: 'password is incorrect' })

                }
            } else {
                res.status(401).json({ success: false, message: 'email not registered' })
            }
        } catch (error) {
            res.status(500).json({ success: false, message: 'internal server error student login', error })
        }

    },


    getStudentOwnData: async (req, res) => {
        try {
            const id=req.user.id
            const schoolId=req.user.schoolId
            const student = await Student.findOne({_id:id,school:schoolId}).select(['-password']);
            res.status(200).json({ success: true, message: 'success fetching student', student })
            if(!student){
                res.status(404).json({success:false,message:'student not found'})
            }
        } catch (error) {
            res.status(500).json({ success: false, message: 'internal server error student finding', error })
        }
    },
    getStudentWithId: async (req, res) => {
        try {
            const id=req.params.id
            const schoolId=req.user.schoolId
            const student = await Student.findOne({_id:id,school:schoolId}).select(['-password']);
            res.status(200).json({ success: true, message: 'success fetching student', student })
            if(!student){
                res.status(404).json({success:false,message:'student not found'})
            }
        } catch (error) {
            res.status(500).json({ success: false, message: 'internal server error student finding', error })
        }
    },

    getStudentsWithQuery: async (req, res) => {
        try {
            const filterQuery = {};
            const schoolId = req.user.schoolId;
            filterQuery['school'] = schoolId;
    
            // Check if 'search' exists and is not empty
            if (req.query.search && req.query.search.trim() !== '') {
                filterQuery['name'] = { $regex: req.query.search, $options: 'i' };
            }
    
            // Check if 'student_class' is provided
            if (req.query.student_class && req.query.student_class.trim() !== '') {
                filterQuery['student_class'] = req.query.student_class;
            }
    
            const students = await Student.find(filterQuery)
                .populate('student_class')
                .select('-password');
    
            if (students.length > 0) {
                res.status(200).json({ success: true, message: 'Students retrieved successfully', students });
            } else {
                res.status(404).json({ success: false, message: 'No students found' });
            }
        } catch (error) {
            res.status(500).json({ success: false, message: 'Internal server error', error });
        }
    }
    ,

    updateStudent: async (req, res) => {
        try {
            const id = req.params.id;
            const schoolId = req.user.schoolId;
            const form = new formidable.IncomingForm();
    
            form.parse(req, async (err, fields, files) => {
                if (err) {
                    return res.status(400).json({ success: false, message: 'Form parsing error', error: err });
                }
    
                const student = await Student.findOne({ _id: id, school: schoolId });
                if (!student) {
                    return res.status(404).json({ success: false, message: 'Student not found' });
                }
    
                // Handle password update
                if (fields.password) {
                    const salt = bcrypt.genSaltSync(10);
                    const hashPassword = bcrypt.hashSync(fields.password[0], salt);
                    student.password = hashPassword;
                }
    
                // Update other fields (name, email, age, gender, guardian, etc.)
                if (fields.name) {
                    student.name = fields.name[0];
                }
                if (fields.email) {
                    student.email = fields.email[0];
                }
                if (fields.age) {
                    student.age = fields.age[0];
                }
                if (fields.gender) {
                    student.gender = fields.gender[0];
                }
                if (fields.guardian) {
                    student.guardian = fields.guardian[0];
                }
                if (fields.guardian_phone) {
                    student.guardian_phone = fields.guardian_phone[0];
                }
    
                // Handle image upload
                if (files.image) {
                    const photo = files.image[0];
                    const filePath = photo.filepath;
                    const uniqueFileName = `${Date.now()}_${photo.originalFilename.replace(/ /g, '_')}`;
    
                    // Delete old image if exists
                    if (student.student_image) {
                        const oldImagePath = path.join(__dirname, process.env.STUDENT_IMAGE_PATH, student.student_image);
                        if (fs.existsSync(oldImagePath)) {
                            fs.unlinkSync(oldImagePath);
                        }
                    }
    
                    // Save the new image
                    const newPath = path.join(__dirname, process.env.STUDENT_IMAGE_PATH, uniqueFileName);
                    const photoData = fs.readFileSync(filePath);
                    fs.writeFileSync(newPath, photoData);
    
                    student.student_image = uniqueFileName; // Update the student image field
                }
    
                // Save the student with updated data
                await student.save();
    
                res.status(200).json({ success: true, message: 'Student updated successfully', student });
            });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Student update failed', error });
        }
    }
    ,


  deleteStudentWithId: async (req, res) => {
    try {
        const id = req.params.id;
        const schoolId = req.user.schoolId;
        
       
        await Student.findByIdAndDelete({ _id: id, school: schoolId });

        // Fetch updated list of students after deletion
        const students = await Student.find({ school: schoolId });

        res.status(200).json({ success: true, message: 'Student deleted', students });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: 'Student delete failed', error });
    }
}

}