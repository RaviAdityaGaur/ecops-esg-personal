import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  FormControlLabel,
  Checkbox,
  Alert,
  Snackbar,
  CircularProgress,
} from "@mui/material";
import SidebarHeader from "../../Components/SidebarHeader";
import { useNavigate, useParams } from "react-router-dom";
import { ProgressTracker } from "../../Components/progress-tracker";
import { api } from "../common";
import CheckIcon from "@mui/icons-material/Check";

export default function ChooseMaterialIssue() {
  const navigate = useNavigate();
  const { surveyId } = useParams();
  const [alertInfo, setAlertInfo] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [materialIssues, setMaterialIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedIssues, setSelectedIssues] = useState([]);
  const [standardIds, setStandardIds] = useState([]);

  useEffect(() => {
    const fetchMaterialIssues = async () => {
      try {
        setLoading(true);
        const response = await api.get("esg/api/material-issues/").json();
        setMaterialIssues(response);
      } catch (error) {
        console.error("Error fetching material issues:", error);
        setAlertInfo({
          open: true,
          message: "Failed to load material issues. Please refresh the page.",
          severity: "error",
        });
      } finally {
        setLoading(false);
      }
    };

    const fetchSurveyStandards = async () => {
      try {
        // First, try to get the standard IDs from the API
        try {
          const standardsApiResponse = await api.get(
            `esg/api/survey-standards/?survey_id=${surveyId}`
          );
          const standardsData = await standardsApiResponse.json();

          if (
            standardsApiResponse.ok &&
            standardsData &&
            standardsData.standard_ids
          ) {
            setStandardIds(standardsData.standard_ids);
            console.log(
              "Standard IDs retrieved from API:",
              standardsData.standard_ids
            );
            return;
          }
        } catch (error) {
          console.warn(
            "Failed to retrieve standards from API, trying fallback methods:",
            error
          );
        }

        // Second, try to get the standard IDs from localStorage (set by ChooseSector)
        const savedStandardIds = localStorage.getItem(
          `survey_${surveyId}_standard_ids`
        );
        if (savedStandardIds) {
          const parsedIds = JSON.parse(savedStandardIds);
          setStandardIds(parsedIds);
          console.log("Standard IDs retrieved from localStorage:", parsedIds);
          return;
        }

        // If not in localStorage, fetch from surveys API
        const surveyResponse = await api.get(
          `esg/api/surveys/get_surveys/?survey_id=${surveyId}`
        );
        const surveyData = await surveyResponse.json();
        console.log("Survey data for standards:", surveyData);

        const survey = Array.isArray(surveyData) ? surveyData[0] : surveyData;

        // Get the standard IDs that were selected in ChooseSector
        // Check all possible locations in the API response
        let standards = [];

        // Try to find standards in different possible locations
        if (survey?.selected_standards) {
          standards = survey.selected_standards;
        } else if (survey?.standards) {
          standards = survey.standards;
        } else if (survey?.data?.selected_standards) {
          standards = survey.data.selected_standards;
        } else if (survey?.data?.standards) {
          standards = survey.data.standards;
        }

        // Extract IDs depending on the structure
        if (Array.isArray(standards)) {
          // Handle both cases: array of objects with id or array of IDs
          const ids = standards.map((standard) =>
            typeof standard === "object" ? standard.id : standard
          );
          setStandardIds(ids);
          console.log("Standard IDs found in API:", ids);
        } else {
          console.warn(
            "No standards found in survey data, fetching mapped disclosures"
          );

          // As a fallback, try to get the standards from already mapped disclosures
          try {
            const mappedDisclosures = await api
              .get(
                `esg/api/get-disclosures-from-survey/?survey_id=${surveyId}&is_external=TRUE`
              )
              .json();
            if (mappedDisclosures?.disclosures?.length > 0) {
              // Extract unique standard IDs from the disclosures
              const standardIdsFromDisclosures = [
                ...new Set(
                  mappedDisclosures.disclosures
                    .filter((d) => d.standard_id)
                    .map((d) => d.standard_id)
                ),
              ];

              if (standardIdsFromDisclosures.length > 0) {
                setStandardIds(standardIdsFromDisclosures);
                console.log(
                  "Standard IDs extracted from mapped disclosures:",
                  standardIdsFromDisclosures
                );
              }
            }
          } catch (error) {
            console.error("Error fetching mapped disclosures:", error);
          }
        }
      } catch (error) {
        console.error("Error fetching survey standards:", error);
      }
    };

    fetchMaterialIssues();
    fetchSurveyStandards();
  }, [surveyId]);

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
    { id: 4, title: "Choose Sectors", type: "sub", status: "complete" },
    {
      id: 5,
      title: "Choose Material Issues",
      type: "sub",
      status: "in-progress",
    },
    { id: 6, title: "Add Questions", type: "sub", status: "pending" },
    { id: 7, title: "Send Email", type: "sub", status: "pending" },
    { id: 8, title: "Setup Internal Survey", type: "main", status: "pending" },
  ]);

  const handleIssueChange = (issueId) => {
    const id = parseInt(issueId);
    if (selectedIssues.includes(id)) {
      setSelectedIssues(
        selectedIssues.filter((selectedId) => selectedId !== id)
      );
    } else {
      setSelectedIssues([...selectedIssues, id]);
    }
  };

  const handleBackClick = () => {
    navigate(`/choose-sector/${surveyId}`);
  };

  const handleNextClick = async () => {
    if (selectedIssues.length === 0) {
      setAlertInfo({
        open: true,
        message: "Please select at least one material issue before proceeding.",
        severity: "error",
      });
      return;
    }

    // If standardIds is still empty, show an error
    if (standardIds.length === 0) {
      setAlertInfo({
        open: true,
        message:
          "No standards found. Please go back to the Choose Sectors step.",
        severity: "error",
      });
      return;
    }

    try {
      // Store selected material issues in localStorage for use in DisclosureList
      localStorage.setItem(
        `survey_${surveyId}_material_issues`,
        JSON.stringify(selectedIssues)
      );

      // First, map the selected material issues to the survey
      const materialIssuesResponse = await api.post(
        "esg/api/survey-material-issues/",
        {
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            survey: parseInt(surveyId),
            material_issues: selectedIssues,
          }),
        }
      );

      if (!materialIssuesResponse.ok) {
        throw new Error("Failed to map material issues to survey");
      }

      // Map disclosures to the survey with the standard_ids
      const mapDisclosuresResponse = await api.post(
        "esg/api/map-disclosures-to-survey/",
        {
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            survey_id: surveyId,
            is_external: true,
            material_type: "impact",
            standard_ids: standardIds,
          }),
        }
      );

      if (!mapDisclosuresResponse.ok) {
        throw new Error("Failed to map disclosures to survey");
      }

      // Clear standard IDs from localStorage as we're using the API now
      localStorage.removeItem(`survey_${surveyId}_standard_ids`);

      // Success!
      setAlertInfo({
        open: true,
        message: "Material issues added successfully. Redirecting...",
        severity: "success",
      });
      setTimeout(() => {
        navigate(`/add-disclosure/${surveyId}`);
      }, 1500);
    } catch (error) {
      console.error("Error updating survey:", error);
      setAlertInfo({
        open: true,
        message: `An error occurred: ${error.message}`,
        severity: "error",
      });
    }
  };

  const RoundedCheckbox = ({ issueId, ...props }) => (
    <Checkbox
      {...props}
      checked={selectedIssues.includes(parseInt(issueId))}
      onChange={() => handleIssueChange(issueId)}
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
            <Typography sx={{ fontSize: "18px" }}>
              Choose Material Issues
            </Typography>
          </Box>
        </Box>
        <Box sx={{ width: "100%", mb: 2, boxShadow: "none" }}>
          <ProgressTracker steps={steps} currentStep={5} />
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
              Material Issues
            </Typography>
            {loading ? (
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                sx={{ py: 4 }}
              >
                <CircularProgress size={40} />
              </Box>
            ) : materialIssues.length === 0 ? (
              <Typography color="text.secondary" align="center" sx={{ py: 2 }}>
                No material issues found. Please check your connection and try
                again.
              </Typography>
            ) : (
              <Grid container spacing={2}>
                {materialIssues.map((issue) => (
                  <Grid item xs={12} sm={6} key={issue.id}>
                    <FormControlLabel
                      value={issue.id.toString()}
                      control={
                        <RoundedCheckbox issueId={issue.id.toString()} />
                      }
                      label={issue.name}
                    />
                  </Grid>
                ))}
              </Grid>
            )}
          </Card>

          <Box>
            <Button
              variant="outlined"
              onClick={handleBackClick}
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
              disabled={loading || selectedIssues.length === 0}
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
