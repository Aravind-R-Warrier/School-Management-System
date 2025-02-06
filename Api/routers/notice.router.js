const express=require('express')
const AuthMiddleware=require('../auth/auth')
const { createNotice, getAllNotices, updateNoticeWithId, deleteNoticeWithId } = require('../controllers/notice.controller')
const router=express.Router()

// create
router.post('/create',AuthMiddleware(['SCHOOL']),createNotice)

// getallclasses
router.get('/all',AuthMiddleware(['SCHOOL']),getAllNotices)

// update
router.patch('/update/:id',AuthMiddleware(['SCHOOL']),updateNoticeWithId)//Authenticated for update

// delete

router.delete('/delete/:id',AuthMiddleware(['SCHOOL']),deleteNoticeWithId)

module.exports=router