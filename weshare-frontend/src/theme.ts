import { createTheme } from '@mui/material/styles';

// Define the custom theme
const theme = createTheme({
  // Color palette
  palette: {
    primary: {
      main: '#1976d2', // Professional blue for primary actions (e.g., buttons, links)
      contrastText: '#ffffff', // White text on primary color for contrast
    },
    secondary: {
      main: '#dc004e', // Vibrant red for accents or highlights
      contrastText: '#ffffff',
    },
    background: {
      default: '#f5f5f5', // Light gray background for the app
      paper: '#ffffff', // White background for cards, papers, etc.
    },
    text: {
      primary: '#333333', // Dark gray for primary text
      secondary: '#666666', // Lighter gray for secondary text
    },
    error: {
      main: '#d32f2f', // Red for errors
    },
    success: {
      main: '#2e7d32', // Green for success messages
    },
  },
  // Typography settings
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif', // Clean, modern font
    h1: {
      fontSize: '2.5rem',
      fontWeight: 500,
      lineHeight: 1.2,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 500,
      lineHeight: 1.3,
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 500,
      lineHeight: 1.4,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.5,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.43,
    },
    button: {
      textTransform: 'none', // Disable uppercase transformation for buttons
    },
  },
  // Spacing unit (used for margins, paddings, etc.)
  spacing: 8, // Default spacing unit is 8px
  // Responsive breakpoints
  breakpoints: {
    values: {
      xs: 0, // Extra small devices (phones)
      sm: 600, // Small devices (tablets)
      md: 960, // Medium devices (laptops)
      lg: 1280, // Large devices (desktops)
      xl: 1920, // Extra large devices (large desktops)
    },
  },
  // Customize default props or styles for specific components
  components: {
    MuiButton: {
      defaultProps: {
        variant: 'contained', // Default to contained buttons for a modern look
      },
      styleOverrides: {
        root: {
          borderRadius: 8, // Slightly rounded buttons
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12, // Rounded corners for paper components
        },
      },
    },
  },
});

export default theme;