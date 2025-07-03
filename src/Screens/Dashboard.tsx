import React, { useEffect, useState } from "react";
import { Box, Typography, CssBaseline, ThemeProvider } from "@mui/material";
import { theme } from "../lib/theme";
import SidebarHeader from "../Components/SidebarHeader";
import { api } from "./common";

// Import the components we created
import SurveySelector from "../Components/Dashboard/SurveySelector";
import StatsBox from "../Components/Dashboard/StatsBox";
import StakeholderSummary from "../Components/Dashboard/StakeholderSummary";
import MaterialityMatrix from "../Components/Dashboard/ChartComponents/MaterialityMatrix";
import StakeholderResponseChart from "../Components/Dashboard/ChartComponents/StakeholderResponseChart";
import ImpactAnalysis from "../Components/Dashboard/ImpactAnalysis";
import MaterialityTable from "../Components/Dashboard/MaterialityTable";

// Import types from our types file
import {
  Survey,
  SurveyAggregate,
  StakeholderRelationship,
  MaterialityStats,
  MaterialityResponse,
  DisclosureResponse,
  ImpactMaterialityData,
  SurveyDisclosure,
  TableRow,
} from "../Components/Dashboard/types";

export default function Dashboard() {
  // State for surveys and selection
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [selectedSurvey, setSelectedSurvey] = useState<string>("");
  const [selectedSurveyDetails, setSelectedSurveyDetails] =
    useState<Survey | null>(null);

  // State for survey data
  const [surveyAggregate, setSurveyAggregate] =
    useState<SurveyAggregate | null>(null);
  const [stakeholderRelationship, setStakeholderRelationship] =
    useState<StakeholderRelationship | null>(null);
  const [materialityData, setMaterialityData] = useState<MaterialityResponse[]>(
    []
  );
  const [disclosureData, setDisclosureData] = useState<DisclosureResponse[]>(
    []
  );
  const [materialityStats, setMaterialityStats] =
    useState<MaterialityStats | null>(null);
  const [impactMaterialityData, setImpactMaterialityData] =
    useState<ImpactMaterialityData | null>(null);

  // UI state
  const [showTopN, setShowTopN] = useState<number>(0);
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage] = useState<number>(6);
  const [tableData, setTableData] = useState<TableRow[]>([]);
  const [stakeholderFilter, setStakeholderFilter] =
    useState<string>("internal");
  const [activeFilters, setActiveFilters] = useState<string[]>(["all"]);
  const [hasImpactDisclosures, setHasImpactDisclosures] =
    useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Counts for UI display
  const [respondentCounts, setRespondentCounts] = useState({
    internal: 0,
    external: 0,
  });
  const [disclosureCounts, setDisclosureCounts] = useState({
    internal: 0,
    external: 0,
  });

  // Fetch initial surveys data
  useEffect(() => {
    const fetchSurveys = async () => {
      try {
        const surveysResponse = await api
          .get("esg/api/surveys/get_surveys/")
          .json();
        setSurveys(surveysResponse);

        const allDisclosures = [];
        for (const survey of surveysResponse) {
          const response = await api
            .get(`esg/api/get-disclosures-from-survey/?survey_id=${survey.id}`)
            .json();
          allDisclosures.push(...response.disclosures);
        }
        setDisclosureData(allDisclosures);
      } catch (error) {
        setError("Error fetching data");
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSurveys();
  }, []);

  // Update selected survey details when changed
  useEffect(() => {
    if (selectedSurvey && surveys.length > 0) {
      const surveyDetails = surveys.find(
        (survey) => survey.id === parseInt(selectedSurvey)
      );
      setSelectedSurveyDetails(surveyDetails || null);
      checkForImpactDisclosures(selectedSurvey);

      // Clear all survey-related data when survey changes
      setTableData([]);
      setSurveyAggregate(null);
      setStakeholderRelationship(null);
      setMaterialityData([]);
      setMaterialityStats(null);
      setImpactMaterialityData(null);
      setDisclosureCounts({ internal: 0, external: 0 });
      setRespondentCounts({ internal: 0, external: 0 });
    } else {
      setSelectedSurveyDetails(null);
      setHasImpactDisclosures(false);
      setTableData([]);
    }
  }, [selectedSurvey, surveys]);

  // This updated effect will now fetch the impact materiality data for all survey types
  useEffect(() => {
    const fetchImpactMaterialityData = async () => {
      if (!selectedSurvey) {
        setImpactMaterialityData(null);
        return;
      }

      try {
        // Always fetch impact materiality data for all survey types
        const response = await api
          .get(`esg/api/impact-materiality/?survey_id=${selectedSurvey}`)
          .json();
        setImpactMaterialityData(response);
      } catch (error) {
        console.error("Error fetching impact materiality data:", error);
        setImpactMaterialityData(null);
      }
    };

    fetchImpactMaterialityData();
  }, [selectedSurvey]);

  // Fetch survey aggregate data - moved impact materiality fetch to separate effect
  useEffect(() => {
    const fetchSurveyAggregate = async () => {
      if (!selectedSurvey) {
        setSurveyAggregate(null);
        return;
      }

      try {
        const response = await api
          .get(`esg/api/survey-aggregate/?survey_id=${selectedSurvey}`)
          .json();
        setSurveyAggregate(response);
      } catch (error) {
        console.error("Error fetching survey data:", error);
        setSurveyAggregate(null);
      }
    };

    fetchSurveyAggregate();
  }, [selectedSurvey]);

  // Fetch stakeholder relationship data
  useEffect(() => {
    const fetchStakeholderRelationship = async () => {
      if (!selectedSurvey) {
        setStakeholderRelationship(null);
        return;
      }

      try {
        const response = await api
          .get(
            `esg/api/stakeholder-relationship-type-graph/?survey_id=${selectedSurvey}`
          )
          .json();
        setStakeholderRelationship(response);
      } catch (error) {
        console.error("Error fetching stakeholder relationship:", error);
        setStakeholderRelationship(null);
      }
    };

    fetchStakeholderRelationship();
  }, [selectedSurvey]);

  // Fetch materiality data
  useEffect(() => {
    const fetchMaterialityData = async () => {
      if (!selectedSurvey) return;

      try {
        const response = await api.get("esg/api/survey-materiality/").json();
        const surveyMateriality = response.filter(
          (item: MaterialityResponse) =>
            item.survey_id === Number(selectedSurvey)
        );
        setMaterialityData(surveyMateriality);

        const uniqueDisclosures = {
          internal: new Set(
            surveyMateriality
              .filter((item) => item.stakeholder_type === "internal")
              .map((item) => item.survey_disclosure)
          ).size,
          external: new Set(
            surveyMateriality
              .filter((item) => item.stakeholder_type === "external")
              .map((item) => item.survey_disclosure)
          ).size,
        };

        setDisclosureCounts(uniqueDisclosures);

        const counts = surveyMateriality.reduce(
          (acc: { internal: number; external: number }, curr) => {
            if (curr.stakeholder_type === "internal") {
              acc.internal += 1;
            } else if (curr.stakeholder_type === "external") {
              acc.external += 1;
            }
            return acc;
          },
          { internal: 0, external: 0 }
        );

        setRespondentCounts(counts);
      } catch (error) {
        console.error("Error fetching materiality data:", error);
      }
    };

    fetchMaterialityData();
  }, [selectedSurvey]);

  // Fetch materiality stats
  useEffect(() => {
    const fetchMaterialityStats = async () => {
      if (!selectedSurvey) return;

      try {
        const response = await api
          .get(`esg/api/materiality-stats/?survey_id=${selectedSurvey}`)
          .json();
        setMaterialityStats(response);

        // Update disclosure counts based on materiality stats
        const internalCount =
          response.stakeholder_totals.find(
            (item) => item.stakeholder_type === "internal"
          )?.total || 0;
        const externalCount =
          response.stakeholder_totals.find(
            (item) => item.stakeholder_type === "external"
          )?.total || 0;

        setDisclosureCounts({
          internal: internalCount,
          external: externalCount,
        });
      } catch (error) {
        console.error("Error fetching materiality stats:", error);
      }
    };

    fetchMaterialityStats();
  }, [selectedSurvey]);

  // Create table data - Updated to COMBINE data from both APIs
  useEffect(() => {
    // If no selectedSurvey, clear the table data and return
    if (!selectedSurvey) {
      setTableData([]);
      return;
    }

    // Create a variable for new table data
    let newTableData: TableRow[] = [];
    let processedDisclosureIds = new Set<string>();

    // Check if we have valid impact materiality data
    const hasValidImpactData =
      impactMaterialityData &&
      impactMaterialityData.materiality_summary &&
      Object.keys(impactMaterialityData.materiality_summary).some(
        (dimension) =>
          Object.keys(impactMaterialityData.materiality_summary[dimension])
            .length > 0
      );

    // First use impact materiality data if available
    if (hasValidImpactData) {
      console.log("Adding impact materiality data to table");
      // Process each dimension and disclosure
      Object.entries(impactMaterialityData.materiality_summary).forEach(
        ([dimension, disclosures]) => {
          Object.entries(disclosures).forEach(([disclosureId, data]) => {
            if (disclosureId === "null") return; // Skip entries with null disclosure ID

            // Mark this disclosure ID as processed
            processedDisclosureIds.add(disclosureId);

            // Get internal and external data if available
            const internalData = data.internal;
            const externalData = data.external;

            // Use disclosure_rating for internal and external, overall_double_materiality for combined
            const internalImpact =
              internalData?.disclosure_rating?.toFixed(1) || "-";
            const externalImpact =
              externalData?.disclosure_rating?.toFixed(1) || "-";
            const combinedImpact =
              data.overall_double_materiality?.toFixed(1) || "-";

            newTableData.push({
              id: disclosureId,
              name: `${disclosureId} - ${dimension}`,
              dimension: dimension,
              internalStatus: internalImpact,
              externalStatus: externalImpact,
              averageStatus: combinedImpact,
              internalDetails: internalData
                ? {
                    disclosure_rating: internalData.disclosure_rating,
                    impact_description: "Impact Materiality Score",
                  }
                : null,
              externalDetails: externalData
                ? {
                    disclosure_rating: externalData.disclosure_rating,
                    impact_description: "Financial Materiality Score",
                  }
                : null,
              combinedDetails: {
                disclosure_rating: data.overall_double_materiality,
              },
            });
          });
        }
      );
    }

    // Also add data from survey aggregate (but only for disclosure IDs not already processed)
    if (surveyAggregate && surveyAggregate.dimension_summary) {
      console.log("Adding survey aggregate data to table");
      const dimensionData = surveyAggregate.dimension_summary;

      Object.entries(dimensionData).forEach(([dimension, disclosures]) => {
        Object.entries(disclosures).forEach(([disclosureId, data]) => {
          // Skip if we already added this disclosure from impact materiality data
          if (processedDisclosureIds.has(disclosureId)) return;

          // Find the disclosure in disclosureData
          const disclosure = disclosureData.find(
            (d) => d.disclosure_id === disclosureId
          );

          // Skip financial disclosures if survey type is single
          if (
            selectedSurveyDetails?.survey_type === "single" &&
            disclosure &&
            disclosure.disclosure_type === "FINANCIAL"
          ) {
            return;
          }

          const internalImpact = data.internal
            ? (
                data.internal.avg_severity * data.internal.avg_likelihood
              ).toFixed(1)
            : "-";

          const externalImpact = data.external
            ? (
                data.external.avg_severity * data.external.avg_likelihood
              ).toFixed(1)
            : "-";

          const combinedImpact =
            data.combined.avg_severity !== "NA"
              ? (
                  Number(data.combined.avg_severity) *
                  Number(data.combined.avg_likelihood)
                ).toFixed(1)
              : "-";

          newTableData.push({
            id: disclosureId,
            name: `${disclosureId} - ${dimension}`,
            dimension: dimension,
            internalStatus: internalImpact,
            externalStatus: externalImpact,
            averageStatus: combinedImpact,
            internalDetails: data.internal,
            externalDetails: data.external,
            combinedDetails: data.combined,
          });
        });
      });
    }

    // Always set the table data, even if it's an empty array
    console.log(`Setting table data with ${newTableData.length} rows`);
    setTableData(newTableData);
  }, [
    selectedSurvey,
    surveyAggregate,
    impactMaterialityData,
    selectedSurveyDetails,
    disclosureData,
  ]);

  // Reset page when survey changes
  useEffect(() => {
    setPage(0);
  }, [selectedSurvey]);

  // Helper functions
  const checkForImpactDisclosures = async (surveyId: string) => {
    try {
      const response = await api
        .get(`esg/api/get-disclosures-from-survey/?survey_id=${surveyId}`)
        .json();

      // Check if any disclosures have type "IMPACT"
      const hasImpactType = response.disclosures.some(
        (disclosure: SurveyDisclosure) =>
          disclosure.disclosure_type === "IMPACT"
      );

      setHasImpactDisclosures(hasImpactType);
    } catch (error) {
      console.error("Error checking for impact disclosures:", error);
      setHasImpactDisclosures(false);
    }
  };

  const handleFilterToggle = (filter: string) => {
    if (filter === "all") {
      setActiveFilters(["all"]);
      return;
    }

    const newFilters = [...activeFilters.filter((f) => f !== "all")];

    if (newFilters.includes(filter)) {
      const updatedFilters = newFilters.filter((f) => f !== filter);
      setActiveFilters(updatedFilters.length > 0 ? updatedFilters : ["all"]);
    } else {
      setActiveFilters([...newFilters, filter]);
    }
  };

  // Get filtered table data for pagination
  const getFilteredTableData = () => {
    if (showTopN > 0) {
      return tableData
        .sort(
          (a, b) => parseFloat(b.averageStatus) - parseFloat(a.averageStatus)
        )
        .slice(0, showTopN);
    }
    return tableData;
  };

  // Calculate pagination values
  const filteredData = getFilteredTableData();
  const totalItems = filteredData.length;
  const start = page * rowsPerPage;
  const slicedData = filteredData.slice(start, start + rowsPerPage);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SidebarHeader>
        <Box
          alignItems="center"
          display="flex"
          justifyContent="space-between"
          sx={{ width: "100%", p: 2 }}
        >
          <Typography sx={{ fontSize: "25px", fontWeight: "550" }}>
            Survey Dashboard
          </Typography>
        </Box>

        {/* Use the SurveySelector component */}
        <SurveySelector
          surveys={surveys}
          selectedSurvey={selectedSurvey}
          onSurveyChange={setSelectedSurvey}
        />

        {/* Summary Section with StakeholderSummary components */}
        <Box
          sx={{
            display: "flex",
            gap: 2,
            mb: 2,
            bgcolor: "#f5f5f5",
            width: "100%",
          }}
        >
          <StakeholderSummary
            type="external"
            materialityStats={materialityStats}
            surveyAggregate={surveyAggregate}
          />

          <StakeholderSummary
            type="internal"
            materialityStats={materialityStats}
            surveyAggregate={surveyAggregate}
          />
        </Box>

        {/* Charts Section */}
        <Box sx={{ display: "flex", gap: 2, mb: 4 }}>
          <MaterialityMatrix
            surveyType={selectedSurveyDetails?.survey_type}
            activeFilters={activeFilters}
            stakeholderFilter={stakeholderFilter}
            onFilterToggle={handleFilterToggle}
            onStakeholderFilterChange={setStakeholderFilter}
            dimensionSummary={surveyAggregate?.dimension_summary}
            materiality_summary={impactMaterialityData?.materiality_summary}
          />

          <StakeholderResponseChart
            stakeholderRelationship={stakeholderRelationship}
          />
        </Box>

        {/* Impact Analysis - only shown for specific survey types */}
        {selectedSurveyDetails?.survey_type !== "double" &&
          hasImpactDisclosures && (
            <ImpactAnalysis
              surveyAggregate={surveyAggregate}
              hasImpactDisclosures={hasImpactDisclosures}
            />
          )}

        {/* Materiality Table */}
        <MaterialityTable
          surveyType={selectedSurveyDetails?.survey_type}
          tableData={tableData}
          showTopN={showTopN}
          onShowTopNChange={setShowTopN}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={setPage}
        />
      </SidebarHeader>
    </ThemeProvider>
  );
}
