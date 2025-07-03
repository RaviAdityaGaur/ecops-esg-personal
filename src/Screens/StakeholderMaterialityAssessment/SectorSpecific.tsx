import React from 'react';
import { Box, CssBaseline, ThemeProvider, Typography, Button } from '@mui/material';
import { theme } from '../../lib/theme';
import SidebarHeader from "../../Components/SidebarHeader";
import { useNavigate } from 'react-router-dom';
import popImage from '../../assets/pop.png';

const styles = {
  headerBox: {
    width: '100%',
    bgcolor: 'background.paper',
    borderRadius: 2,
    boxShadow: "none",
    p: 2,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  },
  newSurveyButton: {
    backgroundColor: "#147C65",
    borderRadius: 1.5,
    textTransform: 'none'
  },
  esgBoxContainer: {
    display: 'flex',
    width: '100%',
    marginTop: 2
  },
  esgBoxWrapper: {
    display: 'flex',
    width: '100%',
    gap: 3
  }
};

const ESGBox = ({ title, onClick }) => (
  <Box
    onClick={onClick}
    sx={{
      width: '300px',
      p: 2,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      cursor: 'pointer',
      backgroundColor: '#fff',
      borderRadius: 2,
      boxShadow: "none",
      height: '120px'
    }}
  >
    <Box display="flex" justifyContent="center" alignItems="center">
      <Typography variant="body2" textAlign="center">
        {title}
      </Typography>
      <img src={popImage} style={{width: "15px", height: "15px", marginLeft: "5px", marginBottom: "8px"}} alt="info" />
    </Box>
  </Box>
);

export default function SectorSpecific() {
  const navigate = useNavigate();

  const handleEnvironmentClick = () => {
    navigate('/disclosure-list');
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SidebarHeader>
        <Box sx={styles.headerBox}>
          <Box display="flex" justifyContent="center" alignItems="center">
            <Typography sx={{ fontSize: "20px" }}>
              Sector Specific
            </Typography>
            <img src={popImage} style={{width: "15px", height: "15px", marginLeft: "5px", marginBottom: "8px"}} alt="info" />
          </Box>
          <Button variant="contained" sx={styles.newSurveyButton}>
            + New Survey
          </Button>
        </Box>

        <Box sx={styles.esgBoxContainer}>
          <Box sx={styles.esgBoxWrapper}>
            <ESGBox title="Environment" onClick={handleEnvironmentClick} />
            <ESGBox title="Social"  onClick={handleEnvironmentClick}/>
            <ESGBox title="Governance"  onClick={handleEnvironmentClick} />
          </Box>
        </Box>
      </SidebarHeader>
    </ThemeProvider>
  );
}