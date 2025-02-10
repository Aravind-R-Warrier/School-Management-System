import { Box, Button, FormControl, InputLabel, MenuItem, Paper, Select, TextField, Typography } from '@mui/material'
import { useFormik } from 'formik'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { baseApi } from '../../../environment'
import { toast } from 'react-toastify'
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { NoticeSchema } from '../../../yupSchema/noticeSchema'


function Notice() {
  const [notices, setNotices] = useState([])
  const [edit, setEdit] = useState(false)
  const [editId, setEditId] = useState(null)




  const handleEdit = (id, title, message, audience) => {
    // console.log(id)
    setEdit(true)
    formik.setFieldValue('title', title)
    formik.setFieldValue('message', message)
    formik.setFieldValue('audience', audience)
    setEditId(id)
  }
  const cancelEdit = () => {
    setEditId(null)
    setEdit(false)
    formik.resetForm()
  }
  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete")) {
      try {
        const response = await axios.delete(`${baseApi}/notice/delete/${id}`);
        toast.success(response.data.message);
        fetchAllNotices();
      } catch (err) {
        console.error('Error deleting notice:', err);
        toast.error(err.response?.data?.message || 'Error deleting notice');
      }
    }
  };

  const formik = useFormik({
    initialValues: { title: '', message: '', audience: "" },
    validationSchema: NoticeSchema,
    onSubmit: (values) => {
      // api for creation and edit
      if (edit) {
        axios.patch(`${baseApi}/notice/update/${editId}`, { ...values }).then(res => {
          // console.log(res)
          toast.success('notice Edited successfully')
        }).catch((err) => {
          console.log(err, 'error in updating')
          toast.error(err, 'error in Editing')
        })
        formik.resetForm()

      } else {
        axios.post(`${baseApi}/notice/create`, { ...values }).then(res => {
          // console.log(res)
          toast.success('notice added successfully')
        }).catch((err) => {
          console.log(err)
          toast.error(err)
        })
        formik.resetForm()
      }


    }

  })

  const fetchAllNotices = async (req, res) => {
    axios.get(`${baseApi}/notice/all`).then(res => {
      setNotices(res.data.data)
    }).catch(err => {
      console.log(err)
    })
  }

  useEffect(() => {
    fetchAllNotices()
  }, [formik])

  return (
    <div >
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
            width: '60vw',
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
              edit ? <Typography variant={'h4'} sx={{ textAlign: 'center', margin: '0', padding: '0', fontWeight: '800', fontFamily: 'Courier New', color: 'black' }}>
                Edit Notice
              </Typography> : <Typography variant={'h4'} sx={{ textAlign: 'center', margin: '0', padding: '0', fontWeight: '800', fontFamily: 'Courier New', color: 'black' }}>
                Add Notice
              </Typography>
            }



            <TextField
              name="title"
              label="Notice Title"
              variant="outlined"
              fullWidth
              value={formik.values.title}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.title && Boolean(formik.errors.title)}
              helperText={formik.touched.title && formik.errors.title}
              sx={{
                input: { color: '#333333' }, // Ensures text inside input is visible
                backgroundColor: '#FFFFFF',
              }}
            />
            <TextField
              name="message"
              label="Message"
              variant="outlined"
              multiline
              rows={3}
              fullWidth
              value={formik.values.message}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.message && Boolean(formik.errors.message)}
              helperText={formik.touched.message && formik.errors.message}
              InputProps={{
                style: { color: 'black', backgroundColor: '#FFFFFF' }, // Text and background color
              }}
              InputLabelProps={{
                style: { color: 'grey' }, // Label color
              }}
            />


            {/* select */}
            <FormControl fullWidth sx={{ marginTop: '10px' }}
            >
              <InputLabel id="demo-simple-select-label">Audience</InputLabel>
              <Select
                sx={{ color: '#333333', backgroundColor: '#FFFFFF' }}
                value={formik.values.audience}
                label="Audience"
                name='audience'
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.audience && Boolean(formik.errors.audience)}
                helperText={formik.touched.audience && formik.errors.audience}
              >
                <MenuItem value={""}>Select Audience</MenuItem>
                <MenuItem value={"Teacher"}>Teacher</MenuItem>
                <MenuItem value={"Student"}>Student</MenuItem>

              </Select>
            </FormControl>

            <Button
              type="submit"
              style={{ background: '#036E66', width: '200px' }}
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
                  width: '200px',
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

      {/* notice display */}
      <h2 style={{ fontFamily: 'Courier New', color: 'skyblue', textAlign: 'center' }}>Added Classes</h2>
      <Box component={'div'} sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
        {

          notices && notices.map(item => {
            return <Paper key={item._id} sx={{ border: '1px black solid', margin: '20px', p: 1 }}>
              <Box component={'div'} sx={{ maxWidth: '600px' }}>
                <Typography sx={{ color: 'black' }} variant='h5'>{item.title}</Typography>
                <Typography sx={{ fontSize: '16px' }} variant='h6'>{item.message}</Typography>
                <Typography sx={{ color: 'darkBrown' }} variant='h6'>For:({item.audience})</Typography>
              </Box>
              <Box component={'div'}>
                <Button onClick={() => handleEdit(item._id, item.title, item.message, item.audience)}><EditIcon /></Button>
                <Button onClick={() => handleDelete(item._id)}><DeleteIcon /></Button>
              </Box>
            </Paper>
          })
        }
      </Box>
    </div>
  )
}

export default Notice
