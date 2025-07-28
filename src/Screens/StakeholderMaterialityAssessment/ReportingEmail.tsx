import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, Typography, Button, CssBaseline, ThemeProvider, TextField, Paper, Stack, Dialog, DialogTitle, DialogContent, DialogActions, Alert, Snackbar, Checkbox, FormControlLabel, Tooltip, Divider } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { api } from '../common';
import { theme } from '../../lib/theme';
import SidebarHeader from '../../Components/SidebarHeader';
import { useAuth } from '../../services/AuthContext';
import { ProgressTracker } from '../../Components/progress-tracker';

interface InternalUser {
  id: number;
  email: string;
  username: string;
  full_name: string;
  org_user_id: number;
}

export default function ReportingEmail() {
  const { hasPermission } = useAuth();
  const navigate = useNavigate();
  const { reportId } = useParams();
  const [emailInput, setEmailInput] = useState('');
  const [testEmailDialog, setTestEmailDialog] = useState(false);
  const [sendEmailDialog, setSendEmailDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error'
  });

  const [isSendingTestEmail, setIsSendingTestEmail] = useState(false);
  const [isSendingEmails, setIsSendingEmails] = useState(false);
  // Logo state is needed for emails
  const [logo, setLogo] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [showPermissionDialog, setShowPermissionDialog] = useState(true);
  const [internalEmails, setInternalEmails] = useState<string[]>([]);
  const [selectedInternalEmails, setSelectedInternalEmails] = useState<string[]>([]);
  const [internalUsers, setInternalUsers] = useState<InternalUser[]>([]);
  const [shouldSendEmail, setShouldSendEmail] = useState(false);
  // We're using reportId directly from URL params
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [steps] = useState([
    {
      id: 1,
      title: 'Primary Information',
      type: 'main' as const,
      status: 'complete' as const
    },
    {
      id: 2,
      title: 'Setup External Survey',
      type: 'main' as const,
      status: 'complete' as const
    },
    {
      id: 3,
      title: 'Setup Internal Survey',
      type: 'main' as const,
      status: 'in-progress' as const
    },
    {
      id: 4,
      title: 'Choose Disclosures',
      type: 'sub' as const,
      status: 'complete' as const
    },
    {
      id: 5,
      title: 'Add Questions',
      type: 'sub' as const,
      status: 'complete' as const
    },
    {
      id: 6,
      title: 'Send Email',
      type: 'sub' as const,
      status: 'in-progress' as const
    }
  ]);
  // State for email content
  const [emailContent, setEmailContent] = useState('');

  useEffect(() => {
    if (!hasPermission('SEND_EMAIL')) {
      setShowPermissionDialog(true);
    } else {
      setShowPermissionDialog(false);
    }

    // Set default dates (today and 7 days from now)
    const today = new Date();
    setStartDate(today);

    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);
    setEndDate(nextWeek);
  }, [hasPermission]);

  useEffect(() => {
    const fetchInternalUsers = async () => {
      try {
        const response = await api.get('esg/api/get-internal-external-users/?user_type=INTERNAL');
        const users = (await response.json()) as InternalUser[];
        setInternalUsers(users);
        // Pre-populate internalEmails array with fetched email addresses
        setInternalEmails(users.map(user => user.email));
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
    if (shouldSendEmail && selectedInternalEmails.length > 0) {
      handleSendEmails(true);
      setShouldSendEmail(false); // reset trigger
    }
  }, [selectedInternalEmails, shouldSendEmail]);

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setLogo(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleEmailSelect = (email: string) => {
    setSelectedInternalEmails(prev => (prev.includes(email) ? prev.filter(e => e !== email) : [...prev, email]));
  };

  const handleAddEmail = () => {
    if (emailInput && emailInput.includes('@')) {
      if (!internalEmails.includes(emailInput)) {
        setInternalEmails([...internalEmails, emailInput]);
        setSelectedInternalEmails(prev => [...prev, emailInput]);
        setEmailInput('');
      }
    }
  };

  const handleRemoveEmail = (emailToRemove: string) => {
    setInternalEmails(internalEmails.filter(email => email !== emailToRemove));
    setSelectedInternalEmails(selectedInternalEmails.filter(email => email !== emailToRemove));
  };
  const handleSendEmails = async (isTest = true) => {
    console.log('>>>>>>>>>>>>');
    if (!reportId) {
      setSnackbar({
        open: true,
        message: 'Report ID is required',
        severity: 'error'
      });
      return;
    }

    // if (!startDate || !endDate) {
    //   setSnackbar({
    //     open: true,
    //     message: 'Please select both start and end dates',
    //     severity: 'error'
    //   });
    //   return;
    // }

    // if (endDate < startDate) {
    //   setSnackbar({
    //     open: true,
    //     message: 'End date cannot be before start date',
    //     severity: 'error'
    //   });
    //   return;
    // }

    if (isTest) {
      setIsSendingTestEmail(true);
    } else {
      setIsSendingEmails(true);
    }

    try {
      const endpoint = isTest ? 'esg/api/report-email/send_test_email/' : 'esg/api/report-email/send_test_email/';

      console.log('is test >>>>>>>>>>>', isTest, selectedInternalEmails);
      // Create form data if logo exists
      if (logo) {
        const formData = new FormData();
        formData.append('instructions', emailContent.trim() || 'Please provide your feedback by clicking the link below.');
        formData.append('report_id', reportId); // Using reportId directly as report_uuid

        // Add test emails only for test email
        if (isTest) {
          selectedInternalEmails.forEach(email => {
            formData.append('test_emails', email);
          });
        }

        // Add logo if available
        formData.append('logo', logo);

        await api.post(endpoint, {
          body: formData
        });
      } else {
        // Build the appropriate payload based on test or real email
        let payload;

        if (isTest) {
          // For test emails, we only need report_uuid, instructions, and test_emails
          payload = {
            instructions: emailContent.trim() || 'Please provide your feedback by clicking the link below.',
            report_id: reportId,
            test_emails: selectedInternalEmails
          };
        } else {
          // For actual emails, we include additional fields
          payload = {
            instructions: emailContent.trim() || 'Please provide your feedback by clicking the link below.',
            report_id: reportId,
            test_emails: selectedInternalEmails
          };
        }

        await api.post(endpoint, {
          body: JSON.stringify(payload),
          headers: {
            'Content-Type': 'application/json'
          }
        });
      }

      // Show success message
      setSnackbar({
        open: true,
        message: isTest ? 'Test email sent successfully!' : 'Emails sent successfully!',
        severity: 'success'
      });
      setSendEmailDialog(false);
      setTestEmailDialog(false);
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

  const renderEmailContent = () => (
    <Stack spacing={3}>
      <Typography variant="subtitle1" fontSize="16px" fontWeight="500">
        Compose Email
      </Typography>

      <Box
        sx={{
          border: '1px solid #E0E0E0',
          borderRadius: 1,
          p: 2,
          backgroundColor: '#FFFFFF'
        }}
      >
        <Box display="flex" justifyContent="flex-start" alignItems="center" sx={{ mb: 2 }}>
          <Typography sx={{ mr: 2 }}>Upload Logo :</Typography>
          <input accept="image/*" style={{ display: 'none' }} id="logo-upload" type="file" onChange={handleLogoUpload} />
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
              <img src={logoPreview} alt="Logo preview" style={{ height: '40px', width: 'auto' }} />
            </Box>
          )}
        </Box>

        {/* <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Box sx={{ flex: 1 }}>
              <Typography sx={{ mb: 1 }}>Start Date :</Typography>
              <DatePicker
                value={startDate}
                onChange={(newDate) => setStartDate(newDate)}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    variant: 'outlined',
                    size: 'small'
                  }
                }}
              />
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography sx={{ mb: 1 }}>End Date :</Typography>
              <DatePicker
                value={endDate}
                onChange={(newDate) => setEndDate(newDate)}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    variant: 'outlined',
                    size: 'small'
                  }
                }}
              />
            </Box>
          </LocalizationProvider>
        </Box> */}

        <Box sx={{ mb: 2 }}>
          <Typography sx={{ mb: 1 }}>Email Content :</Typography>
          <TextField multiline rows={4} fullWidth variant="outlined" value={emailContent} onChange={e => setEmailContent(e.target.value)} placeholder="Please provide your feedback by clicking the link below." />
        </Box>
      </Box>
      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'space-between', mt: 2 }}>
        {' '}
        <Button
          variant="outlined"
          size="small"
          onClick={() => navigate(`/selected-disclosures-summary/${reportId}`)}
          sx={{
            color: 'rgb(54, 115, 97)',
            borderColor: 'rgb(54, 115, 97)',
            '&:hover': {
              borderColor: 'rgb(54, 115, 97)',
              backgroundColor: 'rgba(54, 115, 97, 0.04)'
            }
          }}
        >
          Back
        </Button>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            size="small"
            onClick={() => setTestEmailDialog(true)}
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
            {isSendingTestEmail ? 'Testing...' : 'SEND TEST MAIL'}
          </Button>
          <Button
            variant="contained"
            size="small"
            onClick={() => setSendEmailDialog(true)}
            disabled={!hasPermission('SEND_EMAIL')}
            sx={{
              bgcolor: 'rgb(54, 115, 97)',
              '&:hover': {
                bgcolor: 'rgb(44, 95, 77)'
              },
              '&.Mui-disabled': {
                bgcolor: 'rgba(0, 0, 0, 0.12)',
                color: 'rgba(0, 0, 0, 0.26)'
              }
            }}
          >
            Send Email
          </Button>{' '}
          <Button
            variant="contained"
            size="small"
            onClick={() => navigate(`/task-assignment/${reportId}`)}
            sx={{
              bgcolor: 'rgb(54, 115, 97)',
              '&:hover': {
                bgcolor: 'rgb(44, 95, 77)'
              }
            }}
          >
            Continue
          </Button>
        </Box>
      </Box>
    </Stack>
  );

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
        {/* <Dialog
          open={showPermissionDialog}
          onClose={() => navigate(-1)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Permission Required</DialogTitle>
          <DialogContent>
            <Typography>
              You don't have sufficient permissions to access this page. Please
              contact your administrator for access.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => navigate(-1)}
              variant="contained"
              sx={{
                bgcolor: "rgb(54, 115, 97)",
                "&:hover": {
                  bgcolor: "rgb(44, 95, 77)",
                },
              }}
            >
              Go Back
            </Button>
          </DialogActions>
        </Dialog> */}

        {/* Main content */}
        {/* {!showPermissionDialog && (
          <> */}

        <Box
          sx={{
            width: '100%',
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: 'none',
            p: 2
          }}
        >
          <Typography sx={{ fontSize: '20px' }}>Send email to steering committe</Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
          <Paper sx={{ flex: 1, p: 3, borderRadius: 2 }}>{renderEmailContent()}</Paper>
        </Box>

        {/* Test Email Dialog */}
        <Dialog open={testEmailDialog} onClose={() => setTestEmailDialog(false)} maxWidth="xs" fullWidth>
          <DialogTitle>Send Test Email</DialogTitle>
          <DialogContent>
            <Typography variant="body1" sx={{ mb: 2 }}>
              Enter your email address to send a test copy
            </Typography>
            <TextField
              fullWidth
              placeholder="name@company.com"
              variant="outlined"
              value={emailInput}
              onChange={e => setEmailInput(e.target.value)}
              onKeyPress={e => {
                if (e.key === 'Enter' && emailInput) {
                  handleAddEmail();
                }
              }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setTestEmailDialog(false)} variant="outlined">
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (emailInput && emailInput.includes('@')) {
                  setSelectedInternalEmails([emailInput]);
                  console.log('setSelectedInternalEmails ++++++', selectedInternalEmails);
                  setShouldSendEmail(true);
                  // handleSendEmails(true);
                  setTestEmailDialog(false);
                } else {
                  setSnackbar({
                    open: true,
                    message: 'Please enter a valid email address',
                    severity: 'error'
                  });
                }
              }}
              variant="contained"
              disabled={isSendingTestEmail}
              sx={{
                bgcolor: 'rgb(54, 115, 97)',
                '&:hover': {
                  bgcolor: 'rgb(44, 95, 77)'
                }
              }}
            >
              {isSendingTestEmail ? 'Sending...' : 'Send'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Send Email Dialog */}
        <Dialog open={sendEmailDialog} onClose={() => setSendEmailDialog(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Send Survey Email</DialogTitle>
          <DialogContent>
            {/* Manual Email Input Section */}
            {/* <Box sx={{ mt: 2, mb: 3 }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Add Additional Email:
              </Typography>
              <TextField
                fullWidth
                label="Internal Email Address"
                variant="outlined"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    handleAddEmail();
                  }
                }}
              />
              <Button
                sx={{
                  mt: 1,
                  color: "rgb(54, 115, 97)",
                  borderColor: "rgb(54, 115, 97)",
                  "&:hover": {
                    borderColor: "rgb(54, 115, 97)",
                    backgroundColor: "rgba(54, 115, 97, 0.04)",
                  },
                }}
                variant="outlined"
                onClick={handleAddEmail}
              >
                Add Email
              </Button>
            </Box>

            <Divider sx={{ my: 2 }} /> */}

            {/* Internal Users Section */}
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Internal Users:
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {/* Show fetched internal users */}
              {internalUsers.map(user => (
                <Box
                  key={user.id}
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={selectedInternalEmails.includes(user.email)}
                        onChange={() => handleEmailSelect(user.email)}
                        sx={{
                          color: 'rgb(54, 115, 97)',
                          '&.Mui-checked': {
                            color: 'rgb(54, 115, 97)'
                          }
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
                  <Box
                    key={`manual-${index}`}
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={selectedInternalEmails.includes(email)}
                          onChange={() => handleEmailSelect(email)}
                          sx={{
                            color: 'rgb(54, 115, 97)',
                            '&.Mui-checked': {
                              color: 'rgb(54, 115, 97)'
                            }
                          }}
                        />
                      }
                      label={email}
                    />
                    <Button size="small" onClick={() => handleRemoveEmail(email)} sx={{ color: 'error.main' }}>
                      Remove
                    </Button>
                  </Box>
                ))}
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setSendEmailDialog(false)}>Cancel</Button>
            <Button
              onClick={() => {
                handleSendEmails(false);
                setSendEmailDialog(false);
              }}
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
        <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%' }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </SidebarHeader>
    </ThemeProvider>
  );
}
