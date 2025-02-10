import axios from 'axios'
import React, { useEffect, useState } from 'react'
import {Link, useNavigate, useParams} from 'react-router-dom'
import { baseApi } from '../../../environment'
import { PieChart } from '@mui/x-charts/PieChart';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid2';
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  ...theme.applyStyles('dark', {
    backgroundColor: '#1A2027',
  }),
}));


function AttendenceStudent() {

    const[attendenceData,setAttendenceData]=useState([])
    const [studentId,setStudentId]=useState(null)
   
    const[present,setPresent]=useState(0)
    const[absent,setAbsent]=useState(0)
    // console.log(attendenceData)

    // convert date
    const convertData=(DateData)=>{
        const date=new Date

        return date.getDate()+ "-"+(+date.getMonth()+1)+"-"+date.getFullYear()
    }


    const fetchStudentDetails=async()=>{
      try {
        const response=await  axios.get(`${baseApi}/student/fetch-single`)
        setStudentId(response.data.student._id)
      } catch (error) {
        
      }
     
  
    }
useEffect(()=>{
  fetchStudentDetails()
},[])
    const fetchAttendenceData=async(studentId)=>{
        try {
      const response=await axios.get(`${baseApi}/attendence/${studentId}`)
      // console.log("fetchAttendence",response)
      setAttendenceData(response.data)
      const resData=response.data
      // console.log('resData',resData)
      if(resData){
        resData.forEach(attendence=>{
            if(attendence.status==='Present'){
                setPresent((prev)=>prev+1)
            }else if(attendence.status==='Absent'){
                setAbsent((prev)=>prev+1)
            }
          })
      }
        } catch (error) {
            console.log('fetchAttendence',error)
        }
    }

    useEffect(()=>{
      if(studentId){
        fetchAttendenceData()
      }
    },[studentId])
  return (
    <div>
      <h2>Attendence Details</h2>
      <Grid container spacing={2}>
        <Grid size={6}>
          <Item>
            {/* pie Chart */}
          <PieChart
      series={[
        {
          data: [
            { id: 0, value: present, label: 'Present' },
            { id: 1, value: absent, label: 'Absent' },
          ],
        },
      ]}
      width={400}
      height={200}
    />
          </Item>
        </Grid>
        <Grid size={6}>
          <Item>
            {/* table */}
            <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell align="right">Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {attendenceData.map((attendence) => (
            <TableRow
              key={attendence._id}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {convertData(attendence.date)}
              </TableCell>
              <TableCell align="right">{attendence.status}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
          </Item>
        </Grid>
      </Grid>
    </div>
  )
}

export default AttendenceStudent

