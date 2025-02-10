import { Box, Button, IconButton, Paper, TextField, Typography } from '@mui/material'
import { useFormik } from 'formik'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { classSchema } from '../../../yupSchema/classSchema'
import { baseApi } from '../../../environment'
import { toast} from 'react-toastify'
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';


function Class() {
  const [classes,setClasses]=useState([])
  const [edit,setEdit]=useState(false)
  const [editId,setEditId]=useState(null)

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`${baseApi}/class/delete/${id}`);
      toast.success(response.data.message);
      fetchAllClasses(); 
    } catch (err) {
      console.error('Error deleting class:', err);
      toast.error(err.response?.data?.message || 'Error deleting class');
    }
  };
  

const handleEdit=(id,class_text,class_num)=>{
  // console.log(id)
  setEdit(true)
  formik.setFieldValue('class_text',class_text)
  formik.setFieldValue('class_num',class_num)
  setEditId(id)
}
const cancelEdit=()=>{
  setEditId(null)
  setEdit(false)
  formik.setFieldValue('class_text',"")
  formik.setFieldValue('class_num',"")
}

  const formik=useFormik({
    initialValues:{class_text:'',class_num:''},
    validationSchema:classSchema,
    onSubmit:(values)=>{
      // api for creation and edit
      if(edit){
        axios.patch(`${baseApi}/class/update/${editId}`,{...values}).then(res=>{
          // console.log(res)
          toast.success('class Edited successfully')
        }).catch((err)=>{
          console.log(err,'error in updating')
          toast.error(err,'error in Editing')
        })
        formik.resetForm()

      }else{
        axios.post(`${baseApi}/class/create`,{...values}).then(res=>{
          // console.log(res)
          toast.success('class added successfully')
        }).catch((err)=>{
          console.log(err)
          toast.error(err)
        })
        formik.resetForm()
      }


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
  },[formik])

  return (
    <div style={{}}>
      <Box
      component="div"
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '60vh',
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
          backgroundColor: "rgba(255, 255, 255, 0.9)",
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
          {
            edit?  <Typography variant={'h4'} sx={{ textAlign: 'center', margin: '0', padding: '0', fontWeight: '800',fontFamily:'Courier New', color: '#333333' }}>
            Edit Class
           </Typography>:  <Typography variant={'h4'} sx={{ textAlign: 'center', margin: '0', padding: '0', fontWeight: '800',fontFamily:'Courier New', color: '#333333'}}>
           Add Class
          </Typography>
          }
        


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
            sx={{
              input: { color: '#333333' }, // Ensures text inside input is visible
              backgroundColor: '#FFFFFF',
            }}
          />

          <TextField
            name="class_num"
            label="class division"
            variant="outlined"
            fullWidth
            value={formik.values.class_num}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.class_num && Boolean(formik.errors.class_num)}
            helperText={formik.touched.class_num && formik.errors.class_num}
            sx={{
              input: { color: '#333333' }, // Ensures text inside input is visible
              backgroundColor: '#FFFFFF',
            }}
          />


<Button
            type="submit"
            style={{background:'#036E66'}}
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
{edit&&
  <Button
            type="submit"
            variant="outlined"
            size="large"
            sx={{
              width: '100%',
              backgroundColor: '#9999',
              color: 'black',
              ':hover': { backgroundColor: '#115293' },
            }}
            onClick={()=>cancelEdit()}
          >
           cancel
          </Button>}

        </Box>
      </Paper>
    </Box>

    {/* class display */}
    <h2 style={{fontFamily:'Courier New',color:'skyblue',textAlign:'center'}}>Added Classes</h2>
    <Box component={'div'} sx={{display:'flex',flexDirection:'row',flexWrap:'wrap'}}>
      {
        
        classes&&classes.map(item=>{
          return <Paper key={item._id} sx={{border:'1px black solid',margin:'20px',p:2}}>
         <Box component={'div'}><Typography variant='h5'>Class: {item.class_text} [{item.class_num}]</Typography></Box> 
         <Box component={'div'}>
        <Button onClick={()=>handleEdit(item._id,item.class_text,item.class_num)}><EditIcon/></Button>
        <IconButton color="error" onClick={() => handleDelete(item._id)}>
                  <DeleteIcon />
                </IconButton>
         </Box>
          </Paper>
        })
      }
    </Box>
    </div>
  )
}

export default Class
