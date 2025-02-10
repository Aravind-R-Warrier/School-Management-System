import { Box, Button, FormControl, InputLabel, MenuItem, Select, Typography } from '@mui/material'
import axios from 'axios'
import React, { useEffect } from 'react'
import { useState } from 'react'
import { baseApi } from '../../../environment'
import { toast } from 'react-toastify'

function Attendee({classId}) {
   const[teachers,setTeachers]=useState([])
   const[selectedTeacher,setSelectedTeacher]=useState('')
    const[attendee,setAttendee]=useState(null)
// teachers fetching
  const fetchTeachers=async()=>{
    axios.get(`${baseApi}/teacher/fetch-with-query`,{params:{}}).then(res=>{
      setTeachers(res.data.teachers)
    //   console.log(res)
  }).catch(er=>{
    console.log(er)
  })
  }
// attendee changing
  const handleSubmit=async()=>{
    if(selectedTeacher){
      try {
        const response=await axios.patch(`${baseApi}/class/update/${classId}`,{attendee:selectedTeacher})
        // console.log('update',response)  
        toast.success('Updated Attendee')
        fetchClassDetails()
       } catch (error) {
        console.log(error)
        toast.error("failed to update Attendee")
       }
    }else{
      alert('please select teacher')
    }
   
  }

  // classDetails
const fetchClassDetails=async()=>{
  try {
    if(classId){
      const response=await axios.get(`${baseApi}/class/single/${classId}`)
      setAttendee(response.data.data.attendee?response.data.data.attendee:null)
      // console.log(response)
      }
    
  } catch (error) {
    console.log(error)
  }
}

    useEffect(()=>{
        // console.log('classId',classId)
        fetchClassDetails()
        fetchTeachers()
    },[classId])
  return (
    <>


      <h1>Attendee</h1>
      <Box>
     {attendee&& <Box component={'div'} sx={{display:'flex',justifyContent:'center',flexDirection:'row'}}>
        <Typography variant='h5' color='green'>
          Attendee Teacher:
        </Typography>
        <Typography variant='h6' color='black'>
         {attendee.name}
        </Typography>
      </Box>}
      <FormControl sx={{ width: '180px', marginLeft: '5px' }}>
  <InputLabel>Select Teachers</InputLabel>
  <Select
    value={selectedTeacher}
    onChange={(e) => {
     setSelectedTeacher(e.target.value)
    }}
    sx={{ color: '#333333', backgroundColor: '#FFFFFF' }}
    >
    <MenuItem value=''>Select Teacher</MenuItem>
    {teachers.map((teacher) => (
      <MenuItem key={teacher._id} value={teacher._id}>{teacher.name}</MenuItem>
    ))}
  </Select>
</FormControl>
<Button onClick={handleSubmit} sx={{backgroundColor:'lightgreen',marginLeft:'5px',marginTop:'10px'}}>{attendee?'change Attendee':"Select Attendee"}</Button>

      </Box>


    </>
  )
}

export default Attendee
