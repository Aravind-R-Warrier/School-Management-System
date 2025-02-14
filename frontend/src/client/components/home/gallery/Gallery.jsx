import * as React from 'react';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import { Box } from '@mui/material';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import axios from 'axios';
import { baseApi } from '../../../../environment';

export default function Gallery() {
  
      const [open, setOpen] = React.useState(false);

      const [selectedSchool,setSelectedSchool]=React.useState(null)

      const[schools,setSchools]=React.useState([])

      const handleOpen=(school)=>{
        setOpen(true)
        setSelectedSchool(school)
      }
 
      const handleClose=()=>{
        setOpen(false)
        setSelectedSchool(null)
      }
      const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',    
        width: '600px',
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
      };

    //   apicall
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
      setLoading(true);
      axios
        .get(`${baseApi}/school/all?page=1&limit=10`)
        .then((res) => {
          setSchools(res.data.schools);
        })
        .catch((err) => {
          console.error(err);
        })
        .finally(() => {
          setLoading(false);
        });
    }, []);
    


  return (
    <Box>
      {loading ? (
  <Typography variant="h6" textAlign="center">Loading schools...</Typography>
):
    <ImageList sx={{ width:'100%', height: 'auto'}}>
      {schools.map((school) => (
        <ImageListItem key={school.school_image}>
          <img
            srcSet={`./images/uploaded/school/${school.school_image}?w=248&fit=crop&auto=format&dpr=2 2x`}
            src={`${school.school_image}`}
            alt={school.title}
{/*             loading="lazy */}
            onClick={()=>handleOpen(school)}
          />
          <ImageListItemBar
            title={school.school_name}
            position="below"
            sx={{textAlign:'center'}}
          />
        </ImageListItem>
      ))}
    </ImageList>}
    
{/* Modal */}
<Modal
  open={open}
  onClose={handleClose}
  aria-labelledby="modal-title"
  aria-describedby="modal-description"
>
  <Box sx={style}>
    {selectedSchool && (
      <>
        <Typography id="modal-title" variant="h4" component="h2" sx={{ mb: 2,textAlign:'center',fontStyle:'italic',fontWeight:'800' }}>
          {selectedSchool.school_name}
        </Typography>
        <Box
          sx={{
            display: 'flex',
            justifyContent:'center',
          }}
        >
          <img
            src={`${selectedSchool.school_image}`}
            alt={selectedSchool.school_name}
            style={{
              width: '350px',
              height: '350px',
              objectFit: 'cover',
              borderRadius: '8px',
              padding:'5px'
            }}
          />
        </Box>
      </>
    )}
  </Box>
</Modal>
  
 

    </Box>
  );
}

