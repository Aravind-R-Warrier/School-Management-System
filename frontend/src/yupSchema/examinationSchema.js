import *as yup from 'yup'

export const ExaminationSchema=yup.object({
    date:yup.date().required("Date is Required"),
    subject:yup.string().required("Subject is Required"),
    examType:yup.string().required("Exam type is Required"),

  

})