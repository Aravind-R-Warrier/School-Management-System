import *as yup from 'yup'

export const loginSchema=yup.object({
    email:yup.string().email("It Must Be An Email").required("Email is Required"),
    password:yup.string().min(8,"Must Have 8 Characters").required("password is Required"),
})