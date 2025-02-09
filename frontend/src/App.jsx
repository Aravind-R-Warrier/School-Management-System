import React, { useContext } from 'react'
import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import School from './school/School'
import Class from './school/components/class/Class'
import Dashboard from './school/components/dashboard/Dashboard'
import Examination from './school/components/examination/Examination'
import Notice from './school/components/notice/Notice'
import Schedule from './school/components/schedule/Schedule'
import Students from './school/components/students/Students'
import Subjects from './school/components/subjects/Subjects'
import Teachers from './school/components/teacher/Teachers.jsx'
import Client from './client/Client.jsx'
import Home from './client/components/home/Home'
import Login from './client/components/login/Login'
import Register from './client/components/register/Register'
import Teacher from './teacher/Teacher.jsx'
import TeacherDetails from './teacher/components/teacherDetails/TeacherDetails.jsx'
import ScheduleTeacher from './teacher/components/schedule/ScheduleTeacher.jsx'
import AttendenceTeachers from './teacher/components/attendence/AttendenceTeachers.jsx'
import ExaminationTeacher from './teacher/components/examinations/ExaminationTeacher.jsx'
import Noticeteacher from './teacher/components/notice/Noticeteacher.jsx'
import Student from './student/Student.jsx'
import ScheduleStudent from './student/components/schedule/ScheduleStudent.jsx'
import AttendenceStudent from './student/components/attendence/AttendenceStudent.jsx'
import ExaminationStudent from './student/components/examinations/ExaminationStudent.jsx'
import NoticeStudent from './student/components/notice/NoticeStudent.jsx'
import StudentDetails from './student/components/studentDetails/StudentDetails.jsx'
import ProtectRoute from './gaurd/ProtectRoute.jsx'
import { AuthContext } from './context/AuthContext.jsx'
import AttendenceStudentList from './school/components/attendence/AttendenceStudentList.jsx'
import AttendenceDetails from './school/components/attendence/AttendenceDetails.jsx'
import Logout from './client/components/logout/Logout.jsx'
import { ThemeProvider } from '@mui/material'
import darkTheme from './basicUtiliyComponents/darkTheme/darkTheme.js'
import lightTheme from './basicUtiliyComponents/lightTheme/lightTheme.js'

function App() {
      const { dark } = useContext(AuthContext)
  return (
    
    <ThemeProvider theme={dark?darkTheme:lightTheme}>
          {/* <DraggableButton/> */}
      <BrowserRouter>
        <Routes>
          {/* school */}
          <Route path='school' element={<ProtectRoute allowRoles={['SCHOOL']}><School /></ProtectRoute> } >
            <Route index element={<Dashboard />} />
            <Route path='dashboard' element={<Dashboard />} />
            <Route path='attendence' element={<AttendenceStudentList />} />
            <Route path='attendence/:id' element={<AttendenceDetails />} />
            <Route path='class' element={<Class />} />
            <Route path='examinations' element={<Examination />} />
            <Route path='notice' element={<Notice />} />
            <Route path='schedule' element={<Schedule />} />
            <Route path='students' element={<Students />} />
            <Route path='subjects' element={<Subjects />} />
            <Route path='teachers' element={<Teachers />} />
          </Route>

          {/*student */}
          <Route path='student' element={<ProtectRoute allowRoles={['STUDENT']}><Student/></ProtectRoute>}>
            <Route index element={<StudentDetails/>}/>
            <Route path='schedule' element={<ScheduleStudent/>}/>
            <Route path='attendence' element={<AttendenceStudent/>}/>
            <Route path='examinations' element={<ExaminationStudent/>}/>
            <Route path='notice' element={<NoticeStudent/>}/>
          </Route>

          {/* teacher */}
          <Route path='teacher' element={<ProtectRoute allowRoles={['TEACHER']}><Teacher/></ProtectRoute>}>
            <Route index element={<TeacherDetails/>}/>
            <Route path='schedule' element={<ScheduleTeacher/>}/>
            <Route path='attendence' element={<AttendenceTeachers/>}/>
            <Route path='examinations' element={<ExaminationTeacher/>}/>
            <Route path='notice' element={<Noticeteacher/>}/>
          </Route>

          {/*client */}
          <Route path='/' element={<Client />}>
            <Route index element={<Home />} />
            <Route path='login' element={<Login />} />
            <Route path='register' element={<Register />} />
            <Route path='logout' element={<Logout />} />
          </Route>


        </Routes>
      </BrowserRouter>
      </ThemeProvider>
   
  )
}

export default App
