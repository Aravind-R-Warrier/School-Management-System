const Attendence=require('../models/attendence.model')
const moment=require('moment')

module.exports={
    

    // mark attndance
    markAttendence:async(req,res)=>{
    
        try {
            const {studentId,date,status,classId}=req.body
            const schoolId=req.user.schoolId
            const newAttendence=new Attendence({
                student:studentId,
                date,
                status,
                class:classId,
                school:schoolId
            })

            await newAttendence.save()
            res.status(200).json({success:true,message:'Attendence Marked',newAttendence})
        } catch (error) {
            res.status(500).json({success:true,message:'Attendence failed Marking',error})
        }
    },

    getAttendence:async(req,res)=>{
        try {
            const {studentId}=req.params
            const attendence=await Attendence.find({student:studentId}).populate('student')
            res.status(200).json({success:'true',message:'successFully retrieved attendence',attendence})

        } catch (error) {
            res.status(500).json({success:true,message:'Attendence failed to get',error})
        }
    },

    checkAttendence:async(req,res)=>{
        try {
            const {classId}=req.params
            const today=moment().startOf('day')
            const attendenceToday=await Attendence.findOne({
                class:req.params.classId,
                date:{
                    // 00:00 to 23:59
                    $gte:today.toDate(),
                    $lt:moment(today).endOf('day').toDate()
                }

            })
            if(attendenceToday){
                return res.status(200).json({attendenceTaken:true,message:'Today attendence Already Taken'})
            }else{
                return res.status(200).json({attendenceTaken:false,message:'Today attendence Not Taken'})

            }
        } catch (error) {
            res.status(500).json({success:true,message:'Error in checking attendence',error})
        }
    }
}