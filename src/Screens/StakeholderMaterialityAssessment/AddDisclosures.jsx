import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Card } from '@mui/material';
import SidebarHeader from '../../Components/SidebarHeader';
import { api } from '../common';

const DisclosuresGrid = () => {
  const [disclosures, setDisclosures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentRow, setCurrentRow] = useState(null);
  const [reason, setReason] = useState('');
  const [response, setResponse] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Fetching data...');
       
        const data = await api.get('esg/api/disclosures-by-standard/?standard_name=GRI%2014').json();
        
        setDisclosures(data.disclosures.map((item, index) => ({
          ...item,
          id: index,
          sdg_targets: item.sdg_targets.map(target => target.target).join(', ')
        })));
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleResponseClick = (row) => {
    setCurrentRow(row);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setReason('');
    setResponse('');
  };

  const handleSubmit = () => {
    // Here you would typically make an API call to save the response and reason
    console.log({
      disclosureId: currentRow.disclosure_id,
      response,
      reason
    });
    handleCloseDialog();
  };

  const columns = [
    { field: 'disclosure_id', headerName: 'ID', width: 130 },
    { field: 'disclosure_theme', headerName: 'Theme', width: 180 },
    { field: 'sub_topic', headerName: 'Sub Topic', width: 150 },
    { field: 'disclosure_description', headerName: 'Description', width: 400 },
    { field: 'dimension', headerName: 'Dimension', width: 130 },
    { field: 'year', headerName: 'Year', width: 100 },
    { field: 'sdg_targets', headerName: 'SDG Targets', width: 300 },
    {
      field: 'response',
      headerName: 'Response',
      width: 120,
      renderCell: (params) => (
        <Button
          variant="outlined"
          color="primary"
          onClick={() => handleResponseClick(params.row)}
        >
          Yes/No
        </Button>
      ),
    },
  ];

  return (
    <SidebarHeader>
        <Card>
            <div className="h-[600px] w-full">
            <DataGrid
                rows={disclosures}
                columns={columns}
                loading={loading}
                pagination
                autoHeight
            />

            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>Provide Response</DialogTitle>
                <DialogContent>
                <div className="space-y-4 p-4">
                    <div>
                    <div className="mb-2">Select Response:</div>
                    <div className="space-x-2">
                        <Button 
                        variant={response === 'yes' ? 'contained' : 'outlined'}
                        onClick={() => setResponse('yes')}
                        >
                        Yes
                        </Button>
                        <Button 
                        variant={response === 'no' ? 'contained' : 'outlined'}
                        onClick={() => setResponse('no')}
                        >
                        No
                        </Button>
                    </div>
                    </div>
                    <TextField
                    label="Reason"
                    multiline
                    rows={4}
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    fullWidth
                    />
                </div>
                </DialogContent>
                <DialogActions>
                <Button onClick={handleCloseDialog}>Cancel</Button>
                <Button onClick={handleSubmit} variant="contained" disabled={!response || !reason}>
                    Submit
                </Button>
                </DialogActions>
            </Dialog>
            </div>
        </Card>
    </SidebarHeader>
  );
};

export default DisclosuresGrid;