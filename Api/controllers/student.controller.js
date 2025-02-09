// CRUD
require('dotenv').config()
const formidable = require('formidable')
const Student = require('../models/student.model.js')
const path = require('path')
const fs = require('fs')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const cloudinary = require('../utils/cloudinary.js');


module.exports = {


    registerStudent: async (req, res) => {
        try {
          const form = new formidable.IncomingForm();
          form.parse(req, async (err, fields, files) => {
            if (err) {
              return res.status(400).json({ success: false, message: 'Form parsing error', error: err });
            }
    
            const studentExists = await Student.findOne({ email: fields.email[0] });
            if (studentExists) {
              return res.status(409).json({ success: false, message: 'Email already registered' });
            }
    
            let imageUrl = null;
            if (files.image) {
              const photo = files.image[0];
              const uploadResult = await cloudinary.uploader.upload(photo.filepath, {
                folder: 'students',
                public_id: `${Date.now()}_${photo.originalFilename.replace(/ /g, '_')}`
              });
              imageUrl = uploadResult.secure_url;
            }
    
            const salt = bcrypt.genSaltSync(10);
            const hashPassword = bcrypt.hashSync(fields.password[0], salt);
    
            const newStudent = new Student({
              school: req.user.schoolId,
              name: fields.name[0],
              email: fields.email[0],
              student_class: fields.student_class[0],
              age: fields.age[0],
              gender: fields.gender[0],
              guardian: fields.guardian[0],
              guardian_phone: fields.guardian_phone[0],
              student_image: imageUrl, // Store Cloudinary image URL
              password: hashPassword
            });
    
            const savedStudent = await newStudent.save();
            res.status(200).json({ success: true, data: savedStudent, message: "Student registered successfully" });
          });
        } catch (error) {
          res.status(500).json({ success: false, message: 'Student registration failed', error });
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
            const student = await Student.findOne({_id:id,school:schoolId}).select(['-password']).populate('student_class');
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
                    student.password = bcrypt.hashSync(fields.password[0], salt);
                }
    
                // Update other fields
                if (fields.name) student.name = fields.name[0];
                if (fields.email) student.email = fields.email[0];
                if (fields.age) student.age = fields.age[0];
                if (fields.gender) student.gender = fields.gender[0];
                if (fields.guardian) student.guardian = fields.guardian[0];
                if (fields.guardian_phone) student.guardian_phone = fields.guardian_phone[0];
    
                // Handle image upload
                if (files.image) {
                    const photo = files.image[0];
    
                    // Delete old Cloudinary image if exists
                    if (student.student_image) {
                        const oldPublicId = student.student_image.split('/').pop().split('.')[0];
                        await cloudinary.uploader.destroy(`students/${oldPublicId}`);
                    }
    
                    // Upload new image to Cloudinary
                    const uploadResult = await cloudinary.uploader.upload(photo.filepath, {
                        folder: 'students',
                        public_id: `${Date.now()}_${photo.originalFilename.replace(/ /g, '_')}`
                    });
    
                    student.student_image = uploadResult.secure_url;
                }
    
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