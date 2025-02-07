import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { baseApi } from '../../../environment';
import { Alert, Box, Button, FormControl, InputLabel, MenuItem, Paper, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { toast } from 'react-toastify';

function AttendenceTeachers() {
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [students, setStudents] = useState([]);
  const [attendenceStatus, setAttendenceStatus] = useState({});
  const [attendanceChecked, setAttendanceChecked] = useState(false);

  // Fetch teacher's assigned classes
  const fetchAttendeeClass = async () => {
    try {
      const response = await axios.get(`${baseApi}/class/attendee`);
      setClasses(response.data.data);

      if (response.data.data.length > 0) {
        setSelectedClass(response.data.data[0]._id);
      }
    } catch (error) {
      console.error('Error fetching classes:', error);
    }
  };

  useEffect(() => {
    fetchAttendeeClass();
  }, []);

  // Check if attendance has already been taken, then fetch students
  const checkAttendanceAndFetchStudents = async () => {
    if (!selectedClass) return;

    try {
      const response = await axios.get(`${baseApi}/attendence/check/${selectedClass}`);
      const attendanceAlreadyTaken = response.data.attendenceTaken;

      if (attendanceAlreadyTaken) {
        setAttendanceChecked(true);
        setStudents([]);
      } else {
        setAttendanceChecked(false);
        const studentResponse = await axios.get(`${baseApi}/student/fetch-with-query`, {
          params: { student_class: selectedClass }
        });

        setStudents(studentResponse.data.students);
        studentResponse.data.students.forEach(student => handleAttendance(student._id, 'Present'));
      }
    } catch (error) {
      console.error('Error checking attendance:', error);
    }
  };

  useEffect(() => {
    checkAttendanceAndFetchStudents();
  }, [selectedClass]);

  // Update attendance state
  const handleAttendance = (student_id, status) => {
    setAttendenceStatus((prev) => ({
      ...prev,
      [student_id]: status
    }));
    setAttendanceChecked(false);
  };

  // Submit attendance for all students
  const submitAttendance = async () => {
    try {
      await Promise.all(
        students.map((student) =>
          axios.post(`${baseApi}/attendence/mark`, {
            student_id: student._id,
            date: new Date(),
            classId: selectedClass,
            status: attendenceStatus[student._id],
          })
        )
      );
      toast.success("Successfully submitted attendance");
      setAttendanceChecked(true);
    } catch (error) {
      console.error('Error submitting attendance:', error);
      toast.error("Failed to submit attendance");
    }
  };

  return (
    <>
      {classes.length > 0 ? <Paper sx={{ marginBottom: '20px' }}>
        <Box>
          <Alert severity="success">
            You Are Attendee Of {classes.length} classes
          </Alert>
          <FormControl sx={{ margin: '10px', minWidth: '210px' }}>
            <InputLabel>Select Class</InputLabel>
            <Select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
            >
              <MenuItem value={""}>Select Class</MenuItem>
              {classes.map(item => (
                <MenuItem key={item._id} value={item._id}>{item.class_text}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Paper> : <p style={{ textAlign: 'center', color: 'red' }}>You are not attendee of any class</p>}

      {(students.length > 0 && !attendanceChecked) ?
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: '600' }} align='right'>Name</TableCell>
                <TableCell sx={{ fontWeight: '600' }} align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {students.map((student) => (
                <TableRow key={student._id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell align="right">{student.name}</TableCell>
                  <TableCell align="right">
                    <FormControl sx={{ margin: '10px', minWidth: '210px' }}>
                      <InputLabel>Mark Attendance</InputLabel>
                      <Select
                        value={attendenceStatus[student._id]}
                        onChange={(e) => handleAttendance(student._id, e.target.value)}
                      >
                        <MenuItem value={"Present"}>Present</MenuItem>
                        <MenuItem value={"Absent"}>Absent</MenuItem>
                      </Select>
                    </FormControl>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Button onClick={submitAttendance} variant='contained'>Take Attendance</Button>
        </TableContainer>
        : attendanceChecked ?
          <p style={{ color: 'red', textAlign: 'center' }}>Attendance Already Taken For This Class</p> :
          <p style={{ color: 'red', textAlign: 'center' }}>There is no student in this class</p>}
    </>
  );
}

export default AttendenceTeachers;
