import *as yup from 'yup'

export const registerSchema=yup.object({
    school_name:yup.string().min(8,"School Name Must Contain 8 Letters").required("School name is Required"),
    email:yup.string().email("It Must Be An Email").required("Email is Required"),
    owner_name:yup.string().min(3,"Must Have 3 Characters").required("name is Required"),
    password:yup.string().min(8,"Must Have 8 Characters").required("password is Required"),
    confirm_password:yup.string().oneOf([yup.ref('password')],"Password Must Match").required("confirm password is Required"),
})