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
        src="https://static.vecteezy.com/system/resources/thumbnails/008/040/410/small_2x/school-logo-design-template-free-vector.jpg"
        alt="School Logo"
        style={{ height: '30px', padding: '4px',}}
      />
      <Typography color='black' variant='h5' sx={{ fontWeight: 'bold' }}>School Breeze</Typography>
      <Typography color='black' variant='body2'>Copyright &copy; 2055 | All Rights Reserved</Typography>
    </Box>
  );
}

export default Footer;
