import { Box, Paper, Typography } from '@mui/material'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { baseApi } from '../../../environment'

function NoticeStudent() {
  const [notices, setNotices] = useState([])


  const fetchAllNotices = async (req, res) => {
    axios.get(`${baseApi}/notice/student`).then(res => {
      setNotices(res.data.data)
    }).catch(err => {
      console.log(err)
    })
  }

  useEffect(() => {
    fetchAllNotices()
  }, [])

  return (
    <div >
   
   <Typography variant={'h4'} sx={{ textAlign: 'center', margin: '0', padding: '0', fontWeight: '800', fontFamily: 'Courier New' }}>
              Notices
              </Typography>

      {/* notice display */}
      <Box component={'div'} sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
        {

          notices && notices.map(item => {
            return <Paper key={item._id} sx={{ border: '1px grey solid', margin: '20px', p: 1}}>
              <Box component={'div'} sx={{maxWidth:'600px'}}>
                <Typography sx={{color:'grey'}}  variant='h5'>{item.title}</Typography>
                <Typography sx={{fontSize:'16px'}} variant='h6'>{item.message}</Typography>
                {/* <Typography sx={{color:'darkBrown'}} variant='h6'>For:({item.audience})</Typography> */}
                </Box>
            </Paper>
          })
        }
      </Box>
    </div>
  )
}

export default NoticeStudent
