import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import UploadPage from './components/Upload/UploadPage';
import DownloadPage from './components/Download/DownloadPage';

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