import {
  Box,
  Typography,
  Button,
  Grid,
  Switch,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  IconButton,
  styled,
  Tabs,
  Tab,
} from "@mui/material";
import SidebarHeader from "../../Components/SidebarHeader";
import { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { api, getAuthDetails } from "../common";
import { DataGrid } from "@mui/x-data-grid";
import { ProgressTracker } from "../../Components/progress-tracker";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";

// Define the green switch component for toggling yes/no
const GreenSwitch = styled(Switch)(({ theme }) => ({
  "& .MuiSwitch-switchBase.Mui-checked": {
    color: "#2e7d32",
    "&:hover": {
      backgroundColor: "rgba(46, 125, 50, 0.08)",
    },
  },
  "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
    backgroundColor: "#2e7d32",
  },
}));

// Define the comment button
const CommentButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: "#2e7d32",
  color: "white",
  "&:hover": {
    backgroundColor: "#1b5e20",
  },
}));

// TabPanel component
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 0 }}>{children}</Box>}
    </div>
  );
}

const formatDialogContent = (content: string | null): React.ReactNode => {
  if (!content) return "No content available";

  // If the content appears to contain HTML
  if (content.includes("<")) {
    return <div dangerouslySetInnerHTML={{ __html: content }} />;
  }

  // For plain text, handle line breaks for better readability
  const formattedContent = content
    .split("\n")
    .map((line, i) => <p key={i}>{line}</p>);

  return formattedContent;
};

export default function ReviewDisclosures() {
  const navigate = useNavigate();
  const { reportId } = useParams();
  const location = useLocation();

  // States for managing disclosures, comments and toggle states
  const [disclosures, setDisclosures] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [commentsArray, setCommentsArray] = useState<string[]>([]);
  const [toggleStates, setToggleStates] = useState<boolean[]>([]);
  const [expandedQuestion, setExpandedQuestion] = useState<number | string>(-1);
  const [selectedQuestion, setSelectedQuestion] = useState<number | string>(-1);
  const [detailDialog, setDetailDialog] = useState({
    open: false,
    title: "",
    content: "",
  });
  const [activeTab, setActiveTab] = useState(0);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [responseMap, setResponseMap] = useState<{[key: number]: string}>({});

  // Define steps for the progress tracker
  const [steps] = useState([
    { id: 1, title: "Primary Information", type: "main", status: "complete" },
    {
      id: 2,
      title: "Setup External Survey",
      type: "main",
      status: "complete",
    },
    { id: 3, title: "Choose Standards", type: "sub", status: "complete" },
    { id: 4, title: "Choose Sectors", type: "sub", status: "complete" },
    { id: 5, title: "Choose Disclosures", type: "sub", status: "complete" },
    { id: 6, title: "Review Disclosures", type: "sub", status: "in-progress" },
    { id: 7, title: "Add Questions", type: "sub", status: "pending" },
    { id: 8, title: "Send Email", type: "sub", status: "pending" },
    { id: 9, title: "Setup Internal Survey", type: "main", status: "pending" },
  ]);

  // Function to handle toggle change for yes/no
  const handleToggleChange = (index: number) => {
    const newToggleStates = [...toggleStates];
    newToggleStates[index] = !newToggleStates[index];
    setToggleStates(newToggleStates);
  };

  // Function to handle expanding a question for adding comments
  const handleExpandQuestion = (index: string | number) => {
    setSelectedQuestion(index);
    setExpandedQuestion(expandedQuestion === index ? -1 : index);
  };

  // Function to handle saving comments
  const handleCommentChange = (index: number, value: string) => {
    const newComments = [...commentsArray];
    newComments[index] = value;
    setCommentsArray(newComments);
  };

  // Function to show disclosure details
  const handleDetailClick = (title: string, content: string) => {
    setDetailDialog({
      open: true,
      title,
      content,
    });
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };
  
  // Effect to fetch disclosures that have been marked as "yes"
  useEffect(() => {
    const fetchDisclosures = async () => {
      if (!reportId) return;

      try {
        // Get disclosures for the report
        const response: any = await api
          .get(`esg/api/get-disclosure-for-report/?report_id=${reportId}`)
          .json();
          
        const fetched = response.disclosures ? response.disclosures : [];
        
        // Get responses to filter by "yes"
        const responseData = await api
          .get(`esg/api/reporting-disclosure-responses/?report_id=${reportId}`)
          .json();
          
        // Create a map of disclosure IDs to responses
        const responseMapping: {[key: number]: string} = {};
        responseData.forEach((item: any) => {
          responseMapping[item.disclosure] = item.is_applicable ? "yes" : "no";
        });
        
        setResponseMap(responseMapping);
        
        // Filter disclosures with "yes" response only
        const acceptedDisclosures = fetched.filter(
          (disclosure: any) => responseMapping[disclosure.dis_id] === "yes"
        );
        
        console.log("Accepted disclosures:", acceptedDisclosures);
        setDisclosures(acceptedDisclosures);
        
        // Initialize comments and toggle states arrays based on number of disclosures
        setCommentsArray(new Array(acceptedDisclosures.length).fill(""));
        setToggleStates(new Array(acceptedDisclosures.length).fill(true));
        
        setLoading(false);
      } catch (error) {
        console.error("Error fetching disclosures:", error);
        setLoading(false);
      }
    };

    fetchDisclosures();
  }, [reportId]);

  // Function to save review status and comments
  const handleSaveReview = async () => {
    try {
      // Prepare data for saving
      const reviewData = disclosures.map((disclosure, index) => ({
        disclosure_id: disclosure.dis_id,
        accepted: toggleStates[index],
        comments: commentsArray[index],
        report: reportId
      }));

      // Save the review data
      await api.post("esg/api/reporting-disclosure-review/", {
        json: reviewData,
        headers: {
          "content-type": "application/json",
        },
      });

      // Navigate to the reporting email page
      navigate(`/report/email`);
    } catch (error) {
      console.error("Error saving review:", error);
    }
  };

  // Separate disclosures by dimension for tabs
  const environmentalDisclosures = disclosures.filter(
    (d) => d.dimension?.toLowerCase() === "environmental"
  );
  const socialDisclosures = disclosures.filter(
    (d) => d.dimension?.toLowerCase() === "social"
  );
  const governanceDisclosures = disclosures.filter(
    (d) => d.dimension?.toLowerCase() === "governance"
  );

  return (
    <SidebarHeader>
      <Box sx={{ backgroundColor: "white", p: 3, borderRadius: 2 }}>
        {/* Progress Tracker */}
        <Box sx={{ mb: 4, mt: 1 }}>
          <ProgressTracker steps={steps} />
        </Box>

        <Typography variant="h6" sx={{ mb: 2 }}>
          Review Disclosures
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 3 }}>
          This page shows only the disclosures that have been accepted with a "Yes" response. 
          You can review and make final adjustments before continuing.
        </Typography>

        {/* Material Tab selector */}
        <Box sx={{ width: "100%", mt: 2 }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            aria-label="Materiality tabs"
            sx={{
              mb: 2,
              "& .MuiTab-root": {
                textTransform: "none",
                minWidth: "unset",
                px: 2,
              },
              "& .Mui-selected": {
                color: "#147C65 !important",
                fontWeight: "bold",
              },
              "& .MuiTabs-indicator": {
                backgroundColor: "#147C65",
              },
            }}
          >
            <Tab 
              label={`Environmental (${environmentalDisclosures.length})`} 
              value={0} 
            />
            <Tab 
              label={`Social (${socialDisclosures.length})`}
              value={1} 
            />
            <Tab 
              label={`Governance (${governanceDisclosures.length})`} 
              value={2} 
            />
          </Tabs>

          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
              <Typography>Loading disclosures...</Typography>
            </Box>
          ) : (
            <>
              {/* Environmental Tab */}
              <TabPanel value={activeTab} index={0}>
                {environmentalDisclosures.length === 0 ? (
                  <Typography sx={{ textAlign: "center", my: 4, color: "text.secondary" }}>
                    No environmental disclosures have been selected.
                  </Typography>
                ) : (
                  environmentalDisclosures.map((disclosure, index) => (
                    <Box key={disclosure.dis_id} sx={{ display: "flex", alignItems: "flex-start", mb: 2 }}>
                      {/* Number box */}
                      <Box
                        sx={{
                          width: 48,
                          height: 48,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          border: `1px solid ${selectedQuestion === `env-${index}` ? "#10B981" : "rgba(0, 0, 0, 0.12)"}`,
                          borderRadius: 1,
                          mr: 2,
                          mt: 1,
                        }}
                      >
                        <Typography fontWeight="medium">{index + 1}.</Typography>
                      </Box>

                      {/* Disclosure content */}
                      <Box
                        sx={{
                          flexGrow: 1,
                          border: `1px solid ${selectedQuestion === `env-${index}` ? "#10B981" : "rgba(0, 0, 0, 0.12)"}`,
                          borderRadius: 1,
                          p: 2,
                        }}
                      >
                        <Box sx={{ flexGrow: 1 }}>
                          <Grid container justifyContent="space-between" alignItems="center">
                            <Grid item xs={12} sm={8}>
                              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                <Typography variant="subtitle1" fontWeight="medium">
                                  {disclosure.disclosure_id} - {disclosure.sub_topic?.name || "No topic"}
                                </Typography>
                                <IconButton
                                  size="small"
                                  color="warning"
                                  onClick={() => 
                                    handleDetailClick(
                                      `${disclosure.disclosure_id}`, 
                                      disclosure.disclosure_description
                                    )}
                                >
                                  <InfoOutlinedIcon fontSize="small" />
                                </IconButton>
                              </Box>
                              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                {disclosure.standard_name} - {disclosure.disclosure_theme?.name || "No theme"}
                              </Typography>
                            </Grid>
                            <Grid item xs={12} sm={4} sx={{ display: "flex", justifyContent: "flex-end" }}>
                              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                <CommentButton
                                  size="small"
                                  onClick={() => handleExpandQuestion(`env-${index}`)}
                                  sx={{
                                    backgroundColor: selectedQuestion === `env-${index}` ? "#10B981" : "#2e7d32",
                                  }}
                                >
                                  <ChatBubbleOutlineIcon fontSize="small" />
                                </CommentButton>
                                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                  <Typography variant="caption" color="primary" sx={{ minWidth: '30px' }}>
                                    Yes
                                  </Typography>
                                </Box>
                              </Box>
                            </Grid>
                          </Grid>

                          {/* Comment section - shown when expanded */}
                          {expandedQuestion === `env-${index}` && (
                            <Box sx={{ mt: 2 }}>
                              <TextField
                                fullWidth
                                multiline
                                minRows={4}
                                placeholder="Please add your comment here"
                                value={commentsArray[index] || ""}
                                onChange={(e) => handleCommentChange(index, e.target.value)}
                                variant="outlined"
                              />
                              <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 1 }}>
                                <Button 
                                  variant="outlined" 
                                  color="primary" 
                                  sx={{ borderColor: "#2e7d32", color: "#2e7d32" }}
                                  onClick={() => setExpandedQuestion(-1)}
                                >
                                  Save Comment
                                </Button>
                              </Box>
                            </Box>
                          )}
                        </Box>
                      </Box>
                    </Box>
                  ))
                )}
              </TabPanel>

              {/* Social Tab */}
              <TabPanel value={activeTab} index={1}>
                {socialDisclosures.length === 0 ? (
                  <Typography sx={{ textAlign: "center", my: 4, color: "text.secondary" }}>
                    No social disclosures have been selected.
                  </Typography>
                ) : (
                  socialDisclosures.map((disclosure, index) => (
                    <Box key={disclosure.dis_id} sx={{ display: "flex", alignItems: "flex-start", mb: 2 }}>
                      {/* Number box */}
                      <Box
                        sx={{
                          width: 48,
                          height: 48,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          border: `1px solid ${selectedQuestion === `soc-${index}` ? "#10B981" : "rgba(0, 0, 0, 0.12)"}`,
                          borderRadius: 1,
                          mr: 2,
                          mt: 1,
                        }}
                      >
                        <Typography fontWeight="medium">{index + 1}.</Typography>
                      </Box>

                      {/* Similar structure as Environmental tab */}
                      <Box
                        sx={{
                          flexGrow: 1,
                          border: `1px solid ${selectedQuestion === `soc-${index}` ? "#10B981" : "rgba(0, 0, 0, 0.12)"}`,
                          borderRadius: 1,
                          p: 2,
                        }}
                      >
                        <Box sx={{ flexGrow: 1 }}>
                          <Grid container justifyContent="space-between" alignItems="center">
                            <Grid item xs={12} sm={8}>
                              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                <Typography variant="subtitle1" fontWeight="medium">
                                  {disclosure.disclosure_id} - {disclosure.sub_topic?.name || "No topic"}
                                </Typography>
                                <IconButton
                                  size="small"
                                  color="warning"
                                  onClick={() => 
                                    handleDetailClick(
                                      `${disclosure.disclosure_id}`, 
                                      disclosure.disclosure_description
                                    )}
                                >
                                  <InfoOutlinedIcon fontSize="small" />
                                </IconButton>
                              </Box>
                              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                {disclosure.standard_name} - {disclosure.disclosure_theme?.name || "No theme"}
                              </Typography>
                            </Grid>
                            <Grid item xs={12} sm={4} sx={{ display: "flex", justifyContent: "flex-end" }}>
                              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                <CommentButton
                                  size="small"
                                  onClick={() => handleExpandQuestion(`soc-${index}`)}
                                  sx={{
                                    backgroundColor: selectedQuestion === `soc-${index}` ? "#10B981" : "#2e7d32",
                                  }}
                                >
                                  <ChatBubbleOutlineIcon fontSize="small" />
                                </CommentButton>
                                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                  <Typography variant="caption" color="primary" sx={{ minWidth: '30px' }}>
                                    Yes
                                  </Typography>
                                </Box>
                              </Box>
                            </Grid>
                          </Grid>

                          {expandedQuestion === `soc-${index}` && (
                            <Box sx={{ mt: 2 }}>
                              <TextField
                                fullWidth
                                multiline
                                minRows={4}
                                placeholder="Please add your comment here"
                                value={commentsArray[index] || ""}
                                onChange={(e) => handleCommentChange(index, e.target.value)}
                                variant="outlined"
                              />
                              <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 1 }}>
                                <Button 
                                  variant="outlined" 
                                  color="primary" 
                                  sx={{ borderColor: "#2e7d32", color: "#2e7d32" }}
                                  onClick={() => setExpandedQuestion(-1)}
                                >
                                  Save Comment
                                </Button>
                              </Box>
                            </Box>
                          )}
                        </Box>
                      </Box>
                    </Box>
                  ))
                )}
              </TabPanel>

              {/* Governance Tab */}
              <TabPanel value={activeTab} index={2}>
                {governanceDisclosures.length === 0 ? (
                  <Typography sx={{ textAlign: "center", my: 4, color: "text.secondary" }}>
                    No governance disclosures have been selected.
                  </Typography>
                ) : (
                  governanceDisclosures.map((disclosure, index) => (
                    <Box key={disclosure.dis_id} sx={{ display: "flex", alignItems: "flex-start", mb: 2 }}>
                      {/* Number box */}
                      <Box
                        sx={{
                          width: 48,
                          height: 48,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          border: `1px solid ${selectedQuestion === `gov-${index}` ? "#10B981" : "rgba(0, 0, 0, 0.12)"}`,
                          borderRadius: 1,
                          mr: 2,
                          mt: 1,
                        }}
                      >
                        <Typography fontWeight="medium">{index + 1}.</Typography>
                      </Box>

                      {/* Similar structure as Environmental tab */}
                      <Box
                        sx={{
                          flexGrow: 1,
                          border: `1px solid ${selectedQuestion === `gov-${index}` ? "#10B981" : "rgba(0, 0, 0, 0.12)"}`,
                          borderRadius: 1,
                          p: 2,
                        }}
                      >
                        <Box sx={{ flexGrow: 1 }}>
                          <Grid container justifyContent="space-between" alignItems="center">
                            <Grid item xs={12} sm={8}>
                              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                <Typography variant="subtitle1" fontWeight="medium">
                                  {disclosure.disclosure_id} - {disclosure.sub_topic?.name || "No topic"}
                                </Typography>
                                <IconButton
                                  size="small"
                                  color="warning"
                                  onClick={() => 
                                    handleDetailClick(
                                      `${disclosure.disclosure_id}`, 
                                      disclosure.disclosure_description
                                    )}
                                >
                                  <InfoOutlinedIcon fontSize="small" />
                                </IconButton>
                              </Box>
                              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                {disclosure.standard_name} - {disclosure.disclosure_theme?.name || "No theme"}
                              </Typography>
                            </Grid>
                            <Grid item xs={12} sm={4} sx={{ display: "flex", justifyContent: "flex-end" }}>
                              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                <CommentButton
                                  size="small"
                                  onClick={() => handleExpandQuestion(`gov-${index}`)}
                                  sx={{
                                    backgroundColor: selectedQuestion === `gov-${index}` ? "#10B981" : "#2e7d32",
                                  }}
                                >
                                  <ChatBubbleOutlineIcon fontSize="small" />
                                </CommentButton>
                                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                  <Typography variant="caption" color="primary" sx={{ minWidth: '30px' }}>
                                    Yes
                                  </Typography>
                                </Box>
                              </Box>
                            </Grid>
                          </Grid>

                          {expandedQuestion === `gov-${index}` && (
                            <Box sx={{ mt: 2 }}>
                              <TextField
                                fullWidth
                                multiline
                                minRows={4}
                                placeholder="Please add your comment here"
                                value={commentsArray[index] || ""}
                                onChange={(e) => handleCommentChange(index, e.target.value)}
                                variant="outlined"
                              />
                              <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 1 }}>
                                <Button 
                                  variant="outlined" 
                                  color="primary" 
                                  sx={{ borderColor: "#2e7d32", color: "#2e7d32" }}
                                  onClick={() => setExpandedQuestion(-1)}
                                >
                                  Save Comment
                                </Button>
                              </Box>
                            </Box>
                          )}
                        </Box>
                      </Box>
                    </Box>
                  ))
                )}
              </TabPanel>

              {/* Action buttons */}
              <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 3 }}>
                <Button 
                  variant="outlined" 
                  color="inherit"
                  onClick={() => navigate(-1)}
                >
                  Back
                </Button>
                <Button
                  variant="contained"
                  sx={{
                    bgcolor: "#147C65",
                    "&:hover": { bgcolor: "#1b5e20" },
                  }}
                  onClick={handleSaveReview}
                >
                  Next
                </Button>
              </Box>
            </>
          )}
        </Box>

        {/* Detail Dialog */}
        <Dialog
          open={detailDialog.open}
          onClose={() => setDetailDialog({ ...detailDialog, open: false })}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>{detailDialog.title}</DialogTitle>
          <DialogContent>
            <DialogContentText component="div">
              {formatDialogContent(detailDialog.content)}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDetailDialog({ ...detailDialog, open: false })}>
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </SidebarHeader>
  );
}
