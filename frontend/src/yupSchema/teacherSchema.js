import *as yup from 'yup'




export const teacherSchema = yup.object({
    name: yup.string().min(3, "Teacher Name Must Contain 3 Letters").required("School name is Required"),
    email: yup.string().email("It Must Be An Email").required("Email is Required"),
    age: yup.number().required('Age is required field'),
    gender: yup.string().required('Gender is required'),
    qualification: yup.string().min(4, "Must contain Four Letters").required('Qualification is required'),
    password: yup.string().min(6, "Must Have 6 Characters").required("password is Required"),
    confirm_password: yup.string().oneOf([yup.ref('password')], "Password Must Match").required("confirm password is Required"),
})



export const teacherEditSchema = yup.object({
    name: yup.string().min(3, "Teacher Name Must Contain 3 Letters").required("School name is Required"),
    email: yup.string().email("It Must Be An Email").required("Email is Required"),
    age: yup.number().required('Age is required field'),
    gender: yup.string().required('Gender is required'),
    qualification: yup.string().min(4, "Must contain Four Letters").required('Qualification is required'),
    password: yup.string().min(6, "Must Have 6 Characters"),
    confirm_password: yup.string().oneOf([yup.ref('password')], "Password Must Match")
})


