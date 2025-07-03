import {
  Box,
  Typography,
  Button,
  Tabs,
  Tab,
  Switch,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import SidebarHeader from "../../Components/SidebarHeader";
import { useEffect, useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ProgressTracker } from "../../Components/progress-tracker";
import { DataGrid } from "@mui/x-data-grid";
import { api, getAuthDetails } from "../common";

// Dummy data for now - will be replaced with API call later
// const dummySelectedDisclosures = [
//   {
//     id: 1,
//     standard: "GRI 12",
//     topic_standard: "Child labor",
//     disclosure_sub_topic: "Operations &...",
//     disclosure_descriptions: "Operations &...",
//     disclosure_id: "GRI 408-1",
//     sdg_goal: "Select",
//     sdg_target: "Select",
//     add_to_report: true,
//     dimension: "Environmental",
//   },
//   {
//     id: 2,
//     standard: "GRI 12",
//     topic_standard: "Child labor",
//     disclosure_sub_topic: "Operations &...",
//     disclosure_descriptions: "Operations &...",
//     disclosure_id: "GRI 408-1",
//     sdg_goal: "Select",
//     sdg_target: "Select",
//     add_to_report: true,
//     dimension: "Environmental",
//   },
//   {
//     id: 3,
//     standard: "GRI 12",
//     topic_standard: "Child labor",
//     disclosure_sub_topic: "Operations &...",
//     disclosure_descriptions: "Operations &...",
//     disclosure_id: "GRI 408-1",
//     sdg_goal: "Select",
//     sdg_target: "Select",
//     add_to_report: true,
//     dimension: "Social",
//   },
//   {
//     id: 4,
//     standard: "GRI 12",
//     topic_standard: "Child labor",
//     disclosure_sub_topic: "Operations &...",
//     disclosure_descriptions: "Operations &...",
//     disclosure_id: "GRI 408-1",
//     sdg_goal: "Select",
//     sdg_target: "Select",
//     add_to_report: false,
//     dimension: "Governance",
//   },
// ];

const SelectedDisclosuresSummary = () => {
  const navigate = useNavigate();
  const { reportId } = useParams();
  console.log("reportId", reportId);
  const [disclosures, setDisclosures] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogContent, setDialogContent] = useState({
    title: "",
    content: "",
  });

  const [steps] = useState([
    { id: 1, title: "Setup ESG Report", type: "main", status: "complete" },
    { id: 2, title: "Create Report", type: "main", status: "complete" },
    { id: 3, title: "Select Disclosures", type: "main", status: "complete" },
    { id: 4, title: "Review Disclosures", type: "main", status: "in-progress" },
    {
      id: 5,
      title: "Steering Committee Approval",
      type: "main",
      status: "pending",
    },
    { id: 6, title: "Assign Disclosures", type: "main", status: "pending" },
  ]);

  useEffect(() => {
    const fetchDisclosuresForReport = async () => {
      if (!reportId) {
        setDisclosures([]);
        return;
      }

      // setLoading(true);
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
        // setLoading(false);
      }
    };

    fetchDisclosuresForReport();
  }, [reportId]);
  useEffect(() => {
    console.log("disclosures updated:", disclosures);
  }, [disclosures]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  // const handleAddToReportToggle = (disclosureId: number) => {
  //   setDisclosures((prev) =>
  //     prev.map((disclosure) =>
  //       disclosure.id === disclosureId
  //         ? { ...disclosure, add_to_report: !disclosure.add_to_report }
  //         : disclosure
  //     )
  //   );
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

  const handleDetailClick = (title: string, content: string) => {
    setDialogContent({ title, content });
    setDialogOpen(true);
  };

  const handleNextClick = () => {
    navigate(`/reporting-email/${reportId}`);
  };

  const handleBackClick = () => {
    navigate(-1);
  };

  const getDimensionFromTab = (tabIndex: number): string => {
    switch (tabIndex) {
      case 0:
        return "Environmental";
      case 1:
        return "Social";
      case 2:
        return "Governance";
      default:
        return "Environmental";
    }
  };

  // const filteredDisclosures = disclosures.filter(
  //   (disclosure) => disclosure.dimension === getDimensionFromTab(activeTab)
  // );

  const filteredDisclosures = disclosures.filter(
    (disclosure) =>
      disclosure.dimension === getDimensionFromTab(activeTab) &&
      disclosure.response?.is_added === true
  );
  const commonBoxShadow = "0px 2px 4px rgba(0, 0, 0, 0.1)";
  // Box styles for clickable content
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

  const commonBoxStylesWithMargin = {
    ...commonBoxStyles,
    ml: 5,
    mx: 0,
    width: "90%",
  };

  const columns = [
    {
      field: "disclosure_id",
      headerName: "STANDARDS",
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
      field: "topic_standard",
      headerName: "TOPIC STANDARD",
      flex: 1.2,
      minWidth: 120,
      renderCell: (params: any) => (
        <Box
          sx={commonBoxStyles}
          onClick={() =>
            handleDetailClick("Topic Standard", params.row.standard_name)
          }
        >
          {params.row.standard_name}
        </Box>
      ),
    },
    {
      field: "sub_topic_name", // dummy field name, not nested
      headerName: "DISCLOSURE SUB TOPIC",
      flex: 1.2,
      minWidth: 140,
      renderCell: (params: any) => (
        <Box
          sx={commonBoxStylesWithMargin}
          onClick={() =>
            handleDetailClick("Disclosure Sub Topic", params.row.sub_topic.name)
          }
        >
          {params.row.sub_topic.name}
        </Box>
      ),
    },

    {
      field: "disclosure_description",
      headerName: "DISCLOSURE DESCRIPTIONS",
      flex: 1.5,
      minWidth: 160,
      renderCell: (params: any) => (
        <Box
          sx={commonBoxStylesWithMargin}
          onClick={() =>
            handleDetailClick("Disclosure Descriptions", params.value)
          }
        >
          {params.value}
        </Box>
      ),
    },

    {
      field: "disclosure_id",
      headerName: "DISCLOSURE ID",
      flex: 1,
      minWidth: 110,
      renderCell: (params: any) => (
        <Box
          sx={commonBoxStylesWithMargin}
          onClick={() => handleDetailClick("Disclosure ID", params.value)}
        >
          {params.value}
        </Box>
      ),
    },
    {
      field: "sdg_goal",
      headerName: "SDG GOAL",
      flex: 0.8,
      minWidth: 90,
      renderCell: (params: any) => (
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
      field: "sdg_target",
      headerName: "SDG TARGET",
      flex: 0.8,
      minWidth: 100,
      renderCell: (params: any) => (
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
  field: "add_to_report",
  headerName: "ADD TO REPORT",
  flex: 1,
  minWidth: 120,
  renderCell: (params) => {
    const isAdded = params.row.response?.is_added === true;

    const handleToggle = () => {
      const newValue = isAdded ? "no" : "yes"; // toggle logic
      handleResponseChange(params.row.dis_id, newValue);
    };

    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
        }}
      >
        <Switch
          checked={isAdded}
          onChange={handleToggle}
          color="success"
          size="medium"
        />
      </Box>
    );
  },
}

  ];

  // Calculate disclosure counts for each dimension
  const dimensionCounts = useMemo(() => {
    if (!disclosures || disclosures.length === 0)
      return {
        Environmental: 0,
        Social: 0,
        Governance: 0,
      };

    // Filter disclosures that are added to report
    const addedDisclosures = disclosures.filter(
      (disclosure) => disclosure.response?.is_added === true
    );

    return addedDisclosures.reduce((acc, disclosure) => {
      if (disclosure.dimension) {
        acc[disclosure.dimension] = (acc[disclosure.dimension] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);
  }, [disclosures]);

  return (
    <>
      <SidebarHeader>
        <Box sx={{ width: "100%", mb: 2, boxShadow: "none" }}>
          <ProgressTracker steps={steps} currentStep={4} />

          <Box sx={{ mt: 3, mb: 3 }}>
            <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
              Review Disclosures
            </Typography>
          </Box>

          {/* Tabs for Environment, Social, Governance */}
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

          {/* DataGrid */}
          <Box sx={{ height: 400, width: "100%" }}>
            <DataGrid
              rows={filteredDisclosures || []}
              columns={columns}
              pageSize={5}
              getRowId={(row) => row.dis_id}
              rowsPerPageOptions={[5]}
              disableSelectionOnClick
              sx={{
                border: "none",
                "& .MuiDataGrid-cell": {
                  borderBottom: "1px solid #f0f0f0",
                },
                "& .MuiDataGrid-columnHeaders": {
                  backgroundColor: "#f8f9fa",
                  fontWeight: 600,
                  fontSize: "0.875rem",
                },
                "& .MuiDataGrid-row:hover": {
                  backgroundColor: "#f8f9fa",
                },
              }}
            />
          </Box>

          {/* Navigation Buttons */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              gap: 2,
              mt: 4,
              pt: 3,
              borderTop: "1px solid #e0e0e0",
            }}
          >
            <Button
              variant="outlined"
              onClick={handleBackClick}
              sx={{
                minWidth: "120px",
                borderColor: "#9E9E9E",
                color: "#9E9E9E",
                "&:hover": {
                  borderColor: "#757575",
                  color: "#757575",
                  backgroundColor: "#f5f5f5",
                },
              }}
            >
              Back
            </Button>

            <Button
              variant="contained"
              onClick={handleNextClick}
              sx={{
                minWidth: "120px",
                backgroundColor: "#00897B",
                "&:hover": {
                  backgroundColor: "#00695C",
                },
              }}
            >
              Next
            </Button>
          </Box>
        </Box>
      </SidebarHeader>

      {/* Detail Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>{dialogContent.title}</DialogTitle>
        <DialogContent>
          <Typography variant="body1">{dialogContent.content}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default SelectedDisclosuresSummary;
