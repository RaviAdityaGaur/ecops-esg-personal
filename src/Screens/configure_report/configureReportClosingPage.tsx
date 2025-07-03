import React, { useState } from 'react';
import { Box, Typography, Paper, Grid, Button, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SidebarHeader from '../../Components/SidebarHeader.tsx';

const ReportClosingPage: React.FC = () => {
    const navigate = useNavigate();

   
      const [Title, setTitle] = useState<string>('');
    const [Description, setDescription] = useState<string>('');
    const [LOGO, setLOGO] = useState<File | null>(null)
    const [LOGOPreview, setLOGOPreview] = useState<string>('');

     const handleBack=() =>{
        navigate('/configure-report/Appendix-Disclaimer')
    }   
    const handleNext = () =>{
        console.log('Form data:', {
      Title,
      Description,
      LOGO
    });
    // Navigate to Governance in Figures page
    navigate('');
    }

    const handleLOGOUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
          setLOGO(file);
          
          // Create preview URL
          const reader = new FileReader();
          reader.onload = (e) => {
            setLOGOPreview(e.target?.result as string);
          };
          reader.readAsDataURL(file);
        }
      };

    const content = (
        <Box sx={{ py: 1 }}>
                <Box sx={{ justifyContent: 'space-between', backgroundColor: 'white', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h6" sx={{ mb: 3, backgroundColor: 'white', p: 2, borderRadius: 2 }}>
                    Report - Closing Page
                  </Typography>
                </Box>
        
                <Paper sx={{ p: 4, mx: 'auto' }}>
                  <Grid container spacing={3}>

                    {/* Cover Photo Section */}
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
                        onClick={() => document.getElementById('cover-photo-input')?.click()}
                      >
                        {LOGOPreview ? (
                          <Box sx={{ position: 'relative', width: '100%', maxWidth: '200px' }}>
                            <img 
                              src={LOGOPreview} 
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
                              Upload LOGO
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
                          onChange={handleLOGOUpload}
                          style={{ display: 'none' }}
                        />
                      </Box>
                    </Grid>

                    {/* Description Section */}
                    <Grid item xs={12}>
                      <Typography variant="body1" sx={{ mb: 1, fontWeight: 500 }}>
                        Description *
                      </Typography>
                      <TextField
                        fullWidth
                        multiline
                        rows={8}
                        placeholder="Lorem Ipsum Is A Global Company With Approximately 17 Million Ton And Part-Time Employees Worldwide And Operations In Africa, Asia-Pacific, Europe, Latin America, The Middle East, And North America. At Lorem Ipsum, We Combine Data And Science With Passion And Invention. We Set Big Goals And Work Backward To Achieve Them, Such As The Climate Pledge, Our Goal To Reach Net- Zero Carbon Emissions By 2040. 10 Years Ahead Of The Paris Agreement. We Apply That Same Tenacity To How We Address Some Of The World's Biggest Environmental And Societal Challenges."
                        value={Description}
                        onChange={(e) => setDescription(e.target.value)}
                        sx={{ mb: 4 }}
                      />
                    </Grid>
        

                    {/* Title Section */}
                    <Grid item xs={12}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          Footer      *
                        </Typography>
                        
                      </Box>
                      <TextField
                        fullWidth
                        placeholder="Materiality"
                        value={Title}
                        onChange={(e) => setTitle(e.target.value)}
                        sx={{ mt: 2, mb: 3 }}
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
    )

    return (
      <SidebarHeader>
        {content}
      </SidebarHeader>
        
    )
}
export default ReportClosingPage;