import *as yup from 'yup'

export const studentSchema = yup.object({
    name: yup.string().min(3, "Student Name Must Contain 3 Letters").required("School name is Required"),
    email: yup.string().email("It Must Be An Email").required("Email is Required"),
    student_class: yup.string().required('Student class is required'),
    age: yup.number().required('Age is required field'),
    gender: yup.string().required('Gender is required'),
    guardian: yup.string().min(4, "Must contain Four Letters").required('Guardian is required'),
    guardian_phone: yup.number().min(10, "must contain nine number").required('required phone number of guardian'),
    password: yup.string().min(6, "Must Have 6 Characters").required("password is Required"),
    confirm_password: yup.string().oneOf([yup.ref('password')], "Password Must Match").required("confirm password is Required"),
})



export const studentEditSchema = yup.object({
    name: yup.string().min(3, "Student Name Must Contain 3 Letters").required("School name is Required"),
    email: yup.string().email("It Must Be An Email").required("Email is Required"),
    student_class: yup.string().required('Student class is required'),
    age: yup.number().required('Age is required field'),
    gender: yup.string().required('Gender is required'),
    guardian: yup.string().min(4, "Must contain Four Letters").required('Guardian is required'),
    guardian_phone: yup.number().min(10, "must contain nine number").required('required phone number of guardian'),
    password: yup.string().min(6, "Must Have 6 Characters"),
    confirm_password: yup.string().oneOf([yup.ref('password')], "Password Must Match")
})


