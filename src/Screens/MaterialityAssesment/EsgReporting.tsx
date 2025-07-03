import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  CssBaseline,
  ThemeProvider,
  Typography,
} from "@mui/material";
import { ProgressTracker } from "../../Components/progress-tracker";
import { OrganizationForm } from "../../Components/EsgReportingForm/organization-form";
import { ReportingPeriodForm } from "../../Components/EsgReportingForm/reporting-period-form";
import { FrequencyForm } from "../../Components/EsgReportingForm/frequency-form";
import { SectorIndustryForm } from "../../Components/EsgReportingForm/sector-industry-form";
import { theme } from "../../lib/theme";
import type { Step } from "@/types/organization";
import SidebarHeader from "../../Components/SidebarHeader";
import { api } from "../../Screens/common";
import { useNavigate } from "react-router-dom";

interface FormData {
  surveyName?: string;
  organization?: {
    organizationId: number;
    siteId: number;
    organizationDetails: string;
    entitiesName: string;
    organizationSize: string;
    geographicLocation: string;
  };
  reportingPeriod?: {
    periodId: number;
    reportingPeriod: string;
    startDate: string | null; // Changed from Date to string
    endDate: string | null; // Changed from Date to string
  };
  frequency?: {
    frequency: string;
  };
  sectorIndustry?: {
    sector: string;
    industry: string;
  };
}

interface ApiSubmissionData {
  name: string;
  organization: number;
  site: number;
  reporting_period: number;
  frequency: string;
  sector: string;
  industry: string;
  organization_name: string;
  site_name: string;
  organization_size: string;
  geographic_location: string;
  start_date: string;
  end_date: string;
}

const initialSteps: Step[] = [
  { id: 1, title: "Enter Survey Name", status: "in-progress" },
  { id: 2, title: "Org Details", status: "pending" },
  { id: 3, title: "Reporting Period", status: "pending" },
  { id: 4, title: "Frequency", status: "pending" },
  { id: 5, title: "Choose Sector/Industry", status: "pending" },
  { id: 6, title: "Success", status: "pending" }, // Changed title from "Complete" to "Success"
];

const SurveyNameForm = ({
  onNext,
  updateFormData,
}: {
  onNext: () => void;
  updateFormData: (data: { surveyName: string }) => void;
}) => {
  const [surveyName, setSurveyName] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (!surveyName.trim()) {
      setError("Please enter a survey name");
      return;
    }
    updateFormData({ surveyName: surveyName.trim() });
    onNext();
  };

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
        Provide Survey Name
      </Typography>
      <TextField
        fullWidth
        label="Survey Name"
        value={surveyName}
        onChange={(e) => setSurveyName(e.target.value)}
        error={!!error}
        helperText={error}
        sx={{ mb: 3 }}
      />
      <Button
        variant="contained"
        onClick={handleSubmit}
        disabled={!surveyName.trim()}
        sx={{
          alignSelf: "flex-end",
          mt: "auto",
          width: "100px",
          textTransform: "capitalize", // Changed from 'lowercase' to 'capitalize'
        }}
      >
        next
      </Button>
    </Box>
  );
};

export default function EsgReportingPage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [steps, setSteps] = useState<Step[]>([
    {
      id: 1,
      title: "Primary Information",
      type: "main",
      status: "in-progress",
    },
    { id: 2, title: "Enter Survey Name", type: "sub", status: "in-progress" },
    { id: 3, title: "Org Details", type: "sub", status: "pending" },
    { id: 4, title: "Reporting Period", type: "sub", status: "pending" },
    { id: 5, title: "Frequency", type: "sub", status: "pending" },
    { id: 6, title: "Choose Sector/Industry", type: "sub", status: "pending" },
    { id: 7, title: "Setup External Survey", type: "main", status: "pending" },
    { id: 8, title: "Setup Internal Survey", type: "main", status: "pending" },
  ]);
  const [formData, setFormData] = useState<FormData>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const primarySteps = [
    {
      id: 1,
      title: "Primary Information",
      status: "in-progress",
      subSteps: [
        { id: 1, title: "Enter Survey Name", status: "in-progress" },
        { id: 2, title: "Org Details", status: "pending" },
        { id: 3, title: "Reporting Period", status: "pending" },
        { id: 4, title: "Frequency", status: "pending" },
        { id: 5, title: "Choose Sector/Industry", status: "pending" },
      ],
    },
    {
      id: 2,
      title: "Setup External Survey",
      status: "pending",
    },
    {
      id: 3,
      title: "Setup Internal Survey",
      status: "pending",
    },
  ];

  const saveFormDataToApi = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      console.log("Raw form data before submission:", formData);

      // More detailed validation with specific error messages
      if (!formData.organization?.organizationId) {
        throw new Error("Organization ID is required");
      }
      if (!formData.organization?.siteId) {
        throw new Error("Site ID is required");
      }
      if (!formData.reportingPeriod?.periodId) {
        throw new Error("Reporting period is required");
      }
      if (!formData.sectorIndustry?.sector) {
        throw new Error("Sector is required");
      }
      if (!formData.sectorIndustry?.industry) {
        throw new Error("Industry is required");
      }
      if (!formData.reportingPeriod?.startDate) {
        throw new Error("Start date is required");
      }
      if (!formData.reportingPeriod?.endDate) {
        throw new Error("End date is required");
      }

      const submissionData: ApiSubmissionData = {
        name: formData.surveyName || "New Assessment",
        organization: formData.organization.organizationId,
        site: formData.organization.siteId,
        reporting_period: formData.reportingPeriod.periodId,
        frequency: formData.frequency?.frequency || "annually", // provide default
        sector: formData.sectorIndustry.sector,
        industry: formData.sectorIndustry.industry,
        organization_name: formData.organization.organizationDetails,
        site_name: formData.organization.entitiesName,
        organization_size: formData.organization.organizationSize,
        geographic_location: formData.organization.geographicLocation,
        start_date: formData.reportingPeriod.startDate,
        end_date: formData.reportingPeriod.endDate,
      };

      console.log("Submitting data to API:", submissionData);

      const response = await api.post("esg/api/surveys/create-for-org/", {
        json: submissionData,
      });

      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(
          responseData.message ||
            responseData.non_field_errors?.[0] ||
            "Failed to save assessment data"
        );
      }

      console.log("Assessment created successfully:", responseData);
      return responseData; // Return the response data containing the survey ID
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "An error occurred while saving the assessment";
      setError(errorMessage);
      console.error("Error saving assessment:", errorMessage);
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateFormData = (stepData: Partial<FormData>) => {
    return new Promise<void>((resolve, reject) => {
      try {
        setFormData((prev) => {
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

  const handleNext = async () => {
    try {
      if (currentStep === 5) {
        // When last sub-step is complete
        const surveyData = await saveFormDataToApi();
        if (surveyData?.id) {
          // First complete all sub-steps
          const updatedSteps = steps.map((step) => {
            if (step.type === "sub") {
              return { ...step, status: "complete" };
            }
            if (step.id === 1) {
              // Primary Information main step
              return { ...step, status: "complete" };
            }
            if (step.id === 7) {
              // Setup External Survey main step
              return { ...step, status: "in-progress" };
            }
            return step;
          });
          setSteps(updatedSteps);
          navigate(`/choose-materiality/${surveyData.id}`); // Changed from choose-standard to choose-materiality
        }
        return;
      }

      // Normal step progression - only update sub-steps
      setSteps(
        steps.map((step) => {
          if (step.type === "sub") {
            return {
              ...step,
              status:
                step.id === currentStep + 1
                  ? "complete"
                  : step.id === currentStep + 2
                  ? "in-progress"
                  : step.status,
            };
          }
          return step;
        })
      );
      setCurrentStep((prev) => prev + 1);
    } catch (err) {
      console.error("Error during form submission:", err);
    }
  };

  const handleBack = () => {
    setSteps(
      steps.map((step) => {
        if (step.id === currentStep) {
          return { ...step, status: "pending" };
        }
        if (step.id === currentStep - 1) {
          return { ...step, status: "in-progress" };
        }
        return step;
      })
    );
    setCurrentStep((prev) => prev - 1);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <SurveyNameForm
            onNext={handleNext}
            updateFormData={(data) =>
              updateFormData({ surveyName: data.surveyName })
            }
          />
        );
      case 2:
        return (
          <OrganizationForm
            onNext={handleNext}
            onBack={handleBack} // Add this line
            updateFormData={(data) => updateFormData({ organization: data })}
          />
        );
      case 3:
        return (
          <ReportingPeriodForm
            onNext={handleNext}
            onBack={handleBack}
            selectedOrganization={
              formData.organization?.organizationDetails || ""
            }
            selectedSite={formData.organization?.entitiesName || ""}
            updateFormData={(data) => updateFormData({ reportingPeriod: data })}
          />
        );
      case 4:
        return (
          <FrequencyForm
            onNext={handleNext}
            onBack={handleBack} // Add this line
            updateFormData={(data) => updateFormData({ frequency: data })}
          />
        );
      case 5:
        return (
          <SectorIndustryForm
            onNext={handleNext}
            onBack={handleBack} // Add this line
            updateFormData={(data) => updateFormData({ sectorIndustry: data })}
          />
        );
      case 6:
        return (
          <Box sx={{ textAlign: "center", p: 4 }}>
            {isSubmitting ? (
              <Typography>Saving assessment data...</Typography>
            ) : error ? (
              <Typography color="error">{error}</Typography>
            ) : (
              <>
                <Typography variant="h5" sx={{ color: "success.main", mb: 2 }}>
                  Assessment Setup Complete!
                </Typography>
                <Typography variant="body1">
                  You can now proceed with your materiality assessment.
                </Typography>
                {/* Optional: Add a button to proceed to the next section */}
              </>
            )}
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SidebarHeader>
        <Box
          sx={{
            width: "100%",
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: "none",
            p: 1.5,
            mb: 1.5,
          }}
        >
          <Typography sx={{ fontSize: "17px" }}>
            Materiality Assessment
          </Typography>
        </Box>
        <Box sx={{ width: "100%", mb: 2, boxShadow: "none" }}>
          <ProgressTracker steps={steps} currentStep={currentStep} />
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            flex: 1,
            width: "100%",
            boxShadow: "none !important",
          }}
        >
          {renderStep()}
        </Box>
      </SidebarHeader>
    </ThemeProvider>
  );
}
