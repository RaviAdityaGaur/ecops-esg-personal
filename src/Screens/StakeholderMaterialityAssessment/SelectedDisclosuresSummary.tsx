import {
  Box,
  Typography,
  Button,
  Tabs,
  Tab,
  Switch,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton
} from '@mui/material';
import SidebarHeader from '../../Components/SidebarHeader';
import { useEffect, useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ProgressTracker } from '../../Components/progress-tracker';
import { DataGrid } from '@mui/x-data-grid';
import { api, getAuthDetails } from '../common';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const SelectedDisclosuresSummary = () => {
  const navigate = useNavigate();
  const { reportId } = useParams();
  const [disclosures, setDisclosures] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogContent, setDialogContent] = useState({
    title: '',
    content: ''
  });

  // Updated steps to match the visual format of the image
  const [steps] = useState([
    { id: 1, title: 'STEP 1: Setup ESG Report', status: 'complete' },
    { id: 2, title: 'STEP 2: Create Report', status: 'complete' },
    { id: 3, title: 'STEP 3: Select Disclosures', status: 'complete' },
    { id: 4, title: 'STEP 4: Review Disclosures', status: 'in-progress' },
    { id: 5, title: 'STEP 5: Steering Committee Approval', status: 'pending' },
    { id: 6, title: 'STEP 6: Assign Disclosures', status: 'pending' }
  ]);

  useEffect(() => {
    const fetchDisclosuresForReport = async () => {
      if (!reportId) {
        setDisclosures([]);
        return;
      }
      try {
        const response: any = await api
          .get(`esg/api/get-disclosure-for-report/?report_id=${reportId}`)
          .json();
        const fetched = response.disclosures ? response.disclosures : [];
        setDisclosures(fetched);
      } catch (err) {
        console.error('Error fetching disclosures:', err);
      }
    };
    fetchDisclosuresForReport();
  }, [reportId]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleResponseChange = async (rowId: number, value: 'yes' | 'no') => {
    const row = disclosures.find(d => d.dis_id === rowId);
    if (!row) return;

    const isAdded = value === 'yes';
    const isRemoved = value === 'no';

    const payload = {
      report_id: reportId,
      disclosure_id: row.dis_id,
      is_added: isAdded,
      is_removed: isRemoved
    };

    try {
      await api.post('esg/api/report-disclosure-response/', {
        json: payload,
        headers: { 'content-type': 'application/json' }
      });
      setDisclosures(prev =>
        prev.map(disc =>
          disc.dis_id === row.dis_id
            ? {
                ...disc,
                response: {
                  ...disc.response,
                  is_added: isAdded,
                  is_removed: isRemoved
                }
              }
            : disc
        )
      );
    } catch (error) {
      console.error('Error submitting response:', error);
    }
  };

  const handleDetailClick = (title: string, content: string) => {
    setDialogContent({ title, content });
    setDialogOpen(true);
  };

  const handleNextClick = () => {
    navigate(`/reporting-email/${reportId}`);
  };

  const handleBackClick = () => {
    navigate(-1);
  };

  const getDimensionFromTab = (tabIndex: number): string => {
    switch (tabIndex) {
      case 0:
        return 'Environmental';
      case 1:
        return 'Social';
      case 2:
        return 'Governance';
      default:
        return 'Environmental';
    }
  };

  const filteredDisclosures = disclosures.filter(
    disclosure =>
      disclosure.dimension === getDimensionFromTab(activeTab) &&
      disclosure.response?.is_added === true
  );

  // --- Start of UI-related calculations and styles ---

  // Calculate disclosure percentages for each dimension
  const dimensionPercentages = useMemo(() => {
    const addedDisclosures = disclosures.filter(
      disclosure => disclosure.response?.is_added === true
    );
    const total = addedDisclosures.length;

    if (total === 0) {
      return { Environmental: 0, Social: 0, Governance: 0 };
    }

    const counts = addedDisclosures.reduce(
      (acc, disclosure) => {
        if (disclosure.dimension) {
          acc[disclosure.dimension] = (acc[disclosure.dimension] || 0) + 1;
        }
        return acc;
      },
      { Environmental: 0, Social: 0, Governance: 0 } as Record<string, number>
    );

    return {
      Environmental: Math.round((counts.Environmental / total) * 100),
      Social: Math.round((counts.Social / total) * 100),
      Governance: Math.round((counts.Governance / total) * 100)
    };
  }, [disclosures]);

  // Restored box styles for table cells to match the original image
  const commonBoxStyles = {
    p: 1,
    my: 0.5,
    borderRadius: 1,
    boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
    cursor: 'pointer',
    '&:hover': {
      boxShadow: '0 2px 4px rgba(0,0,0,0.15)'
    },
    backgroundColor: 'white',
    width: '100%',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    lineHeight: '1.4em',
    maxHeight: '2.8em',
    minHeight: '2.8em',
    alignItems: 'center',
    fontSize: '0.875rem'
  };

  const columns = [
    {
      field: 'standard_name',
      headerName: 'STANDARDS',
      flex: 0.8,
      minWidth: 100
    },
    {
      field: 'topic_standard',
      headerName: 'TOPIC STANDARD',
      flex: 1.2,
      minWidth: 120,
      renderCell: (params: any) => (
        <Box
          sx={commonBoxStyles}
          onClick={() =>
            handleDetailClick('Topic Standard', params.row.standard_name)
          }
        >
          {params.row.standard_name}
        </Box>
      )
    },
    {
      field: 'sub_topic_name',
      headerName: 'DISCLOSURE SUB TOPIC',
      flex: 1.2,
      minWidth: 140,
      renderCell: (params: any) => (
        <Box
          sx={commonBoxStyles}
          onClick={() =>
            handleDetailClick('Disclosure Sub Topic', params.row.sub_topic.name)
          }
        >
          {params.row.sub_topic.name}
        </Box>
      )
    },
    {
      field: 'disclosure_description',
      headerName: 'DISCLOSURE DESCRIPTIONS',
      flex: 1.5,
      minWidth: 160,
      renderCell: (params: any) => (
        <Box
          sx={commonBoxStyles}
          onClick={() =>
            handleDetailClick('Disclosure Descriptions', params.value)
          }
        >
          {params.value}
        </Box>
      )
    },
    {
      field: 'disclosure_id',
      headerName: 'DISCLOSURE ID',
      flex: 1,
      minWidth: 110,
      renderCell: (params: any) => (
        <Box
          sx={commonBoxStyles}
          onClick={() => handleDetailClick('Disclosure ID', params.value)}
        >
          {params.value}
        </Box>
      )
    },
    {
      field: 'sdg_goal',
      headerName: 'SDG GOAL',
      flex: 0.8,
      minWidth: 90,
      renderCell: (params: any) => {
        const goals =
          params.row.sdg_targets?.map((item: any) => item.goal).join(', ') ||
          'N/A';
        return (
          <Box
            sx={commonBoxStyles}
            onClick={() => handleDetailClick('SDG Goal', goals)}
          >
            {goals}
          </Box>
        );
      }
    },
    {
      field: 'sdg_target',
      headerName: 'SDG TARGET',
      flex: 0.8,
      minWidth: 100,
      renderCell: (params: any) => {
        const targets =
          params.row.sdg_targets?.map((item: any) => item.target).join(', ') ||
          'N/A';
        return (
          <Box
            sx={commonBoxStyles}
            onClick={() => handleDetailClick('SDG Target', targets)}
          >
            {targets}
          </Box>
        );
      }
    },
    {
      field: 'add_to_report',
      headerName: 'ADD TO REPORT',
      flex: 1,
      minWidth: 120,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params: any) => {
        const isAdded = params.row.response?.is_added === true;
        const handleToggle = () => {
          handleResponseChange(params.row.dis_id, isAdded ? 'no' : 'yes');
        };
        return (
          <Switch
            checked={isAdded}
            onChange={handleToggle}
            color="success"
            size="medium"
          />
        );
      }
    }
  ];

  return (
    <>
      <SidebarHeader>
        <Box sx={{ p: { xs: 1, sm: 2, md: 3 }, backgroundColor: '#F7F8FA' }}>
          {/* Top Header Card */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              p: 2,
              bgcolor: 'white',
              borderRadius: 2,
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}
          >
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              Review Disclosures
            </Typography>
            <IconButton size="small">
              <ExpandMoreIcon />
            </IconButton>
          </Box>

          {/* Progress Tracker Card */}
          <Box
            sx={{
              my: 3,
              p: 3,
              bgcolor: 'white',
              borderRadius: 2,
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}
          >
            <ProgressTracker steps={steps} currentStepId={4} />
          </Box>

          {/* Main Content Card */}
          <Box
            sx={{
              bgcolor: 'background.paper',
              borderRadius: 2,
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              overflow: 'hidden'
            }}
          >
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              sx={{
                borderBottom: 1,
                borderColor: 'divider',
                p: 2,
                pb: 0,
                '& .MuiTab-root': {
                  textTransform: 'none',
                  minWidth: 100,
                  fontSize: '16px',
                  fontWeight: 400,
                  color: '#64748B',
                  '&.Mui-selected': {
                    color: '#147C65',
                    fontWeight: 500
                  }
                },
                '& .MuiTabs-indicator': {
                  backgroundColor: '#147C65',
                  height: '3px'
                }
              }}
            >
              {[
                { label: 'Environment', percentage: dimensionPercentages.Environmental },
                { label: 'Social', percentage: dimensionPercentages.Social },
                { label: 'Governance', percentage: dimensionPercentages.Governance }
              ].map((tab, index) => (
                <Tab
                  key={tab.label}
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography component="span">{tab.label}</Typography>
                      <Box
                        sx={{
                          ml: 1,
                          backgroundColor: activeTab === index ? '#147C65' : '#64748B',
                          color: 'white',
                          borderRadius: '12px',
                          px: 1,
                          py: 0.2,
                          fontSize: '12px',
                          fontWeight: 500,
                          minWidth: '24px',
                          textAlign: 'center'
                        }}
                      >
                        {`${tab.percentage}%`}
                      </Box>
                    </Box>
                  }
                />
              ))}
            </Tabs>

            <Box sx={{ height: 450, width: '100%' }}>
              <DataGrid
                rows={filteredDisclosures || []}
                columns={columns}
                getRowId={row => row.dis_id}
                rowHeight={70} // Increased row height to accommodate boxes
                pageSize={5}
                rowsPerPageOptions={[5]}
                disableSelectionOnClick
                sx={{
                  border: 'none',
                  '& .MuiDataGrid-columnHeaderTitle': {
                    fontWeight: 600,
                  },
                  '& .MuiDataGrid-cell': {
                    borderBottom: '1px solid #f0f0f0',
                    py: 1
                  },
                  '& .MuiDataGrid-columnHeaders': {
                    backgroundColor: '#f8f9fa',
                  },
                  '& .MuiDataGrid-row:hover': {
                    backgroundColor: '#f8f9fa'
                  },
                  '& .MuiDataGrid-footerContainer': {
                    borderTop: '1px solid #f0f0f0'
                  }
                }}
              />
            </Box>
          </Box>

          {/* Navigation Buttons */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: 2,
              mt: 4
            }}
          >
            <Button
              variant="outlined"
              onClick={handleBackClick}
              sx={{
                minWidth: '120px',
                borderColor: '#B0BEC5',
                color: '#37474F',
                '&:hover': {
                  borderColor: '#78909C',
                  backgroundColor: '#ECEFF1'
                }
              }}
            >
              Back
            </Button>
            <Button
              variant="contained"
              onClick={handleNextClick}
              sx={{
                minWidth: '120px',
                backgroundColor: '#147C65',
                '&:hover': {
                  backgroundColor: '#00695C'
                }
              }}
            >
              Next
            </Button>
          </Box>
        </Box>
      </SidebarHeader>

      {/* Detail Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>{dialogContent.title}</DialogTitle>
        <DialogContent>
          <Typography variant="body1">{dialogContent.content}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default SelectedDisclosuresSummary;