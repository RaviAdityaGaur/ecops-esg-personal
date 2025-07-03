import {
  Box,
  Tabs,
  Tab,
  Typography,
  Select,
  MenuItem,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  DialogContentText,
  Fab,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api, getAuthDetails } from "../common";
import SidebarHeader from "../../Components/SidebarHeader";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CheckIcon from "@mui/icons-material/Check";

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
  width: "90%",
  display: "-webkit-box",
  WebkitLineClamp: 2,
  WebkitBoxOrient: "vertical",
  overflow: "hidden",
  textOverflow: "ellipsis",
  lineHeight: "1.2em",
  maxHeight: "2.4em",
  minHeight: "2.4em",
};

const CELL_WIDTH = 250; // Match the cell width with internal disclosures

export default function AdditionalDisclosures() {
  const [activeTab, setActiveTab] = useState(0);
  const [disclosures, setDisclosures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentRow, setCurrentRow] = useState(null);
  const [reason, setReason] = useState("");
  const [response, setResponse] = useState("");
  const [responseMap, setResponseMap] = useState({});
  const { surveyId } = useParams();
  const navigate = useNavigate();
  const [detailDialog, setDetailDialog] = useState({
    open: false,
    title: "",
    content: "",
  });
  const [selectedDisclosures, setSelectedDisclosures] = useState([]);
  // Add state to track materiality type
  const [materialityType, setMaterialityType] = useState("IMPACT"); // Default to IMPACT
  // Add state for survey material issues
  const [surveyMaterialIssues, setSurveyMaterialIssues] = useState([]);
  // Add filter states
  const [materialIssueFilter, setMaterialIssueFilter] = useState("");
  const [standardFilter, setStandardFilter] = useState("");
  const [availableMaterialIssues, setAvailableMaterialIssues] = useState([]);
  const [standards, setStandards] = useState([]);

  // Extract materiality from URL on initial load
  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const materialityParam = queryParams.get("materiality");
    if (materialityParam) {
      setMaterialityType(materialityParam);
    }
  }, []);

  // Updated fetch function to get survey material issues and filter disclosures
  useEffect(() => {
    const fetchData = async () => {
      try {
        // First fetch survey material issues
        const surveyMaterialDataList = await api
          .get(`esg/api/survey-material-issues/`)
          .json();

        // Find the entry for the current survey
        const currentSurvey = surveyMaterialDataList.find(
          (item) => item.survey === parseInt(surveyId)
        );

        // Extract material issue IDs from the response
        const materialIssueIds = currentSurvey?.material_issues || [];
        setSurveyMaterialIssues(materialIssueIds);

        console.log(
          "Survey material issues for survey",
          surveyId,
          ":",
          materialIssueIds
        );

        // Then fetch disclosures
        const data = await api
          .get(`esg/api/disclosures/list-for-mapping/?survey_id=${surveyId}`)
          .json();

        // Process all disclosures
        const processedDisclosures = data.flatMap((standard) =>
          standard.disclosures.map((item) => ({
            ...item,
            standard_name: standard.standard_name,
          }))
        );

        // Extract unique standards for filter
        const uniqueStandards = Array.from(
          new Set(processedDisclosures.map((item) => item.standard_name))
        );
        setStandards(uniqueStandards);

        console.log("Total disclosures fetched:", processedDisclosures.length);

        // Filter to only include disclosures with matching material issue IDs
        const filteredDisclosures = processedDisclosures.filter(
          (disclosure) => {
            // If disclosure has material issues array
            if (
              disclosure.material_issues &&
              disclosure.material_issues.length > 0
            ) {
              // Check if any material issue ID matches the survey's material issues
              const matches = disclosure.material_issues.some((issue) =>
                materialIssueIds.includes(issue.id)
              );
              if (matches) {
                console.log("Matched disclosure:", disclosure.disclosure_id);
              }
              return matches;
            }
            return false; // If no material issues, don't include
          }
        );

        console.log("Filtered disclosures:", filteredDisclosures.length);

        // Extract available material issues for the filter dropdown
        const materialIssuesSet = new Set();
        filteredDisclosures.forEach((disclosure) => {
          if (
            disclosure.material_issues &&
            disclosure.material_issues.length > 0
          ) {
            disclosure.material_issues.forEach((issue) => {
              if (materialIssueIds.includes(issue.id)) {
                materialIssuesSet.add(JSON.stringify(issue));
              }
            });
          }
        });

        // Convert back from JSON strings to objects
        const availableMaterialIssues = Array.from(materialIssuesSet).map(
          (issueStr) => JSON.parse(issueStr)
        );
        setAvailableMaterialIssues(availableMaterialIssues);

        setDisclosures(filteredDisclosures);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [surveyId]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleResponseChange = async (row, value) => {
    if (value === "no") {
      // Handle No response directly without showing dialog
      setResponseMap((prev) => ({
        ...prev,
        [row.id]: "no",
      }));
      // Remove from selected disclosures if previously added
      setSelectedDisclosures((prev) =>
        prev.filter((disclosure) => disclosure.id !== row.id)
      );
    } else {
      // Handle Yes response
      await handleYesResponse(row);
    }
  };

  const handleYesResponse = async (row) => {
    const auth = getAuthDetails();
    try {
      // Just map to local state first, don't navigate away
      setResponseMap((prev) => ({
        ...prev,
        [row.id]: "yes",
      }));

      // Add to selected disclosures array
      setSelectedDisclosures((prev) => [...prev, row]);
    } catch (error) {
      console.error("Error selecting disclosure:", error);
    }
  };

  const handleBulkSubmit = async () => {
    if (!selectedDisclosures.length) return;

    const auth = getAuthDetails();
    try {
      // Process all selected disclosures
      for (const row of selectedDisclosures) {
        // Extract material issues IDs if available
        const materialIssueIds =
          row.material_issues && row.material_issues.length > 0
            ? row.material_issues.map((issue) => issue.id)
            : [];

        // Map the disclosure to the survey with material issues and type
        await api.post("esg/api/map-other-disclosures-to-survey/", {
          json: {
            survey_id: surveyId,
            disclosure_ids: row.id,
            is_external: true,
            material_issues: materialIssueIds,
            // Use the current materiality type for mapping
            material_type:
              materialityType === "FINANCIAL" ? "financial" : "impact",
          },
        });

        // Add the response
        const payload = {
          survey_id: surveyId,
          disclosure_id: row.id,
          response_from: auth.user?.pk,
          is_accepted: true,
          is_omitted: false,
          acceptance_reason: 1,
          rejection_reason: null,
          rejection_description: null,
          optional_reason: null,
          omission_reason: null,
          material_issues: materialIssueIds,
          // Use the current materiality type
          material_type:
            materialityType === "FINANCIAL" ? "financial" : "impact",
        };

        await api.post("esg/api/survey-response/", {
          json: payload,
        });
      }

      // Return to the disclosure list with the current materiality view preserved
      navigate(`/add-disclosure/${surveyId}`, {
        state: { materialityView: materialityType },
      });
    } catch (error) {
      console.error("Error submitting bulk responses:", error);
    }
  };

  const columns = [
    {
      field: "disclosure_id",
      headerName: "ID",
      width: CELL_WIDTH - 80,
      renderCell: (params) => <Box sx={{ pl: 2 }}>{params.value}</Box>,
    },
    {
      field: "material_issues",
      headerName: "Material Issues",
      width: CELL_WIDTH - 70,
      renderCell: (params) => {
        const issues = params.value || [];
        return (
          <Box
            sx={commonBoxStyles}
            onClick={() =>
              issues.length > 0
                ? handleDetailClick(
                    "Material Issues",
                    issues.map((issue) => issue.name).join(", ")
                  )
                : null
            }
          >
            <Typography>
              {issues.length > 0
                ? issues.map((issue) => issue.name).join(", ")
                : "No material issues"}
            </Typography>
          </Box>
        );
      },
    },
    {
      field: "disclosure_description",
      headerName: "Description",
      width: CELL_WIDTH, // Updated width
      renderCell: (params) => (
        <Box
          sx={commonBoxStyles}
          onClick={() => handleDetailClick("Description", params.value)}
        >
          <Typography>{params.value}</Typography>
        </Box>
      ),
    },
    {
      field: "dimension",
      headerName: "Dimension",
      width: CELL_WIDTH - 100, // Updated width
      renderCell: (params) => (
        <Box
          sx={commonBoxStyles}
          onClick={() => handleDetailClick("Dimension", params.value)}
        >
          {params.value}
        </Box>
      ),
    },
    {
      field: "response",
      headerName: "Response",
      width: CELL_WIDTH - 50, // Updated width
      renderCell: (params) => {
        const currentValue = responseMap[params.row.id] || "";
        const handleClick = () => {
          const selectElement = document.getElementById(
            `response-select-${params.row.id}`
          );
          if (selectElement) {
            selectElement.click();
          }
        };

        return (
          <Box onClick={handleClick}>
            <Select
              id={`response-select-${params.row.id}`}
              fullWidth
              value={currentValue}
              onChange={(e) => handleResponseChange(params.row, e.target.value)}
              displayEmpty
              sx={{
                height: "100%",
                width: "40%",
                cursor: "pointer",
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
                      : "white",
                  color: currentValue ? "white" : "#64748B",
                },
                "& .MuiOutlinedInput-notchedOutline": {
                  border: currentValue ? "none" : "1px solid #E0E0E0",
                  borderRadius: "4px",
                },
                "& .MuiSelect-icon": {
                  right: 0,
                  color: currentValue ? "white" : "#64748B",
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
                Yes/No
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

  // Further filter disclosures based on selected filters
  const filteredDisclosures = disclosures.filter((disclosure) => {
    // Tab filter (SASB/GRI)
    const tabMatch =
      activeTab === 0
        ? disclosure.indicator_source === "SASB Standards"
        : disclosure.indicator_source === "GRI Standards";

    // Standard filter
    const standardMatch =
      !standardFilter || disclosure.standard_name === standardFilter;

    // Material issue filter
    const materialIssueMatch =
      !materialIssueFilter ||
      (disclosure.material_issues &&
        disclosure.material_issues.some(
          (issue) => issue.name === materialIssueFilter
        ));

    return tabMatch && standardMatch && materialIssueMatch;
  });

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

  const handleDetailClick = (title: string, content: string) => {
    setDetailDialog({
      open: true,
      title,
      content,
    });
  };

  return (
    <SidebarHeader>
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
          sx={{
            color: "#147C65",
            textTransform: "none",
            "&:hover": {
              backgroundColor: "transparent",
              opacity: 0.8,
            },
          }}
        >
          Back
        </Button>
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
            px: 4,
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
            <Tab label="SASB" />
            <Tab label="GRI" />
          </Tabs>

          {/* Add filter components */}
          <Box sx={{ display: "flex", gap: 2 }}>
            {/* Material Issues filter */}
            <Select
              value={materialIssueFilter}
              onChange={(e) => setMaterialIssueFilter(e.target.value)}
              displayEmpty
              size="small"
              sx={{
                width: 180,
                height: 35,
                mb: 2,
                "& .MuiSelect-select": {
                  color: "#64748B",
                  py: 1,
                  bgcolor: "white",
                },
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#E2E8F0",
                },
              }}
            >
              <MenuItem value="">All Material Issues</MenuItem>
              {availableMaterialIssues.map((issue) => (
                <MenuItem key={issue.id} value={issue.name}>
                  {issue.name}
                </MenuItem>
              ))}
            </Select>

            {/* Standards filter */}
            <Select
              value={standardFilter}
              onChange={(e) => setStandardFilter(e.target.value)}
              displayEmpty
              size="small"
              sx={{
                width: 150,
                height: 35,
                mb: 2,
                "& .MuiSelect-select": {
                  color: "#64748B",
                  py: 1,
                  bgcolor: "white",
                },
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#E2E8F0",
                },
              }}
            >
              <MenuItem value="">All Standards</MenuItem>
              {standards.map((standard) => (
                <MenuItem key={standard} value={standard}>
                  {standard}
                </MenuItem>
              ))}
            </Select>
          </Box>
        </Box>
      </Box>
      <Box
        sx={{
          p: 3,
          height: "85%",
          mt: 2,
          bgcolor: "white",
          borderRadius: 2,
          boxShadow: commonBoxShadow,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden", // Prevent outer container overflow
          position: "relative", // Add this for floating button positioning
        }}
      >
        {/* Add button at top-right instead of floating at bottom */}
        {selectedDisclosures.length > 0 && (
          <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
            <Button
              variant="contained"
              startIcon={<CheckIcon />}
              onClick={handleBulkSubmit}
              sx={{
                backgroundColor: "#147C65",
                "&:hover": {
                  backgroundColor: "#0E5A4A",
                },
                textTransform: "none",
                borderRadius: "4px",
                px: 2,
              }}
            >
              Add {selectedDisclosures.length} Disclosure
              {selectedDisclosures.length > 1 ? "s" : ""}
            </Button>
          </Box>
        )}
        <Box
          sx={{
            flexGrow: 1,
            width: "100%",
            overflow: "auto", // Enable scrolling within this inner container
          }}
        >
          <DataGrid
            rows={filteredDisclosures}
            columns={columns}
            loading={loading}
            slots={{
              noRowsOverlay: CustomNoRowsOverlay,
            }}
            pagination
            autoHeight={false} // Set to false to respect container height
            initialState={{
              pagination: {
                paginationModel: { pageSize: 10, page: 0 },
              },
            }}
            sx={{
              "& .MuiDataGrid-cell": {
                px: 0,
              },
              border: "none",
              "& .MuiDataGrid-main": {
                border: "none",
              },
              "& .MuiDataGrid-virtualScroller": {
                "&::-webkit-scrollbar": {
                  width: "8px",
                  height: "4px",
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
              height: "100%", // Make DataGrid take full height of container
            }}
          />
        </Box>
        {/* Remove the floating action button */}
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
              "& p": { margin: "8px 0" },
            }}
          >
            {detailDialog.content}
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
  );
}
