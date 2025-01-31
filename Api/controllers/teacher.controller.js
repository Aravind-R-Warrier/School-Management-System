// CRUD
require('dotenv').config()
const formidable = require('formidable')
const Teacher = require('../models/teacher.model.js')
const path = require('path')
const fs = require('fs')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


module.exports = {


    registerTeacher: async (req, res) => {
        try {
            const form = new formidable.IncomingForm()
            form.parse(req, async (err, fields, files) => {
                const teacher = await Teacher.findOne({ email: fields.email[0] });
                if (teacher) {
                    return res.status(409).json({ success: false, message: 'email already registered' })
                } else {


                    const photo = files.image[0]
                    let filePath = photo.filepath;
                    let originalFileName = photo.originalFilename.replace(" ", "_")
                    let newPath = path.join(__dirname, process.env.TEACHER_IMAGE_PATH, originalFileName)
                    let photoData = fs.readFileSync(filePath)

                    fs.writeFileSync(newPath, photoData)

                    const salt = bcrypt.genSaltSync(10)
                    const hashPassword = bcrypt.hashSync(fields.password[0], salt)

                    const newTeacher = new Teacher({
                        school:req.user.schoolId,
                            name:fields.name[0],
                            email:fields.email[0],
                            age:fields.age[0],
                            gender:fields.gender[0],
                            qualification:fields.qualification[0],
                            teacher_image:originalFileName,
                            password:hashPassword,
                               
                               

                    })
                    const savedTeacher = await newTeacher.save()
                    res.status(200).json({ success: true, data: savedTeacher, message: "teacher is registerd successFully" })
                }
            })
        } catch (error) {
            res.status(500).json({ success: false, message: 'teacher reg failed', error })
        }

    },



    loginTeacher: async (req, res) => {

        try {
            const teacher = await Teacher.findOne({ email: req.body.email })

            if (teacher) {
                const isAuth = bcrypt.compareSync(req.body.password, teacher.password);
                if (isAuth) {

                    const token = jwt.sign({
                        id: teacher._id,
                        schoolId: teacher.school,
                        name: teacher.name,
                        image_url: teacher.teacher_image,
                        role: "TEACHER"
                    }, process.env.JWT_SECRET)
                    res.header("Autharisation", token)
                    res.status(200).json({
                        success: true, message: "login successfull",
                         user: {
                            id: teacher._id,
                            schoolId:teacher.school,
                            teacher_name: teacher.name,
                            image_url: teacher.teacher_image,
                            role: "TEACHER"
                        }
                    })
                } else {
                    res.status(401).json({ success: false, message: 'password is incorrect' })

                }
            } else {
                res.status(401).json({ success: false, message: 'email not registered' })
            }
        } catch (error) {
            res.status(500).json({ success: false, message: 'internal server error teacher login', error })
        }

    },


    getTeacherOwnData: async (req, res) => {
        try {
            const id=req.user.id
            const schoolId=req.user.schoolId
            const teacher = await Teacher.findOne({_id:id,school:schoolId}).select(['-password']);
            res.status(200).json({ success: true, message: 'success fetching teacher', teacher })
            if(!teacher){
                res.status(404).json({success:false,message:'teacher not found'})
            }
        } catch (error) {
            res.status(500).json({ success: false, message: 'internal server error teacher finding', error })
        }
    },
    getTeacherWithId: async (req, res) => {
        try {
            const id=req.params.id
            const schoolId=req.user.schoolId
            const teacher = await Teacher.findOne({_id:id,school:schoolId}).select(['-password']);
            res.status(200).json({ success: true, message: 'success fetching teacher', teacher })
            if(!teacher){
                res.status(404).json({success:false,message:'teacher not found'})
            }
        } catch (error) {
            res.status(500).json({ success: false, message: 'internal server error teacher finding', error })
        }
    },

    getTeacherWithQuery: async (req, res) => {
        try {
            const filterQuery = {};
            const schoolId = req.user.schoolId;
            filterQuery['school'] = schoolId;
    
            // Check if 'search' exists and is not empty
            if (req.query.search && req.query.search.trim() !== '') {
                filterQuery['name'] = { $regex: req.query.search, $options: 'i' };
            }
    
          
    
            const teachers = await Teacher.find(filterQuery).select('-password');
    
            if (teachers.length > 0) {
                res.status(200).json({ success: true, message: 'Teacher retrieved successfully', teachers });
            } else {
                res.status(404).json({ success: false, message: 'No teachers found' });
            }
        } catch (error) {
            res.status(500).json({ success: false, message: 'Internal server error', error });
        }
    }
    ,

    updateTeacher: async (req, res) => {
        try {
            const id = req.params.id;
            const schoolId = req.user.schoolId;
            const form = new formidable.IncomingForm();
    
            form.parse(req, async (err, fields, files) => {
                if (err) {
                    return res.status(400).json({ success: false, message: 'Form parsing error', error: err });
                }
    
                const teacher = await Teacher.findOne({ _id: id, school: schoolId });
                if (!teacher) {
                    return res.status(404).json({ success: false, message: 'Teacher not found' });
                }
    
                // Handle password update
                if (fields.password) {
                    const salt = bcrypt.genSaltSync(10);
                    const hashPassword = bcrypt.hashSync(fields.password[0], salt);
                    teacher.password = hashPassword;
                }
    
                // Update other fields (name, email, age, gender, guardian, etc.)
                if (fields.name) {
                    teacher.name = fields.name[0];
                }
                if (fields.email) {
                    teacher.email = fields.email[0];
                }
                if (fields.age) {
                    teacher.age = fields.age[0];
                }
                if (fields.gender) {
                    teacher.gender = fields.gender[0];
                }
                if (fields.qualification) {
                    teacher.qualification = fields.qualification[0];
                }
               
    
                // Handle image upload
                if (files.image) {
                    const photo = files.image[0];
                    const filePath = photo.filepath;
                    const uniqueFileName = `${Date.now()}_${photo.originalFilename.replace(/ /g, '_')}`;
    
                    // Delete old image if exists
                    if (teacher.teacher_image) {
                        const oldImagePath = path.join(__dirname, process.env.TEACHER_IMAGE_PATH, teacher.teacher_image);
                        if (fs.existsSync(oldImagePath)) {
                            fs.unlinkSync(oldImagePath);
                        }
                    }
    
                    // Save the new image
                    const newPath = path.join(__dirname, process.env.TEACHER_IMAGE_PATH, uniqueFileName);
                    const photoData = fs.readFileSync(filePath);
                    fs.writeFileSync(newPath, photoData);
    
                    teacher.teacher_image = uniqueFileName; // Update the teacher image field
                }
    
                // Save the teacher with updated data
                await teacher.save();
    
                res.status(200).json({ success: true, message: 'Teacher updated successfully', teacher });
            });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Teacher update failed', error });
        }
    }
    ,


  deleteTeacherWithId: async (req, res) => {
    try {
        const id = req.params.id;
        const schoolId = req.user.schoolId;
        
       
        await Teacher.findByIdAndDelete({ _id: id, school: schoolId });

        // Fetch updated list of teachers after deletion
        const teachers = await Teacher.find({ school: schoolId });

        res.status(200).json({ success: true, message: 'Teacher deleted', teachers });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: 'Teacher delete failed', error });
    }
}

}