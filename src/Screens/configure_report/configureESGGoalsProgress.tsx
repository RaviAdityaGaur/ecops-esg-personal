import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Grid
} from '@mui/material';
import SidebarHeader from '../../Components/SidebarHeader.tsx';

const ConfigureESGGoalsProgress: React.FC = () => {
  const navigate = useNavigate();
  
  // State for form fields
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
 
  const handleBack = () => {
    navigate('/configure-report/sustainability-structure');
  };
  const handleNext = () => {
    // You can add form validation here before navigating
    console.log('Form data:', {
      title,
      description
    });
    // Navigate to Year in Review page
    navigate('/configure-report/year-in-review');
  };

  return (
    <SidebarHeader>
      <Box sx={{ py: 1 }}>
        <Box sx={{ justifyContent: 'space-between', backgroundColor: 'white', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6" sx={{ mb: 3, backgroundColor: 'white', p: 2, borderRadius: 2 }}>
            ESG Goals And Progress
          </Typography>
        </Box>

        <Paper sx={{ p: 4, mx: 'auto' }}>
          <Grid container spacing={3}>
            {/* Title Section */}
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  Title *
                </Typography>
                
                <Button
                  variant="outlined"
                  sx={{
                    textTransform: 'none',
                    borderColor: '#147C65',
                    color: '#147C65',
                    '&:hover': {
                      backgroundColor: 'rgba(20, 124, 101, 0.04)',
                    }
                  }}
                >
                  Download A Sample PDF Report
                </Button>
              </Box>
              <TextField
                fullWidth
                placeholder="ESG Goals And Progress"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                sx={{ mt: 2, mb: 3 }}
              />
              
              <Typography variant="body1" sx={{ mb: 1, fontWeight: 500 }}>
                Description *
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={8}
                placeholder="Lorem Ipsum Is A Global Company With Approximately 17 Million Ton And Part-Time Employees Worldwide And Operations In Africa, Asia-Pacific, Europe, Latin America, The Middle East, And North America. At Lorem Ipsum, We Combine Data And Science With Passion And Invention. We Set Big Goals And Work Backward To Achieve Them, Such As The Climate Pledge, Our Goal To Reach Net- Zero Carbon Emissions By 2040. Dr Years Ahead Of The Paris Agreement. We Apply That Same Tenacity To How We Address Some Of The World's Biggest Environmental And Societal Challenges."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Grid>

            {/* Action Buttons */}
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                <Button
                  variant="outlined"
                  onClick={handleBack}
                  sx={{
                    textTransform: 'none',
                    px: 4,
                    py: 1,
                    borderColor: '#64748B',
                    color: '#64748B',
                  }}
                >
                  Back
                </Button>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Button
                    variant="outlined"
                    sx={{
                      textTransform: 'none',
                      px: 4,
                      py: 1,
                      borderColor: '#64748B',
                      color: '#64748B',
                    }}
                  >
                    Preview
                  </Button>
                  <Button
                    variant="contained"
                    onClick={handleNext}
                    sx={{
                      textTransform: 'none',
                      px: 4,
                      py: 1,
                      backgroundColor: '#147C65',
                      '&:hover': {
                        backgroundColor: '#0E5A4A',
                      }
                    }}
                  >
                    Next
                  </Button>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </SidebarHeader>
  );
};

export default ConfigureESGGoalsProgress;
