import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  CssBaseline,
  ThemeProvider,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Snackbar,
  Stack,
  Paper,
  IconButton,
  Tooltip,
} from "@mui/material";
import { InfoOutlined } from "@mui/icons-material";
import { theme } from "../../lib/theme";
import SidebarHeader from "../../Components/SidebarHeader";
import { useNavigate, useParams } from "react-router-dom";
import QuestionList from "../../Components/questions/QuestionList";
import { api } from "../common";
import searchIcon from "../../assets/searchIcon.png";
import { ProgressTracker } from "../../Components/progress-tracker";

interface Question {
  id?: number;
  survey: number;
  text: string;
  question_type: string;
  options?: string;
  is_external?: boolean;
}

// Add these new interfaces
interface Disclosure {
  disclosure_id: string;
  disclosure_description: string;
  dimension: string;
  disclosure_type: string; // Add this field
  sub_topic: {
    name: string;
  };
  disclosure_theme: {
    name: string;
  };
}

function TabPanel(props: {
  children?: React.ReactNode;
  value: number;
  index: number;
}) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      {...other}
      style={{ height: "100%", overflow: "hidden" }}
    >
      {value === index && (
        <Box
          sx={{
            p: 3,
            height: "100%",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {children}
        </Box>
      )}
    </div>
  );
}

const RatingBox = ({ value }: { value: number }) => {
  const getBackgroundColor = (value: number) => {
    const colors = ["#2E84D3", "#2576C2", "#1B69B0", "#125A9E", "#094B8C"];
    return colors[value - 1];
  };

  return (
    <Box
      sx={{
        width: 30,
        height: 30,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: getBackgroundColor(value),
        color: "white",
        borderRadius: "4px",
        opacity: 0.8,
      }}
    >
      {value}
    </Box>
  );
};

// Modify PreviewDialog component
function PreviewDialog({
  open,
  onClose,
  surveyId,
}: {
  open: boolean;
  onClose: () => void;
  surveyId: string | undefined; // Add surveyId prop
}) {
  const [disclosures, setDisclosures] = useState<Disclosure[]>([]);
  const navigate = useNavigate(); // Add this

  useEffect(() => {
    const fetchDisclosures = async () => {
      try {
        const response = await api.get(
          `esg/api/get-disclosures-from-survey/?survey_id=${surveyId}&is_external=TRUE`
        );
        const data = await response.json();
        setDisclosures(data.disclosures);
      } catch (error) {
        console.error("Error fetching disclosures:", error);
      }
    };

    if (open) {
      // Only fetch when dialog opens
      fetchDisclosures();
    }
  }, [surveyId, open]);

  const handleContinue = async () => {
    if (!surveyId) return;

    try {
      const isInternal =
        new URLSearchParams(window.location.search).get("type") === "internal";
      // Skip status update if already in EXTERNAL_SURVEY status
      const surveys = await api.get("esg/api/surveys/get_surveys/").json();
      const currentSurvey = surveys.find((s) => s.id === parseInt(surveyId));

      if (currentSurvey && currentSurvey.status !== "EXTERNAL_SURVEY") {
        await api.post("esg/api/surveys/update_status/", {
          body: JSON.stringify({
            survey_id: surveyId,
            status: "EXTERNAL_SURVEY",
          }),
          headers: {
            "Content-Type": "application/json",
          },
        });
      }

      onClose();
      navigate(
        `/survey-email/${surveyId}${isInternal ? "?type=internal" : ""}`
      );
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          maxHeight: "90vh",
          borderRadius: "8px",
        },
      }}
    >
      <DialogTitle sx={{ fontSize: "18px", fontWeight: 500, color: "#1F2937" }}>
        Survey Preview
      </DialogTitle>
      <DialogContent>
        {disclosures.map((disclosure, index) => (
          <Box key={disclosure.disclosure_id} sx={{ mb: 3 }}>
            <Typography sx={{ mb: 1, fontSize: "12px", color: "gray" }}>
              {disclosure.disclosure_id} | {disclosure.dimension} |{" "}
              {disclosure.disclosure_theme.name}
            </Typography>
            <Paper
              elevation={2}
              sx={{
                p: 2,
                borderRadius: 2,
                border: "1px solid rgb(232, 232, 232)",
                boxShadow: "none",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "start", mb: 2 }}>
                <Typography sx={{ fontSize: "14px", mr: 1 }}>
                  {disclosure.sub_topic.name}
                </Typography>
                <Tooltip
                  title={disclosure.disclosure_description}
                  placement="right"
                  arrow
                >
                  <IconButton size="small" sx={{ padding: "2px" }}>
                    <InfoOutlined
                      sx={{ fontSize: "16px", color: "rgba(0, 0, 0, 0.54)" }}
                    />
                  </IconButton>
                </Tooltip>
              </Box>

              <Stack spacing={1}>
                {disclosure.disclosure_type === "FINANCIAL" ? (
                  // For financial disclosures
                  <Box>
                    <Typography
                      sx={{ mb: 1, fontSize: "12px", fontWeight: 500 }}
                    >
                      Rating:
                    </Typography>
                    <Stack direction="row" spacing={1}>
                      {[1, 2, 3, 4, 5].map((value) => (
                        <RatingBox key={value} value={value} />
                      ))}
                    </Stack>
                  </Box>
                ) : (
                  // For non-financial disclosures
                  <>
                    <Box>
                      <Typography
                        sx={{ mb: 1, fontSize: "12px", fontWeight: 500 }}
                      >
                        Likelihood:
                      </Typography>
                      <Stack direction="row" spacing={1}>
                        {[1, 2, 3, 4, 5].map((value) => (
                          <RatingBox key={value} value={value} />
                        ))}
                      </Stack>
                    </Box>

                    <Box>
                      <Typography
                        sx={{ mb: 1, fontSize: "12px", fontWeight: 500 }}
                      >
                        Severity:
                      </Typography>
                      <Stack direction="row" spacing={1}>
                        {[1, 2, 3, 4, 5].map((value) => (
                          <RatingBox key={value} value={value} />
                        ))}
                      </Stack>
                    </Box>
                  </>
                )}
              </Stack>
            </Paper>
          </Box>
        ))}
      </DialogContent>
      <DialogActions sx={{ p: 2, gap: 2 }}>
        <Button
          onClick={onClose}
          sx={{
            color: "#6B7280",
            backgroundColor: "#E5E7EB",
            textTransform: "none",
            "&:hover": {
              backgroundColor: "#D1D5DB",
            },
          }}
        >
          Back
        </Button>
        <Button
          onClick={handleContinue}
          sx={{
            color: "white",
            backgroundColor: "#147C65",
            textTransform: "none",
            "&:hover": {
              backgroundColor: "#0E5A4A",
            },
          }}
        >
          Continue
        </Button>
      </DialogActions>
    </Dialog>
  );
}

// Update the ReviewDialog to handle status transition
function ReviewDialog({
  open,
  onClose,
  questions,
  surveyId,
}: {
  // Add surveyId prop
  open: boolean;
  onClose: () => void;
  questions: Question[];
  surveyId: string | undefined; // Add surveyId prop
}) {
  const getQuestionsByType = (type: string) =>
    questions.filter((q) => q.question_type === type);

  const formatMCQOptions = (optionsString: string) => {
    return optionsString
      .split(",")
      .map(
        (option, index) =>
          `${String.fromCharCode(97 + index)}. ${option.trim()}`
      )
      .join("\n");
  };

  const [showPreview, setShowPreview] = useState(false);

  const handlePreview = () => {
    const isInternal =
      new URLSearchParams(window.location.search).get("type") === "internal";
    setShowPreview(true); // Just show preview without updating status
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            maxHeight: "80vh",
            borderRadius: "8px",
          },
        }}
      >
        <DialogTitle
          sx={{ fontSize: "18px", fontWeight: 500, color: "#1F2937" }}
        >
          Review Questions
        </DialogTitle>
        <DialogContent>
          {["true_false", "open_ended", "mcq"].map((type) => (
            <Box key={type} sx={{ mb: 3 }}>
              <Typography sx={{ fontWeight: 500, mb: 1, color: "#1F2937" }}>
                {type === "true_false"
                  ? "True/False"
                  : type === "open_ended"
                  ? "Subjective"
                  : "MCQ"}{" "}
                Questions
              </Typography>
              {getQuestionsByType(type).map((question, index) => (
                <Box key={question.id} sx={{ mb: 1, pl: 2 }}>
                  <Typography sx={{ color: "#4B5563" }}>
                    {index + 1}. {question.text}
                  </Typography>
                  {type === "mcq" && question.options && (
                    <Typography
                      sx={{
                        color: "#6B7280",
                        fontSize: "0.9em",
                        pl: 2,
                        whiteSpace: "pre-line",
                      }}
                    >
                      {formatMCQOptions(question.options)}
                    </Typography>
                  )}
                </Box>
              ))}
              {getQuestionsByType(type).length === 0 && (
                <Typography sx={{ color: "#6B7280", pl: 2 }}>
                  No questions added
                </Typography>
              )}
            </Box>
          ))}
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 2, justifyContent: "flex-end" }}>
          <Button
            onClick={onClose}
            sx={{
              color: "#6B7280",
              backgroundColor: "#E5E7EB",
              textTransform: "none",
              "&:hover": {
                backgroundColor: "#D1D5DB",
              },
            }}
          >
            Back
          </Button>
          <Button
            onClick={handlePreview}
            sx={{
              color: "white",
              backgroundColor: "#147C65",
              textTransform: "none",
              "&:hover": {
                backgroundColor: "#0E5A4A",
              },
            }}
          >
            Preview
          </Button>
        </DialogActions>
      </Dialog>

      <PreviewDialog
        open={showPreview}
        onClose={() => setShowPreview(false)}
        surveyId={surveyId} // Pass surveyId to PreviewDialog
      />
    </>
  );
}

export default function SurveyQuestions() {
  const { surveyId } = useParams();
  const [activeTab, setActiveTab] = useState(0);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [newQuestion, setNewQuestion] = useState<Question>({
    survey: Number(surveyId),
    text: "",
    question_type: "true_false",
    options: "",
  });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [showReviewDialog, setShowReviewDialog] = useState(false);
  const navigate = useNavigate();
  const [additionalQuestions, setAdditionalQuestions] = useState<Question[]>(
    []
  );
  const [mcqOptions, setMcqOptions] = useState<string[]>([""]);
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
    { id: 5, title: "Choose Disclosures", type: "sub", status: "complete" },
    { id: 6, title: "Add Questions", type: "sub", status: "in-progress" },
    { id: 7, title: "Send Email", type: "sub", status: "pending" },
    { id: 8, title: "Setup Internal Survey", type: "main", status: "pending" },
  ]);

  useEffect(() => {
    fetchQuestions();
    // Reset newQuestion with current surveyId when it changes
    setNewQuestion((prev) => ({ ...prev, survey: Number(surveyId) }));
  }, [surveyId]); // Add surveyId as dependency

  const fetchQuestions = async () => {
    try {
      const response = await api.get(
        `esg/api/questions/?survey=${surveyId}&is_external=true`
      ); // Add is_external parameter
      const data = await response.json();
      // Filter questions to only show those matching the current surveyId
      const filteredQuestions = data.filter(
        (q) => q.survey === Number(surveyId) && q.is_external
      );
      setQuestions(filteredQuestions || []);
    } catch (error) {
      console.error("Error fetching questions:", error);
      showSnackbar("Error fetching questions");
      setQuestions([]);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
    setNewQuestion({
      ...newQuestion,
      question_type: ["true_false", "open_ended", "mcq"][newValue],
    });
  };

  const handleSaveNext = () => {
    setShowReviewDialog(true);
  };

  const handleConfirmSave = async () => {
    try {
      const response = await api.post("esg/api/questions/", {
        // Added trailing slash
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(questions),
      });

      if (response.ok) {
        showSnackbar("Questions saved successfully");
        navigate("/next-page");
      } else {
        throw new Error("Failed to save questions");
      }
    } catch (error) {
      console.error("Error saving questions:", error);
      showSnackbar("Error saving questions");
    }
  };

  const handleAddQuestion = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setNewQuestion({
      survey: Number(surveyId),
      text: "",
      question_type: ["true_false", "open_ended", "mcq"][activeTab],
      options: "",
    });
    setAdditionalQuestions([]);
    setMcqOptions([""]); // Reset MCQ options
  };

  const handleSaveQuestion = async () => {
    try {
      // Check for duplicates before saving
      const options = mcqOptions.filter((opt) => opt.trim() !== "");
      const hasDuplicates = options.some(
        (opt, index) =>
          options.findIndex(
            (o) => o.trim().toLowerCase() === opt.trim().toLowerCase()
          ) !== index
      );

      if (hasDuplicates) {
        setSnackbarMessage("Cannot save with duplicate options");
        setSnackbarOpen(true);
        return;
      }

      const allQuestions = [newQuestion, ...additionalQuestions].map((q) => ({
        ...q,
        is_external: true,
      }));

      const promises = allQuestions.map((question) =>
        api.post("esg/api/questions/", {
          json: question,
        })
      );

      await Promise.all(promises);
      handleCloseDialog();
      showSnackbar("Questions added successfully");
      fetchQuestions();
    } catch (error) {
      console.error("Error adding questions:", error);
      showSnackbar("Error adding questions");
    }
  };

  const handleDeleteQuestion = async (id: number) => {
    try {
      const response = await api.delete(`esg/api/questions/${id}/`);

      if (response.ok) {
        setQuestions(questions.filter((q) => q.id !== id));
        showSnackbar("Question deleted successfully");
      } else {
        throw new Error("Failed to delete question");
      }
    } catch (error) {
      console.error("Error deleting question:", error);
      showSnackbar("Error deleting question");
    }
  };

  const showSnackbar = (message: string) => {
    setSnackbarMessage(message);
    setSnackbarOpen(true);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const getQuestionsByType = (type: string) =>
    questions.filter(
      (q) => q.question_type === type && q.survey === Number(surveyId)
    );

  // Update EmptyState component
  const EmptyState = () => (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        padding: "20px",
      }}
    >
      <img
        src={searchIcon}
        alt="No questions"
        style={{ width: "48px", height: "48px", marginBottom: "16px" }}
      />
      <Typography sx={{ color: "#64748B", fontSize: "16px" }}>
        No questions added yet
      </Typography>
    </Box>
  );

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const response = await api.get("esg/api/surveys/get_surveys/").json();
        const survey = response.find((s) => s.id === parseInt(surveyId || ""));
        if (survey && survey.status !== "OPEN_ENDED_QUESTIONS") {
          // Update status if not correct
          await api.post("esg/api/surveys/update_status/", {
            body: JSON.stringify({
              survey_id: surveyId,
              status: "OPEN_ENDED_QUESTIONS",
            }),
            headers: {
              "Content-Type": "application/json",
            },
          });
        }
      } catch (error) {
        console.error("Error checking survey status:", error);
      }
    };
    checkStatus();
  }, [surveyId]);

  const handleNext = async () => {
    try {
      // Get the type parameter from URL
      const urlParams = new URLSearchParams(window.location.search);
      const isInternal = urlParams.get("type") === "internal";

      // Update status to EXTERNAL_SURVEY before navigating
      await api.post("esg/api/surveys/update_status/", {
        body: JSON.stringify({
          survey_id: surveyId,
          status: "EXTERNAL_SURVEY",
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      // Navigate maintaining the internal parameter if it exists
      navigate(
        `/survey-email/${surveyId}${isInternal ? "?type=internal" : ""}`
      );
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleAddMore = () => {
    setAdditionalQuestions([
      ...additionalQuestions,
      {
        survey: Number(surveyId),
        text: "",
        question_type: "true_false",
        options: "",
      },
    ]);
  };

  const handleQuestionChange = (index: number, value: string) => {
    if (index === 0) {
      setNewQuestion({ ...newQuestion, text: value });
    } else {
      const updatedQuestions = [...additionalQuestions];
      updatedQuestions[index - 1].text = value;
      setAdditionalQuestions(updatedQuestions);
    }
  };

  const handleAddMcqOption = () => {
    setMcqOptions([...mcqOptions, ""]);
  };

  const handleMcqOptionChange = (index: number, value: string) => {
    const newOptions = [...mcqOptions];
    newOptions[index] = value;
    setNewQuestion({
      ...newQuestion,
      options: newOptions.filter((opt) => opt.trim() !== "").join(","),
    });
  };

  const isValidForm = () => {
    if (newQuestion.question_type === "mcq") {
      return (
        newQuestion.text.trim() !== "" &&
        mcqOptions.filter((opt) => opt.trim() !== "").length >= 2
      );
    }
    if (newQuestion.question_type === "true_false") {
      return (
        newQuestion.text.trim() !== "" &&
        additionalQuestions.every((q) => q.text.trim() !== "")
      );
    }
    return newQuestion.text.trim() !== "";
  };

  // Add this helper function near the top with other functions
  const getOptionLetter = (index: number) => {
    return String.fromCharCode(65 + index); // 65 is ASCII for 'A'
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SidebarHeader>
        {/* Add ProgressTracker at the top */}
        <Box sx={{ width: "100%", mb: 2, boxShadow: "none" }}>
          <ProgressTracker
            steps={steps}
            currentStep={6} // This represents "Add Questions" in the sub-steps
          />
        </Box>

        <Box
          sx={{
            width: "100%",
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: "none",
            p: 2,
          }}
        >
          <Typography sx={{ fontSize: "18px" }}>Choose Questions</Typography>
        </Box>

        <Box
          sx={{
            width: "100%",
            bgcolor: "background.paper",
            p: "24px 0px 0px 0px",
            marginTop: 2,
            borderRadius: 2,
            boxShadow: "none",
            height: "60vh",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Box
            sx={{
              borderBottom: 1,
              borderColor: "divider",
              display: "flex",
              padding: "0px 24px",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              sx={{
                "& .MuiTab-root": {
                  textTransform: "none",
                  fontSize: "14px",
                  fontWeight: 400,
                  color: "#64748B",
                  "&.Mui-selected": {
                    color: "#147C65",
                    fontWeight: 500,
                  },
                },
                "& .MuiTabs-indicator": {
                  backgroundColor: "#147C65",
                  height: "3px",
                },
              }}
            >
              <Tab label="True false" />
              <Tab label="Open ended" />
              <Tab label="MCQ" />
            </Tabs>
            <Button
              variant="contained"
              onClick={handleAddQuestion}
              sx={{
                backgroundColor: "#147C65",
                textTransform: "none",
                "&:hover": {
                  backgroundColor: "#147C65",
                },
              }}
            >
              + Add Questions
            </Button>
          </Box>

          <Box
            sx={{
              flexGrow: 1,
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
            <TabPanel value={activeTab} index={0}>
              {getQuestionsByType("true_false").length > 0 ? (
                <Box sx={{ height: "100%", overflow: "auto" }}>
                  <QuestionList
                    questions={getQuestionsByType("true_false")}
                    onDelete={handleDeleteQuestion}
                  />
                </Box>
              ) : (
                <EmptyState />
              )}
            </TabPanel>
            <TabPanel value={activeTab} index={1}>
              {getQuestionsByType("open_ended").length > 0 ? (
                <Box sx={{ height: "100%", overflow: "auto" }}>
                  <QuestionList
                    questions={getQuestionsByType("open_ended")}
                    onDelete={handleDeleteQuestion}
                  />
                </Box>
              ) : (
                <EmptyState />
              )}
            </TabPanel>
            <TabPanel value={activeTab} index={2}>
              {getQuestionsByType("mcq").length > 0 ? (
                <Box sx={{ height: "100%", overflow: "auto" }}>
                  <QuestionList
                    questions={getQuestionsByType("mcq")}
                    onDelete={handleDeleteQuestion}
                  />
                </Box>
              ) : (
                <EmptyState />
              )}
            </TabPanel>
          </Box>

          <Box
            sx={{
              width: "100%",
              backgroundColor: "#F8FAFC",
              display: "flex",
              justifyContent: "flex-end", // Changed back to flex-end
              padding: "12px 20px",
              gap: 2, // Add gap between buttons
            }}
          >
            <Button
              variant="outlined"
              onClick={() =>
                navigate(
                  `/survey-disclosures/${surveyId}${window.location.search}`
                )
              }
              sx={{
                color: "#147C65",
                borderColor: "#147C65",
                textTransform: "none",
                "&:hover": {
                  borderColor: "#0E5A4A",
                  backgroundColor: "rgba(20, 124, 101, 0.04)",
                },
              }}
            >
              Back
            </Button>

            <Button
              variant="contained"
              onClick={handleSaveNext}
              sx={{
                backgroundColor: "#EFEFEF",
                borderRadius: 1.5,
                color: "#147C65",
                border: "1px solid #147C65",
                textTransform: "none",
                boxShadow: "none",
              }}
            >
              Save and Next
            </Button>
          </Box>
        </Box>

        <Dialog
          open={openDialog}
          onClose={handleCloseDialog}
          PaperProps={{
            sx: {
              maxWidth: "500px",
              minHeight: "400px", // Same height for all types
              borderRadius: "8px",
              width: "100%",
            },
          }}
        >
          <DialogTitle
            sx={{
              p: 2,
              fontSize: "18px",
              fontWeight: 500,
              color: "#1F2937",
            }}
          >
            Add{" "}
            {newQuestion.question_type === "true_false"
              ? "True/False"
              : newQuestion.question_type === "open_ended"
              ? "Open ended"
              : "MCQ"}{" "}
            Question
          </DialogTitle>
          <DialogContent sx={{ p: 2 }}>
            {[newQuestion].concat(additionalQuestions).map((q, index) => (
              <Box key={index} sx={{ mt: 2 }}>
                <TextField
                  fullWidth
                  label={`Question ${index + 1}`}
                  value={q.text}
                  onChange={(e) => handleQuestionChange(index, e.target.value)}
                  sx={{ mb: 2 }}
                />
              </Box>
            ))}

            {/* Add More Questions button for True/False */}
            {newQuestion.question_type === "true_false" && (
              <Button
                onClick={handleAddMore}
                sx={{
                  color: "#147C65",
                  textTransform: "none",
                  display: "flex",
                  alignItems: "center",
                  float: "right",
                  mb: 2,
                }}
              >
                + Add More Question
              </Button>
            )}

            {/* MCQ Options section */}
            {newQuestion.question_type === "mcq" && (
              <Box>
                <Typography sx={{ mb: 1, color: "#4B5563", fontSize: "14px" }}>
                  Options
                </Typography>
                {mcqOptions.map((option, index) => (
                  <Box
                    key={index}
                    sx={{ display: "flex", alignItems: "center", mb: 1 }}
                  >
                    <Typography
                      sx={{ mr: 2, color: "#6B7280", minWidth: "24px" }}
                    >
                      {getOptionLetter(index)}.
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      placeholder={`Option ${index + 1}`}
                      value={option}
                      onChange={(e) =>
                        handleMcqOptionChange(index, e.target.value)
                      }
                    />
                  </Box>
                ))}
                <Button
                  onClick={handleAddMcqOption}
                  sx={{
                    color: "#147C65",
                    textTransform: "none",
                    display: "flex",
                    alignItems: "center",
                    float: "right",
                  }}
                >
                  + Add Option
                </Button>
              </Box>
            )}
          </DialogContent>
          <DialogActions sx={{ p: 2, gap: 2 }}>
            <Button
              onClick={handleCloseDialog}
              sx={{
                flex: 1,
                py: 1,
                color: "#6B7280",
                backgroundColor: "#E5E7EB",
                textTransform: "none",
                "&:hover": {
                  backgroundColor: "#D1D5DB",
                },
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveQuestion}
              disabled={!isValidForm()}
              sx={{
                flex: 1,
                py: 1,
                color: "white",
                backgroundColor: "#147C65",
                textTransform: "none",
                "&:hover": {
                  backgroundColor: "#0E5A4A",
                },
                "&.Mui-disabled": {
                  backgroundColor: "#E5E7EB",
                  color: "#9CA3AF",
                },
              }}
            >
              Save
            </Button>
          </DialogActions>
        </Dialog>

        <Snackbar
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "center",
          }}
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          message={snackbarMessage}
        />
        <ReviewDialog
          open={showReviewDialog}
          onClose={() => setShowReviewDialog(false)}
          questions={questions}
          surveyId={surveyId} // Pass surveyId here
        />
      </SidebarHeader>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      />
    </ThemeProvider>
  );
}
