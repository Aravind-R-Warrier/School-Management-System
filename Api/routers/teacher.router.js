const express=require('express')
const AuthMiddleware=require('../auth/auth')
const { registerTeacher, getTeacherWithQuery, loginTeacher, updateTeacher, getTeacherOwnData, getTeacherWithId, deleteTeacherWithId } = require('../controllers/teacher.controller')
const router=express.Router()

// register
router.post('/register',AuthMiddleware(['SCHOOL']),registerTeacher)

// getallTeacher
router.get('/fetch-with-query',AuthMiddleware(['SCHOOL']),getTeacherWithQuery)

// login
router.post('/login',loginTeacher)

// update
router.patch('/update/:id',AuthMiddleware(['SCHOOL']),updateTeacher)//Authenticated for update

// getOneTeacher

router.get('/fetch-single',AuthMiddleware(['STUDENT']),getTeacherOwnData)

router.get('/fetch/:id',AuthMiddleware(['SCHOOL']),getTeacherWithId)


// deleteTeacher

router.delete('/delete/:id', AuthMiddleware(['SCHOOL']), deleteTeacherWithId);

module.exports=router