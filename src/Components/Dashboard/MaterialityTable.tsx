import React from "react";
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Select,
  MenuItem,
  Tooltip,
} from "@mui/material";
import { ArrowBack, ArrowForward } from "@mui/icons-material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

interface TableRow {
  id: string;
  name: string;
  dimension: string;
  internalStatus: string;
  externalStatus: string;
  averageStatus: string;
  internalDetails: any;
  externalDetails: any;
  combinedDetails: any;
}

interface MaterialityTableProps {
  surveyType?: string;
  tableData: TableRow[];
  showTopN: number;
  onShowTopNChange: (value: number) => void;
  page: number;
  rowsPerPage: number;
  onPageChange: (newPage: number) => void;
}

const MaterialityTable: React.FC<MaterialityTableProps> = ({
  surveyType,
  tableData,
  showTopN,
  onShowTopNChange,
  page,
  rowsPerPage,
  onPageChange,
}) => {
  // Helper functions for tooltips
  const getInternalFormulaTooltip = () => {
    if (surveyType === "double") {
      return "Impact Materiality Score - Represents the importance of this issue on environment, people, and economy";
    }
    return "Internal Impact Score = Severity × Likelihood";
  };

  const getExternalFormulaTooltip = () => {
    if (surveyType === "double") {
      return "Financial Materiality Score - Represents the importance of this issue on enterprise value";
    }
    return "External Impact Score = Severity × Likelihood";
  };

  const getCombinedFormulaTooltip = () => {
    if (surveyType === "double") {
      return "Combined Impact Score = Overall disclosure rating from both financial and impact materiality";
    }
    return "Combined Impact Score = (Internal_Respondents × Internal_Score + External_Respondents × External_Score) / Total_Respondents";
  };

  // Helper functions for row tooltips
  const getInternalTooltip = (row: TableRow) => {
    if (surveyType === "double") {
      if (!row.internalDetails || !row.internalDetails.disclosure_rating)
        return "No data available";
      return `Impact Materiality Score: ${row.internalDetails.disclosure_rating.toFixed(
        1
      )}`;
    } else {
      if (!row.internalDetails) return "No data available";
      const { avg_severity, avg_likelihood } = row.internalDetails;
      return `Severity: ${avg_severity} × Likelihood: ${avg_likelihood} = ${row.internalStatus}`;
    }
  };

  const getExternalTooltip = (row: TableRow) => {
    if (surveyType === "double") {
      if (!row.externalDetails || !row.externalDetails.disclosure_rating)
        return "No data available";
      return `Financial Materiality Score: ${row.externalDetails.disclosure_rating.toFixed(
        1
      )}`;
    } else {
      if (!row.externalDetails) return "No data available";
      const { avg_severity, avg_likelihood } = row.externalDetails;
      return `Severity: ${avg_severity} × Likelihood: ${avg_likelihood} = ${row.externalStatus}`;
    }
  };

  const getCombinedTooltip = (row: TableRow) => {
    if (
      surveyType === "double" &&
      row.combinedDetails.disclosure_rating !== undefined
    ) {
      return `Overall Rating: ${row.combinedDetails.disclosure_rating.toFixed(
        1
      )}`;
    } else if (row.combinedDetails.avg_severity === "NA") {
      return "Insufficient data for combined calculation";
    }

    const { avg_severity, avg_likelihood } = row.combinedDetails;
    return `Combined Score = ${avg_severity} × ${avg_likelihood} = ${row.averageStatus}`;
  };

  // Get rating style based on value
  const getRatingStyle = (rating: number) => {
    if (rating < 5) {
      return {
        backgroundColor: "#FFE0E0",
        color: "#D45D5D",
        "&:hover": {
          backgroundColor: "#FFE0E0",
        },
      };
    } else {
      return {
        backgroundColor: "#D4EDDA",
        color: "#155724",
        "&:hover": {
          backgroundColor: "#D4EDDA",
        },
      };
    }
  };

  // Get filtered data based on showTopN setting
  const getFilteredTableData = () => {
    if (showTopN > 0) {
      return tableData
        .sort((a, b) => parseInt(b.averageStatus) - parseInt(a.averageStatus))
        .slice(0, showTopN);
    }
    return tableData;
  };

  // Calculate pagination data
  const filteredData = getFilteredTableData();
  const totalItems = filteredData.length;
  const start = page * rowsPerPage;
  const slicedData = filteredData.slice(start, start + rowsPerPage);
  const startIndex = page * rowsPerPage + 1;
  const endIndex = Math.min((page + 1) * rowsPerPage, totalItems);

  // Pagination handlers
  const handleNextPage = () => {
    if (endIndex < totalItems) {
      onPageChange(page + 1);
    }
  };

  const handlePreviousPage = () => {
    if (page > 0) {
      onPageChange(page - 1);
    }
  };

  return (
    <Box sx={{ bgcolor: "background.paper", borderRadius: 2, p: 2 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h6">
          {surveyType === "double"
            ? "Material Issues Table"
            : "All Disclosures"}
        </Typography>
        <Select
          size="small"
          value={showTopN}
          onChange={(e) => onShowTopNChange(Number(e.target.value))}
          sx={{
            minWidth: 120,
            height: 35,
            ".MuiSelect-select": {
              color: showTopN > 0 ? "#147C65" : "inherit",
            },
            "&.MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: "#E2E8F0",
              },
            },
          }}
        >
          <MenuItem value={0}>Show All</MenuItem>
          <MenuItem value={2}>Top 2</MenuItem>
          <MenuItem value={3}>Top 3</MenuItem>
          <MenuItem value={5}>Top 5</MenuItem>
          <MenuItem value={8}>Top 8</MenuItem>
        </Select>
      </Box>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                {surveyType === "double" ? "Material Issue" : "Disclosure"}
              </TableCell>
              <TableCell>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  INTERNAL STAKEHOLDERS
                  <Tooltip
                    title={getInternalFormulaTooltip()}
                    arrow
                    placement="top"
                    sx={{ cursor: "help" }}
                  >
                    <InfoOutlinedIcon fontSize="small" />
                  </Tooltip>
                </Box>
              </TableCell>
              <TableCell>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  EXTERNAL STAKEHOLDERS
                  <Tooltip
                    title={getExternalFormulaTooltip()}
                    arrow
                    placement="top"
                    sx={{ cursor: "help" }}
                  >
                    <InfoOutlinedIcon fontSize="small" />
                  </Tooltip>
                </Box>
              </TableCell>
              <TableCell>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  COMBINED
                  <Tooltip
                    title={getCombinedFormulaTooltip()}
                    arrow
                    placement="top"
                    sx={{ cursor: "help" }}
                  >
                    <InfoOutlinedIcon fontSize="small" />
                  </Tooltip>
                </Box>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {slicedData.map((row) => (
              <TableRow key={row.id}>
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Typography color="#147C65">{row.name}</Typography>
                  </Box>
                </TableCell>
                <TableCell sx={{ textAlign: "center" }}>
                  {row.internalStatus !== "-" ? (
                    <Tooltip
                      title={getInternalTooltip(row)}
                      arrow
                      placement="top"
                    >
                      <Button
                        size="small"
                        variant="contained"
                        sx={{
                          ...getRatingStyle(Number(row.internalStatus)),
                          textTransform: "none",
                          minWidth: "60px",
                          px: 2,
                          boxShadow: "none",
                        }}
                      >
                        {Number(row.internalStatus).toFixed(1)}
                      </Button>
                    </Tooltip>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      -
                    </Typography>
                  )}
                </TableCell>
                <TableCell sx={{ textAlign: "center" }}>
                  {row.externalStatus !== "-" ? (
                    <Tooltip
                      title={getExternalTooltip(row)}
                      arrow
                      placement="top"
                    >
                      <Button
                        size="small"
                        variant="contained"
                        sx={{
                          ...getRatingStyle(Number(row.externalStatus)),
                          textTransform: "none",
                          minWidth: "60px",
                          px: 2,
                          boxShadow: "none",
                        }}
                      >
                        {Number(row.externalStatus).toFixed(1)}
                      </Button>
                    </Tooltip>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      -
                    </Typography>
                  )}
                </TableCell>
                <TableCell sx={{ textAlign: "center" }}>
                  {row.averageStatus !== "-" ? (
                    <Tooltip
                      title={getCombinedTooltip(row)}
                      arrow
                      placement="top"
                    >
                      <Button
                        size="small"
                        variant="contained"
                        sx={{
                          ...getRatingStyle(Number(row.averageStatus)),
                          textTransform: "none",
                          minWidth: "60px",
                          px: 2,
                          boxShadow: "none",
                        }}
                      >
                        {Number(row.averageStatus).toFixed(1)}
                      </Button>
                    </Tooltip>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      -
                    </Typography>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mt: 2,
          px: 2,
        }}
      >
        <Typography variant="body2" color="text.secondary">
          {`${startIndex}-${endIndex} of ${totalItems}`}
        </Typography>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            size="small"
            sx={{
              color: "#147C65 !important",
              border: "1px solid #E2E8F0",
              backgroundColor: "white",
              padding: "5px 10px",
              textTransform: "none",
            }}
            startIcon={<ArrowBack />}
            disabled={page === 0}
            onClick={handlePreviousPage}
          >
            Previous
          </Button>
          <Button
            size="small"
            sx={{
              color: "#147C65 !important",
              border: "1px solid #E2E8F0",
              backgroundColor: "white",
              padding: "5px 10px",
              textTransform: "none",
            }}
            endIcon={<ArrowForward />}
            disabled={endIndex >= totalItems}
            onClick={handleNextPage}
          >
            Next
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default MaterialityTable;
