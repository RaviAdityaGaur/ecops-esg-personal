import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Button,
  Grid,
  FormControlLabel,
  Checkbox,
  FormGroup,
  Radio,
  RadioGroup,
  FormControl
} from '@mui/material';
import SidebarHeader from '../../Components/SidebarHeader.tsx';

const ConfigureChooseReportFormat: React.FC = () => {
  const navigate = useNavigate();
  

  // State for managing radio button selection
  const [reportFormat, setReportFormat] = useState('gri'); // Default to GRI Accordance
  
  // State for managing checkbox selections
  const [selections, setSelections] = useState({
    // Overview
    introduction: true,
    letterFromCso: false,
    letterFromCeo: false,
    aboutUs: false,
    sustainabilityStructure: false,
    activitiesValueChain: false,
    boardGovernance: false,
    remunerationPolicy: false,
    collectiveBargaining: false,
    esgGoals: false,
    yearInReview: false,
    
    // Materiality
    materialityAssessment: false,
    materialityMatrix: false,
    mappingMateriality: false,
    
    // Environment
    environmentTopic: false,
    climateChange: false,
    environmentManagement: false,
    emissions: false,
    energy: false,
    water: false,
    waste: false,
    productDesign: false,
    biodiversity: false,
    environmentalAssessment: false,

    // Social
    socialFigures: false,
    socialResponsibility: false,
    socialCommunity: false,
    socialMaterialTopics: false,
    
    // Governance
    corporateGovernance: false,
    governanceFigures: false,
    businessConduct: false,
    stakeholderEngagement: false,
    governanceMetrics: false,
    
    // Appendix
    sustainabilityReporting: false,
    esgIndex: false,
    assuranceStatement: false,
    disclaimerForward: false
  });

  const handleCheckboxChange = (key: any) => {
    setSelections(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleReportFormatChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setReportFormat(event.target.value);
  };

  const handleBack = () => {
    navigate('/configure-report');
  };

  const handleNext = () => {
    // Handle next step or save selections
    console.log('Report Format:', reportFormat);
    console.log('Selected options:', selections);
    navigate('/configure-report/details1');
  };

  const configureContent = (
    <Box sx={{ py: 1 }}>
      <Typography variant="h5" sx={{ mb: 3, backgroundColor: 'white', p: 2, borderRadius: 2 }}>
        Choose Content
      </Typography>
      
      <Paper sx={{ p: 5, mx: 'auto' }}>
        
        <Grid container spacing={3}>
          {/* Choose Report Format Section with Radio Buttons */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
              Choose Report Format
            </Typography>
            <FormControl component="fieldset">
              <RadioGroup
                value={reportFormat}
                onChange={handleReportFormatChange}
                name="report-format"
              >
                <FormControlLabel
                  value="gri"
                  control={
                    <Radio 
                      sx={{ 
                        color: '#147C65', 
                        '&.Mui-checked': { color: '#147C65' } 
                      }} 
                    />
                  }
                  label="GRI Accordance"
                />
                <FormControlLabel
                  value="generic"
                  control={
                    <Radio 
                      sx={{ 
                        color: '#147C65', 
                        '&.Mui-checked': { color: '#147C65' } 
                      }} 
                    />
                  }
                  label="Generic"
                />
              </RadioGroup>
            </FormControl>
          </Grid>

          {/* Overview Section */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
              Overview
            </Typography>
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={selections.introduction}
                    onChange={() => handleCheckboxChange('introduction')}
                    sx={{ color: '#147C65', '&.Mui-checked': { color: '#147C65' } }}
                  />
                }
                label="Introduction"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={selections.letterFromCso}
                    onChange={() => handleCheckboxChange('letterFromCso')}
                    sx={{ color: '#147C65', '&.Mui-checked': { color: '#147C65' } }}
                  />
                }
                label="A Letter from Our Chief Sustainability Officer"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={selections.letterFromCeo}
                    onChange={() => handleCheckboxChange('letterFromCeo')}
                    sx={{ color: '#147C65', '&.Mui-checked': { color: '#147C65' } }}
                  />
                }
                label="A Letter from Our Chief Executive Officer"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={selections.aboutUs}
                    onChange={() => handleCheckboxChange('aboutUs')}
                    sx={{ color: '#147C65', '&.Mui-checked': { color: '#147C65' } }}
                  />
                }
                label="About us"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={selections.performance}
                    onChange={() => handleCheckboxChange('performance')}
                    sx={{ color: '#147C65', '&.Mui-checked': { color: '#147C65' } }}
                  />
                }
                label="Performance"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={selections.awards}
                    onChange={() => handleCheckboxChange('awards')}
                    sx={{ color: '#147C65', '&.Mui-checked': { color: '#147C65' } }}
                  />
                }
                label="Awards"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={selections.sustainability}
                    onChange={() => handleCheckboxChange('sustainability')}
                    sx={{ color: '#147C65', '&.Mui-checked': { color: '#147C65' } }}
                  />
                }
                label="Sustainability"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={selections.development}
                    onChange={() => handleCheckboxChange('development')}
                    sx={{ color: '#147C65', '&.Mui-checked': { color: '#147C65' } }}
                  />
                }
                label="Development"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={selections.esgData}
                    onChange={() => handleCheckboxChange('esgData')}
                    sx={{ color: '#147C65', '&.Mui-checked': { color: '#147C65' } }}
                  />
                }
                label="2024 Year in Review"
              />
            </FormGroup>
          </Grid>

          {/* Rest of your existing sections remain the same... */}
          {/* Materiality Section */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
              Materiality
            </Typography>
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={selections.materialityAssessment}
                    onChange={() => handleCheckboxChange('materialityAssessment')}
                    sx={{ color: '#147C65', '&.Mui-checked': { color: '#147C65' } }}
                  />
                }
                label="Materiality Assessment"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={selections.materialityMatrix}
                    onChange={() => handleCheckboxChange('materialityMatrix')}
                    sx={{ color: '#147C65', '&.Mui-checked': { color: '#147C65' } }}
                  />
                }
                label="Materiality Matrix"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={selections.mappingMateriality}
                    onChange={() => handleCheckboxChange('mappingMateriality')}
                    sx={{ color: '#147C65', '&.Mui-checked': { color: '#147C65' } }}
                  />
                }
                label="Mapping of materiality topics with GRI Standards"
              />
            </FormGroup>
          </Grid>

          {/* Environment Section */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
              Environment
            </Typography>
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={selections.environmentTopic}
                    onChange={() => handleCheckboxChange('environmentTopic')}
                    sx={{ color: '#147C65', '&.Mui-checked': { color: '#147C65' } }}
                  />
                }
                label="Environment Topic"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={selections.climateChange}
                    onChange={() => handleCheckboxChange('climateChange')}
                    sx={{ color: '#147C65', '&.Mui-checked': { color: '#147C65' } }}
                  />
                }
                label="Climate Change Impacts, Risks and Initiatives"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={selections.environmentManagement}
                    onChange={() => handleCheckboxChange('environmentManagement')}
                    sx={{ color: '#147C65', '&.Mui-checked': { color: '#147C65' } }}
                  />
                }
                label="Environment Management Topics"
              />
            </FormGroup>
          </Grid>

          {/* Social Section */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
              Social
            </Typography>
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={selections.socialFigures}
                    onChange={() => handleCheckboxChange('socialFigures')}
                    sx={{ color: '#147C65', '&.Mui-checked': { color: '#147C65' } }}
                  />
                }
                label="Social in Figures"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={selections.socialResponsibility}
                    onChange={() => handleCheckboxChange('socialResponsibility')}
                    sx={{ color: '#147C65', '&.Mui-checked': { color: '#147C65' } }}
                  />
                }
                label="Social Responsibility"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={selections.socialCommunity}
                    onChange={() => handleCheckboxChange('socialCommunity')}
                    sx={{ color: '#147C65', '&.Mui-checked': { color: '#147C65' } }}
                  />
                }
                label="Social and Community Engagement Initiatives"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={selections.employmentPractices}
                    onChange={() => handleCheckboxChange('employmentPractices')}
                    sx={{ color: '#147C65', '&.Mui-checked': { color: '#147C65' } }}
                  />
                }
                label="Employment Practices"
              />
            </FormGroup>
          </Grid>

          {/* Governance Section */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
              Governance
            </Typography>
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={selections.corporateGovernance}
                    onChange={() => handleCheckboxChange('corporateGovernance')}
                    sx={{ color: '#147C65', '&.Mui-checked': { color: '#147C65' } }}
                  />
                }
                label="Corporate Governance"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={selections.governanceFigures}
                    onChange={() => handleCheckboxChange('governanceFigures')}
                    sx={{ color: '#147C65', '&.Mui-checked': { color: '#147C65' } }}
                  />
                }
                label="Governance in Figures"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={selections.businessConduct}
                    onChange={() => handleCheckboxChange('businessConduct')}
                    sx={{ color: '#147C65', '&.Mui-checked': { color: '#147C65' } }}
                  />
                }
                label="Ethical Business Conduct & Integrity"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={selections.stakeholderEngagement}
                    onChange={() => handleCheckboxChange('stakeholderEngagement')}
                    sx={{ color: '#147C65', '&.Mui-checked': { color: '#147C65' } }}
                  />
                }
                label="Stakeholder Engagement and Transparency"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={selections.governanceMetrics}
                    onChange={() => handleCheckboxChange('governanceMetrics')}
                    sx={{ color: '#147C65', '&.Mui-checked': { color: '#147C65' } }}
                  />
                }
                label="Governance (Metrics) Topics"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={selections.riskManagement}
                    onChange={() => handleCheckboxChange('riskManagement')}
                    sx={{ color: '#147C65', '&.Mui-checked': { color: '#147C65' } }}
                  />
                }
                label="Risk Management"
              />
            </FormGroup>
          </Grid>

          {/* Appendix Section */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
              Appendix
            </Typography>
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={selections.sustainabilityReporting}
                    onChange={() => handleCheckboxChange('sustainabilityReporting')}
                    sx={{ color: '#147C65', '&.Mui-checked': { color: '#147C65' } }}
                  />
                }
                label="Sustainability Reporting and Assessment"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={selections.esgIndex}
                    onChange={() => handleCheckboxChange('esgIndex')}
                    sx={{ color: '#147C65', '&.Mui-checked': { color: '#147C65' } }}
                  />
                }
                label="ESG Index"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={selections.assuranceStatement}
                    onChange={() => handleCheckboxChange('assuranceStatement')}
                    sx={{ color: '#147C65', '&.Mui-checked': { color: '#147C65' } }}
                  />
                }
                label="Assurance Statement"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={selections.disclaimerForward}
                    onChange={() => handleCheckboxChange('disclaimerForward')}
                    sx={{ color: '#147C65', '&.Mui-checked': { color: '#147C65' } }}
                  />
                }
                label="Disclaimer and Forward Looking"
              />
            </FormGroup>
          </Grid>          {/* Action Buttons */}
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
              <Button
                variant="outlined"
                sx={{
                  textTransform: 'none',
                  px: 4,
                  py: 1,
                  borderColor: '#147C65',
                  color: '#147C65',
                  '&:hover': {
                    backgroundColor: 'rgba(20, 124, 101, 0.04)',
                  }
                }}
              >
                Preview
              </Button>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  variant="outlined"
                  onClick={handleBack}
                  sx={{
                    textTransform: 'none',
                    px: 4,
                    py: 1,
                    borderColor: '#64748B',
                    color: '#64748B',
                  }}
                >
                  Back
                </Button>
                <Button
                  variant="contained"
                  onClick={handleNext}
                  sx={{
                    textTransform: 'none',
                    px: 4,
                    py: 1,
                    backgroundColor: '#147C65',
                    '&:hover': {
                      backgroundColor: '#0E5A4A',
                    }
                  }}
                >
                  Next
                </Button>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );

  return (
    <SidebarHeader>
      {configureContent}
    </SidebarHeader>
  );
};

export default ConfigureChooseReportFormat;