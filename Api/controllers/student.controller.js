// CRUD
require('dotenv').config()
const formidable = require('formidable')
const School = require('../models/school.model.js')
const path = require('path')
const fs = require('fs')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


module.exports = {
    registerSchool: async (req, res) => {
        try {
            const form = new formidable.IncomingForm()
            form.parse(req, async (err, fields, files) => {
                const school=await School.findOne({email:fields.email[0]});
                if(school){
                  return  res.status(409).json({success:false,message:'email already registered'})
                }else{

               
                const photo = files.image[0]
                let filePath = photo.filepath;
                let originalFileName = photo.originalFilename.replace(" ", "_")
                let newPath = path.join(__dirname,process.env.SCHOOL_IMAGE_PATH, originalFileName)
                let photoData = fs.readFileSync(filePath)

                fs.writeFileSync(newPath, photoData)

                const salt = bcrypt.genSaltSync(10)
                const hashPassword = bcrypt.hashSync(fields.password[0], salt)

                const newSchool = new School({
                    school_name: fields.school_name[0],
                    email: fields.email[0],
                    owner_name: fields.owner_name[0],
                    school_image:originalFileName,
                    password: hashPassword
                })
                const savedSchool = await newSchool.save()
                res.status(200).json({ success: true, data: savedSchool, message: "school is registerd successFully" })
            }
            })
        } catch (error) {
            res.status(500).json({ success: false, message: 'school reg failed', error })
        }

    },



    loginSchool: async (req, res) => {
      
        try {
            const school = await School.findOne({ email: req.body.email })

            if (school) {
                const isAuth = bcrypt.compareSync(req.body.password, school.password);
                if (isAuth) {

                    const token = jwt.sign({
                        id: school._id,
                        schoolId: school._id,
                        owner_name: school.owner_name,
                        school_name: school.school_name,
                        image: school.school_image,
                        role: "SCHOOL"
                    }, process.env.JWT_SECRET)
                    res.header("Autharisation", token)
                    res.status(200).json({
                        success: true, message: "login successfull", user: {
                            id: school._id,
                            owner_name: school.owner_name,
                            school_name: school.school_name,
                            image: school.school_image,
                            role: "SCHOOL"
                        }
                    })
                } else {
                    res.status(401).json({ success: false, message: 'password is incorrect' })

                }
            } else {
                res.status(401).json({ success: false, message: 'email not registered' })
            }
        } catch (error) {
            res.status(500).json({ success: false, message: 'internal server error school login', error })
        }

    },


    getAllSchool: async (req, res) => {
        try {
            const schools = await School.find().select(['-password', '-id', '-email', '-owner_name', '-createdAt']);
            res.status(200).json({ success: true, message: 'success fetching schools', schools })
        } catch (error) {
            res.status(500).json({ success: false, message: 'internal server error school all data', error })
        }
    },

    getSchoolOwnData: async (req, res) => {
        try {
            const id = req.user.id;
            const school = await School.findOne({ _id: id }).select('-password');
            if (school) {
                res.status(200).json({ success: true, message: 'school own data successfull', school })
            } else {
                res.status(404).json({ success: false, message: 'school not found', error })
            }
        } catch (error) {
            res.status(500).json({ success: false, message: 'internal server error own school data', error })

        }
    },

   updateSchool: async (req, res) => {
    try {
      const id = req.user.id; 
      const form = new formidable.IncomingForm();

      form.parse(req, async (err, fields, files) => {
        if (err) {
          return res.status(400).json({ success: false, message: 'Form parsing error', error: err });
        }

        const school = await School.findOne({ _id: id });
        if (!school) {
          return res.status(404).json({ success: false, message: 'School not found' });
        }

        if (files.image) {
          const photo = files.image[0];
          const filePath = photo.filepath;
          const uniqueFileName = `${Date.now()}_${photo.originalFilename.replace(/ /g, '_')}`;

          // Delete the old image if it exists
          if (school.school_image) {
            const oldImagePath = path.join(__dirname, process.env.SCHOOL_IMAGE_PATH, school.school_image);
            if (fs.existsSync(oldImagePath)) {
              fs.unlinkSync(oldImagePath);
            }
          }

          // Save the new image
          const newPath = path.join(__dirname, process.env.SCHOOL_IMAGE_PATH, uniqueFileName);
          const photoData = fs.readFileSync(filePath);
          fs.writeFileSync(newPath, photoData);

          school.school_image = uniqueFileName; // Update the school image field
        }

        // Update other fields
        if (fields.school_name) {
          school.school_name = fields.school_name[0];
        }

        await school.save(); // Save the updated school document

        res.status(200).json({ success: true, message: 'School updated successfully', school });
      });
    } catch (error) {
      res.status(500).json({ success: false, message: 'School update failed', error });
    }
  },
}