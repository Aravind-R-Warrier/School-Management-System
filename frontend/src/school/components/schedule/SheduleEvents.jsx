import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
  TextField,
} from "@mui/material";
import { periodSchema } from "../../../yupSchema/periodSchema";
import { useEffect, useState } from "react";
import { useFormik } from "formik";
import axios from "axios";
import { toast } from "react-toastify";
import { baseApi } from "../../../environment";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";

export default function ScheduleEvents({ selectedClass, handleClose, edit, selectedEventId }) {
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
      date: new Date(),
    },
    validationSchema: periodSchema,
    onSubmit: (values) => {
      let date = new Date(values.date);
      let [startTime, endTime] = values.period.split(",");

      let BACKEND_URL = edit ? `${baseApi}/schedule/update/${selectedEventId}` : `${baseApi}/schedule/create`;

      axios
        .post(BACKEND_URL, {
          ...values,
          selectedClass,
          startTime: new Date(date.setHours(startTime.split(":")[0], startTime.split(":")[1])),
          endTime: new Date(date.setHours(endTime.split(":")[0], endTime.split(":")[1])),
        })
        .then((res) => {
          toast.success(res.data.message);
          formik.resetForm();
          handleClose();
        })
        .catch((err) => {
          console.error(err);
          toast.error("Error in creating Schedule");
        });
    },
  });

  return (
    <Box
      component="form"
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 3,
        p: 4,
        width: "450px",
        backgroundColor: "#f9f9f9",
        borderRadius: "8px",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
        fontFamily:'New Courier'
      }}
      onSubmit={formik.handleSubmit}
    >
      <Typography variant="h5" align="center" sx={{ fontWeight: "bold", color: "#333" }}>
        {edit ? "Edit Period" : "Add New Period"}
      </Typography>

      <FormControl fullWidth>
        <InputLabel>Teacher</InputLabel>
        <Select value={formik.values.teacher} name="teacher" onChange={formik.handleChange}>
          {teachers.map((item) => (
            <MenuItem key={item._id} value={item._id}>
              {item.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth>
        <InputLabel>Subject</InputLabel>
        <Select value={formik.values.subject} name="subject" onChange={formik.handleChange}>
          {subjects.map((item) => (
            <MenuItem key={item._id} value={item._id}>
              {item.subject_name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth>
        <InputLabel>Period</InputLabel>
        <Select value={formik.values.period} name="period" onChange={formik.handleChange}>
          {periods.map((item) => (
            <MenuItem key={item.id} value={`${item.startTime},${item.endTime}`}>
              {item.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          label="Select Date"
          value={formik.values.date ? dayjs(formik.values.date) : null}
          onChange={(newValue) => formik.setFieldValue("date", newValue)}
          renderInput={(params) => <TextField {...params} fullWidth />}
        />
      </LocalizationProvider>

      <Box display="flex" justifyContent="space-between">
        <Button variant="contained" color="primary" type="submit" fullWidth>
          Submit
        </Button>
        {edit && (
          <Button
            variant="contained"
            sx={{ backgroundColor: "#FF5252", color: "white", ml: 1 }}
            onClick={() => confirm("Are you sure?") && axios.delete(`${baseApi}/schedule/delete/${selectedEventId}`).then(() => { toast.success("Deleted successfully"); handleClose(); })}
            fullWidth
          >
            Delete
          </Button>
        )}
      </Box>

      <Button variant="outlined" color="secondary" onClick={handleClose} fullWidth>
        Cancel
      </Button>
    </Box>
  );
}
