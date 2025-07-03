import React from "react";
import { Box, Typography, Select, MenuItem } from "@mui/material";

export interface Survey {
  id: number;
  name: string;
  start_date: string;
  end_date: string;
  status: string;
  organisation: number;
  site: number;
  created_by: number;
  survey_type?: string;
  disclosure_type?: string;
}

interface SurveySelectorProps {
  surveys: Survey[];
  selectedSurvey: string;
  onSurveyChange: (id: string) => void;
}

const SurveySelector: React.FC<SurveySelectorProps> = ({
  surveys,
  selectedSurvey,
  onSurveyChange,
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        gap: 2,
        mb: 3,
        p: 1.5,
        borderRadius: "8px",
        backgroundColor: "white",
        justifyContent: "flex-start",
      }}
    >
      <Box sx={{ flex: 1, display: "flex", alignItems: "center", gap: 2 }}>
        <Typography
          variant="caption"
          sx={{ color: "#4E5564", fontSize: "16px" }}
        >
          Select Survey :
        </Typography>
        <Select
          size="small"
          value={selectedSurvey}
          onChange={(e) => onSurveyChange(e.target.value)}
          sx={{ mt: 1, width: "200px" }}
        >
          {surveys.map((survey) => (
            <MenuItem key={survey.id} value={survey.id}>
              {survey.name}
              {survey.survey_type && (
                <Typography
                  component="span"
                  sx={{
                    ml: 1,
                    fontSize: "0.8rem",
                    color: "text.secondary",
                    fontStyle: "italic",
                  }}
                >
                  ({survey.survey_type})
                </Typography>
              )}
            </MenuItem>
          ))}
        </Select>
      </Box>
    </Box>
  );
};

export default SurveySelector;
