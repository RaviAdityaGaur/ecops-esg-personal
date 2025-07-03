import React, { useState } from "react";
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Box,
  Select,
  Typography,
} from "@mui/material";
import { FormLayout } from "./form-layout";
import { api } from "../../Screens/common";

interface SectorIndustryFormProps {
  onNext: () => void;
  onBack: () => void;
  updateFormData: (data: { sector: number; industry: number }) => Promise<void>;
}

interface Sector {
  id: number;
  name: string;
  description: string;
}

interface Industry {
  id: number;
  name: string;
  description: string;
  sector: number;
  sector_name: string;
}

export function SectorIndustryForm({
  onNext,
  onBack,
  updateFormData,
}: SectorIndustryFormProps) {
  const [sectorId, setSectorId] = useState<number | "">("");
  const [industryId, setIndustryId] = useState<number | "">("");
  const [sectors, setSectors] = useState<Sector[]>([]);
  const [industries, setIndustries] = useState<Industry[]>([]);

  const getSectors = async () => {
    try {
      const response = await api.get("esg/api/sectors/");
      const data = await response.json();
      setSectors(data);
    } catch (error) {
      console.error("Error fetching sectors:", error);
    }
  };

  const getIndustryTypes = async (selectedSectorId: number) => {
    try {
      const response = await api.get(
        `esg/api/industries/?sector=${selectedSectorId}`
      );
      const data = await response.json();
      setIndustries(data);
    } catch (error) {
      console.error("Error fetching industries:", error);
    }
  };

  React.useEffect(() => {
    getSectors();
  }, []);

  React.useEffect(() => {
    if (sectorId !== "") {
      getIndustryTypes(sectorId as number);
    }
  }, [sectorId]);

  const handleSectorChange = (e: React.ChangeEvent<{ value: unknown }>) => {
    setSectorId(e.target.value as number);
    setIndustryId(""); // Reset industry when sector changes
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (sectorId === "" || industryId === "") {
      console.error("Sector and industry must be selected");
      return;
    }

    try {
      await updateFormData({
        sector: sectorId as number,
        industry: industryId as number,
      });
      onNext();
    } catch (error) {
      console.error("Error updating form data:", error);
    }
  };

  return (
    <FormLayout>
      <form onSubmit={handleSubmit}>
        <Box
          sx={{
            height: "55vh",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Box flex="1">
            <Typography variant="h5" fontWeight="medium">
              Choose Sector / Industry
            </Typography>

            <FormControl fullWidth sx={{ mt: 4, mb: 3 }}>
              <InputLabel>Select Sector</InputLabel>
              <Select
                value={sectorId}
                label="Select Sector"
                onChange={handleSectorChange}
              >
                {sectors.map((item) => (
                  <MenuItem key={item.id} value={item.id}>
                    {item.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Select Industry</InputLabel>
              <Select
                value={industryId}
                label="Select Industry"
                onChange={(e) => {
                  console.log("Selected industry ID:", e.target.value);
                  setIndustryId(e.target.value as number);
                }}
                disabled={sectorId === ""}
              >
                {industries.map((item) => (
                  <MenuItem key={item.id} value={item.id}>
                    {item.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <Box display="flex" justifyContent="flex-end" gap={2}>
            <Button
              variant="contained"
              sx={{
                width: 120,
                textTransform: "capitalize",
                bgcolor: "#868687",
                "&:hover": {
                  bgcolor: "#757576",
                },
              }}
              onClick={onBack}
            >
              Back
            </Button>
            <Button
              type="submit"
              variant="contained"
              sx={{
                width: 120,
                textTransform: "capitalize",
                bgcolor: "#03A94E",
                "&:hover": {
                  bgcolor: "#038F42",
                },
              }}
              disabled={sectorId === "" || industryId === ""}
            >
              Save & Next
            </Button>
          </Box>
        </Box>
      </form>
    </FormLayout>
  );
}
