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
  const { surveyId } = useParams();
  const [surveySource, setSurveySource] = useState(null);
  const [alertInfo, setAlertInfo] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleCloseAlert = () => {
    setAlertInfo({ ...alertInfo, open: false });
  };

  const fetchSurvey = async () => {
    try {
      console.log("Fetching survey with ID:", surveyId);
      const surveyResponse = await api.get(
        `esg/api/surveys/get_surveys/?survey_id=${surveyId}`
      );
      const surveyData = await surveyResponse.json();
      console.log("Full survey response:", surveyData);

      // Handle both array and object responses
      const survey = Array.isArray(surveyData) ? surveyData[0] : surveyData;
      console.log("Processed survey data:", survey);

      // Check all possible locations of indicator_source_id
      const sourceId =
        survey?.indicator_source_id ||
        survey?.data?.indicator_source_id ||
        survey?.indicator_source;

      console.log("Found indicator_source_id:", sourceId);

      if (!sourceId) {
        console.error("Survey data structure:", survey);
        throw new Error(
          "No indicator source ID found. Please select a standard first."
        );
      }

      // Fetch standards
      const standardsResponse = await api.get(
        `esg/api/standards/?indicator_source=${sourceId}`
      );
      const standardsData = await standardsResponse.json();
      console.log("Standards data:", standardsData);

      if (standardsResponse.ok) {
        setData(standardsData);
      } else {
        throw new Error(
          `Failed to fetch standards: ${standardsResponse.statusText}`
        );
      }
    } catch (error) {
      console.error("Error in fetchSurvey:", error);
      setAlertInfo({
        open: true,
        message: error.message,
        severity: "error",
      });
    }
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
  const [selectedSectorStandard, setSelectedSectorStandard] = useState(null);
  const [selectedNonSectorStandards, setSelectedNonSectorStandards] = useState(
    []
  );

  useEffect(() => {
    fetchSurvey();
  }, []);

  const handleSectorStandardChange = (event) => {
    setSelectedSectorStandard(event.target.value);
  };

  const handleNonSectorStandardChange = (event) => {
    const standardName = event.target.value;
    setSelectedNonSectorStandards((prevSelected) => {
      if (event.target.checked) {
        return [...prevSelected, standardName];
      } else {
        return prevSelected.filter((name) => name !== standardName);
      }
    });
  };

  const handleNextClick = async () => {
    if (!selectedSectorStandard && selectedNonSectorStandards.length === 0) {
      setAlertInfo({
        open: true,
        message: "Please select at least one standard before proceeding.",
        severity: "error",
      });
      return;
    }

    if (!surveyId) {
      setAlertInfo({
        open: true,
        message: "Survey ID not found.",
        severity: "error",
      });
      return;
    }

    try {
      const selectedStandardIds = [];

      if (selectedSectorStandard) {
        const sectorStandardId = data["sector-standard"].find(
          (standard) => standard.name === selectedSectorStandard
        )?.id;
        if (sectorStandardId) selectedStandardIds.push(sectorStandardId);
      }

      if (selectedNonSectorStandards.length > 0) {
        const nonSectorStandardIds = data["non-sector-standard"]
          .filter((standard) =>
            selectedNonSectorStandards.includes(standard.name)
          )
          .map((standard) => standard.id);
        selectedStandardIds.push(...nonSectorStandardIds);
      }

      if (selectedStandardIds.length === 0) {
        setAlertInfo({
          open: true,
          message: "Selected standards not found.",
          severity: "error",
        });
        return;
      }

      // Store selected standard IDs using the API
      try {
        const standardsResponse = await api.post("esg/api/survey-standards/", {
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            survey_id: surveyId,
            standard_ids: selectedStandardIds,
          }),
        });

        if (!standardsResponse.ok) {
          console.warn(
            "Failed to store standards via API, will use localStorage as fallback"
          );
        } else {
          console.log("Successfully stored standards via API");
        }
      } catch (error) {
        console.error("Error storing standards via API:", error);
        // Continue with localStorage as fallback
      }

      // Store selected standard IDs in localStorage as fallback
      localStorage.setItem(
        `survey_${surveyId}_standard_ids`,
        JSON.stringify(selectedStandardIds)
      );

      const formData = new FormData();
      formData.append("next_step", "SECTOR_SELECTION");
      // Use the first selected standard for the standard_id field
      formData.append("standard_id", selectedStandardIds[0]);
      const response = await api.post(
        `esg/api/surveys/${surveyId}/update_survey/`,
        {
          body: formData,
        }
      );

      if (response.ok) {
        // Navigate directly to the material issues page without calling the disclosures API
        navigate(`/choose-materiale-issues/${surveyId}`);
      } else {
        setAlertInfo({
          open: true,
          message: "Failed to update survey. Please try again.",
          severity: "error",
        });
      }
    } catch (error) {
      console.error("Error updating survey:", error);
      setAlertInfo({
        open: true,
        message: "An error occurred. Please try again.",
        severity: "error",
      });
    }
  };

  // Custom rounded checkbox component
  const RoundedCheckbox = (props) => (
    <Checkbox
      {...props}
      icon={
        <Box
          component="span"
          sx={{
            width: 20,
            height: 20,
            borderRadius: "6px",
            border: "solid #ccc",
          }}
        />
      }
      checkedIcon={
        <Box
          component="span"
          sx={{
            width: 20,
            height: 20,
            borderRadius: "6px",
            backgroundColor: "#147C65",
            border: "2px solid #147C65",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#ffffff",
          }}
        >
          <CheckIcon sx={{ fontSize: 16 }} />
        </Box>
      }
    />
  );

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
              Non-Sector Standards (Select Multiple)
            </Typography>
            <Grid container spacing={2}>
              {data["non-sector-standard"]?.map((standard) => (
                <Grid item xs={12} sm={6} key={standard.id}>
                  <FormControlLabel
                    value={standard.name}
                    control={
                      <RoundedCheckbox
                        checked={selectedNonSectorStandards.includes(
                          standard.name
                        )}
                        onChange={handleNonSectorStandardChange}
                      />
                    }
                    label={standard.name}
                  />
                </Grid>
              ))}
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
              disabled={
                !selectedSectorStandard &&
                selectedNonSectorStandards.length === 0
              }
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
              Next
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
