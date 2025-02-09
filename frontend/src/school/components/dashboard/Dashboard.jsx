import axios from 'axios';
import { baseApi } from "../../../environment";
import React, { useEffect, useState, useRef } from 'react';
import { Box, Button, CardMedia, TextField, Typography } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { toast } from 'react-toastify';
function Dashboard() {
  const [school, setSchool] = useState(null);
  const[schoolName,setSchoolName]=useState('')
  const [edit, setEdit] = useState(false);
  const[classes,setClasses]=useState([])

  // Image handling
  const [file, setFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);

  const addImage = (event) => {
    const file = event.target.files[0];
  
    setImageUrl(URL.createObjectURL(file));
    setFile(file);
};


  const fileinputRef = useRef(null);

  const handleClearFile = () => {
    if (fileinputRef.current) {
      fileinputRef.current.value = '';
    }
    setFile(null);
    setImageUrl(null);
  };

  const fetchSchool = () => {
    axios
      .get(`${baseApi}/school/fetch-single`)
      .then((res) => {
        setSchool(res.data.school);
        setSchoolName(res.data.school.school_name)
      })
      .catch((err) => {
        console.error(err);
      });
  };



  const handleEditSubmit=async()=>{
    

    const fd=new FormData()
    fd.append('school_name',schoolName)
    if(file){
      fd.append('image',file,file.name)
    }
    axios.patch(`${baseApi}/school/update`,fd).then(res=>{
      // console.log('school edit:',res)
      toast.success('Edit Successfull')
      fetchSchool();
      handleCancelEdit()
    }).catch((err)=>{
      console.log(err)
      toast.error('edit failed',err)
    })
  }

  const handleCancelEdit=()=>{
    setEdit(false)
    handleClearFile()
  }

 

  // fetchStudents
  const fetchNumberOfClasses=async()=>{
  await  axios.get(`${baseApi}/class/all`).then(res=>{
      setClasses(res.data.data.length)
      // console.log(classes)
  }).catch(er=>{
    console.log(er)
  })
  }
  // fetchStudents
  const fetchStudents=async()=>{
  await  axios.get(`${baseApi}/student/fetch-with-query`).then(res=>{
      console.log(res)
  }).catch(er=>{
    console.log(er)
  })
  }
 


  
  useEffect(() => {
    fetchSchool();
    fetchNumberOfClasses()
    fetchStudents()
  }, []);



  return (
    <>
      <h1>Dashboard</h1>

      {edit && (
        <>
          <h2>Edit Form</h2>
          <Box
            component="form"
            sx={{
              display: 'flex',
              flexDirection: 'column',
              minWidth:'230px',
              width:'50vw',
              margin:'auto'
            }}
            noValidate
            autoComplete="off"
          >
            <Typography variant="body1">Add School Picture</Typography>
            <TextField
              type="file"
              inputRef={fileinputRef}
              onChange={addImage}
              InputProps={{
                style: {
                  padding: '8px',
                  backgroundColor: '#f5f5f5',
                  borderRadius: '4px',
                },
              }}
            />
            {imageUrl && (
              <CardMedia
                component="img"
                height="240"
                image={imageUrl}
                sx={{ borderRadius: '8px', margin: '8px 0' }}
              />
            )}

            <TextField
              variant="outlined"
             sx={{marginTop:'8px',fontFamily: 'Courier New' }}
             label='School Name'
              fullWidth
              value={schoolName}
              onChange={(e)=>setSchoolName(e.target.value)}
            />
           <Button onClick={handleEditSubmit} sx={{color:'white',background:'lightGreen'}}>Submit Edit</Button>
           <Button variant='outlined' onClick={handleCancelEdit} sx={{color:'black',marginBottom:'10px'}}>Cancel</Button>
          </Box>
        </>
      )}

      {school && (
        <Box
          sx={{
            height: '500px',
            width: '100%',
            background: `url(${school.school_image})`,
            backgroundSize: 'cover',
            display: 'flex',
            backgroundPosition:'center',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
          }}
        >
          <Typography variant="h2" style={{ color: 'black',fontFamily:'Courier New' }}>
            {school.school_name}
          </Typography>
          <Box
            component="div"
            sx={{
              position: 'absolute',
              bottom: '10px',
              right: '10px',
              height: '40px',
            }}
          >
            <Button
              onClick={() => setEdit(!edit)}
              variant="outlined"
              sx={{
                backgroundColor: '#fff',
                borderRadius: '50%',
                height: '50px',
                color: 'grey',
              }}
            >
              <EditIcon />
            </Button>
          </Box>
        </Box>
      )}
    </>
  );
}

export default Dashboard;
