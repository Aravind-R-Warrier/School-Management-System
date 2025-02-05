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
    getSingleClass:async(req,res)=>{
       try {
        const schoolId=req.user.schoolId
        const classId=req.params.id
        const classs=await Class.findOne({school:schoolId,_id:classId}).populate("attendee")
        res.status(200).json({success:true,message:'succussfully fetched single class',data:classs})
       } catch (error) {
        res.status(500).json({success:false,message:'server error on getting class'})

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
        await Class.findByIdAndUpdate(id,{$set:{...req.body}})
        const classAfterUpdate=await Class.findById({_id:id})
        res.status(200).json({success:true,message:'class updated',data:classAfterUpdate})
    } catch (error) {
        console.log(error)
        res.status(500).json({success:false,message:'server error on updating class'})

    }
   },

   deleteClassWithId: async (req, res) => {
    try {
      const id = req.params.id;
      const schoolId = req.user.schoolId;
  
      // Check related records
      const classStudentCount = await Student.countDocuments({ student_class: id, school: schoolId });
      const classExamCount = await Exam.countDocuments({ class: id, school: schoolId });
      const classScheduleCount = await Schedule.countDocuments({ class: id, school: schoolId });
  
      // Check if the class is in use
      if (classExamCount === 0 && classScheduleCount === 0 && classStudentCount === 0) {
        await Class.findOneAndDelete({ _id: id, school: schoolId });
        return res.status(200).json({ success: true, message: 'Class deleted successfully' });
      } else {
        return res.status(400).json({ success: false, message: 'Class is in use and cannot be deleted' });
      }
    } catch (error) {
      console.error('Error deleting class:', error); 
      return res.status(500).json({ success: false, message: 'Server error while deleting class', error: error.message });
    }
  }
  


}