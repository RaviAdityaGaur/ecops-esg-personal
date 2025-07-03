import React from "react";
import { Box, Typography } from "@mui/material";
import { Chart } from "react-google-charts";

interface StakeholderRelationship {
  survey: {
    id: number;
    name: string;
  };
  stakeholder_relationship_totals: {
    stake_holder_breakup: Array<{
      created_by: number;
      total: number;
      relationship_with_company: string;
    }>;
    [key: string]: any;
  };
}

interface StakeholderResponseChartProps {
  stakeholderRelationship: StakeholderRelationship | null;
}

const createBarOptions = (maxValue = 100) => {
  // Calculate a reasonable max value (round up to next multiple of 5)
  const roundedMax = Math.ceil(maxValue / 5) * 5;

  // Create appropriate ticks based on the data range
  const tickCount = Math.min(6, roundedMax + 1); // Cap at 6 ticks for readability
  const ticks = Array.from({ length: tickCount }, (_, i) =>
    Math.round(i * (roundedMax / (tickCount - 1)))
  );

  return {
    title: "Top survey Response by Stakeholders",
    backgroundColor: "transparent",
    bar: { groupWidth: "50%" },
    legend: { position: "none" },
    vAxis: {
      title: "Response Count",
      minValue: 0,
      maxValue: roundedMax,
      ticks: ticks,
      gridlines: { count: tickCount },
    },
    hAxis: {
      title: "Stakeholders",
      textStyle: { fontSize: 10 },
    },
  };
};

const StakeholderResponseChart: React.FC<StakeholderResponseChartProps> = ({
  stakeholderRelationship,
}) => {
  // Default data if none is provided
  const defaultBarData = [
    ["Category", "Response Rate", { role: "style" }],
    ["Partners", 75, "#D9D9D9"],
    ["Customers", 85, "#D08383"],
    ["Suppliers", 60, "#D186C6"],
    ["Employees", 90, "#D5E197"],
  ];

  // Get chart data based on stakeholder relationship data
  const getBarData = () => {
    if (!stakeholderRelationship) return defaultBarData;

    const colors = ["#D9D9D9", "#D08383", "#D186C6", "#D5E197"];
    return [
      ["Category", "Response Rate", { role: "style" }],
      ...stakeholderRelationship.stakeholder_relationship_totals.stake_holder_breakup.map(
        (item, index) => [
          item.relationship_with_company,
          item.total,
          colors[index % colors.length],
        ]
      ),
    ];
  };

  const chartData = getBarData();

  // Calculate max value for the chart
  const maxValue = Math.max(
    ...chartData
      .slice(1) // Skip header row
      .map((row) => Number(row[1])) // Get the numeric values
      .filter((val) => !isNaN(val)) // Filter out any non-numeric values
  );

  return (
    <Box sx={{ flex: 2, bgcolor: "background.paper", borderRadius: 2, p: 2 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Top survey Response by Stakeholders
      </Typography>
      <Chart
        chartType="ColumnChart"
        width="100%"
        height="400px"
        data={chartData}
        options={createBarOptions(maxValue)}
      />
    </Box>
  );
};

export default StakeholderResponseChart;
