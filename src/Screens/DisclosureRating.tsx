import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Typography,
  Button,
  CssBaseline,
  ThemeProvider,
  Paper,
  Stack,
  CircularProgress,
  Alert,
  Snackbar,
  Tooltip,
  IconButton,
  TextField,
  Divider,
} from "@mui/material";
import { api } from "./common";
import { theme } from "../lib/theme";
import SidebarHeader from "../Components/SidebarHeader";
import EcopsLogo from "../assets/EcopLogo.png";
import { InfoOutlined } from "@mui/icons-material";
import { useParams } from "react-router-dom";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import { Check as CheckIcon } from "@mui/icons-material";
import instructiongraph from "../assets/instructiongraph.png";
import PopIcon from "../assets/pop.png";

interface RatingState {
  [key: string]: number; // Removed string type since we no longer need stakeholder_type
}

interface SDGTarget {
  id: number;
  target: string;
  goal: number;
}

interface IndicatorSource {
  id: number;
  name: string;
  description: string;
  information: string | null;
  website_url: string | null;
}

interface DisclosureTheme {
  id: number;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

interface SubTopic {
  id: number;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

interface Response {
  id: number;
  is_omitted: boolean;
  is_accepted: boolean;
  optional_reason: string;
  surevey_disclosure: number;
  acceptance_reason: number;
  omission_reason: null;
  response_from: number;
}

interface Disclosure {
  disclosure_id: string;
  survey_disclosure_mapping_id: number; // Add this field
  disclosure_description: string;
  dimension: string;
  year: number;
  sdg_targets: SDGTarget[];
  indicator_source: IndicatorSource;
  disclosure_theme: DisclosureTheme;
  sub_topic: SubTopic;
  response: Response[];
  survey_disclosure: number;
  id: number;
  disclosure_type: string; // Add this field for disclosure type
}

interface DisclosureResponse {
  disclosures: Disclosure[];
}

interface Survey {
  id: number;
  uuid: string; // Add UUID field
  name: string;
  start_date: string;
  end_date: string;
  status: string;
  organisation: number;
  site: number;
  created_by: number;
}

interface UserGroup {
  id: number;
  groups_name: string[];
  roles: string[];
  added_at: string;
  user: number;
  groups: number[];
}

// Update the UserGroupResponse interface to include organisation_user
interface UserGroupResponse {
  user: string;
  groups: UserGroup[];
  organisation_user: {
    id: number;
    username: string;
    organisation: number;
    // ... other fields
  };
}

interface Question {
  id: number;
  text: string;
  question_type: "true_false" | "open_ended" | "mcq";
  options?: string;
  survey: number;
}

interface AnswerState {
  [key: string]: string;
}

interface QuestionResponse {
  question: number;
  true_false_response?: boolean;
  mcq_response?: string;
  text_response?: string;
}

interface SurveyCompletion {
  id: number;
  survey: number;
  user: number;
  is_submitted: boolean;
  is_started: boolean;
  is_completed: boolean;
  is_reviewed: boolean;
  is_external: boolean;
  is_internal: boolean;
}

interface AuthUser {
  pk: number;
  username: string;
}

interface AuthData {
  access: string;
  refresh: string;
  user: AuthUser;
}

const RatingBox = ({
  value,
  isSelected,
  onClick,
  disabled,
}: {
  value: number;
  isSelected: boolean;
  onClick: () => void;
  disabled?: boolean;
}) => {
  const getBackgroundColor = (value: number, isSelected: boolean) => {
    if (isSelected) {
      return "#4CAF50"; // Green color when selected
    }
    // Unselected colors - lighter shades
    const colors = ["#90CAF9", "#64B5F6", "#42A5F5", "#2196F3", "#1E88E5"];
    return colors[value - 1];
  };

  return (
    <Box
      onClick={disabled ? undefined : onClick}
      sx={{
        width: 30,
        height: 30,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        cursor: disabled ? "not-allowed" : "pointer",
        backgroundColor: getBackgroundColor(value, isSelected),
        color: "white",
        borderRadius: "4px",
        transition: "all 0.2s",
        opacity: disabled ? 0.5 : 1,
        fontWeight: isSelected ? "bold" : "normal",
        boxShadow: isSelected ? "0 2px 4px rgba(0,0,0,0.2)" : "none",
        "&:hover": {
          opacity: disabled ? 0.5 : 0.9,
          transform: disabled ? "none" : "scale(1.05)",
        },
      }}
    >
      {value}
    </Box>
  );
};

const QuestionBox = ({
  number,
  question,
  ratings,
  handleRatingChange,
  questionId,
  isLoading,
  disclosureDescription,
  disclosureType, // Add this parameter
}: {
  number: number;
  question: string;
  ratings: RatingState;
  handleRatingChange: (
    questionId: string,
    type: "likelihood" | "severity" | "rating",
    value: number
  ) => void;
  questionId: string;
  isLoading: boolean;
  disclosureDescription: string;
  disclosureType: string; // Add this parameter
}) => (
  <Box sx={{ mb: 2, display: "flex", alignItems: "flex-start" }}>
    <Typography
      sx={{
        mr: 2,
        fontSize: "14px",
        borderRadius: "5px",
        border: "1px solid rgb(232, 232, 232)",
        fontWeight: 500,
        p: 2,
        backgroundColor: "white",
        width: "24px",
        height: "24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {number}.
    </Typography>
    <Paper
      elevation={2}
      sx={{
        p: 2,
        borderRadius: 2,
        flex: 1,
        border: "1px solid rgb(232, 232, 232)",
        boxShadow: "none",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "start", mb: 2 }}>
        <Typography sx={{ fontSize: "14px", mr: 1 }}>{question}</Typography>
        <Tooltip title={disclosureDescription} placement="right" arrow>
          <Box
            component="img"
            src={PopIcon}
            sx={{ width: 15, height: 15, cursor: "help" }}
          />
        </Tooltip>
      </Box>

      <Stack spacing={1}>
        {disclosureType === "FINANCIAL" || disclosureType === "financial" ? (
          // For financial disclosures, show a single Rating scale
          <Box>
            <Typography
              sx={{
                mb: 1,
                fontSize: "12px",
                fontWeight: 500,
                display: "flex",
                alignItems: "center",
              }}
            >
              Rating:
              <Tooltip
                title="Rate the significance of this disclosure to your organization's financial performance and value creation"
                placement="right"
                arrow
              >
                <Box
                  component="img"
                  src={PopIcon}
                  sx={{ width: 15, height: 15, cursor: "help" }}
                />
              </Tooltip>
            </Typography>
            <Stack direction="row" spacing={1}>
              {[1, 2, 3, 4, 5].map((value) => (
                <RatingBox
                  key={value}
                  value={value}
                  isSelected={ratings[`${questionId}_rating`] === value}
                  onClick={() =>
                    handleRatingChange(questionId, "rating", value)
                  }
                  disabled={isLoading}
                />
              ))}
            </Stack>
          </Box>
        ) : (
          // For non-financial disclosures, show Likelihood and Severity
          <>
            <Box>
              <Typography
                sx={{
                  mb: 1,
                  fontSize: "12px",
                  fontWeight: 500,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                Likelihood:
                <Tooltip
                  title="Rate how likely this disclosure's topic could impact stakeholders or the environment (1=very low, 5=very high)"
                  placement="right"
                  arrow
                >
                  <Box
                    component="img"
                    src={PopIcon}
                    sx={{ width: 15, height: 15, cursor: "help" }}
                  />
                </Tooltip>
              </Typography>
              <Stack direction="row" spacing={1}>
                {[1, 2, 3, 4, 5].map((value) => (
                  <RatingBox
                    key={value}
                    value={value}
                    isSelected={ratings[`${questionId}_likelihood`] === value}
                    onClick={() =>
                      handleRatingChange(questionId, "likelihood", value)
                    }
                    disabled={isLoading}
                  />
                ))}
              </Stack>
            </Box>

            <Box>
              <Typography
                sx={{
                  mb: 1,
                  fontSize: "12px",
                  fontWeight: 500,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                Severity
                <Tooltip
                  title="Rate how severe the potential impact could be (1=minimal impact, 5=critical impact)"
                  placement="right"
                  arrow
                >
                  <Box
                    component="img"
                    src={PopIcon}
                    sx={{ width: 15, height: 15, cursor: "help" }}
                  />
                </Tooltip>
              </Typography>
              <Stack direction="row" spacing={1}>
                {[1, 2, 3, 4, 5].map((value) => (
                  <RatingBox
                    key={value}
                    value={value}
                    isSelected={ratings[`${questionId}_severity`] === value}
                    onClick={() =>
                      handleRatingChange(questionId, "severity", value)
                    }
                    disabled={isLoading}
                  />
                ))}
              </Stack>
            </Box>
          </>
        )}
      </Stack>
    </Paper>
  </Box>
);

// Update the ProgressTracker component's styles
const ProgressTracker = ({
  disclosures,
  ratings,
}: {
  disclosures: Disclosure[];
  ratings: RatingState;
}) => {
  const getQuestionStatus = (disclosure: Disclosure) => {
    const questionId = disclosure.disclosure_id;
    if (
      disclosure.disclosure_type === "FINANCIAL" ||
      disclosure.disclosure_type === "financial"
    ) {
      return !!ratings[`${questionId}_rating`] ? "complete" : "incomplete";
    } else {
      const hasLikelihood = !!ratings[`${questionId}_likelihood`];
      const hasSeverity = !!ratings[`${questionId}_severity`];

      if (hasLikelihood && hasSeverity) return "complete";
      if (hasLikelihood || hasSeverity) return "partial";
      return "incomplete";
    }
  };

  return (
    <Paper
      sx={{
        position: "fixed",
        right: 20,
        top: "50%",
        transform: "translateY(-50%)",
        width: "200px",
        maxHeight: "80vh",
        overflowY: "auto",
        p: 2,
        backgroundColor: "white",
        borderRadius: 2,
        boxShadow: "0 0 10px rgba(0,0,0,0.1)",
        zIndex: 1000,
      }}
    >
      <Typography
        variant="h6"
        sx={{ mb: 2, fontSize: "14px", fontWeight: "bold" }}
      >
        Progress Tracker
      </Typography>
      <Stack spacing={1}>
        {disclosures.map((disclosure, index) => {
          const status = getQuestionStatus(disclosure);
          return (
            <Box
              key={disclosure.disclosure_id}
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 0.5,
                p: 1,
                borderRadius: 1,
                backgroundColor:
                  status === "complete"
                    ? "rgba(76, 175, 80, 0.1)"
                    : "transparent",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                {status === "complete" ? (
                  <CheckCircleIcon
                    sx={{ color: "success.main", fontSize: 16 }}
                  />
                ) : (
                  <RadioButtonUncheckedIcon
                    sx={{ color: "text.secondary", fontSize: 16 }}
                  />
                )}
                <Typography sx={{ fontSize: "12px" }}>
                  Question {index + 1}
                </Typography>
              </Box>

              {disclosure.disclosure_type === "FINANCIAL" ||
              disclosure.disclosure_type === "financial" ? (
                <Box sx={{ pl: 4, display: "flex", gap: 1 }}>
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      backgroundColor: ratings[
                        `${disclosure.disclosure_id}_rating`
                      ]
                        ? "#4CAF50" // Green for completed
                        : "#FFC107", // Yellow for incomplete
                    }}
                  />
                  <Typography
                    sx={{ fontSize: "10px", color: "text.secondary" }}
                  >
                    Rating
                  </Typography>
                </Box>
              ) : (
                <>
                  <Box sx={{ pl: 4, display: "flex", gap: 1 }}>
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        backgroundColor: ratings[
                          `${disclosure.disclosure_id}_likelihood`
                        ]
                          ? "#4CAF50" // Green for completed
                          : "#FFC107", // Yellow for incomplete
                      }}
                    />
                    <Typography
                      sx={{ fontSize: "10px", color: "text.secondary" }}
                    >
                      Likelihood
                    </Typography>
                  </Box>

                  <Box sx={{ pl: 4, display: "flex", gap: 1 }}>
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        backgroundColor: ratings[
                          `${disclosure.disclosure_id}_severity`
                        ]
                          ? "#4CAF50" // Green for completed
                          : "#FFC107", // Yellow for incomplete
                      }}
                    />
                    <Typography
                      sx={{ fontSize: "10px", color: "text.secondary" }}
                    >
                      Severity
                    </Typography>
                  </Box>
                </>
              )}
            </Box>
          );
        })}
      </Stack>
      <Box sx={{ mt: 2, pt: 2, borderTop: "1px solid #eee" }}>
        <Typography sx={{ fontSize: "12px", color: "text.secondary" }}>
          Completed:{" "}
          {
            disclosures.filter((d) => getQuestionStatus(d) === "complete")
              .length
          }
          /{disclosures.length}
        </Typography>
      </Box>
    </Paper>
  );
};

// Update the SubmissionBanner component
const SubmissionBanner = () => (
  <Box
    sx={{
      position: "fixed",
      top: "64px", // Leave space for header
      left: "240px", // Leave space for sidebar
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(255, 255, 255, 0.95)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000, // Lower z-index to not overlap header
    }}
  >
    <Box
      sx={{
        backgroundColor: "#4CAF50",
        borderRadius: "50%",
        width: 80,
        height: 80,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        mb: 3,
      }}
    >
      <CheckIcon sx={{ fontSize: 40, color: "white" }} />
    </Box>
    <Typography
      variant="h5"
      sx={{ mb: 2, color: "#2E7D32", fontWeight: "bold" }}
    >
      Survey Submitted Successfully
    </Typography>
    <Typography sx={{ color: "#555", textAlign: "center", maxWidth: 400 }}>
      Thank you for completing the survey. Your responses have been recorded.
      You can no longer modify the ratings.
    </Typography>
  </Box>
);

// Add interface for survey customization
interface SurveyCustomization {
  id: number;
  survey: number;
  logo: string;
  logo_url: string;
  instructions: string;
  created_at: string;
  updated_at: string;
}

// Add this validation function near the top of your file
const isValidUrl = (url: string) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export default function DisclosureRating() {
  const { surveyUuid } = useParams(); // Change from surveyId to surveyUuid
  const [surveyId, setSurveyId] = useState<number | null>(null);
  const [ratings, setRatings] = useState<RatingState>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [disclosures, setDisclosures] = useState({});
  const [loading, setLoading] = useState(true);
  const [disclosureData, setDisclosureData] = useState<Disclosure[]>([]);
  const [errorSnackbar, setErrorSnackbar] = useState<string | null>(null);
  const [userGroups, setUserGroups] = useState<UserGroup[]>([]);
  const [isAuthorized, setIsAuthorized] = useState<boolean>(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<AnswerState>({});
  const [surveyStage, setSurveyStage] = useState<string>("");
  const [surveyCompletion, setSurveyCompletion] =
    useState<SurveyCompletion | null>(null);
  const [surveyStatus, setSurveyStatus] = useState<string>("");
  const [customizations, setCustomizations] = useState<SurveyCustomization[]>(
    []
  );
  const [currentCustomization, setCurrentCustomization] =
    useState<SurveyCustomization | null>(null);

  // Add a ref to track initialization
  const initialFetchCompleted = useRef(false);

  const checkUserAuthorization = (groups: UserGroup[]) => {
    if (!groups.length) return false;

    const userGroupNames = groups[0].groups_name;
    const isInternal = userGroupNames.includes("INTERNAL");
    const isExternal = userGroupNames.includes("EXTERNAL");

    // Set survey stage based on user group
    if (isInternal) {
      setSurveyStage("INTERNAL");
    } else if (isExternal) {
      setSurveyStage("EXTERNAL");
    }

    // User is authorized if they belong to either INTERNAL or EXTERNAL group
    return isInternal || isExternal;
  };

  // Consolidated user groups fetching - runs only once on component mount
  useEffect(() => {
    const fetchUserGroups = async () => {
      if (!initialFetchCompleted.current) {
        try {
          const response = await api
            .get("users/get-user-groups")
            .json<UserGroupResponse>();
          setUserGroups(response.groups);
          setIsAuthorized(checkUserAuthorization(response.groups));
        } catch (error) {
          console.error("Error fetching user groups:", error);
          setError("Error checking user permissions");
        }
      }
    };

    fetchUserGroups();
  }, []); // Empty dependency array - only runs once

  const isAllQuestionsAnswered = () => {
    // Check all disclosure ratings
    const allDisclosuresAnswered = disclosureData.every((disclosure) => {
      if (
        disclosure.disclosure_type === "FINANCIAL" ||
        disclosure.disclosure_type === "financial"
      ) {
        return !!ratings[`${disclosure.disclosure_id}_rating`];
      }
      return (
        ratings[`${disclosure.disclosure_id}_likelihood`] &&
        ratings[`${disclosure.disclosure_id}_severity`]
      );
    });

    // Check all survey questions
    const allQuestionsAnswered = questions.every((question) => {
      const answer = answers[question.id];
      return answer !== undefined && answer !== "";
    });

    return allDisclosuresAnswered && allQuestionsAnswered;
  };

  useEffect(() => {
    console.log("surveyUuid:", surveyUuid);
    console.log("surveyId:", surveyId);
  }, [surveyUuid, surveyId]);

  // Consolidated survey and related data fetch
  useEffect(() => {
    const fetchSurveyAndRelatedData = async () => {
      if (!surveyUuid || initialFetchCompleted.current) {
        return;
      }

      try {
        setLoading(true);

        // Fetch all surveys
        const surveysResponse = await api
          .get("esg/api/surveys/get_surveys/")
          .json();

        // Find matching survey by UUID
        const matchingSurvey = surveysResponse.find(
          (survey: Survey) => survey.uuid === surveyUuid
        );

        if (!matchingSurvey) {
          setError("Survey not found");
          return;
        }

        // Set the numeric ID and fetch disclosures
        setSurveyId(matchingSurvey.id);
        setSurveyStatus(matchingSurvey.status);

        // Make parallel API calls for better performance
        const [
          customizationsResponse,
          disclosuresResponse,
          completionResponse,
        ] = await Promise.all([
          // Fetch customizations
          api.get("esg/api/customize-survey/"),

          // Fetch disclosures
          api.get(
            `esg/api/get-disclosures-from-survey/?survey_id=${matchingSurvey.id}`
          ),

          // Fetch survey completion in parallel if possible
          api.get(`esg/api/survey-completion/?survey_id=${matchingSurvey.id}`),
        ]);

        // Process customizations
        const customizationsData = await customizationsResponse.json();
        console.log("Customizations data:", customizationsData);

        // Find matching customization for this survey
        const matchingCustomization = customizationsData.find(
          (customization: SurveyCustomization) =>
            customization.survey === matchingSurvey.id
        );

        if (matchingCustomization) {
          setCurrentCustomization(matchingCustomization);
          console.log("Setting customization:", matchingCustomization);
        }

        // Process disclosures
        const disclosuresData = await disclosuresResponse.json();
        setDisclosureData(disclosuresData.disclosures);

        // Process survey completion
        const completionData = await completionResponse.json();
        console.log("Survey completion data:", completionData);

        if (Array.isArray(completionData) && completionData.length > 0) {
          setSurveyCompletion(completionData[0]);
        } else if (completionData) {
          setSurveyCompletion(completionData);
        } else {
          // If no completion record exists, create one
          const isUserExternal =
            userGroups[0]?.groups_name.includes("EXTERNAL");
          const isUserInternal =
            userGroups[0]?.groups_name.includes("INTERNAL");

          const initialCompletion = {
            survey: matchingSurvey.id,
            is_submitted: false,
            is_started: false,
            is_completed: false,
            is_reviewed: false,
            is_external: isUserExternal,
            is_internal: isUserInternal,
          };
          setSurveyCompletion(initialCompletion);
        }

        // Now that we have survey ID, fetch questions
        if (userGroups.length > 0) {
          const isExternal = userGroups[0].groups_name.includes("EXTERNAL");
          const isInternal = userGroups[0].groups_name.includes("INTERNAL");

          const queryParam = isExternal
            ? "is_external=true"
            : isInternal
            ? "is_internal=true"
            : "";

          const questionsResponse = await api.get(
            `esg/api/questions/?survey=${matchingSurvey.id}&${queryParam}`
          );
          const questionsData = await questionsResponse.json();
          setQuestions(questionsData);
        }

        initialFetchCompleted.current = true;
      } catch (error) {
        console.error("Error in fetchSurveyAndRelatedData:", error);
        setError("Failed to load survey data");
      } finally {
        setLoading(false);
      }
    };

    fetchSurveyAndRelatedData();

    // Load submission count from localStorage
    if (surveyId) {
      const savedCount = localStorage.getItem(`survey_${surveyId}_submissions`);
      if (savedCount) {
        setSubmissionCount(parseInt(savedCount));
      }
    }
  }, [surveyUuid, userGroups]); // Only depends on surveyUuid and userGroups

  const handleRatingChange = (
    questionId: string,
    type: "likelihood" | "severity" | "rating",
    value: number
  ) => {
    setRatings((prev) => {
      const key = `${questionId}_${type}`;
      // If clicking the same value, unselect it
      if (prev[key] === value) {
        const newRatings = { ...prev };
        delete newRatings[key];
        return newRatings;
      }
      // Otherwise select the new value
      return { ...prev, [key]: value };
    });
  };

  const handleAnswerChange = (questionId: number, value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const clearAllRatings = () => {
    setRatings({});
  };

  const handleSubmitSurvey = async () => {
    try {
      const authData = JSON.parse(
        localStorage.getItem("auth") || "{}"
      ) as AuthData;
      const userId = authData.user?.pk;

      if (!userId) {
        throw new Error("User not found");
      }

      // Check user group type
      const isUserExternal = userGroups[0]?.groups_name.includes("EXTERNAL");
      const isUserInternal = userGroups[0]?.groups_name.includes("INTERNAL");

      setIsLoading(true);
      setError(null);

      // Determine stakeholder_type based on user groups
      let stakeholderType = "";
      if (userGroups && userGroups.length > 0) {
        const userGroupNames = userGroups[0].groups_name;
        if (userGroupNames.includes("INTERNAL")) {
          stakeholderType = "internal";
        } else if (userGroupNames.includes("EXTERNAL")) {
          stakeholderType = "external";
        }
      }

      if (!stakeholderType) {
        throw new Error(
          "Could not determine stakeholder type from user groups"
        );
      }

      // Submit materiality ratings for questions that have been answered
      for (const disclosure of disclosureData) {
        let payload;

        if (
          disclosure.disclosure_type === "FINANCIAL" ||
          disclosure.disclosure_type === "financial"
        ) {
          const rating = ratings[`${disclosure.disclosure_id}_rating`];

          // Only submit if rating has been provided
          if (rating) {
            payload = {
              survey_disclosure_id: disclosure.survey_disclosure_mapping_id,
              rating: rating,
              optional_reason: "Submitted through survey",
              stakeholder_type: stakeholderType,
            };
          }
        } else {
          const likelihood = ratings[`${disclosure.disclosure_id}_likelihood`];
          const severity = ratings[`${disclosure.disclosure_id}_severity`];

          // Only submit if either likelihood or severity has been rated
          if (likelihood || severity) {
            payload = {
              survey_disclosure_id: disclosure.survey_disclosure_mapping_id,
              likelihood: likelihood || 0, // Default to 0 if not rated
              severity: severity || 0, // Default to 0 if not rated
              optional_reason: "Submitted through survey",
              stakeholder_type: stakeholderType,
            };
          }
        }

        if (payload) {
          try {
            const response = await api.post("esg/api/survey-materiality/", {
              json: payload,
              headers: {
                "Content-Type": "application/json",
              },
            });

            const responseData = await response.json();
            console.log(
              "API Response for disclosure:",
              disclosure.disclosure_id,
              responseData
            );
          } catch (apiError: any) {
            console.error(
              "API Error for disclosure:",
              disclosure.disclosure_id,
              apiError
            );
            console.error(
              "API Error Response:",
              await apiError.response?.json()
            );
            throw apiError;
          }
        }
      }

      // Submit only answered questions
      for (const question of questions) {
        const answer = answers[question.id];
        if (!answer) continue; // Skip unanswered questions

        let payload: QuestionResponse = {
          question: question.id,
        };

        // Set the appropriate response field based on question type
        switch (question.question_type) {
          case "true_false":
            payload.true_false_response = answer.toLowerCase() === "true";
            break;
          case "mcq":
            payload.mcq_response = answer;
            break;
          case "open_ended":
            payload.text_response = answer;
            break;
        }

        try {
          await api.post("esg/api/user-responses/", {
            json: payload,
            headers: {
              "Content-Type": "application/json",
            },
          });
        } catch (apiError: any) {
          console.error("Error submitting question response:", apiError);
          throw apiError;
        }
      }

      // Create survey completion with correct flags based on user group
      const completionPayload = {
        survey: surveyId,
        user: userId,
        is_completed: true,
        is_submitted: true,
        is_internal: isUserInternal,
        is_external: isUserExternal,
        is_started: true,
        is_reviewed: false,
      };

      const completionResponse = await api.post("esg/api/survey-completion/", {
        json: completionPayload,
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!completionResponse.ok) {
        throw new Error("Failed to update survey completion status");
      }

      const updatedCompletion = await completionResponse.json();
      setSurveyCompletion(updatedCompletion);
      setSuccessMessage(
        `Survey submitted successfully as ${
          isUserExternal ? "external" : "internal"
        } user`
      );
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to submit survey";
      setErrorSnackbar(errorMessage);
      console.error("Error submitting survey:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const isSubmitted = () => {
    if (!surveyCompletion || !userGroups.length) return false;

    const isUserExternal = userGroups[0].groups_name.includes("EXTERNAL");
    const isUserInternal = userGroups[0].groups_name.includes("INTERNAL");

    console.log("Checking submission status:", {
      isUserExternal,
      isUserInternal,
      surveyCompletion,
    });

    // For external users
    if (isUserExternal) {
      return surveyCompletion.is_external && surveyCompletion.is_completed;
    }

    // For internal users
    if (isUserInternal) {
      return surveyCompletion.is_internal && surveyCompletion.is_completed;
    }

    return false;
  };

  // Add this effect to fetch questions based on user type
  useEffect(() => {
    const fetchQuestions = async () => {
      if (!surveyId || !userGroups.length) return;

      try {
        const isExternal = userGroups[0].groups_name.includes("EXTERNAL");
        const isInternal = userGroups[0].groups_name.includes("INTERNAL");

        const queryParam = isExternal
          ? "is_external=true"
          : isInternal
          ? "is_internal=true"
          : "";
        const response = await api.get(
          `esg/api/questions/?survey=${surveyId}&${queryParam}`
        );
        const data = await response.json();
        setQuestions(data);
      } catch (error) {
        console.error("Error fetching questions:", error);
        setError("Failed to load additional questions");
      }
    };

    fetchQuestions();
  }, [surveyId, userGroups]);

  // Add effect to fetch survey customization
  useEffect(() => {
    const fetchSurveyCustomization = async () => {
      if (!surveyId) return;

      try {
        const response = await api.get(`esg/api/customize-survey/`);
        const data = await response.json();
        if (Array.isArray(data) && data.length > 0) {
          setCustomization(data[0]);
        } else if (data.id) {
          setCustomization(data);
        }
      } catch (error) {
        console.error("Error fetching survey customization:", error);
      }
    };

    fetchSurveyCustomization();
  }, [surveyId]);

  // Move renderQuestion function definition here, before any conditional returns
  const renderQuestion = (question: Question, qIndex: number) => {
    return (
      <Box key={question.id} sx={{ mb: qIndex < questions.length - 1 ? 4 : 0 }}>
        <Typography
          sx={{
            fontSize: "14px",
            fontWeight: 500,
            mb: 2,
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <Box
            component="span"
            sx={{
              bgcolor: "#F3F4F6",
              px: 1,
              py: 0.5,
              borderRadius: 1,
              fontSize: "12px",
              color: "#6B7280",
            }}
          >
            Question {qIndex + 1}
          </Box>
          {question.text}
        </Typography>

        {question.question_type === "true_false" && (
          <Stack direction="row" spacing={2}>
            {["True", "False"].map((option) => (
              <Button
                key={option}
                variant={
                  answers[question.id] === option ? "contained" : "outlined"
                }
                onClick={() => handleAnswerChange(question.id, option)}
                sx={{
                  minWidth: "100px",
                  color: answers[question.id] === option ? "white" : "#147C65",
                  bgcolor:
                    answers[question.id] === option ? "#147C65" : "transparent",
                  borderColor: "#147C65",
                  "&:hover": {
                    bgcolor:
                      answers[question.id] === option
                        ? "#0E5A4A"
                        : "rgba(20, 124, 101, 0.1)",
                  },
                }}
              >
                {option}
              </Button>
            ))}
          </Stack>
        )}

        {question.question_type === "mcq" && question.options && (
          <Stack spacing={1}>
            {question.options.split(",").map((option, optIndex) => (
              <Button
                key={optIndex}
                variant={
                  answers[question.id] === option.trim()
                    ? "contained"
                    : "outlined"
                }
                onClick={() => handleAnswerChange(question.id, option.trim())}
                sx={{
                  justifyContent: "flex-start",
                  textAlign: "left",
                  padding: "10px 15px",
                  color:
                    answers[question.id] === option.trim()
                      ? "white"
                      : "#147C65",
                  bgcolor:
                    answers[question.id] === option.trim()
                      ? "#147C65"
                      : "transparent",
                  borderColor: "#147C65",
                  "&:hover": {
                    bgcolor:
                      answers[question.id] === option.trim()
                        ? "#0E5A4A"
                        : "rgba(20, 124, 101, 0.1)",
                  },
                }}
              >
                {option.trim()}
              </Button>
            ))}
          </Stack>
        )}

        {question.question_type === "open_ended" && (
          <TextField
            fullWidth
            multiline
            rows={3}
            value={answers[question.id] || ""}
            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
            placeholder="Enter your answer here..."
            sx={{
              "& .MuiOutlinedInput-root": {
                fontSize: "14px",
                backgroundColor: "white",
              },
            }}
          />
        )}
      </Box>
    );
  };

  if (loading) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <SidebarHeader>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "calc(100vh - 64px)", // Subtract header height
              width: "100%",
              gap: 2,
            }}
          >
            <CircularProgress
              size={40}
              sx={{
                color: "rgb(54, 115, 97)",
              }}
            />
            <Typography
              variant="body1"
              sx={{
                color: "text.secondary",
                fontSize: "14px",
              }}
            >
              Loading survey data...
            </Typography>
          </Box>
        </SidebarHeader>
      </ThemeProvider>
    );
  }

  if (error) {
    return <div className="text-red-500 p-4">{error}</div>;
  }

  if (!isAuthorized) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <SidebarHeader>
          <Paper
            sx={{ flex: 1, p: 3, borderRadius: 2, backgroundColor: "#F8FAFC" }}
          >
            <Alert severity="error">
              You are not authorized to answer this survey at this stage.
            </Alert>
          </Paper>
        </SidebarHeader>
      </ThemeProvider>
    );
  }

  if (isSubmitted()) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <SidebarHeader>
          <Paper
            sx={{
              flex: 1,
              borderRadius: 2,
              backgroundColor: "#F8FAFC",
              position: "relative",
            }}
          >
            <SubmissionBanner />
          </Paper>
        </SidebarHeader>
      </ThemeProvider>
    );
  }

  // Main return
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SidebarHeader>
        <Paper
          sx={{
            flex: 1,
            p: 3,
            borderRadius: 2,
            backgroundColor: "#F8FAFC",
            mr: "220px", // Add margin to prevent overlap with ProgressTracker
            "@media (max-width: 1200px)": {
              mr: 0, // Remove margin on smaller screens
            },
          }}
        >
          <Box sx={{ mb: 4 }}>
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              gap={3}
            >
              {/* Logo section */}
              {currentCustomization?.logo_url &&
              isValidUrl(currentCustomization.logo_url) ? (
                <img
                  src={currentCustomization.logo_url}
                  alt="Survey Logo"
                  style={{
                    width: "30%",
                    height: "auto",
                    maxHeight: "150px",
                    objectFit: "contain",
                  }}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    console.error("Failed to load image from:", target.src);
                    target.onerror = null;
                    target.src = EcopsLogo;
                  }}
                  crossOrigin="anonymous"
                />
              ) : (
                <img
                  src={EcopsLogo}
                  alt="Default Logo"
                  style={{
                    width: "30%",
                    height: "auto",
                    maxHeight: "150px",
                    objectFit: "contain",
                  }}
                />
              )}

              {/* Title */}
              <Typography
                variant="h4"
                sx={{
                  color: "rgb(54, 115, 97)",
                  fontSize: "15px",
                  fontWeight: 500,
                  backgroundColor: "white",
                  padding: "10px 20px",
                  borderRadius: "4px",
                  textAlign: "center",
                  width: "100%", // Add full width
                  boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.1)", // Optional: adds subtle shadow
                }}
              >
                Materiality Assessment Survey
              </Typography>

              {/* Instruction graph */}
              <img
                src={instructiongraph}
                alt="Instruction Graph"
                style={{
                  width: "60%",
                  height: "auto",
                  maxHeight: "300px",
                  objectFit: "contain",
                }}
              />
            </Box>

            {/* Instructions section */}
            <Box mb={4} sx={{ width: "100%" }}>
              {" "}
              {/* Add full width to container */}
              <Typography
                sx={{
                  color: "rgb(54, 115, 97)",
                  fontSize: "15px",
                  fontWeight: 500,
                  backgroundColor: "white",
                  padding: "10px 20px",
                  borderRadius: "4px",
                  textAlign: "center",
                  mt: 2,
                  width: "100%", // Add full width
                  boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.1)", // Optional: adds subtle shadow
                }}
              >
                {currentCustomization?.instructions ||
                  "Please rate each disclosure on scale of 1 to 5 considering how important it is to you as a stakeholder. You can also leave comments against each of the disclosure."}
              </Typography>
            </Box>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <Snackbar
              open={!!successMessage}
              autoHideDuration={3000}
              onClose={() => setSuccessMessage(null)}
              message={successMessage}
            />

            <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
              <Button
                variant="outlined"
                onClick={clearAllRatings}
                disabled={isLoading || Object.keys(ratings).length === 0}
                sx={{
                  fontSize: "12px",
                  color: "rgb(54, 115, 97)",
                  borderColor: "rgb(54, 115, 97)",
                  "&:hover": {
                    borderColor: "rgb(44, 95, 77)",
                    backgroundColor: "rgba(54, 115, 97, 0.04)",
                  },
                }}
              >
                Clear All Ratings
              </Button>
            </Box>

            {/* Ratings Section */}
            <Box sx={{ mb: 6 }}>
              {/* Impact Materiality Section */}
              {disclosureData.some(
                (d) =>
                  d.disclosure_type !== "FINANCIAL" &&
                  d.disclosure_type !== "financial"
              ) && (
                <Box sx={{ mb: 4 }}>
                  <Typography
                    variant="h6"
                    sx={{
                      mb: 3,
                      color: "rgb(54, 115, 97)",
                      fontWeight: 600,
                      fontSize: "18px",
                      pb: 1,
                      borderBottom: "2px solid rgb(54, 115, 97)",
                    }}
                  >
                    Impact Materiality
                  </Typography>
                  {disclosureData
                    .filter(
                      (disclosure) =>
                        disclosure.disclosure_type !== "FINANCIAL" &&
                        disclosure.disclosure_type !== "financial"
                    )
                    .map((disclosure, index) => (
                      <Box key={disclosure.disclosure_id} sx={{ mb: 3 }}>
                        <Typography
                          sx={{ mb: 1, fontSize: "12px", color: "gray" }}
                        >
                          {disclosure.disclosure_id} | {disclosure.dimension} |{" "}
                          {disclosure.disclosure_theme.name}
                          {disclosure.disclosure_type === "FINANCIAL"
                            ? " | Financial"
                            : " | Impact"}
                        </Typography>
                        <QuestionBox
                          number={index + 1}
                          question={disclosure.sub_topic.name}
                          ratings={ratings}
                          handleRatingChange={handleRatingChange}
                          questionId={disclosure.disclosure_id}
                          isLoading={isLoading}
                          disclosureDescription={
                            disclosure.disclosure_description
                          }
                          disclosureType={disclosure.disclosure_type || ""}
                        />
                      </Box>
                    ))}
                </Box>
              )}

              {/* Financial Materiality Section */}
              {disclosureData.some(
                (d) =>
                  d.disclosure_type === "FINANCIAL" ||
                  d.disclosure_type === "financial"
              ) && (
                <Box sx={{ mb: 4 }}>
                  <Typography
                    variant="h6"
                    sx={{
                      mb: 3,
                      color: "rgb(54, 115, 97)",
                      fontWeight: 600,
                      fontSize: "18px",
                      pb: 1,
                      borderBottom: "2px solid rgb(54, 115, 97)",
                    }}
                  >
                    Financial Materiality
                  </Typography>
                  {disclosureData
                    .filter(
                      (disclosure) =>
                        disclosure.disclosure_type === "FINANCIAL" ||
                        disclosure.disclosure_type === "financial"
                    )
                    .map((disclosure, index) => (
                      <Box key={disclosure.disclosure_id} sx={{ mb: 3 }}>
                        <Typography
                          sx={{ mb: 1, fontSize: "12px", color: "gray" }}
                        >
                          {disclosure.disclosure_id} | {disclosure.dimension} |{" "}
                          {disclosure.disclosure_theme.name}
                          {disclosure.disclosure_type === "FINANCIAL"
                            ? " | Financial"
                            : " | Impact"}
                        </Typography>
                        <QuestionBox
                          number={index + 1}
                          question={disclosure.sub_topic.name}
                          ratings={ratings}
                          handleRatingChange={handleRatingChange}
                          questionId={disclosure.disclosure_id}
                          isLoading={isLoading}
                          disclosureDescription={
                            disclosure.disclosure_description
                          }
                          disclosureType={disclosure.disclosure_type || ""}
                        />
                      </Box>
                    ))}
                </Box>
              )}
            </Box>

            {/* Divider between Ratings and Questions */}
            <Divider sx={{ my: 4 }} />

            {/* Questions Section */}
            <Box sx={{ mb: 4 }}>
              <Typography
                variant="h6"
                sx={{ mb: 3, color: "#1F2937", fontWeight: 500 }}
              >
                Additional Questions ({questions.length})
              </Typography>
              <Paper
                elevation={2}
                sx={{ p: 3, borderRadius: 2, bgcolor: "white" }}
              >
                {questions.length === 0 ? (
                  <Typography
                    sx={{ color: "#6B7280", textAlign: "center", py: 4 }}
                  >
                    No additional questions available for this survey.
                  </Typography>
                ) : (
                  questions.map((question, index) =>
                    renderQuestion(question, index)
                  )
                )}
              </Paper>
            </Box>
          </Box>

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              alignItems: "center",
            }}
          >
            <Button
              variant="contained"
              onClick={handleSubmitSurvey}
              disabled={isLoading || isSubmitted() || !isAllQuestionsAnswered()}
              sx={{
                width: "40%",
                height: "30px",
                fontSize: "12px",
                bgcolor:
                  isLoading || isSubmitted() || !isAllQuestionsAnswered()
                    ? "rgba(0, 0, 0, 0.12)"
                    : "rgb(54, 115, 97)",
                "&:hover": {
                  bgcolor:
                    isLoading || isSubmitted() || !isAllQuestionsAnswered()
                      ? "rgba(0, 0, 0, 0.12)"
                      : "rgb(44, 95, 77)",
                },
              }}
            >
              {isLoading ? (
                <CircularProgress size={20} />
              ) : isSubmitted() ? (
                "Already submitted"
              ) : !isAllQuestionsAnswered() ? (
                "Please answer all questions"
              ) : (
                "Submit survey"
              )}
            </Button>
          </Box>

          {/* Add error snackbar */}
          <Snackbar
            open={!!errorSnackbar}
            autoHideDuration={3000}
            onClose={() => setErrorSnackbar(null)}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
          >
            <Alert
              onClose={() => setErrorSnackbar(null)}
              severity="error"
              sx={{ width: "100%" }}
            >
              {errorSnackbar}
            </Alert>
          </Snackbar>
        </Paper>

        {/* Add media query for ProgressTracker */}
        {!loading && !error && (
          <Box
            sx={{
              "@media (max-width: 1200px)": {
                display: "none", // Hide on smaller screens
              },
            }}
          >
            <ProgressTracker disclosures={disclosureData} ratings={ratings} />
          </Box>
        )}
      </SidebarHeader>
    </ThemeProvider>
  );
}
