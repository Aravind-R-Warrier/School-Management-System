import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { useFormik } from 'formik';
import { studentEditSchema, studentSchema } from '../../../yupSchema/studentSchema';
import { Button, CardMedia, Typography, Paper, FormControl, InputLabel, Select, MenuItem, Card, CardContent, CardActions } from '@mui/material';
import axios from 'axios';
import { toast } from 'react-toastify'
import DeleteIcon from '@mui/icons-material/Delete';
import EditNoteIcon from '@mui/icons-material/EditNote';
import { baseApi } from '../../../environment';
import { teacherEditSchema, teacherSchema } from '../../../yupSchema/teacherSchema';

export default function Teachers() {

  const [classes, setClasses] = React.useState([])
  const [teachers, setTeachers] = React.useState([])
  const [edit, setEdit] = React.useState(false)
  const [editId, setEditId] = React.useState(null)

  const initialValues = {
    email: '',
    name: '',
    age: '',
    gender: '',
    qualification: '',
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
    validationSchema: edit ? teacherEditSchema : teacherSchema,
    onSubmit: (values) => {


      if (edit) {
        const fd = new FormData();
        fd.append('name', values.name);
        fd.append('email', values.email);
        fd.append('age', values.age);
        fd.append('gender', values.gender);
        fd.append('qualification', values.qualification);

        if (file) {
          fd.append('image', file, file.name);
        }
        if (values.password) {
          fd.append('password', values.password);
        }

        axios
          .patch(`${baseApi}/teacher/update/${editId}`, fd)
          .then((res) => {
            toast.success('Teacher updated successfully');
            formik.resetForm();
            handleClearFile();
            fetchTeachers()
          })
          .catch((err) => {
            console.log(err);
            toast.error(err.response.data.message);
          });

      } else {


        if (file) {
          const fd = new FormData();
          fd.append('image', file, file.name);
          fd.append('name', values.name);
          fd.append('password', values.password);
          fd.append('email', values.email);
          fd.append('age', values.age);
          fd.append('gender', values.gender);
          fd.append('qualification', values.qualification);


          axios
            .post(`${baseApi}/teacher/register`, fd)
            .then((res) => {
              toast.success('Teacher registered successfully');
              formik.resetForm();
              handleClearFile();
              fetchTeachers()
            })
            .catch((err) => {
              console.log(err);
              toast.error(err.response.data.message);
            });
        } else {
          toast.error('please upload school Image');

        }
      }
    },
  });





  // fetching classes
  const fetchClasses = async () => {
    axios.get(`${baseApi}/class/all`).then(res => {
      setClasses(res.data.data)
    }).catch(er => {
      console.log(er)
    })
  }

  // searching
  const [params, setParams] = React.useState({})

  const handleSearch = (e) => {
    setParams((prevParams) => ({
      ...prevParams,
      search: e.target.value || undefined, // Correct key for filtering teachers by class
    }));
  }



  // teachers fetching
  const fetchTeachers = async () => {
    axios.get(`${baseApi}/teacher/fetch-with-query`, { params }).then(res => {
      setTeachers(res.data.teachers)
      console.log(res)
    }).catch(er => {
      console.log(er)
    })
  }

  // edit

  const handleEdit = (id) => {
    setEdit(true);
    setEditId(id)
    const filteredTeachers = teachers.find((teacher) => teacher._id === id);

    if (!filteredTeachers) {
      console.error("No teacher found with this ID:", id);
      return;
    }

    formik.setValues({
      email: filteredTeachers.email,
      name: filteredTeachers.name,
      student_class: filteredTeachers.student_class?._id || "",
      age: filteredTeachers.age,
      gender: filteredTeachers.gender,
      qualification: filteredTeachers.qualification,
      password: "",
      confirm_password: "",
    });


  };

  const cancelEdit = () => {
    setEdit(false)
    formik.resetForm()
    setEditId(null)
  }
  // delete
  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this teacher?')) {
      axios
        .delete(`${baseApi}/teacher/delete/${id}`)
        .then((res) => {
          if (res.data.success) {
            toast.success('Teacher deleted successfully');
            fetchTeachers();
          } else {
            toast.error('Deletion failed');
          }
        })
        .catch((err) => {
          console.log(err);
          toast.error('Error deleting teacher');
        });
    }
  };




  React.useEffect(() => {
    fetchClasses()
  }, [])

  React.useEffect(() => {
    fetchTeachers()
  }, [params])


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
            backgroundColor: "rgba(255, 255, 255, 0.9)",
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
            {edit ? <Typography variant={'h4'} sx={{ textAlign: 'center', margin: '0', padding: '0', fontWeight: '800', fontFamily: 'New Courier', color: 'black' }}>Edit Teacher</Typography> :
              <Typography variant={'h4'} sx={{ textAlign: 'center', margin: '0', padding: '0', fontWeight: '800', fontFamily: 'New Courier', color: 'black' }}>Add Teacher</Typography>
            }

            <Typography variant="p" color='black'>Add Teacher Picture</Typography>
            <TextField
              type="file"
              inputRef={fileinputRef}
              sx={{
                input: { color: '#333333' }, // Ensures text inside input is visible
                backgroundColor: '#FFFFFF',
              }} onChange={(event) => addImage(event)}
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
                sx={{ borderRadius: '8px', margin: '8px 0', objectFit: 'contain' }}
              />
            )}

            <TextField
              name="name"
              label="Teacher Name"
              variant="outlined"
              fullWidth
              sx={{
                input: { color: '#333333' }, // Ensures text inside input is visible
                backgroundColor: '#FFFFFF',
              }} value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
            />



            <TextField
              name="age"
              label="Teacher Age"
              variant="outlined"
              fullWidth
              value={formik.values.age}
              sx={{
                input: { color: '#333333' }, // Ensures text inside input is visible
                backgroundColor: '#FFFFFF',
              }}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.age && Boolean(formik.errors.age)}
              helperText={formik.touched.age && formik.errors.age}
            />

            <Box sx={{ minWidth: 120 }}>
              <FormControl fullWidth sx={{ color: '#333333', backgroundColor: '#FFFFFF' }}
              >
                <InputLabel id="demo-simple-select-label">Gender</InputLabel>
                <Select
                sx={{ color: '#333333', backgroundColor: '#FFFFFF' }}
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={formik.values.gender}
                  label="Gender"
                  name='gender'
                  onChange={formik.handleChange}
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
              name="qualification"
              label="Qualification"
              variant="outlined"
              fullWidth
              value={formik.values.qualification}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.qualification && Boolean(formik.errors.qualification)}
              helperText={formik.touched.qualification && formik.errors.qualification}
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
              sx={{
                input: { color: '#333333' }, // Ensures text inside input is visible
                backgroundColor: '#FFFFFF',
              }}
              helperText={formik.touched.email && formik.errors.email}
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
              sx={{
                input: { color: '#333333' }, // Ensures text inside input is visible
                backgroundColor: '#FFFFFF',
              }}
              value={formik.values.confirm_password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.confirm_password && Boolean(formik.errors.confirm_password)}
              helperText={formik.touched.confirm_password && formik.errors.confirm_password}
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
            {edit &&
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
                onClick={() => cancelEdit()}
              >
                cancel
              </Button>}
          </Box>
        </Paper>
      </Box>
      {/*  search*/}


      <Box component={'div'} sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', marginTop: '45px' }}>
        <TextField
          label="Search"
          value={params.search ? params.search : ''}
          onChange={(e) => { handleSearch(e) }}
          sx={{
            input: { color: '#333333' }, // Ensures text inside input is visible
            backgroundColor: '#FFFFFF',
          }}
        />

      </Box>
      {/* teacher cards */}
      <Box component={'div'} sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', marginTop: '45px', flexWrap: 'wrap' }}>
        {
          teachers && teachers.map((teacher) => {
            return (
              <Card key={teacher._id} sx={{ maxWidth: 380, margin: 4 }}>
                <CardMedia
                  component="img"
                  alt="green iguana"
                  height="260"
                  image={`/images/uploaded/teacher/${teacher.teacher_image}`}
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    <span style={{ fontWeight: '800' }}>Name:</span> {teacher.name}
                  </Typography>
                  <Typography gutterBottom variant="h6" component="div">
                    <span style={{ fontWeight: '800' }}>Email:</span> {teacher.email}
                  </Typography>
                  <Typography gutterBottom variant="h6" component="div">
                    <span style={{ fontWeight: '800' }}>Age:</span> {teacher.age}
                  </Typography>
                  <Typography gutterBottom variant="h6" component="div">
                    <span style={{ fontWeight: '800' }}>Gender:</span>  {teacher.gender}
                  </Typography>
                  <Typography gutterBottom variant="h6" component="div">
                    <span style={{ fontWeight: '800' }}>Qualification:</span> {teacher.qualification}
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Button onClick={() => handleEdit(teacher._id)}><EditNoteIcon /></Button>
                    <Button onClick={() => handleDelete(teacher._id)} sx={{ color: 'red' }}><DeleteIcon /></Button>
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

