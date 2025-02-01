import *as yup from 'yup'

export const periodSchema=yup.object({
    teacher:yup.string().required("Teacher is Required"),
    subject:yup.string().required("Subject is Required"),
    period:yup.string().required("Period is Required"),
    date:yup.date().required("Date is Required"),

})