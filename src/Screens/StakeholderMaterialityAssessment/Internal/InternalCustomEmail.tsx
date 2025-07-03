import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  CssBaseline,
  ThemeProvider,
  TextField,
  Paper,
  Stack,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Snackbar,
  Checkbox,
  FormControlLabel,
  Tooltip,
  Divider,
} from '@mui/material';
import { api } from '../../common';
import { theme } from '../../../lib/theme';
import SidebarHeader from "../../../Components/SidebarHeader";
import { useAuth } from "../../../services/AuthContext";
import { ProgressTracker } from '../../../Components/progress-tracker';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`survey-tabpanel-${index}`}
      aria-labelledby={`survey-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ pt: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

interface EmailPayload {
  instructions: string;
  test_emails: string[];
  logo?: File;
}

interface InternalUser {
  id: number;
  email: string;
  username: string;
  full_name: string;
  org_user_id: number;
}

interface Survey {
  id: number;
  uuid: string;
  name: string;
  start_date: string;
  end_date: string;
  status: string;
  organisation: number;
  site: number;
  created_by: number;
}

interface SurveyCustomization {
  id: number;
  survey: number;
  logo: string;
  logo_url: string;
  instructions: string;
  created_at: string;
  updated_at: string;
}

export default function InternalCustomEmail() {
  const { hasPermission } = useAuth();
  const navigate = useNavigate();
  const { surveyId } = useParams();
  const [activeTab, setActiveTab] = useState(0);
  const [emailInput, setEmailInput] = useState('');
  const [selectedEmails, setSelectedEmails] = useState<string[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSendingTestEmail, setIsSendingTestEmail] = useState(false);
  const [isSendingEmails, setIsSendingEmails] = useState(false);
  const [logo, setLogo] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [showPermissionDialog, setShowPermissionDialog] = useState(true);
  const [internalEmails, setInternalEmails] = useState<string[]>([]);
  const [selectedInternalEmails, setSelectedInternalEmails] = useState<string[]>([]);
  const [internalUsers, setInternalUsers] = useState<InternalUser[]>([]);
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [surveyUuid, setSurveyUuid] = useState<string>('');
  const [steps] = useState([
    { id: 1, title: "Primary Information", type: 'main', status: "complete" },
    { id: 2, title: "Setup External Survey", type: 'main', status: "complete" },
    { id: 3, title: "Setup Internal Survey", type: 'main', status: "in-progress" },
    { id: 4, title: "Choose Disclosures", type: 'sub', status: "complete" },
    { id: 5, title: "Add Questions", type: 'sub', status: "complete" },
    { id: 6, title: "Send Email", type: 'sub', status: "in-progress" }
  ]);

  const [customization, setCustomization] = useState<SurveyCustomization | null>(null);
  const [surveyLogo, setSurveyLogo] = useState<File | null>(null);
  const [surveyLogoPreview, setSurveyLogoPreview] = useState<string | null>(null);

  // Separate state for survey customization and email content
  const [surveyInstructions, setSurveyInstructions] = useState('');
  const [emailContent, setEmailContent] = useState('');

  useEffect(() => {
    if (!hasPermission('SEND_EMAIL')) {
      setShowPermissionDialog(true);
    } else {
      setShowPermissionDialog(false);
    }
  }, [hasPermission]);

  useEffect(() => {
    const fetchInternalUsers = async () => {
      try {
        const response = await api.get('esg/api/get-internal-external-users/?user_type=INTERNAL');
        const users = await response.json();
        setInternalUsers(users);
        // Pre-populate internalEmails array with fetched email addresses
        setInternalEmails(users.map((user: InternalUser) => user.email));
      } catch (error) {
        console.error('Error fetching internal users:', error);
        setSnackbar({
          open: true,
          message: 'Failed to fetch internal users',
          severity: 'error'
        });
      }
    };

    fetchInternalUsers();
  }, []);

  useEffect(() => {
    const fetchSurveyData = async () => {
      try {
        const surveysResponse = await api.get('esg/api/surveys/get_surveys/').json();
        setSurveys(surveysResponse);
        
        // Find the matching survey and set its UUID
        const matchingSurvey = surveysResponse.find((survey: Survey) => survey.id === Number(surveyId));
        if (matchingSurvey) {
          setSurveyUuid(matchingSurvey.uuid);
        }
      } catch (error) {
        console.error('Error fetching surveys:', error);
      }
    };

    if (surveyId) {
      fetchSurveyData();
    }
  }, [surveyId]);

  useEffect(() => {
    const fetchSurveyCustomization = async () => {
      if (!surveyId) return;
      
      try {
        const response = await api.get(`esg/api/customize-survey/`);
        const data = await response.json();
        if (Array.isArray(data) && data.length > 0) {
          // Add '_internal' suffix to surveyId when looking for internal customization
          const matchingCustomization = data.find(
            (c: SurveyCustomization) => c.survey === Number(surveyId + '_internal')
          );
          if (matchingCustomization) {
            setCustomization(matchingCustomization);
            setSurveyInstructions(matchingCustomization.instructions || '');
          }
        }
      } catch (error) {
        console.error('Error fetching survey customization:', error);
      }
    };

    fetchSurveyCustomization();
  }, [surveyId]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setLogo(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleSurveyLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setSurveyLogo(file);
      setSurveyLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleEmailSelect = (email: string) => {
    setSelectedInternalEmails(prev => 
      prev.includes(email) 
        ? prev.filter(e => e !== email)
        : [...prev, email]
    );
  };

  const handleAddEmail = () => {
    if (emailInput && emailInput.includes('@')) {
      if (!internalEmails.includes(emailInput)) {
        setInternalEmails([...internalEmails, emailInput]);
        setEmailInput('');
      }
    }
  };

  const handleRemoveEmail = (emailToRemove: string) => {
    setInternalEmails(internalEmails.filter(email => email !== emailToRemove));
    setSelectedInternalEmails(selectedInternalEmails.filter(email => email !== emailToRemove));
  };

  const handleSendEmails = async (isTest = false) => {
    if (!surveyUuid) {
      setSnackbar({
        open: true,
        message: 'Survey UUID is required',
        severity: 'error'
      });
      return;
    }

    if (isTest) {
      setIsSendingTestEmail(true);
    } else {
      setIsSendingEmails(true);
    }

    try {
      await api.post('esg/api/survey-emails/send_test_email/', {
        body: JSON.stringify({
          instructions: emailContent.trim() || "Please provide your feedback by clicking the link below.",
          survey_uuid: surveyUuid,
          test_emails: selectedInternalEmails,
          is_external: false
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      setSnackbar({
        open: true,
        message: 'Emails sent successfully!',
        severity: 'success'
      });
      setOpenDialog(false);
      
    } catch (error: any) {
      console.error('Error sending emails:', error);
      setSnackbar({
        open: true,
        message: 'Failed to send emails. Please try again.',
        severity: 'error'
      });
    } finally {
      if (isTest) {
        setIsSendingTestEmail(false);
      } else {
        setIsSendingEmails(false);
      }
    }
  };

  const handleSaveCustomization = async () => {
    if (!surveyId) {
      setSnackbar({
        open: true,
        message: 'Survey ID is required',
        severity: 'error'
      });
      return;
    }

    try {
      const formData = new FormData();
      formData.append('survey', surveyId); // Remove _internal suffix
      formData.append('instructions', surveyInstructions);
      formData.append('survey_type', 'internal'); // Keep this to differentiate internal survey
      if (surveyLogo) {
        formData.append('logo', surveyLogo);
      }

      const response = await api.post('esg/api/customize-survey/', {
        body: formData,
      });

      const customizationData = await response.json();
      setCustomization(customizationData);
      
      // Clear the form after successful submission
      setSurveyLogo(null);
      setSurveyLogoPreview(null);
      setSurveyInstructions('');

      setSnackbar({
        open: true,
        message: 'Survey customization saved successfully!',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error saving customization:', error);
      setSnackbar({
        open: true,
        message: 'Failed to save customization',
        severity: 'error'
      });
    }
  };

  const renderCustomizeTab = () => (
    <TabPanel value={activeTab} index={0}>
      <Stack spacing={3}>
        <Box display="flex" justifyContent="flex-start" alignItems="center">
          <Typography sx={{ mb: 1, mr: 2 }}>Upload Survey Logo :</Typography>
          <input
            accept="image/*"
            style={{ display: 'none' }}
            id="survey-logo-upload"
            type="file"
            onChange={handleSurveyLogoUpload}
          />
          <label htmlFor="survey-logo-upload">
            <Button 
              component="span"
              variant="outlined" 
              sx={{ 
                borderRadius: '8px',
                color: 'rgb(54, 115, 97)',
                borderColor: 'rgb(54, 115, 97)',
                '&:hover': {
                  borderColor: 'rgb(54, 115, 97)',
                  backgroundColor: 'rgba(54, 115, 97, 0.04)'
                }
              }}
            >
              Upload logo
            </Button>
          </label>
          {(surveyLogoPreview || customization?.logo_url) && (
            <Box sx={{ ml: 2 }}>
              <img 
                src={surveyLogoPreview || customization?.logo_url} 
                alt="Survey logo preview" 
                style={{ height: '40px', width: 'auto' }} 
              />
            </Box>
          )}
        </Box>

        <Box>
          <Typography sx={{ mb: 1 }}>Survey Instructions :</Typography>
          <TextField
            multiline
            rows={4}
            fullWidth
            variant="outlined"
            value={surveyInstructions}
            onChange={(e) => setSurveyInstructions(e.target.value)}
            placeholder="Enter survey instructions here..."
          />
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
          <Button 
            variant="contained"
            onClick={handleSaveCustomization}
            sx={{ 
              bgcolor: 'rgb(54, 115, 97)',
              '&:hover': {
                bgcolor: 'rgb(44, 95, 77)'
              }
            }}
          >
            Save Customization
          </Button>
        </Box>
      </Stack>
    </TabPanel>
  );

  const renderEmailTab = () => (
    <TabPanel value={activeTab} index={1}>
      <Stack spacing={3}>
        <Box display="flex" justifyContent="flex-start" alignItems="center">
          <Typography sx={{ mb: 1, mr: 2 }}>Upload Logo :</Typography>
          <input
            accept="image/*"
            style={{ display: 'none' }}
            id="logo-upload"
            type="file"
            onChange={handleLogoUpload}
          />
          <label htmlFor="logo-upload">
            <Button 
              component="span"
              variant="outlined" 
              sx={{ 
                borderRadius: '8px',
                color: 'rgb(54, 115, 97)',
                borderColor: 'rgb(54, 115, 97)',
                '&:hover': {
                  borderColor: 'rgb(54, 115, 97)',
                  backgroundColor: 'rgba(54, 115, 97, 0.04)'
                }
              }}
            >
              Upload logo
            </Button>
          </label>
          {logoPreview && (
            <Box sx={{ ml: 2 }}>
              <img 
                src={logoPreview} 
                alt="Logo preview" 
                style={{ height: '40px', width: 'auto' }} 
              />
            </Box>
          )}
        </Box>

        <Box>
          <Typography sx={{ mb: 1 }}>Email Content :</Typography>
          <TextField
            multiline
            rows={4}
            fullWidth
            variant="outlined"
            value={emailContent}
            onChange={(e) => setEmailContent(e.target.value)}
            placeholder="Please provide your feedback by clicking the link below."
          />
        </Box>
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }}>
          <Tooltip title={!hasPermission('SEND_EMAIL') ? "You don't have sufficient permissions" : ""}>
            <span>
              <Button 
                variant="outlined"
                onClick={() => setOpenDialog(true)}
                disabled={!hasPermission('SEND_EMAIL')}
                sx={{ 
                  color: 'rgb(54, 115, 97)',
                  borderColor: 'rgb(54, 115, 97)',
                  '&:hover': {
                    borderColor: 'rgb(54, 115, 97)',
                    backgroundColor: 'rgba(54, 115, 97, 0.04)'
                  },
                  '&.Mui-disabled': {
                    borderColor: 'rgba(0, 0, 0, 0.12)',
                    color: 'rgba(0, 0, 0, 0.26)'
                  }
                }}
              >
                add and send mail
              </Button>
            </span>
          </Tooltip>
          <Button 
            variant="contained"
            onClick={handleSaveAndNext}
            sx={{ 
              bgcolor: 'rgb(54, 115, 97)',
              '&:hover': {
                bgcolor: 'rgb(44, 95, 77)'
              }
            }}
          >
            Save And Next
          </Button>
        </Box>
      </Stack>
    </TabPanel>
  );

  const handleSaveAndNext = async () => {
    try {
      // Update status for internal survey
      await api.post('esg/api/surveys/update_status/', {
        body: JSON.stringify({
          survey_id: surveyId,
          status: 'POST_INTERNAL_SURVEY'
        }),
        headers: { 'Content-Type': 'application/json' }
      });

      // Navigate to the surveys page with internal type
      navigate('/surveys?type=internal');

    } catch (error) {
      console.error('Error:', error);
      setSnackbar({
        open: true,
        message: 'Failed to update survey status',
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
            currentStep={6} // This now represents "Send Email" as step 6
          />
        </Box>
        {/* Permission Dialog */}
        <Dialog
          open={showPermissionDialog}
          onClose={() => navigate(-1)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Permission Required</DialogTitle>
          <DialogContent>
            <Typography>
              You don't have sufficient permissions to access this page.
              Please contact your administrator for access.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button 
              onClick={() => navigate(-1)}
              variant="contained"
              sx={{ 
                bgcolor: 'rgb(54, 115, 97)',
                '&:hover': {
                  bgcolor: 'rgb(44, 95, 77)'
                }
              }}
            >
              Go Back
            </Button>
          </DialogActions>
        </Dialog>

        {/* Main content */}
        {!showPermissionDialog && (
          <>
            <Box sx={{ width: '100%', bgcolor: 'background.paper', borderRadius: 2, boxShadow: "none", p: 2 }}>
              <Typography sx={{fontSize: "20px"}}>Internal Survey Email</Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
              <Paper sx={{ flex: 1, p: 3, borderRadius: 2 }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <Tabs 
                    value={activeTab} 
                    onChange={handleTabChange}
                    sx={{
                      '& .MuiTab-root': {
                        color: 'rgb(54, 115, 97)',
                        '&.Mui-selected': {
                          color: 'rgb(54, 115, 97)',
                          fontWeight: 'bold',
                        }
                      },
                      '& .MuiTabs-indicator': {
                        backgroundColor: 'rgb(54, 115, 97)',
                      }
                    }}
                  >
                    <Tab label="Customize Survey" />
                    <Tab label="Send Email" />
                  </Tabs>
                </Box>

                {renderCustomizeTab()}
                {renderEmailTab()}
              </Paper>
            </Box>
          </>
        )}

        {/* Email Selection Dialog */}
        <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Select Internal Email Recipients</DialogTitle>
          <DialogContent>
            {/* Manual Email Input Section */}
            <Box sx={{ mt: 2, mb: 3 }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>Add Additional Email:</Typography>
              <TextField
                fullWidth
                label="Internal Email Address"
                variant="outlined"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleAddEmail();
                  }
                }}
              />
              <Button
                sx={{ 
                  mt: 1,
                  color: 'rgb(54, 115, 97)',
                  borderColor: 'rgb(54, 115, 97)',
                  '&:hover': {
                    borderColor: 'rgb(54, 115, 97)',
                    backgroundColor: 'rgba(54, 115, 97, 0.04)'
                  }
                }}
                variant="outlined"
                onClick={handleAddEmail}
              >
                Add Email
              </Button>
            </Box>

            <Divider sx={{ my: 2 }} />
            
            {/* Internal Users Section */}
            <Typography variant="subtitle2" sx={{ mb: 1 }}>Internal Users:</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {/* Show fetched internal users */}
              {internalUsers.map((user) => (
                <Box key={user.id} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={selectedInternalEmails.includes(user.email)}
                        onChange={() => handleEmailSelect(user.email)}
                        sx={{
                          color: 'rgb(54, 115, 97)',
                          '&.Mui-checked': {
                            color: 'rgb(54, 115, 97)',
                          },
                        }}
                      />
                    }
                    label={`${user.email} (${user.username})`}
                  />
                </Box>
              ))}

              {/* Show manually added emails */}
              {internalEmails
                .filter(email => !internalUsers.some(user => user.email === email))
                .map((email, index) => (
                  <Box key={`manual-${index}`} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={selectedInternalEmails.includes(email)}
                          onChange={() => handleEmailSelect(email)}
                          sx={{
                            color: 'rgb(54, 115, 97)',
                            '&.Mui-checked': {
                              color: 'rgb(54, 115, 97)',
                            },
                          }}
                        />
                      }
                      label={email}
                    />
                    <Button
                      size="small"
                      onClick={() => handleRemoveEmail(email)}
                      sx={{ color: 'error.main' }}
                    >
                      Remove
                    </Button>
                  </Box>
                ))}
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
            <Button 
              onClick={() => handleSendEmails(true)}
              variant="outlined"
              disabled={isSendingTestEmail}
              sx={{ 
                color: 'rgb(54, 115, 97)',
                borderColor: 'rgb(54, 115, 97)',
                '&:hover': {
                  borderColor: 'rgb(54, 115, 97)',
                  backgroundColor: 'rgba(54, 115, 97, 0.04)'
                }
              }}
            >
              {isSendingTestEmail ? 'Sending...' : 'Send Test Mail'}
            </Button>
            <Button 
              onClick={() => handleSendEmails(false)}
              variant="contained"
              disabled={selectedInternalEmails.length === 0 || isSendingEmails}
              sx={{ 
                bgcolor: 'rgb(54, 115, 97)',
                '&:hover': {
                  bgcolor: 'rgb(44, 95, 77)'
                }
              }}
            >
              {isSendingEmails ? 'Sending...' : 'Send Emails'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar for notifications */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          <Alert 
            onClose={() => setSnackbar({ ...snackbar, open: false })} 
            severity={snackbar.severity}
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </SidebarHeader>
    </ThemeProvider>
  );
}
