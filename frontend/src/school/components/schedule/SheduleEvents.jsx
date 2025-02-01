import { Box, Button, FormControl, InputLabel, MenuItem, Select, Typography } from "@mui/material";
import { periodSchema } from "../../../yupSchema/periodSchema";
import { useEffect, useState } from "react";
import { useFormik } from "formik";
import axios from "axios";
import { baseApi } from "../../../environment";

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";

export default function SheduleEvents({ onClose }) {
  const periods = [
    { id: 1, label: "Period 1 (10:00 AM - 11:00 AM)", startTime: "10:00", endTime: "11:00" },
    { id: 2, label: "Period 2 (11:00 AM - 12:00 PM)", startTime: "11:00", endTime: "12:00" },
    { id: 3, label: "Period 3 (12:00 PM - 1:00 PM)", startTime: "12:00", endTime: "13:00" },
    { id: 4, label: "Lunch Break (1:00 PM - 2:00 PM)", startTime: "13:00", endTime: "14:00" },
    { id: 5, label: "Period 4 (2:00 PM - 3:00 PM)", startTime: "14:00", endTime: "15:00" },
    { id: 6, label: "Period 5 (3:00 PM - 4:00 PM)", startTime: "15:00", endTime: "16:00" },
  ];

  const [teachers, setTeachers] = useState([]);
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const teacherData = await axios.get(`${baseApi}/teacher/fetch-with-query`);
        const subjectResponse = await axios.get(`${baseApi}/subject/all`);
        setTeachers(teacherData.data.teachers);
        setSubjects(subjectResponse.data.data);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };
    fetchData();
  }, []);

  const formik = useFormik({
    initialValues: {
      teacher: "",
      subject: "",
      period: "",
      date: null,
    },
    validationSchema: periodSchema,
    onSubmit: (values) => {
      console.log("Form Submitted:", values);
      onClose(); // Close modal/dialog after submission
    },
  });

  return (
    <Box
      component="form"
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 3,
        p: 3,
        width: "400px",
        backgroundColor:'white'
      }}
      noValidate
      onSubmit={formik.handleSubmit}
    >
      <Typography variant="h5">Schedule Event</Typography>

      {/* Teacher Selection */}
      <FormControl fullWidth error={formik.touched.teacher && Boolean(formik.errors.teacher)}>
        <InputLabel>Teachers</InputLabel>
        <Select
          value={formik.values.teacher}
          name="teacher"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        >
          {teachers.map((item) => (
            <MenuItem key={item._id} value={item._id}>
              {item.name}
            </MenuItem>
          ))}
        </Select>
        {formik.touched.teacher && <Typography color="error">{formik.errors.teacher}</Typography>}
      </FormControl>

      {/* Subject Selection */}
      <FormControl fullWidth error={formik.touched.subject && Boolean(formik.errors.subject)}>
        <InputLabel>Subjects</InputLabel>
        <Select
          value={formik.values.subject}
          name="subject"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        >
          {subjects.map((item) => (
            <MenuItem key={item._id} value={item._id}>
              {item.subject_name}
            </MenuItem>
          ))}
        </Select>
        {formik.touched.subject && <Typography color="error">{formik.errors.subject}</Typography>}
      </FormControl>

      {/* Period Selection */}
      <FormControl fullWidth error={formik.touched.period && Boolean(formik.errors.period)}>
        <InputLabel>Period</InputLabel>
        <Select
          value={formik.values.period}
          name="period"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        >
          {periods.map((item) => (
            <MenuItem key={item.id} value={`${item.startTime},${item.endTime}`}>
              {item.label}
            </MenuItem>
          ))}
        </Select>
        {formik.touched.period && <Typography color="error">{formik.errors.period}</Typography>}
      </FormControl>

      {/* Date Picker */}
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          label="Select Date"
          value={formik.values.date ? dayjs(formik.values.date) : null}
          onChange={(newDate) => formik.setFieldValue("date", newDate)}
          renderInput={(params) => <TextField {...params} fullWidth />}
        />
        {formik.touched.date && <Typography color="error">{formik.errors.date}</Typography>}
      </LocalizationProvider>

      {/* Submit Button */}
      <Button variant="contained" color="primary" type="submit">
        Submit
      </Button>
    </Box>
  );
}
