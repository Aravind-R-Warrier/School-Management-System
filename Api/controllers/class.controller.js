const Class=require('../models/class.model')
const Student=require('../models/student.model')
const Exam=require('../models/examination.model')
const Schedule=require('../models/schedule.model')


module.exports={
       // school:{type:mongoose.Schema.ObjectId,ref:'School'},
            //    class_text:{type:String,required:true},
            //    class_num:{type:Number,required:true},
            //    attendee:{type:mongoose.Schema.ObjectId,ref:'Teacher'},
            //    createdAt:{type:Date,default:new Date()} 


    getAllCLasses:async(req,res)=>{
       try {
        const schoolId=req.user.schoolId
        const allClasses=await Class.find({school:schoolId})
        res.status(200).json({success:true,message:'succussfully fetched classes',data:allClasses})
       } catch (error) {
        res.status(500).json({success:false,message:'server error on getting classes'})

       }
    },

    createClass:async(req,res)=>{
        try {
            const newClass=new Class({
                school:req.user.schoolId,
                class_text:req.body.class_text,
                class_num:req.body.class_num,
            })

            await newClass.save()
            res.status(200).json({success:true,message:'suucessfully created class'})

        } catch (error) {
            console.log(error)
            res.status(500).json({success:false,message:'server error on creating class'})
        }
   },

   updateClassWithId:async(req,res)=>{
    try {
        let id=req.params.id
        await Class.findByIdAndUpdate({_id:id}),{$set:{...req.body}}
        const classAfterUpdate=await Class.findById({_id:id})
        res.status(200).json({success:true,message:'class updated',data:classAfterUpdate})
    } catch (error) {
        console.log(error)
        res.status(500).json({success:false,message:'server error on updating class'})

    }
   },

   deleteClassWithId:async(req,res)=>{  
    try {
        let id=req.params.id
        let schoolId=req.user.schoolId

        const classStudentCount=(await Student.find({student_class:id,school:schoolId})).length
        const classExamCount=(await Exam.find({class:id,school:schoolId})).length
        const classScheduleCount=(await Schedule.find({class:id,school:schoolId})).length

        if((classExamCount===0) && (classScheduleCount===0) && (classStudentCount===0)){
            await Class.findByIdAndDelete({_id:id,school:schoolId})
            res.json(200).json({success:true,message:'deleted class successFully'})
        }else{
            res.status(500).json({success:false,message:'class already in use'})
        }
    } catch (error) {
        res.status(500).json({success:false,message:'server error on deleting class'})
    }
   }


}