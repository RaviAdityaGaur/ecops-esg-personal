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

const ConfigureEnvCommitmentGoalsInitiatives: React.FC = () => {
  const navigate = useNavigate();
  
  // State for form fields
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');

  const handleBack = () => {
    navigate('/configure-report/environment-in-figures');
  };
  const handleNext = () => {
    console.log('Form data:', {
      title,
      description
    });
    // Navigate to Environment Material Topics page
    navigate('/configure-report/environment-material-topics');
  };

  return (
    <SidebarHeader>
      <Box sx={{ py: 1 }}>
        <Box sx={{ justifyContent: 'space-between', backgroundColor: 'white', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6" sx={{ mb: 3, backgroundColor: 'white', p: 2, borderRadius: 2 }}>
            Environment - Environment Commitment, Goals and Initiatives
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
                placeholder="Environment - Environment Commitment, Goals And Initiatives"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                sx={{ mb: 3 }}
              />
            </Grid>

            {/* Description Section */}
            <Grid item xs={12}>
              <Typography variant="body1" sx={{ mb: 1, fontWeight: 500 }}>
                Description *
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={12}
                placeholder="Lorem Ipsum Is A Global Company With Approximately 17 Million Full- And Part-Time Employees Worldwide And Operations In Africa, Asia-Pacific, Europe, Latin America, The Middle East, And North America. At Lorem Ipsum, We Combine Data And Science With Passion And Invention. We Set Big Goals And Work Backward To Achieve Them, Such As The Climate Pledge, Our Goal To Reach Net- Zero Carbon Emissions By 2040. 10 Years Ahead Of The Paris Agreement. We Apply That Same Tenacity To How We Address Some Of The World's Biggest Environmental And Societal Challenges.

We Know That Driving Change Means Staying Focused On Bringing Entire Industries Along With Us. Over The Past Five Years, We've Done This By Encouraging Companies To Join The Climate Pledge—And We're Proud That Over 500 Have Signed To Commitment To Be Net-Zero Carbon By Years Ahead Of The Paris Agreement. We've Also Invested $10B In The Climate Pledge Fund, And We Started A More Electric Delivery Vehicles Than Ever Before. By Regenerating Our Operations And Transportation Networks In The U.S., We Can Now Deliver Items Faster At Still Lower Costs. This Also Allows Us To Minimize Our Impact On The Environment While Delivering. The Climate A Package One Of The Hundreds Of Communities, Groups, And And Organizations That We Work With Around The World, And Our Team Continues To Work On The United Optimized By Our Digital Operations With Renewable Energy By 2030. And We Reached That Goal In 2022—Seven Years Early. As We Look To The Future, We Are Steadfast In Our Climate Pledge Commitment To Be Net-Zero Carbon By 2040. And We Continue To Lead And Invest In Creating Carbon-Free Energy Sources And And And Advancing Energy Efficient Technology. We Also Building Energy Around 15 Significant Changes To Our Business, Investments In Growth, And Meeting The Needs Of Our Customers. Through All, We Will Remain Steadfast As We Parent, Adapt, And Will Our Way To Meeting Our Commitments.

We Know That Driving Change Means Staying Focused On Bringing Entire Industries Along With Us. Over The Past Five Years, We've Done This By Encouraging Companies To Join The Climate Pledge—And We're Proud That Over 500 Have Signed To Commitment To Be Net-Zero Carbon By Years Ahead Of The Paris Agreement. Most Recently, Our Sustainability Team Has Been Working Through Advanced Analytics, Unified Security Center, Network Analytics. Advanced Analytics. Our Manufacturing Organizations In-Time. Now, More Than 40% Of Factories-Related Supply Chains, Reporting to Teams In France And Operating The 3rd Ranked On United Nations Global Compact Communications On Progress Report 2023. Looking Ahead, We Know Our Customers Look To Us To Do At The Cutting Edge Of New And Growing Technologies And Enable Them For Good. We're Already Deploying Artificial Intelligence (AI) In Ways That Benefit Our Customers Directly Such As Using In IT Right-Side Packaging And Avoid Waste. We're Expecting A Growing Number Of AI Applications—Whether Ice Monitoring And Optimizing Our Energy Use Or Improving Our Predictive On The Environment All This Progress Is Possible By Staying True To Our Corporate Values And Keeping Our Customers, Employees, And Stakeholders At The Heart Of Everything We Do. As We Continue Growth On Innovation And We Are, The Promise Of What We Can Achieve Becomes Even More Promising, Efficient, Safe — All For Corporate Sustainability. We Remain; And We Are Excited That Lines Ipsum Is Uniquely Positioned To Figure Out How AI Can Help Us Address Climate Change In A More Efficient And Responsible Way. Most Importantly, We Need To Continue To Invest In Talent And That Employees Who Can Lead On Sustainability. We're Proud. 

We're Committed To Building On Innovation And That Includes Engineers, Scientists, Content Creators, Building Architects, And More. And For These Where Jobs Aren't Directly Within A Sustainability Field, We Offer Upskilling Programs And Affinity Groups Where Our Employees Can Learn More And Get Involved. It's Thanks To The Thousands Of Professionals Working Behind-The-Scenes Across Lorem Ipsum That We Are Able To Bring All Of This Amazing Work To Life."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                sx={{ mb: 4 }}
              />
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

export default ConfigureEnvCommitmentGoalsInitiatives;