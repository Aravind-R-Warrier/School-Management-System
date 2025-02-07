const express=require('express')
const AuthMiddleware=require('../auth/auth')
const { registerStudent, getStudentsWithQuery, loginStudent, updateStudent, getStudentOwnData, getStudentWithId, deleteStudentWithId } = require('../controllers/student.controller')
const router=express.Router()

// register
router.post('/register',AuthMiddleware(['SCHOOL']),registerStudent)

// getallStudent
router.get('/fetch-with-query',AuthMiddleware(['SCHOOL',"TEACHER"]),getStudentsWithQuery)

// login
router.post('/login',loginStudent)

// update
router.patch('/update/:id',AuthMiddleware(['SCHOOL']),updateStudent)//Authenticated for update

// getOneStudent

router.get('/fetch-single',AuthMiddleware(['STUDENT']),getStudentOwnData)

router.get('/fetch/:id',AuthMiddleware(['SCHOOL']),getStudentWithId)


// deleteStudent

router.delete('/delete/:id', AuthMiddleware(['SCHOOL']), deleteStudentWithId);

module.exports=router