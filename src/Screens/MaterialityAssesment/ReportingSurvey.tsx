import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  CssBaseline,
  ThemeProvider,
  Typography,
  Select,
  MenuItem,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { theme } from "../../lib/theme";
import SidebarHeader from "../../Components/SidebarHeader";
import { api } from "../../Screens/common";

interface Survey {
  id: string | number;
  name: string;
  [key: string]: any;
}

const SurveyNameForm = ({
  onNext,
  updateFormData,
}: {
  onNext: () => void;
  updateFormData: (data: { surveyName: string }) => void;
}) => {
  const [surveyName, setSurveyName] = useState("");
  const [error, setError] = useState("");
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { reportId } = useParams();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      setIsLoading(true);

      // Make POST request to add disclosures API

      // Update linked survey in report-meta API
      try {
        // First get current report meta data
        const reportMeta = await api
          .get(`esg/api/report-meta/${reportId}`)
          .json<any>();

        console.log("try>>>>>>>>>>>>>>>>>>>>>", reportMeta);
        // Update the report meta with the selected survey
        if (reportMeta) {
          const currentMeta = reportMeta;
          await api.put(`esg/api/report-meta/${reportId}/`, {
            json: {
              ...currentMeta,
              linked_survey: surveyName, // This is the survey ID from the dropdown
            },
          });

          await api.post("esg/api/add-standard-disclosures-to-report/", {
            json: { report_id: reportId },
          });
          console.log("Report meta updated with linked survey:", surveyName);
        } else {
          // If no existing meta, create new one
          await api.post("esg/api/report-meta/", {
            json: {
              reporting: reportId,
              standard: 0,
              sector: 0,
              industry: 0,
              linked_survey: surveyName,
            },
          });
          console.log(
            "New report meta created with linked survey:",
            surveyName
          );
        }
      } catch (metaError) {
        console.error("Error updating report meta:", metaError);
        // We continue even if this fails, as it's not critical for navigation
      }

      updateFormData({ surveyName: surveyName });
      onNext();
    } catch (error) {
      console.error("Error adding disclosures:", error);
      setError("Failed to add disclosures. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleContinueWithoutSurvey = async () => {
    try {
      setIsLoading(true);
      // Make POST request to add disclosures API
      await api.post("esg/api/add-standard-disclosures-to-report/", {
        json: { report_id: reportId },
      });

      navigate(`/select-material-topics/${reportId}`);
    } catch (error) {
      console.error("Error adding disclosures:", error);
      setError("Failed to add disclosures. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchSurveyData = async () => {
      try {
        const surveysResponse = await api
          .get("esg/api/surveys/get_surveys/")
          .json<Survey[]>();
        setSurveys(surveysResponse);
      } catch (error) {
        console.error("Error fetching surveys:", error);
      }
    };

    fetchSurveyData();
  }, []);

  // Check if a survey is selected
  const isSurveySelected = surveyName !== "";

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 500,
        height: "60vh",
        p: 2,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start", // Changed from 'center' to 'flex-start'
        backgroundColor: "background.paper",
      }}
    >
      <Typography variant="h6" sx={{ mb: 3, alignSelf: "flex-start" }}>
        Select Survey
      </Typography>

      <Select
        value={surveyName}
        label="Survey Name"
        onChange={(e) => {
          setSurveyName(e.target.value);
        }}
        sx={{ width: "100%", mb: 3, alignSelf: "flex-end" }}
      >
        {Array.isArray(surveys) &&
          surveys.map((org) => (
            <MenuItem key={org?.id} value={org?.id}>
              {org?.name}
            </MenuItem>
          ))}
      </Select>

      {!isSurveySelected && (
        <Button
          variant="text"
          onClick={handleContinueWithoutSurvey}
          disabled={isLoading || isSurveySelected}
          sx={{
            mb: 3,
            alignSelf: "flex-end",
            textTransform: "none",
            color: "primary.main",
          }}
        >
          Continue without Survey
        </Button>
      )}

      <Button
        variant="contained"
        onClick={handleSubmit}
        disabled={!isSurveySelected || isLoading}
        sx={{
          alignSelf: "flex-end",
          mt: "auto",
          width: "100px",
          textTransform: "capitalize", // Changed from 'lowercase' to 'capitalize'
        }}
      >
        {isLoading ? "Loading..." : "Next"}
      </Button>

      {error && (
        <Typography color="error" sx={{ mt: 2, alignSelf: "center" }}>
          {error}
        </Typography>
      )}
    </Box>
  );
};

export default function ReportingSurvey() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<any>({});
  const { reportId } = useParams();

  const handleNext = () => {
    console.log("handleNext" + formData);
    console.log("reportId" + reportId);
    navigate(`/select-material-topics/${reportId}`);
  };

  const updateFormData = (stepData: Partial<any>) => {
    return new Promise<void>((resolve, reject) => {
      try {
        setFormData((prev: any) => {
          const newData = {
            ...prev,
            ...stepData,
          };
          console.log("Updated form data:", newData);
          return newData;
        });
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  };

  return (
    <>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <SidebarHeader>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              flex: 1,
              width: "100%",
              boxShadow: "none !important",
            }}
          >
            <SurveyNameForm
              onNext={handleNext}
              updateFormData={(data) =>
                updateFormData({ surveyName: data.surveyName })
              }
            />
          </Box>
        </SidebarHeader>
      </ThemeProvider>
    </>
  );
}
