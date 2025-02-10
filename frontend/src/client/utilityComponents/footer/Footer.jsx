import React from 'react';
import { Box, Typography } from '@mui/material';

function Footer() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        // backgroundColor: '#2c3e50',
        // color: '#ecf0f1',
        padding: '20px',
        marginTop: '20px',
      }}
    >
      <img
        src="https://uxwing.com/wp-content/themes/uxwing/download/education-school/graduation-cap-icon.png"
        alt="School Logo"
        style={{ height: '50px', padding: '4px', marginBottom: '10px',position:'absolute',left:'639px',bottom:'-586px' }}
      />
      <Typography color='black' variant='h5' sx={{ fontWeight: 'bold' }}>School Breeze</Typography>
      <Typography color='black' variant='body2'>Copyright &copy; 2055 | All Rights Reserved</Typography>
    </Box>
  );
}

export default Footer;
