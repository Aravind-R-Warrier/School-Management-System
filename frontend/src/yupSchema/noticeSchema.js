import *as yup from 'yup'

export const NoticeSchema=yup.object({
    title:yup.string().min(3,'Atleast 3 characters required').required(" Notice is Required"),
    message:yup.string().min(8,'Atleast 8 characters are required').required("Message is Required"),
    audience:yup.string().required("Audience is Required"),
  
})