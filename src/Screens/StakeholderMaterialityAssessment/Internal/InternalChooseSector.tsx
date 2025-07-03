import React, { useEffect, useState } from 'react';
import { Box, Grid, Card, RadioGroup, FormControlLabel, Radio, Button, Typography, ThemeProvider, CssBaseline, Snackbar, Alert } from '@mui/material';
import SidebarHeader from "../../../Components/SidebarHeader";
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../../common';
import { theme } from '../../../lib/theme';
import { ProgressTracker } from '../../../Components/progress-tracker';

export default function InternalChooseSector() {
  const navigate = useNavigate();
  const { surveyId } = useParams();
  const [data, setData] = useState({ 'sector-standard': [], 'non-sector-standard': [] });
  const [selectedStandard, setSelectedStandard] = useState(null);
  const [alertInfo, setAlertInfo] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const [steps] = useState([
    { id: 1, title: "Primary Information", type: 'main', status: "complete" },
    { id: 2, title: "Setup External Survey", type: 'main', status: "complete" },
    { id: 3, title: "Setup Internal Survey", type: 'main', status: "in-progress" },
    { id: 4, title: "Choose Standards", type: 'sub', status: "complete" },
    { id: 5, title: "Choose Sectors", type: 'sub', status: "in-progress" },
    { id: 6, title: "Choose Disclosures", type: 'sub', status: "pending" },
    { id: 7, title: "Add Questions", type: 'sub', status: "pending" },
    { id: 8, title: "Send Email", type: 'sub', status: "pending" }
  ]);

  useEffect(() => {
    const fetchSurvey = async () => {
      try {
        console.log('Fetching survey with ID:', surveyId);
        const surveyResponse = await api.get(`esg/api/surveys/get_surveys/?survey_id=${surveyId}`);
        const surveyData = await surveyResponse.json();
        console.log('Full survey response:', surveyData);
        
        // Handle both array and object responses
        const survey = Array.isArray(surveyData) ? surveyData[0] : surveyData;
        console.log('Processed survey data:', survey);
        
        // Check all possible locations of indicator_source_id
        const sourceId = survey?.indicator_source_id || 
                        survey?.data?.indicator_source_id || 
                        survey?.indicator_source;
                        
        console.log('Found indicator_source_id:', sourceId);
        
        if (!sourceId) {
          console.error('Survey data structure:', survey);
          throw new Error('No indicator source ID found. Please select a standard first.');
        }

        // Fetch standards
        const standardsResponse = await api.get(`esg/api/standards/?indicator_source=${sourceId}&is_internal=true`);
        const standardsData = await standardsResponse.json();
        console.log('Standards data:', standardsData);
        
        if (standardsResponse.ok) {
          setData(standardsData);
        } else {
          throw new Error(`Failed to fetch standards: ${standardsResponse.statusText}`);
        }
        
      } catch (error) {
        console.error('Error in fetchSurvey:', error);
        setAlertInfo({
          open: true,
          message: error.message,
          severity: 'error'
        });
      }
    };
    fetchSurvey();
  }, [surveyId]);

  const handleCloseAlert = () => {
    setAlertInfo({ ...alertInfo, open: false });
  };

  const handleNextClick = async () => {
    if (!selectedStandard) {
      setAlertInfo({
        open: true,
        message: "Please select a standard before proceeding.",
        severity: 'error'
      });
      return;
    }

    try {
      // Change: Send as JSON instead of FormData
      const requestBody = {
        next_step: 'INTERNAL_MATERIAL_ISSUES',
        standard_id: selectedStandard,
        is_internal: true
      };

      const response = await api.post(`esg/api/surveys/${surveyId}/update_survey/`, {
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      if (response.ok) {
        const disclosureResponse = await api.post('esg/api/map-disclosures-to-survey/', {
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            survey_id: surveyId,
            is_internal: true,
            is_external: false
          })
        });

        if (disclosureResponse.ok) {
          setAlertInfo({
            open: true,
            message: "Disclosures added successfully. Redirecting...",
            severity: 'success'
          });
          setTimeout(() => {
            navigate(`/internal/choose-material-issues/${surveyId}`);
          }, 1500);
        } else {
          setAlertInfo({
            open: true,
            message: "Failed to add disclosures. Please try again.",
            severity: 'error'
          });
        }
      } else {
        setAlertInfo({
          open: true,
          message: "Failed to update survey. Please try again.",
          severity: 'error'
        });
      }
    } catch (error) {
      console.error('Error:', error);
      setAlertInfo({
        open: true,
        message: "An error occurred. Please try again.",
        severity: 'error'
      });
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SidebarHeader>
        <Box sx={{ width: '100%', mb: 2, boxShadow: 'none' }}>
          <ProgressTracker 
            steps={steps} 
            currentStep={5} // This represents "Choose Sectors" in the internal sub-steps
          />
        </Box>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Card sx={{ width: '100%', boxShadow: 'none', p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Sector Standards
              </Typography>
              <RadioGroup onChange={(e) => setSelectedStandard(e.target.value)}>
                {data['sector-standard']?.map((standard) => (
                  <FormControlLabel
                    key={standard.id}
                    value={standard.id.toString()}
                    control={<Radio />}
                    label={standard.name}
                  />
                ))}
              </RadioGroup>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Card sx={{ width: '100%', boxShadow: 'none', p: 2 }}>
              <Typography variant="h6" gutterBottom>
               Non-Sector Standards
              </Typography>
              <RadioGroup onChange={(e) => setSelectedStandard(e.target.value)}>
                {data['non-sector-standard']?.map((standard) => (
                  <FormControlLabel
                    key={standard.id}
                    value={standard.id.toString()}
                    control={<Radio />}
                    label={standard.name}
                  />
                ))}
              </RadioGroup>
            </Card>
          </Grid>
        </Grid>

        <Box sx={{ p: 2 }}>
          <Button
            variant="contained"
            onClick={handleNextClick}
            sx={{
              backgroundColor: '#147C65',
              '&:hover': {
                backgroundColor: '#0E5A4A',
              }
            }}
          >
            Next
          </Button>
        </Box>
      </SidebarHeader>
      <Snackbar 
        open={alertInfo.open}
        autoHideDuration={6000}
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseAlert} 
          severity={alertInfo.severity}
          sx={{ width: '100%' }}
        >
          {alertInfo.message}
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
}
