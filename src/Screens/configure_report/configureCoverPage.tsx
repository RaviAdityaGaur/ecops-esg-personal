import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Grid
} from '@mui/material';
import SidebarHeader from '../../Components/SidebarHeader.tsx';

// Change this from "Reports" to "ConfigureCoverPage"
const ConfigureCoverPage: React.FC = () => {
  const [organisationName, setOrganisationName] = useState<string>('');
  const [reportTitle, setReportTitle] = useState<string>('');
  const [reportingPeriod, setReportingPeriod] = useState<string>('');
  const [surveyLogoPreview, setSurveyLogoPreview] = useState<string | null>(null);
   const navigate = useNavigate();


  const handleNext = () => {
    // You can add form validation here before navigating
    if (organisationName && reportTitle && reportingPeriod) {
      navigate('/configure-report/content');
    } else {
      alert('Please fill all required fields');
    }
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({
      organisationName,
      reportTitle,
      reportingPeriod
    });
  };

  
 
   const handleSurveyLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.files && event.target.files[0]) {
        const file = event.target.files[0];
        setSurveyLogoPreview(URL.createObjectURL(file));
      }
    };

  const configureContent = (
    <Box sx={{ py: 1 }}>
      <Typography variant="h5" sx={{ mb: 3, backgroundColor: 'white', p:2, borderRadius: 2 }}>
        Configure Report
      </Typography>
      
      <Paper sx={{ p: 4 , mx: 'auto' }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Cover Page
        </Typography>
        
        <form onSubmit={handleSubmit}>
        
<Grid container spacing={2}>
  <Grid item xs={12}>
    <TextField
      fullWidth
      label="Organisation Name"
      placeholder="Enter The Organisation Name"
      value={organisationName}
      onChange={(e) => setOrganisationName(e.target.value)}
      required
    />
  </Grid>
  
  <Grid item xs={12}>
    <TextField
      fullWidth
      label="Report Title"
      placeholder="Enter The Report Title"
      value={reportTitle}
      onChange={(e) => setReportTitle(e.target.value)}
      helperText="Less Than 60 Characters"
      required
    />
  </Grid>
  
  <Grid item xs={12}>
    <FormControl fullWidth required>
      <InputLabel>Reporting Period</InputLabel>
      <Select
        value={reportingPeriod}
        label=""
        onChange={(e) => setReportingPeriod(e.target.value)}
        displayEmpty
      >
        <MenuItem value=""></MenuItem>
        <MenuItem value="2024">2024</MenuItem>
        <MenuItem value="2023">2023</MenuItem>
        <MenuItem value="2022">2022</MenuItem>
        <MenuItem value="2021">2021</MenuItem>
      </Select>
    </FormControl>
  </Grid>

  {/* Logo Upload Section */}
  <Grid item xs={12}>
    <Box display="flex" justifyContent="flex-start" alignItems="center">
      <input
        accept="image/*"
        style={{ display: 'none' }}
        id="logo-upload"
        type="file"
        onChange={handleSurveyLogoUpload}
      />
      <label htmlFor="logo-upload">
        <Button 
          component="span"
          variant="outlined" 
          sx={{ 
            borderRadius: '8px',
            color: 'rgb(54, 115, 97)',
            borderColor: 'rgb(54, 115, 97)',
            '&:hover': {
              borderColor: 'rgb(54, 115, 97)',
              backgroundColor: 'rgba(54, 115, 97, 0.04)'
            }
          }}
        >
          Upload logo
        </Button>
      </label>      {surveyLogoPreview && (
        <Box sx={{ ml: 2 }}>
          <img 
            src={surveyLogoPreview} 
            alt="Logo preview" 
            style={{ height: '40px', width: 'auto' }} 
          />
        </Box>
      )}
    </Box>
    <Typography variant="caption" sx={{ color: '#64748B', mt: 1, display: 'block' }}>
      Recommended Dimension 300px x 300px PNG, JPEG And Size Less Than 5 MB
    </Typography>
  </Grid>

  {/* Cover Image Upload Section */}
  <Grid item xs={12}>
    <Box display="flex" justifyContent="flex-start" alignItems="center">
      <input
        accept="image/*"
        style={{ display: 'none' }}
        id="cover-image-upload"
        type="file"
        onChange={handleSurveyLogoUpload}
      />
      <label htmlFor="cover-image-upload">
        <Button 
          component="span"
          variant="outlined" 
          sx={{ 
            borderRadius: '8px',
            color: 'rgb(54, 115, 97)',
            borderColor: 'rgb(54, 115, 97)',
            '&:hover': {
              borderColor: 'rgb(54, 115, 97)',
              backgroundColor: 'rgba(54, 115, 97, 0.04)'
            }
          }}
        >
          Upload Cover Photo
        </Button>
      </label>      {surveyLogoPreview && (
        <Box sx={{ ml: 2 }}>
          <img 
            src={surveyLogoPreview} 
            alt="Cover photo preview" 
            style={{ height: '40px', width: 'auto' }} 
          />
        </Box>
      )}
    </Box>
    <Typography variant="caption" sx={{ color: '#64748B', mt: 1, display: 'block' }}>
      Recommended Dimension 1000px x 1000px PNG, JPEG And Size Less Than 15 MB
    </Typography>
  </Grid>  {/* Action Buttons */}
    <Grid item xs={12}>
    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
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
          onClick={() => navigate('/configure-report')}
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

        </form>
      </Paper>
    </Box>
  );

  return (
    <SidebarHeader>
      {configureContent}
    </SidebarHeader>
  );
};

// Change the export name too
export default ConfigureCoverPage;