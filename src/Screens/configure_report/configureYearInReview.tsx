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

const ConfigureYearInReview: React.FC = () => {
  const navigate = useNavigate();
  
  // State for form fields
  const [title, setTitle] = useState<string>('');
  const [highlight1Title, setHighlight1Title] = useState<string>('');
  const [highlight1Description, setHighlight1Description] = useState<string>('');
  const [highlight2Title, setHighlight2Title] = useState<string>('');
  const [highlight2Description, setHighlight2Description] = useState<string>('');
  const [highlight3Title, setHighlight3Title] = useState<string>('');
  const [highlight3Description, setHighlight3Description] = useState<string>('');
  const [highlight4Title, setHighlight4Title] = useState<string>('');
  const [highlight4Description, setHighlight4Description] = useState<string>('');
  const [highlight5Title, setHighlight5Title] = useState<string>('');
  const [highlight5Description, setHighlight5Description] = useState<string>('');
  const [highlight6Title, setHighlight6Title] = useState<string>('');
  const [highlight6Description, setHighlight6Description] = useState<string>('');
  const [highlight7Title, setHighlight7Title] = useState<string>('');
  const [highlight7Description, setHighlight7Description] = useState<string>('');
  const [highlight8Title, setHighlight8Title] = useState<string>('');
  const [highlight8Description, setHighlight8Description] = useState<string>('');
  const [highlight9Title, setHighlight9Title] = useState<string>('');
  const [highlight9Description, setHighlight9Description] = useState<string>('');
  const [highlight10Title, setHighlight10Title] = useState<string>('');
  const [highlight10Description, setHighlight10Description] = useState<string>('');

  const handleBack = () => {
    navigate('/configure-report/ESG-goals-progress');
  };
  const handleNext = () => {
    // You can add form validation here before navigating
    console.log('Form data:', {
      title,
      highlights: [
        { title: highlight1Title, description: highlight1Description },
        { title: highlight2Title, description: highlight2Description },
        { title: highlight3Title, description: highlight3Description },
        { title: highlight4Title, description: highlight4Description },
        { title: highlight5Title, description: highlight5Description },
        { title: highlight6Title, description: highlight6Description },
        { title: highlight7Title, description: highlight7Description },
        { title: highlight8Title, description: highlight8Description },
        { title: highlight9Title, description: highlight9Description },
        { title: highlight10Title, description: highlight10Description },
      ]
    });
    // Navigate to Activities and Value Chain page
    navigate('/configure-report/activities-value-chain');
  };

  return (
    <SidebarHeader>
      <Box sx={{ py: 1 }}>
        <Box sx={{ justifyContent: 'space-between', backgroundColor: 'white', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" sx={{ mb: 3, backgroundColor: 'white', p: 2, borderRadius: 2 }}>
            Overview - Year in Review
          </Typography>
        </Box>

        <Paper sx={{ p: 4, mx: 'auto' }}>
          <Grid container spacing={3}>
            {/* Title Section */}
            <Grid item xs={12}>
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
                placeholder="2024 in Review"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                sx={{ mt: 2, mb: 3 }}
              />
            </Grid>

            {/* Highlights Section */}
            <Grid item xs={12}>
              <Typography variant="body1" sx={{ fontWeight: 500, mb: 2 }}>
                Highlights *
              </Typography>
              
              <Grid container spacing={3}>
                {/* Highlight 1 */}
                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Box
                      sx={{
                        width: 24,
                        height: 24,
                        borderRadius: '50%',
                        backgroundColor: '#147C65',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        mr: 1
                      }}
                    >
                      1
                    </Box>
                    <TextField
                      fullWidth
                      placeholder="Enter Title Here"
                      value={highlight1Title}
                      onChange={(e) => setHighlight1Title(e.target.value)}
                      size="small"
                    />
                  </Box>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    placeholder="Assessment Of Suppliers Of Lorem Ipsum Branded Products On Their Social And Environmental Performance."
                    value={highlight1Description}
                    onChange={(e) => setHighlight1Description(e.target.value)}
                    sx={{ mb: 2 }}
                  />
                </Grid>

                {/* Highlight 2 */}
                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Box
                      sx={{
                        width: 24,
                        height: 24,
                        borderRadius: '50%',
                        backgroundColor: '#147C65',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        mr: 1
                      }}
                    >
                      2
                    </Box>
                    <TextField
                      fullWidth
                      placeholder="Enter Title Here"
                      value={highlight2Title}
                      onChange={(e) => setHighlight2Title(e.target.value)}
                      size="small"
                    />
                  </Box>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    placeholder="Assessment Of Suppliers Of Lorem Ipsum Branded Products On Their Social And Environmental Performance."
                    value={highlight2Description}
                    onChange={(e) => setHighlight2Description(e.target.value)}
                    sx={{ mb: 2 }}
                  />
                </Grid>

                {/* Highlight 3 */}
                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Box
                      sx={{
                        width: 24,
                        height: 24,
                        borderRadius: '50%',
                        backgroundColor: '#147C65',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        mr: 1
                      }}
                    >
                      3
                    </Box>
                    <TextField
                      fullWidth
                      placeholder="Enter Title Here"
                      value={highlight3Title}
                      onChange={(e) => setHighlight3Title(e.target.value)}
                      size="small"
                    />
                  </Box>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    placeholder="Assessment Of Suppliers Of Lorem Ipsum Branded Products On Their Social And Environmental Performance."
                    value={highlight3Description}
                    onChange={(e) => setHighlight3Description(e.target.value)}
                    sx={{ mb: 2 }}
                  />
                </Grid>

                {/* Highlight 4 */}
                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Box
                      sx={{
                        width: 24,
                        height: 24,
                        borderRadius: '50%',
                        backgroundColor: '#147C65',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        mr: 1
                      }}
                    >
                      4
                    </Box>
                    <TextField
                      fullWidth
                      placeholder="Enter Title Here"
                      value={highlight4Title}
                      onChange={(e) => setHighlight4Title(e.target.value)}
                      size="small"
                    />
                  </Box>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    placeholder="Assessment Of Suppliers Of Lorem Ipsum Branded Products On Their Social And Environmental Performance."
                    value={highlight4Description}
                    onChange={(e) => setHighlight4Description(e.target.value)}
                    sx={{ mb: 2 }}
                  />
                </Grid>

                {/* Highlight 5 */}
                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Box
                      sx={{
                        width: 24,
                        height: 24,
                        borderRadius: '50%',
                        backgroundColor: '#147C65',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        mr: 1
                      }}
                    >
                      5
                    </Box>
                    <TextField
                      fullWidth
                      placeholder="Enter Title Here"
                      value={highlight5Title}
                      onChange={(e) => setHighlight5Title(e.target.value)}
                      size="small"
                    />
                  </Box>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    placeholder="Assessment Of Suppliers Of Lorem Ipsum Branded Products On Their Social And Environmental Performance."
                    value={highlight5Description}
                    onChange={(e) => setHighlight5Description(e.target.value)}
                    sx={{ mb: 2 }}
                  />
                </Grid>

                {/* Highlight 6 */}
                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Box
                      sx={{
                        width: 24,
                        height: 24,
                        borderRadius: '50%',
                        backgroundColor: '#147C65',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        mr: 1
                      }}
                    >
                      6
                    </Box>
                    <TextField
                      fullWidth
                      placeholder="Enter Title Here"
                      value={highlight6Title}
                      onChange={(e) => setHighlight6Title(e.target.value)}
                      size="small"
                    />
                  </Box>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    placeholder="Assessment Of Suppliers Of Lorem Ipsum Branded Products On Their Social And Environmental Performance."
                    value={highlight6Description}
                    onChange={(e) => setHighlight6Description(e.target.value)}
                    sx={{ mb: 2 }}
                  />
                </Grid>

                {/* Highlight 7 */}
                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Box
                      sx={{
                        width: 24,
                        height: 24,
                        borderRadius: '50%',
                        backgroundColor: '#147C65',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        mr: 1
                      }}
                    >
                      7
                    </Box>
                    <TextField
                      fullWidth
                      placeholder="Enter Title Here"
                      value={highlight7Title}
                      onChange={(e) => setHighlight7Title(e.target.value)}
                      size="small"
                    />
                  </Box>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    placeholder="Assessment Of Suppliers Of Lorem Ipsum Branded Products On Their Social And Environmental Performance."
                    value={highlight7Description}
                    onChange={(e) => setHighlight7Description(e.target.value)}
                    sx={{ mb: 2 }}
                  />
                </Grid>

                {/* Highlight 8 */}
                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Box
                      sx={{
                        width: 24,
                        height: 24,
                        borderRadius: '50%',
                        backgroundColor: '#147C65',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        mr: 1
                      }}
                    >
                      8
                    </Box>
                    <TextField
                      fullWidth
                      placeholder="Enter Title Here"
                      value={highlight8Title}
                      onChange={(e) => setHighlight8Title(e.target.value)}
                      size="small"
                    />
                  </Box>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    placeholder="Assessment Of Suppliers Of Lorem Ipsum Branded Products On Their Social And Environmental Performance."
                    value={highlight8Description}
                    onChange={(e) => setHighlight8Description(e.target.value)}
                    sx={{ mb: 2 }}
                  />
                </Grid>

                {/* Highlight 9 */}
                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Box
                      sx={{
                        width: 24,
                        height: 24,
                        borderRadius: '50%',
                        backgroundColor: '#147C65',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        mr: 1
                      }}
                    >
                      9
                    </Box>
                    <TextField
                      fullWidth
                      placeholder="Enter Title Here"
                      value={highlight9Title}
                      onChange={(e) => setHighlight9Title(e.target.value)}
                      size="small"
                    />
                  </Box>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    placeholder="Assessment Of Suppliers Of Lorem Ipsum Branded Products On Their Social And Environmental Performance."
                    value={highlight9Description}
                    onChange={(e) => setHighlight9Description(e.target.value)}
                    sx={{ mb: 2 }}
                  />
                </Grid>

                <Grid item xs={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Box
                      sx={{
                        width: 24,
                        height: 24,
                        borderRadius: '50%',
                        backgroundColor: '#147C65',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        mr: 1
                      }}
                    >
                      9
                    </Box>
                    <TextField
                      fullWidth
                      placeholder="Enter Title Here"
                      value={highlight10Title}
                      onChange={(e) => setHighlight10Title(e.target.value)}
                      size="small"
                    />
                  </Box>
                    <TextField
                    fullWidth
                    multiline
                    rows={3}
                    placeholder = "Assessment Of Suppliers Of Lorem Ipsum Branded Products On Their Social And Environmental Performance."
                    value = {highlight10Description}
                    onChange = {(e)=> setHighlight10Description(e.target.value)}
                    sx = {{mb:2}}
                    />
                </Grid>
              </Grid>
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

export default ConfigureYearInReview;