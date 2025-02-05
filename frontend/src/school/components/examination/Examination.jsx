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
import { useFormik } from "formik";
import { ExaminationSchema } from '../../../yupSchema/examinationSchema';
import axios from 'axios'
import { baseApi } from '../../../environment';
import { toast } from 'react-toastify'

export default function Examination() {

  const [examinations, setExaminations] = React.useState([])
  const [subject, setSubjects] = React.useState([])
  const [classes, setClasses] = React.useState([])
  const [selectedClass, setSelectedClass] = React.useState('')
  const initialValues = {
    date: '',
    subject: '',
    examType: ''
  }
  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: ExaminationSchema,
    onSubmit: async (value) => {
      try {
        // console.log('examination', value)
        const response = await axios.post(`${baseApi}/examination/create/`, { date: value.date, subjectId: value.subject, classId: selectedClass, examType: value.examType })
        console.log(response, 'examination created')
        toast.success(response.data.message)
        formik.resetForm()
      } catch (error) {
        console.log(error, 'error in creating examination')
        toast.error("error in adding examination")
      }

    }
  })

  const fetchSubject = async () => {

    try {
      const response = await axios.get(`${baseApi}/subject/all`)
      // console.log('subjects', response)
      setSubjects(response.data.data)
    } catch (error) {
      console.log(error)
    }
  }

  const fetchClasses = async () => {

    try {
      const response = await axios.get(`${baseApi}/class/all`)
      // console.log('subjects', response)
      setClasses(response.data.data)
    } catch (error) {
      console.log(error)
    }
  }

  React.useEffect(() => {
    fetchSubject()
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

      <Paper>
        <Box
          component="form"
          noValidate
          autoComplete="off"
          onSubmit={formik.handleSubmit}
          sx={{ width: '24vw', margin: 'auto', minWidth: '310px' }}
        >
          <Typography variant='h4' sx={{ fontFamily: 'New Courier' }}>
            Add New Exam
          </Typography>
          {/* date */}
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              fullWidth
              sx={{ marginTop: "10px" }}
              label="Select Date"
              name='date'
              value={formik.values.date ? dayjs(formik.values.date) : null}
              onChange={(newValue) => formik.setFieldValue("date", newValue)}
              onClose={() => formik.setFieldTouched("date", true)}
              slotProps={{
                textField: {
                  error: formik.touched.date && Boolean(formik.errors.date),
                  helperText: formik.touched.date && formik.errors.date,
                },
              }}
            />
          </LocalizationProvider>


          {/* select */}
          <FormControl fullWidth sx={{ marginTop: '10px' }}
          >
            <InputLabel id="demo-simple-select-label">Subject</InputLabel>
            <Select
              value={formik.values.subject}
              label="Subject"
              name='subject'
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.subject && Boolean(formik.errors.subject)}
              helperText={formik.touched.subject && formik.errors.subject}
            >
              <MenuItem value={""}>Select Subject</MenuItem>
              {subject ? subject.map(sub => {
                return <MenuItem key={sub._id} value={sub._id}>{sub.subject_name}</MenuItem>
              }) : null}

            </Select>
          </FormControl>


          <TextField name='examType'
            fullWidth
            sx={{ marginTop: '10px' }}
            value={formik.values.examType}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            label="Type of Exam"
            variant="filled"
            error={formik.touched.examType && Boolean(formik.errors.examType)}
            helperText={formik.touched.examType && formik.errors.examType} />

          <Button sx={{ marginTop: '10px' }} type='submit' variant='outlined'>Submit</Button>
        </Box>
      </Paper>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align='right'>Exam Date</TableCell>
              <TableCell align="right">Subject</TableCell>
              <TableCell align="right">Exam type</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {examinations.map((examination) => (
              <TableRow
                key={examination.name}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell align='right' component="th" scope="examination">
                  {examination.name}
                </TableCell>
                <TableCell align="right">{examination.calories}</TableCell>
                <TableCell align="right">{examination.fat}</TableCell>
                <TableCell align="right">{examination.carbs}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
