import React from "react";
import { Box, Typography } from "@mui/material";
import popImage from "../../assets/pop.png";

export interface StatItemProps {
  label: string;
  value: string;
  percentage?: string;
  icon?: boolean;
}

const StatItem: React.FC<StatItemProps> = ({
  label,
  value,
  percentage,
  icon,
}) => (
  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
    <Box sx={{ flexGrow: 1, display: "flex", alignItems: "center" }}>
      <Typography variant="body1" color="text.secondary">
        {label}
      </Typography>
      {icon && (
        <img
          src={popImage}
          style={{
            width: "15px",
            height: "15px",
            marginLeft: "5px",
            marginBottom: "2px",
          }}
        />
      )}
    </Box>
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Typography variant="h6" fontWeight="bold" sx={{ mx: 1 }}>
        {value}
      </Typography>
      {percentage && (
        <Box sx={{ bgcolor: "grey.200", px: 1, py: 0.5, borderRadius: 1 }}>
          <Typography variant="body2">{percentage}</Typography>
        </Box>
      )}
    </Box>
  </Box>
);

export default StatItem;
