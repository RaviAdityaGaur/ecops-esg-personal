import { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import {
  CircularProgress,
  Box,
  Typography,
  IconButton,
  Tooltip,
} from "@mui/material";
import { Info } from "lucide-react";
import { api } from "../common";
import SidebarHeader from "../../Components/SidebarHeader";
import { useNavigate } from "react-router-dom";

const ViewReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reportingPeriods, setReportingPeriods] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // First fetch reporting periods
        const periodsResponse = await api
          .get("esg/api/esg-reporting-period/")
          .json();
        setReportingPeriods(periodsResponse);

        // Then fetch and process reports
        const reportsResponse = await api
          .get("esg/api/reporting/")
          .json();
        const enhancedData = reportsResponse.map((report) => {
          const date = new Date(report.created_at);
          const formattedDate = date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          });

          // Find matching reporting period from the fetched periods
          const matchingPeriod = periodsResponse.find(
            (period) => period.id === report.reporting_period
          );
          const formattedReportingPeriod = matchingPeriod
            ? `${matchingPeriod.name} (${matchingPeriod.type_of_year} ${matchingPeriod.year})`
            : "-";

          return {
            ...report,
            total_disclosures: {
              mandatory: report.total_external_disclosures || 0,
              optional: report.total_internal_disclosures || 0,
            },
            response_received: {
              mandatory: report.total_external_responses || 0,
              optional: report.total_internal_responses || 0,
            },
            reporting_period: formattedReportingPeriod,
            created_by: report.created_by_username || "Not Assigned",
            created_date: formattedDate || "-",
          };
        });
        setReports(enhancedData);
      } catch (error) {
        console.error("Error loading data:", error);
        setReportingPeriods([]);
        setReports([]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleAction = async (reportId, status) => {
    try {
      switch (status) {
        case "DRAFT":
          navigate(`/report-details/${reportId}`);
          break;
        case "IN_PROGRESS":
          navigate(`/task-management?reportId=${reportId}`);
          break;
        case "UNDER_REVIEW":
          navigate(`/report-review/${reportId}`);
          break;
        case "COMPLETED":
          navigate(`/report-view/${reportId}`);
          break;
        case "PUBLISHED":
          navigate(`/published-report/${reportId}`);
          break;
        default:
          console.log("Unknown status:", status);
          navigate(`/report-details/${reportId}`);
          break;
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const columns = [
    {
      field: "name",
      headerName: "Report Name",
      width: 200,
      renderCell: (params) => (
        <Box sx={{ display: "flex", alignItems: "center", height: "100%" }}>
          <Typography sx={{ color: "#147C65", fontWeight: 500 }}>
            {params.value}
          </Typography>
        </Box>
      ),
    },
    {
      field: "total_disclosures",
      headerName: "Total Disclosures",
      width: 180,
      renderCell: (params) => (
        <Box
          sx={{ display: "flex", gap: 1, alignItems: "center", height: "100%" }}
        >
          <Tooltip title="External" arrow placement="top">
            <Typography
              sx={{
                padding: "4px 12px",
                boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                borderRadius: "4px",
                backgroundColor: "#fff",
              }}
            >
              {params.row.total_disclosures.mandatory}
            </Typography>
          </Tooltip>
          <Tooltip title="Internal" arrow placement="top">
            <Typography
              sx={{
                padding: "4px 12px",
                boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                borderRadius: "4px",
                backgroundColor: "#fff",
              }}
            >
              {params.row.total_disclosures.optional}
            </Typography>
          </Tooltip>
        </Box>
      ),
    },
    {
      field: "response_received",
      headerName: "Response Received",
      width: 180,
      renderCell: (params) => (
        <Box
          sx={{ display: "flex", gap: 1, alignItems: "center", height: "100%" }}
        >
          <Tooltip title="External" arrow placement="top">
            <Typography
              sx={{
                padding: "4px 12px",
                boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                borderRadius: "4px",
                backgroundColor: "#fff",
              }}
            >
              {params.row.response_received.mandatory}
            </Typography>
          </Tooltip>
          <Tooltip title="Internal" arrow placement="top">
            <Typography
              sx={{
                padding: "4px 12px",
                boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                borderRadius: "4px",
                backgroundColor: "#fff",
              }}
            >
              {params.row.response_received.optional}
            </Typography>
          </Tooltip>
        </Box>
      ),
    },
    {
      field: "reporting_period",
      headerName: "Reporting Period",
      width: 180,
    },
    {
      field: "created_by",
      headerName: "Created By",
      width: 180,
    },
    {
      field: "created_date",
      headerName: "Created Date",
      width: 150,
    },
    {
      field: "status",
      headerName: "Status",
      width: 150,
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 100,
      renderCell: (params) => (
        <IconButton
          onClick={() => handleAction(params.row.id, params.row.status)}
          sx={{
            color: "#147C65",
            "&:hover": {
              backgroundColor: "rgba(20, 124, 101, 0.04)",
            },
          }}
        >
          <Info size={20} />
        </IconButton>
      ),
    },
  ];


  
  // Helper function to get status background color
  const getStatusColor = (status) => {
    switch (status) {
      case "DRAFT":
        return "#f3f4f6";
      case "IN_PROGRESS":
        return "#dbeafe";
      case "UNDER_REVIEW":
        return "#fef3c7";
      case "COMPLETED":
        return "#d1fae5";
      case "PUBLISHED":
        return "#e0e7ff";
      default:
        return "#f3f4f6";
    }
  };

  // Helper function to get status text color
  const getStatusTextColor = (status) => {
    switch (status) {
      case "DRAFT":
        return "#6b7280";
      case "IN_PROGRESS":
        return "#1e40af";
      case "UNDER_REVIEW":
        return "#92400e";
      case "COMPLETED":
        return "#065f46";
      case "PUBLISHED":
        return "#3730a3";
      default:
        return "#6b7280";
    }
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="80vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <SidebarHeader title="All Reports">
      <Box
        p={3}
        sx={{ backgroundColor: "#fff", borderRadius: "10px" }}
        height="70vh"
      >
        <DataGrid
          rows={reports}
          columns={columns}
          disableRowSelectionOnClick
          sx={{
            border: "none",
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: "#fff",
              borderBottom: "1px solid #E5E7EB",
              "& .MuiDataGrid-columnHeader": {
                paddingTop: 2,
                paddingBottom: 2,
              },
            },
            "& .MuiDataGrid-cell": {
              borderBottom: "1px solid #E5E7EB",
            },
            "& .MuiDataGrid-footerContainer": {
              borderTop: "none",
            },
          }}
          initialState={{
            pagination: {
              paginationModel: { pageSize: 10 },
            },
          }}
          pageSizeOptions={[10]}
        />
      </Box>
    </SidebarHeader>
  );
};

export default ViewReports;
