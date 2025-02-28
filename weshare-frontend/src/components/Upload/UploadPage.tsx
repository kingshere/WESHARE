import React, { useState, useCallback, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import {
  Paper,
  Typography,
  Button,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  TextField,
} from '@mui/material';
import axios from 'axios';

// Define the response type for the upload API
interface UploadResponse {
  id: string;
}

const UploadPage: React.FC = () => {
  // State definitions
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [shareLink, setShareLink] = useState('');
  const [recipientEmail, setRecipientEmail] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle file drops and selections
  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);
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

  // Send share link via email
  const sendShareLinkViaEmail = async () => {
    if (!recipientEmail || !shareLink) return;

    try {
      await axios.post('/send-email', {
        email: recipientEmail,
        link: shareLink,
      });
      alert('Share link sent successfully!');
    } catch (error) {
      console.error('Failed to send email:', error);
      alert('Failed to send share link.');
    }
  };

  // Clear all files
  const handleClearAll = () => {
    setFiles([]);
  };

  // Open file selection dialog
  const handleFileSelect = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Handle file change from input element
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;
    if (selectedFiles) {
      setFiles(Array.from(selectedFiles));
    }
  };

  return (
    <div>
      <Typography variant="h4">Upload Files to WeShare</Typography>
      {/* Dropzone area */}
      <Paper {...getRootProps()} style={{ padding: '20px' }}>
        <input {...getInputProps()} />
        {isDragActive ? (
          <Typography>Drop the files here...</Typography>
        ) : (
          <Typography>
            Drag 'n' drop some files here, or click to select files
          </Typography>
        )}
        {/* Choose Files button */}
        <Button
          variant="contained"
          color="primary"
          onClick={handleFileSelect}
          disabled={uploading}
        >
          Choose Files
        </Button>
        <input
          type="file"
          multiple
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
        {/* File list with remove buttons */}
        {files.length > 0 && (
          <List>
            {files.map((file, index) => (
              <ListItem key={index}>
                <ListItemText primary={file.name} />
                <Button
                  onClick={() => removeFile(index)}
                  disabled={uploading}
                >
                  Remove
                </Button>
                {isImage(file) && (
                  <img
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                    style={{ maxWidth: '100px', maxHeight: '100px' }}
                  />
                )}
              </ListItem>
            ))}
          </List>
        )}
        {/* Clear All button */}
        <Button
          variant="contained"
          color="secondary"
          onClick={handleClearAll}
          disabled={uploading}
        >
          Clear All
        </Button>
        {/* Upload button */}
        <Button
          variant="contained"
          color="primary"
          onClick={handleUpload}
          disabled={uploading || files.length === 0}
        >
          Upload
        </Button>
        {/* Progress bar */}
        {uploading && <LinearProgress variant="determinate" value={progress} />}
        {/* Share link */}
        {shareLink && (
          <Typography>
            Share Link:{' '}
            <a href={shareLink} target="_blank" rel="noopener noreferrer">
              {shareLink}
            </a>
          </Typography>
        )}
        {/* Email input field */}
        <TextField
          label="Recipient Email"
          value={recipientEmail}
          onChange={(e) => setRecipientEmail(e.target.value)}
          fullWidth
          margin="normal"
        />
        {/* Send email button */}
        <Button
          variant="contained"
          color="primary"
          onClick={sendShareLinkViaEmail}
          disabled={!recipientEmail || !shareLink}
        >
          Send Share Link via Email
        </Button>
      </Paper>
    </div>
  );
};

export default UploadPage;