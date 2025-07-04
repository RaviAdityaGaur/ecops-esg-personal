import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  CssBaseline,
  Grid,
  ThemeProvider,
  Typography,
  Snackbar,
  Alert,
  IconButton,
  Collapse,
  Tooltip,
} from "@mui/material";
import { theme } from "../../lib/theme";
import SidebarHeader from "../../Components/SidebarHeader";
import { api } from "../common";
import { ProgressTracker } from "../../Components/progress-tracker";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import PopIcon from "../../assets/pop.png";

interface StandardOptionCardProps {
  title: string;
  subtitle?: string;
  onClick?: () => void;
  showPopIcon?: boolean;
  description?: string;
  disabled?: boolean;
}

const cardStyles = {
  width: "300px",
  p: 2,
  display: "flex",
  flexDirection: "column",
  textAlign: "center",
  justifyContent: "center",
  alignItems: "center",
  cursor: "pointer",
  backgroundColor: "#fff",
  borderRadius: 2,
  boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.05)",
  height: "120px",
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
  },
} as const;

const disabledCardStyles = {
  ...cardStyles,
  backgroundColor: "#f5f5f5",
  cursor: "not-allowed",
  opacity: 0.7,
  "&:hover": {
    transform: "none",
    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.05)",
  },
};

const StandardOptionCard: React.FC<StandardOptionCardProps> = ({
  title,
  subtitle,
  onClick,
  disabled = false,
}) => (
  <Box
    onClick={disabled ? undefined : onClick}
    sx={disabled ? disabledCardStyles : cardStyles}
  >
    <Box display="flex" justifyContent="center" alignItems="center" gap={1}>
      <Typography variant="h6" sx={disabled ? { color: "text.disabled" } : {}}>
        {title}
      </Typography>
      {title?.toUpperCase().includes("GRI") ||
      title?.toUpperCase().includes("SASB") ? (
        <Tooltip
          title={
            title?.toUpperCase().includes("GRI")
              ? "The GRI Standards are the world's most widely used standards for sustainability reporting, providing a common language for organizations to report their sustainability impacts in a consistent and credible way."
              : disabled
              ? "SASB Standards are not available for double survey types"
              : "SASB Standards guide the disclosure of financially material sustainability information by companies to their investors, focusing on industry-specific sustainability factors most likely to impact financial performance."
          }
        >
          <Box
            component="img"
            src={PopIcon}
            sx={{ width: 20, height: 20, cursor: "help" }}
          />
        </Tooltip>
      ) : null}
    </Box>
    {subtitle && (
      <Typography
        variant="body2"
        textAlign="center"
        sx={disabled ? { color: "text.disabled" } : {}}
      >
        {subtitle}
      </Typography>
    )}
    {disabled && title?.toUpperCase().includes("SASB") && (
      <Typography variant="caption" color="text.disabled" sx={{ mt: 1 }}>
        Not available for double survey type
      </Typography>
    )}
  </Box>
);

export default function StandardSelectionPage() {
  const navigate = useNavigate();
  const { reportId } = useParams();

  const [indicatorSources, setIndicatorSources] = React.useState([]);
  const [surveyData, setSurveyData] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  const fetchIndicatorSources = async () => {
    const response = await api.get("esg/api/indicator-sources/").json();
    setIndicatorSources(response);
  };

  useEffect(() => {
    fetchIndicatorSources();
  }, [reportId]);

  const [steps] = useState([
    { id: 1, title: "Primary Information", type: "main", status: "complete" },
    {
      id: 2,
      title: "Setup External Survey",
      type: "main",
      status: "in-progress",
    },
    { id: 3, title: "Choose Standards", type: "sub", status: "in-progress" },
    { id: 4, title: "Choose Sectors", type: "sub", status: "pending" },
    { id: 5, title: "Choose Disclosures", type: "sub", status: "pending" },
    { id: 6, title: "Add Questions", type: "sub", status: "pending" },
    { id: 7, title: "Review Disclosure", type: "sub", status: "pending" },
    { id: 8, title: "Preview Survey", type: "sub", status: "pending" },
    { id: 9, title: "Submit Survey", type: "sub", status: "pending" },
    { id: 10, title: "Setup Internal Survey", type: "main", status: "pending" },
  ]);

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleStandardClick = async (standardId: number) => {
    try {
      if (!reportId) {
        setSnackbar({
          open: true,
          message: "Survey ID is missing",
          severity: "error",
        });
        return;
      }

      console.log("Selected standard ID:", standardId);
      // Send API request to update the standard selection
      const requestBody = {
        next_step: "SECTOR_SELECTION",
        indicator_source_id: standardId,
      };
      console.log("Sending request body:", requestBody);

      // Navigate to the sector-industry form page
      navigate(`/reporting-sector-industry-from/${reportId}/${standardId}`);
    } catch (error) {
      console.error("Error handling standard selection:", error);
      setSnackbar({
        open: true,
        message: "An error occurred. Please try again.",
        severity: "error",
      });
    }
  };

  const [expanded, setExpanded] = React.useState(false);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SidebarHeader>
        <Grid sx={{ width: "100%", mb: 2, boxShadow: "none" }}>
          <ProgressTracker
            steps={steps}
            currentStep={3} // This represents "Choose Standards" in the sub-steps
          />
        </Grid>

        <Box
          sx={{
            width: "100%",
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: "none",
            p: 2,
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 1,
            }}
          >
            <Typography sx={{ fontSize: "20px" }}>Choose Standard</Typography>
            <IconButton onClick={() => setExpanded(!expanded)}>
              {expanded ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </Box>
          <Collapse in={expanded}>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              The Standards contain disclosures that allow an organization to
              report information about its impacts consistently and credibly.
              This enhances the global comparability and quality of reported
              information on these impacts, which supports information users in
              making informed assessments and decisions about the organization's
              impacts and contribution to sustainable development. Please select
              the frameworks to be included on your survey.
            </Typography>
          </Collapse>
        </Box>

        <Box sx={{ display: "flex", width: "100%", marginTop: 2 }}>
          <Box sx={{ display: "flex", width: "100%", gap: 3 }}>
            {indicatorSources?.map((source: any) => (
              <StandardOptionCard
                key={source.id}
                title={source.name}
                subtitle={source.description}
                onClick={() => handleStandardClick(source.id)}
                showPopIcon
              />
            ))}
          </Box>
        </Box>
      </SidebarHeader>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
}
