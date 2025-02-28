import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme'; // Adjust the path if necessary
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import UploadPage from './components/Upload/UploadPage'; // Example component
import DownloadPage from './components/Download/DownloadPage'; // Example component

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