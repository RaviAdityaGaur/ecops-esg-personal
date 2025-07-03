import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom'; // Add useParams
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
  Chip,
  Dialog,
  Divider,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Snackbar,
  Checkbox,
  FormControlLabel,
  Tooltip
} from '@mui/material';
import {api} from "./common"
import { theme } from '../lib/theme';
import SidebarHeader from "../Components/SidebarHeader";
import { useAuth } from "../services/AuthContext";
import { ProgressTracker } from '../Components/progress-tracker';

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

interface User {
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

// Add new interface for survey customization
interface SurveyCustomization {
  id: number;
  survey: number;
  logo: string;
  logo_url: string;
  instructions: string;
  created_at: string;
  updated_at: string;
}

export default function CustomEmail() {
  const { hasPermission } = useAuth();
  const navigate = useNavigate();
  const { surveyId } = useParams(); // Add this line
  const [activeTab, setActiveTab] = useState(0);
  const [surveyInstructions, setSurveyInstructions] = useState('');
  const [emailContent, setEmailContent] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [emails, setEmails] = useState<string[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSendingTestEmail, setIsSendingTestEmail] = useState(false);
  const [isSendingEmails, setIsSendingEmails] = useState(false);
  const [selectedEmails, setSelectedEmails] = useState<string[]>([]);
  const [showPermissionDialog, setShowPermissionDialog] = useState(true);
  const [dialogTab, setDialogTab] = useState(0);
  const [internalEmails, setInternalEmails] = useState<string[]>([]);
  const [externalEmails, setExternalEmails] = useState<string[]>([]);
  const [selectedInternalEmails, setSelectedInternalEmails] = useState<string[]>([]);
  const [selectedExternalEmails, setSelectedExternalEmails] = useState<string[]>([]);
  const [userGroups, setUserGroups] = useState<any>(null);
  const [surveyStatus, setSurveyStatus] = useState<string>('');
  const [emailType, setEmailType] = useState<'internal' | 'external'>('external');
  const [fetchedEmails, setFetchedEmails] = useState<User[]>([]);
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [surveyUuid, setSurveyUuid] = useState<string>('');
  const [steps, setSteps] = useState([
    { id: 1, title: "Primary Information", type: 'main', status: "complete" },
    { id: 2, title: "Setup External Survey", type: 'main', status: "in-progress" },
    { id: 3, title: "Choose Standards", type: 'sub', status: "complete" },
    { id: 4, title: "Choose Sectors", type: 'sub', status: "complete" },
    { id: 5, title: "Choose Disclosures", type: 'sub', status: "complete" },
    { id: 6, title: "Add Questions", type: 'sub', status: "complete" },
    { id: 7, title: "Send Email", type: 'sub', status: "in-progress" },
    { id: 8, title: "Setup Internal Survey", type: 'main', status: "pending" }
  ]);
  const [customization, setCustomization] = useState<SurveyCustomization | null>(null);
  const [emailLogo, setEmailLogo] = useState<File | null>(null);
  const [emailLogoPreview, setEmailLogoPreview] = useState<string | null>(null);
  const [surveyLogo, setSurveyLogo] = useState<File | null>(null);
  const [surveyLogoPreview, setSurveyLogoPreview] = useState<string | null>(null);

  useEffect(() => {
    // Check permission when component mounts
    if (!hasPermission('SEND_EMAIL')) {
      setShowPermissionDialog(true);
    } else {
      setShowPermissionDialog(false);
    }
  }, [hasPermission]);

  useEffect(() => {
    // Fetch user groups when component mounts
    const fetchUserGroups = async () => {
      try {
        const response = await api.get('users/get-user-groups').json();
        setUserGroups(response);
      } catch (error) {
        console.error('Error fetching user groups:', error);
      }
    };
    fetchUserGroups();
  }, []);

  useEffect(() => {
    // Get type from URL parameter and persist it
    const urlParams = new URLSearchParams(window.location.search);
    const type = urlParams.get('type');
    if (type === 'internal') {
      setEmailType('internal');
      setDialogTab(0);
    } else if (surveyStatus === 'INTERNAL_SURVEY') {
      setEmailType('internal');
      setDialogTab(0);
    } else {
      setEmailType('external');
      setDialogTab(1);
    }
  }, [surveyStatus]);



  useEffect(() => {
    // Get type from URL parameter and persist it
    const urlParams = new URLSearchParams(window.location.search);
    const type = urlParams.get('type');
    if (type === 'internal') {
      setEmailType('internal');
      setDialogTab(0);
    } else {
      setEmailType('external');
      setDialogTab(1);
    }
  }, []);

  useEffect(() => {
    const fetchEmails = async () => {
      if (openDialog) {
        try {
          const userType = isInternalFlow() ? 'INTERNAL' : 'EXTERNAL';
          const response = await api.get(`esg/api/get-internal-external-users/?user_type=${userType}`).json();
          setFetchedEmails(response);
        } catch (error) {
          console.error('Error fetching emails:', error);
          setSnackbar({
            open: true,
            message: 'Failed to fetch email addresses',
            severity: 'error'
          });
        }
      }
    };
    fetchEmails();
  }, [openDialog]);

  useEffect(() => {
    const fetchSurveyData = async () => {
      try {
        const surveysResponse = await api.get('esg/api/surveys/get_surveys/').json();
        setSurveys(surveysResponse);
        
        // Find the matching survey and set its UUID
        const matchingSurvey = surveysResponse.find((survey: Survey) => survey.id === Number(surveyId));
        if (matchingSurvey) {
          setSurveyUuid(matchingSurvey.uuid);
          setSurveyStatus(matchingSurvey.status);
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
          // Use raw surveyId for external customization (no suffix)
          const matchingCustomization = data.find(
            (c: SurveyCustomization) => c.survey === Number(surveyId)
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

  const handleAddEmail = () => {
    if (emailInput && emailInput.includes('@')) {
      const targetEmails = dialogTab === 0 ? internalEmails : externalEmails;
      const setTargetEmails = dialogTab === 0 ? setInternalEmails : setExternalEmails;
      
      if (!targetEmails.includes(emailInput)) {
        setTargetEmails([...targetEmails, emailInput]);
        setEmailInput('');
      }
    }
  };

  const handleRemoveEmail = (emailToRemove: string) => {
    if (dialogTab === 0) {
      setInternalEmails(internalEmails.filter(email => email !== emailToRemove));
      setSelectedInternalEmails(selectedInternalEmails.filter(email => email !== emailToRemove));
    } else {
      setExternalEmails(externalEmails.filter(email => email !== emailToRemove));
      setSelectedExternalEmails(selectedExternalEmails.filter(email => email !== emailToRemove));
    }
  };

  const handleEmailLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setEmailLogo(file);
      setEmailLogoPreview(URL.createObjectURL(file));
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
    if (dialogTab === 0) {
      setSelectedInternalEmails(prev => 
        prev.includes(email) 
          ? prev.filter(e => e !== email)
          : [...prev, email]
      );
    } else {
      setSelectedExternalEmails(prev => 
        prev.includes(email) 
          ? prev.filter(e => e !== email)
          : [...prev, email]
      );
    }
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
      const allSelectedEmails = isInternalFlow() ? selectedInternalEmails : selectedExternalEmails;
      
      // Use FormData instead of JSON to handle file upload
      const formData = new FormData();
      formData.append('instructions', emailContent.trim() || "Please provide your feedback by clicking the link below.");
      formData.append('survey_uuid', surveyUuid);
      
      // Add each email as a separate entry in FormData
      allSelectedEmails.forEach(email => {
        formData.append('test_emails', email);
      });
      
      formData.append('is_external', (!isInternalFlow()).toString());
      
      // Add the logo if it exists
      if (emailLogo) {
        formData.append('logo', emailLogo);
      }

      await api.post('esg/api/survey-emails/send_test_email/', {
        body: formData,
        // Remove Content-Type header to let browser set it with proper boundary
      });

      setSnackbar({
        open: true,
        message: 'Emails sent successfully!',
        severity: 'success'
      });
      
      setOpenDialog(false);

    } catch (error) {
      console.error('Error:', error);
      let errorMessage = 'Failed to send emails. Please try again.';
      
      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      }

      setSnackbar({
        open: true,
        message: errorMessage,
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

  const handleSaveAndNext = async () => {
    try {
      // Update status only if in external flow
      if (!isInternalFlow()) {
        await api.post('esg/api/surveys/update_status/', {
          body: JSON.stringify({
            survey_id: surveyId,
            status: 'POST_EXTERNAL_SURVEY'
          }),
          headers: { 'Content-Type': 'application/json' }
        });

        // Update steps status
        const updatedSteps = steps.map(step => {
          if (step.type === 'main' && step.title === "Setup External Survey") {
            return { ...step, status: "complete" };
          }
          if (step.type === 'main' && step.title === "Setup Internal Survey") {
            return { ...step, status: "in-progress" };
          }
          return step;
        });
        setSteps(updatedSteps);
      }

      // Navigate to the surveys page instead of internal choose standard
      navigate('/surveys');

    } catch (error) {
      console.error('Error:', error);
      setSnackbar({
        open: true,
        message: 'Failed to update survey status',
        severity: 'error'
      });
    }
  };

  // Update the Dialog Title and content based on status
  const isInternalFlow = () => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('type') === 'internal' || surveyStatus === 'INTERNAL_SURVEY';
  };

  const getDialogTitle = () => {
    return isInternalFlow() ? 'Add Internal Email Addresses' : 'Add External Email Addresses';
  };

  const getDialogContentText = () => {
    return isInternalFlow() ? 'Internal Users' : 'External Users';
  };

  // Add this function to handle survey customization
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
      formData.append('survey', surveyId); // Remove _external suffix
      formData.append('instructions', surveyInstructions);
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

  // Update the TabPanel for survey customization
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
          <Typography sx={{ mb: 1, mr: 2 }}>Upload Email Logo :</Typography>
          <input
            accept="image/*"
            style={{ display: 'none' }}
            id="email-logo-upload"
            type="file"
            onChange={handleEmailLogoUpload}
          />
          <label htmlFor="email-logo-upload">
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
          {emailLogoPreview && (
            <Box sx={{ ml: 2 }}>
              <img 
                src={emailLogoPreview} 
                alt="Email logo preview" 
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

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SidebarHeader>
        {/* Add ProgressTracker at the top */}
        <Box sx={{ width: '100%', mb: 2, boxShadow: 'none' }}>
          <ProgressTracker 
            steps={steps} 
            currentStep={7} // This represents "Send Email" in the sub-steps
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

        {/* Only render the main content if user has permission */}
        {!showPermissionDialog && (
          <>
            <Box sx={{ width: '100%', bgcolor: 'background.paper', borderRadius: 2, boxShadow: "none", p: 2 }}>
              <Typography sx={{fontSize: "20px"}}>
                {isInternalFlow() ? 'Internal Survey Email' : 'External Survey Email'}
              </Typography>
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
                    <Tab label="Customize Email" />
                  </Tabs>
                </Box>

                <TabPanel value={activeTab} index={1}>
                  <Stack spacing={3}>
                    <Box display="flex" justifyContent="flex-start" alignItems="center">
                      <Typography sx={{ mb: 1, mr: 2 }}>Upload Email Logo :</Typography>
                      <input
                        accept="image/*"
                        style={{ display: 'none' }}
                        id="email-logo-upload"
                        type="file"
                        onChange={handleEmailLogoUpload}
                      />
                      <label htmlFor="email-logo-upload">
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
                      {emailLogoPreview && (
                        <Box sx={{ ml: 2 }}>
                          <img 
                            src={emailLogoPreview} 
                            alt="Email logo preview" 
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

                <TabPanel value={activeTab} index={0}>
                  {renderCustomizeTab()}
                </TabPanel>
              </Paper>
              
            </Box>
          </>
        )}

        <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ borderBottom: '1px solid #e0e0e0', pb: 2 }}>
            <Typography variant="h6" component="div">
              {getDialogTitle()}
            </Typography>
          </DialogTitle>
          <DialogContent sx={{ mt: 2 }}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                Add {isInternalFlow() ? 'Internal' : 'External'} Email Addresses
              </Typography>
              <TextField
                fullWidth
                placeholder="Enter email address"
                variant="outlined"
                size="small"
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
            
            <Box sx={{ my: 2 }}>
              <Divider />
            </Box>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {fetchedEmails.map((user) => (
                <Box key={user.id} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={dialogTab === 0 
                          ? selectedInternalEmails.includes(user.email)
                          : selectedExternalEmails.includes(user.email)}
                        onChange={() => handleEmailSelect(user.email)}
                        sx={{
                          color: 'rgb(54, 115, 97)',
                          '&.Mui-checked': {
                            color: 'rgb(54, 115, 97)',
                          },
                        }}
                      />
                    }
                    label={`${user.email} (${user.full_name || user.username})`}
                  />
                </Box>
              ))}
              {(dialogTab === 0 ? internalEmails : externalEmails).map((email, index) => (
                <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={dialogTab === 0 
                          ? selectedInternalEmails.includes(email)
                          : selectedExternalEmails.includes(email)}
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
              disabled={selectedInternalEmails.length + selectedExternalEmails.length === 0 || isSendingEmails}
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