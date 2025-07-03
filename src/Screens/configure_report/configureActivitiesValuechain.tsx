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

const ConfigureActivitiesValueChain: React.FC = () => {
  const navigate = useNavigate();
  
  // State for form fields
  const [valueStreams, setValueStreams] = useState<string>('');
  const [valueChain, setValueChain] = useState<string>('');
  const [businessRelationships, setBusinessRelationships] = useState<string>('');
  const [changesMadeToReportingPeriod, setChangesMadeToReportingPeriod] = useState<string>('');
  const [coverPhoto, setCoverPhoto] = useState<File | null>(null);
  const [coverPhotoPreview, setCoverPhotoPreview] = useState<string>('');

  const handleBack = () => {
    navigate('/configure-report/year-in-review');
  };
  const handleNext = () => {
    // You can add form validation here before navigating
    console.log('Form data:', {
      valueStreams,
      valueChain,
      businessRelationships,
      changesMadeToReportingPeriod,
      coverPhoto
    });
    // Navigate to Materiality Opening Page
    navigate('/configure-report/materiality-opening-page');
  };

  const handleCoverPhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setCoverPhoto(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setCoverPhotoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <SidebarHeader>
      <Box sx={{ py: 1 }}>
        <Box sx={{ justifyContent: 'space-between', backgroundColor: 'white', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6" sx={{ mb: 3, backgroundColor: 'white', p: 2, borderRadius: 2 }}>
            Overview - Activities And Value Chain
          </Typography>
        </Box>

        <Paper sx={{ p: 4, mx: 'auto' }}>
          <Grid container spacing={3}>
            {/* Value Streams Section */}
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  Value Streams *
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
                multiline
                rows={4}
                placeholder="Lorem Ipsum Is A Global Company With Approximately 17 Million Ton And Part-Time Employees Worldwide And Operations In Africa, Asia-Pacific, Europe, Latin America, The Middle East, And North America. At Lorem Ipsum, We Combine Data And Science With Passion And Invention. We Set Big Goals And Work Backward To Achieve Them, Such As The Climate Pledge, Our Goal To Reach Net- Zero Carbon Emissions By 2040. 10 Years Ahead Of The Paris Agreement. We Apply That Same Tenacity To How We Address Some Of The World's Biggest Environmental And Societal Challenges."
                value={valueStreams}
                onChange={(e) => setValueStreams(e.target.value)}
                sx={{ mt: 2, mb: 3 }}
              />
            </Grid>

            {/* Value Chain Section */}
            <Grid item xs={12}>
              <Typography variant="body1" sx={{ mb: 1, fontWeight: 500 }}>
                Value Chain *
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={4}
                placeholder="Lorem Ipsum Is A Global Company With Approximately 17 Million Ton And Part-Time Employees Worldwide And Operations In Africa, Asia-Pacific, Europe, Latin America, The Middle East, And North America. At Lorem Ipsum, We Combine Data And Science With Passion And Invention. We Set Big Goals And Work Backward To Achieve Them, Such As The Climate Pledge, Our Goal To Reach Net- Zero Carbon Emissions By 2040. 10 Years Ahead Of The Paris Agreement. We Apply That Same Tenacity To How We Address Some Of The World's Biggest Environmental And Societal Challenges."
                value={valueChain}
                onChange={(e) => setValueChain(e.target.value)}
                sx={{ mb: 3 }}
              />
            </Grid>

            {/* Business Relationships Section */}
            <Grid item xs={12}>
              <Typography variant="body1" sx={{ mb: 1, fontWeight: 500 }}>
                Business Relationships *
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={4}
                placeholder="Lorem Ipsum Is A Global Company With Approximately 17 Million Ton And Part-Time Employees Worldwide And Operations In Africa, Asia-Pacific, Europe, Latin America, The Middle East, And North America. At Lorem Ipsum, We Combine Data And Science With Passion And Invention. We Set Big Goals And Work Backward To Achieve Them, Such As The Climate Pledge, Our Goal To Reach Net- Zero Carbon Emissions By 2040. 10 Years Ahead Of The Paris Agreement. We Apply That Same Tenacity To How We Address Some Of The World's Biggest Environmental And Societal Challenges."
                value={businessRelationships}
                onChange={(e) => setBusinessRelationships(e.target.value)}
                sx={{ mb: 3 }}
              />
            </Grid>

            {/* Changes Made To Reporting Period Section */}
            <Grid item xs={12}>
              <Typography variant="body1" sx={{ mb: 1, fontWeight: 500 }}>
                Changes Compared To Reporting Period *
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={4}
                placeholder="Lorem Ipsum Is A Global Company With Approximately 17 Million Ton And Part-Time Employees Worldwide And Operations In Africa, Asia-Pacific, Europe, Latin America, The Middle East, And North America. At Lorem Ipsum, We Combine Data And Science With Passion And Invention. We Set Big Goals And Work Backward To Achieve Them, Such As The Climate Pledge, Our Goal To Reach Net- Zero Carbon Emissions By 2040. 10 Years Ahead Of The Paris Agreement. We Apply That Same Tenacity To How We Address Some Of The World's Biggest Environmental And Societal Challenges."
                value={changesMadeToReportingPeriod}
                onChange={(e) => setChangesMadeToReportingPeriod(e.target.value)}
                sx={{ mb: 4 }}
              />
            </Grid>

            {/* Cover Photo Section */}
            <Grid item xs={12}>
              <Typography variant="body1" sx={{ mb: 2, fontWeight: 500 }}>
                Cover Photo
              </Typography>
              
              <Box
                sx={{
                  border: '2px dashed #E2E8F0',
                  borderRadius: 2,
                  p: 4,
                  textAlign: 'center',
                  backgroundColor: '#F8FAFC',
                  cursor: 'pointer',
                  position: 'relative',
                  minHeight: '120px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'column'
                }}
                onClick={() => document.getElementById('cover-photo-input')?.click()}
              >
                {coverPhotoPreview ? (
                  <Box sx={{ position: 'relative', width: '100%', maxWidth: '200px' }}>
                    <img 
                      src={coverPhotoPreview} 
                      alt="Cover preview" 
                      style={{ 
                        width: '100%', 
                        height: 'auto', 
                        borderRadius: '8px',
                        maxHeight: '150px',
                        objectFit: 'cover'
                      }} 
                    />
                  </Box>
                ) : (
                  <>
                    <Button
                      variant="contained"
                      sx={{
                        backgroundColor: '#147C65',
                        '&:hover': {
                          backgroundColor: '#0E5A4A',
                        },
                        textTransform: 'none',
                        mb: 1
                      }}
                    >
                      Upload Cover Photo
                    </Button>
                    <Typography variant="body2" color="textSecondary">
                      Recommended: 1920px x 650px PNG, JPEG And Size Less Than 15 MB
                    </Typography>
                  </>
                )}
                
                <input
                  id="cover-photo-input"
                  type="file"
                  accept="image/*"
                  onChange={handleCoverPhotoUpload}
                  style={{ display: 'none' }}
                />
              </Box>
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

export default ConfigureActivitiesValueChain;