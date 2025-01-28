import { Box, Button, Paper, TextField, Typography } from '@mui/material'
import { useFormik } from 'formik'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { classSchema } from '../../../yupSchema/classSchema'
import { baseApi } from '../../../environment'
import { toast} from 'react-toastify'


function Class() {
  const [classes,setClasses]=useState([])

  const formik=useFormik({
    initialValues:{class_text:'',class_num:''},
    validationSchema:classSchema,
    onSubmit:(values)=>{
      // api
      axios.post(`${baseApi}/class/create`,{...values}).then(res=>{
        console.log(res)
        toast.success('class added successfully')
      }).catch((err)=>{
        console.log(err)
        toast.error(err)
      })
      formik.resetForm()
    }
    
  })

const fetchAllClasses=async(req,res)=>{
  axios.get(`${baseApi}/class/all`).then(res=>{
    setClasses(res.data.data)
  }).catch(err=>{
    console.log(err)
  })
}

  useEffect(()=>{
    fetchAllClasses()
  },[])

  return (
    <>
      <Box
      component="div"
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '80vh',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
      }}
    >
      {/* <ParticlesBg className="particles"  color="#ff0000" type="color" bg={true} /> */}
      <Paper
        elevation={3}
        sx={{

          padding: 3,
          margin: 'auto',
          // maxWidth: '550px',
          width:'60vw',
          backgroundColor: 'rgba(255, 255, 255, 0.2)', 
          backdropFilter: 'blur(5px)'
        }}
      >
        <Box
          component="form"
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 3,
            alignItems: 'left',
          }}
          noValidate
          onSubmit={formik.handleSubmit}
          autoComplete="off"
        >
          <Typography variant={'h4'} sx={{ textAlign: 'center', margin: '0', padding: '0', fontWeight: '800' }}>
           Add Class
          </Typography>


          <TextField
            name="class_text"
            label="Class in text"
            variant="outlined"
            fullWidth
            value={formik.values.class_text}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.class_text && Boolean(formik.errors.class_text)}
            helperText={formik.touched.class_text && formik.errors.class_text}
          />

          <TextField
            name="class_num"
            label="class in number"
            variant="outlined"
            type='number'
            fullWidth
            value={formik.values.class_num}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.class_num && Boolean(formik.errors.class_num)}
            helperText={formik.touched.class_num && formik.errors.class_num}
          />


          <Button
            type="submit"
            variant="contained"
            size="large"
            sx={{
              width: '100%',
              backgroundColor: '#1976d2',
              color: '#fff',
              ':hover': { backgroundColor: '#115293' },
            }}
          >
            Submit
          </Button>
        </Box>
      </Paper>
    </Box>

    {/* class display */}
    <Box component={'div'} sx={{display:'flex',flexDirection:'row',flexWrap:'wrap'}}>
      {
        classes&&classes.map(item=>{
          return <Box key={item._id}>
            <Typography>Class: {item.class_text} [{item.class_num}]</Typography>
          </Box>
        })
      }
    </Box>
    </>
  )
}

export default Class
