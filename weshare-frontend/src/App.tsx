import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import UploadPage from './components/Upload/UploadPage';
import DownloadPage from './components/Download/DownloadPage';

const theme = createTheme();

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Routes>
          <Route path="/" element={<UploadPage />} />
          <Route path="/download/:id" element={<DownloadPage />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;