import { createTheme } from "@mui/material";

const darkTheme = createTheme({
    palette: {
      mode: 'dark',
      primary: {
        main: '#90caf9',
      },
      secondary: {
        main: '#ff9800',
      },
      background: {
        default: '#121212',
        paper: '#1e1e1e',
      },
      text: {
        primary: '#ffffff',
        secondary: '#b0b0b0',
      },
    },
    components: {
      MuiTypography: {
        fontFamily: 'Roboto, Arial, sans-serif',
        h1: {
          fontSize: '2rem',
          fontWeight: '700',
          color: '#ffffff',
        },
        body1: {
          fontSize: '1rem',
          color: '#ffffff',
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            color: '#ffffff',
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: '#444444',
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: '#90caf9',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: '#90caf9',
            },
          },
        },
      },
      MuiInputLabel: {
        styleOverrides: {
          root: {
            color: '#b0b0b0',
            '&.Mui-focused': {
              color: '#90caf9',
            },
          },
        },
      },
    },
  });
  
  export default darkTheme