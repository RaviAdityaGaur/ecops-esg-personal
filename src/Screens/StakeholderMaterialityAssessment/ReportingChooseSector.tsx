import React, { useEffect, useState } from "react";
import {
  Box,
  CssBaseline,
  Typography,
  Button,
  Grid,
  Card,
  FormControlLabel,
  RadioGroup,
  Radio,
  Alert,
  Snackbar,
  Checkbox,
  CircularProgress,
} from "@mui/material";
import { theme } from "../../lib/theme";
import SidebarHeader from "../../Components/SidebarHeader";
import { useNavigate, useParams } from "react-router-dom";
import popImage from "../../assets/pop.png";
import { ProgressTracker } from "../../Components/progress-tracker";
import { ThemeProvider } from "@mui/material/styles";
import { api } from "../common";
import CheckIcon from "@mui/icons-material/Check";

export default function GriPage() {
  const navigate = useNavigate();
  const { reportId, standardId } = useParams();

  const [alertInfo, setAlertInfo] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleCloseAlert = () => {
    setAlertInfo({ ...alertInfo, open: false });
  };

  const [steps] = useState([
    { id: 1, title: "Primary Information", type: "main", status: "complete" },
    {
      id: 2,
      title: "Setup External Survey",
      type: "main",
      status: "in-progress",
    },
    { id: 3, title: "Choose Standards", type: "sub", status: "complete" },
    { id: 4, title: "Choose Sectors", type: "sub", status: "in-progress" },
    { id: 5, title: "Choose Disclosures", type: "sub", status: "pending" },
    { id: 6, title: "Add Questions", type: "sub", status: "pending" },
    { id: 7, title: "Send Email", type: "sub", status: "pending" },
    { id: 8, title: "Setup Internal Survey", type: "main", status: "pending" },
  ]);

  const [data, setData] = useState({
    "sector-standard": [],
    "non-sector-standard": [],
  });
  // State to track which section is selected (sector or non-sector)
  const [selectedSectionType, setSelectedSectionType] = useState(null); // 'sector' or 'non-sector'
  const [selectedSectorStandard, setSelectedSectorStandard] = useState(null);
  const [selectedNonSectorStandard, setSelectedNonSectorStandard] =
    useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchIndicatorSource = async () => {
    // Fetch standards
    const standardsResponse = await api.get(
      `esg/api/standards/?indicator_source=${standardId}`
    );
    const standardsData = await standardsResponse.json();

    if (standardsResponse.ok) {
      setData(standardsData);
    } else {
      throw new Error(
        `Failed to fetch standards: ${standardsResponse.statusText}`
      );
    }
  };
  useEffect(() => {
    fetchIndicatorSource();
  }, []);

  const handleSectorStandardChange = (event) => {
    setSelectedSectionType("sector");
    setSelectedSectorStandard(event.target.value);
    // Clear non-sector selection when sector is selected
    setSelectedNonSectorStandard(null);
  };

  const handleNonSectorStandardChange = (event) => {
    setSelectedSectionType("non-sector");
    setSelectedNonSectorStandard(event.target.value);
    // Clear sector selection when non-sector is selected
    setSelectedSectorStandard(null);
  };

  const handleNextClick = async () => {
    if (!selectedSectionType) {
      setAlertInfo({
        open: true,
        message:
          "Please select either a Sector Standard or a Non-Sector Standard before proceeding.",
        severity: "error",
      });
      return;
    }

    if (!reportId || !standardId) {
      setAlertInfo({
        open: true,
        message: "Report ID or Standard ID not found.",
        severity: "error",
      });
      return;
    }

    try {
      setIsLoading(true);

      // Get the selected standard object based on which section was selected
      let selectedStandardObj = null;

      if (selectedSectionType === "sector" && selectedSectorStandard) {
        selectedStandardObj = data["sector-standard"].find(
          (standard) => standard.name === selectedSectorStandard
        );
      } else if (
        selectedSectionType === "non-sector" &&
        selectedNonSectorStandard
      ) {
        selectedStandardObj = data["non-sector-standard"].find(
          (standard) => standard.name === selectedNonSectorStandard
        );
      }

      // Prepare the payload for the API
      const reportMetaPayload = {
        reporting: Number(reportId),
        standard:
          selectedStandardObj && selectedStandardObj.id
            ? selectedStandardObj.id
            : null,
        sector:
          selectedStandardObj && selectedStandardObj.sector
            ? selectedStandardObj.sector
            : null,
        industry:
          selectedStandardObj && selectedStandardObj.industry
            ? selectedStandardObj.industry
            : null,
        linked_survey: null,
      };

      console.log("Sending payload:", reportMetaPayload);

      // Post the data to the report-meta API
      const response = await api.post("esg/api/report-meta/", {
        json: reportMetaPayload,
      });

      if (response.ok) {
        // Navigate to the next page after successful API call
        navigate(`/reporting-survey/${reportId}`);
      } else {
        // Parse the error response if possible
        try {
          const errorData = await response.json();
          console.error("API Error response:", errorData);

          // Create a meaningful error message from the response
          let errorMessage = "Failed to save sector information.";
          if (errorData && typeof errorData === "object") {
            // Extract error details if they exist
            const errorDetails = Object.entries(errorData)
              .map(([key, value]) => `${key}: ${value}`)
              .join(", ");

            if (errorDetails) {
              errorMessage += ` ${errorDetails}`;
            }
          }

          setAlertInfo({
            open: true,
            message: errorMessage,
            severity: "error",
          });
        } catch (parseError) {
          // If we can't parse the error response
          setAlertInfo({
            open: true,
            message: `An error occurred: ${response.statusText}`,
            severity: "error",
          });
        }
      }
    } catch (error) {
      console.error("Error updating survey:", error);
      setAlertInfo({
        open: true,
        message:
          "An error occurred while saving sector information. Please try again.",
        severity: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <SidebarHeader>
        <Box
          sx={{
            width: "100%",
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: "none",
            p: 2,
            mb: 2,
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 1,
            }}
          >
            <Typography sx={{ fontSize: "18px" }}>Choose Sectors</Typography>
          </Box>
        </Box>
        <Box sx={{ width: "100%", mb: 2, boxShadow: "none" }}>
          <ProgressTracker steps={steps} currentStep={4} />
        </Box>

        <Grid
          container
          spacing={2}
          p={2}
          display="flex"
          justifyContent="flex-end"
        >
          <Card sx={{ width: "100%", mb: 2, boxShadow: "none", padding: 2 }}>
            <Typography variant="h6" gutterBottom>
              Sector Standards (Select One)
            </Typography>
            <RadioGroup
              onChange={handleSectorStandardChange}
              value={selectedSectorStandard}
            >
              {data["sector-standard"]?.map((standard) => (
                <FormControlLabel
                  key={standard.id}
                  value={standard.name}
                  control={
                    <Radio
                      sx={{
                        "&.Mui-checked": {
                          color: "#147C65",
                        },
                      }}
                    />
                  }
                  label={standard.name}
                />
              ))}
            </RadioGroup>
          </Card>

          <Card sx={{ width: "100%", mb: 2, boxShadow: "none", padding: 2 }}>
            <Typography variant="h6" gutterBottom>
              Non-Sector Standards (Select One)
            </Typography>
            <Grid container spacing={2}>
              <RadioGroup
                onChange={handleNonSectorStandardChange}
                value={selectedNonSectorStandard}
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  flexWrap: "wrap",
                  width: "100%",
                  pl: 2,
                }}
              >
                {data["non-sector-standard"]?.map((standard) => (
                  <Grid item xs={6} key={standard.id} sx={{ pl: 2, pr: 2 }}>
                    <FormControlLabel
                      value={standard.name}
                      control={
                        <Radio
                          sx={{
                            "&.Mui-checked": {
                              color: "#147C65",
                            },
                          }}
                        />
                      }
                      label={standard.name}
                      sx={{
                        width: "100%",
                        margin: "4px 0",
                        "& .MuiFormControlLabel-label": {
                          fontSize: "0.95rem",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        },
                      }}
                    />
                  </Grid>
                ))}
              </RadioGroup>
            </Grid>
          </Card>

          <Box>
            <Button
              variant="outlined"
              onClick={() => navigate(-1)}
              sx={{
                mr: 2,
                border: "solid #373737",
                color: "#373737",
                py: 1,
                px: 3.5,
                textTransform: "none",
                borderRadius: 2,
              }}
            >
              Back
            </Button>

            <Button
              variant="outlined"
              onClick={handleNextClick}
              disabled={!selectedSectionType || isLoading}
              sx={{
                border: "solid #147C65",
                color: "#147C65",
                py: 1,
                px: 3.5,
                textTransform: "none",
                borderRadius: 2,
                "&.Mui-disabled": {
                  border: "solid #9e9e9e",
                  color: "#9e9e9e",
                },
              }}
            >
              {isLoading ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                "Next"
              )}
            </Button>
          </Box>
        </Grid>
      </SidebarHeader>
      <Snackbar
        open={alertInfo.open}
        autoHideDuration={6000}
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseAlert}
          severity={alertInfo.severity}
          sx={{ width: "100%" }}
        >
          {alertInfo.message}
        </Alert>
      </Snackbar>
    </>
  );
}
