import { createTheme } from '@mui/material/styles';

let lightTheme = createTheme({
  palette: {
    mode: 'light',
     
    primary: {
      main: '#197602',
    },
    secondary: {
      main: '#FF4001',
    },
    background: {
      default: '#F5F5F5',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#333333',
      secondary:'#666666'
    },
  },
  components:{
    MuiTypography:{
        fontFamily:'Roboto,Arial,san-serif',
        h1:{
            fontSize:'2rem',
            fontWeight:'700'
        },
        body1:{
            fontSize:'1rem',
            color:'#333'
        }
    },
    MuiOutlinedInput:{
        styleOverrides:{
            root:{
                color:'#333333','& .MuiOutlinedInput-notchedOutline':{
                    borderColor:'#CCCCCC',
                },
                '& :hover  .MuiOutlinedInput-notchedOutline':{
                    borderColor:'#197602'
                },
                '& .Mui-focused .MuiOutlinedInput-notchedOutline':{
                    borderColor:'#197602'
                }
            }
        }
    },
    MuiInputLabel:{
        styleOverrides:{
            root:{
                color:'#666666',
                '&.Mui-focused':{
                    color:'#197602'
                }
            }
        }
    }
  }
});


export default lightTheme