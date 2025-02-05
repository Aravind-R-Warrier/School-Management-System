const express=require('express')
const AuthMiddleware=require('../auth/auth')
const { newExamination, getAllExamination, getExaminationByClass, updateExaminationWithId, deleteExamination } = require('../controllers/examination.controller')
const router=express.Router()

// create
router.post('/create',AuthMiddleware(['SCHOOL']),newExamination)

// getallExam
router.get('/all',AuthMiddleware(['SCHOOL']),getAllExamination)

// getExamByClass
router.get('/class/:id',AuthMiddleware(['SCHOOL','STUDENT','TEACHER']),getExaminationByClass)

// update
router.patch('/update/:id',AuthMiddleware(['SCHOOL']),updateExaminationWithId)//Authenticated for update

// deleteExam

router.delete('/delete/:id',AuthMiddleware(['SCHOOL']),deleteExamination)

module.exports=router