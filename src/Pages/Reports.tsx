import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Grid,
  CircularProgress,
} from "@mui/material";
import SidebarHeader from "../Components/SidebarHeader";
import { api } from "../Screens/common";
import { FormLayout } from "../Components/EsgReportingForm/form-layout";
import { useNavigate } from "react-router-dom";

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

const Reports: React.FC = () => {
  const navigate = useNavigate();
  const [reportingName, setReportingName] = useState<string>("");
  const [reportingPeriod, setReportingPeriod] = useState<string>("");
  const [reportingPeriods, setReportingPeriods] = useState<ReportingPeriod[]>(
    []
  );
  const [reportingFrequency, setReportingFrequency] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log({
      reportingName,
      reportingPeriod,
      reportingFrequency,
    });
    const response = await saveFormData();
    if (response?.id) {
      console.log("reponse.id =>" + response?.id);
      navigate(`/reporting-choose-standard/${response?.id}`);
    }
  };

  const saveFormData = async () => {
    // Handle form submission logic
    let fromdata = new FormData();
    fromdata.append("name", reportingName);
    fromdata.append("reporting_period", reportingPeriod);
    fromdata.append("frequency", reportingFrequency);
    const rpt_response = await api.post("esg/api/reporting/", {
      body: fromdata,
    });
    console.log("rpt_response =>", rpt_response);
    const responseData: any = await rpt_response.json();
    if (!rpt_response.ok) {
      throw new Error(
        responseData.message ||
          responseData.non_field_errors?.[0] ||
          "Failed to save assessment data"
      );
    }

    return responseData; // Return the response data containing the survey ID
  };

  useEffect(() => {
    fetchReportingPeriods();
  }, []);

  const fetchReportingPeriods = async () => {
    try {
      setLoading(true);
      const response = await api.get("esg/api/esg-reporting-period/").json();
      console.log("API Response periods:", response);
      setReportingPeriods(response || []);
    } catch (error) {
      console.error("Error fetching reporting periods:", error);
      setReportingPeriods([]);
    } finally {
      setLoading(false);
    }
  };
  const reportsContent = (
    <Box sx={{ py: 1 }}>
      <Typography
        variant="h6"
        sx={{ mb: 3, backgroundColor: "white", p: 2, borderRadius: 2 }}
      >
        ESG Reports Basics
      </Typography>

      <Paper sx={{ p: 3, maxWidth: 600, mx: "auto" }}>
        <Typography variant="h6" sx={{ mb: 3 }}>
          Create New Report
        </Typography>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Reporting Name"
                value={reportingName}
                onChange={(e) => setReportingName(e.target.value)}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth required>
                <InputLabel id="reporting-period-label">
                  Reporting Period
                </InputLabel>
                <Select
                  labelId="reporting-period-label"
                  value={reportingPeriod}
                  label="Reporting Period"
                  onChange={(e) => setReportingPeriod(e.target.value)}
                >
                  {reportingPeriods.map((period) => (
                    <MenuItem key={period.id} value={period.id.toString()}>
                      {`${period.name} - ${period.year} (${period.type_of_year})`}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth required>
                <InputLabel id="reporting-frequency-label">
                  Reporting Frequency
                </InputLabel>
                <Select
                  labelId="reporting-frequency-label"
                  value={reportingFrequency}
                  label="Reporting Frequency"
                  onChange={(e) => setReportingFrequency(e.target.value)}
                >
                  <MenuItem value="yearly">Yearly</MenuItem>
                  {/* <MenuItem value="bi-annual">Bi-Annual</MenuItem> */}
                  <MenuItem value="quarterly">Quarterly</MenuItem>
                  <MenuItem value="monthly">Monthly</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  sx={{
                    bgcolor: "#147C65",
                    "&:hover": {
                      bgcolor: "#0F5A4B",
                    },
                  }}
                >
                  Create Report
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );

  return (
    <SidebarHeader>
      {" "}
      {loading ? (
        <FormLayout>
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="200px"
          >
            <CircularProgress />
          </Box>
        </FormLayout>
      ) : (
        reportsContent
      )}
    </SidebarHeader>
  );
};

export default Reports;
