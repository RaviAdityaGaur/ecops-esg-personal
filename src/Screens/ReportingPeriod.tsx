import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  Container,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Switch,
  FormControlLabel,
  Snackbar,
  Alert,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import SidebarHeader from '../Components/SidebarHeader';
import { api } from './common';

const ReportingPeriod = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    period_start_date: null,
    period_end_date: null,
    type_of_year: 'Fiscal',
    year: new Date().getFullYear(),
    is_base_year: false,
    organisation: null,
  });

  const [errors, setErrors] = useState({});
  const [openToast, setOpenToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastSeverity, setToastSeverity] = useState('success');

  // Add useEffect to fetch organisation
  useEffect(() => {
    const fetchOrganisation = async () => {
      try {
        const response = await api.get('organisation/organisation/').json();
        if (response.results && response.results.length > 0) {
          setFormData(prev => ({
            ...prev,
            organisation: response.results[0].id
          }));
        }
      } catch (error) {
        console.error('Error fetching organisation:', error);
      }
    };

    fetchOrganisation();
  }, []);

  const formatDate = (date) => {
    if (!date) return null;
    const d = new Date(date);
    return d.toISOString().split('T')[0]; // Returns YYYY-MM-DD
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formattedData = {
        ...formData,
        period_start_date: formatDate(formData.period_start_date),
        period_end_date: formatDate(formData.period_end_date),
      };
  
      const response = await api.post('esg/api/esg-reporting-period/', { 
        json: formattedData 
      }).json();
  
      setToastMessage('Reporting period created successfully!');
      setToastSeverity('success');
      setOpenToast(true);
  
      // Reset form
      setFormData(prev => ({
        name: '',
        period_start_date: null,
        period_end_date: null,
        type_of_year: 'Fiscal',
        year: new Date().getFullYear(),
        is_base_year: false,
        organisation: prev.organisation, // Preserve the organisation id
      }));
      setErrors({});
  
      // Navigate after success
      setTimeout(() => {
        navigate('/list-reporting-period');
      }, 1000);
  
    } catch (error) {
      console.error('Error:', error);
      
      if (error.response) {
        try {
          const errorData = await error.response.json();
          setErrors(errorData);
          setToastMessage(errorData?.detail || 'Error creating reporting period');
        } catch (jsonError) {
          setToastMessage('Error: A reporting period with base year already exists for this organisation.');
        }
      } else {
        setToastMessage('Internal Server Error: Organisation constraint failed');
      }
  
      setToastSeverity('error');
      setOpenToast(true);
    }
  };
  

  const handleYearTypeChange = (yearType: string) => {
    const currentYear = new Date().getFullYear();
    
    if (yearType === 'Calendar') {
      // Set fixed dates for calendar year
      const startDate = new Date(currentYear, 0, 1); // January 1st
      const endDate = new Date(currentYear, 11, 31); // December 31st
      
      setFormData(prev => ({
        ...prev,
        type_of_year: yearType,
        period_start_date: startDate,
        period_end_date: endDate,
        year: currentYear
      }));
    } else {
      // Reset dates for fiscal year
      setFormData(prev => ({
        ...prev,
        type_of_year: yearType,
        period_start_date: null,
        period_end_date: null
      }));
    }
  };

  const calculateEndDate = (startDate: Date | null) => {
    if (!startDate) return null;
    const endDate = new Date(startDate);
    endDate.setFullYear(endDate.getFullYear() + 1);
    endDate.setDate(endDate.getDate() - 1);
    return endDate;
  };

  const handleStartDateChange = (date: Date | null) => {
    setFormData(prev => ({
      ...prev,
      period_start_date: date,
      period_end_date: calculateEndDate(date)
    }));
  };

  const handleCloseToast = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenToast(false);
  };

  return (
    <SidebarHeader>
      <Container maxWidth="md">
        <Typography variant="h4" sx={{ mb: 4 }}>
          Reporting Period
        </Typography>
        <Card sx={{ p: 4 }}>
          <form onSubmit={handleSubmit}>
            <Stack spacing={3}>
              <TextField
                fullWidth
                label="Period Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />

              <FormControl fullWidth>
                <InputLabel>Type of Year</InputLabel>
                <Select
                  value={formData.type_of_year}
                  label="Type of Year"
                  onChange={(e) => handleYearTypeChange(e.target.value)}
                >
                  <MenuItem value="Fiscal">Fiscal</MenuItem>
                  <MenuItem value="Calendar">Calendar</MenuItem>
                </Select>
              </FormControl>

              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Start Date"
                  value={formData.period_start_date}
                  onChange={handleStartDateChange}
                  disabled={formData.type_of_year === 'Calendar'}
                  slotProps={{
                    textField: {
                      helperText: errors?.period_start_date?.[0],
                      error: !!errors?.period_start_date
                    }
                  }}
                />
                <DatePicker
                  label="End Date"
                  value={formData.period_end_date}
                  onChange={(date) => setFormData({ ...formData, period_end_date: date })}
                  disabled={true} // End date is always calculated
                  slotProps={{
                    textField: {
                      helperText: errors?.period_end_date?.[0],
                      error: !!errors?.period_end_date
                    }
                  }}
                />
              </LocalizationProvider>

              <TextField
                fullWidth
                type="number"
                label="Year"
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={formData.is_base_year}
                    onChange={(e) => setFormData({ ...formData, is_base_year: e.target.checked })}
                  />
                }
                label="Set as Base Year"
              />

              <Button
                type="submit"
                variant="contained"
                size="large"
                sx={{
                  bgcolor: '#147C65',
                  '&:hover': { bgcolor: '#5CA7A0' }
                }}
              >
                Create Reporting Period
              </Button>
            </Stack>
          </form>
        </Card>
      </Container>
      <Snackbar 
        open={openToast} 
        autoHideDuration={3000} 
        onClose={handleCloseToast}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseToast} 
          severity={toastSeverity as any} 
          sx={{ width: '100%' }}
        >
          {toastMessage}
        </Alert>
      </Snackbar>
    </SidebarHeader>
  );
};

export default ReportingPeriod;
