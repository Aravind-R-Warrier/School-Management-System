const express=require('express')
const AuthMiddleware=require('../auth/auth')
const { createNotice, getAllNotices, updateNoticeWithId, deleteNoticeWithId ,getAllNoticesForTeacher,getAllNoticesForStudents} = require('../controllers/notice.controller')
const router=express.Router()

// create
router.post('/create',AuthMiddleware(['SCHOOL']),createNotice)

// getallNotices
router.get('/all',AuthMiddleware(['SCHOOL']),getAllNotices)
// getNoticesForTeachers
router.get('/teacher',AuthMiddleware(['TEACHER']),getAllNoticesForTeacher)
// getNoticesForStudents
router.get('/all',AuthMiddleware(['STUDENT']),getAllNoticesForStudents)

// update
router.patch('/update/:id',AuthMiddleware(['SCHOOL']),updateNoticeWithId)//Authenticated for update

// delete

router.delete('/delete/:id',AuthMiddleware(['SCHOOL']),deleteNoticeWithId)

module.exports=router