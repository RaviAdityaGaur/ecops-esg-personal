import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Checkbox
} from '@mui/material';
import SidebarHeader from '../../Components/SidebarHeader.tsx';

const ConfigureEnvMaterialTopics: React.FC = () => {
  const navigate = useNavigate();
  // Material Topic 1 states
  const [topic1Title, setTopic1Title] = useState<string>('');
  const [topic1Description, setTopic1Description] = useState<string>('');
  const [topic1Chart1, setTopic1Chart1] = useState<string>('');
  const [topic1Chart2, setTopic1Chart2] = useState<boolean>(true); // Default to true for Table

  // Material Topic 2 states
  const [topic2Title, setTopic2Title] = useState<string>('');
  const [topic2Description, setTopic2Description] = useState<string>('');
  const [topic2Chart1, setTopic2Chart1] = useState<string>('');
  const [topic2Chart2, setTopic2Chart2] = useState<boolean>(true); // Default to true for Table

  // Material Topic 3 states
  const [topic3Title, setTopic3Title] = useState<string>('');
  const [topic3Description, setTopic3Description] = useState<string>('');
  const [topic3Chart1, setTopic3Chart1] = useState<string>('');
  const [topic3Chart2, setTopic3Chart2] = useState<boolean>(true); // Default to true for Table

  const handleBack = () => {
    navigate('/configure-report/environment-commitment-goals-initiatives');
  };
  const handleNext = () => {
    console.log('Form data:', {
      topic1Title,
      topic1Description,
      topic1Chart1,
      topic1Chart2,
      topic2Title,
      topic2Description,
      topic2Chart1,
      topic2Chart2,
      topic3Title,
      topic3Description,
      topic3Chart1,
      topic3Chart2
    });
    navigate('/configure-report/social-opening-page');
  };

  return (
    <SidebarHeader>
      <Box sx={{ py: 1 }}>
        <Box sx={{ justifyContent: 'space-between', backgroundColor: 'white', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6" sx={{ mb: 3, backgroundColor: 'white', p: 2, borderRadius: 2 }}>
            Environment - Material Topics
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

            {/* Material Topic 1 */}
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                Material Topic 1
              </Typography>
              
              {/* Title */}
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                  Title
                </Typography>                <TextField
                  fullWidth
                  placeholder="Environment in Figures"
                  value={topic1Title}
                  onChange={(e) => setTopic1Title(e.target.value)}
                />
              </Box>
              
              {/* Description */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                  Description
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={6}
                  placeholder="Lorem Ipsum Is A Global Company With Approximately 17 Million Ton And Part-Time Employees Worldwide And Operations In Africa, Asia-Pacific, Europe, Latin America, The Middle East, And North America. At Lorem Ipsum, We Combine Data And Science With Passion And Invention. We Set Big Goals And Work Backward To Achieve Them, Such As The Climate Pledge, Our Goal To Reach Net- Zero Carbon Emissions By 2040. 10 Years Ahead Of The Paris Agreement. We Apply That Same Tenacity To How We Address Some Of The World's Biggest Environmental And Societal Challenges."
                  value={topic1Description}
                  onChange={(e) => setTopic1Description(e.target.value)}
                />
              </Box>

              {/* Chart Type */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                  Chart Type
                </Typography>
                <FormControl component="fieldset">
                  <Typography variant="body2" sx={{ mb: 1 }}>Chart 1</Typography>
                  <RadioGroup
                    row
                    value={topic1Chart1}
                    onChange={(e) => setTopic1Chart1(e.target.value)}
                  >
                    <FormControlLabel value="donut" control={<Radio />} label="Donut" />
                    <FormControlLabel value="bar" control={<Radio />} label="Bar Chart" />
                  </RadioGroup>
                </FormControl>
                  <FormControl component="fieldset" sx={{ mt: 2 }}>
                  <Typography variant="body2" sx={{ mb: 1 }}>Chart 2</Typography>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={topic1Chart2}
                        onChange={(e) => setTopic1Chart2(e.target.checked)}
                        sx={{
                          color: '#147C65',
                          '&.Mui-checked': {
                            color: '#147C65',
                          },
                        }}
                      />
                    }
                    label="Table"
                  />
                </FormControl>
              </Box>
            </Grid>

            {/* Material Topic 2 */}
            <Grid item xs={12}>              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                Material Topic 2
              </Typography>
              
              {/* Title */}
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                  Title
                </Typography>
                <TextField
                  fullWidth
                  placeholder="Environment in Figures"
                  value={topic2Title}
                  onChange={(e) => setTopic2Title(e.target.value)}
                />
              </Box>
              
              {/* Description */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                  Description
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={6}
                  placeholder="Lorem Ipsum Is A Global Company With Approximately 17 Million Ton And Part-Time Employees Worldwide And Operations In Africa, Asia-Pacific, Europe, Latin America, The Middle East, And North America. At Lorem Ipsum, We Combine Data And Science With Passion And Invention. We Set Big Goals And Work Backward To Achieve Them, Such As The Climate Pledge, Our Goal To Reach Net- Zero Carbon Emissions By 2040. 10 Years Ahead Of The Paris Agreement. We Apply That Same Tenacity To How We Address Some Of The World's Biggest Environmental And Societal Challenges."
                  value={topic2Description}
                  onChange={(e) => setTopic2Description(e.target.value)}
                />
              </Box>

              {/* Chart Type */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                  Chart Type
                </Typography>
                <FormControl component="fieldset">
                  <Typography variant="body2" sx={{ mb: 1 }}>Chart 1</Typography>
                  <RadioGroup
                    row
                    value={topic2Chart1}
                    onChange={(e) => setTopic2Chart1(e.target.value)}
                  >
                    <FormControlLabel value="donut" control={<Radio />} label="Donut" />
                    <FormControlLabel value="bar" control={<Radio />} label="Bar Chart" />                </RadioGroup>
                </FormControl>
                
                <FormControl component="fieldset" sx={{ mt: 2 }}>
                  <Typography variant="body2" sx={{ mb: 1 }}>Chart 2</Typography>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={topic2Chart2}
                        onChange={(e) => setTopic2Chart2(e.target.checked)}
                        sx={{
                          color: '#147C65',
                          '&.Mui-checked': {
                            color: '#147C65',
                          },
                        }}
                      />
                    }
                    label="Table"
                  />
                </FormControl>
              </Box>
            </Grid>

            {/* Material Topic 3 */}
            <Grid item xs={12}>              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                Material Topic 3
              </Typography>
              
              {/* Title */}
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                  Title
                </Typography>
                <TextField
                  fullWidth
                  placeholder="Environment in Figures"
                  value={topic3Title}
                  onChange={(e) => setTopic3Title(e.target.value)}
                />
              </Box>
              
              {/* Description */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                  Description
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={6}
                  placeholder="Lorem Ipsum Is A Global Company With Approximately 17 Million Ton And Part-Time Employees Worldwide And Operations In Africa, Asia-Pacific, Europe, Latin America, The Middle East, And North America. At Lorem Ipsum, We Combine Data And Science With Passion And Invention. We Set Big Goals And Work Backward To Achieve Them, Such As The Climate Pledge, Our Goal To Reach Net- Zero Carbon Emissions By 2040. 10 Years Ahead Of The Paris Agreement. We Apply That Same Tenacity To How We Address Some Of The World's Biggest Environmental And Societal Challenges."
                  value={topic3Description}
                  onChange={(e) => setTopic3Description(e.target.value)}
                />
              </Box>

              {/* Chart Type */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                  Chart Type
                </Typography>
                <FormControl component="fieldset">
                  <Typography variant="body2" sx={{ mb: 1 }}>Chart 1</Typography>
                  <RadioGroup
                    row
                    value={topic3Chart1}
                    onChange={(e) => setTopic3Chart1(e.target.value)}
                  >
                    <FormControlLabel value="donut" control={<Radio />} label="Donut" />
                    <FormControlLabel value="bar" control={<Radio />} label="Bar Chart" />                </RadioGroup>
                </FormControl>
                
                <FormControl component="fieldset" sx={{ mt: 2 }}>
                  <Typography variant="body2" sx={{ mb: 1 }}>Chart 2</Typography>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={topic3Chart2}
                        onChange={(e) => setTopic3Chart2(e.target.checked)}
                        sx={{
                          color: '#147C65',
                          '&.Mui-checked': {
                            color: '#147C65',
                          },
                        }}
                      />
                    }
                    label="Table"
                  />
                </FormControl>
              </Box>
            </Grid>            {/* Navigation Buttons */}
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
    </SidebarHeader>
  );
};

export default ConfigureEnvMaterialTopics;