import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { Button, Typography, Paper, FormControl, InputLabel, Select, MenuItem, TableContainer, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import axios from 'axios';
import { toast } from 'react-toastify';
import { baseApi } from '../../../environment';
import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid2';
import Attendee from './Attendee';
import { Link } from 'react-router-dom';

// Styled Grid
const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function AttendenceStudentList() {
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [params, setParams] = useState({});
  const [attendenceData, setAttendenceData] = useState({});
  const[selectedClass,setSelectedClass]=useState(null)
  useEffect(() => {
    fetchClasses();
  }, []);

  useEffect(() => {
    fetchStudents();
  }, [params]);

  useEffect(() => {
    if (students.length > 0) {
      fetchAttendenceForStudents(students);
    }
  }, [students]);

  const fetchClasses = async () => {
    try {
      const res = await axios.get(`${baseApi}/class/all`);
      setClasses(res.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchStudents = async () => {
    try {
      const res = await axios.get(`${baseApi}/student/fetch-with-query`, { params });
      setStudents(res.data.students);
    } catch (err) {
      console.log(err);
    }
  };

// for students
  const fetchAttendenceForStudents = async (studentList) => {
    const attendencePromises = studentList.map((student) => fetchAttendenceForStudent(student._id));
    const result = await Promise.all(attendencePromises);
    const updatedAttendences = {};
    result.forEach(({ studentId, attendencePercentage }) => {
      updatedAttendences[studentId] = attendencePercentage;
    });
    setAttendenceData(updatedAttendences);
  };

  //for student
  const fetchAttendenceForStudent = async (studentId) => {
    try {
      const response = await axios.get(`${baseApi}/attendence/${studentId}`);
      const attendenceRecord = Array.isArray(response.data) ? response.data : []; 
  
      const totalClasses = attendenceRecord.length;
      const presentCount = attendenceRecord.filter((rec) => rec.status === 'Present').length;
      
      const attendencePercentage = totalClasses > 0 ? (presentCount / totalClasses) * 100 : 0;
      
      return { studentId, attendencePercentage };
    } catch (error) {
      console.log(error);
      return { studentId, attendencePercentage: 0 };
    }
  };
  



  return (
    <div style={{ background: 'linear-gradient(to right, #024950, #027368)' }}>
      <Typography sx={{ textAlign: 'center', fontSize: '36px', fontFamily: 'new courier' }}>
        Student Attendance
      </Typography>

      <Grid container spacing={2}>
        <Grid size={{ xs: 6, md: 4 }}>
          <Item>
            <Box component={'div'} sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', marginTop: '45px' }}>
              <TextField
                label="Search"
                value={params.search || ''}
                onChange={(e) => setParams((prev) => ({ ...prev, search: e.target.value }))}
                sx={{ backgroundColor: 'rgba(255, 255, 255, 0.9)' }}
              />
             <FormControl sx={{ width: '180px', marginLeft: '5px' }}>
  <InputLabel>Class</InputLabel>
  <Select
    value={params.student_class || ''}
    onChange={(e) => {
      const classId = e.target.value;
      setParams((prev) => ({ ...prev, student_class: classId }));
      setSelectedClass(classId); 
    }}
    sx={{ backgroundColor: 'rgba(255, 255, 255, 0.9)' }}
  >
    <MenuItem value=''>Select classes</MenuItem>
    {classes.map((item) => (
      <MenuItem key={item._id} value={item._id}>{item.class_text}</MenuItem>
    ))}
  </Select>
</FormControl>

            </Box>
            <Box>
            {selectedClass&&
               <Attendee classId={selectedClass}/>
            }
            </Box>
          </Item>
        </Grid>

        <Grid size={{ xs: 6, md: 8 }}>
          <Item>
            <Box component={'div'} sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', marginTop: '45px' }}>
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }}>
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell align="right">Gender</TableCell>
                      <TableCell align="right">Guardian Phone</TableCell>
                      <TableCell align="right">Class</TableCell>
                      <TableCell align="right">Percentage</TableCell>
                      <TableCell align="right">View</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {students.map((student) => (
                      <TableRow key={student._id}>
                        <TableCell>{student.name}</TableCell>
                        <TableCell align="right">{student.gender}</TableCell>
                        <TableCell align="right">{student.guardian_phone}</TableCell>
                        <TableCell align="right">{student.student_class?.class_text || 'N/A'}</TableCell>
                        <TableCell align="right">{attendenceData[student._id] !== undefined ? `${attendenceData[student._id].toFixed(2)}%` : 'No Data'}</TableCell>
                        <TableCell align="right"><Link to={`/school/attendence/${student._id}`}>Details</Link></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </Item>
        </Grid>
      </Grid>
    </div>
  );
}
