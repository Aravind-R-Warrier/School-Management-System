import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { useFormik } from 'formik';
import { Button, CardMedia, Typography, Paper, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import axios from 'axios';
import { loginSchema } from '../../../yupSchema/login';
import { toast } from 'react-toastify'
import ParticlesBg from 'particles-bg';
import { AuthContext } from '../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { baseApi } from '../../../environment';


export default function Login() {
  const navigate = useNavigate()
  const [role, setRole] = React.useState('Student')
  const { logIn } = React.useContext(AuthContext)

  const initialValues = {
    email: '',
    password: '',
  };



  const formik = useFormik({
    initialValues,
    validationSchema: loginSchema,
    onSubmit: (values) => {

      let URL = `${baseApi}/school/login`
      if (role === 'Student') {
        URL = `${baseApi}/student/login`
      } else if (role === 'Teacher') {
        URL = `${baseApi}/teacher/login`
      } else if (role === 'School') {
        URL = `${baseApi}/school/login`
      }
      axios
        .post(`${URL}`, { ...values })
        .then((res) => {
          const token = res.headers.get('Autharisation')
          if (token) {
            sessionStorage.setItem('token', token)
          }
          const user = res.data.user
          if (user) {
            sessionStorage.setItem('user', JSON.stringify(user))
            logIn(user)
          }

          // console.log(res);
          toast.success('login successfully');
          formik.resetForm();
          navigate(`/${role}`)
        })
        .catch((err) => {
          console.log(err);
          toast.error(err.response.data.message);
        });

    },
  });

  return (
    <Box
      component="div"
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
      }}
    >
      <ParticlesBg className="particles" color='#ff0000' type="cobweb" bg={true} />
      <Paper
        elevation={3}
        sx={{

          padding: 3,
          margin: 'auto',
          maxWidth: '550px',
          backgroundColor: 'rgba(255, 255, 255, 0.2)', // Semi-transparent white background
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



          <Typography variant={'h4'} sx={{ textAlign: 'center', margin: '0', padding: '0', fontWeight: '800', fontFamily: 'verdana', color: 'black' }}>
            Login
          </Typography>

          <FormControl fullWidth>
            <InputLabel  id="demo-simple-select-label ">Role</InputLabel>
            <Select
              value={role}
              onChange={e => setRole(e.target.value)}
              displayEmpty
              sx={{ color: '#333333', backgroundColor: '#FFFFFF',marginTop:'10px' }}
            >
              <MenuItem value={'Student'}>Student</MenuItem>
              <MenuItem value={'Teacher'}>Teacher</MenuItem>
              <MenuItem value={'School'}>School</MenuItem>
            </Select>
          </FormControl>



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
            }}          />

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
  );
}
