const express=require('express')
const { registerSchool, getAllSchool, loginSchool, updateSchool, getSchoolOwnData } = require('../controllers/school.controller')
const AuthMiddleware=require('../auth/auth')
const router=express.Router()

// register
router.post('/register',registerSchool)

// getallStudent
router.get('/all',getAllSchool)

// login
router.post('/login',loginSchool)

// update
router.patch('/update',AuthMiddleware(['SCHOOL']),updateSchool)//Authenticated for update

// getOneSchool

router.get('/fetch-single',AuthMiddleware(['SCHOOL']),getSchoolOwnData)

module.exports=router