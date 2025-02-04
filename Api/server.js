require('dotenv').config()
const express=require('express')
const cors=require('cors')
const mongoose=require('mongoose')
const cookieParser=require('cookie-parser')

// router imports
const schoolRouter=require('./routers/school.router')
const classRouter=require('./routers/class.router')
const subjectRouter=require('./routers/subject.router')
const studentRouter=require('./routers/student.router')
const teacherRouter=require('./routers/teacher.router')
const scheduleRouter=require('./routers/schedule.router')
const attendenceRouter=require('./routers/attendence.router')

const app=express()
// middleware
app.use(express.json())
app.use(express.urlencoded({extended:true}))
const corsOption={exposedHeaders:"Autharisation"}
app.use(cors(corsOption))
app.use(cookieParser())

// mogoConnection
mongoose.connect('mongodb+srv://aravindrwarrier1:school@cluster0.cc9ft.mongodb.net/school-server?retryWrites=true&w=majority&appName=Cluster0'
).then((db)=>{
    console.log('mongoconnected')
}).catch((err)=>{
    console.log(err)
})


app.get('/',(req,res)=>{
    res.send({id:1,message:'Api working'})
})

// router
app.use('/api/school',schoolRouter)
app.use('/api/class',classRouter)
app.use('/api/subject',subjectRouter)
app.use('/api/student',studentRouter)
app.use('/api/teacher',teacherRouter)
app.use('/api/schedule',scheduleRouter)
app.use('/api/attendence',attendenceRouter)

const PORT=process.env.PORT || 3000
app.listen(PORT,()=>{
    console.log(`server running on port ${PORT}`)
})