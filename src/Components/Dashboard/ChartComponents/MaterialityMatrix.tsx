import React from "react";
import {
  Box,
  Typography,
  Button,
  Select,
  MenuItem,
  Tooltip,
} from "@mui/material";
import { Chart } from "react-google-charts";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

interface MaterialitySummary {
  [dimension: string]: {
    [disclosure_id: string]: {
      internal?: {
        impact_severity: number;
        impact_likelihood: number;
        impact_materiality: number;
        financial_materiality: number;
        final_impact_materiality: number;
        final_financial_materiality: number;
        disclosure_rating: number;
        disclosure_rating_percent: number;
        count: number;
      };
      external?: {
        impact_severity: number;
        impact_likelihood: number;
        impact_materiality: number;
        financial_materiality: number;
        final_impact_materiality: number;
        final_financial_materiality: number;
        disclosure_rating: number;
        disclosure_rating_percent: number;
        count: number;
      };
      overall_double_materiality: number;
    };
  };
}

interface DimensionSummary {
  [dimension: string]: {
    [disclosure: string]: {
      internal?: {
        avg_severity: number;
        avg_likelihood: number;
      };
      external?: {
        avg_severity: number;
        avg_likelihood: number;
      };
      combined: {
        avg_severity: string | number;
        avg_likelihood: string | number;
      };
    };
  };
}

interface MaterialityMatrixProps {
  surveyType?: string;
  activeFilters: string[];
  stakeholderFilter: string;
  onFilterToggle: (filter: string) => void;
  onStakeholderFilterChange: (stakeholderType: string) => void;
  dimensionSummary?: DimensionSummary;
  materiality_summary?: MaterialitySummary;
}

const filterButtonStyle = {
  color: "#147C65",
  border: "1px solid #E2E8F0",
  backgroundColor: "white",
  padding: "5px 15px",
  textTransform: "none",
  "&.active": {
    backgroundColor: "#147C65",
    color: "white",
  },
};

const MaterialityMatrix: React.FC<MaterialityMatrixProps> = ({
  surveyType,
  activeFilters,
  stakeholderFilter,
  onFilterToggle,
  onStakeholderFilterChange,
  dimensionSummary,
  materiality_summary,
}) => {
  // Derive data for the scatter chart
  const getFilteredScatterData = () => {
    if (surveyType === "double" && materiality_summary) {
      // For double materiality, use the materiality_summary data
      const points = [
        ["Impact to Business", "Impact to Stakeholders", { role: "tooltip" }],
      ];

      // Function to convert numeric values to text labels
      const getTextLabel = (value) => {
        if (value <= 0.5) return "Very Low";
        if (value <= 1.5) return "Low";
        if (value <= 2.5) return "Moderate";
        if (value <= 3.5) return "High";
        return "Very High";
      };

      // Process materiality_summary for the materiality matrix
      Object.entries(materiality_summary).forEach(
        ([dimension, disclosures]) => {
          // First normalize dimension for case-insensitive comparison
          const normalizedDimension = dimension.toLowerCase();

          // Skip if this dimension is filtered out
          if (
            !activeFilters.includes("all") &&
            !activeFilters.includes(normalizedDimension)
          ) {
            return;
          }

          // Process each disclosure in this dimension
          Object.entries(disclosures).forEach(([disclosureId, data]) => {
            if (disclosureId === "null") return; // Skip entries with null disclosure ID

            // Get the correct data based on stakeholder filter
            const relevantData =
              stakeholderFilter === "internal" ? data.internal : data.external;

            if (!relevantData) return;

            // Use financial_materiality for x-axis and impact_materiality for y-axis
            const businessImpact =
              relevantData.final_financial_materiality || 0;
            const stakeholderImpact =
              relevantData.final_impact_materiality || 0;

            // Create enhanced tooltip with text labels
            const tooltipText = `${disclosureId} - ${dimension}
  Impact to Business: ${businessImpact.toFixed(2)} (${getTextLabel(
              businessImpact
            )})
  Impact to Stakeholders: ${stakeholderImpact.toFixed(2)} (${getTextLabel(
              stakeholderImpact
            )})`;

            points.push([businessImpact, stakeholderImpact, tooltipText]);
          });
        }
      );

      return points.length > 1
        ? points
        : [
            [
              "Impact to Business",
              "Impact to Stakeholders",
              { role: "tooltip" },
            ],
            [0, 0, "No data"],
          ];
    } else if (!dimensionSummary) {
      return [
        ["Impact to Business", "Impact to Stakeholders", { role: "tooltip" }],
      ];
    }

    // Fallback to original implementation for regular materiality surveys
    const points = [["Severity", "Likelihood", { role: "tooltip" }]];

    // For debugging - count available points and filtered points
    let totalPoints = 0;
    let filteredPoints = 0;
    let renderedPoints = 0;

    Object.entries(dimensionSummary).forEach(([dimension, disclosures]) => {
      // First normalize dimension for case-insensitive comparison
      const normalizedDimension = dimension.toLowerCase();
      totalPoints += Object.keys(disclosures).length;

      // Check filters - show if 'all' is selected or this specific dimension is selected
      if (
        !activeFilters.includes("all") &&
        !activeFilters.includes(normalizedDimension)
      ) {
        filteredPoints += Object.keys(disclosures).length;
        return;
      }

      Object.entries(disclosures).forEach(([disclosureId, data]) => {
        // Get the correct data based on stakeholder filter
        const relevantData =
          stakeholderFilter === "internal" ? data.internal : data.external;

        if (!relevantData) {
          return;
        }

        // Verify we have numeric severity and likelihood values
        if (
          typeof relevantData.avg_severity !== "number" ||
          typeof relevantData.avg_likelihood !== "number"
        ) {
          return;
        }

        // Use valid data for the point
        const severity = Math.max(0, relevantData.avg_severity);
        const likelihood = Math.max(0, relevantData.avg_likelihood);

        points.push([
          severity,
          likelihood,
          `${disclosureId} - ${dimension}\nSeverity: ${severity.toFixed(
            2
          )}\nLikelihood: ${likelihood.toFixed(2)}`,
        ]);
        renderedPoints++;
      });
    });

    console.log(
      `Materiality Matrix: Total points: ${totalPoints}, Filtered out: ${filteredPoints}, Rendered: ${renderedPoints}`
    );

    return points.length > 1
      ? points
      : [
          ["Severity", "Likelihood", { role: "tooltip" }],
          [0, 0, "No data"],
        ];
  };

  const scatterOptions = {
    title: "Disclosure mapping",
    hAxis: {
      title: "Impact to Business",
      min: 0,
      max: 4,
      gridlines: { count: 5 },
      viewWindow: { min: 0, max: 4 },
      ticks: [
        { v: 0, f: "Very Low" },
        { v: 1, f: "Low" },
        { v: 2, f: "Moderate" },
        { v: 3, f: "High" },
        { v: 4, f: "Very High" },
      ],
      textPosition: "out",
      titleTextStyle: {
        fontSize: 12,
        italic: false,
      },
      textStyle: {
        fontSize: 11,
      },
    },
    vAxis: {
      title: "Impact to Stakeholders",
      min: 0,
      max: 4,
      gridlines: { count: 5 },
      viewWindow: { min: 0, max: 4 },
      ticks: [
        { v: 0, f: "" }, // Remove the "Very Low" text on vAxis at position 0
        { v: 1, f: "Low" },
        { v: 2, f: "Moderate" },
        { v: 3, f: "High" },
        { v: 4, f: "Very High" },
      ],
      textPosition: "out",
      titleTextStyle: {
        fontSize: 12,
        italic: false,
      },
      textStyle: {
        fontSize: 11,
      },
    },
    legend: "none",
    colors: ["#FF8989"],
    pointSize: 8,
    backgroundColor: "transparent",
    chartArea: {
      width: "75%",
      height: "75%",
      left: "15%",
      top: "15%",
      backgroundColor: {
        stroke: "#ccc",
        strokeWidth: 1,
      },
    },
    tooltip: {
      isHtml: false,
      trigger: "both",
    },
  };

  return (
    <Box sx={{ flex: 3, bgcolor: "background.paper", borderRadius: 2, p: 2 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h6">Materiality Matrix</Typography>
        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          <Select
            size="small"
            value={stakeholderFilter}
            onChange={(e) => onStakeholderFilterChange(e.target.value)}
            sx={{
              minWidth: 120,
              height: 35,
              ".MuiSelect-select": {
                color: "#147C65",
              },
              "&.MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "#E2E8F0",
                },
              },
            }}
          >
            <MenuItem value="internal">Internal</MenuItem>
            <MenuItem value="external">External</MenuItem>
          </Select>
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button
              size="small"
              sx={{
                ...filterButtonStyle,
                ...(activeFilters.includes("all") &&
                  filterButtonStyle["&.active"]),
              }}
              onClick={() => onFilterToggle("all")}
            >
              All
            </Button>
            <Button
              size="small"
              sx={{
                ...filterButtonStyle,
                ...(activeFilters.includes("environmental") &&
                  filterButtonStyle["&.active"]),
              }}
              onClick={() => onFilterToggle("environmental")}
            >
              Environmental
            </Button>
            <Button
              size="small"
              sx={{
                ...filterButtonStyle,
                ...(activeFilters.includes("social") &&
                  filterButtonStyle["&.active"]),
              }}
              onClick={() => onFilterToggle("social")}
            >
              Social
            </Button>
            <Button
              size="small"
              sx={{
                ...filterButtonStyle,
                ...(activeFilters.includes("governance") &&
                  filterButtonStyle["&.active"]),
              }}
              onClick={() => onFilterToggle("governance")}
            >
              Governance
            </Button>
          </Box>
        </Box>
      </Box>
      <Chart
        chartType="ScatterChart"
        width="100%"
        height="400px"
        data={getFilteredScatterData()}
        options={scatterOptions}
      />
    </Box>
  );
};

export default MaterialityMatrix;
