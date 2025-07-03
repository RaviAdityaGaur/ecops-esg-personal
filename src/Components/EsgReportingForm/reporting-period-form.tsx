import React, { useState, useEffect } from 'react';
import {
  Button,
  FormControl,
  MenuItem,
  Box,
  Select,
  Stack,
  Typography,
  CircularProgress,
  InputLabel,
} from '@mui/material';
import { FormLayout } from './form-layout';
import { api } from "../../Screens/common";

interface ReportingPeriodFormData {
  reportingPeriod: string;
  startDate: string | null;  // Changed from Date to string
  endDate: string | null;    // Changed from Date to string
  periodId?: number;
}

interface ReportingPeriodFormProps {
  onNext: () => void;
  onBack: () => void;
  selectedOrganization: string;
  selectedSite: string;
  updateFormData?: (data: ReportingPeriodFormData) => void;
}

interface ReportingPeriod {
  id: number;
  name: string;
  period_start_date: string;
  period_end_date: string;
  type_of_year: string;
  year: number;
  is_base_year: boolean;
  organisation: number;
}

export function ReportingPeriodForm({ 
  onNext, 
  onBack, 
  selectedOrganization,
  selectedSite,
  updateFormData 
}: ReportingPeriodFormProps) {
  const [formData, setFormData] = useState<ReportingPeriodFormData>({
    reportingPeriod: '',
    startDate: null,
    endDate: null,
  });

  const [reportingPeriods, setReportingPeriods] = useState<ReportingPeriod[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReportingPeriods();
  }, [selectedOrganization, selectedSite]);

  const fetchReportingPeriods = async () => {
    try {
      setLoading(true);
      const response = await api.get('esg/api/esg-reporting-period/').json();
      console.log('API Response periods:', response);
      setReportingPeriods(response || []);
    } catch (error) {
      console.error('Error fetching reporting periods:', error);
      setReportingPeriods([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (updateFormData && formData.periodId) {
      const selectedPeriod = reportingPeriods.find(p => p.id === formData.periodId);
      if (selectedPeriod) {
        const dataToSubmit = {
          ...formData,
          reporting_period: selectedPeriod.id // Add this field specifically for the API
        };
        console.log('Final data to submit:', dataToSubmit);
        updateFormData(dataToSubmit);
      }
    }
    onNext();
  };

  const handlePeriodChange = (value: string) => {
    const selectedPeriod = reportingPeriods.find(period => period.id.toString() === value);
    
    if (selectedPeriod) {
      const newFormData = {
        reportingPeriod: selectedPeriod.name,
        periodId: selectedPeriod.id,
        startDate: selectedPeriod.period_start_date, // Update to match API response
        endDate: selectedPeriod.period_end_date,     // Update to match API response
      };
      console.log('Selected period data:', newFormData);
      setFormData(newFormData);
    }
  };

  if (loading) {
    return (
      <FormLayout>
        <Box display="flex" justifyContent="center" alignItems="center" height="200px">
          <CircularProgress />
        </Box>
      </FormLayout>
    );
  }

  return (
    <FormLayout>
      <form onSubmit={handleSubmit} style={{ height: '100%' }}>
        <Box sx={{ 
          height: '55vh', 
          display: 'flex', 
          flexDirection: "column"
        }}>
          <Box flex="1">
            <Typography variant="h5" fontWeight="medium" textAlign="left">
              Reporting Period
            </Typography>

            <FormControl fullWidth sx={{ mt: 4 }}>
              <InputLabel id="reporting-period-label">Select Reporting Period</InputLabel>
              <Select
                labelId="reporting-period-label"
                value={formData.periodId?.toString() || ''}
                label="Select Reporting Period"
                onChange={(e) => handlePeriodChange(e.target.value)}
              >
                {reportingPeriods.map((period) => (
                  <MenuItem key={period.id} value={period.id.toString()}>
                    {`${period.name} - ${period.year} (${period.type_of_year})`}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <Box
            display="flex"
            justifyContent="flex-end"
            gap={2}
          >
            <Button
              onClick={onBack}
              variant="contained"
              sx={{ 
                width: 120,
                textTransform: 'capitalize' ,
                bgcolor: '#868687',
                '&:hover': {
                  bgcolor: '#757576'
                }
              }}
            >
              Back
            </Button>
            <Button
              type="submit"
              variant="contained"
              sx={{ width: 120,textTransform: 'capitalize'  }}
              disabled={!formData.reportingPeriod}
            >
              Next 
            </Button>
          </Box>
        </Box>
      </form>
    </FormLayout>
  );
}

export default ReportingPeriodForm;