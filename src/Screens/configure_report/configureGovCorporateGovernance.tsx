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

const ConfigureGovernanceCorporateGovernance: React.FC = () => {
  const navigate = useNavigate();

  // State for form fields
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');

  const handleBack = () => {
    navigate('/configure-report/Governance-In-Figures');
  };
  const handleNext = () => {
    console.log('Form data:', {
      title,
      description
    });
    // Navigate to Social CSR page
    navigate('/configure-report/Governance-Ethical-Business-Conduct');
  };

  const handlePreview = () => {
    console.log('Preview requested');
    // Preview functionality placeholder
  };

  return (
    <SidebarHeader>
      <Box sx={{ py: 1 }}>
        <Box sx={{ justifyContent: 'space-between', backgroundColor: 'white', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6" sx={{ mb: 3, backgroundColor: 'white', p: 2, borderRadius: 2 }}>
            Governance - Corporate Governance
          </Typography>
        </Box>

        <Paper sx={{ p: 4, mx: 'auto' }}>
          <Grid container spacing={3}>
            
            {/* Download Sample Button */}
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box></Box>
                <Button
                  variant="outlined"
                  sx={{
                    textTransform: 'none',
                    borderColor: '#147C65',
                    color: '#147C65',
                    '&:hover': {
                      borderColor: '#0E5A4A',
                      color: '#0E5A4A',
                    }
                  }}
                >
                  Download A Sample PDF Report
                </Button>
              </Box>
            </Grid>

            {/* Title Field */}
            <Grid item xs={12}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" sx={{ mb: 2, fontWeight: 500 }}>
                  Title *
                </Typography>
                <TextField
                  fullWidth
                  placeholder="Title for this page"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </Box>
            </Grid>

            {/* Description Field */}
            <Grid item xs={12}>
              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                  Description *
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={8}
                  placeholder="Lorem Ipsum is a Global Company with Approximately 17 Million Ton and Part-Time Employees Worldwide and Operations in Africa, Asia-Pacific, Europe, Latin America, The Middle East, and North America. At Lorem Ipsum, We Combine Data and Science with Passion and Invention. We Set Big Goals and Work Backward to Achieve Them, Such as The Climate Pledge, Our Goal to Reach Net-Zero Carbon Emissions by 2040, 10 Years Ahead of The Paris Agreement. We Apply That Same Tenacity to How We Address Some of The World's Biggest Environmental and Societal Challenges."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </Box>
            </Grid>            {/* Navigation Buttons */}
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                <Button
                  variant="outlined"
                  onClick={handlePreview}
                  sx={{
                    textTransform: 'none',
                    px: 4,
                    py: 1,
                    borderColor: '#147C65',
                    color: '#147C65',
                    '&:hover': {
                      backgroundColor: 'rgba(20, 124, 101, 0.04)',
                    }
                  }}
                >
                  Preview
                </Button>
                
                <Box sx={{ display: 'flex', gap: 2 }}>
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

export default ConfigureGovernanceCorporateGovernance;