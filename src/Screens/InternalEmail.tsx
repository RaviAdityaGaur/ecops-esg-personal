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
  Tooltip
} from '@mui/material';
import {api} from "./common";
import { theme } from '../lib/theme';
import SidebarHeader from "../Components/SidebarHeader";
import { useAuth } from "../services/AuthContext";

function TabPanel(props: { children?: React.ReactNode; value: number; index: number }) {
  return (
    <div
      role="tabpanel"
      hidden={props.value !== props.index}
      id={`survey-tabpanel-${props.index}`}
      aria-labelledby={`survey-tab-${props.index}`}
    >
      {props.value === props.index && (
        <Box sx={{ pt: 3 }}>
          {props.children}
        </Box>
      )}
    </div>
  );
}

export default function InternalEmail() {
  const { hasPermission } = useAuth();
  const navigate = useNavigate();
  const { surveyId } = useParams();
  const [activeTab, setActiveTab] = useState(0);
  const [instructions, setInstructions] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [logo, setLogo] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [showPermissionDialog, setShowPermissionDialog] = useState(false);
  const [internalEmails, setInternalEmails] = useState<string[]>([]);
  const [selectedInternalEmails, setSelectedInternalEmails] = useState<string[]>([]);
  const [fetchedInternalUsers, setFetchedInternalUsers] = useState<Array<{
    id: number;
    email: string;
    username: string;
    full_name: string;
    org_user_id: number;
  }>>([]);
  const [isFetchingEmails, setIsFetchingEmails] = useState(false);

  useEffect(() => {
    if (!hasPermission('SEND_EMAIL')) {
      setShowPermissionDialog(true);
    }
  }, [hasPermission]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
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

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setLogo(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleEmailSelect = (email: string) => {
    setSelectedInternalEmails(prev => 
      prev.includes(email) 
        ? prev.filter(e => e !== email)
        : [...prev, email]
    );
  };

  useEffect(() => {
    const fetchSurveyStatus = async () => {
      try {
        const response = await api.get('esg/api/surveys/get_surveys/').json();
        const survey = response.find(s => s.id === parseInt(surveyId || ''));
        if (survey) {
          setSurveyStatus(survey.status);
          setDialogTab(0); // Always internal
        }
      } catch (error) {
        console.error('Error fetching survey status:', error);
      }
    };
    if (surveyId) {
      fetchSurveyStatus();
    }
  }, [surveyId]);

  useEffect(() => {
    const fetchInternalUsers = async () => {
      if (openDialog) {
        setIsFetchingEmails(true);
        try {
          const response = await api.get('esg/api/get-internal-external-users/?user_type=INTERNAL').json();
          setFetchedInternalUsers(response);
          // Populate internal emails with fetched emails
          setInternalEmails(response.map(user => user.email));
        } catch (error) {
          console.error('Error fetching internal users:', error);
          setSnackbar({
            open: true,
            message: 'Failed to fetch internal users',
            severity: 'error'
          });
        } finally {
          setIsFetchingEmails(false);
        }
      }
    };

    fetchInternalUsers();
  }, [openDialog]);

  const handleSendEmails = async () => {
    if (!surveyId) {
      setSnackbar({
        open: true,
        message: 'Survey ID is required',
        severity: 'error'
      });
      return;
    }

    setIsLoading(true);

    try {
      // Send internal emails
      await api.post('esg/api/survey-emails/send_test_email/', {
        body: JSON.stringify({
          instructions: instructions.trim() || "Please provide your feedback by clicking the link below.",
          survey_id: surveyId,
          test_emails: selectedInternalEmails,
          is_external: false
        }),
        headers: { 'Content-Type': 'application/json' }
      });

      // Update status to POST_INTERNAL_SURVEY
      await api.post('esg/api/surveys/update_status/', {
        body: JSON.stringify({
          survey_id: surveyId,
          status: 'POST_INTERNAL_SURVEY'
        }),
        headers: { 'Content-Type': 'application/json' }
      });

      setSnackbar({
        open: true,
        message: 'Internal emails sent successfully!',
        severity: 'success'
      });
      setOpenDialog(false);
      navigate('/surveys');
      
    } catch (error: any) {
      console.error('Error sending emails:', error);
      setSnackbar({
        open: true,
        message: 'Failed to send emails. Please try again.',
        severity: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SidebarHeader>
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
                '&:hover': { bgcolor: 'rgb(44, 95, 77)' }
              }}
            >
              Go Back
            </Button>
          </DialogActions>
        </Dialog>

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
                    <Tab label="Survey Details" />
                  </Tabs>
                </Box>

                <TabPanel value={activeTab} index={0}>
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
                        value={instructions}
                        onChange={(e) => setInstructions(e.target.value)}
                      />
                    </Box>
                    <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }}>
                      <Button 
                        variant="outlined"
                        onClick={() => setOpenDialog(true)}
                        sx={{ 
                          color: 'rgb(54, 115, 97)',
                          borderColor: 'rgb(54, 115, 97)',
                          '&:hover': {
                            borderColor: 'rgb(54, 115, 97)',
                            backgroundColor: 'rgba(54, 115, 97, 0.04)'
                          }
                        }}
                      >
                        Add and Send Mail
                      </Button>
                    </Box>
                  </Stack>
                </TabPanel>

                <TabPanel value={activeTab} index={1}>
                  <Typography>Survey Details content (to be implemented)</Typography>
                </TabPanel>
              </Paper>
            </Box>
          </>
        )}

        <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Add Internal Email Addresses</DialogTitle>
          <DialogContent>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Internal Users
            </Typography>

            {isFetchingEmails ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
                <Typography>Loading internal users...</Typography>
              </Box>
            ) : (
              <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
                {internalEmails.map((email, index) => (
                  <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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
                      label={
                        <Box>
                          <Typography>{email}</Typography>
                          <Typography variant="caption" color="textSecondary">
                            {fetchedInternalUsers.find(user => user.email === email)?.username || ''}
                          </Typography>
                        </Box>
                      }
                    />
                  </Box>
                ))}
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
            <Button 
              onClick={handleSendEmails}
              variant="contained"
              disabled={selectedInternalEmails.length === 0 || isLoading}
              sx={{ 
                bgcolor: 'rgb(54, 115, 97)',
                '&:hover': { bgcolor: 'rgb(44, 95, 77)' }
              }}
            >
              {isLoading ? 'Sending...' : 'Send Emails'}
            </Button>
          </DialogActions>
        </Dialog>

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