import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { useFormik } from 'formik';
import { registerSchema } from '../../../yupSchema/register';
import { Button, CardMedia, Typography, Paper } from '@mui/material';
import axios from 'axios';
import { toast} from 'react-toastify'
import ParticlesBg from 'particles-bg';

export default function Register() {
  const initialValues = {
    school_name: '',
    email: '',
    owner_name: '',
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

  const formik = useFormik({
    initialValues,
    validationSchema: registerSchema,
    onSubmit: (values) => {
      if (file) {
        const fd = new FormData();
        fd.append('image', file, file.name);
        fd.append('school_name', values.school_name);
        fd.append('owner_name', values.owner_name);
        fd.append('password', values.password);
        fd.append('email', values.email);

        axios
          .post('http://localhost:5000/api/school/register', fd)
          .then((res) => {
            console.log(res);
            toast.success('School registered successfully');
            formik.resetForm();
            handleClearFile();
          })
          .catch((err) => {
            console.log(err);
            toast.error(err.response.data.message);
          });
      }else{
        toast.error('please upload school Image');

      }
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
        // background: 'url(https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fGJvb2t8ZW58MHx8MHx8fDA%3D)',
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
           <Typography variant={'h4'} sx={{textAlign:'center',margin:'0',padding:'0',fontWeight:'800',fontFamily:'verdana'}}>
        Register
      </Typography>
          <Typography variant="p">Add School Picture</Typography>
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
              height="240"
              image={imageUrl}
              sx={{ borderRadius: '8px', margin: '8px 0' }}
            />
          )}

          <TextField
            name="school_name"
            label="School Name"
            variant="outlined"
            fullWidth
            value={formik.values.school_name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.school_name && Boolean(formik.errors.school_name)}
            helperText={formik.touched.school_name && formik.errors.school_name}
          />

          <TextField
            name="owner_name"
            label="Owner Name"
            variant="outlined"
            fullWidth
            value={formik.values.owner_name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.owner_name && Boolean(formik.errors.owner_name)}
            helperText={formik.touched.owner_name && formik.errors.owner_name}
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
