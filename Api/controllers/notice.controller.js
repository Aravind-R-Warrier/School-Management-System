const Notice=require('../models/notice.model')
const Student=require('../models/student.model')
const Exam=require('../models/examination.model')
const Schedule=require('../models/schedule.model')


module.exports={

    getAllNotices:async(req,res)=>{
       try {
        const schoolId=req.user.schoolId
        const allNotices=await Notice.find({school:schoolId})
        res.status(200).json({success:true,message:'succussfully fetched notices',data:allNotices})
       } catch (error) {
        res.status(500).json({success:false,message:'server error on getting notices'})

       }
    },
    getAllNoticesForTeacher:async(req,res)=>{
       try {
        const schoolId=req.user.schoolId
        const allNotices=await Notice.find({school:schoolId,audience:'Teacher'})
        res.status(200).json({success:true,message:'succussfully fetched notices',data:allNotices})
       } catch (error) {
        res.status(500).json({success:false,message:'server error on getting notices'})

       }
    },
    getAllNoticesForStudents:async(req,res)=>{
       try {
        const schoolId=req.user.schoolId
        const allNotices=await Notice.find({school:schoolId,audience:'Student'})
        res.status(200).json({success:true,message:'succussfully fetched notices',data:allNotices})
       } catch (error) {
        res.status(500).json({success:false,message:'server error on getting notices'})

       }
    },

    createNotice:async(req,res)=>{
        try {
           
            const{title,message,audience}=req.body
            const newNotice=new Notice({
                school:req.user.schoolId,
                title:title,
                message:message,
                audience:audience
            })

            await newNotice.save()
            res.status(200).json({success:true,message:'suucessfully created notice'})

        } catch (error) {
            console.log(error)
            res.status(500).json({success:false,message:'server error on creating notice'})
        }
   },

   updateNoticeWithId:async(req,res)=>{
    try {
        let id=req.params.id
        await Notice.findByIdAndUpdate(id,{$set:{...req.body}})
        const NoticeAfterUpdate=await Notice.findById({_id:id})
        res.status(200).json({success:true,message:'notice updated',data:NoticeAfterUpdate})
    } catch (error) {
        console.log(error)
        res.status(500).json({success:false,message:'server error on updating notice'})

    }
   },

   deleteNoticeWithId: async (req, res) => {
    try {
      const id = req.params.id;
      const schoolId = req.user.schoolId;
     
        await Notice.findOneAndDelete({ _id: id, school: schoolId });
        return res.status(200).json({ success: true, message: 'Notice deleted successfully' });
      
    } catch (error) {
      console.error('Error deleting notice:', error); 
      return res.status(500).json({ success: false, message: 'Server error while deleting notice', error: error.message });
    }
  }
  


}