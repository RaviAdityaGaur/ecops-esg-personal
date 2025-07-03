import React from "react";
import { Box, Typography, TextField } from "@mui/material";
import tabLogo from "../../assets/profileLogo.png";

export interface StatsBoxProps {
  title: string;
  value: number | null;
  change?: { value: number; isPositive: boolean };
  actionText: string;
  isInput?: boolean;
}

const commonBoxStyles = {
  p: 2,
  bgcolor: "background.paper",
  borderRadius: 2,
  boxShadow: "none",
  flex: 1,
  minWidth: 0,
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-start",
};

const iconBoxStyles = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "#EBF1FC",
  borderRadius: "10%",
  height: "40px",
  width: "40px",
};

const StatsBox: React.FC<StatsBoxProps> = ({
  title,
  value,
  change,
  actionText,
  isInput,
}) => (
  <Box sx={commonBoxStyles}>
    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
      <Typography
        variant="caption"
        sx={{ color: "#4E5564", fontWeight: "600" }}
      >
        {title}
      </Typography>
      {change && (
        <Typography
          variant="caption"
          color={change.isPositive ? "success.main" : "error.main"}
        >
          {change.isPositive ? "+" : "-"}
          {Math.abs(change.value)}%
        </Typography>
      )}
    </Box>

    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        mt: 2,
        gap: 2,
        color: "#147C65",
        justifyContent: "space-between",
      }}
    >
      {isInput ? (
        <TextField size="small" placeholder="Enter value" sx={{ my: 1 }} />
      ) : (
        <Typography variant="h5" py={1.5}>
          {value !== null ? value : "-"}
        </Typography>
      )}
      <Box sx={iconBoxStyles}>
        <img
          src={tabLogo}
          alt="Tab Logo"
          style={{ height: "20px", width: "20px" }}
        />
      </Box>
    </Box>
  </Box>
);

export default StatsBox;
