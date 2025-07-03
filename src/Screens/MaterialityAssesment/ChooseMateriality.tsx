import React, { useState } from 'react';
import { Box, Typography, ThemeProvider, CssBaseline } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import SidebarHeader from '../../Components/SidebarHeader';
import { ProgressTracker } from '../../Components/progress-tracker';
import { theme } from '../../lib/theme';
import { api } from '../../Screens/common';

type MaterialityType = 'single' | 'double' | null;

export default function ChooseMateriality() {
  const { surveyId } = useParams<{ surveyId: string }>();
  const navigate = useNavigate();
  const [selectedMateriality, setSelectedMateriality] = useState<MaterialityType>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Define steps for the progress tracker
  const steps = [
    { id: 1, title: "Primary Information", type: 'main', status: "complete" },
    { id: 2, title: "Enter Survey Name", type: 'sub', status: "complete" },
    { id: 3, title: "Org Details", type: 'sub', status: "complete" },
    { id: 4, title: "Reporting Period", type: 'sub', status: "complete" },
    { id: 5, title: "Frequency", type: 'sub', status: "complete" },
    { id: 6, title: "Choose Sector/Industry", type: 'sub', status: "complete" },
    { id: 7, title: "Choose Materiality Type", type: 'sub', status: "in-progress" },
    { id: 8, title: "Setup External Survey", type: 'main', status: "pending" },
    { id: 9, title: "Setup Internal Survey", type: 'main', status: "pending" }
  ];

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
    border: '1px solid transparent',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
    },
  } as const;

  const handleMaterialitySelect = async (materialityType: MaterialityType) => {
    if (isSubmitting) return;
    
    setSelectedMateriality(materialityType);
    setIsSubmitting(true);
    
    try {
      await api.post(`esg/api/surveys/${surveyId}/set_materiality_type/`, {
        json: {
          survey_type: materialityType
        }
      });
      
      // Navigate to the choose standard page
      navigate(`/choose-standard/${surveyId}`);
    } catch (error) {
      console.error("Error setting materiality type:", error);
      setIsSubmitting(false);
    }
  };

  const [expanded, setExpanded] = React.useState(false);
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SidebarHeader>
        <Box
          sx={{
            width: '100%',
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: "none",
            p: 1.5,
            mb: 1.5,
            mt: 1,
          }}
        >
          <Typography sx={{ fontSize: "17px" }}>
            Choose Materiality Survey
          </Typography>
        </Box>

        <Box sx={{ width: '100%', mb: 2, boxShadow: 'none' }}>
          <ProgressTracker steps={steps} currentStep={7} />
        </Box>
        <Box 
          sx={{ 
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <Box sx={{ display: 'flex', gap: 2, width: '100%'}}>
            {/* Single Materiality Card */}
            <Box 
              onClick={() => !isSubmitting && handleMaterialitySelect('single')}
              sx={{
                ...cardStyles,
                borderColor: selectedMateriality === 'single' ? theme.palette.primary.main : 'transparent',
                borderWidth: selectedMateriality === 'single' ? '2px' : '1px',
                opacity: isSubmitting ? 0.7 : 1,
                pointerEvents: isSubmitting ? 'none' : 'auto',
              }}
            >
              <Typography variant="h6">Single Materiality</Typography>
              <Typography variant="body2" textAlign="center">
              Covers business impact
              </Typography>
              {isSubmitting && selectedMateriality === 'single' && (
                <Typography variant="body2" color="primary" sx={{ mt: 1 }}>
                  Processing...
                </Typography>
              )}
            </Box>
            
            {/* Double Materiality Card */}
            <Box 
              onClick={() => !isSubmitting && handleMaterialitySelect('double')}
              sx={{
                ...cardStyles,
                borderColor: selectedMateriality === 'double' ? theme.palette.primary.main : 'transparent',
                borderWidth: selectedMateriality === 'double' ? '2px' : '1px',
                opacity: isSubmitting ? 0.7 : 1,
                pointerEvents: isSubmitting ? 'none' : 'auto',
              }}
            >
              <Typography variant="h6">Double Materiality</Typography>
              <Typography variant="body2" textAlign="center">
              Covers business and financial impact
              </Typography>
              {isSubmitting && selectedMateriality === 'double' && (
                <Typography variant="body2" color="primary" sx={{ mt: 1 }}>
                  Processing...
                </Typography>
              )}
            </Box>
          </Box>
        </Box>
      </SidebarHeader>
    </ThemeProvider>
  );
}
