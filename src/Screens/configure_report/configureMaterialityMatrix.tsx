// filepath: d:\intern\frontend-task\ecops-esg-main\src\Screens\configure_report\configureMaterialityMatrix.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  Checkbox,
  FormControlLabel,
  RadioGroup,
  Radio,
  FormLabel,
  FormControl,
  Divider
} from '@mui/material';
import SidebarHeader from '../../Components/SidebarHeader.tsx';

const ConfigureMaterialityMatrix: React.FC = () => {
  const navigate = useNavigate();
  
  // State for the three initial input fields
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [matrixDescription, setMatrixDescription] = useState<string>('');
  
  // State for materiality topics checkboxes
  const [materialityTopics, setMaterialityTopics] = useState<{ [key: string]: boolean }>({
    'Energy Consumption and Efficiency': false,
    'Air Quality and Emissions': false,
    'Water and Waste Water': false,
    'Waste, Circular Economy and Packaging': false,
    'Biodiversity and Nature': false,
    'Land Use and Ecosystems': false,
    'Supply Chain Environmental Impact': false,
    'Climate Change': false,
    'Talent Acquisition and Development': false,
    'Employee Health, Safety and Wellbeing': false,
    'Diversity, Equity and Inclusion': false,
    'Human Rights': false,
    'Community Welfare and Development': false,
    'Customer Relations and Product Quality': false,
    'Customer Information Security and Privacy': false,
    'Supply Chain Social Impact': false,
    'Data Governance and Ethics': false,
    'Risk Management and Crisis Preparedness': false,
    'Corporate Governance': false,
    'Business Ethics and Anti-Corruption': false,
    'Innovation and Research & Development': false,
    'Economic Performance': false,
    'Tax Strategy': false,
    'Customer Experience': false,
    'Brand Reputation and Public Relations': false,
    'Market Expansion and Competitive Advantage': false,
    'Product and Service Innovation': false,
    'Regulatory Compliance': false
  });

  // State for chart generation radio buttons
  const [chartGeneration, setChartGeneration] = useState<string>('');
  
  // State for photo upload
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string>('');

  const handleBack = () => {
    navigate('/configure-report/materiality-assessment');
  };
  const handleNext = () => {
    // You can add form validation here before navigating
    console.log('Form data:', {
      title,
      description,
      matrixDescription,
      materialityTopics,
      chartGeneration,
      photo
    });
    // Navigate to next page (or final step)
    navigate("/configure-report/Environmental-Opening-page");
    alert('Materiality Matrix configuration completed!');
  };

  const handleTopicChange = (topic: string) => {
    setMaterialityTopics(prev => ({
      ...prev,
      [topic]: !prev[topic]
    }));
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

  // Group topics by category
  const environmentalTopics = [
    'Energy Consumption and Efficiency',
    'Air Quality and Emissions', 
    'Water and Waste Water',
    'Waste, Circular Economy and Packaging',
    'Biodiversity and Nature',
    'Land Use and Ecosystems',
    'Supply Chain Environmental Impact',
    'Climate Change'
  ];

  const socialTopics = [
    'Talent Acquisition and Development',
    'Employee Health, Safety and Wellbeing',
    'Diversity, Equity and Inclusion',
    'Human Rights',
    'Community Welfare and Development',
    'Customer Relations and Product Quality',
    'Customer Information Security and Privacy',
    'Supply Chain Social Impact'
  ];

  const governanceTopics = [
    'Data Governance and Ethics',
    'Risk Management and Crisis Preparedness',
    'Corporate Governance',
    'Business Ethics and Anti-Corruption',
    'Innovation and Research & Development',
    'Economic Performance',
    'Tax Strategy',
    'Customer Experience',
    'Brand Reputation and Public Relations',
    'Market Expansion and Competitive Advantage',
    'Product and Service Innovation',
    'Regulatory Compliance'
  ];

  return (
    <SidebarHeader>
      <Box sx={{ py: 1 }}>
        <Box sx={{ justifyContent: 'space-between', backgroundColor: 'white', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6" sx={{ mb: 3, backgroundColor: 'white', p: 2, borderRadius: 2 }}>
            Materiality - Materiality Matrix
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
                      backgroundColor: 'rgba(20, 124, 101, 0.04)',
                    }
                  }}
                >
                  Download A Sample PDF Report
                </Button>
              </Box>
            </Grid>

            {/* Title Input */}
            <Grid item xs={12}>
              <Typography variant="body1" sx={{ mb: 1, fontWeight: 500 }}>
                Title *
              </Typography>
              <TextField
                fullWidth
                placeholder="Materiality Matrix"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                sx={{ mb: 2 }}
              />
            </Grid>

            {/* Description Input */}
            <Grid item xs={12}>
              <Typography variant="body1" sx={{ mb: 1, fontWeight: 500 }}>
                Description *
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={4}
                placeholder="Lorem Ipsum Is A Global Company With Approximately 17 Million Ton And Part-Time Employees Worldwide And Operations In Africa, Asia-Pacific, Europe, Latin America, The Middle East, And North America. At Lorem Ipsum, We Combine Data And Science With Passion And Invention."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                sx={{ mb: 2 }}
              />
            </Grid>

            {/* Matrix Description Input */}
            <Grid item xs={12}>
              <Typography variant="body1" sx={{ mb: 1, fontWeight: 500 }}>
                Matrix Description *
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={3}
                placeholder="This materiality matrix shows the relative importance of various environmental, social, and governance topics to our business and stakeholders."
                value={matrixDescription}
                onChange={(e) => setMatrixDescription(e.target.value)}
                sx={{ mb: 4 }}
              />
            </Grid>

            {/* Materiality Topics Section */}
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                Material Topics that you would like to include in your Materiality Matrix *
              </Typography>
              <Typography variant="body2" sx={{ mb: 3, color: '#666' }}>
                Please check all Material Topics that you would like to include in your Materiality Matrix.
              </Typography>

              {/* Environmental Topics */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'bold', color: '#147C65' }}>
                  Environmental
                </Typography>
                <Grid container spacing={1}>
                  {environmentalTopics.map((topic) => (
                    <Grid item xs={12} sm={6} md={4} key={topic}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={materialityTopics[topic]}
                            onChange={() => handleTopicChange(topic)}
                            sx={{
                              color: '#147C65',
                              '&.Mui-checked': {
                                color: '#147C65',
                              },
                            }}
                          />
                        }
                        label={<Typography variant="body2">{topic}</Typography>}
                      />
                    </Grid>
                  ))}
                </Grid>
              </Box>

              <Divider sx={{ my: 3 }} />

              {/* Social Topics */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'bold', color: '#147C65' }}>
                  Social
                </Typography>
                <Grid container spacing={1}>
                  {socialTopics.map((topic) => (
                    <Grid item xs={12} sm={6} md={4} key={topic}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={materialityTopics[topic]}
                            onChange={() => handleTopicChange(topic)}
                            sx={{
                              color: '#147C65',
                              '&.Mui-checked': {
                                color: '#147C65',
                              },
                            }}
                          />
                        }
                        label={<Typography variant="body2">{topic}</Typography>}
                      />
                    </Grid>
                  ))}
                </Grid>
              </Box>

              <Divider sx={{ my: 3 }} />

              {/* Governance Topics */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'bold', color: '#147C65' }}>
                  Governance
                </Typography>
                <Grid container spacing={1}>
                  {governanceTopics.map((topic) => (
                    <Grid item xs={12} sm={6} md={4} key={topic}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={materialityTopics[topic]}
                            onChange={() => handleTopicChange(topic)}
                            sx={{
                              color: '#147C65',
                              '&.Mui-checked': {
                                color: '#147C65',
                              },
                            }}
                          />
                        }
                        label={<Typography variant="body2">{topic}</Typography>}
                      />
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </Grid>

            <Divider sx={{ my: 3, width: '100%' }} />

            {/* Chart Generation Section */}
            <Grid item xs={12}>
              <FormControl component="fieldset">
                <FormLabel 
                  component="legend" 
                  sx={{ 
                    mb: 2, 
                    fontWeight: 'bold',
                    color: '#000',
                    '&.Mui-focused': {
                      color: '#000',
                    }
                  }}
                >
                  Would you like EcoPS to Auto-Generate your Materiality Matrix Chart? *
                </FormLabel>
                <Typography variant="body2" sx={{ mb: 2, color: '#666' }}>
                  EcoPS can auto-generate your Materiality Matrix Chart based on our database of stakeholder priorities and industry benchmarks.
                </Typography>
                <RadioGroup
                  value={chartGeneration}
                  onChange={(e) => setChartGeneration(e.target.value)}
                >
                  <FormControlLabel 
                    value="yes" 
                    control={
                      <Radio 
                        sx={{
                          color: '#147C65',
                          '&.Mui-checked': {
                            color: '#147C65',
                          },
                        }}
                      />
                    } 
                    label="Yes, please auto-generate my Materiality Matrix Chart" 
                  />
                  <FormControlLabel 
                    value="no" 
                    control={
                      <Radio 
                        sx={{
                          color: '#147C65',
                          '&.Mui-checked': {
                            color: '#147C65',
                          },
                        }}
                      />
                    } 
                    label="No, I will upload my own Materiality Matrix Chart" 
                  />
                </RadioGroup>
              </FormControl>
            </Grid>

            {/* Photo Upload Section */}
            {chartGeneration === 'no' && (
              <Grid item xs={12}>
                <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'bold' }}>
                  Upload Materiality Matrix Chart
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <input
                    accept="image/*"
                    style={{ display: 'none' }}
                    id="photo-upload"
                    type="file"
                    onChange={handlePhotoUpload}
                  />
                  <label htmlFor="photo-upload">
                    <Button
                      variant="outlined"
                      component="span"
                      sx={{
                        textTransform: 'none',
                        borderColor: '#147C65',
                        color: '#147C65',
                        '&:hover': {
                          backgroundColor: 'rgba(20, 124, 101, 0.04)',
                        }
                      }}
                    >
                      Choose File
                    </Button>
                  </label>
                  {photo && (
                    <Typography variant="body2" sx={{ mt: 1, color: '#666' }}>
                      Selected: {photo.name}
                    </Typography>
                  )}
                </Box>
                
                {photoPreview && (
                  <Box sx={{ mt: 2 }}>
                    <img
                      src={photoPreview}
                      alt="Preview"
                      style={{
                        maxWidth: '300px',
                        maxHeight: '200px',
                        objectFit: 'cover',
                        borderRadius: '8px'
                      }}
                    />
                  </Box>
                )}
              </Grid>
            )}

            {/* Navigation Buttons */}
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                <Button
                  variant="outlined"
                  onClick={handleBack}
                  sx={{
                    textTransform: 'none',
                    borderColor: '#147C65',
                    color: '#147C65',
                    '&:hover': {
                      backgroundColor: 'rgba(20, 124, 101, 0.04)',
                    }
                  }}
                >
                  Back
                </Button>
                
                <Button
                  variant="contained"
                  onClick={handleNext}
                  sx={{
                    textTransform: 'none',
                    backgroundColor: '#147C65',
                    '&:hover': {
                      backgroundColor: '#0f5c4a',
                    }
                  }}
                >
                  Next
                </Button>
              </Box>
            </Grid>

          </Grid>
        </Paper>
      </Box>
    </SidebarHeader>
  );
};

export default ConfigureMaterialityMatrix;