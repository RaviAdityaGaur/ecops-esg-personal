import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  CssBaseline,
  ThemeProvider,
  Typography,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { theme } from "../../lib/theme";
import SidebarHeader from "../../Components/SidebarHeader";
import { ProgressTracker } from "../../Components/progress-tracker";
import { api } from "../../Screens/common";

interface MaterialTopic {
  id: string | number;
  name: string;
  hasCheckbox?: boolean;
  description?: string;
  is_important?: boolean;
  created_at?: string;
  updated_at?: string;
  organisation?: number;
  [key: string]: any;
}

const MaterialTopicsForm = ({
  onNext,
  updateFormData,
}: {
  onNext: () => void;
  updateFormData: (data: { selectedTopics: string[] }) => void;
}) => {
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [materialTopics, setMaterialTopics] = useState<MaterialTopic[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingTopics, setIsLoadingTopics] = useState(false);
  const { reportId } = useParams();

  const handleTopicChange = (topicId: string, checked: boolean) => {
    setSelectedTopics(prev => {
      if (checked) {
        return [...prev, topicId];
      } else {
        return prev.filter(id => id !== topicId);
      }
    });
  };

  // Fetch material topics from API
  useEffect(() => {
    const fetchMaterialTopics = async () => {
      try {
        setIsLoadingTopics(true);
        const response = await api
          .get("esg/api/material-issues/")
          .json<MaterialTopic[]>();
        
        // Transform API response to match our interface
        const transformedTopics = response.map((topic) => ({
          id: topic.id,
          name: topic.name,
          hasCheckbox: true,
          description: topic.description,
          is_important: topic.is_important,
          organisation: topic.organisation
        }));
        
        setMaterialTopics(transformedTopics);
        console.log("Material topics fetched:", transformedTopics);
      } catch (error) {
        console.error("Error fetching material topics:", error);
        setError("Failed to load material topics. Please refresh the page.");
      } finally {
        setIsLoadingTopics(false);
      }
    };

    fetchMaterialTopics();
  }, []);

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      
      // Convert selected topic IDs to integers for the API
      const materialTopicIds = selectedTopics.map(id => parseInt(id, 10));
      
      // Call API to add material topics to report
      await api.post("esg/api/add-material-topic-to-report/", {
        json: {
          report_id: parseInt(reportId!, 10),
          material_topic_ids: materialTopicIds
        }
      });

      console.log("Material topics added to report:", {
        report_id: reportId,
        material_topic_ids: materialTopicIds
      });
      
      // Update form data with selected topics
      updateFormData({ selectedTopics });

      onNext();
    } catch (error) {
      console.error("Error saving material topics:", error);
      setError("Failed to save material topics. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    window.history.back();
  };

  // Check if at least one topic is selected
  const isAnyTopicSelected = selectedTopics.length > 0;

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 800,
        p: 3,
        display: "flex",
        flexDirection: "column",
        backgroundColor: "background.paper",
        minHeight: "70vh",
      }}
    >
      {/* Material Topics Section */}
      <Typography variant="h6" sx={{ mb: 3, color: "text.primary", fontWeight: 600 }}>
        Material Topics
      </Typography>

      <Box sx={{ 
        display: "flex", 
        flexDirection: "column", 
        gap: 1.5, 
        mb: 4, 
        flex: 1,
      }}>
        {isLoadingTopics ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <Typography sx={{ color: "text.secondary" }}>
              Loading material topics...
            </Typography>
          </Box>
        ) : materialTopics.length === 0 ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <Typography sx={{ color: "text.secondary" }}>
              No material topics available.
            </Typography>
          </Box>
        ) : (
          materialTopics.map((topic) => (
            <Box key={topic.id} sx={{ display: "flex", alignItems: "center" }}>
              {topic.hasCheckbox ? (
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={selectedTopics.includes(topic.id.toString())}
                      onChange={(e) => handleTopicChange(topic.id.toString(), e.target.checked)}
                      sx={{
                        color: "primary.main",
                        "&.Mui-checked": {
                          color: "primary.main",
                        },
                      }}
                    />
                  }
                  label={
                    <Box>
                      <Typography sx={{ fontSize: "16px", color: "text.primary" }}>
                        {topic.name}
                      </Typography>
                      {topic.description && (
                        <Typography sx={{ 
                          fontSize: "14px", 
                          color: "text.secondary",
                          mt: 0.5 
                        }}>
                          {topic.description}
                        </Typography>
                      )}
                    </Box>
                  }
                />
              ) : (
                <Typography sx={{ 
                  fontSize: "16px", 
                  color: "text.primary",
                  pl: 5 // Align with checkbox labels
                }}>
                  {topic.name}
                </Typography>
              )}
            </Box>
          ))
        )}
      </Box>

      {/* Bottom Buttons */}
      <Box sx={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center",
        mt: "auto",
        pt: 3
      }}>
        <Button
          variant="outlined"
          onClick={handleBack}
          disabled={isLoading}
          sx={{
            textTransform: "capitalize",
            px: 3,
            py: 1,
            borderColor: "grey.400",
            color: "grey.700",
            "&:hover": {
              borderColor: "grey.600",
              backgroundColor: "grey.50",
            },
          }}
        >
          Back
        </Button>

        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={!isAnyTopicSelected || isLoading || isLoadingTopics}
          sx={{
            textTransform: "capitalize",
            px: 4,
            py: 1,
            backgroundColor: "primary.main",
            "&:hover": {
              backgroundColor: "primary.dark",
            },
            "&:disabled": {
              backgroundColor: "grey.300",
              color: "grey.500",
            },
          }}
        >
          {isLoading ? "Loading..." : "Next"}
        </Button>
      </Box>

      {error && (
        <Typography color="error" sx={{ mt: 2, textAlign: "center" }}>
          {error}
        </Typography>
      )}
    </Box>
  );
};

export default function SelectMaterialTopics() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<any>({});
  const { reportId } = useParams();

  // Define steps for progress tracker matching the ReportingDisclosureList pattern
  const [steps] = useState([
    { id: 1, title: "Primary Information", type: "main", status: "complete" },
    { id: 2, title: "Setup External Survey", type: "main", status: "complete" },
    { id: 3, title: "Choose Standards", type: "sub", status: "complete" },
    { id: 4, title: "Choose Sector", type: "sub", status: "complete" },
    { id: 5, title: "Choose Disclosures", type: "sub", status: "complete" },
    { id: 6, title: "Open Ended Questions", type: "sub", status: "complete" },
    { id: 7, title: "Review Disclosures", type: "sub", status: "complete" },
    { id: 8, title: "Preview Survey", type: "sub", status: "complete" },
    { id: 9, title: "Submit Survey", type: "sub", status: "complete" },
    { id: 10, title: "Setup Internal Survey", type: "main", status: "in-progress" },
  ]);

  const handleNext = () => {
    console.log("Material Topics Form Data:", formData);
    console.log("reportId:", reportId);
    // Navigate to the next step - you can change this to your desired route
    navigate(`/reporting-add-disclosure/${reportId}`);
  };

  const updateFormData = (stepData: Partial<any>) => {
    return new Promise<void>((resolve, reject) => {
      try {
        setFormData((prev: any) => {
          const newData = {
            ...prev,
            ...stepData,
          };
          console.log("Updated material topics data:", newData);
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
          {/* Progress Tracker */}
          <Box sx={{ width: "100%", mb: 2, boxShadow: "none" }}>
            <Typography variant="h5" sx={{ mb: 2, color: "text.primary" }}>
              Choose Material Topics
            </Typography>
            <ProgressTracker steps={steps} currentStep={3} />
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
            <MaterialTopicsForm
              onNext={handleNext}
              updateFormData={(data) =>
                updateFormData({ selectedTopics: data.selectedTopics })
              }
            />
          </Box>
        </SidebarHeader>
      </ThemeProvider>
    </>
  );
}
