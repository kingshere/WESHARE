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

interface UploadResponse {
  id: string;
  link: string;
}

const UploadPage: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [shareLink, setShareLink] = useState('');
  const [recipientEmail, setRecipientEmail] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const removeFile = (index: number) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const isImage = (file: File) => /\.(jpg|jpeg|png|gif|bmp|svg)$/i.test(file.name);

  const handleUpload = async () => {
    if (files.length === 0) return;
    setUploading(true);
    const formData = new FormData();
    files.forEach((file) => formData.append('files', file));

    try {
      const response = await axios.post<UploadResponse>('/api/upload', formData, {
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
      setShareLink(response.data.link);
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setUploading(false);
    }
  };

  const sendShareLinkViaEmail = async () => {
    if (!recipientEmail || !shareLink) return;

    try {
      await axios.post('/api/send-email', {
        email: recipientEmail,
        link: shareLink,
      });
      alert('Share link sent successfully!');
    } catch (error) {
      console.error('Failed to send email:', error);
      alert('Failed to send share link.');
    }
  };

  const handleClearAll = () => {
    setFiles([]);
  };

  const handleFileSelect = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;
    if (selectedFiles) {
      setFiles(Array.from(selectedFiles));
    }
  };

  return (
    <div>
      <Typography variant="h4">Upload Files to WeShare</Typography>
      {/* Drag and drop area */}
      <Paper {...getRootProps()} style={{ padding: '20px', width: '200px', height: '100px' }}>
        <input {...getInputProps()} />
        {isDragActive ? (
          <Typography>Drop the files here...</Typography>
        ) : (
          <Typography>
            Drag 'n' drop some files here, or click to select files
          </Typography>
        )}
      </Paper>

      {/* Buttons Section */}
      <div style={{ marginTop: '20px' }}>
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
        {/* Clear All button */}
        <Button
          variant="contained"
          color="secondary"
          onClick={handleClearAll}
          disabled={uploading}
          style={{ marginLeft: '10px' }}
        >
          Clear All
        </Button>
        {/* Upload button */}
        <Button
          variant="contained"
          color="primary"
          onClick={handleUpload}
          disabled={uploading || files.length === 0}
          style={{ marginLeft: '10px' }}
        >
          Upload
        </Button>
      </div>

      {/* File list with remove buttons */}
      {files.length > 0 && (
        <List style={{ marginTop: '20px' }}>
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

      {/* Progress bar */}
      {uploading && <LinearProgress variant="determinate" value={progress} />}

      {/* Share link */}
      {shareLink && (
        <Typography style={{ marginTop: '20px' }}>
          Share Link:{' '}
          <a href={shareLink} target="_blank" rel="noopener noreferrer">
            {shareLink}
          </a>
        </Typography>
      )}

      {/* Bottom Section */}
      <div style={{ marginTop: '50px' }}>
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
          style={{ marginTop: '10px' }}
        >
          Send Share Link via Email
        </Button>
      </div>
    </div>
  );
};

export default UploadPage;