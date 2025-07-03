import { createTheme } from '@mui/material/styles'

export const theme = createTheme({
  palette: {
    primary: {
      main: '#2065D1',
      light: '#5B8DEE',
      dark: '#103996',
    },
    secondary: {
      main: '#00A76F',
      light: '#4CC38A',
      dark: '#007867',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
          '& .MuiPaper-root': {
            boxShadow: 'none',
          }
        }
      }
    }
  },
})

