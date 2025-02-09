import React, { useEffect, useState } from 'react'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { baseApi } from '../../../environment';
import axios from 'axios';
import { Box, CardMedia } from '@mui/material';

function StudentDetails() {
  const[student,setStudent]=useState({})


  const fetchTeacherDetails=async()=>{
    try {
      const response=await  axios.get(`${baseApi}/student/fetch-single`)
      console.log(response)
      setStudent(response.data.student)
    } catch (error) {
      
    }
   

  }

  useEffect(()=>{
 fetchTeacherDetails()
  },[])
  return (
    <>
    <h2>Student Details</h2>
   <Box component={'div'} sx={{display:'flex',justifyContent:'center'}}>
   <CardMedia
          component="img"
          sx={{height:'230px',width:'310px',objectPosition:'center',objectFit:'cover',borderRadius:'40%'}}
          image={`${student.student_image}`}
          alt="student"
        />
   </Box>
    {student &&  <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableBody>

            <TableRow
            >
              <TableCell >
              <b>Name:</b> 
              </TableCell>
              <TableCell align="right">{student.name}</TableCell>
            </TableRow>
            <TableRow
            >
              <TableCell >
              <b>Email:</b> 
              </TableCell>
              <TableCell align="right">{student.email}</TableCell>
            </TableRow>
            <TableRow
            >
              <TableCell >
              <b>Age:</b> 
              </TableCell>
              <TableCell align="right">{student.age}</TableCell>
            </TableRow>


            <TableRow
            >
              <TableCell >
              <b>Class:</b> 
              </TableCell>
              <TableCell align="right">{student.student_class?.class_text}</TableCell>
            </TableRow>

            <TableRow
            >
              <TableCell >
              <b>Gender:</b> 
              </TableCell>
              <TableCell align="right">{student.gender}</TableCell>
            </TableRow>
          
          </TableBody>
        </Table>
      </TableContainer>}
     
    </>
  )
}

export default StudentDetails
