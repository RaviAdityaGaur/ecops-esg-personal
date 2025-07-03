import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
} from '@mui/material';
import SidebarHeader from '../SidebarHeader';
import { api } from '../../Screens/common';
import { format } from 'date-fns';

const ListReportingPeriod = () => {
  const [periods, setPeriods] = useState([]);

  useEffect(() => {
    const fetchPeriods = async () => {
      try {
        const response = await api.get('esg/api/esg-reporting-period/').json();
        console.log('API Response:', response); // Debug log
        setPeriods(response); // Remove .results
      } catch (error) {
        console.error('Error fetching reporting periods:', error);
      }
    };

    fetchPeriods();
  }, []);

  const formatDate = (dateString) => {
    return format(new Date(dateString), 'dd MMM yyyy');
  };

  return (
    <SidebarHeader>
      <Container maxWidth="lg">
        <Typography variant="h4" sx={{ mb: 4 }}>
          Reporting Periods
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Period Name</TableCell>
                <TableCell>Year Type</TableCell>
                <TableCell>Start Date</TableCell>
                <TableCell>End Date</TableCell>
                <TableCell>Year</TableCell>
                <TableCell>Base Year</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {periods.map((period) => (
                <TableRow key={period.id}>
                  <TableCell>{period.name}</TableCell>
                  <TableCell>{period.type_of_year}</TableCell>
                  <TableCell>{formatDate(period.period_start_date)}</TableCell>
                  <TableCell>{formatDate(period.period_end_date)}</TableCell>
                  <TableCell>{period.year}</TableCell>
                  <TableCell>
                    <Chip 
                      label={period.is_base_year ? "Yes" : "No"} 
                      color={period.is_base_year ? "success" : "default"}
                      size="small"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    </SidebarHeader>
  );
};

export default ListReportingPeriod;
