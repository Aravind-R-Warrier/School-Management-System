import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { useFormik } from 'formik';
import { studentEditSchema, studentSchema } from '../../../yupSchema/studentSchema';
import { Button, CardMedia, Typography, Paper, FormControl, InputLabel, Select, MenuItem, Card, CardContent, CardActions } from '@mui/material';
import axios from 'axios';
import { toast} from 'react-toastify'
import DeleteIcon from '@mui/icons-material/Delete';
import EditNoteIcon from '@mui/icons-material/EditNote';
import { baseApi } from '../../../environment';

export default function Students() {

const[classes,setClasses]=React.useState([])
const[students,setStudents]=React.useState([])
const[edit,setEdit]=React.useState(false)
const[editId,setEditId]=React.useState(null)

  const initialValues = {
    email: '',
    name: '',
    student_class:'',
    age:'',
    gender:'',
    guardian:'',
    guardian_phone:'',
    password: '',
    confirm_password: '',
  };
  
  const [file, setFile] = React.useState(null);
  const [imageUrl, setImageUrl] = React.useState(null);

  const addImage = (event) => {
    const file = event.target.files[0];
    setImageUrl(URL.createObjectURL(file));
    setFile(file);
  };

  const fileinputRef = React.useRef(null);
  const handleClearFile = () => {
    if (fileinputRef.current) {
      fileinputRef.current.value = '';
    }
    setFile(null);
    setImageUrl(null);
  };


  // register and edit
  const formik = useFormik({
    initialValues,
    validationSchema: edit?studentEditSchema:studentSchema,
    onSubmit: (values) => {


      if(edit){
        const fd = new FormData();
        fd.append('name', values.name);
        fd.append('student_class', values.student_class);
        fd.append('email', values.email);
        fd.append('age', values.age);
        fd.append('gender', values.gender);
        fd.append('guardian', values.guardian);
        fd.append('guardian_phone', values.guardian_phone)

        if(file){
          fd.append('image', file, file.name);
        }
        if(values.password){
          fd.append('password', values.password);
        }
        
        axios
        .patch(`${baseApi}/student/update/${editId}`, fd)
        .then((res) => {
          toast.success('Student updated successfully');
          formik.resetForm();
          handleClearFile();
          fetchStudents()
        })
        .catch((err) => {
          console.log(err);
          toast.error(err.response.data.message);
        });

      }else{

    
      if (file) {
        const fd = new FormData();
        fd.append('image', file, file.name);
        fd.append('name', values.name);
        fd.append('student_class', values.student_class);
        fd.append('password', values.password);
        fd.append('email', values.email);
        fd.append('age', values.age);
        fd.append('gender', values.gender);
        fd.append('guardian', values.guardian);
        fd.append('guardian_phone', values.guardian_phone)

        axios
          .post(`${baseApi}/student/register`, fd)
          .then((res) => {
            toast.success('Student registered successfully');
            formik.resetForm();
            handleClearFile();
            fetchStudents()
          })
          .catch((err) => {
            console.log(err);
            toast.error(err.response.data.message);
          });
      }else{
        toast.error('please upload student image');

      }
    }
    },
  });





  // fetching classes
  const fetchClasses=async()=>{
    axios.get(`${baseApi}/class/all`).then(res=>{
      setClasses(res.data.data)
  }).catch(er=>{
    console.log(er)
  })
  }

  // searching
  const[params,setParams]=React.useState({})

  const handleSearch = (e) => {
    setParams((prevParams) => ({
      ...prevParams,
      search: e.target.value || undefined, // Correct key for filtering students by class
    }));
  }

const handleClass = (e) => {
  setParams((prevParams) => ({
    ...prevParams,
    student_class: e.target.value || undefined, 
  }));
}

// students fetching
  const fetchStudents=async()=>{
    axios.get(`${baseApi}/student/fetch-with-query`,{params}).then(res=>{
      setStudents(res.data.students)
      // console.log(res)
  }).catch(er=>{
    console.log(er)
  })
  }

  // edit

  const handleEdit = (id) => {
    setEdit(true);
    setEditId(id)
    const filteredStudents = students.find((student) => student._id === id);
  
    if (!filteredStudents) {
      console.error("No student found with this ID:", id);
      return;
    }
  
    formik.setValues({
      email: filteredStudents.email,
      name: filteredStudents.name,
      student_class: filteredStudents.student_class?._id || "",
      age: filteredStudents.age,
      gender: filteredStudents.gender,
      guardian: filteredStudents.guardian,
      guardian_phone: filteredStudents.guardian_phone,
      password: "",
      confirm_password: "",
    });
  
    
  };
  
const cancelEdit=()=>{
  setEdit(false)
  formik.resetForm()
  setEditId(null)
}
  // delete
  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
        axios
            .delete(`${baseApi}/student/delete/${id}`)
            .then((res) => {
                if (res.data.success) {
                    toast.success('Student deleted successfully');
                    fetchStudents(); 
                } else {
                    toast.error('Deletion failed');
                }
            })
            .catch((err) => {
                console.log(err);
                toast.error('Error deleting student');
            });
    }
};




  React.useEffect(()=>{
    fetchClasses()
  },[])

  React.useEffect(()=>{
fetchStudents()
  },[params])


  return (
    <div >
    <Box
      component="div"
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        
      }}
    >

      <Paper
        elevation={3}
        sx={{
          padding: 3,
          margin: 'auto',
          maxWidth: '550px',
          backgroundColor:"rgba(255, 255, 255, 0.9)", 
          backdropFilter: 'blur(5px)',
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
          {edit? <Typography variant={'h4'} sx={{textAlign:'center',margin:'0',padding:'0',fontWeight:'800',fontFamily:'New Courier',color:'black'}}>Edit Student</Typography>:
                     <Typography variant={'h4'} sx={{textAlign:'center',margin:'0',padding:'0',fontWeight:'800',fontFamily:'New Courier',color:'black'}}>Add Student</Typography>
     }

          <Typography color='black' variant="p">Add Student Picture</Typography>
          <TextField
            type="file"
            inputRef={fileinputRef}
            onChange={(event) => addImage(event)}
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
              height="240px"
              image={imageUrl}
              sx={{ borderRadius: '8px', margin: '8px 0',objectFit:'contain' }}
            />
          )}

          <TextField
            name="name"
            label="Student Name"
            variant="outlined"
            fullWidth
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.name && Boolean(formik.errors.name)}
            helperText={formik.touched.name && formik.errors.name}
            sx={{
              input: { color: '#333333' }, // Ensures text inside input is visible
              backgroundColor: '#FFFFFF',
            }}
          />

<Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth sx={{ color: '#333333', backgroundColor: '#FFFFFF' }}>
         <InputLabel id="demo-simple-select-label">Class</InputLabel>
        <Select
        
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={formik.values.student_class}
          label="Class"
          name='student_class'
          onChange={formik.handleChange}
         onBlur={formik.handleBlur}
         sx={{ color: '#333333', backgroundColor: '#FFFFFF' }}
        >
         {classes&&classes.map((item)=>{
          return<MenuItem key={item._id} value={item._id}>{item.class_text}</MenuItem>

         })}
        </Select>
      </FormControl>
     
            {formik.touched.age && Boolean(formik.errors.age)}
            {formik.touched.age && formik.errors.age}
    </Box>

          <TextField
            name="age"
            label="Student Age"
            variant="outlined"
            fullWidth
            value={formik.values.age}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.age && Boolean(formik.errors.age)}
            helperText={formik.touched.age && formik.errors.age}
            sx={{
              input: { color: '#333333' }, // Ensures text inside input is visible
              backgroundColor: '#FFFFFF',
            }}
          />

<Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth sx={{ color: '#333333', backgroundColor: '#FFFFFF' }}  >
        
         <InputLabel id="demo-simple-select-label">Gender</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={formik.values.gender}
          label="Gender"
          name='gender'
          onChange={formik.handleChange}
          sx={{ color: '#333333', backgroundColor: '#FFFFFF' }}
        >
          <MenuItem value={'male'}>Male</MenuItem>
          <MenuItem value={'female'}>Female</MenuItem>
          <MenuItem value={'other'}>Others</MenuItem>
        </Select>
      </FormControl>
      {formik.handleBlur}
            {formik.touched.age && Boolean(formik.errors.age)}
            {formik.touched.age && formik.errors.age}
    </Box>
          

          <TextField
            name="guardian"
            label="Student Guardian"
            variant="outlined"
            fullWidth
            value={formik.values.guardian}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.guardian && Boolean(formik.errors.guardian)}
            helperText={formik.touched.guardian && formik.errors.guardian}
            sx={{
              input: { color: '#333333' }, // Ensures text inside input is visible
              backgroundColor: '#FFFFFF',
            }}
          />
          
          <TextField
            name="guardian_phone"
            label="Guardian Phone"
            variant="outlined"
            fullWidth
            value={formik.values.guardian_phone}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.guardian_phone && Boolean(formik.errors.guardian_phone)}
            helperText={formik.touched.guardian_phone && formik.errors.guardian_phone}
            sx={{
              input: { color: '#333333' }, // Ensures text inside input is visible
              backgroundColor: '#FFFFFF',
            }}
          />

          

          <TextField
            name="email"
            label="Email"
            variant="outlined"
            fullWidth
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
            sx={{
              input: { color: '#333333' }, // Ensures text inside input is visible
              backgroundColor: '#FFFFFF',
            }}
          />

          <TextField
            name="password"
            type="password"
            label="Password"
            variant="outlined"
            fullWidth
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
            sx={{
              input: { color: '#333333' }, // Ensures text inside input is visible
              backgroundColor: '#FFFFFF',
            }}
          />

          <TextField
            name="confirm_password"
            type="password"
            label="Confirm Password"
            variant="outlined"
            fullWidth
            value={formik.values.confirm_password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.confirm_password && Boolean(formik.errors.confirm_password)}
            helperText={formik.touched.confirm_password && formik.errors.confirm_password}
            sx={{
              input: { color: '#333333' }, // Ensures text inside input is visible
              backgroundColor: '#FFFFFF',
            }}
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
      
{/*  search*/}

   
     <Box component={'div'} sx={{display:'flex',flexDirection:'row',justifyContent:'center',marginTop:'45px'}}>
     <TextField
            label="Search"
            value={params.search?params.search:''}
            onChange={(e)=>{handleSearch(e)}}
            sx={{
              input: { color: '#333333' }, // Ensures text inside input is visible
              backgroundColor: '#FFFFFF',
            }}          />
    
     <FormControl sx={{width:'180px',marginLeft:'5px', color: '#333333', backgroundColor: '#FFFFFF' }}>
        <InputLabel id="demo-simple-select-label">Class</InputLabel>
       <Select
         value={params.student_class?params.student_class:''}
         sx={{ color: '#333333', backgroundColor: '#FFFFFF' }}        //  label="Student class"
         onChange={(e)=>{handleClass(e)}}
       >
       <MenuItem key={''}>Select classes</MenuItem>
        {classes&&classes.map((item)=>{
         return<MenuItem key={item._id} value={item._id}>{item.class_text}</MenuItem>

        })}
       </Select>
     </FormControl>        
     </Box>
     {/* student cards */}
     <Box component={'div'} sx={{display:'flex',flexDirection:'row',justifyContent:'center',marginTop:'45px',flexWrap:'wrap'}}>
      {
        students&&students.map((student)=>{
          return (
            <Card key={student._id} sx={{ maxWidth: 280,margin:4}}>
            <CardMedia
              component="img"
              alt="green iguana"
              height="260"
              image={`/images/uploaded/student/${student.student_image}`}
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
               <span style={{fontWeight:'800'}}>Name:</span> {student.name}
              </Typography>
              <Typography gutterBottom variant="h6" component="div">
              <span style={{fontWeight:'800'}}>Email:</span> {student.email}
              </Typography>
              <Typography gutterBottom variant="h6" component="div">
              <span style={{fontWeight:'800'}}>Class:</span> {student.student_class.class_text}
              </Typography>
              <Typography gutterBottom variant="h6" component="div">
              <span style={{fontWeight:'800'}}>Age:</span> {student.age}
              </Typography>
              <Typography gutterBottom variant="h6" component="div">
              <span style={{fontWeight:'800'}}>Gender:</span>  {student.gender}
              </Typography>
              <Typography gutterBottom variant="h6" component="div">
              <span style={{fontWeight:'800'}}>Guardian:</span> {student.guardian}
              </Typography>
              <Typography gutterBottom variant="h6" component="div">
              <span style={{fontWeight:'800'}}>Guardian Phone:</span> {student.guardian_phone}
              </Typography>
              <Box sx={{display:'flex',justifyContent:'space-between'}}>
              <Button onClick={()=>handleEdit(student._id)}><EditNoteIcon/></Button>
              <Button onClick={()=>handleDelete(student._id)} sx={{color:'red'}}><DeleteIcon/></Button>
              </Box>
             
            </CardContent>
          </Card>
          )
        })
      }
      </Box>
     </div>
  );
}

