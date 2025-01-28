const express=require('express')
const AuthMiddleware=require('../auth/auth')
const { createClass, getAllCLasses, updateClassWithId, deleteClassWithId } = require('../controllers/class.controller')
const router=express.Router()

// create
router.post('/create',AuthMiddleware(['SCHOOL']),createClass)

// getallStudent
router.get('/all',AuthMiddleware(['SCHOOL']),getAllCLasses)

// update
router.patch('/update/:id',AuthMiddleware(['SCHOOL']),updateClassWithId)//Authenticated for update

// getOneSchool

router.delete('/delete/:id',AuthMiddleware(['SCHOOL']),deleteClassWithId)

module.exports=router