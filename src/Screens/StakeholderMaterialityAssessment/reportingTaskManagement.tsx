import React, { useState } from 'react';
import { Box, Typography, Paper, List, ListItem, ListItemText, Chip, Grid, IconButton, Collapse, Dialog, DialogTitle, DialogContent, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Radio, Button, InputAdornment, DialogActions, FormControlLabel, RadioGroup } from '@mui/material';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import SearchIcon from '@mui/icons-material/Search';
import { DragDropContext, Draggable, Droppable, type DropResult, type DraggableProvided, type DroppableProvided } from 'react-beautiful-dnd';
import SidebarHeader from '../../Components/SidebarHeader';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { useParams } from 'react-router-dom';
import { api } from '../common';

// React 18 StrictMode fix for react-beautiful-dnd
const StrictModeDroppable = ({ children, ...props }: any) => {
  const [enabled, setEnabled] = useState(false);

  React.useEffect(() => {
    // Enable after a tick to avoid StrictMode double rendering issue
    const animation = requestAnimationFrame(() => setEnabled(true));
    return () => {
      cancelAnimationFrame(animation);
      setEnabled(false);
    };
  }, []);

  if (!enabled) {
    return null;
  }

  return <Droppable {...props}>{children}</Droppable>;
};

// User Assignment Dialog Component
interface UserAssignmentDialogProps {
  open: boolean;
  onClose: () => void;
  onAssign: (employeeId: string, assignmentType: 'one-time' | 'recurring', dueDate: Date | null, monthlyDueDay: string, notes: string) => void;
  currentTask: Task | null;
  users: { id: string; name: string; department: string; email: string; org_user_id: string }[];
}

const UserAssignmentDialog: React.FC<UserAssignmentDialogProps> = ({ 
  open, 
  onClose, 
  onAssign, 
  currentTask, 
  users 
}) => {
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [monthlyDueDay, setMonthlyDueDay] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [assignmentType, setAssignmentType] = useState<'one-time' | 'recurring'>('one-time');
  const [dialogStep, setDialogStep] = useState<'user-selection' | 'assignment-details'>('user-selection');
  const [loading, setLoading] = useState(false);

  // Reset form when dialog opens
  React.useEffect(() => {
    if (open) {
      if (currentTask && currentTask.assigned_to) {
        // Pre-fill form with existing assignment data for editing
        setSelectedEmployeeId(currentTask.assigned_to.toString());
        setDueDate(currentTask.due_date ? new Date(currentTask.due_date) : null);
        setAssignmentType('one-time'); // Default for editing
        setMonthlyDueDay('');
        setNotes('');
        setSelectedTemplate('');
      } else {
        // Reset form for new assignment
        setSelectedEmployeeId(null);
        setDueDate(null);
        setMonthlyDueDay('');
        setNotes('');
        setSelectedTemplate('');
        setAssignmentType('one-time');
      }
      setSearchQuery('');
      setDialogStep('user-selection');
    }
  }, [open, currentTask]);

  const handleSelectEmployee = (employeeId: string) => {
    setSelectedEmployeeId(employeeId);
  };

  const handleNextToAssignmentDetails = () => {
    if (!selectedEmployeeId) {
      alert('Please select a user first.');
      return;
    }
    setDialogStep('assignment-details');
  };

  const handleBackToUserSelection = () => {
    setDialogStep('user-selection');
  };

  const handleAssignEmployee = async () => {
    if (!selectedEmployeeId) return;

    // Validate required fields based on assignment type
    if (assignmentType === 'one-time' && !dueDate) {
      alert('Please select a due date for one-time assignment.');
      return;
    }
    
    if (assignmentType === 'recurring' && !monthlyDueDay.trim()) {
      alert('Please enter the monthly due day for recurring assignment.');
      return;
    }

    setLoading(true);
    try {
      await onAssign(selectedEmployeeId, assignmentType, dueDate, monthlyDueDay, notes);
      onClose();
    } catch (error) {
      console.error('Error assigning task:', error);
      alert('Error assigning task. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCloseDialog = () => {
    setSelectedEmployeeId(null);
    setSearchQuery('');
    setDueDate(null);
    setMonthlyDueDay('');
    setNotes('');
    setSelectedTemplate('');
    setAssignmentType('one-time');
    setDialogStep('user-selection');
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleCloseDialog} maxWidth="md" fullWidth>
      <DialogTitle sx={{ borderBottom: '1px solid #eee', pb: 2 }}>
        <Typography variant="h6" component="div">
          {dialogStep === 'user-selection' ? 'Select User' : 'Assignment Details'}
        </Typography>
      </DialogTitle>
      <DialogContent sx={{ pt: 3 }}>
        {dialogStep === 'user-selection' ? (
          <>
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

            <TableContainer component={Paper} variant="outlined" sx={{ mb: 3 }}>
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
                    .filter(user => 
                      user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                      user.department.toLowerCase().includes(searchQuery.toLowerCase()) || 
                      user.email.toLowerCase().includes(searchQuery.toLowerCase())
                    )
                    .map(user => (
                      <TableRow 
                        key={user.id} 
                        onClick={() => handleSelectEmployee(user.org_user_id)} 
                        hover 
                        selected={selectedEmployeeId === user.org_user_id} 
                        sx={{ cursor: 'pointer' }}
                      >
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
          </>
        ) : (
          <Box sx={{ p: 2 }}>
            {/* Selected User Info */}
            <Box sx={{ mb: 3, p: 2, border: '1px solid #e0e0e0', borderRadius: 1, backgroundColor: '#f8f9fa' }}>
              <Typography variant="subtitle2" sx={{ mb: 1, color: '#666' }}>
                Selected User:
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 600 }}>
                {users.find(u => u.org_user_id === selectedEmployeeId)?.name || 'Unknown User'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {users.find(u => u.org_user_id === selectedEmployeeId)?.department} • {users.find(u => u.org_user_id === selectedEmployeeId)?.email}
              </Typography>
            </Box>

            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
              Assignment Details
            </Typography>

            {/* Assignment Type Selection */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                Assignment Type
              </Typography>
              <RadioGroup
                value={assignmentType}
                onChange={(e) => {
                  setAssignmentType(e.target.value as 'one-time' | 'recurring');
                  setDueDate(null);
                  setMonthlyDueDay('');
                }}
                row
              >
                <FormControlLabel 
                  value="one-time" 
                  control={<Radio sx={{ '&.Mui-checked': { color: '#147C65' } }} />} 
                  label="One Time" 
                />
                <FormControlLabel 
                  value="recurring" 
                  control={<Radio sx={{ '&.Mui-checked': { color: '#147C65' } }} />} 
                  label="Recurring" 
                />
              </RadioGroup>
            </Box>

            {/* Date Selection based on Assignment Type */}
            {assignmentType === 'one-time' ? (
              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                  Due Date
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
            ) : (
              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                  Monthly Due Day
                </Typography>
                <TextField
                  value={monthlyDueDay}
                  onChange={e => setMonthlyDueDay(e.target.value)}
                  placeholder="Enter day of month (1-31)"
                  type="number"
                  inputProps={{ min: 1, max: 31 }}
                  size="small"
                  sx={{
                    maxWidth: '200px',
                    '.MuiOutlinedInput-root': {
                      borderRadius: 1,
                      fontSize: '14px'
                    }
                  }}
                />
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                  This will recur monthly until the reporting period ends on 31 Dec 2025
                </Typography>
              </Box>
            )}

            {/* Notes */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                Notes
              </Typography>
              <TextField
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Enter Notes Here"
                multiline
                rows={3}
                fullWidth
                variant="outlined"
                size="small"
                sx={{
                  '.MuiOutlinedInput-root': {
                    borderRadius: 1,
                    fontSize: '14px'
                  }
                }}
              />
            </Box>

            {/* Choose Template */}
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                Choose Template
              </Typography>
              <TextField
                select
                value={selectedTemplate}
                onChange={(e) => setSelectedTemplate(e.target.value)}
                placeholder="Select"
                fullWidth
                variant="outlined"
                size="small"
                SelectProps={{
                  native: true,
                }}
                sx={{
                  '.MuiOutlinedInput-root': {
                    borderRadius: 1,
                    fontSize: '14px'
                  }
                }}
              >
                <option value="">Select</option>
                <option value="template1">Template 1</option>
                <option value="template2">Template 2</option>
                <option value="template3">Template 3</option>
              </TextField>
            </Box>

            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '13px' }}>
              This template requires {assignmentType === 'one-time' ? 'qualitative' : 'quantitative'} data.
            </Typography>
          </Box>
        )}
      </DialogContent>
      <DialogActions sx={{ borderTop: '1px solid #eee', p: 2 }}>
        {dialogStep === 'user-selection' ? (
          <>
            <Button onClick={handleCloseDialog} sx={{ color: '#147C65', borderColor: '#147C65', '&:hover': { borderColor: '#1b5e20' } }} variant="outlined">
              Cancel
            </Button>
            <Button 
              onClick={handleNextToAssignmentDetails} 
              disabled={!selectedEmployeeId} 
              variant="contained" 
              sx={{ bgcolor: '#147C65', '&:hover': { bgcolor: '#1b5e20' } }}
            >
              Next
            </Button>
          </>
        ) : (
          <>
            <Button onClick={handleBackToUserSelection} sx={{ color: '#147C65', borderColor: '#147C65', '&:hover': { borderColor: '#1b5e20' } }} variant="outlined">
              Back
            </Button>
            <Button onClick={handleCloseDialog} sx={{ color: '#666' }}>
              Cancel
            </Button>
            <Button 
              onClick={handleAssignEmployee} 
              disabled={
                !selectedEmployeeId || 
                loading ||
                (assignmentType === 'one-time' && !dueDate) ||
                (assignmentType === 'recurring' && !monthlyDueDay.trim())
              } 
              variant="contained" 
              sx={{ bgcolor: '#147C65', '&:hover': { bgcolor: '#1b5e20' } }}
            >
              {loading ? 'Assigning...' : 'Assign'}
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
};

// Add this interface for the edit dialog props
interface EditTaskDialogProps {
  open: boolean;
  onClose: () => void;
  task: Task | null;
  onSave: (title: string, description: string) => void;
}

// Add this EditTaskDialog component after UserAssignmentDialog component
const EditTaskDialog: React.FC<EditTaskDialogProps> = ({ open, onClose, task, onSave }) => {
  const [title, setTitle] = useState<string>(task?.title || '');
  const [description, setDescription] = useState<string>('');

  // Reset form when dialog opens with a new task
  React.useEffect(() => {
    if (task) {
      setTitle(task.title || `Task ${task.task}`);

      // Use the task's description if it exists, otherwise use requested_data
      if (task.description) {
        setDescription(task.description);
      } else {
        setDescription(task.requested_data || 'No description available');
      }
    }
  }, [task]);

  const handleSave = () => {
    onSave(title, description);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '12px',
          maxWidth: '600px',
          fontFamily: "'Inter', sans-serif",
          '& *': {
            fontFamily: "'Inter', sans-serif"
          }
        }
      }}
    >
      <DialogTitle sx={{ fontWeight: 600, fontSize: '20px', py: 2 }}>Edit Task</DialogTitle>

      <DialogContent sx={{ pt: 0 }}>
        <Typography variant="subtitle2" sx={{ mb: 1, color: 'text.secondary' }}>
          Task Title
        </Typography>
        <TextField
          fullWidth
          value={title}
          onChange={e => setTitle(e.target.value)}
          margin="dense"
          variant="outlined"
          sx={{ mb: 2 }}
          InputProps={{
            sx: {
              borderRadius: '8px',
              '& fieldset': {
                borderColor: '#E2E8F0'
              }
            }
          }}
        />

        <Typography variant="subtitle2" sx={{ mb: 1, color: 'text.secondary' }}>
          Task Description
        </Typography>
        <TextField
          fullWidth
          multiline
          minRows={4}
          maxRows={8}
          value={description}
          onChange={e => setDescription(e.target.value)}
          margin="dense"
          variant="outlined"
          sx={{ mb: 2 }}
          InputProps={{
            sx: {
              borderRadius: '8px',
              '& fieldset': {
                borderColor: '#E2E8F0'
              }
            }
          }}
        />
      </DialogContent>

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          gap: 2,
          p: 2,
          backgroundColor: '#F8FAFC'
        }}
      >
        <Button
          variant="outlined"
          onClick={onClose}
          sx={{
            borderRadius: '10px',
            px: 4,
            py: 1,
            border: 'solid #373737',
            color: '#373737',
            textTransform: 'none',
            fontWeight: 500
          }}
        >
          Cancel
        </Button>
        <Button
          variant="outlined"
          onClick={handleSave}
          disabled={!title.trim()}
          sx={{
            borderRadius: '10px',
            px: 4,
            py: 1,
            border: 'solid #147C65',
            color: '#147C65',
            textTransform: 'none',
            fontWeight: 500,
            bgcolor: 'white',
            '&:hover': {
              bgcolor: 'white',
              opacity: 0.9
            }
          }}
        >
          Save
        </Button>
      </Box>
    </Dialog>
  );
};

// Task Detail Dialog Component
interface TaskDetailDialogProps {
  open: boolean;
  onClose: () => void;
  task: Task | null;
  onAssignUser?: (taskId: number) => void; // Add this prop
}

const TaskDetailDialog: React.FC<TaskDetailDialogProps> = ({ open, onClose, task, onAssignUser }) => {
  if (!task) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '12px',
          maxWidth: '500px',
          fontFamily: "'Inter', sans-serif",
          '& *': {
            fontFamily: "'Inter', sans-serif"
          }
        }
      }}
    >
      <Box sx={{ p: 3 }}>
        {/* Header with title and due date */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '18px', flex: 1, mr: 2 }}>
            {task.title || task.requested_data || `Task ${task.task}`}
          </Typography>
          <Box sx={{ textAlign: 'right' }}>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '12px' }}>
              Due Date :
            </Typography>
            <Typography variant="body2" sx={{ color: '#d93025', fontWeight: 500 }}>
              {formatDate(task.due_date)}
            </Typography>
          </Box>
        </Box>

        {/* Description */}
        <Typography variant="body2" color="text.secondary" sx={{ mb: 4, lineHeight: 1.6 }}>
          {task.requested_data || task.description || 'This is a description of the Disclosure.'}
        </Typography>

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              Action
            </Typography>
            <Button
              variant="outlined"
              sx={{
                borderRadius: '8px',
                px: 3,
                py: 1,
                border: '1px solid #147C65',
                color: '#147C65',
                textTransform: 'none',
                fontWeight: 500,
                '&:hover': {
                  bgcolor: 'rgba(20, 124, 101, 0.05)',
                  borderColor: '#147C65'
                }
              }}
            >
              Add/Update Data
            </Button>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              Request Data (Optional)
            </Typography>
            <Button
              variant="outlined"
              onClick={() => {
                if (task && onAssignUser) {
                  onAssignUser(task.id);
                  onClose(); // Close the task detail dialog
                }
              }}
              sx={{
                borderRadius: '8px',
                px: 3,
                py: 1,
                border: '1px solid #666',
                color: '#666',
                textTransform: 'none',
                fontWeight: 500,
                '&:hover': {
                  bgcolor: 'rgba(102, 102, 102, 0.05)',
                  borderColor: '#666'
                }
              }}
            >
              {task?.assigned_to ? 'Edit Assignment' : 'Assign to User'}
            </Button>
          </Box>
        </Box>

        {/* Close Button */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Button
            variant="outlined"
            onClick={onClose}
            sx={{
              borderRadius: '8px',
              px: 4,
              py: 1,
              border: '1px solid #666',
              color: '#666',
              textTransform: 'none',
              fontWeight: 500,
              '&:hover': {
                bgcolor: 'rgba(102, 102, 102, 0.05)',
                borderColor: '#666'
              }
            }}
          >
            Close
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
};

// Task Interface - Updated to match API response
interface Task {
  id: number;
  title?: string;
  created_at?: string;
  updated_at?: string;
  requested_data: string;
  priority: string;
  due_date: string;
  status: 'pending' | 'in_progress' | 'completed';
  is_recurring?: boolean;
  recurrence_type?: string;
  recurrence_day?: number;
  task: number;
  assigned_to: number;
  assigned_by?: number;
  assignedToName?: string; // For display purposes
  description?: string; // For display purposes
}

// Updated task data with column property
// const initialTasks: Task[] = [
//   {
//     id: 1,
//     title: 'GRI11- Oil and Gas Sector 2021',
//     assignedTo: '',
//     dueDate: '20/1/2025',
//     status: 'pending',
//     priority: 'low',
//     column: 'notComplete'
//   },
//   {
//     id: 2,
//     title: 'GRI11- Oil and Gas Sector 2021',
//     assignedTo: '',
//     dueDate: '20/1/2025',
//     status: 'pending',
//     priority: 'low',
//     column: 'notComplete'
//   },
//   {
//     id: 3,
//     title: 'GRI11- Oil and Gas Sector 2021',
//     assignedTo: '',
//     dueDate: '20/1/2025',
//     status: 'pending',
//     priority: 'medium',
//     column: 'notComplete'
//   },
//   {
//     id: 4,
//     title: 'GRI11- Oil and Gas Sector 2021',
//     assignedTo: '',
//     dueDate: '20/1/2025',
//     status: 'completed',
//     priority: 'medium',
//     column: 'completed'
//   },
//   {
//     id: 5,
//     title: 'GRI11- Oil and Gas Sector 2021',
//     assignedTo: '',
//     dueDate: '20/1/2025',
//     status: 'completed',
//     priority: 'medium',
//     column: 'completed'
//   },
//   {
//     id: 6,
//     title: 'GRI11- Oil and Gas Sector 2021',
//     assignedTo: '',
//     dueDate: '20/1/2025',
//     status: 'completed',
//     priority: 'medium',
//     column: 'approved'
//   },
//   {
//     id: 7,
//     title: 'GRI11- Oil and Gas Sector 2021',
//     assignedTo: '',
//     dueDate: '20/1/2025',
//     status: 'completed',
//     priority: 'high',
//     column: 'approved'
//   }
// ];

// TaskList Component
interface TaskListProps {
  tasks: Task[];
  onOpenTaskDetail: (taskId: number) => void; // Add new prop for task detail dialog
}

// Format date to DD/MM/YYYY format
const formatDate = (dateString: string) => {
  if (!dateString) return '';
  
  // If already in DD/MM/YYYY format, return as is
  if (dateString.includes('/')) return dateString;
  
  // If in ISO format (YYYY-MM-DD), convert to DD/MM/YYYY
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

const TaskList: React.FC<TaskListProps> = ({ tasks, onOpenTaskDetail }) => {
  const [editTaskId, setEditTaskId] = useState<number | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState<boolean>(false);

  // Add task context to get access to task setter functions
  const { onChangePriority, onEditTask } = React.useContext(TaskContext);

  const handlePriorityClick = (e: React.MouseEvent, taskId: number, currentPriority: string) => {
    e.stopPropagation(); // Prevent dragging when clicking on priority

    // Cycle through priorities: low -> medium -> high -> low
    let newPriority: string;
    switch (currentPriority) {
      case 'low':
        newPriority = 'medium';
        break;
      case 'medium':
        newPriority = 'high';
        break;
      default:
        newPriority = 'low';
        break;
    }

    onChangePriority(taskId, newPriority);
  };

  const handleSaveEdit = (title: string, description: string) => {
    if (editTaskId) {
      onEditTask(editTaskId, title, description);
    }
    setEditDialogOpen(false);
    setEditTaskId(null);
  };

  const currentTaskToEdit = tasks.find(task => task.id === editTaskId) || null;

  return (
    <>
      <List sx={{ padding: 0 }}>
        {tasks.length === 0 ? (
          <ListItem>
            <ListItemText primary="No tasks in this category" />
          </ListItem>
        ) : (
          tasks.map((task, index) => (
            <Draggable key={task.id} draggableId={`task-${task.id}`} index={index}>
              {(provided: DraggableProvided) => (
                <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                  <ListItem
                    alignItems="flex-start"
                    sx={{
                      p: 0,
                      mb: 2,
                      cursor: 'grab',
                      '&:hover': {
                        bgcolor: 'rgba(0, 0, 0, 0.04)'
                      },
                      '&:active': {
                        cursor: 'grabbing'
                      }
                    }}
                  >
                    <Paper elevation={1} sx={{ width: '100%', overflow: 'hidden', borderRadius: '8px' }}>
                      <Box sx={{ p: 1.5 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Chip
                            label={task.priority}
                            size="small"
                            onClick={e => handlePriorityClick(e, task.id, task.priority)}
                            sx={{
                              height: '24px',
                              cursor: 'pointer',
                              bgcolor: task.priority === 'high' ? '#fce8e8' : task.priority === 'medium' ? '#fff8e1' : '#e6f4ea',
                              color: task.priority === 'high' ? '#d93025' : task.priority === 'medium' ? '#b06000' : '#137333'
                            }}
                          />
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Chip
                              label={task.assignedToName ? formatDate(task.due_date) : formatDate(task.due_date)}
                              size="small"
                              sx={{
                                height: '24px',
                                bgcolor: '#fce8e8',
                                color: '#d93025',
                                mr: 1,
                                borderRadius: '4px',
                                visibility: task.due_date ? 'visible' : 'hidden'
                              }}
                            />
                            <Box sx={{ display: 'flex', gap: 0.5 }}>
                              {/* Single Action Icon */}
                              <Box
                                component="span"
                                onClick={e => {
                                  e.stopPropagation();
                                  onOpenTaskDetail(task.id);
                                }}
                                sx={{
                                  width: 24,
                                  height: 24,
                                  bgcolor: '#F5F5FA',
                                  borderRadius: '4px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  cursor: 'pointer',
                                  '&:hover': {
                                    bgcolor: '#E5E7EB'
                                  }
                                }}
                              >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M12 8V12L15 15" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                  <circle cx="12" cy="12" r="9" stroke="#666" strokeWidth="2"/>
                                </svg>
                              </Box>
                            </Box>
                          </Box>
                        </Box>
                        <Typography variant="subtitle1" fontWeight="medium">
                          {task.requested_data || `Task ${task.task}`}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                          {task.description || (task.id === 1 ? 'description will go here' : 'default des')}
                        </Typography>
                      </Box>
                    </Paper>
                  </ListItem>
                </div>
              )}
            </Draggable>
          ))
        )}
      </List>

      <EditTaskDialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} task={currentTaskToEdit} onSave={handleSaveEdit} />
    </>
  );
};

type ColumnId = 'pending' | 'in_progress' | 'completed';

// Create a task context to manage tasks across components
const TaskContext = React.createContext<{
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  onChangePriority: (taskId: number, newPriority: string) => void;
  onEditTask: (taskId: number, title: string, description: string) => void;
}>({
  tasks: [],
  setTasks: () => {},
  onChangePriority: () => {},
  onEditTask: () => {}
});

// Main TaskManagement Component
const ReportingTaskManagement: React.FC = () => {
  const { reportId } = useParams();
  console.log('reportid', reportId);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [expanded, setExpanded] = useState<boolean>(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dueDateDialogOpen, setDueDateDialogOpen] = useState(false);
  const [taskDetailDialogOpen, setTaskDetailDialogOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<any | null>(null);
  const [selectedDueDate, setSelectedDueDate] = useState<string>('');
  const [users, setUsers] = useState<{ id: string; name: string; department: string; email: string; org_user_id: string }[]>([]);
  const [currentTaskForAssignment, setCurrentTaskForAssignment] = useState<Task | null>(null);
  const [loading, setLoading] = useState(false);

  // Add debouncing for API calls
  const pendingUpdates = React.useRef<Map<number, NodeJS.Timeout>>(new Map());

  const getColumnTasks = (column: ColumnId) => {
    return tasks.filter(task => task.status === column);
  };

  // const handleDragEnd = (result: DropResult) => {
  //   console.log("Results", result)
  //   const { destination, source, draggableId } = result;

  //   // Dropped outside the list or no destination
  //   if (!destination) {
  //     return;
  //   }

  //   // Dropped in the same position
  //   if (destination.droppableId === source.droppableId && destination.index === source.index) {
  //     return;
  //   }

  //   // Get the task ID from the draggableId
  //   const taskId = Number.parseInt(draggableId.split('-')[1]);

  //   // Get the target column
  //   const targetColumn = destination.droppableId as ColumnId;

  //   // Update the task's column
  //   setTasks(prevTasks =>
  //     prevTasks.map(task =>
  //       task.id === taskId
  //         ? {
  //             ...task,
  //             column: targetColumn,
  //             status: targetColumn === 'in_progress' || targetColumn === 'completed' ? 'in_progress' : task.status
  //           }
  //         : task
  //     )
  //   );
  // };

  const handleDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const [, idStr] = draggableId.split("-");
    const taskId = Number.parseInt(idStr);
    if (isNaN(taskId)) return;

    const targetColumn = destination.droppableId as ColumnId;

    // Get the current task to preserve its priority
    const currentTask = tasks.find(task => task.id === taskId);
    if (!currentTask) return;

    const previousStatus = currentTask.status;

    // Optimistic update: Update UI immediately
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId
          ? {
              ...task,
              status: targetColumn
            }
          : task
      )
    );

    console.log(`Task ${taskId} status optimistically updated to ${targetColumn}`);

    // Then update via API in the background
    try {
      await api.post('esg/task/update-task-status/', {
        json: {
          id: taskId,
          status: targetColumn,
          priority: currentTask.priority
        }
      });

      console.log(`Task ${taskId} status confirmed on server: ${targetColumn}`);
    } catch (error) {
      console.error('Error updating task status:', error);
      
      // Revert the optimistic update on error
      setTasks(prevTasks =>
        prevTasks.map(task =>
          task.id === taskId
            ? {
                ...task,
                status: previousStatus // Revert to previous status
              }
            : task
        )
      );

      // Show user-friendly error message
      console.warn(`Failed to update task ${taskId}. Reverted to ${previousStatus}`);
      // You could add a toast notification here
    }
  };

  const handleOpenTaskDetail = (taskId: number) => {
    setSelectedTaskId(taskId);
    setTaskDetailDialogOpen(true);
  };

  const handleCloseTaskDetail = () => {
    setTaskDetailDialogOpen(false);
    setSelectedTaskId(null);
  };

  const handleOpenAssignmentDialog = (taskId: number) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      setSelectedTaskId(taskId);
      setCurrentTaskForAssignment(task);
      setDialogOpen(true);
    }
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setDueDateDialogOpen(false);
    setTaskDetailDialogOpen(false);
    setSelectedEmployee(null);
    setSelectedDueDate('');
    setSelectedTaskId(null);
    setCurrentTaskForAssignment(null);
  };

  const handleAssignUser = async (employeeId: string, assignmentType: 'one-time' | 'recurring', dueDate: Date | null, monthlyDueDay: string, notes: string) => {
    if (!selectedTaskId || !employeeId) return;

    try {
      setLoading(true);
      
      // Prepare the payload for the assignment API
      const payload = {
        report_disclosure_id: selectedTaskId, // Using task ID as report_disclosure_id
        assigned_to: parseInt(employeeId),
        request_data: 'nothing',
        due_date: assignmentType === 'one-time' 
          ? (dueDate ? dueDate.toISOString().split('T')[0] : new Date().toISOString().split('T')[0])
          : `${new Date().getFullYear()}-${(new Date().getMonth() + 1).toString().padStart(2, '0')}-${monthlyDueDay.padStart(2, '0')}`,
        priority: 'medium',
        recurring_type: assignmentType === 'recurring',
        notes: notes || '',
        template: 1
      };

      console.log('Assigning task with payload:', payload);

      // Call the assignment API
      const response = await api.post('esg/api/assign-report-task/', {
        json: payload
      });
      
      console.log('Assignment response:', response);

      if (response) {
        // Update local state after successful API call
        const selectedUser = users.find(u => u.org_user_id === employeeId);
        setTasks(prevTasks =>
          prevTasks.map(task =>
            task.id === selectedTaskId
              ? {
                  ...task,
                  assigned_to: parseInt(employeeId),
                  assignedToName: selectedUser?.name || 'Unknown User',
                  due_date: assignmentType === 'one-time' ? (dueDate ? dueDate.toISOString().split('T')[0] : new Date().toISOString().split('T')[0]) : payload.due_date
                }
              : task
          )
        );
      }
      
    } catch (error) {
      console.error('Error assigning task:', error);
      alert('Error assigning task. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectDueDate = (date: string | Date) => {
    if (typeof date === 'string') {
      setSelectedDueDate(date);
    } else {
      // Format date as DD/MM/YYYY
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      setSelectedDueDate(`${day}/${month}/${year}`);
    }
  };

  const handleConfirmAssignment = () => {
    // Update both employee and due date
    if (selectedEmployee && selectedDueDate && selectedTaskId) {
      setTasks(prevTasks =>
        prevTasks.map(task =>
          task.id === selectedTaskId
            ? {
                ...task,
                assignedToName: selectedEmployee.name,
                due_date: selectedDueDate
              }
            : task
        )
      );
    }
    handleCloseDialog();
  };

  React.useEffect(() => {
    console.log("use efficet")
    const fetchReportingTask = async () => {
      if (!reportId) {
        setTasks([]);
        return;
      }

      // setLoading(true);
      try {
        const response: any = await api.get(`esg/task/report/${reportId}/tasks/`).json();
        console.log('response', response);
        setTasks(response);
      } catch (err) {
        console.error('Error fetching Reporting Task:', err);
      } finally {
        // setLoading(false);
      }
    };
    fetchReportingTask();

    // Cleanup pending debounced API calls on unmount
    return () => {
      pendingUpdates.current.forEach(timeout => clearTimeout(timeout));
      pendingUpdates.current.clear();
    };
  }, [reportId]);

  // Fetch internal users for assignment
  React.useEffect(() => {
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
      }
    };

    fetchInternalUsers();
  }, []);

  // Add priority change handler
  const handleChangePriority = async (taskId: number, newPriority: string) => {
    // Get the current task to preserve its status
    const currentTask = tasks.find(task => task.id === taskId);
    if (!currentTask) return;

    const previousPriority = currentTask.priority;

    // Optimistic update: Update UI immediately
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === taskId ? { ...task, priority: newPriority } : task
      )
    );

    console.log(`Task ${taskId} priority optimistically updated to ${newPriority}`);

    // Then update via API in the background
    try {
      await api.post('esg/task/update-task-status/', {
        json: {
          id: taskId,
          status: currentTask.status, // Keep current status
          priority: newPriority
        }
      });

      console.log(`Task ${taskId} priority confirmed on server: ${newPriority}`);
    } catch (error) {
      console.error('Error updating task priority:', error);
      
      // Revert the optimistic update on error
      setTasks(prevTasks => 
        prevTasks.map(task => 
          task.id === taskId ? { ...task, priority: previousPriority } : task
        )
      );

      console.warn(`Failed to update task ${taskId} priority. Reverted to ${previousPriority}`);
      // You could add a toast notification here
    }
  };

  // Add edit task handler
  const handleEditTask = (taskId: number, title: string, description: string) => {
    setTasks(prevTasks => prevTasks.map(task => (task.id === taskId ? { ...task, title, description, requested_data: description } : task)));
  };

  const taskContextValue = {
    tasks,
    setTasks,
    onChangePriority: handleChangePriority,
    onEditTask: handleEditTask
  };

  return (
    <TaskContext.Provider value={taskContextValue}>
      <SidebarHeader>
        <Box sx={{ width: '100%', mt: 2, height: 'calc(100vh - 100px)' }}>
          <Box sx={{ width: '100%', bgcolor: 'background.paper', borderRadius: 2, boxShadow: 'none', p: 1.5, mb: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography sx={{ fontSize: '17px' }}>Task Management</Typography>
              <IconButton onClick={() => setExpanded(!expanded)}>{expanded ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}</IconButton>
            </Box>
            <Collapse in={expanded}>
              <Typography variant="body2" color="text.secondary">
                Efficient task management helps teams stay organized, prioritize work, and meet deadlines effectively. By structuring tasks and workflows, organizations can improve productivity and ensure smoother collaboration. Please select the task management tools you want to use for better efficiency.
              </Typography>
            </Collapse>
          </Box>

          <DragDropContext onDragEnd={handleDragEnd}>
            <Grid container spacing={2} sx={{ height: 'calc(100% - 100px)' }}>
              {/* Not Started Column */}
              <Grid item xs={12} md={4} sx={{ height: '100%' }}>
                <Paper sx={{
                    p: 0,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: '10px',
                    bgcolor: '#76B8F612',
                    borderTop: '8px solid #76B8F6'
                  }}
                >
                  <Box
                    sx={{
                      p: 2,
                      borderTopLeftRadius: '8px',
                      borderTopRightRadius: '8px',
                      textAlign: 'center'
                    }}
                  >
                    <Typography variant="h6" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1 }}>
                      Not Started
                      <Chip
                        label={getColumnTasks('pending').length}
                        size="small"
                        sx={{
                          height: '20px',
                          bgcolor: '#76B8F6',
                          color: 'white',
                          fontWeight: 600,
                          fontSize: '0.75rem'
                        }}
                      />
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      p: 2,
                      flexGrow: 1,
                      overflow: 'hidden',
                      '& > div::-webkit-scrollbar': { display: 'none' },
                      '& > div': { scrollbarWidth: 'none', '-ms-overflow-style': 'none' }
                    }}
                  >
                    <StrictModeDroppable droppableId="pending">
                      {(provided: DroppableProvided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          style={{
                            minHeight: '200px',
                            height: '100%',
                            maxHeight: 'calc(100vh - 280px)',
                            overflowY: 'auto',
                            msOverflowStyle: 'none',
                            scrollbarWidth: 'none'
                          }}
                          className="hide-scrollbar"
                        >
                          <TaskList tasks={getColumnTasks('pending')} onOpenTaskDetail={handleOpenTaskDetail} />
                          {provided.placeholder}
                        </div>
                      )}
                    </StrictModeDroppable>
                  </Box>
                </Paper>
              </Grid>

              {/* Completed Column */}
              <Grid item xs={12} md={4} sx={{ height: '100%' }}>
                <Paper
                  sx={{
                    p: 0,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: '10px',
                    bgcolor: '#FCC21B24',
                    borderTop: '8px solid #FCC21B'
                  }}
                >
                  <Box
                    sx={{
                      p: 2,
                      borderTopLeftRadius: '8px',
                      borderTopRightRadius: '8px',
                      textAlign: 'center'
                    }}
                  >
                    <Typography variant="h6" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1 }}>
                      Completed
                      <Chip
                        label={getColumnTasks('in_progress').length}
                        size="small"
                        sx={{
                          height: '20px',
                          bgcolor: '#FCC21B',
                          color: 'white',
                          fontWeight: 600,
                          fontSize: '0.75rem'
                        }}
                      />
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      p: 2,
                      flexGrow: 1,
                      overflow: 'hidden',
                      '& > div::-webkit-scrollbar': { display: 'none' },
                      '& > div': { scrollbarWidth: 'none', '-ms-overflow-style': 'none' }
                    }}
                  >
                    <StrictModeDroppable droppableId="in_progress">
                      {(provided: DroppableProvided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          style={{
                            minHeight: '200px',
                            height: '100%',
                            maxHeight: 'calc(100vh - 280px)',
                            overflowY: 'auto',
                            msOverflowStyle: 'none',
                            scrollbarWidth: 'none'
                          }}
                        >
                          <TaskList tasks={getColumnTasks('in_progress')} onOpenTaskDetail={handleOpenTaskDetail} />
                          {provided.placeholder}
                        </div>
                      )}
                    </StrictModeDroppable>
                  </Box>
                </Paper>
              </Grid>

              {/* Completion Approved Column */}
              <Grid item xs={12} md={4} sx={{ height: '100%' }}>
                <Paper
                  sx={{
                    p: 0,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: '10px',
                    bgcolor: '#147C6524',
                    borderTop: '8px solid #147C65'
                  }}
                >
                  <Box
                    sx={{
                      p: 2,
                      borderTopLeftRadius: '8px',
                      borderTopRightRadius: '8px',
                      textAlign: 'center'
                    }}
                  >
                    <Typography variant="h6" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1 }}>
                      Completion approved
                      <Chip
                        label={getColumnTasks('completed').length}
                        size="small"
                        sx={{
                          height: '20px',
                          bgcolor: '#147C65',
                          color: 'white',
                          fontWeight: 600,
                          fontSize: '0.75rem'
                        }}
                      />
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      p: 2,
                      flexGrow: 1,
                      overflow: 'hidden',
                      '& > div::-webkit-scrollbar': { display: 'none' },
                      '& > div': { scrollbarWidth: 'none', '-ms-overflow-style': 'none' }
                    }}
                  >
                    <StrictModeDroppable droppableId="completed">
                      {(provided: DroppableProvided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          style={{
                            minHeight: '200px',
                            height: '100%',
                            maxHeight: 'calc(100vh - 280px)',
                            overflowY: 'auto',
                            msOverflowStyle: 'none',
                            scrollbarWidth: 'none'
                          }}
                        >
                          <TaskList tasks={getColumnTasks('completed')} onOpenTaskDetail={handleOpenTaskDetail} />
                          {provided.placeholder}
                        </div>
                      )}
                    </StrictModeDroppable>
                  </Box>
                </Paper>
              </Grid>
            </Grid>
          </DragDropContext>
        </Box>

        {/* User Assignment Dialog */}
        <UserAssignmentDialog 
          open={dialogOpen} 
          onClose={handleCloseDialog} 
          onAssign={handleAssignUser} 
          users={users}
          currentTask={currentTaskForAssignment}
        />

        {/* Task Detail Dialog */}
        <TaskDetailDialog 
          open={taskDetailDialogOpen} 
          onClose={handleCloseTaskDetail} 
          task={tasks.find(task => task.id === selectedTaskId) || null}
          onAssignUser={handleOpenAssignmentDialog}
        />

        {/* Due Date Selection Dialog */}
        <Dialog
          open={dueDateDialogOpen}
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: '12px',
              maxWidth: '600px',
              fontFamily: "'Inter', sans-serif",
              '& *': {
                fontFamily: "'Inter', sans-serif"
              }
            }
          }}
        >
          <Grid sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 2 }}>
            <DialogTitle
              sx={{
                fontWeight: 600,
                fontSize: '20px'
              }}
            >
              Select Due Date
            </DialogTitle>
          </Grid>

          <DialogContent sx={{ p: 0 }}>
            <TableContainer>
              <Table stickyHeader>
                <TableHead>
                  <TableRow sx={{ height: '40px', '& th': { borderBottom: '2px solid rgba(224, 224, 224, 1)', mb: 1 } }}>
                    <TableCell width="5%" />
                    <TableCell sx={{ fontWeight: 600, color: 'text.secondary', fontSize: '0.7rem', py: 1 }}>Employee Name</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: 'text.secondary', fontSize: '0.7rem', py: 1 }}>EMP ID</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: 'text.secondary', fontSize: '0.7rem', py: 1 }}>EMAIL ID</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {selectedEmployee && (
                    <TableRow
                      sx={{
                        borderBottom: '1px solid',
                        borderColor: 'divider'
                      }}
                    >
                      <TableCell padding="checkbox">
                        <Radio
                          checked={true}
                          disabled
                          sx={{
                            color: '#65558F',
                            '&.Mui-checked': {
                              color: '#65558F'
                            }
                          }}
                        />
                      </TableCell>
                      <TableCell>{selectedEmployee.name}</TableCell>
                      <TableCell>{selectedEmployee.empId}</TableCell>
                      <TableCell>{selectedEmployee.email}</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            <Box
              sx={{
                p: 3,
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                maxWidth: '500px'
              }}
            >
              <Typography
                variant="subtitle1"
                fontWeight={600}
                sx={{
                  width: '100px',
                  flexShrink: 0,
                  textTransform: 'capitalize'
                }}
              >
                Due Date:
              </Typography>

              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  value={
                    selectedDueDate
                      ? (() => {
                          // Parse the selected date if it's already in DD/MM/YYYY format
                          if (selectedDueDate.includes('/')) {
                            const [day, month, year] = selectedDueDate.split('/');
                            return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
                          }
                          return new Date(selectedDueDate);
                        })()
                      : null
                  }
                  onChange={newDate => {
                    if (newDate) {
                      // Convert to DD/MM/YYYY format directly
                      const day = newDate.getDate().toString().padStart(2, '0');
                      const month = (newDate.getMonth() + 1).toString().padStart(2, '0');
                      const year = newDate.getFullYear();
                      handleSelectDueDate(`${day}/${month}/${year}`);
                    }
                  }}
                  sx={{
                    flexGrow: 1,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '8px',
                      height: '48px',
                      boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
                      '& fieldset': {
                        borderColor: '#E2E8F0'
                      }
                    }
                  }}
                />
              </LocalizationProvider>
            </Box>

            <Box
              sx={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: 2,
                p: 2,
                backgroundColor: '#F8FAFC',
                mt: 10
              }}
            >
              <Button
                variant="outlined"
                onClick={handleCloseDialog}
                sx={{
                  borderRadius: '10px',
                  px: 4,
                  py: 1,
                  border: 'solid #373737',
                  color: '#373737',
                  textTransform: 'none',
                  fontWeight: 500
                }}
              >
                Back
              </Button>
              <Button
                variant="outlined"
                onClick={handleConfirmAssignment}
                disabled={!selectedDueDate}
                sx={{
                  borderRadius: '10px',
                  px: 4,
                  py: 1,
                  border: 'solid #147C65',
                  color: '#147C65',
                  textTransform: 'none',
                  fontWeight: 500,
                  bgcolor: 'white',
                  '&:hover': {
                    bgcolor: 'white',
                    opacity: 0.9
                  }
                }}
              >
                Assign
              </Button>
            </Box>
          </DialogContent>
        </Dialog>
      </SidebarHeader>
    </TaskContext.Provider>
  );
};

export default ReportingTaskManagement;
