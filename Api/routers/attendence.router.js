const express=require('express')
const AuthMiddleware=require('../auth/auth')
const { markAttendence, getAttendence, checkAttendence } = require('../controllers/attendence.controller')
const router=express.Router()

// create
router.post('/mark',AuthMiddleware(['TEACHER']),markAttendence)

// check
router.get('/check/:classId',AuthMiddleware(['SCHOOL','TEACHER']),checkAttendence)

// getattendence
router.get('/:studentId',AuthMiddleware(['SCHOOL']),getAttendence)





module.exports=router