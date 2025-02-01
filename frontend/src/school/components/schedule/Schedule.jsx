import React, { useState } from 'react';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import { Box, Button } from '@mui/material';
import SheduleEvents from './sheduleEvents';

const localizer = momentLocalizer(moment);

const myEventsList = [
  {
    id: 1,
    title: "Subject: History, Teacher: Liza",
    start: new Date(new Date().setHours(11, 30)),
    end: new Date(new Date().setHours(14, 30)),
  },
];

function Schedule() {
  const [newPeriod,setNewPeriod]=useState(false)



  return (
    <div >
      <h1>Schedule</h1>
      <Button onClick={()=>setNewPeriod(true)}>Add new Period</Button>
      <Box sx={{display:'flex',justifyContent:'center'}} >
      {newPeriod && <SheduleEvents/>}
      </Box>
     
      <Calendar
        defaultView="week"
        views={['week','day','agenda']}
        step={30}
        min={new Date(1970, 1, 1, 10, 0, 0)}
        localizer={localizer}
        events={myEventsList}
        max={new Date(1970, 1, 1, 17, 0, 0)}
        startAccessor="start"
        endAccessor="end"
        showMultiDayTimes
        style={{ height: '100vh', width: '100%' }}
      />
    </div>
  );
}

export default Schedule;
