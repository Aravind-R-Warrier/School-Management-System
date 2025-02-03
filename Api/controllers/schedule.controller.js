
const Schedule = require('../models/schedule.model')


module.exports = {

    getScheduleByClass: async (req, res) => {
        try {
            const classId = req.params.id
            const schoolId = req.user.schoolId
            const schedule = await Schedule.find({ school: schoolId, class: classId }).populate(['teacher','subject'])
            res.status(200).json({ success: true, message: 'succussfully fetched schedule', data: schedule })
        } catch (error) {
            console.log(error)
            res.status(500).json({ success: false, message: 'server error on getting schedule' })

        }
    },

    createSchedule: async (req, res) => {
        try {
            const newSchedule = new Schedule({
                school: req.user.schoolId,
                teacher: req.body.teacher,
                subject: req.body.subject,
                class: req.body.selectedClass,
                startTime: req.body.startTime,
                endTime: req.body.endTime,

            })

            await newSchedule.save()
            res.status(200).json({ success: true, message: 'suucessfully created schedule' })

        } catch (error) {
            console.log(error)
            res.status(500).json({ success: false, message: 'server error on creating schedule' })
        }
    },

    updateScheduleWithId: async (req, res) => {
        try {
            let id = req.params.id
            await Schedule.findByIdAndUpdate(id, { $set: { ...req.body } })
            const scheduleAfterUpdate = await Schedule.findById({ _id: id })
            res.status(200).json({ success: true, message: 'schedule updated', data: scheduleAfterUpdate })
        } catch (error) {
            console.log(error)
            res.status(500).json({ success: false, message: 'server error on updating schedule' })

        }
    },

    deleteScheduleWithId: async (req, res) => {
        try {
            const id = req.params.id;
            const schoolId = req.user.schoolId;
           
                await Schedule.findOneAndDelete({ _id: id, school: schoolId });
                return res.status(200).json({ success: true, message: 'Schedule deleted successfully' });
        } catch (error) {
            console.error('Error deleting subject:', error);
            return res.status(500).json({ success: false, message: 'Server error while deleting schedule', error: error.message });
        }
    },

    getScheduleById: async (req, res) => {
        try {
            const id = req.params.id
            const schoolId = req.user.schoolId
            const schedule =( await Schedule.find({ school: schoolId, _id: id }))[0]
            res.status(200).json({ success: true, message: 'succussfully fetched schedule', data: schedule })
        } catch (error) {
            console.log(error)
            res.status(500).json({ success: false, message: 'server error on getting schedule' })

        }
    }


}