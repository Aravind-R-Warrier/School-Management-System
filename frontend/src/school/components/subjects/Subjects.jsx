import { Box, Button, Paper, TextField, Typography } from '@mui/material'
import { useFormik } from 'formik'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { subjectSchema } from '../../../yupSchema/subjectSchema'
import { baseApi } from '../../../environment'
import { toast} from 'react-toastify'
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';


function Subjects() {
  const [subjects,setSubjects]=useState([])
  const [edit,setEdit]=useState(false)
  const [editId,setEditId]=useState(null)

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`${baseApi}/subject/delete/${id}`);
      toast.success(response.data.message);
      fetchAllClasses(); 
    } catch (err) {
      console.error('Error deleting subject:', err);
      toast.error(err.response?.data?.message || 'Error deleting subject');
    }
  };
  

const handleEdit=(id,subject_name,subject_codename)=>{
  console.log(id)
  setEdit(true)
  formik.setFieldValue('subject_name',subject_name)
  formik.setFieldValue('subject_codename',subject_codename)
  setEditId(id)
}
const cancelEdit=()=>{
  setEditId(null)
  setEdit(false)
  formik.setFieldValue('subject_name',"")
  formik.setFieldValue('subject_codename',"")
}

  const formik=useFormik({
    initialValues:{subject_name:'',subject_codename:''},
    validationSchema:subjectSchema,
    onSubmit:(values)=>{
      // api for creation and edit
      if(edit){
        axios.patch(`${baseApi}/subject/update/${editId}`,{...values}).then(res=>{
          console.log(res)
          toast.success('subject Edited successfully')
        }).catch((err)=>{
          console.log(err,'error in updating')
          toast.error(err,'error in Editing')
        })
        formik.resetForm()

      }else{
        axios.post(`${baseApi}/subject/create`,{...values}).then(res=>{
          console.log(res)
          toast.success('subject added successfully')
        }).catch((err)=>{
          console.log(err)
          toast.error(err)
        })
        formik.resetForm()
      }


     }     
    
  })

const fetchAllClasses=async(req,res)=>{
  axios.get(`${baseApi}/subject/all`).then(res=>{
    setSubjects(res.data.data)
  }).catch(err=>{
    console.log(err)
  })
}

  useEffect(()=>{
    fetchAllClasses()
  },[formik])

  return (
    <div style={{background:'#024950'}}>
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
          height:'40vh',
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
            gap: 1,
            alignItems: 'left',
          }}
          noValidate
          onSubmit={formik.handleSubmit}
          autoComplete="off"
        >
          {
            edit?  <Typography variant={'h4'} sx={{ textAlign: 'center', margin: '0', padding: '0', fontWeight: '800',fontFamily:'Courier New' }}>
            Edit Subject
           </Typography>:  <Typography variant={'h4'} sx={{ textAlign: 'center', margin: '0', padding: '0', fontWeight: '800',fontFamily:'Courier New' }}>
           Add Subject
          </Typography>
          }
        


          <TextField
            name="subject_name"
            label="Subject in text"
            variant="outlined"
            fullWidth
            value={formik.values.subject_name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.subject_name && Boolean(formik.errors.subject_name)}
            helperText={formik.touched.subject_name && formik.errors.subject_name}
          />

          <TextField
            name="subject_codename"
            label="Subject code"
            variant="outlined"
            fullWidth
            value={formik.values.subject_codename}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.subject_codename && Boolean(formik.errors.subject_codename)}
            helperText={formik.touched.subject_codename && formik.errors.subject_codename}
          />


<Button
            type="submit"
            style={{background:'#036E66'}}
            size="medium"
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
            size="medium"
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

    {/* Subject display */}
    <h2 style={{fontFamily:'Courier New',color:'skyblue',textAlign:'center'}}>Added Subjects</h2>
    <Box component={'div'} sx={{display:'flex',flexDirection:'row',flexWrap:'wrap'}}>
      {
        
        subjects&&subjects.map(item=>{
          return <Paper key={item._id} sx={{border:'1px black solid',margin:'20px',p:2}}>
         <Box component={'div'}><Typography style={{fontFamily:'Courier New'}} variant='h5'>Subject: {item.subject_name} [{item.subject_codename}]</Typography></Box> 
         <Box component={'div'}>
        <Button onClick={()=>handleEdit(item._id,item.subject_name,item.subject_codename)}><EditIcon/></Button>
        <Button onClick={()=>handleDelete(item._id)}><DeleteIcon/></Button>
         </Box>
          </Paper>
        })
      }
    </Box>
    </div>
  )
}

export default Subjects
