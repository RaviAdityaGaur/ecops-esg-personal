import React, { useEffect, useState } from 'react';
import {
  Box,
  CssBaseline,
  ThemeProvider,
  createTheme,
  AppBar,
  Avatar,
  IconButton,
  Stack,
  Toolbar,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
} from '@mui/material';
import {
  ArrowDropDown,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import EcopsImage from '../assets/EcopLogo.png';
import NotificationIcon from "../assets/notification.png";
import MaterialityAssessmentIcon from "../assets/graph.png";
import ReportsIcon from "../assets/chart-square.png";
import DataWarehouseIcon from "../assets/empty-wallet.png";
import CalendarIcon from "../assets/calendar.png";
import SettingIcon from "../assets/setting-2.png";
import { useAuth } from '../services/AuthContext';

const DRAWER_WIDTH = 220;  // reduced from 220 to 200

// Define the initial menu items with the survey item having a badge
const getInitialMenuItems = (showNewBadge) => [
  { 
    title: 'Reporting Period', 
    icon: CalendarIcon,
    hasDropdown: true,
    subItems: [
      { title: '- Add Reporting Period', path: '/reporting-period' },
      { title: '- List Reporting Periods', path: '/list-reporting-period' }
    ]
  },
  { title: 'Dashboard', icon: MaterialityAssessmentIcon },
  { title: 'Materiality Assessment', icon: MaterialityAssessmentIcon },
  { 
    title: 'Reports', 
    icon: ReportsIcon,
    hasDropdown: true,
    subItems: [
      { title: '- Create Report', path: '/reports' },
      { title: '- View Report', path: '/view-reports' }
    ]
  },
  { title: 'Configure Report', icon: DataWarehouseIcon }, // Remove the path property
  { title: 'Task Management', icon: DataWarehouseIcon },
  { title: 'Surveys', icon: DataWarehouseIcon, badge: showNewBadge ? 'new' : null },
];

interface SidebarHeaderProps {
  children?: React.ReactNode;
}

const SidebarHeader: React.FC<SidebarHeaderProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userGroups, isLoading, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [username, setUsername] = useState<string>('');
  const open = Boolean(anchorEl);
  
  // Add state to track whether to show the "new" badge
  const [showSurveyBadge, setShowSurveyBadge] = useState<boolean>(true);
  
  // Create a state for the menu items that can be updated
  const [menuItems, setMenuItems] = useState(getInitialMenuItems(true));

  useEffect(() => {
    const authData = localStorage.getItem('auth');
    if (authData) {
      const parsedAuth = JSON.parse(authData);
      if (parsedAuth.user && parsedAuth.user.username) {
        setUsername(parsedAuth.user.username);
      }
    }
    
    // Check if the survey badge has been seen before
    const surveyBadgeSeen = localStorage.getItem('surveyBadgeSeen') === 'true';
    setShowSurveyBadge(!surveyBadgeSeen);
    
    // Update menu items based on the badge state
    setMenuItems(getInitialMenuItems(!surveyBadgeSeen));
  }, []);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    handleClose();
    await logout();
    // Remove navigate call since we're using window.location.href in the logout function
  };

  // Add debug logging
  useEffect(() => {
    console.log('Current userGroups:', userGroups);
  }, [userGroups]);

  // Modified hasAccess function with debug logging
  const hasAccess = () => {
    console.log('Checking access with groups:', userGroups);
    if (isLoading) {
      console.log('Still loading...');
      return false;
    }
    
    const hasSustainabilityAccess = userGroups.some(group => 
      group === 'SUSTAINBILITY_MANAGER_ADMIN'  // Changed to exact match
    );
    console.log('Has sustainability access:', hasSustainabilityAccess);
    return hasSustainabilityAccess;
  };

  // Filter menu items based on permissions
  const visibleMenuItems = hasAccess() ? menuItems : [];

  // Initialize activeItem based on current path
  const [activeItem, setActiveItem] = useState(() => {
    const path = location.pathname;
    switch(path) {
      case '/esg-reporting':
        return 'Materiality Assessment';
      case '/dashboard':
        return 'Dashboard';
      case '/reports':
        return '- Create Report';
      case '/view-reports':
        return '- View Report';
      case '/task-management':
        return 'Task Management';
      case '/choose-standard':
        return 'Choose Standard';
      case '/choose-sector':
        return 'Choose Sectors';
      case '/surveys':
        return 'Surveys';
      default:
        return '';
    }
  });
//case '/reporting-period': 156
    //    return '- Add Reporting Period';
    //  case '/list-reporting-period':
     //   return '- List Reporting Periods';

  // Function to handle clicking on the Surveys tab
  const handleSurveyClick = () => {
    // Hide the badge
    setShowSurveyBadge(false);
    // Save to localStorage so it remains hidden after navigation
    localStorage.setItem('surveyBadgeSeen', 'true');
    
    // Update menu items to remove badge
    setMenuItems(prev => 
      prev.map(item => 
        item.title === 'Surveys' 
          ? { ...item, badge: null } 
          : item
      )
    );
    
    // Navigate to surveys page
    navigate('/surveys');
  };

  // Update activeItem when location changes
  useEffect(() => {
  const path = location.pathname;
  switch(path) {
    case '/esg-reporting':
      setActiveItem('Materiality Assessment');
      break;
    case '/dashboard':
      setActiveItem('Dashboard');
      break;
    case '/reports':
      setActiveItem('- Create Report');
      // Auto-expand Reports dropdown
      setExpandedItems(prev => prev.includes('Reports') ? prev : [...prev, 'Reports']);
      break;
    case '/view-reports':
      setActiveItem('- View Report');
      // Auto-expand Reports dropdown
      setExpandedItems(prev => prev.includes('Reports') ? prev : [...prev, 'Reports']);
      break;
    case '/configure-report':
      setActiveItem('Configure Report');
      break;
    case '/task-management':
      setActiveItem('Task Management');
      break;
    case '/choose-standard':
      setActiveItem('Choose Standard');
      break;
    case '/choose-sector':
      setActiveItem('Choose Sectors');
      break;
    case '/':
      navigate('/dashboard');
      break;
  }
}, [location.pathname, navigate]);

//case '/reporting-period': 221
  //    setActiveItem('- Add Reporting Period');
      // Auto-expand Reporting Period dropdown
    //  setExpandedItems(prev => prev.includes('Reporting Period') ? prev : [...prev, 'Reporting Period']);
    //  break;
   // case '/list-reporting-period':
   //   setActiveItem('- List Reporting Periods');
     // Auto-expand Reporting Period dropdown
   //   setExpandedItems(prev => prev.includes('Reporting Period') ? prev : [...prev, 'Reporting Period']);
    //  break;
//
  // Create a theme
  const theme = createTheme({
    palette: {
      mode: 'light',
      background: {
        default: '#f4f6f8',
        paper: '#ffffff'
      }
    }
  });

  // Add new state for expanded items
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  // Add toggle function for dropdown
  const handleDropdownToggle = (title: string) => {
    setExpandedItems(prev => 
      prev.includes(title) 
        ? prev.filter(item => item !== title) 
        : [...prev, title]
    );
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', minHeight: '100vh' }}>
        {/* Sidebar */}
        <Drawer
          variant="permanent"
          sx={{
            width: DRAWER_WIDTH,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: DRAWER_WIDTH,
              boxSizing: 'border-box',
              borderRight: 'none'
            }
          }}
        >
          <Box sx={{ p: 2, display: 'flex', justifyContent: 'center' }}>  {/* reduced padding from 3 to 2 */}
            <img
              src={EcopsImage}
              alt="ECOPS Logo"
              style={{
                width: '140px',  // reduced from 155px
                height: '55px'   // reduced from 65px
              }}
            />
          </Box>

          <List sx={{ px: 1.5 }}>  {/* reduced padding from 2 to 1.5 */}
            <ListItem sx={{ pb: 1.5 }}>  {/* reduced padding bottom */}
              <Typography sx={{fontSize: "10px !important"}} color="#7B8190">  {/* reduced from 12px to 10px */}
                MAIN
              </Typography>
            </ListItem>
            {visibleMenuItems.map((item) => (
              <React.Fragment key={item.title}>
                <ListItem disablePadding>
                  <ListItemButton
                    onClick={() => {
    if (item.hasDropdown) {
      handleDropdownToggle(item.title);
    } else {
      setActiveItem(item.title);
      if (item.title === 'Dashboard') {
        navigate('/dashboard');
      } else if (item.title === 'Configure Report') {
        navigate('/configure-report');
      } else if (item.title === 'Task Management') {
        navigate('/task-management');
      } else if (item.title === 'Materiality Assessment') {
        navigate('/esg-reporting');
      } else if (item.title === 'Choose Sectors') {
        navigate('/choose-sector');
      } else if (item.title === 'Surveys') {
        handleSurveyClick();
      } else if (item.title === 'Reporting Period') {
        navigate('/reporting-period');
      }
    }
  }}
                  >
                    <ListItemIcon sx={{
                      minWidth: 32,  // reduced from 40
                      ...(activeItem === item.title ? { color: 'white' } : {})
                    }}>
                      <img 
                        src={item.icon} 
                        alt={`${item.title} icon`} 
                        style={{ width: '16px', height: '16px' }} 
                      />
                    </ListItemIcon>
                    <ListItemText 
                      primary={item.title} 
                      primaryTypographyProps={{
                        sx: {
                          fontSize: '0.75rem',  
                        }
                      }}
                    />
                    {item.badge && (
                      <Box
                        sx={{
                          backgroundColor: 'rgba(16, 185, 129, 0.1)',
                          color: 'rgb(16, 185, 129)',
                          borderRadius: '4px',
                          padding: '1px 2px',  
                          fontSize: '0.6rem',  
                          marginLeft: 'auto',
                        }}
                      >
                        {item.badge}
                      </Box>
                    )}
                    {item.hasDropdown && (
                      <ArrowDropDown 
                        sx={{ 
                          marginLeft: 'auto', 
                          fontSize: '1rem',
                          transform: expandedItems.includes(item.title) ? 'rotate(180deg)' : 'rotate(0deg)',
                          transition: 'transform 0.3s ease-in-out'
                        }} 
                      />
                    )}
                  </ListItemButton>
                </ListItem>
                {item.hasDropdown && item.subItems && (
                  <List 
                    sx={{ 
                      pl: 4,
                      overflow: 'hidden',
                      transition: 'max-height 0.3s ease-in-out',
                      maxHeight: expandedItems.includes(item.title) ? '200px' : '0px',
                      opacity: expandedItems.includes(item.title) ? 1 : 0,
                    }}
                  >
                    {item.subItems.map((subItem) => (
                      <ListItem key={subItem.title} disablePadding>
                        <ListItemButton
                          onClick={() => {
                            setActiveItem(subItem.title);
                            navigate(subItem.path);
                          }}
                          sx={{
                            borderRadius: '8px',
                            mb: 0.5,
                            py: 0.1,
                            ...(activeItem === subItem.title && {
                              backgroundColor: '#147C65',
                              color: 'white',
                              '&:hover': {
                                backgroundColor: '#5CA7A0',
                              },
                            }),
                          }}
                        >
                          <ListItemText 
                            primary={subItem.title}
                            primaryTypographyProps={{
                              sx: { 
                                fontSize: '0.65rem', 
                                fontWeight: activeItem === subItem.title ? 500 : 400
                              }
                            }}
                          />
                        </ListItemButton>
                      </ListItem>
                    ))}
                  </List>
                )}
              </React.Fragment>
            ))}
          </List>

          <List sx={{ px: 1.5, mt: 1 }}>  {/* reduced mt from 1.5 to 1 */}
            <ListItem sx={{ pb: 1.5 }}>
              <Typography sx={{fontSize: "10px !important"}} color="#7B8190">  {/* reduced from 12px to 10px */}
                SETTINGS
              </Typography>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton
                sx={{
                  borderRadius: '8px',
                  ml: 0.5,  // reduced from 1
                  py: 0.5,  // add smaller vertical padding
                }}
              >
                <ListItemIcon sx={{ minWidth: 32 }}>
                  <img 
                    src={SettingIcon}
                    alt="Settings" 
                    style={{ width: '16px', height: '16px' }}
                  />
                </ListItemIcon>
                <ListItemText 
                  primary="My Profile" 
                  primaryTypographyProps={{
                    sx: {
                      fontSize: '0.75rem',  // reduced from 0.8rem
                    }
                  }}
                />
              </ListItemButton>
            </ListItem>
          </List>
        </Drawer>

        {/* Sidebar Header */}
        <AppBar
          position="fixed"
          color="default"
          elevation={0}

          sx={{
            width: `calc(100% - ${DRAWER_WIDTH}px)`,
            ml: `${DRAWER_WIDTH}px`,
            bgcolor: 'background.paper',
            '& .MuiToolbar-root': {  // Add this to force toolbar height
              minHeight: '48px !important',
              height: '48px !important'
            }
          }}
        >
          <Toolbar>
            <Box sx={{ flexGrow: 1 }}/>

            <Stack direction="row" spacing={1.5} alignItems="center">
              <IconButton 
                size="small"
                sx={{
                  backgroundColor: "rgba(100, 116, 139, 0.1)",
                  width: '28px',
                  height: '28px'
                }}
              >
                <img src={NotificationIcon} style={{width: "16px", height: "16px"}}/>
              </IconButton>

              <Stack direction="row" spacing={1} alignItems="center">
                <Box
                  onClick={handleClick}
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    cursor: 'pointer'
                  }}
                >
                  <Avatar
                    src="/placeholder.svg"
                    alt={username}
                    sx={{ width: 28, height: 28 }}
                  />
                  <Box sx={{ display: { xs: 'none', md: 'block' } }}>
                    <Stack direction="row" alignItems="center" spacing={0.5}>
                      <Typography variant="subtitle2" sx={{ fontSize: '0.875rem', px: 1 }}>
                        {username}
                      </Typography>
                      <ArrowDropDown sx={{ color: 'text.secondary', fontSize: '1.2rem' }} />
                    </Stack>
                  </Box>
                </Box>
                <Menu
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleClose}
                  onClick={handleClose}
                  transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                  anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                >
                  <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </Menu>
              </Stack>
            </Stack>
          </Toolbar>
        </AppBar>

        {/* Main Content Area */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            bgcolor: 'grey.100',
            minHeight: '90vh',  // Changed from height to minHeight
            height: 'auto',     // Added to allow content to expand naturally
            padding: "60px 20px 20px 20px",
            width: `calc(98.5vw - ${DRAWER_WIDTH}px)`,
            overflow: 'auto',   // Added to handle overflow content properly
          }}
        >
          {children}
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default SidebarHeader;
