import *as yup from 'yup'

export const subjectSchema=yup.object({
    subject_name:yup.string().min(3,'Atleast 3 characters required').required("Subject name is Required"),
    subject_codename:yup.string().required("subject codename is Required"),
})