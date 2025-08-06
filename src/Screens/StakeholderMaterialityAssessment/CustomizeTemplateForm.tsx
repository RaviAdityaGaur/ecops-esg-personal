import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import {
    Box,
    Typography,
    Paper,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Grid,
    Chip,
    IconButton,
    Select,
    MenuItem,
    FormControl,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SidebarHeader from '../../Components/SidebarHeader';

// Step 2: Import React-Quill and its CSS
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

// --- Define Custom Font List ---
const fontWhitelist = [
  'arial', 'comic-sans-ms', 'courier-new', 'georgia', 'helvetica', 'lucida-sans-unicode',
  'tahoma', 'times-new-roman', 'trebuchet-ms', 'verdana'
];

// --- Custom Toolbar Configuration for React-Quill ---
const quillModules = {
  toolbar: [
    [{ 'font': fontWhitelist }],
    ['bold', 'italic', 'underline'],                           
    [{ 'header': [1, 2, 3, false] }],                        
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],            
    [{ 'align': [] }],                                       
    ['link', 'image'],                                       
    [{ 'color': [] }, { 'background': [] }],                   
    ['clean']                                                
  ],
};

// Interface for the template data structure
interface TemplateData {
    standard: string;
    topicStandard: string;
    disclosureSubTopic: string;
    disclosureId: string;
    sdgGoal: string;
    sdgTarget: string;
}

// Interface for reporting requirements table with customizable units
interface CustomizableRequirement {
    id: number;
    description: string;
    unit: string;
    availableUnits: string[];
}

// Mock data
const mockTemplateData: TemplateData = {
    standard: 'GRI 12',
    topicStandard: 'Child labor',
    disclosureSubTopic: 'Operations &...',
    disclosureId: 'GRI 408-1',
    sdgGoal: 'Dummy',
    sdgTarget: 'Dummy'
};

const mockCustomizableRequirements: CustomizableRequirement[] = [
    {
        id: 1,
        description: 'Total water withdrawal from all areas, and a breakdown of this total by the following sources, if applicable:',
        unit: 'UNIT',
        availableUnits: ['UNIT', 'Liters', 'Gallons', 'Cubic meters', 'Select']
    },
    { 
        id: 2, 
        description: 'Surface water', 
        unit: 'Select', 
        availableUnits: ['Select', 'Liters', 'Gallons', 'Cubic meters', 'UNIT'] 
    },
    { 
        id: 3, 
        description: 'Ground water', 
        unit: 'Select', 
        availableUnits: ['Select', 'Liters', 'Gallons', 'Cubic meters', 'UNIT'] 
    },
    { 
        id: 4, 
        description: 'Sea water', 
        unit: 'Select', 
        availableUnits: ['Select', 'Liters', 'Gallons', 'Cubic meters', 'UNIT'] 
    },
    { 
        id: 5, 
        description: 'Produced water', 
        unit: 'Select', 
        availableUnits: ['Select', 'Liters', 'Gallons', 'Cubic meters', 'UNIT'] 
    },
    { 
        id: 6, 
        description: 'Third-party water', 
        unit: 'Select', 
        availableUnits: ['Select', 'Liters', 'Gallons', 'Cubic meters', 'UNIT'] 
    },
];

// Component for a single info card value
const InfoValueCard = ({ value, isHighlighted = false }: { value: string, isHighlighted?: boolean }) => (
    <Paper variant="outlined" sx={{ p: '6px 12px', textAlign: 'center', backgroundColor: 'white', borderColor: '#e0e0e0', boxShadow: 'none' }}>
        <Typography variant="body2" sx={{ fontWeight: 500, fontSize: '14px', color: isHighlighted ? '#147C65' : 'text.primary' }}>
            {value}
        </Typography>
    </Paper>
);

const CustomizeTemplateForm: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { taskId } = useParams();
    const templateId = location.state?.templateId;

    const [templateData, setTemplateData] = useState<TemplateData>(mockTemplateData);
    const [customizableRequirements, setCustomizableRequirements] = useState<CustomizableRequirement[]>(mockCustomizableRequirements);
    const [customization, setCustomization] = useState('');
    const [attachedDocuments, setAttachedDocuments] = useState<File[]>([]);

    useEffect(() => {
        console.log('CustomizeTemplateForm loaded with:', { taskId, templateId });
    }, [taskId, templateId]);

    const handleBack = () => navigate(-1);
    const handleCancel = () => navigate(-1);
    const handleSave = () => {
        console.log('Saving customized template...');
        console.log('Customization:', customization);
        console.log('Requirements:', customizableRequirements);
        // Navigate back or show success message
        navigate(-1);
    };

    const handleUnitChange = (requirementId: number, newUnit: string) => {
        setCustomizableRequirements(prev =>
            prev.map(req =>
                req.id === requirementId ? { ...req, unit: newUnit } : req
            )
        );
    };

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files) {
            setAttachedDocuments(prev => [...prev, ...Array.from(files)]);
        }
    };

    const infoLabels = ["STANDARDS", "TOPIC STANDARD", "DISCLOSURE SUB TOPIC", "DISCLOSURE ID", "SDG GOAL", "SDG TARGET"];
    const infoValues = [templateData.standard, templateData.topicStandard, templateData.disclosureSubTopic, templateData.disclosureId, templateData.sdgGoal, templateData.sdgTarget];

    return (
        <SidebarHeader>
            <Box sx={{ width: '100%', p: 3, bgcolor: '#f7f8fc' }}>
                {/* Header with Title */}
                <Paper sx={{ p: 2, display: 'flex', alignItems: 'center', mb: 3 }}>
                    <IconButton onClick={handleBack} sx={{ mr: 1 }}>
                        <ArrowBackIcon />
                    </IconButton>
                    <Typography variant="h5" sx={{ fontWeight: 600 }}>
                        Water Withdrawal
                    </Typography>
                </Paper>

                {/* Actions Section */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, px: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                        This template requires quantitative data.
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                        <Button 
                            variant="outlined" 
                            sx={{ 
                                textTransform: 'none', 
                                borderColor: '#147C65', 
                                color: '#147C65', 
                                bgcolor: '#E8F5E8',
                                '&:hover': { borderColor: '#0f5a4a', bgcolor: '#d4f4d4' } 
                            }}
                        >
                            Customise Template
                        </Button>
                        <Button variant="text" sx={{ textTransform: 'none', color: 'text.primary', fontWeight: 600 }}>Create Custom Template</Button>
                        <Button variant="outlined" sx={{ textTransform: 'none', borderColor: '#147C65', color: '#147C65', '&:hover': { borderColor: '#0f5a4a' } }}>
                            Request Data From Others
                        </Button>
                    </Box>
                </Box>

                {/* Template Information Section */}
                <Box sx={{ mb: 3 }}>
                    <Grid container spacing={2} sx={{ px: 2, mb: 1 }}>
                        {infoLabels.map(label => (
                            <Grid item xs={2} key={label}>
                                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, fontSize: '11px' }}>
                                    {label}
                                </Typography>
                            </Grid>
                        ))}
                    </Grid>
                    <Box sx={{ bgcolor: '#f0f2f5', p: 2, borderRadius: 2 }}>
                        <Grid container spacing={2}>
                            {infoValues.map((value, index) => (
                                <Grid item xs={2} key={index}>
                                    <InfoValueCard value={value} isHighlighted={index === 0} />
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
                </Box>

                {/* Main Content Area in Grid */}
                <Grid container spacing={3}>
                    {/* Customizable Requirements Table Section */}
                    <Grid item xs={12}>
                        <Paper sx={{ p: 3, borderRadius: 2 }}>
                            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Customise Template</Typography>
                            
                            <TableContainer component={Paper} variant="outlined" sx={{ mb: 3 }}>
                                <Table size="small">
                                    <TableHead>
                                        <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                                            <TableCell sx={{ fontWeight: 600, minWidth: 400 }}>
                                                PERMISSIONS
                                            </TableCell>
                                            <TableCell sx={{ fontWeight: 600, width: 150 }}>UNIT</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {customizableRequirements.map((requirement) => (
                                            <TableRow key={requirement.id}>
                                                <TableCell sx={{ fontSize: '14px', py: 2 }}>
                                                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                                        {requirement.id}. {requirement.description}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell sx={{ py: 2 }}>
                                                    <FormControl fullWidth size="small">
                                                        <Select
                                                            value={requirement.unit}
                                                            onChange={(e) => handleUnitChange(requirement.id, e.target.value)}
                                                            displayEmpty
                                                            sx={{
                                                                '& .MuiSelect-select': {
                                                                    padding: '8px 12px',
                                                                    fontSize: '14px'
                                                                },
                                                                '& .MuiOutlinedInput-notchedOutline': {
                                                                    borderColor: '#e0e0e0'
                                                                }
                                                            }}
                                                        >
                                                            {requirement.availableUnits.map((unit) => (
                                                                <MenuItem key={unit} value={unit}>
                                                                    <Typography 
                                                                        color={unit === 'Select' ? 'text.secondary' : 'text.primary'}
                                                                        sx={{ fontSize: '14px' }}
                                                                    >
                                                                        {unit}
                                                                    </Typography>
                                                                </MenuItem>
                                                            ))}
                                                        </Select>
                                                    </FormControl>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>

                            {/* Action Buttons for table */}
                            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mb: 3 }}>
                                <Button 
                                    variant="outlined" 
                                    onClick={handleCancel}
                                    sx={{ 
                                        textTransform: 'none', 
                                        borderColor: '#e0e0e0', 
                                        color: 'text.primary',
                                        '&:hover': { borderColor: '#bdbdbd' } 
                                    }}
                                >
                                    Cancel
                                </Button>
                                <Button 
                                    variant="contained" 
                                    onClick={handleSave}
                                    sx={{ 
                                        textTransform: 'none', 
                                        bgcolor: '#147C65', 
                                        '&:hover': { bgcolor: '#0f5a4a' } 
                                    }}
                                >
                                    Save
                                </Button>
                            </Box>

                            {/* Customization Text Editor */}
                            <Box sx={{ mb: 3 }}>
                                <Box sx={{ '.ql-editor': { minHeight: '150px' } }}>
                                    <ReactQuill
                                        theme="snow"
                                        value={customization}
                                        onChange={setCustomization}
                                        placeholder="Enter customization details here..."
                                        modules={quillModules}
                                    />
                                </Box>
                            </Box>
                        </Paper>
                    </Grid>

                    {/* Attach Documents Section */}
                    <Grid item xs={12}>
                        <Paper sx={{ p: 3, borderRadius: 2 }}>
                            <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>Attach Documents</Typography>
                            <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: 'block' }}>
                                Upload PDF, DOC, DOCX, PNG, JPG, JPEG
                            </Typography>
                            
                            <Box
                                onClick={() => document.getElementById('file-upload-customize')?.click()}
                                sx={{
                                    border: '2px dashed #e0e0e0',
                                    borderRadius: 2,
                                    p: 4,
                                    textAlign: 'center',
                                    cursor: 'pointer',
                                    minHeight: 120,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    '&:hover': { bgcolor: '#fafafa' }
                                }}
                            >
                                <Typography variant="body2" color="text.secondary">
                                    Drag And Drop a file here, or
                                </Typography>
                                <Typography variant="body2" sx={{ textDecoration: 'underline', color: '#147C65', cursor: 'pointer' }}>
                                    Click to select a file
                                </Typography>
                                <input
                                    id="file-upload-customize"
                                    type="file"
                                    multiple
                                    accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                                    style={{ display: 'none' }}
                                    onChange={handleFileUpload}
                                />
                            </Box>
                            
                            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                                Maximum file size: 50 MB
                            </Typography>

                            {/* Display uploaded files */}
                            {attachedDocuments.length > 0 && (
                                <Box sx={{ mt: 2 }}>
                                    {attachedDocuments.map((file, index) => (
                                        <Chip
                                            key={index}
                                            label={file.name}
                                            onDelete={() => {
                                                setAttachedDocuments(prev => prev.filter((_, i) => i !== index));
                                            }}
                                            sx={{ mr: 1, mb: 1 }}
                                        />
                                    ))}
                                </Box>
                            )}
                        </Paper>
                    </Grid>

                    {/* Final Action Buttons */}
                    <Grid item xs={12}>
                        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 2 }}>
                            <Button 
                                variant="outlined" 
                                onClick={handleCancel}
                                sx={{ 
                                    textTransform: 'none', 
                                    borderColor: '#147C65', 
                                    color: '#147C65',
                                    px: 4,
                                    '&:hover': { borderColor: '#147C65', bgcolor: 'rgba(20, 124, 101, 0.05)' } 
                                }}
                            >
                                Cancel
                            </Button>
                            <Button 
                                variant="contained" 
                                onClick={handleSave}
                                sx={{ 
                                    textTransform: 'none', 
                                    bgcolor: '#147C65', 
                                    px: 4,
                                    '&:hover': { bgcolor: '#0f5a4a' } 
                                }}
                            >
                                Submit
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
            </Box>
        </SidebarHeader>
    );
};

export default CustomizeTemplateForm;
