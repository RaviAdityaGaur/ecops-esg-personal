import {
  Box,
  Typography,
  Select,
  MenuItem,
  Button,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  Grid,
} from "@mui/material";
import SidebarHeader from "../../Components/SidebarHeader";
import { useEffect, useState, useMemo, useRef } from "react"; // Add useRef here
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { api, getAuthDetails } from "../common";
import { DataGrid } from "@mui/x-data-grid";
import { ProgressTracker } from "../../Components/progress-tracker";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

// Update the common box shadow style
const commonBoxShadow = "0px 2px 4px rgba(0, 0, 0, 0.1)";

// Add this common box style object
const commonBoxStyles = {
  p: 1.5,
  my: 1,
  // remove mx: 2.5
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

const commonBoxStylesWithMargin = {
  ...commonBoxStyles,
  ml: 5,
  mx: 0,
  width: "90%",
};

// Add these constants after the existing imports
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

// Add this interface near the top of the file with other interfaces
interface DisclosureData {
  dis_id: number;
  standard_id: number;
  // ...other properties...
}

// Add this helper function to format dialog content properly
// This handles both plain text and potentially HTML content
const formatDialogContent = (content: string | null): React.ReactNode => {
  if (!content) return "No content available";

  // If the content appears to contain HTML
  if (content.includes("<")) {
    return <div dangerouslySetInnerHTML={{ __html: content }} />;
  }

  // For plain text, handle line breaks for better readability
  const formattedContent = content
    .split("\n")
    .map((line, i) => <p key={i}>{line}</p>);

  return formattedContent;
};

export default function ReportingDisclosureList() {
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
    { id: 5, title: "Choose Disclosures", type: "sub", status: "in-progress" },
    { id: 6, title: "Add Questions", type: "sub", status: "pending" },
    { id: 7, title: "Send Email", type: "sub", status: "pending" },
    { id: 8, title: "Setup Internal Survey", type: "main", status: "pending" },
  ]);

  const [activeTab, setActiveTab] = useState(0);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogContent, setDialogContent] = useState({
    title: "",
    content: "",
  });

  // Add this new state for the detail popup
  const [detailDialog, setDetailDialog] = useState({
    open: false,
    title: "",
    content: "",
  });

  const handleDetailClick = (title: string, content: string) => {
    setDetailDialog({
      open: true,
      title,
      content,
    });
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleConfirmDialog = () => {
    setOpenConfirmDialog(false);
  };

  const [disclosures, setDisclosures] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentRow, setCurrentRow] = useState(null);
  const [response, setResponse] = useState(null);
  const [responseMap, setResponseMap] = useState({});
  const { reportId } = useParams();
  const [omissionReason, setOmissionReason] = useState("");
  const [explanation, setExplanation] = useState("");
  const [raciValues, setRaciValues] = useState({});
  const [raciMap, setRaciMap] = useState({});

  // Add this effect to fetch RACI values
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

  // Update the handleRaciChange function
  const handleRaciChange = async (disclosureId: number, value: string) => {
    try {
      const payload = {
        survey: Number(surveyId),
        disclosure: disclosureId,
        standard: disclosures.find((d) => d.dis_id === disclosureId)
          ?.standard_id,
        raci_category: value,
        topic: null,
        for_internal: false,
        for_external: true, // Since this is DisclosureList for external survey
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

  // Add state to track current materiality view
  const [materialityView, setMaterialityView] = useState("IMPACT");

  // Add new state for survey data
  const [surveyData, setSurveyData] = useState(null);
  //  const demoData = [
  //   {
  //       "dis_id": 100,
  //       "disclosure_id": "13.1.2",
  //       "disclosure_description": "a. Gross direct (Scope 1) GHG emissions in metric tons of CO2 equivalent. \nb. Gases included in the calculation; whether CO2 , CH4 , N2O, HFCs, PFCs, SF6 , NF3 , or all. \nc. Biogenic CO2 emissions in metric tons of CO2 equivalent. \nd. Base year for the calculation, if applicable, including: \ni. the rationale for choosing it; \nii. emissions in the base year; \niii. the context for any significant changes in emissions that triggered recalculations of base year emissions.  \ne. Source of the emission factors and the global warming potential (GWP) rates used, or a reference to the GWP source. \nf. Consolidation approach for emissions; whether equity share, financial control, or operational control.  \ng. Standards, methodologies, assumptions, and/or calculation tools used.\n\nAdditional sector recommendations\nWhen reporting on gross direct (Scope 1) GHG emissions in metric tons of CO2 equivalent, include land use change emissions.",
  //       "dimension": "Environmental",
  //       "year": 2016,
  //       "sdg_targets": [
  //           {
  //               "id": 15,
  //               "target": "3.9",
  //               "goal": 15
  //           },
  //           {
  //               "id": 9,
  //               "target": "12.2",
  //               "goal": 9
  //           },
  //           {
  //               "id": 11,
  //               "target": "13.1",
  //               "goal": 11
  //           },
  //           {
  //               "id": 13,
  //               "target": "14.2",
  //               "goal": 13
  //           },
  //           {
  //               "id": 14,
  //               "target": "15.1",
  //               "goal": 14
  //           }
  //       ],
  //       "indicator_source": {
  //           "id": 5,
  //           "name": "GRI Sustainability Reporting Standards",
  //           "description": "",
  //           "information": null,
  //           "website_url": null
  //       },
  //       "disclosure_theme": {
  //           "id": 11,
  //           "name": "Emissions",
  //           "description": "",
  //           "created_at": "2025-05-22T05:09:05.090918Z",
  //           "updated_at": "2025-05-22T05:09:05.090935Z"
  //       },
  //       "sub_topic": {
  //           "id": 29,
  //           "name": "Direct (Scope 1) GHG emissions",
  //           "description": "",
  //           "created_at": "2025-05-22T05:09:05.093589Z",
  //           "updated_at": "2025-05-22T05:09:05.093604Z"
  //       },
  //       "response": [],
  //       "report_disclosure_id": 1,
  //       "standard_id": 36,
  //       "standard_name": "GRI 13",
  //       "material_issue": [],
  //       "disclosure_type": "IMPACT"
  //   },
  //  ]
  useEffect(() => {
    const fetchDisclosuresForReport = async () => {
      if (!reportId) {
        setDisclosures([]);
        return;
      }

      setLoading(true);
      try {
        const response: any = await api
          .get(`esg/api/get-disclosure-for-report/?report_id=${reportId}`)
          .json();

        const fetched = response.disclosures ? response.disclosures : [];
        console.log("Fetched disclosures:", fetched);
        setDisclosures(fetched);
      } catch (err) {
        console.error("Error fetching disclosures:", err);
        console.log("Falling back to demoData");
      } finally {
        setLoading(false);
      }
    };

    fetchDisclosuresForReport();
  }, [reportId]);

  useEffect(() => {
    console.log("disclosures updated:", disclosures);
  }, [disclosures]);

  // Add effect to fetch survey details
  // useEffect(() => {
  //   const fetchSurveyData = async () => {
  //     if (!surveyId) return;

  //     try {
  //       const response = await api
  //         .get(`esg/api/surveys/get_surveys/?survey_id=${surveyId}`)
  //         .json();
  //       if (response && response.length > 0) {
  //         setSurveyData(response[0]);
  //       }
  //     } catch (error) {
  //       console.error("Error fetching survey data:", error);
  //     }
  //   };

  //   fetchSurveyData();
  // }, [surveyId]);

  // Add effect to handle materiality view from navigation state
  const location = useLocation();

  useEffect(() => {
    // Check if we're returning from additional disclosures with state
    if (location.state && location.state.materialityView) {
      setMaterialityView(location.state.materialityView);
    }
  }, [location]);

  // Update useEffect to handle loading disclosures based on materiality view
  /* useEffect(() => {
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
            } disclosures for single survey`
          );
        } else if (materialityView === "FINANCIAL") {
          // Get material issues from localStorage for financial materiality
          const savedMaterialIssues = localStorage.getItem(
            `survey_${surveyId}_material_issues`
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
                `esg/api/get-disclosures-from-survey/?survey_id=${surveyId}&is_external=TRUE&materiality_type=financial`
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

        // Process the disclosures regardless of survey type
        const processedDisclosures = (data.disclosures || []).map(
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
              id: index, // Ensure a unique ID for each row
              dis_id: item.dis_id,
              standard_id: item.standard_id, // Make sure this is included
              disclosure_id: item.standard_name || "N/A", // ID column shows standard_name
              material_issue: materialIssue, // Properly handle empty arrays
              disclosure_description:
                item.disclosure_description ?? "No description available",
              dimension: item.dimension ?? "N/A",
              year: item.year ?? "N/A",
              sdg_targets:
                item.sdg_targets?.map((target) => target.target).join(", ") ??
                "N/A",
              indicator_source: item.indicator_source?.name ?? "N/A",
              disclosure_theme: item.disclosure_theme?.name ?? "N/A",
              sub_topic: item.sub_topic?.name ?? "N/A",
              response:
                item.response?.length > 0
                  ? item.response.map((resp) => ({
                      id: resp.id,
                      isAccepted: resp.is_accepted,
                      optionalReason:
                        resp.optional_reason ?? "No reason provided",
                    }))
                  : null,
              hasResponse:
                Array.isArray(item.response) && item.response.length > 0, // Flag for response
              currentResponse:
                item.response?.length > 0
                  ? item.response[0].is_accepted
                    ? "yes"
                    : "no"
                  : null,
              disclosure_number: item.disclosure_id || "N/A", // Disclosure ID column shows disclosure_id
              raci: item.raci || "", // Update this line - use raci instead of raci_value
              disclosure_type: item.disclosure_type || "N/A", // Store the disclosure_type
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
  */

  const handleResponseClick = (row) => {
    setCurrentRow(row);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setOmissionReason("");
    setExplanation("");
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
        [currentRow.dis_id]: "no",
      }));

      // Update disclosures state to reflect the new response
      setDisclosures((prevDisclosures) =>
        prevDisclosures.map((disc) =>
          disc.dis_id === currentRow.dis_id
            ? {
                ...disc,
                response: [
                  {
                    id: Date.now(), // temporary id
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

      handleCloseDialog();
    } catch (error) {
      console.error("Error submitting response:", error);
    }
  };

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

  // Add mapping for display names if needed
  const getDimensionDisplayName = (dimension: string): string => {
    switch (dimension.toLowerCase()) {
      case "environmental":
        return "Environment";
      case "social":
        return "Social";
      case "governance":
        return "Governance";
      default:
        return dimension;
    }
  };

  const filteredDisclosures = useMemo(() => {
    if (!disclosures || disclosures.length === 0) return [];

    const currentDimension = getDimensionFromTab(activeTab);
    return disclosures.filter(
      (disclosure) => disclosure.dimension === currentDimension // Removed toLowerCase()
    );
  }, [disclosures, activeTab]);

  // Add this new state to track disclosures with missing data
  const [missingDataDisclosures, setMissingDataDisclosures] = useState({
    responses: [] as number[],
    riskCategories: [] as number[],
  });

  // Add reference to DataGrid
  const dataGridRef = useRef(null);

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

  const columns = [
    {
      field: "disclosure_id",
      headerName: "Standard",
      flex: 0.8, // Use flex instead of width for responsive sizing
      minWidth: 100, // Set a minimum width to avoid too narrow columns
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
      headerName: "Material Topic",
      flex: 1.2,
      minWidth: 110,
      renderCell: (params) => {
        if (!params.row.material_issue) {
          return null;
        }

        return (
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
        );
      },
    },
    {
      field: "standard_name",
      headerName: "Topic standard ",
      flex: 1.2,
      minWidth: 110,
      renderCell: (params) => (
        <Box
          sx={commonBoxStyles}
          onClick={() => handleDetailClick("Theme", params.row.standard_name)}
        >
          {params.row.standard_name}
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
          sx={commonBoxStylesWithMargin} // With left margin
          onClick={() => handleDetailClick("Sub Topic", params.row.sub_topic)}
        >
          {params.row.sub_topic.name}
        </Box>
      ),
    },
    {
      field: "disclosure_description",
      headerName: "Description",
      flex: 1.2, // Give description a bit more space with higher flex
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
      field: "disclosure_number", // New field for Disclosure ID
      headerName: "Disclosure ID",
      flex: 1,
      minWidth: 110,
      renderCell: (params) => (
        <Box
          sx={commonBoxStylesWithMargin}
          onClick={() =>
            handleDetailClick(
              "Disclosure ID",
              params.row.disclosure_id || "Not assigned"
            )
          }
        >
          {params.row.disclosure_id || "Not assigned"}
        </Box>
      ),
    },
    {
      field: "sdg_goal", // New field for Disclosure ID
      headerName: "SDG Goal",
      flex: 1,
      minWidth: 110,
      renderCell: (params) => (
        <Box
          sx={commonBoxStylesWithMargin}
          onClick={() =>
            handleDetailClick(
              "SDG Goal",
              params.row.sdg_targets
                ?.map((item: any) => item.goal)
                .join(", ") || "Not assigned"
            )
          }
        >
          {params.row.sdg_targets?.map((item: any) => item.goal).join(", ") ||
            "Not assigned"}
        </Box>
      ),
    },
    {
      field: "sdg_traget", // New field for Disclosure ID
      headerName: "SDG Traget",
      flex: 1,
      minWidth: 110,
      renderCell: (params) => (
        <Box
          sx={commonBoxStylesWithMargin}
          onClick={() =>
            handleDetailClick(
              "SDG Traget",
              params.row.sdg_targets
                ?.map((item: any) => item.target)
                .join(", ") || "Not assigned"
            )
          }
        >
          {params.row.sdg_targets?.map((item: any) => item.target).join(", ") ||
            "Not assigned"}
        </Box>
      ),
    },
    {
      field: "rating", // New field for Disclosure ID
      headerName: "Rating",
      flex: 1,
      minWidth: 110,
      renderCell: (params) => (
        <Box
          sx={commonBoxStylesWithMargin}
          onClick={() =>
            handleDetailClick(
              "Rating",
              // params.row.sdg_targets?.map((item: any) => item.goal).join(", ") ||
              "Not assigned"
            )
          }
        >
          {
            // params.row.sdg_targets?.map((item: any) => item.target).join(", ") ||
            "Not assigned"
          }
        </Box>
      ),
    },
    {
      field: "response",
      headerName: "Response",
      flex: 0.9,
      minWidth: 100,
      renderCell: (params) => {
        // const currentValue = responseMap[params.row.dis_id] || "";
        const currentValue =
          params.row.response.is_added == true &&
          params.row.response.is_removed == false
            ? "yes"
            : "no" || "";

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
              id={`response-select-${params.row.dis_id}`}
              fullWidth
              value={currentValue}
              onChange={(e) =>
                handleResponseChange(params.row.dis_id, e.target.value)
              }
              displayEmpty
              sx={{
                height: "100%",
                width: "80%",
                cursor: "pointer",
                border: isMissingResponse ? "2px solid #DF0404" : "none",
                borderRadius: "6px",
                "& .MuiSelect-select": {
                  p: "0 15px 0 15px",
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

  const handleYesResponse = async (row, value) => {
    const auth = getAuthDetails();
    try {
      const payload = {
        survey_id: surveyId,
        disclosure_id: row.dis_id,
        response_from: auth.user?.pk,
        is_accepted: true,
        is_omitted: false,
        acceptance_reason: 1,
        rejection_reason: null,
        rejection_description: null,
        optional_reason: null,
        omission_reason: null,
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
                    isAccepted: true,
                    optionalReason: null,
                  },
                ],
                hasResponse: true,
                currentResponse: "yes",
              }
            : disc
        )
      );
    } catch (error) {
      console.error("Error submitting response:", error);
    }
  };

  // Modify the handleResponseChange function to handle "No" responses directly
  // const handleResponseChange = async (rowId: number, value: string) => {
  //   console.log("rowid", rowId, "value", value, "   ", disclosures)
  //   const row = disclosures.find((d) => d.dis_id === rowId);
  //   console.log("row", row)
  //   if (!row) return;

  //   const auth = getAuthDetails();
  //   try {
  //     const payload =
  //     {
  //       "report_id": reportId,
  //       "disclosure_id": row.dis_id,
  //       // "is_omitted": false,
  //       // "omission_description": "string",
  //       // "rejection_reason": 0,
  //       "is_added": value == 'yes' ? true : false,
  //       "is_removed":  value == 'no' ? true : false,
  //     }
  //     console.log("payload", payload)
  //     const response = await api.post("esg/api/report-disclosure-response/", {
  //       json: payload,
  //       headers: {
  //         "content-type": "application/json",
  //       },
  //     });

  //     console.log("res", response)

  //     // Update local state after successful API call
  //     setResponseMap((prev) => ({
  //       ...prev,
  //       [row.dis_id]: value,
  //     }));

  //     // Update disclosures state to reflect the new response
  //     setDisclosures((prevDisclosures) =>
  //       prevDisclosures.map((disc) =>
  //         disc.dis_id === row.dis_id
  //           ? {
  //             ...disc,
  //             response: [
  //               {
  //                 id: Date.now(), // temporary id
  //                 isAccepted: value === "yes",
  //                 optionalReason: null,
  //               },
  //             ],
  //             hasResponse: true,
  //             currentResponse: value,
  //           }
  //           : disc
  //       )
  //     );
  //   } catch (error) {
  //     console.error("Error submitting response:", error);
  //   }
  // };

  const handleResponseChange = async (
    rowId: number,
    value: "yes" | "no" | string
  ) => {
    console.log("rowId:", rowId, "value:", value, disclosures);

    const row = disclosures.find((d) => d.dis_id === rowId);
    if (!row) return;

    const auth = getAuthDetails();

    const isAdded = value === "yes";
    const isRemoved = value === "no";

    // Prevent invalid values
    if (!["yes", "no"].includes(value)) {
      console.warn("Invalid value received:", value);
      return;
    }

    const payload = {
      report_id: reportId,
      disclosure_id: row.dis_id,
      is_added: isAdded,
      is_removed: isRemoved,
    };

    console.log("Submitting payload:", payload);

    try {
      const response = await api.post("esg/api/report-disclosure-response/", {
        json: payload,
        headers: {
          "content-type": "application/json",
        },
      });

      console.log("API response:", response);

      // Update the map state
      setResponseMap((prev) => ({
        ...prev,
        [row.dis_id]: value,
      }));

      // Update the disclosure object
      setDisclosures((prev) =>
        prev.map((disc) =>
          disc.dis_id === row.dis_id
            ? {
                ...disc,
                response: {
                  id: Date.now(), // temporary until backend returns one
                  is_omitted: false,
                  is_added: isAdded,
                  is_removed: isRemoved,
                },
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

  const [openProceedDialog, setOpenProceedDialog] = useState(false);
  const navigate = useNavigate();

  // Add state to track completed responses
  const [requiredResponsesComplete, setRequiredResponsesComplete] =
    useState(false);

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

  // Modify handleNextClick to handle both types of surveys
  const handleNextClick = async () => {
    navigate(`/selected-disclosures-summary/${reportId}`);
  };

  const handleAddMoreDisclosures = () => {
    // Pass the current materiality view as a URL parameter
    navigate(
      `/report-additional-disclosures/${reportId}?materiality=${materialityView}`
    );
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
        }}
      >
        <Typography sx={{ color: "#64748B" }}>
          No disclosures available
        </Typography>
      </Box>
    );
  }

  return (
    <>
      <SidebarHeader>
        <Box sx={{ width: "100%", mb: 2, boxShadow: "none" }}>
          {/* Update the header to show current materiality view only for double surveys */}
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
          <ProgressTracker steps={steps} currentStep={5} />
        </Box>

        <Box
          sx={{
            width: "100%",
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: commonBoxShadow,
            borderBottom: "1px solid #E0E0E0",
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

        {/* Adjust the height to match InternalDisclosureList and fix vertical scrolling */}
        <Box
          sx={{
            height: "59%", // Changed from 65% to 59% to match InternalDisclosureList
            marginTop: 2,
            backgroundColor: "#fff",
            borderRadius: 2,
            boxShadow: commonBoxShadow,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
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
              overflow: "auto",
            }}
          >
            <DataGrid
              ref={dataGridRef}
              rows={filteredDisclosures}
              columns={columns}
              loading={loading}
              pagination
              autoHeight={false}
              getRowId={(row) => row.dis_id}
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

        {/* Adjust the margin top to accommodate the reduced container height */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 2,
            mt: 2,
            backgroundColor: "#f5f5f5",
          }}
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
            +Add Disclosures
          </Button>
          {/* Single Next button */}
          <Button
            variant="outlined"
            sx={{
              color: "#147C65",
              borderColor: "#147C65",
              textTransform: "none",
              "&:hover": {
                borderColor: "#147C65",
              },
              position: "relative",
            }}
            onClick={handleNextClick}
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
      </SidebarHeader>

      {/* Dialogs - moved outside SidebarHeader */}
      <ConfirmationDialog
        open={openConfirmDialog}
        onClose={() => setOpenConfirmDialog(false)}
        onConfirm={handleConfirmDialog}
        disclosureCount={50}
      />

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

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
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
            onClick={handleCloseDialog}
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

      {/* Detail dialog */}
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
    </>
  );
}

const ConfirmationDialog = ({
  open,
  onClose,
  onConfirm,
  disclosureCount,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  disclosureCount: number;
}) => {
  const navigate = useNavigate();

  const handleConfirm = () => {
    onConfirm();
    navigate("/open-ended-question");
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle
        sx={{ color: "#40444D", fontSize: "16px", fontWeight: "600" }}
      >
        Confirm and Next
      </DialogTitle>
      <DialogContent
        sx={{
          padding: "20px 0px !important",
          width: "900px",
          height: "120px",
        }}
      >
        <DialogContentText
          sx={{
            color: "black",
            fontSize: "13px",
            fontWeight: 600,
            backgroundColor: "#F8FAFC",
            width: "100%",
            padding: "7px 22px",
          }}
        >
          {`Total Disclosure = ${disclosureCount}`}
        </DialogContentText>
        <DialogContentText
          sx={{
            color: "#40444D",
            fontSize: "15px",
            padding: "10px 10px 5px 22px",
          }}
        >
          Are you sure you want to continue with{" "}
          <span style={{ fontWeight: "600" }}>
            {`${disclosureCount} disclosures.`}
          </span>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={handleConfirm}
          autoFocus
          sx={{
            backgroundColor: "#147C65",
            borderRadius: 1.5,
            marginRight: 2,
            color: "white",
            padding: "8px 22px",
            mb: 2,
            width: "20%",
            textTransform: "none",
            "&:hover": {
              backgroundColor: "#147C65",
            },
          }}
        >
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};
