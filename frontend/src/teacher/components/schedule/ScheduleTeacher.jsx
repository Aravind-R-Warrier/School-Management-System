import React, { useState, useEffect } from 'react';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import { Box, Button, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import axios from 'axios';
import { baseApi } from '../../../environment';

const localizer = momentLocalizer(moment);

const myEventsList = [
  {
    id: 1,
    title: "Subject: History, Teacher: Liza",
    start: new Date(new Date().setHours(11, 30)),
    end: new Date(new Date().setHours(14, 30)),
  },
];

function ScheduleTeacher() {
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [events, setEvents] = useState(myEventsList)



  // api for classes to show in select component
  const fetchClasses = async () => {
    try {
      const res = await axios.get(`${baseApi}/class/all`);
      // console.log(res)
      if (res.data.data.length > 0) {
        setClasses(res.data.data);
        setSelectedClass(res.data.data[0]._id);
      }
    } catch (err) {
      console.error("Error fetching classes:", err);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);



  useEffect(() => {
    if (selectedClass) {
      axios.get(`${baseApi}/schedule/fetch-with-class/${selectedClass}`).then((res) => {
        // console.log(res.data.data)
        const resData = res.data.data.map((item) => {
          return {
            id: item._id,
            title: `Sub : ${item.subject.subject_name},Teacher : ${item.teacher.name}`,
            start: new Date(item.startTime),
            end: new Date(item.endTime)
          }
        })
        setEvents(resData)
        // console.log(events)
      }).catch((err) => {
        console.log(err)
      })
    }
  }, [selectedClass, events])

  return (
    <div style={{ fontFamily: 'New Courier' }}>
      {/* Assign class dropdown */}
      <FormControl sx={{ backgroundColor: 'white', width: '200px' }}>
        <InputLabel>Class</InputLabel>
        <Select sx={{ color: '#333333', backgroundColor: '#FFFFFF' }}
          value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)}>
          {classes.map((item) => (
            <MenuItem key={item._id} value={item._id}>
              {item.class_text} {item.class_num}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <h1>Schedule</h1>

      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
      </Box>

      {/* calender for schedule */}
      <Calendar
        defaultView="week"
        views={['week', 'day', 'agenda']}
        step={30}
        min={new Date(1970, 1, 1, 10, 0, 0)}
        localizer={localizer}
        events={events}
        max={new Date(1970, 1, 1, 17, 0, 0)}
        startAccessor="start"
        endAccessor="end"
        onSelectEvent={''}
        showMultiDayTimes
        style={{ height: '100vh', width: '100%' }}
      />
    </div>
  );
}

export default ScheduleTeacher;
