const express=require('express')
const AuthMiddleware=require('../auth/auth')
const { createSubject, getAllSubjects, updateSubjectWithId, deleteSubjectWithId } = require('../controllers/subject.controller')
const router=express.Router()

// create
router.post('/create',AuthMiddleware(['SCHOOL']),createSubject)

// getallStudent
router.get('/all',AuthMiddleware(['SCHOOL']),getAllSubjects)

// update
router.patch('/update/:id',AuthMiddleware(['SCHOOL']),updateSubjectWithId)//Authenticated for update

// getOneSchool

router.delete('/delete/:id',AuthMiddleware(['SCHOOL']),deleteSubjectWithId)

module.exports=router