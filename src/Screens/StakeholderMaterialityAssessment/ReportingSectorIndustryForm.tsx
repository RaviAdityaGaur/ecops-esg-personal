import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Box,
  Select,
  Typography,
  CssBaseline,
  ThemeProvider,
} from "@mui/material";
import { FormLayout } from "../../Components/EsgReportingForm/form-layout";
import { api } from "../common";
import SidebarHeader from "../../Components/SidebarHeader";
import { theme } from "../../lib/theme";

interface Sector {
  id: number;
  name: string;
  description: string;
}

interface Industry {
  id: number;
  name: string;
  description: string;
  sector: number;
  sector_name: string;
}

interface ReportingParams {
  reportId: string;
  standardId: string;
}

const ReportingSectorIndustryForm = () => {
  const { reportId, standardId } = useParams<ReportingParams>();
  const navigate = useNavigate();
  
  const [sectorId, setSectorId] = useState<number | "">("");
  const [industryId, setIndustryId] = useState<number | "">("");
  const [sectors, setSectors] = useState<Sector[]>([]);
  const [industries, setIndustries] = useState<Industry[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const getSectors = async () => {
    try {
      const response = await api.get("esg/api/sectors/");
      const data = await response.json();
      setSectors(data);
    } catch (error) {
      console.error("Error fetching sectors:", error);
    }
  };

  const getIndustryTypes = async (selectedSectorId: number) => {
    try {
      const response = await api.get(
        `esg/api/industries/?sector=${selectedSectorId}`
      );
      const data = await response.json();
      setIndustries(data);
    } catch (error) {
      console.error("Error fetching industries:", error);
    }
  };

  useEffect(() => {
    getSectors();
  }, []);

  useEffect(() => {
    if (sectorId !== "") {
      getIndustryTypes(sectorId as number);
    }
  }, [sectorId]);

  const handleSectorChange = (e: React.ChangeEvent<{ value: unknown }>) => {
    setSectorId(e.target.value as number);
    setIndustryId(""); // Reset industry when sector changes
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (sectorId === "" || industryId === "") {
      console.error("Sector and industry must be selected");
      return;
    }
    
    try {
      setIsLoading(true);
      
      // API payload
      const payload = {
        reporting: reportId,
        standard: standardId,
        sector: sectorId,
        industry: industryId,
        linked_survey: null
      };
        // Make POST request to the API
      const response = await api.post("esg/api/report-meta/", { json: payload });
      
      if (response.ok) {
        // Navigate to the next page
        navigate(`/reporting-choose-sector/${reportId}/${standardId}`);
      } else {
        const errorData = await response.json();
        console.error("API Error:", errorData);
        alert("Failed to save sector and industry data. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting form data:", error);
      alert("An error occurred. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <SidebarHeader>
          <Box sx={{ flexGrow: 1, padding: '20px', marginTop: '48px' }}> {/* Added marginTop to ensure header bar is visible */}
            <FormLayout>
              <form onSubmit={handleSubmit}>
                <Box
                  sx={{
                    height: "55vh",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <Box flex="1">
                    <Typography variant="h5" fontWeight="medium">
                      Choose Sector / Industry
                    </Typography>
                    <FormControl fullWidth sx={{ mt: 4, mb: 3 }}>
                      <InputLabel>Select Sector</InputLabel>
                      <Select
                        value={sectorId}
                        label="Select Sector"
                        onChange={handleSectorChange}
                      >
                        {sectors.map((item) => (
                          <MenuItem key={item.id} value={item.id}>
                            {item.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <FormControl fullWidth>
                      <InputLabel>Select Industry</InputLabel>
                      <Select
                        value={industryId}
                        label="Select Industry"
                        onChange={(e) => {
                          setIndustryId(e.target.value as number);
                        }}
                        disabled={sectorId === ""}
                      >
                        {industries.map((item) => (
                          <MenuItem key={item.id} value={item.id}>
                            {item.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>
                  <Box display="flex" justifyContent="flex-end" gap={2}>
                    <Button
                      variant="contained"
                      sx={{
                        width: 120,
                        textTransform: "capitalize",
                        bgcolor: "#868687",
                        "&:hover": {
                          bgcolor: "#757576",
                        },
                      }}                      onClick={() => navigate(`/reporting-choose-standard/${reportId}`)}
                    >
                      Back
                    </Button><Button
                      type="submit"
                      variant="contained"
                      sx={{
                        width: 120,
                        textTransform: "capitalize",
                        bgcolor: "#03A94E",
                        "&:hover": {
                          bgcolor: "#038F42",
                        },
                      }}
                      disabled={isLoading || sectorId === "" || industryId === ""}
                    >
                      {isLoading ? "Saving..." : "Save & Next"}
                    </Button>
                  </Box>
                </Box>
              </form>
            </FormLayout>
          </Box>
        </SidebarHeader>
      </Box>
    </ThemeProvider>
  );
};

export default ReportingSectorIndustryForm;
