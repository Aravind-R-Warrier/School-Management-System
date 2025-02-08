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
      secondary: '#666666',
    },
  },
  components: {
    MuiTypography: {
      styleOverrides: {
        root: {
          fontFamily: 'Roboto, Arial, sans-serif',
        },
        h1: {
          fontSize: '2rem',
          fontWeight: '700',
        },
        body1: {
          fontSize: '1rem',
          color: '#333333',
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          color: '#333333', // Ensures text inside the input is visible
          backgroundColor: '#FFFFFF', // White background for better contrast
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: '#CCCCCC', // Default border color
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#197602', // Green border on hover
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#197602', // Green border when focused
          },
        },
        input: {
          color: '#333333', // Ensures user-typed text is visible
          '&::placeholder': {
            color: '#666666', // Light gray placeholder for better readability
          },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: '#333333', // Darker label for visibility
          '&.Mui-focused': {
            color: '#197602', // Green when focused
          },
          '&.MuiInputLabel-shrink': {
            color: '#197602', // Shrinks with green color
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          color: '#333333', // Ensure selected text is visible
          backgroundColor: '#FFFFFF', // White background for better contrast
        },
        icon: {
          color: '#197602', // Dropdown arrow color
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          color: '#333333', // Ensures menu items are visible in light mode
          backgroundColor: '#FFFFFF', // White background
          '&:hover': {
            backgroundColor: '#F0F0F0', // Light gray hover effect
          },
          '&.Mui-selected': {
            backgroundColor: '#197602', // Green when selected
            color: '#FFFFFF', // White text for contrast
            '&:hover': {
              backgroundColor: '#145502', // Darker green on hover
            },
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          backgroundColor: '#FFFFFF', // Ensures background contrast
        },
      },
    },
  },
});

export default lightTheme;
