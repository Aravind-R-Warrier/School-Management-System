const Subject=require('../models/subject.model')
const Student=require('../models/student.model')
const Exam=require('../models/examination.model')
const Schedule=require('../models/schedule.model')


module.exports={

    getAllSubjects:async(req,res)=>{
       try {
        const schoolId=req.user.schoolId
        const allSubjects=await Subject.find({school:schoolId})
        res.status(200).json({success:true,message:'succussfully fetched subjects',data:allSubjects})
       } catch (error) {
        res.status(500).json({success:false,message:'server error on getting subjects'})

       }
    },

    createSubject:async(req,res)=>{
        try {
            const newSubject=new Subject({
                school:req.user.schoolId,
                subject_name:req.body.subject_name,
                subject_codename:req.body.subject_codename,
            })

            await newSubject.save()
            res.status(200).json({success:true,message:'suucessfully created subject'})

        } catch (error) {
            console.log(error)
            res.status(500).json({success:false,message:'server error on creating subject'})
        }
   },

   updateSubjectWithId:async(req,res)=>{
    try {
        let id=req.params.id
        await Subject.findByIdAndUpdate(id,{$set:{...req.body}})
        const subjectAfterUpdate=await Subject.findById({_id:id})
        res.status(200).json({success:true,message:'subject updated',data:subjectAfterUpdate})
    } catch (error) {
        console.log(error)
        res.status(500).json({success:false,message:'server error on updating subject'})

    }
   },

   deleteSubjectWithId: async (req, res) => {
    try {
      const id = req.params.id;
      const schoolId = req.user.schoolId;
  
      // Check related records
      const subjectExamCount = await Exam.countDocuments({ subject: id, school: schoolId });
      const classScheduleCount = await Schedule.countDocuments({ subject: id, school: schoolId });
  
      // Check if the subject is in use
      if (subjectExamCount === 0 && classScheduleCount === 0) {
        await Subject.findOneAndDelete({ _id: id, school: schoolId });
        return res.status(200).json({ success: true, message: 'Subject deleted successfully' });
      } else {
        return res.status(400).json({ success: false, message: 'Subject is in use and cannot be deleted' });
      }
    } catch (error) {
      console.error('Error deleting subject:', error); 
      return res.status(500).json({ success: false, message: 'Server error while deleting subject', error: error.message });
    }
  }
  


}