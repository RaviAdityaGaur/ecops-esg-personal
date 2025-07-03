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

const ConfigureEnvInFigures: React.FC = () => {
  const navigate = useNavigate();
    // State for form fields
  const [title, setTitle] = useState<string>('');
  const [summary, setSummary] = useState<string>('');
  
  // Card 1 states
  const [card1Title, setCard1Title] = useState<string>('');
  const [card1Highlight, setCard1Highlight] = useState<string>('');
  const [card1Description, setCard1Description] = useState<string>('');
  
  // Card 2 states
  const [card2Title, setCard2Title] = useState<string>('');
  const [card2Highlight, setCard2Highlight] = useState<string>('');
  const [card2Description, setCard2Description] = useState<string>('');
  
  // Card 3 states
  const [card3Title, setCard3Title] = useState<string>('');
  const [card3Highlight, setCard3Highlight] = useState<string>('');
  const [card3Description, setCard3Description] = useState<string>('');
  
  // Card 4 states
  const [card4Title, setCard4Title] = useState<string>('');
  const [card4Highlight, setCard4Highlight] = useState<string>('');
  const [card4Description, setCard4Description] = useState<string>('');
  
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string>('');

  const handleBack = () => {
    navigate('/configure-report/Environmental-Opening-page');
  };
  const handleNext = () => {    console.log('Form data:', {
      title,
      summary,
      card1Title,
      card1Highlight,
      card1Description,
      card2Title,
      card2Highlight,
      card2Description,
      card3Title,
      card3Highlight,
      card3Description,
      card4Title,
      card4Highlight,
      card4Description,
      photo
    });
    // Navigate to Environment Commitment Goals and Initiatives page
    navigate('/configure-report/environment-commitment-goals-initiatives');
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
            Environmental - Environment in Figures
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

            {/* Title Section */}
            <Grid item xs={12}>
              <Typography variant="body1" sx={{ mb: 1, fontWeight: 500 }}>
                Title *
              </Typography>
              <TextField
                fullWidth
                placeholder="Our Blog"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                sx={{ mb: 3 }}
              />
            </Grid>

            {/* Summary Section */}
            <Grid item xs={12}>
              <Typography variant="body1" sx={{ mb: 1, fontWeight: 500 }}>
                Summary *
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={4}
                placeholder="Lorem Ipsum Is A Global Company With Approximately 17 Million Ton And Part-Time Employees Worldwide And Operations In Africa, Asia-Pacific, Europe, Latin America, The Middle East, And North America. At Lorem Ipsum, We Combine Data And Science With Passion And Invention. We Set Big Goals And Work Backward To Achieve Them, Such As The Climate Pledge, Our Goal To Reach Net- Zero Carbon Emissions By 2040. 10 Years Ahead Of The Paris Agreement. We Apply That Same Tenacity To How We Address Some Of The World's Biggest Environmental And Societal Challenges."
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                sx={{ mb: 4 }}
              />
            </Grid>            {/* Card 1 */}
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                Card 1
              </Typography>
              
              {/* Title and Highlight row */}
              <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                    Title *
                  </Typography>
                  <TextField
                    fullWidth
                    placeholder="CSR"
                    value={card1Title}
                    onChange={(e) => setCard1Title(e.target.value)}
                  />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                    Highlight *
                  </Typography>
                  <TextField
                    fullWidth
                    placeholder="0.8%"
                    value={card1Highlight}
                    onChange={(e) => setCard1Highlight(e.target.value)}
                  />
                </Box>
              </Box>
              
              {/* Description */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                  Description *
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  placeholder="Lorem Ipsum Is A Global Company With Approximately 17 Million Ton And Part-Time Employees Worldwide And Operations In Africa, Asia-Pacific, Europe, Latin America, The Middle East, And North America. At Lorem Ipsum, We Combine Data And Science With Passion And Invention. We Set Big Goals And Work Backward To Achieve Them, Such As The Climate Pledge, Our Goal To Reach Net- Zero Carbon Emissions By 2040. 10 Years Ahead Of The Paris Agreement. We Apply That Same Tenacity To How We Address Some Of The World's Biggest Environmental And Societal Challenges."
                  value={card1Description}
                  onChange={(e) => setCard1Description(e.target.value)}
                />
              </Box>
            </Grid>            {/* Card 2 */}
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                Card 2
              </Typography>
              
              {/* Title and Highlight row */}
              <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                    Title *
                  </Typography>
                  <TextField
                    fullWidth
                    placeholder="CSR"
                    value={card2Title}
                    onChange={(e) => setCard2Title(e.target.value)}
                  />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                    Highlight *
                  </Typography>
                  <TextField
                    fullWidth
                    placeholder="0.8%"
                    value={card2Highlight}
                    onChange={(e) => setCard2Highlight(e.target.value)}
                  />
                </Box>
              </Box>
              
              {/* Description */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                  Description *
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  placeholder="Lorem Ipsum Is A Global Company With Approximately 17 Million Ton And Part-Time Employees Worldwide And Operations In Africa, Asia-Pacific, Europe, Latin America, The Middle East, And North America. At Lorem Ipsum, We Combine Data And Science With Passion And Invention. We Set Big Goals And Work Backward To Achieve Them, Such As The Climate Pledge, Our Goal To Reach Net- Zero Carbon Emissions By 2040. 10 Years Ahead Of The Paris Agreement. We Apply That Same Tenacity To How We Address Some Of The World's Biggest Environmental And Societal Challenges."
                  value={card2Description}
                  onChange={(e) => setCard2Description(e.target.value)}
                />
              </Box>
            </Grid>            {/* Card 3 */}
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                Card 3
              </Typography>
              
              {/* Title and Highlight row */}
              <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                    Title *
                  </Typography>
                  <TextField
                    fullWidth
                    placeholder="CSR"
                    value={card3Title}
                    onChange={(e) => setCard3Title(e.target.value)}
                  />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                    Highlight *
                  </Typography>
                  <TextField
                    fullWidth
                    placeholder="0.8%"
                    value={card3Highlight}
                    onChange={(e) => setCard3Highlight(e.target.value)}
                  />
                </Box>
              </Box>
              
              {/* Description */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                  Description *
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  placeholder="Lorem Ipsum Is A Global Company With Approximately 17 Million Ton And Part-Time Employees Worldwide And Operations In Africa, Asia-Pacific, Europe, Latin America, The Middle East, And North America. At Lorem Ipsum, We Combine Data And Science With Passion And Invention. We Set Big Goals And Work Backward To Achieve Them, Such As The Climate Pledge, Our Goal To Reach Net- Zero Carbon Emissions By 2040. 10 Years Ahead Of The Paris Agreement. We Apply That Same Tenacity To How We Address Some Of The World's Biggest Environmental And Societal Challenges."
                  value={card3Description}
                  onChange={(e) => setCard3Description(e.target.value)}
                />
              </Box>            </Grid>

            {/* Card 4 */}
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                Card 4
              </Typography>
              
              {/* Title and Highlight row */}
              <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                    Title *
                  </Typography>
                  <TextField
                    fullWidth
                    placeholder="CSR"
                    value={card4Title}
                    onChange={(e) => setCard4Title(e.target.value)}
                  />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                    Highlight *
                  </Typography>
                  <TextField
                    fullWidth
                    placeholder="0.8%"
                    value={card4Highlight}
                    onChange={(e) => setCard4Highlight(e.target.value)}
                  />
                </Box>
              </Box>
              
              {/* Description */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                  Description *
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  placeholder="Lorem Ipsum Is A Global Company With Approximately 17 Million Ton And Part-Time Employees Worldwide And Operations In Africa, Asia-Pacific, Europe, Latin America, The Middle East, And North America. At Lorem Ipsum, We Combine Data And Science With Passion And Invention. We Set Big Goals And Work Backward To Achieve Them, Such As The Climate Pledge, Our Goal To Reach Net- Zero Carbon Emissions By 2040. 10 Years Ahead Of The Paris Agreement. We Apply That Same Tenacity To How We Address Some Of The World's Biggest Environmental And Societal Challenges."
                  value={card4Description}
                  onChange={(e) => setCard4Description(e.target.value)}
                />
              </Box>
            </Grid>

            {/* Photo Upload Section */}
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                Photo
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
                onClick={() => document.getElementById('photo-upload')?.click()}
              >
                {photoPreview ? (
                  <Box sx={{ position: 'relative', width: '100%', maxWidth: '200px' }}>
                    <img 
                      src={photoPreview} 
                      alt="Preview" 
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
                  id="photo-upload"
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  style={{ display: 'none' }}
                />
              </Box>
            </Grid>

            {/* Navigation Buttons */}
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

export default ConfigureEnvInFigures;