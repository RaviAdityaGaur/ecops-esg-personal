import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import SidebarHeader from "../../Components/SidebarHeader"
import { api } from "../../Screens/common"
import { ProgressTracker } from "../../Components/progress-tracker";
import {
  Box,
  Button,
  Card,
  FormControl,
  Grid,
  IconButton,
  MenuItem,
  Select,
  Stack,
  Switch,
  TextField,
  Typography,
  styled,
  Avatar,
  Divider,
} from "@mui/material"
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined"
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline"
// Custom styled components
const NumberBox = styled(Box)(({ theme }) => ({
  width: 48,
  height: 48,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  marginRight: theme.spacing(2),
}))

const RedSwitch = styled(Switch)(({ theme }) => ({
  "& .MuiSwitch-switchBase": {
    color: "#ccc",
    "&.Mui-checked": {
      color: "#4CAF50",
      "&:hover": {
        backgroundColor: "rgba(76, 175, 80, 0.08)",
      },
    },
    "&.Mui-checked.Mui-disabled": {
      color: "#4CAF50",
    },
    "&.Mui-disabled": {
      color: "#ccc",
    },
  },
  "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
    backgroundColor: "#4CAF50",
  },
  "& .MuiSwitch-switchBase.Mui-checked.Mui-disabled + .MuiSwitch-track": {
    backgroundColor: "rgba(76, 175, 80, 0.5)",
  },
  "& .MuiSwitch-track": {
    backgroundColor: "#ccc",
  }
}))

const CommentButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: "#2e7d32",
  color: "white",
  "&:hover": {
    backgroundColor: "#1b5e20",
  },
}))

// Define response type interface
interface CommentData {
  id: number;
  text: string;
}

interface QuestionData {
  id: number;
  question: string;
  vikramComment: string;
  soniaComment: string;
  meComment: string;
  poojaComment: string;
  vikramApproval: boolean;
  soniaApproval: boolean;
  meApproval: boolean;
  poojaApproval: boolean;
  sustainabilityManagerApproval: boolean;
}

const SustainabilityManagerResponse = () => {
  const { reportId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [steps] = useState([
    { id: 1, title: "Setup ESG Report", type: 'main' as const, status: "complete" as const },
    { id: 2, title: "Create Report", type: 'main' as const, status: "complete" as const },
    { id: 3, title: "Select Disclosures", type: 'main' as const, status: "complete" as const },
    { id: 4, title: "Review Disclosures", type: 'main' as const, status: "complete" as const },
    { id: 5, title: "Send Email", type: 'main' as const, status: "complete" as const },
    { id: 6, title: "Steering Committee Approval", type: 'main' as const, status: "complete" as const },
    { id: 7, title: "Sustainability Manager Response", type: 'main' as const, status: "in-progress" as const },
    { id: 8, title: "Assign Disclosures", type: 'main' as const, status: "not-started" as const }
  ]);
  
  const [questions, setQuestions] = useState<QuestionData[]>([
    {
      id: 1,
      question: "Negative environmental impact in the supply chain and action taken?",
      vikramComment: "Please Provide Y/N Documents.",
      soniaComment: "I Think We Don't Need This Document This Year.",
      meComment: "I Think We Should Have It Though.",
      poojaComment: "Let's Not Have It.",
      vikramApproval: true,
      soniaApproval: false,
      meApproval: false,
      poojaApproval: true,
      sustainabilityManagerApproval: true
    },
    {
      id: 2,
      question: "Negative environmental impact in the supply chain and action taken?",
      vikramComment: "Please Provide Y/N Documents.",
      soniaComment: "I Think So As Well.",
      meComment: "",
      poojaComment: "I Agree Let's Talk.",
      vikramApproval: false,
      soniaApproval: true,
      meApproval: false,
      poojaApproval: true,
      sustainabilityManagerApproval: false
    }
  ]);
    // Define types for our state objects
  type CommentMap = Record<number, string>;
  type CommentStateMap = Record<number, boolean>;
  
  type UserCommentInputs = {
    me: CommentMap;
    pooja: CommentMap;
    vikram: CommentMap;
    sonia: CommentMap;
  };
  
  type CommentFieldState = {
    me: CommentStateMap;
    pooja: CommentStateMap;
    vikram: CommentStateMap;
    sonia: CommentStateMap;
  };
  
  // Organize comment inputs by user and question
  const [userCommentInputs, setUserCommentInputs] = useState<UserCommentInputs>({
    me: {
      1: "Can You Give Me Reasons Why We Should Have It?",
      2: ""
    },
    pooja: {
      1: "Let's Talk Over Phone On This Tomorrow Morning At 09:00 AM.",
      2: ""
    },
    vikram: {
      1: "",
      2: ""
    },
    sonia: {
      1: "",
      2: ""
    }
  });
  
  // Tracks if a user has an active comment input field
  const [activeCommentFields, setActiveCommentFields] = useState<CommentFieldState>({
    me: { 1: false, 2: false },
    pooja: { 1: false, 2: false },
    vikram: { 1: false, 2: false },
    sonia: { 1: false, 2: false }
  });
  
  // Track replies in progress
  const [repliesInProgress, setRepliesInProgress] = useState<CommentFieldState>({
    me: { 1: false, 2: false },
    pooja: { 1: false, 2: false }, 
    vikram: { 1: false, 2: false },
    sonia: { 1: false, 2: false }
  });

  useEffect(() => {
    if (reportId) {
      // Fetch data from API when component loads
      const fetchApprovalData = async () => {
        setLoading(true);
        try {
          // Uncomment when API is ready
          // const response = await api.get(`esg/api/approval-responses/${reportId}`);
          // const data = await response.json();
          // setQuestions(data.questions);
          console.log(`Loading sustainability manager response data for report ID: ${reportId}`);
        } catch (error) {
          console.error('Error fetching approval response data:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchApprovalData();
    }
  }, [reportId]);

  const handleBack = () => {
    navigate(-1);
  };
  const handleSubmit = async () => {
    setLoading(true);
    try {
      // Submit responses to API
      // const response = await api.post(`esg/api/approval-responses/${reportId}`, {
      //   body: JSON.stringify({ questions }),
      //   headers: { 'Content-Type': 'application/json' }
      // });
      
      console.log('Submitting responses:', questions);
      
      // Wait for submission to complete
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Navigate to next step (Task Assignment page)
      navigate(`/task-assignment/${reportId}`);
    } catch (error) {
      console.error('Error submitting responses:', error);
    } finally {
      setLoading(false);
    }
  };
  const handleApprovalToggle = (questionId: number) => {
    setQuestions(questions.map(q => 
      q.id === questionId ? { ...q, sustainabilityManagerApproval: !q.sustainabilityManagerApproval } : q
    ));
  };

  // Handle approval toggle for different users
  const handleUserApprovalToggle = (questionId: number, user: 'me' | 'pooja' | 'sonia' | 'vikram') => {
    setQuestions(questions.map(q => {
      if (q.id === questionId) {
        switch (user) {
          case 'me':
            return { ...q, meApproval: !q.meApproval };
          case 'pooja':
            return { ...q, poojaApproval: !q.poojaApproval };
          case 'sonia':
            return { ...q, soniaApproval: !q.soniaApproval };
          case 'vikram':
            return { ...q, vikramApproval: !q.vikramApproval };
          default:
            return q;
        }
      }
      return q;
    }));
  };
  
  // Update comment input for a specific user and question
  const handleCommentChange = (user: string, questionId: number, value: string) => {
    setUserCommentInputs({
      ...userCommentInputs,
      [user]: {
        ...userCommentInputs[user as keyof typeof userCommentInputs],
        [questionId]: value
      }
    });
  };
  
  // Toggle comment field visibility
  const handleToggleCommentField = (user: string, questionId: number) => {
    setActiveCommentFields({
      ...activeCommentFields,
      [user]: {
        ...activeCommentFields[user as keyof typeof activeCommentFields],
        [questionId]: !activeCommentFields[user as keyof typeof activeCommentFields][questionId]
      }
    });
  };

  // Handle reply button click
  const handleReply = (questionId: number, user: string) => {
    const normalizedUser = user.toLowerCase();
    
    setRepliesInProgress({
      ...repliesInProgress,
      [normalizedUser]: {
        ...repliesInProgress[normalizedUser as keyof typeof repliesInProgress],
        [questionId]: true
      }
    });
    
    // Show the comment field for that user/question
    setActiveCommentFields({
      ...activeCommentFields,
      [normalizedUser]: {
        ...activeCommentFields[normalizedUser as keyof typeof activeCommentFields],
        [questionId]: true
      }
    });
  };
  
  // Submit a comment 
  const handleSendComment = (user: string, questionId: number) => {
    const commentKey = `${user}Comment`;
    const comment = userCommentInputs[user as keyof typeof userCommentInputs][questionId];
    
    if (!comment || comment.trim() === '') return;
    
    // Update question with the new comment
    setQuestions(questions.map(q => 
      q.id === questionId 
        ? { ...q, [commentKey]: comment } 
        : q
    ));
    
    // Clear input and hide the comment field
    handleCommentChange(user, questionId, '');
    setActiveCommentFields({
      ...activeCommentFields,
      [user]: {
        ...activeCommentFields[user as keyof typeof activeCommentFields],
        [questionId]: false
      }
    });
    
    // Reset the reply in progress flag
    setRepliesInProgress({
      ...repliesInProgress,
      [user]: {
        ...repliesInProgress[user as keyof typeof repliesInProgress],
        [questionId]: false
      }
    });
  };
  
  const handleUpdateMeResponse = (questionId: number, value: string) => {
    setUserCommentInputs({
      ...userCommentInputs,
      me: {
        ...userCommentInputs.me,
        [questionId]: value
      }
    });
  };
  
  const handleUpdatePoojaResponse = (questionId: number, value: string) => {
    setUserCommentInputs({
      ...userCommentInputs,
      pooja: {
        ...userCommentInputs.pooja,
        [questionId]: value
      }
    });
  };

  const handleAddComment = (questionId: number) => {
    if (!userCommentInputs.me[questionId] || userCommentInputs.me[questionId].trim() === '') return;
    
    setQuestions(questions.map(q => 
      q.id === questionId 
        ? { ...q, meComment: userCommentInputs.me[questionId] } 
        : q
    ));
    
    // Clear the input
    setUserCommentInputs({
      ...userCommentInputs,
      me: {
        ...userCommentInputs.me,
        [questionId]: ""
      }
    });
  };

  const handleSaveComment = (questionId: number) => {
    handleAddComment(questionId);
  };
  
  return (
    <SidebarHeader>
      {/* Page title and progress tracker */}      
      <Box sx={{ width: '100%', mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
          ESG Report Disclosure Approval - Steering Committee : Reporting Period 2024
        </Typography>        <ProgressTracker 
          steps={steps} 
          currentStep={7} // This represents "Sustainability Manager Response"
        />
      </Box>
      <Box sx={{ backgroundColor: 'white', p: 1, borderRadius: 2, boxShadow: '0px 2px 6px rgba(0,0,0,0.05)' }}>
        <Box sx={{ p: 3, mb: 1 }}>
          <Typography color="#147C65" fontWeight="medium" sx={{ fontSize: '15px' }}>
            Please select Yes or No for each of the disclosures to be added into our ESG report
          </Typography>
        </Box><Stack spacing={4}>
          {questions.map((question, index) => (
            <Box key={question.id} sx={{ display: 'flex', alignItems: 'flex-start', px: 2, pb: 3 }}>
              {/* Question Number Box */}              <Box sx={{ 
                width: '32px',
                height: '32px',
                minWidth: '32px',
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: `1px solid #e0e0e0`,
                borderRadius: '6px',
                mr: 2,
                mt: 0.5
              }}>
                <Typography fontWeight="medium" sx={{ fontSize: '14px' }}>{question.id}.</Typography>
              </Box>
              
              {/* Question Card */}
              <Card
                variant="outlined"
                sx={{ 
                  flexGrow: 1,
                  borderColor: "#e0e0e0",
                  borderRadius: 2,
                  boxShadow: 'none',
                  px: 0
                }}
              >                  <Box sx={{ p: 2.5 }}>
                  {/* Question Title with Warning Icon */}                  <Box sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Typography sx={{ fontWeight: 'medium', fontSize: '16px' }}>
                        {question.question}
                      </Typography>
                      <InfoOutlinedIcon color="warning" fontSize="small" sx={{ ml: 0.5 }} />
                    </Box>
                  </Box>{/* Vikram Section */}
                  <Box sx={{ mb: 2 }}>
                    <Typography sx={{ fontWeight: '500', mb: 0.5, fontSize: '15px' }}>
                      Vikram
                    </Typography>
                    <Box sx={{ 
                      bgcolor: '#f8f8f8', 
                      borderRadius: 1, 
                      p: 1.5,
                      mb: 0.5
                    }}>
                      <Typography variant="body2" sx={{ fontSize: '14px', color: '#555' }}>
                        {question.vikramComment}
                      </Typography>
                    </Box>
                    
                    {userCommentInputs.vikram[question.id] && !activeCommentFields.vikram[question.id] && (
                      <Box sx={{ 
                        bgcolor: '#f8f8f8', 
                        borderRadius: 1, 
                        p: 1.5,
                        mb: 0.5
                      }}>
                        <Typography variant="body2" sx={{ fontSize: '14px', color: '#555' }}>
                          {userCommentInputs.vikram[question.id]}
                        </Typography>
                      </Box>
                    )}
                    
                    {activeCommentFields.vikram[question.id] && (
                      <Box sx={{ mt: 1, mb: 1 }}>
                        <TextField
                          multiline
                          rows={2}
                          placeholder="Add a reply..."
                          fullWidth
                          size="small"
                          value={userCommentInputs.vikram[question.id] || ''}
                          onChange={(e) => handleCommentChange('vikram', question.id, e.target.value)}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              backgroundColor: '#f8f8f8',
                              fontSize: '14px',
                              borderRadius: 1,
                            }
                          }}
                        />
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                          <Button 
                            size="small" 
                            sx={{ 
                              bgcolor: '#147C65',
                              color: '#fff',
                              '&:hover': { bgcolor: '#0d6e59' },
                              textTransform: 'none',
                              px: 2
                            }}
                            onClick={() => handleSendComment('vikram', question.id)}
                          >
                            Send
                          </Button>
                        </Box>
                      </Box>
                    )}
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 0.5 }}>
                      <Box />
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            color: '#147C65', 
                            fontSize: '12px', 
                            fontWeight: '500',
                            cursor: 'pointer',
                            mr: 1.5
                          }}
                          onClick={() => handleToggleCommentField('vikram', question.id)}
                        >
                          Reply
                        </Typography>
                        <RedSwitch
                          checked={question.vikramApproval}
                          size="small"
                          disabled={true}
                        />
                      </Box>
                    </Box>
                  </Box>                  {/* Sonia Section */}
                  <Box sx={{ mb: 2 }}>
                    <Typography sx={{ fontWeight: '500', mb: 0.5, fontSize: '15px' }}>
                      Sonia
                    </Typography>
                    <Box sx={{ 
                      bgcolor: '#f8f8f8', 
                      borderRadius: 1, 
                      p: 1.5,
                      mb: 0.5
                    }}>
                      <Typography variant="body2" sx={{ fontSize: '14px', color: '#555' }}>
                        {question.soniaComment}
                      </Typography>
                    </Box>
                    
                    {userCommentInputs.sonia[question.id] && !activeCommentFields.sonia[question.id] && (
                      <Box sx={{ 
                        bgcolor: '#f8f8f8', 
                        borderRadius: 1, 
                        p: 1.5,
                        mb: 0.5
                      }}>
                        <Typography variant="body2" sx={{ fontSize: '14px', color: '#555' }}>
                          {userCommentInputs.sonia[question.id]}
                        </Typography>
                      </Box>
                    )}
                    
                    {activeCommentFields.sonia[question.id] && (
                      <Box sx={{ mt: 1, mb: 1 }}>
                        <TextField
                          multiline
                          rows={2}
                          placeholder="Add a reply..."
                          fullWidth
                          size="small"
                          value={userCommentInputs.sonia[question.id] || ''}
                          onChange={(e) => handleCommentChange('sonia', question.id, e.target.value)}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              backgroundColor: '#f8f8f8',
                              fontSize: '14px',
                              borderRadius: 1,
                            }
                          }}
                        />
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                          <Button 
                            size="small" 
                            sx={{ 
                              bgcolor: '#147C65',
                              color: '#fff',
                              '&:hover': { bgcolor: '#0d6e59' },
                              textTransform: 'none',
                              px: 2
                            }}
                            onClick={() => handleSendComment('sonia', question.id)}
                          >
                            Send
                          </Button>
                        </Box>
                      </Box>
                    )}
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 0.5 }}>
                      <Box />
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            color: '#147C65', 
                            fontSize: '12px', 
                            fontWeight: '500',
                            cursor: 'pointer',
                            mr: 1.5
                          }}
                          onClick={() => handleToggleCommentField('sonia', question.id)}
                        >
                          Reply
                        </Typography>
                        <RedSwitch
                          checked={question.soniaApproval}
                          size="small"
                          disabled={true}
                        />
                      </Box>
                    </Box>
                  </Box>                  {/* Me Section */}
                  <Box sx={{ mb: 2 }}>
                    <Typography sx={{ fontWeight: '500', mb: 0.5, fontSize: '15px' }}>
                      Me
                    </Typography>
                    
                    {question.meComment && (
                      <Box sx={{ 
                        bgcolor: '#f8f8f8', 
                        borderRadius: 1, 
                        p: 1.5,
                        mb: 0.5
                      }}>
                        <Typography variant="body2" sx={{ fontSize: '14px', color: '#555' }}>
                          {question.meComment}
                        </Typography>
                      </Box>
                    )}
                    
                    {userCommentInputs.me[question.id] && (
                      <Box sx={{ 
                        bgcolor: '#f8f8f8', 
                        borderRadius: 1, 
                        p: 1.5,
                        mb: 0.5
                      }}>
                        <Typography variant="body2" sx={{ fontSize: '14px', color: '#555' }}>
                          {userCommentInputs.me[question.id]}
                        </Typography>
                      </Box>
                    )}
                    
                    {/* Input field for new comments */}
                    <Box sx={{ mt: 1, mb: 1 }}>
                      <TextField
                        multiline
                        rows={2}
                        placeholder="Add a comment..."
                        fullWidth
                        size="small"
                        value={userCommentInputs.me[question.id] || ''}
                        onChange={(e) => handleCommentChange('me', question.id, e.target.value)}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            backgroundColor: '#f8f8f8',
                            fontSize: '14px',
                            borderRadius: 1,
                          }
                        }}
                      />
                      {userCommentInputs.me[question.id] && (
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                          <Button 
                            size="small" 
                            sx={{ 
                              bgcolor: '#147C65',
                              color: '#fff',
                              '&:hover': { bgcolor: '#0d6e59' },
                              textTransform: 'none',
                              px: 2
                            }}
                            onClick={() => handleSendComment('me', question.id)}
                          >
                            Send
                          </Button>
                        </Box>
                      )}
                    </Box>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                      <Box />
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>                        <Typography 
                          variant="body2" 
                          sx={{ 
                            color: '#147C65', 
                            fontSize: '12px', 
                            fontWeight: '500',
                            cursor: 'pointer',
                            mr: 1.5
                          }}
                          onClick={() => handleToggleCommentField('me', question.id)}
                        >
                          Reply
                        </Typography><RedSwitch
                          checked={question.meApproval}
                          size="small"
                          onChange={() => handleUserApprovalToggle(question.id, 'me')}
                        />
                      </Box>
                    </Box>
                  </Box>{/* Pooja Section */}
                  <Box sx={{ mb: 2 }}>
                    <Typography sx={{ fontWeight: '500', mb: 0.5, fontSize: '15px' }}>
                      Pooja
                    </Typography>
                    <Box sx={{ 
                      bgcolor: '#f8f8f8', 
                      borderRadius: 1, 
                      p: 1.5,
                      mb: 0.5
                    }}>
                      <Typography variant="body2" sx={{ fontSize: '14px', color: '#555' }}>
                        {question.poojaComment}
                      </Typography>
                    </Box>
                    
                    {userCommentInputs.pooja[question.id] && !activeCommentFields.pooja[question.id] && (
                      <Box sx={{ 
                        bgcolor: '#f8f8f8', 
                        borderRadius: 1, 
                        p: 1.5,
                        mb: 0.5
                      }}>
                        <Typography variant="body2" sx={{ fontSize: '14px', color: '#555' }}>
                          {userCommentInputs.pooja[question.id]}
                        </Typography>
                      </Box>
                    )}
                    
                    {activeCommentFields.pooja[question.id] && (
                      <Box sx={{ mt: 1, mb: 1 }}>
                        <TextField
                          multiline
                          rows={2}
                          placeholder="Add a reply..."
                          fullWidth
                          size="small"
                          value={userCommentInputs.pooja[question.id] || ''}
                          onChange={(e) => handleCommentChange('pooja', question.id, e.target.value)}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              backgroundColor: '#f8f8f8',
                              fontSize: '14px',
                              borderRadius: 1,
                            }
                          }}
                        />
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                          <Button 
                            size="small" 
                            sx={{ 
                              bgcolor: '#147C65',
                              color: '#fff',
                              '&:hover': { bgcolor: '#0d6e59' },
                              textTransform: 'none',
                              px: 2
                            }}
                            onClick={() => handleSendComment('pooja', question.id)}
                          >
                            Send
                          </Button>
                        </Box>
                      </Box>
                    )}
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 0.5 }}>
                      <Box />
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            color: '#147C65', 
                            fontSize: '12px', 
                            fontWeight: '500',
                            cursor: 'pointer',
                            mr: 1.5
                          }}
                          onClick={() => handleToggleCommentField('pooja', question.id)}
                        >
                          Reply
                        </Typography>
                        <RedSwitch
                          checked={question.poojaApproval}
                          size="small"
                          disabled
                        />
                      </Box>
                    </Box>
                  </Box>                  {/* Approval by Sustainability Manager */}
                  <Box sx={{ 
                    mt: 2, 
                    pt: 1.5,
                    borderTop: '1px solid #e0e0e0',
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center'
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography sx={{ fontWeight: '500', fontSize: '14px' }}>
                        Approval by Sustainability Manager
                      </Typography>
                    </Box>                    <RedSwitch
                      checked={question.sustainabilityManagerApproval}
                      onChange={() => handleApprovalToggle(question.id)}
                      size="small"
                    />
                  </Box>
                </Box>
              </Card>
            </Box>
          ))}
        </Stack>        <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ p: 3, mt: 2 }}>
          <Button 
            variant="outlined" 
            sx={{
              borderColor: "#147C65",
              color: "#147C65",
              "&:hover": { 
                borderColor: "#1b5e20",
                backgroundColor: "rgba(20, 124, 101, 0.04)" 
              },
              px: 3
            }}
            onClick={handleBack}
          >
            Back
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={loading}
            sx={{
              bgcolor: "#147C65",
              "&:hover": { bgcolor: "#1b5e20" },
              px: 3
            }}
          >
            Submit
          </Button>
        </Stack>
      </Box>
    </SidebarHeader>
  )
}

export default SustainabilityManagerResponse;
