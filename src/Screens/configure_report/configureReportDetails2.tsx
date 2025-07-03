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

const ConfigureReportDetails2: React.FC = () => {
  const navigate = useNavigate();
    // State for form fields
  const [factsFigures, setFactsFigures] = useState<string>('');
  const [factsFiguresDescription, setFactsFiguresDescription] = useState<string>('');
  const [sustainabilityDevelopment, setSustainabilityDevelopment] = useState<string>('');
  const [sustainabilityDevelopmentDescription, setSustainabilityDevelopmentDescription] = useState<string>('');
  const [thresholdAdjustments, setThresholdAdjustments] = useState<string>('');
  const [thresholdAdjustmentsDescription, setThresholdAdjustmentsDescription] = useState<string>('');
  const [customTitle, setCustomTitle] = useState<string>('');
  const [customDescription, setCustomDescription] = useState<string>('');
  const [coverPhoto, setCoverPhoto] = useState<File | null>(null);
  const [coverPhotoPreview, setCoverPhotoPreview] = useState<string | null>(null);

  const handleCoverPhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setCoverPhoto(file);
      setCoverPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleBack = () => {
    navigate('/configure-report/details1');
  };  const handleNext = () => {
    // You can add form validation here before navigating
    console.log('Form data:', {
      factsFigures,
      factsFiguresDescription,
      sustainabilityDevelopment,
      sustainabilityDevelopmentDescription,
      thresholdAdjustments,
      thresholdAdjustmentsDescription,
      customTitle,
      customDescription,
      coverPhoto
    });
    // Navigate to next step or finish
    navigate('/configure-report/cso-Letter');
    alert('Report configuration completed!');
  };
  const configureContent = (
    <Box sx={{ py: 1 }}>
      <Box sx={{  justifyContent: 'space-between', backgroundColor:'white',alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 3, backgroundColor: 'white', p:2, borderRadius: 2 }}>
          Overview - Introduction
        </Typography>
       
      </Box>
      
      <Paper sx={{ p: 4, mx: 'auto' }}>
        <Grid container spacing={4}>
          {/* Facts & Figures Section */}
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                Facts & Figures *
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
              placeholder="Facts & Figures"
              value={factsFigures}
              onChange={(e) => setFactsFigures(e.target.value)}
              sx={{ mb: 2 }}
            />
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 500 }}>
              Description *
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={4}
              placeholder="Lorem Ipsum Is A Global Company With Approximately 17 Million Ton And Part-Time Employees Worldwide And Operations In Africa, Asia-Pacific, Europe, Latin America, The Middle East, And North America. At Lorem Ipsum, We Combine Data And Science With Passion And Invention. We Set Big Goals And Work Backward To Achieve Them. Such As The Climate Pledge, Our Goal To Reach Net- Zero Carbon Emissions By 2040. Dr Years Ahead Of The Paris Agreement. We Apply That Same Tenacity To How We Address Some Of The World's Biggest Environmental And Societal Challenges."
              value={factsFiguresDescription}
              onChange={(e) => setFactsFiguresDescription(e.target.value)}
            />
          </Grid>

          {/* Constant Development Section */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
              Constant Development Of Our Sustainability Reporting *
            </Typography>
            <TextField
              fullWidth
              placeholder="Constant Development Of Our Sustainability Reporting"
              value={sustainabilityDevelopment}
              onChange={(e) => setSustainabilityDevelopment(e.target.value)}
              sx={{ mb: 2 }}
            />
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 500 }}>
              Description *
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={4}
              placeholder="Lorem Ipsum Is A Global Company With Approximately 17 Million Ton And Part-Time Employees Worldwide And Operations In Africa, Asia-Pacific, Europe, Latin America, The Middle East, And North America. At Lorem Ipsum, We Combine Data And Science With Passion And Invention. We Set Big Goals And Work Backward To Achieve Them. Such As The Climate Pledge, Our Goal To Reach Net- Zero Carbon Emissions By 2040. Dr Years Ahead Of The Paris Agreement. We Apply That Same Tenacity To How We Address Some Of The World's Biggest Environmental And Societal Challenges."
              value={sustainabilityDevelopmentDescription}
              onChange={(e) => setSustainabilityDevelopmentDescription(e.target.value)}
            />
          </Grid>

          {/* Threshold for Adjustments Section */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
              Threshold For Adjustments *
            </Typography>
            <TextField
              fullWidth
              placeholder="Threshold For Adjustments"
              value={thresholdAdjustments}
              onChange={(e) => setThresholdAdjustments(e.target.value)}
              sx={{ mb: 2 }}
            />
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 500 }}>
              Description *
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={4}
              placeholder="Lorem Ipsum Is A Global Company With Approximately 17 Million Ton And Part-Time Employees Worldwide And Operations In Africa, Asia-Pacific, Europe, Latin America, The Middle East, And North America. At Lorem Ipsum, We Combine Data And Science With Passion And Invention. We Set Big Goals And Work Backward To Achieve Them. Such As The Climate Pledge, Our Goal To Reach Net- Zero Carbon Emissions By 2040. Dr Years Ahead Of The Paris Agreement. We Apply That Same Tenacity To How We Address Some Of The World's Biggest Environmental And Societal Challenges."
              value={thresholdAdjustmentsDescription}
              onChange={(e) => setThresholdAdjustmentsDescription(e.target.value)}
            />
          </Grid>

          {/* Custom Title Section */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
              Title *
            </Typography>
            <TextField
              fullWidth
              placeholder="Custom Section Title"
              value={customTitle}
              onChange={(e) => setCustomTitle(e.target.value)}
              sx={{ mb: 2 }}
            />
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 500 }}>
              Description *
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={4}
              placeholder="Lorem Ipsum Is A Global Company With Approximately 17 Million Ton And Part-Time Employees Worldwide And Operations In Africa, Asia-Pacific, Europe, Latin America, The Middle East, And North America. At Lorem Ipsum, We Combine Data And Science With Passion And Invention. We Set Big Goals And Work Backward To Achieve Them. Such As The Climate Pledge, Our Goal To Reach Net- Zero Carbon Emissions By 2040. Dr Years Ahead Of The Paris Agreement. We Apply That Same Tenacity To How We Address Some Of The World's Biggest Environmental And Societal Challenges."
              value={customDescription}
              onChange={(e) => setCustomDescription(e.target.value)}
            />
          </Grid>

          {/* Cover Photo Section */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
              Cover Photo
            </Typography>
            <Box display="flex" justifyContent="flex-start" alignItems="center">
              <input
                accept="image/*"
                style={{ display: 'none' }}
                id="cover-photo-upload"
                type="file"
                onChange={handleCoverPhotoUpload}
              />
              <label htmlFor="cover-photo-upload">
                <Button 
                  component="span"
                  variant="outlined" 
                  sx={{ 
                    borderRadius: '8px',
                    color: '#147C65',
                    borderColor: '#147C65',
                    textTransform: 'none',
                    '&:hover': {
                      borderColor: '#147C65',
                      backgroundColor: 'rgba(20, 124, 101, 0.04)'
                    }
                  }}
                >
                  Upload Cover Photo
                </Button>
              </label>
              {coverPhotoPreview && (
                <Box sx={{ ml: 2 }}>
                  <img 
                    src={coverPhotoPreview} 
                    alt="Cover photo preview" 
                    style={{ height: '50px', width: 'auto', borderRadius: '4px' }} 
                  />
                </Box>
              )}
            </Box>
            <Typography variant="caption" sx={{ color: '#64748B', mt: 1, display: 'block' }}>
              Recommended Dimension 1000px X 1000px PNG, JPEG And Size Less Than 15 MB
            </Typography>
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
  )
  return (
    <SidebarHeader>
      {configureContent}
    </SidebarHeader>
  );
};

export default ConfigureReportDetails2;
