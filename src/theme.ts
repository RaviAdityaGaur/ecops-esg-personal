
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          '&.css-p4tx64-MuiPaper-root': {
            minHeight: 0
          }
        }
      }
    }
  }
});

export default theme;