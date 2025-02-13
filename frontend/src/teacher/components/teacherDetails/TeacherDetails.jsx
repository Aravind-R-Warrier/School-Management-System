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

function TeacherDetails() {
  const[teacher,setTeacher]=useState({})


  const fetchTeacherDetails=async()=>{
    try {
      const response=await  axios.get(`${baseApi}/teacher/fetch-single`)
      // console.log(response)
      setTeacher(response.data.teacher)
    } catch (error) {
      
    }
   

  }

  useEffect(()=>{
 fetchTeacherDetails()
  },[])
  return (
    <>
   <Box component={'div'} sx={{display:'flex',justifyContent:'center'}}>
   <CardMedia
          component="img"
          sx={{height:'230px',width:'310px',objectPosition:'center',objectFit:'cover',borderRadius:'40%'}}
          image={`${teacher.teacher_image}`}
          alt="teacher"
        />
   </Box>
   <h3 style={{textAlign:'center',fontFamily:'verdana'}}>Teacher Details</h3>
   <Box component={'div'} sx={{display:'flex',justifyContent:'center'}}>
    {teacher &&  <TableContainer sx={{width:'900px',borderRadius:'10px',boxShadow:'black 2 4 2'}} component={Paper} >
        <Table    aria-label="simple table">
          <TableBody >

            <TableRow
            >
              <TableCell >
              <b>Name:</b> 
              </TableCell>
              <TableCell align="right">{teacher.name}</TableCell>
            </TableRow>
            <TableRow
            >
              <TableCell >
              <b>Email:</b> 
              </TableCell>
              <TableCell align="right">{teacher.email}</TableCell>
            </TableRow>
            <TableRow
            >
              <TableCell >
              <b>Age:</b> 
              </TableCell>
              <TableCell align="right">{teacher.age}</TableCell>
            </TableRow>
            <TableRow
            >
              <TableCell >
              <b>Gender:</b> 
              </TableCell>
              <TableCell align="right">{teacher.gender}</TableCell>
            </TableRow>
            <TableRow
            >
              <TableCell >
              <b>Qualification:</b> 
              </TableCell>
              <TableCell align="right">{teacher.qualification}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>}
      </Box>

    </>
  )
}

export default TeacherDetails
