import React from "react";
import { Box, Typography } from "@mui/material";
import { Chart } from "react-google-charts";

interface SurveyAggregate {
  dimension_summary: {
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
  };
}

interface ImpactAnalysisProps {
  surveyAggregate: SurveyAggregate | null;
  hasImpactDisclosures: boolean;
}

const ImpactAnalysis: React.FC<ImpactAnalysisProps> = ({
  surveyAggregate,
  hasImpactDisclosures,
}) => {
  if (!hasImpactDisclosures) return null;

  const getImpactData = () => {
    // If no survey aggregate data is missing
    if (!surveyAggregate)
      return [["Internal Impact", "External Impact", { role: "tooltip" }]];

    // For single survey type, create internal vs external comparison
    const dimensionData = surveyAggregate.dimension_summary;
    const points = [
      ["Internal Impact", "External Impact", { role: "tooltip" }],
    ];

    Object.entries(dimensionData).forEach(([dimension, disclosures]) => {
      Object.entries(disclosures).forEach(([disclosureId, data]) => {
        // Only include if we have both internal and external data
        if (data.internal && data.external) {
          const internalImpact =
            data.internal.avg_severity * data.internal.avg_likelihood;
          const externalImpact =
            data.external.avg_severity * data.external.avg_likelihood;

          points.push([
            internalImpact,
            externalImpact,
            `${disclosureId} - ${dimension}\nInternal Impact: ${internalImpact.toFixed(
              1
            )}\nExternal Impact: ${externalImpact.toFixed(1)}`,
          ]);
        }
      });
    });

    return points.length > 1
      ? points
      : [
          ["Internal Impact", "External Impact", { role: "tooltip" }],
          [0, 0, "No data"],
        ];
  };

  const getSingleSurveyScatterOptions = () => {
    return {
      title: "Internal vs External Impact Comparison",
      hAxis: {
        title: "Internal Impact Score",
        min: 0,
        max: 25,
        gridlines: { count: 6 },
        viewWindow: { min: 0, max: 25 },
      },
      vAxis: {
        title: "External Impact Score",
        min: 0,
        max: 25,
        gridlines: { count: 6 },
        viewWindow: { min: 0, max: 25 },
      },
      legend: "none",
      colors: ["#4285F4"],
      pointSize: 8,
      backgroundColor: "transparent",
      chartArea: {
        width: "80%",
        height: "80%",
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
  };

  return (
    <Box sx={{ bgcolor: "background.paper", borderRadius: 2, p: 2, mb: 4 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Impact Analysis
      </Typography>
      <Chart
        chartType="ScatterChart"
        width="100%"
        height="400px"
        data={getImpactData()}
        options={getSingleSurveyScatterOptions()}
      />
    </Box>
  );
};

export default ImpactAnalysis;
