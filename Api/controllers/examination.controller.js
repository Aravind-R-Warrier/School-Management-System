const Examination = require('../models/examination.model')

module.exports = {
    newExamination: async (req, res) => {
        try {
            const schoolId = req.user.schoolId
            const { date, subject, examType, classId } = req.body
            const newExamination = new Examination({
                school: schoolId,
                examDate: date,
                subject: subject,
                examType: examType,
                class: classId
            })
            const savedData = await newExamination.save()
            res.status(200).json({ success: true, message: 'successfully created exam', data: savedData })
        } catch (error) {
            res.status(500).json({ success: false, message: 'error in creating examination' })
        }
    },

    getAllExamination: async (req, res) => {
        try {
            const schoolId = req.user.schoolId
            const allExamination = await Examination.find()
            res.status(200).json({ success: true, allExamination })
        } catch (error) {
            res.status(500).json({ success: false, message: 'error in fetching all examinations' })
        }
    },

    getExaminationByClass: async (req, res) => {
        try {
            const schoolId = req.user.schoolId
            classId = req.params.id
            const examination = await Examination.find({ class: classId, school: schoolId })
            res.status(200).json({ success: true, examination })
        } catch (error) {
            res.status(500).json({ success: false, message: 'error in fetching all examinations' })
        }
    },

    updateExaminationWithId: async (req, res) => {
        try {
            const schoolId = req.user.schoolId
            const examinationId = req.params.id
            const { date, subject, examType} = req.body

            await Examination.findByIdAndUpdate({ _id: examinationId, school: schoolId }, {
                $set: {
                    examDate: date,
                    subject: subject,
                    examType: examType,
                }
            })
            res.status(200).json({success:true,message:'exam updated successFully'})
        } catch (error) {
            res.status(500).json({ success: false, message: 'error in updating examination' })
        }
    },

    deleteExamination:async(req,res)=>{
        try {
            const schoolId = req.user.schoolId
            const examinationId = req.params.id
            await Examination.findByIdAndDelete({_id:examinationId,school:schoolId})
            res.status(200).json({success:true,message:'exam deleted successFully'})
        } catch (error) {
            res.status(500).json({ success: false, message: 'error in deleting examination' })
        }
    }


}