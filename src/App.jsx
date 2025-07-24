import { useState, useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import EsgReporting from "./Screens/MaterialityAssesment/EsgReporting";
import ReportingSurvey from "./Screens/MaterialityAssesment/ReportingSurvey";
import ChooseStandard from "./Screens/StakeholderMaterialityAssessment/ChooseStandard";
import ReportingChooseStandard from "./Screens/StakeholderMaterialityAssessment/ReportingChooseStandard";
import ChooseSector from "./Screens/StakeholderMaterialityAssessment/ChooseSector";
import ReportingChooseSector from "./Screens/StakeholderMaterialityAssessment/ReportingChooseSector";
import SectorSpecific from "./Screens/StakeholderMaterialityAssessment/SectorSpecific";
import DisclosureList from "./Screens/StakeholderMaterialityAssessment/DisclosureList";
import ReportingDisclosureList from "./Screens/StakeholderMaterialityAssessment/ReportingDisclosureList";
import ReviewDisclosures from "./Screens/StakeholderMaterialityAssessment/ReviewDisclosures";
import DashBoard from "./Screens/Dashboard";
import Questions from "./Screens/StakeholderMaterialityAssessment/Questions";
import CustomEmail from "./Screens/CustomEmail";
import InternalEmail from "./Screens/InternalEmail";
import Login from "./Screens/Login";
import Register from "./Screens/Register";
import SurveyList from "./Screens/StakeholderMaterialityAssessment/Surveys";
import Disclosures from "./Screens/StakeholderMaterialityAssessment/AddDisclosures";
import { AuthProvider } from "./services/AuthContext";
import DisclosureRating from "./Screens/DisclosureRating";
import AuthRedirect from "./Components/auth/AuthRedirect";
// Update these import paths
import InternalChooseStandard from "./Screens/StakeholderMaterialityAssessment/Internal/InternalChooseStandard";
import InternalChooseSector from "./Screens/StakeholderMaterialityAssessment/Internal/InternalChooseSector";
import InternalDisclosureList from "./Screens/StakeholderMaterialityAssessment/Internal/InternalDisclosureList";
import InternalQuestions from "./Screens/StakeholderMaterialityAssessment/Internal/InternalQuestions";
import InternalCustomEmail from "./Screens/StakeholderMaterialityAssessment/Internal/InternalCustomEmail";
import ReportAdditionalDisclosures from "./Screens/StakeholderMaterialityAssessment/ReportAdditionalDisclosures.tsx";
import AdditionalDisclosures from "./Screens/StakeholderMaterialityAssessment/ReportAdditionalDisclosures.tsx";
import InternalAdditionalDisclosures from "./Screens/StakeholderMaterialityAssessment/Internal/InternalAdditionalDisclosures";
import ReportingPeriod from "./Screens/ReportingPeriod.tsx";
import ListReportingPeriod from "./Components/SidebarMenu/ListReportingPeriod";
import Reports from "./Pages/Reports.tsx";
import TaskManagement from "./Pages/TaskManagement.tsx";
import ScApprovalRequest from "./Pages/SteeringCommitte/ScApprovalRequest.tsx";
import ChooseMateriality from "./Screens/MaterialityAssesment/ChooseMateriality.tsx";
import ReportingChooseMateriality from "./Screens/MaterialityAssesment/ReportingChooseMateriality.tsx";
import SelectMaterialTopics from "./Screens/MaterialityAssesment/SelectMaterialTopics.tsx";

import ReportingSectorIndustryForm from "./Screens/StakeholderMaterialityAssessment/ReportingSectorIndustryForm.tsx";
import ReportingTaskManagement from "./Screens/StakeholderMaterialityAssessment/reportingTaskManagement.tsx";

import ReportEmail from "./Screens/StakeholderMaterialityAssessment/ReportingEmail.tsx";
import ReportingScApprovalRequest from "./Screens/StakeholderMaterialityAssessment/ReportingScApprovalRequest.tsx";
import SustainabilityManagerResponse from "./Screens/StakeholderMaterialityAssessment/SustainabilityManagerResponse.tsx";
import TaskAssignment from "./Screens/StakeholderMaterialityAssessment/TaskAssignment.tsx";

//configure section
import ConfigureCoverPage from "./Screens/configure_report/configureCoverPage";
import ConfigureContent from "./Screens/configure_report/configureChooseReportFormat";
import ConfigureReportDetails1 from "./Screens/configure_report/configureReportDetails1.tsx";
import ConfigureReportDetails2 from "./Screens/configure_report/configureReportDetails2.tsx";
import ConfigureLetterFromSustainabilityOfficer from "./Screens/configure_report/configureLetterFromSustainabilityOfficer.tsx";
import ConfigureLetterFromCEO from "./Screens/configure_report/configureLetterFromCEO.tsx";
import ConfigureAboutUs from "./Screens/configure_report/configureAboutUs.tsx";
import ConfigureESGGoalsProgress from "./Screens/configure_report/configureESGGoalsProgress.tsx";
import ConfigureSustainabilityStructure from "./Screens/configure_report/configureSustainabilityStructure.tsx";
import ConfigureYearInReview from "./Screens/configure_report/configureYearInReview.tsx";
import ConfigureActivitiesValueChain from "./Screens/configure_report/configureActivitiesValuechain.tsx";
import ConfigureMaterialityOpeningPage from "./Screens/configure_report/configureMaterialityOpeningPage.tsx";
import ConfigureMaterialityAssessment from "./Screens/configure_report/configureMaterialityAssessment.tsx";
import ConfigureMaterialityMatrix from "./Screens/configure_report/configureMaterialityMatrix.tsx";
import ConfigureEnviromentalOpeningPage from "./Screens/configure_report/configureEnviromentalOpeningPage.tsx";
import ConfigureEnvInFigures from "./Screens/configure_report/configureEnvInFigures.tsx";
import ConfigureEnvCommitmentGoalsInitiatives from "./Screens/configure_report/configureEnvCommitmentGoalsInitiatives.tsx";
import ConfigureEnvMaterialTopics from "./Screens/configure_report/configureEnvMaterialTopics.tsx";
import ConfigureSocialOpeningPage from "./Screens/configure_report/configureSocialOpeningPage.tsx";
import ConfigureSocialInFigures from "./Screens/configure_report/configureSocialInFigures.tsx";
import ConfigureSocialResponsibility from "./Screens/configure_report/configureSocialResponsibility.tsx";
import ConfigureSocialCSR from "./Screens/configure_report/configureSocialCSR.tsx";
import ConfigureSocialMaterialTopics from "./Screens/configure_report/configureSocialMaterialTopics.tsx";
import ConfigureGovernanceOpeningPage from "./Screens/configure_report/configureGovOpeningPage.tsx";
import ConfigureGovernanceInFigures from "./Screens/configure_report/configureGovInFigures.tsx";
import ConfigureGovernanceCorporateGovernance from "./Screens/configure_report/configureGovCorporateGovernance.tsx";
import ConfigureGovernanceEthicalBusinessConduct from "./Screens/configure_report/configureGovEthicalBusinessConduct.tsx";
import ConfigureGovernanceStackholderEngagementAndTransparency from "./Screens/configure_report/configureGovStakeholder.tsx";
import ConfigureGovernanceMaterialTopics from "./Screens/configure_report/configureGovMaterialTopics.tsx";
import AppendixOpeningPage from "./Screens/configure_report/configureAppendixOpeningPage.tsx";
import AppendixSustainabilityReportingTopicAssesment from "./Screens/configure_report/configureAppendixSustainabilityReport.tsx";
import AppendixSustainabilityEndNote from "./Screens/configure_report/configureAppendixEndNotes.tsx";
import AppendixSustainabilityAssuranceStatements from "./Screens/configure_report/configureAppendixAssuranceStatements.tsx";
import AppendixDisclaimer from "./Screens/configure_report/configureAppendixDisclaimer.tsx";
import ReportClosingPage from "./Screens/configure_report/configureReportClosingPage.tsx";

import ChooseMaterialIssue from "./Screens/StakeholderMaterialityAssessment/ChooseMaterialIssue.tsx";
import ReportingChooseMaterialIssue from "./Screens/StakeholderMaterialityAssessment/ReportingChooseMaterialIssue.tsx";
import SelectedDisclosuresSummary from "./Screens/StakeholderMaterialityAssessment/SelectedDisclosuresSummary.tsx";
import InternalChooseMaterialIssue from "./Screens/StakeholderMaterialityAssessment/Internal/InternalChooseMaterialIssue.tsx";

const ProtectedRoute = ({ children }) => {
  const auth = localStorage.getItem("auth");
  const location = useLocation();

  if (!auth) {
    // Save the attempted URL before redirecting
    localStorage.setItem("redirectUrl", location.pathname + location.search);
    return (
      <Navigate
        to="/login"
        state={{ from: location.pathname + location.search }}
      />
    );
  }
  return children;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/auth-redirect" element={<AuthRedirect />} />
          {/* Auth routes */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashBoard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/esg-reporting"
            element={
              <ProtectedRoute>
                <EsgReporting />
              </ProtectedRoute>
            }
          />
          <Route
            path="/choose-standard/:surveyId"
            element={
              <ProtectedRoute>
                <ChooseStandard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/reporting-choose-standard/:reportId"
            element={
              <ProtectedRoute>
                <ReportingChooseStandard />
              </ProtectedRoute>
            }
          />
          {/* <Route path="/choose-standard/" element={
          <ProtectedRoute>
            <ChooseStandard />
          </ProtectedRoute>
        } />
         */}
          <Route
            path="/choose-sector/:surveyId"
            element={
              <ProtectedRoute>
                <ChooseSector />
              </ProtectedRoute>
            }
          />
          {/* test here  */}

          <Route
            path="/reporting-choose-sector/:reportId/:standardId"
            element={
              <ProtectedRoute>
                <ReportingChooseSector />
              </ProtectedRoute>
            }
          />
          {/*implementation left */}
          <Route
            path="/reporting-sector-industry-from/:reportId/:standardId"
            element={
              <ProtectedRoute>
                <ReportingSectorIndustryForm />
              </ProtectedRoute>
            }
          />

          <Route
            path="/reporting-survey/:reportId"
            element={
              <ProtectedRoute>
                <ReportingSurvey />
              </ProtectedRoute>
            }
          />
          <Route
            path="/select-material-topics/:reportId"
            element={
              <ProtectedRoute>
                <SelectMaterialTopics />
              </ProtectedRoute>
            }
          />
          <Route
            path="/surveys"
            element={
              <ProtectedRoute>
                <SurveyList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/add-disclosure/:surveyId"
            element={
              <ProtectedRoute>
                <DisclosureList />
              </ProtectedRoute>
            }
          />
          <Route
            path="report-additional-disclosures/:reportId"
            element={
              <ProtectedRoute>
                <ReportAdditionalDisclosures />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reporting-add-disclosure/:reportId"
            element={
              <ProtectedRoute>
                <ReportingDisclosureList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/selected-disclosures-summary/:reportId"
            element={
              <ProtectedRoute>
                <SelectedDisclosuresSummary />
              </ProtectedRoute>
            }
          />
          <Route
            path="/questions/:surveyId"
            element={
              <ProtectedRoute>
                <Questions />
              </ProtectedRoute>
            }
          />
          <Route
            path="/survey-email"
            element={
              <ProtectedRoute>
                <CustomEmail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/survey-email/:surveyId"
            element={
              <ProtectedRoute>
                <CustomEmail />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/disclosure-rating"
            element={
              <ProtectedRoute>
                <DisclosureRating />
              </ProtectedRoute>
            }
          />
          <Route
            path="/disclosure-rating/:surveyUuid"
            element={
              <ProtectedRoute>
                <DisclosureRating />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reports"
            element={
              <ProtectedRoute>
                <Reports />
              </ProtectedRoute>
            }
          />
          <Route
            path="/task-management"
            element={
              <ProtectedRoute>
                <TaskManagement />
              </ProtectedRoute>
            }
          />

          <Route
            path="/steering-committee-approval-request"
            element={
              <ProtectedRoute>
                <ScApprovalRequest />
              </ProtectedRoute>
            }
          />
          <Route
            path="/steering-committee-approval-request/:reportId"
            element={
              <ProtectedRoute>
                <ReportingScApprovalRequest />
              </ProtectedRoute>
            }
          />
          <Route
            path="/sustainability-manager-response/:reportId"
            element={
              <ProtectedRoute>
                <SustainabilityManagerResponse />
              </ProtectedRoute>
            }
          />
          <Route
            path="/choose-materiality/:surveyId"
            element={
              <ProtectedRoute>
                <ChooseMateriality />
              </ProtectedRoute>
            }
          />

          <Route
            path="/choose-materiale-issues/:surveyId"
            element={
              <ProtectedRoute>
                <ChooseMaterialIssue />
              </ProtectedRoute>
            }
          />

          <Route
            path="/reporting-choose-materiale-issues/:reportId"
            element={
              <ProtectedRoute>
                <ReportingChooseMaterialIssue />
              </ProtectedRoute>
            }
          />

          <Route
            path="/report/email"
            element={
              <ProtectedRoute>
                <ReportEmail />
              </ProtectedRoute>
            }
          />

          {/* Internal Survey Flow Routes */}
          <Route
            path="/internal/choose-standard/:surveyId"
            element={
              <ProtectedRoute>
                <InternalChooseStandard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/internal/choose-sector/:surveyId"
            element={
              <ProtectedRoute>
                <InternalChooseSector />
              </ProtectedRoute>
            }
          />
          <Route
            path="/internal/add-disclosure/:surveyId"
            element={
              <ProtectedRoute>
                <InternalDisclosureList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/internal/questions/:surveyId"
            element={
              <ProtectedRoute>
                <InternalQuestions />
              </ProtectedRoute>
            }
          />
          <Route
            path="internal/survey-email/:surveyId"
            element={
              <ProtectedRoute>
                <InternalCustomEmail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/additional-disclosures/:surveyId"
            element={
              <ProtectedRoute>
                <AdditionalDisclosures />
              </ProtectedRoute>
            }
          />
          <Route
            path="/internal/additional-disclosures/:surveyId"
            element={
              <ProtectedRoute>
                <InternalAdditionalDisclosures />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reporting-period"
            element={
              <ProtectedRoute>
                <ReportingPeriod />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reporting-choose-materiality/:reportId"
            element={
              <ProtectedRoute>
                <ReportingChooseMateriality />
              </ProtectedRoute>
            }
          />
          <Route
            path="/list-reporting-period"
            element={
              <ProtectedRoute>
                <ListReportingPeriod />
              </ProtectedRoute>
            }
          />
          <Route
            path="/internal/choose-material-issues/:surveyId"
            element={
              <ProtectedRoute>
                <InternalChooseMaterialIssue />
              </ProtectedRoute>
            }
          />
          <Route
            path="/review-disclosures/:reportId"
            element={
              <ProtectedRoute>
                <ReviewDisclosures />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reporting-email/:reportId"
            element={
              <ProtectedRoute>
                <ReportEmail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/task-assignment/:reportId"
            element={
              <ProtectedRoute>
                <TaskAssignment />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reporting-task-management/:reportId"
            element={
              <ProtectedRoute>
                <ReportingTaskManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/configure-report"
            element={
              <ProtectedRoute>
                <ConfigureCoverPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/configure-report/content"
            element={
              <ProtectedRoute>
                <ConfigureContent />
              </ProtectedRoute>
            }
          />
          <Route
            path="/configure-report/details1"
            element={
              <ProtectedRoute>
                <ConfigureReportDetails1 />
              </ProtectedRoute>
            }
          />
          <Route
            path="/configure-report/details2"
            element={
              <ProtectedRoute>
                <ConfigureReportDetails2 />
              </ProtectedRoute>
            }
          />
          <Route
            path="/configure-report/cso-Letter"
            element={
              <ProtectedRoute>
                <ConfigureLetterFromSustainabilityOfficer />
              </ProtectedRoute>
            }
          />
          <Route
            path="/configure-report/ceo-Letter"
            element={
              <ProtectedRoute>
                <ConfigureLetterFromCEO />
              </ProtectedRoute>
            }
          />
          <Route
            path="/configure-report/about-us"
            element={
              <ProtectedRoute>
                <ConfigureAboutUs />
              </ProtectedRoute>
            }
          />
          <Route
            path="/configure-report/sustainability-structure"
            element={
              <ProtectedRoute>
                <ConfigureSustainabilityStructure />
              </ProtectedRoute>
            }
          />
          <Route
            path="/configure-report/ESG-goals-progress"
            element={
              <ProtectedRoute>
                <ConfigureESGGoalsProgress />
              </ProtectedRoute>
            }
          />
          <Route
            path="/configure-report/year-in-review"
            element={
              <ProtectedRoute>
                <ConfigureYearInReview />
              </ProtectedRoute>
            }
          />
          <Route
            path="/configure-report/activities-value-chain"
            element={
              <ProtectedRoute>
                <ConfigureActivitiesValueChain />
              </ProtectedRoute>
            }
          />
          <Route
            path="/configure-report/materiality-opening-page"
            element={
              <ProtectedRoute>
                <ConfigureMaterialityOpeningPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/configure-report/materiality-assessment"
            element={
              <ProtectedRoute>
                <ConfigureMaterialityAssessment />
              </ProtectedRoute>
            }
          />
          <Route
            path="/configure-report/materiality-matrix"
            element={
              <ProtectedRoute>
                <ConfigureMaterialityMatrix />
              </ProtectedRoute>
            }
          />
          <Route
            path="/configure-report/Environmental-Opening-page"
            element={
              <ProtectedRoute>
                <ConfigureEnviromentalOpeningPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/configure-report/environment-in-figures"
            element={
              <ProtectedRoute>
                <ConfigureEnvInFigures />
              </ProtectedRoute>
            }
          />
          <Route
            path="/configure-report/environment-commitment-goals-initiatives"
            element={
              <ProtectedRoute>
                <ConfigureEnvCommitmentGoalsInitiatives />
              </ProtectedRoute>
            }
          />
          <Route
            path="/configure-report/environment-material-topics"
            element={
              <ProtectedRoute>
                <ConfigureEnvMaterialTopics />
              </ProtectedRoute>
            }
          />
          <Route
            path="/configure-report/social-opening-page"
            element={
              <ProtectedRoute>
                <ConfigureSocialOpeningPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/configure-report/social-in-figures"
            element={
              <ProtectedRoute>
                <ConfigureSocialInFigures />
              </ProtectedRoute>
            }
          />
          <Route
            path="/configure-report/social-responsibility"
            element={
              <ProtectedRoute>
                <ConfigureSocialResponsibility />
              </ProtectedRoute>
            }
          />
          <Route
            path="/configure-report/social-csr"
            element={
              <ProtectedRoute>
                <ConfigureSocialCSR />
              </ProtectedRoute>
            }
          />
          <Route
            path="/configure-report/Social-Material_Topics"
            element={
              <ProtectedRoute>
                <ConfigureSocialMaterialTopics />
              </ProtectedRoute>
            }
          />
          <Route
            path="/configure-report/Governance-Opening-Page"
            element={
              <ProtectedRoute>
                <ConfigureGovernanceOpeningPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/configure-report/Governance-In-Figures"
            element={
              <ProtectedRoute>
                <ConfigureGovernanceInFigures />
              </ProtectedRoute>
            }
          />
          <Route
            path="/configure-report/Governance-Corporate-Governance"
            element={
              <ProtectedRoute>
                <ConfigureGovernanceCorporateGovernance />
              </ProtectedRoute>
            }
          />
          <Route
            path="/configure-report/Governance-Ethical-Business-Conduct"
            element={
              <ProtectedRoute>
                <ConfigureGovernanceEthicalBusinessConduct />
              </ProtectedRoute>
            }
          />
          <Route
            path="/configure-report/Governance-Stackholder-Engagement-And-Transparency"
            element={
              <ProtectedRoute>
                <ConfigureGovernanceStackholderEngagementAndTransparency />
              </ProtectedRoute>
            }
          />
          <Route
            path="/configure-report/Governance-Material-Topics"
            element={
              <ProtectedRoute>
                <ConfigureGovernanceMaterialTopics />
              </ProtectedRoute>
            }
          />
          <Route
            path="/configure-report/Appendix-Opening-Page"
            element={
              <ProtectedRoute>
                <AppendixOpeningPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/configure-report/Appendix-Sustainability-Reporting-Topic-Assesment"
            element={
              <ProtectedRoute>
                <AppendixSustainabilityReportingTopicAssesment />
              </ProtectedRoute>
            }
          />
          <Route
            path="/configure-report/Appendix-End-Note"
            element={
              <ProtectedRoute>
                <AppendixSustainabilityEndNote />
              </ProtectedRoute>
            }
          />
          <Route
            path="/configure-report/Appendix-Assurance-Statements"
            element={
              <ProtectedRoute>
                <AppendixSustainabilityAssuranceStatements />
              </ProtectedRoute>
            }
          />
          <Route
            path="/configure-report/Appendix-Disclaimer"
            element={
              <ProtectedRoute>
                <AppendixDisclaimer />
              </ProtectedRoute>
            }
          />
          <Route
            path="/configure-report/Report-Closing-Page"
            element={
              <ProtectedRoute>
                <ReportClosingPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
