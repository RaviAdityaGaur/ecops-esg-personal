import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import SidebarHeader from "../../Components/SidebarHeader"
import { Box, Button, Grid, Paper, TextField, Typography } from "@mui/material";

const ConfigureSustainabilityStructure: React.FC =()=> {
    const navigate = useNavigate();
    
    // State for form fields
    const [title, setTitle] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [coverPhoto, setCoverPhoto] = useState<File | null>(null);
    const [coverPhotoPreview, setCoverPhotoPreview] = useState<string | null>(null);

    const handleCoverPhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.files && event.target.files[0]) {
        const file = event.target.files[0];
        setCoverPhoto(file);
        setCoverPhotoPreview(URL.createObjectURL(file));
      }
    };

    const handleBack =() =>{
        navigate("/configure-report/about-us");
    }
    const handleNext =() =>{
      navigate("/configure-report/ESG-goals-progress")
    }

    const structureContent = (
         <Box sx={{ py: 1 }}>
                <Box sx={{  justifyContent: 'space-between', backgroundColor:'white',alignItems: 'center', mb: 3 }}>
                        <Typography variant="h6" sx={{ mb: 3, backgroundColor: 'white', p:2, borderRadius: 2 }}>
                          Overview - A Letter from Our Chief Sustainability Officer
                        </Typography>
                       
                      </Box>
                      
        
                <Paper sx={{ p: 4, mx: 'auto' }}>
                  <Grid container spacing={3}>
                    {/* Title Section */}            <Grid item xs={12}>
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
                        placeholder="A Letter from Our Chief Sustainability Officer"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        sx={{ mt: 2, mb: 3 }}
                      />              <Typography variant="body1" sx={{ mb: 1, fontWeight: 500 }}>
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
                    </Grid>            {/* Cover Photo Section */}
                    <Grid item xs={12}>
                      <Typography variant="body1" sx={{ fontWeight: 500, mt: 1 }}>
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
    
    return(
        <SidebarHeader>
            {structureContent}
        </SidebarHeader>
    )
}

export default ConfigureSustainabilityStructure;