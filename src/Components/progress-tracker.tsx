import React from 'react';
import { Box, Step, StepLabel, Stepper, Typography } from '@mui/material';
import { Check, RadioButtonUnchecked } from '@mui/icons-material';

interface Step {
  id: number;
  title: string;
  status: 'complete' | 'in-progress' | 'pending';
  type: 'main' | 'sub';
}

interface ProgressTrackerProps {
  steps: Step[];
  currentStep: number;
}

export const ProgressTracker = ({ steps, currentStep }: ProgressTrackerProps) => {
  if (!steps || !Array.isArray(steps)) {
    return null;
  }

  return (
    <Box sx={{ width: '100%', bgcolor: 'background.paper', borderRadius: 1, p: 1 }}>
      <Stepper
        activeStep={currentStep - 1}
        alternativeLabel
        sx={{
          '& .MuiStepConnector-line': {
            borderTopWidth: 3,
            borderColor: '#A2CFFE',
          },
          '& .MuiStepConnector-root': {
            top: 12,
          },
          '& .MuiStepConnector-root.Mui-completed .MuiStepConnector-line': {
            borderColor: '#147C65',
          }
        }}
      >
        {steps.map((step) => (
          <Step key={step.id}>
            <StepLabel
              StepIconComponent={() => (
                <div style={{
                  width: step.type === 'main' ? 32 : 24,
                  height: step.type === 'main' ? 32 : 24,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: step.status === 'pending' ? '#A2CFFE' : 'white',
                  border: `2px solid ${
                    step.status === 'complete' ? '#147C65'
                    : step.status === 'in-progress' ? '#76B8F6'
                    : '#A2CFFE'
                  }`,
                  borderRadius: '50%',
                  color: '#fff',
                }}>
                  {step.status === 'in-progress' ? (
                    <div style={{
                      width: step.type === 'main' ? 24 : 16,
                      height: step.type === 'main' ? 24 : 16,
                      backgroundColor: '#0468C8',
                      borderRadius: '50%',
                    }}/>
                  ) : step.status === 'complete' ? (
                    <div style={{
                      width: '100%',
                      height: '100%',
                      backgroundColor: '#147C65',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      <Check sx={{ fontSize: step.type === 'main' ? 20 : 16 }} />
                    </div>
                  ) : null}
                </div>
              )}
            >
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.25 }}>
                <Typography 
                  variant={step.type === 'main' ? "body2" : "caption"}
                  fontWeight={step.type === 'main' ? "bold" : "normal"}
                  sx={{ 
                    color: step.type === 'main' ? 'text.primary' : 'text.secondary',
                  }}
                >
                  {step.title}
                </Typography>
                <Typography
                  variant="caption"
                  color={
                    step.status === 'complete' ? 'success.main'
                    : step.status === 'in-progress' ? 'primary.main'
                    : 'text.secondary'
                  }
                  sx={{ textTransform: 'capitalize' }}
                >
                  {step.status}
                </Typography>
              </Box>
            </StepLabel>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
};