import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from './utilityComponents/navbar/Navbar'
import Footer from './utilityComponents/footer/Footer'
import { Box } from '@mui/material'

function Client() {
  return (
    <>
    <Navbar/>
    <Box sx={{minHeight:'80vh'}} component={'div'}>
    <Outlet/>
    </Box>
   
    <Footer/>
    </>
  )
}

export default Client
