import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Box, Button, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';
import axios from 'axios'
import { baseApi } from '../../../environment';


export default function ExaminationStudent() {

  const [examinations, setExaminations] = React.useState([])
  const [selectedClass, setSelectedClass] = React.useState('')
  const[className,setClassName]=React.useState('')
 
 
 


  const fetchExaminations = async () => {

    try {
      const response = await axios.get(`${baseApi}/examination/class/${selectedClass}`)
      // console.log('exams', response)
      setExaminations(response.data.examination)
    } catch (error) {
      console.log('error in fetching exams', error)
    }
  }

  const fetchStudentDetails=async()=>{
    try {
      const response=await  axios.get(`${baseApi}/student/fetch-single`)
      setSelectedClass(response.data.student.student_class._id)
      setClassName(response.data.student.student_class.class_text)
    } catch (error) {
      
    }
   

  }

  React.useEffect(() => {
    fetchExaminations()
  }, [selectedClass])

  React.useEffect(()=>{
    fetchStudentDetails()
    },[])




 

  return (
    <>

      
     <Box component={'div'} sx={{display:'flex',justifyContent:'center'}}>
     <Typography sx={{fontWeight:'800'}} fontSize={24}>Examination for class ({className})</Typography>
     </Box>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: '600' }} align='right'>Exam Date</TableCell>
              <TableCell sx={{ fontWeight: '600' }} align="right">Subject</TableCell>
              <TableCell sx={{ fontWeight: '600' }} align="right">Exam type</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {examinations.map((examination) => (
              <TableRow
                key={examination._id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell align="right" component="th" scope="examination">
                  {new Date(examination.examDate).toLocaleDateString('en-GB', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                  })}
                </TableCell>

                <TableCell align="right">{examination.subject.subject_name}</TableCell>
                <TableCell align="right">{examination.examType}</TableCell>
               
              </TableRow>
            ))}

          </TableBody>
        </Table>
       

      </TableContainer>
    </>
  );
}
