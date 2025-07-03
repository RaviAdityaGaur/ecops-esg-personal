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

const ConfigureMaterialityAssessment: React.FC = () => {
  const navigate = useNavigate();
    // State for form fields
  const [materialityAssessmentTitle, setMaterialityAssessmentTitle] = useState<string>('');
  const [materialityAssessment, setMaterialityAssessment] = useState<string>('');
  const [stakeholderEngagementTitle, setStakeholderEngagementTitle] = useState<string>('');
  const [stakeholderEngagement, setStakeholderEngagement] = useState<string>('');
  const [materialTopicsTitle, setMaterialTopicsTitle] = useState<string>('');
  const [materialTopics, setMaterialTopics] = useState<string>('');
  const [customTitleField, setCustomTitleField] = useState<string>('');
  const [customTitle, setCustomTitle] = useState<string>('');
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string>('');

  const handleBack = () => {
    navigate('/configure-report/materiality-opening-page');
  };  const handleNext = () => {
    // You can add form validation here before navigating
    console.log('Form data:', {
      materialityAssessmentTitle,
      materialityAssessment,
      stakeholderEngagementTitle,
      stakeholderEngagement,
      materialTopicsTitle,
      materialTopics,
      customTitleField,
      customTitle,
      photo
    });
    // Navigate to next page
    navigate('/configure-report/materiality-matrix');
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setPhoto(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setPhotoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <SidebarHeader>
      <Box sx={{ py: 1 }}>
        <Box sx={{ justifyContent: 'space-between', backgroundColor: 'white', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6" sx={{ mb: 3, backgroundColor: 'white', p: 2, borderRadius: 2 }}>
            Materiality - Materiality Assessment
          </Typography>
        </Box>

        <Paper sx={{ p: 4, mx: 'auto' }}>
          <Grid container spacing={3}>            {/* Materiality Assessment Section */}
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
                      backgroundColor: 'rgba(20, 124, 101, 0.04)',
                    }
                  }}
                >
                  Download A Sample PDF Report
                </Button>
              </Box>
              <TextField
                fullWidth
                placeholder="Materiality Assessment - Understanding What Matters Most"
                value={materialityAssessmentTitle}
                onChange={(e) => setMaterialityAssessmentTitle(e.target.value)}
                sx={{ mt: 2, mb: 2 }}
              />
              <TextField
                fullWidth
                multiline
                rows={4}
                placeholder="Lorem Ipsum Is A Global Company With Approximately 17 Million Ton And Part-Time Employees Worldwide And Operations In Africa, Asia-Pacific, Europe, Latin America, The Middle East, And North America. At Lorem Ipsum, We Combine Data And Science With Passion And Invention. We Set Big Goals And Work Backward To Achieve Them, Such As The Climate Pledge, Our Goal To Reach Net- Zero Carbon Emissions By 2040. 10 Years Ahead Of The Paris Agreement. We Apply That Same Tenacity To How We Address Some Of The World's Biggest Environmental And Societal Challenges."
                value={materialityAssessment}
                onChange={(e) => setMaterialityAssessment(e.target.value)}
                sx={{ mb: 3 }}
              />
            </Grid>

            {/* Stakeholder Engagement Section */}
            <Grid item xs={12}>
              
              <TextField
                fullWidth
                placeholder="Stakeholder Engagement, The Core Of Our Process"
                value={stakeholderEngagementTitle}
                onChange={(e) => setStakeholderEngagementTitle(e.target.value)}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                multiline
                rows={4}
                placeholder="Lorem Ipsum Is A Global Company With Approximately 17 Million Ton And Part-Time Employees Worldwide And Operations In Africa, Asia-Pacific, Europe, Latin America, The Middle East, And North America. At Lorem Ipsum, We Combine Data And Science With Passion And Invention. We Set Big Goals And Work Backward To Achieve Them, Such As The Climate Pledge, Our Goal To Reach Net- Zero Carbon Emissions By 2040. 10 Years Ahead Of The Paris Agreement. We Apply That Same Tenacity To How We Address Some Of The World's Biggest Environmental And Societal Challenges."
                value={stakeholderEngagement}
                onChange={(e) => setStakeholderEngagement(e.target.value)}
                sx={{ mb: 3 }}
              />
            </Grid>

            {/* Material Topics Section */}
            <Grid item xs={12}>
             
              <TextField
                fullWidth
                placeholder="Material Topics"
                value={materialTopicsTitle}
                onChange={(e) => setMaterialTopicsTitle(e.target.value)}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                multiline
                rows={4}
                placeholder="Lorem Ipsum Is A Global Company With Approximately 17 Million Ton And Part-Time Employees Worldwide And Operations In Africa, Asia-Pacific, Europe, Latin America, The Middle East, And North America. At Lorem Ipsum, We Combine Data And Science With Passion And Invention. We Set Big Goals And Work Backward To Achieve Them, Such As The Climate Pledge, Our Goal To Reach Net- Zero Carbon Emissions By 2040. 10 Years Ahead Of The Paris Agreement. We Apply That Same Tenacity To How We Address Some Of The World's Biggest Environmental And Societal Challenges."
                value={materialTopics}
                onChange={(e) => setMaterialTopics(e.target.value)}
                sx={{ mb: 3 }}
              />
            </Grid>

            {/* Custom Title Section */}
            <Grid item xs={12}>
              
              <TextField
                fullWidth
                placeholder="Custom Title"
                value={customTitleField}
                onChange={(e) => setCustomTitleField(e.target.value)}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                multiline
                rows={4}
                placeholder="Lorem Ipsum Is A Global Company With Approximately 17 Million Ton And Part-Time Employees Worldwide And Operations In Africa, Asia-Pacific, Europe, Latin America, The Middle East, And North America. At Lorem Ipsum, We Combine Data And Science With Passion And Invention. We Set Big Goals And Work Backward To Achieve Them, Such As The Climate Pledge, Our Goal To Reach Net- Zero Carbon Emissions By 2040. 10 Years Ahead Of The Paris Agreement. We Apply That Same Tenacity To How We Address Some Of The World's Biggest Environmental And Societal Challenges."
                value={customTitle}
                onChange={(e) => setCustomTitle(e.target.value)}
                sx={{ mb: 4 }}
              />
            </Grid>

            {/* Photo Section */}
            <Grid item xs={12}>
              
              
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
                onClick={() => document.getElementById('photo-input')?.click()}
              >
                {photoPreview ? (
                  <Box sx={{ position: 'relative', width: '100%', maxWidth: '200px' }}>
                    <img 
                      src={photoPreview} 
                      alt="Photo preview" 
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
                      Upload Photo
                    </Button>
                    <Typography variant="body2" color="textSecondary">
                      Recommended: 1920px x 650px PNG, JPEG And Size Less Than 15 MB
                    </Typography>
                  </>
                )}
                
                <input
                  id="photo-input"
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
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

export default ConfigureMaterialityAssessment;