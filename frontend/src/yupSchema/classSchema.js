import *as yup from 'yup'

export const classSchema=yup.object({
    class_text:yup.string().min(3,'Atleast 3 characters required').required("class text is Required"),
    class_num:yup.string().required("class number is Required"),
})