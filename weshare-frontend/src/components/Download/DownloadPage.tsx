import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  Button,
} from '@mui/material';
import axios from 'axios';
import { FileItem, FileListResponse } from '../../types';

const DownloadPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await axios.get<FileListResponse>(`/files/${id}`);
        setFiles(response.data.files);
      } catch (error) {
        console.error('Failed to fetch files:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchFiles();
  }, [id]);

  const handleDownload = (fileUrl: string) => {
    window.open(fileUrl, '_blank');
  };

  return (
    <Paper elevation={3} style={{ padding: '20px', maxWidth: '600px', margin: '20px auto' }}>
      <Typography variant="h5" gutterBottom>
        Download Files
      </Typography>
      {loading ? (
        <Typography>Loading...</Typography>
      ) : files.length === 0 ? (
        <Typography>No files found.</Typography>
      ) : (
        <List>
          {files.map((file) => (
            <ListItem key={file.id}>
              <ListItemText primary={file.name} />
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleDownload(file.url)}
              >
                Download
              </Button>
            </ListItem>
          ))}
        </List>
      )}
    </Paper>
  );
};

export default DownloadPage;