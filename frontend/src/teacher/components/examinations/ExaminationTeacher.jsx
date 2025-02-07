import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Box, Button, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import axios from 'axios'
import { baseApi } from '../../../environment';


export default function ExaminationTeacher() {

  const [examinations, setExaminations] = React.useState([])
  const [classes, setClasses] = React.useState([])
  const [selectedClass, setSelectedClass] = React.useState('')

 
 

  const fetchClasses = async () => {

    try {
      const response = await axios.get(`${baseApi}/class/all`)
      // console.log('subjects', response)
      setClasses(response.data.data)
      setSelectedClass(response.data.data[0]._id)
    } catch (error) {
      console.log(error)
    }
  }

  const fetchExaminations = async () => {

    try {
      const response = await axios.get(`${baseApi}/examination/class/${selectedClass}`)
      console.log('exams', response)
      setExaminations(response.data.examination)
    } catch (error) {
      console.log('error in fetching exams', error)
    }
  }

  

  React.useEffect(() => {
    fetchExaminations()
  }, [selectedClass])

  React.useEffect(() => {
    fetchClasses()
  }, [])

  return (
    <>
      <Paper sx={{ marginBottom: '20px' }}>
        <Box>
          <FormControl sx={{ margin: '10px', minWidth: '210px' }}
          >
            <InputLabel id="demo-simple-select-label">Select Class</InputLabel>
            <Select
              value={selectedClass}
              label="Class"
              onChange={(e) => setSelectedClass(e.target.value)}
            >
              <MenuItem value={""}>Select Class</MenuItem>
              {classes ? classes.map(item => {
                return <MenuItem key={item._id} value={item._id}>{item.class_text}</MenuItem>
              }) : null}

            </Select>
          </FormControl>
        </Box>
      </Paper>

      

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
