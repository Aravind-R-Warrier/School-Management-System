const express=require('express')
const AuthMiddleware=require('../auth/auth')
const { createSchedule, getScheduleByClass, updateScheduleWithId, deleteScheduleWithId, getScheduleById } =require('../controllers/schedule.controller')
const router=express.Router()

// create
router.post('/create',AuthMiddleware(['SCHOOL']),createSchedule)

// getschedulewitheachClass
router.get('/fetch-with-class/:id',AuthMiddleware(['SCHOOL']),getScheduleByClass)

// update
router.post('/update/:id',AuthMiddleware(['SCHOOL']),updateScheduleWithId)//Authenticated for update


router.get('/fetch/:id',AuthMiddleware(['SCHOOL']),getScheduleById)


//delete
router.delete('/delete/:id',AuthMiddleware(['SCHOOL']),deleteScheduleWithId)

module.exports=router