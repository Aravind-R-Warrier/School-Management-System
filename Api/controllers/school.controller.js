// CRUD
require('dotenv').config()
const formidable = require('formidable')
const School = require('../models/school.model.js')
const path = require('path')
const fs = require('fs')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const cloudinary = require("../utils/cloudinary");


module.exports = {
    registerSchool: async (req, res) => {
        try {
            const form = new formidable.IncomingForm();
            form.parse(req, async (err, fields, files) => {
                if (err) {
                    return res.status(400).json({ success: false, message: "Error parsing form", error: err });
                }
    
                const schoolExists = await School.findOne({ email: fields.email[0] });
                if (schoolExists) {
                    return res.status(409).json({ success: false, message: "Email already registered" });
                }
    
                let imageUrl = null;
                if (files.image) {
                    const photo = files.image[0];
                    const uploadResult = await cloudinary.uploader.upload(photo.filepath, {
                        folder: "school_images",
                        use_filename: true,
                        unique_filename: true,
                    });
    
                    imageUrl = uploadResult.secure_url; // Get image URL from Cloudinary
                }
    
                const salt = bcrypt.genSaltSync(10);
                const hashPassword = bcrypt.hashSync(fields.password[0], salt);
    
                const newSchool = new School({
                    school_name: fields.school_name[0],
                    email: fields.email[0],
                    owner_name: fields.owner_name[0],
                    school_image: imageUrl, // Store Cloudinary image URL in DB
                    password: hashPassword,
                });
    
                const savedSchool = await newSchool.save();
                res.status(200).json({ success: true, data: savedSchool, message: "School registered successfully" });
            });
        } catch (error) {
            res.status(500).json({ success: false, message: "School registration failed", error });
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
                    return res.status(400).json({ success: false, message: "Form parsing error", error: err });
                }
    
                const school = await School.findOne({ _id: id });
                if (!school) {
                    return res.status(404).json({ success: false, message: "School not found" });
                }
    
                if (files.image) {
                    const photo = files.image[0];
    
                    // Delete old image from Cloudinary if it exists
                    if (school.school_image) {
                        const publicId = school.school_image.split("/").pop().split(".")[0];
                        await cloudinary.uploader.destroy(`school_images/${publicId}`);
                    }
    
                    // Upload new image to Cloudinary
                    const uploadResult = await cloudinary.uploader.upload(photo.filepath, {
                        folder: "school_images",
                        use_filename: true,
                        unique_filename: true,
                    });
    
                    school.school_image = uploadResult.secure_url; // Store new image URL
                }
    
                // Update other fields
                if (fields.school_name) {
                    school.school_name = fields.school_name[0];
                }
    
                await school.save(); // Save updated data
    
                res.status(200).json({ success: true, message: "School updated successfully", school });
            });
        } catch (error) {
            res.status(500).json({ success: false, message: "School update failed", error });
        }
    },
    
}