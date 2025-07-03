import { useState } from "react"
import SidebarHeader from "../../Components/SidebarHeader"
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
} from "@mui/material"
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined"
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline"
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown"
import popImage from "../../assets/pop.png"

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
}))

const CommentButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: "#2e7d32",
  color: "white",
  "&:hover": {
    backgroundColor: "#1b5e20",
  },
}))

const ScApprovalRequest = () => {
  const [commentsArray, setCommentsArray] = useState<string[]>(["", "", ""])
  const [toggleStates, setToggleStates] = useState<boolean[]>([true, false, false])
  const [expandedQuestion, setExpandedQuestion] = useState<number>(0)
  const [selectedQuestion, setSelectedQuestion] = useState<number>(0)
  const [committee, setCommittee] = useState<string>("")

  const handleToggleChange = (index: number) => {
    const newToggleStates = [...toggleStates]
    newToggleStates[index] = !newToggleStates[index]
    setToggleStates(newToggleStates)
  }

  const handleExpandQuestion = (index: number) => {
    setSelectedQuestion(index)
    setExpandedQuestion(expandedQuestion === index ? -1 : index)
  }

  const handleCommentChange = (index: number, value: string) => {
    const newComments = [...commentsArray]
    newComments[index] = value
    setCommentsArray(newComments)
  }

  return (
    <SidebarHeader>
        <Grid sx={{backgroundColor: 'white', p: 1, borderRadius: 2}}>
      <Grid container spacing={2} sx={{ p: 2, mb: 2 }}>
        <Grid item xs={12} md={6}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography color="#147C65" fontWeight="bold">
              Please select steering committee :
            </Typography>
            <FormControl size="small" sx={{ minWidth: 180 }}>
              <Select
                value={committee}
                onChange={(e) => setCommittee(e.target.value)}
                displayEmpty
                sx={{ boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                    border: "none",
                    "& fieldset": { border: "none" },}}
                renderValue={(selected) => (selected ? selected : "Select")}
                IconComponent={KeyboardArrowDownIcon}
              >
                <MenuItem value="">
                  <em>Select</em>
                </MenuItem>
                <MenuItem value="Committee 1">Committee 1</MenuItem>
                <MenuItem value="Committee 2">Committee 2</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography color="#147C65" fontWeight="bold">
            Please select Yes or No for each of the disclosures to be added into our ESG report
          </Typography>
        </Grid>
      </Grid>

      <Stack spacing={2} sx={{ px: 2 }}>
        {[0, 1, 2].map((index) => (
          <Box key={index} sx={{ display: 'flex', alignItems: 'flex-start' }}>
            {/* Number box outside the card with conditional border color */}
            <NumberBox sx={{ 
              mt: 1,
              border: `1px solid ${selectedQuestion === index ? "#10B981" : "rgba(0, 0, 0, 0.12)"}`,
            }}>
              <Typography fontWeight="medium">{index + 1}.</Typography>
            </NumberBox>
            
            {/* Card containing the question and content with conditional border color */}
            <Card
              variant="outlined"
              sx={{ 
                flexGrow: 1,
                borderColor: selectedQuestion === index ? "#10B981" : "rgba(0, 0, 0, 0.12)",
                borderWidth: selectedQuestion === index ? 1 : 1
              }}
            >
              <Box sx={{ p: 2 }}>
                <Box sx={{ flexGrow: 1 }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Typography variant="subtitle1" fontWeight="medium">
                        Negative environmental impact in the supply chain and action taken?
                      </Typography>
                      <InfoOutlinedIcon color="warning" fontSize="small" />
                    </Stack>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <CommentButton 
                        size="small" 
                        onClick={() => handleExpandQuestion(index)}
                        sx={{
                          backgroundColor: selectedQuestion === index ? "#10B981" : "#2e7d32",
                        }}
                      >
                        <ChatBubbleOutlineIcon fontSize="small" />
                      </CommentButton>
                      <Stack direction="row" spacing={1} alignItems="center">
                        {toggleStates[index] && (
                          <Typography variant="caption" color="primary">
                            Yes
                          </Typography>
                        )}
                        <GreenSwitch
                          checked={toggleStates[index]}
                          onChange={() => handleToggleChange(index)}
                          size="small"
                        />
                      </Stack>
                    </Stack>
                  </Stack>

                  {expandedQuestion === index && (
                    <Box sx={{ mt: 2 }}>
                      <TextField
                        fullWidth
                        multiline
                        minRows={4}
                        placeholder="Please Add Your Comment Here"
                        value={commentsArray[index]}
                        onChange={(e) => handleCommentChange(index, e.target.value)}
                        variant="outlined"
                      />
                      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 1 }}>
                        <Button variant="outlined" color="primary" sx={{ borderColor: "#2e7d32", color: "#2e7d32" }}>
                          Save Comment
                        </Button>
                      </Box>
                    </Box>
                  )}
                </Box>
              </Box>
            </Card>
          </Box>
        ))}
      </Stack>

      <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ p: 2, mt: 2 }}>
        <Button variant="outlined" color="inherit">
          Back
        </Button>
        <Button
          variant="contained"
          sx={{
            bgcolor: "#147C65",
            "&:hover": { bgcolor: "#1b5e20" },
          }}
        >
          Save
        </Button>
        <Button variant="outlined" color="inherit">
          Submit
        </Button>
      </Stack>
      </Grid>
    </SidebarHeader>
  )
}

export default ScApprovalRequest

