import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
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

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles(acceptedFiles);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

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
    <Paper elevation={3} style={{ padding: '20px', margin: '20px 0' }}>
      <Typography variant="h5" gutterBottom>
        Upload Files to WeShare
      </Typography>
      <div {...getRootProps()} style={{ border: '2px dashed #ccc', padding: '20px', textAlign: 'center' }}>
        <input {...getInputProps()} />
        {isDragActive ? (
          <Typography>Drop the files here...</Typography>
        ) : (
          <Typography>Drag 'n' drop some files here, or click to select files</Typography>
        )}
      </div>
      <Button
        variant="contained"
        color="primary"
        onClick={handleUpload}
        disabled={uploading || files.length === 0}
        sx={{ mt: 2 }}
      >
        Upload
      </Button>
      {files.length > 0 && (
        <div style={{ marginTop: '20px' }}>
          <Typography variant="h6">Selected Files:</Typography>
          <List dense>
            {files.map((file, index) => (
              <ListItem key={index}>
                {file.type.startsWith('image/') ? (
                  <img
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                    style={{ maxWidth: '100px', maxHeight: '100px', marginRight: '10px' }}
                  />
                ) : (
                  <Typography variant="body2">{file.name}</Typography>
                )}
                <ListItemText primary={file.name} />
              </ListItem>
            ))}
          </List>
        </div>
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