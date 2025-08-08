import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import {
    Box,
    Typography,
    Paper,
    Button,
    TextField,
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
import { api } from '../common'; // Assuming your api object is here

// Import React-Quill and its CSS
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

// Interface for reporting requirements table
interface ReportingRequirement {
    id: number;
    description: string;
    unit: string;
    months: { [key: string]: string };
    rowType: 'main' | 'sub'; // Indicates if this is a main heading or sub-heading
    mainIndex?: number; // For main headings (1, 2, 3...)
    subIndex?: string; // For sub-headings (a, b, c...)
}

// Mock data for parts of the page that are not yet dynamic
const mockReportingRequirements: ReportingRequirement[] = [
    {
        id: 1,
        description: 'Total water withdrawal from all areas, and a breakdown of this total by the following sources, if applicable:',
        unit: 'UNIT',
        months: { 'APR-20': '1', 'MAY-20': '1', 'JUN-20': '1', 'JUL-20': '1', 'AUG-20': '1', 'SEP-20': '1', 'OCT-20': '1', 'NOV-20': '1', 'DEC-20': '1' },
        rowType: 'main',
        mainIndex: 1
    },
    { id: 2, description: 'Surface water', unit: '', months: { 'APR-20': '', 'MAY-20': '', 'JUN-20': '', 'JUL-20': '', 'AUG-20': '', 'SEP-20': '', 'OCT-20': '', 'NOV-20': '', 'DEC-20': '' }, rowType: 'sub', subIndex: 'a' },
    { id: 3, description: 'Ground water', unit: '', months: { 'APR-20': '', 'MAY-20': '', 'JUN-20': '', 'JUL-20': '', 'AUG-20': '', 'SEP-20': '', 'OCT-20': '', 'NOV-20': '', 'DEC-20': '' }, rowType: 'sub', subIndex: 'a' },
    { id: 4, description: 'Sea water', unit: '', months: { 'APR-20': '', 'MAY-20': '', 'JUN-20': '', 'JUL-20': '', 'AUG-20': '', 'SEP-20': '', 'OCT-20': '', 'NOV-20': '', 'DEC-20': '' }, rowType: 'sub', subIndex: 'a' },
    { id: 5, description: 'Produced water', unit: '', months: { 'APR-20': '', 'MAY-20': '', 'JUN-20': '', 'JUL-20': '', 'AUG-20': '', 'SEP-20': '', 'OCT-20': '', 'NOV-20': '', 'DEC-20': '' }, rowType: 'sub', subIndex: 'a' },
    { id: 6, description: 'Third-party water', unit: '', months: { 'APR-20': '', 'MAY-20': '', 'JUN-20': '', 'JUL-20': '', 'AUG-20': '', 'SEP-20': '', 'OCT-20': '', 'NOV-20': '', 'DEC-20': '' }, rowType: 'sub', subIndex: 'a' },
];


// Component for a single info card value
const InfoValueCard = ({ value, isHighlighted = false }: { value: string, isHighlighted?: boolean }) => (
    <Paper variant="outlined" sx={{ p: '6px 12px', textAlign: 'center', backgroundColor: 'white', borderColor: '#e0e0e0', boxShadow: 'none' }}>
        <Typography variant="body2" sx={{ fontWeight: 500, fontSize: '14px', color: isHighlighted ? '#147C65' : 'text.primary' }}>
            {value}
        </Typography>
    </Paper>
);


const DataEntryForm: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { taskId } = useParams();
    const templateId = location.state?.templateId;
    const reportId = location.state?.reportId; // Get reportId from navigation state

    const [templateData, setTemplateData] = useState<TemplateData>({
        standard: '',
        topicStandard: '',
        disclosureSubTopic: '',
        disclosureId: '',
        sdgGoal: '',
        sdgTarget: ''
    });
    const [reportingRequirements, setReportingRequirements] = useState<ReportingRequirement[]>(mockReportingRequirements);
    const [activeTab, setActiveTab] = useState<'requirements' | 'recommendations' | 'guidance'>('requirements');
    const [summary, setSummary] = useState('');
    const [referenceLink, setReferenceLink] = useState('');
    const [attachedDocuments, setAttachedDocuments] = useState<File[]>([]);
    const [selectedSite, setSelectedSite] = useState('');
    const [disclosureContent, setDisclosureContent] = useState('');
    const [templateInstanceData, setTemplateInstanceData] = useState<any>(null);
    const [currentTask, setCurrentTask] = useState<any>(null);

    useEffect(() => {
        const fetchTaskAndTemplateData = async () => {
            if (reportId && taskId) {
                try {
                    // Convert reportId to number
                    const reportIdNumber = Number(reportId);
                    console.log('Debug: reportId (string):', reportId, 'converted to number:', reportIdNumber);
                    
                    // First, fetch the task list to get the current task details
                    const taskResponse: any = await api.get(`esg/api/report-task-list-by-report/${reportIdNumber}/tasks`).json();
                    console.log('Debug: Task list response:', taskResponse);
                    
                    // Find the current task by taskId
                    const currentTaskData = taskResponse.find((task: any) => task.task_assignment.id === Number(taskId));
                    console.log('Debug: Current task found:', currentTaskData);
                    
                    if (currentTaskData) {
                        setCurrentTask(currentTaskData);
                        
                        // Update template data with disclosure information
                        const disclosure = currentTaskData.disclosure;
                        if (disclosure) {
                            setTemplateData({
                                standard: disclosure.indicator_source || 'N/A',
                                topicStandard: disclosure.disclosure_theme || 'N/A',
                                disclosureSubTopic: disclosure.sub_topic || 'N/A',
                                disclosureId: disclosure.disclosure_id || 'N/A',
                                sdgGoal: disclosure.sdg_targets?.[0]?.goal?.toString() || 'N/A',
                                sdgTarget: disclosure.sdg_targets?.[0]?.target || 'N/A',
                            });
                        }
                        
                        // Get template instance data
                        const templateInstanceId = currentTaskData.template_instance?.id;
                        if (templateInstanceId) {
                            console.log('Debug: Fetching template instance data for ID:', templateInstanceId);
                            const templateResponse: any = await api.get(`esgtemplate/template-instance/${templateInstanceId}/data`).json();
                            console.log('Debug: Template instance data:', templateResponse);
                            setTemplateInstanceData(templateResponse);
                            
                            // Convert template data to reporting requirements format
                            if (templateResponse.rows) {
                                const requirements = convertTemplateDataToRequirements(templateResponse.rows);
                                setReportingRequirements(requirements);
                            }
                        }
                    } else {
                        console.log('Debug: No task found matching taskId:', taskId);
                    }
                } catch (error) {
                    console.error("Error fetching task and template data:", error);
                }
            } else {
                console.log('Debug: Missing reportId or taskId - reportId:', reportId, 'taskId:', taskId);
            }
        };

        fetchTaskAndTemplateData();
    }, [reportId, taskId]);

    // Helper function to convert template data to reporting requirements format
    const convertTemplateDataToRequirements = (rows: any) => {
        const requirements: ReportingRequirement[] = [];
        let idCounter = 1;
        let mainIndexCounter = 1;
        
        // Create month columns (you can adjust this based on your needs)
        const monthColumns = ['APR-20', 'MAY-20', 'JUN-20', 'JUL-20', 'AUG-20', 'SEP-20', 'OCT-20', 'NOV-20', 'DEC-20'];
        const emptyMonths = monthColumns.reduce((acc, month) => ({ ...acc, [month]: '' }), {});
        
        // Group rows by composition to create a hierarchical structure
        const groupedRows: { [key: string]: any[] } = {};
        
        Object.keys(rows).forEach((rowKey) => {
            const row = rows[rowKey];
            const composition = row.composition || 'Unnamed';
            
            if (!groupedRows[composition]) {
                groupedRows[composition] = [];
            }
            groupedRows[composition].push(row);
        });
        
        // Convert grouped rows to requirements with proper numbering
        Object.keys(groupedRows).forEach((composition) => {
            const rowGroup = groupedRows[composition];
            
            // Add main composition as a numbered requirement (1, 2, 3...)
            requirements.push({
                id: idCounter++,
                description: composition,
                unit: 'UNIT',
                months: { ...emptyMonths },
                rowType: 'main',
                mainIndex: mainIndexCounter
            });
            
            // Add sub-compositions as alphabetic sub-requirements (all marked as 'a')
            rowGroup.forEach((row) => {
                if (row.sub_composition && row.sub_composition !== composition) {
                    requirements.push({
                        id: idCounter++,
                        description: row.sub_composition,
                        unit: row.row_type === 'monthly' ? 'UNIT' : 'TEXT',
                        months: { ...emptyMonths },
                        rowType: 'sub',
                        subIndex: 'a' // All sub-items use 'a' as per the design
                    });
                }
            });
            
            mainIndexCounter++;
        });
        
        // If no rows found, return default structure
        if (requirements.length === 0) {
            requirements.push({
                id: 1,
                description: "Total water withdrawal from all areas, and a breakdown of this total by the following sources, if applicable:",
                unit: 'UNIT',
                months: { ...emptyMonths },
                rowType: 'main',
                mainIndex: 1
            });
        }
        
        return requirements;
    };

    const handleBack = () => navigate(-1);
    const handleSaveAsDraft = () => console.log('Saving as draft...');
    const handleSubmit = () => console.log('Submitting form...');
    const handleCustomiseTemplate = () => {
        navigate('/customize-template-form', { 
            state: { templateId, taskId } 
        });
    };
    const handleRequestDataFromOthers = () => {
        navigate('/request-data-form', { 
            state: { templateId, taskId } 
        });
    };
    const handleCellValueChange = (requirementId: number, month: string, value: string) => {
        setReportingRequirements(prev =>
            prev.map(req =>
                req.id === requirementId ? { ...req, months: { ...req.months, [month]: value } } : req
            )
        );
    };
    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files) {
            setAttachedDocuments(prev => [...prev, ...Array.from(files)]);
        }
    };

    const monthColumns = Object.keys(mockReportingRequirements[0]?.months || {});
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
                        {currentTask?.disclosure?.disclosure_theme || 'Water Withdrawal'}
                    </Typography>
                </Paper>

                {/* Actions Section */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, px: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                        This template requires quantitative data.
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                        <Button 
                            variant="text" 
                            onClick={handleCustomiseTemplate}
                            sx={{ textTransform: 'none', color: 'text.primary', fontWeight: 600 }}
                        >
                            Customise Template
                        </Button>
                        <Button variant="text" sx={{ textTransform: 'none', color: 'text.primary', fontWeight: 600 }}>Create Custom Template</Button>
                        <Button 
                            variant="outlined" 
                            onClick={handleRequestDataFromOthers}
                            sx={{ textTransform: 'none', borderColor: '#147C65', color: '#147C65', '&:hover': { borderColor: '#0f5a4a' } }}
                        >
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

                {/* Choose Sites Section */}
                <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>Choose Sites</Typography>
                    <FormControl sx={{ minWidth: 300, bgcolor: 'white' }}>
                        <Select value={selectedSite} onChange={(e) => setSelectedSite(e.target.value)} displayEmpty sx={{ '& .MuiSelect-select': { padding: '12px 16px', fontSize: '14px' }, '& .MuiOutlinedInput-notchedOutline': { borderColor: '#e0e0e0' } }}>
                            <MenuItem value="" disabled><Typography color="text.secondary">Select</Typography></MenuItem>
                            <MenuItem value="site1">Site 1 - Main Office</MenuItem>
                            <MenuItem value="site2">Site 2 - Manufacturing Plant</MenuItem>
                        </Select>
                    </FormControl>
                </Box>

                {/* Main Content Area in Grid */}
                <Grid container spacing={3}>
                    {/* Disclosure & Requirements Section */}
                    <Grid item xs={12}>
                        <Paper sx={{ p: 3, borderRadius: 2 }}>
                            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                                Disclosure {currentTask?.disclosure?.disclosure_id || '3-3'} ({currentTask?.disclosure?.disclosure_theme || 'Management of Material Topics'})
                            </Typography>
                            <Box sx={{ mb: 3,  '.ql-editor': { minHeight: '100px' } }}>
                                <ReactQuill
                                    theme="snow"
                                    value={disclosureContent}
                                    onChange={setDisclosureContent}
                                    placeholder="Enter disclosure content here..."
                                    modules={quillModules}
                                />
                            </Box>

                            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                                <Box sx={{ display: 'flex', gap: 3 }}>
                                    {['Requirements', 'Recommendations', 'Guidance'].map((tab) => (
                                        <Button key={tab} onClick={() => setActiveTab(tab.toLowerCase() as any)} sx={{ textTransform: 'capitalize', color: activeTab === tab.toLowerCase() ? '#147C65' : 'text.secondary', borderBottom: activeTab === tab.toLowerCase() ? 2 : 0, borderColor: '#147C65', borderRadius: 0, px: 0, py: 1 }}>{tab}</Button>
                                    ))}
                                </Box>
                            </Box>
                            {activeTab === 'requirements' && (
                                <Box>
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>This section will display the GRI requirements in a read only format...</Typography>
                                    <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                                        {currentTask?.disclosure?.disclosure_description || 'Template Data'}
                                    </Typography>
                                    <Chip label="FY 2020-21" sx={{ bgcolor: '#E8F5E8', color: '#2E7D32', mb: 2, fontWeight: 600 }} />
                                    
                                    {/* Debug information */}
                                    {templateInstanceData && (
                                        <Box sx={{ mb: 2, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                                            <Typography variant="caption" color="text.secondary">
                                                Debug: Template ID: {templateInstanceData.template_id}, 
                                                Rows: {Object.keys(templateInstanceData.rows || {}).length}
                                            </Typography>
                                        </Box>
                                    )}
                                    
                                    <TableContainer component={Paper} variant="outlined" sx={{ mb: 3 }}>
                                        <Table size="small">
                                            <TableHead>
                                                <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                                                    <TableCell sx={{ fontWeight: 600, minWidth: 300 }}>REPORTING REQUIREMENTS</TableCell>
                                                    <TableCell sx={{ fontWeight: 600, width: 80 }}>UNIT</TableCell>
                                                    {monthColumns.map((month) => (
                                                        <TableCell key={month} sx={{ fontWeight: 600, width: 80 }}>{month}</TableCell>
                                                    ))}
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {reportingRequirements.map((req) => (
                                                    <TableRow key={req.id}>
                                                        <TableCell sx={{ fontSize: '14px', pl: req.rowType === 'sub' ? 4 : 2 }}>
                                                            {req.rowType === 'main' ? (
                                                                <>{req.mainIndex}. {req.description}</>
                                                            ) : (
                                                                <>{req.subIndex}. {req.description}</>
                                                            )}
                                                        </TableCell>
                                                        <TableCell>{req.unit}</TableCell>
                                                        {monthColumns.map((month) => (
                                                            <TableCell key={month}>
                                                                <TextField 
                                                                    size="small" 
                                                                    value={req.months[month]} 
                                                                    onChange={(e) => handleCellValueChange(req.id, month, e.target.value)} 
                                                                    variant="outlined" 
                                                                    sx={{ 
                                                                        width: '60px', 
                                                                        '& .MuiOutlinedInput-input': { 
                                                                            padding: '4px 8px', 
                                                                            fontSize: '12px' 
                                                                        } 
                                                                    }} 
                                                                />
                                                            </TableCell>
                                                        ))}
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </Box>
                            )}
                        </Paper>
                    </Grid>

                    {/* Summary Section */}
                    <Grid item xs={12}>
                        <Paper sx={{ p: 3, borderRadius: 2 }}>
                            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Summary</Typography>
                            <Box sx={{ '.ql-editor': { minHeight: '150px' } }}>
                                <ReactQuill
                                    theme="snow"
                                    value={summary}
                                    onChange={setSummary}
                                    placeholder="Enter summary here..."
                                    modules={quillModules}
                                />
                            </Box>
                        </Paper>
                    </Grid>

                    {/* Reference Link Section */}
                    <Grid item xs={12}>
                        <Paper sx={{ p: 3, borderRadius: 2 }}>
                            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Frame Reference Link</Typography>
                            <TextField fullWidth placeholder="Enter The Reference Link" value={referenceLink} onChange={(e) => setReferenceLink(e.target.value)} variant="outlined" />
                        </Paper>
                    </Grid>

                    {/* Attach Documents Section */}
                    <Grid item xs={12}>
                        <Paper sx={{ p: 3, borderRadius: 2 }}>
                            <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>Attach Documents</Typography>
                            <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: 'block' }}>Upload PDF, DOC, DOCX, PNG, JPG, JPEG</Typography>
                            <Box onClick={() => document.getElementById('file-upload')?.click()} sx={{ border: '2px dashed #e0e0e0', borderRadius: 2, p: 4, textAlign: 'center', cursor: 'pointer', '&:hover': { bgcolor: '#fafafa' } }}>
                                <Typography variant="body2" color="text.secondary">Drag And Drop a file here, or</Typography>
                                <Typography variant="body2" sx={{ textDecoration: 'underline', color: '#147C65', cursor: 'pointer' }}>click to select a file</Typography>
                                <input id="file-upload" type="file" multiple accept=".pdf,.doc,.docx,.png,.jpg,.jpeg" style={{ display: 'none' }} onChange={handleFileUpload} />
                            </Box>
                            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>Maximum file size: 50 MB</Typography>
                            {attachedDocuments.length > 0 && (<Box sx={{ mt: 2 }}>{attachedDocuments.map((file, index) => (<Chip key={index} label={file.name} onDelete={() => { setAttachedDocuments(prev => prev.filter((_, i) => i !== index)); }} sx={{ mr: 1, mb: 1 }} />))}</Box>)}
                        </Paper>
                    </Grid>

                    {/* Action Buttons */}
                    <Grid item xs={12}>
                        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }}>
                            <Button variant="outlined" onClick={handleSaveAsDraft} sx={{ textTransform: 'none', borderColor: '#147C65', color: '#147C65', '&:hover': { borderColor: '#147C65', bgcolor: 'rgba(20, 124, 101, 0.05)' } }}>Save as draft</Button>
                            <Button variant="contained" onClick={handleSubmit} sx={{ textTransform: 'none', bgcolor: '#147C65', '&:hover': { bgcolor: '#0f5a4a' } }}>Submit</Button>
                        </Box>
                    </Grid>
                </Grid>
            </Box>
        </SidebarHeader>
    );
};

export default DataEntryForm;