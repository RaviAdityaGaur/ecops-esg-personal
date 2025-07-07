import { Box, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Radio, InputAdornment, DialogContentText, Tabs, Tab } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import SidebarHeader from '../../Components/SidebarHeader';
import { useEffect, useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { ProgressTracker } from '../../Components/progress-tracker';
import SearchIcon from '@mui/icons-material/Search';
import { api, getAuthDetails } from '../common';

// interface DisclosureData {
//   id: string;
//   standard: string;
//   material_topic: string;
//   topic_standard: string;
//   disclosure_sub_topic: string;
//   disclosure_description: string;
//   disclosure_id: string;
//   sdg_goal: string;
//   sdg_target: string;
//   status?: 'completed' | 'pending' | 'not-started';
//   statusColor?: string;
//   assignedTo?: string;
//   assignedToName?: string;
//   dueDate?: Date | null;
// }

const TaskAssignment = () => {
  const { reportId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  // const [disclosures, setDisclosures] = useState<DisclosureData[]>([]);
  const [disclosures, setDisclosures] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState(0);
  const [users, setUsers] = useState<{ id: string; name: string; department: string; email: string; org_user_id: string }[]>([]);
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [finalConfirmDialogOpen, setFinalConfirmDialogOpen] = useState(false);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(null);
  const [currentDisclosureId, setCurrentDisclosureId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [monthlyDueDay, setMonthlyDueDay] = useState<string>('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogContent, setDialogContent] = useState({
    title: '',
    content: ''
  });

  const [steps] = useState([
    { id: 1, title: 'Setup ESG Report', type: 'main' as const, status: 'complete' as const },
    { id: 2, title: 'Create Report', type: 'main' as const, status: 'complete' as const },
    { id: 3, title: 'Select Disclosures', type: 'main' as const, status: 'complete' as const },
    { id: 4, title: 'Review Disclosures', type: 'main' as const, status: 'complete' as const },
    { id: 5, title: 'Send Email', type: 'main' as const, status: 'complete' as const },
    { id: 6, title: 'Steering Committee Approval', type: 'main' as const, status: 'complete' as const },
    { id: 7, title: 'Sustainability Manager Response', type: 'main' as const, status: 'complete' as const },
    { id: 8, title: 'Assign Disclosures', type: 'main' as const, status: 'in-progress' as const }
  ]);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  // Calculate disclosure counts for each dimension
  const dimensionCounts = useMemo(() => {
    if (!disclosures || disclosures.length === 0)
      return {
        Environmental: 0,
        Social: 0,
        Governance: 0
      };

    // Filter disclosures that are added to report
    const addedDisclosures = disclosures.filter(disclosure => disclosure.response?.is_added === true);

    return addedDisclosures.reduce((acc, disclosure) => {
      if (disclosure.dimension) {
        acc[disclosure.dimension] = (acc[disclosure.dimension] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);
  }, [disclosures]);

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

  useEffect(() => {
    const fetchDisclosuresForReport = async () => {
      if (!reportId) {
        setDisclosures([]);
        return;
      }

      // setLoading(true);
      try {
        const response: any = await api.get(`esg/api/get-disclosure-for-report/?report_id=${reportId}`).json();

        const fetched = response.disclosures ? response.disclosures : [];
        console.log('Fetched disclosures:', fetched);
        setDisclosures(fetched);
      } catch (err) {
        console.error('Error fetching disclosures:', err);
        console.log('Falling back to demoData');
      } finally {
        // setLoading(false);
      }
    };

    fetchDisclosuresForReport();
  }, [reportId]);

  useEffect(() => {
    const fetchInternalUsers = async () => {
      try {
        const response = await api.get('esg/api/get-internal-external-users/?user_type=INTERNAL');
        const usersData = await response.json();
        console.log('Fetched internal users:', usersData);

        // Transform the API response to match our expected format
        const transformedUsers = (usersData as any[]).map((user: any) => ({
          id: user.id.toString(),
          org_user_id: user.org_user_id,
          name: user.full_name || (user.first_name && user.last_name ? `${user.first_name} ${user.last_name}` : '') || user.username || user.email?.split('@')[0] || 'Unknown User',
          department: user.department || 'Not specified',
          email: user.email
        }));

        setUsers(transformedUsers);
      } catch (error) {
        console.error('Error fetching internal users:', error);
        // Fallback to hardcoded data if API fails
      }
    };

    fetchInternalUsers();
  }, []);

  const filteredDisclosures = disclosures.filter(disclosure => disclosure.dimension === getDimensionFromTab(activeTab) && disclosure.response?.is_added === true);
  const commonBoxShadow = '0px 2px 4px rgba(0, 0, 0, 0.1)';

  const handleBack = () => {
    navigate(-1);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // Uncomment when API is ready
      // const response = await api.post(`/esg/api/reports/${reportId}/assign-tasks`, {
      //   disclosures
      // });

      // Mock successful submission
      await new Promise(resolve => setTimeout(resolve, 1000));

      navigate(`/reporting-task-management/${reportId}`);
    } catch (error) {
      console.error('Error assigning tasks:', error);
    } finally {
      setLoading(false);
    }
  };
  const handleUserAssignment = (disclosureId: string, userId: string, dueDate: Date | null) => {
    const selectedUser = users.find(u => u.id === userId);
    console.log('Updating disclosure with report_disclosure_id:', disclosureId);
    setDisclosures(
      disclosures.map(d => {
        if (d.report_disclosure_id.toString() === disclosureId) {
          console.log('Found matching disclosure:', d);
          return {
            ...d,
            assignedTo: userId,
            assignedToName: selectedUser?.name || 'User',
            dueDate: dueDate
          };
        }
        return d;
      })
    );
  };
  const handleOpenAssignDialog = (disclosureId: string) => {
    setCurrentDisclosureId(disclosureId);
    setSelectedEmployeeId(null);
    setSearchQuery('');
    setDueDate(null);
    setMonthlyDueDay('');
    setAssignDialogOpen(true);
  };
  const handleCloseAssignDialog = () => {
    setAssignDialogOpen(false);
    setCurrentDisclosureId(null);
    setSelectedEmployeeId(null);
    setSearchQuery('');
    setMonthlyDueDay('');
  };

  const handleSelectEmployee = (employeeId: string) => {
    console.log('user id>>>>', employeeId);
    setSelectedEmployeeId(employeeId);
  };

  const handleAssignEmployee = () => {
    if (selectedEmployeeId) {
      setAssignDialogOpen(false);
      setConfirmDialogOpen(true);
    }
  };

  const handleCloseConfirmDialog = () => {
    setConfirmDialogOpen(false);
    // Return to first dialog instead of resetting everything
    setAssignDialogOpen(true);
  };

  const handleConfirmClick = () => {
    setConfirmDialogOpen(false);
    setFinalConfirmDialogOpen(true);
  };
  const handleCloseFinalDialog = () => {
    setFinalConfirmDialogOpen(false);
    // Return to second dialog instead of resetting everything
    setConfirmDialogOpen(true);
    // We don't reset the monthlyDueDay since we want to keep it when going back to the previous dialog
  };
  const handleFinalAssignment = async () => {
    console.log('current >>>>', currentDisclosureId);
    if (currentDisclosureId && selectedEmployeeId && monthlyDueDay) {
      try {
        setLoading(true);
        // Prepare the payload for the assignment API
        // Try different payload structures to identify the correct format
        const payload = {
          report_disclosure_id: parseInt(currentDisclosureId),
          assigned_to: parseInt(selectedEmployeeId),
          request_data: 'nothing',
          due_date: dueDate ? dueDate.toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
          priority: 'medium',
          is_recurring: true,
          recurrence_type: 'monthly',
          recurrence_day: parseInt(monthlyDueDay)
        };
        console.log('Assigning task with payload:', payload);
        // Validate required fields before API call
        if (!payload.report_disclosure_id || isNaN(payload.report_disclosure_id)) {
          throw new Error('Invalid report_disclosure_id');
        }
        if (!payload.assigned_to || isNaN(payload.assigned_to)) {
          throw new Error('Invalid assigned_to user ID');
        }
        if (!payload.recurrence_day || isNaN(payload.recurrence_day)) {
          throw new Error('Invalid recurrence_day');
        }

        // Call the assignment API with error handling and alternative payloads
        let response;
        let successfulPayload = null;
        let lastError = null;

        // Try the main payload first
        try {
          console.log('Trying main payload:', payload);
          response = await api.post('esg/api/assign-report-task/', {
            json: payload
          });
          console.log('res', response);
        } catch (error) {
          console.log('Main payload failed, trying alternatives...');
        }
        if (response) {
          // Update local state after successful API call
          handleUserAssignment(currentDisclosureId, selectedEmployeeId, dueDate);
        }

        // Close the dialog
        setFinalConfirmDialogOpen(false);

        // Reset form fields
        setCurrentDisclosureId(null);
        setSelectedEmployeeId(null);
        setDueDate(null);
        setMonthlyDueDay('');
      } catch (error) {
        console.error('Error assigning task:', error);
      } finally {
        setLoading(false);
      }
    } else {
      // Validation error
      console.error('Missing required fields:', {
        currentDisclosureId,
        selectedEmployeeId,
        monthlyDueDay
      });
      alert('Please fill in all required fields before assigning the task.');
    }
  };

  const handleDetailClick = (title: string, content: string) => {
    setDialogContent({ title, content });
    setDialogOpen(true);
  };

  const handleConfirmAssign = () => {
    handleConfirmClick();
  };
  // const columns: GridColDef[] = [
  //   {
  //     field: 'status',
  //     headerName: 'STATUS',
  //     width: 80,
  //     renderCell: (params) => (
  //       <Box sx={{
  //         display: 'flex',
  //         alignItems: 'center',
  //         justifyContent: 'center',
  //         width: '100%'
  //       }}>
  //         <Box
  //           sx={{
  //             width: 12,
  //             height: 12,
  //             borderRadius: '50%',
  //             backgroundColor: params.row.statusColor || '#ccc',
  //           }}
  //         />
  //       </Box>
  //     ),
  //   },
  //   { field: 'standard', headerName: 'STANDARDS', width: 120 },
  //   { field: 'material_topic', headerName: 'MATERIAL TOPIC', width: 150 },
  //   { field: 'topic_standard', headerName: 'TOPIC STANDARD', width: 150 },
  //   { field: 'disclosure_sub_topic', headerName: 'DISCLOSURE SUB TOPIC', width: 180 },
  //   { field: 'disclosure_description', headerName: 'DISCLOSURE DESCRIPTIONS', width: 220 },
  //   { field: 'disclosure_id', headerName: 'DISCLOSURE ID', width: 150 },
  //   { field: 'sdg_goal', headerName: 'SDG GOAL', width: 120 },
  //   { field: 'sdg_target', headerName: 'SDG TARGET', width: 120 },
  //   {
  //     field: 'assign',
  //     headerName: 'ACTIONS',
  //     width: 200,
  //     renderCell: (params) => (
  //       <Box>
  //         {params.row.assignedTo ? (
  //           <Box sx={{ fontSize: '14px' }}>
  //             <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
  //               {params.row.assignedToName || users.find(u => u.id === params.row.assignedTo)?.name}
  //             </Typography>
  //             {params.row.dueDate && (
  //               <Typography variant="caption" color="text.secondary">
  //                 Due: {params.row.dueDate.toLocaleDateString()}
  //               </Typography>
  //             )}
  //           </Box>
  //         ) : (
  //           <Button
  //             variant="contained"
  //             onClick={() => handleOpenAssignDialog(params.row.id)}
  //             sx={{
  //               bgcolor: '#147C65',
  //               '&:hover': {
  //                 backgroundColor: '#1b5e20',
  //               },
  //               textTransform: 'none',
  //               fontSize: '14px',
  //               borderRadius: '4px',
  //               py: 0.5
  //             }}
  //           >
  //             Assign User
  //           </Button>
  //         )}
  //       </Box>
  //     ),
  //   },
  // ];
  // Box styles for clickable content
  const commonBoxStyles = {
    p: 1.5,
    my: 1,
    borderRadius: 1,
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    cursor: 'pointer',
    '&:hover': {
      boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
    },
    backgroundColor: 'white',
    width: '150px',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    lineHeight: '1.2em',
    maxHeight: '2.4em',
    minHeight: '2.4em'
  };
  const commonBoxStylesWithMargin = {
    ...commonBoxStyles,
    ml: 5,
    mx: 0,
    width: '90%'
  };

  const columns = [
    {
      field: 'standard_name',
      headerName: 'STANDARDS',
      flex: 0.8, // Use flex instead of width for responsive sizing
      minWidth: 100, // Set a minimum width to avoid too narrow columns
      renderCell: (params: any) => <Box sx={commonBoxStyles}>{params.value}</Box>
    },
    {
      field: 'topic_standard',
      headerName: 'TOPIC STANDARD',
      flex: 1.2,
      minWidth: 120,
      renderCell: (params: any) => (
        <Box sx={commonBoxStyles} onClick={() => handleDetailClick('Topic Standard', params.row.standard_name)}>
          {params.row.standard_name}
        </Box>
      )
    },
    {
      field: 'sub_topic_name', // dummy field name, not nested
      headerName: 'DISCLOSURE SUB TOPIC',
      flex: 1.2,
      minWidth: 140,
      renderCell: (params: any) => (
        <Box sx={commonBoxStylesWithMargin} onClick={() => handleDetailClick('Disclosure Sub Topic', params.row.sub_topic.name)}>
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
        <Box sx={commonBoxStylesWithMargin} onClick={() => handleDetailClick('Disclosure Descriptions', params.value)}>
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
        <Box sx={commonBoxStylesWithMargin} onClick={() => handleDetailClick('Disclosure ID', params.value)}>
          {params.value}
        </Box>
      )
    },
    {
      field: 'sdg_goal',
      headerName: 'SDG GOAL',
      flex: 0.8,
      minWidth: 90,
      renderCell: (params: any) => (
        <Box sx={commonBoxStylesWithMargin} onClick={() => handleDetailClick('SDG Goal', params.row.sdg_targets?.map((item: any) => item.goal).join(', ') || 'Not assigned')}>
          {params.row.sdg_targets?.map((item: any) => item.goal).join(', ') || 'Not assigned'}
        </Box>
      )
    },
    {
      field: 'sdg_target',
      headerName: 'SDG TARGET',
      flex: 0.8,
      minWidth: 100,
      renderCell: (params: any) => (
        <Box sx={commonBoxStylesWithMargin} onClick={() => handleDetailClick('SDG Traget', params.row.sdg_targets?.map((item: any) => item.target).join(', ') || 'Not assigned')}>
          {params.row.sdg_targets?.map((item: any) => item.target).join(', ') || 'Not assigned'}
        </Box>
      )
    },
    {
      field: 'assign',
      headerName: 'ACTIONS',
      width: 200,
      renderCell: (params: any) => (
        <Box>
          {
          params.row.assignedTo ? (
            <Box sx={{ fontSize: '14px' }}>
              <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                {params.row.assignedToName || users.find(u => u.id === params.row.assignedTo)?.name}
              </Typography>
              {params.row.dueDate && (
                <Typography variant="caption" color="text.secondary">
                  Due: {params.row.dueDate.toLocaleDateString()}
                </Typography>
              )}
            </Box>
          ) : (
            <Button
              variant="contained"
              onClick={() => {
                console.log('Assign button clicked for disclosure:', params.row);
                console.log('report_disclosure_id being passed:', params.row.report_disclosure_id);
                handleOpenAssignDialog(params.row.report_disclosure_id.toString());
              }}
              sx={{ bgcolor: '#147C65', '&:hover': { backgroundColor: '#1b5e20' }, textTransform: 'none', fontSize: '14px', borderRadius: '4px', py: 0.5 }}
            >
              {' '}
              Assign User{' '}
            </Button>
          )}
        </Box>
      )
    }
  ];

  return (
    <SidebarHeader>
      {/* Page title and progress tracker */}
      <Box sx={{ width: '100%', mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
          ESG Report - Assign Disclosures
        </Typography>
        <ProgressTracker steps={steps} currentStep={8} />
      </Box>
      <Box sx={{ backgroundColor: 'white', p: 1, borderRadius: 2, boxShadow: '0px 2px 6px rgba(0,0,0,0.05)' }}>
        {/* Tabs for Environment, Social, Governance */}
        <Box
          sx={{
            width: '100%',
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: commonBoxShadow,
            borderBottom: '1px solid #E0E0E0',
            mb: 2
          }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              pt: 2,
              pl: 4
            }}
          >
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              sx={{
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
              <Tab
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography component="span">Environment</Typography>
                    <Box
                      sx={{
                        ml: 1,
                        backgroundColor: activeTab === 0 ? '#147C65' : '#64748B',
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
                      {dimensionCounts['Environmental'] || 0}
                    </Box>
                  </Box>
                }
              />
              <Tab
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography component="span">Social</Typography>
                    <Box
                      sx={{
                        ml: 1,
                        backgroundColor: activeTab === 1 ? '#147C65' : '#64748B',
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
                      {dimensionCounts['Social'] || 0}
                    </Box>
                  </Box>
                }
              />
              <Tab
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography component="span">Governance</Typography>
                    <Box
                      sx={{
                        ml: 1,
                        backgroundColor: activeTab === 2 ? '#147C65' : '#64748B',
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
                      {dimensionCounts['Governance'] || 0}
                    </Box>
                  </Box>
                }
              />
            </Tabs>
          </Box>
        </Box>

        <Box sx={{ height: 400, width: '100%', px: 3 }}>
          <DataGrid
            rows={filteredDisclosures}
            columns={columns}
            getRowId={row => row.report_disclosure_id}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 5 }
              }
            }}
            pageSizeOptions={[5, 10]}
            disableRowSelectionOnClick
            loading={loading}
            sx={{
              '& .MuiDataGrid-columnHeaders': {
                backgroundColor: '#f5f5f5',
                borderRadius: 1
              },
              '& .MuiDataGrid-cell': {
                fontSize: '14px'
              },
              border: 'none',
              borderRadius: 1,
              boxShadow: '0px 1px 3px rgba(0,0,0,0.05)'
            }}
          />
        </Box>

        <Box sx={{ p: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <Button
            variant="outlined"
            onClick={handleBack}
            sx={{
              borderColor: '#147C65',
              color: '#147C65',
              '&:hover': {
                borderColor: '#1b5e20',
                backgroundColor: 'rgba(20, 124, 101, 0.04)'
              },
              px: 3
            }}
          >
            Back
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={loading}
            sx={{
              bgcolor: '#147C65',
              '&:hover': { bgcolor: '#1b5e20' },
              px: 3
            }}
          >
            Submit
          </Button>
        </Box>
      </Box>{' '}
      {/* User Selection Dialog */}
      <Dialog open={assignDialogOpen} onClose={handleCloseAssignDialog} maxWidth="md" fullWidth>
        <DialogTitle sx={{ borderBottom: '1px solid #eee', pb: 2 }}>
          <Typography variant="h6" component="div">
            Assign User
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <TextField
            placeholder="Search..."
            variant="outlined"
            fullWidth
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              )
            }}
            sx={{ mb: 3 }}
          />

          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                <TableRow>
                  <TableCell padding="checkbox" width="5%"></TableCell>
                  <TableCell width="35%">Name</TableCell>
                  <TableCell width="30%">Department</TableCell>
                  <TableCell width="30%">Email</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users
                  .filter(user => user.name.toLowerCase().includes(searchQuery.toLowerCase()) || user.department.toLowerCase().includes(searchQuery.toLowerCase()) || user.email.toLowerCase().includes(searchQuery.toLowerCase()))
                  .map(user => (
                    <TableRow key={user.id} onClick={() => handleSelectEmployee(user.org_user_id)} hover selected={selectedEmployeeId === user.id} sx={{ cursor: 'pointer' }}>
                      <TableCell padding="checkbox">
                        <Radio
                          checked={selectedEmployeeId === user.org_user_id}
                          onChange={() => handleSelectEmployee(user.org_user_id)}
                          value={user.id}
                          sx={{
                            '&.Mui-checked': {
                              color: '#147C65'
                            }
                          }}
                        />
                      </TableCell>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.department}</TableCell>
                      <TableCell>{user.email}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>{' '}
        <DialogActions sx={{ borderTop: '1px solid #eee', p: 2 }}>
          <Button onClick={handleCloseAssignDialog} sx={{ color: '#147C65', borderColor: '#147C65', '&:hover': { borderColor: '#1b5e20' } }} variant="outlined">
            Cancel
          </Button>
          <Button onClick={handleAssignEmployee} disabled={!selectedEmployeeId} variant="contained" sx={{ bgcolor: '#147C65', '&:hover': { bgcolor: '#1b5e20' } }}>
            Next
          </Button>
        </DialogActions>
      </Dialog>{' '}
      {/* Due Date Confirmation Dialog */}{' '}
      <Dialog
        open={confirmDialogOpen}
        onClose={handleCloseConfirmDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 1,
            py: 2,
            maxWidth: '600px'
          }
        }}
      >
        <Box sx={{ px: 3, pb: 1 }}>
          <Typography variant="h6" sx={{ mb: 3, fontWeight: 500 }}>
            Assign User
          </Typography>

          {/* Employee Info Table */}
          <Box sx={{ mb: 3 }}>
            {' '}
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: '2fr 1fr 2fr',
                backgroundColor: '#f9fafb',
                py: 1.5,
                px: 2,
                mb: 1
              }}
            >
              <Typography variant="body2" sx={{ fontWeight: 500, color: '#667085' }}>
                Employee Name
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 500, color: '#667085' }}>
                DEPT
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 500, color: '#667085' }}>
                EMAIL ID
              </Typography>
            </Box>
            {selectedEmployeeId && (
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: '2fr 1fr 2fr',
                  py: 1.5,
                  px: 2,
                  borderBottom: '1px solid #eaecf0'
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {' '}
                  <Radio
                    checked={true}
                    size="small"
                    sx={{
                      '&.Mui-checked': { color: '#147C65' },
                      padding: 0,
                      mr: 1
                    }}
                  />
                  <Typography variant="body2">{users.find(u => u.id === selectedEmployeeId)?.name}</Typography>
                </Box>
                <Typography variant="body2">{users.find(u => u.id === selectedEmployeeId)?.department}</Typography>
                <Typography variant="body2" sx={{ color: '#667085' }}>
                  {users.find(u => u.id === selectedEmployeeId)?.email}
                </Typography>
              </Box>
            )}
          </Box>

          {/* Due Date */}
          <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="body2" sx={{ minWidth: '70px' }}>
              Due Date:
            </Typography>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                value={dueDate}
                onChange={newValue => setDueDate(newValue)}
                format="dd/MM/yyyy"
                slotProps={{
                  textField: {
                    fullWidth: true,
                    variant: 'outlined',
                    size: 'small',
                    placeholder: 'DD/MM/YYYY',
                    sx: {
                      '.MuiOutlinedInput-root': {
                        borderRadius: 1,
                        fontSize: '14px'
                      }
                    }
                  }
                }}
                disablePast
              />
            </LocalizationProvider>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: '13px', mb: 4 }}>
            This template requires qualitative data.
          </Typography>
        </Box>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 2,
            px: 3,
            borderTop: '1px solid #eaecf0',
            pt: 2
          }}
        >
          <Button
            onClick={handleCloseConfirmDialog}
            variant="outlined"
            sx={{
              borderColor: '#d0d5dd',
              color: '#344054',
              '&:hover': { borderColor: '#b0b5c0' },
              px: 3,
              py: 0.5,
              borderRadius: 1,
              textTransform: 'none'
            }}
          >
            Back
          </Button>
          <Button
            onClick={handleConfirmAssign}
            variant="contained"
            disabled={!dueDate}
            sx={{
              bgcolor: '#147C65',
              '&:hover': { bgcolor: '#0e6651' },
              px: 3,
              py: 0.5,
              borderRadius: 1,
              textTransform: 'none'
            }}
          >
            Next
          </Button>
        </Box>
      </Dialog>{' '}
      {/* Final Confirmation Dialog */}
      <Dialog
        open={finalConfirmDialogOpen}
        onClose={handleCloseFinalDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 1,
            py: 2,
            maxWidth: '600px'
          }
        }}
      >
        <Box sx={{ px: 3, pb: 1 }}>
          <Typography variant="h6" sx={{ mb: 3, fontWeight: 500 }}>
            Assign User
          </Typography>

          {/* Employee Info Table */}
          <Box sx={{ mb: 3 }}>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: '2fr 1fr 2fr',
                backgroundColor: '#f9fafb',
                py: 1.5,
                px: 2,
                mb: 1
              }}
            >
              <Typography variant="body2" sx={{ fontWeight: 500, color: '#667085' }}>
                Employee Name
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 500, color: '#667085' }}>
                DEPT
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 500, color: '#667085' }}>
                EMAIL ID
              </Typography>
            </Box>

            {selectedEmployeeId && (
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: '2fr 1fr 2fr',
                  py: 1.5,
                  px: 2,
                  borderBottom: '1px solid #eaecf0'
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Radio
                    checked={true}
                    size="small"
                    sx={{
                      '&.Mui-checked': { color: '#147C65' },
                      padding: 0,
                      mr: 1
                    }}
                  />
                  <Typography variant="body2">{users.find(u => u.id === selectedEmployeeId)?.name}</Typography>
                </Box>
                <Typography variant="body2">{users.find(u => u.id === selectedEmployeeId)?.department}</Typography>
                <Typography variant="body2" sx={{ color: '#667085' }}>
                  {users.find(u => u.id === selectedEmployeeId)?.email}
                </Typography>
              </Box>
            )}
          </Box>

          {/* Monthly Due Date Input - Matching the design in the image */}
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', minWidth: '120px' }}>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  Due Date
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ ml: 0.5 }}>
                  (every month):
                </Typography>
              </Box>
              <TextField
                value={monthlyDueDay}
                onChange={e => setMonthlyDueDay(e.target.value)}
                placeholder="day of every month"
                size="small"
                sx={{
                  maxWidth: '160px',
                  '.MuiOutlinedInput-root': {
                    borderRadius: 1,
                    fontSize: '14px'
                  }
                }}
              />
            </Box>

            <Typography variant="body2" sx={{ mb: 2 }}>
              This is recurring and will stop at the end of the reporting period on <strong>31 Dec 2025</strong>.
            </Typography>

            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '13px' }}>
              This template requires quantitative data.
            </Typography>
          </Box>

          {currentDisclosureId && (
            <Box sx={{ mb: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>
                Disclosure: {disclosures.find(d => d.report_disclosure_id.toString() === currentDisclosureId)?.disclosure_id}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '13px' }}>
                {disclosures.find(d => d.report_disclosure_id.toString() === currentDisclosureId)?.disclosure_description}
              </Typography>
            </Box>
          )}
        </Box>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 2,
            px: 3,
            borderTop: '1px solid #eaecf0',
            pt: 2
          }}
        >
          <Button
            onClick={handleCloseFinalDialog}
            variant="outlined"
            sx={{
              borderColor: '#d0d5dd',
              color: '#344054',
              '&:hover': { borderColor: '#b0b5c0' },
              px: 3,
              py: 0.5,
              borderRadius: 1,
              textTransform: 'none'
            }}
          >
            Back
          </Button>{' '}
          <Button
            onClick={handleFinalAssignment}
            variant="contained"
            disabled={!monthlyDueDay.trim() || loading}
            sx={{
              bgcolor: '#147C65',
              '&:hover': { bgcolor: '#0e6651' },
              px: 3,
              py: 0.5,
              borderRadius: 1,
              textTransform: 'none'
            }}
          >
            {loading ? 'Assigning...' : 'Assign'}
          </Button>
        </Box>
      </Dialog>
      {/* Detail Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>{dialogContent.title}</DialogTitle>
        <DialogContent>
          <Typography variant="body1">{dialogContent.content}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </SidebarHeader>
  );
};

export default TaskAssignment;
