import React, { useState, useEffect } from "react";
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Box,
  Stack,
  Typography,
  CircularProgress,
  TextField, // Add this import
} from "@mui/material";
import type { OrganizationFormData } from "@/types/organization";
import { FormLayout } from "./form-layout";
import { api } from "../../Screens/common";

interface OrganizationFormProps {
  onNext: () => void;
  onBack: () => void; // Add this prop
  updateFormData?: (data: any) => void; // Make prop optional
}

interface Organization {
  id: number;
  parent_name: string;
  name: string;
}

interface Site {
  id: number;
  name: string;
  organisation: number;
  organisation_name: string;
  land_area: number;
  city: string;
}

const stylesCSS = {
  input: {
    "& input[type=number]": {
      MozAppearance: "textfield",
    },
    "& input[type=number]::-webkit-outer-spin-button": {
      WebkitAppearance: "none",
      margin: 0,
    },
    "& input[type=number]::-webkit-inner-spin-button": {
      WebkitAppearance: "none",
      margin: 0,
    },
  },
};

export function OrganizationForm({
  onNext,
  onBack,
  updateFormData,
}: OrganizationFormProps) {
  const [formData, setFormData] = useState<OrganizationFormData>({
    organizationDetails: "",
    entitiesName: "",
    organizationSize: null,
    geographicLocation: "",
    site: "", // Add new field
  });

  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [sites, setSites] = useState<Site[]>([]); // Initialize with empty array
  const [loading, setLoading] = useState(false);
  const [fetchingOrgs, setFetchingOrgs] = useState(true);
  const [fetchingSites, setFetchingSites] = useState(true);

  useEffect(() => {
    fetchOrganizations();
    fetchSites();
  }, []);

  const fetchOrganizations = async () => {
    try {
      const response = await api.get("organisation/organisation").json();

      // Get organization object from localStorage and parse it
      const storedOrgString = localStorage.getItem("organization");
      const storedOrg = storedOrgString ? JSON.parse(storedOrgString) : null;

      // Ensure we're getting the results array and filter by stored organization ID
      const orgData = response?.results || [];
      const filteredOrgs = storedOrg
        ? orgData.filter((org) => org.id === storedOrg.id)
        : orgData;

      console.log("Processed organizations:", filteredOrgs);

      setOrganizations(filteredOrgs);
    } catch (error) {
      console.error("Error fetching organizations:", error);
      setOrganizations([]);
    } finally {
      setFetchingOrgs(false);
    }
  };

  const fetchSites = async () => {
    try {
      const response = await api.get("organisation/site").json();
      setSites(response.results || []);
    } catch (error) {
      console.error("Error fetching sites:", error);
      setSites([]);
    } finally {
      setFetchingSites(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const selectedSite = sites.find(
      (site) => site.id === Number(formData.entitiesName)
    );
    const selectedOrg = organizations.find(
      (org) => org.id === Number(formData.organizationDetails)
    );

    if (updateFormData && selectedSite && selectedOrg) {
      updateFormData({
        organizationId: selectedOrg.id,
        siteId: selectedSite.id,
        organizationDetails: selectedOrg.name,
        entitiesName: selectedSite.name, // Use name instead of id
        organizationSize: formData.organizationSize,
        geographicLocation: selectedSite.city || "",
      });
    }
    onNext();
  };

  if (fetchingOrgs || fetchingSites) {
    return (
      <FormLayout>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="200px"
        >
          <CircularProgress />
        </Box>
      </FormLayout>
    );
  }

  // Get filtered sites based on selected organization
  const filteredSites = sites.filter(
    (site) => site.organisation === Number(formData.organizationDetails)
  );

  return (
    <FormLayout>
      <form onSubmit={handleSubmit} style={{ height: "100%" }}>
        <Box sx={{ height: "55vh", display: "flex", flexDirection: "column" }}>
          <Box flex="1">
            <Typography variant="h5" fontWeight="medium" textAlign="left">
              Organization Details
            </Typography>

            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel>Organization Details</InputLabel>
              <Select
                value={formData.organizationDetails}
                label="Organization Details"
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    organizationDetails: e.target.value as string,
                    entitiesName: "", // Reset entities name when organization changes
                  });
                }}
              >
                {Array.isArray(organizations) &&
                  organizations.map((org) => (
                    <MenuItem key={org.id} value={org.id}>
                      {org.name}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>

            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel>Entities Name</InputLabel>
              <Select
                value={formData.entitiesName}
                label="Entities Name"
                onChange={(e) => {
                  const selectedSite = sites.find(
                    (site) => site.id === Number(e.target.value)
                  );
                  setFormData({
                    ...formData,
                    entitiesName: e.target.value as string,
                    geographicLocation: selectedSite?.city || "",
                  });
                }}
              >
                {filteredSites.map((site) => (
                  <MenuItem key={site.id} value={site.id}>
                    {site.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth sx={{ mt: 2 }}>
              <TextField
                type="number"
                label="Organization Size"
                value={formData.organizationSize || ""}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    organizationSize: Number(e.target.value),
                  });
                }}
                sx={{ ...stylesCSS.input }}
              />
            </FormControl>

            <FormControl fullWidth sx={{ mt: 2 }}>
              <TextField
                label="Geographic Location"
                value={formData.geographicLocation}
                disabled
              />
            </FormControl>
          </Box>
          <Box display="flex" justifyContent="flex-end" gap={2}>
            <Button
              variant="contained"
              onClick={onBack} // Ensure this is using the onBack prop
              sx={{
                width: 120,
                backgroundColor: "#868687",
                textTransform: "capitalize",
                "&:hover": {
                  backgroundColor: "#767677",
                },
              }}
            >
              Back
            </Button>
            <Button
              type="submit"
              variant="contained"
              sx={{ width: 120, textTransform: "capitalize" }}
            >
              Next
            </Button>
          </Box>
        </Box>
      </form>
    </FormLayout>
  );
}
