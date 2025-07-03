import React from "react";
import { Box, Paper, Typography } from "@mui/material";
import StatItem from "./StatItem";

interface MaterialityStats {
  survey: {
    id: number;
    name: string;
  };
  total_disclosures: number;
  stakeholder_totals: Array<{
    stakeholder_type: string;
    total: number;
  }>;
  dimension_totals: Array<{
    survey_disclosure__disclosure__dimension: string;
    total: number;
  }>;
  stakeholder_dimension_totals: Array<{
    stakeholder_type: string;
    survey_disclosure__disclosure__dimension: string;
    total: number;
  }>;
}

interface SurveyAggregate {
  total_respondents?: {
    internal: number;
    external: number;
  };
}

interface StakeholderSummaryProps {
  type: "internal" | "external";
  materialityStats: MaterialityStats | null;
  surveyAggregate: SurveyAggregate | null;
}

const StakeholderSummary: React.FC<StakeholderSummaryProps> = ({
  type,
  materialityStats,
  surveyAggregate,
}) => {
  const totalDisclosures =
    materialityStats?.stakeholder_totals
      .find((item) => item.stakeholder_type === type)
      ?.total.toString() || "0";

  const totalRespondents =
    surveyAggregate?.total_respondents?.[type]?.toString() || "0";

  const dimensionTotals =
    materialityStats?.stakeholder_dimension_totals.filter(
      (item) => item.stakeholder_type === type
    ) || [];

  const stakeholderTotalCount =
    materialityStats?.stakeholder_totals.find(
      (st) => st.stakeholder_type === type
    )?.total || 1;

  return (
    <Paper elevation={0} sx={{ flex: 1, p: 3, borderRadius: 2 }}>
      <Typography variant="h6" sx={{ mb: 3 }}>
        {type === "internal" ? "Internal" : "External"} Stakeholder Survey
      </Typography>
      <Box sx={{ display: "flex", justifyContent: "space-between", gap: 1 }}>
        <Box>
          <StatItem label="Total Disclosures" value={totalDisclosures} icon />
          <StatItem label="Respondents" value={totalRespondents} icon />
        </Box>
        <Box>
          {dimensionTotals.map((item) => (
            <StatItem
              key={item.survey_disclosure__disclosure__dimension}
              label={item.survey_disclosure__disclosure__dimension}
              value={item.total.toString()}
              percentage={`${(
                (item.total / stakeholderTotalCount) *
                100
              ).toFixed(2)}%`}
              icon
            />
          ))}
        </Box>
      </Box>
    </Paper>
  );
};

export default StakeholderSummary;
