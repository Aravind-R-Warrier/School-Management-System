import { Box, Button, Card, CardContent, Grid, Paper, TextField, Typography, IconButton } from '@mui/material';
import { useFormik } from 'formik';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { subjectSchema } from '../../../yupSchema/subjectSchema';
import { baseApi } from '../../../environment';
import { toast } from 'react-toastify';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

function Subjects() {
  const [subjects, setSubjects] = useState([]);
  const [edit, setEdit] = useState(false);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchAllSubjects();
  }, []);

  const fetchAllSubjects = async () => {
    try {
      const response = await axios.get(`${baseApi}/subject/all`);
      setSubjects(response.data.data);
    } catch (err) {
      console.error('Error fetching subjects:', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${baseApi}/subject/delete/${id}`);
      toast.success('Subject deleted successfully');
      fetchAllSubjects();
    } catch (err) {
      console.error('Error deleting subject:', err);
      toast.error('Error deleting subject');
    }
  };

  const handleEdit = (id, subject_name, subject_codename) => {
    setEdit(true);
    formik.setValues({ subject_name, subject_codename });
    setEditId(id);
  };

  const cancelEdit = () => {
    setEdit(false);
    setEditId(null);
    formik.resetForm();
  };

  const formik = useFormik({
    initialValues: { subject_name: '', subject_codename: '' },
    validationSchema: subjectSchema,
    onSubmit: async (values) => {
      try {
        if (edit) {
          await axios.patch(`${baseApi}/subject/update/${editId}`, values);
          toast.success('Subject updated successfully');
        } else {
          await axios.post(`${baseApi}/subject/create`, values);
          toast.success('Subject added successfully');
        }
        fetchAllSubjects();
        formik.resetForm();
        setEdit(false);
        setEditId(null);
      } catch (err) {
        console.error('Error:', err);
        toast.error('Operation failed');
      }
    },
  });

  return (
    <Box sx={{ p: 4, background:'linear-gradient(to right, #024950, #027368)', minHeight: '100vh' }}>
      <Paper elevation={4} sx={{ maxWidth: 600, mx: 'auto', p: 3, borderRadius: 2 }}>
        <Typography variant="h5" fontWeight={700} textAlign="center" fontFamily='Courier New' gutterBottom>
          {edit ? 'Edit Subject' : 'Add Subject'}
        </Typography>
        <Box component="form" onSubmit={formik.handleSubmit}>
          <TextField
            fullWidth
            margin="normal"
            label="Subject Name"
            name="subject_name"
            value={formik.values.subject_name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.subject_name && Boolean(formik.errors.subject_name)}
            helperText={formik.touched.subject_name && formik.errors.subject_name}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Subject Code"
            name="subject_codename"
            value={formik.values.subject_codename}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.subject_codename && Boolean(formik.errors.subject_codename)}
            helperText={formik.touched.subject_codename && formik.errors.subject_codename}
          />
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 2, backgroundColor: '#036E66' }}>
            {edit ? 'Update Subject' : 'Add Subject'}
          </Button>
          {edit && (
            <Button fullWidth variant="outlined" sx={{ mt: 2 }} onClick={cancelEdit}>
              Cancel
            </Button>
          )}
        </Box>
      </Paper>

      <Typography variant="h5" textAlign="center" fontWeight={700} mt={4} fontFamily='Courier New' color='lavender' gutterBottom>
        Added Subjects
      </Typography>
      <Grid container spacing={3} justifyContent="center">
        {subjects.map((item) => (
          <Grid item key={item._id} xs={12} sm={6} md={4}>
            <Card sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', border: '1px solid black', margin: '20px' }}>
              <CardContent>
                <Typography variant="h6" fontWeight={600} textAlign="center" fontFamily='Courier New'>
                  {item.subject_name} <p>({item.subject_codename})</p>
                </Typography>
              </CardContent>
              <Box>
                <IconButton color="primary" onClick={() => handleEdit(item._id, item.subject_name, item.subject_codename)}>
                  <EditIcon />
                </IconButton>
                <IconButton color="error" onClick={() => handleDelete(item._id)}>
                  <DeleteIcon />
                </IconButton>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default Subjects;
