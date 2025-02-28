import React, { useState } from 'react';
import {
  Paper,
  Typography,
  Button,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import axios from 'axios';
import { UploadResponse } from '../../types';

const UploadPage: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [shareLink, setShareLink] = useState<string>('');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFiles(Array.from(event.target.files));
    }
  };

  const handleUpload = async () => {
    if (files.length === 0) return;
    setUploading(true);
    const formData = new FormData();
    files.forEach((file) => formData.append('files', file));

    try {
      const response = await axios.post<UploadResponse>('/upload', formData, {
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setProgress(percentCompleted);
          }
        },
      });
      const uploadId = response.data.id;
      setShareLink(`${window.location.origin}/download/${uploadId}`);
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Paper elevation={3} style={{ padding: '20px', maxWidth: '600px', margin: '20px auto' }}>
      <Typography variant="h5" gutterBottom>
        Upload Files to WeShare
      </Typography>
      <Button variant="contained" component="label" sx={{ mb: 2 }}>
        Select Files
        <input type="file" multiple hidden onChange={handleFileChange} />
      </Button>
      <Button
        variant="contained"
        color="primary"
        onClick={handleUpload}
        disabled={uploading || files.length === 0}
        sx={{ ml: 2 }}
      >
        Upload
      </Button>
      {files.length > 0 && (
        <List dense>
          {files.map((file, index) => (
            <ListItem key={index}>
              <ListItemText primary={file.name} />
            </ListItem>
          ))}
        </List>
      )}
      {uploading && (
        <LinearProgress variant="determinate" value={progress} sx={{ mt: 2 }} />
      )}
      {shareLink && (
        <Typography variant="body1" sx={{ mt: 2 }}>
          Share Link:{' '}
          <a href={shareLink} target="_blank" rel="noopener noreferrer">
            {shareLink}
          </a>
        </Typography>
      )}
    </Paper>
  );
};

export default UploadPage;