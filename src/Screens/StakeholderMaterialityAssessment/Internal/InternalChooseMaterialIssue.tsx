import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Grid, Card, FormControlLabel, Checkbox, Alert, Snackbar, CircularProgress } from '@mui/material';
import SidebarHeader from "../../../Components/SidebarHeader";
import { useNavigate, useParams } from 'react-router-dom';
import { ProgressTracker } from '../../../Components/progress-tracker';
import { api } from '../../common';
import CheckIcon from '@mui/icons-material/Check';

export default function InternalChooseMaterialIssue() {
  const navigate = useNavigate();
  const { surveyId } = useParams();
  const [alertInfo, setAlertInfo] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [materialIssues, setMaterialIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedIssues, setSelectedIssues] = useState([]);

  useEffect(() => {
    const fetchMaterialIssues = async () => {
      try {
        setLoading(true);
        const response = await api.get('esg/api/material-issues/').json();
        setMaterialIssues(response);
      } catch (error) {
        console.error('Error fetching material issues:', error);
        setAlertInfo({
          open: true,
          message: "Failed to load material issues. Please refresh the page.",
          severity: 'error'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchMaterialIssues();
  }, []);

  const handleCloseAlert = () => {
    setAlertInfo({ ...alertInfo, open: false });
  };

  const [steps] = useState([
    { id: 1, title: "Primary Information", type: 'main', status: "complete" },
    { id: 2, title: "Setup External Survey", type: 'main', status: "complete" },
    { id: 3, title: "Setup Internal Survey", type: 'main', status: "in-progress" },
    { id: 4, title: "Choose Standards", type: 'sub', status: "complete" },
    { id: 5, title: "Choose Sectors", type: 'sub', status: "complete" },
    { id: 6, title: "Choose Material Issues", type: 'sub', status: "in-progress" },
    { id: 7, title: "Add Questions", type: 'sub', status: "pending" },
    { id: 8, title: "Send Email", type: 'sub', status: "pending" }
  ]);

  const handleIssueChange = (issueId) => {
    const id = parseInt(issueId);
    if (selectedIssues.includes(id)) {
      setSelectedIssues(selectedIssues.filter(selectedId => selectedId !== id));
    } else {
      setSelectedIssues([...selectedIssues, id]);
    }
  };

  const handleBackClick = () => {
    navigate(`/internal/choose-sector/${surveyId}`);
  };

  const handleNextClick = async () => {
    if (selectedIssues.length === 0) {
      setAlertInfo({
        open: true,
        message: "Please select at least one material issue before proceeding.",
        severity: 'error'
      });
      return;
    }

    try {
      // First, map the selected material issues to the survey
      const materialIssuesResponse = await api.post('esg/api/survey-material-issues/', {
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          survey: parseInt(surveyId),
          material_issues: selectedIssues,
          is_external: false,
        })
      });

      if (!materialIssuesResponse.ok) {
        throw new Error('Failed to map material issues to survey');
      }

      // Map disclosures to the survey
      const mapDisclosuresResponse = await api.post('esg/api/map-disclosures-to-survey/', {
        headers: { 
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({ 
          survey_id: surveyId,
          is_internal: true,
          is_external: false,
          material_type: 'impact'
        })
      });

      if (!mapDisclosuresResponse.ok) {
        throw new Error('Failed to map disclosures to survey');
      }

      // Success!
      setAlertInfo({
        open: true,
        message: "Material issues added successfully. Redirecting...",
        severity: 'success'
      });
      setTimeout(() => {
        navigate(`/internal/add-disclosure/${surveyId}`);
      }, 1500);
    } catch (error) {
      console.error('Error updating survey:', error);
      setAlertInfo({
        open: true,
        message: `An error occurred: ${error.message}`,
        severity: 'error'
      });
    }
  };

  const RoundedCheckbox = ({ issueId, ...props }) => (
    <Checkbox
      {...props}
      checked={selectedIssues.includes(parseInt(issueId))}
      onChange={() => handleIssueChange(issueId)}
      icon={
        <Box
          component="span"
          sx={{
            width: 20,
            height: 20,
            borderRadius: '6px',
            border: 'solid #ccc',
          }}
        />
      }
      checkedIcon={
        <Box
          component="span"
          sx={{
            width: 20,
            height: 20,
            borderRadius: '6px',
            backgroundColor: '#147C65',
            border: '2px solid #147C65',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
          }}
        >
          <CheckIcon sx={{ fontSize: 16 }} />
        </Box>
      }
    />
  );

  return (
    <>
      <SidebarHeader>
        <Box sx={{ width: '100%', bgcolor: 'background.paper', borderRadius: 2, boxShadow: "none", p: 2, mb:2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography sx={{fontSize: "18px"}}>Choose Material Issues</Typography>
          </Box>
        </Box>
        <Box sx={{ width: '100%', mb: 2, boxShadow: 'none' }}>
          <ProgressTracker
            steps={steps}
            currentStep={6}
          />
        </Box>

        <Grid container spacing={2} p={2} display="flex" justifyContent="flex-end">
          <Card sx={{ width: '100%', mb: 2, boxShadow: 'none', padding: 2 }}>
            <Typography variant="h6" gutterBottom>
              Material Issues
            </Typography>
            {loading ? (
              <Box display="flex" justifyContent="center" alignItems="center" sx={{ py: 4 }}>
                <CircularProgress size={40} />
              </Box>
            ) : materialIssues.length === 0 ? (
              <Typography color="text.secondary" align="center" sx={{ py: 2 }}>
                No material issues found. Please check your connection and try again.
              </Typography>
            ) : (
              <Grid container spacing={2}>
                {materialIssues.map((issue) => (
                  <Grid item xs={12} sm={6} key={issue.id}>
                    <FormControlLabel
                      value={issue.id.toString()}
                      control={<RoundedCheckbox issueId={issue.id.toString()} />}
                      label={issue.name}
                    />
                  </Grid>
                ))}
              </Grid>
            )}
          </Card>

          <Box>
            <Button
              variant="outlined"
              onClick={handleBackClick}
              sx={{ mr: 2, border: "solid #373737", color: "#373737", py: 1, px: 3.5, textTransform: "none", borderRadius: 2 }}
            >
              Back
            </Button>

            <Button
              variant="outlined"
              onClick={handleNextClick}
              disabled={loading || selectedIssues.length === 0}
              sx={{ 
                border: "solid #147C65", 
                color: "#147C65", 
                py: 1, 
                px: 3.5, 
                textTransform: "none", 
                borderRadius: 2,
                '&.Mui-disabled': {
                  border: "solid #9e9e9e",
                  color: "#9e9e9e"
                }
              }}
            >
              Next
            </Button>
          </Box>
        </Grid>
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
    </>
  )
}
