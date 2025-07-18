import React, { useState } from 'react';
import { Box, Typography, Paper, List, ListItem, ListItemText, Chip, Grid, IconButton, Collapse, Dialog, DialogTitle, DialogContent, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Radio, Button, InputAdornment } from '@mui/material';
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
interface Employee {
  id: number;
  name: string;
  empId: string;
  email: string;
}

interface UserAssignmentDialogProps {
  open: boolean;
  onClose: () => void;
  onAssign: (employee: Employee | null) => void;
}

const employees: Employee[] = [
  { id: 1, name: 'Anish Singh', empId: '1021', email: 'anishsingh05@gmail.com' },
  { id: 2, name: 'Jayesh Singh', empId: '1021', email: 'anishsingh05@gmail.com' },
  { id: 3, name: 'Sh', empId: '1021', email: 'anishsingh05@gmail.com' },
  { id: 4, name: 'Vaibhav Singh', empId: '1021', email: 'anishsingh05@gmail.com' },
  { id: 5, name: 'Anish Singh', empId: '1021', email: 'anishsingh05@gmail.com' }
];

const UserAssignmentDialog: React.FC<UserAssignmentDialogProps> = ({ open, onClose, onAssign }) => {
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const handleSelectEmployee = (employee: Employee) => {
    setSelectedEmployee(employee);
  };

  const handleAssign = () => {
    onAssign(selectedEmployee);
    // We don't close the dialog here anymore as we'll show the due date dialog next
    // The main component handles the dialog visibility now
  };

  const filteredEmployees = employees.filter(employee => employee.name.toLowerCase().includes(searchQuery.toLowerCase()) || employee.empId.includes(searchQuery) || employee.email.toLowerCase().includes(searchQuery.toLowerCase()));

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
          fontFamily: "'Inter', sans-serif", // Add Inter font to all dialog content
          '& *': {
            // This will apply to all elements inside the dialog
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
          Assign to
        </DialogTitle>

        <Box sx={{ mr: 2, flexGrow: 0.5 }}>
          <TextField
            fullWidth
            placeholder="Search Emp ID or Name"
            variant="outlined"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <SearchIcon sx={{ color: 'text.secondary' }} />
                </InputAdornment>
              ),
              sx: {
                borderRadius: '100px',
                bgcolor: 'background.paper',
                height: '36px',
                boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
                '& fieldset': {
                  borderColor: '#E2E8F0'
                },
                '&:hover fieldset': {
                  borderColor: '#E2E8F0'
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#E2E8F0 !important',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
                },
                '& .MuiOutlinedInput-input': {
                  // Reduced padding
                }
              }
            }}
          />
        </Box>
      </Grid>

      <DialogContent sx={{ p: 0 }}>
        <TableContainer sx={{ maxHeight: '400px' }}>
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
              {filteredEmployees.map(employee => (
                <TableRow
                  key={employee.id}
                  hover
                  onClick={() => handleSelectEmployee(employee)}
                  sx={{
                    cursor: 'pointer',
                    borderBottom: '1px solid',
                    borderColor: 'divider'
                  }}
                >
                  <TableCell padding="checkbox">
                    <Radio
                      checked={selectedEmployee?.id === employee.id}
                      onChange={() => handleSelectEmployee(employee)}
                      sx={{
                        color: '#65558F',
                        '&.Mui-checked': {
                          color: '#65558F'
                        }
                      }}
                    />
                  </TableCell>
                  <TableCell>{employee.name}</TableCell>
                  <TableCell>{employee.empId}</TableCell>
                  <TableCell>{employee.email}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

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
            Back
          </Button>
          <Button
            variant="outlined"
            onClick={handleAssign}
            disabled={!selectedEmployee}
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
            Next
          </Button>
        </Box>
      </DialogContent>
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
}

const TaskDetailDialog: React.FC<TaskDetailDialogProps> = ({ open, onClose, task }) => {
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
              Assign to User
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
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [selectedDueDate, setSelectedDueDate] = useState<string>('');

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

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setDueDateDialogOpen(false);
    setTaskDetailDialogOpen(false);
    setSelectedEmployee(null);
    setSelectedDueDate('');
    setSelectedTaskId(null);
  };

  const handleAssignUser = (employee: Employee | null) => {
    if (employee && selectedTaskId) {
      setSelectedEmployee(employee);
      // Instead of updating the task right away, show the due date dialog
      setDialogOpen(false);
      setDueDateDialogOpen(true);
    } else {
      handleCloseDialog();
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
        <UserAssignmentDialog open={dialogOpen} onClose={handleCloseDialog} onAssign={handleAssignUser} />

        {/* Task Detail Dialog */}
        <TaskDetailDialog 
          open={taskDetailDialogOpen} 
          onClose={handleCloseTaskDetail} 
          task={tasks.find(task => task.id === selectedTaskId) || null}
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
