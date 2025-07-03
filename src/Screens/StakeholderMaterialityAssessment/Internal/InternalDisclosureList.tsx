import {
  Box,
  Typography,
  Select,
  MenuItem,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  Grid,
  Tabs,
  Tab,
} from "@mui/material";

import SidebarHeader from "../../../Components/SidebarHeader";
import { useEffect, useState, useMemo, useRef } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom"; // Add useLocation
import { api, getAuthDetails } from "../../common";
import { DataGrid } from "@mui/x-data-grid";
import { ProgressTracker } from "../../../Components/progress-tracker";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

// Add common styles
const commonBoxShadow = "0px 2px 4px rgba(0, 0, 0, 0.1)";
const commonBoxStyles = {
  p: 1.5,
  my: 1,
  borderRadius: 1,
  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  cursor: "pointer",
  "&:hover": {
    boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
  },
  backgroundColor: "white",
  width: "150px",
  display: "-webkit-box",
  WebkitLineClamp: 2,
  WebkitBoxOrient: "vertical",
  overflow: "hidden",
  textOverflow: "ellipsis",
  lineHeight: "1.2em",
  maxHeight: "2.4em",
  minHeight: "2.4em",
};

// Add the omission options and placeholderMap constants
const omissionOptions = [
  { value: "not_applicable", label: "Not applicable" },
  { value: "legal_prohibitions", label: "Legal prohibitions" },
  { value: "confidentiality", label: "Confidentiality constraints" },
  { value: "unavailable", label: "Information unavailable / incomplete" },
];

const placeholderMap = {
  not_applicable:
    "Explain why the disclosure or the requirement is considered not applicable.",
  legal_prohibitions: "Describe the specific legal prohibitions.",
  confidentiality: "Describe the specific confidentiality constraints.",
  unavailable:
    "Specify which information is unavailable or incomplete. When the information is incomplete, specify which part is missing (e.g., specify the entities for which the information is missing). Explain why the required information is unavailable or incomplete. Describe the steps being taken and the expected time frame to obtain the information.",
};

const commonBoxStylesWithMargin = {
  ...commonBoxStyles,
  ml: 5,
  mx: 0,
  width: "90%",
};

export default function InternalDisclosureList() {
  const [steps] = useState([
    { id: 1, title: "Primary Information", type: "main", status: "complete" },
    { id: 2, title: "Setup External Survey", type: "main", status: "complete" },
    {
      id: 3,
      title: "Setup Internal Survey",
      type: "main",
      status: "in-progress",
    },
    { id: 4, title: "Choose Disclosures", type: "sub", status: "in-progress" },
    { id: 5, title: "Add Questions", type: "sub", status: "pending" },
    { id: 6, title: "Send Email", type: "sub", status: "pending" },
  ]);
  const [activeTab, setActiveTab] = useState(0);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogContent, setDialogContent] = useState({
    title: "",
    content: "",
  });
  const [detailDialog, setDetailDialog] = useState({
    open: false,
    title: "",
    content: "",
  });
  const [disclosures, setDisclosures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentRow, setCurrentRow] = useState(null);
  const [reason, setReason] = useState("");
  const [response, setResponse] = useState(null);
  const [responseMap, setResponseMap] = useState({});
  const { surveyId } = useParams();
  const navigate = useNavigate();
  const [omissionReason, setOmissionReason] = useState("");
  const [explanation, setExplanation] = useState("");
  const [raciValues, setRaciValues] = useState({});
  const [raciMap, setRaciMap] = useState({});

  // Add this new state to track disclosures with missing data
  const [missingDataDisclosures, setMissingDataDisclosures] = useState({
    responses: [] as number[],
    riskCategories: [] as number[],
  });

  const dataGridRef = useRef(null);

  // Add state to track current materiality view (same as in DisclosureList)
  const [materialityView, setMaterialityView] = useState("IMPACT");

  // Add new state for survey data
  const [surveyData, setSurveyData] = useState(null);

  // Add location for handling materiality view from navigation state
  const location = useLocation();

  // Add effect to handle materiality view from navigation state
  useEffect(() => {
    // Check if we're returning from additional disclosures with state
    if (location.state && location.state.materialityView) {
      setMaterialityView(location.state.materialityView);
    }
  }, [location]);

  // Add this function to check and mark disclosures with missing data
  const checkMissingData = () => {
    if (!disclosures || disclosures.length === 0) return;

    const missingResponses = disclosures
      .filter((disclosure) => !responseMap[disclosure.dis_id])
      .map((disclosure) => disclosure.id);

    const missingRiskCategories = disclosures
      .filter((disclosure) => !raciMap[disclosure.dis_id])
      .map((disclosure) => disclosure.id);

    setMissingDataDisclosures({
      responses: missingResponses,
      riskCategories: missingRiskCategories,
    });

    return { missingResponses, missingRiskCategories };
  };

  // Call this whenever responses or risk categories change
  useEffect(() => {
    checkMissingData();
  }, [responseMap, raciMap, disclosures]);

  // Calculate disclosure counts for each dimension
  const dimensionCounts = useMemo(() => {
    if (!disclosures || disclosures.length === 0)
      return {
        Environmental: 0,
        Social: 0,
        Governance: 0,
      };

    return disclosures.reduce((acc, disclosure) => {
      if (disclosure.dimension) {
        acc[disclosure.dimension] = (acc[disclosure.dimension] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);
  }, [disclosures]);

  // Check if all disclosures have responses
  const [requiredResponsesComplete, setRequiredResponsesComplete] =
    useState(false);

  useEffect(() => {
    if (disclosures.length === 0) {
      setRequiredResponsesComplete(false);
      return;
    }

    const allResponsesProvided = disclosures.every(
      (disclosure) =>
        responseMap[disclosure.dis_id] === "yes" ||
        responseMap[disclosure.dis_id] === "no"
    );

    setRequiredResponsesComplete(allResponsesProvided);
  }, [disclosures, responseMap]);

  // Modify handleNextClick to check for missing responses
  const handleNextClick = async () => {
    if (!surveyId) {
      alert("Survey ID not found.");
      return;
    }

    // Check for missing data and get the details
    const { missingResponses, missingRiskCategories } = checkMissingData() || {
      missingResponses: [],
      missingRiskCategories: [],
    };

    // If we have missing data, show specific warning
    if (missingResponses.length > 0 || missingRiskCategories.length > 0) {
      // Switch to tab containing first missing item if needed
      if (missingResponses.length > 0 || missingRiskCategories.length > 0) {
        const firstMissingId = [
          ...missingResponses,
          ...missingRiskCategories,
        ][0];
        const firstMissingItem = disclosures.find(
          (d) => d.id === firstMissingId
        );

        if (firstMissingItem) {
          const tabIndex =
            {
              Environmental: 0,
              Social: 1,
              Governance: 2,
            }[firstMissingItem.dimension] || 0;

          if (activeTab !== tabIndex) {
            setActiveTab(tabIndex);
          }

          // Construct warning message
          let warningMessage = "";
          if (missingResponses.length > 0) {
            const mismatchedDisclosures = disclosures
              .filter((d) => missingResponses.includes(d.id))
              .map(
                (d) =>
                  `• ${d.disclosure_id} (${
                    d.disclosure_number || "ID not assigned"
                  })`
              )
              .slice(0, 5)
              .join("\n");

            warningMessage += `Missing Yes/No responses for ${missingResponses.length} disclosure(s):\n${mismatchedDisclosures}`;
            if (missingResponses.length > 5) {
              warningMessage += `\n... and ${missingResponses.length - 5} more`;
            }
          }

          if (missingRiskCategories.length > 0) {
            if (warningMessage) warningMessage += "\n\n";
            const mismatchedRiskDisclosures = disclosures
              .filter((d) => missingRiskCategories.includes(d.id))
              .map(
                (d) =>
                  `• ${d.disclosure_id} (${
                    d.disclosure_number || "ID not assigned"
                  })`
              )
              .slice(0, 5)
              .join("\n");

            warningMessage += `Missing risk categories for ${missingRiskCategories.length} disclosure(s):\n${mismatchedRiskDisclosures}`;
            if (missingRiskCategories.length > 5) {
              warningMessage += `\n... and ${
                missingRiskCategories.length - 5
              } more`;
            }
          }

          setDialogContent({
            title: "Missing Required Fields",
            content: warningMessage,
          });
          setDialogOpen(true);
        }
      }
      return;
    }

    // Check if this is a double survey and we're currently showing impact materiality
    if (
      surveyData &&
      surveyData.survey_type === "double" &&
      materialityView === "IMPACT"
    ) {
      try {
        // Get material issues from localStorage
        const savedMaterialIssues = localStorage.getItem(
          `survey_${surveyId}_material_issues_internal`
        );
        if (savedMaterialIssues) {
          const materialIssueIds = JSON.parse(savedMaterialIssues);

          if (materialIssueIds.length > 0) {
            // Map financial disclosures based on material issues
            await api.post(
              "esg/api/map-financial-disclosures-by-material-issue/",
              {
                json: {
                  material_issue_ids: materialIssueIds,
                  survey_id: Number(surveyId),
                  is_external: false,
                  is_internal: true,
                },
                headers: {
                  "content-type": "application/json",
                },
              }
            );

            console.log(
              "Successfully mapped financial disclosures for material issues:",
              materialIssueIds
            );
          }
        }

        // Switch to financial materiality view
        setMaterialityView("FINANCIAL");
        setDisclosures([]);
        setLoading(true);
        setResponseMap({});
        setRaciMap({});
        setMissingDataDisclosures({
          responses: [],
          riskCategories: [],
        });

        // Return early to allow the view to change first
        return;
      } catch (error) {
        console.error("Error mapping financial disclosures:", error);
        alert("Error preparing financial materiality view. Please try again.");
        return;
      }
    }

    // If it's already financial materiality or not a double survey, proceed to next step
    try {
      await api.post("esg/api/surveys/update_status/", {
        json: {
          survey_id: surveyId,
          status: "INTERNAL_ADD_DISCLOSURES", // First update to this intermediate status
        },
      });

      // Then update to the target status
      await api.post("esg/api/surveys/update_status/", {
        json: {
          survey_id: surveyId,
          status: "INTERNAL_OPEN_ENDED_QUESTIONS",
        },
      });

      // Clean up localStorage when moving to the next step
      localStorage.removeItem(`survey_${surveyId}_material_issues_internal`);

      navigate(`/internal/questions/${surveyId}`);
    } catch (error) {
      console.error("Error:", error);
      setDialogContent({
        title: "Status Update Error",
        content:
          "An error occurred while updating survey status. Please try again.",
      });
      setDialogOpen(true);
    }
  };

  // Add tab handling functions
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleDetailClick = (title: string, content: string) => {
    setDetailDialog({
      open: true,
      title,
      content,
    });
  };

  // Keep existing useEffect for fetching disclosures
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        let data;

        // Check if we have a single or double survey
        const isSingleSurvey =
          surveyData && surveyData.survey_type === "single";

        if (isSingleSurvey) {
          // For single survey type, get all disclosures without filtering by disclosure_type
          const response = await api
            .get(
              `esg/api/get-disclosures-from-survey/?survey_id=${surveyId}&is_external=TRUE`
            )
            .json();

          // Don't filter by disclosure_type for single surveys
          data = response;
          console.log(
            `Found ${
              response.disclosures?.length || 0
            } disclosures for single internal survey`
          );
        } else if (materialityView === "FINANCIAL") {
          // Get material issues from localStorage for financial materiality
          const savedMaterialIssues = localStorage.getItem(
            `survey_${surveyId}_material_issues_internal`
          );
          if (savedMaterialIssues) {
            const materialIssueIds = JSON.parse(savedMaterialIssues);

            // For financial materiality, fetch disclosures with disclosure_type: FINANCIAL
            if (materialIssueIds.length > 0) {
              try {
                // First try to get disclosures from material issues endpoint
                const response = await api
                  .post("esg/api/disclosures-by-material-issue/", {
                    json: {
                      survey_id: Number(surveyId),
                      material_issue_id: materialIssueIds[0], // Using the first material issue for now
                      filters: {
                        // Add any additional filters if needed
                      },
                    },
                    headers: {
                      "content-type": "application/json",
                    },
                  })
                  .json();

                // Filter to only include FINANCIAL disclosures
                const financialDisclosures = response.filter(
                  (item) => item.disclosure_type === "FINANCIAL"
                );

                if (financialDisclosures.length > 0) {
                  data = { disclosures: financialDisclosures };
                  console.log(
                    `Found ${financialDisclosures.length} financial disclosures for material issue ID ${materialIssueIds[0]}`
                  );
                } else {
                  console.log(
                    "No financial disclosures found for the selected material issue, fetching from general endpoint"
                  );
                }
              } catch (error) {
                console.error(
                  "Error fetching disclosures by material issue:",
                  error
                );
              }
            }
          }

          // If we couldn't get disclosures by material issue, fall back to regular API
          if (!data || !data.disclosures || data.disclosures.length === 0) {
            const response = await api
              .get(
                `esg/api/get-disclosures-from-survey/?survey_id=${surveyId}&is_external=TRUE&&materiality_type=financial`
              )
              .json();

            // Ensure we're still filtering for FINANCIAL disclosure_type
            if (response && response.disclosures) {
              const financialDisclosures = response.disclosures.filter(
                (item) => item.disclosure_type === "FINANCIAL"
              );

              data = { disclosures: financialDisclosures };
              console.log(
                `Found ${financialDisclosures.length} financial disclosures from general endpoint`
              );
            } else {
              data = { disclosures: [] };
            }
          }
        } else {
          // For IMPACT materiality, use the original API and filter for IMPACT disclosures
          const response = await api
            .get(
              `esg/api/get-disclosures-from-survey/?survey_id=${surveyId}&is_external=TRUE&materiality_type=impact`
            )
            .json();

          if (response && response.disclosures) {
            const impactDisclosures = response.disclosures.filter(
              (item) => item.disclosure_type === "IMPACT"
            );

            data = { disclosures: impactDisclosures };
            console.log(`Found ${impactDisclosures.length} impact disclosures`);
          } else {
            data = { disclosures: [] };
          }
        }

        const processedDisclosures = (data?.disclosures || []).map(
          (item, index) => {
            // Create initial response map
            if (item.response?.length > 0) {
              setResponseMap((prev) => ({
                ...prev,
                [item.dis_id]: item.response[0].is_accepted ? "yes" : "no",
              }));
            }

            // Set initial RACI value if it exists
            if (item.raci) {
              setRaciMap((prev) => ({
                ...prev,
                [item.dis_id]: item.raci,
              }));
            }

            // Check if material_issue is an empty array
            const materialIssue =
              Array.isArray(item.material_issue) &&
              item.material_issue.length === 0
                ? null
                : item.material_issue || "N/A";

            return {
              id: index,
              dis_id: item.dis_id,
              standard_id: item.standard_id,
              disclosure_id: item.standard_name || "N/A", // ID column shows standard_name
              material_issue: materialIssue, // Add material issue field with proper handling for empty arrays
              disclosure_description:
                item.disclosure_description ?? "No description available",
              dimension: item.dimension ?? "N/A",
              disclosure_theme: item.disclosure_theme?.name ?? "N/A",
              sub_topic: item.sub_topic?.name ?? "N/A",
              disclosure_number: item.disclosure_id || "N/A", // Disclosure ID column shows disclosure_id
              raci: item.raci || "",
              disclosure_type: item.disclosure_type || "N/A", // Store the disclosure_type
              // ...other properties
            };
          }
        );

        setDisclosures(processedDisclosures);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };
    fetchData();
  }, [surveyId, materialityView, surveyData]); // Add surveyData as dependency

  // Add effect to fetch survey details
  useEffect(() => {
    const fetchSurveyData = async () => {
      if (!surveyId) return;

      try {
        const response = await api
          .get(`esg/api/surveys/get_surveys/?survey_id=${surveyId}`)
          .json();
        if (response && response.length > 0) {
          setSurveyData(response[0]);
        }
      } catch (error) {
        console.error("Error fetching survey data:", error);
      }
    };

    fetchSurveyData();
  }, [surveyId]);

  // Add dimension handling functions
  const getDimensionFromTab = (tabIndex: number): string => {
    switch (tabIndex) {
      case 0:
        return "Environmental"; // Changed to match API response
      case 1:
        return "Social";
      case 2:
        return "Governance";
      default:
        return "Environmental";
    }
  };

  // Add RACI values fetch effect
  useEffect(() => {
    const fetchRaciValues = async () => {
      try {
        const data = await api
          .get("esg/api/survey-disclosure-mapping/get_raci_values/")
          .json();
        setRaciValues(data);
      } catch (error) {
        console.error("Error fetching RACI values:", error);
      }
    };
    fetchRaciValues();
  }, []);

  // Add handleRaciChange function
  const handleRaciChange = async (disclosureId: number, value: string) => {
    try {
      const payload = {
        survey: Number(surveyId),
        disclosure: disclosureId,
        standard: disclosures.find((d) => d.dis_id === disclosureId)
          ?.standard_id,
        raci_category: value,
        topic: null,
        for_internal: true,
        for_external: false, // Since this is InternalDisclosureList
      };

      await api.post("esg/api/survey-disclosure-mapping/", {
        json: payload,
        headers: {
          "content-type": "application/json",
        },
      });

      setRaciMap((prev) => ({
        ...prev,
        [disclosureId]: value,
      }));
    } catch (error) {
      console.error("Error updating RACI value:", error);
    }
  };

  // Update the columns configuration
  const columns = [
    {
      field: "disclosure_id",
      headerName: "Standard",
      flex: 0.8, // Use flex instead of fixed width
      minWidth: 100,
      renderCell: (params) => (
        <Box
          sx={{
            pl: 2,
            color:
              missingDataDisclosures.responses.includes(params.row.id) ||
              missingDataDisclosures.riskCategories.includes(params.row.id)
                ? "#DF0404"
                : "inherit",
            fontWeight:
              missingDataDisclosures.responses.includes(params.row.id) ||
              missingDataDisclosures.riskCategories.includes(params.row.id)
                ? "bold"
                : "normal",
          }}
        >
          {params.value}
        </Box>
      ),
    },
    {
      field: "material_issue",
      headerName: "Material Issue",
      flex: 1, // Use flex instead of width
      minWidth: 110,
      renderCell: (params) => (
        <Box
          sx={commonBoxStyles}
          onClick={() =>
            handleDetailClick(
              "Material Issue",
              params.row.material_issue || "No material issue specified"
            )
          }
        >
          {params.row.material_issue || "N/A"}
        </Box>
      ),
    },
    {
      field: "disclosure_theme",
      headerName: "Theme",
      flex: 1, // Use flex instead of width
      minWidth: 110,
      renderCell: (params) => (
        <Box
          sx={commonBoxStyles}
          onClick={() =>
            handleDetailClick("Theme", params.row.disclosure_theme)
          }
        >
          {params.row.disclosure_theme}
        </Box>
      ),
    },
    {
      field: "sub_topic",
      headerName: "Sub Topic",
      flex: 1, // Use flex instead of width
      minWidth: 110,
      renderCell: (params) => (
        <Box
          sx={commonBoxStylesWithMargin}
          onClick={() => handleDetailClick("Sub Topic", params.row.sub_topic)}
        >
          {params.row.sub_topic}
        </Box>
      ),
    },
    {
      field: "disclosure_description",
      headerName: "Description",
      flex: 1.2, // Give description a bit more space
      minWidth: 130,
      renderCell: (params) => (
        <Box
          sx={commonBoxStylesWithMargin}
          onClick={() =>
            handleDetailClick("Description", params.row.disclosure_description)
          }
        >
          {params.row.disclosure_description}
        </Box>
      ),
    },
    {
      field: "disclosure_number",
      headerName: "Disclosure ID",
      flex: 1,
      minWidth: 110,
      renderCell: (params) => (
        <Box
          sx={commonBoxStylesWithMargin}
          onClick={() =>
            handleDetailClick(
              "Disclosure ID",
              params.row.disclosure_number || "Not assigned"
            )
          }
        >
          {params.row.disclosure_number || "Not assigned"}
        </Box>
      ),
    },
    {
      field: "raci",
      headerName: "Risk Category",
      flex: 1.1,
      minWidth: 120,
      renderCell: (params) => {
        const handleClick = () => {
          const selectElement = document.getElementById(
            `raci-select-${params.row.id}`
          );
          if (selectElement) {
            selectElement.click();
          }
        };

        const isMissingRiskCategory =
          missingDataDisclosures.riskCategories.includes(params.row.id);

        return (
          <Box
            sx={{
              ...commonBoxStylesWithMargin,
              border: isMissingRiskCategory ? "2px solid #DF0404" : "none",
              bgcolor: isMissingRiskCategory
                ? "rgba(255, 235, 235, 0.5)"
                : "white",
            }}
            onClick={handleClick}
          >
            <Select
              id={`raci-select-${params.row.id}`}
              fullWidth
              value={raciMap[params.row.dis_id] || ""}
              onChange={(e) =>
                handleRaciChange(params.row.dis_id, e.target.value)
              }
              sx={{
                height: "100%",
                cursor: "pointer",
                "& .MuiSelect-select": {
                  p: 0,
                  height: "100% !important",
                  display: "flex",
                  alignItems: "center",
                  color: isMissingRiskCategory ? "#DF0404" : "inherit",
                },
                "& .MuiOutlinedInput-notchedOutline": {
                  border: "none",
                },
                "& .MuiSelect-icon": {
                  right: 0,
                  color: isMissingRiskCategory ? "#DF0404" : "inherit",
                },
              }}
              MenuProps={{
                PaperProps: {
                  sx: {
                    mt: 1,
                    boxShadow: "0px 2px 4px rgba(0,0,0,0.1)",
                  },
                },
              }}
            >
              <MenuItem value="" sx={{ color: "#64748B" }}>
                <em>Select Category</em>
              </MenuItem>
              {Object.entries(raciValues).map(([value, label]) => (
                <MenuItem
                  key={value}
                  value={value}
                  sx={{
                    color: "#40444D",
                    "&.Mui-selected": {
                      backgroundColor: "rgba(20, 124, 101, 0.08)",
                    },
                  }}
                >
                  {label}
                </MenuItem>
              ))}
            </Select>
          </Box>
        );
      },
    },
    {
      field: "response",
      headerName: "Response",
      flex: 0.9,
      minWidth: 100,
      renderCell: (params) => {
        const currentValue = responseMap[params.row.dis_id] || "";
        const isMissingResponse = missingDataDisclosures.responses.includes(
          params.row.id
        );

        const handleClick = () => {
          const selectElement = document.getElementById(
            `response-select-${params.row.id}`
          );
          if (selectElement) {
            selectElement.click();
          }
        };

        return (
          <Box
            onClick={handleClick}
            sx={{
              borderRadius: "4px",
            }}
          >
            <Select
              id={`response-select-${params.row.id}`}
              fullWidth
              value={currentValue}
              onChange={(e) =>
                handleResponseChange(params.row.id, e.target.value)
              }
              displayEmpty
              sx={{
                height: "100%",
                width: "60%",
                cursor: "pointer",
                border: isMissingResponse ? "2px solid #DF0404" : "none",
                borderRadius: "4px",
                "& .MuiSelect-select": {
                  p: "0 0 0 16px",
                  height: "100% !important",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor:
                    currentValue === "yes"
                      ? "#147C65"
                      : currentValue === "no"
                      ? "#DF0404"
                      : isMissingResponse
                      ? "rgba(255, 235, 235, 0.8)"
                      : "white",
                  color: currentValue
                    ? "white"
                    : isMissingResponse
                    ? "#DF0404"
                    : "#64748B",
                },
                "& .MuiOutlinedInput-notchedOutline": {
                  border: currentValue
                    ? "none"
                    : isMissingResponse
                    ? "1px solid #DF0404"
                    : "1px solid #E0E0E0",
                  borderRadius: "4px",
                },
                "& .MuiSelect-icon": {
                  right: 0,
                  color: currentValue
                    ? "white"
                    : isMissingResponse
                    ? "#DF0404"
                    : "#64748B",
                },
              }}
              MenuProps={{
                PaperProps: {
                  sx: {
                    mt: 1,
                    boxShadow: "0px 2px 4px rgba(0,0,0,0.1)",
                  },
                },
              }}
            >
              <MenuItem value="" sx={{ justifyContent: "center" }}>
                {isMissingResponse ? (
                  <Box sx={{ color: "#DF0404", fontWeight: "bold" }}>
                    Required
                  </Box>
                ) : (
                  "Yes/No"
                )}
              </MenuItem>
              <MenuItem
                value="yes"
                sx={{
                  justifyContent: "center",
                  color: "#147C65",
                  "&.Mui-selected": {
                    backgroundColor: "#147C65",
                    color: "white",
                  },
                }}
              >
                Yes
              </MenuItem>
              <MenuItem
                value="no"
                sx={{
                  justifyContent: "center",
                  color: "#DF0404",
                  "&.Mui-selected": {
                    backgroundColor: "#DF0404",
                    color: "white",
                  },
                }}
              >
                No
              </MenuItem>
            </Select>
          </Box>
        );
      },
    },
  ];

  // Keep existing response handling functions
  const handleResponseChange = async (rowId: number, value: string) => {
    const row = disclosures.find((d) => d.id === rowId);
    if (!row) return;

    const auth = getAuthDetails();
    try {
      const payload = {
        survey_id: surveyId,
        disclosure_id: row.dis_id,
        response_from: auth.user?.pk,
        is_accepted: value === "yes",
        is_omitted: value === "no",
        acceptance_reason: value === "yes" ? null : null,
        rejection_reason: null, // Send blank for both Yes and No
        rejection_description: null, // Send blank for both Yes and No
        optional_reason: null,
        is_internal: true,
      };

      await api.post("esg/api/survey-response/", {
        json: payload,
        headers: {
          "content-type": "application/json",
        },
      });

      // Update local state after successful API call
      setResponseMap((prev) => ({
        ...prev,
        [row.dis_id]: value,
      }));

      // Update disclosures state to reflect the new response
      setDisclosures((prevDisclosures) =>
        prevDisclosures.map((disc) =>
          disc.dis_id === row.dis_id
            ? {
                ...disc,
                response: [
                  {
                    id: Date.now(), // temporary id
                    isAccepted: value === "yes",
                    optionalReason: null,
                  },
                ],
                hasResponse: true,
                currentResponse: value,
              }
            : disc
        )
      );
    } catch (error) {
      console.error("Error submitting response:", error);
    }
  };

  const handleAddMoreDisclosures = () => {
    // Pass the current materiality view as a URL parameter
    navigate(
      `/internal/additional-disclosures/${surveyId}?materiality=${materialityView}`
    );
  };

  const handleSubmit = async () => {
    if (!currentRow || !omissionReason || !explanation) return;

    const auth = getAuthDetails();
    try {
      const payload = {
        survey_id: surveyId,
        disclosure_id: currentRow.dis_id,
        response_from: auth.user?.pk,
        is_accepted: false,
        is_omitted: true,
        acceptance_reason: null,
        rejection_reason: omissionReason,
        rejection_description: explanation,
        optional_reason: null,
        is_internal: true,
      };

      await api.post("esg/api/survey-response/", {
        json: payload,
        headers: {
          "content-type": "application/json",
        },
      });

      setResponseMap((prev) => ({
        ...prev,
        [currentRow.dis_id]: "no",
      }));

      setDisclosures((prevDisclosures) =>
        prevDisclosures.map((disc) =>
          disc.dis_id === currentRow.dis_id
            ? {
                ...disc,
                response: [
                  {
                    id: Date.now(),
                    isAccepted: false,
                    optionalReason: null,
                  },
                ],
                hasResponse: true,
                currentResponse: "no",
              }
            : disc
        )
      );

      setOpenDialog(false);
      setOmissionReason("");
      setExplanation("");
    } catch (error) {
      console.error("Error submitting response:", error);
    }
  };

  const handleBackClick = () => {
    navigate(-1);
  };

  function CustomNoRowsOverlay() {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
          "& .ant-empty-img-1": {
            fill: "#aeb8c2",
          },
        }}
      >
        <Typography sx={{ color: "#64748B" }}>
          No disclosures available
        </Typography>
      </Box>
    );
  }

  // Add the formatDialogContent helper function before the return statement
  const formatDialogContent = (content: string) => {
    if (!content) return null;

    const lines = content.split("\r\n");

    return (
      <Box sx={{ pl: 1 }}>
        {lines.map((line, index) => {
          if (!line.trim()) return null;

          const isMainPoint = /^[a-z]\./.test(line);
          const isSubPoint = /^[i]+\./.test(line);

          return (
            <Box
              key={index}
              sx={{
                ml: isSubPoint ? 4 : isMainPoint ? 0 : 2,
                mb: 1,
                display: "flex",
                alignItems: "flex-start",
              }}
            >
              {(isMainPoint || isSubPoint) && (
                <Typography
                  component="span"
                  sx={{
                    minWidth: "24px",
                    fontWeight: isMainPoint ? 600 : 400,
                    color: isMainPoint ? "#147C65" : "#1E293B",
                  }}
                >
                  {line.split(".")[0]}.
                </Typography>
              )}
              <Typography
                sx={{
                  flex: 1,
                  fontWeight: isMainPoint ? 500 : 400,
                  color: isMainPoint ? "#147C65" : "#1E293B",
                }}
              >
                {line.replace(/^[a-z]\.|^[i]+\./, "").trim()}
              </Typography>
            </Box>
          );
        })}
      </Box>
    );
  };

  return (
    <>
      <SidebarHeader>
        <Box sx={{ width: "100%", mb: 2, boxShadow: "none" }}>
          {/* Only show materiality view header for double surveys */}
          {surveyData && surveyData.survey_type === "double" && (
            <Box
              sx={{
                display: "flex",
                p: 2,
                justifyContent: "space-between",
                alignItems: "center",
                mb: 1,
                backgroundColor: "#fff",
                borderRadius: 1.5,
                boxShadow: commonBoxShadow,
              }}
            >
              <Typography sx={{ fontSize: "20px" }}>
                {materialityView === "IMPACT"
                  ? "Impact Materiality"
                  : "Financial Materiality"}
              </Typography>
            </Box>
          )}
          <ProgressTracker
            steps={steps}
            currentStep={4} // This now represents "Choose Disclosures" as step 4
          />
        </Box>
        <Box
          sx={{
            width: "100%",
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: commonBoxShadow,
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              pt: 2,
              pl: 4,
            }}
          >
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              sx={{
                "& .MuiTab-root": {
                  textTransform: "none",
                  minWidth: 100,
                  fontSize: "16px",
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
              <Tab
                label={
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Typography component="span">Environment</Typography>
                    <Box
                      sx={{
                        ml: 1,
                        backgroundColor:
                          activeTab === 0 ? "#147C65" : "#64748B",
                        color: "white",
                        borderRadius: "12px",
                        px: 1,
                        py: 0.2,
                        fontSize: "12px",
                        fontWeight: 500,
                        minWidth: "24px",
                        textAlign: "center",
                      }}
                    >
                      {dimensionCounts["Environmental"] || 0}
                    </Box>
                  </Box>
                }
              />
              <Tab
                label={
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Typography component="span">Social</Typography>
                    <Box
                      sx={{
                        ml: 1,
                        backgroundColor:
                          activeTab === 1 ? "#147C65" : "#64748B",
                        color: "white",
                        borderRadius: "12px",
                        px: 1,
                        py: 0.2,
                        fontSize: "12px",
                        fontWeight: 500,
                        minWidth: "24px",
                        textAlign: "center",
                      }}
                    >
                      {dimensionCounts["Social"] || 0}
                    </Box>
                  </Box>
                }
              />
              <Tab
                label={
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Typography component="span">Governance</Typography>
                    <Box
                      sx={{
                        ml: 1,
                        backgroundColor:
                          activeTab === 2 ? "#147C65" : "#64748B",
                        color: "white",
                        borderRadius: "12px",
                        px: 1,
                        py: 0.2,
                        fontSize: "12px",
                        fontWeight: 500,
                        minWidth: "24px",
                        textAlign: "center",
                      }}
                    >
                      {dimensionCounts["Governance"] || 0}
                    </Box>
                  </Box>
                }
              />
            </Tabs>
          </Box>
        </Box>

        <Box
          sx={{
            height: "59%",
            marginTop: 2,
            backgroundColor: "#fff",
            borderRadius: 2,
            boxShadow: commonBoxShadow,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden", // Prevent overflow from this container
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              p: 2,
            }}
          >
            <Typography>Disclosures</Typography>
            <Box sx={{ display: "flex", gap: 2 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  backgroundColor:
                    missingDataDisclosures.responses.length > 0
                      ? "#FFEBEB"
                      : "#E5F6F1",
                  borderRadius: 1,
                  p: 1,
                  pr: 2,
                }}
              >
                <Box
                  component="span"
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    backgroundColor:
                      missingDataDisclosures.responses.length > 0
                        ? "#DF0404"
                        : "#147C65",
                    mr: 1,
                  }}
                />
                <Typography
                  variant="body2"
                  sx={{
                    color:
                      missingDataDisclosures.responses.length > 0
                        ? "#DF0404"
                        : "#147C65",
                    fontWeight: 500,
                  }}
                >
                  {missingDataDisclosures.responses.length > 0
                    ? `${missingDataDisclosures.responses.length} disclosures missing Yes/No responses`
                    : "All disclosures have responses"}
                </Typography>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  backgroundColor:
                    missingDataDisclosures.riskCategories.length > 0
                      ? "#FFEBEB"
                      : "#E5F6F1",
                  borderRadius: 1,
                  p: 1,
                  pr: 2,
                }}
              >
                <Box
                  component="span"
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    backgroundColor:
                      missingDataDisclosures.riskCategories.length > 0
                        ? "#DF0404"
                        : "#147C65",
                    mr: 1,
                  }}
                />
                <Typography
                  variant="body2"
                  sx={{
                    color:
                      missingDataDisclosures.riskCategories.length > 0
                        ? "#DF0404"
                        : "#147C65",
                    fontWeight: 500,
                  }}
                >
                  {missingDataDisclosures.riskCategories.length > 0
                    ? `${missingDataDisclosures.riskCategories.length} disclosures missing risk categories`
                    : "All disclosures have risk categories"}
                </Typography>
              </Box>
            </Box>
          </Box>
          <Box
            sx={{
              flexGrow: 1,
              width: "100%",
              overflow: "auto", // Enable scrolling within this inner container
            }}
          >
            <DataGrid
              ref={dataGridRef}
              rows={disclosures.filter(
                (d) => d.dimension === getDimensionFromTab(activeTab)
              )}
              columns={columns}
              loading={loading}
              autoHeight={false}
              slots={{
                noRowsOverlay: CustomNoRowsOverlay,
              }}
              initialState={{
                pagination: {
                  paginationModel: { pageSize: 10, page: 0 },
                },
              }}
              getRowClassName={(params) => {
                const hasMissingResponse =
                  missingDataDisclosures.responses.includes(params.id);
                const hasMissingRiskCategory =
                  missingDataDisclosures.riskCategories.includes(params.id);
                return hasMissingResponse || hasMissingRiskCategory
                  ? "highlight-row"
                  : "";
              }}
              sx={{
                "& .MuiDataGrid-cell": {
                  px: 0,
                  py: 0, // Reduce vertical padding in cells
                },
                border: "none",
                "& .MuiDataGrid-main": {
                  border: "none",
                },
                "& .MuiDataGrid-virtualScroller": {
                  "&::-webkit-scrollbar": {
                    width: "8px",
                    height: "0px", // Hide horizontal scrollbar completely
                  },
                  "&::-webkit-scrollbar-track": {
                    background: "#f1f1f1",
                  },
                  "&::-webkit-scrollbar-thumb": {
                    background: "#888",
                    borderRadius: "3px",
                  },
                  "&::-webkit-scrollbar-thumb:hover": {
                    background: "#666",
                  },
                },
                "& .MuiTablePagination-root": {
                  margin: 0,
                  padding: 0,
                },
                "& .MuiDataGrid-row": {
                  maxHeight: "45px !important", // Control row height more strictly
                  minHeight: "45px !important",
                },
                height: "100%",
                width: "100%",
                // Highlight rows that have missing data
                "& .highlight-row": {
                  bgcolor: "rgba(255, 235, 235, 0.2)",
                  "&:hover": {
                    bgcolor: "rgba(255, 235, 235, 0.4)",
                  },
                  "& .MuiDataGrid-cell": {
                    borderLeft: "2px solid transparent",
                    "&:first-of-type": {
                      borderLeft: "4px solid #DF0404",
                    },
                  },
                },
              }}
            />
          </Box>
        </Box>

        {/* Add all the dialogs */}
        <Dialog
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle
            sx={{
              color: "#40444D",
              fontSize: "25px",
              fontWeight: "600",
              borderBottom: "1px solid #E0E0E0",
              pb: 2,
            }}
          >
            Add Omission Reason
          </DialogTitle>
          <DialogContent sx={{ mt: 2 }}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    color: "#40444D",
                    fontSize: "14px",
                    mb: 1,
                  }}
                >
                  Select Reason
                </Typography>
                <Select
                  value={omissionReason}
                  onChange={(e) => setOmissionReason(e.target.value)}
                  fullWidth
                  required
                  sx={{
                    mb: 1,
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#E0E0E0",
                    },
                  }}
                >
                  {omissionOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Explanation"
                  multiline
                  rows={4}
                  value={explanation}
                  onChange={(e) => setExplanation(e.target.value)}
                  placeholder={
                    omissionReason
                      ? placeholderMap[omissionReason]
                      : "Please select a reason first"
                  }
                  fullWidth
                  required
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: "#F8FAFC",
                      "& fieldset": {
                        borderColor: "#E0E0E0",
                      },
                    },
                    "& .MuiFormLabel-root": {
                      color: "#64748B",
                    },
                  }}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 2, borderTop: "1px solid #E0E0E0" }}>
            <Button
              onClick={() => setOpenDialog(false)}
              sx={{
                color: "#64748B",
                textTransform: "none",
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              variant="contained"
              disabled={!omissionReason || !explanation}
              sx={{
                backgroundColor: "#147C65",
                borderRadius: 1.5,
                textTransform: "none",
                "&:hover": {
                  backgroundColor: "#147C65",
                },
                "&.Mui-disabled": {
                  backgroundColor: "#E0E0E0",
                },
              }}
            >
              Submit
            </Button>
          </DialogActions>
        </Dialog>
        <Box
          sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 2 }}
        >
          <Button
            variant="outlined"
            sx={{
              color: "#64748B",
              borderColor: "#64748B",
              textTransform: "none",
              "&:hover": {
                borderColor: "#64748B",
              },
            }}
            onClick={handleBackClick}
          >
            Back
          </Button>
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#147C65",
              textTransform: "none",
              "&:hover": {
                backgroundColor: "#147C65",
              },
            }}
            onClick={handleAddMoreDisclosures}
          >
            Add Disclosures from Other Standards
          </Button>

          <Button
            variant="outlined"
            onClick={handleNextClick}
            sx={{
              color: "#147C65",
              borderColor: "#147C65",
              textTransform: "none",
              "&:hover": {
                borderColor: "#147C65",
              },
              position: "relative",
            }}
            title={
              requiredResponsesComplete
                ? surveyData &&
                  surveyData.survey_type === "double" &&
                  materialityView === "IMPACT"
                  ? "Proceed to Financial Materiality"
                  : "Proceed to next step"
                : "Please provide Yes/No responses for all disclosures before proceeding"
            }
          >
            {surveyData &&
            surveyData.survey_type === "double" &&
            materialityView === "IMPACT"
              ? "Next: Financial Materiality"
              : "Next"}
          </Button>
        </Box>

        <Dialog
          open={detailDialog.open}
          onClose={() => setDetailDialog((prev) => ({ ...prev, open: false }))}
          PaperProps={{
            sx: {
              width: "600px",
              minHeight: "250px",
              maxHeight: "80vh",
              borderRadius: "8px",
              overflow: "hidden",
            },
          }}
        >
          <DialogTitle
            sx={{
              color: "#40444D",
              fontSize: "18px",
              fontWeight: "600",
              borderBottom: "1px solid #E0E0E0",
              padding: "16px 24px",
              backgroundColor: "#F8FAFC",
            }}
          >
            {detailDialog.title}
          </DialogTitle>
          <DialogContent
            sx={{
              padding: "24px",
              overflowY: "auto",
            }}
          >
            <DialogContentText
              component="div"
              sx={{
                color: "#1E293B",
                fontSize: "14px",
                lineHeight: "1.6",
                "& p": {
                  margin: "8px 0",
                },
              }}
            >
              {formatDialogContent(detailDialog.content)}
            </DialogContentText>
          </DialogContent>
          <DialogActions
            sx={{
              padding: "16px 24px",
              borderTop: "1px solid #E0E0E0",
              backgroundColor: "#F8FAFC",
            }}
          >
            <Button
              onClick={() =>
                setDetailDialog((prev) => ({ ...prev, open: false }))
              }
              variant="contained"
              sx={{
                backgroundColor: "#147C65",
                color: "white",
                textTransform: "none",
                minWidth: "100px",
                "&:hover": {
                  backgroundColor: "#0E5A4A",
                },
              }}
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </SidebarHeader>

      {/* Update the error dialog for missing risk categories */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle
          sx={{
            color: "#DF0404",
            fontSize: "18px",
            fontWeight: "600",
            borderBottom: "1px solid #FFEBEB",
            backgroundColor: "rgba(255, 235, 235, 0.2)",
          }}
        >
          {dialogContent.title}
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <DialogContentText
            sx={{
              whiteSpace: "pre-line",
              color: "#1E293B",
              "& b": {
                color: "#DF0404",
              },
            }}
          >
            {dialogContent.content}
          </DialogContentText>
        </DialogContent>
        <DialogActions
          sx={{
            borderTop: "1px solid #FFEBEB",
            backgroundColor: "rgba(255, 235, 235, 0.2)",
            p: 2,
          }}
        >
          <Button
            onClick={() => setDialogOpen(false)}
            variant="contained"
            sx={{
              backgroundColor: "#DF0404",
              color: "white",
              textTransform: "none",
              "&:hover": {
                backgroundColor: "#c00303",
              },
            }}
          >
            Fix Missing Data
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
