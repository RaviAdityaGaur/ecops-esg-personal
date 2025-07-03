import React, { useEffect, useState } from 'react';
import { Box, CssBaseline, Grid, ThemeProvider, Typography, Card, Snackbar, Alert, IconButton, Collapse, Tooltip } from '@mui/material';
import { theme } from '../../../lib/theme';
import SidebarHeader from "../../../Components/SidebarHeader";
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../../common';
import { ProgressTracker } from '../../../Components/progress-tracker';
import popImage from '../../../assets/pop.png';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

const cardStyles = {
  width: '300px',
  p: 2,
  display: 'flex',
  flexDirection: 'column',
  textAlign: 'center',
  justifyContent: 'center',
  alignItems: 'center',
  cursor: 'pointer',
  backgroundColor: '#fff',
  borderRadius: 2,
  boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.05)',
  height: '120px',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
  },
} as const;

const disabledCardStyles = {
  ...cardStyles,
  backgroundColor: '#f5f5f5',
  cursor: 'not-allowed',
  opacity: 0.7,
  '&:hover': {
    transform: 'none',
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.05)',
  },
};

const StandardOptionCard = ({ title, subtitle, onClick, disabled = false }) => (
  <Box onClick={disabled ? undefined : onClick} sx={disabled ? disabledCardStyles : cardStyles}>
    <Box display="flex" justifyContent="center" alignItems="center" gap={1}>
      <Typography variant="h6" sx={disabled ? { color: 'text.disabled' } : {}}>{title}</Typography>
      {title?.toUpperCase().includes('GRI') || title?.toUpperCase().includes('SASB') ? (
        <Tooltip title={
          title?.toUpperCase().includes('GRI')
            ? "The GRI Standards are the world's most widely used standards for sustainability reporting, providing a common language for organizations to report their sustainability impacts in a consistent and credible way."
            : disabled 
              ? "SASB Standards are not available for double survey types"
              : "SASB Standards guide the disclosure of financially material sustainability information by companies to their investors, focusing on industry-specific sustainability factors most likely to impact financial performance."
        }>
          <Box component="img" src={popImage} sx={{ width: 20, height: 20, cursor: 'help' }} />
        </Tooltip>
      ) : null}
    </Box>
    {subtitle && (
      <Typography variant="body2" textAlign="center" sx={disabled ? { color: 'text.disabled' } : {}}>
        {subtitle}
      </Typography>
    )}
    {disabled && title?.toUpperCase().includes('SASB') && (
      <Typography variant="caption" color="text.disabled" sx={{ mt: 1 }}>
        Not available for double survey type
      </Typography>
    )}
  </Box>
);

export default function InternalChooseStandard() {
  const navigate = useNavigate();
  const { surveyId } = useParams();
  const [indicatorSources, setIndicatorSources] = useState([]);
  const [surveyData, setSurveyData] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error'
  });

  const [steps] = useState([
    { id: 1, title: "Primary Information", type: 'main', status: "complete" },
    { id: 2, title: "Setup External Survey", type: 'main', status: "complete" },
    { id: 3, title: "Setup Internal Survey", type: 'main', status: "in-progress" },
    { id: 4, title: "Choose Standards", type: 'sub', status: "in-progress" },
    { id: 5, title: "Choose Sectors", type: 'sub', status: "pending" },
    { id: 6, title: "Choose Disclosures", type: 'sub', status: "pending" },
    { id: 7, title: "Add Questions", type: 'sub', status: "pending" },
    { id: 8, title: "Send Email", type: 'sub', status: "pending" }
  ]);

  useEffect(() => {
    const fetchIndicatorSources = async () => {
      try {
        const response = await api.get('esg/api/indicator-sources/').json();
        setIndicatorSources(response);
      } catch (error) {
        console.error('Error fetching indicator sources:', error);
      }
    };
    
    const fetchSurveyData = async () => {
      try {
        const response = await api.get('esg/api/surveys/get_surveys/').json();
        const currentSurvey = response.find(survey => survey.id === parseInt(surveyId));
        if (currentSurvey) {
          setSurveyData(currentSurvey);
        }
      } catch (error) {
        console.error('Error fetching survey data:', error);
      }
    };
    
    fetchIndicatorSources();
    if (surveyId) {
      fetchSurveyData();
    }
  }, [surveyId]);

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleStandardClick = async (standardId) => {
    if (!surveyId) {
      setSnackbar({
        open: true,
        message: 'Survey ID is not present',
        severity: 'error'
      });
      return;
    }

    try {
      // Change: Send as JSON instead of FormData
      const requestBody = {
        next_step: 'INTERNAL_STANDARD_SELECTION',
        indicator_source_id: standardId,
        is_internal: true
      };

      const response = await api.post(`esg/api/surveys/${surveyId}/update_survey/`, {
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      if (response.ok) {
        setSnackbar({
          open: true,
          message: 'Standard selected successfully',
          severity: 'success'
        });
        await new Promise(resolve => setTimeout(resolve, 1500));
        navigate(`/internal/choose-sector/${surveyId}`);
      } else {
        setSnackbar({
          open: true,
          message: 'Failed to update survey. Please try again.',
          severity: 'error'
        });
      }
    } catch (error) {
      console.error('Error:', error);
      setSnackbar({
        open: true,
        message: 'An error occurred. Please try again.',
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
            currentStep={4} // This represents "Choose Standards" in the internal sub-steps
          />
        </Box>

        <Box sx={{ width: '100%', bgcolor: 'background.paper', borderRadius: 2, boxShadow: "none", p: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography sx={{fontSize: "20px"}}>Choose Standard</Typography>
            <IconButton onClick={() => setExpanded(!expanded)}>
              {expanded ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </Box>
          <Collapse in={expanded}>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              The Standards contain disclosures that allow an organization to report information about its impacts consistently and credibly.
              This enhances the global comparability and quality of reported information on these impacts, which supports information users in making
              informed assessments and decisions about the organization's impacts and contribution to sustainable development. 
              Please select the frameworks to be included on your survey.
            </Typography>
          </Collapse>
        </Box>

        <Box sx={{ display: 'flex', width: '100%', marginTop: 1.5 }}>
          <Box sx={{ display: 'flex', width: '100%', gap: 2 }}>
            {indicatorSources.map((source) => (
              <StandardOptionCard
                key={source.id}
                title={source.name}
                subtitle={source.description}
                onClick={() => handleStandardClick(source.id)}
                disabled={source.name.toUpperCase().includes('SASB') && surveyData?.survey_type === 'double'}
              />
            ))}
          </Box>
        </Box>
      </SidebarHeader>
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={4000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
}
