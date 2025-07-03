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
} from "@mui/material";
import { theme } from "../../../lib/theme";
import SidebarHeader from "../../../Components/SidebarHeader";
import { useNavigate, useParams } from "react-router-dom";
import QuestionList from "../../../Components/questions/QuestionList";
import { api } from "../../common";
import searchIcon from "../../../assets/searchIcon.png";
import { InfoOutlined } from "@mui/icons-material";
import { Stack, Paper, IconButton, Tooltip } from "@mui/material";
import { ProgressTracker } from "../../../Components/progress-tracker";

interface Question {
  id?: number;
  survey: number;
  text: string;
  question_type: string;
  options?: string;
  is_internal?: boolean;
}

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

// Define a TabPanel component similar to what we did in Questions.tsx
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

function PreviewDialog({
  open,
  onClose,
  surveyId,
}: {
  open: boolean;
  onClose: () => void;
  surveyId: string | undefined;
}) {
  const [disclosures, setDisclosures] = useState<Disclosure[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDisclosures = async () => {
      if (open && surveyId) {
        try {
          const response = await api.get(
            `esg/api/get-disclosures-from-survey/?survey_id=${surveyId}`
          );
          const data = await response.json();
          setDisclosures(data.disclosures);
        } catch (error) {
          console.error("Error fetching disclosures:", error);
        }
      }
    };
    fetchDisclosures();
  }, [surveyId, open]);

  const handleContinue = async () => {
    if (!surveyId) return;
    try {
      await api.post("esg/api/surveys/update_status/", {
        json: {
          survey_id: surveyId,
          status: "INTERNAL_SURVEY",
        },
      });
      onClose();
      navigate(`/internal/survey-email/${surveyId}`);
    } catch (error) {
      console.error("Error:", error);
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
        {disclosures.map((disclosure) => (
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

// Add ReviewDialog component after PreviewDialog component
function ReviewDialog({
  open,
  onClose,
  questions,
  onShowPreview,
}: {
  open: boolean;
  onClose: () => void;
  questions: Question[];
  onShowPreview: () => void;
}) {
  const getQuestionsByType = (type: string) =>
    questions.filter((q) => q.question_type === type);

  const formatMCQOptions = (optionsString: string = "") => {
    return optionsString
      .split(",")
      .map(
        (option, index) =>
          `${String.fromCharCode(97 + index)}. ${option.trim()}`
      )
      .join("\n");
  };

  return (
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
      <DialogTitle sx={{ fontSize: "18px", fontWeight: 500, color: "#1F2937" }}>
        Review Questions
      </DialogTitle>
      <DialogContent>
        {["true_false", "open_ended", "mcq"].map((type) => (
          <Box key={type} sx={{ mb: 3 }}>
            <Typography sx={{ fontWeight: 500, mb: 1, color: "#1F2937" }}>
              {type === "true_false"
                ? "True/False"
                : type === "open_ended"
                ? "Open ended"
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
          onClick={onShowPreview}
          sx={{
            color: "white",
            backgroundColor: "#147C65",
            textTransform: "none",
            "&:hover": {
              backgroundColor: "#0E5A4A",
            },
          }}
        >
          Preview Survey
        </Button>
      </DialogActions>
    </Dialog>
  );
}

async function handleSurveyResponse(
  responseId: number,
  description: string = "Not applicable"
) {
  try {
    const response = await api.patch(`esg/api/survey-response/${responseId}/`, {
      json: {
        is_omitted: true,
        rejection_description: description,
        is_accepted: false,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to update survey response");
    }
  } catch (error) {
    console.error("Error updating survey response:", error);
    // Optionally add error handling UI feedback here
  }
}

export default function InternalQuestions() {
  const navigate = useNavigate();
  const { surveyId } = useParams();
  const [activeTab, setActiveTab] = useState(0);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showReviewDialog, setShowReviewDialog] = useState(false);

  const [steps] = useState([
    { id: 1, title: "Primary Information", type: "main", status: "complete" },
    { id: 2, title: "Setup External Survey", type: "main", status: "complete" },
    {
      id: 3,
      title: "Setup Internal Survey",
      type: "main",
      status: "in-progress",
    },
    { id: 4, title: "Choose Disclosures", type: "sub", status: "complete" },
    { id: 5, title: "Add Questions", type: "sub", status: "in-progress" },
    { id: 6, title: "Send Email", type: "sub", status: "pending" },
  ]);

  const getQuestionType = (tabIndex: number) => {
    switch (tabIndex) {
      case 0:
        return "true_false";
      case 1:
        return "open_ended";
      case 2:
        return "mcq";
      default:
        return "true_false";
    }
  };

  const [newQuestion, setNewQuestion] = useState<Question>({
    survey: Number(surveyId),
    text: "",
    question_type: getQuestionType(activeTab),
    options: "",
    is_internal: true,
  });

  // Add the same state variables and helper functions as above
  const [additionalQuestions, setAdditionalQuestions] = useState<Question[]>(
    []
  );

  // Add the same MCQ options handling as above
  const [mcqOptions, setMcqOptions] = useState<string[]>([""]);

  const handleAddMcqOption = () => {
    setMcqOptions([...mcqOptions, ""]);
  };

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const handleMcqOptionChange = (index: number, value: string) => {
    const newOptions = [...mcqOptions];
    newOptions[index] = value;
    setMcqOptions(newOptions);
    setNewQuestion({
      ...newQuestion,
      options: newOptions.filter((opt) => opt.trim() !== "").join(","),
    });
  };

  // Update newQuestion whenever activeTab changes
  useEffect(() => {
    setNewQuestion((prev) => ({
      ...prev,
      question_type: getQuestionType(activeTab),
      options: "", // Reset options when changing tabs
    }));
  }, [activeTab]);

  useEffect(() => {
    fetchQuestions();
  }, [surveyId]);

  const fetchQuestions = async () => {
    try {
      const response = await api.get(
        `esg/api/questions/?survey=${surveyId}&is_internal=true`
      ); // Add is_internal parameter
      const data = await response.json();
      const filteredQuestions = data.filter(
        (q) => q.survey === Number(surveyId) && q.is_internal
      );
      setQuestions(filteredQuestions);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleAddQuestion = () => {
    setNewQuestion((prev) => ({
      ...prev,
      text: "",
      options: "",
      question_type: getQuestionType(activeTab),
    }));
    setOpenDialog(true);
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
        is_internal: true,
      }));

      const promises = allQuestions.map((question) =>
        api.post("esg/api/questions/", {
          json: question,
        })
      );

      await Promise.all(promises);
      setOpenDialog(false);
      setAdditionalQuestions([]);
      fetchQuestions();
    } catch (error) {
      console.error("Error:", error);
      setSnackbarMessage("Error adding questions");
      setSnackbarOpen(true);
    }
  };

  const handleNext = () => {
    setShowReviewDialog(true);
  };

  const handleShowPreview = () => {
    setShowReviewDialog(false);
    setShowPreview(true);
  };

  const handleDeleteQuestion = async (questionId: number) => {
    try {
      const response = await api.delete(`esg/api/questions/${questionId}/`);
      if (response.ok) {
        // Refresh questions after successful deletion
        fetchQuestions();
      }
    } catch (error) {
      console.error("Error deleting question:", error);
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
        is_internal: true,
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

  // Update isValidForm
  const isValidForm = () => {
    if (activeTab === 2) {
      // MCQ
      return (
        newQuestion.text.trim() !== "" &&
        mcqOptions.filter((opt) => opt.trim() !== "").length >= 2
      );
    }
    if (activeTab === 0) {
      // True/False
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
        <Box sx={{ width: "100%", mb: 2, boxShadow: "none" }}>
          <ProgressTracker
            steps={steps}
            currentStep={5} // This now represents "Add Questions" as step 5
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
          <Typography sx={{ fontSize: "18px" }}>
            Choose Internal Questions
          </Typography>
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
              onChange={(e, v) => setActiveTab(v)}
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
              {questions.filter((q) => q.question_type === "true_false")
                .length > 0 ? (
                <Box sx={{ height: "100%", overflow: "auto" }}>
                  <QuestionList
                    questions={questions.filter(
                      (q) => q.question_type === "true_false"
                    )}
                    onDelete={handleDeleteQuestion}
                  />
                </Box>
              ) : (
                <EmptyState />
              )}
            </TabPanel>
            <TabPanel value={activeTab} index={1}>
              {questions.filter((q) => q.question_type === "open_ended")
                .length > 0 ? (
                <Box sx={{ height: "100%", overflow: "auto" }}>
                  <QuestionList
                    questions={questions.filter(
                      (q) => q.question_type === "open_ended"
                    )}
                    onDelete={handleDeleteQuestion}
                  />
                </Box>
              ) : (
                <EmptyState />
              )}
            </TabPanel>
            <TabPanel value={activeTab} index={2}>
              {questions.filter((q) => q.question_type === "mcq").length > 0 ? (
                <Box sx={{ height: "100%", overflow: "auto" }}>
                  <QuestionList
                    questions={questions.filter(
                      (q) => q.question_type === "mcq"
                    )}
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
                navigate(`/internal/disclosures-selection/${surveyId}`)
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
              onClick={handleNext}
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

        {/* Dialog for adding questions */}
        <Dialog
          open={openDialog}
          onClose={() => {
            setOpenDialog(false);
            setAdditionalQuestions([]);
            setMcqOptions([""]); // Reset MCQ options
          }}
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
            Add {["True/False", "Open ended", "MCQ"][activeTab]} Question
          </DialogTitle>
          <DialogContent sx={{ p: 2 }}>
            {[newQuestion].concat(additionalQuestions).map((q, index) => (
              <Box key={index}>
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
            {activeTab === 0 && (
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
            {activeTab === 2 && (
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
              onClick={() => {
                setOpenDialog(false);
                setAdditionalQuestions([]);
              }}
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

        <ReviewDialog
          open={showReviewDialog}
          onClose={() => setShowReviewDialog(false)}
          questions={questions}
          onShowPreview={handleShowPreview}
        />

        <PreviewDialog
          open={showPreview}
          onClose={() => setShowPreview(false)}
          surveyId={surveyId}
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
