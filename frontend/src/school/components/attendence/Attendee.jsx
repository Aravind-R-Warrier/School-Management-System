import { Box, FormControl, InputLabel, MenuItem, Select } from '@mui/material'
import axios from 'axios'
import React, { useEffect } from 'react'
import { useState } from 'react'
import { baseApi } from '../../../environment'

function Attendee({classId}) {
   const[teachers,setTeachers]=useState([])
   const[selectedTeacher,setSelectedTeacher]=useState('')
    
// teachers fetching
  const fetchTeachers=async()=>{
    axios.get(`${baseApi}/teacher/fetch-with-query`,{params:{}}).then(res=>{
      setTeachers(res.data.teachers)
    //   console.log(res)
  }).catch(er=>{
    console.log(er)
  })
  }

    useEffect(()=>{
        // console.log('classId',classId)
        fetchTeachers()
    },[classId])
  return (
    <>


      <h1>Attendee</h1>
      <Box>
      <FormControl sx={{ width: '180px', marginLeft: '5px' }}>
  <InputLabel>Select Teachers</InputLabel>
  <Select
    value={selectedTeacher}
    onChange={(e) => {
     setSelectedTeacher(e.target.value)
    }}
    sx={{ backgroundColor: 'rgba(255, 255, 255, 0.9)' }}
  >
    <MenuItem value=''>Select Teacher</MenuItem>
    {teachers.map((teacher) => (
      <MenuItem key={teacher._id} value={teacher._id}>{teacher.name}</MenuItem>
    ))}
  </Select>
</FormControl>
      </Box>


    </>
  )
}

export default Attendee
