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

// Define the response type for the upload API
interface UploadResponse {
  id: string;
}

const UploadPage: React.FC = () => {
  // State definitions
  const [files, setFiles] = useState<File[]>([]); // List of selected files
  const [uploading, setUploading] = useState<boolean>(false); // Upload status
  const [progress, setProgress] = useState<number>(0); // Upload progress
  const [shareLink, setShareLink] = useState<string>(''); // Generated share link

  // Handle file drops and selections
  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles((prevFiles) => [...prevFiles, ...acceptedFiles]); // Append new files
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  // Remove a specific file by index
  const removeFile = (index: number) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };
  // Function to determine if a file is an image based on its extension
  const isImage = (file: File) => /\.(jpg|jpeg|png|gif|bmp|svg)$/i.test(file.name);

  // Handle file upload to the server
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
      {/* Dropzone area */}
      <div
        {...getRootProps()}
        style={{ border: '2px dashed #ccc', padding: '20px', textAlign: 'center' }}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <Typography>Drop the files here...</Typography>
        ) : (
          <Typography>Drag 'n' drop some files here, or click to select files</Typography>
        )}
      </div>
      {/* File list with remove buttons */}
      {files.length > 0 && (
        <div style={{ marginTop: '20px' }}>
          <Button onClick={() => setFiles([])} disabled={uploading}>
            Clear All
          </Button>
          <List dense>
            {files.map((file, index) => (
              <ListItem
                key={index}
                secondaryAction={
                  <Button
                    
                    onClick={() => removeFile(index)}
                    disabled={uploading}
                  >
                    Remove
                  </Button>
                }
              >
                {file.type.startsWith('image/') && (
                  <img
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                    style={{ maxWidth: '100px', maxHeight: '100px', marginRight: '10px' }}
                  />
                )}
                <ListItemText primary={file.name} />
              </ListItem>
            ))}
          </List>
        </div>
      )}
      {/* Upload button */}
      <Button
        variant="contained"
        color="primary"
        onClick={handleUpload}
        disabled={uploading }
        sx={{ mt: 2 }}
      >
        Upload
      </Button>
      {/* Progress bar */}
      {uploading && (
        <LinearProgress variant="determinate" value={progress} sx={{ mt: 2 }} />
      )}
      {/* Share link */}
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
/*    <Button
variant="contained"
color="primary"
onClick={handleUpload}
disabled={uploading || files.length === 0}
sx={{ mt: 2 }}
>
Upload
</Button>*/