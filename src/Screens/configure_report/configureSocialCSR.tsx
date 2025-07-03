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

const ConfigureSocialCSR: React.FC = () => {
  const navigate = useNavigate();

  // State for form fields
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [photo1, setPhoto1] = useState<File | null>(null);
  const [photo1Preview, setPhoto1Preview] = useState<string>('');
  const [photo2, setPhoto2] = useState<File | null>(null);
  const [photo2Preview, setPhoto2Preview] = useState<string>('');

  const handleBack = () => {
    navigate('/configure-report/social-responsibility');
  };

  const handleNext = () => {
    console.log('Form data:', {
      title,
      description,
      photo1,
      photo2
    });
    // Navigate to next page (placeholder for now)
    navigate('/configure-report/Social-Material_Topics');
    alert('Social CSR configuration completed!');
  };

  const handlePreview = () => {
    console.log('Preview requested');
    // Preview functionality placeholder
  };

  const handlePhoto1Upload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setPhoto1(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setPhoto1Preview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePhoto2Upload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setPhoto2(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setPhoto2Preview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <SidebarHeader>
      <Box sx={{ py: 1 }}>
        <Box sx={{ justifyContent: 'space-between', backgroundColor: 'white', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6" sx={{ mb: 3, backgroundColor: 'white', p: 2, borderRadius: 2 }}>
            Social - CSR or Community Engagement Initiatives
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
                <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                  Title *
                </Typography>
                <TextField
                  fullWidth
                  placeholder=""
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
                  placeholder="As CSR practices become more important to stakeholders and the broader community, reporting on CSR initiatives is becoming an essential part of business operations. This includes social initiatives in the countries where We operate. The organization has embraced a customer-focused approach to create both business and Social value from our efforts."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </Box>
            </Grid>

            {/* Photo 1 Upload */}
            <Grid item xs={12}>
              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" sx={{ mb: 2, fontWeight: 500 }}>
                  Photo 1
                </Typography>
                <Box
                  sx={{
                    border: '2px dashed #147C65',
                    borderRadius: 2,
                    p: 3,
                    textAlign: 'center',
                    backgroundColor: '#f8f9fa'
                  }}
                >
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhoto1Upload}
                    style={{ display: 'none' }}
                    id="photo1-upload"
                  />
                  <label htmlFor="photo1-upload">
                    <Button
                      component="span"
                      variant="contained"
                      sx={{
                        backgroundColor: '#147C65',
                        '&:hover': {
                          backgroundColor: '#0E5A4A',
                        },
                        textTransform: 'none'
                      }}
                    >
                      Upload Cover Photo
                    </Button>
                  </label>
                  <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
                    Recommended Dimension 1920px X 640px PNG, JPEG and less than 5MB.
                  </Typography>
                  {photo1Preview && (
                    <Box sx={{ mt: 2 }}>
                      <img
                        src={photo1Preview}
                        alt="Photo 1 Preview"
                        style={{
                          maxWidth: '200px',
                          maxHeight: '150px',
                          objectFit: 'cover',
                          borderRadius: '8px'
                        }}
                      />
                    </Box>
                  )}
                </Box>
              </Box>
            </Grid>

            {/* Photo 2 Upload */}
            <Grid item xs={12}>
              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" sx={{ mb: 2, fontWeight: 500 }}>
                  Photo 2
                </Typography>
                <Box
                  sx={{
                    border: '2px dashed #147C65',
                    borderRadius: 2,
                    p: 3,
                    textAlign: 'center',
                    backgroundColor: '#f8f9fa'
                  }}
                >
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhoto2Upload}
                    style={{ display: 'none' }}
                    id="photo2-upload"
                  />
                  <label htmlFor="photo2-upload">
                    <Button
                      component="span"
                      variant="contained"
                      sx={{
                        backgroundColor: '#147C65',
                        '&:hover': {
                          backgroundColor: '#0E5A4A',
                        },
                        textTransform: 'none'
                      }}
                    >
                      Upload Cover Photo
                    </Button>
                  </label>
                  <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
                    Recommended Dimension 1920px X 640px PNG, JPEG and less than 5MB.
                  </Typography>
                  {photo2Preview && (
                    <Box sx={{ mt: 2 }}>
                      <img
                        src={photo2Preview}
                        alt="Photo 2 Preview"
                        style={{
                          maxWidth: '200px',
                          maxHeight: '150px',
                          objectFit: 'cover',
                          borderRadius: '8px'
                        }}
                      />
                    </Box>
                  )}
                </Box>
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

export default ConfigureSocialCSR;