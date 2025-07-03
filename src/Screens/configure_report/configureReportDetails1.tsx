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

const ConfigureReportDetails1: React.FC = () => {
  const navigate = useNavigate();
  
  // State for form fields
  const [aboutCompany, setAboutCompany] = useState<string>('');
  const [aboutCompanyDescription, setAboutCompanyDescription] = useState<string>('');
  const [aboutReport, setAboutReport] = useState<string>('');
  const [aboutReportDescription, setAboutReportDescription] = useState<string>('');
  const [aboutFrameworkDisclosures, setAboutFrameworkDisclosures] = useState<string>('');
  const [frameworkDescription, setFrameworkDescription] = useState<string>('');
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
    navigate('/configure-report/content');
  };

  const handleNext = () => {
    // You can add form validation here before navigating
    console.log('Form data:', {
      aboutCompany,
      aboutCompanyDescription,
      aboutReport,
      aboutReportDescription,
      aboutFrameworkDisclosures,
      frameworkDescription,
      coverPhoto
    });
    // Navigate to next step or finish
    navigate('/configure-report/details2');
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
          {/* About Company Section */}
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
              About Company *
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
              placeholder="Add Heading"
              value={aboutCompany}
              onChange={(e) => setAboutCompany(e.target.value)}
              sx={{ mb: 2 }}
            />
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 500 }}>
              Description *
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={4}
              placeholder="Lorem Ipsum is a Global Company With Approximately 17 Million Ton And Pilot Ion Equipment Worldwide And Operations In Africa, Asia-Pacific, Europe, Latin America, The Middle East, And North America. Its Main Activities Are Processing Steel Low Carbon Steel And Aluminum Steel Among Others. We Are One Of The Leading Suppliers Of The Raw Materials And Services. We Are Primarily Focused On Enabling Technology, Expertise And Creating Efficiency..."
              value={aboutCompanyDescription}
              onChange={(e) => setAboutCompanyDescription(e.target.value)}
            />
          </Grid>

          {/* About Report Section */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
              About Report *
            </Typography>
            <TextField
              fullWidth
              placeholder="About This Report"
              value={aboutReport}
              onChange={(e) => setAboutReport(e.target.value)}
              sx={{ mb: 2 }}
            />
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 500 }}>
              Description *
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={4}
              placeholder="This Is The 2024 Annual Report Detailing Progress Against Our Goals, And Environmental, Social, And Governance Topics Of Material Focus As Recognized In Our Golfto-Mr. Group (Materials Within The Data Center) To Improve Report Progress And Our Services That Financial Year 2023 (FY 2023) Has Operations Located. This Report Contains Information About Main Elements Of And Our Capabilities To The Businesses And Customer's Ours...."
              value={aboutReportDescription}
              onChange={(e) => setAboutReportDescription(e.target.value)}
            />
          </Grid>

          {/* About Framework Disclosures Section */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
              About Framework Disclosures
            </Typography>
            <TextField
              fullWidth
              placeholder="Framework Disclosures"
              value={aboutFrameworkDisclosures}
              onChange={(e) => setAboutFrameworkDisclosures(e.target.value)}
              sx={{ mb: 2 }}
            />
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 500 }}>
              Description *
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={4}
              placeholder="Lorem Ipsum is a Global Company With Approximately 17 Million Ton And Pilot Ion Equipment Worldwide And Operations In Africa, Asia-Pacific, Europe, Latin America, The Middle East, And North America. Its Main Activities Are Processing Steel Low Carbon Steel And Aluminum Steel Among Others. We Are One Of The Leading Suppliers Of The Raw Materials And Services. We Are Primarily Focused On Enabling Technology, Expertise And Creating Efficiency..."
              value={frameworkDescription}
              onChange={(e) => setFrameworkDescription(e.target.value)}
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
          </Grid>          {/* Action Buttons */}
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
              <Button
                variant="outlined"
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
  );

  return (
    <SidebarHeader>
      {configureContent}
    </SidebarHeader>
  );
};

export default ConfigureReportDetails1;
