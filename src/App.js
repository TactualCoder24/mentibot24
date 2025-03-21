import React, { useState } from 'react';
import { 
  Container, 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Paper,
  Grid,
  ThemeProvider,
  createTheme,
  CssBaseline,
  CircularProgress,
  Snackbar,
  Alert,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Divider
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import HomeIcon from '@mui/icons-material/Home';
import ExploreIcon from '@mui/icons-material/Explore';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import AddIcon from '@mui/icons-material/Add';
import { alpha } from '@mui/material/styles';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Create custom dark theme
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#10A37F',
    },
    secondary: {
      main: '#2D3748',
    },
    background: {
      default: '#000000',
      paper: '#111111',
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#A0AEC0',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h3: {
      fontWeight: 600,
      fontSize: '2rem',
      color: '#FFFFFF',
    },
    subtitle1: {
      fontSize: '1.1rem',
      color: '#A0AEC0',
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.7,
      color: '#E2E8F0',
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#000000',
          scrollbarWidth: 'thin',
          '&::-webkit-scrollbar': {
            width: '6px',
          },
          '&::-webkit-scrollbar-track': {
            background: '#111111',
          },
          '&::-webkit-scrollbar-thumb': {
            background: '#2D3748',
            borderRadius: '3px',
          },
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#111111',
          borderRight: '1px solid #2D3748',
          width: 240,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: '#111111',
          borderRadius: 12,
          border: '1px solid #2D3748',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          fontSize: '0.95rem',
          fontWeight: 500,
          padding: '8px 16px',
          backgroundColor: '#10A37F',
          '&:hover': {
            backgroundColor: '#0E906F',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            backgroundColor: '#111111',
            borderRadius: 12,
            border: '1px solid #2D3748',
            '&:hover': {
              borderColor: '#4A5568',
            },
            '&.Mui-focused': {
              borderColor: '#10A37F',
              boxShadow: '0 0 0 2px rgba(16, 163, 127, 0.2)',
            },
            '& fieldset': {
              border: 'none',
            },
          },
        },
      },
    },
  },
});

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [apiKey, setApiKey] = useState(localStorage.getItem('gemini-api-key') || '');

  const handleApiKeyChange = (event) => {
    const newKey = event.target.value;
    setApiKey(newKey);
    localStorage.setItem('gemini-api-key', newKey);
  };

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { text: input, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    setError(null);

    try {
      const result = await model.generateContent(input);
      const response = await result.response;
      const text = response.text();
      const assistantMessage = { text, sender: 'assistant' };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      console.error('API Error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const drawerItems = [
    { text: 'New Thread', icon: <AddIcon />, shortcut: 'Ctrl + T' },
    { text: 'Home', icon: <HomeIcon /> },
    { text: 'Discover', icon: <ExploreIcon /> },
    { text: 'Library', icon: <LibraryBooksIcon /> },
  ];

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex' }}>
        <Drawer
          variant="permanent"
          sx={{
            width: 240,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: 240,
              boxSizing: 'border-box',
            },
          }}
        >
          <Box sx={{ p: 2 }}>
            <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
              MUN Assistant
            </Typography>
          </Box>
          <List>
            {drawerItems.map((item, index) => (
              <React.Fragment key={item.text}>
                <ListItem 
                  button
                  sx={{
                    borderRadius: 2,
                    mx: 1,
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.08)',
                    },
                  }}
                >
                  <ListItemIcon sx={{ color: 'text.secondary' }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText 
                    primary={item.text} 
                    secondary={item.shortcut}
                    primaryTypographyProps={{ 
                      sx: { color: 'text.primary' }
                    }}
                    secondaryTypographyProps={{ 
                      sx: { color: 'text.secondary' }
                    }}
                  />
                </ListItem>
                {index === 0 && <Divider sx={{ my: 1, borderColor: '#2D3748' }} />}
              </React.Fragment>
            ))}
            <ListItem 
              button
              sx={{
                borderRadius: 2,
                mx: 1,
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                },
              }}
            >
              <ListItemIcon sx={{ color: 'text.secondary' }}>
                <LightbulbIcon />
              </ListItemIcon>
              <ListItemText 
                primary="Settings" 
                primaryTypographyProps={{ 
                  sx: { color: 'text.primary' }
                }}
              />
            </ListItem>
            <ListItem 
              button
              sx={{
                borderRadius: 2,
                mx: 1,
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                },
              }}
            >
              <ListItemIcon sx={{ color: 'text.secondary' }}>
                <LightbulbIcon />
              </ListItemIcon>
              <ListItemText 
                primary="API Key" 
                primaryTypographyProps={{ 
                  sx: { color: 'text.primary' }
                }}
              />
              <TextField
                value={apiKey}
                onChange={handleApiKeyChange}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: '#111111',
                  }
                }}
              />
            </ListItem>
          </List>
        </Drawer>

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            minHeight: '100vh',
            backgroundColor: 'background.default',
            p: 3,
            ml: '240px',
          }}
        >
          <Container maxWidth="lg" sx={{ height: '100%' }}>
            {messages.length === 0 ? (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: 'calc(100vh - 200px)',
                }}
              >
                <Typography variant="h3" gutterBottom align="center">
                  What do you want to know?
                </Typography>
                <Typography variant="subtitle1" align="center" sx={{ mb: 4 }}>
                  Ask anything about Model UN speeches and debates
                </Typography>
              </Box>
            ) : (
              <Box sx={{ mb: 4 }}>
                {messages.map((message, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: 'flex',
                      justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start',
                      mb: 3,
                    }}
                  >
                    <Paper
                      elevation={0}
                      sx={{
                        p: 2,
                        maxWidth: '80%',
                        backgroundColor: message.sender === 'user' 
                          ? '#10A37F'
                          : '#1A1A1A',
                        borderRadius: 2,
                      }}
                    >
                      <Typography variant="body1">
                        {message.text}
                      </Typography>
                    </Paper>
                  </Box>
                ))}
                {loading && (
                  <Box display="flex" justifyContent="center" p={2}>
                    <CircularProgress size={24} sx={{ color: '#10A37F' }} />
                  </Box>
                )}
              </Box>
            )}

            <Box
              sx={{
                position: 'fixed',
                bottom: 0,
                left: 240,
                right: 0,
                p: 3,
                backgroundColor: 'background.default',
                borderTop: '1px solid #2D3748',
              }}
            >
              <Container maxWidth="lg">
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <TextField
                    fullWidth
                    placeholder="Ask about MUN speeches, debate strategies, or global issues..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    disabled={loading}
                    multiline
                    maxRows={4}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: '#111111',
                      }
                    }}
                  />
                  <Button
                    variant="contained"
                    onClick={handleSend}
                    disabled={loading || !input.trim()}
                    sx={{
                      minWidth: '100px',
                      height: '56px',
                    }}
                  >
                    {loading ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : (
                      <SendIcon />
                    )}
                  </Button>
                </Box>
              </Container>
            </Box>
          </Container>
        </Box>

        <Snackbar 
          open={!!error} 
          autoHideDuration={6000} 
          onClose={() => setError(null)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert 
            onClose={() => setError(null)} 
            severity="error" 
            sx={{ 
              width: '100%',
              backgroundColor: '#FF4444',
              color: 'white'
            }}
          >
            {error}
          </Alert>
        </Snackbar>
      </Box>
    </ThemeProvider>
  );
}

export default App; 