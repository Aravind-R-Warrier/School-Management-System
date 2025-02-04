const express=require('express')
const AuthMiddleware=require('../auth/auth')
const { markAttendence, getAttendence, checkAttendence } = require('../controllers/attendence.controller')
const router=express.Router()

// create
router.post('/mark',AuthMiddleware(['TEACHER']),markAttendence)

// getattendence
router.get('/:studentId',AuthMiddleware(['SCHOOL']),getAttendence)

router.get('/check/:classId',AuthMiddleware(['SCHOOL']),checkAttendence)



module.exports=router